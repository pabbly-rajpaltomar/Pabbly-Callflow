const express = require('express');
const router = express.Router();
const webhookController = require('../controllers/webhookController');

// Public endpoint - no authentication required
router.post('/lead-capture', webhookController.captureLeadWebhook);

module.exports = router;
