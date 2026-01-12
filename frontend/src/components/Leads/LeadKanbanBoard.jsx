import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Card,
  CardContent,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Badge,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Alert,
  CircularProgress,
  Snackbar
} from '@mui/material';
import {
  Phone as PhoneIcon,
  Email as EmailIcon,
  WhatsApp as WhatsAppIcon,
  VideoCall as MeetIcon,
  MoreVert as MoreIcon,
  SwapHoriz as ConvertIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  AccessTime as TimeIcon,
  Send as SendIcon
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import leadService from '../../services/leadService';
import emailService from '../../services/emailService';
import callService from '../../services/callService';

const LeadKanbanBoard = ({ filters, onLeadClick, onRefresh }) => {
  const theme = useTheme();
  const [kanbanData, setKanbanData] = useState({
    new: [],
    contacted: [],
    qualified: [],
    converted: [],
    lost: []
  });
  const [loading, setLoading] = useState(true);
  const [draggedLead, setDraggedLead] = useState(null);
  const [draggedFromStage, setDraggedFromStage] = useState(null);

  // Email dialog state
  const [emailDialog, setEmailDialog] = useState(false);
  const [emailLead, setEmailLead] = useState(null);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const stages = [
    { id: 'new', label: 'New Leads', color: '#2196f3', icon: '📥' },
    { id: 'contacted', label: 'Contacted', color: '#ff9800', icon: '📞' },
    { id: 'qualified', label: 'Qualified', color: '#9c27b0', icon: '✅' },
    { id: 'converted', label: 'Converted', color: '#4caf50', icon: '🎉' },
    { id: 'lost', label: 'Lost', color: '#f44336', icon: '❌' }
  ];

  useEffect(() => {
    fetchKanbanData();
  }, [filters]);

  const fetchKanbanData = async () => {
    try {
      setLoading(true);
      const response = await leadService.getLeadsByStage(filters);
      setKanbanData(response.data);
    } catch (error) {
      console.error('Error fetching kanban data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (e, lead, stage) => {
    setDraggedLead(lead);
    setDraggedFromStage(stage);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e, targetStage) => {
    e.preventDefault();

    if (!draggedLead || draggedFromStage === targetStage) {
      setDraggedLead(null);
      setDraggedFromStage(null);
      return;
    }

    try {
      // Update lead stage on backend
      await leadService.updateLeadStage(draggedLead.id, targetStage);

      // Update local state
      setKanbanData(prev => {
        const newData = { ...prev };

        // Remove from old stage
        newData[draggedFromStage] = newData[draggedFromStage].filter(
          lead => lead.id !== draggedLead.id
        );

        // Add to new stage
        const updatedLead = { ...draggedLead, lead_status: targetStage };
        newData[targetStage] = [updatedLead, ...newData[targetStage]];

        return newData;
      });

      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Error updating lead stage:', error);
      // Revert on error
      fetchKanbanData();
    } finally {
      setDraggedLead(null);
      setDraggedFromStage(null);
    }
  };

  const getActivityIcon = (activity_type) => {
    const icons = {
      call: <PhoneIcon fontSize="small" />,
      email: <EmailIcon fontSize="small" />,
      whatsapp: <WhatsAppIcon fontSize="small" />,
      meeting: <MeetIcon fontSize="small" />,
      stage_change: <ConvertIcon fontSize="small" />
    };
    return icons[activity_type] || <TimeIcon fontSize="small" />;
  };

  // Handle sending email via Gmail SMTP
  const handleSendEmail = async () => {
    if (!emailSubject.trim() || !emailBody.trim()) {
      setSnackbar({ open: true, message: 'Please enter subject and message', severity: 'error' });
      return;
    }

    setSendingEmail(true);
    try {
      await emailService.sendEmail({
        to: emailLead.email,
        toName: emailLead.name,
        subject: emailSubject,
        message: emailBody,
        leadId: emailLead.id
      });

      // Log activity
      await leadService.logActivity(emailLead.id, {
        activity_type: 'email',
        description: `Sent email: ${emailSubject}`
      });

      setSnackbar({ open: true, message: 'Email sent successfully!', severity: 'success' });
      setEmailDialog(false);
      setEmailSubject('');
      setEmailBody('');
      setEmailLead(null);

      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Failed to send email:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Failed to send email. Please check email configuration.',
        severity: 'error'
      });
    } finally {
      setSendingEmail(false);
    }
  };

  // Open email dialog
  const openEmailDialog = (lead) => {
    setEmailLead(lead);
    setEmailSubject(`Follow up with ${lead.name}`);
    setEmailBody(`Hi ${lead.name},\n\nI wanted to follow up with you regarding our conversation.\n\nBest regards`);
    setEmailDialog(true);
  };

  const LeadCard = ({ lead, stage }) => {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenuOpen = (e) => {
      e.stopPropagation();
      setAnchorEl(e.currentTarget);
    };

    const handleMenuClose = () => {
      setAnchorEl(null);
    };

    const handleAction = async (action, e) => {
      e.stopPropagation();
      handleMenuClose();

      if (action === 'view') {
        onLeadClick(lead);
      } else if (action === 'email') {
        // Open email dialog instead of mailto
        openEmailDialog(lead);
      } else if (action === 'whatsapp') {
        const cleanPhone = lead.phone?.replace(/[^0-9+]/g, '');
        const message = encodeURIComponent(`Hi ${lead.name}, reaching out from our team.`);
        window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');

        // Log activity
        await leadService.logActivity(lead.id, {
          activity_type: 'whatsapp',
          description: `Sent WhatsApp message to ${lead.phone}`
        });
      } else if (action === 'meet') {
        const eventName = encodeURIComponent(`Meeting with ${lead.name}`);
        const details = encodeURIComponent(`Discussion with ${lead.name}\nEmail: ${lead.email}\nPhone: ${lead.phone || 'N/A'}`);
        window.open(`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${eventName}&details=${details}&add=${lead.email}`, '_blank');

        // Log activity
        await leadService.logActivity(lead.id, {
          activity_type: 'meeting',
          description: `Scheduled Google Meet with ${lead.name}`
        });
      } else if (action === 'call') {
        try {
          // Initiate call via Twilio (pass null for contact_id since this is a lead)
          const response = await callService.initiateCall(lead.phone, null);

          setSnackbar({
            open: true,
            message: `Call initiated to ${lead.phone}. The call will connect shortly.`,
            severity: 'success'
          });

          // Log activity
          await leadService.logActivity(lead.id, {
            activity_type: 'call',
            description: `Initiated call to ${lead.phone} via Twilio`
          });
        } catch (error) {
          console.error('Error initiating call:', error);
          setSnackbar({
            open: true,
            message: error.response?.data?.message || 'Failed to initiate call. Please check Twilio credentials.',
            severity: 'error'
          });
        }
      }

      if (onRefresh) onRefresh();
    };

    return (
      <Card
        sx={{
          mb: 1.5,
          cursor: 'grab',
          '&:active': { cursor: 'grabbing' },
          '&:hover': {
            boxShadow: 3,
            transform: 'translateY(-2px)',
            transition: 'all 0.2s'
          },
          opacity: draggedLead?.id === lead.id ? 0.5 : 1
        }}
        draggable
        onDragStart={(e) => handleDragStart(e, lead, stage)}
        onClick={() => onLeadClick(lead)}
      >
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                {lead.name}
              </Typography>
              {lead.company && (
                <Typography variant="caption" color="text.secondary" display="block">
                  {lead.company}
                </Typography>
              )}
            </Box>
          </Box>

          {/* Contact Info */}
          <Box sx={{ mb: 1 }}>
            {lead.phone && (
              <Typography variant="caption" color="text.secondary" display="block">
                📱 {lead.phone}
              </Typography>
            )}
            {lead.email && (
              <Typography variant="caption" color="text.secondary" display="block">
                ✉️ {lead.email}
              </Typography>
            )}
          </Box>

          {/* Assigned User */}
          {lead.assignedUser && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
              <Avatar
                sx={{
                  width: 20,
                  height: 20,
                  fontSize: '0.75rem',
                  bgcolor: theme.palette.primary.main
                }}
              >
                {lead.assignedUser.full_name?.charAt(0)}
              </Avatar>
              <Typography variant="caption" color="text.secondary">
                {lead.assignedUser.full_name}
              </Typography>
            </Box>
          )}

          {/* Source Badge */}
          <Box sx={{ mb: 1 }}>
            <Chip
              label={lead.source}
              size="small"
              sx={{
                height: 20,
                fontSize: '0.7rem',
                bgcolor: lead.source === 'webhook' ? 'secondary.light' : 'grey.200'
              }}
            />
          </Box>

          {/* Recent Activities */}
          {lead.activities && lead.activities.length > 0 && (
            <Box sx={{ borderTop: '1px solid #f3f4f6', pt: 1, mt: 1 }}>
              {lead.activities.slice(0, 2).map((activity, idx) => (
                <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                  <Box sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center' }}>
                    {getActivityIcon(activity.activity_type)}
                  </Box>
                  <Typography variant="caption" color="text.secondary" sx={{ flex: 1 }}>
                    {activity.description}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}

          {/* Time */}
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
            {formatDistanceToNow(new Date(lead.created_at), { addSuffix: true })}
          </Typography>

          {/* Quick Action Buttons */}
          <Box sx={{ display: 'flex', gap: 1, mt: 1.5, pt: 1.5, borderTop: '1px solid #f3f4f6' }}>
            <Tooltip title="Call">
              <IconButton
                size="small"
                onClick={(e) => handleAction('call', e)}
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: '#ecfdf5',
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
                onClick={(e) => handleAction('email', e)}
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: '#eff6ff',
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
                onClick={(e) => handleAction('whatsapp', e)}
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: '#f0fdf4',
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
                onClick={(e) => handleAction('meet', e)}
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: '#fef3c7',
                  color: '#f59e0b',
                  '&:hover': { bgcolor: '#fde68a' }
                }}
              >
                <MeetIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="More">
              <IconButton
                size="small"
                onClick={handleMenuOpen}
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: '#f3f4f6',
                  color: '#6b7280',
                  '&:hover': { bgcolor: '#e5e7eb' }
                }}
              >
                <MoreIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
          </Box>

          {/* More Options Menu */}
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
            <MenuItem onClick={(e) => handleAction('view', e)}>
              <ListItemIcon><ViewIcon fontSize="small" /></ListItemIcon>
              <ListItemText>View Details</ListItemText>
            </MenuItem>
          </Menu>
        </CardContent>
      </Card>
    );
  };

  return (
    <>
      <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 2, minHeight: '70vh' }}>
        {stages.map(stage => (
          <Paper
            key={stage.id}
            sx={{
              minWidth: 300,
              maxWidth: 300,
              bgcolor: 'grey.50',
              p: 2
            }}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, stage.id)}
          >
            {/* Column Header */}
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="h6" sx={{ fontSize: '1rem' }}>
                  {stage.icon} {stage.label}
                </Typography>
              </Box>
              <Badge
                badgeContent={kanbanData[stage.id]?.length || 0}
                color="primary"
                sx={{
                  '& .MuiBadge-badge': {
                    bgcolor: stage.color
                  }
                }}
              />
            </Box>

            {/* Cards */}
            <Box sx={{ maxHeight: 'calc(100vh - 280px)', overflowY: 'auto' }}>
              {loading ? (
                <Typography variant="caption" color="text.secondary">
                  Loading...
                </Typography>
              ) : kanbanData[stage.id]?.length > 0 ? (
                kanbanData[stage.id].map(lead => (
                  <LeadCard key={lead.id} lead={lead} stage={stage.id} />
                ))
              ) : (
                <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center', display: 'block', mt: 4 }}>
                  No leads in this stage
                </Typography>
              )}
            </Box>
          </Paper>
        ))}
      </Box>

      {/* Email Dialog */}
      <Dialog open={emailDialog} onClose={() => !sendingEmail && setEmailDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ borderBottom: '1px solid #e5e7eb' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{
              width: 40,
              height: 40,
              borderRadius: 1,
              bgcolor: '#f0f9ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <EmailIcon sx={{ color: '#2196f3' }} />
            </Box>
            <Typography variant="h6" fontWeight={600}>
              Send Email to {emailLead?.name}
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
            <TextField
              label="To"
              value={emailLead?.email || ''}
              disabled
              fullWidth
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
            />
            <TextField
              label="Subject"
              value={emailSubject}
              onChange={(e) => setEmailSubject(e.target.value)}
              fullWidth
              required
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
            />
            <TextField
              label="Message"
              value={emailBody}
              onChange={(e) => setEmailBody(e.target.value)}
              multiline
              rows={6}
              fullWidth
              required
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
            />
            <Alert severity="info" sx={{ borderRadius: 1.5, fontSize: '0.875rem' }}>
              Email will be sent directly from your configured Gmail account.
            </Alert>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid #e5e7eb', gap: 1 }}>
          <Button onClick={() => setEmailDialog(false)} disabled={sendingEmail} sx={{ color: '#6b7280' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSendEmail}
            disabled={sendingEmail || !emailSubject.trim() || !emailBody.trim()}
            startIcon={sendingEmail ? <CircularProgress size={18} color="inherit" /> : <SendIcon />}
            sx={{ borderRadius: 1.5 }}
          >
            {sendingEmail ? 'Sending...' : 'Send Email'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%', borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default LeadKanbanBoard;
