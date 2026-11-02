import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, Link2, Pin, Plus, Trash2, X } from 'lucide-react';
import { addNoteTag, setNotePinned } from '../utils/noteLogic.js';

export const NoteEditorPage = ({
  note,
  onSaveNote,
  onDeleteNote,
  onBackToDetail,
  onBackToNotes,
  onDeleted,
  isRealTimeMode = false,
  darkMode,
}) => {
  const [editorNote, setEditorNote] = useState(note || null);
  const [saveStatus, setSaveStatus] = useState('Ready');
  const [tagDraft, setTagDraft] = useState('');
  const [deleteArmed, setDeleteArmed] = useState(false);
  const [busy, setBusy] = useState(false);
  const saveTimer = useRef(null);
  const pendingNote = useRef(null);
  const inFlightSave = useRef(null);
  const saveHandler = useRef(onSaveNote);
  const mounted = useRef(true);
  const currentNote = useRef(note || null);
  const sourceNote = note;

  useEffect(() => {
    saveHandler.current = onSaveNote;
  }, [onSaveNote]);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      clearTimeout(saveTimer.current);
      const finishPendingSave = async () => {
        await inFlightSave.current?.catch(() => {});
        const pending = pendingNote.current;
        pendingNote.current = null;
        if (pending) {
          try {
            await saveHandler.current?.(pending);
          } catch (error) {
            console.error('Unable to flush the pending note save while leaving the editor.', error);
          }
        }
      };
      void finishPendingSave();
    };
  }, []);

  useEffect(() => {
    if (!sourceNote) return;
    currentNote.current = sourceNote;
    setEditorNote(sourceNote);
  }, [sourceNote?.id, sourceNote?.updatedAt]);

  const updateStatus = useCallback((status) => {
    if (mounted.current) setSaveStatus(status);
  }, []);

  const flushPendingSave = useCallback(async () => {
    clearTimeout(saveTimer.current);
    while (inFlightSave.current || pendingNote.current) {
      if (inFlightSave.current) {
        try {
          await inFlightSave.current;
        } catch {
          if (!pendingNote.current) throw new Error('The note could not be saved.');
        }
        continue;
      }

      const snapshot = pendingNote.current;
      pendingNote.current = null;
      const save = Promise.resolve().then(() => saveHandler.current?.(snapshot));
      inFlightSave.current = save;
      try {
        await save;
      } catch (error) {
        if (!pendingNote.current) pendingNote.current = snapshot;
        const message = error?.message || 'try again';
        updateStatus(`Save failed: ${message}`);
        throw error;
      } finally {
        if (inFlightSave.current === save) inFlightSave.current = null;
      }
    }
    updateStatus('Saved');
  }, [updateStatus]);

  const scheduleSave = useCallback((updated) => {
    pendingNote.current = updated;
    setSaveStatus('Saving…');
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      flushPendingSave().catch(() => {});
    }, 600);
  }, [flushPendingSave]);

  const updateNote = (changes) => {
    if (!currentNote.current) return;
    const updated = {
      ...currentNote.current,
      ...changes,
      updatedAt: new Date().toISOString(),
    };
    currentNote.current = updated;
    setEditorNote(updated);
    scheduleSave(updated);
  };

  const handleNavigate = async (navigate) => {
    if (busy) return;
    setBusy(true);
    try {
      await flushPendingSave();
      await navigate?.();
    } catch {
      // Keep the editor open so the user can retry instead of leaving unsaved changes behind.
    } finally {
      if (mounted.current) setBusy(false);
    }
  };

  const handleAddTag = () => {
    const updated = addNoteTag(currentNote.current, tagDraft);
    if (!updated) return;
    updateNote({ tags: updated.tags });
    setTagDraft('');
  };

  const handleDelete = async () => {
    if (!editorNote || !onDeleteNote) return;
    if (!deleteArmed) {
      setDeleteArmed(true);
      return;
    }
    setBusy(true);
    setSaveStatus('Deleting…');
    try {
      await flushPendingSave();
      await onDeleteNote(editorNote.id);
      pendingNote.current = null;
      await onDeleted?.();
    } catch (error) {
      setSaveStatus(`Delete failed: ${error.message || 'try again'}`);
      setDeleteArmed(false);
      if (mounted.current) setBusy(false);
    }
  };

  const panel = darkMode ? 'border-indigo-950/80 bg-[#090c1e]' : 'border-slate-200 bg-white';
  const inputStyle = darkMode
    ? 'text-slate-200 placeholder:text-slate-500'
    : 'text-slate-800 placeholder:text-slate-500';

  if (!editorNote) {
    return (
      <main className="mx-auto flex min-h-[50vh] max-w-3xl flex-col items-center justify-center gap-4 px-5 text-center">
        <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Note not found</h1>
        <p className="max-w-lg text-sm text-slate-400">
          This note may have been deleted or is not available in the active workspace.
        </p>
        <button
          type="button"
          onClick={onBackToNotes}
          className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-indigo-500/40 px-4 text-sm font-semibold text-indigo-300 hover:bg-indigo-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to notes
        </button>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-6xl space-y-4 p-3 sm:p-5 lg:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => handleNavigate(onBackToDetail)}
            disabled={busy}
            className={`inline-flex min-h-10 items-center gap-2 rounded-lg px-3 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 disabled:opacity-50 ${
              darkMode ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to note
          </button>
          <button
            type="button"
            onClick={() => handleNavigate(onBackToNotes)}
            disabled={busy}
            className="min-h-10 rounded-lg px-3 text-sm font-medium text-slate-400 hover:text-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 disabled:opacity-50"
          >
            All notes
          </button>
        </div>
        <span className={`rounded-full border px-2 py-1 text-[10px] font-semibold ${
          darkMode ? 'border-indigo-800/60 bg-indigo-950 text-indigo-300' : 'border-indigo-200 bg-indigo-50 text-indigo-700'
        }`}>
          {isRealTimeMode ? 'PRIVATE RECORD' : 'DEMO DATA'}
        </span>
      </div>

      <section className={`overflow-hidden rounded-xl border ${panel}`} aria-label="Note editor">
        <header className={`space-y-4 border-b p-4 sm:p-6 ${
          darkMode ? 'border-indigo-950/80 bg-[#090d22]' : 'border-slate-200 bg-slate-50'
        }`}>
          <label htmlFor="note-title" className="sr-only">Note title</label>
          <input
            id="note-title"
            value={editorNote.title || ''}
            maxLength={160}
            onChange={(event) => updateNote({ title: event.target.value })}
            className={`w-full rounded-md bg-transparent text-xl font-bold tracking-tight focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 sm:text-2xl ${inputStyle}`}
            placeholder="Untitled Note"
          />

          <div className="space-y-2">
            <div className="flex min-w-0 items-center gap-2">
              <span className={`shrink-0 text-[11px] font-semibold ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Tags</span>
              <div
                className={`note-tag-strip flex min-w-0 flex-1 items-center gap-1.5 overflow-x-auto overscroll-x-contain pb-1 ${
                  darkMode ? 'note-tag-strip-dark' : 'note-tag-strip-light'
                }`}
                role="list"
                aria-label="Note tags. Scroll horizontally to see more."
                tabIndex={0}
              >
                {(Array.isArray(editorNote.tags) ? editorNote.tags : []).map((tag) => (
                  <span
                    key={tag}
                    role="listitem"
                    className="inline-flex shrink-0 items-center gap-1 rounded-full border border-indigo-800/50 bg-indigo-950/60 px-2 py-1 text-[10px] text-indigo-200"
                  >
                    #{String(tag).replace(/^#+/, '')}
                    <button
                      type="button"
                      onClick={() => updateNote({ tags: editorNote.tags.filter((item) => item !== tag) })}
                      className="rounded-full hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
                      aria-label={`Remove tag ${tag}`}
                    >
                      <X className="h-3 w-3" aria-hidden="true" />
                    </button>
                  </span>
                ))}
                {(!Array.isArray(editorNote.tags) || editorNote.tags.length === 0) && (
                  <span className="shrink-0 text-[10px] text-slate-500">No tags yet</span>
                )}
              </div>
            </div>
            <div className="flex min-w-0 items-center gap-2">
              <input
                value={tagDraft}
                onChange={(event) => setTagDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    handleAddTag();
                  }
                }}
                maxLength={40}
                aria-label="Custom tag text"
                placeholder="Add custom tag…"
                className={`min-h-9 min-w-0 flex-1 rounded-md border px-2.5 py-1.5 text-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${
                  darkMode ? 'border-slate-700 bg-[#070914]' : 'border-slate-300 bg-white'
                } ${inputStyle}`}
              />
              <button
                type="button"
                onClick={handleAddTag}
                disabled={!tagDraft.trim()}
                className="inline-flex min-h-9 shrink-0 items-center gap-1 rounded-md border border-indigo-500/60 bg-indigo-600/15 px-2.5 text-[11px] font-semibold text-indigo-200 transition-colors hover:bg-indigo-600/30 disabled:cursor-not-allowed disabled:opacity-45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              >
                <Plus className="h-3 w-3" aria-hidden="true" />
                Add tag
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => updateNote(setNotePinned(currentNote.current, !currentNote.current.pinned))}
              aria-pressed={Boolean(editorNote.pinned)}
              aria-label={editorNote.pinned ? 'Unpin note' : 'Pin note'}
              className={`inline-flex min-h-9 items-center gap-1.5 rounded-lg border px-2.5 text-[11px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                editorNote.pinned
                  ? 'border-indigo-700 bg-indigo-950/70 text-cyan-200'
                  : darkMode
                    ? 'border-slate-700 text-slate-400 hover:text-cyan-200'
                    : 'border-slate-300 text-slate-600 hover:text-indigo-700'
              }`}
            >
              <Pin className="h-3.5 w-3.5" aria-hidden="true" />
              {editorNote.pinned ? 'Unpin' : 'Pin'}
            </button>
            <p className="min-w-0 flex-1 text-[11px] leading-relaxed text-slate-500">
              AI summarize, rewrite, and extraction are unavailable until an AI provider is configured.
            </p>
            <span
              className={`text-[11px] font-mono font-semibold ${
                saveStatus.startsWith('Save failed') || saveStatus.startsWith('Delete failed')
                  ? 'text-rose-400'
                  : saveStatus === 'Saving…' || saveStatus === 'Deleting…'
                    ? 'text-amber-300'
                    : 'text-emerald-500'
              }`}
              role="status"
              aria-live="polite"
            >
              {saveStatus}
            </span>
            {saveStatus.startsWith('Save failed') && (
              <button
                type="button"
                onClick={() => flushPendingSave().catch(() => {})}
                className="min-h-8 rounded px-2 text-[10px] font-semibold text-cyan-300 hover:bg-cyan-400/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              >
                Retry save
              </button>
            )}
            {onDeleteNote && (
              <div className="flex items-center gap-1">
                {deleteArmed && (
                  <button
                    type="button"
                    onClick={() => setDeleteArmed(false)}
                    disabled={busy}
                    className="min-h-9 rounded-lg px-2 text-[11px] text-slate-400 hover:text-white disabled:opacity-50"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={busy}
                  className={`inline-flex min-h-9 items-center gap-1 rounded-lg border px-2.5 text-[11px] disabled:opacity-50 ${
                    deleteArmed
                      ? 'border-rose-700 bg-rose-950/50 text-rose-200'
                      : 'border-slate-700 text-slate-400 hover:text-rose-300'
                  }`}
                  aria-label={deleteArmed ? 'Confirm delete note' : 'Delete note'}
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                  {deleteArmed ? 'Confirm delete' : 'Delete'}
                </button>
              </div>
            )}
          </div>
        </header>

        <div className="p-4 sm:p-6">
          <label htmlFor="note-content" className="sr-only">Note content in Markdown</label>
          <textarea
            id="note-content"
            value={typeof editorNote.content === 'string' ? editorNote.content : ''}
            onChange={(event) => updateNote({ content: event.target.value.slice(0, 900000) })}
            className={`min-h-[40vh] w-full resize-y rounded-md bg-transparent font-mono text-xs leading-relaxed focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 sm:min-h-[52vh] sm:text-sm ${inputStyle}`}
            placeholder="Write your note in Markdown…"
          />
        </div>

        <footer className={`flex flex-wrap items-center justify-between gap-3 border-t px-4 py-3 text-xs sm:px-6 ${
          darkMode ? 'border-indigo-950/80 bg-[#070914] text-slate-400' : 'border-slate-200 bg-slate-50 text-slate-600'
        }`}>
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <span className="flex items-center gap-1.5 text-[10px] font-mono font-semibold uppercase tracking-wider">
              <Link2 className="h-3 w-3 text-cyan-400" aria-hidden="true" />
              Backlinks
            </span>
            {Array.isArray(editorNote.backlinks) && editorNote.backlinks.length > 0 ? (
              editorNote.backlinks.map((link) => (
                <span
                  key={link}
                  className={`max-w-full truncate rounded border px-2 py-1 text-[10px] ${
                    darkMode
                      ? 'border-indigo-800/60 bg-indigo-950 text-indigo-300'
                      : 'border-indigo-200 bg-indigo-50 text-indigo-700'
                  }`}
                >
                  {link}
                </span>
              ))
            ) : (
              <span className="text-[10px] text-slate-500">No backlinks yet</span>
            )}
          </div>
          <span className="text-[10px] font-mono text-slate-500">History unavailable</span>
        </footer>
      </section>
    </main>
  );
};
