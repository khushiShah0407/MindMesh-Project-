import React from 'react';
import { AlertCircle, ArrowRight, CreditCard } from 'lucide-react';

export const BillingPage = ({ onNavigate, darkMode }) => (
  <div className="max-w-4xl mx-auto p-4 lg:p-8 space-y-6">
    <header>
      <h1 className={`text-xl font-bold tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>Billing & usage</h1>
      <p className="text-xs text-slate-400 mt-1">Billing is not connected to a payment provider.</p>
    </header>
    <section className={`p-6 md:p-8 rounded-2xl border ${darkMode ? 'bg-[#0c1024] border-indigo-950/80' : 'bg-white border-slate-200'}`}>
      <div className="w-12 h-12 rounded-xl bg-amber-950/50 border border-amber-800/60 flex items-center justify-center text-amber-300">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h2 className={`mt-5 text-lg font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>No subscription or payment data available</h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">
        MindMesh has no configured billing backend. Plan cards are informational only; this page does not display invented charges, invoices, usage quotas, or claim to update a subscription.
      </p>
      <button
        type="button"
        onClick={() => onNavigate('pricing')}
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500"
      >
        View plan information <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </section>
  </div>
);
