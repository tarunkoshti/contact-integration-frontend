import api from './api';

export const projectService = {
  fetchProjects() {
    return api.get('/api/project');
  }
};
