import axios from 'axios';
import { useAuthStore } from '../stores/useAuthStore';
import {
  getRefreshToken,
  removeRefreshToken,
  saveRefreshToken,
} from './authStorage';

const axiosInstance = axios.create({
  baseURL: import.meta.env.DEV ? import.meta.env.VITE_API_BASE_URL : '/api/',
});

// Add a request interceptor to include the access token in headers.
axiosInstance.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a interceptor to handle token refresh on 401 errors.
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response && error.response.status === 401) {
      try {
        console.log(
          'Refreshing token... The error above can be safely ignored.'
        );

        const refreshToken = getRefreshToken();
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // Call refresh token endpoint
        const response = await axios.post<{
          accessToken: string;
          refreshToken: string;
        }>(
          import.meta.env.DEV
            ? import.meta.env.VITE_API_BASE_URL + 'auth/refresh-token'
            : '/api/' + 'auth/refresh-token',
          {
            refreshToken,
          }
        );

        // Save new tokens
        useAuthStore.getState().setAccessToken(response.data.accessToken);
        saveRefreshToken(response.data.refreshToken);

        // Retry the original request with the new access token
        error.config.headers[
          'Authorization'
        ] = `Bearer ${response.data.accessToken}`;
        return axiosInstance(error.config);
      } catch (err) {
        // Token refresh failed. Clear the tokens and redirect to login.
        useAuthStore.getState().clearAccessToken();
        removeRefreshToken();
        window.location.href = '/login';

        console.error('Token refresh failed:', err);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
