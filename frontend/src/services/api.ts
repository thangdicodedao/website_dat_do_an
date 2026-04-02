import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Track if auth has been cleared (prevents infinite redirect loops)
let authCleared = false;

// Request interceptor - Add auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (!authCleared) {
      const token = localStorage.getItem('auth_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors and token refresh
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Handle 401 - attempt token refresh
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      // If auth already cleared, don't refresh — just reject
      if (authCleared) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        const response = await axios.post(`${BASE_URL}/auth/refresh-token`, { refreshToken });
        const { accessToken } = response.data.data;

        localStorage.setItem('auth_token', accessToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }

        return api(originalRequest);
      } catch {
        // Refresh failed — clear auth and redirect via React Router
        authCleared = true;
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');

        // Use window.location for SPA navigation (triggers React Router redirect)
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

// Reset auth cleared flag (call after successful login)
export const resetAuthCleared = () => {
  authCleared = false;
};

// Mark auth as cleared (call on logout)
export const markAuthCleared = () => {
  authCleared = true;
};

export default api;

// Mock API delay helper (for services still using mock data)
export const mockApi = {
  delay: (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms)),
};

// Helper
export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};
