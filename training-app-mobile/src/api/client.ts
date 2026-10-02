import axios from 'axios';
import { getToken } from '../auth/storage';

const API_URL = 'http://10.41.6.111:3000';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Antes de cada petición, si hay un token guardado, lo agrega automáticamente
api.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});