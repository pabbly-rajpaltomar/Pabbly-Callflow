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

    // Format phone number to E.164 format for Twilio
    let formattedPhone = phone_number.trim();

    // Remove spaces, dashes, and parentheses
    formattedPhone = formattedPhone.replace(/[\s\-\(\)]/g, '');

    // Add +91 if it's an Indian number without country code
    if (!formattedPhone.startsWith('+')) {
      if (formattedPhone.startsWith('91') && formattedPhone.length === 12) {
        formattedPhone = '+' + formattedPhone;
      } else if (formattedPhone.length === 10) {
        formattedPhone = '+91' + formattedPhone;
      } else {
        formattedPhone = '+' + formattedPhone;
      }
    }

    // Create call record in database first
    const call = await Call.create({
      contact_id,
      user_id: req.user.id,
      phone_number: formattedPhone,
      call_type: 'outgoing',
      call_status: 'pending',
      start_time: new Date()
    });

    // Initiate call via Twilio
    try {
      const callbackUrl = `${process.env.CORS_ORIGIN || 'http://localhost:5000'}/api/calls/webhook/${call.id}`;

      const twilioCall = await twilioService.makeCall(
        formattedPhone,
        null,
        callbackUrl,
        true // Enable recording
      );

      // Update call with Twilio SID - keep call_status as 'pending' (sales status)
      await call.update({
        twilio_call_sid: twilioCall.callSid
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
      // If Twilio fails, update outcome to show call failed
      await call.update({
        outcome: 'no_answer',
        end_time: new Date(),
        notes: `Twilio error: ${twilioError.message}`
      });

      throw twilioError;
    }
  } catch (error) {
    console.error('Initiate call error:', error);

    // Provide helpful error message for Twilio trial account
    let userMessage = 'Failed to initiate call.';
    if (error.message && error.message.includes('unverified')) {
      userMessage = '⚠️ Twilio Trial Account: This number is unverified. Please verify the number in Twilio Console or upgrade to a paid account to call any number.';
    } else if (error.message && error.message.includes('credentials')) {
      userMessage = 'Twilio credentials are invalid. Please check your TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN in .env file.';
    }

    res.status(500).json({
      success: false,
      message: userMessage,
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

    // Map Twilio status to our outcome field (call_status is for sales status)
    switch (CallStatus) {
      case 'ringing':
        // Call is ringing, no update needed
        break;
      case 'in-progress':
        updates.outcome = 'answered';
        break;
      case 'completed':
        updates.end_time = new Date();
        if (CallDuration) {
          updates.duration = parseInt(CallDuration);
        }
        // If no outcome set yet, mark as answered
        if (!call.outcome) {
          updates.outcome = 'answered';
        }
        break;
      case 'busy':
        updates.outcome = 'busy';
        updates.call_type = 'missed';
        updates.end_time = new Date();
        break;
      case 'no-answer':
        updates.outcome = 'no_answer';
        updates.call_type = 'missed';
        updates.end_time = new Date();
        break;
      case 'failed':
        updates.outcome = 'no_answer';
        updates.call_type = 'missed';
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
