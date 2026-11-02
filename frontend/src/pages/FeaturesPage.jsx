import React from 'react';
import { BrandMark } from '../components/BrandMark.jsx';
import {
  Share2,
  FileText,
  Users2,
  Camera,
  Mic,
  Clock,
  Layers,
  Search,
  Shield,
  ArrowRight
} from 'lucide-react';

export const FeaturesPage = ({ onNavigate, darkMode }) => {
  return (
    <div className={`min-h-screen transition-colors ${darkMode ? 'bg-[#070913] text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      {/* Top Header */}
      <header className={`px-4 sm:px-6 py-4 border-b flex flex-wrap items-center justify-between gap-y-3 max-w-6xl mx-auto ${
        darkMode ? 'border-indigo-950' : 'border-slate-200'
      }`}>
        <button onClick={() => onNavigate('home')} className="flex items-center gap-2 cursor-pointer">
          <BrandMark />
          <span className={`font-bold text-sm tracking-wider ${darkMode ? 'text-white' : 'text-slate-900'}`}>MindMesh</span>
        </button>
        <div className="flex max-w-full flex-wrap items-center justify-end gap-x-3 gap-y-2 text-[11px] sm:gap-x-6 sm:text-xs">
          <button onClick={() => onNavigate('home')} className={`${darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}>Home</button>
          <button onClick={() => onNavigate('pricing')} className={`${darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}>Pricing</button>
          <button onClick={() => onNavigate('dashboard')} className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium">Workspace</button>
        </div>
      </header>

      {/* Main Container matching Screenshot 2 */}
      <main className="max-w-4xl mx-auto px-6 py-16 space-y-12">
        <div className="space-y-3">
          <div className="text-[11px] font-bold text-indigo-500 uppercase tracking-wider">FEATURES</div>
          <h1 className={`text-4xl sm:text-5xl font-extrabold tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            Not a notes app.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-cyan-500">
              A memory with a query interface.
            </span>
          </h1>
        </div>

        {/* Feature Cards matching screenshot 2 */}
        <div className="space-y-6">
          {/* Card 1: Knowledge Graph */}
          <div className={`p-6 rounded-2xl border shadow-sm space-y-3 ${
            darkMode ? 'bg-[#0c1024] border-indigo-950/80' : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center gap-2 text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
              <Share2 className="w-3.5 h-3.5" />
              <span>KNOWLEDGE GRAPH</span>
            </div>
            <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Ideas that introduce themselves</h2>
            <p className={`text-xs leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Browse notes, meetings, and contacts as graph nodes. The current graph is a lightweight view of saved records; it does not extract entities with AI or attach provenance to generated links.
            </p>
          </div>

          {/* Card 2: Document Intelligence */}
          <div className={`p-6 rounded-2xl border shadow-sm space-y-3 ${
            darkMode ? 'bg-[#0c1024] border-indigo-950/80' : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center gap-2 text-[10px] font-bold text-indigo-500 uppercase tracking-wider">
              <FileText className="w-3.5 h-3.5" />
              <span>DOCUMENT INTELLIGENCE</span>
            </div>
            <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Keep document references with your notes</h2>
            <p className={`text-xs leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Save document metadata in your workspace. File contents are not uploaded, parsed, embedded, or indexed in this build, so document question-answering and page-level citations are unavailable.
            </p>
          </div>

          {/* Card 3: Meeting Assistant */}
          <div className={`p-6 rounded-2xl border shadow-sm space-y-3 ${
            darkMode ? 'bg-[#0c1024] border-indigo-950/80' : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center gap-2 text-[10px] font-bold text-purple-400 uppercase tracking-wider">
              <Users2 className="w-3.5 h-3.5" />
              <span>MEETING ASSISTANT</span>
            </div>
            <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Meeting rooms and editable notes</h2>
            <p className={`text-xs leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Join a third-party Jitsi room after reviewing its provider notice, and keep editable meeting notes. MindMesh does not record calls, create transcripts, or generate AI summaries and action items.
            </p>
          </div>

          {/* 3 Grid Rows */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className={`p-5 rounded-xl border space-y-2 ${
              darkMode ? 'bg-[#0c1024] border-indigo-950' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <Camera className="w-4 h-4 text-cyan-400" />
              <h3 className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Screenshot search</h3>
              <p className="text-xs text-slate-400">Save and organize screenshot records. OCR and image-understanding services are not configured, so image contents are not semantically searchable.</p>
            </div>

            <div className={`p-5 rounded-xl border space-y-2 ${
              darkMode ? 'bg-[#0c1024] border-indigo-950' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <Mic className="w-4 h-4 text-purple-400" />
              <h3 className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Voice memory</h3>
              <p className="text-xs text-slate-400">Record voice notes when browser permissions allow. Speech-to-text, automatic takeaways, and action extraction are not connected.</p>
            </div>

            <div className={`p-5 rounded-xl border space-y-2 ${
              darkMode ? 'bg-[#0c1024] border-indigo-950' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <Clock className="w-4 h-4 text-blue-400" />
              <h3 className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>AI timeline</h3>
              <p className="text-xs text-slate-400">Review saved timeline records by their available dates. The app does not infer dates or generate AI event summaries.</p>
            </div>
          </div>

          {/* 3 More Grid Rows */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className={`p-5 rounded-xl border space-y-2 ${
              darkMode ? 'bg-[#0c1024] border-indigo-950' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <Layers className="w-4 h-4 text-emerald-400" />
              <h3 className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Smart notes</h3>
              <p className="text-xs text-slate-400">Create and organize notes in your selected demo or Firebase-backed workspace. AI rewrite and summarization actions are unavailable.</p>
            </div>

            <div className={`p-5 rounded-xl border space-y-2 ${
              darkMode ? 'bg-[#0c1024] border-indigo-950' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <Search className="w-4 h-4 text-amber-400" />
              <h3 className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Hybrid retrieval</h3>
              <p className="text-xs text-slate-400">Search available workspace records by keyword. Vector search, reranking, and AI-generated answers are not connected.</p>
            </div>

            <div className={`p-5 rounded-xl border space-y-2 ${
              darkMode ? 'bg-[#0c1024] border-indigo-950' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <Shield className="w-4 h-4 text-rose-400" />
              <h3 className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Privacy by default</h3>
              <p className="text-xs text-slate-400">Firebase rules scope stored records to the signed-in user. No embedding index, AI extraction, or separate server API is connected.</p>
            </div>
          </div>
        </div>

        {/* Tour CTA matching screenshot 2 */}
        <div className="text-center pt-8 space-y-4">
          <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">AND THE REST</div>
          <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            Assistant, timeline, insights, collections, billing — all in the workspace tour.
          </h3>
          <button
            onClick={() => onNavigate('dashboard')}
            className="px-6 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md transition-all cursor-pointer"
          >
            Take the workspace tour →
          </button>
        </div>
      </main>
    </div>
  );
};
