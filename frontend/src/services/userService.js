import api from './api';

export const userService = {
  getUsers: async (params = {}) => {
    const response = await api.get('/users', { params });
    return response.data;
  },

  getUserById: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  createUser: async (userData) => {
    const response = await api.post('/users', userData);
    return response.data;
  },

  updateUser: async (id, userData) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },

  getUserStats: async (id) => {
    const response = await api.get(`/users/${id}/stats`);
    return response.data;
  },

  bulkCreateUsers: async (users) => {
    const response = await api.post('/users/bulk', { users });
    return response.data;
  },

  resetUserPassword: async (id) => {
    const response = await api.post(`/users/${id}/reset-password`);
    return response.data;
  },

  toggleUserStatus: async (id) => {
    const response = await api.patch(`/users/${id}/status`);
    return response.data;
  },

  assignUserToTeam: async (id, teamId) => {
    const response = await api.patch(`/users/${id}/team`, { team_id: teamId });
    return response.data;
  },

  bulkAssignTeam: async (userIds, teamId) => {
    const response = await api.post('/users/bulk-assign-team', { user_ids: userIds, team_id: teamId });
    return response.data;
  },
};

export default userService;
