import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Phone as PhoneIcon,
  PlayArrow as PlayIcon,
  CloudUpload as UploadIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import callService from '../services/callService';

const CallsPage = () => {
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    fetchCalls();
  }, []);

  const fetchCalls = async () => {
    try {
      setLoading(true);
      const response = await callService.getCalls();
      setCalls(response.data.calls);
    } catch (error) {
      console.error('Error fetching calls:', error);
    } finally {
      setLoading(false);
    }
  };

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
      } else {
        const response = await callService.createCall(formData);
        callId = response.data.call.id;
      }

      // Upload recording if file is selected
      if (recordingFile && callId) {
        const formDataWithFile = new FormData();
        formDataWithFile.append('recording', recordingFile);
        await callService.uploadRecording(callId, formDataWithFile);
      }

      fetchCalls();
      handleCloseDialog();
      setRecordingFile(null);
    } catch (error) {
      console.error('Error saving call:', error);
      alert('Error saving call: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check if file is audio
      if (!file.type.startsWith('audio/')) {
        alert('Please select an audio file');
        return;
      }
      setRecordingFile(file);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this call?')) {
      try {
        await callService.deleteCall(id);
        fetchCalls();
      } catch (error) {
        console.error('Error deleting call:', error);
      }
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      converted: 'success',
      interested: 'info',
      callback: 'warning',
      not_interested: 'error',
      pending: 'default',
    };
    return colors[status] || 'default';
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          Calls
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Call
        </Button>
      </Box>

      <Card>
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Phone Number</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Date & Time</TableCell>
                  <TableCell>Duration</TableCell>
                  <TableCell>Outcome</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Recording</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {calls.map((call) => (
                  <TableRow key={call.id}>
                    <TableCell>{call.phone_number}</TableCell>
                    <TableCell>
                      <Chip label={call.call_type} size="small" />
                    </TableCell>
                    <TableCell>
                      {format(new Date(call.start_time), 'MMM dd, yyyy HH:mm')}
                    </TableCell>
                    <TableCell>
                      {call.duration ? `${Math.floor(call.duration / 60)}m ${call.duration % 60}s` : '-'}
                    </TableCell>
                    <TableCell>{call.outcome || '-'}</TableCell>
                    <TableCell>
                      <Chip
                        label={call.call_status}
                        color={getStatusColor(call.call_status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {call.recording_id ? (
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => {
                            const audio = new Audio(`http://localhost:5000/api/calls/${call.id}/recording`);
                            audio.play();
                          }}
                        >
                          <PlayIcon />
                        </IconButton>
                      ) : (
                        <Typography variant="caption" color="text.secondary">
                          No recording
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={() => handleOpenDialog(call)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDelete(call.id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{selectedCall ? 'Edit Call' : 'Add New Call'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Phone Number"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            select
            label="Call Type"
            name="call_type"
            value={formData.call_type}
            onChange={handleChange}
            margin="normal"
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
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            label="Duration (seconds)"
            name="duration"
            type="number"
            value={formData.duration}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            select
            label="Outcome"
            name="outcome"
            value={formData.outcome}
            onChange={handleChange}
            margin="normal"
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
            margin="normal"
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
            margin="normal"
            multiline
            rows={3}
          />

          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Call Recording (optional)
            </Typography>
            <Button
              variant="outlined"
              component="label"
              startIcon={<UploadIcon />}
              fullWidth
              sx={{ mt: 1 }}
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
                ✓ File selected: {recordingFile.name} ({(recordingFile.size / 1024 / 1024).toFixed(2)} MB)
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {selectedCall ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CallsPage;
