// utils/auth.js
import apiClient from './apiClient';
import jwt from 'jsonwebtoken';

export const auth = {
  async login(apiKey) {
    const response = await apiClient.post('/api/v1/login', { apiKey });
    const token = response.token || response.data?.token || response;
    
    // Clean up token if it's wrapped in quotes
    const cleanToken = typeof token === 'string' && token.startsWith('"') && token.endsWith('"') 
      ? token.slice(1, -1) 
      : token;
    
    if (cleanToken) {
      apiClient.setToken(cleanToken);
      const decoded = jwt.decode(cleanToken);
      
      if (!decoded || !decoded.sub || !decoded.username) {
        throw new Error('Invalid token received from server');
      }
      
      return {
        id: decoded.sub,
        username: decoded.username,
      };
    }
    
    throw new Error('No token received');
  },

  async logout() {
    apiClient.clearToken();
    // Optionally call backend logout endpoint
    try {
      await apiClient.post('/api/v1/logout');
    } catch (e) {
      // Ignore errors on logout
      console.error('Logout error:', e);
    }
  },

  getCurrentUser() {
    const token = apiClient.getToken();
    if (!token) return null;
    
    try {
      const decoded = jwt.decode(token);
      if (!decoded || !decoded.exp) return null;
      
      // Check if token is expired
      if (decoded.exp * 1000 < Date.now()) {
        apiClient.clearToken();
        return null;
      }
      
      return {
        id: decoded.sub,
        username: decoded.username,
      };
    } catch (e) {
      console.error('Error decoding token:', e);
      return null;
    }
  },

  isAuthenticated() {
    return this.getCurrentUser() !== null;
  },
};
