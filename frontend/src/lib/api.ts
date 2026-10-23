import axios from 'axios';

// HARDCODED FALLBACK: Guarantees the frontend always hits the live backend
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://infieldhub-backend.onrender.com/api';
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://infieldhub-backend.onrender.com';

export const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  config.headers['ngrok-skip-browser-warning'] = 'true';
  config.headers['bypass-tunnel-reminder'] = 'true';
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
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

export const UPLOADS_URL = BACKEND_URL;
export const BACKEND_URL = BACKEND_URL;
