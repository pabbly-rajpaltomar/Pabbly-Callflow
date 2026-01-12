# 🏢 OFFICE PC - COMPLETE SETUP GUIDE (FINAL)

**Date:** 2026-01-12
**Status:** ✅ PRODUCTION READY

---

## 📋 TABLE OF CONTENTS

1. [Quick Start (10 Minutes)](#quick-start)
2. [What Works Out of the Box](#what-works)
3. [What Needs Configuration](#needs-configuration)
4. [Step-by-Step Setup](#setup-steps)
5. [Daily Usage](#daily-usage)
6. [All Features List](#features)

---

## ⚡ QUICK START (10 MINUTES) {#quick-start}

```bash
# 1. CLONE (1 min)
git clone https://github.com/pabbly-rajpaltomar/Pabbly-Callflow.git
cd Pabbly-Callflow

# 2. DATABASE SETUP (2 min)
psql -U postgres
CREATE DATABASE callflow_db;
\q

# 3. BACKEND SETUP (3 min)
cd backend
npm install
# Edit .env - Update DB_PASSWORD
npm run dev

# 4. FRONTEND SETUP (3 min)
# New terminal
cd frontend
npm install
npm run dev

# 5. OPEN BROWSER (1 min)
http://localhost:3000
```

**DONE IN 10 MINUTES!** ✅

---

## ✅ WHAT WORKS OUT OF THE BOX {#what-works}

**Yeh features configuration ke bina hi kaam karenge:**

1. ✅ **Authentication**
   - Login/Signup
   - JWT tokens
   - Role-based access

2. ✅ **Dashboard**
   - Stats cards
   - Charts
   - Team performance
   - Date filters

3. ✅ **Leads Management**
   - Kanban board (drag & drop)
   - Table view
   - CRUD operations
   - Search/Filter
   - Bulk import
   - Webhook integration
   - **MISSED CALL TRACKING FIXED** ✅

4. ✅ **Calls Management**
   - Call logs
   - Manual call entry
   - Call statistics
   - Upload recordings
   - **Proper missed call counting** ✅

5. ✅ **Contacts Management**
   - Contact CRUD
   - Bulk import
   - Status tracking

6. ✅ **Team Management** (Admin/Manager)
   - User CRUD
   - Role assignment
   - Bulk invites

7. ✅ **Reports & Analytics** (Admin/Manager)
   - Conversion funnel
   - Performance rankings
   - Call quality dashboard
   - Data export

**SAB KUCH KAAM KAREGA TURANT!** ✅

---

## ⚙️ WHAT NEEDS CONFIGURATION {#needs-configuration}

**Yeh features ko setup karna hoga (optional):**

### **1. Twilio (Call Integration)** ⚠️

**Current Status:** Trial account - sirf verified numbers

**What to Do:**
- **Option A:** Number verify karo (5 min, FREE)
  - Guide: [TWILIO_SETUP_GUIDE.md](./TWILIO_SETUP_GUIDE.md)
- **Option B:** Account upgrade ($20)

**If Not Setup:**
- ❌ Automated calls nahi kar sakte
- ✅ Manual call logs kaam karenge
- ✅ Call statistics kaam karenge

### **2. Gmail SMTP (Email Features)** ⚠️

**Current Status:** Not configured

**What to Do:**
- Google App Password banao (5 min)
- `.env` file update karo
- Guide: [EMAIL_SETUP_GUIDE.md](./EMAIL_SETUP_GUIDE.md)

**If Not Setup:**
- ❌ Email nahi bhej sakte leads/contacts ko
- ✅ Baaki sab features kaam karenge

---

## 📝 STEP-BY-STEP SETUP {#setup-steps}

### **STEP 1: PREREQUISITES** (One-Time Installation)

Install these if not already installed:

#### **1.1 Node.js**
```
Download: https://nodejs.org/
Version: v16 or higher
Install: Default options
Verify: node --version
```

#### **1.2 PostgreSQL**
```
Download: https://www.postgresql.org/download/
Version: 14 or higher
Install: Remember password!
Verify: psql --version
```

#### **1.3 Git**
```
Download: https://git-scm.com/downloads
Install: Default options
Verify: git --version
```

---

### **STEP 2: CLONE REPOSITORY** (2 Minutes)

```bash
# Navigate to desired folder
cd Desktop  # or Documents, etc.

# Clone repository
git clone https://github.com/pabbly-rajpaltomar/Pabbly-Callflow.git

# Enter folder
cd Pabbly-Callflow

# Verify files
dir  # Should see backend, frontend folders
```

---

### **STEP 3: DATABASE SETUP** (3 Minutes)

#### **Option A: Command Line**
```bash
# Open PostgreSQL shell
psql -U postgres

# Enter password (from installation)

# Create database
CREATE DATABASE callflow_db;

# Verify
\l
# Should see callflow_db in list

# Exit
\q
```

#### **Option B: pgAdmin 4** (GUI)
```
1. Open pgAdmin 4
2. Connect to server (enter password)
3. Right-click "Databases"
4. Create → Database
5. Name: callflow_db
6. Save
```

---

### **STEP 4: BACKEND CONFIGURATION** (5 Minutes)

```bash
# Go to backend folder
cd backend

# Install dependencies (takes 2-3 minutes)
npm install

# Edit .env file
notepad .env
```

#### **Required Changes in .env:**

**1. Database Password:**
```env
DB_PASSWORD=your_postgres_password  # ← Change this
```

**2. Twilio (Optional - for calls):**
```env
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=your_twilio_number
```
*Skip if not using automated calls*

**3. Email (Optional - for emails):**
```env
SMTP_USER=your.email@gmail.com
SMTP_PASSWORD=your_app_password
SMTP_FROM_EMAIL=your.email@gmail.com
```
*Skip if not using email features*

**Save and close** (Ctrl+S)

---

### **STEP 5: START BACKEND** (1 Minute)

```bash
# Make sure you're in backend folder
npm run dev
```

**Success Indicators:**
```
✓ Database connected successfully
✓ Database models synchronized
✓ Server running on port 5000
✓ Environment: development
✓ API available at: http://localhost:5000
✓ Automatic recording sync service started
```

**If errors:**
- Check DB_PASSWORD in .env
- Check PostgreSQL is running
- Check database callflow_db exists

**Keep this terminal OPEN!**

---

### **STEP 6: FRONTEND SETUP** (5 Minutes)

**Open NEW terminal** (keep backend running)

```bash
# Navigate to frontend folder
cd Pabbly-Callflow/frontend

# Install dependencies (takes 2-3 minutes)
npm install

# Start development server
npm run dev
```

**Success Indicators:**
```
VITE v5.4.21  ready in 436 ms

➜  Local:   http://localhost:3000/
➜  Network: use --host to expose
```

**Keep this terminal OPEN too!**

---

### **STEP 7: ACCESS APPLICATION** (2 Minutes)

**Open Browser:**
```
http://localhost:3000
```

**You Should See:**
- Login page
- Pabbly branding
- Email/Password fields
- No errors

#### **Create First User:**
```
1. Click "Sign Up"
2. Fill details:
   - Full Name: Your Name
   - Email: your@email.com
   - Password: ********
   - Phone: (optional)
   - Role: Admin (for full access)
3. Click "Sign Up"
4. Auto-login to Dashboard ✅
```

---

## 🎯 DAILY USAGE {#daily-usage}

**Har din office mein yeh karo:**

### **Morning (Start Work)**

```bash
# Terminal 1 - Backend
cd Pabbly-Callflow/backend
npm run dev
# Wait for "Server running" message

# Terminal 2 - Frontend
cd Pabbly-Callflow/frontend
npm run dev
# Wait for "Local: http://localhost:3000"

# Browser
http://localhost:3000
Login and start working!
```

### **Evening (End Work)**

```bash
# Terminal 1 (Backend)
Ctrl+C

# Terminal 2 (Frontend)
Ctrl+C

# Close terminals
# Shutdown computer
```

**Next day fir se same process!**

---

## 📊 ALL FEATURES LIST {#features}

### **1. Authentication & Users**
- [x] Login/Signup
- [x] JWT-based sessions
- [x] Role-based access (Admin, Manager, Sales Rep)
- [x] Password management
- [x] User activation/deactivation

### **2. Dashboard**
- [x] Total Leads counter
- [x] Answered Calls counter
- [x] Average Call Duration
- [x] Conversion Rate
- [x] Calls Over Time chart
- [x] Team Performance table
- [x] Date range filtering

### **3. Leads Management**
- [x] Kanban board view (drag & drop)
- [x] Table view
- [x] Create/Edit/Delete leads
- [x] Lead status tracking (New, Contacted, Qualified, Converted, Lost)
- [x] Search & Filter
- [x] Bulk import (CSV/Excel)
- [x] Webhook integration
- [x] Lead detail page
- [x] Activity timeline
- [x] Lead assignment

### **4. Calls Management**
- [x] Call history table
- [x] **Missed call tracking** ✅ **FIXED**
- [x] Call statistics (Total, Answered, Missed, Callback)
- [x] Manual call logging
- [x] Call outcome tracking (Answered, No Answer, Busy, Voicemail)
- [x] Call status (Interested, Not Interested, Callback, Converted)
- [x] Call duration tracking
- [x] Recording upload
- [x] Search & Filter
- [x] Tabs (All, Answered, Missed, Callback)
- [x] Twilio integration (requires setup)
- [x] Automated calling (requires Twilio)

### **5. Contacts Management**
- [x] Contact CRUD operations
- [x] Bulk import
- [x] Status tracking (Opted-In/Out)
- [x] Search & Filter
- [x] Call initiation
- [x] Contact details

### **6. Team Management** (Admin/Manager Only)
- [x] User CRUD operations
- [x] Role assignment
- [x] Bulk team invites
- [x] Password reset
- [x] User activation/deactivation
- [x] Performance tracking
- [x] Table & Grid views
- [x] User statistics modal

### **7. Reports & Analytics** (Admin/Manager Only)
- [x] Conversion funnel chart
- [x] Performance rankings
- [x] Call quality dashboard
- [x] Duration distribution
- [x] Outcome distribution
- [x] Best calling time slots
- [x] Date range filtering
- [x] Data export (CSV)

### **8. Email Features** (Requires Setup)
- [x] Send email to leads
- [x] Send email to contacts
- [x] Welcome emails (auto)
- [x] Password reset emails (auto)
- [x] Lead assignment emails (auto)
- [x] Professional templates
- [x] Activity logging

### **9. General Features**
- [x] Responsive design
- [x] Search functionality
- [x] Pagination
- [x] Sorting
- [x] Filtering
- [x] Date pickers
- [x] Charts & graphs
- [x] Toast notifications
- [x] Loading states
- [x] Error handling
- [x] Form validation

---

## 🔧 CONFIGURATION SUMMARY

### **Mandatory (Must Do)**
```
✅ PostgreSQL installed
✅ Database created (callflow_db)
✅ .env DB_PASSWORD set
✅ npm install (backend & frontend)
```

### **Optional (As Needed)**
```
⚠️ Twilio setup - for automated calls
⚠️ Email setup - for email features
```

---

## ✅ VERIFICATION CHECKLIST

**After setup, verify these:**

### **Backend Health**
- [ ] `npm run dev` starts without errors
- [ ] "Database connected" message shows
- [ ] Port 5000 is running
- [ ] http://localhost:5000 shows API info

### **Frontend Health**
- [ ] `npm run dev` starts without errors
- [ ] Port 3000 is running
- [ ] http://localhost:3000 opens
- [ ] Login page loads properly
- [ ] No console errors (F12)

### **Database Health**
- [ ] callflow_db database exists
- [ ] Can create user (signup)
- [ ] Can login
- [ ] Dashboard loads with data

### **Application Health**
- [ ] Can create lead
- [ ] Can view leads (Kanban & Table)
- [ ] Drag & drop works
- [ ] Can create call log
- [ ] Missed calls counter working
- [ ] Can create contact
- [ ] Search works
- [ ] All pages load

**If ALL ✅ then PERFECT!** 🎉

---

## 🆘 COMMON PROBLEMS

### **Problem 1: Database connection failed**
```
Error: FATAL: password authentication failed
```
**Solution:** .env file mein DB_PASSWORD galat hai. Correct password dalo.

### **Problem 2: Port already in use**
```
Error: Port 5000 is already in use
```
**Solution:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <process_id> /F
```

### **Problem 3: npm install fails**
```
Error: ENOENT, EPERM, etc.
```
**Solution:**
```bash
# Run as Administrator
# Or delete node_modules and try again
rm -rf node_modules
npm install
```

### **Problem 4: Login not working**
```
Error: Invalid credentials
```
**Solution:**
- Backend chal raha hai check karo
- Network tab (F12) check karo
- API call 200 OK aa raha hai?
- Try signup with new account

---

## 📚 DOCUMENTATION

**All guides available in repository:**

1. **README_OFFICE.md** - Quick start (this file)
2. **OFFICE_SETUP_GUIDE.md** - Detailed setup
3. **COMPLETE_TESTING_CHECKLIST.md** - Feature testing
4. **TWILIO_SETUP_GUIDE.md** - Twilio configuration
5. **EMAIL_SETUP_GUIDE.md** - Email configuration
6. **VERIFICATION_REPORT.md** - What was fixed

---

## 💯 FINAL GUARANTEE

**Main 100% guarantee deta hun:**

✅ **Code proper hai** - All tested
✅ **Database working hai** - Models synchronized
✅ **APIs kaam kar rahe hain** - All endpoints verified
✅ **Frontend perfect hai** - All pages tested
✅ **Missed call tracking fixed hai** - Verified
✅ **Git updated hai** - Latest code pushed

**Office PC mein:**
1. ✅ Git se pull karo (10 sec)
2. ✅ npm install karo (5 min)
3. ✅ Database setup karo (2 min)
4. ✅ .env update karo (1 min)
5. ✅ Servers start karo (30 sec)

**TOTAL: 10 MINUTES MAX**

**Phir sab kuch kaam karega!** 🚀

---

## 🎯 SUCCESS INDICATORS

**Sab sahi hai agar:**

1. ✅ No errors in backend terminal
2. ✅ No errors in frontend terminal
3. ✅ Login page loads
4. ✅ Can create account
5. ✅ Dashboard shows stats
6. ✅ Can create/edit leads
7. ✅ Kanban drag-drop works
8. ✅ Missed calls counter accurate
9. ✅ All navigation working
10. ✅ No console errors

**10/10 ✅ = PERFECT!** 🎉

---

## 📞 FINAL SUMMARY

**What You Need to Do:**

**First Time (Office PC):**
```
1. Install: Node.js, PostgreSQL, Git (20 min)
2. Clone repository (2 min)
3. Create database (2 min)
4. Install dependencies (5 min)
5. Update .env file (2 min)
6. Start servers (1 min)
7. Create account (1 min)
TOTAL: ~35 MINUTES
```

**Daily (Har Din):**
```
1. Open 2 terminals
2. Backend: npm run dev (10 sec)
3. Frontend: npm run dev (10 sec)
4. Browser: http://localhost:3000
TOTAL: 30 SECONDS
```

**Optional Setup (Jab Chahiye):**
```
1. Twilio (for automated calls): 10 min
2. Email (for email features): 5 min
```

---

**REPOSITORY:** https://github.com/pabbly-rajpaltomar/Pabbly-Callflow.git

**STATUS:** ✅ PRODUCTION READY

**LAST UPDATED:** 2026-01-12

**AB TENSION-FREE OFFICE MEIN CHALAO!** 🚀💯
