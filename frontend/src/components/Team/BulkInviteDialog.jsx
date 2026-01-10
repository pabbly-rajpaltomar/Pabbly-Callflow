import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  IconButton,
  CircularProgress,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Download as DownloadIcon,
  Close as CloseIcon,
  ContentCopy as CopyIcon
} from '@mui/icons-material';
import userService from '../../services/userService';

const BulkInviteDialog = ({ open, onClose, onSuccess }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [csvData, setCsvData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [createdUsers, setCreatedUsers] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        let text = e.target.result;

        // Remove BOM if present
        if (text.charCodeAt(0) === 0xFEFF) {
          text = text.substring(1);
        }

        // Split by newlines and filter empty rows
        const rows = text.split(/\r?\n/).filter(row => row.trim());

        console.log('Total rows found:', rows.length);
        console.log('First row (headers):', rows[0]);

        if (rows.length < 2) {
          setError('CSV file must contain at least a header row and one data row');
          return;
        }

        // Parse header row - remove quotes and clean
        const headerRow = rows[0].replace(/["\ufeff]/g, '').trim();
        const headers = headerRow.split(',').map(h => h.trim().toLowerCase());

        console.log('Parsed headers:', headers);

        // Find column indices with flexible matching
        const nameIndex = headers.findIndex(h =>
          h === 'name' || h === 'full_name' || h === 'fullname' ||
          h === 'full name' || h.includes('name')
        );
        const emailIndex = headers.findIndex(h =>
          h === 'email' || h === 'email_address' || h.includes('email')
        );
        const roleIndex = headers.findIndex(h =>
          h === 'role' || h.includes('role')
        );
        const phoneIndex = headers.findIndex(h =>
          h === 'phone' || h === 'phone_number' || h === 'mobile' || h.includes('phone')
        );

        console.log('Column indices:', { nameIndex, emailIndex, roleIndex, phoneIndex });

        if (nameIndex === -1 || emailIndex === -1) {
          setError('CSV must contain at least "name" and "email" columns. Found columns: ' + headers.join(', '));
          return;
        }

        // Parse data rows
        const dataRows = rows.slice(1);
        const users = dataRows.map((row, index) => {
          // Remove quotes and split
          const cleanRow = row.replace(/["]/g, '').trim();
          const cells = cleanRow.split(',').map(cell => cell.trim());

          const user = {
            full_name: cells[nameIndex] || '',
            email: cells[emailIndex] || '',
            role: roleIndex !== -1 ? (cells[roleIndex] || 'sales_rep') : 'sales_rep',
            phone: phoneIndex !== -1 ? (cells[phoneIndex] || '') : ''
          };

          console.log(`Row ${index + 1}:`, user);
          return user;
        }).filter(user => user.full_name && user.email);

        console.log('Valid users:', users.length);

        if (users.length === 0) {
          setError('No valid users found in CSV file. Make sure each row has both name and email.');
          return;
        }

        setCsvData(users);
        setError('');
      } catch (err) {
        setError('Failed to parse CSV file. Please check the format. Error: ' + err.message);
        console.error('CSV parse error:', err);
      }
    };
    reader.readAsText(file);
  };

  const handleDownloadTemplate = () => {
    const template = 'full_name,email,role,phone\nJohn Doe,john@example.com,sales_rep,+1234567890\nJane Smith,jane@example.com,manager,+1234567891';
    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'bulk_invite_template.csv';
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const handleSubmit = async () => {
    if (csvData.length === 0) {
      setError('Please upload a CSV file first');
      return;
    }

    try {
      setLoading(true);
      const response = await userService.bulkCreateUsers(csvData);
      setCreatedUsers(response.data.users);
      setShowResults(true);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create users');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyPasswords = () => {
    const passwordsList = createdUsers.map(u =>
      `${u.user.email}: ${u.password}`
    ).join('\n');
    navigator.clipboard.writeText(passwordsList);
    alert('Passwords copied to clipboard!');
  };

  const handleClose = () => {
    setCsvData([]);
    setCreatedUsers([]);
    setShowResults(false);
    setError('');
    onClose();
    if (createdUsers.length > 0) {
      onSuccess();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      fullScreen={isMobile}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Bulk Invite Users</Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        {!showResults ? (
          <>
            {/* Upload Section */}
            <Box sx={{ mb: 3 }}>
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={handleDownloadTemplate}
                fullWidth={isMobile}
                sx={{ mb: 2 }}
              >
                Download CSV Template
              </Button>

              <Paper
                sx={{
                  p: 3,
                  border: '2px dashed',
                  borderColor: 'divider',
                  textAlign: 'center',
                  cursor: 'pointer',
                  '&:hover': { bgcolor: 'action.hover' },
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                component="label"
              >
                <input
                  type="file"
                  accept=".csv"
                  hidden
                  onChange={handleFileUpload}
                />
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <UploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
                  <Typography variant="body1" gutterBottom>
                    Click to upload CSV file
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    CSV format: full_name, email, role, phone
                  </Typography>
                </Box>
              </Paper>
            </Box>

            {/* Preview Table */}
            {csvData.length > 0 && (
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Preview ({csvData.length} users)
                </Typography>
                <TableContainer component={Paper} sx={{ maxHeight: 300 }}>
                  <Table size="small" stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Role</TableCell>
                        <TableCell>Phone</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {csvData.map((user, index) => (
                        <TableRow key={index}>
                          <TableCell>{user.full_name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.role}</TableCell>
                          <TableCell>{user.phone || '-'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
          </>
        ) : (
          <>
            {/* Results Section */}
            <Alert severity="success" sx={{ mb: 2 }}>
              Successfully created {createdUsers.length} users!
            </Alert>

            <Alert severity="warning" sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Important: Save these passwords!
              </Typography>
              <Typography variant="body2">
                Users will need these passwords for first login. They can be reset later.
              </Typography>
            </Alert>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<CopyIcon />}
                onClick={handleCopyPasswords}
              >
                Copy All Passwords
              </Button>
            </Box>

            <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Password</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {createdUsers.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.user.full_name}</TableCell>
                      <TableCell>{item.user.email}</TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{
                            fontFamily: 'monospace',
                            bgcolor: 'grey.100',
                            p: 0.5,
                            borderRadius: 1
                          }}
                        >
                          {item.password}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>
          {showResults ? 'Close' : 'Cancel'}
        </Button>
        {!showResults && (
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading || csvData.length === 0}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            Create Users
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default BulkInviteDialog;
