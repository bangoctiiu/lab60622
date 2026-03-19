import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import useAuthStore from '@/stores/authStore';
import useUIStore from '@/stores/uiStore';

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://api.smartstay.vn/v1',
  timeout: 30000,
});

// 1.5 Request interceptor: attach Bearer token and Building ID
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 1. Auth Token
    const token = useAuthStore.getState().accessToken;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 2. Building Context
    const activeBuildingId = useUIStore.getState().activeBuildingId;
    if (activeBuildingId && config.headers) {
      config.headers['X-Building-Id'] = activeBuildingId.toString();
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
        await refreshToken(); 
        const newToken = useAuthStore.getState().accessToken;
        if (newToken && originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest); 
        }
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    if (error.response?.status === 403) {
      window.location.href = '/403';
    }

    return Promise.reject(error);
  }
);

export default api;
