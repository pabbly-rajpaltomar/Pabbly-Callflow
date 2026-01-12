# 📧 EMAIL SETUP GUIDE - GMAIL SMTP

**Problem:** Email send nahi ho raha - "Email service not configured" error

**Solution:** Gmail SMTP credentials .env file mein add karne hain

---

## ⚡ QUICK SETUP (5 MINUTES)

### **Step 1: Gmail App Password Banao**

1. **Google Account kholo:**
   ```
   https://myaccount.google.com/apppasswords
   ```

2. **Sign in karo** (your Gmail account)

3. **App Password Generate karo:**
   - App name: `Pabbly Callflow`
   - Click **"Create"**
   - **16-character password** milega (e.g., `abcd efgh ijkl mnop`)
   - **Copy kar lo** - yeh password sirf ek baar dikhta hai!

### **Step 2: .env File Update Karo**

**File Location:** `backend/.env`

**Add these lines:** (Already added, just update values)
```env
# Email Configuration (Gmail SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your.email@gmail.com          # ← Apna Gmail address
SMTP_PASSWORD=abcd efgh ijkl mnop        # ← App password (16 chars)
SMTP_FROM_NAME=Pabbly Callflow
SMTP_FROM_EMAIL=your.email@gmail.com    # ← Same Gmail address
```

**Replace karo:**
- `your.email@gmail.com` → Tumhara Gmail address (e.g., `rajpal@pabbly.com`)
- `abcd efgh ijkl mnop` → Google App Password jo generate kiya

### **Step 3: Backend Restart Karo**

```bash
# Backend terminal mein
Ctrl+C  # Server stop karo
npm run dev  # Fir se start karo
```

### **Step 4: Test Karo** ✅

1. Application kholo (http://localhost:3000)
2. Leads page jao
3. Kisi lead par Email icon click karo
4. Email compose karo
5. **Send Email** button dabao
6. ✅ **Email send ho jayega!**

---

## 🔧 DETAILED SETUP

### **Prerequisites:**

1. **Gmail Account** (e.g., rajpal@pabbly.com)
2. **2-Factor Authentication ENABLED** hona chahiye
   - Check: https://myaccount.google.com/security
   - Agar disabled hai to enable karo first

### **Why App Password?**

Gmail security ke liye **normal password** nahi use kar sakte applications mein.
**App Password** special password hai jo sirf app ke liye hota hai.

---

## 📝 STEP-BY-STEP GUIDE

### **1. Enable 2-Factor Authentication** (Agar nahi hai)

```
1. https://myaccount.google.com/security kholo
2. "2-Step Verification" par click karo
3. "Get Started" button dabao
4. Phone number verify karo
5. Turn On karo
```

### **2. Generate App Password**

```
1. https://myaccount.google.com/apppasswords kholo
2. Sign in karo (with 2FA)
3. Select App: "Mail"
4. Select Device: "Other (Custom name)"
5. Enter name: "Pabbly Callflow"
6. Click "Generate"
7. 16-character password milega
8. COPY KARO! (Yeh fir se nahi milega)
```

**Example Password:**
```
abcd efgh ijkl mnop
(spaces included - copy as is)
```

### **3. Update .env File**

**Location:** `backend/.env`

**Find this section:**
```env
# Email Configuration (Gmail SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your.email@gmail.com
SMTP_PASSWORD=your_app_password
SMTP_FROM_NAME=Pabbly Callflow
SMTP_FROM_EMAIL=your.email@gmail.com
```

**Update:**
```env
SMTP_USER=rajpal@pabbly.com
SMTP_PASSWORD=abcd efgh ijkl mnop
SMTP_FROM_EMAIL=rajpal@pabbly.com
```

**Save file** (Ctrl+S)

### **4. Restart Backend**

```bash
# Terminal 1 (Backend)
Ctrl+C
npm run dev
```

**Success Indicator:**
```
✓ Server running on port 5000
```

(Email warning nahi dikhna chahiye agar sahi configure kiya)

### **5. Test Email**

#### **Option A: From Application**

```
1. Login karo
2. Leads page kholo
3. Kisi lead par email icon click karo
4. Email compose karo:
   - To: (auto-filled)
   - Subject: "Test Email"
   - Message: "This is a test email"
5. Click "Send Email"
6. ✅ Success message aana chahiye
7. Check inbox - email aaya hoga!
```

#### **Option B: API Test** (Advanced)

```bash
curl -X POST http://localhost:5000/api/email/test \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"to":"your.test@email.com"}'
```

---

## 🎯 CONFIGURATION OPTIONS

### **Gmail SMTP Settings (Default)**
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
```

### **Other Email Providers**

#### **Outlook/Hotmail**
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your.email@outlook.com
SMTP_PASSWORD=your_password
```

#### **Yahoo Mail**
```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your.email@yahoo.com
SMTP_PASSWORD=your_app_password
```

#### **Custom SMTP**
```env
SMTP_HOST=mail.yourcompany.com
SMTP_PORT=587  # or 465, 25
SMTP_SECURE=false  # true if port 465
SMTP_USER=your.username
SMTP_PASSWORD=your_password
```

---

## 🧪 TESTING CHECKLIST

### **Test 1: Send Email from Leads**
- [ ] Lead card pe email icon click karo
- [ ] Email dialog open ho raha hai
- [ ] To, Subject, Message fields visible
- [ ] Send button kaam kar raha hai
- [ ] Success message aa raha hai
- [ ] Email actually deliver ho raha hai

### **Test 2: Email Templates**
- [ ] Welcome email (new user invite)
- [ ] Password reset email
- [ ] Lead assignment email
- [ ] Custom message to lead/contact

### **Test 3: Error Handling**
- [ ] Wrong password pe proper error
- [ ] Invalid email address validation
- [ ] Network error handling

---

## 🆘 TROUBLESHOOTING

### **Problem 1: "Email service not configured"**

**Reason:** `.env` file mein SMTP credentials nahi hain

**Solution:**
```
1. .env file kholo
2. SMTP_USER aur SMTP_PASSWORD check karo
3. Values update karo
4. Backend restart karo
```

### **Problem 2: "Authentication failed"**

**Reason:** Wrong password ya 2FA not enabled

**Solution:**
```
1. Google Account → Security check karo
2. 2-Factor Authentication enabled hai?
3. App Password fir se generate karo
4. .env file update karo
5. Backend restart karo
```

### **Problem 3: "Connection timeout"**

**Reason:** Internet connection ya firewall

**Solution:**
```
1. Internet connection check karo
2. Port 587 blocked to nahi?
3. Firewall settings check karo
4. Try SMTP_PORT=465 with SMTP_SECURE=true
```

### **Problem 4: Email send but not received**

**Reason:** Spam folder ya wrong recipient

**Solution:**
```
1. Spam/Junk folder check karo
2. Recipient email address sahi hai?
3. Gmail "Sent" folder check karo
4. Recipient's email provider blocking to nahi?
```

---

## 📊 EMAIL FEATURES

### **1. Send Email to Lead**
```
Location: Leads page → Email icon
Purpose: Direct email to lead
Template: Customizable message
Tracking: Logged in lead activities
```

### **2. Send Email to Contact**
```
Location: Contacts page → Email icon
Purpose: Email to existing contact
Template: Professional format
Tracking: Activity log
```

### **3. Welcome Email** (Auto)
```
Trigger: New team member added
Content: Login credentials
Purpose: Account setup
```

### **4. Password Reset Email** (Auto)
```
Trigger: Admin resets user password
Content: New temporary password
Security: Must change on login
```

### **5. Lead Assignment Email** (Auto)
```
Trigger: Lead assigned to user
Content: Lead details + action required
Purpose: Notification
```

---

## 💡 BEST PRACTICES

### **1. Use Professional Email**
```
✅ GOOD: rajpal@pabbly.com
❌ BAD: mypersonal123@gmail.com
```

### **2. Test Before Production**
```
1. Apne khud ke email ko bhejo pehle
2. Spam folder check karo
3. Email formatting verify karo
4. Links kaam kar rahe hain check karo
```

### **3. Monitor Email Usage**
```
Gmail Free: 500 emails/day limit
Business: Higher limits
Track: Sent emails count
Alert: Approaching limit
```

### **4. Secure Your Credentials**
```
✅ Use App Password (not actual password)
✅ Keep .env file secure
❌ Don't commit .env to Git
❌ Don't share credentials
```

---

## 🔒 SECURITY TIPS

1. **Never use actual Gmail password**
   - Always use App Password

2. **Revoke unused App Passwords**
   - https://myaccount.google.com/apppasswords
   - Delete old/unused passwords

3. **Monitor account activity**
   - https://myaccount.google.com/notifications
   - Check for suspicious logins

4. **Use dedicated email for app**
   - Create separate Gmail for application
   - Don't use personal email

---

## ✅ OFFICE PC SETUP

**Ek baar setup karna hai, fir permanent kaam karega!**

### **Initial Setup (One Time):**

```bash
# 1. Repository clone karo
git clone https://github.com/pabbly-rajpaltomar/Pabbly-Callflow.git
cd Pabbly-Callflow

# 2. Backend dependencies install
cd backend
npm install

# 3. .env file edit karo
notepad .env

# Add/Update:
SMTP_USER=rajpal@pabbly.com
SMTP_PASSWORD=your_app_password_here
SMTP_FROM_EMAIL=rajpal@pabbly.com

# Save aur close karo

# 4. Frontend dependencies install
cd ../frontend
npm install

# DONE! Setup complete ✅
```

### **Daily Usage (Har Din):**

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev

# Browser
http://localhost:3000

# Email feature ready! ✅
```

**Bas configuration ek baar karna hai!**
**Phir email turant kaam karega har baar!** ✅

---

## 📞 SUPPORT

**Gmail Help:**
- App Passwords: https://support.google.com/accounts/answer/185833
- 2FA Setup: https://support.google.com/accounts/answer/185839
- SMTP Settings: https://support.google.com/mail/answer/7126229

**Application:**
- Error logs: Backend terminal
- Test endpoint: POST /api/email/test
- Verification: GET /api/email/verify

---

## 🎉 SUCCESS CHECKLIST

**Email Setup Complete Kab Hai?**

- [ ] Google App Password generated
- [ ] .env file mein credentials updated
- [ ] Backend restarted without errors
- [ ] Test email sent successfully
- [ ] Test email received in inbox
- [ ] Email from leads page working
- [ ] Email formatting correct
- [ ] No "not configured" errors

**Agar SAB ✅ hain to EMAIL READY HAI!** 🚀

---

## 📋 QUICK REFERENCE

**Configuration File:** `backend/.env`

**Required Variables:**
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your.email@gmail.com
SMTP_PASSWORD=your_app_password
SMTP_FROM_NAME=Pabbly Callflow
SMTP_FROM_EMAIL=your.email@gmail.com
```

**Test Command:**
```bash
# From application UI
Leads → Email Icon → Send

# Or API test
POST /api/email/test
Body: {"to": "test@email.com"}
```

**Verify Command:**
```bash
GET /api/email/verify
Response: {"success": true, "message": "Email configuration verified"}
```

---

**SUMMARY:**

1. **Google App Password banao** (2 minutes)
2. **.env file update karo** (1 minute)
3. **Backend restart karo** (30 seconds)
4. **Test email bhejo** (1 minute)

**Total Time: 5 MINUTES MAX!** ⚡

**Email Feature READY!** ✅

---

**Last Updated:** 2026-01-12
**Status:** Code Ready | Email Setup Required
