import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Profile
      </Typography>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {user?.full_name}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Email: {user?.email}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Role: {user?.role}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ProfilePage;
