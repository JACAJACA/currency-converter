import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000',
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use((config) => {
    const token = sessionStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

api.interceptors.response.use(
  (response) => response,
  async function (error) {
    const originalRequest = error.config;

    if (error.response?.status === 403 && !originalRequest._retry) {
      console.warn('Access token expired - refresh...');

      originalRequest._retry = true;
      const refreshToken = sessionStorage.getItem('refresh_token');

      if (!refreshToken) {
        console.error('No refresh token - logout');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        const response = await api.post('/refresh-token', { refreshToken });
        const { accessToken, refreshToken: newRefreshToken } = response.data;

        sessionStorage.setItem('token', accessToken);
        sessionStorage.setItem('refresh_token', newRefreshToken);

        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh error:', refreshError);
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
