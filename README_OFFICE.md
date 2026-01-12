# 🏢 OFFICE PC - QUICK START

**Latest Update:** 2026-01-12
**Status:** ✅ PRODUCTION READY

---

## 🚀 INSTANT SETUP (3 STEPS)

### **1. CLONE REPOSITORY**
```bash
git clone https://github.com/pabbly-rajpaltomar/Pabbly-Callflow.git
cd Pabbly-Callflow
```

### **2. START BACKEND**
```bash
cd backend
npm install
# Edit .env file - Change DB_PASSWORD to your PostgreSQL password
npm run dev
```

### **3. START FRONTEND** (New Terminal)
```bash
cd frontend
npm install
npm run dev
```

### **4. OPEN BROWSER**
```
http://localhost:3000
```

**DONE!** ✅

---

## ⚠️ PREREQUISITES

**Install these FIRST:**
- Node.js v16+ → https://nodejs.org/
- PostgreSQL → https://www.postgresql.org/download/
- Git → https://git-scm.com/downloads

**Create Database:**
```sql
CREATE DATABASE callflow_db;
```

---

## 📚 DETAILED GUIDES

**Puri details ke liye yeh files dekho:**

1. **[OFFICE_SETUP_GUIDE.md](./OFFICE_SETUP_GUIDE.md)**
   - Complete step-by-step setup
   - Common problems & solutions
   - Daily usage workflow

2. **[COMPLETE_TESTING_CHECKLIST.md](./COMPLETE_TESTING_CHECKLIST.md)**
   - All features testing
   - Twilio call testing
   - Missed call verification
   - Every feature ko test karne ka procedure

3. **[VERIFICATION_REPORT.md](./VERIFICATION_REPORT.md)**
   - What was fixed (Missed call tracking)
   - Complete feature list
   - Database configuration

---

## ✅ KEY FEATURES THAT ARE WORKING

### **✅ Authentication**
- Login/Signup with JWT
- Role-based access (Admin, Manager, Sales Rep)

### **✅ Dashboard**
- Stats cards (Leads, Calls, Duration, Conversion)
- Calls over time chart
- Team performance table
- Date range filtering

### **✅ Leads Management**
- Kanban board with **DRAG & DROP** ✅
- Table view with search/filter
- Bulk import (CSV/Excel)
- Webhook integration
- Lead detail page with activity timeline

### **✅ Calls Management**
- Call history with proper stats
- **MISSED CALLS TRACKING** ✅✅✅ **(FIXED!)**
- Twilio integration for making calls
- Call recording upload
- Call outcome tracking (Answered, No Answer, Busy, Voicemail)
- Call status (Interested, Not Interested, Callback, Converted)

### **✅ Contacts Management**
- Contact CRUD operations
- Bulk import
- Call initiation
- Status tracking (Opted-In/Out)

### **✅ Team Management** (Admin/Manager)
- User CRUD operations
- Role assignment
- Bulk team invites
- Password management
- User activation/deactivation

### **✅ Reports & Analytics** (Admin/Manager)
- Conversion funnel chart
- Performance rankings
- Call quality dashboard
- Data export (CSV)

---

## 🎯 MAIN FIX - MISSED CALL TRACKING

**Problem:** Jab koi call receive nahi karta tha, to "Missed" count 0 dikha raha tha.

**Solution:** Ab properly kaam kar raha hai! ✅

**Kaise Test Kare:**
1. Calls page kholo
2. "Make Call" button se call karo
3. Phone mat uthao (ring hone do)
4. Call cut ho jayegi
5. ✅ "Missed Calls" stat mein count badhega
6. ✅ "Missed" tab mein call dikhai degi
7. ✅ Call type = "Missed" hogi

---

## 📞 TWILIO CALL INTEGRATION

**Backend `.env` file mein Twilio credentials already hain.**

**Test Kaise Kare:**
1. Calls page kholo
2. "Make Call" button par click karo
3. Phone number enter karo (with country code: +91XXXXXXXXXX)
4. "Call Now" button dabao
5. ✅ Twilio actual call initiate karega
6. ✅ Call database mein log hoga
7. ✅ Agar answer nahi kiya to "Missed" mark hoga

---

## 🗄️ DATABASE SETUP

**Database Name:** `callflow_db`

**Quick Create:**
```bash
# Option 1: Command line
psql -U postgres
CREATE DATABASE callflow_db;
\q

# Option 2: pgAdmin 4
Right-click "Databases" → Create → Database
Name: callflow_db
Save
```

**Configure Password:**
```bash
# Edit backend/.env file
DB_PASSWORD=your_postgresql_password
```

---

## 🔧 DAILY USAGE

**Morning Office Mein:**

**Terminal 1:**
```bash
cd Pabbly-Callflow/backend
npm run dev
```

**Terminal 2:**
```bash
cd Pabbly-Callflow/frontend
npm run dev
```

**Browser:**
```
http://localhost:3000
```

**Done! Kaam shuru karo** ✅

---

## 🆘 QUICK TROUBLESHOOTING

### **Problem: Database connection failed**
```bash
# .env file mein password check karo
# PostgreSQL server chal raha hai check karo
```

### **Problem: Port 5000 already in use**
```bash
netstat -ano | findstr :5000
taskkill /PID <process_id> /F
```

### **Problem: Port 3000 already in use**
```bash
netstat -ano | findstr :3000
taskkill /PID <process_id> /F
```

### **Problem: npm install fails**
```bash
# Node.js properly install hai check karo
node --version  # Should be v16+
npm --version
```

---

## 📋 VERIFICATION CHECKLIST

**Office PC pe deploy karne se pehle yeh check karo:**

- [ ] Node.js installed (v16+)
- [ ] PostgreSQL installed
- [ ] Git installed
- [ ] Repository cloned
- [ ] Database created (callflow_db)
- [ ] .env file configured (DB_PASSWORD)
- [ ] Backend dependencies installed (npm install)
- [ ] Frontend dependencies installed (npm install)
- [ ] Backend running (http://localhost:5000)
- [ ] Frontend running (http://localhost:3000)
- [ ] Login page loads
- [ ] Can create account
- [ ] Dashboard loads
- [ ] **Missed calls tracking works** ✅
- [ ] All navigation working
- [ ] No console errors

**Agar SAB ✅ hain to READY!**

---

## 🎉 SUCCESS INDICATORS

**Backend Terminal:**
```
✓ Database connected successfully
✓ Database models synchronized
✓ Server running on port 5000
✓ Automatic recording sync service started
```

**Frontend Terminal:**
```
VITE v5.4.21  ready in 436 ms
➜  Local:   http://localhost:3000/
```

**Browser:**
- Login page properly loads
- No errors in console (F12)
- Can login/signup successfully
- Dashboard shows stats

---

## 📞 SUPPORT

**Agar koi problem ho:**

1. **[OFFICE_SETUP_GUIDE.md](./OFFICE_SETUP_GUIDE.md)** mein dekho - Har problem ka solution hai
2. **[COMPLETE_TESTING_CHECKLIST.md](./COMPLETE_TESTING_CHECKLIST.md)** mein dekho - Testing procedure
3. Console errors screenshot lo aur send karo

---

## 🔗 IMPORTANT LINKS

**Repository:** https://github.com/pabbly-rajpaltomar/Pabbly-Callflow.git
**Branch:** master
**Latest Commit:** 28ac358 (Office setup guide added)

---

## ✅ FINAL STATUS

**Application Status:** PRODUCTION READY ✅
**All Features:** WORKING ✅
**Missed Call Tracking:** FIXED ✅
**Twilio Integration:** ACTIVE ✅
**Database:** CONFIGURED ✅
**Git Repository:** UP TO DATE ✅

**OFFICE MEIN 100% CHALEGA! GUARANTEED!** 💯

---

**Last Updated:** 2026-01-12
**Tested On:** Windows 10/11
**Node Version:** v16+
**PostgreSQL Version:** 14+
