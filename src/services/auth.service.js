import api from './api';

export const authService = {
  login(payload) {
    return api.post('/api/auth/login', payload);
  },
  logout() {
    return api.post('/api/auth/logout');
  },
  getMe() {
    return api.get('/api/auth/me');
  }
};
export default authService;
