import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { UserCheck, UserPlus, Phone, User, Briefcase } from 'lucide-react';
import { contactService } from '../services/contact.service';
import { projectService } from '../services/project.service';
import PageHeader from '../components/PageHeader';
import FormInput from '../components/FormInput';
import Button from '../components/Button';
import CustomSelect from '../components/CustomSelect';

export default function CreateContactPage() {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await projectService.fetchProjects();
        if (response && response.data) {
          setProjects(response.data);
        }
      } catch (err) {
        console.error('Failed to load projects:', err);
        toast.error('Failed to load projects. Please try again.');
      }
    };
    fetchProjects();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!selectedProjectId) {
      newErrors.projectId = 'Project selection is required';
    }
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }

    let cleanMobile = mobile.trim();
    if (cleanMobile.startsWith('+91')) {
      cleanMobile = cleanMobile.slice(3);
    }
    cleanMobile = cleanMobile.replace(/\D/g, '');

    if (!cleanMobile) {
      newErrors.mobile = 'Mobile number is required';
    } else if (cleanMobile.length !== 10) {
      newErrors.mobile = 'Please enter a valid 10-digit mobile number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    let cleanMobile = mobile.trim();
    if (cleanMobile.startsWith('+91')) {
      cleanMobile = cleanMobile.slice(3);
    }
    cleanMobile = cleanMobile.replace(/\D/g, '');

    setIsSubmitting(true);
    const toastId = toast.loading('Saving contact to integration server...');
    try {
      await contactService.createContact({
        name: name.trim(),
        mobile: cleanMobile,
        projectId: selectedProjectId,
      });

      toast.success('Contact created successfully!', { id: toastId });
      setName('');
      setMobile('');
      setSelectedProjectId('');
      setErrors({});
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Failed to create contact', { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Contact Form"
        subtitle="When a user submit contact from its contact details automatically saved in the primary connected google account ."
      />

      <div className="max-w-xl mx-auto">
        <div className="light-panel rounded-2xl p-8 relative overflow-hidden">
          <div className="flex items-center gap-4 mb-8">
            <div className="bg-sky-50 border border-sky-100 p-3 rounded-xl text-sky-600">
              <UserPlus className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800 leading-none">Contact Details</h2>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <CustomSelect
              label="Project"
              value={selectedProjectId}
              options={projects}
              onChange={(val) => {
                setSelectedProjectId(val);
                if (errors.projectId) {
                  setErrors((prev) => ({ ...prev, projectId: '' }));
                }
              }}
              placeholder="-- Select a Project --"
              error={errors.projectId}
              required
              icon={Briefcase}
            />

            <FormInput
              label="Contact Name"
              id="name"
              type="text"
              placeholder="e.g. John Doe"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) {
                  setErrors((prev) => ({ ...prev, name: '' }));
                }
              }}
              error={errors.name}
              required
              icon={User}
            />

            <FormInput
              label="Mobile Number"
              id="mobile"
              type="tel"
              placeholder="e.g. 9876543210"
              value={mobile}
              onChange={(e) => {
                setMobile(e.target.value);
                if (errors.mobile) {
                  setErrors((prev) => ({ ...prev, mobile: '' }));
                }
              }}
              error={errors.mobile}
              required
              icon={Phone}
            />

            <div className="pt-2">
              <Button
                type="submit"
                isLoading={isSubmitting}
                className="w-full justify-center py-3 text-base font-semibold"
                icon={UserCheck}
              >
                Save Contact
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
