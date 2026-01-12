const twilio = require('twilio');
const { Call } = require('../models');

// Twilio client
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

/**
 * Sync recordings from Twilio to database
 * Runs automatically every 5 minutes
 */
const syncRecordings = async () => {
  try {
    console.log('🔄 Starting recording sync...');

    // Get all calls from last 24 hours that don't have recording
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const callsWithoutRecording = await Call.findAll({
      where: {
        recording_url: null,
        created_at: {
          [require('sequelize').Op.gte]: oneDayAgo
        },
        call_type: 'outgoing',
        outcome: 'answered' // Only fetch recordings for answered calls
      }
    });

    console.log(`📞 Found ${callsWithoutRecording.length} calls without recordings`);

    let syncedCount = 0;

    for (const call of callsWithoutRecording) {
      try {
        // Fetch call from Twilio
        const twilioCall = await client.calls(call.twilio_call_sid).fetch();

        // Fetch recordings for this call
        const recordings = await client.recordings.list({
          callSid: call.twilio_call_sid,
          limit: 1
        });

        if (recordings.length > 0) {
          const recording = recordings[0];

          // Build recording URL
          const recordingUrl = `https://api.twilio.com${recording.uri.replace('.json', '.mp3')}`;

          // Update database
          await call.update({
            recording_url: recordingUrl,
            duration: twilioCall.duration || call.duration,
            outcome: mapTwilioStatus(twilioCall.status)
          });

          syncedCount++;
          console.log(`✅ Synced recording for call ${call.id}: ${recordingUrl}`);
        }
      } catch (error) {
        console.error(`❌ Error syncing call ${call.id}:`, error.message);
      }
    }

    console.log(`✅ Recording sync complete! Synced ${syncedCount}/${callsWithoutRecording.length} recordings`);
    return { success: true, synced: syncedCount, total: callsWithoutRecording.length };

  } catch (error) {
    console.error('❌ Recording sync failed:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Map Twilio call status to our outcome field
 */
const mapTwilioStatus = (status) => {
  const statusMap = {
    'completed': 'answered',
    'busy': 'busy',
    'no-answer': 'no_answer',
    'failed': 'no_answer',
    'canceled': 'no_answer'
  };
  return statusMap[status] || 'no_answer';
};

/**
 * Start automatic sync (runs every 5 minutes)
 */
const startAutoSync = () => {
  console.log('🚀 Starting automatic recording sync service...');
  console.log('📅 Sync will run every 5 minutes');

  // Run immediately
  syncRecordings();

  // Then run every 5 minutes
  setInterval(syncRecordings, 5 * 60 * 1000);
};

/**
 * Manually sync a specific call
 */
const syncSingleCall = async (callId) => {
  try {
    const call = await Call.findByPk(callId);
    if (!call || !call.twilio_call_sid) {
      throw new Error('Call not found or missing Twilio SID');
    }

    // Fetch recordings
    const recordings = await client.recordings.list({
      callSid: call.twilio_call_sid,
      limit: 1
    });

    if (recordings.length > 0) {
      const recording = recordings[0];
      const recordingUrl = `https://api.twilio.com${recording.uri.replace('.json', '.mp3')}`;

      await call.update({
        recording_url: recordingUrl
      });

      return { success: true, recordingUrl };
    }

    return { success: false, message: 'No recording found' };
  } catch (error) {
    console.error('Error syncing single call:', error);
    throw error;
  }
};

module.exports = {
  syncRecordings,
  startAutoSync,
  syncSingleCall
};
