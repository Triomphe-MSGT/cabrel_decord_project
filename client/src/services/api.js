import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 15000, // 15 seconds timeout
});

// Add request interceptor to show loading state if needed
api.interceptors.request.use((config) => {
  // You could add loading indicators here if desired
  return config;
});

// Add response interceptor to handle timeout errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ERR_TIMEOUT') {
      // Return a custom error for timeout
      return Promise.reject(
        new Error('La requête a expiré. Veuillez vérifier votre connexion et réessayer.')
      );
    }
    return Promise.reject(error);
  }
);

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
  login: (email, password) => api.post('/cdm/login', { email, password }),
  getProfile: () => api.get('/cdm/profile'),
  updateProfile: (data) => api.put('/cdm/profile', data),
  getContact: () => api.get('/cdm/contact'),
  updateContact: (data) => api.put('/cdm/contact', data),
  getStats: () => api.get('/cdm/stats'),
};

export const settingsApi = {
  getContact: () => api.get('/settings/contact'),
};

export const uploadApi = {
  upload: (file, folder = 'misc') => {
    const form = new FormData();
    form.append('image', file);
    form.append('folder', folder);
    return api.post('/cdm/upload', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 60000, // 60 seconds timeout for uploads
    });
  },
};

export default api;
