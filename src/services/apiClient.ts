import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import useAuthStore from '@/stores/authStore';

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://api.smartstay.vn/v1',
  timeout: 30000,
});

// 1.5 Request interceptor: attach Bearer token from memory (authStore)
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().accessToken;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 1.5 Response interceptor: auto-refresh on 401 & handle 403
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const { setSessionExpired, logout, refreshToken } = useAuthStore.getState();

    // Auto-refresh on 401
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // 1.5 Call refreshToken() from store
        await refreshToken(); 
        
        // 1.5 Retry once with new token
        const newToken = useAuthStore.getState().accessToken;
        if (newToken && originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest); 
        }
      } catch (refreshError) {
        // If refresh fails, we've already set sessionExpired in store
        return Promise.reject(refreshError);
      }
    }

    // 1.5 Redirect to 403 on Permission Denied
    if (error.response?.status === 403) {
      // In a real app, you might use a router navigation, 
      // but inside interceptors window.location is a safe global fallback.
      window.location.href = '/403';
    }

    return Promise.reject(error);
  }
);

export default api;
