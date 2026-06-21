import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { FolderPlus, Folder, Plus } from 'lucide-react';
import { projectService } from '../services/project.service';
import PageHeader from '../components/PageHeader';
import FormInput from '../components/FormInput';
import Button from '../components/Button';
import Table from '../components/Table';
import Loader from '../components/Loader';

export default function CreateProjectPage() {
  const [projectName, setProjectName] = useState('');
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fetchProjects = async () => {
    setLoadingProjects(true);
    try {
      const response = await projectService.fetchProjects();
      if (response && response.data) {
        setProjects(response.data);
      }
    } catch (err) {
      console.error('Failed to load projects:', err);
      toast.error('Failed to load projects. Please refresh the page.');
    } finally {
      setLoadingProjects(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedName = projectName.trim();

    if (!trimmedName) {
      setError('Project name is required');
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading('Creating project...');
    try {
      await projectService.createProject({ projectName: trimmedName });
      toast.success('Project created successfully!', { id: toastId });
      setProjectName('');
      setError('');
      // Reload projects list to show the new one
      await fetchProjects();
    } catch (err) {
      console.error('Failed to create project:', err);
      toast.error(err.message || 'Failed to create project', { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const tableHeaders = ['Project ID', 'Project Name'];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Projects"
        subtitle="Create new projects to organize your Gmail integration and contacts routing."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Form */}
        <div className="lg:col-span-1">
          <div className="light-panel rounded-2xl p-6 relative overflow-hidden">
            <div className="flex items-center gap-3.5 mb-6">
              <div className="bg-sky-50 border border-sky-100 p-2.5 rounded-xl text-sky-600">
                <FolderPlus className="w-5.5 h-5.5" />
              </div>
              <h2 className="text-base font-bold text-slate-800">New Project</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <FormInput
                label="Project Name"
                id="projectName"
                type="text"
                placeholder="e.g. Acme Marketing"
                value={projectName}
                onChange={(e) => {
                  setProjectName(e.target.value);
                  if (error) setError('');
                }}
                error={error}
                required
                icon={Folder}
              />

              <div className="pt-1">
                <Button
                  type="submit"
                  isLoading={isSubmitting}
                  className="w-full justify-center py-2.5 text-sm font-semibold"
                  icon={Plus}
                >
                  Create Project
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Projects List */}
        <div className="lg:col-span-2">
          <div className="light-panel rounded-2xl p-6 relative overflow-hidden">
            <h3 className="text-base font-bold text-slate-800 mb-4">Existing Projects</h3>

            {loadingProjects ? (
              <div className="flex justify-center items-center py-12">
                <Loader text="Fetching projects list..." />
              </div>
            ) : (
              <Table
                headers={tableHeaders}
                emptyState={
                  projects.length === 0 ? (
                    <div className="text-center py-8">
                      <Folder className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                      <p className="text-slate-600 text-sm font-medium">No projects found.</p>
                      <p className="text-slate-400 text-xs mt-0.5">Add a project using the form on the left.</p>
                    </div>
                  ) : null
                }
              >
                {projects.map((project) => (
                  <tr key={project.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-3.5 text-sm text-slate-500 font-mono">
                      #{project.id}
                    </td>
                    <td className="px-6 py-3.5 text-sm font-medium text-slate-800 capitalize">
                      {project.project_name}
                    </td>
                  </tr>
                ))}
              </Table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
