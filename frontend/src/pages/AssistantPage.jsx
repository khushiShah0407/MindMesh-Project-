import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  Link2,
  ShieldCheck,
} from 'lucide-react';

export const AssistantPage = ({
  notes,
  meetings,
  onNavigate,
  darkMode,
}) => {
  const [messages, setMessages] = useState([
    {
      id: 'notice',
      sender: 'assistant',
      text: 'Ask about your saved notes or meetings. MindMesh currently provides local keyword retrieval only; no AI model or web search service is connected.',
      timestamp: '',
    },
  ]);

  const [input, setInput] = useState('');
  const handleSend = (e) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    const userMsg = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setInput('');
    const terms = userText.toLowerCase().split(/\W+/).filter((term) => term.length > 2);
    const records = [
      ...notes.map((record) => ({ ...record, type: 'Note' })),
      ...meetings.map((record) => ({ ...record, type: 'Meeting' })),
    ];
    const matches = records.map((record) => {
      const body = `${record.title || ''} ${record.content || ''} ${record.transcript || ''} ${record.summary || ''}`.toLowerCase();
      return { record, hits: terms.filter((term) => body.includes(term)).length };
    }).filter((match) => match.hits > 0).sort((a, b) => b.hits - a.hits).slice(0, 5);
    const botMsg = {
      id: `msg-${Date.now() + 1}`,
      sender: 'assistant',
      text: matches.length
        ? `Found ${matches.length} saved record${matches.length === 1 ? '' : 's'} with matching words. This is local keyword retrieval, not an AI-generated answer.`
        : 'No saved notes or meetings contain those search terms. Try different keywords or capture a note first.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sources: matches.map(({ record }) => ({
        title: record.title || 'Untitled record',
        type: record.type,
        date: record.createdAt || record.date || '',
        category: record.type.toLowerCase(),
        excerpt: (record.content || record.transcript || record.summary || '').slice(0, 180),
      })),
    };
    setMessages((previous) => [...previous, userMsg, botMsg]);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-5xl mx-auto p-4 lg:p-8">
      {/* Header Bar matching Screenshot 9 */}
      <div className={`flex items-center justify-between pb-4 border-b mb-6 ${
        darkMode ? 'border-indigo-950/80' : 'border-slate-200'
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className={`text-base font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                Assistant
              </h1>
              <span className={`px-2 py-0.5 rounded-full border text-[10px] font-semibold ${
                darkMode ? 'bg-indigo-950 border-indigo-800/60 text-indigo-300' : 'bg-indigo-50 border-indigo-200 text-indigo-700'
              }`}>
                LOCAL SEARCH
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Keyword matches from your saved notes and meetings · no AI or web service connected
            </p>
          </div>
        </div>

        <div className="text-[11px] text-slate-400 border border-indigo-900/60 rounded-lg px-3 py-2">AI unavailable</div>
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto space-y-6 pr-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.sender === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            {msg.sender === 'user' ? (
              <div className="max-w-xl px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-500 text-white text-xs md:text-sm font-medium shadow-[0_0_20px_-5px_rgba(99,102,241,0.4)]">
                {msg.text}
              </div>
            ) : (
              <div className="max-w-2xl space-y-3">
                <div className={`p-5 rounded-2xl border text-xs md:text-sm leading-relaxed shadow-sm ${
                  darkMode ? 'bg-[#0c1024] border-indigo-950/90 text-slate-200' : 'bg-white border-slate-200 text-slate-800'
                }`}>
                  {msg.text}
                </div>

                {/* Grounded Source Chips matching Screenshot 9 */}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 pt-1 pl-1">
                    {msg.sources.map((src, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          if (src.category === 'note') onNavigate('notes');
                          if (src.category === 'meeting') onNavigate('meetings');
                          if (src.category === 'database') onNavigate('cloudsql');
                        }}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[11px] transition-all group ${
                          darkMode
                            ? 'bg-[#0e142d] border-indigo-900/60 hover:border-indigo-600/60 text-slate-300 hover:text-white'
                            : 'bg-slate-50 border-slate-300 hover:border-indigo-400 text-slate-700 hover:text-slate-950'
                        }`}
                      >
                        <Link2 className="w-3 h-3 text-cyan-400 group-hover:rotate-45 transition-transform" />
                        <span className="font-medium">{src.title}</span>
                        <span className="text-slate-400">·</span>
                        <span className="text-slate-500">{src.type}</span>
                        <span className="text-[10px] text-indigo-400 bg-indigo-950/60 px-1 py-0.2 rounded">
                          {src.date}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

      </div>

      {/* Chat Input Bar matching Screenshot 9 */}
      <div className="pt-4">
        <form
          onSubmit={(e) => handleSend(e)}
          className={`relative border rounded-xl shadow-sm focus-within:border-indigo-500 transition-all ${
            darkMode ? 'bg-[#0c1024] border-indigo-900/60' : 'bg-white border-slate-300'
          }`}
        >
          <textarea
            rows={2}
            placeholder="Ask MindMesh... (Shift+Enter for newline)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            className={`w-full px-4 pt-3 pb-8 text-xs bg-transparent focus:outline-none resize-none font-sans ${
              darkMode ? 'text-white placeholder-slate-500' : 'text-slate-900 placeholder-slate-400'
            }`}
          />

          <div className="absolute bottom-2.5 left-4 right-3 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
              <ShieldCheck className="w-3 h-3 text-indigo-400" />
              <span>Retrieval-scoped context · never leaks your private vault</span>
            </div>

            <button
              type="submit"
              disabled={!input.trim()}
              className="p-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white transition-all shadow-md cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
