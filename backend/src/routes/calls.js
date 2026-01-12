const express = require('express');
const router = express.Router();
const callController = require('../controllers/callController');
const authMiddleware = require('../middleware/auth');
const upload = require('../middleware/uploadMiddleware');

// Webhook endpoints (no auth required - Twilio will call this)
router.post('/webhook/:id', callController.twilioWebhook);
router.post('/webhook/:id/recording', callController.twilioRecordingWebhook);

// TwiML endpoint (no auth - Twilio fetches this to know how to handle the call)
router.get('/twiml', callController.getTwiml);
router.post('/dial-complete', callController.dialComplete);

// All other routes require authentication
router.use(authMiddleware);

router.post('/', callController.createCall);
router.post('/initiate', callController.initiateCall); // New endpoint for Twilio calls
router.get('/', callController.getCalls);
router.get('/:id', callController.getCallById);
router.put('/:id', callController.updateCall);
router.delete('/:id', callController.deleteCall);
router.post('/:id/recording', upload.single('recording'), callController.uploadRecording);
router.get('/:id/recording/play', callController.getRecordingAudio);
router.post('/:id/end', callController.endCall);

module.exports = router;
