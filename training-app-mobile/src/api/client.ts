import axios from 'axios';
import Constants from 'expo-constants';
import { getToken } from '../auth/storage';

const API_PORT = 3000;

function resolveApiUrl() {
  const hostUri = Constants.expoConfig?.hostUri;

  if (__DEV__ && hostUri) {
    const host = hostUri.split(':')[0];

    if (!host.includes('exp.direct')) {
      return `http://${host}:${API_PORT}`;
    }
  }

  return process.env.EXPO_PUBLIC_API_URL;
}

export const api = axios.create({
  baseURL: resolveApiUrl(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});