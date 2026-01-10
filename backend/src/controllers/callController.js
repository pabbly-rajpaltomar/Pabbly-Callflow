const { Call, CallRecording, Contact, User } = require('../models');
const { Op } = require('sequelize');
const twilioService = require('../services/twilioService');

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

    // Get stats by call type (using same role-based filter)
    const baseWhere = {};
    if (req.user.role === 'sales_rep') {
      baseWhere.user_id = req.user.id;
    }

    const [totalCount, outgoingCount, incomingCount, missedCount, answeredCount, callbackCount] = await Promise.all([
      Call.count({ where: baseWhere }),
      Call.count({ where: { ...baseWhere, call_type: 'outgoing' } }),
      Call.count({ where: { ...baseWhere, call_type: 'incoming' } }),
      Call.count({ where: { ...baseWhere, call_type: 'missed' } }),
      Call.count({ where: { ...baseWhere, outcome: 'answered' } }),
      Call.count({ where: { ...baseWhere, call_status: 'callback' } })
    ]);

    // Get total duration
    const totalDuration = await Call.sum('duration', { where: baseWhere }) || 0;

    res.json({
      success: true,
      data: {
        calls: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit)
        },
        stats: {
          total: totalCount,
          outgoing: outgoingCount,
          incoming: incomingCount,
          missed: missedCount,
          answered: answeredCount,
          callback: callbackCount,
          totalDuration: totalDuration
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

/**
 * Initiate a call via Twilio
 */
exports.initiateCall = async (req, res) => {
  try {
    const { contact_id, phone_number } = req.body;

    if (!phone_number) {
      return res.status(400).json({
        success: false,
        message: 'Phone number is required.'
      });
    }

    // Create call record in database first
    const call = await Call.create({
      contact_id,
      user_id: req.user.id,
      phone_number,
      call_type: 'outgoing',
      call_status: 'initiated',
      start_time: new Date()
    });

    // Initiate call via Twilio
    try {
      const callbackUrl = `${process.env.CORS_ORIGIN || 'http://localhost:3000'}/api/calls/webhook/${call.id}`;

      const twilioCall = await twilioService.makeCall(
        phone_number,
        null,
        callbackUrl,
        true // Enable recording
      );

      // Update call with Twilio SID
      await call.update({
        twilio_call_sid: twilioCall.callSid,
        call_status: 'ringing'
      });

      const callWithDetails = await Call.findByPk(call.id, {
        include: [
          { model: Contact, as: 'contact' },
          { model: User, as: 'user', attributes: ['id', 'full_name', 'email'] }
        ]
      });

      res.status(201).json({
        success: true,
        message: 'Call initiated successfully.',
        data: {
          call: callWithDetails,
          twilioCallSid: twilioCall.callSid
        }
      });
    } catch (twilioError) {
      // If Twilio fails, update call status to failed
      await call.update({
        call_status: 'failed',
        end_time: new Date()
      });

      throw twilioError;
    }
  } catch (error) {
    console.error('Initiate call error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to initiate call.',
      error: error.message
    });
  }
};

/**
 * Webhook to receive call status updates from Twilio
 */
exports.twilioWebhook = async (req, res) => {
  try {
    const { id } = req.params;
    const { CallStatus, CallDuration, RecordingUrl, RecordingSid } = req.body;

    const call = await Call.findByPk(id);

    if (!call) {
      return res.status(404).send('Call not found');
    }

    const updates = {};

    // Map Twilio status to our status
    switch (CallStatus) {
      case 'ringing':
        updates.call_status = 'ringing';
        break;
      case 'in-progress':
        updates.call_status = 'in_progress';
        updates.outcome = 'answered';
        break;
      case 'completed':
        updates.call_status = 'completed';
        updates.end_time = new Date();
        if (CallDuration) {
          updates.duration = parseInt(CallDuration);
        }
        break;
      case 'busy':
      case 'no-answer':
        updates.call_status = 'completed';
        updates.outcome = 'no_answer';
        updates.end_time = new Date();
        break;
      case 'failed':
        updates.call_status = 'failed';
        updates.end_time = new Date();
        break;
    }

    await call.update(updates);

    // If recording is available, save it
    if (RecordingUrl && RecordingSid) {
      await CallRecording.create({
        call_id: id,
        file_path: RecordingUrl,
        recording_sid: RecordingSid,
        duration: CallDuration ? parseInt(CallDuration) : null
      });
    }

    res.status(200).send('OK');
  } catch (error) {
    console.error('Twilio webhook error:', error);
    res.status(500).send('Error');
  }
};
