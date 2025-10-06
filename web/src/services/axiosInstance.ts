import axios from 'axios';

import { API_BASE_URL } from '../config/env';
import { API_ROUTES } from './api';

// Set axios instance base URL (dynamically determined based on environment)
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

// Set default headers
axiosInstance.defaults.headers.common['Content-Type'] = 'application/json';
axiosInstance.defaults.headers.common['Accept'] = 'application/json';

// Add a request interceptor
axiosInstance.interceptors.request.use(
  async (config) => {
    const idToken = localStorage.getItem('idToken');
    const isAuthRoute = [
      `${API_ROUTES.auth}/login`,
      `${API_ROUTES.auth}/register`,
    ].some((route) => config.url?.includes(route));

    if (isAuthRoute) return config;

    if (idToken) {
      config.headers.Authorization = `Bearer ${idToken}`;
    } else {
      console.warn('No token found. Redirecting to login...');
      window.location.href = '/login';
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Add a response interceptor for handling 401 errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('idToken');
      console.warn('Token expired or invalid. Redirecting to login...');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
