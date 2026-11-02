import React, { useState } from 'react';
import {
  Zap,
  Play,
  Pause,
  Plus,
  ArrowRight,
  AlertCircle,
  X,
  Trash2
} from 'lucide-react';

export const WorkflowsPage = ({
  workflows = [],
  onAddWorkflow,
  onToggleWorkflow,
  onDeleteWorkflow,
  darkMode,
}) => {
  const [workflowList, setWorkflowList] = useState(workflows);
  const [activeTab, setActiveTab] = useState('ALL');
  const [modalOpen, setModalOpen] = useState(false);

  // New Workflow form state & validations
  const [nameInput, setNameInput] = useState('');
  const [descriptionInput, setDescriptionInput] = useState('');
  const [triggerInput, setTriggerInput] = useState('NOTE_CREATED');
  const [conditionInput, setConditionInput] = useState('Always trigger');
  const [actionInput, setActionInput] = useState('CREATE_FLASHCARDS');
  const [formError, setFormError] = useState('');

  const triggerOptions = [
    { value: 'NOTE_CREATED', label: 'When a new note is captured' },
    { value: 'MEETING_INDEXED', label: 'When a meeting transcript is indexed' },
    { value: 'GEO_PIN_DROPPED', label: 'When a GPS location pin is saved' },
    { value: 'EMBEDDING_CLUSTER_FORMED', label: 'When orphan memories form a semantic cluster' },
  ];

  const actionOptions = [
    { value: 'CREATE_FLASHCARDS', label: 'Auto-generate SM-2 flashcard deck' },
    { value: 'SYNC_TO_CONTACTS', label: 'Extract action items & link to contacts' },
    { value: 'DISPATCH_WEBHOOK', label: 'Send JSON payload to external webhook' },
    { value: 'LINK_TOUCHPOINT', label: 'Link geo memory to nearest contact touchpoint' },
  ];

  const handleToggle = async (id) => {
    const workflow = workflowList.find((item) => item.id === id);
    if (!workflow) return;
    setFormError('');
    try {
      await onToggleWorkflow?.(id);
      setWorkflowList((prev) =>
        prev.map((item) => item.id === id ? { ...item, active: !workflow.active } : item)
      );
    } catch (error) {
      setFormError(error.message || 'The workflow preview could not be updated.');
    }
  };

  const handleCreateWorkflow = async (e) => {
    e.preventDefault();
    if (!nameInput.trim() || nameInput.trim().length < 4) {
      setFormError('Workflow name must be at least 4 characters long.');
      return;
    }
    if (!descriptionInput.trim() || descriptionInput.trim().length < 8) {
      setFormError('Description must be at least 8 characters long.');
      return;
    }

    const newWf = {
      id: `wf-${Date.now()}`,
      name: nameInput.trim(),
      description: descriptionInput.trim(),
      trigger: triggerInput,
      condition: conditionInput.trim() || 'Always trigger',
      action: actionInput,
      active: true,
      lastRun: 'Never',
      runsCount: 0,
    };

    try {
      await onAddWorkflow?.(newWf);
      setWorkflowList((prev) => [newWf, ...prev]);
    } catch (error) {
      setFormError(error.message || 'The workflow preview could not be saved.');
      return;
    }

    setNameInput('');
    setDescriptionInput('');
    setConditionInput('Always trigger');
    setFormError('');
    setModalOpen(false);
  };

  const handleDelete = async (id) => {
    setFormError('');
    try {
      await onDeleteWorkflow?.(id);
      setWorkflowList((prev) => prev.filter((w) => w.id !== id));
    } catch (error) {
      setFormError(error.message || 'The workflow preview could not be deleted.');
    }
  };

  return (
    <div className={`p-6 max-w-6xl mx-auto space-y-6 ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono tracking-wider font-semibold uppercase bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              WORKFLOW PREVIEW
            </span>
            <span className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Definitions only · no execution service
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Automations & Workflows</h1>
          <p className={`text-xs mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Save automation definitions as previews. This app does not execute triggers or actions.
          </p>
        </div>

        {formError && !modalOpen && (
          <div className="flex items-center gap-2 rounded-lg border border-rose-800/60 bg-rose-950/30 p-3 text-xs text-rose-300" role="alert">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        <button
          onClick={() => {
            setFormError('');
            setModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ New Automation</span>
        </button>
      </div>

      {/* Quick Telemetry Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className={`p-4 rounded-xl border ${
          darkMode ? 'bg-[#0b0e24] border-indigo-950/80' : 'bg-white border-slate-200'
        }`}>
          <div className="text-xs text-slate-400 mb-1">Enabled definitions (preview)</div>
          <div className="text-xl font-bold text-indigo-400">
            {workflowList.filter((w) => w.active).length} of {workflowList.length}
          </div>
        </div>
        <div className={`p-4 rounded-xl border ${
          darkMode ? 'bg-[#0b0e24] border-indigo-950/80' : 'bg-white border-slate-200'
        }`}>
          <div className="text-xs text-slate-400 mb-1">Executions</div>
          <div className="text-xl font-bold text-emerald-400">Unavailable</div>
        </div>
        <div className={`p-4 rounded-xl border ${
          darkMode ? 'bg-[#0b0e24] border-indigo-950/80' : 'bg-white border-slate-200'
        }`}>
          <div className="text-xs text-slate-400 mb-1">Average Latency</div>
          <div className="text-xl font-bold text-amber-400">Unavailable</div>
        </div>
        <div className={`p-4 rounded-xl border ${
          darkMode ? 'bg-[#0b0e24] border-indigo-950/80' : 'bg-white border-slate-200'
        }`}>
          <div className="text-xs text-slate-400 mb-1">Success Rate</div>
          <div className="text-xl font-bold text-violet-400">Unavailable</div>
        </div>
      </div>

      {/* Workflow Recipe Cards */}
      <div className="space-y-3">
        {workflowList.map((wf) => {
          return (
            <div
              key={wf.id}
              className={`p-5 rounded-2xl border transition-all ${
                darkMode ? 'bg-[#0a0d24] border-indigo-950/80 hover:border-indigo-600/40' : 'bg-white border-slate-200 hover:border-indigo-300'
              } ${!wf.active ? 'opacity-60' : ''}`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${wf.active ? 'bg-amber-400' : 'bg-slate-500'}`} />
                    <h3 className="text-sm font-bold tracking-tight">{wf.name}</h3>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-semibold ${
                      wf.active
                        ? darkMode ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : darkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {wf.active ? 'ENABLED PREVIEW' : 'DISABLED'}
                    </span>
                  </div>

                  <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    {wf.description}
                  </p>

                  {/* Flow Pills Visualizer */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <div className={`px-2.5 py-1 rounded-lg text-[11px] font-mono border ${
                      darkMode ? 'bg-indigo-950/60 border-indigo-800 text-indigo-300' : 'bg-indigo-50 border-indigo-200 text-indigo-700'
                    }`}>
                      TRIGGER: {wf.trigger}
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                    <div className={`px-2.5 py-1 rounded-lg text-[11px] font-mono border ${
                      darkMode ? 'bg-slate-900 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-300 text-slate-700'
                    }`}>
                      IF: {wf.condition}
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                    <div className={`px-2.5 py-1 rounded-lg text-[11px] font-mono border ${
                      darkMode ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300' : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                    }`}>
                      ACTION: {wf.action}
                    </div>
                  </div>
                </div>

                {/* Controls and Actions */}
                <div className="flex items-center gap-2 self-end md:self-center">
                  <button
                    disabled
                    title="Workflow execution requires a configured server-side runner."
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold opacity-60 cursor-not-allowed ${
                      darkMode ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-slate-100 border-slate-200 text-slate-700'
                    }`}
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Runner unavailable</span>
                  </button>

                  <button
                    onClick={() => handleToggle(wf.id)}
                    className={`p-2 rounded-lg border transition-colors ${
                      wf.active
                        ? darkMode ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : darkMode ? 'bg-slate-800 text-slate-400 border-slate-700' : 'bg-slate-200 text-slate-600 border-slate-300'
                    }`}
                    title={wf.active ? 'Pause automation' : 'Activate automation'}
                  >
                    {wf.active ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={() => handleDelete(wf.id)}
                    className="p-2 text-slate-400 hover:text-rose-400 transition-colors"
                    title="Delete automation"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Footer info */}
              <div className={`mt-3 pt-3 border-t flex items-center justify-between text-[11px] ${
                darkMode ? 'border-indigo-950/60 text-slate-400' : 'border-slate-100 text-slate-500'
              }`}>
                <span>Last execution: unavailable</span>
                <span>Run history: unavailable</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* New Workflow Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className={`w-full max-w-lg p-6 rounded-2xl border shadow-2xl ${
            darkMode ? 'bg-[#0d1026] border-indigo-950 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-indigo-950/40 mb-4">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-bold">New Memory Automation</h3>
              </div>
              <button onClick={() => setModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 mb-4 rounded-lg bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreateWorkflow} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-300">
                  Automation Name
                </label>
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className={`w-full px-3 py-2 text-xs rounded-xl border focus:outline-none focus:border-indigo-500 ${
                    darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                  placeholder="e.g. Auto-Index Meeting Audio to Notion"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-300">
                  Trigger Event
                </label>
                <select
                  value={triggerInput}
                  onChange={(e) => setTriggerInput(e.target.value)}
                  className={`w-full px-3 py-2 text-xs rounded-xl border focus:outline-none focus:border-indigo-500 ${
                    darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                >
                  {triggerOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-300">
                  Condition (Filter)
                </label>
                <input
                  type="text"
                  value={conditionInput}
                  onChange={(e) => setConditionInput(e.target.value)}
                  className={`w-full px-3 py-2 text-xs rounded-xl border focus:outline-none focus:border-indigo-500 ${
                    darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                  placeholder="e.g. Word count > 50 OR Tag includes #PROJECT"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-300">
                  Action to Perform
                </label>
                <select
                  value={actionInput}
                  onChange={(e) => setActionInput(e.target.value)}
                  className={`w-full px-3 py-2 text-xs rounded-xl border focus:outline-none focus:border-indigo-500 ${
                    darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                >
                  {actionOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-300">
                  Purpose / Description
                </label>
                <textarea
                  rows={2}
                  value={descriptionInput}
                  onChange={(e) => setDescriptionInput(e.target.value)}
                  className={`w-full px-3 py-2 text-xs rounded-xl border focus:outline-none focus:border-indigo-500 resize-none ${
                    darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                  placeholder="Explain why this automation runs..."
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className={`px-4 py-2 rounded-xl text-xs font-medium ${
                    darkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md"
                >
                  Create Automation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
