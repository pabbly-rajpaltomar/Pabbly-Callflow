const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.get('/dashboard', analyticsController.getDashboardStats);
router.get('/calls-over-time', analyticsController.getCallsOverTime);
router.get('/team-performance', analyticsController.getTeamPerformance);

module.exports = router;
