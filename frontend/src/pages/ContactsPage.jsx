import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  InputAdornment,
  Tabs,
  Tab,
  Checkbox,
  Switch,
  FormControlLabel,
  Alert,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Settings as SettingsIcon,
  MoreVert as MoreIcon,
  KeyboardArrowDown as ArrowDownIcon,
  Upload as UploadIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import contactService from '../services/contactService';
import BulkContactImport from '../components/Contacts/BulkContactImport';
import { format } from 'date-fns';

const ContactsPage = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [openBulkDialog, setOpenBulkDialog] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTab, setCurrentTab] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [stats, setStats] = useState({ total: 0, new: 0, active: 0, inactive: 0 });
  const [dense, setDense] = useState(false);
  const [selected, setSelected] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    company: '',
    lead_status: 'new',
    notes: '',
  });

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await contactService.getContacts();
      setContacts(response.data.contacts);
      if (response.data.stats) {
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
      setError('Failed to fetch contacts');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (contact = null) => {
    if (contact) {
      setSelectedContact(contact);
      setFormData({
        name: contact.name,
        phone: contact.phone,
        email: contact.email || '',
        company: contact.company || '',
        lead_status: contact.lead_status,
        notes: contact.notes || '',
      });
    } else {
      setSelectedContact(null);
      setFormData({
        name: '',
        phone: '',
        email: '',
        company: '',
        lead_status: 'new',
        notes: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedContact(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (selectedContact) {
        await contactService.updateContact(selectedContact.id, formData);
        setSuccess('Contact updated successfully');
      } else {
        await contactService.createContact(formData);
        setSuccess('Contact created successfully');
      }
      fetchContacts();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving contact:', error);
      setError('Failed to save contact');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      try {
        await contactService.deleteContact(id);
        setSuccess('Contact deleted successfully');
        fetchContacts();
      } catch (error) {
        console.error('Error deleting contact:', error);
        setError('Failed to delete contact');
      }
    }
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelected(filteredContacts.map(c => c.id));
    } else {
      setSelected([]);
    }
  };

  const handleSelectOne = (id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  // Filter contacts based on search and tab
  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.phone?.includes(searchQuery);

    if (currentTab === 0) return matchesSearch; // All
    if (currentTab === 1) return matchesSearch && contact.lead_status !== 'lost'; // Opted-In (active)
    if (currentTab === 2) return matchesSearch && contact.lead_status === 'lost'; // Opted-Out (lost)
    return matchesSearch;
  });

  // Stats from API
  const totalContacts = stats.total || 0;
  const optedInContacts = stats.optedIn || (stats.total - (stats.lost || 0)) || 0;
  const optedOutContacts = stats.optedOut || stats.lost || 0;

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Page Title and Actions */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
        <Typography variant="h5" fontWeight={600} color="#111827">
          Contacts
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<UploadIcon />}
            onClick={() => setOpenBulkDialog(true)}
            sx={{ borderRadius: 1.5, textTransform: 'none', borderColor: '#e5e7eb', color: '#374151' }}
          >
            Bulk Import
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            sx={{ borderRadius: 1.5, textTransform: 'none' }}
          >
            Add Contact
          </Button>
        </Box>
      </Box>

      {/* Alerts */}
      {error && (
        <Alert severity="error" onClose={() => setError('')} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" onClose={() => setSuccess('')} sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      {/* Stats Cards Row */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2.5 }}>
        {/* Total Contacts Card */}
        <Paper sx={{
          flex: 1,
          p: 2,
          borderRadius: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%)',
          border: '1px solid #bbf7d0'
        }}>
          <Box>
            <Typography fontSize={12} color="#047857" fontWeight={500}>Total Contacts</Typography>
            <Typography variant="h4" fontWeight={700} color="#065f46">
              {totalContacts}
            </Typography>
          </Box>
          {/* Yellow/Orange people icon */}
          <Box sx={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            bgcolor: '#f59e0b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="white"/>
            </svg>
          </Box>
        </Paper>

        {/* Opted-In Contacts Card */}
        <Paper sx={{
          flex: 1,
          p: 2,
          borderRadius: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #d1fae5 0%, #ecfdf5 100%)',
          border: '1px solid #a7f3d0'
        }}>
          <Box>
            <Typography fontSize={12} color="#047857" fontWeight={500}>Opted-In Contacts</Typography>
            <Typography variant="h4" fontWeight={700} color="#065f46">
              {optedInContacts}
            </Typography>
          </Box>
          {/* Green person with check icon */}
          <Box sx={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            bgcolor: '#10b981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="white"/>
            </svg>
          </Box>
        </Paper>

        {/* Opted-Out Contacts Card */}
        <Paper sx={{
          flex: 1,
          p: 2,
          borderRadius: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
          border: '1px solid #fecaca'
        }}>
          <Box>
            <Typography fontSize={12} color="#b91c1c" fontWeight={500}>Opted-Out Contacts</Typography>
            <Typography variant="h4" fontWeight={700} color="#991b1b">
              {optedOutContacts}
            </Typography>
          </Box>
          {/* Red person with X icon */}
          <Box sx={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            bgcolor: '#ef4444',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="white"/>
            </svg>
          </Box>
        </Paper>
      </Box>

      {/* Table Section */}
      <Paper sx={{ borderRadius: 2, overflow: 'hidden', border: '1px solid #e5e7eb' }}>
        {/* Section Title */}
        <Box sx={{ p: 2, borderBottom: '1px solid #e5e7eb' }}>
          <Typography fontSize={16} fontWeight={600} color="#111827">
            All Contacts
          </Typography>
        </Box>

        {/* Tabs Row */}
        <Box sx={{ px: 2, borderBottom: '1px solid #e5e7eb' }}>
          <Tabs
            value={currentTab}
            onChange={(e, v) => setCurrentTab(v)}
            sx={{
              minHeight: 44,
              '& .MuiTab-root': {
                textTransform: 'none',
                minHeight: 44,
                fontWeight: 500,
                fontSize: 14,
                color: '#6b7280',
                padding: '8px 12px',
              },
              '& .Mui-selected': {
                color: '#111827 !important',
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#111827',
                height: 2,
              }
            }}
          >
            <Tab
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <span>All</span>
                  <Chip
                    label={totalContacts}
                    size="small"
                    sx={{
                      height: 20,
                      minWidth: 20,
                      fontSize: 12,
                      fontWeight: 600,
                      bgcolor: '#1f2937',
                      color: 'white',
                      '& .MuiChip-label': { px: 1 }
                    }}
                  />
                </Box>
              }
            />
            <Tab
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <span>Opted-In</span>
                  <Chip
                    label={optedInContacts}
                    size="small"
                    sx={{
                      height: 20,
                      minWidth: 20,
                      fontSize: 12,
                      fontWeight: 600,
                      bgcolor: '#22c55e',
                      color: 'white',
                      '& .MuiChip-label': { px: 1 }
                    }}
                  />
                </Box>
              }
            />
            <Tab
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <span>Opted-Out</span>
                  <Chip
                    label={optedOutContacts}
                    size="small"
                    sx={{
                      height: 20,
                      minWidth: 20,
                      fontSize: 12,
                      fontWeight: 600,
                      bgcolor: '#f97316',
                      color: 'white',
                      '& .MuiChip-label': { px: 1 }
                    }}
                  />
                </Box>
              }
            />
          </Tabs>
        </Box>

        {/* Search & Filters Row */}
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 2,
          borderBottom: '1px solid #e5e7eb'
        }}>
          <TextField
            placeholder="Search contacts by Mobile number or Name..."
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              width: 400,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                bgcolor: '#f9fafb',
                '& fieldset': { borderColor: '#e5e7eb' },
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#9ca3af', fontSize: 20 }} />
                </InputAdornment>
              ),
            }}
          />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Button
              startIcon={<FilterIcon sx={{ fontSize: 18 }} />}
              sx={{
                color: '#2196f3',
                textTransform: 'none',
                fontWeight: 500,
                fontSize: 14,
              }}
            >
              Filters
            </Button>
            <IconButton size="small" sx={{ color: '#6b7280' }}>
              <SettingsIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </Box>
        </Box>

        {/* Table */}
        <TableContainer>
          <Table size={dense ? 'small' : 'medium'}>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f9fafb' }}>
                <TableCell padding="checkbox" sx={{ borderBottom: '1px solid #e5e7eb' }}>
                  <Checkbox
                    indeterminate={selected.length > 0 && selected.length < filteredContacts.length}
                    checked={filteredContacts.length > 0 && selected.length === filteredContacts.length}
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#374151', fontSize: 13, borderBottom: '1px solid #e5e7eb', py: 1.5 }}>
                  Status/Created at
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#374151', fontSize: 13, borderBottom: '1px solid #e5e7eb', py: 1.5 }}>
                  WhatsApp Number/Name
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#374151', fontSize: 13, borderBottom: '1px solid #e5e7eb', py: 1.5 }}>
                  Source/Incoming status
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#374151', fontSize: 13, borderBottom: '1px solid #e5e7eb', py: 1.5 }}>
                  24 Hours Status/Last active
                </TableCell>
                <TableCell sx={{ borderBottom: '1px solid #e5e7eb', py: 1.5, width: 120 }}></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredContacts
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((contact) => {
                  const isSelected = selected.indexOf(contact.id) !== -1;
                  return (
                    <TableRow
                      key={contact.id}
                      hover
                      selected={isSelected}
                      sx={{
                        '&:hover': { bgcolor: '#f9fafb' },
                        '& td': { borderBottom: '1px solid #f3f4f6' }
                      }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isSelected}
                          onChange={() => handleSelectOne(contact.id)}
                        />
                      </TableCell>
                      <TableCell sx={{ py: 2 }}>
                        <Box>
                          <Chip
                            label={contact.lead_status === 'lost' ? 'Opted-Out' : 'Opted-In'}
                            size="small"
                            sx={{
                              bgcolor: contact.lead_status === 'lost' ? '#fef3c7' : '#d1fae5',
                              color: contact.lead_status === 'lost' ? '#92400e' : '#065f46',
                              fontWeight: 500,
                              fontSize: 12,
                              height: 22,
                              mb: 0.5,
                              borderRadius: 1,
                            }}
                          />
                          <Typography fontSize={12} color="#9ca3af" display="block">
                            {contact.created_at ? format(new Date(contact.created_at), 'MMM dd, yyyy h:mm:ss') : '-'}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ py: 2 }}>
                        <Box>
                          <Typography
                            fontSize={14}
                            sx={{
                              color: '#2196f3',
                              fontWeight: 500,
                              cursor: 'pointer',
                              '&:hover': { textDecoration: 'underline' }
                            }}
                          >
                            91 {contact.phone}
                          </Typography>
                          <Typography fontSize={13} color="#6b7280">
                            {contact.name || '-'}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ py: 2 }}>
                        <Box>
                          <Typography fontSize={14} color="#374151">
                            {contact.company || 'No Company'}
                          </Typography>
                          <Typography fontSize={13} color="#9ca3af">
                            Allowed
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ py: 2 }}>
                        <Box>
                          <Chip
                            label="Inactive"
                            size="small"
                            sx={{
                              bgcolor: '#fee2e2',
                              color: '#dc2626',
                              fontWeight: 500,
                              fontSize: 12,
                              height: 22,
                              mb: 0.5,
                              borderRadius: 1,
                            }}
                          />
                          <Typography fontSize={12} color="#9ca3af" display="block">
                            {contact.updated_at ? format(new Date(contact.updated_at), 'MMM dd, yyyy h:mm:ss') : '-'}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ py: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Tooltip title="Edit">
                            <IconButton size="small" onClick={() => handleOpenDialog(contact)}>
                              <EditIcon sx={{ fontSize: 18, color: '#2196f3' }} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton size="small" onClick={() => handleDelete(contact.id)}>
                              <DeleteIcon sx={{ fontSize: 18, color: '#f44336' }} />
                            </IconButton>
                          </Tooltip>
                          <IconButton size="small" sx={{ color: '#9ca3af' }}>
                            <ArrowDownIcon sx={{ fontSize: 20 }} />
                          </IconButton>
                          <IconButton size="small" sx={{ color: '#9ca3af' }}>
                            <MoreIcon sx={{ fontSize: 20 }} />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })}
              {filteredContacts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography color="#9ca3af">No contacts found</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Footer with Dense toggle and Pagination */}
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: 2,
          py: 1,
          borderTop: '1px solid #e5e7eb',
        }}>
          <FormControlLabel
            control={
              <Switch
                checked={dense}
                onChange={(e) => setDense(e.target.checked)}
                size="small"
              />
            }
            label={<Typography fontSize={13} color="#6b7280">Dense</Typography>}
          />
          <TablePagination
            component="div"
            count={filteredContacts.length}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            rowsPerPageOptions={[5, 10, 25]}
            sx={{
              '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                fontSize: 13,
                color: '#6b7280'
              },
            }}
          />
        </Box>
      </Paper>

      {/* Add/Edit Contact Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>
          {selectedContact ? 'Edit Contact' : 'Add New Contact'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
            />
            <TextField
              fullWidth
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
            />
            <TextField
              fullWidth
              label="Company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
            />
            <TextField
              fullWidth
              select
              label="Lead Status"
              name="lead_status"
              value={formData.lead_status}
              onChange={handleChange}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
            >
              <MenuItem value="new">New</MenuItem>
              <MenuItem value="contacted">Contacted</MenuItem>
              <MenuItem value="qualified">Qualified</MenuItem>
              <MenuItem value="converted">Converted</MenuItem>
              <MenuItem value="lost">Lost</MenuItem>
            </TextField>
            <TextField
              fullWidth
              label="Notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              multiline
              rows={3}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseDialog} sx={{ borderRadius: 1.5 }}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained" sx={{ borderRadius: 1.5 }}>
            {selectedContact ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Bulk Import Dialog */}
      <BulkContactImport
        open={openBulkDialog}
        onClose={() => setOpenBulkDialog(false)}
        onSuccess={() => { setSuccess('Contacts imported successfully'); fetchContacts(); }}
      />
    </Box>
  );
};

export default ContactsPage;
