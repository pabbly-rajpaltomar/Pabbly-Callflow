import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';

const ReportsPage = () => {
  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Reports
      </Typography>
      <Card>
        <CardContent>
          <Typography variant="body1">
            Reports and analytics will be displayed here.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ReportsPage;
