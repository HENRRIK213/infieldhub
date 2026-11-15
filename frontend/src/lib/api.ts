import axios from 'axios';

// Your exact live backend URL
const BACKEND_BASE = 'https://infieldhub-backend.hostless.app';

// Exports for API calls and images
export const API_URL = `${BACKEND_BASE}/api`;
export const BACKEND_URL = BACKEND_BASE;
export const UPLOADS_URL = `${BACKEND_BASE}/uploads/`;

// Axios instance
export const api = axios.create({ 
  baseURL: API_URL, 
  timeout: 20000, 
  headers: { 'Content-Type': 'application/json' } 
});

// Image helper
export const getImageSrc = (url: string | undefined | null) => {
  if (!url) return 'https://placehold.co/600x400?text=No+Image';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) return url;
  if (url.startsWith('/')) return url;
  return `${UPLOADS_URL}${url}`;
};
