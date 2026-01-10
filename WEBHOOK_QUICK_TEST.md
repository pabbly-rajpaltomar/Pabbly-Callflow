# ⚡ Quick Webhook Test - 2 Minutes

## Fastest Way to Test Right Now:

### Option 1: Open the Test Form (30 seconds)

1. **Double-click** this file in your project folder:
   ```
   test-webhook-form.html
   ```

2. **Fill the form** with any test data

3. **Click "Submit Lead"**

4. **Open CRM**: http://localhost:3000/leads

5. **Check "New Leads" column** - Your test lead should be there!

---

### Option 2: Use Browser Console (15 seconds)

1. **Open your CRM** in browser: http://localhost:3000

2. **Press F12** to open Developer Console

3. **Paste this code** in Console tab:

```javascript
fetch('http://localhost:3001/api/webhooks/lead-capture', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Quick Test User',
    email: 'quick@test.com',
    phone: '+1234567890',
    company: 'Test Co',
    source: 'console-test'
  })
})
.then(r => r.json())
.then(d => console.log('✅ Lead created:', d))
.catch(e => console.error('❌ Error:', e));
```

4. **Press Enter**

5. **Refresh the Leads page** - New lead appears!

---

### Option 3: Command Line (10 seconds)

**Windows (PowerShell):**
```powershell
Invoke-RestMethod -Uri "http://localhost:3001/api/webhooks/lead-capture" -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"name":"CLI Test","email":"cli@test.com","phone":"+1999999999","source":"cli"}'
```

**Mac/Linux (Terminal):**
```bash
curl -X POST http://localhost:3001/api/webhooks/lead-capture \
  -H "Content-Type: application/json" \
  -d '{"name":"CLI Test","email":"cli@test.com","phone":"+1999999999","source":"cli"}'
```

Then refresh CRM to see the lead!

---

## What to Check:

After submitting:

1. ✅ Lead appears in "New Leads" Kanban column
2. ✅ Lead is assigned to a sales rep (see avatar/name on card)
3. ✅ Submit again → Different sales rep assigned (round-robin)
4. ✅ Can drag lead to "Contacted" column
5. ✅ Can click 3-dot menu for quick actions

---

## Troubleshooting:

**❌ Nothing happens?**
- Make sure backend is running: `cd backend && npm run dev`
- Check URL is correct: `http://localhost:3001/api/webhooks/lead-capture`

**❌ Lead not appearing?**
- Hard refresh browser: `Ctrl + Shift + R`
- Check you're viewing "New Leads" column
- If you're a sales_rep role, you only see YOUR assigned leads (login as admin to see all)

**❌ Error "Duplicate lead"?**
- Change the phone number - system blocks same phone within 24h

---

## Your Webhook URL:

**Local (Testing):**
```
http://localhost:3001/api/webhooks/lead-capture
```

**Production (When Deployed):**
```
https://yourdomain.com/api/webhooks/lead-capture
```

Use this URL in:
- Google Forms
- Typeform
- Website contact forms
- Landing pages
- Any form builder that supports webhooks

---

## Complete Testing Guide:

For detailed testing instructions, see: **WEBHOOK_TESTING_GUIDE.md**
