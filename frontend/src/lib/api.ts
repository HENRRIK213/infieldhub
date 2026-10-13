import axios from 'axios';

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Auto-logout only for ADMIN/EMPLOYEE 401s, not customer requests
    const isCustomerRoute = error.config?.url?.includes('/customers/');
    if (
      typeof window !== 'undefined' &&
      error.response?.status === 401 &&
      !isCustomerRoute &&
      !window.location.pathname.startsWith('/login') &&
      !window.location.pathname.startsWith('/customer')
    ) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const UPLOADS_URL = BACKEND;
export const BACKEND_URL = BACKEND;