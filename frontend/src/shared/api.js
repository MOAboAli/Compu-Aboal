const API_BASE = import.meta.env.VITE_API_URL || '/api';

function getToken() {
  return localStorage.getItem('token') || '';
}

export async function api(path, options = {}) {
  const headers = {
    ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
    ...(options.headers || {}),
  };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    body:
      options.body && !(options.body instanceof FormData)
        ? JSON.stringify(options.body)
        : options.body,
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || `Request failed (${response.status})`);
  }
  return data;
}

export const authApi = {
  login: (body) => api('/auth/login', { method: 'POST', body }),
  register: (body) => api('/auth/register', { method: 'POST', body }),
  me: () => api('/auth/me'),
  verify: (body) => api('/auth/verify', { method: 'POST', body }),
  forgotPassword: (body) => api('/auth/forgot-password', { method: 'POST', body }),
  resetPassword: (body) => api('/auth/reset-password', { method: 'POST', body }),
};

export const catalogApi = {
  categories: () => api('/categories'),
  products: (query = '') => api(`/products${query}`),
  product: (id) => api(`/products/${id}`),
  services: () => api('/services'),
  serviceOfferings: () => api('/services/offerings'),
  cms: () => api('/cms'),
};

export const commerceApi = {
  getCart: () => api('/cart'),
  addToCart: (body) => api('/cart/items', { method: 'POST', body }),
  updateCartItem: (id, body) => api(`/cart/items/${id}`, { method: 'PUT', body }),
  removeCartItem: (id) => api(`/cart/items/${id}`, { method: 'DELETE' }),
  wishlist: () => api('/wishlist'),
  addWishlist: (body) => api('/wishlist', { method: 'POST', body }),
  removeWishlist: (id) => api(`/wishlist/${id}`, { method: 'DELETE' }),
  checkout: (body) => api('/orders/checkout', { method: 'POST', body }),
  pay: (orderId, body) => api(`/orders/${orderId}/pay`, { method: 'POST', body }),
  orders: () => api('/orders/mine'),
  order: (id) => api(`/orders/${id}`),
  paymentMethods: () => api('/payments/methods'),
};

export const serviceRequestApi = {
  create: (body) => api('/service-requests', { method: 'POST', body }),
  mine: () => api('/service-requests/mine'),
  get: (id) => api(`/service-requests/${id}`),
};

export const adminApi = {
  dashboard: () => api('/admin/dashboard'),
  users: () => api('/users'),
  createUser: (body) => api('/users', { method: 'POST', body }),
  updateUser: (id, body) => api(`/users/${id}`, { method: 'PUT', body }),
  products: () => api('/products?all=1'),
  saveProduct: (id, body) =>
    id ? api(`/products/${id}`, { method: 'PUT', body }) : api('/products', { method: 'POST', body }),
  deleteProduct: (id) => api(`/products/${id}`, { method: 'DELETE' }),
  categories: () => api('/categories?all=1'),
  saveCategory: (id, body) =>
    id ? api(`/categories/${id}`, { method: 'PUT', body }) : api('/categories', { method: 'POST', body }),
  orders: () => api('/orders'),
  updateOrder: (id, body) => api(`/orders/${id}/status`, { method: 'PATCH', body }),
  serviceRequests: () => api('/service-requests'),
  updateServiceRequest: (id, body) =>
    api(`/service-requests/${id}/status`, { method: 'PATCH', body }),
  cmsSave: (body) => api('/cms', { method: 'PUT', body }),
  reports: (type) => api(`/reports/${type}`),
  exportReport: (type, format) => api(`/reports/${type}/export?format=${format}`),
  audit: (query = '') => api(`/audit${query}`),
  backups: () => api('/backups'),
  runBackup: () => api('/backups/run', { method: 'POST' }),
  restoreBackup: (id) => api(`/backups/${id}/restore`, { method: 'POST' }),
  paymentMethodsAdmin: () => api('/payments/methods?all=1'),
  savePaymentMethod: (id, body) =>
    id
      ? api(`/payments/methods/${id}`, { method: 'PUT', body })
      : api('/payments/methods', { method: 'POST', body }),
};
