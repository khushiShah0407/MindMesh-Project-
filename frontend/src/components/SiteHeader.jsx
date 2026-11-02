import React, { useState } from 'react';
import { Menu, Moon, Sun, X } from 'lucide-react';
import { BrandMark } from './BrandMark.jsx';

export const SiteHeader = ({
  onNavigate,
  darkMode,
  onToggleTheme,
  current = 'home',
}) => {
  const [open, setOpen] = useState(false);

  const links = [
    { id: 'features', label: 'Features' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'use-cases', label: 'Use cases' },
    { id: 'security', label: 'Security' },
  ];

  const go = (id) => {
    onNavigate(id);
    setOpen(false);
  };

  return (
    <nav
      className={`sticky top-0 z-40 border-b backdrop-blur-md px-6 py-4 flex items-center justify-between transition-colors ${
        darkMode ? 'bg-[#070913]/90 border-indigo-950/70' : 'bg-white/90 border-slate-200'
      }`}
    >
      <div className="flex items-center gap-8">
        <button onClick={() => go('home')} className="flex items-center gap-2.5 cursor-pointer">
          <BrandMark />
          <span className={`font-bold text-sm tracking-wider ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            MindMesh
          </span>
        </button>

        <div className="hidden md:flex items-center gap-6 text-xs font-medium">
          {links.map((link) => (
            <button
              key={link.id}
              onClick={() => go(link.id)}
              className={`transition-colors ${
                current === link.id
                  ? darkMode
                    ? 'text-indigo-300'
                    : 'text-indigo-700'
                  : darkMode
                  ? 'text-slate-400 hover:text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {onToggleTheme && (
          <button
            onClick={onToggleTheme}
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              darkMode ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
          </button>
        )}
        <button
          onClick={() => go('signin')}
          className={`text-xs font-medium transition-colors hidden sm:block ${
            darkMode ? 'text-slate-300 hover:text-white' : 'text-slate-700 hover:text-slate-950'
          }`}
        >
          Sign in
        </button>
        <button
          onClick={() => go('register')}
          className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-[0_0_20px_-3px_rgba(99,102,241,0.5)] transition-all cursor-pointer"
        >
          Get started
        </button>
        <button
          onClick={() => setOpen((v) => !v)}
          className={`p-2 rounded-lg md:hidden ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}
          aria-label="Open menu"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {open && (
        <div
          className={`absolute top-full left-0 right-0 border-b p-4 md:hidden space-y-2 ${
            darkMode ? 'bg-[#0b1020] border-indigo-950' : 'bg-white border-slate-200'
          }`}
        >
          {links.map((link) => (
            <button
              key={link.id}
              onClick={() => go(link.id)}
              className={`block w-full text-left px-3 py-2 rounded-lg text-sm ${
                darkMode ? 'text-slate-200 hover:bg-slate-800' : 'text-slate-800 hover:bg-slate-100'
              }`}
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => go('signin')}
            className={`block w-full text-left px-3 py-2 rounded-lg text-sm ${
              darkMode ? 'text-slate-200 hover:bg-slate-800' : 'text-slate-800 hover:bg-slate-100'
            }`}
          >
            Sign in
          </button>
        </div>
      )}
    </nav>
  );
};
