import React, { useState } from 'react';
import { ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react';
import { BrandMark } from '../components/BrandMark.jsx';

export const RegisterPage = ({ onNavigate, onRegisterSuccess, firebaseConfigured }) => {
  const [step, setStep] = useState(1);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [useCase, setUseCase] = useState('Founder / Executive');
  const [error, setError] = useState('');
  const [dataConsent, setDataConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const validateEmail = (val) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  };

  const handleStep1Submit = (e) => {
    e.preventDefault();
    setError('');

    if (!firstName.trim()) {
      setError('First name is required');
      return;
    }
    if (!email.trim() || !validateEmail(email)) {
      setError('Please provide a valid work email address');
      return;
    }
    if (!password || password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setStep(2);
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    if (!dataConsent) {
      setError('Please confirm that you understand your records will be stored in your Firebase account.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await onRegisterSuccess({
      name: `${firstName} ${lastName}`.trim(),
      email: email.trim(),
      password,
      useCase,
      });
    } catch (registrationError) {
      setError(registrationError.message || 'Account creation could not be completed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#070913] text-white">
      {/* Left Neural Side matching Screenshot 7 */}
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
            Five minutes to a brain that never forgets.
          </h2>
          <p className="text-xs lg:text-sm text-slate-400 leading-relaxed">
            Capture something today; ask it a question next year. It will still know.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-4 text-[10px] text-slate-500 font-mono tracking-wider uppercase">
          <span>STEP {step} OF 2</span>
          <span>·</span>
          <span>SECURE ONBOARDING</span>
        </div>
      </div>

      {/* Right Form Side matching Screenshot 7 */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-16 lg:px-24 py-12 max-w-xl mx-auto w-full">
        <button
          onClick={() => onNavigate('home')}
          className="mb-8 inline-flex items-center gap-2.5 self-start md:hidden"
        >
          <BrandMark />
          <span className="font-bold text-sm tracking-wide">MindMesh</span>
        </button>
        <div className="space-y-6">
          {/* Step indicator */}
          <div className="space-y-2">
            <div className="text-[10px] font-mono tracking-wider text-slate-500 uppercase">
              STEP {step} OF 2 · {step === 1 ? 'ACCOUNT' : 'PREFERENCES'}
            </div>
            <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                style={{ width: step === 1 ? '50%' : '100%' }}
              />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight pt-2">
              {step === 1 ? 'Create your account' : 'Customize your workspace'}
            </h1>
          </div>

          {!firebaseConfigured && (
            <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-800/70 text-amber-200 text-xs" role="status">
              Account creation requires Firebase configuration. Configure `.env.local` before continuing.
            </div>
          )}

          {error && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-center gap-2" role="alert">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleStep1Submit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="register-first-name" className="block text-xs font-medium text-slate-300 mb-1.5">First name</label>
                  <input
                    id="register-first-name"
                    type="text"
                    value={firstName}
                    maxLength={80}
                    placeholder="Ava"
                    autoComplete="given-name"
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#0e1329] border border-indigo-950 focus:border-indigo-500 text-white placeholder-slate-500 focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="register-last-name" className="block text-xs font-medium text-slate-300 mb-1.5">Last name</label>
                  <input
                    id="register-last-name"
                    type="text"
                    value={lastName}
                    maxLength={80}
                    placeholder="Lindqvist"
                    autoComplete="family-name"
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#0e1329] border border-indigo-950 focus:border-indigo-500 text-white placeholder-slate-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="register-email" className="block text-xs font-medium text-slate-300 mb-1.5">Email</label>
                <input
                  id="register-email"
                  type="email"
                  value={email}
                  maxLength={254}
                  placeholder="you@company.com"
                  autoComplete="email"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#0e1329] border border-indigo-950 focus:border-indigo-500 text-white placeholder-slate-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label htmlFor="register-password" className="block text-xs font-medium text-slate-300 mb-1.5">Password</label>
                <input
                  id="register-password"
                  type="password"
                  value={password}
                  minLength={8}
                  maxLength={128}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="8+ characters"
                  autoComplete="new-password"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#0e1329] border border-indigo-950 focus:border-indigo-500 text-white placeholder-slate-500 focus:outline-none transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={!firebaseConfigured}
                className="w-full py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-[0_0_20px_-3px_rgba(99,102,241,0.5)] transition-all cursor-pointer"
              >
                Continue →
              </button>
            </form>
          ) : (
            <form onSubmit={handleFinalSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-2">Primary Use Case</label>
                <div className="space-y-2">
                  {[
                    'Researcher / Academic',
                    'Software Engineer / Architect',
                    'Founder / Executive',
                    'Writer / Content Creator',
                    'Chief of Staff / Operations',
                  ].map((uc) => (
                    <div
                      key={uc}
                      onClick={() => setUseCase(uc)}
                      className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between text-xs transition-colors ${
                        useCase === uc
                          ? 'bg-indigo-950/60 border-indigo-500 text-white'
                          : 'bg-[#0e1329] border-indigo-950 text-slate-400 hover:text-white'
                      }`}
                    >
                      <span>{uc}</span>
                      {useCase === uc && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
                    </div>
                  ))}
                </div>
              </div>

              <label className="flex items-start gap-2 text-[11px] leading-relaxed text-slate-400">
                <input
                  type="checkbox"
                  checked={dataConsent}
                  onChange={(event) => setDataConsent(event.target.checked)}
                  className="mt-0.5 accent-indigo-500"
                />
                <span>I understand my notes and workspace records are stored in my Firebase account and can be exported from Settings.</span>
              </label>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 text-xs font-medium text-slate-400 hover:text-white bg-[#0e1329] border border-indigo-950 rounded-xl"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={!firebaseConfigured || submitting}
                  className="flex-1 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-xl shadow-md transition-all cursor-pointer"
                >
                  {submitting ? 'Creating account…' : 'Launch Workspace'}
                </button>
              </div>
            </form>
          )}

          <div className="text-center pt-2 text-xs text-slate-400">
            <span>Have an account? </span>
            <button
              onClick={() => onNavigate('signin')}
              className="text-indigo-400 hover:text-indigo-300 font-medium underline"
            >
              Sign in
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
    </div>
  );
};
