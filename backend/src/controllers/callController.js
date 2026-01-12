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

    const [totalCount, outgoingCount, incomingCount, missedCount, answeredCount, callbackCount, noAnswerCount] = await Promise.all([
      Call.count({ where: baseWhere }),
      Call.count({ where: { ...baseWhere, call_type: 'outgoing' } }),
      Call.count({ where: { ...baseWhere, call_type: 'incoming' } }),
      Call.count({ where: { ...baseWhere, call_type: 'missed' } }),
      Call.count({ where: { ...baseWhere, outcome: 'answered' } }),
      Call.count({ where: { ...baseWhere, call_status: 'callback' } }),
      Call.count({ where: { ...baseWhere, outcome: 'no_answer' } })
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
          noAnswer: noAnswerCount,
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
      const baseUrl = process.env.WEBHOOK_BASE_URL || 'http://localhost:5000';
      const callbackUrl = `${baseUrl}/api/calls/webhook/${call.id}`;

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
 * End an active call
 */
exports.endCall = async (req, res) => {
  try {
    const { id } = req.params;

    const call = await Call.findByPk(id);

    if (!call) {
      return res.status(404).json({
        success: false,
        message: 'Call not found.'
      });
    }

    // Check authorization
    if (req.user.role === 'sales_rep' && call.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied.'
      });
    }

    // End call via Twilio if we have the call SID
    if (call.twilio_call_sid) {
      try {
        await twilioService.endCall(call.twilio_call_sid);
      } catch (twilioError) {
        console.log('Twilio end call error (call may have already ended):', twilioError.message);
      }
    }

    // Update call record
    await call.update({
      end_time: new Date(),
      outcome: call.outcome || 'no_answer'
    });

    res.json({
      success: true,
      message: 'Call ended successfully.'
    });
  } catch (error) {
    console.error('End call error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to end call.',
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

/**
 * TwiML endpoint to dial the actual phone number
 * This makes the call actually ring on the recipient's phone
 */
exports.getTwiml = async (req, res) => {
  try {
    const { to } = req.query;

    if (!to) {
      return res.status(400).send('Phone number required');
    }

    // Generate TwiML that dials the actual number
    const VoiceResponse = require('twilio').twiml.VoiceResponse;
    const twiml = new VoiceResponse();

    // Add a brief message before connecting (optional)
    // twiml.say({ voice: 'alice' }, 'Connecting your call...');

    // Dial the actual number - this makes the phone ring
    const dial = twiml.dial({
      callerId: process.env.TWILIO_PHONE_NUMBER,
      record: 'record-from-answer-dual',  // Record both sides
      timeout: 30,  // Ring for 30 seconds before giving up
      action: '/api/calls/dial-complete'  // Handle call completion
    });

    dial.number(to);

    res.type('text/xml');
    res.send(twiml.toString());
  } catch (error) {
    console.error('TwiML generation error:', error);
    res.status(500).send('Error generating TwiML');
  }
};

/**
 * Handle dial completion (optional, for logging)
 */
exports.dialComplete = async (req, res) => {
  try {
    console.log('Dial completed:', req.body);

    const VoiceResponse = require('twilio').twiml.VoiceResponse;
    const twiml = new VoiceResponse();

    // Call ended, just send empty TwiML
    res.type('text/xml');
    res.send(twiml.toString());
  } catch (error) {
    console.error('Dial complete error:', error);
    res.status(500).send('Error');
  }
};

/**
 * Proxy endpoint to stream recording (handles Twilio authentication)
 */
exports.getRecordingAudio = async (req, res) => {
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

    if (!call.recording_url) {
      return res.status(404).json({
        success: false,
        message: 'No recording available for this call.'
      });
    }

    // Fetch recording from Twilio with authentication
    const axios = require('axios');
    const response = await axios({
      method: 'get',
      url: call.recording_url,
      auth: {
        username: process.env.TWILIO_ACCOUNT_SID,
        password: process.env.TWILIO_AUTH_TOKEN
      },
      responseType: 'stream'
    });

    // Set appropriate headers for audio streaming
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Disposition', `inline; filename="recording-${id}.mp3"`);

    // Pipe the audio stream to response
    response.data.pipe(res);
  } catch (error) {
    console.error('Get recording audio error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recording.',
      error: error.message
    });
  }
};

/**
 * Webhook to receive recording status updates from Twilio
 */
exports.twilioRecordingWebhook = async (req, res) => {
  try {
    const { id } = req.params;
    const { RecordingUrl, RecordingSid, RecordingDuration, RecordingStatus } = req.body;

    console.log('Recording webhook received:', { id, RecordingUrl, RecordingSid, RecordingStatus });

    const call = await Call.findByPk(id);

    if (!call) {
      return res.status(404).send('Call not found');
    }

    if (RecordingStatus === 'completed' && RecordingUrl) {
      // Save recording URL with .mp3 extension for playback
      const recordingUrlMp3 = `${RecordingUrl}.mp3`;

      await call.update({
        recording_url: recordingUrlMp3
      });

      // Also save to CallRecording table
      await CallRecording.create({
        call_id: id,
        file_path: recordingUrlMp3,
        recording_sid: RecordingSid,
        duration: RecordingDuration ? parseInt(RecordingDuration) : null
      });

      console.log('Recording saved for call:', id, recordingUrlMp3);
    }

    res.status(200).send('OK');
  } catch (error) {
    console.error('Twilio recording webhook error:', error);
    res.status(500).send('Error');
  }
};
