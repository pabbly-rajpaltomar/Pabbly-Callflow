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
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';
import {
  TrendingDown as TrendingDownIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';

const ConversionFunnelChart = ({ data }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Colors matching Kanban board stages
  const stageColors = {
    'new': '#2196f3',       // Blue for New
    'contacted': '#ff9800', // Orange for Contacted
    'qualified': '#9c27b0', // Purple for Qualified
    'converted': '#4caf50', // Green for Converted
    'lost': '#f44336'       // Red for Lost
  };

  const getColor = (stage, index) => {
    return stageColors[stage?.status] || ['#2196f3', '#ff9800', '#9c27b0', '#4caf50', '#f44336'][index];
  };

  // Check if data is empty or all counts are 0
  const hasData = data && data.length > 0 && data.some(stage => stage.count > 0);

  return (
    <Paper sx={{ p: { xs: 2, md: 3 } }}>
      <Typography variant="h6" gutterBottom>
        Lead Pipeline Funnel
      </Typography>

      {!hasData ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1" color="text.secondary">
            No leads data available for the selected date range.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Move leads in the Kanban board to see the funnel update.
          </Typography>
        </Box>
      ) : (
        <>
          {/* Stats Cards */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {data && data.map((stage, index) => (
              <Grid item xs={6} sm={6} md={2.4} key={index}>
                <Card sx={{
                  bgcolor: getColor(stage, index),
                  color: 'white',
                  height: '100%'
                }}>
                  <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                    <Typography variant="body2" sx={{ opacity: 0.9, mb: 0.5 }}>
                      {stage.name}
                    </Typography>
                    <Typography variant="h4" fontWeight="bold">
                      {stage.count}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                      <TrendingDownIcon sx={{ fontSize: 16 }} />
                      <Typography variant="caption">
                        {stage.percentage || 0}% of total
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                      <ScheduleIcon sx={{ fontSize: 16 }} />
                      <Typography variant="caption">
                        {stage.avgDays} days avg
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {/* Chart */}
      {hasData && (
        <Box sx={{ width: '100%', height: { xs: 300, sm: 400 } }}>
          <ResponsiveContainer>
            <BarChart
              data={data}
              margin={{
                top: 20,
                right: isMobile ? 10 : 30,
                left: isMobile ? 0 : 20,
                bottom: isMobile ? 30 : 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                angle={isMobile ? -45 : 0}
                textAnchor={isMobile ? 'end' : 'middle'}
                height={isMobile ? 80 : 40}
                tick={{ fontSize: isMobile ? 10 : 12 }}
              />
              <YAxis tick={{ fontSize: isMobile ? 10 : 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #ccc',
                  borderRadius: '4px'
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: isMobile ? '12px' : '14px' }}
              />
              <Bar dataKey="count" name="Leads Count" fill="#8884d8">
                {data && data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getColor(entry, index)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Box>
      )}
    </Paper>
  );
};

export default ConversionFunnelChart;
