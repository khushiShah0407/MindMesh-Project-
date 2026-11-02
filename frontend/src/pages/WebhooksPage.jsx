import React, { useState } from 'react';
import {
  Webhook,
  Plus,
  Code2,
  ShieldCheck,
  AlertCircle,
  X,
  Trash2
} from 'lucide-react';

export const WebhooksPage = ({
  webhooks = [],
  onAddWebhook,
  onDeleteWebhook,
  darkMode,
}) => {
  const [webhookList, setWebhookList] = useState(webhooks);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEndpoint, setSelectedEndpoint] = useState(webhooks[0] || null);

  // Form state & validations
  const [nameInput, setNameInput] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [selectedEvents, setSelectedEvents] = useState(['memory.created']);
  const [formError, setFormError] = useState('');

  const availableEvents = [
    { id: 'memory.created', label: 'memory.created — example event (not emitted)' },
    { id: 'meeting.indexed', label: 'meeting.indexed — example event (not emitted)' },
    { id: 'geo_pin.saved', label: 'geo_pin.saved — example event (not emitted)' },
    { id: 'note.updated', label: 'note.updated — example event (not emitted)' },
    { id: 'vector.clustered', label: 'vector.clustered — example event (not emitted)' },
  ];

  const handleToggleEvent = (evtId) => {
    setSelectedEvents((prev) =>
      prev.includes(evtId) ? prev.filter((e) => e !== evtId) : [...prev, evtId]
    );
  };

  const handleCreateWebhook = async (e) => {
    e.preventDefault();
    if (!nameInput.trim()) {
      setFormError('Endpoint name is required.');
      return;
    }
    let endpointUrl;
    try {
      endpointUrl = new URL(urlInput.trim());
    } catch {
      setFormError('Enter a valid HTTPS URL.');
      return;
    }
    if (endpointUrl.protocol !== 'https:' || endpointUrl.username || endpointUrl.password) {
      setFormError('Webhook preview URLs must use HTTPS and cannot include embedded credentials.');
      return;
    }
    if (selectedEvents.length === 0) {
      setFormError('Please select at least one event subscription.');
      return;
    }

    const newWh = {
      id: `wh-${Date.now()}`,
      name: nameInput.trim(),
      url: urlInput.trim(),
      events: selectedEvents,
      status: 'PREVIEW',
    };

    try {
      await onAddWebhook?.(newWh);
      setWebhookList((prev) => [newWh, ...prev]);
      setSelectedEndpoint(newWh);
    } catch (error) {
      setFormError(error.message || 'The webhook preview could not be saved.');
      return;
    }

    setNameInput('');
    setUrlInput('');
    setSelectedEvents(['memory.created']);
    setFormError('');
    setModalOpen(false);
  };

  const handleDelete = async (id) => {
    const nextList = webhookList.filter((w) => w.id !== id);
    try {
      await onDeleteWebhook?.(id);
      setWebhookList(nextList);
      if (selectedEndpoint?.id === id) {
        setSelectedEndpoint(nextList[0] || null);
      }
    } catch (error) {
      setFormError(error.message || 'The webhook preview could not be deleted.');
    }
  };

  return (
    <div className={`p-6 max-w-6xl mx-auto space-y-6 ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono tracking-wider font-semibold uppercase bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              WEBHOOK PREVIEW
            </span>
            <span className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Configuration only
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">API & Webhooks Hub</h1>
          <p className={`text-xs mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Save endpoint metadata and example event subscriptions. No server sends events, signs deliveries, or tests endpoints.
          </p>
        </div>

        <button
          onClick={() => {
            setFormError('');
            setModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Register Webhook</span>
        </button>
      </div>

      {formError && !modalOpen && (
        <div className="flex items-center gap-2 rounded-lg border border-rose-800/60 bg-rose-950/30 p-3 text-xs text-rose-300" role="alert">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      <div className={`flex items-start gap-2 rounded-lg border p-3 text-xs leading-relaxed ${
        darkMode ? 'border-amber-900/60 bg-amber-950/20 text-amber-200' : 'border-amber-200 bg-amber-50 text-amber-900'
      }`} role="status">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
        <span>This is a configuration preview. No signing secret is generated or stored in this browser; no server sends requests to endpoints or reports successful delivery.</span>
      </div>

      {/* Main Grid: Endpoints List + Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Endpoints List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold px-1">
            <span className={darkMode ? 'text-slate-400' : 'text-slate-600'}>Endpoints ({webhookList.length})</span>
            <span className="text-emerald-400 font-mono">
              {webhookList.length} Saved
            </span>
          </div>

          {webhookList.map((wh) => {
            const isSelected = selectedEndpoint?.id === wh.id;
            return (
              <div
                key={wh.id}
                onClick={() => setSelectedEndpoint(wh)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? darkMode
                      ? 'bg-indigo-950/40 border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.25)]'
                      : 'bg-indigo-50 border-indigo-400 shadow-sm'
                    : darkMode
                    ? 'bg-[#0a0d24] border-indigo-950/80 hover:border-indigo-700/50'
                    : 'bg-white border-slate-200 hover:border-indigo-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <h3 className="text-xs font-bold truncate">{wh.name}</h3>
                  </div>
                  <span className="text-[9px] px-1.5 py-0.5 rounded font-mono font-semibold bg-amber-500/20 text-amber-300">
                    PREVIEW
                  </span>
                </div>

                <p className={`text-[11px] font-mono truncate mb-3 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  {wh.url}
                </p>

                <div className="flex items-center justify-between text-[10px]">
                  <span className={darkMode ? 'text-slate-400' : 'text-slate-600'}>
                    {wh.events.length} example topics
                  </span>
                  <span className="text-[10px] text-slate-500">No delivery service</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Endpoint Inspector & Integration Details */}
        {selectedEndpoint ? (
          <div className="lg:col-span-2 space-y-4">
            <div className={`p-6 rounded-2xl border ${
              darkMode ? 'bg-[#0a0d24] border-indigo-950/80' : 'bg-white border-slate-200'
            }`}>
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-indigo-950/50 gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold">{selectedEndpoint.name}</h2>
                    <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-amber-500/20 text-amber-300">
                      PREVIEW ONLY
                    </span>
                  </div>
                  <p className={`text-xs font-mono mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    {selectedEndpoint.url}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDelete(selectedEndpoint.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-400 transition-colors"
                    title="Delete endpoint"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Subscribed Events */}
              <div className="py-4 border-b border-indigo-950/50 space-y-2">
                <div className={`text-xs font-semibold ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  Example Event Topics (not emitted)
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedEndpoint.events.map((evt) => (
                    <span
                      key={evt}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium border ${
                        darkMode
                          ? 'bg-indigo-950/60 border-indigo-800 text-indigo-300'
                          : 'bg-indigo-50 border-indigo-200 text-indigo-800'
                      }`}
                    >
                      {evt}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className={`font-semibold flex items-center gap-1.5 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    <Code2 className="w-4 h-4 text-indigo-400" /> Delivery status
                  </span>
                </div>
                <p className={`p-4 rounded-xl text-xs leading-relaxed border ${
                  darkMode ? 'bg-slate-950 border-slate-800 text-emerald-400' : 'bg-slate-900 border-slate-800 text-emerald-300'
                }`}>
                  Endpoint metadata is saved for preview only. This application does not send requests to this URL or claim successful delivery.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-2 p-12 text-center rounded-2xl border flex flex-col items-center justify-center">
            <Webhook className="w-12 h-12 text-indigo-400 opacity-50 mb-3" />
            <p className="text-sm font-semibold">No endpoint previews saved</p>
            <p className="mt-2 max-w-md text-xs leading-relaxed text-slate-400">
              Create a local endpoint configuration preview. It will not be registered with a server or receive event deliveries.
            </p>
          </div>
        )}
      </div>

      {/* New Webhook Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className={`w-full max-w-lg p-6 rounded-2xl border shadow-2xl ${
            darkMode ? 'bg-[#0d1026] border-indigo-950 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-indigo-950/40 mb-4">
              <div className="flex items-center gap-2">
                <Webhook className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-bold">Register Webhook Endpoint</h3>
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

            <form onSubmit={handleCreateWebhook} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-300">
                  Endpoint Name
                </label>
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className={`w-full px-3 py-2 text-xs rounded-xl border focus:outline-none focus:border-indigo-500 ${
                    darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                  placeholder="e.g. Production Data Lake Ingestion"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-300">
                  Target HTTPS URL
                </label>
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className={`w-full px-3 py-2 text-xs rounded-xl border focus:outline-none focus:border-indigo-500 ${
                    darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                  placeholder="https://api.yourdomain.com/v1/mindmesh-listener"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-2 text-slate-300">
                  Subscribed Event Topics
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {availableEvents.map((evt) => (
                    <label
                      key={evt.id}
                      className={`flex items-center gap-2.5 p-2 rounded-xl border text-xs cursor-pointer transition-all ${
                        selectedEvents.includes(evt.id)
                          ? darkMode
                            ? 'bg-indigo-950/60 border-indigo-700 text-indigo-300'
                            : 'bg-indigo-50 border-indigo-300 text-indigo-800'
                          : darkMode
                          ? 'bg-slate-900/60 border-slate-800 text-slate-400'
                          : 'bg-slate-50 border-slate-200 text-slate-600'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedEvents.includes(evt.id)}
                        onChange={() => handleToggleEvent(evt.id)}
                        className="rounded text-indigo-600 focus:ring-0"
                      />
                      <span>{evt.label}</span>
                    </label>
                  ))}
                </div>
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
                  Register Endpoint
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
