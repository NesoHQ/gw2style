// utils/auth.js
import apiClient from './apiClient';
import jwt from 'jsonwebtoken';

export const auth = {
  async login(apiKey) {
    // Backend will set HTTP-only cookie with JWT
    const response = await apiClient.post('/api/v1/login', { apiKey });
    
    // Response should contain user data (not the token, as it's in HTTP-only cookie)
    if (response.user) {
      return {
        id: response.user.id || response.user.sub,
        username: response.user.username,
      };
    }
    
    // Fallback: if backend returns token in response body (for backward compatibility)
    // The backend currently returns just the token string directly
    let token = null;
    
    // Check various response formats
    if (typeof response === 'string') {
      token = response; // Token returned directly as string
    } else if (response.token) {
      token = response.token;
    } else if (response.data?.token) {
      token = response.data.token;
    }
    
    if (token) {
      // Clean up token if it's wrapped in quotes
      const cleanToken = typeof token === 'string' && token.startsWith('"') && token.endsWith('"') 
        ? token.slice(1, -1) 
        : token;
      
      try {
        const decoded = jwt.decode(cleanToken);
        if (!decoded || !decoded.sub || !decoded.username) {
          throw new Error('Invalid token received from server');
        }
        
        return {
          id: decoded.sub,
          username: decoded.username,
        };
      } catch (e) {
        console.error('Error decoding token:', e);
        throw new Error('Invalid token format');
      }
    }
    
    throw new Error('No user data received from server');
  },

  async logout() {
    // Call backend logout endpoint to clear HTTP-only cookie
    try {
      await apiClient.post('/api/v1/logout');
    } catch (e) {
      console.error('Logout error:', e);
      // Continue even if backend call fails
    }
  },

  async getCurrentUser() {
    // Since we can't access HTTP-only cookies from JavaScript,
    // we need to call a backend endpoint to verify the session
    console.log('[auth] Calling /api/v1/user/me...');
    try {
      const response = await apiClient.get('/api/v1/user/me');
      console.log('[auth] Response from /api/v1/user/me:', response);
      if (response.user) {
        return {
          id: response.user.id || response.user.sub,
          username: response.user.username,
        };
      }
      return null;
    } catch (e) {
      console.log('[auth] Error from /api/v1/user/me:', e.message);
      // If endpoint doesn't exist yet (404) or user is not authenticated (401), return null
      // This allows the app to work even if backend hasn't been updated yet
      if (e.message.includes('404') || 
          e.message.includes('401') || 
          e.message.includes('Authentication required') ||
          e.message.includes('missing authentication token')) {
        console.log('[auth] User not authenticated, returning null');
        return null;
      }
      console.error('Error checking authentication:', e);
      return null;
    }
  },

  async isAuthenticated() {
    const user = await this.getCurrentUser();
    return user !== null;
  },
};
