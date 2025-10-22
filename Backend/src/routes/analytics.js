const express = require('express');
const router = express.Router();
const {
  getUrlAnalytics,
  exportAnalytics,
  getDashboardStats
} = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');

router.get('/dashboard', protect, getDashboardStats);
router.get('/:urlId', protect, getUrlAnalytics);
router.get('/:urlId/export', protect, exportAnalytics);

module.exports = router;