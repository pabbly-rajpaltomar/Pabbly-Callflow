const emailService = require('../services/emailService');
const { Contact, Lead, User } = require('../models');

// Send email to a contact or lead
exports.sendEmail = async (req, res) => {
  try {
    const { to, toName, subject, message, contactId, leadId } = req.body;

    // Validation
    if (!to || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Email address, subject, and message are required.'
      });
    }

    // Get sender name from authenticated user
    const senderName = req.user.full_name;

    // Send the email
    const result = await emailService.sendEmailToContact({
      to,
      toName,
      subject,
      message,
      senderName
    });

    // Log the email activity if contactId or leadId is provided
    if (contactId) {
      // Could log to activity table here
      console.log(`Email sent to contact ${contactId} by user ${req.user.id}`);
    }

    if (leadId) {
      // Could log to LeadActivity table here
      console.log(`Email sent to lead ${leadId} by user ${req.user.id}`);
    }

    res.json({
      success: true,
      message: 'Email sent successfully',
      data: {
        messageId: result.messageId,
        to,
        subject
      }
    });
  } catch (error) {
    console.error('Send email error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to send email'
    });
  }
};

// Send email to a contact by ID
exports.sendEmailToContact = async (req, res) => {
  try {
    const { id } = req.params;
    const { subject, message } = req.body;

    if (!subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Subject and message are required.'
      });
    }

    // Find the contact
    const contact = await Contact.findByPk(id);
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found.'
      });
    }

    if (!contact.email) {
      return res.status(400).json({
        success: false,
        message: 'Contact does not have an email address.'
      });
    }

    // Send the email
    const result = await emailService.sendEmailToContact({
      to: contact.email,
      toName: contact.name || contact.full_name,
      subject,
      message,
      senderName: req.user.full_name
    });

    res.json({
      success: true,
      message: 'Email sent successfully to contact',
      data: {
        messageId: result.messageId,
        contactId: id,
        contactEmail: contact.email
      }
    });
  } catch (error) {
    console.error('Send email to contact error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to send email'
    });
  }
};

// Send email to a lead by ID
exports.sendEmailToLead = async (req, res) => {
  try {
    const { id } = req.params;
    const { subject, message } = req.body;

    if (!subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Subject and message are required.'
      });
    }

    // Find the lead
    const lead = await Lead.findByPk(id);
    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found.'
      });
    }

    if (!lead.email) {
      return res.status(400).json({
        success: false,
        message: 'Lead does not have an email address.'
      });
    }

    // Send the email
    const result = await emailService.sendEmailToContact({
      to: lead.email,
      toName: lead.name,
      subject,
      message,
      senderName: req.user.full_name
    });

    res.json({
      success: true,
      message: 'Email sent successfully to lead',
      data: {
        messageId: result.messageId,
        leadId: id,
        leadEmail: lead.email
      }
    });
  } catch (error) {
    console.error('Send email to lead error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to send email'
    });
  }
};

// Verify email configuration
exports.verifyConfig = async (req, res) => {
  try {
    const result = await emailService.verifyEmailConfig();
    res.json({
      success: result.success,
      message: result.message
    });
  } catch (error) {
    console.error('Verify email config error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to verify email configuration'
    });
  }
};

// Send test email
exports.sendTestEmail = async (req, res) => {
  try {
    const { to } = req.body;

    if (!to) {
      return res.status(400).json({
        success: false,
        message: 'Recipient email address is required.'
      });
    }

    const result = await emailService.sendEmail({
      to,
      subject: 'Test Email from Pabbly Callflow',
      text: 'This is a test email to verify your email configuration is working correctly.',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2196f3;">Test Email</h2>
          <p>This is a test email to verify your email configuration is working correctly.</p>
          <p style="color: #16a34a; font-weight: bold;">If you received this email, your SMTP configuration is working!</p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
          <p style="color: #9ca3af; font-size: 12px;">Sent from Pabbly Callflow</p>
        </div>
      `
    });

    res.json({
      success: true,
      message: 'Test email sent successfully',
      data: {
        messageId: result.messageId,
        to
      }
    });
  } catch (error) {
    console.error('Send test email error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to send test email'
    });
  }
};
