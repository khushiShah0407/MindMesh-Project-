import React from 'react';
import { Brain } from 'lucide-react';

export const NotFoundPage = ({ onNavigate, darkMode }) => {
  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-6 text-center ${
      darkMode ? 'bg-[#070913] text-white' : 'bg-slate-50 text-slate-900'
    }`}>
      <div className="relative z-10 max-w-md space-y-4">
        <div className="text-[11px] font-mono tracking-widest text-slate-500 uppercase">
          404 · UNMAPPED THOUGHT
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          This memory doesn't exist.
        </h1>
        <p className="text-xs text-slate-400">
          The node or document you are trying to reach has either been purged or was never indexed in this vault.
        </p>
        <div className="pt-4">
          <button
            onClick={() => onNavigate('dashboard')}
            className="px-6 py-2.5 rounded-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold text-xs shadow-[0_0_25px_-5px_rgba(99,102,241,0.5)] transition-all cursor-pointer"
          >
            Back to MindMesh
          </button>
        </div>
      </div>
    </div>
  );
};
