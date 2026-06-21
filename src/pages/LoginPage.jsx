import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { User, Lock, LogIn, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import FormInput from '../components/FormInput';
import Button from '../components/Button';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!username.trim()) {
      newErrors.username = 'Username is required';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    const toastId = toast.loading('Signing in...');
    try {
      await login(username.trim(), password);
      toast.success('Signed in successfully!', { id: toastId });
      navigate('/', { replace: true });
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Authentication failed. Please check credentials.', { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full animate-scale-in">
        {/* Header */}
        <div className="flex flex-col items-center mb-8 space-y-3">
          <div className="bg-sky-100 border border-sky-200 p-3 rounded-2xl text-sky-600 shadow-sm animate-bounce-slow">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-wider uppercase text-center">
            Contacts Integrator
          </h1>
          <p className="text-sm text-slate-500 text-center">
            Enter your credentials to access the admin dashboard
          </p>
        </div>

        {/* Form Card */}
        <div className="light-panel rounded-2xl p-8 relative overflow-hidden shadow-md">
          <form onSubmit={handleSubmit} className="space-y-6">
            <FormInput
              label="Username"
              id="username"
              type="text"
              placeholder="Enter admin username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                if (errors.username) {
                  setErrors((prev) => ({ ...prev, username: '' }));
                }
              }}
              error={errors.username}
              required
              icon={User}
            />

            <FormInput
              label="Password"
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) {
                  setErrors((prev) => ({ ...prev, password: '' }));
                }
              }}
              error={errors.password}
              required
              icon={Lock}
            />

            <div className="pt-2">
              <Button
                type="submit"
                isLoading={isSubmitting}
                className="w-full justify-center py-3 text-base font-semibold"
                icon={LogIn}
              >
                Sign In
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
