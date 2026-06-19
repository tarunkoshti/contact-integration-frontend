import axios from 'axios';

const api = axios.create({
  baseURL: 'https://contact-integration-backend-production.up.railway.app',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const message = error.response?.data?.message || error.message || 'An unexpected error occurred';
    const status = error.response?.status;
    return Promise.reject({ message, status, originalError: error });
  }
);

export default api;
