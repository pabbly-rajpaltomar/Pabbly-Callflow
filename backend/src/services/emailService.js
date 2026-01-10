const nodemailer = require('nodemailer');
const config = require('../config/config');

// Create reusable transporter
let transporter = null;

const createTransporter = () => {
  if (!config.smtp.user || !config.smtp.password) {
    console.warn('Email configuration not set. Email features will be disabled.');
    return null;
  }

  return nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    secure: config.smtp.secure,
    auth: {
      user: config.smtp.user,
      pass: config.smtp.password
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

const getTransporter = () => {
  if (!transporter) {
    transporter = createTransporter();
  }
  return transporter;
};

// Verify email configuration
const verifyEmailConfig = async () => {
  const transport = getTransporter();
  if (!transport) {
    return { success: false, message: 'Email not configured' };
  }

  try {
    await transport.verify();
    return { success: true, message: 'Email configuration verified' };
  } catch (error) {
    console.error('Email verification failed:', error);
    return { success: false, message: error.message };
  }
};

// Send email
const sendEmail = async ({ to, subject, text, html, senderName }) => {
  const transport = getTransporter();

  if (!transport) {
    throw new Error('Email service not configured. Please set SMTP credentials in .env file.');
  }

  // If senderName provided, show "SenderName via CompanyName"
  const fromName = senderName
    ? `${senderName} (via ${config.smtp.fromName})`
    : config.smtp.fromName;

  const mailOptions = {
    from: `"${fromName}" <${config.smtp.fromEmail}>`,
    to: to,
    subject: subject,
    text: text,
    html: html
  };

  try {
    const info = await transport.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return {
      success: true,
      messageId: info.messageId,
      response: info.response
    };
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

// Send email to lead/contact
const sendEmailToContact = async ({ to, toName, subject, message, senderName }) => {
  const displaySenderName = senderName || config.smtp.fromName;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 0;
          background-color: #f5f5f5;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .email-body {
          background: #ffffff;
          border-radius: 8px;
          padding: 30px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .greeting {
          font-size: 18px;
          color: #111827;
          margin-bottom: 20px;
        }
        .message {
          font-size: 15px;
          color: #374151;
          white-space: pre-wrap;
        }
        .signature {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          color: #6b7280;
          font-size: 14px;
        }
        .footer {
          text-align: center;
          margin-top: 20px;
          font-size: 12px;
          color: #9ca3af;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="email-body">
          <div class="greeting">Hi ${toName || 'there'},</div>
          <div class="message">${message.replace(/\n/g, '<br>')}</div>
          <div class="signature">
            Best regards,<br>
            <strong>${displaySenderName}</strong>
          </div>
        </div>
        <div class="footer">
          Sent via Pabbly Callflow
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `Hi ${toName || 'there'},\n\n${message}\n\nBest regards,\n${displaySenderName}`;

  return sendEmail({ to, subject, text, html, senderName });
};

// Send welcome email to new user
const sendWelcomeEmail = async ({ to, userName, tempPassword }) => {
  const subject = 'Welcome to Pabbly Callflow - Your Account Details';

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 0;
          background-color: #f5f5f5;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%);
          color: white;
          padding: 30px;
          border-radius: 8px 8px 0 0;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
        }
        .content {
          background: white;
          padding: 30px;
          border-radius: 0 0 8px 8px;
        }
        .credentials {
          background: #f3f4f6;
          border-radius: 8px;
          padding: 20px;
          margin: 20px 0;
        }
        .credentials p {
          margin: 8px 0;
        }
        .credentials strong {
          color: #111827;
        }
        .password {
          font-family: monospace;
          font-size: 18px;
          background: #1e3a8a;
          color: white;
          padding: 10px 15px;
          border-radius: 4px;
          display: inline-block;
        }
        .warning {
          background: #fef3c7;
          border: 1px solid #fcd34d;
          border-radius: 8px;
          padding: 15px;
          margin-top: 20px;
          color: #92400e;
        }
        .button {
          display: inline-block;
          background: #2196f3;
          color: white;
          padding: 12px 30px;
          text-decoration: none;
          border-radius: 6px;
          margin-top: 20px;
        }
        .footer {
          text-align: center;
          margin-top: 20px;
          color: #9ca3af;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to Pabbly Callflow!</h1>
        </div>
        <div class="content">
          <p>Hi <strong>${userName}</strong>,</p>
          <p>Your account has been created successfully. Here are your login credentials:</p>

          <div class="credentials">
            <p><strong>Email:</strong> ${to}</p>
            <p><strong>Password:</strong></p>
            <p class="password">${tempPassword}</p>
          </div>

          <div class="warning">
            <strong>Important:</strong> Please change your password after your first login for security purposes.
          </div>

          <p>You can login at: <a href="${config.corsOrigin}">${config.corsOrigin}</a></p>
        </div>
        <div class="footer">
          This is an automated message from Pabbly Callflow
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `Welcome to Pabbly Callflow!

Hi ${userName},

Your account has been created successfully.

Login Credentials:
Email: ${to}
Password: ${tempPassword}

Important: Please change your password after your first login for security purposes.

Login at: ${config.corsOrigin}`;

  return sendEmail({ to, subject, text, html });
};

// Send password reset email
const sendPasswordResetEmail = async ({ to, userName, newPassword }) => {
  const subject = 'Pabbly Callflow - Your Password Has Been Reset';

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 0;
          background-color: #f5f5f5;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .content {
          background: white;
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .password {
          font-family: monospace;
          font-size: 18px;
          background: #1e3a8a;
          color: white;
          padding: 10px 15px;
          border-radius: 4px;
          display: inline-block;
          margin: 15px 0;
        }
        .warning {
          background: #fef3c7;
          border: 1px solid #fcd34d;
          border-radius: 8px;
          padding: 15px;
          margin-top: 20px;
          color: #92400e;
        }
        .footer {
          text-align: center;
          margin-top: 20px;
          color: #9ca3af;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="content">
          <h2>Password Reset</h2>
          <p>Hi <strong>${userName}</strong>,</p>
          <p>Your password has been reset. Here is your new password:</p>

          <p class="password">${newPassword}</p>

          <div class="warning">
            <strong>Security Notice:</strong> Please change this password immediately after logging in.
          </div>

          <p>If you did not request this password reset, please contact your administrator immediately.</p>
        </div>
        <div class="footer">
          This is an automated message from Pabbly Callflow
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `Password Reset

Hi ${userName},

Your password has been reset. Here is your new password:

${newPassword}

Security Notice: Please change this password immediately after logging in.

If you did not request this password reset, please contact your administrator immediately.`;

  return sendEmail({ to, subject, text, html });
};

// Send lead assignment notification
const sendLeadAssignmentEmail = async ({ to, userName, leadName, leadPhone, leadEmail }) => {
  const subject = 'New Lead Assigned to You - Pabbly Callflow';

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 0;
          background-color: #f5f5f5;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .content {
          background: white;
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .lead-card {
          background: #f0f9ff;
          border: 1px solid #bfdbfe;
          border-radius: 8px;
          padding: 20px;
          margin: 20px 0;
        }
        .lead-card h3 {
          margin: 0 0 15px 0;
          color: #1e40af;
        }
        .lead-card p {
          margin: 5px 0;
          color: #374151;
        }
        .button {
          display: inline-block;
          background: #2196f3;
          color: white;
          padding: 12px 30px;
          text-decoration: none;
          border-radius: 6px;
          margin-top: 20px;
        }
        .footer {
          text-align: center;
          margin-top: 20px;
          color: #9ca3af;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="content">
          <h2>New Lead Assigned!</h2>
          <p>Hi <strong>${userName}</strong>,</p>
          <p>A new lead has been assigned to you:</p>

          <div class="lead-card">
            <h3>${leadName}</h3>
            <p><strong>Phone:</strong> ${leadPhone || 'Not provided'}</p>
            <p><strong>Email:</strong> ${leadEmail || 'Not provided'}</p>
          </div>

          <p>Please follow up with this lead at your earliest convenience.</p>

          <a href="${config.corsOrigin}/leads" class="button">View Lead</a>
        </div>
        <div class="footer">
          This is an automated message from Pabbly Callflow
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `New Lead Assigned!

Hi ${userName},

A new lead has been assigned to you:

Name: ${leadName}
Phone: ${leadPhone || 'Not provided'}
Email: ${leadEmail || 'Not provided'}

Please follow up with this lead at your earliest convenience.

View lead at: ${config.corsOrigin}/leads`;

  return sendEmail({ to, subject, text, html });
};

module.exports = {
  sendEmail,
  sendEmailToContact,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendLeadAssignmentEmail,
  verifyEmailConfig
};
