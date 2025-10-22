import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

export const urlService = {
  createUrl: (data) => axios.post(`${API_URL}/urls/shorten`, data),
  bulkCreateUrls: (urls) => axios.post(`${API_URL}/urls/bulk`, { urls }),
  getUserUrls: (page = 1, limit = 10) => axios.get(`${API_URL}/urls?page=${page}&limit=${limit}`),
  getUrlDetails: (shortCode) => axios.get(`${API_URL}/urls/${shortCode}`),
  updateUrl: (id, data) => axios.put(`${API_URL}/urls/${id}`, data),
  deleteUrl: (id) => axios.delete(`${API_URL}/urls/${id}`),
  getQRCode: (shortCode) => axios.get(`${API_URL}/urls/${shortCode}/qr`)
};

export const analyticsService = {
  getDashboardStats: () => axios.get(`${API_URL}/analytics/dashboard`),
  getUrlAnalytics: (urlId, days = 30) => axios.get(`${API_URL}/analytics/${urlId}?days=${days}`),
  exportAnalytics: (urlId) => axios.get(`${API_URL}/analytics/${urlId}/export`, { responseType: 'blob' })
};

export const adminService = {
  getSystemStats: () => axios.get(`${API_URL}/admin/stats`),
  getAllUsers: (page = 1, limit = 20) => axios.get(`${API_URL}/admin/users?page=${page}&limit=${limit}`),
  getAllUrls: (page = 1, limit = 20) => axios.get(`${API_URL}/admin/urls?page=${page}&limit=${limit}`),
  deleteUrl: (id) => axios.delete(`${API_URL}/admin/urls/${id}`),
  updateUserRole: (id, data) => axios.put(`${API_URL}/admin/users/${id}/role`, data)
};