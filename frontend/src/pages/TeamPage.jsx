import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Avatar,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  IconButton,
  Menu,
  Paper,
  InputAdornment,
  Checkbox,
  Alert,
  Snackbar,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Switch,
  FormControlLabel,
  Divider,
  Tabs,
  Tab
} from '@mui/material';
import {
  Add as AddIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  MoreVert as MoreIcon,
  Search as SearchIcon,
  ViewModule as GridIcon,
  ViewList as ListIcon,
  GroupAdd as BulkIcon,
  Refresh as RefreshIcon,
  Close as CloseIcon,
  ContentCopy as CopyIcon,
  LockReset as ResetIcon,
  ToggleOn as ToggleIcon,
  People as TeamIcon,
  Assessment as StatsIcon,
  PersonAdd as PersonAddIcon,
  AdminPanelSettings as AdminIcon,
  Person as PersonIcon,
  SupervisorAccount as ManagerIcon,
  Edit as EditIcon,
  Block as BlockIcon,
  CheckCircle as ActiveIcon,
  Upload as UploadIcon
} from '@mui/icons-material';
import userService from '../services/userService';
import BulkInviteDialog from '../components/Team/BulkInviteDialog';
import UserStatsModal from '../components/Team/UserStatsModal';
import { formatDistanceToNow } from 'date-fns';

const TeamPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [currentTab, setCurrentTab] = useState(0);

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [dense, setDense] = useState(false);

  // Dialogs
  const [openDialog, setOpenDialog] = useState(false);
  const [openBulkDialog, setOpenBulkDialog] = useState(false);
  const [openStatsModal, setOpenStatsModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [resetPasswordData, setResetPasswordData] = useState(null);

  // Menu
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  // Notifications
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    phone: '',
    role: 'sales_rep',
  });

  const [createdUserPassword, setCreatedUserPassword] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, [roleFilter, statusFilter, searchTerm]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userService.getUsers({
        search: searchTerm || undefined,
        role: roleFilter || undefined,
        is_active: statusFilter || undefined
      });
      setUsers(response.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
      showSnackbar('Failed to fetch users', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleOpenDialog = () => {
    setFormData({ email: '', full_name: '', phone: '', role: 'sales_rep' });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const response = await userService.createUser(formData);
      const { user, password } = response.data;

      setCreatedUserPassword({
        email: user.email,
        full_name: user.full_name,
        password: password
      });

      fetchUsers();
      handleCloseDialog();
    } catch (error) {
      console.error('Error creating user:', error);
      showSnackbar(error.response?.data?.message || 'Failed to create user', 'error');
    }
  };

  const handleMenuOpen = (event, user) => {
    setMenuAnchor(event.currentTarget);
    setCurrentUser(user);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setCurrentUser(null);
  };

  const handleViewStats = (userId) => {
    if (!userId) return;
    setMenuAnchor(null);
    setCurrentUser(null);
    setSelectedUserId(userId);
    setOpenStatsModal(true);
  };

  const handleResetPassword = async (userId) => {
    if (window.confirm('Reset password for this user?')) {
      try {
        const response = await userService.resetUserPassword(userId);
        setResetPasswordData({
          email: currentUser.email,
          password: response.data.newPassword
        });
        showSnackbar('Password reset successfully');
      } catch (error) {
        showSnackbar('Failed to reset password', 'error');
      }
    }
    handleMenuClose();
  };

  const handleToggleStatus = async (userId) => {
    try {
      await userService.toggleUserStatus(userId);
      fetchUsers();
      showSnackbar('User status updated');
    } catch (error) {
      showSnackbar('Failed to update status', 'error');
    }
    handleMenuClose();
  };

  const handleSelectUser = (userId) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(u => u.id));
    }
  };

  // Calculate stats
  const totalMembers = users.length;
  const activeMembers = users.filter(u => u.is_active).length;
  const adminCount = users.filter(u => u.role === 'admin').length;
  const managerCount = users.filter(u => u.role === 'manager').length;
  const salesRepCount = users.filter(u => u.role === 'sales_rep').length;

  // Role styles
  const getRoleStyles = (role) => {
    const styles = {
      admin: { bgcolor: '#fee2e2', color: '#dc2626' },
      manager: { bgcolor: '#fef3c7', color: '#92400e' },
      sales_rep: { bgcolor: '#dbeafe', color: '#1d4ed8' }
    };
    return styles[role] || styles.sales_rep;
  };

  // Get role icon
  const getRoleIcon = (role) => {
    const icons = {
      admin: <AdminIcon sx={{ fontSize: 14 }} />,
      manager: <ManagerIcon sx={{ fontSize: 14 }} />,
      sales_rep: <PersonIcon sx={{ fontSize: 14 }} />
    };
    return icons[role] || icons.sales_rep;
  };

  // Filter users based on tab
  const getFilteredUsers = () => {
    let filtered = users;
    if (currentTab === 1) filtered = users.filter(u => u.role === 'admin');
    else if (currentTab === 2) filtered = users.filter(u => u.role === 'manager');
    else if (currentTab === 3) filtered = users.filter(u => u.role === 'sales_rep');
    return filtered;
  };

  const filteredUsers = getFilteredUsers();
  const paginatedUsers = filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Page Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
        <Typography variant="h5" fontWeight={600} color="#111827">
          Team
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={viewMode === 'table' ? <GridIcon /> : <ListIcon />}
            onClick={() => setViewMode(viewMode === 'table' ? 'grid' : 'table')}
            sx={{
              borderColor: '#e5e7eb',
              color: '#374151',
              '&:hover': { borderColor: '#2196f3', color: '#2196f3' }
            }}
          >
            {viewMode === 'table' ? 'Grid' : 'Table'}
          </Button>
          <Button
            variant="outlined"
            startIcon={<UploadIcon />}
            onClick={() => setOpenBulkDialog(true)}
            sx={{
              borderColor: '#e5e7eb',
              color: '#374151',
              '&:hover': { borderColor: '#2196f3', color: '#2196f3' }
            }}
          >
            Bulk Import
          </Button>
          <Button
            variant="contained"
            startIcon={<PersonAddIcon />}
            onClick={handleOpenDialog}
            sx={{ borderRadius: 1.5 }}
          >
            Add Member
          </Button>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <Paper sx={{
          flex: '1 1 200px',
          p: 2.5,
          borderRadius: 2,
          background: 'linear-gradient(135deg, #dbeafe 0%, #eff6ff 100%)',
          border: '1px solid #bfdbfe'
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Typography fontSize={13} color="#1e40af" fontWeight={500} mb={0.5}>
                Total Members
              </Typography>
              <Typography variant="h4" fontWeight={700} color="#1e3a8a">
                {totalMembers}
              </Typography>
            </Box>
            <Box sx={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              bgcolor: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <TeamIcon sx={{ color: 'white', fontSize: 22 }} />
            </Box>
          </Box>
        </Paper>

        <Paper sx={{
          flex: '1 1 200px',
          p: 2.5,
          borderRadius: 2,
          background: 'linear-gradient(135deg, #d1fae5 0%, #ecfdf5 100%)',
          border: '1px solid #a7f3d0'
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Typography fontSize={13} color="#047857" fontWeight={500} mb={0.5}>
                Active Members
              </Typography>
              <Typography variant="h4" fontWeight={700} color="#065f46">
                {activeMembers}
              </Typography>
            </Box>
            <Box sx={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              bgcolor: '#16a34a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ActiveIcon sx={{ color: 'white', fontSize: 22 }} />
            </Box>
          </Box>
        </Paper>

        <Paper sx={{
          flex: '1 1 200px',
          p: 2.5,
          borderRadius: 2,
          background: 'linear-gradient(135deg, #fee2e2 0%, #fef2f2 100%)',
          border: '1px solid #fecaca'
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Typography fontSize={13} color="#b91c1c" fontWeight={500} mb={0.5}>
                Admins
              </Typography>
              <Typography variant="h4" fontWeight={700} color="#991b1b">
                {adminCount}
              </Typography>
            </Box>
            <Box sx={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              bgcolor: '#dc2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <AdminIcon sx={{ color: 'white', fontSize: 22 }} />
            </Box>
          </Box>
        </Paper>

        <Paper sx={{
          flex: '1 1 200px',
          p: 2.5,
          borderRadius: 2,
          background: 'linear-gradient(135deg, #fef3c7 0%, #fffbeb 100%)',
          border: '1px solid #fcd34d'
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Typography fontSize={13} color="#92400e" fontWeight={500} mb={0.5}>
                Managers
              </Typography>
              <Typography variant="h4" fontWeight={700} color="#78350f">
                {managerCount}
              </Typography>
            </Box>
            <Box sx={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              bgcolor: '#f59e0b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ManagerIcon sx={{ color: 'white', fontSize: 22 }} />
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* Table Section */}
      <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
        {/* Tabs */}
        <Box sx={{ borderBottom: '1px solid #e5e7eb' }}>
          <Tabs
            value={currentTab}
            onChange={(e, newValue) => { setCurrentTab(newValue); setPage(0); }}
            sx={{
              px: 2,
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 500,
                fontSize: 14,
                minHeight: 48,
                color: '#6b7280',
                '&.Mui-selected': { color: '#2196f3' }
              },
              '& .MuiTabs-indicator': { bgcolor: '#2196f3' }
            }}
          >
            <Tab label={`All Members (${totalMembers})`} />
            <Tab label={`Admins (${adminCount})`} />
            <Tab label={`Managers (${managerCount})`} />
            <Tab label={`Sales Reps (${salesRepCount})`} />
          </Tabs>
        </Box>

        {/* Search Bar */}
        <Box sx={{ p: 2, borderBottom: '1px solid #e5e7eb', display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            placeholder="Search by name or email..."
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              flex: 1,
              minWidth: 200,
              '& .MuiOutlinedInput-root': {
                borderRadius: 1.5,
                bgcolor: '#f9fafb'
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#9ca3af' }} />
                </InputAdornment>
              )
            }}
          />
          <TextField
            select
            size="small"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            sx={{ minWidth: 130, '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
          >
            <MenuItem value="">All Status</MenuItem>
            <MenuItem value="true">Active</MenuItem>
            <MenuItem value="false">Inactive</MenuItem>
          </TextField>
          <Tooltip title="Refresh">
            <IconButton onClick={fetchUsers} sx={{ border: '1px solid #e5e7eb', borderRadius: 1.5 }}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Selection Bar */}
        {selectedUsers.length > 0 && (
          <Box sx={{
            p: 1.5,
            bgcolor: '#eff6ff',
            borderBottom: '1px solid #bfdbfe',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Typography fontSize={14} color="#1d4ed8" fontWeight={500}>
              {selectedUsers.length} member(s) selected
            </Typography>
            <Button
              size="small"
              onClick={() => setSelectedUsers([])}
              sx={{ color: '#1d4ed8' }}
            >
              Clear Selection
            </Button>
          </Box>
        )}

        {/* Table or Grid View */}
        {viewMode === 'table' ? (
          <TableContainer>
            <Table size={dense ? 'small' : 'medium'}>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f9fafb' }}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                      indeterminate={selectedUsers.length > 0 && selectedUsers.length < filteredUsers.length}
                      onChange={handleSelectAll}
                      sx={{ '&.Mui-checked': { color: '#2196f3' } }}
                    />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#374151', fontSize: 13 }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#374151', fontSize: 13 }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#374151', fontSize: 13 }}>Phone</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#374151', fontSize: 13 }}>Role</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#374151', fontSize: 13 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#374151', fontSize: 13 }}>Last Login</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600, color: '#374151', fontSize: 13 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedUsers.length > 0 ? (
                  paginatedUsers.map((user) => {
                    const roleStyle = getRoleStyles(user.role);
                    return (
                      <TableRow
                        key={user.id}
                        hover
                        sx={{
                          '&:hover': { bgcolor: '#f9fafb' },
                          opacity: user.is_active ? 1 : 0.6
                        }}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={selectedUsers.includes(user.id)}
                            onChange={() => handleSelectUser(user.id)}
                            sx={{ '&.Mui-checked': { color: '#2196f3' } }}
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Avatar
                              src={user.avatar_url}
                              sx={{
                                width: 36,
                                height: 36,
                                bgcolor: '#e0e7ff',
                                color: '#4f46e5',
                                fontSize: 14,
                                fontWeight: 600
                              }}
                            >
                              {user.full_name?.charAt(0)?.toUpperCase() || 'U'}
                            </Avatar>
                            <Typography fontSize={14} fontWeight={500}>
                              {user.full_name}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography fontSize={14} color="text.secondary">
                            {user.email}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography fontSize={14} color="text.secondary">
                            {user.phone || '-'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={getRoleIcon(user.role)}
                            label={user.role.replace('_', ' ')}
                            size="small"
                            sx={{
                              bgcolor: roleStyle.bgcolor,
                              color: roleStyle.color,
                              fontWeight: 500,
                              fontSize: 12,
                              textTransform: 'capitalize',
                              '& .MuiChip-icon': { color: 'inherit' }
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={user.is_active ? 'Active' : 'Inactive'}
                            size="small"
                            sx={{
                              bgcolor: user.is_active ? '#d1fae5' : '#f3f4f6',
                              color: user.is_active ? '#065f46' : '#6b7280',
                              fontWeight: 500,
                              fontSize: 12
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography fontSize={13} color="text.secondary">
                            {user.last_login_at
                              ? formatDistanceToNow(new Date(user.last_login_at), { addSuffix: true })
                              : 'Never'}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                            <Tooltip title="View Stats">
                              <IconButton size="small" onClick={() => handleViewStats(user.id)}>
                                <StatsIcon fontSize="small" sx={{ color: '#6b7280' }} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="More Actions">
                              <IconButton size="small" onClick={(e) => handleMenuOpen(e, user)}>
                                <MoreIcon fontSize="small" sx={{ color: '#6b7280' }} />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">No team members found</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          /* Grid View */
          <Box sx={{ p: 2, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 2 }}>
            {paginatedUsers.map((user) => {
              const roleStyle = getRoleStyles(user.role);
              return (
                <Card
                  key={user.id}
                  sx={{
                    position: 'relative',
                    '&:hover': { boxShadow: 4 },
                    opacity: user.is_active ? 1 : 0.6,
                    border: '1px solid #e5e7eb'
                  }}
                >
                  <CardContent sx={{ pt: 3, textAlign: 'center' }}>
                    <IconButton
                      onClick={(e) => handleMenuOpen(e, user)}
                      sx={{ position: 'absolute', top: 8, right: 8 }}
                      size="small"
                    >
                      <MoreIcon fontSize="small" />
                    </IconButton>
                    <Avatar
                      src={user.avatar_url}
                      sx={{
                        width: 64,
                        height: 64,
                        margin: '0 auto 16px',
                        bgcolor: '#e0e7ff',
                        color: '#4f46e5',
                        fontSize: 24,
                        fontWeight: 600
                      }}
                    >
                      {user.full_name?.charAt(0)?.toUpperCase() || 'U'}
                    </Avatar>
                    <Typography variant="h6" sx={{ fontSize: '1rem', mb: 0.5, fontWeight: 600 }}>
                      {user.full_name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem', mb: 0.5 }}>
                      {user.email}
                    </Typography>
                    {user.phone && (
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem', mb: 2 }}>
                        {user.phone}
                      </Typography>
                    )}
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap', mb: 1 }}>
                      <Chip
                        label={user.role.replace('_', ' ')}
                        size="small"
                        sx={{ bgcolor: roleStyle.bgcolor, color: roleStyle.color, fontWeight: 500, textTransform: 'capitalize' }}
                      />
                      <Chip
                        label={user.is_active ? 'Active' : 'Inactive'}
                        size="small"
                        sx={{
                          bgcolor: user.is_active ? '#d1fae5' : '#f3f4f6',
                          color: user.is_active ? '#065f46' : '#6b7280',
                          fontWeight: 500
                        }}
                      />
                    </Box>
                    {user.last_login_at && (
                      <Typography variant="caption" color="text.secondary">
                        Last seen {formatDistanceToNow(new Date(user.last_login_at), { addSuffix: true })}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </Box>
        )}

        {/* Footer */}
        <Box sx={{
          px: 2,
          py: 1.5,
          borderTop: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          bgcolor: '#f9fafb'
        }}>
          <FormControlLabel
            control={
              <Switch
                size="small"
                checked={dense}
                onChange={(e) => setDense(e.target.checked)}
              />
            }
            label={<Typography fontSize={13}>Dense</Typography>}
          />
          <TablePagination
            component="div"
            count={filteredUsers.length}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            rowsPerPageOptions={[5, 10, 25, 50]}
          />
        </Box>
      </Paper>

      {/* Context Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: { minWidth: 180, borderRadius: 2 }
        }}
      >
        <MenuItem onClick={() => handleViewStats(currentUser?.id)}>
          <StatsIcon sx={{ mr: 1.5, color: '#6b7280' }} fontSize="small" />
          View Stats
        </MenuItem>
        <MenuItem onClick={() => handleResetPassword(currentUser?.id)}>
          <ResetIcon sx={{ mr: 1.5, color: '#6b7280' }} fontSize="small" />
          Reset Password
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => handleToggleStatus(currentUser?.id)}>
          {currentUser?.is_active ? (
            <>
              <BlockIcon sx={{ mr: 1.5, color: '#dc2626' }} fontSize="small" />
              <Typography color="#dc2626">Deactivate</Typography>
            </>
          ) : (
            <>
              <ActiveIcon sx={{ mr: 1.5, color: '#16a34a' }} fontSize="small" />
              <Typography color="#16a34a">Activate</Typography>
            </>
          )}
        </MenuItem>
      </Menu>

      {/* Add User Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
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
              <PersonAddIcon sx={{ color: '#2196f3' }} />
            </Box>
            <Typography variant="h6" fontWeight={600}>Add New Team Member</Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
            <TextField
              label="Full Name"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Role"
              name="role"
              select
              value={formData.role}
              onChange={handleChange}
              fullWidth
            >
              <MenuItem value="sales_rep">Sales Rep</MenuItem>
              <MenuItem value="manager">Manager</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </TextField>
            <Alert severity="info" sx={{ borderRadius: 2 }}>
              Password will be auto-generated and shown after creation.
            </Alert>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid #e5e7eb' }}>
          <Button onClick={handleCloseDialog} sx={{ color: '#6b7280' }}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!formData.email || !formData.full_name}
            sx={{ borderRadius: 2 }}
          >
            Create Member
          </Button>
        </DialogActions>
      </Dialog>

      {/* Bulk Invite Dialog */}
      <BulkInviteDialog
        open={openBulkDialog}
        onClose={() => setOpenBulkDialog(false)}
        onSuccess={fetchUsers}
      />

      {/* User Stats Modal */}
      <UserStatsModal
        open={openStatsModal}
        onClose={() => setOpenStatsModal(false)}
        userId={selectedUserId}
      />

      {/* Password Reset Result */}
      {resetPasswordData && (
        <Dialog open={Boolean(resetPasswordData)} onClose={() => setResetPasswordData(null)} PaperProps={{ sx: { borderRadius: 2 } }}>
          <DialogTitle sx={{ borderBottom: '1px solid #e5e7eb' }}>Password Reset Successful</DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
              New password generated for {resetPasswordData.email}
            </Alert>
            <Paper sx={{ p: 2, bgcolor: '#f9fafb', display: 'flex', alignItems: 'center', gap: 1, borderRadius: 2 }}>
              <Typography variant="body1" sx={{ fontFamily: 'monospace', flex: 1, fontWeight: 600 }}>
                {resetPasswordData.password}
              </Typography>
              <IconButton
                size="small"
                onClick={() => {
                  navigator.clipboard.writeText(resetPasswordData.password);
                  showSnackbar('Password copied to clipboard');
                }}
              >
                <CopyIcon />
              </IconButton>
            </Paper>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
              Make sure to save this password. It won't be shown again.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 2, borderTop: '1px solid #e5e7eb' }}>
            <Button onClick={() => setResetPasswordData(null)} variant="contained" sx={{ borderRadius: 2 }}>Close</Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Password Display Modal */}
      <Dialog
        open={createdUserPassword !== null}
        onClose={() => {
          setCreatedUserPassword(null);
          showSnackbar('User created successfully');
        }}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle sx={{ borderBottom: '1px solid #e5e7eb' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" fontWeight={600}>User Created Successfully</Typography>
            <IconButton onClick={() => {
              setCreatedUserPassword(null);
              showSnackbar('User created successfully');
            }} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Alert severity="warning" sx={{ mb: 2, borderRadius: 2 }}>
            <Typography variant="subtitle2" gutterBottom fontWeight={600}>
              Important: Save this password!
            </Typography>
            <Typography variant="body2">
              This password will only be shown once. The user can reset it later.
            </Typography>
          </Alert>

          {createdUserPassword && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Name: <strong>{createdUserPassword.full_name}</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Email: <strong>{createdUserPassword.email}</strong>
              </Typography>
              <Paper sx={{ mt: 2, p: 2, bgcolor: '#f9fafb', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="body1" sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
                  {createdUserPassword.password}
                </Typography>
                <Tooltip title="Copy Password">
                  <IconButton
                    size="small"
                    onClick={() => {
                      navigator.clipboard.writeText(createdUserPassword.password);
                      showSnackbar('Password copied to clipboard!');
                    }}
                  >
                    <CopyIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Paper>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid #e5e7eb' }}>
          <Button
            variant="contained"
            onClick={() => {
              setCreatedUserPassword(null);
              showSnackbar('User created successfully');
            }}
            sx={{ borderRadius: 2 }}
          >
            Done
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
    </Box>
  );
};

export default TeamPage;
