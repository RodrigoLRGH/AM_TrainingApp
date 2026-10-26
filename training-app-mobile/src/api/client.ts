import axios, { isAxiosError } from 'axios';
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

let onUnauthorized: ((message?: string) => void) | null = null;

export function setUnauthorizedHandler(handler: ((message?: string) => void) | null) {
  onUnauthorized = handler;
}

type ErrorBody = {
  message?: string | string[];
};

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (
      isAxiosError<ErrorBody>(error) &&
      error.response?.status === 401 &&
      !!error.config?.headers?.Authorization
    ) {
      const message = error.response.data?.message;
      onUnauthorized?.(typeof message === 'string' ? message : undefined);

      return new Promise<never>(() => { });
    }

    return Promise.reject(error);
  },
);