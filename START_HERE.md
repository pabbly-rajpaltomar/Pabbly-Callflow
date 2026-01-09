# 🚀 START HERE - CallFlow Quick Launch

## ⚡ Super Quick Start (3 Steps)

### Step 1: Install Requirements (One Time Only)

Download and install these (if not already installed):

1. **Node.js**: https://nodejs.org (click "Download LTS")
2. **PostgreSQL**: https://www.postgresql.org/download/windows/
   - During install, set password as: `postgres`
   - Remember this password!

### Step 2: Create Database (One Time Only)

1. Open **Command Prompt** (search for "cmd")
2. Type: `psql -U postgres` (press Enter)
3. Enter password: `postgres`
4. Type: `CREATE DATABASE callflow_db;` (press Enter)
5. Type: `\q` (press Enter to exit)

### Step 3: Start Application

1. **Double-click:** `START_BACKEND.bat`
   - Wait until you see: "✓ Server running on port 5000"
   - **DO NOT close this window**

2. **Double-click:** `START_FRONTEND.bat`
   - Browser will open automatically
   - **DO NOT close this window**

3. **Login:**
   - Email: `admin@callflow.com`
   - Password: `admin123`

## ✅ That's It!

You should now see your CallFlow Dashboard!

---

## 🎯 What Do I See?

After login, you'll see:

- **Dashboard** - Statistics and charts
- **Calls** - All call logs
- **Contacts** - Customer database
- **Team** - Team members
- **Reports** - Analytics

---

## 📱 Install Mobile App (For Sales Team)

### Requirements:
- Android phone
- USB cable
- Same WiFi as computer

### Steps:

1. **Enable Developer Mode** on phone:
   - Go to: Settings → About Phone
   - Tap "Build Number" 7 times
   - You'll see: "Developer mode enabled"

2. **Enable USB Debugging:**
   - Settings → Developer Options
   - Turn ON "USB Debugging"

3. **Connect phone via USB cable**

4. **Open Command Prompt** and run:
   ```bash
   cd "c:\Users\rajpal.tomar_magnetb\Desktop\Pabbly Callflow\mobile"
   npm install
   npx react-native run-android
   ```

5. **Wait** - App will install on your phone automatically!

---

## 🔧 Troubleshooting

### Browser shows "Can't reach this page"?

**Fix:**
- Make sure BOTH batch files are running
- Keep both Command Prompt windows OPEN
- Wait 30 seconds after starting
- Then try: http://localhost:3000

### Still not working?

1. Run: `CHECK_SETUP.bat` (double-click it)
2. It will tell you what's missing
3. Fix what's missing and try again

---

## 📞 Common Questions

**Q: Do I need to do Step 1 and 2 every time?**
A: No! Only ONCE. After that, just use the START_*.bat files.

**Q: Which windows should stay open?**
A: Both Command Prompt windows (from the START_*.bat files)

**Q: Can I close the browser?**
A: Yes! Just go to http://localhost:3000 again

**Q: How do I stop the servers?**
A: Press Ctrl+C in the Command Prompt windows, or close them

**Q: How do I restart?**
A: Just double-click the START_*.bat files again

**Q: Can I access from another computer?**
A: Yes! Use http://YOUR_IP_ADDRESS:3000
   - Find IP: Run `ipconfig` in Command Prompt

**Q: Where's my IP address?**
A: Run `ipconfig` → Look for "IPv4 Address"

---

## 📂 Important Files

- `START_BACKEND.bat` - Starts server
- `START_FRONTEND.bat` - Starts dashboard
- `CHECK_SETUP.bat` - Checks if everything is installed
- `INSTALLATION_STEPS.md` - Detailed instructions
- `QUICK_START.md` - Quick reference

---

## 🎓 What's Next?

After logging in:

1. **Change admin password** (Profile → Settings)
2. **Add team members** (Team → Add Member)
3. **Add contacts** (Contacts → Add Contact)
4. **Install mobile app** on sales team phones
5. **Start tracking calls!**

---

## 💡 Pro Tips

- Bookmark http://localhost:3000
- Create desktop shortcuts to START_*.bat files
- Keep Command Prompt windows minimized (don't close!)
- Mobile app needs computer running to sync

---

## ⚠️ Important Notes

1. Always start BACKEND first, then FRONTEND
2. Keep both windows running
3. Backend MUST be running for mobile app to work
4. Change default password immediately!

---

## 🎉 You're Ready!

Your CallFlow system is now running at:
**http://localhost:3000**

Login: admin@callflow.com / admin123

**Enjoy tracking your sales calls!** 📞

---

Need help? Check `INSTALLATION_STEPS.md` for detailed troubleshooting.
