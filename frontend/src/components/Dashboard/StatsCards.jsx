import React from 'react';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import {
  Phone as PhoneIcon,
  CheckCircle as CheckIcon,
  Timer as TimerIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';

const StatCard = ({ title, value, icon, color, gradient }) => (
  <Card
    sx={{
      borderRadius: 2,
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
      border: '1px solid #F0F0F0',
      transition: 'all 0.3s ease',
      '&:hover': {
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
        transform: 'translateY(-2px)',
      },
    }}
  >
    <CardContent sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="body2"
            sx={{
              color: '#666',
              fontWeight: 500,
              fontSize: '0.85rem',
              mb: 1.5,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            {title}
          </Typography>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: '#1a1a1a',
              fontSize: '2rem',
            }}
          >
            {value}
          </Typography>
        </Box>
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: 2,
            background: gradient,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 4px 12px ${color}30`,
          }}
        >
          {React.cloneElement(icon, { sx: { fontSize: 28, color: 'white' } })}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const StatsCards = ({ stats }) => {
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Total Calls"
          value={stats?.totalCalls || 0}
          icon={<PhoneIcon />}
          color="#2196F3"
          gradient="linear-gradient(135deg, #2196F3 0%, #1976D2 100%)"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Answered Calls"
          value={stats?.answeredCalls || 0}
          icon={<CheckIcon />}
          color="#4CAF50"
          gradient="linear-gradient(135deg, #4CAF50 0%, #388E3C 100%)"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Avg Duration"
          value={formatDuration(stats?.avgDuration || 0)}
          icon={<TimerIcon />}
          color="#FF9800"
          gradient="linear-gradient(135deg, #FF9800 0%, #F57C00 100%)"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Conversion Rate"
          value={`${stats?.conversionRate || 0}%`}
          icon={<TrendingUpIcon />}
          color="#9C27B0"
          gradient="linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%)"
        />
      </Grid>
    </Grid>
  );
};

export default StatsCards;
