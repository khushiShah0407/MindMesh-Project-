import React, { useEffect, useMemo, useState } from 'react';
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const normalizeDate = (value) => {
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;
  if (value && typeof value.toDate === 'function') {
    const converted = value.toDate();
    return converted instanceof Date && !Number.isNaN(converted.getTime()) ? converted : null;
  }
  if (value && typeof value.seconds === 'number') {
    const converted = new Date(value.seconds * 1000);
    return Number.isNaN(converted.getTime()) ? null : converted;
  }
  if (typeof value === 'number' && Number.isFinite(value)) {
    const converted = new Date(value > 100_000_000_000 ? value : value > 1_000_000_000 ? value * 1000 : NaN);
    return Number.isNaN(converted.getTime()) ? null : converted;
  }
  if (typeof value === 'string') {
    if (!/\b\d{4}\b/.test(value)) return null;
    const parsed = Date.parse(value);
    return Number.isNaN(parsed) ? null : new Date(parsed);
  }
  return null;
};

export const HybridSearchPage = ({ onNavigate, darkMode, records = [] }) => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All types');
  const [page, setPage] = useState(0);
  const pageSize = 20;

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query.trim()), 180);
    return () => clearTimeout(timer);
  }, [query]);

  const types = [
    'All types',
    'Notes',
    'Documents',
    'Meetings',
    'Memories',
    'Screenshots',
    'Voice',
  ];

  const queryTerms = useMemo(() => debouncedQuery.toLowerCase().split(/\W+/).filter((term) => term.length > 1), [debouncedQuery]);
  const typeGroups = {
    Notes: new Set(['notes']),
    Documents: new Set(['documents']),
    Meetings: new Set(['meetings']),
    Memories: new Set(['geoMemories', 'foodMemories', 'contacts', 'collections']),
    Screenshots: new Set(['screenshots']),
    Voice: new Set(['voiceNotes']),
  };
  const results = queryTerms.length === 0 ? [] : records.map((record) => {
    const tags = Array.isArray(record.tags) ? record.tags.join(' ') : '';
    const decisions = Array.isArray(record.decisions) ? record.decisions.join(' ') : '';
    const transcript = Array.isArray(record.transcript)
      ? record.transcript.map((line) => `${line.speaker || ''} ${line.text || ''}`).join(' ')
      : record.transcript || '';
    const actions = Array.isArray(record.actionItems)
      ? record.actionItems.map((action) => `${action.text || ''} ${action.owner || ''}`).join(' ')
      : '';
    const extraFields = Object.values(record)
      .filter((value) => typeof value === 'string')
      .join(' ');
    const body = `${extraFields} ${record.title || ''} ${record.name || ''} ${record.content || ''} ${transcript} ${record.summary || ''} ${tags} ${record.category || ''} ${record.project || ''} ${decisions} ${actions}`.toLowerCase();
    const matches = queryTerms.filter((term) => body.includes(term)).length;
    const date = record.updatedAt || record.createdAt || record.date || record.addedDate || '';
    const normalizedDate = normalizeDate(date);
    const sortableDate = normalizedDate?.getTime() || 0;
    const recordType = record.recordType || 'record';
    return {
      id: record.id,
      title: record.title || record.name || 'Untitled record',
      snippet: (typeof record.content === 'string' && record.content) || transcript || record.summary || decisions || actions || tags,
      recordType,
      type: recordType === 'voiceNotes' ? 'VOICE' : recordType === 'geoMemories' || recordType === 'foodMemories' ? 'MEMORY' : recordType.toUpperCase(),
      date: normalizedDate,
      dateLabel: normalizedDate?.toLocaleDateString() || (typeof date === 'string' ? date.trim() : '') || 'Date unavailable',
      sortableDate,
      matches,
      viewTarget: record.recordType === 'meetings' ? 'meetings' : record.recordType === 'documents' ? 'documents' : 'notes',
    };
  }).filter((record) => record.matches > 0)
    .filter((record) => selectedType === 'All types' || typeGroups[selectedType]?.has(record.recordType))
    .sort((a, b) => b.matches - a.matches || b.sortableDate - a.sortableDate);
  const pageCount = Math.ceil(results.length / pageSize);
  const visibleResults = results.slice(page * pageSize, (page + 1) * pageSize);

  return (
    <div className="max-w-4xl mx-auto p-4 lg:p-8 space-y-6">
      {/* Centered Heading matching Screenshot 11 */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2">
          <span className={`px-2 py-0.5 rounded-full border text-[10px] font-semibold ${
            darkMode ? 'bg-indigo-950 border-indigo-800/60 text-indigo-300' : 'bg-indigo-50 border-indigo-200 text-indigo-700'
          }`}>
            PRIVATE KEYWORD SEARCH
          </span>
        </div>
        <h1 className={`text-2xl font-bold tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
          Workspace search
        </h1>
        <p id="search-description" className="text-xs text-slate-400 max-w-lg mx-auto">
          Search your current workspace records by keyword. Semantic/vector search is not connected.
        </p>
      </div>

      {/* Main Search Bar */}
      <div className="relative">
        <Search className="w-5 h-5 text-indigo-400 absolute left-4 top-3.5" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value.slice(0, 200));
            setPage(0);
          }}
          maxLength={200}
          aria-label="Search current workspace records"
          aria-describedby="search-description"
          placeholder="Search notes, titles, meeting notes, and tags..."
          className={`w-full pl-12 pr-12 py-3 text-sm rounded-xl focus:outline-none transition-all border ${
            darkMode
              ? 'bg-[#0c1024] border-indigo-900/60 hover:border-indigo-600/60 focus:border-indigo-500 text-white placeholder-slate-500 shadow-[0_0_25px_-5px_rgba(99,102,241,0.2)]'
              : 'bg-white border-slate-300 hover:border-indigo-400 focus:border-indigo-500 text-slate-900 placeholder-slate-400 shadow-sm'
          }`}
        />
        <Search className="w-4 h-4 text-slate-500 absolute right-4 top-4" />
      </div>

      {/* Filter Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <div className="flex items-center gap-1 text-slate-400 text-xs mr-2">
          <Filter className="w-3.5 h-3.5" />
        </div>
        {types.map((t) => (
          <button
            key={t}
            onClick={() => {
              setSelectedType(t);
              setPage(0);
            }}
            aria-pressed={selectedType === t}
            className={`px-3 py-1 text-xs rounded-lg border transition-all ${
              selectedType === t
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                : darkMode
                ? 'bg-[#0c1024] text-slate-400 border-indigo-950 hover:text-slate-200'
                : 'bg-white text-slate-600 border-slate-300 hover:text-slate-900'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className={`p-5 rounded-xl border shadow-sm space-y-2 ${
        darkMode ? 'bg-[#0c1024] border-indigo-900/70' : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center gap-2 text-[10px] font-bold text-cyan-400 tracking-wider uppercase">
          <Filter className="w-3.5 h-3.5" />
          <span>LOCAL KEYWORD SEARCH · {results.length} MATCHES</span>
        </div>
        <p className={`text-xs md:text-sm leading-relaxed ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
          {queryTerms.length === 0 ? 'Enter a keyword or phrase to search the records currently available in this workspace.' : results.length ? 'Results below contain one or more exact keyword matches. No semantic ranking or answer generation is performed.' : 'No records matched those terms.'}
        </p>
      </div>

      {/* Ranked Search Results */}
      <div className="space-y-3">
        {visibleResults.map((res) => (
          <button
            key={res.id}
            type="button"
            onClick={() => onNavigate(res.viewTarget)}
            className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-4 group shadow-sm hover:shadow-[0_0_20px_-5px_rgba(99,102,241,0.25)] ${
              darkMode ? 'bg-[#0c1024] border-indigo-950/80 hover:border-indigo-600/50' : 'bg-white border-slate-200 hover:border-indigo-300'
            }`}
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-xs font-semibold group-hover:text-indigo-400 transition-colors ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  {res.title}
                </span>
              </div>
              <div className="text-xs text-slate-400 font-sans line-clamp-1">
                {typeof res.snippet === 'string' ? res.snippet.slice(0, 220) : ''}
              </div>
              <div className="flex items-center gap-2 mt-2 text-[10px] text-slate-400 font-mono">
                <span className="text-indigo-400 font-semibold">{res.type}</span>
                <span>·</span>
                <span>{res.dateLabel}</span>
              </div>
            </div>

            <div className="text-right shrink-0">
              <div className="text-sm font-bold font-mono text-cyan-400">{res.matches}</div>
              <div className="text-[9px] uppercase tracking-wider text-slate-400">TERM HITS</div>
            </div>
          </button>
        ))}
        {queryTerms.length > 0 && results.length === 0 && (
          <div className={`rounded-xl border p-8 text-center text-xs ${darkMode ? 'border-indigo-950 bg-[#0c1024] text-slate-400' : 'border-slate-200 bg-white text-slate-600'}`} role="status">
            No matching records. Try another keyword or widen the type filter.
          </div>
        )}
      </div>

      {pageCount > 1 && (
        <nav className="flex items-center justify-center gap-3" aria-label="Search result pages">
          <button
            type="button"
            disabled={page === 0}
            onClick={() => setPage((current) => Math.max(0, current - 1))}
            className="inline-flex min-h-10 items-center gap-1 rounded-lg border border-slate-700 px-3 text-xs text-slate-300 disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" /> Previous
          </button>
          <span className="text-xs text-slate-400" aria-live="polite">Page {page + 1} of {pageCount}</span>
          <button
            type="button"
            disabled={page + 1 >= pageCount}
            onClick={() => setPage((current) => Math.min(pageCount - 1, current + 1))}
            className="inline-flex min-h-10 items-center gap-1 rounded-lg border border-slate-700 px-3 text-xs text-slate-300 disabled:opacity-40"
          >
            Next <ChevronRight className="h-4 w-4" />
          </button>
        </nav>
      )}

    </div>
  );
};
