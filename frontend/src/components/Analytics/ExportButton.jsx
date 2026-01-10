import React, { useState } from 'react';
import {
  Button,
  Menu,
  MenuItem,
  CircularProgress,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Download as DownloadIcon,
  Phone as PhoneIcon,
  Contacts as ContactsIcon,
  LeaderboardOutlined as LeadsIcon
} from '@mui/icons-material';
import analyticsService from '../../services/analyticsService';

const ExportButton = ({ dateRange, userId }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleExport = async (type) => {
    try {
      setLoading(true);
      const params = {
        type,
        start_date: dateRange?.start_date,
        end_date: dateRange?.end_date,
        user_id: userId
      };

      const response = await analyticsService.exportAnalytics(params);

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${type}_export_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      handleClose();
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="outlined"
        startIcon={loading ? <CircularProgress size={20} /> : <DownloadIcon />}
        onClick={handleClick}
        disabled={loading}
        fullWidth={isMobile}
      >
        Export Data
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'export-button',
        }}
      >
        <MenuItem onClick={() => handleExport('calls')}>
          <ListItemIcon>
            <PhoneIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Export Calls</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleExport('leads')}>
          <ListItemIcon>
            <LeadsIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Export Leads</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleExport('contacts')}>
          <ListItemIcon>
            <ContactsIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Export Contacts</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

export default ExportButton;
