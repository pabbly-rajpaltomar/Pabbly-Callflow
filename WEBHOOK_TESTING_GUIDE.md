# 🚀 Complete Webhook Testing Guide

## What You'll Test

This guide will show you the **complete automated lead capture flow**:

1. Form submission → Webhook receives data
2. Lead automatically created in CRM
3. Lead automatically assigned to sales rep (round-robin)
4. Lead appears in "New Leads" column in Kanban view
5. Activity logged automatically

---

## Prerequisites

Before starting, make sure:
- ✅ Backend is running on `http://localhost:3001`
- ✅ Frontend is running on `http://localhost:3000`
- ✅ You're logged into the CRM
- ✅ You have at least 2 sales reps in your team (to test round-robin)

---

## Method 1: Using the Test HTML Form (Easiest)

### Step 1: Open the Test Form

1. Navigate to your project folder
2. Find the file: `test-webhook-form.html`
3. **Double-click** to open it in your browser
4. You should see a beautiful purple gradient form

### Step 2: Configure Webhook URL (Already Done!)

The form comes pre-configured with:
```
http://localhost:3001/api/webhooks/lead-capture
```

This is your local webhook endpoint. When you deploy, this will change to:
```
https://yourdomain.com/api/webhooks/lead-capture
```

### Step 3: Fill Out the Form

Enter test data:
- **Name:** Test User 1
- **Email:** test1@example.com
- **Phone:** +1 234 567 8900
- **Company:** Test Company
- **Message:** This is a test lead from the webhook form

### Step 4: Submit!

1. Click **"Submit Lead"** button
2. You'll see a loading spinner
3. Success message appears: "✅ Lead created successfully!"
4. It will show you the assigned sales rep

### Step 5: Verify in CRM

1. Go to your CRM: `http://localhost:3000/leads`
2. Look at the **"New Leads"** column
3. You should see "Test User 1" as a new lead card
4. Check the assigned sales rep name on the card

### Step 6: Test Round-Robin Assignment

1. Submit the form again with different data:
   - **Name:** Test User 2
   - **Email:** test2@example.com
   - **Phone:** +1 234 567 8901
2. Check the CRM again
3. "Test User 2" should be assigned to a **different sales rep**
4. Submit a 3rd time - it should rotate back to the first rep

---

## Method 2: Using Postman or cURL

### Using Postman:

1. **Open Postman**
2. **Create new request**
3. **Set method to:** POST
4. **URL:** `http://localhost:3001/api/webhooks/lead-capture`
5. **Headers:**
   - Content-Type: `application/json`
6. **Body (raw JSON):**

```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "phone": "+1 555 123 4567",
  "company": "Acme Corporation",
  "message": "Interested in your services",
  "source": "website"
}
```

7. **Click Send**
8. You should get response:

```json
{
  "success": true,
  "message": "Lead captured successfully.",
  "data": {
    "lead": {
      "id": 5,
      "name": "John Doe",
      "email": "john.doe@example.com",
      "phone": "+1 555 123 4567",
      "company": "Acme Corporation",
      "lead_status": "new",
      "source": "website",
      "assigned_to": 2,
      "assignedUser": {
        "id": 2,
        "full_name": "Sales Rep Name"
      }
    }
  }
}
```

### Using cURL (Command Line):

Open terminal and run:

```bash
curl -X POST http://localhost:3001/api/webhooks/lead-capture \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "email": "jane.smith@example.com",
    "phone": "+1 555 987 6543",
    "company": "Tech Startup Inc",
    "message": "Looking for a demo",
    "source": "linkedin"
  }'
```

---

## Method 3: Integrate with Real Forms

### Google Forms Integration

1. **Create a Google Form** with fields:
   - Name
   - Email
   - Phone
   - Company
   - Message

2. **Install Google Forms Add-on:** "Email Notifications for Google Forms" or use Google Apps Script

3. **Configure webhook:** Send responses to `http://localhost:3001/api/webhooks/lead-capture`

### Typeform Integration

1. Go to Typeform → Connect → Webhooks
2. Add webhook URL: `http://localhost:3001/api/webhooks/lead-capture`
3. Map fields: name, email, phone, company, message

### Custom Website Form

Add this JavaScript to your website:

```html
<form id="contactForm">
  <input type="text" name="name" required>
  <input type="email" name="email" required>
  <input type="tel" name="phone" required>
  <input type="text" name="company">
  <textarea name="message"></textarea>
  <button type="submit">Submit</button>
</form>

<script>
document.getElementById('contactForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData);
  data.source = 'website';

  const response = await fetch('http://localhost:3001/api/webhooks/lead-capture', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  if (response.ok) {
    alert('Thank you! We will contact you soon.');
    e.target.reset();
  }
});
</script>
```

---

## What Happens Behind the Scenes

### 1. Webhook Receives Data
```javascript
POST /api/webhooks/lead-capture
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "company": "Acme Inc",
  "message": "Interested in product"
}
```

### 2. Backend Processing
- Validates required fields (name, email OR phone)
- Checks for duplicates (same phone within 24 hours)
- Gets next sales rep in round-robin rotation
- Creates lead in database with status "new"
- Logs webhook in `webhook_logs` table
- Returns success response

### 3. Round-Robin Assignment Algorithm
```
Sales Reps: [Rep A, Rep B, Rep C]
Lead 1 → Rep A
Lead 2 → Rep B
Lead 3 → Rep C
Lead 4 → Rep A (cycles back)
Lead 5 → Rep B
...
```

### 4. Lead Appears in CRM
- Lead instantly visible in "New Leads" column
- Assigned sales rep sees it in their filtered view
- Activity timeline starts tracking
- Ready for sales rep to take action

---

## Testing Checklist

Complete this checklist to verify everything works:

### Basic Functionality
- [ ] Submit form with valid data → Lead created
- [ ] Lead appears in "New Leads" Kanban column
- [ ] Lead is assigned to a sales rep
- [ ] Assigned rep name shows on lead card

### Round-Robin Assignment
- [ ] Submit 3 leads → Each assigned to different rep
- [ ] Submit 4th lead → Assigned to first rep again (cycling)
- [ ] Inactive sales reps are NOT assigned leads

### Duplicate Detection
- [ ] Submit same phone number twice within 1 minute → Second rejected
- [ ] Submit same phone after 24+ hours → New lead created
- [ ] Submit same email, different phone → New lead created

### Field Mapping Flexibility
- [ ] Submit with "full_name" instead of "name" → Works
- [ ] Submit with "mobile" instead of "phone" → Works
- [ ] Submit without company → Still creates lead
- [ ] Submit without message → Still creates lead

### Data Validation
- [ ] Submit without name → Rejected
- [ ] Submit without email AND phone → Rejected
- [ ] Submit with email OR phone only → Works
- [ ] Submit with invalid JSON → Returns error 400

### CRM Integration
- [ ] Drag lead from "New" to "Contacted" → Updates
- [ ] Click 3-dot menu → Actions available
- [ ] Click "Send Email" → Opens email client
- [ ] Click "WhatsApp" → Opens WhatsApp
- [ ] View lead details → Shows all fields

---

## Troubleshooting

### Error: "Network error. Make sure your backend is running"

**Solution:**
1. Check if backend is running: `http://localhost:3001/api/health`
2. Restart backend: `cd backend && npm run dev`
3. Check firewall settings

### Error: "Failed to create lead"

**Possible causes:**
1. **Duplicate phone number** - Wait 24 hours or use different phone
2. **Missing required fields** - Must have name + (email OR phone)
3. **Database connection error** - Check PostgreSQL is running

### Lead created but not appearing in CRM

**Solution:**
1. **Refresh browser** (Ctrl + F5)
2. **Clear filters** - Make sure no filters are active
3. **Check assigned rep** - If you're a sales_rep, you only see YOUR leads
4. **Login as admin** - Admins see all leads

### Round-robin not working (same rep getting all leads)

**Solution:**
1. **Check active reps:** Only `is_active = true` reps get assigned
2. **Check role:** Only `role = 'sales_rep'` users get assigned
3. **Create more reps:** Need at least 2 active sales reps to test

---

## Advanced Testing

### Test Webhook Logs

1. Go to database
2. Query: `SELECT * FROM webhook_logs ORDER BY created_at DESC LIMIT 10;`
3. You should see all webhook submissions
4. Check `success` column (should be `true`)
5. Check `payload` column (contains original form data)

### Test Lead Activities

1. After creating lead via webhook
2. Query: `SELECT * FROM lead_activities WHERE lead_id = [lead_id];`
3. Should see activity: "Lead created via webhook"

### Test Assignment Config

1. Query: `SELECT * FROM lead_assignment_config LIMIT 1;`
2. Note the `last_assigned_user_id`
3. Create new lead via webhook
4. Query again - `last_assigned_user_id` should have changed

---

## Production Deployment

When you deploy to production:

### 1. Update Webhook URL

Change from:
```
http://localhost:3001/api/webhooks/lead-capture
```

To:
```
https://yourdomain.com/api/webhooks/lead-capture
```

### 2. Update All Forms

Update webhook URL in:
- Google Forms integrations
- Typeform integrations
- Website contact forms
- Landing pages
- Email capture forms

### 3. Add Webhook Security (Recommended)

Add signature validation to prevent spam:

```javascript
// In webhookController.js
const crypto = require('crypto');

const validateSignature = (payload, signature, secret) => {
  const hash = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex');
  return hash === signature;
};
```

### 4. Monitor Webhook Logs

Set up alerts for:
- Failed webhook submissions
- Duplicate rejections
- Invalid data formats

---

## Next Steps

After testing webhooks, explore:

1. **Activity Tracking** - See all logged activities per lead
2. **Drag & Drop** - Move leads through pipeline stages
3. **Quick Actions** - Email, WhatsApp, Calls from Kanban cards
4. **Convert to Contact** - When lead becomes customer
5. **Analytics** - View conversion funnel and performance

---

## Support

If you encounter issues:
1. Check browser console (F12) for errors
2. Check backend logs for error messages
3. Verify database connection
4. Test with Postman/cURL first before testing with forms

**Happy Testing! 🚀**
