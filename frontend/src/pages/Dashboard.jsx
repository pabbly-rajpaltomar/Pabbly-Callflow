import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, CircularProgress } from '@mui/material';
import StatsCards from '../components/Dashboard/StatsCards';
import CallsChart from '../components/Dashboard/CallsChart';
import TeamPerformance from '../components/Dashboard/TeamPerformance';
import analyticsService from '../services/analyticsService';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [callsOverTime, setCallsOverTime] = useState([]);
  const [teamPerformance, setTeamPerformance] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const statsData = await analyticsService.getDashboardStats();
      setStats(statsData.data);

      const callsData = await analyticsService.getCallsOverTime({ interval: 'day' });
      setCallsOverTime(callsData.data.callsOverTime);

      if (user.role !== 'sales_rep') {
        const teamData = await analyticsService.getTeamPerformance();
        setTeamPerformance(teamData.data.teamPerformance);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ fontSize: { xs: '1.75rem', sm: '2.125rem' } }}>
        Dashboard
      </Typography>

      <Box sx={{ mt: { xs: 2, sm: 3 } }}>
        <StatsCards stats={stats} />
      </Box>

      <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mt: { xs: 1, sm: 2 } }}>
        <Grid item xs={12} lg={8}>
          <CallsChart data={callsOverTime} />
        </Grid>
        <Grid item xs={12} lg={4}>
          <Box>
            {/* Additional charts or stats can go here */}
          </Box>
        </Grid>
      </Grid>

      {user.role !== 'sales_rep' && (
        <Box sx={{ mt: { xs: 2, sm: 3 } }}>
          <TeamPerformance data={teamPerformance} />
        </Box>
      )}
    </Box>
  );
};

export default Dashboard;
