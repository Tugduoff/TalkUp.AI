import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;

// Set axios instance base URL
const axiosInstance = axios.create({
  baseURL: BASE_URL || 'http://localhost:8080',
});

// Set default headers
axiosInstance.defaults.headers.common['Content-Type'] = 'application/json';
axiosInstance.defaults.headers.common['Accept'] = 'application/json';

// Add a request interceptor
axiosInstance.interceptors.request.use(
  async (config) => {
    const idToken = localStorage.getItem('idToken');

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

export default axiosInstance;
