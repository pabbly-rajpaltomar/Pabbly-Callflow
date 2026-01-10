import React, { useState } from 'react';
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Alert,
  CircularProgress,
  Snackbar
} from '@mui/material';
import {
  Email as EmailIcon,
  WhatsApp as WhatsAppIcon,
  VideoCall as MeetIcon,
  MoreVert as MoreIcon,
  ContentCopy as CopyIcon,
  Send as SendIcon
} from '@mui/icons-material';
import emailService from '../../services/emailService';

const CommunicationActions = ({ contact, leadId, contactId, variant = 'menu' }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [emailDialog, setEmailDialog] = useState(false);
  const [meetDialog, setMeetDialog] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [sending, setSending] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  // Send email via server (Gmail SMTP)
  const handleSendEmailServer = async () => {
    if (!emailSubject.trim() || !emailBody.trim()) {
      showSnackbar('Please enter subject and message', 'error');
      return;
    }

    setSending(true);
    try {
      await emailService.sendEmail({
        to: contact.email,
        toName: contact.name || contact.full_name,
        subject: emailSubject,
        message: emailBody,
        contactId: contactId,
        leadId: leadId
      });

      showSnackbar('Email sent successfully!', 'success');
      setEmailDialog(false);
      setEmailSubject('');
      setEmailBody('');
      handleMenuClose();
    } catch (error) {
      console.error('Failed to send email:', error);
      showSnackbar(error.response?.data?.message || 'Failed to send email. Please check your email configuration.', 'error');
    } finally {
      setSending(false);
    }
  };

  // Fallback to mailto (opens email client)
  const handleSendEmailMailto = () => {
    const subject = encodeURIComponent(emailSubject || `Follow up with ${contact.name || contact.full_name}`);
    const body = encodeURIComponent(emailBody || `Hi ${contact.name || contact.full_name},\n\n`);
    const mailtoLink = `mailto:${contact.email}?subject=${subject}&body=${body}`;

    window.location.href = mailtoLink;
    setEmailDialog(false);
    setEmailSubject('');
    setEmailBody('');
    handleMenuClose();
  };

  const handleSendWhatsApp = () => {
    // Remove any non-numeric characters from phone
    const cleanPhone = contact.phone?.replace(/[^0-9+]/g, '');
    const message = encodeURIComponent(`Hi ${contact.name || contact.full_name}, I'm reaching out from our team.`);
    const whatsappLink = `https://wa.me/${cleanPhone}?text=${message}`;

    window.open(whatsappLink, '_blank');
    handleMenuClose();
  };

  const handleScheduleMeet = () => {
    setMeetDialog(true);
    handleMenuClose();
  };

  const handleCreateGoogleMeet = () => {
    // Create a Google Calendar event with Google Meet
    const eventName = encodeURIComponent(`Meeting with ${contact.name || contact.full_name}`);
    const details = encodeURIComponent(`Follow-up discussion with ${contact.name || contact.full_name}\nEmail: ${contact.email}\nPhone: ${contact.phone || 'N/A'}`);

    // Google Calendar with Google Meet integration
    const calendarLink = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${eventName}&details=${details}&add=${contact.email}`;

    window.open(calendarLink, '_blank');
    setMeetDialog(false);
  };

  const handleCopyMeetLink = () => {
    // Generate a quick Google Meet link
    const meetLink = 'https://meet.google.com/new';
    window.open(meetLink, '_blank');
    setMeetDialog(false);
  };

  // Email dialog content (shared between variants)
  const EmailDialogContent = () => (
    <Dialog open={emailDialog} onClose={() => !sending && setEmailDialog(false)} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ borderBottom: '1px solid #e5e7eb' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{
            width: 40,
            height: 40,
            borderRadius: 1,
            bgcolor: '#f0f9ff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <EmailIcon sx={{ color: '#2196f3' }} />
          </Box>
          <Typography variant="h6" fontWeight={600}>Send Email</Typography>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ pt: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
          <TextField
            label="To"
            value={contact.email}
            disabled
            fullWidth
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
          />
          <TextField
            label="Subject"
            value={emailSubject}
            onChange={(e) => setEmailSubject(e.target.value)}
            fullWidth
            required
            placeholder={`Follow up with ${contact.name || contact.full_name}`}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
          />
          <TextField
            label="Message"
            value={emailBody}
            onChange={(e) => setEmailBody(e.target.value)}
            multiline
            rows={6}
            fullWidth
            required
            placeholder={`Hi ${contact.name || contact.full_name},\n\nI wanted to follow up with you...\n\nBest regards`}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
          />
          <Alert severity="info" sx={{ borderRadius: 1.5, fontSize: '0.875rem' }}>
            Email will be sent directly from your configured Gmail account via SMTP.
          </Alert>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2, borderTop: '1px solid #e5e7eb', gap: 1 }}>
        <Button onClick={() => setEmailDialog(false)} disabled={sending} sx={{ color: '#6b7280' }}>
          Cancel
        </Button>
        <Button
          variant="outlined"
          onClick={handleSendEmailMailto}
          disabled={sending}
          startIcon={<EmailIcon />}
          sx={{ borderRadius: 1.5 }}
        >
          Use Email Client
        </Button>
        <Button
          variant="contained"
          onClick={handleSendEmailServer}
          disabled={sending || !emailSubject.trim() || !emailBody.trim()}
          startIcon={sending ? <CircularProgress size={18} color="inherit" /> : <SendIcon />}
          sx={{ borderRadius: 1.5 }}
        >
          {sending ? 'Sending...' : 'Send Email'}
        </Button>
      </DialogActions>
    </Dialog>
  );

  // Meet dialog content (shared between variants)
  const MeetDialogContent = () => (
    <Dialog open={meetDialog} onClose={() => setMeetDialog(false)} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ borderBottom: '1px solid #e5e7eb' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{
            width: 40,
            height: 40,
            borderRadius: 1,
            bgcolor: '#e3f2fd',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <MeetIcon sx={{ color: '#4285F4' }} />
          </Box>
          <Typography variant="h6" fontWeight={600}>Schedule Google Meet</Typography>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ pt: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Choose how you want to schedule a Google Meet with {contact.name || contact.full_name}:
          </Typography>

          <Button
            variant="outlined"
            fullWidth
            startIcon={<MeetIcon />}
            onClick={handleCreateGoogleMeet}
            sx={{ justifyContent: 'flex-start', py: 1.5, borderRadius: 1.5 }}
          >
            <Box sx={{ textAlign: 'left', ml: 1 }}>
              <Typography variant="body2" fontWeight="bold">
                Create Calendar Event with Meet
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Opens Google Calendar to schedule a meeting
              </Typography>
            </Box>
          </Button>

          <Button
            variant="outlined"
            fullWidth
            startIcon={<CopyIcon />}
            onClick={handleCopyMeetLink}
            sx={{ justifyContent: 'flex-start', py: 1.5, borderRadius: 1.5 }}
          >
            <Box sx={{ textAlign: 'left', ml: 1 }}>
              <Typography variant="body2" fontWeight="bold">
                Start Instant Meeting
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Creates a new Google Meet link immediately
              </Typography>
            </Box>
          </Button>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2, borderTop: '1px solid #e5e7eb' }}>
        <Button onClick={() => setMeetDialog(false)} sx={{ borderRadius: 1.5 }}>Close</Button>
      </DialogActions>
    </Dialog>
  );

  // Button variant (show individual buttons instead of menu)
  if (variant === 'buttons') {
    return (
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Tooltip title="Send Email">
          <IconButton
            size="small"
            color="primary"
            onClick={() => setEmailDialog(true)}
            disabled={!contact.email}
          >
            <EmailIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Send WhatsApp">
          <IconButton
            size="small"
            sx={{ color: '#25D366' }}
            onClick={handleSendWhatsApp}
            disabled={!contact.phone}
          >
            <WhatsAppIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Schedule Google Meet">
          <IconButton
            size="small"
            sx={{ color: '#4285F4' }}
            onClick={handleScheduleMeet}
          >
            <MeetIcon />
          </IconButton>
        </Tooltip>

        <EmailDialogContent />
        <MeetDialogContent />

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{ width: '100%', borderRadius: 2 }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    );
  }

  // Menu variant (default)
  return (
    <>
      <Tooltip title="Communication Options">
        <IconButton size="small" onClick={handleMenuOpen}>
          <MoreIcon />
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{ sx: { borderRadius: 2, minWidth: 180 } }}
      >
        <MenuItem
          onClick={() => { handleMenuClose(); setEmailDialog(true); }}
          disabled={!contact.email}
        >
          <ListItemIcon>
            <EmailIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Send Email</ListItemText>
        </MenuItem>

        <MenuItem
          onClick={handleSendWhatsApp}
          disabled={!contact.phone}
        >
          <ListItemIcon>
            <WhatsAppIcon fontSize="small" sx={{ color: '#25D366' }} />
          </ListItemIcon>
          <ListItemText>Send WhatsApp</ListItemText>
        </MenuItem>

        <MenuItem onClick={handleScheduleMeet}>
          <ListItemIcon>
            <MeetIcon fontSize="small" sx={{ color: '#4285F4' }} />
          </ListItemIcon>
          <ListItemText>Schedule Google Meet</ListItemText>
        </MenuItem>
      </Menu>

      <EmailDialogContent />
      <MeetDialogContent />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%', borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default CommunicationActions;
