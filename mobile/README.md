# CallFlow Mobile App

React Native mobile application for sales team to make calls and automatically log them.

## Features

- Native dialer interface
- Automatic call detection and logging
- Call recording
- Contact management
- Offline support with sync

## Setup

1. Install dependencies:
```bash
npm install
```

2. For Android:
```bash
npx react-native run-android
```

## Required Permissions

- READ_PHONE_STATE
- CALL_PHONE
- READ_CONTACTS
- RECORD_AUDIO
- WRITE_EXTERNAL_STORAGE

## Configuration

Update the API URL in `src/services/api.js` to point to your backend server.
