import React from 'react';
import {
  Search,
  Plus,
  Sun,
  Moon,
  Menu,
  Command,
  LogOut,
  Database,
} from 'lucide-react';

export const Header = ({
  user,
  darkMode,
  isRealTimeMode,
  syncState = 'idle',
  isOnline = true,
  syncError = '',
  onToggleRealTimeMode,
  onToggleTheme,
  onOpenCapture,
  onOpenCommand,
  onOpenMobileNav,
  onOpenProfile,
  onLogout,
}) => {
  const connectionState = !isRealTimeMode
    ? { label: 'DEMO', className: 'bg-indigo-950/80 border-indigo-800/50 text-indigo-300' }
    : !isOnline
      ? { label: 'OFFLINE', className: 'bg-rose-950/80 border-rose-800/60 text-rose-300' }
      : syncState === 'saving' || syncState === 'loading'
        ? { label: 'SYNCING', className: 'bg-amber-950/80 border-amber-800/60 text-amber-300' }
        : syncState === 'synced'
          ? { label: 'LIVE', className: 'bg-emerald-950/80 border-emerald-700/60 text-emerald-300' }
          : syncState === 'cached'
            ? { label: 'CACHED', className: 'bg-amber-950/80 border-amber-800/60 text-amber-300' }
            : { label: 'ERROR', className: 'bg-rose-950/80 border-rose-800/60 text-rose-300' };
  return (
    <header className={`h-16 sticky top-0 z-30 px-2.5 sm:px-4 lg:px-8 flex items-center justify-between border-b backdrop-blur-md transition-colors ${
      darkMode
        ? 'bg-[#090c1a]/90 border-indigo-950/70 text-slate-100'
        : 'bg-white/90 border-slate-200 text-slate-800'
    }`}>
      {/* Left: Mobile hamburger & Search bar */}
      <div className="flex min-w-0 flex-1 items-center gap-1 sm:gap-3 max-w-xl">
        <button
          type="button"
          onClick={onOpenMobileNav}
          className={`min-h-10 min-w-10 shrink-0 flex items-center justify-center rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 lg:hidden ${
            darkMode ? 'text-slate-400 hover:text-white hover:bg-slate-800/60' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
          aria-label="Open navigation"
          aria-controls="workspace-navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search trigger matching screenshot design */}
        <button
          type="button"
          onClick={onOpenCommand}
          aria-label="Search or jump to"
          className={`min-h-10 min-w-0 flex-1 w-full max-w-md flex items-center justify-between px-2.5 sm:px-3.5 py-1.5 rounded-lg border text-xs transition-all shadow-inner group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${
            darkMode
              ? 'bg-[#0d1226] border-indigo-900/40 hover:border-indigo-500/50 text-slate-400 hover:text-slate-200'
              : 'bg-slate-50 border-slate-300 hover:border-indigo-400 text-slate-600 hover:text-slate-900'
          }`}
        >
          <div className="min-w-0 flex items-center gap-2">
            <Search className={`w-3.5 h-3.5 transition-colors ${
              darkMode ? 'text-slate-400 group-hover:text-indigo-400' : 'text-slate-500 group-hover:text-indigo-600'
            }`} />
            <span className="truncate font-normal">Search<span className="hidden sm:inline"> or jump to...</span></span>
          </div>
          <div className={`hidden sm:flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono border ${
            darkMode
              ? 'bg-[#131935] text-slate-400 border-indigo-950'
              : 'bg-slate-200 text-slate-600 border-slate-300'
          }`}>
            <Command className="w-2.5 h-2.5" />
            <span>K</span>
          </div>
        </button>
      </div>

      {/* Right: Actions matching screenshot */}
      <div className="flex shrink-0 items-center gap-0.5 sm:gap-3">
        {/* Real-time Storage / Demo Mode Pill */}
        <button
          type="button"
          onClick={onToggleRealTimeMode}
          aria-label={`Connection status: ${connectionState.label}`}
          title={syncError || (isRealTimeMode ? 'Private Firebase workspace. Click to switch to the separate demo dataset.' : 'Demo dataset. Click to try Live Real-Time if a Firebase account is signed in.')}
          className={`min-h-10 min-w-10 flex shrink-0 items-center justify-center gap-1 px-1.5 min-[360px]:px-2 rounded-full border text-[9px] sm:text-[11px] font-medium transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${connectionState.className}`}
        >
          {connectionState.label === 'DEMO' ? (
            <Database className="h-3.5 w-3.5 text-cyan-300" aria-hidden="true" />
          ) : (
            <span aria-hidden="true" className={`w-1.5 h-1.5 rounded-full ${
              connectionState.label === 'LIVE' ? 'bg-emerald-400'
                : connectionState.label === 'SYNCING' ? 'bg-amber-400 animate-pulse'
                  : 'bg-rose-400'
            }`} />
          )}
          <span className="hidden min-[360px]:inline">{connectionState.label}</span>
        </button>

        {/* Theme toggle */}
        <button
          type="button"
          onClick={onToggleTheme}
          className={`flex min-h-10 min-w-10 shrink-0 items-center justify-center rounded-lg transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${
            darkMode ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
        </button>

        {/* + Capture Button */}
        <button
          type="button"
          onClick={onOpenCapture}
          aria-label="Capture a thought"
          className="min-h-10 min-w-10 flex shrink-0 items-center justify-center gap-1.5 px-2.5 sm:px-3.5 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-semibold shadow-[0_0_20px_-3px_rgba(99,102,241,0.5)] transition-all cursor-pointer active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Capture</span>
        </button>

        {/* User Avatar */}
        <button
          type="button"
          onClick={onOpenProfile}
          className={`hidden min-[480px]:flex min-h-10 min-w-10 shrink-0 rounded-lg border items-center justify-center text-xs font-bold transition-all shadow-sm cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${
            darkMode
              ? 'bg-indigo-900/60 border-indigo-500/40 text-indigo-200 hover:border-indigo-400 hover:text-white'
              : 'bg-indigo-100 border-indigo-300 text-indigo-800 hover:bg-indigo-200'
          }`}
          title={`${user.name} (${user.email})`}
          aria-label={`Open profile for ${user.name}`}
        >
          {user.avatar || 'AL'}
        </button>

        {/* Logout */}
        <button
          type="button"
          onClick={onLogout}
          className={`hidden min-[480px]:flex min-h-10 min-w-10 shrink-0 items-center justify-center rounded-lg transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${
            darkMode ? 'text-slate-400 hover:text-rose-400 hover:bg-slate-800/60' : 'text-slate-600 hover:text-rose-600 hover:bg-slate-100'
          }`}
          title="Sign out of MindMesh"
          aria-label="Sign out of MindMesh"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
