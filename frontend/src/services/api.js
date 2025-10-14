/**
 * API service for communicating with Django backend.
 * Centralizes all API calls in one place.
 */

import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Products API
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
  getByCategory: (categorySlug) => api.get('/products/by_category/', {
    params: { category: categorySlug }
  }),
  
  // Search products
  search: (query) => api.get('/products/', {
    params: { search: query }
  }),
};

// Categories API
export const categoriesAPI = {
  // Get all categories
  getAll: () => api.get('/categories/'),
  
  // Get single category by slug
  getBySlug: (slug) => api.get(`/categories/${slug}/`),
};

// Cart API (to be implemented with backend)
export const cartAPI = {
  // Get cart
  getCart: (sessionId) => api.get('/cart/', {
    params: { session_id: sessionId }
  }),
  
  // Add item to cart
  addItem: (productId, quantity = 1) => api.post('/cart/add/', {
    product_id: productId,
    quantity
  }),
  
  // Update cart item
  updateItem: (itemId, quantity) => api.patch(`/cart/items/${itemId}/`, {
    quantity
  }),
  
  // Remove item from cart
  removeItem: (itemId) => api.delete(`/cart/items/${itemId}/`),
  
  // Clear cart
  clearCart: () => api.delete('/cart/clear/'),
};

// Orders API
export const ordersAPI = {
  // Create order
  create: (orderData) => api.post('/orders/', orderData),
  
  // Get order by ID
  getById: (orderId) => api.get(`/orders/${orderId}/`),
  
  // Get user orders
  getMyOrders: () => api.get('/orders/my-orders/'),
};

export default api;