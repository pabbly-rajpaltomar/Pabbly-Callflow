import api from './api';

export const callService = {
  getCalls: async (params = {}) => {
    const response = await api.get('/calls', { params });
    return response.data;
  },

  getCallById: async (id) => {
    const response = await api.get(`/calls/${id}`);
    return response.data;
  },

  createCall: async (callData) => {
    const response = await api.post('/calls', callData);
    return response.data;
  },

  updateCall: async (id, callData) => {
    const response = await api.put(`/calls/${id}`, callData);
    return response.data;
  },

  deleteCall: async (id) => {
    const response = await api.delete(`/calls/${id}`);
    return response.data;
  },

  uploadRecording: async (id, formData) => {
    const response = await api.post(`/calls/${id}/recording`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  initiateCall: async (phoneNumber, contactId = null) => {
    const response = await api.post('/calls/initiate', {
      phone_number: phoneNumber,
      contact_id: contactId
    });
    return response.data;
  },

  endCall: async (callId) => {
    const response = await api.post(`/calls/${callId}/end`);
    return response.data;
  },
};

export default callService;
