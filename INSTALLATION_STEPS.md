# CallFlow - Installation Steps (Windows)

## ✅ Prerequisites Checklist

Before starting, install these:

1. **Node.js** (v18+)
   - Download: https://nodejs.org
   - Choose "LTS" version
   - Verify: Open Command Prompt and type `node -v`

2. **PostgreSQL** (v14+)
   - Download: https://www.postgresql.org/download/windows/
   - During installation, set password: `postgres` (or remember your password)
   - Verify: Open Services and check if "postgresql" is running

## 🚀 Installation Steps

### Step 1: Create Database

1. Open Command Prompt as Administrator

2. Connect to PostgreSQL:
   ```bash
   psql -U postgres
   ```
   Enter password: `postgres` (or your password)

3. Create database:
   ```sql
   CREATE DATABASE callflow_db;
   ```

4. Exit:
   ```sql
   \q
   ```

### Step 2: Update Database Password (If Needed)

If your PostgreSQL password is NOT `postgres`:

1. Open file: `backend\.env`
2. Change line: `DB_PASSWORD=postgres` to your password
3. Save file

### Step 3: Start Backend Server

**Option A - Using Batch File (Easy):**
- Double-click: `START_BACKEND.bat`
- Wait until you see: "✓ Server running on port 5000"

**Option B - Using Command Prompt:**
```bash
cd "c:\Users\rajpal.tomar_magnetb\Desktop\Pabbly Callflow\backend"
npm install
npm run migrate
npm run dev
```

### Step 4: Start Frontend Dashboard

**Option A - Using Batch File (Easy):**
- Double-click: `START_FRONTEND.bat`
- Browser will open automatically at http://localhost:3000

**Option B - Using Command Prompt:**
Open NEW Command Prompt window:
```bash
cd "c:\Users\rajpal.tomar_magnetb\Desktop\Pabbly Callflow\frontend"
npm install
npm run dev
```

### Step 5: Login to Dashboard

1. Browser should open: http://localhost:3000
2. Login with:
   - **Email:** admin@callflow.com
   - **Password:** admin123

## 🎉 Success!

If you see the dashboard, congratulations! The system is working.

## ❌ Troubleshooting

### Error: "localhost refused to connect"

**Problem:** Servers not running

**Solution:**
- Make sure you ran BOTH `START_BACKEND.bat` AND `START_FRONTEND.bat`
- Keep both Command Prompt windows open
- Wait for "Server running on port..." message

### Error: "password authentication failed"

**Problem:** Wrong PostgreSQL password in `.env` file

**Solution:**
1. Open `backend\.env`
2. Update `DB_PASSWORD=` with your correct password
3. Restart backend server

### Error: "database callflow_db does not exist"

**Problem:** Database not created

**Solution:**
```bash
psql -U postgres
CREATE DATABASE callflow_db;
\q
```

### Error: "Port 5000 already in use"

**Problem:** Another app using port 5000

**Solution:**
1. Open `backend\.env`
2. Change `PORT=5000` to `PORT=5001`
3. Open `frontend\.env`
4. Change URL to `http://localhost:5001/api`
5. Restart both servers

### Error: "npm is not recognized"

**Problem:** Node.js not installed or not in PATH

**Solution:**
- Install Node.js from https://nodejs.org
- Restart computer
- Try again

## 📱 Mobile App Installation

### For Testing (USB Cable):

1. Enable Developer Mode on Android phone:
   - Settings → About Phone → Tap "Build Number" 7 times

2. Enable USB Debugging:
   - Settings → Developer Options → USB Debugging ON

3. Connect phone via USB

4. Run:
   ```bash
   cd "c:\Users\rajpal.tomar_magnetb\Desktop\Pabbly Callflow\mobile"
   npm install
   npx react-native run-android
   ```

### Update Mobile App API URL:

1. Find your computer's IP address:
   ```bash
   ipconfig
   ```
   Look for "IPv4 Address" (e.g., 192.168.1.100)

2. Open: `mobile\src\services\api.js`

3. Change:
   ```javascript
   const API_URL = 'http://YOUR_IP_ADDRESS:5000/api';
   ```
   to:
   ```javascript
   const API_URL = 'http://192.168.1.100:5000/api';
   ```
   (Use YOUR actual IP)

4. Reinstall app

## 🌐 Access URLs

- **Web Dashboard:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **From Phone (same WiFi):** http://YOUR_IP:3000

## 📝 Default Login

- **Email:** admin@callflow.com
- **Password:** admin123

**Important:** Change this password after first login!

## ✋ Stopping the Servers

- Press `Ctrl + C` in each Command Prompt window
- Or close the Command Prompt windows

## 🔄 Restarting

Just double-click:
1. `START_BACKEND.bat`
2. `START_FRONTEND.bat`

That's it! Keep these windows open while using the app.

## 💡 Tips

- Always start BACKEND first, then FRONTEND
- Keep both Command Prompt windows open
- Don't close windows while using the app
- Backend must be running for mobile app to work
- Both computer and phone must be on same WiFi

## 📞 Need Help?

Check these files:
- `QUICK_START.md` - Quick reference guide
- `SETUP_GUIDE.md` - Detailed documentation
- `backend/README.md` - Backend API docs
- `frontend/README.md` - Frontend docs

---

**Ready to use CallFlow!** 🚀
