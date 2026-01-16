import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  LinearProgress,
  Button,
  TextField,
  IconButton,
  Tooltip,
  Grid
} from '@mui/material';
import {
  Phone as PhoneIcon,
  CheckCircle as CheckIcon,
  Timer as TimerIcon,
  TrendingUp as TrendingUpIcon,
  EmojiEvents as TrophyIcon,
  CalendarMonth as CalendarIcon,
  PersonAdd as LeadsIcon,
  Add as AddIcon,
  Visibility as ViewIcon,
  Call as CallIcon,
  Email as EmailIcon,
  AccessTime as ClockIcon,
  ArrowForward as ArrowIcon,
  PieChart as PieChartIcon,
  PhoneMissed as MissedIcon,
  PhoneCallback as CallbackIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import analyticsService from '../services/analyticsService';
import leadService from '../services/leadService';
import callService from '../services/callService';
import { useAuth } from '../context/AuthContext';
import { format, formatDistanceToNow } from 'date-fns';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [teamPerformance, setTeamPerformance] = useState([]);
  const [recentLeads, setRecentLeads] = useState([]);
  const [recentCalls, setRecentCalls] = useState([]);
  const [leadsByStatus, setLeadsByStatus] = useState({});
  const [dateRange, setDateRange] = useState({
    start_date: format(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
    end_date: format(new Date(), 'yyyy-MM-dd')
  });

  useEffect(() => {
    fetchDashboardData();
  }, [dateRange]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const statsData = await analyticsService.getDashboardStats(dateRange);
      setStats(statsData.data);

      if (user.role !== 'sales_rep') {
        const teamData = await analyticsService.getTeamPerformance(dateRange);
        setTeamPerformance(teamData.data.teamPerformance);
      }

      // Fetch recent leads
      try {
        const leadsData = await leadService.getLeads({ limit: 5 });
        setRecentLeads(leadsData.data?.leads || []);

        // Calculate leads by status
        const allLeadsData = await leadService.getLeads({ limit: 1000 });
        const leads = allLeadsData.data?.leads || [];
        const statusCounts = {
          new: leads.filter(l => l.lead_status === 'new').length,
          contacted: leads.filter(l => l.lead_status === 'contacted').length,
          qualified: leads.filter(l => l.lead_status === 'qualified').length,
          converted: leads.filter(l => l.lead_status === 'converted').length,
          lost: leads.filter(l => l.lead_status === 'lost').length
        };
        setLeadsByStatus(statusCounts);
      } catch (err) {
        console.log('Could not fetch leads:', err);
      }

      // Fetch recent calls
      try {
        const callsData = await callService.getCalls({ limit: 5 });
        setRecentCalls(callsData.data?.calls || []);
      } catch (err) {
        console.log('Could not fetch calls:', err);
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const setQuickDate = (days) => {
    const end = new Date();
    const start = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    setDateRange({
      start_date: format(start, 'yyyy-MM-dd'),
      end_date: format(end, 'yyyy-MM-dd')
    });
  };

  const setToday = () => {
    const today = format(new Date(), 'yyyy-MM-dd');
    setDateRange({ start_date: today, end_date: today });
  };

  const setThisMonth = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    setDateRange({
      start_date: format(start, 'yyyy-MM-dd'),
      end_date: format(now, 'yyyy-MM-dd')
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      new: '#2196f3',
      contacted: '#ff9800',
      qualified: '#9c27b0',
      converted: '#4caf50',
      lost: '#f44336'
    };
    return colors[status] || '#9e9e9e';
  };

  const getCallOutcomeIcon = (outcome) => {
    switch (outcome) {
      case 'answered':
        return <CheckIcon sx={{ color: '#4caf50', fontSize: 18 }} />;
      case 'no_answer':
        return <MissedIcon sx={{ color: '#f44336', fontSize: 18 }} />;
      case 'busy':
        return <PhoneIcon sx={{ color: '#ff9800', fontSize: 18 }} />;
      case 'voicemail':
        return <CallbackIcon sx={{ color: '#9c27b0', fontSize: 18 }} />;
      default:
        return <PhoneIcon sx={{ color: '#9e9e9e', fontSize: 18 }} />;
    }
  };

  const totalLeadsByStatus = Object.values(leadsByStatus).reduce((a, b) => a + b, 0);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Page Title with Quick Actions */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
        <Typography variant="h5" fontWeight={600} color="#111827">
          Dashboard
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            size="small"
            startIcon={<AddIcon />}
            onClick={() => navigate('/leads')}
            sx={{ borderRadius: 1.5, textTransform: 'none' }}
          >
            Add Lead
          </Button>
          <Button
            variant="outlined"
            size="small"
            startIcon={<PhoneIcon />}
            onClick={() => navigate('/calls')}
            sx={{ borderRadius: 1.5, textTransform: 'none' }}
          >
            View Calls
          </Button>
        </Box>
      </Box>

      {/* Date Range Picker */}
      <Paper sx={{ p: 2, mb: 2.5, borderRadius: 2, border: '1px solid #e5e7eb' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            label="Start Date"
            type="date"
            size="small"
            value={dateRange.start_date}
            onChange={(e) => setDateRange({ ...dateRange, start_date: e.target.value })}
            InputLabelProps={{ shrink: true }}
            sx={{ width: 160, '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
          />
          <TextField
            label="End Date"
            type="date"
            size="small"
            value={dateRange.end_date}
            onChange={(e) => setDateRange({ ...dateRange, end_date: e.target.value })}
            InputLabelProps={{ shrink: true }}
            sx={{ width: 160, '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
          />
          <Box sx={{ display: 'flex', gap: 1, ml: 'auto' }}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<CalendarIcon sx={{ fontSize: 16 }} />}
              onClick={setToday}
              sx={{ borderRadius: 1.5, textTransform: 'none', borderColor: '#e5e7eb', color: '#374151' }}
            >
              Today
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={() => setQuickDate(7)}
              sx={{ borderRadius: 1.5, textTransform: 'none', borderColor: '#2196f3', color: '#2196f3' }}
            >
              Last 7 Days
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={() => setQuickDate(30)}
              sx={{ borderRadius: 1.5, textTransform: 'none', borderColor: '#2196f3', color: '#2196f3' }}
            >
              Last 30 Days
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={setThisMonth}
              sx={{ borderRadius: 1.5, textTransform: 'none', borderColor: '#e5e7eb', color: '#374151' }}
            >
              This Month
            </Button>
            <Button
              variant="contained"
              size="small"
              startIcon={<CalendarIcon sx={{ fontSize: 16 }} />}
              onClick={fetchDashboardData}
              sx={{ borderRadius: 1.5, textTransform: 'none' }}
            >
              Apply
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Stats Cards */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2.5 }}>
        {/* Total Leads */}
        <Paper sx={{
          flex: 1,
          p: 2,
          borderRadius: 2,
          background: 'linear-gradient(135deg, #dbeafe 0%, #eff6ff 100%)',
          border: '1px solid #bfdbfe',
          cursor: 'pointer',
          transition: 'transform 0.2s',
          '&:hover': { transform: 'scale(1.02)' }
        }} onClick={() => navigate('/leads')}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography fontSize={12} color="#1e40af" fontWeight={500}>Total Leads</Typography>
              <Typography variant="h4" fontWeight={700} color="#1e3a8a">
                {stats?.totalLeads || 0}
              </Typography>
            </Box>
            <Box sx={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              bgcolor: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <LeadsIcon sx={{ color: 'white', fontSize: 20 }} />
            </Box>
          </Box>
        </Paper>

        {/* Answered Calls */}
        <Paper sx={{
          flex: 1,
          p: 2,
          borderRadius: 2,
          background: 'linear-gradient(135deg, #d1fae5 0%, #ecfdf5 100%)',
          border: '1px solid #a7f3d0',
          cursor: 'pointer',
          transition: 'transform 0.2s',
          '&:hover': { transform: 'scale(1.02)' }
        }} onClick={() => navigate('/calls')}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography fontSize={12} color="#047857" fontWeight={500}>Answered Calls</Typography>
              <Typography variant="h4" fontWeight={700} color="#065f46">
                {stats?.answeredCalls || 0}
              </Typography>
            </Box>
            <Box sx={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              bgcolor: '#16a34a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <CheckIcon sx={{ color: 'white', fontSize: 20 }} />
            </Box>
          </Box>
        </Paper>

        {/* Avg Duration */}
        <Paper sx={{
          flex: 1,
          p: 2,
          borderRadius: 2,
          background: 'linear-gradient(135deg, #fef3c7 0%, #fffbeb 100%)',
          border: '1px solid #fcd34d'
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography fontSize={12} color="#92400e" fontWeight={500}>Avg Duration</Typography>
              <Typography variant="h4" fontWeight={700} color="#78350f">
                {formatDuration(stats?.avgDuration || 0)}
              </Typography>
            </Box>
            <Box sx={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              bgcolor: '#f59e0b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <TimerIcon sx={{ color: 'white', fontSize: 20 }} />
            </Box>
          </Box>
        </Paper>

        {/* Conversion Rate */}
        <Paper sx={{
          flex: 1,
          p: 2,
          borderRadius: 2,
          background: 'linear-gradient(135deg, #ede9fe 0%, #f5f3ff 100%)',
          border: '1px solid #c4b5fd'
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography fontSize={12} color="#6d28d9" fontWeight={500}>Conversion Rate</Typography>
              <Typography variant="h4" fontWeight={700} color="#5b21b6">
                {stats?.conversionRate || 0}%
              </Typography>
            </Box>
            <Box sx={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              bgcolor: '#7c3aed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <TrendingUpIcon sx={{ color: 'white', fontSize: 20 }} />
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* Two Column Layout - Recent Leads & Lead Status */}
      <Grid container spacing={2.5} sx={{ mb: 2.5 }}>
        {/* Recent Leads */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ borderRadius: 2, overflow: 'hidden', border: '1px solid #e5e7eb', height: '100%' }}>
            <Box sx={{
              p: 2,
              borderBottom: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <LeadsIcon sx={{ color: '#2196f3', fontSize: 22 }} />
                <Typography fontSize={16} fontWeight={600} color="#111827">Recent Leads</Typography>
              </Box>
              <Button
                size="small"
                endIcon={<ArrowIcon />}
                onClick={() => navigate('/leads')}
                sx={{ textTransform: 'none' }}
              >
                View All
              </Button>
            </Box>

            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: '#f9fafb' }}>
                    <TableCell sx={{ fontWeight: 600, color: '#374151', fontSize: 13, py: 1.5 }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#374151', fontSize: 13, py: 1.5 }}>Phone</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#374151', fontSize: 13, py: 1.5 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#374151', fontSize: 13, py: 1.5 }}>Source</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#374151', fontSize: 13, py: 1.5 }}>Added</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 600, color: '#374151', fontSize: 13, py: 1.5 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentLeads.length > 0 ? recentLeads.map((lead) => (
                    <TableRow key={lead.id} sx={{ '&:hover': { bgcolor: '#f9fafb' } }}>
                      <TableCell sx={{ py: 1.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar sx={{ width: 28, height: 28, bgcolor: '#e0e7ff', color: '#4f46e5', fontSize: 12 }}>
                            {lead.name?.charAt(0)?.toUpperCase()}
                          </Avatar>
                          <Typography fontSize={13} fontWeight={500}>{lead.name}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography fontSize={13} color="#6b7280">{lead.phone}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={lead.lead_status}
                          size="small"
                          sx={{
                            bgcolor: `${getStatusColor(lead.lead_status)}15`,
                            color: getStatusColor(lead.lead_status),
                            fontWeight: 500,
                            fontSize: 11,
                            height: 22
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography fontSize={13} color="#6b7280">{lead.source || '-'}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography fontSize={12} color="#9ca3af">
                          {lead.created_at ? formatDistanceToNow(new Date(lead.created_at), { addSuffix: true }) : '-'}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="View Lead">
                          <IconButton size="small" onClick={() => navigate(`/leads/${lead.id}`)}>
                            <ViewIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                        <Typography color="#9ca3af">No recent leads</Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Lead Status Breakdown */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ borderRadius: 2, overflow: 'hidden', border: '1px solid #e5e7eb', height: '100%' }}>
            <Box sx={{
              p: 2,
              borderBottom: '1px solid #e5e7eb',
              display: 'flex',
              alignItems: 'center',
              gap: 1.5
            }}>
              <PieChartIcon sx={{ color: '#9c27b0', fontSize: 22 }} />
              <Typography fontSize={16} fontWeight={600} color="#111827">Lead Status</Typography>
            </Box>

            <Box sx={{ p: 2 }}>
              {Object.entries(leadsByStatus).map(([status, count]) => {
                const percentage = totalLeadsByStatus > 0 ? Math.round((count / totalLeadsByStatus) * 100) : 0;
                return (
                  <Box key={status} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography fontSize={13} fontWeight={500} sx={{ textTransform: 'capitalize' }}>
                        {status}
                      </Typography>
                      <Typography fontSize={13} color="#6b7280">
                        {count} ({percentage}%)
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={percentage}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: '#e5e7eb',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: getStatusColor(status),
                          borderRadius: 4
                        }
                      }}
                    />
                  </Box>
                );
              })}

              <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid #e5e7eb' }}>
                <Typography fontSize={12} color="#9ca3af" textAlign="center">
                  Total: {totalLeadsByStatus} leads
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Recent Calls */}
      <Paper sx={{ borderRadius: 2, overflow: 'hidden', border: '1px solid #e5e7eb', mb: 2.5 }}>
        <Box sx={{
          p: 2,
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <PhoneIcon sx={{ color: '#4caf50', fontSize: 22 }} />
            <Typography fontSize={16} fontWeight={600} color="#111827">Recent Calls</Typography>
          </Box>
          <Button
            size="small"
            endIcon={<ArrowIcon />}
            onClick={() => navigate('/calls')}
            sx={{ textTransform: 'none' }}
          >
            View All
          </Button>
        </Box>

        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: '#f9fafb' }}>
                <TableCell sx={{ fontWeight: 600, color: '#374151', fontSize: 13, py: 1.5 }}>Contact</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#374151', fontSize: 13, py: 1.5 }}>Phone</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#374151', fontSize: 13, py: 1.5 }}>Outcome</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#374151', fontSize: 13, py: 1.5 }}>Duration</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#374151', fontSize: 13, py: 1.5 }}>Time</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#374151', fontSize: 13, py: 1.5 }}>Called By</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recentCalls.length > 0 ? recentCalls.map((call) => (
                <TableRow key={call.id} sx={{ '&:hover': { bgcolor: '#f9fafb' } }}>
                  <TableCell sx={{ py: 1.5 }}>
                    <Typography fontSize={13} fontWeight={500}>
                      {call.lead?.name || call.contact?.name || 'Unknown'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography fontSize={13} color="#6b7280">{call.phone_number}</Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      {getCallOutcomeIcon(call.outcome)}
                      <Typography fontSize={13} sx={{ textTransform: 'capitalize' }}>
                        {call.outcome?.replace('_', ' ') || '-'}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography fontSize={13} color="#6b7280">
                      {call.duration ? formatDuration(call.duration) : '-'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography fontSize={12} color="#9ca3af">
                      {call.started_at ? formatDistanceToNow(new Date(call.started_at), { addSuffix: true }) : '-'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography fontSize={13} color="#6b7280">
                      {call.user?.full_name || '-'}
                    </Typography>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography color="#9ca3af">No recent calls</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Team Performance Table */}
      {user.role !== 'sales_rep' && (
        <Paper sx={{ borderRadius: 2, overflow: 'hidden', border: '1px solid #e5e7eb', mb: 2.5 }}>
          <Box sx={{
            p: 2,
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <TrophyIcon sx={{ color: '#f59e0b', fontSize: 22 }} />
              <Typography fontSize={16} fontWeight={600} color="#111827">Team Performance</Typography>
            </Box>
            <Chip
              label={`${teamPerformance?.length || 0} Members`}
              size="small"
              sx={{ bgcolor: '#f3f4f6', fontWeight: 500, fontSize: 12 }}
            />
          </Box>

          <TableContainer>
            <Table size="medium">
              <TableHead>
                <TableRow sx={{ bgcolor: '#f9fafb' }}>
                  <TableCell sx={{ fontWeight: 600, color: '#374151', fontSize: 13, py: 1.5 }}>Rank</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#374151', fontSize: 13, py: 1.5 }}>Team Member</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600, color: '#374151', fontSize: 13, py: 1.5 }}>Total Calls</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600, color: '#374151', fontSize: 13, py: 1.5 }}>Answered</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600, color: '#374151', fontSize: 13, py: 1.5 }}>Answer Rate</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600, color: '#374151', fontSize: 13, py: 1.5 }}>Avg Duration</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600, color: '#374151', fontSize: 13, py: 1.5 }}>Conversion</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {teamPerformance && teamPerformance.length > 0 ? (
                  teamPerformance.map((member, index) => {
                    const answerRate = member.totalCalls > 0
                      ? Math.round((member.answeredCalls / member.totalCalls) * 100)
                      : 0;

                    return (
                      <TableRow key={member.user.id} sx={{ '&:hover': { bgcolor: '#f9fafb' } }}>
                        <TableCell sx={{ py: 2 }}>
                          {index === 0 ? (
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <TrophyIcon sx={{ color: '#fbbf24', fontSize: 20 }} />
                            </Box>
                          ) : (
                            <Typography fontSize={14} color="#6b7280">#{index + 1}</Typography>
                          )}
                        </TableCell>
                        <TableCell sx={{ py: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Avatar sx={{ width: 32, height: 32, bgcolor: '#e0e7ff', color: '#4f46e5', fontSize: 13, fontWeight: 600 }}>
                              {member.user.full_name?.charAt(0)?.toUpperCase() || 'U'}
                            </Avatar>
                            <Box>
                              <Typography fontSize={14} fontWeight={500} color="#111827">
                                {member.user.full_name}
                              </Typography>
                              <Typography fontSize={12} color="#9ca3af">
                                {member.user.email}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell align="center" sx={{ py: 2 }}>
                          <Typography fontWeight={600} fontSize={14} color="#111827">
                            {member.totalCalls}
                          </Typography>
                        </TableCell>
                        <TableCell align="center" sx={{ py: 2 }}>
                          <Typography fontWeight={500} fontSize={14} color="#22c55e">
                            {member.answeredCalls}
                          </Typography>
                        </TableCell>
                        <TableCell align="center" sx={{ py: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                            <Box sx={{ width: 60 }}>
                              <LinearProgress
                                variant="determinate"
                                value={answerRate}
                                sx={{
                                  height: 6,
                                  borderRadius: 3,
                                  bgcolor: '#e5e7eb',
                                  '& .MuiLinearProgress-bar': {
                                    bgcolor: answerRate >= 70 ? '#22c55e' : answerRate >= 40 ? '#f59e0b' : '#ef4444',
                                    borderRadius: 3
                                  }
                                }}
                              />
                            </Box>
                            <Typography fontSize={13} fontWeight={500} color="#111827">
                              {answerRate}%
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="center" sx={{ py: 2 }}>
                          <Typography fontSize={14} color="#6b7280">
                            {Math.floor(member.avgDuration / 60)}m {member.avgDuration % 60}s
                          </Typography>
                        </TableCell>
                        <TableCell align="center" sx={{ py: 2 }}>
                          <Typography
                            fontSize={14}
                            fontWeight={500}
                            color={member.conversionRate >= 20 ? '#22c55e' : member.conversionRate >= 10 ? '#f59e0b' : '#ef4444'}
                          >
                            {member.conversionRate}%
                          </Typography>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                      <Typography color="#9ca3af">No team data available</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

    </Box>
  );
};

export default Dashboard;
