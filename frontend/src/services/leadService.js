import api from './api';

export const leadService = {
  getLeads: async (params = {}) => {
    const response = await api.get('/leads', { params });
    return response.data;
  },

  getLeadById: async (id) => {
    const response = await api.get(`/leads/${id}`);
    return response.data;
  },

  createLead: async (leadData) => {
    const response = await api.post('/leads', leadData);
    return response.data;
  },

  updateLead: async (id, leadData) => {
    const response = await api.put(`/leads/${id}`, leadData);
    return response.data;
  },

  deleteLead: async (id) => {
    const response = await api.delete(`/leads/${id}`);
    return response.data;
  },

  convertToContact: async (id) => {
    const response = await api.post(`/leads/${id}/convert`);
    return response.data;
  },

  getWebhookUrl: async () => {
    const response = await api.get('/leads/webhook-url');
    return response.data;
  },

  bulkCreateLeads: async (leads) => {
    const response = await api.post('/leads/bulk', { leads });
    return response.data;
  },

  getLeadsByStage: async (params = {}) => {
    const response = await api.get('/leads/kanban', { params });
    return response.data;
  },

  updateLeadStage: async (id, lead_status) => {
    const response = await api.patch(`/leads/${id}/stage`, { lead_status });
    return response.data;
  },

  logActivity: async (id, activityData) => {
    const response = await api.post(`/leads/${id}/activity`, activityData);
    return response.data;
  },

  getLeadActivities: async (id, limit = 50) => {
    const response = await api.get(`/leads/${id}/activities`, { params: { limit } });
    return response.data;
  },

  getLeadEmails: async (id) => {
    const response = await api.get(`/leads/${id}/emails`);
    return response.data;
  }
};

export default leadService;
