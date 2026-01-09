# CallFlow - Complete Setup Guide

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn
- For mobile: Android Studio and Android SDK
- For mobile: React Native CLI

## Step 1: Database Setup

### Install PostgreSQL

1. Download and install PostgreSQL from https://www.postgresql.org/download/
2. During installation, remember the password you set for the postgres user

### Create Database

Open PostgreSQL command line (psql) or pgAdmin and run:

```sql
CREATE DATABASE callflow_db;
```

## Step 2: Backend Setup

1. Navigate to backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
   - Open `.env` file
   - Update database credentials:
   ```
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=callflow_db
   DB_USER=postgres
   DB_PASSWORD=your_postgres_password
   ```

4. Run database migrations:
```bash
npm run migrate
```

This will create all tables and a default admin user:
- Email: admin@callflow.com
- Password: admin123

5. Start the backend server:
```bash
npm run dev
```

The server will start on http://localhost:5000

## Step 3: Frontend Setup

1. Navigate to frontend folder:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The web dashboard will open at http://localhost:3000

4. Login with default admin credentials:
   - Email: admin@callflow.com
   - Password: admin123

## Step 4: Mobile App Setup (Android)

### Prerequisites

1. Install Android Studio from https://developer.android.com/studio
2. Install JDK 11 or higher
3. Set up Android SDK (API level 31 or higher)
4. Install React Native CLI:
```bash
npm install -g react-native-cli
```

### Setup Steps

1. Navigate to mobile folder:
```bash
cd mobile
```

2. Install dependencies:
```bash
npm install
```

3. Update API URL:
   - Open `mobile/src/services/api.js`
   - Replace `YOUR_IP_ADDRESS` with your computer's local IP address
   - Example: `http://192.168.1.100:5000/api`
   - **Important**: Use your local IP, not localhost, so the phone can connect

4. Find your local IP address:
   - Windows: Run `ipconfig` in Command Prompt, look for IPv4 Address
   - Mac/Linux: Run `ifconfig`, look for inet address

5. Connect your Android phone:
   - Enable Developer Options on your Android device
   - Enable USB Debugging
   - Connect phone via USB

6. Verify device is connected:
```bash
adb devices
```

7. Run the app:
```bash
npx react-native run-android
```

## Step 5: Testing the Complete System

### Test Backend API

1. Open browser and go to: http://localhost:5000
2. You should see: `{"success":true,"message":"CallFlow API Server"}`

### Test Web Dashboard

1. Open browser and go to: http://localhost:3000
2. Login with: admin@callflow.com / admin123
3. You should see the dashboard with stats and charts

### Test Mobile App

1. Open the app on your Android phone
2. Login with: admin@callflow.com / admin123
3. Grant all requested permissions (Phone, Contacts, Microphone)
4. Make a test call from the dialer
5. The call should automatically be logged
6. Check the web dashboard to verify the call appears

## Features Overview

### Web Dashboard Features
- **Dashboard**: View call statistics and analytics
- **Calls**: View, add, edit, and delete call logs
- **Contacts**: Manage customer contacts and leads
- **Team**: Add and manage team members
- **Reports**: View team performance and reports

### Mobile App Features
- **Dialer**: Make calls using device SIM
- **Auto-logging**: Calls are automatically logged to server
- **Offline Support**: Calls saved offline and synced when online
- **Call Detection**: Automatically detects call start and end

## User Roles

1. **Admin** - Full access to all features
2. **Manager** - Can view team data and reports
3. **Sales Rep** - Can only view and manage own calls

## Troubleshooting

### Backend Issues

**Database connection error:**
- Verify PostgreSQL is running
- Check database credentials in `.env` file
- Ensure database `callflow_db` exists

**Port already in use:**
- Change PORT in `.env` file to a different port
- Kill the process using port 5000

### Frontend Issues

**Cannot connect to backend:**
- Ensure backend server is running on port 5000
- Check `VITE_API_URL` in `frontend/.env`

### Mobile App Issues

**Cannot connect to backend:**
- Verify you're using your local IP address, not localhost
- Ensure phone and computer are on the same WiFi network
- Check if backend is accessible from phone browser: http://YOUR_IP:5000

**App crashes on call:**
- Ensure all permissions are granted
- Check Android version (minimum API 21)
- Review logs with: `adb logcat`

**Build errors:**
- Clean build: `cd android && ./gradlew clean`
- Reinstall dependencies: `rm -rf node_modules && npm install`

## Production Deployment

### Backend Deployment

1. Use services like Heroku, DigitalOcean, or AWS
2. Set up PostgreSQL database on the server
3. Update `.env` with production values
4. Use PM2 for process management:
```bash
npm install -g pm2
pm2 start src/server.js --name callflow-backend
```

### Frontend Deployment

1. Build production version:
```bash
npm run build
```

2. Deploy to Vercel, Netlify, or any static hosting
3. Update environment variable to point to production backend

### Mobile App Deployment

1. Generate release APK:
```bash
cd android
./gradlew assembleRelease
```

2. APK will be in: `android/app/build/outputs/apk/release/`
3. Upload to Google Play Store or distribute APK directly

## Security Notes

- Change default admin password immediately
- Use strong JWT secret in production
- Enable HTTPS for production
- Regularly update dependencies
- Implement rate limiting for APIs

## Support

For issues or questions, check the documentation in each folder's README file.

## License

MIT License
