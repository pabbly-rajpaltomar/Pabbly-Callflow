import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Get auth header
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

// Send email (generic)
export const sendEmail = async (emailData) => {
  const response = await axios.post(
    `${API_URL}/email/send`,
    emailData,
    getAuthHeader()
  );
  return response.data;
};

// Send email to a contact by ID
export const sendEmailToContact = async (contactId, emailData) => {
  const response = await axios.post(
    `${API_URL}/email/contact/${contactId}`,
    emailData,
    getAuthHeader()
  );
  return response.data;
};

// Send email to a lead by ID
export const sendEmailToLead = async (leadId, emailData) => {
  const response = await axios.post(
    `${API_URL}/email/lead/${leadId}`,
    emailData,
    getAuthHeader()
  );
  return response.data;
};

// Verify email configuration
export const verifyEmailConfig = async () => {
  const response = await axios.get(
    `${API_URL}/email/verify`,
    getAuthHeader()
  );
  return response.data;
};

// Send test email
export const sendTestEmail = async (to) => {
  const response = await axios.post(
    `${API_URL}/email/test`,
    { to },
    getAuthHeader()
  );
  return response.data;
};

export default {
  sendEmail,
  sendEmailToContact,
  sendEmailToLead,
  verifyEmailConfig,
  sendTestEmail
};
