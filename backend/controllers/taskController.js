const Task = require('../models/Task');

// @desc    Get all tasks for logged in user (with search and status filter)
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
  try {
    const { status, priority, search } = req.query;

    // Filter by user ID (Strict user scoping)
    const query = { userId: req.user._id };

    // Status filter
    if (status && status !== 'All') {
      query.status = status;
    }

    // Priority filter
    if (priority && priority !== 'All') {
      query.priority = priority;
    }

    // Search filter (searches title and description)
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const tasks = await Task.find(query).sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (error) {
    console.error('Get tasks error:', error.message);
    res.status(500).json({ message: 'Failed to retrieve tasks', error: error.message });
  }
};

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
  try {
    const { title, description, status, priority } = req.body;

    // Validation
    if (!title || title.trim() === '') {
      return res.status(400).json({ message: 'Task title is required' });
    }

    const validStatuses = ['Pending', 'In Progress', 'Completed'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid task status. Must be Pending, In Progress, or Completed' });
    }

    const validPriorities = ['Low', 'Medium', 'High'];
    if (priority && !validPriorities.includes(priority)) {
      return res.status(400).json({ message: 'Invalid task priority. Must be Low, Medium, or High' });
    }

    const task = await Task.create({
      userId: req.user._id,
      title: title.trim(),
      description: description ? description.trim() : '',
      status: status || 'Pending',
      priority: priority || 'Medium'
    });

    res.status(201).json(task);
  } catch (error) {
    console.error('Create task error:', error.message);
    res.status(500).json({ message: 'Failed to create task', error: error.message });
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

    // Security check: ensure task belongs to logged-in user
    if (task.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this task' });
    }

    const { title, description, status, priority } = req.body;

    if (title !== undefined && title.trim() === '') {
      return res.status(400).json({ message: 'Task title cannot be empty' });
    }

    const validStatuses = ['Pending', 'In Progress', 'Completed'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid task status' });
    }

    const validPriorities = ['Low', 'Medium', 'High'];
    if (priority && !validPriorities.includes(priority)) {
      return res.status(400).json({ message: 'Invalid task priority' });
    }

    task.title = title !== undefined ? title.trim() : task.title;
    task.description = description !== undefined ? description.trim() : task.description;
    task.status = status || task.status;
    task.priority = priority || task.priority;

    const updatedTask = await task.save();
    res.status(200).json(updatedTask);
  } catch (error) {
    console.error('Update task error:', error.message);
    res.status(500).json({ message: 'Failed to update task', error: error.message });
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

    // Security check: ensure task belongs to logged-in user
    if (task.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this task' });
    }

    await Task.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Task removed successfully', id: req.params.id });
  } catch (error) {
    console.error('Delete task error:', error.message);
    res.status(500).json({ message: 'Failed to delete task', error: error.message });
  }
};

// @desc    Get dashboard statistics for logged-in user
// @route   GET /api/tasks/stats
// @access  Private
const getTaskStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const totalTasks = await Task.countDocuments({ userId });
    const completedTasks = await Task.countDocuments({ userId, status: 'Completed' });
    const pendingTasks = await Task.countDocuments({ userId, status: 'Pending' });
    const inProgressTasks = await Task.countDocuments({ userId, status: 'In Progress' });

    res.status(200).json({
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
