const { Lead, Contact, User, WebhookLog, LeadActivity } = require('../models');
const { Op } = require('sequelize');
const leadAssignmentService = require('../services/leadAssignmentService');
const config = require('../config/config');

// Create lead (manual)
exports.createLead = async (req, res) => {
  try {
    const { name, phone, email, company, notes } = req.body;

    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Name and phone are required.'
      });
    }

    // Auto-assign using round-robin
    const assignedTo = await leadAssignmentService.getNextAssignee();

    const lead = await Lead.create({
      name,
      phone,
      email,
      company,
      notes,
      source: 'manual',
      lead_status: 'new',
      assigned_to: assignedTo,
      created_by: req.user.id
    });

    const leadWithDetails = await Lead.findByPk(lead.id, {
      include: [
        { model: User, as: 'assignedUser', attributes: ['id', 'full_name', 'email'] },
        { model: User, as: 'creator', attributes: ['id', 'full_name', 'email'] }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Lead created successfully.',
      data: { lead: leadWithDetails }
    });
  } catch (error) {
    console.error('Create lead error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating lead.',
      error: error.message
    });
  }
};

// Get all leads with filtering
exports.getLeads = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, lead_status, source, assigned_to } = req.query;

    const where = {};

    // Role-based filtering
    if (req.user.role === 'sales_rep') {
      where.assigned_to = req.user.id;
    } else if (assigned_to) {
      where.assigned_to = assigned_to;
    }

    // Filters
    if (lead_status) where.lead_status = lead_status;
    if (source) where.source = source;

    // Search
    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
        { phone: { [Op.iLike]: `%${search}%` } },
        { company: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const offset = (page - 1) * limit;

    const { count, rows } = await Lead.findAndCountAll({
      where,
      include: [
        { model: User, as: 'assignedUser', attributes: ['id', 'full_name', 'email'] },
        { model: User, as: 'creator', attributes: ['id', 'full_name', 'email'] }
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    // Get stats by status (using same role-based filter)
    const baseWhere = {};
    if (req.user.role === 'sales_rep') {
      baseWhere.assigned_to = req.user.id;
    }

    const [totalCount, newCount, contactedCount, qualifiedCount, convertedCount, lostCount] = await Promise.all([
      Lead.count({ where: baseWhere }),
      Lead.count({ where: { ...baseWhere, lead_status: 'new' } }),
      Lead.count({ where: { ...baseWhere, lead_status: 'contacted' } }),
      Lead.count({ where: { ...baseWhere, lead_status: 'qualified' } }),
      Lead.count({ where: { ...baseWhere, lead_status: 'converted' } }),
      Lead.count({ where: { ...baseWhere, lead_status: 'lost' } })
    ]);

    res.json({
      success: true,
      data: {
        leads: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit)
        },
        stats: {
          total: totalCount,
          new: newCount,
          contacted: contactedCount,
          qualified: qualifiedCount,
          converted: convertedCount,
          lost: lostCount
        }
      }
    });
  } catch (error) {
    console.error('Get leads error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching leads.',
      error: error.message
    });
  }
};

// Get lead by ID
exports.getLeadById = async (req, res) => {
  try {
    const { id } = req.params;

    const lead = await Lead.findByPk(id, {
      include: [
        { model: User, as: 'assignedUser', attributes: ['id', 'full_name', 'email'] },
        { model: User, as: 'creator', attributes: ['id', 'full_name', 'email'] },
        { model: WebhookLog, as: 'webhookLogs' }
      ]
    });

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found.'
      });
    }

    // Role-based access control
    if (req.user.role === 'sales_rep' && lead.assigned_to !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied.'
      });
    }

    res.json({
      success: true,
      data: { lead }
    });
  } catch (error) {
    console.error('Get lead by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching lead.',
      error: error.message
    });
  }
};

// Update lead
exports.updateLead = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const lead = await Lead.findByPk(id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found.'
      });
    }

    // Role-based access control
    if (req.user.role === 'sales_rep' && lead.assigned_to !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied.'
      });
    }

    // Prevent updating converted leads
    if (lead.lead_status === 'converted') {
      return res.status(400).json({
        success: false,
        message: 'Cannot update converted lead.'
      });
    }

    await lead.update(updates);

    const updatedLead = await Lead.findByPk(id, {
      include: [
        { model: User, as: 'assignedUser', attributes: ['id', 'full_name', 'email'] },
        { model: User, as: 'creator', attributes: ['id', 'full_name', 'email'] }
      ]
    });

    res.json({
      success: true,
      message: 'Lead updated successfully.',
      data: { lead: updatedLead }
    });
  } catch (error) {
    console.error('Update lead error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating lead.',
      error: error.message
    });
  }
};

// Delete lead
exports.deleteLead = async (req, res) => {
  try {
    const { id } = req.params;

    // Only admin and manager can delete
    if (req.user.role === 'sales_rep') {
      return res.status(403).json({
        success: false,
        message: 'Access denied.'
      });
    }

    const lead = await Lead.findByPk(id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found.'
      });
    }

    await lead.destroy();

    res.json({
      success: true,
      message: 'Lead deleted successfully.'
    });
  } catch (error) {
    console.error('Delete lead error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting lead.',
      error: error.message
    });
  }
};

// Convert lead to contact
exports.convertToContact = async (req, res) => {
  try {
    const { id } = req.params;

    const lead = await Lead.findByPk(id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found.'
      });
    }

    if (lead.lead_status === 'converted') {
      return res.status(400).json({
        success: false,
        message: 'Lead is already converted.'
      });
    }

    // Create contact from lead data
    const contact = await Contact.create({
      name: lead.name,
      phone: lead.phone,
      email: lead.email,
      company: lead.company,
      lead_status: 'contacted',
      assigned_to: lead.assigned_to,
      notes: lead.notes,
      created_by: req.user.id
    });

    // Update lead
    await lead.update({
      lead_status: 'converted',
      converted_to_contact_id: contact.id,
      converted_at: new Date()
    });

    const updatedLead = await Lead.findByPk(id, {
      include: [
        { model: Contact, as: 'convertedContact' },
        { model: User, as: 'assignedUser', attributes: ['id', 'full_name', 'email'] }
      ]
    });

    res.json({
      success: true,
      message: 'Lead converted to contact successfully.',
      data: {
        lead: updatedLead,
        contact
      }
    });
  } catch (error) {
    console.error('Convert lead error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while converting lead.',
      error: error.message
    });
  }
};

// Get webhook URL
exports.getWebhookUrl = async (req, res) => {
  try {
    const webhookUrl = `${config.apiUrl || 'http://localhost:5000'}/api/webhooks/lead-capture`;

    res.json({
      success: true,
      data: {
        webhookUrl,
        examplePayload: {
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+1234567890',
          company: 'Acme Corp'
        }
      }
    });
  } catch (error) {
    console.error('Get webhook URL error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error.',
      error: error.message
    });
  }
};

// Bulk create leads
exports.bulkCreateLeads = async (req, res) => {
  try {
    const { leads } = req.body;

    if (!Array.isArray(leads) || leads.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Leads array is required.'
      });
    }

    const createdLeads = [];
    const errors = [];

    for (let i = 0; i < leads.length; i++) {
      const leadData = leads[i];

      if (!leadData.name || !leadData.phone) {
        errors.push({ row: i + 1, message: 'Name and phone are required' });
        continue;
      }

      try {
        // Auto-assign using round-robin
        const assignedTo = await leadAssignmentService.getNextAssignee();

        const lead = await Lead.create({
          name: leadData.name,
          phone: leadData.phone,
          email: leadData.email || null,
          company: leadData.company || null,
          source: leadData.source || 'manual',
          lead_status: leadData.lead_status || 'new',
          assigned_to: assignedTo,
          created_by: req.user.id
        });

        createdLeads.push(lead);
      } catch (error) {
        errors.push({ row: i + 1, message: error.message });
      }
    }

    res.status(201).json({
      success: true,
      message: `${createdLeads.length} leads created successfully.`,
      data: {
        created: createdLeads.length,
        errors: errors.length,
        errorDetails: errors
      }
    });
  } catch (error) {
    console.error('Bulk create leads error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating leads.',
      error: error.message
    });
  }
};

// Get leads by stage (Kanban view)
exports.getLeadsByStage = async (req, res) => {
  try {
    const { source, assigned_to } = req.query;

    const where = {};

    // Role-based filtering
    if (req.user.role === 'sales_rep') {
      where.assigned_to = req.user.id;
    } else if (assigned_to) {
      where.assigned_to = assigned_to;
    }

    if (source) where.source = source;

    const stages = ['new', 'contacted', 'qualified', 'converted', 'lost'];
    const kanbanData = {};

    for (const stage of stages) {
      const leads = await Lead.findAll({
        where: { ...where, lead_status: stage },
        include: [
          { model: User, as: 'assignedUser', attributes: ['id', 'full_name', 'email'] },
          { model: User, as: 'creator', attributes: ['id', 'full_name', 'email'] },
          {
            model: LeadActivity,
            as: 'activities',
            limit: 3,
            order: [['created_at', 'DESC']],
            include: [{ model: User, as: 'user', attributes: ['id', 'full_name'] }]
          }
        ],
        order: [['created_at', 'DESC']]
      });

      kanbanData[stage] = leads;
    }

    res.json({
      success: true,
      data: kanbanData
    });
  } catch (error) {
    console.error('Get leads by stage error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching leads.',
      error: error.message
    });
  }
};

// Update lead stage (drag & drop)
exports.updateLeadStage = async (req, res) => {
  try {
    const { id } = req.params;
    const { lead_status } = req.body;

    const lead = await Lead.findByPk(id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found.'
      });
    }

    // Role-based access control
    if (req.user.role === 'sales_rep' && lead.assigned_to !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied.'
      });
    }

    const oldStatus = lead.lead_status;

    await lead.update({ lead_status });

    // Log activity
    await LeadActivity.create({
      lead_id: id,
      user_id: req.user.id,
      activity_type: 'stage_change',
      description: `Moved from ${oldStatus} to ${lead_status}`,
      old_value: oldStatus,
      new_value: lead_status
    });

    const updatedLead = await Lead.findByPk(id, {
      include: [
        { model: User, as: 'assignedUser', attributes: ['id', 'full_name', 'email'] },
        { model: User, as: 'creator', attributes: ['id', 'full_name', 'email'] }
      ]
    });

    res.json({
      success: true,
      message: 'Lead stage updated successfully.',
      data: { lead: updatedLead }
    });
  } catch (error) {
    console.error('Update lead stage error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating lead.',
      error: error.message
    });
  }
};

// Log lead activity
exports.logLeadActivity = async (req, res) => {
  try {
    const { id } = req.params;
    const { activity_type, description, metadata, duration_seconds } = req.body;

    const lead = await Lead.findByPk(id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found.'
      });
    }

    const activity = await LeadActivity.create({
      lead_id: id,
      user_id: req.user.id,
      activity_type,
      description,
      metadata: metadata || {},
      duration_seconds: duration_seconds || null
    });

    const activityWithUser = await LeadActivity.findByPk(activity.id, {
      include: [{ model: User, as: 'user', attributes: ['id', 'full_name', 'email'] }]
    });

    res.status(201).json({
      success: true,
      message: 'Activity logged successfully.',
      data: { activity: activityWithUser }
    });
  } catch (error) {
    console.error('Log lead activity error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while logging activity.',
      error: error.message
    });
  }
};

// Get lead activities
exports.getLeadActivities = async (req, res) => {
  try {
    const { id } = req.params;
    const { limit = 50 } = req.query;

    const lead = await Lead.findByPk(id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found.'
      });
    }

    // Role-based access control
    if (req.user.role === 'sales_rep' && lead.assigned_to !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied.'
      });
    }

    const activities = await LeadActivity.findAll({
      where: { lead_id: id },
      include: [{ model: User, as: 'user', attributes: ['id', 'full_name', 'email'] }],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit)
    });

    res.json({
      success: true,
      data: { activities }
    });
  } catch (error) {
    console.error('Get lead activities error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching activities.',
      error: error.message
    });
  }
};
