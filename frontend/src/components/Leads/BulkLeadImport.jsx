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
  Close as CloseIcon
} from '@mui/icons-material';
import leadService from '../../services/leadService';

const BulkLeadImport = ({ open, onClose, onSuccess }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [csvData, setCsvData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
          h === 'contact_name' || h === 'contactname' || h.includes('name')
        );
        const phoneIndex = headers.findIndex(h =>
          h === 'phone' || h === 'phone_number' || h === 'phonenumber' ||
          h === 'mobile' || h === 'contact_number' || h.includes('phone')
        );
        const emailIndex = headers.findIndex(h =>
          h === 'email' || h === 'email_address' || h === 'emailaddress' || h.includes('email')
        );
        const companyIndex = headers.findIndex(h =>
          h === 'company' || h === 'company_name' || h === 'companyname' ||
          h === 'organization' || h.includes('company')
        );

        console.log('Column indices:', { nameIndex, phoneIndex, emailIndex, companyIndex });

        if (nameIndex === -1 || phoneIndex === -1) {
          setError('CSV must contain at least "name" and "phone" columns. Found columns: ' + headers.join(', '));
          return;
        }

        // Parse data rows
        const dataRows = rows.slice(1);
        const leads = dataRows.map((row, index) => {
          // Remove quotes and split
          const cleanRow = row.replace(/["]/g, '').trim();
          const cells = cleanRow.split(',').map(cell => cell.trim());

          const lead = {
            name: cells[nameIndex] || '',
            phone: cells[phoneIndex] || '',
            email: emailIndex !== -1 ? (cells[emailIndex] || '') : '',
            company: companyIndex !== -1 ? (cells[companyIndex] || '') : '',
            source: 'manual',
            lead_status: 'new'
          };

          console.log(`Row ${index + 1}:`, lead);
          return lead;
        }).filter(lead => lead.name && lead.phone);

        console.log('Valid leads:', leads.length);

        if (leads.length === 0) {
          setError('No valid leads found in CSV file. Make sure each row has both name and phone.');
          return;
        }

        setCsvData(leads);
        setError('');
      } catch (err) {
        setError('Failed to parse CSV file. Please check the format. Error: ' + err.message);
        console.error('CSV parse error:', err);
      }
    };
    reader.readAsText(file);
  };

  const handleDownloadTemplate = () => {
    const template = 'name,phone,email,company\nJohn Doe,+1234567890,john@example.com,Acme Inc\nJane Smith,+1234567891,jane@example.com,Tech Corp';
    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'bulk_lead_template.csv';
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
      await leadService.bulkCreateLeads(csvData);
      setCsvData([]);
      setError('');
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to import leads');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setCsvData([]);
    setError('');
    onClose();
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
          <Typography variant="h6">Bulk Import Leads</Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
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
                CSV format: name, phone, email, company
              </Typography>
            </Box>
          </Paper>
        </Box>

        {/* Preview Table */}
        {csvData.length > 0 && (
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Preview ({csvData.length} leads)
            </Typography>
            <TableContainer component={Paper} sx={{ maxHeight: 300 }}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Company</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {csvData.map((lead, index) => (
                    <TableRow key={index}>
                      <TableCell>{lead.name}</TableCell>
                      <TableCell>{lead.phone}</TableCell>
                      <TableCell>{lead.email || '-'}</TableCell>
                      <TableCell>{lead.company || '-'}</TableCell>
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
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading || csvData.length === 0}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          Import Leads
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BulkLeadImport;
