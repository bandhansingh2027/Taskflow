const express = require('express');
const router = express.Router();
const { getDashboardStats, getDashboardRecent } = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/stats', getDashboardStats);
router.get('/recent', getDashboardRecent);

module.exports = router;
