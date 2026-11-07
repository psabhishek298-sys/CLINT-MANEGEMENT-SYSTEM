import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ArrowRight, ShieldCheck, Sparkles, AlertCircle, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Modal from '../components/ui/Modal';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [formError, setFormError] = useState('');

  const { login, loading, error, clearError, resetPassword } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    clearError();

    if (!email) {
      setFormError('Please enter your email address');
      return;
    }
    if (!password) {
      setFormError('Please enter your password');
      return;
    }

    try {
      await login(email, password);
      navigate('/');
    } catch {
      // error handled in AuthContext
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    try {
      await resetPassword(forgotEmail);
      setResetSent(true);
      setTimeout(() => {
        setForgotModalOpen(false);
        setResetSent(false);
        setForgotEmail('');
      }, 2500);
    } catch {
      // handled
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-gray-50 via-gray-100 to-emerald-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-emerald-950/20">
      <div className="w-full max-w-md animate-scale-in">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-700 via-emerald-600 to-green-600 text-white font-extrabold text-2xl shadow-lg shadow-emerald-500/25 mb-4">
            TQ
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-950 dark:text-white tracking-tight">
            Client Manager
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Client Acquisition & Pipeline Management
          </p>
        </div>

        {/* Login Card */}
        <div className="card p-7 sm:p-9 shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-200/80 dark:border-gray-800">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Sign In to Workspace</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Enter your credentials to access the client database.
            </p>
          </div>

          {(error || formError) && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-400 text-xs flex items-center gap-2 animate-fade-in">
              <AlertCircle size={15} className="flex-shrink-0" />
              <span>{formError || error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="label">Work Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="input-field pl-10 text-sm"
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="label mb-0">Password</label>
                <button
                  type="button"
                  onClick={() => setForgotModalOpen(true)}
                  className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field pl-10 text-sm"
                  autoComplete="current-password"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-sm font-semibold shadow-md shadow-emerald-500/20 mt-2"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying Credentials...</span>
                </div>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Security Notice */}
          <div className="mt-6 pt-5 border-t border-gray-100 dark:border-gray-800 text-center">
            <p className="text-[11px] text-gray-400 flex items-center justify-center gap-1.5">
              <ShieldCheck size={14} className="text-emerald-500" />
              <span>Secure sign in powered by Supabase Auth</span>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-6">
          © {new Date().getFullYear()} Client Manager. All rights reserved.
        </p>
      </div>

      {/* Forgot Password Modal */}
      <Modal
        isOpen={forgotModalOpen}
        onClose={() => setForgotModalOpen(false)}
        title="Reset Account Password"
        size="sm"
      >
        {resetSent ? (
          <div className="text-center py-4 space-y-2">
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <Check size={22} />
            </div>
            <h4 className="text-sm font-bold text-gray-900 dark:text-white">Reset Link Sent</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              If an account matches <strong>{forgotEmail}</strong>, instructions will arrive shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Enter your registered work email and we'll dispatch password recovery instructions.
            </p>
            <div>
              <label className="label">Email Address</label>
              <input
                type="email"
                required
                value={forgotEmail}
                onChange={e => setForgotEmail(e.target.value)}
                placeholder="you@example.com"
                className="input-field text-sm"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setForgotModalOpen(false)}
                className="btn-secondary flex-1 text-xs"
              >
                Cancel
              </button>
              <button type="submit" disabled={loading} className="btn-primary flex-1 text-xs">
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
