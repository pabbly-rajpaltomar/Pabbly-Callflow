import React, { useState, useRef } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Button,
  TextField,
  Grid,
  IconButton,
  Divider,
  Alert,
  Snackbar,
  Paper,
  Chip,
  CircularProgress
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  PhotoCamera as CameraIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Badge as BadgeIcon,
  CalendarMonth as CalendarIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import userService from '../services/userService';
import { format } from 'date-fns';

const ProfilePage = () => {
  const { user, refreshUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const fileInputRef = useRef(null);

  // Password change states
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    phone: user?.phone || '',
    avatar_url: user?.avatar_url || ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await userService.updateUser(user.id, formData);
      if (refreshUser) await refreshUser();
      setEditing(false);
      setSnackbar({ open: true, message: 'Profile updated successfully!', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to update profile', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      full_name: user?.full_name || '',
      phone: user?.phone || '',
      avatar_url: user?.avatar_url || ''
    });
    setEditing(false);
  };

  const handleAvatarUrlChange = () => {
    const url = prompt('Enter image URL for your profile photo:', formData.avatar_url);
    if (url !== null) {
      setFormData({ ...formData, avatar_url: url });
    }
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleChangePassword = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setSnackbar({ open: true, message: 'All password fields are required', severity: 'error' });
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setSnackbar({ open: true, message: 'New passwords do not match', severity: 'error' });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setSnackbar({ open: true, message: 'Password must be at least 6 characters', severity: 'error' });
      return;
    }

    try {
      setPasswordLoading(true);
      await userService.changePassword(passwordData.currentPassword, passwordData.newPassword);
      setSnackbar({ open: true, message: 'Password changed successfully!', severity: 'success' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Failed to change password',
        severity: 'error'
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return { bg: '#fee2e2', color: '#dc2626' };
      case 'manager': return { bg: '#dbeafe', color: '#2563eb' };
      default: return { bg: '#dcfce7', color: '#16a34a' };
    }
  };

  const roleColors = getRoleColor(user?.role);

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" fontWeight={600}>
          My Profile
        </Typography>
        {!editing ? (
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={() => setEditing(true)}
            sx={{ borderRadius: 2 }}
          >
            Edit Profile
          </Button>
        ) : (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              color="inherit"
              startIcon={<CancelIcon />}
              onClick={handleCancel}
              sx={{ borderRadius: 2 }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
              onClick={handleSave}
              disabled={loading}
              sx={{ borderRadius: 2 }}
            >
              Save Changes
            </Button>
          </Box>
        )}
      </Box>

      {/* Profile Card */}
      <Card sx={{ borderRadius: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
        <CardContent sx={{ p: 4 }}>
          {/* Avatar Section */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
            <Box sx={{ position: 'relative', mb: 2 }}>
              <Avatar
                src={formData.avatar_url || user?.avatar_url}
                sx={{
                  width: 120,
                  height: 120,
                  fontSize: 48,
                  bgcolor: '#e0e7ff',
                  color: '#4f46e5',
                  border: '4px solid #fff',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }}
              >
                {user?.full_name?.charAt(0)?.toUpperCase() || 'U'}
              </Avatar>
              {editing && (
                <IconButton
                  onClick={handleAvatarUrlChange}
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    bgcolor: '#2196f3',
                    color: 'white',
                    '&:hover': { bgcolor: '#1976d2' },
                    width: 36,
                    height: 36
                  }}
                >
                  <CameraIcon fontSize="small" />
                </IconButton>
              )}
            </Box>

            {!editing ? (
              <>
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  {user?.full_name}
                </Typography>
                <Chip
                  label={user?.role?.replace('_', ' ').toUpperCase()}
                  sx={{
                    bgcolor: roleColors.bg,
                    color: roleColors.color,
                    fontWeight: 600,
                    fontSize: '0.75rem'
                  }}
                />
              </>
            ) : (
              <TextField
                name="full_name"
                label="Full Name"
                value={formData.full_name}
                onChange={handleChange}
                sx={{ width: 300, mt: 1 }}
                size="small"
              />
            )}
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Info Grid */}
          <Grid container spacing={3}>
            {/* Email */}
            <Grid item xs={12} sm={6}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  bgcolor: '#f8fafc',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2
                }}
              >
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 2,
                    bgcolor: '#dbeafe',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <EmailIcon sx={{ color: '#2563eb' }} />
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Email Address
                  </Typography>
                  <Typography fontWeight={500}>
                    {user?.email}
                  </Typography>
                </Box>
              </Paper>
            </Grid>

            {/* Phone */}
            <Grid item xs={12} sm={6}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  bgcolor: '#f8fafc',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2
                }}
              >
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 2,
                    bgcolor: '#dcfce7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <PhoneIcon sx={{ color: '#16a34a' }} />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    Phone Number
                  </Typography>
                  {!editing ? (
                    <Typography fontWeight={500}>
                      {user?.phone || 'Not set'}
                    </Typography>
                  ) : (
                    <TextField
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      size="small"
                      fullWidth
                      placeholder="Enter phone number"
                      sx={{ mt: 0.5 }}
                    />
                  )}
                </Box>
              </Paper>
            </Grid>

            {/* Role */}
            <Grid item xs={12} sm={6}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  bgcolor: '#f8fafc',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2
                }}
              >
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 2,
                    bgcolor: '#fef3c7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <BadgeIcon sx={{ color: '#d97706' }} />
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Role
                  </Typography>
                  <Typography fontWeight={500} sx={{ textTransform: 'capitalize' }}>
                    {user?.role?.replace('_', ' ')}
                  </Typography>
                </Box>
              </Paper>
            </Grid>

            {/* Member Since */}
            <Grid item xs={12} sm={6}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  bgcolor: '#f8fafc',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2
                }}
              >
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 2,
                    bgcolor: '#f3e8ff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <CalendarIcon sx={{ color: '#9333ea' }} />
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Member Since
                  </Typography>
                  <Typography fontWeight={500}>
                    {user?.created_at ? format(new Date(user.created_at), 'MMM dd, yyyy') : 'N/A'}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>

          {/* Avatar URL Field when editing */}
          {editing && (
            <Box sx={{ mt: 3 }}>
              <TextField
                name="avatar_url"
                label="Profile Photo URL"
                value={formData.avatar_url}
                onChange={handleChange}
                fullWidth
                size="small"
                placeholder="Paste image URL here"
                helperText="Paste a direct image URL (e.g., from Google Photos, LinkedIn, etc.)"
              />
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Change Password Card */}
      <Card sx={{ borderRadius: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', mt: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 2,
                bgcolor: '#fee2e2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <LockIcon sx={{ color: '#dc2626' }} />
            </Box>
            <Typography variant="h6" fontWeight={600}>
              Change Password
            </Typography>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name="currentPassword"
                label="Current Password"
                type={showCurrentPassword ? 'text' : 'password'}
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                fullWidth
                size="small"
                InputProps={{
                  endAdornment: (
                    <IconButton
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      edge="end"
                      size="small"
                    >
                      {showCurrentPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="newPassword"
                label="New Password"
                type={showNewPassword ? 'text' : 'password'}
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                fullWidth
                size="small"
                InputProps={{
                  endAdornment: (
                    <IconButton
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      edge="end"
                      size="small"
                    >
                      {showNewPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="confirmPassword"
                label="Confirm New Password"
                type={showConfirmPassword ? 'text' : 'password'}
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                fullWidth
                size="small"
                InputProps={{
                  endAdornment: (
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                      size="small"
                    >
                      {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                onClick={handleChangePassword}
                disabled={passwordLoading}
                sx={{
                  borderRadius: 2,
                  bgcolor: '#dc2626',
                  '&:hover': { bgcolor: '#b91c1c' }
                }}
              >
                {passwordLoading ? <CircularProgress size={20} color="inherit" /> : 'Change Password'}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProfilePage;
