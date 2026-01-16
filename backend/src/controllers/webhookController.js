const { Lead, WebhookLog, EmailLog, Contact } = require('../models');
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

// Receive email reply from Pabbly Connect (PUBLIC endpoint)
exports.receiveEmailReply = async (req, res) => {
  try {
    const {
      from_email,      // Sender's email (customer who replied)
      to_email,        // Recipient email (your team's email)
      subject,         // Email subject
      body,            // Email body/content
      html_body,       // HTML body if available
      date,            // Email date
      message_id,      // Unique message ID
      in_reply_to,     // Original email's message ID
      thread_id        // Gmail thread ID if available
    } = req.body;

    console.log('Received email reply webhook:', { from_email, subject });

    if (!from_email) {
      return res.status(200).json({
        success: false,
        message: 'from_email is required'
      });
    }

    // Find lead by email
    let lead = await Lead.findOne({
      where: { email: { [Op.iLike]: from_email } }
    });

    // If no lead, try to find contact
    let contact = null;
    if (!lead) {
      contact = await Contact.findOne({
        where: { email: { [Op.iLike]: from_email } }
      });

      if (contact) {
        // Find lead associated with this contact
        lead = await Lead.findOne({ where: { contact_id: contact.id } });
      }
    }

    // Parse date safely - Gmail can send various date formats
    let parsedDate = new Date();
    if (date) {
      try {
        const tempDate = new Date(date);
        if (!isNaN(tempDate.getTime())) {
          parsedDate = tempDate;
        }
      } catch (e) {
        console.log('Could not parse date:', date);
      }
    }

    // Create email log entry for the reply
    const emailLog = await EmailLog.create({
      user_id: lead?.assigned_to || 1, // Use assigned user or default to 1
      lead_id: lead?.id || null,
      contact_id: contact?.id || null,
      recipient_email: to_email || 'team@pabbly.com',
      recipient_name: 'Team',
      subject: subject || '(No Subject)',
      body_preview: (body || html_body || '').substring(0, 500),
      email_status: 'sent', // Using 'sent' as received equivalent
      sent_at: parsedDate,
      metadata: {
        direction: 'inbound',
        from_email: from_email,
        message_id: message_id,
        thread_id: thread_id,
        in_reply_to: in_reply_to,
        full_body: body || html_body,
        received_via: 'pabbly_connect'
      }
    });

    // Update lead's last activity if found
    if (lead) {
      await lead.update({
        last_activity: new Date(),
        notes: lead.notes
          ? `${lead.notes}\n\n[Email Reply ${new Date().toLocaleString()}]\nFrom: ${from_email}\nSubject: ${subject}\n${(body || '').substring(0, 200)}...`
          : `[Email Reply ${new Date().toLocaleString()}]\nFrom: ${from_email}\nSubject: ${subject}\n${(body || '').substring(0, 200)}...`
      });
    }

    console.log('Email reply saved:', emailLog.id, 'Lead:', lead?.id);

    res.status(200).json({
      success: true,
      message: 'Email reply received and saved',
      data: {
        email_log_id: emailLog.id,
        lead_id: lead?.id,
        contact_id: contact?.id
      }
    });

  } catch (error) {
    console.error('Webhook email reply error:', error);
    res.status(200).json({
      success: false,
      message: 'Error processing email reply',
      error: error.message
    });
  }
};

// Verify webhook endpoint (for testing)
exports.verifyWebhook = async (req, res) => {
  res.json({
    success: true,
    message: 'Webhook endpoint is active',
    timestamp: new Date().toISOString()
  });
};
