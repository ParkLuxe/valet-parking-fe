/**
 * Axios API configuration
 * Base API service with JWT interceptor and error handling
 */

import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { API_BASE_URL, STORAGE_KEYS } from '../utils/constants';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add JWT token to requests
api.interceptors.request.use(
  (config) => {
    // Get token from local storage
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    
    // If token exists, add it to request headers
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle common errors and token refresh
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Return successful response
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
    
    // If error is 401 (Unauthorized) and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh token
        const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
        
        if (refreshToken) {
          // Call the refresh token endpoint
          const response = await axios.post(`${API_BASE_URL}/v1/auth/refresh-token`, {
            refreshToken,
          });
          
          const { token, refreshToken: newRefreshToken } = response.data;
          
          // Store new tokens
          localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
          if (newRefreshToken) {
            localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);
          }
          
          // Retry original request with new token
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return api(originalRequest);
        } else {
          // No refresh token, logout user
          localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
          localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
          localStorage.removeItem(STORAGE_KEYS.USER_DATA);
          window.location.href = '/login';
        }
      } catch (refreshError) {
        // Refresh token failed, logout user
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER_DATA);
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    // Handle other errors
    if (error.response) {
      // Server responded with error status
      console.error('API Error:', error.response.data);
      return Promise.reject(error.response.data);
    } else if (error.request) {
      // Request made but no response received
      console.error('Network Error:', error.request);
      return Promise.reject({
        message: 'Network error. Please check your internet connection.',
      });
    } else {
      // Something else happened
      console.error('Error:', error.message);
      return Promise.reject({
        message: error.message || 'An unexpected error occurred',
      });
    }
  }
);

// API helper methods
export const apiHelper = {
  /**
   * GET request
   */
  get: async <T = any>(url: string, config: AxiosRequestConfig = {}): Promise<T> => {
    try {
      const response = await api.get<T>(url, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * POST request
   */
  post: async <T = any>(url: string, data: any = {}, config: AxiosRequestConfig = {}): Promise<T> => {
    try {
      const response = await api.post<T>(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * PUT request
   */
  put: async <T = any>(url: string, data: any = {}, config: AxiosRequestConfig = {}): Promise<T> => {
    try {
      const response = await api.put<T>(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * PATCH request
   */
  patch: async <T = any>(url: string, data: any = {}, config: AxiosRequestConfig = {}): Promise<T> => {
    try {
      const response = await api.patch<T>(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * DELETE request
   */
  delete: async <T = any>(url: string, config: AxiosRequestConfig = {}): Promise<T> => {
    try {
      const response = await api.delete<T>(url, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default api;
