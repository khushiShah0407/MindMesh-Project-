import React, { useEffect, useRef, useState } from 'react';
import { BrandMark } from './BrandMark.jsx';
import {
  LayoutDashboard,
  Sparkles,
  Search,
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
  Globe,
  LogOut,
  X,
  Brain,
  LayoutGrid,
  Zap,
  Webhook,
  Utensils
} from 'lucide-react';

export const Sidebar = ({
  currentView,
  onNavigate,
  mobileOpen,
  onCloseMobile,
  onLogout,
  darkMode,
}) => {
  const sidebarRef = useRef(null);
  const closeButtonRef = useRef(null);
  const previousFocusRef = useRef(null);
  const onCloseMobileRef = useRef(onCloseMobile);
  const [isDesktop, setIsDesktop] = useState(false);
  const mobileDialogOpen = mobileOpen && !isDesktop;
  onCloseMobileRef.current = onCloseMobile;

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1024px)');
    const updateViewport = () => setIsDesktop(mediaQuery.matches);
    updateViewport();
    mediaQuery.addEventListener('change', updateViewport);
    return () => mediaQuery.removeEventListener('change', updateViewport);
  }, []);

  useEffect(() => {
    if (!mobileDialogOpen) {
      previousFocusRef.current?.focus?.();
      previousFocusRef.current = null;
      return undefined;
    }

    previousFocusRef.current = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onCloseMobileRef.current();
        return;
      }

      if (event.key !== 'Tab' || !sidebarRef.current) return;
      const focusableElements = sidebarRef.current.querySelectorAll(
        'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
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

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileDialogOpen]);

  const navigateTo = (view) => {
    onNavigate(view);
    onCloseMobile();
  };

  const navSection = (title, items) => (
    <div className="mb-5">
      <div className={`px-3 mb-1.5 text-[11px] font-semibold tracking-wider uppercase ${
        darkMode ? 'text-slate-400' : 'text-slate-500'
      }`}>
        {title}
      </div>
      <div className="space-y-0.5">
        {items.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => navigateTo(item.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`w-full min-h-10 flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${
                isActive
                  ? darkMode
                    ? 'bg-indigo-600/25 text-indigo-300 border border-indigo-500/40 shadow-[0_0_15px_-4px_rgba(99,102,241,0.35)] font-semibold'
                    : 'bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-sm font-semibold'
                  : darkMode
                  ? 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50 border border-transparent'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className={isActive ? (darkMode ? 'text-indigo-400' : 'text-indigo-600') : (darkMode ? 'text-slate-400' : 'text-slate-500')}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${
                  darkMode
                    ? 'bg-indigo-950 text-indigo-300 border-indigo-700/60'
                    : 'bg-indigo-100 text-indigo-700 border-indigo-200'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      <aside
        ref={sidebarRef}
        id="workspace-navigation"
        role={mobileDialogOpen ? 'dialog' : undefined}
        aria-modal={mobileDialogOpen || undefined}
        aria-label="Workspace navigation"
        aria-hidden={!isDesktop && !mobileOpen}
        inert={!isDesktop && !mobileOpen}
        className={`fixed left-0 top-[env(safe-area-inset-top)] bottom-[env(safe-area-inset-bottom)] z-50 h-auto max-h-[100dvh] w-64 max-w-[88vw] flex flex-col transition-transform duration-200 lg:top-0 lg:bottom-0 lg:translate-x-0 ${
          darkMode
            ? 'bg-[#090c1a] neural-grid-subtle border-r border-indigo-950/70 text-slate-100'
            : 'bg-white border-r border-slate-200 text-slate-800'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Brand Header */}
        <div className={`h-16 flex items-center justify-between px-4 border-b ${
          darkMode ? 'border-indigo-950/70 bg-[#070a16]' : 'border-slate-200 bg-slate-50/70'
        }`}>
          <button
            type="button"
            onClick={() => navigateTo('dashboard')}
            className="flex items-center gap-2.5 group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 rounded-lg"
            aria-label="MindMesh"
          >
            <BrandMark />
            <span className={`text-left font-bold text-sm tracking-wide transition-colors ${
              darkMode ? 'text-white group-hover:text-indigo-300' : 'text-slate-900 group-hover:text-indigo-600'
            }`}>
              MindMesh
            </span>
          </button>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onCloseMobile}
            className="min-h-10 min-w-10 flex items-center justify-center text-slate-400 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 rounded lg:hidden"
            aria-label="Close navigation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <nav aria-label="Workspace pages" className="min-h-0 flex-1 overflow-y-auto px-3 py-4 space-y-4 overscroll-contain">
          {navSection('WORKSPACE', [
            { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
            { id: 'assistant', label: 'Assistant', icon: <Sparkles className="w-4 h-4" /> },
            { id: 'search', label: 'Search', icon: <Search className="w-4 h-4" /> },
            { id: 'graph', label: 'Knowledge graph', icon: <Share2 className="w-4 h-4" /> },
          ])}

          {navSection('CAPTURE', [
            { id: 'notes', label: 'Notes', icon: <FileText className="w-4 h-4" /> },
            { id: 'documents', label: 'Documents', icon: <Files className="w-4 h-4" /> },
            { id: 'meetings', label: 'Meetings', icon: <Users2 className="w-4 h-4" /> },
            { id: 'voice', label: 'Voice memory', icon: <Mic className="w-4 h-4" /> },
            { id: 'screenshots', label: 'Screenshots', icon: <Camera className="w-4 h-4" /> },
            { id: 'food', label: 'Food memories', icon: <Utensils className="w-4 h-4" /> },
          ])}
          {navSection('ORGANIZE', [
            { id: 'collections', label: 'Collections', icon: <FolderKanban className="w-4 h-4" /> },
            { id: 'timeline', label: 'Timeline', icon: <Clock className="w-4 h-4" /> },
            { id: 'insights', label: 'Insights', icon: <BarChart3 className="w-4 h-4" /> },
            { id: 'flashcards', label: 'Flashcards Gym', icon: <Brain className="w-4 h-4" />, badge: 'SM-2' },
            { id: 'canvas', label: 'Mind Whiteboard', icon: <LayoutGrid className="w-4 h-4" />, badge: '2D' },
          ])}

          {navSection('NETWORK & MAP', [
            { id: 'contacts', label: 'Contacts Graph', icon: <Contact className="w-4 h-4" />, badge: 'New' },
            { id: 'map', label: 'Geo Memory Map', icon: <MapPin className="w-4 h-4" />, badge: 'GPS' },
          ])}

          {navSection('INFRASTRUCTURE', [
            { id: 'cloudsql', label: 'CloudSQL schema preview', icon: <Database className="w-4 h-4" />, badge: 'Preview' },
            { id: 'firebase', label: 'Firebase Cloud Sync', icon: <Cloud className="w-4 h-4" />, badge: 'Status' },
            { id: 'workflows', label: 'Workflow definitions', icon: <Zap className="w-4 h-4" />, badge: 'Preview' },
            { id: 'webhooks', label: 'Webhook definitions', icon: <Webhook className="w-4 h-4" />, badge: 'Preview' },
          ])}

          {navSection('ACCOUNT', [
            { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
            { id: 'billing', label: 'Billing & usage', icon: <CreditCard className="w-4 h-4" /> },
          ])}
        </nav>

        {/* Bottom utility links */}
        <div className={`p-3 border-t space-y-1 ${
          darkMode ? 'border-indigo-950/70 bg-[#070914]' : 'border-slate-200 bg-slate-50'
        }`}>
          <button
            type="button"
            onClick={() => navigateTo('admin')}
            aria-current={currentView.startsWith('admin') ? 'page' : undefined}
            className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${
              currentView.startsWith('admin')
                ? 'bg-purple-900/30 text-purple-300 border border-purple-700/50'
                : darkMode
                ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-purple-400" />
            <span>Admin console</span>
          </button>
          <button
            type="button"
            onClick={() => navigateTo('home')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${
              darkMode
                ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Back to site</span>
          </button>
          <button
            onClick={() => {
              onCloseMobile();
              onLogout?.();
            }}
            className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${
              darkMode
                ? 'text-slate-400 hover:text-rose-300 hover:bg-slate-800/40'
                : 'text-slate-600 hover:text-rose-700 hover:bg-slate-200'
            }`}
          >
            <LogOut className="w-4 h-4" />
            <span>Sign out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
