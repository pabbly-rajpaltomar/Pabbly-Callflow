import api from './api';

export const contactService = {
  getContacts: async (params = {}) => {
    const response = await api.get('/contacts', { params });
    return response.data;
  },

  getContactById: async (id) => {
    const response = await api.get(`/contacts/${id}`);
    return response.data;
  },

  createContact: async (contactData) => {
    const response = await api.post('/contacts', contactData);
    return response.data;
  },

  updateContact: async (id, contactData) => {
    const response = await api.put(`/contacts/${id}`, contactData);
    return response.data;
  },

  deleteContact: async (id) => {
    const response = await api.delete(`/contacts/${id}`);
    return response.data;
  },

  bulkCreateContacts: async (contacts) => {
    const response = await api.post('/contacts/bulk', { contacts });
    return response.data;
  },
};

export default contactService;
