import React, { useState } from 'react';
import { FileText, Pin, Plus, Search } from 'lucide-react';
import { filterNotes } from '../utils/noteLogic.js';

const formatUpdatedAt = (value) => {
  const dateValue = value?.toDate?.() ?? value;
  const date = dateValue ? new Date(dateValue) : null;
  return date && Number.isFinite(date.getTime())
    ? date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
    : '';
};

export const NotesPage = ({
  notes = [],
  onCreateNote,
  onOpenNote,
  isRealTimeMode = false,
  darkMode,
}) => {
  const [searchNotes, setSearchNotes] = useState('');
  const [pinnedOnly, setPinnedOnly] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');
  const filteredNotes = filterNotes(notes, searchNotes, pinnedOnly);
  const surface = darkMode ? 'border-indigo-950/80 bg-[#090c1e]' : 'border-slate-200 bg-white';

  const handleCreateNote = async () => {
    if (creating) return;
    setCreating(true);
    setCreateError('');
    const now = new Date();
    const note = {
      id: `note-${now.getTime()}-${Math.random().toString(36).slice(2, 8)}`,
      title: 'Untitled Note',
      tags: [],
      updatedAt: now.toISOString(),
      createdAt: now.toISOString().slice(0, 10),
      backlinks: [],
      content: '',
    };
    try {
      await onCreateNote?.(note);
    } catch (error) {
      setCreateError(error.message || 'The note could not be created. Try again.');
    } finally {
      setCreating(false);
    }
  };

  return (
    <main className="space-y-5 p-3 sm:p-5 lg:p-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className={`text-xl font-bold tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>Notes</h1>
            <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${
              darkMode ? 'border-indigo-800/60 bg-indigo-950 text-indigo-300' : 'border-indigo-200 bg-indigo-50 text-indigo-700'
            }`}>
              {isRealTimeMode ? 'PRIVATE RECORDS' : 'DEMO DATA'}
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-400">Search, pin, and revisit your notes.</p>
        </div>
        <button
          type="button"
          onClick={handleCreateNote}
          disabled={creating}
          className="inline-flex min-h-10 items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-md transition-colors hover:bg-indigo-500 disabled:cursor-wait disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
        >
          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
          {creating ? 'Creating…' : 'New note'}
        </button>
      </header>

      {createError && (
        <p role="alert" className="rounded-lg border border-rose-800 bg-rose-950/40 px-3 py-2 text-xs text-rose-200">
          {createError}
        </p>
      )}

      <section className={`overflow-hidden rounded-xl border ${surface}`} aria-label="Your notes">
        <div className={`flex flex-wrap items-center gap-3 border-b p-3 sm:p-4 ${
          darkMode ? 'border-indigo-950/80 bg-[#070914]' : 'border-slate-200 bg-slate-50'
        }`}>
          <div className="relative min-w-[min(100%,15rem)] flex-1">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
            <input
              type="search"
              placeholder="Search notes…"
              value={searchNotes}
              onChange={(event) => setSearchNotes(event.target.value)}
              aria-label="Search notes"
              className={`min-h-9 w-full rounded-lg border py-1.5 pl-8 pr-3 text-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${
                darkMode
                  ? 'border-indigo-950 bg-[#0c1024] text-white placeholder:text-slate-500'
                  : 'border-slate-300 bg-white text-slate-900 placeholder:text-slate-400'
              }`}
            />
          </div>
          <button
            type="button"
            onClick={() => setPinnedOnly((previous) => !previous)}
            aria-pressed={pinnedOnly}
            className={`inline-flex min-h-9 items-center gap-1.5 rounded-md border px-3 text-[11px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
              pinnedOnly
                ? 'border-indigo-500/70 bg-indigo-950/70 text-indigo-200'
                : darkMode
                  ? 'border-slate-700 text-slate-400 hover:border-indigo-700 hover:text-indigo-200'
                  : 'border-slate-300 text-slate-600 hover:border-indigo-300 hover:text-indigo-700'
            }`}
          >
            <Pin className={`h-3 w-3 ${pinnedOnly ? 'text-cyan-300' : ''}`} aria-hidden="true" />
            {pinnedOnly ? 'Pinned only' : 'Show pinned'}
          </button>
        </div>

        {filteredNotes.length === 0 ? (
          <div className="flex min-h-44 flex-col items-center justify-center gap-2 px-4 py-8 text-center">
            <FileText className="h-5 w-5 text-indigo-400" aria-hidden="true" />
            <p className={`text-sm font-semibold ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>
              {pinnedOnly ? 'No pinned notes yet' : searchNotes ? 'No notes match your search' : 'No notes yet'}
            </p>
            <p className="max-w-sm text-xs text-slate-500">
              {pinnedOnly || searchNotes ? 'Try changing your filters.' : 'Create a note to start collecting your thoughts.'}
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-indigo-950/30">
            {filteredNotes.map((note) => (
              <li key={note.id}>
                <article className={`flex min-w-0 flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 ${
                  darkMode ? 'hover:bg-slate-800/20' : 'hover:bg-slate-50'
                }`}>
                  <div className="min-w-0 flex-1">
                    <div className="flex min-w-0 items-center gap-2">
                      {note.pinned && <Pin className="h-3.5 w-3.5 shrink-0 text-cyan-400" aria-label="Pinned" />}
                      <h2 className={`truncate text-sm font-semibold ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                        {note.title?.trim() || 'Untitled Note'}
                      </h2>
                      {formatUpdatedAt(note.updatedAt) && (
                        <time className="shrink-0 text-[10px] text-slate-500">
                          {formatUpdatedAt(note.updatedAt)}
                        </time>
                      )}
                    </div>
                    <p className="mt-1.5 line-clamp-2 break-words text-xs leading-relaxed text-slate-400">
                      {(typeof note.content === 'string' ? note.content : '').replace(/^#+ .*\n/, '') || 'No note text yet.'}
                    </p>
                    {Array.isArray(note.tags) && note.tags.length > 0 && (
                      <ul className="mt-2 flex flex-wrap gap-1.5" aria-label="Note tags">
                        {note.tags.slice(0, 5).map((tag) => (
                          <li
                            key={tag}
                            className="max-w-full truncate rounded border border-indigo-800/40 bg-indigo-950/60 px-1.5 py-0.5 text-[9px] font-mono text-indigo-300"
                          >
                            #{String(tag).replace(/^#+/, '')}
                          </li>
                        ))}
                        {note.tags.length > 5 && <li className="text-[9px] text-slate-500">+{note.tags.length - 5}</li>}
                      </ul>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => onOpenNote?.(note)}
                    className="min-h-9 shrink-0 self-start rounded-md px-3 text-xs font-semibold text-cyan-500 underline-offset-2 transition-colors hover:bg-cyan-400/10 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 sm:self-center"
                    aria-label={`More: open full note ${note.title || 'Untitled Note'}`}
                  >
                    More
                  </button>
                </article>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
};
