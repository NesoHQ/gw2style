// utils/postsApi.js
import apiClient from './apiClient';

export const postsApi = {
  async getPosts(page = 1, limit = 25) {
    return apiClient.get(`/api/v1/posts?page=${page}&limit=${limit}`);
  },

  async getPost(id) {
    return apiClient.get(`/api/v1/posts/${id}`);
  },

  async createPost(postData) {
    return apiClient.post('/api/v1/posts/create', postData);
  },

  async deletePost(id) {
    return apiClient.delete(`/api/v1/posts/${id}`);
  },

  async likePost(id) {
    return apiClient.post(`/api/v1/posts/${id}/like`);
  },

  async getPopularPosts(page = 1, limit = 25) {
    return apiClient.get(`/api/v1/posts/popular?page=${page}&limit=${limit}`);
  },

  async searchPosts(query, page = 1, limit = 25) {
    return apiClient.get(`/api/v1/posts/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
  },

  async getLikedPosts() {
    return apiClient.get('/api/v1/user/liked-posts');
  },

  async getSkins() {
    return apiClient.get('/api/v1/skins');
  },
};
