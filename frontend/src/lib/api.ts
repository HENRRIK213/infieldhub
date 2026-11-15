import axios from 'axios';

// Use the deployed backend URL, fallback to local for development
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const api = axios.create({ 
  baseURL: API_URL, 
  timeout: 20000, 
  headers: { 'Content-Type': 'application/json' } 
});

// Extract the base backend URL (without /api) for image uploads
const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_API_URL 
  ? process.env.NEXT_PUBLIC_API_URL.replace('/api', '') 
  : 'http://localhost:5000';

export const UPLOADS_URL = `${BACKEND_BASE_URL}/uploads/`;

// 🟢 ADDED THIS FUNCTION: It safely resolves image URLs
export const getImageSrc = (url: string | undefined | null) => {
  if (!url) return 'https://placehold.co/600x400?text=No+Image';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) return url;
  if (url.startsWith('/')) return url;
  return `${UPLOADS_URL}${url}`;
};
