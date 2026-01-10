import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  CheckCircle as SuccessIcon,
  Schedule as CallbackIcon
} from '@mui/icons-material';

const CallQualityDashboard = ({ data }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const COLORS = ['#4caf50', '#2196f3', '#ff9800', '#f44336', '#9c27b0'];

  const formatTimeSlot = (hour) => {
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:00 ${ampm}`;
  };

  return (
    <Paper sx={{ p: { xs: 2, md: 3 } }}>
      <Typography variant="h6" gutterBottom>
        Call Quality Analytics
      </Typography>

      {/* Key Metrics */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <Card sx={{ bgcolor: '#4caf50', color: 'white' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <SuccessIcon sx={{ fontSize: 40 }} />
              <Box>
                <Typography variant="h4" fontWeight="bold">
                  {data?.successRate || 0}%
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Success Rate (Answered Calls)
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card sx={{ bgcolor: '#2196f3', color: 'white' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <CallbackIcon sx={{ fontSize: 40 }} />
              <Box>
                <Typography variant="h4" fontWeight="bold">
                  {data?.callbackRate || 0}%
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Callback Rate
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts Grid */}
      <Grid container spacing={2}>
        {/* Duration Distribution */}
        <Grid item xs={12} md={6}>
          <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
            <Typography variant="subtitle1" gutterBottom>
              Call Duration Distribution
            </Typography>
            <Box sx={{ width: '100%', height: { xs: 250, sm: 300 } }}>
              <ResponsiveContainer>
                <BarChart
                  data={data?.durationDistribution || []}
                  margin={{
                    top: 10,
                    right: isMobile ? 5 : 20,
                    left: isMobile ? -10 : 0,
                    bottom: isMobile ? 20 : 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="bucket"
                    tick={{ fontSize: isMobile ? 10 : 12 }}
                    angle={isMobile ? -20 : 0}
                    textAnchor={isMobile ? 'end' : 'middle'}
                  />
                  <YAxis tick={{ fontSize: isMobile ? 10 : 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #ccc',
                      borderRadius: '4px'
                    }}
                  />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Outcome Distribution */}
        <Grid item xs={12} md={6}>
          <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
            <Typography variant="subtitle1" gutterBottom>
              Call Outcome Distribution
            </Typography>
            <Box sx={{ width: '100%', height: { xs: 250, sm: 300 } }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={data?.outcomeDistribution || []}
                    cx="50%"
                    cy="50%"
                    labelLine={!isMobile}
                    label={!isMobile ? (entry) => `${entry.outcome}: ${entry.percentage}%` : false}
                    outerRadius={isMobile ? 60 : 80}
                    fill="#8884d8"
                    dataKey="count"
                    nameKey="outcome"
                  >
                    {data?.outcomeDistribution?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name, props) => [
                      `${value} calls (${props.payload.percentage}%)`,
                      props.payload.outcome
                    ]}
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #ccc',
                      borderRadius: '4px'
                    }}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: isMobile ? '10px' : '12px' }}
                    formatter={(value, entry) => `${entry.payload.outcome} (${entry.payload.percentage}%)`}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Best Time Slots */}
        <Grid item xs={12}>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Best Time Slots (Most Answered Calls)
            </Typography>
            <Box sx={{ width: '100%', height: { xs: 250, sm: 300 } }}>
              <ResponsiveContainer>
                <BarChart
                  data={data?.bestTimeSlots?.map(slot => ({
                    ...slot,
                    timeLabel: formatTimeSlot(slot.hour)
                  })) || []}
                  margin={{
                    top: 10,
                    right: isMobile ? 10 : 30,
                    left: isMobile ? 0 : 20,
                    bottom: isMobile ? 20 : 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="timeLabel"
                    tick={{ fontSize: isMobile ? 10 : 12 }}
                    angle={isMobile ? -20 : 0}
                    textAnchor={isMobile ? 'end' : 'middle'}
                  />
                  <YAxis tick={{ fontSize: isMobile ? 10 : 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #ccc',
                      borderRadius: '4px'
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: isMobile ? '12px' : '14px' }} />
                  <Bar dataKey="count" fill="#4caf50" name="Answered Calls" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {(!data || Object.keys(data).length === 0) && (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography color="text.secondary">
            No call quality data available
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default CallQualityDashboard;
