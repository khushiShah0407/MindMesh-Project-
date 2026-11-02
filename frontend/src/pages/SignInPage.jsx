import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Lock, Mail, AlertCircle } from 'lucide-react';
import { BrandMark } from '../components/BrandMark.jsx';

export const SignInPage = ({ onNavigate, onLoginSuccess, onResetPassword, firebaseConfigured }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotError, setForgotError] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const forgotTriggerRef = useRef(null);
  const forgotModalRef = useRef(null);
  const forgotEmailRef = useRef(null);
  const forgotWasOpen = useRef(false);

  useEffect(() => {
    if (!showForgotModal) {
      if (forgotWasOpen.current) forgotTriggerRef.current?.focus();
      forgotWasOpen.current = false;
      return undefined;
    }

    forgotWasOpen.current = true;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    forgotEmailRef.current?.focus();

    const handleDialogKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setShowForgotModal(false);
        return;
      }

      if (event.key !== 'Tab' || !forgotModalRef.current) return;
      const focusableElements = forgotModalRef.current.querySelectorAll(
        'input:not([disabled]), button:not([disabled])',
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement?.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement?.focus();
      }
    };

    document.addEventListener('keydown', handleDialogKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleDialogKeyDown);
    };
  }, [showForgotModal]);

  const validateEmail = (val) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setForgotError('');
    setForgotSuccess('');
    if (!forgotEmail.trim()) {
      setForgotError('Please enter your account email.');
      return;
    }
    if (!validateEmail(forgotEmail)) {
      setForgotError('Please provide a valid email format.');
      return;
    }
    try {
      await onResetPassword(forgotEmail.trim());
      setForgotSuccess('If this email has an account, Firebase will send a password reset link.');
    } catch (resetError) {
      setForgotError(resetError.message || 'Password reset could not be sent.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Email address is required');
      return;
    }
    if (!validateEmail(email)) {
      setError('Please provide a valid email address (e.g. name@company.com)');
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setSubmitting(true);
    try {
      await onLoginSuccess({
        email: email.trim(),
        password,
        rememberMe,
        isDemo: email.trim().toLowerCase() === 'ava@mindmesh.demo',
      });
    } catch (loginError) {
      setError(loginError.message || 'Sign in could not be completed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#070913] text-white">
      {/* Left Neural Grid Side matching Screenshot 6 */}
      <div className="hidden md:flex flex-1 flex-col justify-between p-12 lg:p-16 relative overflow-hidden border-r border-indigo-950/60 bg-[#090c1b]">
        <div className="absolute inset-0 neural-grid opacity-35" />
        <div className="relative z-10">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2.5 cursor-pointer"
          >
            <BrandMark />
            <span className="font-bold text-sm tracking-wide">MindMesh</span>
          </button>
        </div>

        <div className="relative z-10 max-w-md space-y-4">
          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Welcome back to MindMesh.
          </h2>
          <p className="text-xs lg:text-sm text-slate-400 leading-relaxed">
            Pick up every thread exactly where you left it — decisions, sources and all.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-4 text-[10px] text-slate-500 font-mono tracking-wider uppercase">
          <span>AUTHENTICATED ACCESS</span>
          <span>·</span>
          <span>ENTERPRISE ISOLATION</span>
        </div>
      </div>

      {/* Right Form Side matching Screenshot 6 */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-16 lg:px-24 py-12 max-w-xl mx-auto w-full">
        <button
          onClick={() => onNavigate('home')}
          className="mb-8 inline-flex items-center gap-2.5 self-start md:hidden"
        >
          <BrandMark />
          <span className="font-bold text-sm tracking-wide">MindMesh</span>
        </button>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Sign in</h1>
            <p className="text-xs text-slate-400 mt-1">
              Access your personal MindMesh workspace.
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-center gap-2 animate-in fade-in duration-150" role="alert">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {!firebaseConfigured && (
            <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-800/70 text-amber-200 text-xs" role="status">
              Firebase is not configured. Live accounts are unavailable. Use the clearly separated demo preset or configure `.env.local`.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="signin-email" className="block text-xs font-medium text-slate-300 mb-1.5">Email</label>
              <input
                id="signin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                autoComplete="username"
                required
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#0e1329] border border-indigo-950 hover:border-indigo-800/80 focus:border-indigo-500 text-white placeholder-slate-500 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="signin-password" className="text-xs font-medium text-slate-300">Password</label>
                <button
                  ref={forgotTriggerRef}
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-[11px] text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
                >
                  Forgot?
                </button>
              </div>
              <input
                id="signin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#0e1329] border border-indigo-950 hover:border-indigo-800/80 focus:border-indigo-500 text-white placeholder-slate-500 focus:outline-none transition-colors"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-3.5 h-3.5 rounded bg-indigo-950 border-indigo-800 text-indigo-600 focus:ring-0 cursor-pointer"
              />
              <label htmlFor="remember" className="text-xs text-slate-400 cursor-pointer">
                Keep me signed in on this device
              </label>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-xl shadow-[0_0_20px_-3px_rgba(99,102,241,0.5)] transition-all cursor-pointer"
            >
              {submitting ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <div className="rounded-xl border border-cyan-900/70 bg-cyan-950/20 p-3">
            <div className="text-xs font-semibold text-cyan-200">Explore the preset demo</div>
            <p className="mt-1 text-[11px] text-slate-400">Uses sample content only; it is not a cloud account and never shares data with live mode.</p>
            <button
              type="button"
              onClick={() => onLoginSuccess({ email: 'ava@mindmesh.demo', password: 'password123', isDemo: true }).catch((loginError) => setError(loginError.message))}
              className="mt-3 w-full py-2 px-3 text-xs font-semibold text-cyan-100 bg-cyan-950/50 border border-cyan-800/70 hover:bg-cyan-900/60 rounded-lg transition-colors cursor-pointer"
            >
              Enter demo workspace
            </button>
          </div>

          <div className="text-center pt-2 text-xs text-slate-400">
            <span>New here? </span>
            <button
              onClick={() => onNavigate('register')}
              className="text-indigo-400 hover:text-indigo-300 font-medium underline"
            >
              Create an account
            </button>
          </div>

          <div className="text-center pt-6">
            <button
              onClick={() => onNavigate('home')}
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to mindmesh.app</span>
            </button>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div
            ref={forgotModalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="forgot-password-title"
            className="w-full max-w-sm rounded-2xl border border-indigo-900/80 bg-[#0c1024] p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150"
          >
            <div>
              <h3 id="forgot-password-title" className="text-sm font-bold text-white">Reset your password</h3>
              <p className="text-xs text-slate-400 mt-1">
                Firebase sends a secure password reset link to the address you provide.
              </p>
            </div>

            {forgotError && (
              <div className="p-2.5 rounded-lg bg-rose-950/50 border border-rose-800 text-rose-300 text-xs" role="alert">
                {forgotError}
              </div>
            )}

            {forgotSuccess && (
              <div className="p-2.5 rounded-lg bg-emerald-950/50 border border-emerald-800 text-emerald-300 text-xs" role="status">
                {forgotSuccess}
              </div>
            )}

            <form onSubmit={handleForgotSubmit} className="space-y-3">
              <div>
                <label htmlFor="forgot-password-email" className="block text-[11px] font-medium text-slate-400 mb-1">Email</label>
                <input
                  ref={forgotEmailRef}
                  id="forgot-password-email"
                  type="email"
                  placeholder="you@work.com"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-[#0e1329] border border-indigo-950 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="px-3.5 py-1.5 text-xs text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!firebaseConfigured}
                  className="px-4 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-md transition-colors"
                >
                  Send Reset Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
