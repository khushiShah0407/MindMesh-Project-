import React, { useState } from 'react';
import { Database, Table, Terminal } from 'lucide-react';
import { initialCloudSqlTables } from '../data/mockData';

export const CloudSqlPage = ({ onNavigate, darkMode }) => {
  const [tables] = useState(initialCloudSqlTables);
  const [selectedTable, setSelectedTable] = useState(tables[3]); // embeddings_1536
  const [sqlQuery, setSqlQuery] = useState(
    '-- SQL execution is not configured in this browser.\n-- No query will be sent to a database.'
  );
  return (
    <div className="max-w-6xl mx-auto p-4 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className={`text-xl font-bold tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              CloudSQL & pgvector Studio
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-indigo-950 border border-indigo-800/60 text-[10px] font-semibold text-indigo-300">
              PREVIEW ONLY
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Example PostgreSQL schema. No database or pgvector service is connected.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-lg border border-emerald-800/60">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Not connected · schema preview only</span>
        </div>
      </div>

      {/* Tables Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {tables.map((tbl) => {
          const isSelected = selectedTable?.tableName === tbl.tableName;
          return (
            <div
              key={tbl.tableName}
              onClick={() => setSelectedTable(tbl)}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                isSelected
                  ? darkMode
                    ? 'bg-[#101638] border-indigo-500 shadow-sm text-white'
                    : 'bg-indigo-50 border-indigo-500 text-slate-900'
                  : darkMode
                  ? 'bg-[#0c1024] border-indigo-950/80 hover:border-indigo-800 text-slate-300'
                  : 'bg-white border-slate-200 hover:border-indigo-300 text-slate-700'
              }`}
            >
              <div className="flex items-center gap-1.5 text-xs font-bold font-mono truncate">
                <Table className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span>{tbl.tableName}</span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono mt-2 flex justify-between">
                <span>— records</span>
                <span>— size</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Table Schema Details */}
      {selectedTable && (
        <div className={`p-5 rounded-2xl border space-y-3 ${
          darkMode ? 'bg-[#0c1024] border-indigo-950/80' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold font-mono text-indigo-400 flex items-center gap-2">
              <Database className="w-4 h-4" />
              <span>SCHEMA: {selectedTable.tableName}</span>
            </h3>
            <span className="text-xs text-slate-400">{selectedTable.description}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left font-mono">
              <thead>
                <tr className="border-b border-indigo-950 text-slate-400">
                  <th className="py-2 px-3">Column Name</th>
                  <th className="py-2 px-3">Data Type & Index Constraints</th>
                  <th className="py-2 px-3">Index Strategy</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-indigo-950/30 text-slate-300">
                {selectedTable.columns.map((col, idx) => (
                  <tr key={idx} className="hover:bg-[#0e142d]">
                    <td className="py-2 px-3 text-cyan-300 font-bold">{col.name}</td>
                    <td className="py-2 px-3 text-slate-400">{col.type}</td>
                    <td className="py-2 px-3">
                      {col.isIndex ? (
                        <span className="px-2 py-0.5 rounded text-[9px] bg-indigo-950 text-indigo-300 border border-indigo-800">
                          INDEXED
                        </span>
                      ) : (
                        <span className="text-slate-600">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SQL text is never sent or executed by this browser */}
      <div className={`p-5 rounded-2xl border space-y-4 ${
        darkMode ? 'bg-[#0c1024] border-indigo-950/80' : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span>SQL query preview</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400">Preview only — no query is sent or run</span>
          </div>
        </div>

        <textarea
          rows={4}
          value={sqlQuery}
          onChange={(e) => setSqlQuery(e.target.value)}
          className={`w-full p-3 rounded-xl font-mono text-xs border focus:outline-none focus:border-indigo-500 leading-relaxed ${
            darkMode ? 'bg-[#070914] border-indigo-950 text-emerald-400' : 'bg-slate-900 border-slate-800 text-emerald-300'
          }`}
        />
      </div>
    </div>
  );
};
