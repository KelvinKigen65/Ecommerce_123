/**
 * API service for communicating with Django backend.
 * Centralizes all API calls in one place.
 */

import axios from 'axios';


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://ecommerce-123-ouy4.onrender.com/api";



const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// products API

export const productsAPI = {
  // Get all products with optional filters
  getAll: (params = {}) => api.get('/products/', { params }),

  // Get single product by slug
  getBySlug: (slug) => api.get(`/products/${slug}/`),

  // Get featured products
  getFeatured: () => api.get('/products/featured/'),

  // Get latest products
  getLatest: () => api.get('/products/latest/'),

  // Get products by category
  getByCategory: (categorySlug) =>
    api.get('/products/by_category/', { params: { category: categorySlug } }),

  // Search products
  search: (query) => api.get('/products/', { params: { search: query } }),
};

// categories API

export const categoriesAPI = {
  getAll: () => api.get('/categories/'),
  getBySlug: (slug) => api.get(`/categories/${slug}/`),
};

// cart API
export const cartAPI = {
  getCart: (sessionId) => api.get('/cart/', { params: { session_id: sessionId } }),
  addItem: (productId, quantity = 1) =>
    api.post('/cart/add/', { product_id: productId, quantity }),
  updateItem: (itemId, quantity) =>
    api.patch(`/cart/items/${itemId}/`, { quantity }),
  removeItem: (itemId) => api.delete(`/cart/items/${itemId}/`),
  clearCart: () => api.delete('/cart/clear/'),
};


// orders API

export const ordersAPI = {
  create: (orderData) => api.post('/orders/', orderData),
  getById: (orderId) => api.get(`/orders/${orderId}/`),
  getMyOrders: () => api.get('/orders/my-orders/'),
};

export default api;
