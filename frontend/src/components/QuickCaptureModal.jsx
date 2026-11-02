import React, { useState } from 'react';
import { X, Sparkles, Tag } from 'lucide-react';

export const QuickCaptureModal = ({
  isOpen,
  onClose,
  onSaveCapture,
  darkMode,
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tag, setTag] = useState('#IDEAS');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    const newNote = {
      id: `note-${Date.now()}`,
      title: title.trim() || 'Quick captured thought',
      content: content.trim(),
      tags: [tag.toUpperCase()],
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString().split('T')[0],
      backlinks: [],
    };

    setSaveError('');
    setIsSaving(true);
    try {
      await onSaveCapture(newNote);
      setTitle('');
      setContent('');
      onClose();
    } catch (error) {
      setSaveError(error.message || 'This note could not be saved.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className={`w-full max-w-xl rounded-xl shadow-[0_0_50px_-10px_rgba(99,102,241,0.3)] overflow-hidden border ${
        darkMode ? 'bg-[#0c1024] border-indigo-900/60' : 'bg-white border-slate-200'
      }`}>
        {/* Modal Header */}
        <div className={`flex items-center justify-between px-5 py-4 border-b ${
          darkMode ? 'border-indigo-950/80 bg-[#090c1c]' : 'border-slate-200 bg-slate-50'
        }`}>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                Quick Capture
              </h3>
              <p className="text-[11px] text-slate-400">Save a thought, decision, or quote in MindMesh</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className={`block text-xs font-medium mb-1 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              Title (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Epiphany on pricing discount curves..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full px-3 py-2 text-xs rounded-lg transition-colors focus:outline-none border ${
                darkMode
                  ? 'bg-[#111736] border-indigo-900/40 text-white placeholder-slate-500 focus:border-indigo-500'
                  : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-indigo-500'
              }`}
            />
          </div>

          <div>
            <label className={`block text-xs font-medium mb-1 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              Content / Memory text
            </label>
            <textarea
              rows={4}
              placeholder="What's on your mind? Mention people, topics, numbers, or copy-paste transcripts..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              className={`w-full px-3 py-2 text-xs rounded-lg transition-colors focus:outline-none border resize-none font-sans ${
                darkMode
                  ? 'bg-[#111736] border-indigo-900/40 text-white placeholder-slate-500 focus:border-indigo-500'
                  : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-indigo-500'
              }`}
            />
          </div>

          {/* Tag selector */}
          <div className="flex items-center gap-2">
            <Tag className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs text-slate-400">Tag:</span>
            {['#IDEAS', '#PRICING', '#ARCHITECTURE', '#READING', '#MEETING'].map((t) => (
              <button
                type="button"
                key={t}
                onClick={() => setTag(t)}
                className={`text-[11px] px-2 py-0.5 rounded-full border transition-all ${
                  tag === t
                    ? 'bg-indigo-600/30 text-indigo-300 border-indigo-500 font-semibold'
                    : darkMode
                    ? 'bg-[#111736] text-slate-400 border-indigo-950 hover:border-slate-700'
                    : 'bg-slate-100 text-slate-600 border-slate-200 hover:border-slate-400'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* AI actions are withheld until an actual model service is configured. */}
          {content.length > 12 && (
            <div className={`p-3 rounded-lg border space-y-2 ${
              darkMode ? 'bg-[#080b18] border-indigo-950' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium text-indigo-400 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  Memory suggestions
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                AI extraction and embeddings are unavailable until a model service is configured. Your text is saved as entered.
              </p>
            </div>
          )}

          {saveError && <p role="alert" className="text-xs text-rose-400">{saveError}</p>}

          {/* Footer controls */}
          <div className={`flex items-center justify-end gap-3 pt-3 border-t ${
            darkMode ? 'border-indigo-950/80' : 'border-slate-200'
          }`}>
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors ${
                darkMode ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 rounded-lg shadow-[0_0_20px_-3px_rgba(99,102,241,0.5)] transition-all cursor-pointer"
            >
              {isSaving ? 'Saving…' : 'Save to MindMesh'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
