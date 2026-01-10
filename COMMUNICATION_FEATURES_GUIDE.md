# Communication Features Guide

## Overview

Your Pabbly Callflow now includes integrated communication features that allow your sales team to reach out to leads and contacts via multiple channels without leaving the application.

## Available Communication Channels

### 1. Email
- Opens your default email client (Outlook, Gmail, etc.)
- Pre-fills recipient email address
- Allows customizing subject and message
- Perfect for formal communication and detailed follow-ups

### 2. WhatsApp
- Opens WhatsApp Web/Desktop
- Pre-fills the contact's phone number
- Includes a default greeting message
- Ideal for quick, informal communication

### 3. Google Meet
- **Option 1: Schedule Calendar Event**
  - Opens Google Calendar
  - Creates a new event with Google Meet link
  - Adds the contact as an attendee
  - Perfect for planning meetings in advance

- **Option 2: Instant Meeting**
  - Creates a new Google Meet link immediately
  - Opens in a new tab
  - Great for spontaneous discussions

---

## How to Use Communication Features

### From Leads Page

#### Desktop View (Table)
1. Navigate to **Leads** page
2. Find the lead you want to contact
3. Click the **3-dot menu icon** (⋮) in the Actions column
4. Select your communication channel:
   - **Send Email**
   - **Send WhatsApp**
   - **Schedule Google Meet**

#### Mobile View (Cards)
1. Navigate to **Leads** page
2. Find the lead card
3. You'll see 3 colored buttons at the bottom:
   - **Blue** = Email
   - **Green** = WhatsApp
   - **Blue** = Google Meet
4. Tap the desired button

### From Contacts Page

1. Navigate to **Contacts** page
2. Find the contact in the table
3. Click the **3-dot menu icon** (⋮) in the Actions column
4. Select your communication channel

---

## Email Communication

### Step-by-Step:

1. Click **Send Email** from the menu
2. A dialog appears with:
   - **To**: Pre-filled with contact's email
   - **Subject**: Customize or use the default
   - **Message**: Write your email content

3. Click **Open Email Client**
4. Your default email app opens with all fields pre-filled
5. Review and send the email

### Tips:
- Make sure you have a default email client configured (Outlook, Gmail, Thunderbird, etc.)
- You can modify the subject and message before opening the email client
- The email won't be sent automatically - you still need to click "Send" in your email client

---

## WhatsApp Communication

### Step-by-Step:

1. Click **Send WhatsApp** from the menu
2. WhatsApp Web/Desktop opens in a new tab
3. The contact's number is pre-filled
4. A default greeting message is included
5. Modify the message if needed and send

### Requirements:
- Contact must have a valid phone number
- WhatsApp must be installed on your phone
- WhatsApp Web must be linked to your phone

### Tips:
- The phone number is automatically cleaned (removes spaces, dashes, etc.)
- Works with both WhatsApp Web and WhatsApp Desktop app
- If WhatsApp isn't working, check that the contact's phone number is in the correct format (+country code)

---

## Google Meet Communication

### Option 1: Schedule Calendar Event (Recommended)

**Step-by-Step:**

1. Click **Schedule Google Meet**
2. Select **Create Calendar Event with Meet**
3. Google Calendar opens in a new tab
4. Event details are pre-filled:
   - **Title**: "Meeting with [Contact Name]"
   - **Details**: Contact's email and phone
   - **Guest**: Contact's email is added
5. Select date and time
6. Click **Save**
7. Google automatically creates a Meet link and sends invitations

**When to use:**
- Planning meetings in advance
- Need calendar reminders
- Want to send formal meeting invitations

### Option 2: Instant Meeting

**Step-by-Step:**

1. Click **Schedule Google Meet**
2. Select **Start Instant Meeting**
3. Google Meet opens with a new meeting link
4. Copy the link and share it with the contact via email/WhatsApp

**When to use:**
- Spontaneous discussions
- Quick demos or calls
- Immediate availability

---

## Best Practices

### Email
✅ **Do:**
- Personalize the subject line
- Keep messages concise and professional
- Include a clear call-to-action
- Proofread before sending

❌ **Don't:**
- Use all caps (looks like shouting)
- Send without context
- Forget to include your contact information

### WhatsApp
✅ **Do:**
- Keep messages short and friendly
- Use for quick questions or updates
- Respond promptly
- Use emojis moderately

❌ **Don't:**
- Send long paragraphs
- Use for formal proposals
- Message outside business hours
- Spam with multiple messages

### Google Meet
✅ **Do:**
- Schedule in advance when possible
- Send a meeting agenda beforehand
- Test your camera and mic before the call
- Join a few minutes early

❌ **Don't:**
- Schedule back-to-back meetings
- Forget to mute when not speaking
- Multitask during important meetings

---

## Troubleshooting

### "Email button is disabled"
**Cause**: The lead/contact doesn't have an email address
**Solution**: Edit the lead/contact and add an email address

### "WhatsApp button is disabled"
**Cause**: The lead/contact doesn't have a phone number
**Solution**: Edit the lead/contact and add a phone number

### "WhatsApp opens but doesn't find the contact"
**Cause**: Phone number format is incorrect
**Solution**:
- Ensure the phone number includes country code (e.g., +91 for India)
- Format: +919876543210 (no spaces or dashes needed)

### "Email client doesn't open"
**Cause**: No default email client configured
**Solution**:
- **Windows**: Set default in Settings → Apps → Default Apps → Email
- **Mac**: Set default in Mail app preferences
- **Alternative**: Copy the email address and compose manually

### "Google Meet requires sign-in"
**Cause**: You're not signed into Google
**Solution**: Sign in to your Google account first

### "Calendar event doesn't include Meet link"
**Cause**: Google Meet isn't enabled
**Solution**:
- Check your Google Workspace settings
- Ensure Google Meet is enabled for your account

---

## Integration with Workflow

### Recommended Workflow:

1. **New Lead Arrives** (via webhook from JotForm, etc.)
   - Lead automatically created and assigned to sales rep

2. **Sales Rep Reviews Lead** (Leads page)
   - Check lead information
   - Click **Send WhatsApp** for quick introduction

3. **Follow-up via Email**
   - After initial contact, send detailed email
   - Click **Send Email** to compose

4. **Schedule Demo/Discussion**
   - Once interest is confirmed
   - Click **Schedule Google Meet**
   - Choose a time and send calendar invite

5. **Convert to Contact**
   - After successful meeting
   - Click **Convert to Contact**

6. **Continued Engagement** (Contacts page)
   - Use communication buttons for ongoing relationship
   - Track interactions in call logs

---

## Mobile Responsiveness

All communication features work seamlessly on:
- Desktop browsers (Chrome, Edge, Firefox, Safari)
- Tablet devices
- Mobile phones

### Mobile Optimizations:
- **Leads Page (Mobile)**: Shows individual Email/WhatsApp/Meet buttons for easy tapping
- **Contacts Page**: Menu-based approach for cleaner interface
- All dialogs are responsive and touch-friendly

---

## Security & Privacy

### Data Handling:
- No communication data is stored in Pabbly Callflow
- All messages are sent through your own accounts (Gmail, WhatsApp, Google Meet)
- Contact information is encrypted in the database
- Only team members with access to the lead can initiate communication

### Compliance:
- Ensure you have permission to contact leads (GDPR, CCPA, etc.)
- Don't send unsolicited marketing messages via WhatsApp
- Include opt-out options in emails
- Record consent for communication in the notes field

---

## FAQs

**Q: Can I send emails directly from Pabbly Callflow without opening my email client?**
A: Not currently. The feature opens your default email client to ensure you can review and send from your own email account.

**Q: Does this work with Microsoft Teams instead of Google Meet?**
A: Currently, only Google Meet is supported. Microsoft Teams integration can be added in future updates.

**Q: Can I send bulk emails to multiple leads at once?**
A: Not through this interface. For bulk communication, consider using Pabbly Email Marketing or similar tools.

**Q: Are WhatsApp messages logged in the system?**
A: No, WhatsApp messages are sent directly through WhatsApp and are not logged in Pabbly Callflow.

**Q: Can I customize the default WhatsApp message template?**
A: The greeting message is currently fixed. You can modify it before sending each time.

**Q: What if a lead has multiple phone numbers?**
A: Only the primary phone number stored in the "phone" field is used. Update the field to switch numbers.

**Q: Can I use this with my company email (Office 365, GSuite)?**
A: Yes! It works with any configured email client, including Office 365 and Google Workspace.

---

## Future Enhancements (Coming Soon)

- 📧 Email templates for common scenarios
- 📱 SMS/Text message support
- 📞 Click-to-call integration
- 💬 Microsoft Teams integration
- 📊 Communication history tracking
- 🤖 AI-powered message suggestions
- 📅 Calendar availability sync

---

## Support

If you encounter any issues with the communication features, please:
1. Check the Troubleshooting section above
2. Verify your email/WhatsApp/Google account settings
3. Contact your system administrator
4. Report the issue at: https://github.com/your-repo/issues

---

**Last Updated**: January 2026
**Version**: 1.0
