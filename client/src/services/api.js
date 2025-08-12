import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Products API
export const productsAPI = {
  // Get all products
  getAll: () => api.get('/products'),
  
  // Get a specific product
  getById: (id) => api.get(`/products/${id}`),
  
  // Scrape and add new product
  scrapeProduct: (amazonUrl) => api.post('/products/scrape', { amazonUrl }),
  
  // Update product price
  updatePrice: (id) => api.put(`/products/${id}/price`),
  
  // Delete product
  delete: (id) => api.delete(`/products/${id}`),
};

// Tracking API
export const trackingAPI = {
  // Subscribe to tracking
  subscribe: (email, productId) => api.post('/tracking/subscribe', { email, productId }),
  
  // Get user's tracking subscriptions
  getUserTracking: (email) => api.get(`/tracking/user/${email}`),
  
  // Unsubscribe from tracking
  unsubscribe: (id) => api.put(`/tracking/unsubscribe/${id}`),
  
  // Delete tracking subscription
  delete: (id) => api.delete(`/tracking/${id}`),
  
  // Get all tracking (admin)
  getAll: () => api.get('/tracking'),
};

// Health check
export const healthAPI = {
  check: () => api.get('/health'),
};

export default api; 