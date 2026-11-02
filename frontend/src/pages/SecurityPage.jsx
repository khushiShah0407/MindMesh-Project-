import React from 'react';
import { Lock, Shield, Trash2, Link2, ShieldAlert, FileCode } from 'lucide-react';
import { BrandMark } from '../components/BrandMark.jsx';

export const SecurityPage = ({ onNavigate, darkMode }) => {
  return (
    <div className={`min-h-screen transition-colors ${darkMode ? 'bg-[#070913] text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      {/* Top Header */}
      <header className={`px-4 sm:px-6 py-4 border-b flex flex-wrap items-center justify-between gap-y-3 max-w-6xl mx-auto ${
        darkMode ? 'border-indigo-950' : 'border-slate-200'
      }`}>
        <button onClick={() => onNavigate('home')} className="flex items-center gap-2 cursor-pointer">
          <BrandMark />
          <span className={`font-bold text-sm tracking-wider ${darkMode ? 'text-white' : 'text-slate-900'}`}>MindMesh</span>
        </button>
        <div className="flex max-w-full flex-wrap items-center justify-end gap-x-3 gap-y-2 text-[11px] sm:gap-x-6 sm:text-xs">
          <button onClick={() => onNavigate('home')} className={`${darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}>Home</button>
          <button onClick={() => onNavigate('pricing')} className={`${darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}>Pricing</button>
          <button onClick={() => onNavigate('dashboard')} className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium">Workspace</button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-16 space-y-12">
        <div className="space-y-3">
          <div className="text-[11px] font-bold text-indigo-500 uppercase tracking-wider">SECURITY & PRIVACY</div>
          <h1 className={`text-4xl sm:text-5xl font-extrabold tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            A memory product earns trust<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-cyan-500">
              or it doesn't deserve your memories.
            </span>
          </h1>
          <p className={`text-xs max-w-2xl leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            These are the design commitments MindMesh is built around — stated as engineering practices, not certification badges. Compliance attestations will be published only when they actually exist.
          </p>
        </div>

        {/* 6 Commitments Grid matching screenshot 4 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={`p-6 rounded-2xl border space-y-3 shadow-sm ${
            darkMode ? 'bg-[#0c1024] border-indigo-950/80' : 'bg-white border-slate-200'
          }`}>
            <Lock className="w-4 h-4 text-indigo-500" />
            <h3 className={`text-base font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>No private server secrets are configured</h3>
            <p className={`text-xs leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Firebase web configuration is public client configuration. No AI, payment, or meeting-provider secret is configured in this frontend.
            </p>
          </div>

          <div className={`p-6 rounded-2xl border space-y-3 shadow-sm ${
            darkMode ? 'bg-[#0c1024] border-indigo-950/80' : 'bg-white border-slate-200'
          }`}>
            <Shield className="w-4 h-4 text-cyan-500" />
            <h3 className={`text-base font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Firebase record access is user-scoped</h3>
            <p className={`text-xs leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              The included Firestore rules restrict each user's records to their authenticated UID. There is no separate application server, workspace-membership model, or vector retrieval service.
            </p>
          </div>

          <div className={`p-6 rounded-2xl border space-y-3 shadow-sm ${
            darkMode ? 'bg-[#0c1024] border-indigo-950/80' : 'bg-white border-slate-200'
          }`}>
            <Trash2 className="w-4 h-4 text-rose-500" />
            <h3 className={`text-base font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Record deletion</h3>
            <p className={`text-xs leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Supported records are removed from the user's Firestore collection. There are no vector indexes, AI summaries, or app-managed backups; demo records remain in this browser until cleared.
            </p>
          </div>

          <div className={`p-6 rounded-2xl border space-y-3 shadow-sm ${
            darkMode ? 'bg-[#0c1024] border-indigo-950/80' : 'bg-white border-slate-200'
          }`}>
            <Link2 className="w-4 h-4 text-purple-500" />
            <h3 className={`text-base font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>No AI processing is enabled</h3>
            <p className={`text-xs leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Assistant responses are local keyword-match notices, not model-generated answers. Notes and document contents are not sent to an AI provider.
            </p>
          </div>

          <div className={`p-6 rounded-2xl border space-y-3 shadow-sm ${
            darkMode ? 'bg-[#0c1024] border-indigo-950/80' : 'bg-white border-slate-200'
          }`}>
            <ShieldAlert className="w-4 h-4 text-amber-500" />
            <h3 className={`text-base font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>No document ingestion service</h3>
            <p className={`text-xs leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Document capture currently stores metadata only; file contents are not uploaded or processed by an ingestion or AI pipeline.
            </p>
          </div>

          <div className={`p-6 rounded-2xl border space-y-3 shadow-sm ${
            darkMode ? 'bg-[#0c1024] border-indigo-950/80' : 'bg-white border-slate-200'
          }`}>
            <FileCode className="w-4 h-4 text-emerald-500" />
            <h3 className={`text-base font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>No audit-log backend</h3>
            <p className={`text-xs leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              The Admin Console audit data is a labeled demo fixture. This build does not provide production audit logging or admin authorization.
            </p>
          </div>
        </div>

        {/* Practice Table matching screenshot 4 */}
        <div className="space-y-4">
          <div className="text-[11px] font-bold text-indigo-500 uppercase tracking-wider">
            PRACTICE TABLE
          </div>
          <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            The concrete list
          </h2>

          <div className={`p-6 rounded-2xl border divide-y text-xs shadow-sm ${
            darkMode ? 'bg-[#0c1024] border-indigo-950/80 divide-indigo-950/40' : 'bg-white border-slate-200 divide-slate-200'
          }`}>
            <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="font-mono text-[11px] text-indigo-500 font-bold uppercase">PASSWORD STORAGE</span>
              <span className={darkMode ? 'text-slate-300' : 'text-slate-700'}>Passwords are handled by Firebase Authentication when Firebase is configured.</span>
            </div>
            <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="font-mono text-[11px] text-cyan-500 font-bold uppercase">TRANSPORT</span>
              <span className={darkMode ? 'text-slate-300' : 'text-slate-700'}>Transport security depends on the hosting environment; Firebase Auth uses browser-managed persistence.</span>
            </div>
            <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="font-mono text-[11px] text-purple-500 font-bold uppercase">RATE LIMITING</span>
              <span className={darkMode ? 'text-slate-300' : 'text-slate-700'}>No application API or custom rate-limiting layer is included.</span>
            </div>
            <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="font-mono text-[11px] text-amber-500 font-bold uppercase">INPUT VALIDATION</span>
              <span className={darkMode ? 'text-slate-300' : 'text-slate-700'}>Validation is implemented per form; Firebase Storage rules restrict configured image and audio uploads by type and size.</span>
            </div>
            <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="font-mono text-[11px] text-emerald-500 font-bold uppercase">LEAST PRIVILEGE</span>
              <span className={darkMode ? 'text-slate-300' : 'text-slate-700'}>Included Firestore rules scope user records to their owner UID; organizations and shared workspaces are not implemented.</span>
            </div>
            <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="font-mono text-[11px] text-rose-500 font-bold uppercase">BACKUPS</span>
              <span className={darkMode ? 'text-slate-300' : 'text-slate-700'}>Backup and restore policies are controlled by the configured Firebase project, not this application.</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
