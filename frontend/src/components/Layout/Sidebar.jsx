import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Divider,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Phone as PhoneIcon,
  Contacts as ContactsIcon,
  People as PeopleIcon,
  Assessment as AssessmentIcon,
  LeaderboardOutlined as LeadsIcon,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const drawerWidth = 260;

const Sidebar = ({ mobileOpen, onDrawerToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard', roles: ['admin', 'manager', 'sales_rep'] },
    { text: 'Leads', icon: <LeadsIcon />, path: '/leads', roles: ['admin', 'manager', 'sales_rep'] },
    { text: 'Calls', icon: <PhoneIcon />, path: '/calls', roles: ['admin', 'manager', 'sales_rep'] },
    { text: 'Contacts', icon: <ContactsIcon />, path: '/contacts', roles: ['admin', 'manager', 'sales_rep'] },
    { text: 'Team', icon: <PeopleIcon />, path: '/team', roles: ['admin', 'manager'] },
    { text: 'Reports', icon: <AssessmentIcon />, path: '/reports', roles: ['admin', 'manager'] },
  ];

  const filteredMenuItems = menuItems.filter((item) =>
    item.roles.includes(user?.role)
  );

  const handleNavigation = (path) => {
    navigate(path);
    if (onDrawerToggle) {
      onDrawerToggle();
    }
  };

  const drawerContent = (
    <Box>
      <Box sx={{ p: 3, textAlign: 'center' }}>
        {/* Pabbly Logo */}
        <Box
          sx={{
            width: 64,
            height: 64,
            margin: '0 auto 12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img
            src="/pabbly-logo.png"
            alt="Pabbly Logo"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </Box>

        {/* Pabbly Branding */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: '#2196F3',
            fontSize: '1.1rem',
            lineHeight: 1.2,
            mb: 0.3,
          }}
        >
          Pabbly
        </Typography>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 500,
            color: '#666',
            fontSize: '0.875rem',
            letterSpacing: '0.5px',
          }}
        >
          Callflow
        </Typography>
      </Box>
      <Divider sx={{ my: 2 }} />
      <List sx={{ px: 2, pt: 1 }}>
        {filteredMenuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => handleNavigation(item.path)}
              sx={{
                borderRadius: 1.5,
                py: 1.2,
                px: 2,
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: '#F5F7FA',
                },
                '&.Mui-selected': {
                  bgcolor: '#E3F2FD',
                  color: '#2196F3',
                  '&:hover': {
                    bgcolor: '#BBDEFB',
                  },
                  '& .MuiListItemIcon-root': {
                    color: '#2196F3',
                  },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: '#666' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontSize: '0.9rem',
                  fontWeight: location.pathname === item.path ? 600 : 500,
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better mobile performance
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default Sidebar;
