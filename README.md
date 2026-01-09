# 📞 CallFlow - Sales Call Tracking System

A complete sales call tracking system with web dashboard and mobile app to automatically track all your team's calls.

## 🎯 What Does This Do?

- **Sales team** makes calls from mobile app using their SIM card
- **Calls are automatically logged** to the server
- **Managers** view all calls, recordings, and analytics on web dashboard
- **No manual entry** needed - everything is automatic!

## 🚀 Quick Start

### First Time Setup:

1. **Install Requirements:**
   - Node.js: https://nodejs.org
   - PostgreSQL: https://www.postgresql.org/download/windows/

2. **Create Database:**
   ```bash
   psql -U postgres
   CREATE DATABASE callflow_db;
   \q
   ```

3. **Start Application:**
   - Double-click: `START_BACKEND.bat`
   - Double-click: `START_FRONTEND.bat`
   - Open: http://localhost:3000
   - Login: admin@callflow.com / admin123

**📖 Detailed instructions in: `START_HERE.md`**

## 📂 Project Structure

```
Pabbly Callflow/
├── 📱 mobile/                    # Android app for sales team
├── 🖥️ frontend/                  # Web dashboard (React + Material-UI)
├── ⚙️ backend/                   # API server (Node.js + PostgreSQL)
│
├── 🚀 START_BACKEND.bat          # Start backend server
├── 🚀 START_FRONTEND.bat         # Start web dashboard
├── ✅ CHECK_SETUP.bat            # Check if everything installed
│
├── 📖 START_HERE.md              # Quick start guide
├── 📖 INSTALLATION_STEPS.md      # Detailed installation
├── 📖 QUICK_START.md             # Quick reference
└── 📖 SETUP_GUIDE.md             # Complete setup guide
```

## ✨ Features

### Web Dashboard (For Managers/Admins)
- ✅ View all team calls in real-time
- ✅ Dashboard with statistics and charts
- ✅ Contact and lead management
- ✅ Team performance analytics
- ✅ Call recordings playback
- ✅ Export reports

### Mobile App (For Sales Team)
- ✅ Make calls using phone SIM
- ✅ Auto-detect and log all calls
- ✅ Call recording
- ✅ Works offline, syncs later
- ✅ Simple, easy interface

## 🎨 Technologies

- **Frontend:** React 18 + Material-UI v5
- **Backend:** Node.js + Express + PostgreSQL
- **Mobile:** React Native (Android)
- **Auth:** JWT tokens
- **Charts:** Recharts

## 👥 User Roles

1. **Admin** - Full access to everything
2. **Manager** - View team data and reports
3. **Sales Rep** - Track own calls only

## 🌐 Access URLs

When running locally:
- **Web Dashboard:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **From phone (same WiFi):** http://YOUR_IP:3000

## 🔐 Default Login

- **Email:** admin@callflow.com
- **Password:** admin123

⚠️ **Change this password immediately after first login!**

## 📱 Mobile App Setup

1. Enable Developer Mode on Android phone
2. Enable USB Debugging
3. Connect phone via USB
4. Run:
   ```bash
   cd mobile
   npm install
   npx react-native run-android
   ```

## 📚 Documentation

- **START_HERE.md** - Begin here for quick setup
- **INSTALLATION_STEPS.md** - Step-by-step installation
- **QUICK_START.md** - Fast reference guide
- **SETUP_GUIDE.md** - Complete documentation
- **backend/README.md** - Backend API docs
- **frontend/README.md** - Frontend docs
- **mobile/README.md** - Mobile app docs

## ❓ Troubleshooting

### "localhost refused to connect"
- Make sure both START_*.bat files are running
- Keep Command Prompt windows open
- Wait 30 seconds, then try again

### "database connection failed"
- Check PostgreSQL is running
- Verify password in `backend/.env`
- Make sure database exists

### More help:
- Run `CHECK_SETUP.bat` to diagnose issues
- Check `INSTALLATION_STEPS.md` for solutions

## 🎓 How to Use

1. **Login** to web dashboard (http://localhost:3000)
2. **Add team members** (Team → Add Member)
3. **Add contacts** (Contacts → Add Contact)
4. **Install mobile app** on sales team phones
5. **Sales team makes calls** - automatically tracked!
6. **View reports** on dashboard

## 🚀 Deployment

For production deployment (get public URLs):

- **Backend:** Deploy to Railway.app or Render.com
- **Database:** Use managed PostgreSQL
- **Frontend:** Deploy to Vercel.com
- **Mobile:** Build APK and distribute

See `SETUP_GUIDE.md` for deployment instructions.

## ⚠️ Important Notes

- Always start BACKEND before FRONTEND
- Keep both Command Prompt windows open
- Backend must run for mobile app to work
- Mobile and computer need same WiFi for local testing

## 🎉 Success!

Your CallFlow system is ready to track all your sales calls!

Login at: **http://localhost:3000**

---

Made with ❤️ for sales teams who want to track every call effortlessly.
