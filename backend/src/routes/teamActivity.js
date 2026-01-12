const express = require('express');
const router = express.Router();
const teamActivityController = require('../controllers/teamActivityController');
const auth = require('../middleware/auth');

// All routes require authentication
router.use(auth);

// Get team stats overview (admin/manager only)
router.get('/stats', teamActivityController.getTeamStats);

// Get all team calls (admin/manager only)
router.get('/calls', teamActivityController.getTeamCalls);

// Get specific member's activity timeline
router.get('/member/:userId/activity', teamActivityController.getMemberActivity);

// Get specific member's calls
router.get('/member/:userId/calls', teamActivityController.getMemberCalls);

// Get detailed stats for a member
router.get('/member/:userId/detailed-stats', teamActivityController.getMemberDetailedStats);

module.exports = router;
