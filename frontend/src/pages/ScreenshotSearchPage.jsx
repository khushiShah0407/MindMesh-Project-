import React, { useState } from 'react';
import { Search, Camera, Sparkles, ExternalLink } from 'lucide-react';

export const ScreenshotSearchPage = ({
  screenshots: initialScreenshots,
  darkMode,
}) => {
  const [screenshots] = useState(initialScreenshots);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedShot, setSelectedShot] = useState(null);

  const filtered = screenshots.filter(
    (s) =>
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.extractedText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto p-4 lg:p-8 space-y-6">
      {/* Top Header matching Screenshot 17 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className={`text-xl font-bold tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              Screenshot search
            </h1>
            <span className={`px-2 py-0.5 rounded-full border text-[10px] font-semibold ${
              darkMode ? 'bg-indigo-950 border-indigo-800/60 text-indigo-300' : 'bg-indigo-50 border-indigo-200 text-indigo-700'
            }`}>
              DEMO DATA
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Demo sample text only — OCR and image understanding are not connected
          </p>
        </div>

        {/* Right Search Input matching Screenshot 17 */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder='Search visible text... "recall@10"'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`pl-8 pr-3 py-1.5 text-xs rounded-lg w-64 border focus:outline-none focus:border-indigo-500 ${
              darkMode ? 'bg-[#0c1024] border-indigo-950 text-white placeholder-slate-500' : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
            }`}
          />
        </div>
      </div>

      {/* Grid of Screenshot Cards matching Screenshot 17 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((shot) => (
          <div
            key={shot.id}
            onClick={() => setSelectedShot(shot)}
            className={`p-5 rounded-2xl border transition-all cursor-pointer group shadow-sm hover:shadow-[0_0_25px_-5px_rgba(99,102,241,0.25)] flex flex-col justify-between ${
              darkMode ? 'bg-[#0c1024] border-indigo-950/80 hover:border-indigo-600/50' : 'bg-white border-slate-200 hover:border-indigo-300'
            }`}
          >
            <div>
              {/* Screenshot Visual Mock Box */}
              <div className={`h-36 rounded-xl border mb-4 p-3 flex flex-col justify-between relative overflow-hidden bg-gradient-to-br ${shot.colorTheme} ${
                darkMode ? 'border-indigo-900/40' : 'border-slate-300'
              }`}>
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span className="flex items-center gap-1">
                    <Camera className="w-3 h-3 text-cyan-400" />
                    Sample text
                  </span>
                  <span>{shot.date}</span>
                </div>

                <div className="space-y-1">
                  <div className="w-3/4 h-2 bg-white/20 rounded" />
                  <div className="w-1/2 h-2 bg-white/15 rounded" />
                </div>

                <div className="text-[10px] text-slate-300 font-mono line-clamp-1 bg-black/40 px-2 py-0.5 rounded backdrop-blur-sm">
                  {shot.extractedText}
                </div>
              </div>

              {/* Title & Subtitle */}
              <h3 className={`text-sm font-bold group-hover:text-indigo-400 transition-colors ${
                darkMode ? 'text-white' : 'text-slate-900'
              }`}>
                {shot.title}
              </h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                {shot.subtitle}
              </p>
            </div>

            {/* Category & Date */}
            <div className="flex items-center justify-between pt-3 mt-3 border-t border-indigo-950/40 text-[10px] font-mono">
              <span className="text-indigo-400 font-semibold tracking-wider">
                {shot.category}
              </span>
              <span className="text-slate-400">{shot.date}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal if clicked */}
      {selectedShot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className={`max-w-lg w-full p-6 rounded-2xl border shadow-2xl space-y-4 ${
            darkMode ? 'bg-[#0c1024] border-indigo-900 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase">
                {selectedShot.category} · {selectedShot.date}
              </span>
              <button
                onClick={() => setSelectedShot(null)}
                className="text-xs text-slate-400 hover:text-white"
              >
                Close
              </button>
            </div>
            <h3 className="text-lg font-bold">{selectedShot.title}</h3>
            <p className="text-xs text-slate-400">{selectedShot.subtitle}</p>

            <div className={`p-4 rounded-xl border text-xs font-mono leading-relaxed ${
              darkMode ? 'bg-[#070914] border-indigo-950 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}>
              <div className="text-[10px] text-indigo-400 uppercase font-bold mb-1">Sample text (not extracted)</div>
              {selectedShot.extractedText}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedShot(null)}
                className="px-4 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
