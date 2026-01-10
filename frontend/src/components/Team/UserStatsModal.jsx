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
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Close as CloseIcon,
  Phone as PhoneIcon,
  CheckCircle as CheckIcon,
  TrendingUp as TrendingUpIcon,
  Today as TodayIcon,
  DateRange as WeekIcon,
  CalendarMonth as MonthIcon
} from '@mui/icons-material';
import userService from '../../services/userService';
import { format } from 'date-fns';

const UserStatsModal = ({ open, onClose, userId }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    if (open && userId) {
      fetchUserStats();
    }
  }, [open, userId]);

  const fetchUserStats = async () => {
    try {
      setLoading(true);
      const response = await userService.getUserStats(userId);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching user stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatActivityType = (type) => {
    return type.split('_').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      fullScreen={isMobile}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">User Statistics</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : data ? (
          <>
            {/* User Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
              <Avatar
                sx={{
                  width: { xs: 56, sm: 72 },
                  height: { xs: 56, sm: 72 },
                  bgcolor: theme.palette.primary.main,
                  fontSize: { xs: '1.5rem', sm: '2rem' }
                }}
              >
                {data.user.full_name?.[0]}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
                  {data.user.full_name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {data.user.email}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                  <Chip label={data.user.role} size="small" color="primary" />
                  <Chip
                    label={data.user.is_active ? 'Active' : 'Inactive'}
                    size="small"
                    color={data.user.is_active ? 'success' : 'default'}
                  />
                </Box>
              </Box>
            </Box>

            {/* Stats Cards */}
            <Typography variant="subtitle1" gutterBottom fontWeight="bold">
              Call Statistics
            </Typography>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={6} sm={3}>
                <Card>
                  <CardContent sx={{ textAlign: 'center', p: 2 }}>
                    <TodayIcon color="primary" sx={{ fontSize: 32, mb: 1 }} />
                    <Typography variant="h5" fontWeight="bold">
                      {data.stats.callsToday}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Calls Today
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Card>
                  <CardContent sx={{ textAlign: 'center', p: 2 }}>
                    <WeekIcon color="primary" sx={{ fontSize: 32, mb: 1 }} />
                    <Typography variant="h5" fontWeight="bold">
                      {data.stats.callsWeek}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Calls This Week
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Card>
                  <CardContent sx={{ textAlign: 'center', p: 2 }}>
                    <MonthIcon color="primary" sx={{ fontSize: 32, mb: 1 }} />
                    <Typography variant="h5" fontWeight="bold">
                      {data.stats.callsMonth}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Calls This Month
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Card>
                  <CardContent sx={{ textAlign: 'center', p: 2 }}>
                    <PhoneIcon color="primary" sx={{ fontSize: 32, mb: 1 }} />
                    <Typography variant="h5" fontWeight="bold">
                      {data.stats.totalCalls}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Total Calls
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Performance Metrics */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={4}>
                <Card sx={{ bgcolor: '#e3f2fd' }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <CheckIcon sx={{ fontSize: 32, color: '#2196f3', mb: 1 }} />
                    <Typography variant="h5" fontWeight="bold">
                      {data.stats.answeredCalls}
                    </Typography>
                    <Typography variant="caption">
                      Answered Calls
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Card sx={{ bgcolor: '#e8f5e9' }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <TrendingUpIcon sx={{ fontSize: 32, color: '#4caf50', mb: 1 }} />
                    <Typography variant="h5" fontWeight="bold">
                      {data.stats.convertedCalls}
                    </Typography>
                    <Typography variant="caption">
                      Converted Calls
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Card sx={{ bgcolor: '#fff3e0' }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <TrendingUpIcon sx={{ fontSize: 32, color: '#ff9800', mb: 1 }} />
                    <Typography variant="h5" fontWeight="bold">
                      {data.stats.conversionRate}%
                    </Typography>
                    <Typography variant="caption">
                      Conversion Rate
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Recent Activity */}
            <Typography variant="subtitle1" gutterBottom fontWeight="bold">
              Recent Activity
            </Typography>
            <Card>
              <List sx={{ maxHeight: 250, overflow: 'auto' }}>
                {data.recentActivities && data.recentActivities.length > 0 ? (
                  data.recentActivities.map((activity, index) => (
                    <ListItem key={index} divider={index < data.recentActivities.length - 1}>
                      <ListItemText
                        primary={formatActivityType(activity.activity_type)}
                        secondary={format(new Date(activity.activity_timestamp), 'PPpp')}
                      />
                    </ListItem>
                  ))
                ) : (
                  <ListItem>
                    <ListItemText
                      primary="No recent activity"
                      secondary="Activity will appear here once the user starts using the system"
                    />
                  </ListItem>
                )}
              </List>
            </Card>
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
