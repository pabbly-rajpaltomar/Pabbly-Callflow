const express = require('express');
const router = express.Router();
const emailController = require('../controllers/emailController');
const auth = require('../middleware/auth');

// All routes require authentication
router.use(auth);

// Send email (generic)
router.post('/send', emailController.sendEmail);

// Send email to a specific contact
router.post('/contact/:id', emailController.sendEmailToContact);

// Send email to a specific lead
router.post('/lead/:id', emailController.sendEmailToLead);

// Verify email configuration (admin only)
router.get('/verify', emailController.verifyConfig);

// Send test email (admin only)
router.post('/test', emailController.sendTestEmail);

module.exports = router;
