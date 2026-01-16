import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
  Tooltip,
  InputAdornment,
  Tabs,
  Tab,
  Checkbox,
  Switch,
  FormControlLabel,
  Avatar,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Webhook as WebhookIcon,
  Search as SearchIcon,
  ContentCopy as CopyIcon,
  CheckCircle as CheckIcon,
  Upload as BulkIcon,
  ViewKanban as KanbanIcon,
  TableRows as TableIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  PersonAdd as PersonAddIcon,
  Phone as PhoneIcon,
  Cancel as CancelIcon,
  Call as CallIcon,
  Visibility as ViewIcon,
  Email as EmailIcon,
  WhatsApp as WhatsAppIcon,
  VideoCall as MeetIcon,
} from '@mui/icons-material';
import leadService from '../services/leadService';
import callService from '../services/callService';
import { useAuth } from '../context/AuthContext';
import BulkLeadImport from '../components/Leads/BulkLeadImport';
import LeadKanbanBoard from '../components/Leads/LeadKanbanBoard';
import { format } from 'date-fns';

const LeadsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // State
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalCount, setTotalCount] = useState(0);
  const [stats, setStats] = useState({ total: 0, new: 0, contacted: 0, qualified: 0, converted: 0, lost: 0 });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTab, setCurrentTab] = useState(0);
  const [viewMode, setViewMode] = useState('kanban');
  const [dense, setDense] = useState(false);
  const [selected, setSelected] = useState([]);

  // Dialog states
  const [openDialog, setOpenDialog] = useState(false);
  const [openWebhookDialog, setOpenWebhookDialog] = useState(false);
  const [openBulkDialog, setOpenBulkDialog] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [callDialog, setCallDialog] = useState(false);
  const [callingLead, setCallingLead] = useState(null);
  const [calling, setCalling] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    company: '',
    notes: ''
  });

  // Fetch leads
  const fetchLeads = async () => {
    try {
      setLoading(true);
      const params = {
        page: page + 1,
        limit: rowsPerPage,
        search: searchTerm || undefined
      };

      const response = await leadService.getLeads(params);
      setLeads(response.data.leads);
      setTotalCount(response.data.pagination.total);
      if (response.data.stats) {
        setStats(response.data.stats);
      }
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch leads');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [page, rowsPerPage, searchTerm]);

  // Filter leads based on tab
  const filteredLeads = leads.filter(lead => {
    if (currentTab === 0) return true; // All
    if (currentTab === 1) return lead.lead_status === 'new'; // New
    if (currentTab === 2) return lead.lead_status === 'qualified'; // Qualified
    if (currentTab === 3) return lead.lead_status === 'converted'; // Converted
    return true;
  });

  // Stats from API
  const totalLeads = stats.total;
  const newLeads = stats.new;
  const contactedLeads = stats.contacted;
  const qualifiedLeads = stats.qualified;
  const convertedLeads = stats.converted;
  const lostLeads = stats.lost;

  // Fetch webhook URL
  const fetchWebhookUrl = async () => {
    try {
      const response = await leadService.getWebhookUrl();
      setWebhookUrl(response.data.webhookUrl);
    } catch (err) {
      setError('Failed to fetch webhook URL');
    }
  };

  // Handle open add dialog
  const handleOpenAddDialog = () => {
    setEditingLead(null);
    setFormData({ name: '', phone: '', email: '', company: '', notes: '' });
    setOpenDialog(true);
  };

  // Handle view lead details - navigate to detail page
  const handleViewLead = (lead) => {
    navigate(`/leads/${lead.id}`);
  };

  // Handle open edit dialog
  const handleOpenEditDialog = (lead) => {
    setEditingLead(lead);
    setFormData({
      name: lead.name,
      phone: lead.phone,
      email: lead.email || '',
      company: lead.company || '',
      notes: lead.notes || ''
    });
    setOpenDialog(true);
  };

  // Handle close dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingLead(null);
    setFormData({ name: '', phone: '', email: '', company: '', notes: '' });
  };

  // Handle submit
  const handleSubmit = async () => {
    try {
      if (editingLead) {
        await leadService.updateLead(editingLead.id, formData);
        setSuccess('Lead updated successfully');
      } else {
        await leadService.createLead(formData);
        setSuccess('Lead created successfully');
      }
      handleCloseDialog();
      fetchLeads();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      try {
        await leadService.deleteLead(id);
        setSuccess('Lead deleted successfully');
        fetchLeads();
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete lead');
      }
    }
  };

  // Handle convert to contact
  const handleConvert = async (id) => {
    if (window.confirm('Convert this lead to contact?')) {
      try {
        await leadService.convertToContact(id);
        setSuccess('Lead converted to contact successfully');
        fetchLeads();
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to convert lead');
      }
    }
  };

  // Handle initiate call
  const handleInitiateCall = (lead) => {
    setCallingLead(lead);
    setCallDialog(true);
  };

  const handleCallNow = async () => {
    if (!callingLead || !callingLead.phone) {
      setError('Invalid phone number');
      return;
    }

    try {
      setCalling(true);
      const response = await callService.initiateCall(callingLead.phone, null);
      setSuccess(`Call initiated to ${callingLead.name || callingLead.phone}!`);
      setCallDialog(false);
      setCallingLead(null);
    } catch (error) {
      console.error('Error initiating call:', error);
      setError(error.response?.data?.message || 'Failed to initiate call. Please check Twilio configuration.');
    } finally {
      setCalling(false);
    }
  };

  // Handle webhook dialog
  const handleOpenWebhookDialog = async () => {
    await fetchWebhookUrl();
    setOpenWebhookDialog(true);
  };

  // Handle copy webhook URL
  const handleCopyWebhookUrl = () => {
    navigator.clipboard.writeText(webhookUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelected(filteredLeads.map(l => l.id));
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

  // Get status chip styling
  const getStatusChip = (status) => {
    const styles = {
      new: { bgcolor: '#dbeafe', color: '#1d4ed8' },
      contacted: { bgcolor: '#fef3c7', color: '#92400e' },
      qualified: { bgcolor: '#e9d5ff', color: '#7c3aed' },
      converted: { bgcolor: '#d1fae5', color: '#065f46' },
      lost: { bgcolor: '#fee2e2', color: '#dc2626' }
    };
    return styles[status] || { bgcolor: '#f3f4f6', color: '#374151' };
  };

  if (loading && leads.length === 0) {
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
          Leads
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {/* View Toggle */}
          <Box sx={{ display: 'flex', border: '1px solid #e5e7eb', borderRadius: 1.5, overflow: 'hidden' }}>
            <Button
              size="small"
              startIcon={<KanbanIcon />}
              onClick={() => setViewMode('kanban')}
              sx={{
                px: 2,
                borderRadius: 0,
                bgcolor: viewMode === 'kanban' ? '#2196f3' : 'transparent',
                color: viewMode === 'kanban' ? 'white' : '#6b7280',
                '&:hover': { bgcolor: viewMode === 'kanban' ? '#1976d2' : '#f5f5f5' }
              }}
            >
              Kanban
            </Button>
            <Button
              size="small"
              startIcon={<TableIcon />}
              onClick={() => setViewMode('table')}
              sx={{
                px: 2,
                borderRadius: 0,
                bgcolor: viewMode === 'table' ? '#2196f3' : 'transparent',
                color: viewMode === 'table' ? 'white' : '#6b7280',
                '&:hover': { bgcolor: viewMode === 'table' ? '#1976d2' : '#f5f5f5' }
              }}
            >
              Table
            </Button>
          </Box>
          <Button
            variant="outlined"
            startIcon={<WebhookIcon />}
            onClick={handleOpenWebhookDialog}
            sx={{ borderRadius: 1.5, textTransform: 'none', borderColor: '#e5e7eb', color: '#374151' }}
          >
            Webhook URL
          </Button>
          <Button
            variant="outlined"
            startIcon={<BulkIcon />}
            onClick={() => setOpenBulkDialog(true)}
            sx={{ borderRadius: 1.5, textTransform: 'none', borderColor: '#e5e7eb', color: '#374151' }}
          >
            Bulk Import
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenAddDialog}
            sx={{ borderRadius: 1.5, textTransform: 'none' }}
          >
            Add Lead
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

      {/* Stats Cards */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2.5 }}>
        <Paper sx={{
          flex: 1,
          p: 2,
          borderRadius: 2,
          background: 'linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%)',
          border: '1px solid #c8e6c9'
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography fontSize={12} color="#2e7d32" fontWeight={500}>Total Leads</Typography>
              <Typography variant="h4" fontWeight={700} color="#1b5e20">
                {totalLeads}
              </Typography>
            </Box>
            <Box sx={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              bgcolor: '#ff9800',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <PeopleIcon sx={{ color: 'white', fontSize: 20 }} />
            </Box>
          </Box>
        </Paper>

        <Paper sx={{
          flex: 1,
          p: 2,
          borderRadius: 2,
          background: 'linear-gradient(135deg, #e3f2fd 0%, #e8f5e9 100%)',
          border: '1px solid #bbdefb'
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography fontSize={12} color="#1565c0" fontWeight={500}>New Leads</Typography>
              <Typography variant="h4" fontWeight={700} color="#0d47a1">
                {newLeads}
              </Typography>
            </Box>
            <Box sx={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              bgcolor: '#2196f3',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <PersonAddIcon sx={{ color: 'white', fontSize: 20 }} />
            </Box>
          </Box>
        </Paper>

        <Paper sx={{
          flex: 1,
          p: 2,
          borderRadius: 2,
          background: 'linear-gradient(135deg, #fff8e1 0%, #ffecb3 100%)',
          border: '1px solid #ffe082'
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography fontSize={12} color="#f57c00" fontWeight={500}>Contacted</Typography>
              <Typography variant="h4" fontWeight={700} color="#e65100">
                {contactedLeads}
              </Typography>
            </Box>
            <Box sx={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              bgcolor: '#ff9800',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <PhoneIcon sx={{ color: 'white', fontSize: 20 }} />
            </Box>
          </Box>
        </Paper>

        <Paper sx={{
          flex: 1,
          p: 2,
          borderRadius: 2,
          background: 'linear-gradient(135deg, #f3e5f5 0%, #ede7f6 100%)',
          border: '1px solid #ce93d8'
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography fontSize={12} color="#7b1fa2" fontWeight={500}>Qualified</Typography>
              <Typography variant="h4" fontWeight={700} color="#4a148c">
                {qualifiedLeads}
              </Typography>
            </Box>
            <Box sx={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              bgcolor: '#9c27b0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <TrendingUpIcon sx={{ color: 'white', fontSize: 20 }} />
            </Box>
          </Box>
        </Paper>

        <Paper sx={{
          flex: 1,
          p: 2,
          borderRadius: 2,
          background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)',
          border: '1px solid #a5d6a7'
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography fontSize={12} color="#2e7d32" fontWeight={500}>Converted</Typography>
              <Typography variant="h4" fontWeight={700} color="#1b5e20">
                {convertedLeads}
              </Typography>
            </Box>
            <Box sx={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              bgcolor: '#4caf50',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <CheckIcon sx={{ color: 'white', fontSize: 20 }} />
            </Box>
          </Box>
        </Paper>

        <Paper sx={{
          flex: 1,
          p: 2,
          borderRadius: 2,
          background: 'linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)',
          border: '1px solid #ef9a9a'
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography fontSize={12} color="#c62828" fontWeight={500}>Lost</Typography>
              <Typography variant="h4" fontWeight={700} color="#b71c1c">
                {lostLeads}
              </Typography>
            </Box>
            <Box sx={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              bgcolor: '#f44336',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <CancelIcon sx={{ color: 'white', fontSize: 20 }} />
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* Kanban or Table View */}
      {viewMode === 'kanban' ? (
        <LeadKanbanBoard
          filters={{}}
          onLeadClick={handleViewLead}
          onLeadEdit={handleOpenEditDialog}
          onRefresh={fetchLeads}
        />
      ) : (
        <Paper sx={{ overflow: 'hidden', borderRadius: 2, border: '1px solid #e5e7eb' }}>
          {/* Table Header */}
          <Box sx={{ p: 2, borderBottom: '1px solid #e5e7eb' }}>
            <Typography variant="h6" fontWeight={600}>
              All Leads
            </Typography>
          </Box>

          {/* Tabs */}
          <Box sx={{ borderBottom: '1px solid #e5e7eb' }}>
            <Tabs
              value={currentTab}
              onChange={(e, v) => setCurrentTab(v)}
              sx={{
                px: 2,
                '& .MuiTab-root': { textTransform: 'none', minHeight: 48, fontWeight: 500 },
                '& .Mui-selected': { color: '#1a1a1a' },
                '& .MuiTabs-indicator': { backgroundColor: '#1a1a1a' }
              }}
            >
              <Tab label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><span>All</span><Chip label={totalLeads} size="small" sx={{ height: 20, fontSize: '0.75rem', bgcolor: '#1a1a1a', color: 'white' }} /></Box>} />
              <Tab label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><span>New</span><Chip label={newLeads} size="small" sx={{ height: 20, fontSize: '0.75rem', bgcolor: '#2196f3', color: 'white' }} /></Box>} />
              <Tab label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><span>Qualified</span><Chip label={qualifiedLeads} size="small" sx={{ height: 20, fontSize: '0.75rem', bgcolor: '#9c27b0', color: 'white' }} /></Box>} />
              <Tab label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><span>Converted</span><Chip label={convertedLeads} size="small" sx={{ height: 20, fontSize: '0.75rem', bgcolor: '#4caf50', color: 'white' }} /></Box>} />
            </Tabs>
          </Box>

          {/* Search & Filters */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, borderBottom: '1px solid #e5e7eb' }}>
            <TextField
              placeholder="Search leads by name or phone..."
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
                    <SearchIcon sx={{ color: '#9ca3af' }} />
                  </InputAdornment>
                ),
              }}
            />
{/* Filters removed - not functional */}
          </Box>

          {/* Table */}
          <TableContainer>
            <Table size={dense ? 'small' : 'medium'}>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f9fafb' }}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      indeterminate={selected.length > 0 && selected.length < filteredLeads.length}
                      checked={filteredLeads.length > 0 && selected.length === filteredLeads.length}
                      onChange={handleSelectAll}
                    />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#4b5563' }}>Status/Created at</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#4b5563' }}>Phone/Name</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#4b5563' }}>Source/Company</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#4b5563' }}>Assigned To</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredLeads
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((lead) => {
                    const isSelected = selected.indexOf(lead.id) !== -1;
                    const statusStyle = getStatusChip(lead.lead_status);
                    return (
                      <TableRow
                        key={lead.id}
                        hover
                        selected={isSelected}
                        sx={{ '&:hover': { bgcolor: '#f9fafb' }, borderBottom: '1px solid #f3f4f6' }}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox checked={isSelected} onChange={() => handleSelectOne(lead.id)} />
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Chip
                              label={lead.lead_status}
                              size="small"
                              sx={{ ...statusStyle, fontWeight: 500, fontSize: '0.75rem', height: 24, mb: 0.5, textTransform: 'capitalize' }}
                            />
                            <Typography variant="caption" display="block" color="text.secondary">
                              {lead.created_at ? format(new Date(lead.created_at), 'MMM dd, yyyy h:mm:ss') : '-'}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="body2" sx={{ color: '#2196f3', fontWeight: 500, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
                              91 {lead.phone}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {lead.name || '-'}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Chip label={lead.source} size="small" sx={{ bgcolor: '#f3f4f6', color: '#374151', fontSize: '0.75rem', height: 22, mb: 0.5 }} />
                            <Typography variant="caption" display="block" color="text.secondary">
                              {lead.company || '-'}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.primary">
                            {lead.assignedUser?.full_name || 'Unassigned'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Tooltip title="View Details">
                              <IconButton
                                size="small"
                                onClick={() => navigate(`/leads/${lead.id}`)}
                                sx={{
                                  color: '#3b82f6',
                                  '&:hover': { bgcolor: '#dbeafe' }
                                }}
                              >
                                <ViewIcon sx={{ fontSize: 18 }} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Call">
                              <IconButton
                                size="small"
                                onClick={() => handleInitiateCall(lead)}
                                sx={{
                                  color: '#10b981',
                                  '&:hover': { bgcolor: '#d1fae5' }
                                }}
                              >
                                <PhoneIcon sx={{ fontSize: 18 }} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Email">
                              <IconButton
                                size="small"
                                onClick={() => lead.email && window.open(`mailto:${lead.email}`, '_blank')}
                                sx={{
                                  color: '#3b82f6',
                                  '&:hover': { bgcolor: '#dbeafe' }
                                }}
                              >
                                <EmailIcon sx={{ fontSize: 18 }} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="WhatsApp">
                              <IconButton
                                size="small"
                                onClick={() => lead.phone && window.open(`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}`, '_blank')}
                                sx={{
                                  color: '#25D366',
                                  '&:hover': { bgcolor: '#dcfce7' }
                                }}
                              >
                                <WhatsAppIcon sx={{ fontSize: 18 }} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Schedule Meet">
                              <IconButton
                                size="small"
                                onClick={() => window.open('https://meet.google.com/new', '_blank')}
                                sx={{
                                  color: '#ea4335',
                                  '&:hover': { bgcolor: '#fee2e2' }
                                }}
                              >
                                <MeetIcon sx={{ fontSize: 18 }} />
                              </IconButton>
                            </Tooltip>
                            {lead.lead_status !== 'converted' && (
                              <>
                                <Tooltip title="Edit">
                                  <IconButton size="small" onClick={() => handleOpenEditDialog(lead)}>
                                    <EditIcon sx={{ color: '#2196f3', fontSize: 18 }} />
                                  </IconButton>
                                </Tooltip>
                              </>
                            )}
                            {(user?.role === 'admin' || user?.role === 'manager') && (
                              <Tooltip title="Delete">
                                <IconButton size="small" onClick={() => handleDelete(lead.id)}>
                                  <DeleteIcon sx={{ color: '#f44336', fontSize: 18 }} />
                                </IconButton>
                              </Tooltip>
                            )}
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                {filteredLeads.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">No leads found</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Footer */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, py: 1, borderTop: '1px solid #e5e7eb' }}>
            <FormControlLabel
              control={<Switch checked={dense} onChange={(e) => setDense(e.target.checked)} size="small" />}
              label={<Typography variant="body2" color="text.secondary">Dense</Typography>}
            />
            <TablePagination
              component="div"
              count={filteredLeads.length}
              page={page}
              onPageChange={(e, newPage) => setPage(newPage)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
              rowsPerPageOptions={[5, 10, 25]}
              sx={{ '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': { fontSize: '0.875rem', color: '#6b7280' } }}
            />
          </Box>
        </Paper>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>{editingLead ? 'Edit Lead' : 'Add New Lead'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField label="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }} />
            <TextField label="Phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }} />
            <TextField label="Email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }} />
            <TextField label="Company" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }} />
            <TextField label="Notes" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} multiline rows={3} fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }} />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseDialog} sx={{ borderRadius: 1.5 }}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={!formData.name || !formData.phone} sx={{ borderRadius: 1.5 }}>{editingLead ? 'Update' : 'Create'}</Button>
        </DialogActions>
      </Dialog>

      {/* Webhook URL Dialog */}
      <Dialog open={openWebhookDialog} onClose={() => setOpenWebhookDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>Webhook URL for Lead Capture</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>Use this URL to send leads from your forms or landing pages:</Typography>
            <Paper sx={{ p: 2, bgcolor: '#f9fafb', mt: 2, mb: 3, border: '1px solid #e5e7eb' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" sx={{ flex: 1, wordBreak: 'break-all', fontFamily: 'monospace' }}>{webhookUrl}</Typography>
                <Tooltip title={copied ? 'Copied!' : 'Copy'}>
                  <IconButton size="small" onClick={handleCopyWebhookUrl} color={copied ? 'success' : 'primary'}>
                    {copied ? <CheckIcon /> : <CopyIcon />}
                  </IconButton>
                </Tooltip>
              </Box>
            </Paper>
            <Alert severity="info">
              <Typography variant="body2">
                <strong>Supported fields:</strong> name, phone, email, company
              </Typography>
            </Alert>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpenWebhookDialog(false)} sx={{ borderRadius: 1.5 }}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Bulk Import Dialog */}
      <BulkLeadImport
        open={openBulkDialog}
        onClose={() => setOpenBulkDialog(false)}
        onSuccess={() => { setSuccess('Leads imported successfully'); fetchLeads(); }}
      />

      {/* Call Confirmation Dialog */}
      <Dialog
        open={callDialog}
        onClose={() => !calling && setCallDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ borderBottom: '1px solid #e5e7eb' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 50,
                height: 50,
                borderRadius: '50%',
                bgcolor: '#d1fae5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CallIcon sx={{ color: '#10b981', fontSize: 24 }} />
            </Box>
            <Box>
              <Typography variant="h6" fontWeight={600}>
                Initiate Call
              </Typography>
              <Typography variant="caption" color="text.secondary">
                via Twilio Voice
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          {callingLead && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <Box
                sx={{
                  p: 2.5,
                  borderRadius: 2,
                  bgcolor: '#f9fafb',
                  border: '1px solid #e5e7eb',
                }}
              >
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Calling to:
                </Typography>
                <Typography variant="h6" fontWeight={600} color="#111827">
                  {callingLead.name || 'Unknown Lead'}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                  <PhoneIcon sx={{ color: '#10b981', fontSize: 18 }} />
                  <Typography variant="body1" color="#10b981" fontWeight={500}>
                    +91 {callingLead.phone}
                  </Typography>
                </Box>
                {callingLead.company && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    Company: {callingLead.company}
                  </Typography>
                )}
              </Box>

              <Alert severity="info" sx={{ borderRadius: 1.5 }}>
                <Typography variant="body2">
                  The call will be initiated through Twilio. Make sure your Twilio configuration is set up correctly.
                </Typography>
              </Alert>

              {calling && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, justifyContent: 'center', p: 2 }}>
                  <CircularProgress size={24} sx={{ color: '#10b981' }} />
                  <Typography variant="body2" color="text.secondary">
                    Connecting call...
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, borderTop: '1px solid #e5e7eb', gap: 1 }}>
          <Button
            onClick={() => {
              setCallDialog(false);
              setCallingLead(null);
            }}
            disabled={calling}
            sx={{ borderRadius: 1.5, color: '#6b7280' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCallNow}
            variant="contained"
            disabled={calling}
            startIcon={calling ? <CircularProgress size={18} color="inherit" /> : <CallIcon />}
            sx={{
              borderRadius: 1.5,
              bgcolor: '#10b981',
              '&:hover': { bgcolor: '#059669' },
            }}
          >
            {calling ? 'Calling...' : 'Call Now'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LeadsPage;
