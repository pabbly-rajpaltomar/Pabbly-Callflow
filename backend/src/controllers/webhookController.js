const { Lead, WebhookLog } = require('../models');
const { Op } = require('sequelize');
const leadAssignmentService = require('../services/leadAssignmentService');

// Capture lead from webhook (PUBLIC endpoint - no auth)
exports.captureLeadWebhook = async (req, res) => {
  const logData = {
    endpoint: '/api/webhooks/lead-capture',
    method: 'POST',
    payload: req.body,
    headers: req.headers,
    source_ip: req.ip || req.connection.remoteAddress,
    status: 'failed',
    processed_at: new Date()
  };

  try {
    // Flexible field mapping - support various field names
    const name = req.body.name || req.body.full_name || req.body.contact_name;
    const email = req.body.email || req.body.email_address;
    const phone = req.body.phone || req.body.phone_number || req.body.mobile;
    const company = req.body.company || req.body.company_name || req.body.organization;

    // Validate required fields
    if (!name || !phone) {
      logData.error_message = 'Missing required fields: name and phone';
      logData.status = 'failed';
      await WebhookLog.create(logData);

      // Always return 200 to webhook provider
      return res.status(200).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Check for duplicates (same phone within 24 hours)
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const existingLead = await Lead.findOne({
      where: {
        phone: phone,
        created_at: {
          [Op.gte]: twentyFourHoursAgo
        }
      }
    });

    if (existingLead) {
      logData.error_message = 'Duplicate lead - same phone within 24 hours';
      logData.status = 'duplicate';
      logData.lead_id = existingLead.id;
      await WebhookLog.create(logData);

      console.log(`Duplicate lead detected: ${phone}`);

      // Return 200 to webhook provider
      return res.status(200).json({
        success: true,
        message: 'Lead already exists',
        lead_id: existingLead.id
      });
    }

    // Auto-assign using round-robin
    const assignedTo = await leadAssignmentService.getNextAssignee();

    // Create lead
    const lead = await Lead.create({
      name,
      phone,
      email,
      company,
      source: 'webhook',
      lead_status: 'new',
      assigned_to: assignedTo,
      webhook_metadata: req.body
    });

    // Update log with success
    logData.status = 'success';
    logData.lead_id = lead.id;
    logData.error_message = null;
    await WebhookLog.create(logData);

    console.log(`Lead created successfully from webhook: ${lead.id}`);

    // Always return 200
    res.status(200).json({
      success: true,
      message: 'Lead captured successfully',
      lead_id: lead.id
    });
  } catch (error) {
    console.error('Webhook capture error:', error);

    // Log error
    logData.error_message = error.message;
    logData.status = 'failed';

    try {
      await WebhookLog.create(logData);
    } catch (logError) {
      console.error('Failed to log webhook error:', logError);
    }

    // Still return 200 to webhook provider
    res.status(200).json({
      success: false,
      message: 'Error processing webhook'
    });
  }
};
