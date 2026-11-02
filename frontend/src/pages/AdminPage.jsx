import React, { useState } from 'react';
import {
  ShieldAlert,
  Users2,
  Cpu,
  ArrowLeft,
} from 'lucide-react';
import { initialAdminUsers, initialAuditLogs } from '../data/mockData';

export const AdminPage = ({ onNavigate, darkMode }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [users] = useState(initialAdminUsers);
  const [auditLogs] = useState(initialAuditLogs);

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-4rem)]">
      {/* Admin Subnav */}
      <div className={`w-full md:w-56 border-r p-4 space-y-1 ${
        darkMode ? 'bg-[#090c1a] border-indigo-950/80' : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="flex items-center gap-2 mb-4 px-3 py-1">
          <ShieldAlert className="w-4 h-4 text-purple-400" />
          <span className={`text-xs font-bold uppercase tracking-wider ${
            darkMode ? 'text-white' : 'text-slate-900'
          }`}>
            Admin Console
          </span>
        </div>

        {[
          { id: 'overview', label: 'Overview' },
          { id: 'users', label: 'Users' },
          { id: 'plans', label: 'Plans' },
          { id: 'jobs', label: 'Jobs' },
          { id: 'integrations', label: 'Integrations' },
          { id: 'audit', label: 'Audit' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
              activeTab === tab.id
                ? darkMode
                  ? 'bg-purple-900/30 text-purple-300 border border-purple-700/50'
                  : 'bg-purple-100 text-purple-900 border border-purple-300'
                : darkMode
                ? 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            {tab.label}
          </button>
        ))}

        <div className="pt-6">
          <button
            onClick={() => onNavigate('dashboard')}
            className={`flex items-center gap-1.5 text-xs px-3 transition-colors ${
              darkMode ? 'text-slate-500 hover:text-slate-300' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Workspace</span>
          </button>
        </div>
      </div>

      {/* Main Admin Content Area */}
      <div className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-6">
        <div className={`rounded-lg border p-3 text-xs leading-relaxed ${
          darkMode ? 'bg-amber-950/20 border-amber-900/60 text-amber-200' : 'bg-amber-50 border-amber-200 text-amber-900'
        }`} role="status">
          Admin preview only. This frontend has no admin authentication, server-side authorization, production metrics, or account-management API. Sample data is not live, and controls cannot change real accounts.
        </div>

        {/* TAB 1: OVERVIEW matching Screenshot 23 */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2">
                <h1 className={`text-xl font-bold tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  Admin console
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-indigo-950 border border-indigo-800/60 text-[10px] font-semibold text-indigo-300">
                  DEMO DATA
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Server-side authorization required — demo shows the interface
              </p>
            </div>

            {/* 4 Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className={`p-5 rounded-xl border ${darkMode ? 'bg-[#0c1024] border-indigo-950/80' : 'bg-white border-slate-200 shadow-sm'}`}>
                <div className={`text-[11px] font-medium mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Active workspaces</div>
                <div className={`text-3xl font-extrabold ${darkMode ? 'text-white' : 'text-slate-900'}`}>1,284</div>
              </div>
              <div className={`p-5 rounded-xl border ${darkMode ? 'bg-[#0c1024] border-indigo-950/80' : 'bg-white border-slate-200 shadow-sm'}`}>
                <div className={`text-[11px] font-medium mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Total vectors</div>
                <div className={`text-3xl font-extrabold ${darkMode ? 'text-white' : 'text-slate-900'}`}>38.2M</div>
              </div>
              <div className={`p-5 rounded-xl border ${darkMode ? 'bg-[#0c1024] border-indigo-950/80' : 'bg-white border-slate-200 shadow-sm'}`}>
                <div className={`text-[11px] font-medium mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>ARR (demo)</div>
                <div className="text-3xl font-extrabold text-emerald-500">$412k</div>
              </div>
              <div className={`p-5 rounded-xl border ${darkMode ? 'bg-[#0c1024] border-indigo-950/80' : 'bg-white border-slate-200 shadow-sm'}`}>
                <div className={`text-[11px] font-medium mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>API p95 latency</div>
                <div className="text-3xl font-extrabold text-cyan-500">182 ms</div>
              </div>
            </div>

            {/* System Health & Attention Needed in 2 Cols */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* System Health */}
              <div className={`p-6 rounded-xl border space-y-4 ${
                darkMode ? 'bg-[#0c1024] border-indigo-950/80' : 'bg-white border-slate-200 shadow-sm'
              }`}>
                <h3 className={`text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  System health
                </h3>
                <div className="space-y-3">
                  {[
                    { label: 'PostgreSQL + pgvector', val: '99.98%' },
                    { label: 'Redis', val: '99.99%' },
                    { label: 'Embedding worker', val: '99.2%' },
                    { label: 'OCR worker', val: '97.1%' },
                  ].map((s) => (
                    <div key={s.label}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className={darkMode ? 'text-slate-300' : 'text-slate-700'}>{s.label}</span>
                        <span className="font-mono text-emerald-500 font-semibold">{s.val}</span>
                      </div>
                      <div className={`w-full h-1.5 rounded-full overflow-hidden ${darkMode ? 'bg-slate-900' : 'bg-slate-200'}`}>
                        <div className="h-full bg-indigo-500 rounded-full" style={{ width: s.val }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Attention Needed */}
              <div className={`p-6 rounded-xl border space-y-4 ${
                darkMode ? 'bg-[#0c1024] border-indigo-950/80' : 'bg-white border-slate-200 shadow-sm'
              }`}>
                <h3 className={`text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  Attention needed
                </h3>
                <div className="space-y-3 text-xs">
                  <div className={`p-3 rounded-lg border flex items-center justify-between ${
                    darkMode ? 'bg-[#0e1329] border-indigo-950' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div>
                      <div className={`font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Failed indexing jobs</div>
                      <div className="text-[11px] text-slate-400">job-8836: OCR worker timeout</div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-950 text-rose-300 border border-rose-800">
                      FAILED
                    </span>
                  </div>

                  <div className={`p-3 rounded-lg border flex items-center justify-between ${
                    darkMode ? 'bg-[#0e1329] border-indigo-950' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div>
                      <div className={`font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Payment webhooks (24h)</div>
                      <div className="text-[11px] text-slate-400">142 processed · 0 rejected</div>
                    </div>
                    <span className="text-emerald-500 font-mono text-[11px] font-bold">OK</span>
                  </div>

                  <div className={`p-3 rounded-lg border flex items-center justify-between ${
                    darkMode ? 'bg-[#0e1329] border-indigo-950' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div>
                      <div className={`font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Razorpay integration</div>
                      <div className="text-[11px] text-slate-400">Credentials pending activation</div>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                      darkMode ? 'bg-slate-800 text-slate-400 border-slate-700' : 'bg-slate-200 text-slate-600 border-slate-300'
                    }`}>
                      NOT-CONFIGURED
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: USERS matching Screenshot 24 */}
        {(activeTab === 'users' || activeTab === 'plans') && (
          <div className="space-y-4">
            <h2 className={`text-base font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Users & MindMesh Accounts</h2>
            <div className={`rounded-xl border overflow-hidden ${
              darkMode ? 'bg-[#0c1024] border-indigo-950/80' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className={`border-b font-semibold ${
                    darkMode ? 'border-indigo-950 text-slate-400 bg-[#090d22]' : 'border-slate-200 text-slate-600 bg-slate-50'
                  }`}>
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Plan</th>
                    <th className="py-3 px-4">Memories</th>
                    <th className="py-3 px-4">Last active</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${darkMode ? 'divide-indigo-950/30 text-slate-300' : 'divide-slate-200 text-slate-700'}`}>
                  {users.map((u) => (
                    <tr key={u.email} className={`transition-colors ${darkMode ? 'hover:bg-[#0e142d]' : 'hover:bg-slate-50'}`}>
                      <td className="py-3 px-4">
                        <div className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{u.name}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{u.email}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                          darkMode ? 'bg-indigo-950 text-indigo-300 border-indigo-800' : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                        }`}>
                          {u.plan}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono">{u.memories}</td>
                      <td className="py-3 px-4 text-slate-400">{u.lastActive}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                          u.status === 'ACTIVE'
                            ? darkMode ? 'bg-emerald-950 text-emerald-300 border-emerald-800' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : u.status === 'INACTIVE'
                            ? darkMode ? 'bg-slate-800 text-slate-400 border-slate-700' : 'bg-slate-100 text-slate-600 border-slate-300'
                            : darkMode ? 'bg-rose-950 text-rose-300 border-rose-800' : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}>
                          {u.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="text-[10px] text-slate-500">Unavailable</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: AUDIT matching Screenshot 25 */}
        {(activeTab === 'audit' || activeTab === 'jobs' || activeTab === 'integrations') && (
          <div className="space-y-4">
            <h2 className={`text-base font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>System & Security Audit Log</h2>
            <div className={`rounded-xl border overflow-hidden ${
              darkMode ? 'bg-[#0c1024] border-indigo-950/80' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className={`border-b font-semibold ${
                    darkMode ? 'border-indigo-950 text-slate-400 bg-[#090d22]' : 'border-slate-200 text-slate-600 bg-slate-50'
                  }`}>
                    <th className="py-3 px-4">Time</th>
                    <th className="py-3 px-4">Actor</th>
                    <th className="py-3 px-4">Event</th>
                    <th className="py-3 px-4">Detail</th>
                  </tr>
                </thead>
                <tbody className={`divide-y font-mono ${darkMode ? 'divide-indigo-950/30 text-slate-300' : 'divide-slate-200 text-slate-700'}`}>
                  {auditLogs.map((log, idx) => (
                    <tr key={idx} className={`transition-colors ${darkMode ? 'hover:bg-[#0e142d]' : 'hover:bg-slate-50'}`}>
                      <td className="py-3 px-4 text-slate-400">{log.time}</td>
                      <td className={`py-3 px-4 font-semibold ${darkMode ? 'text-indigo-300' : 'text-indigo-600'}`}>{log.actor}</td>
                      <td className={`py-3 px-4 font-semibold ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>{log.event}</td>
                      <td className={`py-3 px-4 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{log.detail}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
