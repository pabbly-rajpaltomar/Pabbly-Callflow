# CallFlow - Quick Start Guide

## What You Have

A complete sales call tracking system with:
- **Web Dashboard** (React + Material-UI) - For managers and admins
- **Mobile App** (React Native Android) - For sales team
- **Backend API** (Node.js + PostgreSQL) - Connects everything

## Installation Steps (Simple)

### 1. Install Required Software

Download and install:
1. **Node.js** - https://nodejs.org (choose LTS version)
2. **PostgreSQL** - https://www.postgresql.org/download/ (choose version 14+)
3. **For mobile**: Android Studio - https://developer.android.com/studio

### 2. Setup Database (5 minutes)

1. Open PostgreSQL (pgAdmin or command line)
2. Create a new database named `callflow_db`
3. Remember your postgres password

### 3. Setup Backend (5 minutes)

Open Command Prompt/Terminal:

```bash
cd "c:\Users\rajpal.tomar_magnetb\Desktop\Pabbly Callflow\backend"
npm install
```

Edit the `.env` file and update:
- `DB_PASSWORD=your_postgres_password`

Then run:
```bash
npm run migrate
npm run dev
```

You should see: "Server running on port 5000"

### 4. Setup Web Dashboard (5 minutes)

Open a NEW Command Prompt/Terminal:

```bash
cd "c:\Users\rajpal.tomar_magnetb\Desktop\Pabbly Callflow\frontend"
npm install
npm run dev
```

Browser will open at http://localhost:3000

**Login with:**
- Email: admin@callflow.com
- Password: admin123

### 5. Setup Mobile App (10 minutes)

Open a NEW Command Prompt/Terminal:

```bash
cd "c:\Users\rajpal.tomar_magnetb\Desktop\Pabbly Callflow\mobile"
npm install
```

**Important**: Edit `mobile/src/services/api.js`:
- Find your computer's IP address (type `ipconfig` in Command Prompt)
- Replace `YOUR_IP_ADDRESS` with your IP (e.g., 192.168.1.100)

Connect your Android phone via USB, then:
```bash
npx react-native run-android
```

## Testing Everything

1. **Test Backend**: Open http://localhost:5000 - Should show API message
2. **Test Web**: Open http://localhost:3000 - Login and see dashboard
3. **Test Mobile**: Open app on phone - Login and make a test call
4. **Verify**: Call should appear in web dashboard

## How It Works

1. Sales rep opens mobile app on their phone
2. They dial a number using the in-app dialer
3. Phone makes call using their SIM card normally
4. App automatically detects call and logs details
5. Call data syncs to backend server
6. Manager sees the call in web dashboard instantly

## Features

### Web Dashboard
- View all team calls and statistics
- Manage contacts and leads
- Add team members
- View performance reports
- Listen to call recordings

### Mobile App
- Make calls using phone SIM
- Auto-log all call details
- Works offline (syncs later)
- Simple, easy-to-use interface

## Need Help?

Check the detailed `SETUP_GUIDE.md` file for:
- Troubleshooting common issues
- Production deployment steps
- Security configuration
- Advanced features

## Default Accounts

After setup, you have one admin account:
- Email: admin@callflow.com
- Password: admin123

**Change this password immediately!**

## Next Steps

1. Login to web dashboard
2. Go to Team page
3. Add your sales team members
4. Install mobile app on their phones
5. They login and start making calls
6. Track everything from web dashboard

## Important Notes

- Keep backend server running for system to work
- Mobile app needs internet to sync (can work offline temporarily)
- Both phone and computer should be on same WiFi for initial setup
- Use your computer's IP address in mobile app, not "localhost"

## Common Issues

**Mobile can't connect to backend:**
- Use your IP address (not localhost)
- Ensure phone and computer on same WiFi
- Check Windows Firewall isn't blocking port 5000

**Database connection error:**
- Make sure PostgreSQL is running
- Check password in backend/.env file
- Verify database 'callflow_db' exists

**Port 5000 already in use:**
- Change PORT in backend/.env to another number
- Update frontend/.env and mobile/src/services/api.js accordingly

---

Congratulations! Your CallFlow system is ready to use! 🎉
