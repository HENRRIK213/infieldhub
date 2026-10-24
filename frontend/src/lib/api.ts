import axios from 'axios';

// FORCED HARDCODE: Bypasses all environment variables and Vercel routing
export const api = axios.create({
  baseURL: 'https://infieldhub-backend.onrender.com/api',
  timeout: 30000,
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const UPLOADS_URL = 'https://infieldhub-backend.onrender.com';
export const BACKEND_URL = 'https://infieldhub-backend.onrender.com';
