import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Paper,
  Grid,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Today as TodayIcon,
  DateRange as DateRangeIcon
} from '@mui/icons-material';
import { format, subDays, startOfMonth } from 'date-fns';

const DateRangePicker = ({ onDateChange, initialStartDate, initialEndDate }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const today = format(new Date(), 'yyyy-MM-dd');
  const [startDate, setStartDate] = useState(initialStartDate || today);
  const [endDate, setEndDate] = useState(initialEndDate || today);

  const handleApply = () => {
    onDateChange({ start_date: startDate, end_date: endDate });
  };

  const handleQuickSelect = (days) => {
    const end = new Date();
    const start = days === 0 ? end : subDays(end, days - 1);
    const startStr = format(start, 'yyyy-MM-dd');
    const endStr = format(end, 'yyyy-MM-dd');
    setStartDate(startStr);
    setEndDate(endStr);
    onDateChange({ start_date: startStr, end_date: endStr });
  };

  const handleThisMonth = () => {
    const start = startOfMonth(new Date());
    const end = new Date();
    const startStr = format(start, 'yyyy-MM-dd');
    const endStr = format(end, 'yyyy-MM-dd');
    setStartDate(startStr);
    setEndDate(endStr);
    onDateChange({ start_date: startStr, end_date: endStr });
  };

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            size="small"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            label="End Date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            size="small"
          />
        </Grid>
        <Grid item xs={12} sm={12} md={6}>
          <Box sx={{
            display: 'flex',
            gap: 1,
            flexWrap: 'wrap',
            justifyContent: { xs: 'flex-start', md: 'flex-end' }
          }}>
            <Button
              size="small"
              variant="outlined"
              startIcon={<TodayIcon />}
              onClick={() => handleQuickSelect(0)}
            >
              Today
            </Button>
            <Button
              size="small"
              variant="outlined"
              onClick={() => handleQuickSelect(7)}
            >
              Last 7 Days
            </Button>
            <Button
              size="small"
              variant="outlined"
              onClick={() => handleQuickSelect(30)}
            >
              Last 30 Days
            </Button>
            <Button
              size="small"
              variant="outlined"
              onClick={handleThisMonth}
            >
              This Month
            </Button>
            <Button
              size="small"
              variant="contained"
              startIcon={<DateRangeIcon />}
              onClick={handleApply}
            >
              Apply
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default DateRangePicker;
