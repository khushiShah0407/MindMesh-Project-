import React from 'react';
import {
  BarChart3,
  TrendingUp,
  Sparkles,
  Share2,
  AlertCircle,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export const InsightsPage = ({ onNavigate, darkMode }) => {
  return (
    <div className="max-w-6xl mx-auto p-4 lg:p-8 space-y-6">
      {/* Header matching Screenshot 19 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className={`text-xl font-bold tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              Insights
            </h1>
            <span className={`px-2 py-0.5 rounded-full border text-[10px] font-semibold ${
              darkMode ? 'bg-indigo-950 border-indigo-800/60 text-indigo-300' : 'bg-indigo-50 border-indigo-200 text-indigo-700'
            }`}>
              DEMO DATA
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Every chart links to its source captures. You control what generates insights.
          </p>
        </div>

        <button
          onClick={() => onNavigate('settings')}
          className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
        >
          Control insight generation →
        </button>
      </div>

      {/* 4 Big Insight Grid Panels matching Screenshot 19 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Panel 1: Capture Velocity */}
        <div className={`p-6 rounded-2xl border space-y-4 ${
          darkMode ? 'bg-[#0c1024] border-indigo-950/80' : 'bg-white border-slate-200'
        }`}>
          <div>
            <div className="flex items-center justify-between">
              <h3 className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                Capture velocity
              </h3>
              <TrendingUp className="w-4 h-4 text-cyan-400" />
            </div>
            <p className="text-[11px] text-slate-400">
              Memories + notes per week · source: capture events
            </p>
          </div>

          {/* SVG Line / Area Graph */}
          <div className="h-44 w-full relative pt-4">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 400 120">
              <defs>
                <linearGradient id="velocityGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M 10 90 Q 60 70 120 75 T 240 45 T 320 30 T 390 15"
                fill="none"
                stroke="#6366f1"
                strokeWidth="2.5"
              />
              <path
                d="M 10 90 Q 60 70 120 75 T 240 45 T 320 30 T 390 15 L 390 120 L 10 120 Z"
                fill="url(#velocityGrad)"
              />
              {/* Data points */}
              {[
                { cx: 10, cy: 90 },
                { cx: 70, cy: 75 },
                { cx: 130, cy: 73 },
                { cx: 190, cy: 60 },
                { cx: 250, cy: 42 },
                { cx: 310, cy: 30 },
                { cx: 390, cy: 15 },
              ].map((p, idx) => (
                <circle key={idx} cx={p.cx} cy={p.cy} r="3" fill="#06b6d4" />
              ))}
            </svg>
            <div className="flex justify-between text-[10px] text-slate-500 font-mono pt-2 border-t border-indigo-950/40">
              <span>W1</span>
              <span>W2</span>
              <span>W3</span>
              <span>W4</span>
              <span>W5</span>
              <span>W6</span>
              <span>W7</span>
              <span>W8</span>
            </div>
          </div>
        </div>

        {/* Panel 2: Frequently Referenced Topics */}
        <div className={`p-6 rounded-2xl border space-y-4 ${
          darkMode ? 'bg-[#0c1024] border-indigo-950/80' : 'bg-white border-slate-200'
        }`}>
          <div>
            <h3 className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              Frequently referenced topics
            </h3>
            <p className="text-[11px] text-slate-400">
              Derived from memory tags and entity mentions · source: memory vault
            </p>
          </div>

          {/* Bar Chart matching Screenshot 19 */}
          <div className="h-44 flex items-end justify-between gap-3 pt-4 px-2">
            {[
              { label: 'AI retrieval', value: 48, max: 60, color: 'bg-indigo-500' },
              { label: 'Pricing', value: 35, max: 60, color: 'bg-cyan-500' },
              { label: 'Reading', value: 28, max: 60, color: 'bg-purple-500' },
              { label: 'Product', value: 24, max: 60, color: 'bg-blue-500' },
              { label: 'Admin', value: 14, max: 60, color: 'bg-slate-500' },
            ].map((topic, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-[10px] font-mono text-slate-400">{topic.value}</span>
                <div className="w-full bg-slate-900/60 rounded-t-lg h-28 flex items-end">
                  <div
                    className={`w-full ${topic.color} rounded-t-md transition-all`}
                    style={{ height: `${(topic.value / topic.max) * 100}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-400 truncate w-full text-center">
                  {topic.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Panel 3: Neural Connectivity */}
        <div className={`p-6 rounded-2xl border space-y-4 ${
          darkMode ? 'bg-[#0c1024] border-indigo-950/80' : 'bg-white border-slate-200'
        }`}>
          <div>
            <h3 className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              Neural connectivity
            </h3>
            <p className="text-[11px] text-slate-400">
              Approved graph edges over time · source: knowledge graph
            </p>
          </div>

          <div className="h-44 w-full relative pt-4">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 400 120">
              <path
                d="M 10 100 L 70 85 L 140 70 L 200 55 L 270 40 L 330 25 L 390 10"
                fill="none"
                stroke="#06b6d4"
                strokeWidth="2.5"
              />
              {[
                { cx: 10, cy: 100 },
                { cx: 70, cy: 85 },
                { cx: 140, cy: 70 },
                { cx: 200, cy: 55 },
                { cx: 270, cy: 40 },
                { cx: 330, cy: 25 },
                { cx: 390, cy: 10 },
              ].map((p, idx) => (
                <circle key={idx} cx={p.cx} cy={p.cy} r="3" fill="#a855f7" />
              ))}
            </svg>
            <div className="flex justify-between text-[10px] text-slate-500 font-mono pt-2 border-t border-indigo-950/40">
              <span>W1</span>
              <span>W2</span>
              <span>W3</span>
              <span>W4</span>
              <span>W5</span>
              <span>W6</span>
              <span>W7</span>
              <span>W8</span>
            </div>
          </div>
        </div>

        {/* Panel 4: Textual Intelligence Insights */}
        <div className={`p-6 rounded-2xl border space-y-4 flex flex-col justify-between ${
          darkMode ? 'bg-[#0c1024] border-indigo-950/80' : 'bg-white border-slate-200'
        }`}>
          <div className="space-y-3">
            {/* Knowledge Gaps */}
            <div className={`p-3.5 rounded-xl border space-y-1.5 ${
              darkMode ? 'bg-[#090d22] border-indigo-950' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>KNOWLEDGE GAPS</span>
              </div>
              <p className={`text-xs leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                "Pricing v2" is heavily documented, but nothing references competitor Feature B comparisons — you may want a capture there before the board deck.
              </p>
              <button
                onClick={() => onNavigate('search')}
                className="text-[11px] text-cyan-400 hover:text-cyan-300 underline font-medium block"
              >
                Search related captures →
              </button>
            </div>

            {/* Disconnected Ideas */}
            <div className={`p-3.5 rounded-xl border space-y-1.5 ${
              darkMode ? 'bg-[#090d22] border-indigo-950' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-purple-400 uppercase tracking-wider">
                <Share2 className="w-3.5 h-3.5" />
                <span>DISCONNECTED IDEAS</span>
              </div>
              <p className={`text-xs leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                "Onboarding should ask use-cases" and "Weekly review template" are both about activation — but share no edges. Suggested link awaits approval.
              </p>
              <button
                onClick={() => onNavigate('graph')}
                className="text-[11px] text-indigo-400 hover:text-indigo-300 underline font-medium block"
              >
                Review in the graph →
              </button>
            </div>

            {/* Weekly Review Draft */}
            <div className={`p-3.5 rounded-xl border space-y-1.5 ${
              darkMode ? 'bg-[#090d22] border-indigo-950' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>WEEKLY REVIEW</span>
              </div>
              <p className={`text-xs leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                A draft review is ready from this week's 14 captures — decisions, open loops and one suggestion to delete something.
              </p>
              <button
                onClick={() => onNavigate('assistant')}
                className="text-[11px] text-emerald-400 hover:text-emerald-300 underline font-medium block"
              >
                Open in assistant →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
