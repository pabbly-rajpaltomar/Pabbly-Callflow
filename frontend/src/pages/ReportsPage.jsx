import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  CircularProgress,
  Paper,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  TrendingUp as FunnelIcon,
  EmojiEvents as RankingsIcon,
  Assessment as QualityIcon,
  Download as ExportIcon
} from '@mui/icons-material';
import DateRangePicker from '../components/Analytics/DateRangePicker';
import ConversionFunnelChart from '../components/Analytics/ConversionFunnelChart';
import PerformanceRankings from '../components/Analytics/PerformanceRankings';
import CallQualityDashboard from '../components/Analytics/CallQualityDashboard';
import ExportButton from '../components/Analytics/ExportButton';
import analyticsService from '../services/analyticsService';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';

function TabPanel({ children, value, index }) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const ReportsPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { user } = useAuth();

  const [currentTab, setCurrentTab] = useState(0);
  const [loading, setLoading] = useState(false);
  // Default to last 30 days to show all recent leads
  const [dateRange, setDateRange] = useState({
    start_date: format(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
    end_date: format(new Date(), 'yyyy-MM-dd')
  });

  // Analytics data
  const [funnelData, setFunnelData] = useState([]);
  const [rankingsData, setRankingsData] = useState([]);
  const [qualityData, setQualityData] = useState(null);
  const [rankingMetric, setRankingMetric] = useState('totalCalls');

  useEffect(() => {
    fetchReportsData();
  }, [dateRange, rankingMetric]);

  const fetchReportsData = async () => {
    try {
      setLoading(true);

      // Fetch all analytics data
      const [funnelResponse, rankingsResponse, qualityResponse] = await Promise.all([
        analyticsService.getConversionFunnel(dateRange),
        analyticsService.getPerformanceRankings({ ...dateRange, metric: rankingMetric }),
        analyticsService.getCallQuality(dateRange)
      ]);

      setFunnelData(funnelResponse.data.funnel);
      setRankingsData(rankingsResponse.data.rankings);
      setQualityData(qualityResponse.data);
    } catch (error) {
      console.error('Error fetching reports data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (newDateRange) => {
    setDateRange(newDateRange);
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleMetricChange = (metric) => {
    setRankingMetric(metric);
  };

  // Only managers and admins can see reports
  if (user?.role === 'sales_rep') {
    return (
      <Box sx={{ p: 3 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            Access Denied
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Only managers and administrators can view reports.
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: { xs: 'flex-start', sm: 'center' },
        flexDirection: { xs: 'column', sm: 'row' },
        gap: 2,
        mb: 3
      }}>
        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{ fontSize: { xs: '1.75rem', sm: '2.125rem' } }}
        >
          Reports & Analytics
        </Typography>
        <ExportButton dateRange={dateRange} />
      </Box>

      {/* Date Range Picker */}
      <DateRangePicker
        onDateChange={handleDateChange}
        initialStartDate={dateRange.start_date}
        initialEndDate={dateRange.end_date}
      />

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          variant={isMobile ? 'scrollable' : 'fullWidth'}
          scrollButtons={isMobile ? 'auto' : false}
          sx={{
            borderBottom: 1,
            borderColor: 'divider'
          }}
        >
          <Tab
            icon={<FunnelIcon />}
            label="Conversion Funnel"
            iconPosition="start"
            sx={{ minHeight: 64 }}
          />
          <Tab
            icon={<RankingsIcon />}
            label="Performance Rankings"
            iconPosition="start"
            sx={{ minHeight: 64 }}
          />
          <Tab
            icon={<QualityIcon />}
            label="Call Quality"
            iconPosition="start"
            sx={{ minHeight: 64 }}
          />
        </Tabs>
      </Paper>

      {/* Loading State */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Tab 1: Conversion Funnel */}
          <TabPanel value={currentTab} index={0}>
            <ConversionFunnelChart data={funnelData} />
            <Paper sx={{ p: 3, mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Funnel Insights
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                The conversion funnel shows how leads progress through your sales pipeline from initial capture to conversion.
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                <Box>
                  <Typography variant="subtitle2" color="primary">
                    Key Metrics:
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • Conversion rates between stages
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • Average days spent in each stage
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • Total count at each funnel level
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="primary">
                    Use This Data To:
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • Identify bottlenecks in your pipeline
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • Optimize conversion at each stage
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • Set realistic sales targets
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </TabPanel>

          {/* Tab 2: Performance Rankings */}
          <TabPanel value={currentTab} index={1}>
            <PerformanceRankings
              data={rankingsData}
              onMetricChange={handleMetricChange}
            />
            <Paper sx={{ p: 3, mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Performance Insights
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Compare team member performance across key metrics to identify top performers and areas for improvement.
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                <Box>
                  <Typography variant="subtitle2" color="primary">
                    Metrics Tracked:
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • Total calls made
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • Answer rate percentage
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • Conversion rate
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • Average call duration
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="primary">
                    Use This Data To:
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • Recognize top performers
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • Provide targeted coaching
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • Set performance benchmarks
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </TabPanel>

          {/* Tab 3: Call Quality */}
          <TabPanel value={currentTab} index={2}>
            <CallQualityDashboard data={qualityData} />
            <Paper sx={{ p: 3, mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Call Quality Insights
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Analyze call patterns, duration distribution, and optimal calling times to improve team effectiveness.
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                <Box>
                  <Typography variant="subtitle2" color="primary">
                    Quality Metrics:
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • Call duration distribution
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • Outcome breakdown
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • Best time slots for calls
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • Success and callback rates
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="primary">
                    Use This Data To:
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • Optimize calling schedules
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • Improve call strategies
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • Reduce missed calls
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </TabPanel>
        </>
      )}
    </Box>
  );
};

export default ReportsPage;
