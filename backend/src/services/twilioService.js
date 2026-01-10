const twilio = require('twilio');

class TwilioService {
  constructor() {
    this.accountSid = process.env.TWILIO_ACCOUNT_SID;
    this.authToken = process.env.TWILIO_AUTH_TOKEN;
    this.twilioNumber = process.env.TWILIO_PHONE_NUMBER;

    if (this.accountSid && this.authToken) {
      this.client = twilio(this.accountSid, this.authToken);
    }
  }

  /**
   * Initiate an outbound call
   * @param {string} to - Phone number to call (E.164 format)
   * @param {string} from - Twilio phone number
   * @param {string} callbackUrl - URL for call status updates
   * @param {boolean} record - Whether to record the call
   * @returns {Promise} Call object
   */
  async makeCall(to, from = null, callbackUrl = null, record = true) {
    try {
      if (!this.client) {
        throw new Error('Twilio client not initialized. Check your credentials.');
      }

      const callParams = {
        to: to,
        from: from || this.twilioNumber,
        url: `http://demo.twilio.com/docs/voice.xml`, // Default TwiML
        statusCallback: callbackUrl,
        statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'],
        record: record,
        recordingStatusCallback: callbackUrl ? `${callbackUrl}/recording` : undefined
      };

      const call = await this.client.calls.create(callParams);

      return {
        success: true,
        callSid: call.sid,
        status: call.status,
        to: call.to,
        from: call.from
      };
    } catch (error) {
      console.error('Twilio make call error:', error);
      throw new Error(`Failed to initiate call: ${error.message}`);
    }
  }

  /**
   * Get call details
   * @param {string} callSid - Twilio Call SID
   * @returns {Promise} Call details
   */
  async getCallDetails(callSid) {
    try {
      if (!this.client) {
        throw new Error('Twilio client not initialized.');
      }

      const call = await this.client.calls(callSid).fetch();

      return {
        sid: call.sid,
        status: call.status,
        duration: call.duration,
        from: call.from,
        to: call.to,
        startTime: call.startTime,
        endTime: call.endTime,
        price: call.price
      };
    } catch (error) {
      console.error('Get call details error:', error);
      throw new Error(`Failed to fetch call details: ${error.message}`);
    }
  }

  /**
   * Get call recording URL
   * @param {string} callSid - Twilio Call SID
   * @returns {Promise} Recording URL
   */
  async getRecording(callSid) {
    try {
      if (!this.client) {
        throw new Error('Twilio client not initialized.');
      }

      const recordings = await this.client.recordings.list({ callSid: callSid, limit: 1 });

      if (recordings.length > 0) {
        const recordingSid = recordings[0].sid;
        return {
          recordingSid: recordingSid,
          recordingUrl: `https://api.twilio.com/2010-04-01/Accounts/${this.accountSid}/Recordings/${recordingSid}`,
          duration: recordings[0].duration
        };
      }

      return null;
    } catch (error) {
      console.error('Get recording error:', error);
      throw new Error(`Failed to fetch recording: ${error.message}`);
    }
  }

  /**
   * End an ongoing call
   * @param {string} callSid - Twilio Call SID
   * @returns {Promise} Result
   */
  async endCall(callSid) {
    try {
      if (!this.client) {
        throw new Error('Twilio client not initialized.');
      }

      await this.client.calls(callSid).update({ status: 'completed' });

      return {
        success: true,
        message: 'Call ended successfully'
      };
    } catch (error) {
      console.error('End call error:', error);
      throw new Error(`Failed to end call: ${error.message}`);
    }
  }
}

module.exports = new TwilioService();
