import React, { useEffect, useRef, useState } from 'react';
import {
  Download,
  Key,
  Trash2,
  Check,
  Moon,
  Sun,
  Shield,
  Sparkles
} from 'lucide-react';
import { loadJson, saveJson } from '../utils/localStore.js';

const defaultPreferences = {
  defaultModel: 'Mesh-v4 (balanced)',
  autoExtract: false,
  suggestGraph: false,
  weeklyEmail: false,
  voiceSummaries: false,
};

export const SettingsPage = ({
  user,
  records = [],
  isRealTimeMode = false,
  onImportRecords,
  onSaveProfile,
  darkMode,
  onToggleTheme,
}) => {
  const [name, setName] = useState(user.name);
  const [email] = useState(user.email);
  const [preferences, setPreferences] = useState(() => ({ ...defaultPreferences, ...loadJson('mindmesh_preferences', {}) }));
  const [savedNotice, setSavedNotice] = useState(false);
  const [backupMessage, setBackupMessage] = useState('');
  const [backupError, setBackupError] = useState('');
  const backupInput = useRef(null);

  useEffect(() => {
    saveJson('mindmesh_preferences', preferences);
  }, [preferences]);

  const togglePreference = (key) => setPreferences((current) => ({ ...current, [key]: !current[key] }));

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (name.trim().length < 2) {
      setBackupError('Display name must be at least 2 characters.');
      return;
    }
    try {
      await onSaveProfile?.(name.trim());
      setSavedNotice(true);
      setTimeout(() => setSavedNotice(false), 2000);
    } catch (error) {
      setBackupError(error.message || 'Profile could not be updated.');
    }
  };

  const handleExportData = () => {
    setBackupError('');
    if (!isRealTimeMode) {
      setBackupError('Switch to Live Real-Time while signed into Firebase to export your private records.');
      return;
    }
    const data = {
      format: 'mindmesh-record-backup',
      version: 1,
      exportTimestamp: new Date().toISOString(),
      records: records.map(({ recordType, ...record }) => ({ ...record, recordType })),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mindmesh-vault-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setBackupMessage(`${records.length} personal record${records.length === 1 ? '' : 's'} exported.`);
  };

  const handleImportFile = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    setBackupMessage('');
    setBackupError('');
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setBackupError('Backup files must be 5 MB or smaller.');
      return;
    }
    if (!isRealTimeMode) {
      setBackupError('Switch to Live Real-Time while signed into Firebase before restoring a backup.');
      return;
    }
    try {
      const backup = JSON.parse(await file.text());
      if (backup.format !== 'mindmesh-record-backup' || backup.version !== 1 || !Array.isArray(backup.records)) {
        throw new Error('This is not a supported MindMesh backup file.');
      }
      if (backup.records.length > 500) throw new Error('A backup may contain no more than 500 records.');
      const ids = new Set();
      const validTypes = new Set(['notes', 'documents', 'meetings', 'voiceNotes', 'geoMemories', 'contacts', 'flashcards', 'canvasItems', 'workflows', 'webhooks', 'screenshots', 'collections', 'foodMemories']);
      let totalRecordBytes = 0;
      for (const record of backup.records) {
        if (!record || typeof record.id !== 'string' || !record.id.trim() || record.id.includes('/') || record.id.length > 128 || !validTypes.has(record.recordType)) {
          throw new Error('The backup contains a record with an invalid ID or type.');
        }
        if (ids.has(record.id)) throw new Error(`The backup contains duplicate record ID "${record.id}".`);
        ids.add(record.id);
        const recordBytes = new TextEncoder().encode(JSON.stringify(record)).length;
        if (recordBytes > 900000) throw new Error(`Record "${record.id}" is too large to restore safely.`);
        totalRecordBytes += recordBytes;
        if (totalRecordBytes > 4 * 1024 * 1024) throw new Error('The combined record data exceeds the 4 MB safe restore limit.');
      }
      await onImportRecords?.(backup.records);
      setBackupMessage(`${backup.records.length} records restored in one Firestore batch. Existing IDs were replaced; current sync status is shown in the workspace header.`);
    } catch (error) {
      setBackupError(error.message || 'Backup could not be restored.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 lg:p-8 space-y-8">
      {/* Top Header matching Screenshot 21 */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className={`text-xl font-bold tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            Settings
          </h1>
          <span className={`px-2 py-0.5 rounded-full border text-[10px] font-semibold ${
            darkMode ? 'bg-indigo-950 border-indigo-800/60 text-indigo-300' : 'bg-indigo-50 border-indigo-200 text-indigo-700'
          }`}>
            {isRealTimeMode ? 'PRIVATE RECORDS' : 'DEMO DATA'}
          </span>
        </div>
      </div>

      {/* Profile Section matching Screenshot 21 */}
      <div className={`p-6 rounded-2xl border space-y-4 ${
        darkMode ? 'bg-[#0c1024] border-indigo-950/80' : 'bg-white border-slate-200'
      }`}>
        <h2 className={`text-sm font-bold uppercase tracking-wider text-slate-400`}>
          Profile
        </h2>
        <p className="text-[11px] text-slate-400">Your display name is saved to your Firebase account (or this browser in demo mode). Profile email is read-only.</p>
        <form onSubmit={handleSaveProfile} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full px-3 py-2 text-xs rounded-xl border focus:outline-none focus:border-indigo-500 ${
                darkMode ? 'bg-[#0e1329] border-indigo-950 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
              }`}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Email</label>
            <input
              type="email"
              value={email}
              readOnly
              aria-describedby="account-email-note"
              className={`w-full px-3 py-2 text-xs rounded-xl border focus:outline-none focus:border-indigo-500 ${
                darkMode ? 'bg-[#0e1329] border-indigo-950 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
              }`}
            />
          </div>
          <p id="account-email-note" className="md:col-span-2 -mt-2 text-[10px] text-slate-500">Firebase account email cannot be changed from this profile form.</p>
          <div className="md:col-span-2 flex items-center justify-between pt-2">
            {savedNotice ? (
              <span className="text-xs text-emerald-400 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                Profile updated
              </span>
            ) : <span />}
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors cursor-pointer"
            >
              Save Profile
            </button>
          </div>
        </form>
      </div>

      {/* Appearance Section matching Screenshot 21 */}
      <div className={`p-6 rounded-2xl border space-y-4 ${
        darkMode ? 'bg-[#0c1024] border-indigo-950/80' : 'bg-white border-slate-200'
      }`}>
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
          Appearance
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => darkMode || onToggleTheme()}
            className={`p-4 rounded-xl border flex flex-col items-center gap-2 cursor-pointer transition-all ${
              darkMode
                ? 'bg-[#080b18] border-indigo-500 shadow-[0_0_20px_-5px_rgba(99,102,241,0.4)]'
                : 'bg-slate-100 border-slate-300 text-slate-600'
            }`}
          >
            <div className="w-full h-12 rounded bg-[#070914] border border-indigo-950 flex items-center justify-center">
              <Moon className="w-4 h-4 text-indigo-400" />
            </div>
            <span className="text-xs font-bold text-slate-200">Dark Mode</span>
          </button>

          <button
            type="button"
            onClick={() => !darkMode || onToggleTheme()}
            className={`p-4 rounded-xl border flex flex-col items-center gap-2 cursor-pointer transition-all ${
              !darkMode
                ? 'bg-white border-indigo-500 shadow-sm'
                : 'bg-[#0e1329] border-indigo-950 text-slate-400'
            }`}
          >
            <div className="w-full h-12 rounded bg-white border border-slate-300 flex items-center justify-center">
              <Sun className="w-4 h-4 text-amber-500" />
            </div>
            <span className="text-xs font-bold text-slate-800">Light Mode</span>
          </button>
        </div>
      </div>

      {/* AI Preferences Section matching Screenshot 21 */}
      <div className={`p-6 rounded-2xl border space-y-6 ${
        darkMode ? 'bg-[#0c1024] border-indigo-950/80' : 'bg-white border-slate-200'
      }`}>
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
            AI preferences
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Saved in this browser only. They do not enable AI, email, or voice services; none are configured.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-indigo-950/40">
            <div>
              <div className={`text-xs font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                Default model
              </div>
              <div className="text-[11px] text-slate-400">
                Saved preference only; no AI provider is configured
              </div>
            </div>
            <select
              value={preferences.defaultModel}
              onChange={(e) => setPreferences((current) => ({ ...current, defaultModel: e.target.value }))}
              className={`text-xs font-medium px-3 py-1.5 rounded-lg border focus:outline-none ${
                darkMode ? 'bg-[#0e1329] border-indigo-950 text-slate-200' : 'bg-slate-50 border-slate-300 text-slate-800'
              }`}
            >
              <option value="Mesh-v4 (balanced)">Mesh-v4 (balanced)</option>
              <option value="Mesh-Pro (reasoning)">Mesh-Pro (reasoning)</option>
              <option value="Mesh-Fast (speed)">Mesh-Fast (speed)</option>
            </select>
          </div>

          <div className="flex items-center justify-between pb-3 border-b border-indigo-950/40">
            <div>
              <div className={`text-xs font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                Automatic memory extraction
              </div>
              <div className="text-[11px] text-slate-400">
                Preference only; automatic extraction is not connected
              </div>
            </div>
            <button
              onClick={() => togglePreference('autoExtract')}
              className={`w-10 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${
                preferences.autoExtract ? 'bg-indigo-600' : 'bg-slate-700'
              }`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${preferences.autoExtract ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>

          <div className="flex items-center justify-between pb-3 border-b border-indigo-950/40">
            <div>
              <div className={`text-xs font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                Suggest graph relationships
              </div>
              <div className="text-[11px] text-slate-400">
                Preference only; AI graph suggestions are not connected
              </div>
            </div>
            <button
              onClick={() => togglePreference('suggestGraph')}
              className={`w-10 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${
                preferences.suggestGraph ? 'bg-indigo-600' : 'bg-slate-700'
              }`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${preferences.suggestGraph ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>

          <div className="flex items-center justify-between pb-3 border-b border-indigo-950/40">
            <div>
              <div className={`text-xs font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                Weekly review email
              </div>
              <div className="text-[11px] text-slate-400">
                Preference only; email delivery is not configured
              </div>
            </div>
            <button
              onClick={() => togglePreference('weeklyEmail')}
              className={`w-10 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${
                preferences.weeklyEmail ? 'bg-indigo-600' : 'bg-slate-700'
              }`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${preferences.weeklyEmail ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className={`text-xs font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                Voice summaries
              </div>
              <div className="text-[11px] text-slate-400">
                Preference only; no generated voice content is available
              </div>
            </div>
            <button
              onClick={() => togglePreference('voiceSummaries')}
              className={`w-10 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${
                preferences.voiceSummaries ? 'bg-indigo-600' : 'bg-slate-700'
              }`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${preferences.voiceSummaries ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Data & Privacy Section matching Screenshot 21 */}
      <div className={`p-6 rounded-2xl border space-y-6 ${
        darkMode ? 'bg-[#0c1024] border-indigo-950/80' : 'bg-white border-slate-200'
      }`}>
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
          Data & privacy
        </h2>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-indigo-950/40">
            <div>
              <div className={`text-xs font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                Export everything
              </div>
              <div className="text-[11px] text-slate-400">
                Export or restore your own Firestore record data as a validated JSON backup. Uploaded audio and image files are not included.
              </div>
            </div>
            <button
              onClick={handleExportData}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border text-xs font-medium transition-colors shrink-0 ${
                darkMode ? 'bg-[#141b3d] hover:bg-[#1a2350] border-indigo-800 text-slate-200' : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800'
              }`}
            >
              <Download className="w-3.5 h-3.5 text-indigo-400" />
              <span>Export data</span>
            </button>
          </div>

          {backupError && <p className="text-xs text-rose-300" role="alert">{backupError}</p>}
          {backupMessage && <p className="text-xs text-emerald-300" role="status">{backupMessage}</p>}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-indigo-950/40">
            <div>
              <div className={`text-xs font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Restore backup</div>
              <div className="text-[11px] text-slate-400">Validates the entire file before writing; matching IDs are updated.</div>
            </div>
            <button
              type="button"
              onClick={() => backupInput.current?.click()}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border text-xs font-medium ${
                darkMode ? 'bg-[#141b3d] hover:bg-[#1a2350] border-indigo-800 text-slate-200' : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800'
              }`}
            >
              Choose backup file
            </button>
            <input ref={backupInput} type="file" accept="application/json,.json" className="hidden" onChange={handleImportFile} />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-indigo-950/40">
            <div>
              <div className={`text-xs font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                API keys
              </div>
              <div className="text-[11px] text-slate-400">No external AI provider or key vault is configured in this application.</div>
            </div>
            <button
              onClick={() => setBackupError('API key management requires a secured backend and is not available in this client.')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border text-xs font-medium transition-colors shrink-0 cursor-pointer ${
                darkMode ? 'bg-[#141b3d] hover:bg-[#1a2350] border-indigo-800 text-slate-200' : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800'
              }`}
            >
              <Key className="w-3.5 h-3.5 text-indigo-400" />
              <span>Unavailable</span>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-xs font-semibold text-rose-400">
                Delete account
              </div>
              <div className="text-[11px] text-slate-400">Account deletion requires a secured backend and is not available in this client.</div>
            </div>
            <button
              onClick={() => setBackupError('Account deletion is not configured. Contact your Firebase project administrator.')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition-colors shrink-0 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete account</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
