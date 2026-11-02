import React, { useState } from 'react';
import {
  UploadCloud,
  FileText,
  RotateCw,
  Clock,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

export const DocumentsPage = ({
  documents: initialDocs,
  onAddDocument,
  darkMode,
}) => {
  const [docs, setDocs] = useState(initialDocs);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  // Keep synced with initialDocs
  React.useEffect(() => {
    setDocs(initialDocs);
  }, [initialDocs]);

  const handleSimulateUpload = async (e) => {
    setUploadError('');
    setUploadSuccess('');
    const file = e.target.files?.[0];
    if (!file) return;

    // Strict File Size Validation: Max 50 MB
    const maxSizeBytes = 50 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setUploadError(`File "${file.name}" exceeds the 50 MB limit (${(file.size / (1024 * 1024)).toFixed(1)} MB).`);
      e.target.value = '';
      return;
    }

    // Supported Extension Validation
    const allowedExtensions = ['pdf', 'docx', 'pptx', 'csv', 'md', 'txt', 'html', 'png', 'jpg', 'jpeg', 'webp'];
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      setUploadError(`File extension ".${ext}" is not supported. Please upload PDF, DOCX, PPTX, CSV, MD, TXT, HTML, or images.`);
      e.target.value = '';
      return;
    }

    const newDoc = {
      id: `doc-${Date.now()}`,
      name: file.name,
      type: ext.toUpperCase(),
      mimeType: file.type || 'application/octet-stream',
      chunks: 0,
      size: file.size < 1024 * 1024 ? `${(file.size / 1024).toFixed(0)} KB` : `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      addedDate: new Date().toISOString(),
      status: 'METADATA ONLY',
    };
    setSaving(true);
    try {
      await onAddDocument?.(newDoc);
      setDocs((previous) => [newDoc, ...previous]);
      setUploadSuccess(`Saved metadata for "${file.name}". The file itself was not uploaded or indexed.`);
      e.target.value = '';
    } catch (error) {
      setUploadError(error.message || `Could not save metadata for "${file.name}".`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 lg:p-8 space-y-6">
      {/* Header matching Screenshot 14 */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className={`text-xl font-bold tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            Documents
          </h1>
          <span className={`px-2 py-0.5 rounded-full border text-[10px] font-semibold ${
            darkMode ? 'bg-indigo-950 border-indigo-800/60 text-indigo-300' : 'bg-indigo-50 border-indigo-200 text-indigo-700'
          }`}>
            FILE METADATA
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          File storage and indexing are not configured. Selecting a file saves its name, type, and size only.
        </p>
      </div>

      {/* Validation / Error Banner */}
      {uploadError && (
        <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{uploadError}</span>
        </div>
      )}

      {uploadSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>{uploadSuccess}</span>
        </div>
      )}

      {/* Drag & Drop Upload Zone */}
      <label className={`block border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
        darkMode
          ? 'border-indigo-900/60 bg-[#0c1024]/70 hover:border-indigo-500/80 hover:bg-[#0f1532]'
          : 'border-slate-300 bg-white hover:border-indigo-500 hover:bg-indigo-50/40 shadow-sm'
      }`}>
        <input
          type="file"
          className="hidden"
          onChange={handleSimulateUpload}
          disabled={saving}
          accept=".pdf,.docx,.pptx,.csv,.md,.txt,.html,image/*"
        />
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.3)]">
            <UploadCloud className="w-6 h-6" />
          </div>
          <div>
            <div className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              {saving ? 'Saving file metadata…' : 'Select a supported file to save metadata only'}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              PDF · DOCX · PPTX · CSV · MD · TXT · HTML · Images — max 50 MB per file
            </div>
          </div>
        </div>
      </label>

      {/* Documents Table matching Screenshot 14 */}
      <div className={`rounded-xl border overflow-hidden shadow-sm ${
        darkMode ? 'border-indigo-950/80 bg-[#0c1024]' : 'border-slate-200 bg-white'
      }`}>
        <table className="w-full text-xs text-left">
          <thead>
            <tr className={`border-b text-slate-400 font-semibold ${
              darkMode ? 'border-indigo-950 bg-[#090c1e]' : 'border-slate-200 bg-slate-50'
            }`}>
              <th className="py-3 px-4">Document</th>
              <th className="py-3 px-4">Chunks</th>
              <th className="py-3 px-4">Size</th>
              <th className="py-3 px-4">Added</th>
              <th className="py-3 px-4">Status</th>
            </tr>
          </thead>
          <tbody className={`divide-y font-sans ${
            darkMode ? 'divide-indigo-950/40 text-slate-300' : 'divide-slate-200 text-slate-700'
          }`}>
            {docs.map((doc) => (
              <tr
                key={doc.id}
                className={darkMode ? 'hover:bg-[#0e142d] transition-colors' : 'hover:bg-slate-50 transition-colors'}
              >
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-4 h-4 text-indigo-400 shrink-0" />
                    <div>
                      <div className={`font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                        {doc.name}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {doc.type} {doc.pageCount && `· ${doc.pageCount}`}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="py-3.5 px-4 font-mono font-medium">
                  {doc.chunks > 0 ? doc.chunks : '—'}
                </td>

                <td className="py-3.5 px-4 font-mono text-slate-400">
                  {doc.size}
                </td>

                <td className="py-3.5 px-4 text-slate-400">
                  {doc.addedDate}
                </td>

                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-3">
                    {doc.status === 'INDEXED' && (
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-bold font-mono tracking-wider bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 uppercase">
                        INDEXED
                      </span>
                    )}

                    {doc.status === 'PROCESSING' && (
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-bold font-mono tracking-wider bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 uppercase animate-pulse flex items-center gap-1">
                        <Clock className="w-3 h-3 animate-spin" />
                        PROCESSING
                      </span>
                    )}

                    {doc.status === 'METADATA ONLY' && (
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-bold font-mono tracking-wider bg-amber-950/80 text-amber-200 border border-amber-800/60 uppercase">
                        METADATA ONLY
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
