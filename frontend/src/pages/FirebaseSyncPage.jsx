import React from 'react';
import { AlertCircle, CheckCircle2, Cloud, Shield, Wifi, WifiOff } from 'lucide-react';

const syncLabels = {
  idle: { title: 'Not connected', detail: 'Sign in with a Firebase account to start a private realtime listener.' },
  loading: { title: 'Connecting', detail: 'Loading records from your Firebase user collection.' },
  saving: { title: 'Saving', detail: 'A record write is pending confirmation from Firestore.' },
  synced: { title: 'Connected', detail: 'Firestore realtime listener is active for this signed-in user.' },
  cached: { title: 'Snapshot may be stale', detail: 'Firestore returned a cached snapshot. Network freshness is not guaranteed.' },
  error: { title: 'Connection or permission error', detail: 'Firestore did not confirm the requested operation.' },
};

export const FirebaseSyncPage = ({
  darkMode,
  firebaseConfigured,
  syncState = 'idle',
  syncError = '',
  recordCount = 0,
}) => {
  const status = syncLabels[syncState] || syncLabels.idle;
  const tone = syncState === 'synced' ? 'emerald' : syncState === 'error' ? 'rose' : 'amber';
  const card = darkMode ? 'bg-[#0c1024] border-indigo-950/80' : 'bg-white border-slate-200';

  return (
    <div className="max-w-6xl mx-auto p-4 lg:p-8 space-y-6">
      <header>
        <div className="flex items-center gap-2">
          <h1 className={`text-xl font-bold tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>Firebase workspace</h1>
          <span className="px-2 py-0.5 rounded-full bg-indigo-950 border border-indigo-800/60 text-[10px] font-semibold text-indigo-300">AUTH + FIRESTORE</span>
        </div>
        <p className="text-xs text-slate-400 mt-1">Status from the actual signed-in Firebase session and Firestore listener; no simulated latency or security test results.</p>
      </header>

      <section className={`p-5 rounded-2xl border ${card}`} aria-live="polite">
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-${tone}-950/60 border border-${tone}-800/60 text-${tone}-300`}>
            {syncState === 'synced' ? <CheckCircle2 className="w-5 h-5" /> : syncState === 'error' ? <AlertCircle className="w-5 h-5" /> : <Cloud className="w-5 h-5" />}
          </div>
          <div className="min-w-0">
            <h2 className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{status.title}</h2>
            <p className="text-xs text-slate-400 mt-1">{status.detail}</p>
            {syncError && <p className="text-xs text-rose-300 mt-2 break-words">{syncError}</p>}
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <section className={`p-5 rounded-2xl border space-y-3 ${card}`}>
          <h2 className="flex items-center gap-2 text-sm font-bold text-slate-200"><Cloud className="w-4 h-4 text-indigo-400" />Configuration</h2>
          <p className="text-xs text-slate-400">
            {firebaseConfigured
              ? 'Firebase client configuration is present. Email/Password Auth and Firestore still need to be enabled in the Firebase project.'
              : 'No Firebase web configuration was detected. From frontend/, copy .env.example to .env.local, add the VITE_FIREBASE_* project values, and restart Vite.'}
          </p>
          <p className="text-xs text-slate-400">Live records currently visible in this account: <strong className="text-slate-200">{recordCount}</strong></p>
        </section>

        <section className={`p-5 rounded-2xl border space-y-3 ${card}`}>
          <h2 className="flex items-center gap-2 text-sm font-bold text-slate-200"><Shield className="w-4 h-4 text-cyan-400" />Tenant boundary</h2>
          <p className="text-xs text-slate-400">Data path: <code className="text-cyan-200">users/&#123;uid&#125;/records/&#123;recordId&#125;</code></p>
          <p className="text-xs text-slate-400">The checked-in rules restrict users to their own UID. Deploy <code>firestore.rules</code> to enforce the same boundary in your Firebase project.</p>
          <div className="flex items-center gap-2 text-xs text-amber-200">
            {syncState === 'synced' ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
            <span>Offline writes are not enabled or queued; check the status above before assuming a save succeeded.</span>
          </div>
        </section>
      </div>

      <pre className={`overflow-x-auto rounded-xl border p-4 text-[11px] leading-relaxed ${card} text-slate-300`}>{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      match /records/{recordId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}`}</pre>
    </div>
  );
};
