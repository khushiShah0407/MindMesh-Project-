import React from 'react';
import { Microscope, Code2, Rocket, PenTool, CheckSquare, GraduationCap, ArrowRight } from 'lucide-react';
import { BrandMark } from '../components/BrandMark.jsx';

export const UseCasesPage = ({ onNavigate, darkMode }) => {
  const personas = [
    {
      title: 'Researchers',
      sub: 'Papers in, questions out',
      icon: <Microscope className="w-5 h-5 text-indigo-400" />,
      bullets: [
        'Capture reading notes and source links',
        'Organize notes in collections',
        'Search saved records by keyword',
      ],
    },
    {
      title: 'Engineers',
      sub: 'Decisions that outlive tickets',
      icon: <Code2 className="w-5 h-5 text-cyan-400" />,
      bullets: [
        'Keep architecture notes in one workspace',
        'Browse saved notes in the knowledge graph',
        'Find records with local keyword search',
      ],
    },
    {
      title: 'Founders',
      sub: 'Investor updates from memory',
      icon: <Rocket className="w-5 h-5 text-purple-400" />,
      bullets: [
        'Keep meeting metadata and manual notes',
        'Collect ideas and project context',
        'Review saved records in the timeline',
      ],
    },
    {
      title: 'Writers',
      sub: 'A reel of your own thinking',
      icon: <PenTool className="w-5 h-5 text-amber-400" />,
      bullets: [
        'Capture and organize notes',
        'Keep screenshot references with sample labels',
        'Search saved text by keyword',
      ],
    },
    {
      title: 'Chiefs of staff',
      sub: 'Nobody drops the ball',
      icon: <CheckSquare className="w-5 h-5 text-emerald-400" />,
      bullets: [
        'Record follow-ups in meeting notes',
        'Track meeting metadata',
        'Review activity in the timeline',
      ],
    },
    {
      title: 'Clinicians & academics',
      sub: 'Reading lists that read back',
      icon: <GraduationCap className="w-5 h-5 text-rose-400" />,
      bullets: [
        'Organize reading notes in collections',
        'Capture key points manually',
        'Search the text you have saved',
      ],
    },
  ];

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-[#070913] text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      <header className="px-4 sm:px-6 py-4 border-b border-indigo-950 flex flex-wrap items-center justify-between gap-y-3 max-w-6xl mx-auto">
        <button onClick={() => onNavigate('home')} className="flex items-center gap-2 cursor-pointer">
          <BrandMark />
          <span className="font-bold text-sm tracking-wider text-white">MindMesh</span>
        </button>
        <div className="flex max-w-full flex-wrap items-center justify-end gap-x-3 gap-y-2 text-[11px] sm:gap-x-6 sm:text-xs">
          <button onClick={() => onNavigate('home')} className="text-slate-400 hover:text-white">Home</button>
          <button onClick={() => onNavigate('features')} className="text-slate-400 hover:text-white">Features</button>
          <button onClick={() => onNavigate('pricing')} className="text-slate-400 hover:text-white">Pricing</button>
          <button onClick={() => onNavigate('dashboard')} className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium">Workspace</button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-16 space-y-12">
        <div className="space-y-3">
          <div className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider">USE CASES</div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            One brain,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
              many kinds of thinking.
            </span>
          </h1>
          <p className="max-w-2xl text-xs leading-relaxed text-slate-400">
            These are example workflows, not a feature availability list. AI extraction, OCR, document indexing,
            automatic meeting capture, and collaboration are not connected in this build.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {personas.map((p, i) => (
            <div key={i} className="p-6 rounded-2xl bg-[#0c1024] border border-indigo-950/80 shadow-md space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">{p.icon}</div>
                <div>
                  <h3 className="text-sm font-bold text-white">{p.title}</h3>
                  <p className="text-[11px] text-slate-400">{p.sub}</p>
                </div>
              </div>
              <ul className="space-y-2 text-xs text-slate-300 pt-2 border-t border-indigo-950">
                {p.bullets.map((b, bi) => (
                  <li key={bi} className="flex items-start gap-1.5">
                    <span className="text-indigo-400 font-bold">•</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="text-center pt-8">
          <button
            onClick={() => onNavigate('register')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg transition-all cursor-pointer"
          >
            <span>Build yours in five minutes</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </main>
    </div>
  );
};
