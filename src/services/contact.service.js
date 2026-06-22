import api from './api';

export const contactService = {
  createContact(payload) {
    return api.post('/api/contact/save-contact', payload);
  }
};
