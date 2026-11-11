import axios from 'axios';
import { useAuthStore } from '../stores/authStore';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const { token } = useAuthStore.getState();
    const isPublicAuth = config.url === '/api/v1/auth/login' || config.url === '/api/v1/auth/register';
    if (token && !isPublicAuth && !config.headers.has('Authorization')) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const { token, logout } = useAuthStore.getState();
    if (error.response?.status === 401 && token &&
        error.config?.headers?.get('Authorization') === `Bearer ${token}`) {
      logout();
    }
    return Promise.reject(error);
  }
);

