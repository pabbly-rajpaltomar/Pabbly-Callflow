const { Call, CallRecording, Contact, User } = require('../models');
const { Op } = require('sequelize');

exports.createCall = async (req, res) => {
  try {
    const {
      contact_id,
      phone_number,
      call_type,
      duration,
      start_time,
      end_time,
      outcome,
      call_status,
      notes
    } = req.body;

    if (!phone_number || !start_time) {
      return res.status(400).json({
        success: false,
        message: 'Phone number and start time are required.'
      });
    }

    const call = await Call.create({
      contact_id,
      user_id: req.user.id,
      phone_number,
      call_type: call_type || 'outgoing',
      duration,
      start_time,
      end_time,
      outcome,
      call_status: call_status || 'pending',
      notes
    });

    const callWithDetails = await Call.findByPk(call.id, {
      include: [
        { model: Contact, as: 'contact' },
        { model: User, as: 'user', attributes: ['id', 'full_name', 'email'] },
        { model: CallRecording, as: 'recording' }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Call logged successfully.',
      data: { call: callWithDetails }
    });
  } catch (error) {
    console.error('Create call error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating call.',
      error: error.message
    });
  }
};

exports.getCalls = async (req, res) => {
  try {
    const { page = 1, limit = 20, user_id, call_type, call_status, start_date, end_date } = req.query;

    const where = {};

    if (req.user.role === 'sales_rep') {
      where.user_id = req.user.id;
    } else if (user_id) {
      where.user_id = user_id;
    }

    if (call_type) where.call_type = call_type;
    if (call_status) where.call_status = call_status;

    if (start_date || end_date) {
      where.start_time = {};
      if (start_date) where.start_time[Op.gte] = new Date(start_date);
      if (end_date) where.start_time[Op.lte] = new Date(end_date);
    }

    const offset = (page - 1) * limit;

    const { count, rows } = await Call.findAndCountAll({
      where,
      include: [
        { model: Contact, as: 'contact' },
        { model: User, as: 'user', attributes: ['id', 'full_name', 'email'] },
        { model: CallRecording, as: 'recording' }
      ],
      order: [['start_time', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: {
        calls: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get calls error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching calls.',
      error: error.message
    });
  }
};

exports.getCallById = async (req, res) => {
  try {
    const { id } = req.params;

    const call = await Call.findByPk(id, {
      include: [
        { model: Contact, as: 'contact' },
        { model: User, as: 'user', attributes: ['id', 'full_name', 'email'] },
        { model: CallRecording, as: 'recording' }
      ]
    });

    if (!call) {
      return res.status(404).json({
        success: false,
        message: 'Call not found.'
      });
    }

    if (req.user.role === 'sales_rep' && call.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied.'
      });
    }

    res.json({
      success: true,
      data: { call }
    });
  } catch (error) {
    console.error('Get call by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching call.',
      error: error.message
    });
  }
};

exports.updateCall = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const call = await Call.findByPk(id);

    if (!call) {
      return res.status(404).json({
        success: false,
        message: 'Call not found.'
      });
    }

    if (req.user.role === 'sales_rep' && call.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied.'
      });
    }

    await call.update(updates);

    const updatedCall = await Call.findByPk(id, {
      include: [
        { model: Contact, as: 'contact' },
        { model: User, as: 'user', attributes: ['id', 'full_name', 'email'] },
        { model: CallRecording, as: 'recording' }
      ]
    });

    res.json({
      success: true,
      message: 'Call updated successfully.',
      data: { call: updatedCall }
    });
  } catch (error) {
    console.error('Update call error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating call.',
      error: error.message
    });
  }
};

exports.deleteCall = async (req, res) => {
  try {
    const { id } = req.params;

    const call = await Call.findByPk(id);

    if (!call) {
      return res.status(404).json({
        success: false,
        message: 'Call not found.'
      });
    }

    if (req.user.role === 'sales_rep' && call.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied.'
      });
    }

    await call.destroy();

    res.json({
      success: true,
      message: 'Call deleted successfully.'
    });
  } catch (error) {
    console.error('Delete call error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting call.',
      error: error.message
    });
  }
};

exports.uploadRecording = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded.'
      });
    }

    const call = await Call.findByPk(id);

    if (!call) {
      return res.status(404).json({
        success: false,
        message: 'Call not found.'
      });
    }

    if (req.user.role === 'sales_rep' && call.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied.'
      });
    }

    const recording = await CallRecording.create({
      call_id: id,
      file_path: req.file.path,
      file_size: req.file.size,
      duration: req.body.duration || null
    });

    await call.update({ recording_id: recording.id });

    res.json({
      success: true,
      message: 'Recording uploaded successfully.',
      data: { recording }
    });
  } catch (error) {
    console.error('Upload recording error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while uploading recording.',
      error: error.message
    });
  }
};
