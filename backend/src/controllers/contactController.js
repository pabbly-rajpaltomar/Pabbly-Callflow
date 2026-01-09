const { Contact, User, Call } = require('../models');
const { Op } = require('sequelize');

exports.createContact = async (req, res) => {
  try {
    const { name, phone, email, company, lead_status, assigned_to, notes } = req.body;

    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Name and phone are required.'
      });
    }

    const contact = await Contact.create({
      name,
      phone,
      email,
      company,
      lead_status: lead_status || 'new',
      assigned_to,
      notes,
      created_by: req.user.id
    });

    const contactWithDetails = await Contact.findByPk(contact.id, {
      include: [
        { model: User, as: 'assignedUser', attributes: ['id', 'full_name', 'email'] },
        { model: User, as: 'creator', attributes: ['id', 'full_name', 'email'] }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Contact created successfully.',
      data: { contact: contactWithDetails }
    });
  } catch (error) {
    console.error('Create contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating contact.',
      error: error.message
    });
  }
};

exports.getContacts = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, lead_status, assigned_to } = req.query;

    const where = {};

    if (req.user.role === 'sales_rep') {
      where.assigned_to = req.user.id;
    } else if (assigned_to) {
      where.assigned_to = assigned_to;
    }

    if (lead_status) where.lead_status = lead_status;

    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { phone: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
        { company: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const offset = (page - 1) * limit;

    const { count, rows } = await Contact.findAndCountAll({
      where,
      include: [
        { model: User, as: 'assignedUser', attributes: ['id', 'full_name', 'email'] },
        { model: User, as: 'creator', attributes: ['id', 'full_name', 'email'] }
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: {
        contacts: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching contacts.',
      error: error.message
    });
  }
};

exports.getContactById = async (req, res) => {
  try {
    const { id } = req.params;

    const contact = await Contact.findByPk(id, {
      include: [
        { model: User, as: 'assignedUser', attributes: ['id', 'full_name', 'email'] },
        { model: User, as: 'creator', attributes: ['id', 'full_name', 'email'] },
        {
          model: Call,
          as: 'calls',
          include: [{ model: User, as: 'user', attributes: ['id', 'full_name'] }],
          order: [['start_time', 'DESC']],
          limit: 10
        }
      ]
    });

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found.'
      });
    }

    if (req.user.role === 'sales_rep' && contact.assigned_to !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied.'
      });
    }

    res.json({
      success: true,
      data: { contact }
    });
  } catch (error) {
    console.error('Get contact by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching contact.',
      error: error.message
    });
  }
};

exports.updateContact = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const contact = await Contact.findByPk(id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found.'
      });
    }

    if (req.user.role === 'sales_rep' && contact.assigned_to !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied.'
      });
    }

    await contact.update(updates);

    const updatedContact = await Contact.findByPk(id, {
      include: [
        { model: User, as: 'assignedUser', attributes: ['id', 'full_name', 'email'] },
        { model: User, as: 'creator', attributes: ['id', 'full_name', 'email'] }
      ]
    });

    res.json({
      success: true,
      message: 'Contact updated successfully.',
      data: { contact: updatedContact }
    });
  } catch (error) {
    console.error('Update contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating contact.',
      error: error.message
    });
  }
};

exports.deleteContact = async (req, res) => {
  try {
    const { id } = req.params;

    const contact = await Contact.findByPk(id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found.'
      });
    }

    if (req.user.role === 'sales_rep') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only admins and managers can delete contacts.'
      });
    }

    await contact.destroy();

    res.json({
      success: true,
      message: 'Contact deleted successfully.'
    });
  } catch (error) {
    console.error('Delete contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting contact.',
      error: error.message
    });
  }
};
