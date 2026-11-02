import React, { useMemo, useState } from 'react';
import { FolderKanban, Plus, Search, Tag } from 'lucide-react';

export const CollectionsPage = ({
  collections = [],
  onAddCollection,
  darkMode,
}) => {
  const [query, setQuery] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const filteredCollections = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return collections;
    return collections.filter((collection) => (
      [collection.title, collection.description, ...(collection.tags || [])]
        .some((value) => String(value || '').toLowerCase().includes(normalizedQuery))
    ));
  }, [collections, query]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    const cleanTitle = title.trim();
    if (cleanTitle.length < 2) {
      setError('Collection name must be at least 2 characters.');
      return;
    }
    if (collections.some((collection) => collection.title?.toLowerCase() === cleanTitle.toLowerCase())) {
      setError('A collection with this name already exists.');
      return;
    }

    const collection = {
      id: `collection-${globalThis.crypto?.randomUUID?.() || Date.now().toString(36)}`,
      title: cleanTitle,
      description: description.trim(),
      itemCount: 0,
      tags: [...new Set(tags.split(',').map((tag) => tag.trim()).filter(Boolean))].slice(0, 12),
      createdAt: new Date().toISOString(),
    };

    setSaving(true);
    try {
      await onAddCollection(collection);
      setTitle('');
      setDescription('');
      setTags('');
    } catch (saveError) {
      setError(saveError.message || 'The collection could not be saved.');
    } finally {
      setSaving(false);
    }
  };

  const panelClass = darkMode
    ? 'border-indigo-950/80 bg-[#0c1024] text-slate-100'
    : 'border-slate-200 bg-white text-slate-900';

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 lg:p-8">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FolderKanban className="h-5 w-5 text-indigo-400" />
            <h1 className="text-xl font-bold tracking-tight">Collections</h1>
          </div>
          <p className="mt-1 text-xs text-slate-400">Organize your memories into searchable collections.</p>
        </div>
        <span className="rounded-full border border-indigo-800/60 bg-indigo-950/50 px-2.5 py-1 text-[10px] font-semibold text-indigo-300">
          {collections.length} {collections.length === 1 ? 'COLLECTION' : 'COLLECTIONS'}
        </span>
      </header>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(17rem,0.65fr)]">
        <section aria-label="Collection list" className="space-y-4">
          <label className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 ${panelClass}`}>
            <Search className="h-4 w-4 shrink-0 text-slate-400" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search collections and tags"
              aria-label="Search collections"
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-500"
            />
          </label>

          {filteredCollections.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {filteredCollections.map((collection) => (
                <article key={collection.id} className={`min-w-0 rounded-2xl border p-4 ${panelClass}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-indigo-500/10 text-indigo-400">
                        <FolderKanban className="h-5 w-5" />
                      </span>
                      <h2 className="break-words text-sm font-semibold">{collection.title}</h2>
                    </div>
                    <span className="shrink-0 rounded-full bg-slate-500/10 px-2 py-1 text-[10px] text-slate-400">
                      {collection.itemCount || 0} items
                    </span>
                  </div>
                  {collection.description && <p className="mt-3 break-words text-xs leading-relaxed text-slate-400">{collection.description}</p>}
                  {(collection.tags || []).length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {collection.tags.map((tag) => (
                        <span key={tag} className="inline-flex max-w-full items-center gap-1 rounded-full border border-indigo-800/40 bg-indigo-950/30 px-2 py-1 text-[10px] text-indigo-300">
                          <Tag className="h-3 w-3 shrink-0" />
                          <span className="break-all">{tag}</span>
                        </span>
                      ))}
                    </div>
                  )}
                </article>
              ))}
            </div>
          ) : (
            <div className={`rounded-2xl border p-8 text-center ${panelClass}`}>
              <FolderKanban className="mx-auto h-8 w-8 text-slate-500" />
              <p className="mt-3 text-sm font-medium">{query ? 'No matching collections' : 'No collections yet'}</p>
              <p className="mt-1 text-xs text-slate-400">{query ? 'Try another search.' : 'Create a collection to organize your memories.'}</p>
            </div>
          )}
        </section>

        <form onSubmit={handleSubmit} className={`h-fit space-y-4 rounded-2xl border p-5 ${panelClass}`}>
          <h2 className="text-sm font-bold">Create collection</h2>
          <div className="space-y-1.5">
            <label htmlFor="collection-title" className="text-xs font-medium text-slate-400">Name</label>
            <input
              id="collection-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
              minLength={2}
              maxLength={80}
              className={`w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-indigo-500 ${darkMode ? 'border-indigo-950 bg-[#080b18] text-white' : 'border-slate-300 bg-slate-50'}`}
              placeholder="e.g. Research project"
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="collection-description" className="text-xs font-medium text-slate-400">Description</label>
            <textarea
              id="collection-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={3}
              maxLength={500}
              className={`w-full resize-y rounded-lg border px-3 py-2 text-sm outline-none focus:border-indigo-500 ${darkMode ? 'border-indigo-950 bg-[#080b18] text-white' : 'border-slate-300 bg-slate-50'}`}
              placeholder="What belongs in this collection?"
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="collection-tags" className="text-xs font-medium text-slate-400">Tags <span className="font-normal">(comma separated)</span></label>
            <input
              id="collection-tags"
              value={tags}
              onChange={(event) => setTags(event.target.value)}
              maxLength={300}
              className={`w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-indigo-500 ${darkMode ? 'border-indigo-950 bg-[#080b18] text-white' : 'border-slate-300 bg-slate-50'}`}
              placeholder="ideas, reading, project"
            />
          </div>
          {error && <p role="alert" className="text-xs text-rose-400">{error}</p>}
          <button type="submit" disabled={saving} className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-indigo-500 disabled:cursor-wait disabled:opacity-60">
            <Plus className="h-4 w-4" />
            {saving ? 'Saving…' : 'Add collection'}
          </button>
        </form>
      </div>
    </div>
  );
};
