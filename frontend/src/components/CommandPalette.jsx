import React, { useState, useEffect } from 'react';
import {
  Search,
  LayoutDashboard,
  Sparkles,
  Share2,
  FileText,
  Files,
  Users2,
  Mic,
  Camera,
  FolderKanban,
  Clock,
  BarChart3,
  Contact,
  MapPin,
  Database,
  Cloud,
  Settings,
  CreditCard,
  ShieldAlert,
  ArrowRight,
  Brain,
  LayoutGrid,
  Zap,
  Webhook
} from 'lucide-react';

export const CommandPalette = ({
  isOpen,
  onClose,
  onNavigate,
  darkMode,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const items = [
    { label: 'Dashboard Overview', view: 'dashboard', group: 'Navigation', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'AI Assistant & Reasoning', view: 'assistant', group: 'Navigation', icon: <Sparkles className="w-4 h-4" /> },
    { label: 'Hybrid Semantic Search', view: 'search', group: 'Navigation', icon: <Search className="w-4 h-4" /> },
    { label: 'Knowledge Graph Explorer', view: 'graph', group: 'Navigation', icon: <Share2 className="w-4 h-4" /> },
    { label: 'Smart Notes & Backlinks', view: 'notes', group: 'Capture', icon: <FileText className="w-4 h-4" /> },
    { label: 'Documents & Chunks', view: 'documents', group: 'Capture', icon: <Files className="w-4 h-4" /> },
    { label: 'Meetings & Transcripts', view: 'meetings', group: 'Capture', icon: <Users2 className="w-4 h-4" /> },
    { label: 'Voice Memory & Audio', view: 'voice', group: 'Capture', icon: <Mic className="w-4 h-4" /> },
    { label: 'Screenshot Search & OCR', view: 'screenshots', group: 'Capture', icon: <Camera className="w-4 h-4" /> },
    { label: 'Timeline & History', view: 'timeline', group: 'Organize', icon: <Clock className="w-4 h-4" /> },
    { label: 'Productivity Insights', view: 'insights', group: 'Organize', icon: <BarChart3 className="w-4 h-4" /> },
    { label: 'Collections & Binders', view: 'collections', group: 'Organize', icon: <FolderKanban className="w-4 h-4" /> },
    { label: 'Flashcards & Spaced Repetition (SM-2)', view: 'flashcards', group: 'Organize', icon: <Brain className="w-4 h-4" /> },
    { label: 'Spatial Mind Whiteboard', view: 'canvas', group: 'Organize', icon: <LayoutGrid className="w-4 h-4" /> },
    { label: 'Contacts Knowledge Graph', view: 'contacts', group: 'Network & Map', icon: <Contact className="w-4 h-4" /> },
    { label: 'Geo-Spatial Memory Map', view: 'map', group: 'Network & Map', icon: <MapPin className="w-4 h-4" /> },
    { label: 'CloudSQL & pgvector Studio', view: 'cloudsql', group: 'Infrastructure', icon: <Database className="w-4 h-4" /> },
    { label: 'Firebase Cloud Sync Hub', view: 'firebase', group: 'Infrastructure', icon: <Cloud className="w-4 h-4" /> },
    { label: 'Automations & Flow Pipelines', view: 'workflows', group: 'Infrastructure', icon: <Zap className="w-4 h-4" /> },
    { label: 'API & Webhooks Platform', view: 'webhooks', group: 'Infrastructure', icon: <Webhook className="w-4 h-4" /> },
    { label: 'Account Settings', view: 'settings', group: 'Account', icon: <Settings className="w-4 h-4" /> },
    { label: 'Billing & Subscriptions', view: 'billing', group: 'Account', icon: <CreditCard className="w-4 h-4" /> },
    { label: 'Admin Console & Audit', view: 'admin', group: 'Admin', icon: <ShieldAlert className="w-4 h-4" /> },
  ];

  const filtered = items.filter(
    (i) =>
      i.label.toLowerCase().includes(query.toLowerCase()) ||
      i.group.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-100">
      <div className={`w-full max-w-lg rounded-xl shadow-[0_0_50px_-10px_rgba(99,102,241,0.3)] overflow-hidden border ${
        darkMode ? 'bg-[#0c1024] border-indigo-900/60' : 'bg-white border-slate-200'
      }`}>
        {/* Search input */}
        <div className={`flex items-center px-4 border-b ${
          darkMode ? 'border-indigo-950/80 bg-[#090c1c]' : 'border-slate-200 bg-slate-50'
        }`}>
          <Search className="w-4 h-4 text-indigo-400 shrink-0 mr-3" />
          <input
            type="text"
            autoFocus
            placeholder="Search or jump to views, memories, documents..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={`w-full py-3.5 text-xs bg-transparent focus:outline-none ${
              darkMode ? 'text-white placeholder-slate-500' : 'text-slate-900 placeholder-slate-400'
            }`}
          />
          <kbd className="text-[10px] text-slate-400 px-1.5 py-0.5 rounded bg-slate-800/40 border border-slate-700/50">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto p-2 divide-y divide-indigo-950/20">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              No matching pages or memories found
            </div>
          ) : (
            filtered.map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  onNavigate(item.view);
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors text-left group ${
                  darkMode
                    ? 'text-slate-300 hover:text-white hover:bg-indigo-900/30'
                    : 'text-slate-700 hover:text-slate-950 hover:bg-indigo-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-slate-400 group-hover:text-indigo-400">
                    {item.icon}
                  </span>
                  <div>
                    <div className={`text-xs font-medium ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                      {item.label}
                    </div>
                    <div className="text-[10px] text-slate-500">{item.group}</div>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" />
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
