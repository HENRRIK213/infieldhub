import axios from 'axios';
const API_URL = 'http://localhost:5000/api';
export const api = axios.create({ baseURL: API_URL, timeout: 20000, headers: { 'Content-Type': 'application/json' } });
export const UPLOADS_URL = 'http://localhost:5000/uploads/';
