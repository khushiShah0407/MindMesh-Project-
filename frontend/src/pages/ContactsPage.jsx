import React, { useEffect, useState } from 'react';
import {
  Contact,
  Search,
  Mail,
  Phone,
  MapPin,
  Users2,
  FileText,
  Plus,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { initialContacts } from '../data/mockData';

export const ContactsPage = ({ contacts: contactRecords = initialContacts, onNavigate, onAddContact, darkMode }) => {
  const [contacts, setContacts] = useState(contactRecords);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContact, setSelectedContact] = useState(contacts[0] || null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [formError, setFormError] = useState('');
  const [copyFeedback, setCopyFeedback] = useState('');
  const [savingContact, setSavingContact] = useState(false);

  useEffect(() => {
    setContacts(contactRecords);
    setSelectedContact((selected) => contactRecords.find((contact) => contact.id === selected?.id) || contactRecords[0] || null);
  }, [contactRecords]);

  const validateEmail = (val) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  };

  const handleCreateContact = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!newName.trim()) {
      setFormError('Contact name is required.');
      return;
    }
    if (!newRole.trim()) {
      setFormError('Role / Title is required.');
      return;
    }
    if (!newEmail.trim() || !validateEmail(newEmail)) {
      setFormError('A valid email address is required.');
      return;
    }
    if (contacts.some((contact) => contact.email?.toLowerCase() === newEmail.trim().toLowerCase())) {
      setFormError('A contact with this email already exists in your workspace.');
      return;
    }
    if (newName.trim().length > 100 || newRole.trim().length > 100 || newCompany.trim().length > 100) {
      setFormError('Name, role, and company must be 100 characters or fewer.');
      return;
    }
    if (newPhone.trim().length > 40 || newLocation.trim().length > 120) {
      setFormError('Phone must be 40 characters or fewer and location 120 characters or fewer.');
      return;
    }

    const created = {
      id: `c-${Date.now()}`,
      name: newName.trim(),
      role: newRole.trim(),
      company: newCompany.trim(),
      email: newEmail.trim(),
      phone: newPhone.trim(),
      location: newLocation.trim(),
      topics: [],
      relationshipStrength: 0,
      linkedMeetingsCount: 0,
      linkedNotesCount: 0,
      lastTouchpoint: new Date().toISOString(),
      avatarBg: 'bg-indigo-600',
    };

    setSavingContact(true);
    try {
      await onAddContact?.(created);
      setContacts((previous) => [created, ...previous]);
      setSelectedContact(created);
    } catch (error) {
      setFormError(error.message || 'The contact could not be saved.');
      return;
    } finally {
      setSavingContact(false);
    }
    setIsModalOpen(false);
    setNewName('');
    setNewRole('');
    setNewCompany('');
    setNewEmail('');
    setNewPhone('');
  };

  const handleSendMessage = (email) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(email);
    }
    setCopyFeedback(`Copied ${email} to clipboard!`);
    setTimeout(() => setCopyFeedback(''), 2500);
  };

  const filtered = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.topics.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="max-w-6xl mx-auto p-4 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className={`text-xl font-bold tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              Contacts & Knowledge Network
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-indigo-950 border border-indigo-800/60 text-[10px] font-semibold text-indigo-300">
              NEW FEATURE
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            People linked to your thoughts, meetings, decisions, and collaborative notes
          </p>
        </div>

        {/* Search & Add Contact Button */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search contacts or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`pl-8 pr-3 py-1.5 text-xs rounded-lg w-56 sm:w-64 border focus:outline-none focus:border-indigo-500 ${
                darkMode ? 'bg-[#0c1024] border-indigo-950 text-white placeholder-slate-500' : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
              }`}
            />
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Contact</span>
          </button>
        </div>
      </div>

      {/* Main Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Contacts List */}
        <div className="space-y-3">
          {filtered.map((contact) => {
            const isSelected = selectedContact?.id === contact.id;
            return (
              <div
                key={contact.id}
                onClick={() => setSelectedContact(contact)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? darkMode
                      ? 'bg-[#101638] border-indigo-500 shadow-[0_0_15px_-4px_rgba(99,102,241,0.3)]'
                      : 'bg-indigo-50 border-indigo-500'
                    : darkMode
                    ? 'bg-[#0c1024] border-indigo-950/80 hover:border-indigo-800/60'
                    : 'bg-white border-slate-200 hover:border-indigo-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg ${contact.avatarBg} flex items-center justify-center text-white font-bold text-xs shadow-sm shrink-0`}>
                    {contact.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className={`text-xs font-bold truncate ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                      {contact.name}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate">
                      {contact.role} · {contact.company}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 mt-3 border-t border-indigo-950/40 text-[10px] text-slate-400">
                  <span>{contact.linkedMeetingsCount} meetings</span>
                  <span>{contact.linkedNotesCount} notes</span>
                  <span className="text-emerald-400 font-mono">{contact.relationshipStrength}% tie</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Contact Detail Card */}
        <div className={`lg:col-span-2 p-6 rounded-2xl border space-y-6 ${
          darkMode ? 'bg-[#0c1024] border-indigo-950/80' : 'bg-white border-slate-200'
        }`}>
          {selectedContact ? (
            <>
              {/* Header */}
              <div className="flex items-start justify-between pb-4 border-b border-indigo-950/60">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl ${selectedContact.avatarBg} flex items-center justify-center text-white font-extrabold text-lg shadow-md`}>
                    {selectedContact.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <h2 className={`text-lg font-bold tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                      {selectedContact.name}
                    </h2>
                    <div className="text-xs text-indigo-400 font-medium">
                      {selectedContact.role} · {selectedContact.company}
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3 text-cyan-400" />
                      <span>{selectedContact.location}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <button
                    onClick={() => handleSendMessage(selectedContact.email)}
                    className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
                  >
                    Send message
                  </button>
                  {copyFeedback && (
                    <span className="text-[10px] text-emerald-400 font-mono animate-in fade-in duration-100">
                      {copyFeedback}
                    </span>
                  )}
                </div>
              </div>

              {/* Contact info grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className={`p-3.5 rounded-xl border ${darkMode ? 'bg-[#090d22] border-indigo-950' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="text-[10px] uppercase font-bold text-slate-400 mb-1 flex items-center gap-1">
                    <Mail className="w-3 h-3 text-indigo-400" /> Email
                  </div>
                  <div className="font-mono text-slate-200">{selectedContact.email}</div>
                </div>

                <div className={`p-3.5 rounded-xl border ${darkMode ? 'bg-[#090d22] border-indigo-950' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="text-[10px] uppercase font-bold text-slate-400 mb-1 flex items-center gap-1">
                    <Phone className="w-3 h-3 text-cyan-400" /> Phone
                  </div>
                  <div className="font-mono text-slate-200">{selectedContact.phone || '+1 (415) 555-0100'}</div>
                </div>
              </div>

              {/* Linked Topics & Knowledge Clusters */}
              <div className="space-y-2">
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Shared Knowledge Clusters
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedContact.topics.map((t) => (
                    <span
                      key={t}
                      onClick={() => onNavigate('search')}
                      className="px-3 py-1 rounded-lg bg-indigo-950/80 border border-indigo-800/60 text-xs text-indigo-300 font-medium cursor-pointer hover:border-indigo-500 transition-colors"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Last touchpoint notice */}
              <div className={`p-4 rounded-xl border space-y-1 ${
                darkMode ? 'bg-[#070914] border-indigo-950 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}>
                <div className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>LAST TOUCHPOINT & MEMORY RECALL</span>
                </div>
                <div className="text-xs">{selectedContact.lastTouchpoint}</div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => onNavigate('meetings')}
                  className="px-4 py-2 text-xs font-medium rounded-lg border border-indigo-900/60 hover:bg-indigo-900/30 text-slate-300 transition-colors"
                >
                  View Linked Meetings ({selectedContact.linkedMeetingsCount})
                </button>
                <button
                  onClick={() => onNavigate('graph')}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-md transition-colors"
                >
                  Inspect in Graph →
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-slate-500 text-xs">
              Select a contact to view their relationship map.
            </div>
          )}
        </div>
      </div>

      {/* Add Contact Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className={`w-full max-w-md rounded-2xl border p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150 ${
            darkMode ? 'bg-[#0c1024] border-indigo-900 text-white' : 'bg-white border-slate-300 text-slate-900'
          }`}>
            <div>
              <h3 className="text-sm font-bold">Add Contact to Knowledge Graph</h3>
              <p className="text-xs text-slate-400 mt-1">
                Establish collaborator touchpoints, topic affinities, and meeting linkages.
              </p>
            </div>

            {formError && (
              <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-300 text-xs">
                {formError}
              </div>
            )}

            <form onSubmit={handleCreateContact} className="space-y-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Elena Rostova"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className={`w-full px-3 py-2 text-xs rounded-lg border focus:outline-none focus:border-indigo-500 ${
                    darkMode ? 'bg-[#0e1329] border-indigo-950 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">Role / Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Lead Researcher"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className={`w-full px-3 py-2 text-xs rounded-lg border focus:outline-none ${
                      darkMode ? 'bg-[#0e1329] border-indigo-950 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">Company / Organization</label>
                  <input
                    type="text"
                    placeholder="e.g. NeuralLab"
                    value={newCompany}
                    onChange={(e) => setNewCompany(e.target.value)}
                    className={`w-full px-3 py-2 text-xs rounded-lg border focus:outline-none ${
                      darkMode ? 'bg-[#0e1329] border-indigo-950 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">Work Email</label>
                  <input
                    type="email"
                    placeholder="elena@neurallab.ai"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className={`w-full px-3 py-2 text-xs rounded-lg border focus:outline-none ${
                      darkMode ? 'bg-[#0e1329] border-indigo-950 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">Phone</label>
                  <input
                    type="text"
                    placeholder="+1 (415) 555-0182"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className={`w-full px-3 py-2 text-xs rounded-lg border focus:outline-none ${
                      darkMode ? 'bg-[#0e1329] border-indigo-950 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">Location</label>
                <input
                  type="text"
                  placeholder="San Francisco, CA"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className={`w-full px-3 py-2 text-xs rounded-lg border focus:outline-none ${
                    darkMode ? 'bg-[#0e1329] border-indigo-950 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-1.5 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingContact}
                  className="px-4 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-md transition-colors disabled:cursor-wait disabled:opacity-60"
                >
                  {savingContact ? 'Saving…' : 'Save Contact'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
