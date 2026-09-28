const mongoose = require('mongoose');
const Task = require('../models/Task');
const Team = require('../models/Team');
const demoStore = require('../services/demoStore');

// Helper to find user's active team ID in MongoDB mode
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

    if (process.env.DEMO_MODE === 'true') {
      const tasks = demoStore.getTasks(req.user._id, { status, priority, search });
      return res.status(200).json(tasks);
    }

    // MongoDB Mode
    const teamId = await getUserTeamId(req.user._id);

    let baseQuery = {};
    if (teamId) {
      baseQuery = { teamId };
    } else {
      baseQuery = {
        $or: [
          { userId: req.user._id },
          { assignedTo: req.user._id }
        ]
      };
    }

    const conditions = [baseQuery];

    if (status && status !== 'All') {
      if (status === 'Pending' || status === 'To Do') {
        conditions.push({ status: { $in: ['To Do', 'Pending'] } });
      } else {
        conditions.push({ status });
      }
    }

    if (priority && priority !== 'All') {
      conditions.push({ priority });
    }

    if (search && search.trim()) {
      const searchRegex = { $regex: search.trim(), $options: 'i' };
      conditions.push({
        $or: [{ title: searchRegex }, { description: searchRegex }]
      });
    }

    const finalQuery = conditions.length === 1 ? conditions[0] : { $and: conditions };

    const tasks = await Task.find(finalQuery)
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
    const { title, description, status, priority, assignedTo, dueDate } = req.body;

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

    if (process.env.DEMO_MODE === 'true') {
      const createdTask = demoStore.createTask(req.user._id, {
        title,
        description,
        status,
        priority,
        assignedTo,
        dueDate
      });
      return res.status(201).json(createdTask);
    }

    // MongoDB Mode
    const teamId = await getUserTeamId(req.user._id);
    const finalStatus = (status === 'Pending' || !status) ? 'To Do' : status;

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
      priority: priority || 'Medium',
      dueDate: dueDate ? new Date(dueDate) : null
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
    const { title, description, status, priority, assignedTo, dueDate } = req.body;

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

    if (process.env.DEMO_MODE === 'true') {
      const updatedTask = demoStore.updateTask(req.params.id, {
        title,
        description,
        status,
        priority,
        assignedTo,
        dueDate
      });
      return res.status(200).json(updatedTask);
    }

    // MongoDB Mode
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (title !== undefined) task.title = title.trim();
    if (description !== undefined) task.description = description.trim();
    if (status) task.status = status === 'Pending' ? 'To Do' : status;
    if (priority) task.priority = priority;
    if (assignedTo && mongoose.Types.ObjectId.isValid(assignedTo)) {
      task.assignedTo = assignedTo;
    }
    if (dueDate !== undefined) {
      task.dueDate = dueDate ? new Date(dueDate) : null;
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
    if (process.env.DEMO_MODE === 'true') {
      const result = demoStore.deleteTask(req.params.id);
      return res.status(200).json({ message: 'Task removed successfully', id: result.id });
    }

    // MongoDB Mode
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
    if (process.env.DEMO_MODE === 'true') {
      const stats = demoStore.getTaskStats(req.user._id);
      return res.status(200).json(stats);
    }

    // MongoDB Mode
    const team = await Team.findOne({
      $or: [{ creatorId: req.user._id }, { members: req.user._id }]
    }).populate('members', 'name email');

    let baseQuery = {};
    if (team) {
      baseQuery = { teamId: team._id };
    } else {
      baseQuery = { $or: [{ userId: req.user._id }, { assignedTo: req.user._id }] };
    }

    const totalTasks = await Task.countDocuments(baseQuery);
    const completedTasks = await Task.countDocuments({
      $and: [baseQuery, { status: 'Completed' }]
    });
    const pendingTasks = await Task.countDocuments({
      $and: [baseQuery, { status: { $in: ['To Do', 'Pending'] } }]
    });
    const inProgressTasks = await Task.countDocuments({
      $and: [baseQuery, { status: 'In Progress' }]
    });

    res.status(200).json({
      teamName: team ? team.name : 'Personal Workspace',
      teamDescription: team ? team.description : '',
      memberCount: team && team.members ? team.members.filter(Boolean).length : 1,
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

// @desc    Get single task by ID
// @route   GET /api/tasks/:id
// @access  Private
const getTaskById = async (req, res) => {
  try {
    if (process.env.DEMO_MODE === 'true') {
      const tasks = demoStore.getTasks(req.user._id, {});
      const task = tasks.find((t) => String(t._id) === String(req.params.id));
      if (!task) return res.status(404).json({ message: 'Task not found' });
      return res.status(200).json(task);
    }

    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('userId', 'name email');
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve task', error: error.message });
  }
};

// @desc    Update task status via PATCH
// @route   PATCH /api/tasks/:id/status
// @access  Private
const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ message: 'Status is required' });

    if (process.env.DEMO_MODE === 'true') {
      const updated = demoStore.updateTask(req.params.id, { status });
      return res.status(200).json(updated);
    }

    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    task.status = status === 'Pending' ? 'To Do' : status;
    await task.save();

    const updatedTask = await Task.findById(task._id)
      .populate('assignedTo', 'name email')
      .populate('userId', 'name email');
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update task status', error: error.message });
  }
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
  getTaskStats
};
