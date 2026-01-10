const express = require('express');
const router = express.Router();
const leadController = require('../controllers/leadController');
const authMiddleware = require('../middleware/auth');

// All routes require authentication
router.use(authMiddleware);

router.post('/', leadController.createLead);
router.post('/bulk', leadController.bulkCreateLeads);
router.get('/', leadController.getLeads);
router.get('/kanban', leadController.getLeadsByStage);
router.get('/webhook-url', leadController.getWebhookUrl);
router.get('/:id', leadController.getLeadById);
router.get('/:id/activities', leadController.getLeadActivities);
router.put('/:id', leadController.updateLead);
router.patch('/:id/stage', leadController.updateLeadStage);
router.post('/:id/activity', leadController.logLeadActivity);
router.delete('/:id', leadController.deleteLead);
router.post('/:id/convert', leadController.convertToContact);

module.exports = router;
