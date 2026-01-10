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
  Checkbox,
  Switch,
  FormControlLabel,
  InputAdornment,
  Tooltip,
  Tabs,
  Tab,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Phone as PhoneIcon,
  PlayArrow as PlayIcon,
  CloudUpload as UploadIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Settings as SettingsIcon,
  MoreVert as MoreIcon,
  CheckCircle as CheckIcon,
  PhoneCallback as CallbackIcon,
  PhoneMissed as MissedIcon,
  Timer as TimerIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import callService from '../services/callService';

const CallsPage = () => {
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCall, setSelectedCall] = useState(null);
  const [formData, setFormData] = useState({
    phone_number: '',
    call_type: 'outgoing',
    duration: '',
    start_time: new Date().toISOString().slice(0, 16),
    outcome: 'answered',
    call_status: 'pending',
    notes: '',
  });
  const [recordingFile, setRecordingFile] = useState(null);

  // Table state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTab, setCurrentTab] = useState(0);
  const [dense, setDense] = useState(false);
  const [selected, setSelected] = useState([]);
  const [stats, setStats] = useState({ total: 0, outgoing: 0, incoming: 0, missed: 0, totalDuration: 0 });

  useEffect(() => {
    fetchCalls();
  }, []);

  const fetchCalls = async () => {
    try {
      setLoading(true);
      const response = await callService.getCalls();
      setCalls(response.data.calls);
      if (response.data.stats) {
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error('Error fetching calls:', error);
      setError('Failed to fetch calls');
    } finally {
      setLoading(false);
    }
  };

  // Filter calls based on tab and search
  const filteredCalls = calls.filter(call => {
    const matchesSearch = !searchTerm ||
      call.phone_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      call.notes?.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (currentTab === 0) return true; // All
    if (currentTab === 1) return call.outcome === 'answered'; // Answered
    if (currentTab === 2) return call.outcome === 'no_answer' || call.outcome === 'missed'; // Missed
    if (currentTab === 3) return call.call_status === 'callback'; // Callback
    return true;
  });

  // Stats from API
  const totalCalls = stats.total;
  const outgoingCalls = stats.outgoing;
  const incomingCalls = stats.incoming;
  const missedCalls = stats.missed;
  const answeredCalls = stats.answered || 0;
  const callbackCalls = stats.callback || 0;
  const avgDuration = stats.total > 0
    ? Math.round(stats.totalDuration / stats.total)
    : 0;

  const handleOpenDialog = (call = null) => {
    if (call) {
      setSelectedCall(call);
      setFormData({
        phone_number: call.phone_number,
        call_type: call.call_type,
        duration: call.duration || '',
        start_time: new Date(call.start_time).toISOString().slice(0, 16),
        outcome: call.outcome || 'answered',
        call_status: call.call_status,
        notes: call.notes || '',
      });
    } else {
      setSelectedCall(null);
      setFormData({
        phone_number: '',
        call_type: 'outgoing',
        duration: '',
        start_time: new Date().toISOString().slice(0, 16),
        outcome: 'answered',
        call_status: 'pending',
        notes: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedCall(null);
    setRecordingFile(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      let callId;
      if (selectedCall) {
        await callService.updateCall(selectedCall.id, formData);
        callId = selectedCall.id;
        setSuccess('Call updated successfully');
      } else {
        const response = await callService.createCall(formData);
        callId = response.data.call.id;
        setSuccess('Call created successfully');
      }

      // Upload recording if file is selected
      if (recordingFile && callId) {
        const formDataWithFile = new FormData();
        formDataWithFile.append('recording', recordingFile);
        await callService.uploadRecording(callId, formDataWithFile);
      }

      fetchCalls();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving call:', error);
      setError('Error saving call: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('audio/')) {
        setError('Please select an audio file');
        return;
      }
      setRecordingFile(file);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this call?')) {
      try {
        await callService.deleteCall(id);
        setSuccess('Call deleted successfully');
        fetchCalls();
      } catch (error) {
        console.error('Error deleting call:', error);
        setError('Failed to delete call');
      }
    }
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelected(filteredCalls.map(c => c.id));
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

  const getStatusChip = (status) => {
    const styles = {
      converted: { bgcolor: '#d1fae5', color: '#065f46' },
      interested: { bgcolor: '#dbeafe', color: '#1d4ed8' },
      callback: { bgcolor: '#fef3c7', color: '#92400e' },
      not_interested: { bgcolor: '#fee2e2', color: '#dc2626' },
      pending: { bgcolor: '#f3f4f6', color: '#374151' },
    };
    return styles[status] || { bgcolor: '#f3f4f6', color: '#374151' };
  };

  const getOutcomeChip = (outcome) => {
    const styles = {
      answered: { bgcolor: '#d1fae5', color: '#065f46' },
      no_answer: { bgcolor: '#fee2e2', color: '#dc2626' },
      busy: { bgcolor: '#fef3c7', color: '#92400e' },
      voicemail: { bgcolor: '#e9d5ff', color: '#7c3aed' },
      missed: { bgcolor: '#fee2e2', color: '#dc2626' },
    };
    return styles[outcome] || { bgcolor: '#f3f4f6', color: '#374151' };
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '-';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

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
          Calls
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{ borderRadius: 1.5, textTransform: 'none' }}
        >
          Add Call
        </Button>
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
          background: 'linear-gradient(135deg, #dbeafe 0%, #eff6ff 100%)',
          border: '1px solid #bfdbfe'
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography fontSize={12} color="#1e40af" fontWeight={500}>Total Calls</Typography>
              <Typography variant="h4" fontWeight={700} color="#1e3a8a">
                {totalCalls}
              </Typography>
            </Box>
            <Box sx={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              bgcolor: '#2563eb',
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
          background: 'linear-gradient(135deg, #d1fae5 0%, #ecfdf5 100%)',
          border: '1px solid #a7f3d0'
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography fontSize={12} color="#047857" fontWeight={500}>Answered</Typography>
              <Typography variant="h4" fontWeight={700} color="#065f46">
                {answeredCalls}
              </Typography>
            </Box>
            <Box sx={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              bgcolor: '#16a34a',
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
          background: 'linear-gradient(135deg, #fee2e2 0%, #fef2f2 100%)',
          border: '1px solid #fecaca'
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography fontSize={12} color="#b91c1c" fontWeight={500}>Missed</Typography>
              <Typography variant="h4" fontWeight={700} color="#991b1b">
                {missedCalls}
              </Typography>
            </Box>
            <Box sx={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              bgcolor: '#dc2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <MissedIcon sx={{ color: 'white', fontSize: 20 }} />
            </Box>
          </Box>
        </Paper>

        <Paper sx={{
          flex: 1,
          p: 2,
          borderRadius: 2,
          background: 'linear-gradient(135deg, #fef3c7 0%, #fffbeb 100%)',
          border: '1px solid #fcd34d'
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography fontSize={12} color="#92400e" fontWeight={500}>Avg Duration</Typography>
              <Typography variant="h4" fontWeight={700} color="#78350f">
                {formatDuration(avgDuration)}
              </Typography>
            </Box>
            <Box sx={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              bgcolor: '#f59e0b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <TimerIcon sx={{ color: 'white', fontSize: 20 }} />
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* Table Section */}
      <Paper sx={{ overflow: 'hidden', borderRadius: 2, border: '1px solid #e5e7eb' }}>
        {/* Table Header */}
        <Box sx={{ p: 2, borderBottom: '1px solid #e5e7eb' }}>
          <Typography variant="h6" fontWeight={600}>
            Call History
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
            <Tab label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><span>All</span><Chip label={totalCalls} size="small" sx={{ height: 20, fontSize: '0.75rem', bgcolor: '#1a1a1a', color: 'white' }} /></Box>} />
            <Tab label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><span>Answered</span><Chip label={answeredCalls} size="small" sx={{ height: 20, fontSize: '0.75rem', bgcolor: '#16a34a', color: 'white' }} /></Box>} />
            <Tab label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><span>Missed</span><Chip label={missedCalls} size="small" sx={{ height: 20, fontSize: '0.75rem', bgcolor: '#dc2626', color: 'white' }} /></Box>} />
            <Tab label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><span>Callback</span><Chip label={callbackCalls} size="small" sx={{ height: 20, fontSize: '0.75rem', bgcolor: '#f59e0b', color: 'white' }} /></Box>} />
          </Tabs>
        </Box>

        {/* Search & Filters */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, borderBottom: '1px solid #e5e7eb' }}>
          <TextField
            placeholder="Search by phone number..."
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
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="text" startIcon={<FilterIcon />} sx={{ color: '#2196f3', textTransform: 'none', fontWeight: 500 }}>
              Filters
            </Button>
            <IconButton size="small">
              <SettingsIcon sx={{ color: '#6b7280' }} />
            </IconButton>
          </Box>
        </Box>

        {/* Table */}
        <TableContainer>
          <Table size={dense ? 'small' : 'medium'}>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f9fafb' }}>
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={selected.length > 0 && selected.length < filteredCalls.length}
                    checked={filteredCalls.length > 0 && selected.length === filteredCalls.length}
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#4b5563' }}>Phone Number</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#4b5563' }}>Type</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#4b5563' }}>Date & Time</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#4b5563' }}>Duration</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#4b5563' }}>Outcome</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#4b5563' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#4b5563' }}>Recording</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCalls
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((call) => {
                  const isSelected = selected.indexOf(call.id) !== -1;
                  const statusStyle = getStatusChip(call.call_status);
                  const outcomeStyle = getOutcomeChip(call.outcome);
                  return (
                    <TableRow
                      key={call.id}
                      hover
                      selected={isSelected}
                      sx={{ '&:hover': { bgcolor: '#f9fafb' }, borderBottom: '1px solid #f3f4f6' }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox checked={isSelected} onChange={() => handleSelectOne(call.id)} />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ color: '#2196f3', fontWeight: 500, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
                          {call.phone_number}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={call.call_type}
                          size="small"
                          sx={{
                            bgcolor: call.call_type === 'incoming' ? '#dbeafe' : call.call_type === 'outgoing' ? '#d1fae5' : '#fee2e2',
                            color: call.call_type === 'incoming' ? '#1d4ed8' : call.call_type === 'outgoing' ? '#065f46' : '#dc2626',
                            fontWeight: 500,
                            fontSize: '0.75rem',
                            textTransform: 'capitalize'
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {format(new Date(call.start_time), 'MMM dd, yyyy HH:mm')}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {formatDuration(call.duration)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={call.outcome || '-'}
                          size="small"
                          sx={{ ...outcomeStyle, fontWeight: 500, fontSize: '0.75rem', textTransform: 'capitalize' }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={call.call_status}
                          size="small"
                          sx={{ ...statusStyle, fontWeight: 500, fontSize: '0.75rem', textTransform: 'capitalize' }}
                        />
                      </TableCell>
                      <TableCell>
                        {call.recording_id ? (
                          <Tooltip title="Play Recording">
                            <IconButton
                              size="small"
                              sx={{ color: '#2196f3' }}
                              onClick={() => {
                                const audio = new Audio(`http://localhost:5000/api/calls/${call.id}/recording`);
                                audio.play();
                              }}
                            >
                              <PlayIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        ) : (
                          <Typography variant="caption" color="text.secondary">
                            -
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Tooltip title="Edit">
                            <IconButton size="small" onClick={() => handleOpenDialog(call)}>
                              <EditIcon sx={{ color: '#2196f3' }} fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton size="small" onClick={() => handleDelete(call.id)}>
                              <DeleteIcon sx={{ color: '#f44336' }} fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <IconButton size="small">
                            <MoreIcon sx={{ color: '#6b7280' }} fontSize="small" />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })}
              {filteredCalls.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">No calls found</Typography>
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
            count={filteredCalls.length}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
            rowsPerPageOptions={[5, 10, 25]}
            sx={{ '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': { fontSize: '0.875rem', color: '#6b7280' } }}
          />
        </Box>
      </Paper>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>{selectedCall ? 'Edit Call' : 'Add New Call'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField
              fullWidth
              label="Phone Number"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              required
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
            />
            <TextField
              fullWidth
              select
              label="Call Type"
              name="call_type"
              value={formData.call_type}
              onChange={handleChange}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
            >
              <MenuItem value="outgoing">Outgoing</MenuItem>
              <MenuItem value="incoming">Incoming</MenuItem>
              <MenuItem value="missed">Missed</MenuItem>
            </TextField>
            <TextField
              fullWidth
              label="Start Time"
              name="start_time"
              type="datetime-local"
              value={formData.start_time}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
            />
            <TextField
              fullWidth
              label="Duration (seconds)"
              name="duration"
              type="number"
              value={formData.duration}
              onChange={handleChange}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
            />
            <TextField
              fullWidth
              select
              label="Outcome"
              name="outcome"
              value={formData.outcome}
              onChange={handleChange}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
            >
              <MenuItem value="answered">Answered</MenuItem>
              <MenuItem value="no_answer">No Answer</MenuItem>
              <MenuItem value="busy">Busy</MenuItem>
              <MenuItem value="voicemail">Voicemail</MenuItem>
            </TextField>
            <TextField
              fullWidth
              select
              label="Call Status"
              name="call_status"
              value={formData.call_status}
              onChange={handleChange}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
            >
              <MenuItem value="interested">Interested</MenuItem>
              <MenuItem value="not_interested">Not Interested</MenuItem>
              <MenuItem value="callback">Callback</MenuItem>
              <MenuItem value="converted">Converted</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
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

            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Call Recording (optional)
              </Typography>
              <Button
                variant="outlined"
                component="label"
                startIcon={<UploadIcon />}
                fullWidth
                sx={{ borderRadius: 1.5 }}
              >
                {recordingFile ? recordingFile.name : 'Upload Recording'}
                <input
                  type="file"
                  hidden
                  accept="audio/*"
                  onChange={handleFileChange}
                />
              </Button>
              {recordingFile && (
                <Typography variant="caption" color="success.main" sx={{ mt: 1, display: 'block' }}>
                  File selected: {recordingFile.name} ({(recordingFile.size / 1024 / 1024).toFixed(2)} MB)
                </Typography>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseDialog} sx={{ borderRadius: 1.5 }}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" sx={{ borderRadius: 1.5 }}>
            {selectedCall ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CallsPage;
