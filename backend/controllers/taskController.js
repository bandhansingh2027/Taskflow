const mongoose = require('mongoose');
const Task = require('../models/Task');
const Team = require('../models/Team');

// Helper to find user's active team ID
const getUserTeamId = async (userId) => {
  if (!userId) return null;
  const team = await Team.findOne({
    $or: [{ creatorId: userId }, { members: userId }]
  });
  return team ? team._id : null;
};

// @desc    Get all tasks for user's team or user (with search, status, priority filters)
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
  try {
    const { status, priority, search } = req.query;
    const teamId = await getUserTeamId(req.user._id);

    let query = {};
    if (teamId) {
      query.teamId = teamId;
    } else {
      query.$or = [
        { userId: req.user._id },
        { assignedTo: req.user._id }
      ];
    }

    // Status filter
    if (status && status !== 'All') {
      if (status === 'Pending' || status === 'To Do') {
        query.status = { $in: ['To Do', 'Pending'] };
      } else {
        query.status = status;
      }
    }

    // Priority filter
    if (priority && priority !== 'All') {
      query.priority = priority;
    }

    // Search filter (searches title and description)
    if (search) {
      const searchRegex = { $regex: search, $options: 'i' };
      if (query.$or) {
        query = {
          $and: [
            query,
            { $or: [{ title: searchRegex }, { description: searchRegex }] }
          ]
        };
      } else {
        query.$or = [{ title: searchRegex }, { description: searchRegex }];
      }
    }

    const tasks = await Task.find(query)
      .populate('assignedTo', 'name email')
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    const normalizedTasks = tasks.map((t) => {
      const taskObj = t.toObject();
      if (taskObj.status === 'Pending') taskObj.status = 'To Do';
      return taskObj;
    });

    res.status(200).json(normalizedTasks);
  } catch (error) {
    console.error('Get tasks error:', error.message);
    res.status(500).json({ message: 'Failed to retrieve tasks', error: error.message });
  }
};

// @desc    Create a new team task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
  try {
    const { title, description, status, priority, assignedTo } = req.body;

    // Validation
    if (!title || title.trim() === '') {
      return res.status(400).json({ message: 'Task title is required' });
    }

    const validStatuses = ['To Do', 'In Progress', 'Completed', 'Pending'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid task status. Must be To Do, In Progress, or Completed' });
    }

    const validPriorities = ['Low', 'Medium', 'High'];
    if (priority && !validPriorities.includes(priority)) {
      return res.status(400).json({ message: 'Invalid task priority. Must be Low, Medium, or High' });
    }

    const teamId = await getUserTeamId(req.user._id);

    // Map 'Pending' to 'To Do'
    const finalStatus = (status === 'Pending' || !status) ? 'To Do' : status;

    // Validate assignedTo ObjectId or fallback to current user
    let targetAssignedTo = req.user._id;
    if (assignedTo && mongoose.Types.ObjectId.isValid(assignedTo)) {
      targetAssignedTo = assignedTo;
    }

    const task = await Task.create({
      userId: req.user._id,
      teamId: teamId || null,
      assignedTo: targetAssignedTo,
      title: title.trim(),
      description: description ? description.trim() : '',
      status: finalStatus,
      priority: priority || 'Medium'
    });

    const populatedTask = await Task.findById(task._id)
      .populate('assignedTo', 'name email')
      .populate('userId', 'name email');

    res.status(201).json(populatedTask);
  } catch (error) {
    console.error('Create task error:', error.message);
    res.status(500).json({ message: error.message || 'Failed to create task', error: error.message });
  }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const { title, description, status, priority, assignedTo } = req.body;

    if (title !== undefined && title.trim() === '') {
      return res.status(400).json({ message: 'Task title cannot be empty' });
    }

    const validStatuses = ['To Do', 'In Progress', 'Completed', 'Pending'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid task status' });
    }

    const validPriorities = ['Low', 'Medium', 'High'];
    if (priority && !validPriorities.includes(priority)) {
      return res.status(400).json({ message: 'Invalid task priority' });
    }

    if (title !== undefined) task.title = title.trim();
    if (description !== undefined) task.description = description.trim();
    if (status) task.status = status === 'Pending' ? 'To Do' : status;
    if (priority) task.priority = priority;
    if (assignedTo && mongoose.Types.ObjectId.isValid(assignedTo)) {
      task.assignedTo = assignedTo;
    }

    await task.save();

    const updatedTask = await Task.findById(task._id)
      .populate('assignedTo', 'name email')
      .populate('userId', 'name email');

    res.status(200).json(updatedTask);
  } catch (error) {
    console.error('Update task error:', error.message);
    res.status(500).json({ message: error.message || 'Failed to update task', error: error.message });
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await Task.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Task removed successfully', id: req.params.id });
  } catch (error) {
    console.error('Delete task error:', error.message);
    res.status(500).json({ message: 'Failed to delete task', error: error.message });
  }
};

// @desc    Get dashboard statistics & team info for logged-in user
// @route   GET /api/tasks/stats
// @access  Private
const getTaskStats = async (req, res) => {
  try {
    const team = await Team.findOne({
      $or: [{ creatorId: req.user._id }, { members: req.user._id }]
    }).populate('members', 'name email');

    let query = {};
    if (team) {
      query.teamId = team._id;
    } else {
      query.$or = [{ userId: req.user._id }, { assignedTo: req.user._id }];
    }

    const totalTasks = await Task.countDocuments(query);
    const completedTasks = await Task.countDocuments({ ...query, status: 'Completed' });
    const pendingTasks = await Task.countDocuments({
      ...query,
      status: { $in: ['To Do', 'Pending'] }
    });
    const inProgressTasks = await Task.countDocuments({ ...query, status: 'In Progress' });

    res.status(200).json({
      teamName: team ? team.name : 'Personal Workspace',
      teamDescription: team ? team.description : '',
      memberCount: team ? team.members.length : 1,
      total: totalTasks,
      completed: completedTasks,
      pending: pendingTasks,
      inProgress: inProgressTasks
    });
  } catch (error) {
    console.error('Get stats error:', error.message);
    res.status(500).json({ message: 'Failed to retrieve task statistics', error: error.message });
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats
};
