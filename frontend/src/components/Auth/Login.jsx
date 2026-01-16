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
} from '@mui/material';
import {
  Google as GoogleIcon,
  Visibility,
  VisibilityOff,
  Link as LinkIcon,
  Chat as ChatIcon,
  Payment as PaymentIcon,
  Email as EmailIcon,
  Webhook as WebhookIcon,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const [activeSlide, setActiveSlide] = useState(0);

  const features = [
    { icon: <LinkIcon sx={{ color: '#8b5cf6', fontSize: 24 }} />, title: 'Pabbly Connect', desc: 'Automate tasks & save 100X time.', bgColor: '#f3e8ff' },
    { icon: <ChatIcon sx={{ color: '#ec4899', fontSize: 24 }} />, title: 'Pabbly ChatFlow', desc: 'Automate WhatsApp conversation effortlessly.', bgColor: '#fce7f3' },
    { icon: <PaymentIcon sx={{ color: '#3b82f6', fontSize: 24 }} />, title: 'Pabbly Subscription Billing', desc: 'Sell online & collect payments.', bgColor: '#dbeafe' },
    { icon: <EmailIcon sx={{ color: '#f97316', fontSize: 24 }} />, title: 'Pabbly Email Marketing', desc: 'Send emails to subscribers.', bgColor: '#ffedd5' },
    { icon: <WebhookIcon sx={{ color: '#eab308', fontSize: 24 }} />, title: 'Pabbly Hook', desc: 'Webhook event handling for scalable applications.', bgColor: '#fef9c3' },
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
            No Restrictions on Features!
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
            Scale & Grow Your Business with Pabbly.
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
                    bgcolor: feature.bgColor || 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
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

        {/* Slider dots */}
        <Box sx={{ display: 'flex', gap: 1, mb: 4 }}>
          {[0, 1].map((dot) => (
            <Box
              key={dot}
              onClick={() => setActiveSlide(dot)}
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: activeSlide === dot ? '#4a5568' : '#d1d5db',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
              }}
            />
          ))}
        </Box>

        {/* Certification badges at bottom */}
        <Box sx={{ display: 'flex', gap: 2.5 }}>
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
          p: { xs: 2, sm: 4 },
          bgcolor: 'white',
          minHeight: { xs: '100vh', md: 'auto' },
        }}
      >
        <Box sx={{ maxWidth: 420, width: '100%', px: { xs: 1, sm: 0 } }}>
          {/* Mobile Logo */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, justifyContent: 'center', mb: 4 }}>
            <Box
              component="img"
              src="https://www.pabbly.com/wp-content/uploads/2020/08/Pabbly-Logo.svg"
              alt="Pabbly Logo"
              sx={{ height: 32 }}
            />
          </Box>

          {/* Title */}
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              mb: 0.5,
              fontSize: { xs: '1.5rem', sm: '1.875rem' },
              color: '#1a1a1a',
              textAlign: 'center',
            }}
          >
            Login to Pabbly Account
          </Typography>

          {/* Subtitle */}
          <Typography
            variant="body2"
            sx={{
              mb: 1,
              fontSize: '0.875rem',
              color: '#9ca3af',
              textAlign: 'center',
            }}
          >
            Sign in seconds. No credit card required.
          </Typography>

          {/* Sign up link - centered */}
          <Box sx={{ textAlign: 'center', mb: 2.5 }}>
            <Typography
              variant="body2"
              component="span"
              sx={{ fontSize: '0.875rem', color: '#9ca3af' }}
            >
              Don't have a Pabbly Account?{' '}
            </Typography>
            <Link
              component={RouterLink}
              to="/signup"
              sx={{
                fontWeight: 600,
                textDecoration: 'none',
                color: '#2196f3',
                fontSize: '0.875rem',
              }}
            >
              Sign up
            </Link>
          </Box>

          {/* Google Login Button */}
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
            Login with Google
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

          {/* Login Form */}
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              placeholder="Email Address *"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              autoFocus
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

            <TextField
              fullWidth
              placeholder="Password *"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              required
              sx={{
                mb: 0.5,
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

            {/* Forgot Password - right aligned */}
            <Box sx={{ textAlign: 'right', mb: 2.5 }}>
              <Link
                href="#"
                sx={{
                  fontSize: '0.875rem',
                  textDecoration: 'none',
                  color: '#2196f3',
                  fontWeight: 500,
                }}
              >
                Forgot Password?
              </Link>
            </Box>

            {/* Login Button */}
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
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
            </Button>
          </form>

          {/* Terms - centered */}
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
            By signing in, I agree to Pabbly's{' '}
            <Link href="#" sx={{ textDecoration: 'none', color: '#2196f3' }}>
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="#" sx={{ textDecoration: 'none', color: '#2196f3' }}>
              Privacy Policy
            </Link>
            .
          </Typography>

          {/* Demo Credentials */}
          <Box
            sx={{
              mt: 3,
              p: 2.5,
              bgcolor: '#f9fafb',
              borderRadius: 1.5,
              border: '1px solid #e5e7eb',
            }}
          >
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                display: 'block',
                mb: 1,
                fontSize: '0.875rem',
                color: '#1a1a1a',
              }}
            >
              Demo Credentials:
            </Typography>
            <Typography
              variant="body2"
              sx={{ display: 'block', color: '#6b7280', fontSize: '0.8125rem' }}
            >
              Email: admin@callflow.com
            </Typography>
            <Typography
              variant="body2"
              sx={{ display: 'block', color: '#6b7280', fontSize: '0.8125rem' }}
            >
              Password: admin123
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
