import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  useTheme,
  useMediaQuery,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
  LinearProgress
} from '@mui/material';
import {
  Close as CloseIcon,
  Phone as PhoneIcon,
  CheckCircle as CheckIcon,
  TrendingUp as TrendingUpIcon,
  Today as TodayIcon,
  DateRange as WeekIcon,
  CalendarMonth as MonthIcon,
  Email as EmailIcon,
  People as LeadIcon,
  Contacts as ContactIcon,
  PlayArrow as PlayIcon,
  AccessTime as TimeIcon,
  CallMade as OutgoingIcon,
  CallReceived as IncomingIcon,
  WhatsApp as WhatsAppIcon,
  Event as MeetingIcon,
  Videocam as VideoIcon,
  LocationOn as LocationIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import { format, formatDistanceToNow } from 'date-fns';
import teamActivityService from '../../services/teamActivityService';

const UserStatsModal = ({ open, onClose, userId }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [currentTab, setCurrentTab] = useState(0);

  useEffect(() => {
    if (open && userId) {
      setData(null);
      fetchUserStats();
    }
  }, [open, userId]);

  const fetchUserStats = async () => {
    try {
      setLoading(true);
      const response = await teamActivityService.getMemberDetailedStats(userId);
      const actualData = response.data?.data || response.data;
      setData(actualData);
    } catch (error) {
      console.error('Error fetching user stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getOutcomeColor = (outcome) => {
    switch (outcome) {
      case 'answered': return 'success';
      case 'no_answer': return 'warning';
      case 'busy': return 'error';
      case 'voicemail': return 'info';
      default: return 'default';
    }
  };

  const getMessageStatusColor = (status) => {
    switch (status) {
      case 'read': return 'success';
      case 'delivered': return 'info';
      case 'sent': return 'default';
      case 'failed': return 'error';
      default: return 'default';
    }
  };

  const getMeetingStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'scheduled': return 'info';
      case 'cancelled': return 'error';
      case 'no_show': return 'warning';
      case 'rescheduled': return 'secondary';
      default: return 'default';
    }
  };

  const getMeetingOutcomeColor = (outcome) => {
    switch (outcome) {
      case 'positive': return 'success';
      case 'negative': return 'error';
      case 'neutral': return 'default';
      case 'follow_up_needed': return 'warning';
      case 'pending': return 'info';
      default: return 'default';
    }
  };

  const getMeetingTypeIcon = (type) => {
    switch (type) {
      case 'video_call': return <VideoIcon fontSize="small" />;
      case 'in_person': return <LocationIcon fontSize="small" />;
      case 'phone_call': return <PhoneIcon fontSize="small" />;
      case 'site_visit': return <LocationIcon fontSize="small" />;
      default: return <MeetingIcon fontSize="small" />;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      fullScreen={isMobile}
      PaperProps={{
        sx: { minHeight: '80vh' }
      }}
    >
      <DialogTitle sx={{ borderBottom: '1px solid #e5e7eb', pb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight={600}>Team Member Activity</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : data ? (
          <>
            {/* User Header */}
            <Box sx={{ p: 3, bgcolor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                  src={data.user?.avatar_url}
                  sx={{
                    width: 64,
                    height: 64,
                    bgcolor: theme.palette.primary.main,
                    fontSize: '1.5rem'
                  }}
                >
                  {data.user?.full_name?.[0]}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" fontWeight={600}>
                    {data.user?.full_name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {data.user?.email}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                    <Chip label={data.user?.role} size="small" color="primary" />
                    <Chip
                      label={data.user?.last_login_at ? `Last seen ${formatDistanceToNow(new Date(data.user.last_login_at), { addSuffix: true })}` : 'Never logged in'}
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                </Box>
                {/* Quick Stats */}
                <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" fontWeight={700} color="primary.main">
                      {data.conversionRate}%
                    </Typography>
                    <Typography variant="caption" color="text.secondary">Conversion</Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" fontWeight={700} color="success.main">
                      {data.callStats?.total || 0}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">Total Calls</Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" fontWeight={700} color="info.main">
                      {data.emailStats?.total || 0}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">Emails</Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" fontWeight={700} sx={{ color: '#25D366' }}>
                      {data.whatsappStats?.total || 0}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">WhatsApp</Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" fontWeight={700} color="secondary.main">
                      {data.meetingStats?.total || 0}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">Meetings</Typography>
                  </Box>
                </Box>
              </Box>
            </Box>

            {/* Tabs - Now with 5 tabs */}
            <Tabs
              value={currentTab}
              onChange={(e, v) => setCurrentTab(v)}
              variant={isMobile ? "scrollable" : "standard"}
              scrollButtons="auto"
              sx={{
                borderBottom: '1px solid #e5e7eb',
                px: 2,
                '& .MuiTab-root': { textTransform: 'none', fontWeight: 500, minWidth: 'auto' }
              }}
            >
              <Tab label="Overview" icon={<TrendingUpIcon />} iconPosition="start" />
              <Tab label="Calls" icon={<PhoneIcon />} iconPosition="start" />
              <Tab label="Emails" icon={<EmailIcon />} iconPosition="start" />
              <Tab label="WhatsApp" icon={<WhatsAppIcon />} iconPosition="start" />
              <Tab label="Meetings" icon={<MeetingIcon />} iconPosition="start" />
            </Tabs>

            {/* Tab 0: Overview */}
            {currentTab === 0 && (
              <Box sx={{ p: 3 }}>
                {/* Call Statistics */}
                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PhoneIcon color="primary" /> Call Statistics
                </Typography>
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={6} sm={3}>
                    <Card sx={{ bgcolor: '#e3f2fd', border: '1px solid #90caf9' }}>
                      <CardContent sx={{ textAlign: 'center', p: 2, '&:last-child': { pb: 2 } }}>
                        <TodayIcon sx={{ color: '#1976d2', fontSize: 28, mb: 0.5 }} />
                        <Typography variant="h5" fontWeight={700}>{data.callStats?.today || 0}</Typography>
                        <Typography variant="caption" color="text.secondary">Today</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Card sx={{ bgcolor: '#e8f5e9', border: '1px solid #a5d6a7' }}>
                      <CardContent sx={{ textAlign: 'center', p: 2, '&:last-child': { pb: 2 } }}>
                        <WeekIcon sx={{ color: '#388e3c', fontSize: 28, mb: 0.5 }} />
                        <Typography variant="h5" fontWeight={700}>{data.callStats?.thisWeek || 0}</Typography>
                        <Typography variant="caption" color="text.secondary">This Week</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Card sx={{ bgcolor: '#fff3e0', border: '1px solid #ffcc80' }}>
                      <CardContent sx={{ textAlign: 'center', p: 2, '&:last-child': { pb: 2 } }}>
                        <MonthIcon sx={{ color: '#f57c00', fontSize: 28, mb: 0.5 }} />
                        <Typography variant="h5" fontWeight={700}>{data.callStats?.thisMonth || 0}</Typography>
                        <Typography variant="caption" color="text.secondary">This Month</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Card sx={{ bgcolor: '#fce4ec', border: '1px solid #f48fb1' }}>
                      <CardContent sx={{ textAlign: 'center', p: 2, '&:last-child': { pb: 2 } }}>
                        <PhoneIcon sx={{ color: '#c2185b', fontSize: 28, mb: 0.5 }} />
                        <Typography variant="h5" fontWeight={700}>{data.callStats?.total || 0}</Typography>
                        <Typography variant="caption" color="text.secondary">Total</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>

                {/* Call Outcomes */}
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={6} sm={2.4}>
                    <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#f9fafb' }}>
                      <Typography variant="h6" fontWeight={600} color="success.main">{data.callStats?.answered || 0}</Typography>
                      <Typography variant="caption">Answered</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6} sm={2.4}>
                    <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#f9fafb' }}>
                      <Typography variant="h6" fontWeight={600} color="warning.main">{data.callStats?.noAnswer || 0}</Typography>
                      <Typography variant="caption">No Answer</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6} sm={2.4}>
                    <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#f9fafb' }}>
                      <Typography variant="h6" fontWeight={600} color="error.main">{data.callStats?.busy || 0}</Typography>
                      <Typography variant="caption">Busy</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6} sm={2.4}>
                    <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#f9fafb' }}>
                      <Typography variant="h6" fontWeight={600} color="info.main">{data.callStats?.voicemail || 0}</Typography>
                      <Typography variant="caption">Voicemail</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={2.4}>
                    <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#f9fafb' }}>
                      <Typography variant="h6" fontWeight={600}>{formatDuration(data.callStats?.avgDuration || 0)}</Typography>
                      <Typography variant="caption">Avg Duration</Typography>
                    </Paper>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                {/* Email Statistics */}
                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <EmailIcon sx={{ color: '#7b1fa2' }} /> Email Statistics
                </Typography>
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={6} sm={3}>
                    <Card sx={{ bgcolor: '#f3e5f5', border: '1px solid #ce93d8' }}>
                      <CardContent sx={{ textAlign: 'center', p: 2, '&:last-child': { pb: 2 } }}>
                        <TodayIcon sx={{ color: '#7b1fa2', fontSize: 28, mb: 0.5 }} />
                        <Typography variant="h5" fontWeight={700}>{data.emailStats?.today || 0}</Typography>
                        <Typography variant="caption" color="text.secondary">Today</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Card sx={{ bgcolor: '#e0f2f1', border: '1px solid #80cbc4' }}>
                      <CardContent sx={{ textAlign: 'center', p: 2, '&:last-child': { pb: 2 } }}>
                        <WeekIcon sx={{ color: '#00796b', fontSize: 28, mb: 0.5 }} />
                        <Typography variant="h5" fontWeight={700}>{data.emailStats?.thisWeek || 0}</Typography>
                        <Typography variant="caption" color="text.secondary">This Week</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Card sx={{ bgcolor: '#fff8e1', border: '1px solid #ffe082' }}>
                      <CardContent sx={{ textAlign: 'center', p: 2, '&:last-child': { pb: 2 } }}>
                        <MonthIcon sx={{ color: '#ffa000', fontSize: 28, mb: 0.5 }} />
                        <Typography variant="h5" fontWeight={700}>{data.emailStats?.thisMonth || 0}</Typography>
                        <Typography variant="caption" color="text.secondary">This Month</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Card sx={{ bgcolor: '#e8eaf6', border: '1px solid #9fa8da' }}>
                      <CardContent sx={{ textAlign: 'center', p: 2, '&:last-child': { pb: 2 } }}>
                        <EmailIcon sx={{ color: '#3f51b5', fontSize: 28, mb: 0.5 }} />
                        <Typography variant="h5" fontWeight={700}>{data.emailStats?.total || 0}</Typography>
                        <Typography variant="caption" color="text.secondary">Total</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                {/* WhatsApp Statistics */}
                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <WhatsAppIcon sx={{ color: '#25D366' }} /> WhatsApp Statistics
                </Typography>
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={6} sm={3}>
                    <Card sx={{ bgcolor: '#e8f5e9', border: '1px solid #81c784' }}>
                      <CardContent sx={{ textAlign: 'center', p: 2, '&:last-child': { pb: 2 } }}>
                        <TodayIcon sx={{ color: '#25D366', fontSize: 28, mb: 0.5 }} />
                        <Typography variant="h5" fontWeight={700}>{data.whatsappStats?.today || 0}</Typography>
                        <Typography variant="caption" color="text.secondary">Today</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Card sx={{ bgcolor: '#c8e6c9', border: '1px solid #66bb6a' }}>
                      <CardContent sx={{ textAlign: 'center', p: 2, '&:last-child': { pb: 2 } }}>
                        <WeekIcon sx={{ color: '#1b5e20', fontSize: 28, mb: 0.5 }} />
                        <Typography variant="h5" fontWeight={700}>{data.whatsappStats?.thisWeek || 0}</Typography>
                        <Typography variant="caption" color="text.secondary">This Week</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Card sx={{ bgcolor: '#dcedc8', border: '1px solid #aed581' }}>
                      <CardContent sx={{ textAlign: 'center', p: 2, '&:last-child': { pb: 2 } }}>
                        <MonthIcon sx={{ color: '#558b2f', fontSize: 28, mb: 0.5 }} />
                        <Typography variant="h5" fontWeight={700}>{data.whatsappStats?.thisMonth || 0}</Typography>
                        <Typography variant="caption" color="text.secondary">This Month</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Card sx={{ bgcolor: '#f1f8e9', border: '1px solid #c5e1a5' }}>
                      <CardContent sx={{ textAlign: 'center', p: 2, '&:last-child': { pb: 2 } }}>
                        <WhatsAppIcon sx={{ color: '#25D366', fontSize: 28, mb: 0.5 }} />
                        <Typography variant="h5" fontWeight={700}>{data.whatsappStats?.total || 0}</Typography>
                        <Typography variant="caption" color="text.secondary">Total</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                {/* Meeting Statistics */}
                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <MeetingIcon color="secondary" /> Meeting Statistics
                </Typography>
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={6} sm={2.4}>
                    <Card sx={{ bgcolor: '#fce4ec', border: '1px solid #f48fb1' }}>
                      <CardContent sx={{ textAlign: 'center', p: 2, '&:last-child': { pb: 2 } }}>
                        <ScheduleIcon sx={{ color: '#c2185b', fontSize: 28, mb: 0.5 }} />
                        <Typography variant="h5" fontWeight={700}>{data.meetingStats?.scheduled || 0}</Typography>
                        <Typography variant="caption" color="text.secondary">Scheduled</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={6} sm={2.4}>
                    <Card sx={{ bgcolor: '#e8f5e9', border: '1px solid #a5d6a7' }}>
                      <CardContent sx={{ textAlign: 'center', p: 2, '&:last-child': { pb: 2 } }}>
                        <CheckIcon sx={{ color: '#388e3c', fontSize: 28, mb: 0.5 }} />
                        <Typography variant="h5" fontWeight={700}>{data.meetingStats?.completed || 0}</Typography>
                        <Typography variant="caption" color="text.secondary">Completed</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={6} sm={2.4}>
                    <Card sx={{ bgcolor: '#ffebee', border: '1px solid #ef9a9a' }}>
                      <CardContent sx={{ textAlign: 'center', p: 2, '&:last-child': { pb: 2 } }}>
                        <CloseIcon sx={{ color: '#c62828', fontSize: 28, mb: 0.5 }} />
                        <Typography variant="h5" fontWeight={700}>{data.meetingStats?.cancelled || 0}</Typography>
                        <Typography variant="caption" color="text.secondary">Cancelled</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={6} sm={2.4}>
                    <Card sx={{ bgcolor: '#e3f2fd', border: '1px solid #90caf9' }}>
                      <CardContent sx={{ textAlign: 'center', p: 2, '&:last-child': { pb: 2 } }}>
                        <TodayIcon sx={{ color: '#1976d2', fontSize: 28, mb: 0.5 }} />
                        <Typography variant="h5" fontWeight={700}>{data.meetingStats?.today || 0}</Typography>
                        <Typography variant="caption" color="text.secondary">Today</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={2.4}>
                    <Card sx={{ bgcolor: '#f3e5f5', border: '1px solid #ce93d8' }}>
                      <CardContent sx={{ textAlign: 'center', p: 2, '&:last-child': { pb: 2 } }}>
                        <MeetingIcon sx={{ color: '#7b1fa2', fontSize: 28, mb: 0.5 }} />
                        <Typography variant="h5" fontWeight={700}>{data.meetingStats?.total || 0}</Typography>
                        <Typography variant="caption" color="text.secondary">Total</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                {/* Lead & Contact Stats */}
                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LeadIcon color="info" /> Lead & Contact Statistics
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={3}>
                    <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#f9fafb' }}>
                      <LeadIcon sx={{ color: '#1976d2', fontSize: 28, mb: 0.5 }} />
                      <Typography variant="h6" fontWeight={600}>{data.leadStats?.assigned || 0}</Typography>
                      <Typography variant="caption">Leads Assigned</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#f9fafb' }}>
                      <TrendingUpIcon sx={{ color: '#388e3c', fontSize: 28, mb: 0.5 }} />
                      <Typography variant="h6" fontWeight={600}>{data.leadStats?.converted || 0}</Typography>
                      <Typography variant="caption">Leads Converted</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#f9fafb' }}>
                      <ContactIcon sx={{ color: '#f57c00', fontSize: 28, mb: 0.5 }} />
                      <Typography variant="h6" fontWeight={600}>{data.contactStats?.assigned || 0}</Typography>
                      <Typography variant="caption">Contacts Assigned</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#f9fafb' }}>
                      <ContactIcon sx={{ color: '#7b1fa2', fontSize: 28, mb: 0.5 }} />
                      <Typography variant="h6" fontWeight={600}>{data.contactStats?.created || 0}</Typography>
                      <Typography variant="caption">Contacts Created</Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* Tab 1: Call History */}
            {currentTab === 1 && (
              <Box sx={{ p: 2 }}>
                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                  Recent Calls
                </Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ bgcolor: '#f9fafb' }}>
                        <TableCell sx={{ fontWeight: 600 }}>Contact</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Phone</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 600 }}>Duration</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 600 }}>Outcome</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 600 }}>Recording</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data.recentCalls && data.recentCalls.length > 0 ? (
                        data.recentCalls.map((call) => (
                          <TableRow key={call.id} hover>
                            <TableCell>{call.contact?.name || '-'}</TableCell>
                            <TableCell>{call.phone_number}</TableCell>
                            <TableCell align="center">{formatDuration(call.duration)}</TableCell>
                            <TableCell align="center">
                              <Chip
                                label={call.outcome}
                                size="small"
                                color={getOutcomeColor(call.outcome)}
                              />
                            </TableCell>
                            <TableCell>
                              {format(new Date(call.created_at), 'MMM dd, hh:mm a')}
                            </TableCell>
                            <TableCell align="center">
                              {(call.recording || call.recording_url) ? (
                                <IconButton size="small" color="primary">
                                  <PlayIcon fontSize="small" />
                                </IconButton>
                              ) : (
                                <Typography variant="caption" color="text.secondary">-</Typography>
                              )}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                            <Typography color="text.secondary">No calls found</Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}

            {/* Tab 2: Email History */}
            {currentTab === 2 && (
              <Box sx={{ p: 2 }}>
                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                  Recent Emails
                </Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ bgcolor: '#f9fafb' }}>
                        <TableCell sx={{ fontWeight: 600 }}>To</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Subject</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 600 }}>Status</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Sent At</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data.recentEmails && data.recentEmails.length > 0 ? (
                        data.recentEmails.map((email) => (
                          <TableRow key={email.id} hover>
                            <TableCell>
                              <Box>
                                <Typography variant="body2" fontWeight={500}>
                                  {email.recipient_name || '-'}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {email.recipient_email}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" sx={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {email.subject}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Chip
                                label={email.email_status}
                                size="small"
                                color={email.email_status === 'sent' ? 'success' : email.email_status === 'failed' ? 'error' : 'warning'}
                              />
                            </TableCell>
                            <TableCell>
                              {format(new Date(email.sent_at), 'MMM dd, hh:mm a')}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                            <EmailIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                            <Typography color="text.secondary">No emails found</Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}

            {/* Tab 3: WhatsApp History */}
            {currentTab === 3 && (
              <Box sx={{ p: 2 }}>
                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                  Recent WhatsApp Messages
                </Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ bgcolor: '#f9fafb' }}>
                        <TableCell sx={{ fontWeight: 600 }}>To</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Phone</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Message</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 600 }}>Type</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 600 }}>Status</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Sent At</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data.recentWhatsApp && data.recentWhatsApp.length > 0 ? (
                        data.recentWhatsApp.map((msg) => (
                          <TableRow key={msg.id} hover>
                            <TableCell>{msg.recipient_name || '-'}</TableCell>
                            <TableCell>{msg.phone_number}</TableCell>
                            <TableCell>
                              <Typography variant="body2" sx={{ maxWidth: 250, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {msg.message_preview || '-'}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Chip label={msg.message_type} size="small" variant="outlined" />
                            </TableCell>
                            <TableCell align="center">
                              <Chip
                                label={msg.message_status}
                                size="small"
                                color={getMessageStatusColor(msg.message_status)}
                              />
                            </TableCell>
                            <TableCell>
                              {format(new Date(msg.sent_at), 'MMM dd, hh:mm a')}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                            <WhatsAppIcon sx={{ fontSize: 48, color: '#25D366', opacity: 0.3, mb: 1 }} />
                            <Typography color="text.secondary">No WhatsApp messages found</Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}

            {/* Tab 4: Meeting History */}
            {currentTab === 4 && (
              <Box sx={{ p: 2 }}>
                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                  Recent Meetings
                </Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ bgcolor: '#f9fafb' }}>
                        <TableCell sx={{ fontWeight: 600 }}>Title</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Attendee</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 600 }}>Type</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 600 }}>Duration</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 600 }}>Status</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 600 }}>Outcome</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Scheduled</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data.recentMeetings && data.recentMeetings.length > 0 ? (
                        data.recentMeetings.map((meeting) => (
                          <TableRow key={meeting.id} hover>
                            <TableCell>
                              <Typography variant="body2" fontWeight={500}>
                                {meeting.title}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Box>
                                <Typography variant="body2">{meeting.attendee_name || '-'}</Typography>
                                <Typography variant="caption" color="text.secondary">{meeting.attendee_email || meeting.attendee_phone || ''}</Typography>
                              </Box>
                            </TableCell>
                            <TableCell align="center">
                              <Chip
                                icon={getMeetingTypeIcon(meeting.meeting_type)}
                                label={meeting.meeting_type?.replace('_', ' ')}
                                size="small"
                                variant="outlined"
                              />
                            </TableCell>
                            <TableCell align="center">{meeting.duration_minutes} min</TableCell>
                            <TableCell align="center">
                              <Chip
                                label={meeting.meeting_status}
                                size="small"
                                color={getMeetingStatusColor(meeting.meeting_status)}
                              />
                            </TableCell>
                            <TableCell align="center">
                              <Chip
                                label={meeting.outcome}
                                size="small"
                                color={getMeetingOutcomeColor(meeting.outcome)}
                                variant="outlined"
                              />
                            </TableCell>
                            <TableCell>
                              {format(new Date(meeting.scheduled_at), 'MMM dd, hh:mm a')}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                            <MeetingIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                            <Typography color="text.secondary">No meetings found</Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}
          </>
        ) : (
          <Typography color="text.secondary" align="center" sx={{ p: 4 }}>
            No data available
          </Typography>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UserStatsModal;
