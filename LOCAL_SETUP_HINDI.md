# 🚀 Local Server Par Website Chalane Ke Instructions

## ⚠️ Pehle Ye Install Karein

Aapke PC mein ye do cheezein install karni hongi:

### 1. Node.js Install Karein (5 minutes)

1. **Download karein**:
   - Ye link kholen: https://nodejs.org
   - Green button "LTS" version download karein (Recommended for Most Users)
   - File download hogi: `node-v20.x.x-x64.msi` (kuch aisa naam)

2. **Install karein**:
   - Downloaded file par double-click karein
   - "Next" click karte rahein sab jagah
   - "I accept the terms" check karein
   - "Install" button click karein
   - Administrator permission maange to "Yes" karein
   - Installation complete hone ka wait karein (2-3 minutes)
   - "Finish" click karein

3. **Check karein install hua ya nahi**:
   - Command Prompt kholen (Windows key + R, phir "cmd" type karein)
   - Ye command type karein:
     ```
     node --version
     ```
   - Agar version dikhaya (jaise v20.11.0) to Node.js install ho gaya ✅
   - Agar nahi dikha to computer restart karein aur phir se check karein

---

### 2. PostgreSQL Install Karein (10 minutes)

1. **Download karein**:
   - Ye link kholen: https://www.postgresql.org/download/windows/
   - "Download the installer" link click karein
   - Latest version (16.x) download karein for Windows x86-64
   - File download hogi: `postgresql-16.x-windows-x64.exe`

2. **Install karein**:
   - Downloaded file par double-click karein
   - "Next" click karein
   - Installation directory default rakhein, "Next" click karein
   - Components: sab check rahne dein, "Next" click karein
   - Data directory default rakhein, "Next" click karein

   **⚠️ IMPORTANT - Password Set Karein**:
   - Password dalein: `admin` (ya jo aap chahein, yaad rakhna zaruri hai!)
   - Password confirm karein
   - "Next" click karein

   - Port: 5432 default rakhein, "Next" click karein
   - Locale: Default rakhein, "Next" click karein
   - "Next" click karein summary par
   - "Next" click karein installation shuru karne ke liye
   - Wait karein (5-7 minutes lag sakte hain)
   - "Finish" click karein
   - Stack Builder checkbox uncheck kar dein aur close kar dein

3. **Check karein install hua ya nahi**:
   - Start Menu mein search karein "pgAdmin"
   - pgAdmin 4 kholen
   - Password dalein jo aapne set kiya tha
   - Agar open ho gaya to PostgreSQL install ho gaya ✅

---

## 🗄️ Database Setup Karein (2 minutes)

### Method 1: pgAdmin Use Karke (Easy)

1. **pgAdmin 4 kholen**:
   - Start Menu → pgAdmin 4
   - Master password dalein

2. **Database banayein**:
   - Left side mein "Servers" → "PostgreSQL 16" par right-click karein
   - Agar password maange to wahi password dalein jo install karte waqt diya tha
   - "Databases" par right-click karein
   - "Create" → "Database" click karein
   - Database name dalein: `callflow_db`
   - "Save" click karein

✅ Database ban gaya!

### Method 2: Command Line Use Karke (Advanced)

1. **Command Prompt kholen** (Windows key + R, phir "cmd")
2. Ye commands run karein:
   ```
   cd "C:\Program Files\PostgreSQL\16\bin"
   psql -U postgres
   ```
3. Password dalein jo aapne install karte waqt set kiya tha
4. Ye command run karein:
   ```
   CREATE DATABASE callflow_db;
   ```
5. Ye command run karein exit karne ke liye:
   ```
   \q
   ```

✅ Database ban gaya!

---

## 🎯 Ab Website Chalayein!

### Step 1: Backend Setup (5 minutes)

1. **Naya Command Prompt kholen**
2. Backend folder mein jayein:
   ```
   cd "c:\Users\pc\Downloads\Pabbly-Callflow-master\Pabbly-Callflow-master\backend"
   ```

3. **Environment file banayein**:
   ```
   copy .env.example .env
   ```

4. **Environment file edit karein**:
   - Notepad se `.env` file kholen:
     ```
     notepad .env
     ```
   - Line 10 par apna PostgreSQL password dalein:
     ```
     DB_PASSWORD=admin
     ```
     (Ya jo password aapne set kiya tha)
   - Save karein (Ctrl+S) aur close karein

5. **Dependencies install karein**:
   ```
   npm install
   ```
   - Wait karein (2-3 minutes)

6. **Backend start karein**:
   ```
   npm start
   ```

✅ Agar dikhaye "Server running on port 5000" to backend chal gaya!

**⚠️ Is Command Prompt window ko BAND MAT KAREIN - backend running rehna chahiye**

---

### Step 2: Frontend Setup (3 minutes)

1. **Naya Command Prompt kholen** (pehla wala chalta rahne dein!)

2. Frontend folder mein jayein:
   ```
   cd "c:\Users\pc\Downloads\Pabbly-Callflow-master\Pabbly-Callflow-master\frontend"
   ```

3. **Dependencies install karein**:
   ```
   npm install
   ```
   - Wait karein (2-3 minutes)

4. **Frontend start karein**:
   ```
   npm run dev
   ```

✅ Browser automatically khulega ya ye dikhega:
```
Local:   http://localhost:3000
```

**⚠️ Is Command Prompt window ko bhi BAND MAT KAREIN**

---

## 🎉 Website Chal Gaya!

1. **Browser mein kholen**: http://localhost:3000

2. **Login karein**:
   - Email: `admin@callflow.com`
   - Password: `admin123`

3. **Success!** Aapka CallFlow dashboard ab chal raha hai! 🎊

---

## 📝 Yaad Rakhein

- **Do Command Prompt windows open rahne chahiye**:
  1. Backend (port 5000) - Ye window chalta rahna chahiye
  2. Frontend (port 3000) - Ye window bhi chalta rahna chahiye

- **Website band karne ke liye**:
  - Dono Command Prompt windows mein `Ctrl+C` press karein
  - Phir "Y" press karke Enter karein

- **Dubara website chalane ke liye**:
  - Backend window mein: `npm start`
  - Frontend window mein: `npm run dev`

---

## 🔧 Agar Problem Aaye

### "Database connection failed"
- Check karein PostgreSQL chal raha hai ya nahi (pgAdmin khol kar dekhen)
- `.env` file mein password sahi hai ya nahi check karein
- Database `callflow_db` bana hai ya nahi check karein

### "Port 5000 already in use"
- Koi aur program port 5000 use kar raha hai
- Backend Command Prompt band kar ke dobara start karein
- Ya computer restart karein

### "Port 3000 already in use"
- Koi aur program port 3000 use kar raha hai
- Frontend Command Prompt band kar ke dobara start karein

### Dependencies install nahi ho rahe
- Internet connection check karein
- Command Prompt ko Administrator mode mein kholen:
  - Right-click on Command Prompt
  - "Run as Administrator" select karein
  - Phir se `npm install` command run karein

---

## 📞 Quick Reference Card

### ✅ Installation Checklist
- [ ] Node.js installed (https://nodejs.org)
- [ ] PostgreSQL installed (https://postgresql.org)
- [ ] Database `callflow_db` banaya
- [ ] Backend `.env` file password update kiya

### 🚀 Start Karne Ke Commands
```
Backend:
cd "c:\Users\pc\Downloads\Pabbly-Callflow-master\Pabbly-Callflow-master\backend"
npm start

Frontend (Naya Command Prompt):
cd "c:\Users\pc\Downloads\Pabbly-Callflow-master\Pabbly-Callflow-master\frontend"
npm run dev
```

### 🌐 Access URLs
- Website: http://localhost:3000
- Backend API: http://localhost:5000

### 🔐 Login Details
- Email: admin@callflow.com
- Password: admin123

---

**Agar koi problem ho to batayein, main help karunga! 👍**
