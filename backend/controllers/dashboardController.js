const { getTaskStats } = require('./taskController');
const demoStore = require('../services/demoStore');
const Task = require('../models/Task');
const Team = require('../models/Team');

// @desc    Get dashboard statistics (alias for /api/tasks/stats)
// @route   GET /api/dashboard/stats
// @access  Private
const getDashboardStats = getTaskStats;

// @desc    Get recent dashboard tasks
// @route   GET /api/dashboard/recent
// @access  Private
const getDashboardRecent = async (req, res) => {
  try {
    if (process.env.DEMO_MODE === 'true') {
      const allTasks = demoStore.getTasks(req.user._id, {});
      const recentTasks = allTasks.slice(0, 5);
      return res.status(200).json(recentTasks);
    }

    // MongoDB Mode
    const team = await Team.findOne({
      $or: [{ creatorId: req.user._id }, { members: req.user._id }]
    });

    let query = {};
    if (team) {
      query.teamId = team._id;
    } else {
      query.$or = [{ userId: req.user._id }, { assignedTo: req.user._id }];
    }

    const recentTasks = await Task.find(query)
      .populate('assignedTo', 'name email')
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json(recentTasks);
  } catch (error) {
    console.error('Get recent error:', error.message);
    res.status(500).json({ message: 'Failed to retrieve recent tasks', error: error.message });
  }
};

module.exports = {
  getDashboardStats,
  getDashboardRecent
};
