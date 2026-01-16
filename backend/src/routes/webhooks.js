const express = require('express');
const router = express.Router();
const webhookController = require('../controllers/webhookController');

// Public endpoint - no authentication required
router.post('/lead-capture', webhookController.captureLeadWebhook);

// Email reply webhook from Pabbly Connect
router.post('/email-reply', webhookController.receiveEmailReply);

// Verify webhook is active
router.get('/verify', webhookController.verifyWebhook);

module.exports = router;
