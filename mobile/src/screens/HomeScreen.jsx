import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Linking,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CallDetectorManager from 'react-native-call-detection';
import { logCall, syncOfflineCalls } from '../utils/callLogger';

const HomeScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [callDetector, setCallDetector] = useState(null);
  const [callStartTime, setCallStartTime] = useState(null);

  useEffect(() => {
    requestPermissions();
    setupCallDetection();
    syncOfflineCalls();

    return () => {
      if (callDetector) {
        callDetector.dispose();
      }
    };
  }, []);

  const requestPermissions = async () => {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
        PermissionsAndroid.PERMISSIONS.CALL_PHONE,
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      ]);

      if (
        granted['android.permission.READ_PHONE_STATE'] !== PermissionsAndroid.RESULTS.GRANTED ||
        granted['android.permission.CALL_PHONE'] !== PermissionsAndroid.RESULTS.GRANTED
      ) {
        Alert.alert('Permissions Required', 'Please grant all permissions to use this app.');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const setupCallDetection = () => {
    const detector = new CallDetectorManager(
      (event, phoneNumber) => {
        if (event === 'Connected') {
          setCallStartTime(new Date().toISOString());
        } else if (event === 'Disconnected') {
          if (callStartTime) {
            const endTime = new Date();
            const duration = Math.floor((endTime - new Date(callStartTime)) / 1000);
            logCall(phoneNumber, duration, callStartTime);
            setCallStartTime(null);
          }
        }
      },
      false,
      () => {},
      {}
    );
    setCallDetector(detector);
  };

  const handleCall = async () => {
    if (!phoneNumber.trim()) {
      Alert.alert('Error', 'Please enter a phone number');
      return;
    }

    const url = `tel:${phoneNumber}`;
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert('Error', 'Unable to make a call');
    }
  };

  const handleNumberPress = (num) => {
    setPhoneNumber(phoneNumber + num);
  };

  const handleDelete = () => {
    setPhoneNumber(phoneNumber.slice(0, -1));
  };

  const dialPad = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['*', '0', '#'],
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>CallFlow</Text>

      <View style={styles.displayContainer}>
        <TextInput
          style={styles.display}
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          placeholder="Enter phone number"
          keyboardType="phone-pad"
          placeholderTextColor="#999"
        />
        {phoneNumber.length > 0 && (
          <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
            <Icon name="backspace" size={24} color="#666" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.dialPadContainer}>
        {dialPad.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((num) => (
              <TouchableOpacity
                key={num}
                style={styles.button}
                onPress={() => handleNumberPress(num)}
              >
                <Text style={styles.buttonText}>{num}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.callButton} onPress={handleCall}>
        <Icon name="phone" size={32} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1976d2',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  displayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 20,
    marginBottom: 30,
    elevation: 2,
  },
  display: {
    flex: 1,
    fontSize: 24,
    padding: 15,
    color: '#333',
  },
  deleteButton: {
    padding: 10,
  },
  dialPadContainer: {
    marginBottom: 30,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  button: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  buttonText: {
    fontSize: 24,
    color: '#333',
    fontWeight: '500',
  },
  callButton: {
    backgroundColor: '#4caf50',
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    elevation: 4,
  },
});

export default HomeScreen;
