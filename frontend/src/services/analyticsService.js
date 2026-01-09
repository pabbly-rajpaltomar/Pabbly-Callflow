import api from './api';

export const analyticsService = {
  getDashboardStats: async (params = {}) => {
    const response = await api.get('/analytics/dashboard', { params });
    return response.data;
  },

  getCallsOverTime: async (params = {}) => {
    const response = await api.get('/analytics/calls-over-time', { params });
    return response.data;
  },

  getTeamPerformance: async (params = {}) => {
    const response = await api.get('/analytics/team-performance', { params });
    return response.data;
  },
};

export default analyticsService;
