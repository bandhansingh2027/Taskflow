const express = require('express');
const router = express.Router();
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

// All task routes are protected by JWT auth middleware
router.use(protect);

// GET /api/tasks/stats
router.get('/stats', getTaskStats);

// GET /api/tasks & POST /api/tasks
router.route('/')
  .get(getTasks)
  .post(createTask);

// PUT /api/tasks/:id & DELETE /api/tasks/:id
router.route('/:id')
  .put(updateTask)
  .delete(deleteTask);

module.exports = router;
