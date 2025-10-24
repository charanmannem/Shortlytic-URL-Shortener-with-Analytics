import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Set base URL
axios.defaults.baseURL = API_URL;

// Add token to all requests
const token = localStorage.getItem('token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export const urlService = {
  createUrl: (data) => axios.post('/urls/shorten', data),
  bulkCreateUrls: (urls) => axios.post('/urls/bulk', { urls }),
  getUserUrls: (page = 1, limit = 10) => axios.get(`/urls?page=${page}&limit=${limit}`),
  getUrlDetails: (shortCode) => axios.get(`/urls/${shortCode}`),
  updateUrl: (id, data) => axios.put(`/urls/${id}`, data),
  deleteUrl: (id) => axios.delete(`/urls/${id}`),
  getQRCode: (shortCode) => axios.get(`/urls/${shortCode}/qr`)
};

export const analyticsService = {
  getDashboardStats: () => axios.get('/analytics/dashboard'),
  getUrlAnalytics: (urlId, days = 30) => axios.get(`/analytics/${urlId}?days=${days}`),
  exportAnalytics: (urlId) => axios.get(`/analytics/${urlId}/export`, { responseType: 'blob' })
};

export const adminService = {
  getSystemStats: () => axios.get('/admin/stats'),
  getAllUsers: (page = 1, limit = 20) => axios.get(`/admin/users?page=${page}&limit=${limit}`),
  getAllUrls: (page = 1, limit = 20) => axios.get(`/admin/urls?page=${page}&limit=${limit}`),
  deleteUrl: (id) => axios.delete(`/admin/urls/${id}`),
  updateUserRole: (id, data) => axios.put(`/admin/users/${id}/role`, data)
};