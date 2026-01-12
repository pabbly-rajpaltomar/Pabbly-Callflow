import React, { useState, useEffect } from 'react';
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
} from '@mui/icons-material';
import ActivityTimeline from '../components/Shared/ActivityTimeline';
import leadService from '../services/leadService';
import callService from '../services/callService';
import { format } from 'date-fns';

const LeadDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [lead, setLead] = useState(null);
  const [activities, setActivities] = useState([]);
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentTab, setCurrentTab] = useState(0);

  useEffect(() => {
    if (id) {
      fetchLeadDetails();
      fetchActivities();
      fetchCalls();
    }
  }, [id]);

  const fetchLeadDetails = async () => {
    try {
      setLoading(true);
      const response = await leadService.getLeadById(id);
      setLead(response.data);
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
      setActivities(response.data || []);
    } catch (err) {
      console.error('Failed to fetch activities:', err);
    }
  };

  const fetchCalls = async () => {
    try {
      // Fetch calls related to this lead's phone number
      const response = await callService.getCalls({ phone: lead?.phone });
      setCalls(response.data || []);
    } catch (err) {
      console.error('Failed to fetch calls:', err);
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

  const handleCall = () => {
    // Implement call functionality
    console.log('Calling:', lead.phone);
  };

  const handleEmail = () => {
    window.location.href = `mailto:${lead.email}`;
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
            onClick={() => navigate(`/leads/edit/${id}`)}
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
                {format(new Date(lead.created_at), 'MMM dd, yyyy h:mm a')}
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
    </Box>
  );
};

export default LeadDetailPage;
