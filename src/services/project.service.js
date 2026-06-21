import api from './api';

export const projectService = {
  fetchProjects() {
    return api.get('/api/project');
  },
  createProject(payload) {
    return api.post('/api/project', payload);
  }
};

export default projectService;
