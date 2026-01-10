import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  MenuItem,
  TextField,
  Chip,
  Avatar,
  Card,
  CardContent,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  EmojiEvents as TrophyIcon,
  Phone as PhoneIcon,
  CheckCircle as CheckIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';

const PerformanceRankings = ({ data, onMetricChange }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [selectedMetric, setSelectedMetric] = useState('totalCalls');

  const handleMetricChange = (event) => {
    const metric = event.target.value;
    setSelectedMetric(metric);
    onMetricChange(metric);
  };

  const getMedalColor = (rank) => {
    if (rank === 1) return '#FFD700'; // Gold
    if (rank === 2) return '#C0C0C0'; // Silver
    if (rank === 3) return '#CD7F32'; // Bronze
    return 'transparent';
  };

  const renderMobileCard = (item) => (
    <Card key={item.user?.id} sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          {item.rank <= 3 && (
            <TrophyIcon sx={{ color: getMedalColor(item.rank), fontSize: 32 }} />
          )}
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="h6" sx={{ fontSize: '1rem' }}>
                #{item.rank}
              </Typography>
              <Typography variant="h6" sx={{ fontSize: '1rem', flex: 1 }}>
                {item.user?.full_name}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              {item.user?.email}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Total Calls
            </Typography>
            <Typography variant="body1" fontWeight="bold">
              {item.totalCalls}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Answered
            </Typography>
            <Typography variant="body1" fontWeight="bold">
              {item.answeredCalls}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Answer Rate
            </Typography>
            <Typography variant="body1" fontWeight="bold">
              {item.answeredRate}%
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Conversion
            </Typography>
            <Typography variant="body1" fontWeight="bold">
              {item.conversionRate}%
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Avg Duration
            </Typography>
            <Typography variant="body1" fontWeight="bold">
              {item.avgDuration}s
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Calls/Conv
            </Typography>
            <Typography variant="body1" fontWeight="bold">
              {item.callsPerConversion}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Paper sx={{ p: { xs: 2, md: 3 } }}>
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: { xs: 'flex-start', sm: 'center' },
        flexDirection: { xs: 'column', sm: 'row' },
        gap: 2,
        mb: 3
      }}>
        <Typography variant="h6">
          Performance Rankings
        </Typography>
        <TextField
          select
          size="small"
          label="Sort By"
          value={selectedMetric}
          onChange={handleMetricChange}
          sx={{ minWidth: { xs: '100%', sm: 200 } }}
        >
          <MenuItem value="totalCalls">Total Calls</MenuItem>
          <MenuItem value="conversionRate">Conversion Rate</MenuItem>
          <MenuItem value="answeredRate">Answer Rate</MenuItem>
          <MenuItem value="avgDuration">Avg Duration</MenuItem>
        </TextField>
      </Box>

      {isMobile ? (
        <Box>
          {data && data.map(renderMobileCard)}
        </Box>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Rank</TableCell>
                <TableCell>User</TableCell>
                <TableCell align="center">Total Calls</TableCell>
                <TableCell align="center">Answered</TableCell>
                <TableCell align="center">Missed</TableCell>
                <TableCell align="center">Answer Rate</TableCell>
                <TableCell align="center">Converted</TableCell>
                <TableCell align="center">Conversion Rate</TableCell>
                <TableCell align="center">Avg Duration</TableCell>
                <TableCell align="center">Calls/Conversion</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data && data.map((item) => (
                <TableRow
                  key={item.user?.id}
                  sx={{
                    bgcolor: item.rank <= 3 ? `${getMedalColor(item.rank)}15` : 'inherit',
                    '&:hover': {
                      bgcolor: item.rank <= 3 ? `${getMedalColor(item.rank)}25` : 'action.hover'
                    }
                  }}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {item.rank <= 3 && (
                        <TrophyIcon sx={{ color: getMedalColor(item.rank) }} />
                      )}
                      <Typography fontWeight="bold">
                        #{item.rank}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: theme.palette.primary.main }}>
                        {item.user?.full_name?.[0]}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          {item.user?.full_name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {item.user?.email}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      icon={<PhoneIcon />}
                      label={item.totalCalls}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      icon={<CheckIcon />}
                      label={item.answeredCalls}
                      size="small"
                      color="success"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="center">{item.missedCalls}</TableCell>
                  <TableCell align="center">
                    <Chip
                      label={`${item.answeredRate}%`}
                      size="small"
                      color={parseFloat(item.answeredRate) >= 80 ? 'success' : 'warning'}
                    />
                  </TableCell>
                  <TableCell align="center">{item.convertedCalls}</TableCell>
                  <TableCell align="center">
                    <Chip
                      icon={<TrendingUpIcon />}
                      label={`${item.conversionRate}%`}
                      size="small"
                      color={parseFloat(item.conversionRate) >= 50 ? 'success' : 'default'}
                    />
                  </TableCell>
                  <TableCell align="center">{item.avgDuration}s</TableCell>
                  <TableCell align="center">{item.callsPerConversion}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {(!data || data.length === 0) && (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography color="text.secondary">
            No performance data available
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default PerformanceRankings;
