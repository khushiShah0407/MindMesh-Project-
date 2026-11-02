import React, { useState } from 'react';
import {
  Clock,
  Search,
  Sparkles,
  FileText,
  Users2,
  Mic,
  Camera,
  Archive,
  ArrowRight
} from 'lucide-react';

export const TimelinePage = ({
  events: initialEvents,
  onNavigate,
  darkMode,
}) => {
  const [events] = useState(initialEvents);
  const [filterQuery, setFilterQuery] = useState('');
  const [granularity, setGranularity] = useState('Day');

  const filtered = events.filter(
    (e) =>
      e.title.toLowerCase().includes(filterQuery.toLowerCase()) ||
      e.category.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const groups = ['Today', 'Yesterday', 'Nov 28', 'Nov 27'];

  return (
    <div className="max-w-4xl mx-auto p-4 lg:p-8 space-y-6">
      {/* Top Header matching Screenshot 18 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className={`text-xl font-bold tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              Timeline
            </h1>
            <span className={`px-2 py-0.5 rounded-full border text-[10px] font-semibold ${
              darkMode ? 'bg-indigo-950 border-indigo-800/60 text-indigo-300' : 'bg-indigo-50 border-indigo-200 text-indigo-700'
            }`}>
              DEMO DATA
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Everything you captured, in order. Dates inferred by AI are labeled.
          </p>
        </div>

        {/* Granularity & Filter */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Filter events..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className={`pl-8 pr-3 py-1.5 text-xs rounded-lg w-44 border focus:outline-none focus:border-indigo-500 ${
                darkMode ? 'bg-[#0c1024] border-indigo-950 text-white placeholder-slate-500' : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
              }`}
            />
          </div>

          <div className={`flex items-center rounded-lg border p-0.5 ${
            darkMode ? 'bg-[#0c1024] border-indigo-950' : 'bg-white border-slate-300'
          }`}>
            {['Day', 'Week', 'Month', 'Year'].map((g) => (
              <button
                key={g}
                onClick={() => setGranularity(g)}
                className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
                  granularity === g
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chronological Timeline Groups */}
      <div className="space-y-8">
        {groups.map((group) => {
          const groupEvents = filtered.filter((e) => e.dateGroup === group);
          if (groupEvents.length === 0) return null;

          return (
            <div key={group} className="space-y-3">
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold uppercase tracking-wider ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  {group}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  {group === 'Today' ? 'NOV 30' : group === 'Yesterday' ? 'NOV 29' : 'RECORDED'}
                </span>
                <div className={`flex-1 border-t ${darkMode ? 'border-indigo-950' : 'border-slate-200'}`} />
              </div>

              <div className="space-y-2.5 pl-3 border-l-2 border-indigo-900/40">
                {groupEvents.map((evt) => (
                  <div
                    key={evt.id}
                    className={`p-3.5 rounded-xl border flex items-center justify-between gap-4 transition-all hover:border-indigo-600/40 ${
                      darkMode ? 'bg-[#0c1024] border-indigo-950/80' : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className={`text-xs font-semibold ${darkMode ? 'text-slate-200' : 'text-slate-900'}`}>
                        {evt.title}
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-[10px] font-mono text-indigo-400">
                        <span>{evt.category}</span>
                        {evt.inferredDate && (
                          <span className="text-cyan-400 flex items-center gap-1 font-sans">
                            <Sparkles className="w-2.5 h-2.5" />
                            AI-inferred date
                          </span>
                        )}
                      </div>
                    </div>

                    <span className="text-xs font-mono text-slate-400 shrink-0">
                      {evt.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer hint */}
      <div className="pt-6 text-center text-[11px] text-slate-500 font-mono">
        Time-zone-aware · visibility of each event type is configurable in Settings
      </div>
    </div>
  );
};
