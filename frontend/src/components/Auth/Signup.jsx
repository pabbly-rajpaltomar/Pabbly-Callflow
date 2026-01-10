import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Divider,
  Link,
  InputAdornment,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  LinearProgress,
} from '@mui/material';
import {
  Google as GoogleIcon,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    phone: '',
    role: 'sales_rep',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [countryCode, setCountryCode] = useState('+91');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getPasswordStrength = () => {
    const password = formData.password;
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.length >= 12) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    return strength;
  };

  const getPasswordStrengthColor = () => {
    const strength = getPasswordStrength();
    if (strength <= 25) return 'error';
    if (strength <= 50) return 'warning';
    if (strength <= 75) return 'info';
    return 'success';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 12) {
      setError('Password must be at least 12 characters');
      return;
    }

    setLoading(true);

    try {
      const signupData = { ...formData };
      delete signupData.confirmPassword;
      await signup(signupData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: '🔗', title: 'Pabbly Connect', desc: 'Automate tasks & save 100X time.' },
    { icon: '💬', title: 'Pabbly ChatFlow', desc: 'Automate WhatsApp conversation effortlessly.' },
    { icon: '💳', title: 'Pabbly Subscription Billing', desc: 'Sell online & collect payments.' },
    { icon: '📧', title: 'Pabbly Email Marketing', desc: 'Send emails to subscribers.' },
    { icon: '🔌', title: 'Pabbly Hook', desc: 'Webhook event handling for scalable applications.' },
  ];

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex' }}>
      {/* Left Panel */}
      <Box
        sx={{
          width: { xs: '0%', md: '40%' },
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          background: 'linear-gradient(180deg, #e8f5e9 0%, #c8e6c9 50%, #a5d6a7 100%)',
          p: 8,
          position: 'relative',
        }}
      >
        {/* Logo at top */}
        <Box sx={{ mb: 10 }}>
          <Box
            component="img"
            src="https://www.pabbly.com/wp-content/uploads/2020/08/Pabbly-Logo.svg"
            alt="Pabbly Logo"
            sx={{ height: 42 }}
          />
        </Box>

        {/* Centered content */}
        <Box sx={{ flex: 1 }}>
          {/* Title */}
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              mb: 1.5,
              color: '#1a1a1a',
              fontSize: '1.875rem',
            }}
          >
            Unlimited Access & Features!
          </Typography>

          {/* Subtitle */}
          <Typography
            variant="body2"
            sx={{
              mb: 5,
              color: '#4a5568',
              fontSize: '0.9375rem',
            }}
          >
            Get Access to All Pabbly Applications at Single Price.
          </Typography>

          {/* Features with icon boxes */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
            {features.map((feature, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    bgcolor: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    flexShrink: 0,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  }}
                >
                  {feature.icon}
                </Box>
                <Box sx={{ pt: 0.5 }}>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      color: '#1a1a1a',
                      fontSize: '0.9375rem',
                      mb: 0.3,
                      lineHeight: 1.4,
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: '#5a6c7d',
                      fontSize: '0.8125rem',
                      lineHeight: 1.5,
                      display: 'block',
                    }}
                  >
                    {feature.desc}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Certification badges at bottom */}
        <Box sx={{ display: 'flex', gap: 2.5, mt: 8 }}>
          <Box
            sx={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              bgcolor: '#3b82f6',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
            }}
          >
            <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, lineHeight: 1.2 }}>
              AICPA
            </Typography>
            <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, lineHeight: 1.2 }}>
              SOC
            </Typography>
          </Box>
          <Box
            sx={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              bgcolor: 'white',
              border: '3px solid #3b82f6',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#3b82f6',
            }}
          >
            <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, lineHeight: 1.1 }}>
              ISO
            </Typography>
            <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, lineHeight: 1.1 }}>
              27001
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Right Panel */}
      <Box
        sx={{
          width: { xs: '100%', md: '60%' },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 4,
          bgcolor: 'white',
          overflowY: 'auto',
        }}
      >
        <Box sx={{ maxWidth: 480, width: '100%', py: 4 }}>
          {/* Mobile Logo */}
          <Box sx={{ display: { xs: 'block', md: 'none' }, mb: 4 }}>
            <Box
              component="img"
              src="https://www.pabbly.com/wp-content/uploads/2020/08/Pabbly-Logo.svg"
              alt="Pabbly Logo"
              sx={{ height: 26 }}
            />
          </Box>

          {/* Title */}
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              mb: 0.5,
              fontSize: '1.875rem',
              color: '#1a1a1a',
            }}
          >
            Create Pabbly Account
          </Typography>

          {/* Subtitle */}
          <Typography
            variant="body2"
            sx={{
              mb: 1,
              fontSize: '0.875rem',
              color: '#9ca3af',
            }}
          >
            Sign up in seconds. No credit card required.
          </Typography>

          {/* Already have account link - right aligned */}
          <Box sx={{ textAlign: 'right', mb: 2.5 }}>
            <Typography
              variant="body2"
              component="span"
              sx={{ fontSize: '0.875rem', color: '#9ca3af' }}
            >
              Already have a Pabbly Account?{' '}
            </Typography>
            <Link
              component={RouterLink}
              to="/login"
              sx={{
                fontWeight: 600,
                textDecoration: 'none',
                color: '#2196f3',
                fontSize: '0.875rem',
              }}
            >
              Login
            </Link>
          </Box>

          {/* Google Signup Button */}
          <Button
            fullWidth
            variant="outlined"
            size="large"
            startIcon={<GoogleIcon />}
            sx={{
              mb: 2,
              borderColor: '#e5e7eb',
              color: '#374151',
              textTransform: 'none',
              py: 1.5,
              fontSize: '0.9375rem',
              fontWeight: 500,
              bgcolor: 'white',
              borderRadius: 1.5,
              '&:hover': {
                borderColor: '#d1d5db',
                bgcolor: '#f9fafb',
              },
            }}
          >
            Sign up with Google
          </Button>

          {/* Divider */}
          <Box sx={{ display: 'flex', alignItems: 'center', my: 2.5 }}>
            <Divider sx={{ flex: 1 }} />
            <Typography
              variant="body2"
              sx={{ px: 2, color: '#9ca3af', fontSize: '0.875rem' }}
            >
              or
            </Typography>
            <Divider sx={{ flex: 1 }} />
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* Signup Form */}
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                fullWidth
                placeholder="First Name *"
                name="full_name"
                value={formData.full_name.split(' ')[0] || ''}
                onChange={(e) => {
                  const lastName = formData.full_name.split(' ').slice(1).join(' ');
                  setFormData({ ...formData, full_name: `${e.target.value} ${lastName}`.trim() });
                }}
                required
                autoFocus
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1.5,
                    '&.Mui-focused fieldset': {
                      borderColor: '#2196f3',
                      borderWidth: 2,
                    },
                  },
                }}
              />
              <TextField
                fullWidth
                placeholder="Last Name"
                value={formData.full_name.split(' ').slice(1).join(' ') || ''}
                onChange={(e) => {
                  const firstName = formData.full_name.split(' ')[0] || '';
                  setFormData({ ...formData, full_name: `${firstName} ${e.target.value}`.trim() });
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1.5,
                    '&.Mui-focused fieldset': {
                      borderColor: '#2196f3',
                      borderWidth: 2,
                    },
                  },
                }}
              />
            </Box>

            <TextField
              fullWidth
              placeholder="Email Address *"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1.5,
                  '&.Mui-focused fieldset': {
                    borderColor: '#2196f3',
                    borderWidth: 2,
                  },
                },
              }}
            />

            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <FormControl sx={{ width: 120 }}>
                <Select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  sx={{
                    height: 56,
                    borderRadius: 1.5,
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#2196f3',
                      borderWidth: 2,
                    },
                  }}
                >
                  <MenuItem value="+91">🇮🇳 +91</MenuItem>
                  <MenuItem value="+1">🇺🇸 +1</MenuItem>
                  <MenuItem value="+44">🇬🇧 +44</MenuItem>
                  <MenuItem value="+971">🇦🇪 +971</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                placeholder="Enter mobile number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1.5,
                    '&.Mui-focused fieldset': {
                      borderColor: '#2196f3',
                      borderWidth: 2,
                    },
                  },
                }}
              />
            </Box>

            <TextField
              fullWidth
              placeholder="Password *"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              required
              sx={{
                mb: 1,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1.5,
                  '&.Mui-focused fieldset': {
                    borderColor: '#2196f3',
                    borderWidth: 2,
                  },
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      size="small"
                    >
                      {showPassword ? (
                        <VisibilityOff fontSize="small" />
                      ) : (
                        <Visibility fontSize="small" />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* Password Strength Indicator */}
            {formData.password && (
              <Box sx={{ mb: 2 }}>
                <LinearProgress
                  variant="determinate"
                  value={getPasswordStrength()}
                  color={getPasswordStrengthColor()}
                  sx={{ height: 6, borderRadius: 1, mb: 0.5 }}
                />
                <Typography variant="caption" sx={{ color: '#9ca3af', fontSize: '0.8125rem' }}>
                  Use 12 or more characters for password.
                </Typography>
              </Box>
            )}

            <TextField
              fullWidth
              placeholder="Confirm Password *"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1.5,
                  '&.Mui-focused fieldset': {
                    borderColor: '#2196f3',
                    borderWidth: 2,
                  },
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                      size="small"
                    >
                      {showConfirmPassword ? (
                        <VisibilityOff fontSize="small" />
                      ) : (
                        <Visibility fontSize="small" />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              select
              placeholder="Select Role *"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              sx={{
                mb: 2.5,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1.5,
                  '&.Mui-focused fieldset': {
                    borderColor: '#2196f3',
                    borderWidth: 2,
                  },
                },
              }}
            >
              <MenuItem value="sales_rep">Sales Representative</MenuItem>
              <MenuItem value="manager">Manager</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </TextField>

            <Button
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                py: 1.5,
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600,
                bgcolor: '#2196f3',
                boxShadow: 'none',
                borderRadius: 1.5,
                '&:hover': {
                  bgcolor: '#1976d2',
                  boxShadow: 'none',
                },
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
            </Button>
          </form>

          {/* Terms */}
          <Typography
            variant="caption"
            sx={{
              display: 'block',
              mt: 2.5,
              textAlign: 'center',
              color: '#9ca3af',
              fontSize: '0.75rem',
              lineHeight: 1.6,
            }}
          >
            By signing up, I agree to Pabbly's{' '}
            <Link href="#" sx={{ textDecoration: 'none', color: '#2196f3' }}>
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="#" sx={{ textDecoration: 'none', color: '#2196f3' }}>
              Privacy Policy
            </Link>
            .
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Signup;
