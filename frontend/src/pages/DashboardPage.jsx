import React, { useState } from 'react';
import {
  Sparkles,
  ChevronRight,
  Brain,
  FileText,
  Users2,
  Cpu,
  Share2,
  Camera,
  Mic,
  Clock3,
} from 'lucide-react';
import { getRediscoveryNote } from '../utils/noteLogic.js';

export const DashboardPage = ({
  user,
  onNavigate,
  onQuickSave,
  darkMode,
  isRealTimeMode,
  notes = [],
}) => {
  const [quickText, setQuickText] = useState('');
  const [quickError, setQuickError] = useState('');
  const [quickSaving, setQuickSaving] = useState(false);

  const handleQuickSubmit = async (e) => {
    e.preventDefault();
    if (!quickText.trim()) return;
    setQuickError('');
    setQuickSaving(true);
    try {
      await onQuickSave(quickText);
      setQuickText('');
    } catch (error) {
      setQuickError(error.message || 'The note could not be saved.');
    } finally {
      setQuickSaving(false);
    }
  };
  const recentRecords = [...(user.records || [])].sort((a, b) => {
    const time = (value) => value?.toDate?.().getTime?.() || new Date(value || 0).getTime() || 0;
    return time(b.updatedAt || b.createdAt) - time(a.updatedAt || a.createdAt);
  }).slice(0, 5);
  const rediscovery = getRediscoveryNote(notes);

  return (
    <div className="dashboard-page p-4 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Top Welcome & Quick Capture Row matching Screenshot 8 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className={`text-2xl font-bold tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              Good morning, {user.name.split(' ')[0]}
            </h1>
            <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-semibold tracking-wide ${
              isRealTimeMode
                ? 'bg-emerald-950/80 border-emerald-700/60 text-emerald-300'
                : darkMode
                ? 'bg-indigo-950 border-indigo-800/60 text-indigo-300'
                : 'bg-indigo-50 border-indigo-200 text-indigo-700'
            }`}>
              {isRealTimeMode ? 'LIVE REAL-TIME (0 DUMMY DATA)' : 'DEMO DATA'}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {isRealTimeMode
              ? 'Showing records stored in your private Firestore account. Current sync status is shown in the workspace header.'
              : 'This is the separate sample workspace stored in this browser. Its activity, metrics, and records are illustrative demo data.'}
          </p>
        </div>

        {/* Quick capture bar */}
        <form onSubmit={handleQuickSubmit} className="flex items-center gap-2 w-full md:w-auto">
          <input
            type="text"
            placeholder="Quick capture — dump a thought."
            value={quickText}
            onChange={(e) => setQuickText(e.target.value)}
            maxLength={10000}
            aria-label="Quick capture note"
            className={`w-full md:w-72 px-3.5 py-2 text-xs rounded-lg shadow-inner focus:outline-none border ${
              darkMode
                ? 'bg-[#0e1329] border-indigo-900/50 text-white placeholder-slate-500 focus:border-indigo-500'
                : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-indigo-500'
            }`}
          />
          <button
            type="submit"
            disabled={quickSaving || !quickText.trim()}
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 rounded-lg shadow-[0_0_15px_-2px_rgba(99,102,241,0.5)] transition-all cursor-pointer shrink-0"
          >
            {quickSaving ? 'Saving…' : 'Save'}
          </button>
        </form>
      </div>
      {quickError && <p className="text-xs text-rose-400" role="alert">{quickError}</p>}

      {/* 4 Stat Cards matching Screenshot 8 */}
      <div className="dashboard-stat-grid grid grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          type="button"
          onClick={() => onNavigate('dashboard')}
          className={`dashboard-stat-card w-full text-left p-5 rounded-xl border transition-all cursor-pointer group shadow-sm hover:shadow-[0_0_20px_-5px_rgba(99,102,241,0.2)] ${
            darkMode ? 'bg-[#0c1024] border-indigo-950/80 hover:border-indigo-600/40' : 'bg-white border-slate-200 hover:border-indigo-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Memory nodes</span>
            <Brain className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className={`text-2xl sm:text-3xl font-extrabold tracking-tight tabular-nums ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            {user.memoryNodesCount}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            {isRealTimeMode ? 'From your saved records' : 'Saved records in this workspace'}
          </div>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('notes')}
          className={`dashboard-stat-card w-full text-left p-5 rounded-xl border transition-all cursor-pointer group shadow-sm hover:shadow-[0_0_20px_-5px_rgba(99,102,241,0.2)] ${
            darkMode ? 'bg-[#0c1024] border-indigo-950/80 hover:border-indigo-600/40' : 'bg-white border-slate-200 hover:border-indigo-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Notes</span>
            <FileText className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className={`text-2xl sm:text-3xl font-extrabold tracking-tight tabular-nums ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            {user.notesCount}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">{isRealTimeMode ? 'Saved notes' : 'Saved in this demo'}</div>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('meetings')}
          className={`dashboard-stat-card w-full text-left p-5 rounded-xl border transition-all cursor-pointer group shadow-sm hover:shadow-[0_0_20px_-5px_rgba(99,102,241,0.2)] ${
            darkMode ? 'bg-[#0c1024] border-indigo-950/80 hover:border-indigo-600/40' : 'bg-white border-slate-200 hover:border-indigo-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Meetings</span>
            <Users2 className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className={`text-2xl sm:text-3xl font-extrabold tracking-tight tabular-nums ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            {user.meetingsCount}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">{isRealTimeMode ? 'Saved meeting notes' : 'Sample meeting records'}</div>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('cloudsql')}
          className={`dashboard-stat-card w-full text-left p-5 rounded-xl border transition-all cursor-pointer group shadow-sm hover:shadow-[0_0_20px_-5px_rgba(99,102,241,0.2)] ${
            darkMode ? 'bg-[#0c1024] border-indigo-950/80 hover:border-indigo-600/40' : 'bg-white border-slate-200 hover:border-indigo-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Vectors indexed</span>
            <Cpu className="w-4 h-4 text-violet-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className={`text-2xl sm:text-3xl font-extrabold tracking-tight tabular-nums ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            —
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Vector indexing is not configured</div>
        </button>
      </div>

      {/* Two columns: AI Daily Digest & Usage this cycle */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: AI Daily Digest */}
        <div className={`lg:col-span-2 p-6 rounded-xl border shadow-sm relative overflow-hidden ${
          darkMode ? 'bg-[#0c1024] border-indigo-950/80' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400">
              {isRealTimeMode ? 'AI unavailable' : 'Sample insight · demo data'}
            </h3>
          </div>

          <p className={`text-sm leading-relaxed ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
            {isRealTimeMode
              ? 'AI summaries and suggested connections are not available because no AI service is configured. Your records remain available in Notes, Search, and the Knowledge Graph.'
              : 'This sample insight is preset demo copy and was not generated from your activity. AI summaries and suggested connections are not available because no AI service is configured.'}
          </p>

          {!isRealTimeMode && <div className="flex flex-wrap items-center gap-2.5 mt-5">
            <button
              onClick={() => onNavigate('notes')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                darkMode ? 'bg-[#141b3d] hover:bg-[#1a2350] border-indigo-800/40 text-slate-200' : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800'
              }`}
            >
              Review sample notes
            </button>
            <button
              onClick={() => onNavigate('graph')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                darkMode ? 'bg-[#141b3d] hover:bg-[#1a2350] border-indigo-800/40 text-slate-200' : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800'
              }`}
            >
              Open sample graph
            </button>
            <button
              onClick={() => onNavigate('notes')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                darkMode ? 'bg-[#141b3d] hover:bg-[#1a2350] border-indigo-800/40 text-slate-200' : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800'
              }`}
            >
              Sample checklist
            </button>
          </div>}
        </div>

        {/* Right 1 Col: Usage - This Cycle */}
        <div className={`p-6 rounded-xl border shadow-sm flex flex-col justify-between ${
          darkMode ? 'bg-[#0c1024] border-indigo-950/80' : 'bg-white border-slate-200'
        }`}>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-4">
              {isRealTimeMode ? 'Usage' : 'Usage — This Cycle'}
            </div>

            <p className="text-xs leading-relaxed text-slate-400">
              {isRealTimeMode
                ? 'AI credits, storage quotas, and vector counts require backend services and are not available in this workspace.'
                : 'The local demo does not track service usage, storage quotas, or vector indexing.'}
            </p>
          </div>

          {!isRealTimeMode && <button
            onClick={() => onNavigate('billing')}
            className="mt-4 flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-medium group"
          >
            <span>Manage plan</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>}
        </div>
      </div>

      {/* Bottom Row: Recent Activity & Suggested Connections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className={`p-6 rounded-xl border shadow-sm ${
          darkMode ? 'bg-[#0c1024] border-indigo-950/80' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {isRealTimeMode ? 'Recent Activity' : 'Recent Activity · demo samples'}
            </h3>
            <button
              onClick={() => onNavigate('timeline')}
              className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Timeline
            </button>
          </div>

          {isRealTimeMode ? (
            <div className="space-y-3">
              {recentRecords.length ? recentRecords.map((record) => (
                <div key={record.id} className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-indigo-950 border border-indigo-800/40 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5"><FileText className="w-3.5 h-3.5" /></div>
                  <div className="min-w-0">
                    <div className={`text-xs font-medium ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>{record.title || record.name || 'Saved record'}</div>
                    <div className="text-[11px] text-slate-400">{record.recordType}</div>
                  </div>
                </div>
              )) : <p className="text-xs text-slate-400">No records saved yet. Capture a note to start your knowledge base.</p>}
            </div>
          ) : <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-indigo-950 border border-indigo-800/40 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5">
                <FileText className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className={`text-xs font-medium ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>You edited MindMesh workspace architecture</div>
                <div className="text-[11px] text-slate-400">2 min ago</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-800/40 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className={`text-xs font-medium ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>Sample meeting activity (not AI-generated)</div>
                <div className="text-[11px] text-slate-400">Demo preset</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-purple-950 border border-purple-800/40 flex items-center justify-center text-purple-400 shrink-0 mt-0.5">
                <Share2 className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className={`text-xs font-medium ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>Graph suggested a link: pricing cluster ↔ Sam (person)</div>
                <div className="text-[11px] text-slate-400">1 h ago</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-emerald-950 border border-emerald-800/40 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                <Camera className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className={`text-xs font-medium ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>Screenshot indexed: competitor pricing page</div>
                <div className="text-[11px] text-slate-400">3 h ago</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-blue-950 border border-blue-800/40 flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
                <Mic className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className={`text-xs font-medium ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>Sample voice recording (no transcript)</div>
                <div className="text-[11px] text-slate-400">Demo preset</div>
              </div>
            </div>
          </div>}
        </div>

        {/* Surface a real, less-recently-updated note instead of speculative links. */}
        <div className={`p-6 rounded-xl border shadow-sm flex flex-col justify-between ${
          darkMode ? 'bg-[#0c1024] border-indigo-950/80' : 'bg-white border-slate-200'
        }`}>
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Clock3 className="w-4 h-4 text-cyan-400" aria-hidden="true" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Memory resurfacing</h3>
            </div>
            {rediscovery ? (
              <div className={`rounded-lg border p-4 ${
                darkMode ? 'bg-[#0e1329] border-indigo-950/80' : 'bg-slate-50 border-slate-200'
              }`}>
                <p className="mb-2 text-[10px] font-medium uppercase tracking-wide text-cyan-500">
                  {rediscovery.daysSinceUpdate === 0
                    ? 'Last updated today'
                    : `Last updated ${rediscovery.daysSinceUpdate} ${rediscovery.daysSinceUpdate === 1 ? 'day' : 'days'} ago`}
                </p>
                <p className={`line-clamp-2 text-sm font-semibold ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                  {rediscovery.note.title?.trim() || 'Untitled note'}
                </p>
                {typeof rediscovery.note.content === 'string' && rediscovery.note.content.trim() && (
                  <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-400">
                    {rediscovery.note.content.trim()}
                  </p>
                )}
                {Array.isArray(rediscovery.note.tags) && rediscovery.note.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5" aria-label="Note tags">
                    {rediscovery.note.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="rounded-full border border-indigo-800/50 px-2 py-0.5 text-[10px] text-indigo-300">
                        #{String(tag).replace(/^#+/, '')}
                      </span>
                    ))}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => onNavigate('notes', { state: { noteId: rediscovery.note.id } })}
                  className="mt-4 inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-indigo-500/40 px-3 text-xs font-semibold text-indigo-300 transition-colors hover:bg-indigo-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                >
                  Revisit note
                  <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>
            ) : (
              <p className="text-xs leading-relaxed text-slate-400">
                Save a note to your {isRealTimeMode ? 'workspace' : 'demo workspace'} and it can appear here when it has a revisit date.
              </p>
            )}
            <p className={`mt-4 text-[11px] ${darkMode ? 'text-slate-500' : 'text-slate-600'}`}>
              A local reminder based on your saved notes; no AI-generated links or suggestions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
