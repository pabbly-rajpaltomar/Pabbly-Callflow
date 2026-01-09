import callService from '../services/callService';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const logCall = async (phoneNumber, duration, startTime, callType = 'outgoing') => {
  try {
    const callData = {
      phone_number: phoneNumber,
      call_type: callType,
      duration: duration,
      start_time: startTime,
      end_time: new Date().toISOString(),
      outcome: duration > 0 ? 'answered' : 'no_answer',
      call_status: 'pending',
    };

    const result = await callService.createCall(callData);
    console.log('Call logged successfully:', result);
    return result;
  } catch (error) {
    console.error('Error logging call:', error);
    await saveOfflineCall(phoneNumber, duration, startTime, callType);
    return null;
  }
};

const saveOfflineCall = async (phoneNumber, duration, startTime, callType) => {
  try {
    const offlineCalls = await AsyncStorage.getItem('offlineCalls');
    const calls = offlineCalls ? JSON.parse(offlineCalls) : [];

    calls.push({
      phone_number: phoneNumber,
      call_type: callType,
      duration: duration,
      start_time: startTime,
      end_time: new Date().toISOString(),
      outcome: duration > 0 ? 'answered' : 'no_answer',
      call_status: 'pending',
    });

    await AsyncStorage.setItem('offlineCalls', JSON.stringify(calls));
    console.log('Call saved offline for later sync');
  } catch (error) {
    console.error('Error saving offline call:', error);
  }
};

export const syncOfflineCalls = async () => {
  try {
    const offlineCalls = await AsyncStorage.getItem('offlineCalls');
    if (!offlineCalls) return;

    const calls = JSON.parse(offlineCalls);
    let syncedCount = 0;

    for (const callData of calls) {
      try {
        await callService.createCall(callData);
        syncedCount++;
      } catch (error) {
        console.error('Error syncing call:', error);
      }
    }

    if (syncedCount > 0) {
      await AsyncStorage.removeItem('offlineCalls');
      console.log(`Synced ${syncedCount} offline calls`);
    }
  } catch (error) {
    console.error('Error syncing offline calls:', error);
  }
};
