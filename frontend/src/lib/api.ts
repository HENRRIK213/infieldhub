import axios from 'axios';

export const BACKEND_URL = (
  process.env.NEXT_PUBLIC_BACKEND_URL || 'https://infieldhub-backend.onrender.com'
).replace(/\/+$/, '');

export const UPLOADS_URL = BACKEND_URL;

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || `${BACKEND_URL}/api`,
  timeout: 30000,
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export function getImageSrc(imageUrl?: string | null): string {
  if (!imageUrl) return '';
  if (/^(data:image\/|https?:\/\/|blob:)/i.test(imageUrl)) return imageUrl;
  return `${UPLOADS_URL}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
}
