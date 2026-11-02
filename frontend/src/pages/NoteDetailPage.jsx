import React from 'react';
import { ArrowLeft, Pencil } from 'lucide-react';

export const NoteDetailPage = ({ note, onBack, onEdit, darkMode }) => {
  const panel = darkMode
    ? 'border-indigo-950/80 bg-[#0c1024]'
    : 'border-slate-200 bg-white';
  const updatedAt = note?.updatedAt?.toDate?.() ?? note?.updatedAt;
  const updatedDate = updatedAt ? new Date(updatedAt) : null;
  const updatedLabel = updatedDate && Number.isFinite(updatedDate.getTime())
    ? `Last updated ${updatedDate.toLocaleString()}`
    : null;

  if (!note) {
    return (
      <main className="mx-auto flex min-h-[50vh] max-w-3xl flex-col items-center justify-center gap-4 px-5 text-center">
        <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Note not found</h1>
        <p className="text-sm text-slate-400">This note may have been deleted or is not available in the active workspace.</p>
        <button
          type="button"
          onClick={onBack}
          className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-indigo-500/40 px-4 text-sm font-semibold text-indigo-300 hover:bg-indigo-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to notes
        </button>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-5 sm:px-6 sm:py-8 lg:px-8">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className={`inline-flex min-h-10 items-center gap-2 rounded-lg px-3 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
            darkMode ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-700 hover:bg-slate-200'
          }`}
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          All notes
        </button>
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
        >
          <Pencil className="h-4 w-4" aria-hidden="true" />
          Edit note
        </button>
      </div>

      <article className={`rounded-2xl border p-5 sm:p-8 ${panel}`}>
        <h1 className={`break-words text-2xl font-bold tracking-tight sm:text-3xl ${
          darkMode ? 'text-white' : 'text-slate-900'
        }`}>
          {note.title?.trim() || 'Untitled Note'}
        </h1>
        {Array.isArray(note.tags) && note.tags.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-2" aria-label="Note tags">
            {note.tags.map((tag) => (
              <li key={tag} className="rounded-full border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-1 text-xs text-indigo-300">
                #{String(tag).replace(/^#+/, '')}
              </li>
            ))}
          </ul>
        )}
        <div className={`mt-6 border-t pt-6 ${
          darkMode ? 'border-slate-800 text-slate-200' : 'border-slate-200 text-slate-800'
        }`}>
          <p className="whitespace-pre-wrap break-words text-sm leading-7">
            {typeof note.content === 'string' && note.content.length > 0 ? note.content : 'This note has no content yet.'}
          </p>
        </div>
        {updatedLabel && (
          <p className="mt-8 border-t border-slate-800/60 pt-4 text-xs text-slate-500">
            {updatedLabel}
          </p>
        )}
      </article>
    </main>
  );
};
