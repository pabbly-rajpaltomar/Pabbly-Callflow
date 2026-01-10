# Webhook Setup Guide for Lead Integration

## Problem
External services like JotForm, Google Forms, Typeform, etc., cannot send data to `localhost` - they need a public URL.

## Solution: Use ngrok for Local Testing

### Step 1: Install ngrok

1. Download ngrok from: https://ngrok.com/download
2. Extract the file
3. Create a free account at https://ngrok.com/signup
4. Get your authtoken from the dashboard

### Step 2: Setup ngrok

Open a new terminal and run:

```bash
# Authenticate (one-time setup)
ngrok config add-authtoken YOUR_AUTH_TOKEN

# Create a tunnel to your backend (port 5000)
ngrok http 5000
```

You'll see output like:
```
Forwarding  https://abc123.ngrok-free.app -> http://localhost:5000
```

### Step 3: Get Your Webhook URL

Copy the ngrok URL and add the webhook endpoint:
```
https://abc123.ngrok-free.app/api/webhooks/lead-capture
```

### Step 4: Configure JotForm

1. Open your JotForm form
2. Go to **Settings** → **Integrations**
3. Search for **Webhooks** and click it
4. Add your webhook URL: `https://abc123.ngrok-free.app/api/webhooks/lead-capture`
5. Map the fields:
   - **Full Name** → `full_name` or `name`
   - **Email** → `email`
   - **Phone** → `phone`
   - **Company** (optional) → `company`

6. Save and test the webhook

### Step 5: Test the Integration

1. Fill out your JotForm
2. Submit it
3. Check your Pabbly Callflow **Leads** page
4. The lead should appear and be assigned to a sales rep automatically!

---

## Alternative: Pabbly Connect (Recommended for Production)

Since you're already familiar with Pabbly products, use **Pabbly Connect** to integrate:

1. Create a workflow in Pabbly Connect
2. **Trigger**: JotForm (New Submission)
3. **Action**: Webhooks by Pabbly → POST Request
4. **Webhook URL**: Your ngrok URL (or production URL later)
5. **Data Mapping**: Map form fields to:
   ```json
   {
     "name": "{{Full Name}}",
     "email": "{{Email}}",
     "phone": "{{Phone Number}}",
     "company": "{{Company Name}}"
   }
   ```

---

## Testing Without JotForm

You can also test using Postman or curl:

### Using Postman:
1. Create a new POST request
2. URL: `http://localhost:5000/api/webhooks/lead-capture`
3. Body (JSON):
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "company": "Acme Inc"
}
```
4. Send the request

### Using curl (Command Line):
```bash
curl -X POST http://localhost:5000/api/webhooks/lead-capture \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "company": "Acme Inc"
  }'
```

---

## Production Deployment

For production, deploy your backend to:
- **Heroku** (free tier available)
- **Railway** (free tier)
- **Render** (free tier)
- **DigitalOcean** ($5/month)
- **AWS/Azure/GCP**

Then use the production URL instead of ngrok.

---

## Supported Field Names

The webhook is flexible and accepts these variations:

| Field | Accepted Names |
|-------|---------------|
| Name | `name`, `full_name`, `contact_name` |
| Email | `email`, `email_address` |
| Phone | `phone`, `phone_number`, `mobile`, `contact_number` |
| Company | `company`, `company_name`, `organization` |

---

## Troubleshooting

### Lead not appearing?
1. Check backend logs for errors
2. Verify the webhook URL is correct
3. Test with Postman first
4. Check if sales reps exist and are active

### Duplicate leads?
The system prevents duplicate leads with the same phone number within 24 hours.

### Need to see webhook logs?
Check the `webhook_logs` table in your database to see all incoming webhook requests.
