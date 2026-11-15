import axios from 'axios';
const API_URL = 'https://infieldhub-backend.hostless.app/api';
export const api = axios.create({ baseURL: API_URL, timeout: 20000, headers: { 'Content-Type': 'application/json' } });
export const UPLOADS_URL = 'https://infieldhub-backend.hostless.app/uploads/';

