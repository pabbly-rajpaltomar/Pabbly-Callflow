import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  Chip,
  Avatar,
  Grid,
  Divider,
  Tab,
  Tabs,
  CircularProgress,
  Alert,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  RadioGroup,
  FormControlLabel,
  Radio,
  Slider,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  WhatsApp as WhatsAppIcon,
  VideoCall as MeetIcon,
  Edit as EditIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  Notes as NotesIcon,
  Send as SendIcon,
  CallEnd as CallEndIcon,
  PhoneInTalk as PhoneInTalkIcon,
  RingVolume as RingVolumeIcon,
  CheckCircle as SuccessIcon,
  Cancel as CancelIcon,
  Schedule as ScheduleIcon,
  PhoneCallback as CallbackIcon,
  ContentCopy as CopyIcon,
} from '@mui/icons-material';
import ActivityTimeline from '../components/Shared/ActivityTimeline';
import leadService from '../services/leadService';
import callService from '../services/callService';
import emailService from '../services/emailService';
import { format, isValid } from 'date-fns';

// Safe date formatter
const formatDate = (dateStr, formatStr = 'MMM dd, yyyy h:mm a') => {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return isValid(date) ? format(date, formatStr) : '-';
};

const LeadDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const pollIntervalRef = useRef(null);

  const [lead, setLead] = useState(null);
  const [activities, setActivities] = useState([]);
  const [calls, setCalls] = useState([]);
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentTab, setCurrentTab] = useState(0);

  // Call Dialog State (for Twilio - legacy)
  const [callDialogOpen, setCallDialogOpen] = useState(false);
  const [callStatus, setCallStatus] = useState('idle'); // idle, initiating, ringing, connected, ended
  const [activeCall, setActiveCall] = useState(null);
  const [callDuration, setCallDuration] = useState(0);

  // Click-to-Call Post-Call Logging Dialog State
  const [postCallDialogOpen, setPostCallDialogOpen] = useState(false);
  const [callLogData, setCallLogData] = useState({
    outcome: 'answered',
    duration: 60, // seconds
    notes: '',
  });
  const [savingCallLog, setSavingCallLog] = useState(false);
  const [callStartTime, setCallStartTime] = useState(null);

  // Email Dialog State
  const [emailDialog, setEmailDialog] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);

  // Snackbar
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Edit Dialog State
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: '',
    phone: '',
    email: '',
    company: '',
    notes: '',
    lead_status: ''
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (id) {
      fetchLeadDetails();
      fetchActivities();
      fetchEmails();
    }
  }, [id]);

  // Fetch calls when lead data is available
  useEffect(() => {
    if (lead?.phone) {
      fetchCalls(lead.phone);
    }
  }, [lead?.phone]);

  const fetchLeadDetails = async () => {
    try {
      setLoading(true);
      const response = await leadService.getLeadById(id);
      // Backend returns { data: { lead } }
      setLead(response.data?.lead || response.data);
    } catch (err) {
      setError('Failed to load lead details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchActivities = async () => {
    try {
      const response = await leadService.getLeadActivities(id);
      // Handle both array and object response
      const data = response.data?.activities || response.data || [];
      setActivities(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch activities:', err);
      setActivities([]);
    }
  };

  const fetchCalls = async (phoneNumber) => {
    try {
      // Fetch calls related to this lead's phone number only - backend filters by phone
      const response = await callService.getCalls({ phone: phoneNumber, limit: 100 });
      const data = response.data?.calls || response.data || [];
      setCalls(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch calls:', err);
      setCalls([]);
    }
  };

  const fetchEmails = async () => {
    try {
      const response = await leadService.getLeadEmails(id);
      setEmails(response.data?.emails || []);
    } catch (err) {
      console.error('Failed to fetch emails:', err);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      new: '#3b82f6',
      contacted: '#f59e0b',
      qualified: '#8b5cf6',
      converted: '#10b981',
      lost: '#ef4444',
    };
    return colors[status] || '#6b7280';
  };

  // Poll call status
  const pollCallStatus = (callId) => {
    pollIntervalRef.current = setInterval(async () => {
      try {
        const response = await callService.getCallStatus(callId);
        if (response.success) {
          const status = response.data.status;
          if (status === 'in-progress' || status === 'connected') {
            setCallStatus('connected');
            setCallDuration(prev => prev + 1);
          } else if (status === 'completed' || status === 'failed' || status === 'busy' || status === 'no-answer') {
            setCallStatus('ended');
            clearInterval(pollIntervalRef.current);
            setTimeout(() => {
              setCallDialogOpen(false);
              setActiveCall(null);
              fetchCalls(); // Refresh calls list
            }, 2000);
          }
        }
      } catch (error) {
        console.error('Error polling call status:', error);
      }
    }, 2000);
  };

  // Handle Call - Twilio Integration (main)
  const handleCall = async () => {
    if (!lead.phone) {
      setSnackbar({ open: true, message: 'No phone number available', severity: 'error' });
      return;
    }

    setCallDialogOpen(true);
    setCallStatus('initiating');
    setCallDuration(0);

    try {
      const response = await callService.initiateCall(lead.phone, null);

      if (response.success) {
        setActiveCall(response.data.call);
        setCallStatus('ringing');

        // Log activity
        await leadService.logActivity(lead.id, {
          activity_type: 'call',
          description: `Initiated call to ${lead.phone} via Twilio`
        });

        // Poll for call status updates
        pollCallStatus(response.data.call.id);
      } else {
        setCallStatus('ended');
        setSnackbar({ open: true, message: response.message || 'Failed to initiate call', severity: 'error' });
      }
    } catch (error) {
      console.error('Error initiating call:', error);
      setCallStatus('ended');
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Failed to initiate call. Please check Twilio credentials.',
        severity: 'error'
      });
    }
  };

  // Handle Manual Call - Opens dialog for logging manual calls
  const handleManualCall = () => {
    if (!lead.phone) {
      setSnackbar({ open: true, message: 'No phone number available', severity: 'error' });
      return;
    }
    setPostCallDialogOpen(true);
    setCallStartTime(new Date());
  };

  // Copy number to clipboard
  const handleCopyNumber = () => {
    navigator.clipboard.writeText(lead.phone);
    setSnackbar({ open: true, message: 'Number copied! Now call from your phone.', severity: 'success' });
  };

  // Actually make the call using tel: protocol (works on mobile)
  const handleMakeCall = () => {
    let phoneNumber = lead.phone.trim().replace(/[\s\-\(\)]/g, '');
    window.open(`tel:${phoneNumber}`, '_self');
  };

  // Save call log after manual call
  const handleSaveCallLog = async () => {
    if (!lead?.phone) return;

    setSavingCallLog(true);
    try {
      // Create call record
      const callData = {
        phone_number: lead.phone,
        call_type: 'outgoing',
        start_time: callStartTime || new Date(),
        end_time: new Date(),
        duration: callLogData.duration,
        outcome: callLogData.outcome,
        notes: callLogData.notes,
        call_status: callLogData.outcome === 'answered' ? 'completed' : 'pending',
      };

      await callService.createCall(callData);

      // Log activity for lead
      await leadService.logActivity(lead.id, {
        activity_type: 'call',
        description: `Made a ${callLogData.duration}s call - ${callLogData.outcome}${callLogData.notes ? `: ${callLogData.notes}` : ''}`
      });

      setSnackbar({ open: true, message: 'Call logged successfully!', severity: 'success' });
      setPostCallDialogOpen(false);

      // Reset form
      setCallLogData({ outcome: 'answered', duration: 60, notes: '' });
      setCallStartTime(null);

      // Refresh calls list
      fetchCalls(lead.phone);
      fetchActivities();
    } catch (error) {
      console.error('Error saving call log:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Failed to save call log',
        severity: 'error'
      });
    } finally {
      setSavingCallLog(false);
    }
  };

  // End Call
  const handleEndCall = async () => {
    try {
      if (activeCall && activeCall.id) {
        await callService.endCall(activeCall.id);
      }
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    } catch (error) {
      console.error('Error ending call:', error);
    } finally {
      setCallStatus('ended');
      setTimeout(() => {
        setCallDialogOpen(false);
        setActiveCall(null);
        setCallDuration(0);
        fetchCalls();
      }, 1000);
    }
  };

  // Handle Email - Open Dialog
  const handleEmail = () => {
    if (!lead) return;
    setEmailSubject(`Follow up with ${lead.name || 'you'}`);
    setEmailBody(`Hi ${lead.name || 'there'},\n\nI wanted to follow up with you regarding our conversation.\n\nBest regards`);
    setEmailDialog(true);
  };

  // Send Email
  const handleSendEmail = async () => {
    if (!lead || !lead.email) {
      setSnackbar({ open: true, message: 'No email address available', severity: 'error' });
      return;
    }

    if (!emailSubject.trim() || !emailBody.trim()) {
      setSnackbar({ open: true, message: 'Subject and message are required', severity: 'error' });
      return;
    }

    setSendingEmail(true);
    try {
      // Use sendEmailToLead which expects subject and message
      const response = await emailService.sendEmailToLead(lead.id, {
        subject: emailSubject,
        message: emailBody
      });

      if (response.success) {
        setSnackbar({ open: true, message: 'Email sent successfully!', severity: 'success' });
        setEmailDialog(false);
        setEmailSubject('');
        setEmailBody('');
        fetchEmails(); // Refresh emails list
      } else {
        setSnackbar({ open: true, message: response.message || 'Failed to send email', severity: 'error' });
      }
    } catch (error) {
      console.error('Error sending email:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Failed to send email. Check email configuration.',
        severity: 'error'
      });
    } finally {
      setSendingEmail(false);
    }
  };

  const handleWhatsApp = () => {
    const cleanPhone = lead.phone?.replace(/[^0-9+]/g, '');
    window.open(`https://wa.me/${cleanPhone}`, '_blank');
  };

  const handleMeet = () => {
    const eventName = encodeURIComponent(`Meeting with ${lead.name}`);
    window.open(
      `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${eventName}`,
      '_blank'
    );
  };

  // Edit Lead handlers
  const handleOpenEditDialog = () => {
    setEditFormData({
      name: lead.name || '',
      phone: lead.phone || '',
      email: lead.email || '',
      company: lead.company || '',
      notes: lead.notes || '',
      lead_status: lead.lead_status || 'new'
    });
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveLead = async () => {
    setSaving(true);
    try {
      await leadService.updateLead(id, editFormData);
      setSnackbar({ open: true, message: 'Lead updated successfully!', severity: 'success' });
      setEditDialogOpen(false);
      fetchLeadDetails(); // Refresh lead data
    } catch (error) {
      console.error('Error updating lead:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Failed to update lead',
        severity: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !lead) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error || 'Lead not found'}</Alert>
        <Button startIcon={<BackIcon />} onClick={() => navigate('/leads')} sx={{ mt: 2 }}>
          Back to Leads
        </Button>
      </Box>
    );
  }

  // Combine activities and calls for timeline
  const timelineActivities = [
    ...activities.map(act => ({ ...act, type: act.activity_type })),
    ...calls.map(call => ({
      id: `call-${call.id}`,
      type: 'call',
      title: `Call to ${call.phone_number}`,
      description: call.notes || `${call.call_type} call`,
      phone_number: call.phone_number,
      duration: call.duration,
      outcome: call.outcome,
      recording_url: call.recording_id ? `/api/calls/${call.id}/recording` : null,
      created_at: call.start_time,
      user: call.user,
      notes: call.notes,
    })),
  ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={() => navigate('/leads')}>
            <BackIcon />
          </IconButton>
          <Box>
            <Typography variant="h5" fontWeight={600}>
              {lead.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Lead Details & Activity History
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Call">
            <IconButton
              sx={{ bgcolor: '#d1fae5', color: '#10b981', '&:hover': { bgcolor: '#a7f3d0' } }}
              onClick={handleCall}
            >
              <PhoneIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Email">
            <IconButton
              sx={{ bgcolor: '#dbeafe', color: '#3b82f6', '&:hover': { bgcolor: '#bfdbfe' } }}
              onClick={handleEmail}
            >
              <EmailIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="WhatsApp">
            <IconButton
              sx={{ bgcolor: '#d1fae5', color: '#25D366', '&:hover': { bgcolor: '#a7f3d0' } }}
              onClick={handleWhatsApp}
            >
              <WhatsAppIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Schedule Meeting">
            <IconButton
              sx={{ bgcolor: '#ede9fe', color: '#8b5cf6', '&:hover': { bgcolor: '#ddd6fe' } }}
              onClick={handleMeet}
            >
              <MeetIcon />
            </IconButton>
          </Tooltip>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={handleOpenEditDialog}
            sx={{ ml: 1 }}
          >
            Edit
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Left Column - Lead Info */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Lead Information
            </Typography>
            <Divider sx={{ my: 2 }} />

            {/* Status */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                Status
              </Typography>
              <Chip
                label={lead.lead_status?.toUpperCase()}
                sx={{
                  bgcolor: getStatusColor(lead.lead_status) + '20',
                  color: getStatusColor(lead.lead_status),
                  fontWeight: 600,
                }}
              />
            </Box>

            {/* Contact Info */}
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <PhoneIcon sx={{ fontSize: 18, color: '#6b7280' }} />
                <Typography variant="caption" color="text.secondary">
                  Phone
                </Typography>
              </Box>
              <Typography variant="body1" fontWeight={500}>
                {lead.phone}
              </Typography>
            </Box>

            {lead.email && (
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <EmailIcon sx={{ fontSize: 18, color: '#6b7280' }} />
                  <Typography variant="caption" color="text.secondary">
                    Email
                  </Typography>
                </Box>
                <Typography variant="body1" fontWeight={500}>
                  {lead.email}
                </Typography>
              </Box>
            )}

            {lead.company && (
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <BusinessIcon sx={{ fontSize: 18, color: '#6b7280' }} />
                  <Typography variant="caption" color="text.secondary">
                    Company
                  </Typography>
                </Box>
                <Typography variant="body1" fontWeight={500}>
                  {lead.company}
                </Typography>
              </Box>
            )}

            <Divider sx={{ my: 2 }} />

            {/* Assigned To */}
            {lead.assignedUser && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                  Assigned To
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Avatar sx={{ width: 32, height: 32, bgcolor: '#3b82f6' }}>
                    {lead.assignedUser.full_name?.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="body2" fontWeight={500}>
                      {lead.assignedUser.full_name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {lead.assignedUser.email}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            )}

            {/* Source */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                Source
              </Typography>
              <Chip
                label={lead.source || 'Direct'}
                size="small"
                sx={{ bgcolor: '#f3f4f6' }}
              />
            </Box>

            {/* Created */}
            <Box>
              <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                Created
              </Typography>
              <Typography variant="body2">
                {formatDate(lead.created_at)}
              </Typography>
            </Box>
          </Paper>

          {/* Notes */}
          {lead.notes && (
            <Paper sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <NotesIcon sx={{ color: '#f59e0b' }} />
                <Typography variant="h6" fontWeight={600}>
                  Notes
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {lead.notes}
              </Typography>
            </Paper>
          )}
        </Grid>

        {/* Right Column - Activity Timeline */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
              <Tabs value={currentTab} onChange={(e, v) => setCurrentTab(v)}>
                <Tab label={`All Activity (${timelineActivities.length})`} />
                <Tab label={`Calls (${calls.length})`} />
                <Tab label={`Emails (${emails.length})`} />
                <Tab label="Notes" />
              </Tabs>
            </Box>

            {currentTab === 0 && (
              <Box>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Activity Timeline
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Complete history of all interactions with this lead
                </Typography>
                <ActivityTimeline activities={timelineActivities} />
              </Box>
            )}

            {currentTab === 1 && (
              <Box>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Call History
                </Typography>
                <ActivityTimeline
                  activities={timelineActivities.filter(a => a.type === 'call')}
                />
              </Box>
            )}

            {currentTab === 2 && (
              <Box>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Email History
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  All sent and received emails with this lead
                </Typography>

                {emails.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <EmailIcon sx={{ fontSize: 48, color: '#d1d5db', mb: 2 }} />
                    <Typography color="text.secondary">No emails found</Typography>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {emails.map((email) => {
                      const isInbound = email.metadata?.direction === 'inbound';
                      return (
                        <Paper
                          key={email.id}
                          elevation={0}
                          sx={{
                            p: 2,
                            border: '1px solid',
                            borderColor: isInbound ? '#bbf7d0' : '#bfdbfe',
                            bgcolor: isInbound ? '#f0fdf4' : '#eff6ff',
                            borderRadius: 2,
                          }}
                        >
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Chip
                                label={isInbound ? 'Received' : 'Sent'}
                                size="small"
                                sx={{
                                  bgcolor: isInbound ? '#22c55e' : '#3b82f6',
                                  color: 'white',
                                  fontWeight: 600,
                                  fontSize: '0.7rem',
                                }}
                              />
                              <Typography variant="caption" color="text.secondary">
                                {formatDate(email.sent_at)}
                              </Typography>
                            </Box>
                            {email.user && (
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Avatar sx={{ width: 24, height: 24, fontSize: 12, bgcolor: '#6b7280' }}>
                                  {email.user?.full_name?.charAt(0)}
                                </Avatar>
                                <Typography variant="caption" color="text.secondary">
                                  {email.user?.full_name}
                                </Typography>
                              </Box>
                            )}
                          </Box>

                          <Box sx={{ mb: 1 }}>
                            {isInbound && email.metadata?.from_email && (
                              <Typography variant="caption" color="text.secondary" display="block">
                                From: <strong>{email.metadata.from_email}</strong>
                              </Typography>
                            )}
                            {!isInbound && (
                              <Typography variant="caption" color="text.secondary" display="block">
                                To: <strong>{email.recipient_email}</strong>
                              </Typography>
                            )}
                          </Box>

                          <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                            {email.subject}
                          </Typography>

                          <Typography variant="body2" color="text.secondary" sx={{
                            whiteSpace: 'pre-wrap',
                            maxHeight: 100,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}>
                            {email.body_preview || email.metadata?.full_body?.substring(0, 300) || '(No content)'}
                          </Typography>
                        </Paper>
                      );
                    })}
                  </Box>
                )}
              </Box>
            )}

            {currentTab === 3 && (
              <Box>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Notes & Comments
                </Typography>
                <ActivityTimeline
                  activities={timelineActivities.filter(a => a.type === 'note')}
                />
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Call Dialog - Improved UI */}
      <Dialog
        open={callDialogOpen}
        onClose={() => {}}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            overflow: 'hidden'
          }
        }}
      >
        {/* Status Header */}
        <Box sx={{
          bgcolor: callStatus === 'connected' ? '#10b981' : callStatus === 'ringing' ? '#f59e0b' : callStatus === 'ended' ? '#ef4444' : '#3b82f6',
          py: 1.5,
          textAlign: 'center',
          color: 'white'
        }}>
          <Typography variant="body2" fontWeight={600}>
            {callStatus === 'initiating' && 'Connecting...'}
            {callStatus === 'ringing' && 'Ringing'}
            {callStatus === 'connected' && 'In Call'}
            {callStatus === 'ended' && 'Call Ended'}
          </Typography>
        </Box>

        <DialogContent sx={{ textAlign: 'center', py: 4, px: 3 }}>
          {/* Avatar with animation */}
          <Box sx={{ position: 'relative', display: 'inline-block', mb: 3 }}>
            <Avatar
              sx={{
                width: 100,
                height: 100,
                bgcolor: callStatus === 'connected' ? '#10b981' : callStatus === 'ringing' ? '#f59e0b' : '#6b7280',
                fontSize: '2.5rem',
                fontWeight: 600,
                boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
              }}
            >
              {callStatus === 'ringing' ? (
                <RingVolumeIcon sx={{ fontSize: 48 }} />
              ) : callStatus === 'connected' ? (
                <PhoneInTalkIcon sx={{ fontSize: 48 }} />
              ) : callStatus === 'ended' ? (
                <CallEndIcon sx={{ fontSize: 48 }} />
              ) : (
                <PhoneIcon sx={{ fontSize: 48 }} />
              )}
            </Avatar>
            {(callStatus === 'ringing' || callStatus === 'initiating') && (
              <CircularProgress
                size={116}
                thickness={2}
                sx={{
                  position: 'absolute',
                  top: -8,
                  left: -8,
                  color: callStatus === 'ringing' ? '#f59e0b' : '#3b82f6'
                }}
              />
            )}
          </Box>

          {/* Contact Info */}
          <Typography variant="h5" fontWeight={600} gutterBottom>
            {lead?.name || 'Unknown'}
          </Typography>
          <Chip
            label={lead?.phone}
            size="medium"
            sx={{
              bgcolor: '#f3f4f6',
              fontSize: '1rem',
              fontWeight: 500,
              py: 2,
              mb: 2
            }}
          />

          {/* Duration Counter */}
          {callStatus === 'connected' && (
            <Box sx={{
              mt: 3,
              p: 2,
              bgcolor: '#f0fdf4',
              borderRadius: 3,
              border: '1px solid #bbf7d0'
            }}>
              <Typography variant="caption" color="text.secondary" display="block">
                Call Duration
              </Typography>
              <Typography
                variant="h3"
                sx={{
                  fontFamily: 'monospace',
                  color: '#10b981',
                  fontWeight: 700
                }}
              >
                {Math.floor(callDuration / 60).toString().padStart(2, '0')}:
                {(callDuration % 60).toString().padStart(2, '0')}
              </Typography>
            </Box>
          )}

          {/* Status Messages */}
          {callStatus === 'initiating' && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Connecting via Twilio...
            </Typography>
          )}
          {callStatus === 'ringing' && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Waiting for answer...
            </Typography>
          )}
          {callStatus === 'ended' && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Call has ended
            </Typography>
          )}
        </DialogContent>

        <DialogActions sx={{
          justifyContent: 'center',
          pb: 4,
          px: 3
        }}>
          <Button
            variant="contained"
            startIcon={<CallEndIcon />}
            onClick={handleEndCall}
            disabled={callStatus === 'ended'}
            sx={{
              borderRadius: 25,
              px: 6,
              py: 1.5,
              bgcolor: '#ef4444',
              '&:hover': { bgcolor: '#dc2626' },
              fontWeight: 600,
              fontSize: '1rem',
              boxShadow: '0 4px 12px rgba(239, 68, 68, 0.4)'
            }}
          >
            {callStatus === 'ended' ? 'Closing...' : 'End Call'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Email Dialog - Improved UI */}
      <Dialog
        open={emailDialog}
        onClose={() => !sendingEmail && setEmailDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          bgcolor: '#3b82f6',
          color: 'white',
          py: 2
        }}>
          <EmailIcon />
          <Box>
            <Typography variant="h6" fontWeight={600}>
              Compose Email
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.9 }}>
              Send email directly from the app
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          {/* Recipient Info */}
          <Paper
            elevation={0}
            sx={{
              p: 2,
              mb: 3,
              mt: 1,
              bgcolor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: 2
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: '#3b82f6', width: 44, height: 44 }}>
                {lead?.name?.charAt(0)?.toUpperCase() || 'L'}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1" fontWeight={600}>
                  {lead?.name || 'Unknown'}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Typography variant="body2" color="text.secondary">
                    To:
                  </Typography>
                  <Chip
                    label={lead?.email || 'No email'}
                    size="small"
                    sx={{
                      bgcolor: '#dbeafe',
                      color: '#1d4ed8',
                      fontWeight: 500,
                      fontSize: '0.8rem'
                    }}
                  />
                </Box>
              </Box>
              {lead?.company && (
                <Chip
                  label={lead.company}
                  size="small"
                  variant="outlined"
                  sx={{ color: '#6b7280' }}
                />
              )}
            </Box>
          </Paper>

          {/* Subject Field */}
          <TextField
            fullWidth
            label="Subject"
            placeholder="Enter email subject..."
            value={emailSubject}
            onChange={(e) => setEmailSubject(e.target.value)}
            variant="outlined"
            sx={{
              mb: 3,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              }
            }}
            InputProps={{
              sx: { fontSize: '1rem' }
            }}
          />

          {/* Message Field */}
          <TextField
            fullWidth
            label="Message"
            placeholder="Write your message here..."
            multiline
            rows={10}
            value={emailBody}
            onChange={(e) => setEmailBody(e.target.value)}
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              }
            }}
          />

          {/* Character count */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
            <Typography variant="caption" color="text.secondary">
              {emailBody.length} characters
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{
          px: 3,
          py: 2,
          borderTop: '1px solid #e2e8f0',
          bgcolor: '#f8fafc'
        }}>
          <Button
            onClick={() => setEmailDialog(false)}
            disabled={sendingEmail}
            sx={{ borderRadius: 2, px: 3 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            startIcon={sendingEmail ? <CircularProgress size={18} color="inherit" /> : <SendIcon />}
            onClick={handleSendEmail}
            disabled={sendingEmail || !emailSubject.trim() || !emailBody.trim() || !lead?.email}
            sx={{
              borderRadius: 2,
              px: 4,
              py: 1,
              bgcolor: '#3b82f6',
              '&:hover': { bgcolor: '#2563eb' },
              fontWeight: 600
            }}
          >
            {sendingEmail ? 'Sending...' : 'Send Email'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Lead Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={handleCloseEditDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{
          bgcolor: '#f59e0b',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <EditIcon />
          Edit Lead
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={editFormData.name}
                onChange={handleEditFormChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone"
                name="phone"
                value={editFormData.phone}
                onChange={handleEditFormChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={editFormData.email}
                onChange={handleEditFormChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Company"
                name="company"
                value={editFormData.company}
                onChange={handleEditFormChange}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  name="lead_status"
                  value={editFormData.lead_status}
                  onChange={handleEditFormChange}
                  label="Status"
                >
                  <MenuItem value="new">New</MenuItem>
                  <MenuItem value="contacted">Contacted</MenuItem>
                  <MenuItem value="qualified">Qualified</MenuItem>
                  <MenuItem value="converted">Converted</MenuItem>
                  <MenuItem value="lost">Lost</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                name="notes"
                value={editFormData.notes}
                onChange={handleEditFormChange}
                multiline
                rows={3}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid #e5e7eb' }}>
          <Button onClick={handleCloseEditDialog} disabled={saving}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveLead}
            disabled={saving || !editFormData.name || !editFormData.phone}
            sx={{ bgcolor: '#f59e0b', '&:hover': { bgcolor: '#d97706' } }}
          >
            {saving ? <CircularProgress size={20} color="inherit" /> : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Call Dialog - Click-to-Call with Logging */}
      <Dialog
        open={postCallDialogOpen}
        onClose={() => !savingCallLog && setPostCallDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          bgcolor: '#10b981',
          color: 'white',
          py: 2
        }}>
          <PhoneIcon />
          <Box>
            <Typography variant="h6" fontWeight={600}>
              Call {lead?.name}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.9 }}>
              Make call and log the details
            </Typography>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ p: 3 }}>
          {/* Contact Info with Call Button */}
          <Paper
            elevation={0}
            sx={{
              p: 2,
              mb: 3,
              bgcolor: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: 2
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: '#10b981', width: 50, height: 50 }}>
                  {lead?.name?.charAt(0)?.toUpperCase() || 'L'}
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {lead?.name || 'Unknown'}
                  </Typography>
                  <Typography variant="h6" sx={{ color: '#10b981', fontWeight: 700 }}>
                    {lead?.phone}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<CopyIcon />}
                  onClick={handleCopyNumber}
                  sx={{
                    borderColor: '#10b981',
                    color: '#10b981',
                    '&:hover': { borderColor: '#059669', bgcolor: '#f0fdf4' },
                    borderRadius: 3,
                    px: 2,
                    py: 1.5,
                    fontWeight: 600,
                  }}
                >
                  Copy
                </Button>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<PhoneIcon />}
                  onClick={handleMakeCall}
                  sx={{
                    bgcolor: '#10b981',
                    '&:hover': { bgcolor: '#059669' },
                    borderRadius: 3,
                    px: 3,
                    py: 1.5,
                    fontWeight: 600,
                  }}
                >
                  Call
                </Button>
              </Box>
            </Box>
          </Paper>

          <Divider sx={{ my: 2 }}>
            <Chip label="After Call - Log Details" size="small" />
          </Divider>

          {/* Call Outcome */}
          <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5, color: '#374151' }}>
            How did the call go?
          </Typography>
          <RadioGroup
            value={callLogData.outcome}
            onChange={(e) => setCallLogData({ ...callLogData, outcome: e.target.value })}
            sx={{ mb: 3 }}
          >
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 1.5,
                    border: '2px solid',
                    borderColor: callLogData.outcome === 'answered' ? '#10b981' : '#e5e7eb',
                    borderRadius: 2,
                    cursor: 'pointer',
                    bgcolor: callLogData.outcome === 'answered' ? '#f0fdf4' : 'transparent',
                    '&:hover': { borderColor: '#10b981' }
                  }}
                  onClick={() => setCallLogData({ ...callLogData, outcome: 'answered' })}
                >
                  <FormControlLabel
                    value="answered"
                    control={<Radio size="small" color="success" />}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <SuccessIcon sx={{ color: '#10b981', fontSize: 20 }} />
                        <Typography variant="body2" fontWeight={500}>Answered</Typography>
                      </Box>
                    }
                    sx={{ m: 0 }}
                  />
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 1.5,
                    border: '2px solid',
                    borderColor: callLogData.outcome === 'no_answer' ? '#ef4444' : '#e5e7eb',
                    borderRadius: 2,
                    cursor: 'pointer',
                    bgcolor: callLogData.outcome === 'no_answer' ? '#fef2f2' : 'transparent',
                    '&:hover': { borderColor: '#ef4444' }
                  }}
                  onClick={() => setCallLogData({ ...callLogData, outcome: 'no_answer' })}
                >
                  <FormControlLabel
                    value="no_answer"
                    control={<Radio size="small" color="error" />}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CancelIcon sx={{ color: '#ef4444', fontSize: 20 }} />
                        <Typography variant="body2" fontWeight={500}>No Answer</Typography>
                      </Box>
                    }
                    sx={{ m: 0 }}
                  />
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 1.5,
                    border: '2px solid',
                    borderColor: callLogData.outcome === 'busy' ? '#f59e0b' : '#e5e7eb',
                    borderRadius: 2,
                    cursor: 'pointer',
                    bgcolor: callLogData.outcome === 'busy' ? '#fffbeb' : 'transparent',
                    '&:hover': { borderColor: '#f59e0b' }
                  }}
                  onClick={() => setCallLogData({ ...callLogData, outcome: 'busy' })}
                >
                  <FormControlLabel
                    value="busy"
                    control={<Radio size="small" sx={{ color: '#f59e0b', '&.Mui-checked': { color: '#f59e0b' } }} />}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ScheduleIcon sx={{ color: '#f59e0b', fontSize: 20 }} />
                        <Typography variant="body2" fontWeight={500}>Busy</Typography>
                      </Box>
                    }
                    sx={{ m: 0 }}
                  />
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 1.5,
                    border: '2px solid',
                    borderColor: callLogData.outcome === 'callback' ? '#3b82f6' : '#e5e7eb',
                    borderRadius: 2,
                    cursor: 'pointer',
                    bgcolor: callLogData.outcome === 'callback' ? '#eff6ff' : 'transparent',
                    '&:hover': { borderColor: '#3b82f6' }
                  }}
                  onClick={() => setCallLogData({ ...callLogData, outcome: 'callback' })}
                >
                  <FormControlLabel
                    value="callback"
                    control={<Radio size="small" color="primary" />}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CallbackIcon sx={{ color: '#3b82f6', fontSize: 20 }} />
                        <Typography variant="body2" fontWeight={500}>Callback</Typography>
                      </Box>
                    }
                    sx={{ m: 0 }}
                  />
                </Paper>
              </Grid>
            </Grid>
          </RadioGroup>

          {/* Duration Slider */}
          <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1, color: '#374151' }}>
            Call Duration: {Math.floor(callLogData.duration / 60)}m {callLogData.duration % 60}s
          </Typography>
          <Box sx={{ px: 1, mb: 3 }}>
            <Slider
              value={callLogData.duration}
              onChange={(e, value) => setCallLogData({ ...callLogData, duration: value })}
              min={0}
              max={1800}
              step={15}
              marks={[
                { value: 0, label: '0s' },
                { value: 300, label: '5m' },
                { value: 600, label: '10m' },
                { value: 900, label: '15m' },
                { value: 1800, label: '30m' },
              ]}
              sx={{
                color: '#10b981',
                '& .MuiSlider-thumb': {
                  bgcolor: 'white',
                  border: '2px solid #10b981',
                  '&:hover': { boxShadow: '0 0 0 8px rgba(16, 185, 129, 0.16)' }
                }
              }}
            />
          </Box>

          {/* Notes */}
          <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1, color: '#374151' }}>
            Call Notes (Optional)
          </Typography>
          <TextField
            fullWidth
            placeholder="What was discussed? Any follow-up needed?"
            multiline
            rows={3}
            value={callLogData.notes}
            onChange={(e) => setCallLogData({ ...callLogData, notes: e.target.value })}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              }
            }}
          />
        </DialogContent>

        <DialogActions sx={{
          px: 3,
          py: 2,
          borderTop: '1px solid #e5e7eb',
          bgcolor: '#f9fafb'
        }}>
          <Button
            onClick={() => setPostCallDialogOpen(false)}
            disabled={savingCallLog}
            sx={{ borderRadius: 2, px: 3 }}
          >
            Skip
          </Button>
          <Button
            variant="contained"
            startIcon={savingCallLog ? <CircularProgress size={18} color="inherit" /> : <SuccessIcon />}
            onClick={handleSaveCallLog}
            disabled={savingCallLog}
            sx={{
              borderRadius: 2,
              px: 4,
              py: 1,
              bgcolor: '#10b981',
              '&:hover': { bgcolor: '#059669' },
              fontWeight: 600
            }}
          >
            {savingCallLog ? 'Saving...' : 'Save Call Log'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default LeadDetailPage;
