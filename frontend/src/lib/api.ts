import axios from 'axios';

// ABSOLUTE HARDCODE: Force the frontend to always hit the Render backend
const API_URL = 'https://infieldhub-backend.onrender.com/api';
const BACKEND_URL = 'https://infieldhub-backend.onrender.com';

export const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const UPLOADS_URL = BACKEND_URL;
export const BACKEND_URL = BACKEND_URL;
