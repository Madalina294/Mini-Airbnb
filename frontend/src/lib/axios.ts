import axios from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosError } from 'axios';
import { useAuthStore } from '../features/auth/stores/useAuthStore';

// Base URL pentru API Gateway
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Crearea instanței Axios
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 secunde
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor - Adaugă token-ul automat
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Obține token-ul din store (fără hook, direct din store)
    const token = useAuthStore.getState().token;

    // Dacă există token, adaugă-l în header
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor - Gestionează erorile globale
axiosInstance.interceptors.response.use(
  (response) => {
    // Returnează doar data (nu întregul response object)
    return response.data;
  },
  (error: AxiosError) => {
    // Gestionează erorile de autentificare
    if (error.response?.status === 401) {
      // Token invalid sau expirat - șterge autentificarea
      useAuthStore.getState().clearAuth();
      
      // Opțional: redirect către login
      window.location.href = '/login';
    }

    // Propagă eroarea pentru a fi gestionată în componente
    return Promise.reject(error);
  }
);

export default axiosInstance;