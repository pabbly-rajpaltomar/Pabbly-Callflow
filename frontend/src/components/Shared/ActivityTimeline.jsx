import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Phone as PhoneIcon,
  Email as EmailIcon,
  WhatsApp as WhatsAppIcon,
  VideoCall as MeetIcon,
  Note as NoteIcon,
  PlayArrow as PlayIcon,
  Download as DownloadIcon,
  AccessTime as TimeIcon,
} from '@mui/icons-material';
import { formatDistanceToNow, format } from 'date-fns';

const ActivityTimeline = ({ activities = [] }) => {
  const getActivityIcon = (type) => {
    const iconProps = { sx: { fontSize: 20 } };
    switch (type) {
      case 'call':
        return <PhoneIcon {...iconProps} />;
      case 'email':
        return <EmailIcon {...iconProps} />;
      case 'whatsapp':
        return <WhatsAppIcon {...iconProps} />;
      case 'meeting':
        return <MeetIcon {...iconProps} />;
      case 'note':
        return <NoteIcon {...iconProps} />;
      default:
        return <NoteIcon {...iconProps} />;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'call':
        return '#10b981';
      case 'email':
        return '#3b82f6';
      case 'whatsapp':
        return '#25D366';
      case 'meeting':
        return '#8b5cf6';
      case 'note':
        return '#f59e0b';
      default:
        return '#6b7280';
    }
  };

  const getOutcomeChip = (outcome) => {
    const config = {
      answered: { label: 'Answered', color: '#10b981', bg: '#d1fae5' },
      no_answer: { label: 'No Answer', color: '#ef4444', bg: '#fee2e2' },
      busy: { label: 'Busy', color: '#f59e0b', bg: '#fef3c7' },
      voicemail: { label: 'Voicemail', color: '#8b5cf6', bg: '#ede9fe' },
    };

    const style = config[outcome] || { label: outcome, color: '#6b7280', bg: '#f3f4f6' };

    return (
      <Chip
        label={style.label}
        size="small"
        sx={{
          height: 20,
          fontSize: '0.75rem',
          fontWeight: 500,
          color: style.color,
          bgcolor: style.bg,
          border: 'none',
        }}
      />
    );
  };

  if (!activities || activities.length === 0) {
    return (
      <Box
        sx={{
          p: 4,
          textAlign: 'center',
          bgcolor: '#f9fafb',
          borderRadius: 2,
          border: '1px dashed #e5e7eb',
        }}
      >
        <TimeIcon sx={{ fontSize: 48, color: '#d1d5db', mb: 2 }} />
        <Typography variant="body2" color="text.secondary">
          No activity history yet
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Communications will appear here once you start engaging with this lead
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ position: 'relative' }}>
      {/* Timeline Line */}
      <Box
        sx={{
          position: 'absolute',
          left: 19,
          top: 24,
          bottom: 24,
          width: 2,
          bgcolor: '#e5e7eb',
        }}
      />

      {/* Activities */}
      {activities.map((activity, index) => (
        <Box
          key={activity.id || index}
          sx={{
            position: 'relative',
            display: 'flex',
            gap: 2,
            mb: index < activities.length - 1 ? 3 : 0,
          }}
        >
          {/* Icon Avatar */}
          <Avatar
            sx={{
              width: 40,
              height: 40,
              bgcolor: getActivityColor(activity.type),
              zIndex: 1,
            }}
          >
            {getActivityIcon(activity.type)}
          </Avatar>

          {/* Content Card */}
          <Paper
            elevation={0}
            sx={{
              flex: 1,
              p: 2,
              border: '1px solid #e5e7eb',
              borderRadius: 2,
              '&:hover': {
                borderColor: '#d1d5db',
                boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
              },
            }}
          >
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
              <Box>
                <Typography variant="body1" fontWeight={600} color="#111827">
                  {activity.title || `${activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}`}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {formatDistanceToNow(new Date(activity.created_at || activity.timestamp), { addSuffix: true })}
                  {' • '}
                  {format(new Date(activity.created_at || activity.timestamp), 'MMM dd, yyyy h:mm a')}
                </Typography>
              </Box>

              {activity.outcome && getOutcomeChip(activity.outcome)}
            </Box>

            {/* Description */}
            {activity.description && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                {activity.description}
              </Typography>
            )}

            {/* Call Specific Details */}
            {activity.type === 'call' && (
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                {activity.phone_number && (
                  <Chip
                    label={activity.phone_number}
                    size="small"
                    icon={<PhoneIcon sx={{ fontSize: 14 }} />}
                    sx={{ bgcolor: '#f3f4f6' }}
                  />
                )}
                {activity.duration && (
                  <Chip
                    label={`${activity.duration}s`}
                    size="small"
                    icon={<TimeIcon sx={{ fontSize: 14 }} />}
                    sx={{ bgcolor: '#f3f4f6' }}
                  />
                )}
                {activity.recording_url && (
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Tooltip title="Play Recording">
                      <IconButton
                        size="small"
                        onClick={() => window.open(activity.recording_url, '_blank')}
                        sx={{ color: '#10b981' }}
                      >
                        <PlayIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Download Recording">
                      <IconButton
                        size="small"
                        onClick={() => window.open(activity.recording_url + '.mp3', '_blank')}
                        sx={{ color: '#6b7280' }}
                      >
                        <DownloadIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                )}
              </Box>
            )}

            {/* Email Specific Details */}
            {activity.type === 'email' && activity.subject && (
              <Box sx={{ p: 1.5, bgcolor: '#f9fafb', borderRadius: 1, mt: 1 }}>
                <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                  Subject:
                </Typography>
                <Typography variant="body2" fontWeight={500}>
                  {activity.subject}
                </Typography>
              </Box>
            )}

            {/* Notes */}
            {activity.notes && activity.notes !== activity.description && (
              <Box sx={{ mt: 1.5, p: 1.5, bgcolor: '#fffbeb', borderRadius: 1, borderLeft: '3px solid #f59e0b' }}>
                <Typography variant="caption" color="#92400e" fontWeight={600} display="block" gutterBottom>
                  Notes:
                </Typography>
                <Typography variant="body2" color="#78350f">
                  {activity.notes}
                </Typography>
              </Box>
            )}

            {/* User Info */}
            {activity.user && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1.5, pt: 1.5, borderTop: '1px solid #f3f4f6' }}>
                <Avatar
                  sx={{
                    width: 24,
                    height: 24,
                    bgcolor: '#3b82f6',
                    fontSize: '0.75rem',
                  }}
                >
                  {activity.user.full_name?.charAt(0) || 'U'}
                </Avatar>
                <Typography variant="caption" color="text.secondary">
                  by {activity.user.full_name || activity.user.email}
                </Typography>
              </Box>
            )}
          </Paper>
        </Box>
      ))}
    </Box>
  );
};

export default ActivityTimeline;
