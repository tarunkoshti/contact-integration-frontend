import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Plus, Mail, CheckCircle2, ShieldAlert } from 'lucide-react';
import { gmailService } from '../services/gmail.service';
import { projectService } from '../services/project.service';
import CustomSelect from '../components/CustomSelect';
import PageHeader from '../components/PageHeader';
import Table from '../components/Table';
import Button from '../components/Button';
import Loader from '../components/Loader';

export default function GmailAccountsPage() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const processedAuthRef = useRef(null);

  // New state variables for project selection modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState(null);
  const [validationError, setValidationError] = useState('');

  const fetchAccounts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await gmailService.fetchAccounts();
      if (response && response.data) {
        setAccounts(response.data);
      } else {
        setAccounts([]);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to retrieve integrated Gmail accounts.');
      toast.error(err.message || 'Error fetching Gmail accounts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const authStatus = searchParams.get('auth');
    const message = searchParams.get('message') || '';
    const paramKey = `${authStatus}-${message}`;

    if (authStatus) {
      // Avoid double-toast execution during StrictMode mount runs
      if (processedAuthRef.current === paramKey) {
        return;
      }
      processedAuthRef.current = paramKey;

      if (authStatus === 'success') {
        toast.success('Gmail account added successfully!');
      } else if (authStatus === 'error') {
        toast.error(decodeURIComponent(message) || 'Failed to add Gmail account');
      }
      setSearchParams({}, { replace: true });
    } else {
      // Clear ref and load database rows normally when parameters are clean
      processedAuthRef.current = null;
      fetchAccounts();
    }
  }, [searchParams]);

  const handleMakePrimary = async (id, email) => {
    setUpdatingId(id);
    const toastId = toast.loading(`Setting ${email} as primary...`);
    try {
      await gmailService.makePrimary(id);
      toast.success(`${email} is now your primary account!`, { id: toastId });
      await fetchAccounts();
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Failed to update primary account', { id: toastId });
    } finally {
      setUpdatingId(null);
    }
  };

  const openModal = async () => {
    setIsModalOpen(true);
    setModalLoading(true);
    setModalError(null);
    setValidationError('');
    setSelectedProjectId('');
    try {
      const response = await projectService.fetchProjects();
      if (response && response.data) {
        setProjects(response.data);
      } else {
        setProjects([]);
      }
    } catch (err) {
      console.error(err);
      setModalError(err.message || 'Failed to fetch projects.');
    } finally {
      setModalLoading(false);
    }
  };

  const handleContinueAdd = () => {
    if (!selectedProjectId) {
      setValidationError('Please select a project before continuing.');
      return;
    }
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    window.location.href = `${apiUrl}/api/gmail-account/google/login?projectId=${selectedProjectId}`;
  };

  const tableHeaders = ['Gmail Address', 'Project Name', 'Primary Status', 'Actions'];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gmail Accounts"
        subtitle="Manage integrated Gmail accounts and select the primary account for Google Contacts Sync."
        actions={
          <Button
            onClick={openModal}
            icon={Plus}
          >
            Add Gmail Account
          </Button>
        }
      />

      {loading && accounts.length === 0 ? (
        <div className="flex justify-center items-center py-20 bg-white border border-slate-200 rounded-xl shadow-xs">
          <Loader text="Fetching your accounts..." />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white border border-rose-100 rounded-xl text-center space-y-4 shadow-xs">
          <div className="bg-rose-50 p-3 rounded-full text-rose-600 border border-rose-100">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-800">Failed to Load Accounts</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-md">{error}</p>
          </div>
          <Button onClick={fetchAccounts} variant="secondary">
            Try Again
          </Button>
        </div>
      ) : (
        <Table
          headers={tableHeaders}
          emptyState={
            <div className="text-center py-10">
              <Mail className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <p className="text-slate-600 font-medium">No integrated accounts found.</p>
              <p className="text-slate-400 text-xs mt-1">Connect your Google account to get started.</p>
            </div>
          }
        >
          {accounts.map((account) => {
            const isPrimary = account.primary_status === 1;
            return (
              <tr key={account.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="bg-slate-100 p-2 border border-slate-200 rounded-lg text-slate-500">
                      <Mail className="w-4 h-4" />
                    </div>
                    {account.gmail_id}
                  </div>
                </td>

                <td className="px-6 py-4 text-sm text-slate-600 capitalize">
                  {account.project_name || 'N/A'}
                </td>

                <td className="px-6 py-4">
                  {isPrimary ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Primary Account
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                      Standard Account
                    </span>
                  )}
                </td>

                <td className="px-6 py-4">
                  {!isPrimary ? (
                    <Button
                      onClick={() => handleMakePrimary(account.id, account.gmail_id)}
                      variant="secondary"
                      isLoading={updatingId === account.id}
                      disabled={updatingId !== null}
                    >
                      Make Primary
                    </Button>
                  ) : (
                    <span className="text-xs font-medium text-slate-400 italic">
                      Active Primary
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </Table>
      )}
      {/* Project Selection Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 max-w-md w-full transform transition-all">
            <h3 className="text-lg font-bold text-slate-800">Select Project</h3>
            <p className="text-sm text-slate-500 mt-1">
              Select a project to associate with this Gmail account before proceeding.
            </p>

            <div className="mt-4">
              {modalLoading ? (
                <div className="flex items-center gap-2 py-2 text-sm text-slate-500">
                  <span className="animate-spin h-4 w-4 border-2 border-sky-500 border-t-transparent rounded-full" />
                  Loading projects...
                </div>
              ) : modalError ? (
                <div className="text-sm text-rose-600 py-2">{modalError}</div>
              ) : (
                <CustomSelect
                  label="Project"
                  value={selectedProjectId}
                  options={projects}
                  onChange={(val) => {
                    setSelectedProjectId(val);
                    setValidationError('');
                  }}
                  placeholder="-- Select a Project --"
                  error={validationError}
                  required
                />
              )}
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <Button
                variant="secondary"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleContinueAdd}
                disabled={modalLoading || !!modalError}
              >
                Continue
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
