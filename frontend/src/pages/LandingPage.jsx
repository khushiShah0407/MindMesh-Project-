import React, { useState } from 'react';
import { BrandMark } from '../components/BrandMark.jsx';
import {
  Sparkles,
  ArrowRight,
  Share2,
  CheckCircle2,
  ChevronDown,
  Sun,
  Moon,
  Layers,
  Search,
  Shield,
  FileText,
  Users2,
  Brain,
  Camera,
  Mic,
  Menu,
  X
} from 'lucide-react';

export const LandingPage = ({ onNavigate, darkMode, onToggleTheme }) => {
  const [openFaq, setOpenFaq] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigateFromMenu = (view) => {
    onNavigate(view);
    setMobileMenuOpen(false);
  };

  const faqs = [
    {
      q: 'What actually is a "second brain"?',
      a: 'MindMesh is a workspace for collecting notes and related knowledge in one place. You can organize saved records, browse the knowledge graph, and search your current workspace.'
    },
    {
      q: 'Does MindMesh currently use AI or semantic search?',
      a: 'No AI model, embeddings service, or semantic search provider is connected in this build. Assistant and Search use local keyword matching against available records, and clearly identify matches rather than generating AI answers.'
    },
    {
      q: 'What happens to my data if I delete something?',
      a: 'In Live mode, supported records are stored in the signed-in user’s Firestore collection and deleted records are removed from that collection. Demo records are stored separately in this browser. Document capture stores metadata only; it does not upload document contents.'
    },
    {
      q: 'Can I use AI summaries or meeting transcription?',
      a: 'Not in this build. There is no AI or transcription service configured. Meeting notes can be edited manually; the app does not record or transcribe calls.'
    },
    {
      q: 'Are plans and billing active?',
      a: 'The pricing and billing screens are informational previews. No payment processor or subscription service is connected, so they do not create charges or change a subscription.'
    },
    {
      q: 'Are meetings live?',
      a: 'Meeting rooms use the configured Jitsi host after the participant confirms the provider notice. Meeting metadata and notes can be saved, but recording, transcription, calendar invitations, and provider-side authorization are not connected.'
    }
  ];

  return (
    <div className={`min-h-screen transition-colors ${
      darkMode ? 'bg-[#070913] text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Top Navigation Bar */}
      <nav className={`sticky top-0 z-40 border-b backdrop-blur-md px-6 py-4 flex items-center justify-between transition-colors ${
        darkMode ? 'bg-[#070913]/90 border-indigo-950/70' : 'bg-white/90 border-slate-200'
      }`}>
        <div className="flex items-center gap-8">
          <button
            onClick={() => navigateFromMenu('home')}
            className="flex items-center gap-2.5 cursor-pointer"
          >
            <BrandMark />
            <span className={`font-bold text-sm tracking-wider ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              MindMesh
            </span>
          </button>

          <div className="hidden md:flex items-center gap-6 text-xs font-medium">
            <button onClick={() => onNavigate('features')} className={`${darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'} transition-colors`}>Features</button>
            <button onClick={() => onNavigate('pricing')} className={`${darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'} transition-colors`}>Pricing</button>
            <button onClick={() => onNavigate('use-cases')} className={`${darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'} transition-colors`}>Use cases</button>
            <button onClick={() => onNavigate('security')} className={`${darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'} transition-colors`}>Security</button>
            <button onClick={() => onNavigate('dashboard')} className={`${darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'} transition-colors`}>Docs</button>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={onToggleTheme}
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              darkMode ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
          </button>
          <button
            onClick={() => onNavigate('signin')}
            className={`text-xs font-medium transition-colors hidden sm:block ${
              darkMode ? 'text-slate-300 hover:text-white' : 'text-slate-700 hover:text-slate-950'
            }`}
          >
            Sign in
          </button>
          <button
            onClick={() => onNavigate('dashboard')}
            className="hidden sm:block px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-[0_0_20px_-3px_rgba(99,102,241,0.5)] transition-all cursor-pointer"
          >
            Get started
          </button>
          <button
            onClick={() => setMobileMenuOpen((open) => !open)}
            className={`p-2 rounded-lg md:hidden ${
              darkMode ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-700 hover:bg-slate-200'
            }`}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
        {mobileMenuOpen && (
          <div className={`absolute top-full left-0 right-0 border-b p-4 md:hidden space-y-1 ${
            darkMode ? 'bg-[#0b1020] border-indigo-950' : 'bg-white border-slate-200'
          }`}>
            {[
              ['features', 'Features'],
              ['pricing', 'Pricing'],
              ['use-cases', 'Use cases'],
              ['security', 'Security'],
              ['dashboard', 'Docs'],
              ['signin', 'Sign in'],
            ].map(([view, label]) => (
              <button
                key={view}
                onClick={() => navigateFromMenu(view)}
                className={`block w-full text-left px-3 py-2 rounded-lg text-sm ${
                  darkMode ? 'text-slate-200 hover:bg-slate-800' : 'text-slate-800 hover:bg-slate-100'
                }`}
              >
                {label}
              </button>
            ))}
            <button
              onClick={() => navigateFromMenu('register')}
              className="block w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-indigo-400 hover:bg-indigo-950/40"
            >
              Get started
            </button>
          </div>
        )}
      </nav>

      <section className="relative max-w-6xl mx-auto px-6 py-14 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-[0.92fr_1.08fr] items-center gap-10 lg:gap-14">
          <div className="space-y-6 text-center lg:text-left">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[11px] ${
              darkMode ? 'bg-indigo-950/80 border-indigo-800/60 text-indigo-300' : 'bg-indigo-50 border-indigo-200 text-indigo-700'
            }`}>
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>YOUR KNOWLEDGE, CONNECTED</span>
            </div>

            <h1 className={`text-4xl sm:text-6xl lg:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto lg:mx-0 leading-tight ${
              darkMode ? 'text-white' : 'text-slate-900'
            }`}>
              Remember everything.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-400">
                Connect anything.
              </span>
            </h1>

            <p className={`text-sm sm:text-base max-w-2xl mx-auto lg:mx-0 leading-relaxed ${
              darkMode ? 'text-slate-400' : 'text-slate-600'
            }`}>
              Capture notes and meeting details, keep document metadata, and search your saved workspace.
              AI-generated answers, semantic search, and document-content indexing are not connected in this build.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={() => onNavigate('register')}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs sm:text-sm shadow-[0_0_25px_-5px_rgba(99,102,241,0.6)] transition-all cursor-pointer"
              >
                <span>Create account</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onNavigate('dashboard')}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl border font-semibold text-xs sm:text-sm transition-all cursor-pointer ${
                  darkMode
                    ? 'bg-[#0e1329] hover:bg-[#151c3d] text-slate-200 border-indigo-900/60'
                    : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300 shadow-sm'
                }`}
              >
                <span>Explore demo workspace</span>
                <ArrowRight className="w-4 h-4 text-indigo-500" />
              </button>
            </div>
          </div>

          <div className="w-full max-w-4xl mx-auto">
          <div className={`rounded-2xl border p-4 shadow-xl overflow-hidden ${
            darkMode ? 'border-indigo-900/50 bg-[#0c1024]' : 'border-slate-300 bg-white'
          }`}>
          <div className="mb-2 text-left text-[10px] font-medium uppercase tracking-wide text-amber-400">
            Illustrative demo content — not a live AI response
          </div>
          <div className={`h-6 flex items-center gap-1.5 px-3 border-b mb-3 ${
              darkMode ? 'border-indigo-950/80' : 'border-slate-200'
            }`}>
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              <span className="ml-3 text-[10px] text-slate-400 font-mono">mindmesh.app/workspace/assistant</span>
            </div>
            <div className={`p-4 rounded-xl text-left space-y-3 ${
              darkMode ? 'bg-[#070914]' : 'bg-slate-50'
            }`}>
              <div className="text-xs text-indigo-500 font-semibold">User: "What did we decide about pricing last week?"</div>
              <div className={`p-3 rounded-lg border text-xs leading-relaxed ${
                darkMode ? 'bg-[#0d1229] border-indigo-950 text-slate-200' : 'bg-white border-slate-200 text-slate-800'
              }`}>
                On Nov 28 you and Sam decided to move the value metric to a seat floor + metered AI credits. Annual prepay will be framed as two months free.
              </div>
              <div className="flex gap-2 text-[10px]">
                <span className={`px-2 py-0.5 rounded border ${
                  darkMode ? 'bg-indigo-950 border-indigo-800 text-indigo-300' : 'bg-indigo-50 border-indigo-200 text-indigo-700'
                }`}>Pricing review · Meeting</span>
                <span className={`px-2 py-0.5 rounded border ${
                  darkMode ? 'bg-purple-950 border-purple-800 text-purple-300' : 'bg-purple-50 border-purple-200 text-purple-700'
                }`}>Q3 pricing hypothesis · Memory</span>
              </div>
            </div>
          </div>
        </div>
        </div>

        {/* Integration Badges */}
        <div className="pt-12 flex flex-wrap items-center justify-center gap-8 text-xs text-slate-400 font-mono">
          <span>Slack, GitHub, and Chrome integrations are not configured</span>
        </div>
      </section>

      {/* Graph Visual Section matching Screenshot 1 */}
      <section className={`py-20 px-6 border-t ${
        darkMode ? 'border-indigo-950/60 bg-[#090c1b]/50' : 'border-slate-200 bg-slate-100/60'
      }`}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-4 text-left">
            <div className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider">
              KNOWLEDGE GRAPH
            </div>
            <h2 className={`text-3xl sm:text-4xl font-bold tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              Folders are where ideas go to hide.<br />
              <span className="text-indigo-500">A graph is where they multiply.</span>
            </h2>
            <p className={`text-xs sm:text-sm leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Browse notes, meetings, and contacts as a graph. Live graph edges are built from available
              records; AI-suggested links and source provenance are not currently generated.
            </p>
            <ul className={`space-y-2 text-xs pt-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>In the interactive graph demo, drag and zoom to explore memory clusters</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Example connections are based on saved records</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Document contents are not uploaded or indexed</span>
              </li>
            </ul>
            <div className="pt-4">
              <button
                onClick={() => onNavigate('graph')}
                className="px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md transition-all cursor-pointer"
              >
                Explore the graph demo →
              </button>
            </div>
          </div>

          {/* Illustrative graph preview; this is sample content, not live workspace data. */}
          <figure className={`p-5 sm:p-6 rounded-2xl border shadow-xl relative overflow-hidden ${
            darkMode ? 'bg-[#0c1024] border-indigo-950/80' : 'bg-white border-slate-300'
          }`}>
            <div className={`absolute inset-0 opacity-30 ${darkMode ? 'neural-grid' : 'neural-grid-light'}`} />
            <div
              role="img"
              aria-label="Illustrative demo graph: Pricing v2 is connected to Sam and Note. This is demo content only."
              className="relative z-10"
            >
              <div className="relative mx-auto h-[224px] max-w-[320px] sm:h-[240px] sm:max-w-[600px]">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 600 240"
                  preserveAspectRatio="none"
                  className="absolute inset-0 hidden h-full w-full sm:block"
                >
                  <path
                    d="M 222 120 C 280 120, 300 70, 378 70 M 222 120 C 280 120, 300 170, 378 170"
                    fill="none"
                    stroke={darkMode ? '#67e8f9' : '#0e7490'}
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                <svg
                  aria-hidden="true"
                  viewBox="0 0 320 224"
                  preserveAspectRatio="none"
                  className="absolute inset-0 h-full w-full sm:hidden"
                >
                  <path
                    d="M 160 64 V 108 M 160 108 C 140 108, 136 136, 80 160 M 160 108 C 180 108, 184 136, 240 160"
                    fill="none"
                    stroke={darkMode ? '#67e8f9' : '#0e7490'}
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>

                <div className="relative grid h-full grid-rows-[64px_1fr_64px] justify-items-center sm:grid-cols-2 sm:grid-rows-1">
                  <div className={`col-start-1 row-start-1 flex h-16 w-40 flex-col items-center justify-center gap-1 rounded-2xl border shadow-md sm:col-start-1 sm:row-start-1 sm:h-[76px] sm:w-36 sm:self-center ${
                    darkMode
                      ? 'border-cyan-400/70 bg-cyan-950/75 text-cyan-100'
                      : 'border-cyan-600 bg-cyan-50 text-cyan-950'
                  }`}>
                    <span className={`text-[11px] font-bold uppercase tracking-[0.1em] ${darkMode ? 'text-cyan-300' : 'text-cyan-800'}`}>
                      Project
                    </span>
                    <span className="text-sm font-bold leading-tight">Pricing v2</span>
                  </div>
                  <div className="col-span-full col-start-1 row-start-3 grid w-full grid-cols-2 items-end justify-items-center gap-3 sm:col-span-1 sm:col-start-2 sm:row-start-1 sm:flex sm:h-full sm:flex-col sm:justify-center sm:gap-6">
                    <div className={`flex h-16 w-full max-w-[112px] flex-col items-center justify-center gap-1 rounded-2xl border shadow-md sm:h-[76px] sm:w-36 sm:max-w-none ${
                      darkMode
                        ? 'border-indigo-400/70 bg-indigo-950/75 text-indigo-100'
                        : 'border-indigo-600 bg-indigo-50 text-indigo-950'
                    }`}>
                      <span className={`text-[11px] font-bold uppercase tracking-[0.1em] ${darkMode ? 'text-indigo-300' : 'text-indigo-800'}`}>
                        Contact
                      </span>
                      <span className="text-sm font-bold leading-tight">Sam</span>
                    </div>
                    <div className={`flex h-16 w-full max-w-[112px] flex-col items-center justify-center gap-1 rounded-2xl border shadow-md sm:h-[76px] sm:w-36 sm:max-w-none ${
                      darkMode
                        ? 'border-fuchsia-400/70 bg-fuchsia-950/75 text-fuchsia-100'
                        : 'border-fuchsia-600 bg-fuchsia-50 text-fuchsia-950'
                    }`}>
                      <span className={`text-[11px] font-bold uppercase tracking-[0.1em] ${darkMode ? 'text-fuchsia-300' : 'text-fuchsia-800'}`}>
                        Record
                      </span>
                      <span className="text-sm font-bold leading-tight">Note</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <figcaption className={`relative z-10 mt-5 text-center text-[11px] font-mono leading-relaxed ${
              darkMode ? 'text-slate-300' : 'text-slate-600'
            }`}>
              Illustrative sample graph · demo content only
            </figcaption>
          </figure>
        </div>
      </section>

      {/* Grid Features matching Screenshot 1 */}
      <section className="py-20 px-6 max-w-6xl mx-auto text-center space-y-12">
        <div>
          <div className="text-[11px] font-bold text-indigo-500 uppercase tracking-wider mb-2">
          WORKSPACE OVERVIEW
          </div>
          <h2 className={`text-3xl sm:text-4xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            Everything you know, finally in one place
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className={`p-6 rounded-xl border space-y-3 transition-all ${
            darkMode ? 'bg-[#0c1024] border-indigo-950/80 hover:border-indigo-800/60' : 'bg-white border-slate-200 hover:border-indigo-300 shadow-sm'
          }`}>
            <div className="text-[10px] font-bold text-indigo-400 uppercase">SYNTHESIS · ASSISTANT</div>
            <h3 className={`text-base font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Ask your past, get sources back</h3>
            <p className="text-xs text-slate-400">The Assistant finds keyword matches in saved notes and meetings. It does not generate answers or use a vector index.</p>
          </div>

          <div className={`p-6 rounded-xl border space-y-3 transition-all ${
            darkMode ? 'bg-[#0c1024] border-indigo-950/80 hover:border-indigo-800/60' : 'bg-white border-slate-200 hover:border-indigo-300 shadow-sm'
          }`}>
            <div className="text-[10px] font-bold text-cyan-400 uppercase">MEMORY VAULT</div>
            <h3 className={`text-base font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Facts, labeled</h3>
            <p className="text-xs text-slate-400">Organize notes and other saved records. Demo content is separate from signed-in Firebase data.</p>
          </div>

          <div className={`p-6 rounded-xl border space-y-3 transition-all ${
            darkMode ? 'bg-[#0c1024] border-indigo-950/80 hover:border-indigo-800/60' : 'bg-white border-slate-200 hover:border-indigo-300 shadow-sm'
          }`}>
            <div className="text-[10px] font-bold text-purple-400 uppercase">VOICE MEMORY</div>
            <h3 className={`text-base font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Think out loud</h3>
            <p className="text-xs text-slate-400">Capture voice notes with browser microphone permission. Transcription and automatic action extraction are not available.</p>
          </div>

          <div className={`p-6 rounded-xl border space-y-3 transition-all ${
            darkMode ? 'bg-[#0c1024] border-indigo-950/80 hover:border-indigo-800/60' : 'bg-white border-slate-200 hover:border-indigo-300 shadow-sm'
          }`}>
            <div className="text-[10px] font-bold text-emerald-400 uppercase">MEETINGS</div>
            <h3 className={`text-base font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Rooms and manual notes</h3>
            <p className="text-xs text-slate-400">Join Jitsi-hosted rooms and edit meeting notes. Recording, transcripts, and AI summaries are not connected.</p>
          </div>

          <div className={`p-6 rounded-xl border space-y-3 transition-all ${
            darkMode ? 'bg-[#0c1024] border-indigo-950/80 hover:border-indigo-800/60' : 'bg-white border-slate-200 hover:border-indigo-300 shadow-sm'
          }`}>
            <div className="text-[10px] font-bold text-amber-400 uppercase">INSIGHTS</div>
            <h3 className={`text-base font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Reviews that explain themselves</h3>
            <p className="text-xs text-slate-400">Review the Insights workspace. Demo-mode charts and activity are sample data, not account analytics.</p>
          </div>

          <div className={`p-6 rounded-xl border space-y-3 transition-all ${
            darkMode ? 'bg-[#0c1024] border-indigo-950/80 hover:border-indigo-800/60' : 'bg-white border-slate-200 hover:border-indigo-300 shadow-sm'
          }`}>
            <div className="text-[10px] font-bold text-rose-400 uppercase">INFRASTRUCTURE</div>
            <h3 className={`text-base font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Firebase workspace</h3>
            <p className="text-xs text-slate-400">When configured, Firebase Authentication and Firestore store user-scoped records. CloudSQL is an informational schema preview; no SQL service is connected.</p>
          </div>
        </div>
      </section>

      {/* FAQ Section matching Screenshot 1 */}
      <section className="py-20 px-6 max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <div className="text-[11px] font-bold text-indigo-500 uppercase tracking-wider mb-1">
            QUESTIONS
          </div>
          <h2 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            The honest FAQ
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((f, i) => (
            <div
              key={i}
              className={`rounded-xl border overflow-hidden ${
                darkMode ? 'border-indigo-950/80 bg-[#0c1024]' : 'border-slate-200 bg-white shadow-sm'
              }`}
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className={`w-full flex items-center justify-between p-4 text-left text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                  darkMode ? 'text-slate-200 hover:text-white' : 'text-slate-800 hover:text-slate-950'
                }`}
              >
                <span>{f.q}</span>
                <ChevronDown className={`w-4 h-4 text-indigo-400 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
              </button>
              {openFaq === i && (
                <div className={`px-4 pb-4 text-xs leading-relaxed border-t pt-3 ${
                  darkMode ? 'text-slate-400 border-indigo-950/40' : 'text-slate-600 border-slate-100'
                }`}>
                  {f.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer CTA matching Screenshot 1 */}
      <section className={`py-20 px-6 border-t text-center space-y-6 ${
        darkMode ? 'border-indigo-950/60' : 'border-slate-200'
      }`}>
        <h2 className={`text-3xl sm:text-4xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
          Keep your knowledge organized. <span className="text-indigo-500">Explore MindMesh.</span>
        </h2>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => onNavigate('register')}
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs sm:text-sm shadow-lg transition-all cursor-pointer"
          >
            Create a MindMesh account →
          </button>
          <button
            onClick={() => onNavigate('dashboard')}
            className={`px-6 py-3 rounded-xl border font-semibold text-xs sm:text-sm transition-all cursor-pointer ${
              darkMode
                ? 'bg-[#0e1329] hover:bg-[#151c3d] text-slate-300 border-indigo-900/60'
                : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300 shadow-sm'
            }`}
          >
            Peek at the demo →
          </button>
        </div>
      </section>

      {/* Footer matching PDF screenshot */}
      <footer className={`border-t py-16 px-6 max-w-6xl mx-auto text-xs ${
        darkMode ? 'border-indigo-950/80 text-slate-400' : 'border-slate-200 text-slate-600'
      }`}>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <BrandMark className="h-6 w-6" />
              <span className={`font-bold tracking-wider ${darkMode ? 'text-white' : 'text-slate-900'}`}>MindMesh</span>
            </div>
            <p className="text-xs leading-relaxed max-w-sm">
              Capture everything. Find what matters. Keep your knowledge connected.
            </p>
            <div className="text-[11px] font-mono opacity-60">
              © 2026 MindMesh
            </div>
          </div>

          <div>
            <div className={`font-mono text-[10px] uppercase font-bold tracking-wider mb-3 ${darkMode ? 'text-slate-300' : 'text-slate-900'}`}>
              PRODUCT
            </div>
            <ul className="space-y-2">
              <li><button onClick={() => onNavigate('features')} className="hover:text-indigo-400 transition-colors">Features</button></li>
              <li><button onClick={() => onNavigate('pricing')} className="hover:text-indigo-400 transition-colors">Pricing</button></li>
              <li><button onClick={() => onNavigate('use-cases')} className="hover:text-indigo-400 transition-colors">Use cases</button></li>
              <li><button onClick={() => onNavigate('dashboard')} className="hover:text-indigo-400 transition-colors">Open demo</button></li>
            </ul>
          </div>

          <div>
            <div className={`font-mono text-[10px] uppercase font-bold tracking-wider mb-3 ${darkMode ? 'text-slate-300' : 'text-slate-900'}`}>
              COMPANY
            </div>
            <ul className="space-y-2">
              <li><button onClick={() => onNavigate('security')} className="hover:text-indigo-400 transition-colors">Security</button></li>
              <li><button onClick={() => onNavigate('dashboard')} className="hover:text-indigo-400 transition-colors">Docs</button></li>
              <li><button onClick={() => onNavigate('security')} className="hover:text-indigo-400 transition-colors">Contact</button></li>
            </ul>
          </div>

          <div>
            <div className={`font-mono text-[10px] uppercase font-bold tracking-wider mb-3 ${darkMode ? 'text-slate-300' : 'text-slate-900'}`}>
              WORKSPACE
            </div>
            <ul className="space-y-2">
              <li><button onClick={() => onNavigate('signin')} className="hover:text-indigo-400 transition-colors">Sign in</button></li>
              <li><button onClick={() => onNavigate('register')} className="hover:text-indigo-400 transition-colors">Register</button></li>
              <li><button onClick={() => onNavigate('admin')} className="hover:text-indigo-400 transition-colors">Admin console</button></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
};
