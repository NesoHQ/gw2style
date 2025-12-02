// utils/apiClient.js
class APIClient {
  constructor(baseURL) {
    this.baseURL = baseURL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include', // Include cookies
    };

    // Add auth token if available
    const token = this.getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        let error;
        try {
          error = await response.json();
        } catch (e) {
          error = { message: `Request failed with status ${response.status}` };
        }
        
        // Handle specific status codes
        if (response.status === 401) {
          this.clearToken();
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
          throw new Error('Authentication required');
        }
        
        throw new Error(error.message || error.error || `Request failed with status ${response.status}`);
      }

      return response.json();
    } catch (error) {
      // Network error or other fetch failure
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Unable to connect to server. Please check your internet connection.');
      }
      throw error;
    }
  }

  getToken() {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('jwt_token');
  }

  setToken(token) {
    if (typeof window === 'undefined') return;
    localStorage.setItem('jwt_token', token);
  }

  clearToken() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('jwt_token');
  }

  // Cache management
  getCacheKey(endpoint, options = {}) {
    return `${endpoint}_${JSON.stringify(options)}`;
  }

  getFromCache(key) {
    const cached = this.cache.get(key);
    if (!cached) return null;
    
    const now = Date.now();
    if (now - cached.timestamp > this.cacheTimeout) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.data;
  }

  setCache(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  clearCache() {
    this.cache.clear();
  }

  // Convenience methods
  async get(endpoint, options = {}) {
    // Check cache for GET requests
    const cacheKey = this.getCacheKey(endpoint, options);
    const cached = this.getFromCache(cacheKey);
    if (cached) {
      return cached;
    }

    const data = await this.request(endpoint, { ...options, method: 'GET' });
    this.setCache(cacheKey, data);
    return data;
  }

  async post(endpoint, data, options = {}) {
    const result = await this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
    // Clear cache on mutations
    this.clearCache();
    return result;
  }

  async put(endpoint, data, options = {}) {
    const result = await this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
    // Clear cache on mutations
    this.clearCache();
    return result;
  }

  async delete(endpoint, options = {}) {
    const result = await this.request(endpoint, { ...options, method: 'DELETE' });
    // Clear cache on mutations
    this.clearCache();
    return result;
  }
}

export default new APIClient();
