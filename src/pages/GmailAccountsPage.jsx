import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Plus, Mail, CheckCircle2, ShieldAlert } from 'lucide-react';
import { gmailService } from '../services/gmail.service';
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
    if (authStatus === 'success') {
      toast.success('Gmail account added successfully!');
      setSearchParams({}, { replace: true });
    } else if (authStatus === 'error') {
      const errorMsg = searchParams.get('message') || 'Failed to add Gmail account';
      toast.error(decodeURIComponent(errorMsg));
      setSearchParams({}, { replace: true });
    } else {
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

  const handleAddAccount = () => {
    window.location.href = 'https://contact-integration-backend-production.up.railway.app/api/admin/gmail-account/google/login';
  };

  const tableHeaders = ['Gmail Address', 'Primary Status', 'Actions'];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gmail Accounts"
        subtitle="Manage integrated Gmail accounts and select the primary account for Google Contacts Sync."
        actions={
          <Button
            onClick={handleAddAccount}
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
    </div>
  );
}
