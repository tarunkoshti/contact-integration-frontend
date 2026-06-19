import api from './api';

export const gmailService = {
  fetchAccounts() {
    return api.get('/api/admin/gmail-account');
  },
  makePrimary(id) {
    return api.patch(`/api/admin/gmail-account/${id}/primary`);
  }
};
