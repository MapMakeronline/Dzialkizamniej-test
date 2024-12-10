import axios from 'axios';
import { useNotificationStore } from '../../store/notificationStore';

// Create axios instance with default config
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 30000,
  withCredentials: true
});

// Add request interceptor for error handling
api.interceptors.request.use(
  (config) => {
    // Add timestamp to prevent caching
    config.params = {
      ...config.params,
      _t: Date.now()
    };
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { addNotification } = useNotificationStore.getState();
    
    let message = 'An unexpected error occurred';
    
    if (axios.isAxiosError(error)) {
      if (!error.response) {
        message = 'Network error - please check your connection';
      } else {
        switch (error.response.status) {
          case 401:
            message = 'Please sign in to continue';
            break;
          case 403:
            message = 'You do not have permission to perform this action';
            break;
          case 404:
            message = 'The requested resource was not found';
            break;
          case 413:
            message = 'The file is too large';
            break;
          case 429:
            message = 'Too many requests - please wait a moment';
            break;
          case 500:
            message = 'Server error - please try again later';
            break;
          default:
            message = error.response.data?.message || message;
        }
      }
    }

    addNotification({
      type: 'error',
      message,
      timeout: 5000
    });

    return Promise.reject(error);
  }
);

// Export configured instance
export default api;