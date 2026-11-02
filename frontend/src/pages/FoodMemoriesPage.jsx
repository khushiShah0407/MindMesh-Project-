import React, { useEffect, useState } from 'react';
import { ImagePlus, LoaderCircle, Utensils, X } from 'lucide-react';
import { loadFoodPhoto } from '../utils/firebase.js';

const allowedTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);

export const FoodMemoriesPage = ({
  memories = [],
  onAddMemory,
  isRealTimeMode,
  darkMode,
}) => {
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [photo, setPhoto] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [photos, setPhotos] = useState({});
  const [photoLoadError, setPhotoLoadError] = useState('');
  const memoryPhotoSignature = memories.map((memory) => `${memory.id}:${memory.imagePath || ''}`).join('|');

  useEffect(() => {
    if (!photo) {
      setPreviewUrl('');
      return undefined;
    }
    const url = URL.createObjectURL(photo);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [photo]);

  useEffect(() => {
    let active = true;
    const objectUrls = [];
    setPhotoLoadError('');
    Promise.all(memories.filter((memory) => memory.imagePath).map(async (memory) => {
      try {
        const blob = await loadFoodPhoto(memory.imagePath);
        const url = URL.createObjectURL(blob);
        if (!active) {
          URL.revokeObjectURL(url);
          return null;
        }
        objectUrls.push(url);
        return [memory.id, url];
      } catch {
        if (active) setPhotoLoadError('One or more saved photos could not be loaded. Check Firebase Storage rules and network access.');
        return null;
      }
    })).then((entries) => {
      if (active) setPhotos(Object.fromEntries(entries.filter(Boolean)));
    });
    return () => {
      active = false;
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [memoryPhotoSignature]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    if (!isRealTimeMode) {
      setError('Sign in to a Firebase account and switch to Live Real-Time before uploading a photo.');
      return;
    }
    if (title.trim().length < 2) {
      setError('Enter a food or recipe name with at least 2 characters.');
      return;
    }
    if (!photo || !allowedTypes.has(photo.type)) {
      setError('Choose an actual JPEG, PNG, or WebP food photo.');
      return;
    }
    if (photo.size > 5 * 1024 * 1024) {
      setError('Photos must be 5 MB or smaller.');
      return;
    }

    const memory = {
      id: `food-${crypto.randomUUID?.() || Date.now().toString(36)}`,
      title: title.trim(),
      notes: notes.trim(),
      createdAt: new Date().toISOString(),
      photoFile: photo,
    };
    setSaving(true);
    try {
      await onAddMemory(memory);
      setTitle('');
      setNotes('');
      setPhoto(null);
    } catch (saveError) {
      setError(saveError.message || 'This food memory could not be saved.');
    } finally {
      setSaving(false);
    }
  };

  const panelClass = darkMode
    ? 'bg-[#0c1024] border-indigo-950/80 text-slate-100'
    : 'bg-white border-slate-200 text-slate-900';

  return (
    <div className="max-w-6xl mx-auto p-4 lg:p-8 space-y-6">
      <header className="space-y-2">
        <div className="flex items-center gap-2">
          <Utensils className="h-5 w-5 text-amber-400" />
          <h1 className="text-xl font-bold tracking-tight">Food memories</h1>
          <span className="rounded-full border border-amber-700/40 bg-amber-950/30 px-2 py-0.5 text-[10px] font-semibold text-amber-300">
            YOUR PHOTOS
          </span>
        </div>
        <p className="max-w-2xl text-xs leading-relaxed text-slate-400">
          Keep a real photo with a recipe, meal, or food memory. Photos upload only when you save, to your private Firebase Storage account; images are fetched only for your signed-in account and no public download link is stored.
        </p>
      </header>

      <section className={`grid gap-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]`}>
        <form onSubmit={handleSubmit} className={`space-y-4 rounded-2xl border p-5 ${panelClass}`}>
          <h2 className="text-sm font-bold">Add a food memory</h2>
          {!isRealTimeMode && (
            <p className="rounded-lg border border-amber-800/50 bg-amber-950/30 p-3 text-xs leading-relaxed text-amber-200" role="status">
              Photo uploads require a signed-in Firebase account and Live Real-Time mode. Demo mode never uploads or mixes in your files.
            </p>
          )}
          <div>
            <label htmlFor="food-title" className="mb-1 block text-xs font-medium text-slate-400">Food or recipe name</label>
            <input
              id="food-title"
              required
              minLength={2}
              maxLength={100}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="e.g. Sunday tomato soup"
              className={`w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-indigo-500 ${darkMode ? 'bg-[#080b18] border-indigo-950 text-white' : 'bg-slate-50 border-slate-300'}`}
            />
          </div>
          <div>
            <label htmlFor="food-notes" className="mb-1 block text-xs font-medium text-slate-400">Recipe or memory notes <span className="font-normal">(optional)</span></label>
            <textarea
              id="food-notes"
              rows={4}
              maxLength={4000}
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Ingredients, who shared it, or what you'd change next time…"
              className={`w-full resize-y rounded-lg border px-3 py-2 text-sm outline-none focus:border-indigo-500 ${darkMode ? 'bg-[#080b18] border-indigo-950 text-white' : 'bg-slate-50 border-slate-300'}`}
            />
          </div>
          <div>
            <label htmlFor="food-photo" className="mb-1 block text-xs font-medium text-slate-400">Your food photo · JPEG, PNG, or WebP · up to 5 MB</label>
            <input
              id="food-photo"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(event) => setPhoto(event.target.files?.[0] || null)}
              className="block w-full text-xs text-slate-400 file:mr-3 file:rounded-md file:border-0 file:bg-indigo-600 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-white"
            />
          </div>
          {previewUrl && (
            <div className="relative overflow-hidden rounded-xl border border-indigo-900/60">
              <img src={previewUrl} alt="Preview of your selected food photo" className="max-h-64 w-full object-cover" />
              <button type="button" onClick={() => setPhoto(null)} aria-label="Remove selected photo" className="absolute right-2 top-2 rounded-full bg-black/70 p-1.5 text-white hover:bg-black">
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
          {error && <p className="text-xs text-rose-300" role="alert">{error}</p>}
          <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-indigo-500 disabled:cursor-wait disabled:opacity-60">
            {saving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
            {saving ? 'Uploading securely…' : 'Save food memory'}
          </button>
        </form>

        <section aria-label="Saved food memories" className="space-y-3">
          <h2 className="text-sm font-bold">Your collection <span className="text-slate-500">({memories.length})</span></h2>
          {photoLoadError && <p className="text-xs text-rose-300" role="status">{photoLoadError}</p>}
          {memories.length === 0 ? (
            <div className={`rounded-2xl border p-8 text-center ${panelClass}`}>
              <Utensils className="mx-auto mb-3 h-6 w-6 text-slate-500" />
              <p className="text-sm font-semibold">No food memories yet</p>
              <p className="mt-1 text-xs text-slate-400">Upload your own first photo to begin a private collection.</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {memories.map((memory) => (
                <article key={memory.id} className={`overflow-hidden rounded-2xl border ${panelClass}`}>
                  {photos[memory.id] ? (
                    <img src={photos[memory.id]} alt={memory.title} loading="lazy" className="aspect-[4/3] w-full object-cover" />
                  ) : (
                    <div className="flex aspect-[4/3] items-center justify-center bg-slate-900/50 text-slate-500">
                      Photo unavailable
                    </div>
                  )}
                  <div className="space-y-1.5 p-4">
                    <h3 className="text-sm font-semibold">{memory.title}</h3>
                    <p className="whitespace-pre-wrap text-xs leading-relaxed text-slate-400">{memory.notes || 'No notes added.'}</p>
                    <time className="block pt-1 text-[10px] text-slate-500">{new Date(memory.createdAt).toLocaleDateString()}</time>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </section>
    </div>
  );
};
