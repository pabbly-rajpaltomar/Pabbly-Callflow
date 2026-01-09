import api from './api';

export const callService = {
  createCall: async (callData) => {
    const response = await api.post('/calls', callData);
    return response.data;
  },

  getCalls: async () => {
    const response = await api.get('/calls');
    return response.data;
  },

  uploadRecording: async (callId, file) => {
    const formData = new FormData();
    formData.append('recording', {
      uri: file.uri,
      type: 'audio/m4a',
      name: file.name,
    });

    const response = await api.post(`/calls/${callId}/recording`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export default callService;
