const express = require('express');
const router = express.Router();
const {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  updateTaskStatus,
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

// PATCH /api/tasks/:id/status
router.patch('/:id/status', updateTaskStatus);

// GET /api/tasks/:id, PUT /api/tasks/:id & DELETE /api/tasks/:id
router.route('/:id')
  .get(getTaskById)
  .put(updateTask)
  .delete(deleteTask);

module.exports = router;
