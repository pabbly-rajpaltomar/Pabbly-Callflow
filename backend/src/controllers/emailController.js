const emailService = require('../services/emailService');
const { Contact, Lead, User, EmailLog } = require('../models');
const { Op } = require('sequelize');

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

    // Log the email to database
    await EmailLog.create({
      user_id: req.user.id,
      contact_id: contactId || null,
      lead_id: leadId || null,
      recipient_email: to,
      recipient_name: toName || null,
      subject: subject,
      body_preview: message.substring(0, 500),
      email_status: 'sent',
      sent_at: new Date(),
      metadata: {
        messageId: result.messageId,
        senderName: senderName
      }
    });

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

    // Log the email to database
    await EmailLog.create({
      user_id: req.user.id,
      contact_id: id,
      lead_id: null,
      recipient_email: contact.email,
      recipient_name: contact.name || contact.full_name,
      subject: subject,
      body_preview: message.substring(0, 500),
      email_status: 'sent',
      sent_at: new Date(),
      metadata: {
        messageId: result.messageId,
        senderName: req.user.full_name
      }
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

    // Log the email to database
    await EmailLog.create({
      user_id: req.user.id,
      contact_id: null,
      lead_id: id,
      recipient_email: lead.email,
      recipient_name: lead.name,
      subject: subject,
      body_preview: message.substring(0, 500),
      email_status: 'sent',
      sent_at: new Date(),
      metadata: {
        messageId: result.messageId,
        senderName: req.user.full_name
      }
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

// Get all email logs (admin/manager only)
exports.getEmailLogs = async (req, res) => {
  try {
    const { page = 1, limit = 20, userId, startDate, endDate } = req.query;
    const offset = (page - 1) * limit;

    // Build where clause
    const where = {};

    // If not admin/manager, only show own emails
    if (req.user.role === 'sales_rep') {
      where.user_id = req.user.id;
    } else if (userId) {
      where.user_id = userId;
    }

    // Date filtering
    if (startDate || endDate) {
      where.sent_at = {};
      if (startDate) where.sent_at[Op.gte] = new Date(startDate);
      if (endDate) where.sent_at[Op.lte] = new Date(endDate);
    }

    const { count, rows: emails } = await EmailLog.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'full_name', 'email', 'avatar_url']
        },
        {
          model: Contact,
          as: 'contact',
          attributes: ['id', 'name', 'email'],
          required: false
        },
        {
          model: Lead,
          as: 'lead',
          attributes: ['id', 'name', 'email'],
          required: false
        }
      ],
      order: [['sent_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: {
        emails,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get email logs error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch email logs'
    });
  }
};

// Get email stats for a user
exports.getUserEmailStats = async (req, res) => {
  try {
    const { userId } = req.params;

    // Authorization check
    if (req.user.role === 'sales_rep' && req.user.id !== parseInt(userId)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const totalEmails = await EmailLog.count({
      where: { user_id: userId }
    });

    const emailsThisWeek = await EmailLog.count({
      where: {
        user_id: userId,
        sent_at: {
          [Op.gte]: new Date(new Date() - 7 * 24 * 60 * 60 * 1000)
        }
      }
    });

    const emailsThisMonth = await EmailLog.count({
      where: {
        user_id: userId,
        sent_at: {
          [Op.gte]: new Date(new Date().setDate(1))
        }
      }
    });

    res.json({
      success: true,
      data: {
        totalEmails,
        emailsThisWeek,
        emailsThisMonth
      }
    });
  } catch (error) {
    console.error('Get user email stats error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch email stats'
    });
  }
};
