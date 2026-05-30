import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
};

export const productsApi = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  search: (q, params) => api.get('/products/search', { params: { q, ...params } }),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  remove: (id) => api.delete(`/products/${id}`),
};

export const commentsApi = {
  getByProduct: (produitId) => api.get(`/comments/${produitId}`),
  create: (data) => api.post('/comments', data),
  getPending: () => api.get('/comments/pending'),
  validate: (id) => api.put(`/comments/${id}/validate`),
  remove: (id) => api.delete(`/comments/${id}`),
};

export const heroApi = {
  getPublic: () => api.get('/hero'),
  getAll: () => api.get('/hero/all'),
  create: (data) => api.post('/hero', data),
  update: (id, data) => api.put(`/hero/${id}`, data),
  remove: (id) => api.delete(`/hero/${id}`),
};

export const featuredApi = {
  getPublic: () => api.get('/featured'),
  getAdmin: () => api.get('/featured/admin'),
  updateSection: (data) => api.put('/featured/section', data),
  updateProducts: (items) => api.put('/featured/products', { items }),
};

export const adminApi = {
  login: (email, password) => api.post('/admin/login', { email, password }),
  getProfile: () => api.get('/admin/profile'),
  updateProfile: (data) => api.put('/admin/profile', data),
  getContact: () => api.get('/admin/contact'),
  updateContact: (data) => api.put('/admin/contact', data),
  getStats: () => api.get('/admin/stats'),
};

export const settingsApi = {
  getContact: () => api.get('/settings/contact'),
};

export const uploadApi = {
  upload: (file, folder = 'misc') => {
    const form = new FormData();
    form.append('image', file);
    form.append('folder', folder);
    return api.post('/admin/upload', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

export default api;
