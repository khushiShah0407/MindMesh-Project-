import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { BrandMark } from '../components/BrandMark.jsx';

export const PricingPage = ({ onNavigate, darkMode }) => {
  const [annualBilling, setAnnualBilling] = useState(false);

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
          <button onClick={() => onNavigate('features')} className={`${darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}>Features</button>
          <button onClick={() => onNavigate('dashboard')} className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium">Workspace</button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-16 space-y-12">
        {/* Title matching screenshot 3 */}
        <div className="space-y-3">
          <div className="text-[11px] font-bold text-indigo-500 uppercase tracking-wider">PRICING</div>
          <h1 className={`text-4xl sm:text-5xl font-extrabold tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            Five plans.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-cyan-500">
              One honest calculator.
            </span>
          </h1>
          <p className={`text-xs max-w-2xl leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            All plan names, prices, feature lists, and quotas below are illustrative sample data. No subscription service, payment processor, or entitlement backend is connected.
          </p>

          {/* Monthly / Annual Toggle */}
          <div className="flex items-center gap-3 pt-4">
            <span className={`text-xs ${!annualBilling ? (darkMode ? 'text-white font-semibold' : 'text-slate-900 font-semibold') : 'text-slate-400'}`}>Monthly</span>
            <button
              onClick={() => setAnnualBilling(!annualBilling)}
              aria-label="Toggle annual billing preview"
              aria-pressed={annualBilling}
              className="w-11 h-6 bg-indigo-900 rounded-full p-1 transition-colors relative cursor-pointer"
            >
              <div className={`w-4 h-4 rounded-full bg-cyan-400 transition-transform ${annualBilling ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
            <span className={`text-xs flex items-center gap-1.5 ${annualBilling ? (darkMode ? 'text-white font-semibold' : 'text-slate-900 font-semibold') : 'text-slate-400'}`}>
              <span>Annual</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">
                2 months free
              </span>
            </span>
          </div>
        </div>

        {/* 5 Cards Row matching screenshot 3 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 items-stretch">
          {/* Plan 1: Free */}
          <div className={`p-5 rounded-2xl border flex flex-col justify-between ${
            darkMode ? 'bg-[#0c1024] border-indigo-950/80' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className="space-y-3">
              <div className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Free</div>
              <div className="text-[11px] text-slate-400">Start with MindMesh</div>
              <div className={`text-2xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>$0<span className="text-xs font-normal text-slate-400">/mo</span></div>
              <ul className={`space-y-2 text-xs pt-2 border-t ${darkMode ? 'text-slate-300 border-indigo-950' : 'text-slate-700 border-slate-200'}`}>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-indigo-500" /> 500 AI credits / month</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-indigo-500" /> 1 GB storage</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-indigo-500" /> Basic notes & search</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-indigo-500" /> 50 imports / month</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-indigo-500" /> Single device sync</li>
              </ul>
            </div>
            <button
              onClick={() => onNavigate('dashboard')}
              className={`mt-6 w-full py-2 text-xs font-semibold rounded-lg border transition-colors ${
                darkMode ? 'bg-[#141b3a] hover:bg-[#1a2350] text-slate-200 border-indigo-900/60' : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
              }`}
            >
              Start free
            </button>
          </div>

          {/* Plan 2: Basic */}
          <div className={`p-5 rounded-2xl border flex flex-col justify-between ${
            darkMode ? 'bg-[#0c1024] border-indigo-950/80' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className="space-y-3">
              <div className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Basic</div>
              <div className="text-[11px] text-slate-400">For daily capture</div>
              <div className={`text-2xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                {annualBilling ? '$6.50' : '$8'}<span className="text-xs font-normal text-slate-400">/mo</span>
              </div>
              <ul className={`space-y-2 text-xs pt-2 border-t ${darkMode ? 'text-slate-300 border-indigo-950' : 'text-slate-700 border-slate-200'}`}>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-indigo-500" /> 2,000 AI credits / month</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-indigo-500" /> 10 GB storage</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-indigo-500" /> Document search</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-indigo-500" /> Basic memory automation</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-indigo-500" /> Unlimited imports</li>
              </ul>
            </div>
            <button
              onClick={() => onNavigate('billing')}
              className={`mt-6 w-full py-2 text-xs font-semibold rounded-lg border transition-colors ${
                darkMode ? 'bg-[#141b3a] hover:bg-[#1a2350] text-slate-200 border-indigo-900/60' : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
              }`}
            >
              Choose Basic
            </button>
          </div>

          {/* Plan 3: Pro (HIGHLIGHTED) */}
          <div className="p-5 rounded-2xl bg-[#0f1533] border-2 border-indigo-500 shadow-[0_0_35px_-5px_rgba(99,102,241,0.5)] flex flex-col justify-between relative transform -translate-y-1">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-indigo-600 text-[10px] font-bold text-white uppercase tracking-wider">
              MOST POPULAR
            </div>
            <div className="space-y-3">
              <div className="text-sm font-bold text-indigo-300">Pro</div>
              <div className="text-[11px] text-slate-400">The full MindMesh workspace</div>
              <div className="text-2xl font-black text-white">
                {annualBilling ? '$13' : '$16'}<span className="text-xs font-normal text-slate-400">/mo</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-200 pt-2 border-t border-indigo-900">
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-cyan-400" /> 10,000 AI credits / month</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-cyan-400" /> 100 GB storage</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-cyan-400" /> Semantic + hybrid search</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-cyan-400" /> Knowledge graph</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-cyan-400" /> Meeting assistant</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-cyan-400" /> Voice memory</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-cyan-400" /> Productivity insights</li>
              </ul>
            </div>
            <button
              onClick={() => onNavigate('billing')}
              className="mt-6 w-full py-2.5 text-xs font-bold rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 text-white shadow-md transition-all cursor-pointer"
            >
              Choose Pro
            </button>
          </div>

          {/* Plan 4: Premium */}
          <div className={`p-5 rounded-2xl border flex flex-col justify-between ${
            darkMode ? 'bg-[#0c1024] border-indigo-950/80' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className="space-y-3">
              <div className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Premium</div>
              <div className="text-[11px] text-slate-400">Power and priority</div>
              <div className={`text-2xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                {annualBilling ? '$23' : '$28'}<span className="text-xs font-normal text-slate-400">/mo</span>
              </div>
              <ul className={`space-y-2 text-xs pt-2 border-t ${darkMode ? 'text-slate-300 border-indigo-950' : 'text-slate-700 border-slate-200'}`}>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-indigo-500" /> 50,000 AI credits / month</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-indigo-500" /> 1 TB storage</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-indigo-500" /> Priority processing</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-indigo-500" /> Advanced integrations</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-indigo-500" /> Custom AI models</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-indigo-500" /> Screen capture intelligence</li>
              </ul>
            </div>
            <button
              onClick={() => onNavigate('billing')}
              className={`mt-6 w-full py-2 text-xs font-semibold rounded-lg border transition-colors ${
                darkMode ? 'bg-[#141b3a] hover:bg-[#1a2350] text-slate-200 border-indigo-900/60' : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
              }`}
            >
              Choose Premium
            </button>
          </div>

          {/* Plan 5: Enterprise */}
          <div className={`p-5 rounded-2xl border flex flex-col justify-between ${
            darkMode ? 'bg-[#0c1024] border-indigo-950/80' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className="space-y-3">
              <div className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Enterprise</div>
              <div className="text-[11px] text-slate-400">Teams at scale</div>
              <div className={`text-2xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>Custom</div>
              <ul className={`space-y-2 text-xs pt-2 border-t ${darkMode ? 'text-slate-300 border-indigo-950' : 'text-slate-700 border-slate-200'}`}>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-indigo-500" /> Organization workspaces</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-indigo-500" /> Role-based access</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-indigo-500" /> Centralized billing</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-indigo-500" /> Audit logging</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-indigo-500" /> SSO / SAML</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-indigo-500" /> Configurable retention</li>
              </ul>
            </div>
            <button
              onClick={() => onNavigate('billing')}
              className={`mt-6 w-full py-2 text-xs font-semibold rounded-lg border transition-colors ${
                darkMode ? 'bg-[#141b3a] hover:bg-[#1a2350] text-slate-200 border-indigo-900/60' : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
              }`}
            >
              Talk to us
            </button>
          </div>
        </div>

        {/* Capabilities Comparison Table matching screenshot 3 */}
        <div className={`p-6 rounded-2xl border overflow-x-auto shadow-sm ${
          darkMode ? 'bg-[#0c1024] border-indigo-950/80' : 'bg-white border-slate-200'
        }`}>
          <table className="w-full text-xs text-left">
            <thead>
              <tr className={`border-b font-semibold ${darkMode ? 'border-indigo-950 text-slate-400' : 'border-slate-200 text-slate-600'}`}>
                <th className="py-3 px-4">Capability</th>
                <th className="py-3 px-4">Free</th>
                <th className="py-3 px-4">Basic</th>
                <th className="py-3 px-4 text-indigo-500">Pro</th>
                <th className="py-3 px-4">Premium</th>
                <th className="py-3 px-4">Enterprise</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${darkMode ? 'divide-indigo-950/40 text-slate-300' : 'divide-slate-200 text-slate-800'}`}>
              <tr>
                <td className="py-3 px-4">Monthly AI credits</td>
                <td className="py-3 px-4 font-mono">500</td>
                <td className="py-3 px-4 font-mono">2,000</td>
                <td className="py-3 px-4 font-mono text-cyan-400 font-bold">10,000</td>
                <td className="py-3 px-4 font-mono">50,000</td>
                <td className="py-3 px-4 font-mono">Custom</td>
              </tr>
              <tr>
                <td className="py-3 px-4">Storage</td>
                <td className="py-3 px-4 font-mono">1 GB</td>
                <td className="py-3 px-4 font-mono">10 GB</td>
                <td className="py-3 px-4 font-mono text-cyan-400 font-bold">100 GB</td>
                <td className="py-3 px-4 font-mono">1 TB</td>
                <td className="py-3 px-4 font-mono">Custom</td>
              </tr>
              <tr>
                <td className="py-3 px-4">Semantic + hybrid search</td>
                <td className="py-3 px-4">—</td>
                <td className="py-3 px-4"><Check className="w-3.5 h-3.5 text-indigo-500" /></td>
                <td className="py-3 px-4"><Check className="w-3.5 h-3.5 text-cyan-400" /></td>
                <td className="py-3 px-4"><Check className="w-3.5 h-3.5 text-indigo-500" /></td>
                <td className="py-3 px-4"><Check className="w-3.5 h-3.5 text-indigo-500" /></td>
              </tr>
              <tr>
                <td className="py-3 px-4">Knowledge graph</td>
                <td className="py-3 px-4">—</td>
                <td className="py-3 px-4">—</td>
                <td className="py-3 px-4"><Check className="w-3.5 h-3.5 text-cyan-400" /></td>
                <td className="py-3 px-4"><Check className="w-3.5 h-3.5 text-indigo-500" /></td>
                <td className="py-3 px-4"><Check className="w-3.5 h-3.5 text-indigo-500" /></td>
              </tr>
              <tr>
                <td className="py-3 px-4">Meeting assistant</td>
                <td className="py-3 px-4">—</td>
                <td className="py-3 px-4">—</td>
                <td className="py-3 px-4"><Check className="w-3.5 h-3.5 text-cyan-400" /></td>
                <td className="py-3 px-4"><Check className="w-3.5 h-3.5 text-indigo-500" /></td>
                <td className="py-3 px-4"><Check className="w-3.5 h-3.5 text-indigo-500" /></td>
              </tr>
              <tr>
                <td className="py-3 px-4">Voice memory</td>
                <td className="py-3 px-4">—</td>
                <td className="py-3 px-4">—</td>
                <td className="py-3 px-4"><Check className="w-3.5 h-3.5 text-cyan-400" /></td>
                <td className="py-3 px-4"><Check className="w-3.5 h-3.5 text-indigo-500" /></td>
                <td className="py-3 px-4"><Check className="w-3.5 h-3.5 text-indigo-500" /></td>
              </tr>
              <tr>
                <td className="py-3 px-4">Screenshot OCR</td>
                <td className="py-3 px-4">—</td>
                <td className="py-3 px-4">—</td>
                <td className="py-3 px-4">—</td>
                <td className="py-3 px-4"><Check className="w-3.5 h-3.5 text-indigo-500" /></td>
                <td className="py-3 px-4"><Check className="w-3.5 h-3.5 text-indigo-500" /></td>
              </tr>
              <tr>
                <td className="py-3 px-4">Audit logging / SSO</td>
                <td className="py-3 px-4">—</td>
                <td className="py-3 px-4">—</td>
                <td className="py-3 px-4">—</td>
                <td className="py-3 px-4">—</td>
                <td className="py-3 px-4"><Check className="w-3.5 h-3.5 text-indigo-500" /></td>
              </tr>
            </tbody>
          </table>
          <div className="pt-4 text-center text-[11px] text-slate-400">
            Monthly or annual billing · cancellation and grace periods are configurable · payment providers activate with merchant credentials
          </div>
        </div>
      </main>
    </div>
  );
};
