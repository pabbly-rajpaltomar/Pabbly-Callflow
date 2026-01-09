import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.success) {
      await AsyncStorage.setItem('token', response.data.data.token);
      await AsyncStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  logout: async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
  },

  getCurrentUser: async () => {
    const userStr = await AsyncStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated: async () => {
    const token = await AsyncStorage.getItem('token');
    return !!token;
  },
};

export default authService;
