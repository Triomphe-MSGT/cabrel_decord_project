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

export const adminApi = {
  login: (password) => api.post('/admin/login', { password }),
  getStats: () => api.get('/admin/stats'),
};

export default api;
