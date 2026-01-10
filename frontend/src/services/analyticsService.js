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

  getConversionFunnel: async (params = {}) => {
    const response = await api.get('/analytics/conversion-funnel', { params });
    return response.data;
  },

  getPerformanceRankings: async (params = {}) => {
    const response = await api.get('/analytics/performance-rankings', { params });
    return response.data;
  },

  getCallQuality: async (params = {}) => {
    const response = await api.get('/analytics/call-quality', { params });
    return response.data;
  },

  exportAnalytics: async (params = {}) => {
    const response = await api.get('/analytics/export', {
      params,
      responseType: 'blob'
    });
    return response;
  },
};

export default analyticsService;
