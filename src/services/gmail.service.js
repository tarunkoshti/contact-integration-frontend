import api from './api';

export const gmailService = {
  fetchAccounts() {
    return api.get('/api/gmail-account');
  },
  makePrimary(id) {
    return api.patch(`/api/gmail-account/${id}/primary`);
  }
};
