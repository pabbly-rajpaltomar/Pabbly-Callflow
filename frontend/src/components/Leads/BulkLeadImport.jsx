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
import * as XLSX from 'xlsx';
import leadService from '../../services/leadService';

const BulkLeadImport = ({ open, onClose, onSuccess }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [csvData, setCsvData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Parse CSV row properly handling quoted values with commas
  const parseCSVRow = (row, delimiter = ',') => {
    const cells = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < row.length; i++) {
      const char = row[i];

      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === delimiter && !inQuotes) {
        cells.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    cells.push(current.trim());

    return cells.map(cell => cell.replace(/^"|"$/g, '').trim());
  };

  // Detect CSV delimiter (comma, semicolon, or tab)
  const detectDelimiter = (headerRow) => {
    const delimiters = [',', ';', '\t'];
    let bestDelimiter = ',';
    let maxColumns = 0;

    for (const d of delimiters) {
      const cols = headerRow.split(d).length;
      if (cols > maxColumns) {
        maxColumns = cols;
        bestDelimiter = d;
      }
    }
    return bestDelimiter;
  };

  // Process parsed rows (from CSV or Excel)
  const processRows = (headers, dataRows) => {
    console.log('Parsed headers:', headers);

    // Find column indices with flexible matching
    const nameIndex = headers.findIndex(h =>
      h === 'name' || h === 'full_name' || h === 'fullname' ||
      h === 'contact_name' || h === 'contactname' || h.includes('name')
    );
    const phoneIndex = headers.findIndex(h =>
      h === 'phone' || h === 'phone_number' || h === 'phonenumber' ||
      h === 'mobile' || h === 'contact_number' || h.includes('phone') || h.includes('mobile')
    );
    const emailIndex = headers.findIndex(h =>
      h === 'email' || h === 'email_address' || h === 'emailaddress' || h.includes('email')
    );
    const companyIndex = headers.findIndex(h =>
      h === 'company' || h === 'company_name' || h === 'companyname' ||
      h === 'organization' || h.includes('company') || h.includes('org')
    );

    console.log('Column indices:', { nameIndex, phoneIndex, emailIndex, companyIndex });

    if (nameIndex === -1 || phoneIndex === -1) {
      setError('File must contain at least "name" and "phone" columns. Found columns: ' + headers.join(', '));
      return;
    }

    const leads = [];

    for (let i = 0; i < dataRows.length; i++) {
      const cells = dataRows[i];
      if (!cells || cells.length === 0) continue;

      const lead = {
        name: String(cells[nameIndex] || '').trim(),
        phone: String(cells[phoneIndex] || '').trim(),
        email: emailIndex !== -1 ? String(cells[emailIndex] || '').trim() : '',
        company: companyIndex !== -1 ? String(cells[companyIndex] || '').trim() : '',
        source: 'manual',
        lead_status: 'new'
      };

      // Only add if name and phone exist
      if (lead.name && lead.phone) {
        leads.push(lead);
      }

      // Log first few rows for debugging
      if (i < 3) {
        console.log(`Row ${i + 1}:`, lead);
      }
    }

    console.log('Valid leads:', leads.length);

    if (leads.length === 0) {
      setError('No valid leads found. Make sure each row has both name and phone.');
      return;
    }

    setCsvData(leads);
    setError('');
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const fileName = file.name.toLowerCase();
    const isExcel = fileName.endsWith('.xlsx') || fileName.endsWith('.xls');

    if (isExcel) {
      // Handle Excel file
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

          console.log('Excel rows found:', jsonData.length);

          if (jsonData.length < 2) {
            setError('File must contain at least a header row and one data row');
            return;
          }

          const headers = jsonData[0].map(h => String(h || '').toLowerCase().trim());
          const dataRows = jsonData.slice(1).filter(row => row && row.length > 0);

          processRows(headers, dataRows);
        } catch (err) {
          setError('Failed to parse Excel file. Error: ' + err.message);
          console.error('Excel parse error:', err);
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      // Handle CSV file
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

          if (rows.length < 2) {
            setError('CSV file must contain at least a header row and one data row');
            return;
          }

          // Detect delimiter from header row
          const delimiter = detectDelimiter(rows[0]);
          console.log('Detected delimiter:', delimiter === '\t' ? 'TAB' : delimiter);

          // Parse header row
          const headers = parseCSVRow(rows[0], delimiter).map(h => h.toLowerCase().replace(/["\ufeff]/g, ''));

          // Parse data rows
          const dataRows = rows.slice(1).map(row => parseCSVRow(row, delimiter));

          processRows(headers, dataRows);
        } catch (err) {
          setError('Failed to parse CSV file. Please check the format. Error: ' + err.message);
          console.error('CSV parse error:', err);
        }
      };
      reader.readAsText(file);
    }
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
      console.log('Submitting leads:', csvData.length, 'leads');
      console.log('First 3 leads:', csvData.slice(0, 3));

      const result = await leadService.bulkCreateLeads(csvData);

      console.log('Bulk import result:', result);

      if (result.data && result.data.errors > 0) {
        console.log('Import errors:', result.data.errorDetails);
        setError(`Imported ${result.data.created} leads. ${result.data.errors} failed.`);
      } else {
        setCsvData([]);
        setError('');
        onSuccess();
        onClose();
      }
    } catch (err) {
      console.error('Bulk import error:', err);
      console.error('Error response:', err.response?.data);
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
              accept=".csv,.xlsx,.xls"
              hidden
              onChange={handleFileUpload}
            />
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <UploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
              <Typography variant="body1" gutterBottom>
                Click to upload file
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Supports CSV and Excel (.xlsx, .xls) files
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Required columns: name, phone
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
