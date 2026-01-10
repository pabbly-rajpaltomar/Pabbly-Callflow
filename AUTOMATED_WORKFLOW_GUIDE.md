# Complete Automated Workflow - Pabbly Callflow

## Overview

Pabbly Callflow now has a **complete automated lead management system** with:
- ✅ **Kanban Pipeline View** - Drag & drop leads through stages
- ✅ **Webhook Automation** - Forms auto-create leads
- ✅ **Round-Robin Assignment** - Auto-assign to sales team
- ✅ **Activity Tracking** - Log all interactions (calls, emails, WhatsApp, meetings)
- ✅ **Real-time Analytics** - Track conversion funnel and team performance
- ✅ **Stage-based Workflow** - Visual pipeline management

---

## 1. Automated Lead Capture (Webhook)

### How It Works

When someone fills out a form on your website/landing page:
1. **Form submits** to webhook URL
2. **Lead auto-created** in Pabbly Callflow
3. **Auto-assigned** to sales rep (round-robin)
4. **Appears in "New Leads"** column in Kanban view
5. **Sales rep notified** (if notifications enabled)

### Webhook Setup

**Step 1: Get Webhook URL**
1. Go to **Leads** page
2. Click **"Webhook URL"** button
3. Copy the webhook URL (e.g., `https://your-domain.com/api/webhooks/lead-capture`)

**Step 2: Connect Your Form**

**For JotForm:**
```
1. Edit your form
2. Settings → Integrations → Search "Webhook"
3. Add New Webhook
4. Paste webhook URL
5. Test the integration
```

**For Google Forms:**
```
1. Open form → Responses tab
2. Click three dots → Get add-ons
3. Install "Form Publisher" or "Webhooks for Google Forms"
4. Configure webhook URL
5. Map fields: name, email, phone, company
```

**For TypeForm:**
```
1. Connect → Webhooks
2. Add webhook URL
3. Test the integration
```

**Step 3: Field Mapping**

The webhook accepts flexible field names:

**Name:** `name`, `full_name`, `contact_name`, `Name`, `Full Name`
**Phone:** `phone`, `phone_number`, `mobile`, `Phone`, `Mobile Number`
**Email:** `email`, `email_address`, `Email`
**Company:** `company`, `company_name`, `organization`, `Company`

### Example Webhook Payload

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "company": "Acme Corp"
}
```

### Testing Webhook

Use cURL or Postman:

```bash
curl -X POST https://your-domain.com/api/webhooks/lead-capture \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Lead",
    "phone": "+1234567890",
    "email": "test@example.com",
    "company": "Test Company"
  }'
```

Expected response:
```json
{
  "success": true,
  "message": "Lead captured successfully.",
  "data": {
    "lead_id": 123
  }
}
```

---

## 2. Kanban Pipeline View

### Pipeline Stages

The Kanban board has **5 stages**:

1. **📥 New Leads** - Freshly captured leads (webhook or manual)
2. **📞 Contacted** - First contact made (call, email, WhatsApp)
3. **✅ Qualified** - Lead is qualified and interested
4. **🎉 Converted** - Lead converted to customer/contact
5. **❌ Lost** - Lead lost or not interested

### Using the Kanban View

**Switch to Kanban View:**
1. Go to **Leads** page
2. Click the **Kanban icon** in the top-right toggle

**Drag & Drop:**
- Click and drag any lead card to move it to a different stage
- Activity is automatically logged
- Lead status updates instantly

**Quick Actions on Each Card:**
- 📧 **Send Email** - Opens default email client
- 💬 **WhatsApp** - Opens WhatsApp with message
- 📹 **Schedule Meet** - Creates Google Meet link
- 📞 **Log Call** - Log a phone call activity
- 👁️ **View Details** - See full lead information

**Activity Tracking:**
Each card shows recent activities:
- Last 2 activities displayed
- Icons indicate activity type (call, email, WhatsApp, meeting)
- Timestamp shows "X hours ago"

### Kanban Features

**Filters:**
- Filter by source (webhook, manual, import)
- Filter by assigned user
- Search across all fields

**Visual Indicators:**
- **Source badge** - Shows where lead came from (webhook/manual)
- **Assigned user avatar** - Shows who owns the lead
- **Activity count** - Number of interactions
- **Time indicator** - When lead was created

---

## 3. Activity Tracking System

### Automatic Activity Logging

**All interactions are logged automatically:**

1. **Stage Changes** - When you drag a lead to a new column
   ```
   Activity: "Moved from new to contacted"
   Type: stage_change
   User: John Doe
   Time: 2 hours ago
   ```

2. **Email Sent** - When you click "Send Email"
   ```
   Activity: "Sent email to john@example.com"
   Type: email
   User: Jane Smith
   Time: 1 hour ago
   ```

3. **WhatsApp Message** - When you click "WhatsApp"
   ```
   Activity: "Sent WhatsApp message to +1234567890"
   Type: whatsapp
   User: Bob Johnson
   Time: 30 minutes ago
   ```

4. **Meeting Scheduled** - When you schedule Google Meet
   ```
   Activity: "Scheduled Google Meet with John Doe"
   Type: meeting
   User: Sarah Lee
   Time: 15 minutes ago
   ```

5. **Call Logged** - When you log a phone call
   ```
   Activity: "Called +1234567890"
   Type: call
   User: Mike Brown
   Time: 5 minutes ago
   ```

### View Lead Activity Timeline

**Option 1: Kanban Card**
- Recent 2 activities shown on each card
- Hover to see full description

**Option 2: Lead Details (Future)**
- Full activity timeline
- Filter by activity type
- Export activity history

### API Endpoint for Logging Activities

**POST** `/api/leads/:id/activity`

```json
{
  "activity_type": "call",
  "description": "Discussed pricing options for 30 minutes",
  "duration_seconds": 1800,
  "metadata": {
    "call_outcome": "interested",
    "follow_up_required": true
  }
}
```

**Activity Types:**
- `call` - Phone call
- `email` - Email sent
- `whatsapp` - WhatsApp message
- `meeting` - Google Meet / video call
- `note` - General note
- `status_change` - Status updated
- `stage_change` - Stage moved

---

## 4. Complete Automation Workflow

### Scenario: Lead from Form to Conversion

**Step 1: Lead Capture (Automated)**
```
User fills form on website
↓
Webhook POST to /api/webhooks/lead-capture
↓
Lead created with status "new"
↓
Auto-assigned to Sales Rep #1 (round-robin)
↓
Appears in "New Leads" column
```

**Step 2: First Contact (Manual)**
```
Sales rep sees lead in Kanban
↓
Clicks "Send Email" or "WhatsApp"
↓
Activity logged: "Sent email to lead"
↓
Sales rep drags card to "Contacted" column
↓
Activity logged: "Moved from new to contacted"
```

**Step 3: Qualification (Manual)**
```
Sales rep calls lead
↓
Clicks "Log Call" and enters details
↓
Activity logged: "Called +1234567890 for 15 minutes"
↓
Lead is interested
↓
Drag card to "Qualified" column
↓
Activity logged: "Moved from contacted to qualified"
```

**Step 4: Conversion (Manual/Automated)**
```
Sales rep schedules demo/meeting
↓
Clicks "Schedule Meet"
↓
Activity logged: "Scheduled Google Meet"
↓
Lead converts to customer
↓
Click "Convert to Contact" or drag to "Converted"
↓
Lead status = "converted"
↓
Contact created in Contacts page
↓
Activity logged: "Converted to contact"
```

### Round-Robin Assignment

**How It Works:**
1. System finds all **active sales reps** (role = `sales_rep`, is_active = true)
2. Sorts by user ID (ascending)
3. Tracks **last assigned user** in `lead_assignment_config` table
4. Assigns to **next user** in sequence
5. Wraps around to first user when reaching end

**Example:**
```
Sales Reps: Alice (ID 5), Bob (ID 7), Charlie (ID 9)

Lead 1 → Assigned to Alice (ID 5)
Lead 2 → Assigned to Bob (ID 7)
Lead 3 → Assigned to Charlie (ID 9)
Lead 4 → Assigned to Alice (ID 5) [wrapped around]
Lead 5 → Assigned to Bob (ID 7)
```

**Fair Distribution:**
- Each sales rep gets equal leads
- No manual assignment needed
- Prevents lead hoarding
- Load balancing

---

## 5. Analytics & Reporting

### Real-Time Metrics (Dashboard)

**Conversion Funnel:**
```
New Leads (100) → 100%
Contacted (75)  → 75% conversion
Qualified (50)  → 66% conversion
Converted (25)  → 50% conversion
```

**Team Performance:**
```
Alice:   25 leads → 12 converted (48%)
Bob:     30 leads → 10 converted (33%)
Charlie: 20 leads → 8 converted (40%)
```

**Lead Sources:**
```
Webhook:  60% (auto-captured from forms)
Manual:   30% (manually added)
Import:   10% (bulk CSV import)
```

### Reports Page

**Conversion Funnel Report:**
- Visual funnel chart
- Stage-by-stage breakdown
- Average time in each stage
- Conversion rates

**Performance Rankings:**
- Sort by: Calls made, Conversion rate, Leads handled
- Top performers highlighted
- Team averages shown

**Activity Report:**
- Total activities by type
- Activity timeline
- Busiest hours/days
- Response time metrics

---

## 6. Complete Feature List

### Lead Management
- ✅ Kanban pipeline view with drag & drop
- ✅ Table view with pagination
- ✅ View toggle (Kanban ↔ Table)
- ✅ Search and filters
- ✅ Bulk import from CSV
- ✅ Manual lead creation
- ✅ Convert lead to contact
- ✅ Role-based access (admin, manager, sales_rep)

### Automation
- ✅ Webhook lead capture (public endpoint)
- ✅ Round-robin auto-assignment
- ✅ Flexible field mapping
- ✅ Duplicate detection (same phone within 24h)
- ✅ Activity logging on all actions

### Communication
- ✅ Email integration (mailto links)
- ✅ WhatsApp integration (wa.me links)
- ✅ Google Meet scheduling
- ✅ Call logging
- ✅ Activity timeline

### Analytics
- ✅ Conversion funnel
- ✅ Team performance metrics
- ✅ Lead source tracking
- ✅ Activity statistics
- ✅ CSV export

### UI/UX
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Drag & drop interface
- ✅ Real-time updates
- ✅ Loading states
- ✅ Error handling
- ✅ Toast notifications

---

## 7. API Endpoints

### Lead Endpoints

**GET** `/api/leads/kanban` - Get leads grouped by stage
```
Query params: source, assigned_to
Response: { new: [...], contacted: [...], qualified: [...], converted: [...], lost: [...] }
```

**PATCH** `/api/leads/:id/stage` - Update lead stage
```json
Request: { "lead_status": "contacted" }
Response: { success: true, data: { lead } }
```

**POST** `/api/leads/:id/activity` - Log lead activity
```json
Request: {
  "activity_type": "call",
  "description": "Called lead",
  "duration_seconds": 600
}
Response: { success: true, data: { activity } }
```

**GET** `/api/leads/:id/activities` - Get lead activities
```
Query params: limit (default: 50)
Response: { success: true, data: { activities: [...] } }
```

### Webhook Endpoint

**POST** `/api/webhooks/lead-capture` (Public, no auth required)
```json
Request: {
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "company": "Acme Corp"
}
Response: {
  "success": true,
  "message": "Lead captured successfully.",
  "data": { "lead_id": 123 }
}
```

---

## 8. Database Schema

### New Table: `lead_activities`

```sql
CREATE TABLE lead_activities (
  id SERIAL PRIMARY KEY,
  lead_id INTEGER NOT NULL REFERENCES leads(id),
  user_id INTEGER NOT NULL REFERENCES users(id),
  activity_type VARCHAR(50) CHECK (activity_type IN ('call', 'email', 'whatsapp', 'meeting', 'note', 'status_change', 'stage_change')),
  description TEXT,
  metadata JSONB DEFAULT '{}',
  old_value VARCHAR(100),
  new_value VARCHAR(100),
  duration_seconds INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Indexes:**
- `idx_lead_activities_lead_id` on `lead_id`
- `idx_lead_activities_user_id` on `user_id`
- `idx_lead_activities_type` on `activity_type`
- `idx_lead_activities_created_at` on `created_at DESC`

---

## 9. Setup Instructions

### Backend Setup

**Step 1: Run Migration**
```bash
cd backend
psql -U postgres -d pabbly_callflow -f migrations/003_lead_activities.sql
```

**Step 2: Restart Server**
```bash
npm run dev
```

### Frontend Setup

**Step 1: Install Dependencies** (if not already installed)
```bash
cd frontend
npm install date-fns
```

**Step 2: Start Development Server**
```bash
npm run dev
```

### Webhook Setup (Production)

**Option 1: ngrok (Development/Testing)**
```bash
ngrok http 5000
# Copy the HTTPS URL (e.g., https://abc123.ngrok.io)
# Webhook URL: https://abc123.ngrok.io/api/webhooks/lead-capture
```

**Option 2: Production Domain**
```
Your domain: https://callflow.pabbly.com
Webhook URL: https://callflow.pabbly.com/api/webhooks/lead-capture
```

---

## 10. Testing Checklist

### Webhook Automation
- [ ] Send test POST to webhook URL
- [ ] Verify lead created in database
- [ ] Verify lead appears in "New Leads" column
- [ ] Verify lead assigned to sales rep (round-robin)
- [ ] Test with different field names (full_name vs name)
- [ ] Test with missing optional fields (email, company)

### Kanban View
- [ ] Switch to Kanban view
- [ ] See all 5 stage columns
- [ ] See leads in correct columns
- [ ] Drag lead from "New" to "Contacted"
- [ ] Verify activity logged
- [ ] Verify lead status updated

### Activity Tracking
- [ ] Click "Send Email" on a lead card
- [ ] Verify activity logged
- [ ] Click "WhatsApp" on a lead card
- [ ] Verify activity logged
- [ ] Click "Schedule Meet"
- [ ] Verify activity logged
- [ ] Click "Log Call"
- [ ] Verify activity logged

### Round-Robin Assignment
- [ ] Create 3 test sales reps
- [ ] Send 10 webhook requests
- [ ] Verify each sales rep got ~3-4 leads
- [ ] Verify order is maintained

### Filters & Search
- [ ] Filter by source (webhook)
- [ ] Filter by assigned user
- [ ] Search by lead name
- [ ] Switch between Kanban and Table view

---

## 11. Troubleshooting

### Webhook Not Working

**Problem:** Leads not being created from webhook

**Check:**
1. Verify webhook URL is correct (should end with `/api/webhooks/lead-capture`)
2. Check server is running and accessible
3. Test with cURL/Postman first
4. Check server logs for errors
5. Verify `name` and `phone` fields are present in payload

### Round-Robin Not Distributing Evenly

**Problem:** All leads going to one sales rep

**Check:**
1. Verify multiple active sales reps exist (`is_active = true`)
2. Check `lead_assignment_config` table has correct data
3. Verify sales reps have role `sales_rep` (not `admin` or `manager`)

### Activities Not Logging

**Problem:** Activities not appearing in timeline

**Check:**
1. Verify `lead_activities` table exists
2. Check browser console for JavaScript errors
3. Verify user is authenticated
4. Check network tab for failed API calls

### Kanban Drag & Drop Not Working

**Problem:** Can't drag cards between columns

**Check:**
1. Verify browser supports drag & drop (all modern browsers do)
2. Check console for errors
3. Ensure cards have `draggable` attribute
4. Verify user has permission to update leads

---

## 12. Best Practices

### For Sales Reps

1. **Check "New Leads" daily** - Don't let leads sit too long
2. **Log all activities** - Click the action buttons to track interactions
3. **Move leads promptly** - Drag cards as soon as status changes
4. **Add notes** - Use activity logging to add context
5. **Convert qualified leads** - Move to "Converted" or click "Convert to Contact"

### For Managers

1. **Monitor funnel** - Check conversion rates weekly
2. **Review team performance** - Identify top performers and training needs
3. **Optimize assignment** - Ensure round-robin is distributing fairly
4. **Clean up lost leads** - Review and archive old "Lost" leads
5. **Track webhook sources** - See which forms generate best leads

### For Admins

1. **Test webhook regularly** - Ensure forms are still connected
2. **Monitor activity logs** - Check for unusual patterns
3. **Backup data** - Regular database backups
4. **Review permissions** - Ensure role-based access is correct
5. **Update documentation** - Keep team informed of changes

---

## 13. Future Enhancements

**Planned Features:**
- [ ] Email/SMS notifications when new lead assigned
- [ ] Auto-follow-up reminders (e.g., "Contact lead in 2 days")
- [ ] Lead scoring based on activity
- [ ] Custom pipeline stages (configurable)
- [ ] Bulk actions in Kanban (assign, delete, move)
- [ ] Mobile app for on-the-go lead management
- [ ] Integration with calendar apps (Google, Outlook)
- [ ] WhatsApp direct integration (not just links)
- [ ] VoIP calling directly from browser
- [ ] AI-powered lead prioritization
- [ ] Advanced reporting (custom date ranges, charts)
- [ ] Team collaboration (notes, mentions, tags)
- [ ] Lead import from other CRMs
- [ ] Automated email sequences
- [ ] SMS campaigns

---

## Summary

✅ **Webhook Automation** - Forms auto-create leads
✅ **Kanban Pipeline** - Visual drag & drop workflow
✅ **Activity Tracking** - All interactions logged
✅ **Round-Robin Assignment** - Fair lead distribution
✅ **Real-time Analytics** - Performance metrics
✅ **Complete Integration** - Email, WhatsApp, Google Meet

**The complete automated workflow is now live!** 🎉

Just refresh your browser and go to the Leads page to see the Kanban view in action.

---

**Last Updated:** January 2026
**Status:** ✅ COMPLETE & READY
