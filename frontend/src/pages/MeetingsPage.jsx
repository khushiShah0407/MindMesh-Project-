import React, { useState } from 'react';
import {
  Users2,
  Plus,
  ShieldAlert,
  Download,
  Video,
  CheckSquare,
  Square,
  Copy,
} from 'lucide-react';
import ZoomMeetingRoom from '../components/ZoomMeetingRoom.jsx';

export const MeetingsPage = ({
  meetings: initialMeetings,
  onAddMeeting,
  isRealTimeMode = false,
  userName = '',
  darkMode,
}) => {
  const invitationFromUrl = new URLSearchParams(globalThis.location?.search || '').get('meetingInvite') || '';
  const [meetings, setMeetings] = useState(initialMeetings);
  const [selectedMeeting, setSelectedMeeting] = useState(
    invitationFromUrl ? { id: `invited-${invitationFromUrl.split('.')[0]}`, title: 'Invited meeting', summary: '', roomId: '', decisions: [], actionItems: [], transcript: [] } : meetings[0] || null,
  );
  const [invitation, setInvitation] = useState(invitationFromUrl);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSummary, setNewSummary] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteFeedback, setInviteFeedback] = useState('');
  const [inviteLink, setInviteLink] = useState('');
  const [formError, setFormError] = useState('');
  const [providerConsent, setProviderConsent] = useState(false);
  const [joinRoomId, setJoinRoomId] = useState('');
  const [providerError, setProviderError] = useState('');
  const [notesFeedback, setNotesFeedback] = useState('');

  // Keep internal state synced if initialMeetings change
  React.useEffect(() => {
    setMeetings(initialMeetings);
    setSelectedMeeting((current) => initialMeetings.find((meeting) => meeting.id === current?.id)
      || (invitation ? current?.id.startsWith('invited-') ? current : { id: `invited-${invitation.split('.')[0]}`, title: 'Invited meeting', summary: '', roomId: '', decisions: [], actionItems: [], transcript: [] } : null)
      || initialMeetings[0]
      || null);
  }, [initialMeetings, invitation]);

  React.useEffect(() => {
    setNewSummary(selectedMeeting?.summary || '');
    setProviderConsent(false);
    setProviderError('');
    setNotesFeedback('');
  }, [selectedMeeting?.id]);

  const handleCreateMeeting = async (e) => {
    e.preventDefault();
    setFormError('');

    if (newTitle.trim().length < 2) {
      setFormError('Meeting title must be at least 2 characters.');
      return;
    }

    const roomId = `mindmesh-${globalThis.crypto?.randomUUID?.().replaceAll('-', '').slice(0, 16) || Date.now().toString(36)}`;
    const newMeeting = {
      id: `meet-${Date.now()}`,
      title: newTitle.trim(),
      date: new Date().toISOString(),
      duration: '',
      speakers: [],
      summary: newSummary.trim(),
      decisions: [],
      actionItems: [],
      transcript: [],
      roomId,
      provider: 'Zoom Video SDK',
    };

    try {
      await onAddMeeting?.(newMeeting);
      setMeetings((prev) => [newMeeting, ...prev.filter((meeting) => meeting.id !== newMeeting.id)]);
      setSelectedMeeting(newMeeting);
      setIsModalOpen(false);
      setNewTitle('');
      setNewSummary('');
      setProviderConsent(false);
      setJoinRoomId('');
      setInviteEmail('');
    } catch (error) {
      setFormError(error.message || 'The meeting record could not be saved.');
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedMeeting || !onAddMeeting) return;
    const updated = { ...selectedMeeting, summary: newSummary.trim(), notesUpdatedAt: new Date().toISOString() };
    setNotesFeedback('');
    try {
      await onAddMeeting(updated);
      setMeetings((prev) => prev.map((meeting) => meeting.id === updated.id ? updated : meeting));
      setSelectedMeeting(updated);
      setNotesFeedback('Notes saved.');
    } catch (error) {
      setNotesFeedback(error.message || 'Notes could not be saved.');
    }
  };

  const handleJoinRoom = (meeting) => {
    setProviderError('');
    if (!providerConsent) {
      setProviderError('Confirm participant notice and third-party provider consent before joining.');
      return;
    }
    if (!isRealTimeMode && !invitation) {
      setProviderError('Live Zoom meetings require a Firebase-authenticated account and configured provider credentials.');
      return;
    }
    setJoinRoomId(meeting.roomId || invitation);
  };

  const handleCreateInvite = async (event) => {
    event.preventDefault();
    if (!selectedMeeting?.id || selectedMeeting.id.startsWith('invited-')) return;
    setInviteFeedback('');
    setInviteLink('');
    try {
      const { createZoomMeetingInvite } = await import('../utils/firebase.js');
      const result = await createZoomMeetingInvite({ meetingId: selectedMeeting.id, email: inviteEmail });
      const inviteUrl = new URL(window.location.href);
      inviteUrl.searchParams.set('meetingInvite', result.invitation);
      const link = inviteUrl.toString();
      setInviteLink(link);
      try {
        await navigator.clipboard.writeText(link);
        setInviteFeedback(`Secure invitation copied for ${inviteEmail.trim()}. It expires in 7 days.`);
      } catch {
        setInviteFeedback(`Invitation created; copy the link below and send it to ${inviteEmail.trim()}. It expires in 7 days.`);
      }
      setInviteEmail('');
    } catch (error) {
      setInviteFeedback(error.message || 'The invitation could not be created.');
    }
  };

  const toggleActionItem = async (meetingId, actId) => {
    const meeting = meetings.find((item) => item.id === meetingId);
    if (!meeting) return;
    const updated = {
      ...meeting,
      actionItems: meeting.actionItems.map((item) => (
        item.id === actId ? { ...item, done: !item.done } : item
      )),
    };
    try {
      await onAddMeeting?.(updated);
      setMeetings((previous) => previous.map((item) => item.id === meetingId ? updated : item));
      setSelectedMeeting((previous) => previous?.id === meetingId ? updated : previous);
    } catch (error) {
      setNotesFeedback(error.message || 'The action item could not be saved.');
    }
  };

  const handleExportMarkdown = () => {
    if (!selectedMeeting) return;
    const content = `# Meeting: ${selectedMeeting.title}
Date: ${selectedMeeting.date}
Duration: ${selectedMeeting.duration}
Speakers: ${selectedMeeting.speakers.join(', ')}

## Meeting Notes
${selectedMeeting.summary}

## Decisions
${selectedMeeting.decisions.map((d) => `- ${d}`).join('\n')}

## Action Items
${selectedMeeting.actionItems.map((a) => `- [${a.done ? 'x' : ' '}] ${a.text} (${a.owner} - Due ${a.dueDate})`).join('\n')}

## Verbatim Transcript
${selectedMeeting.transcript.map((t) => `[${t.time}] ${t.speaker}: ${t.text}`).join('\n')}
`;
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedMeeting.title.toLowerCase().replace(/\s+/g, '-')}.md`;
    a.click();
  };

  return (
    <div className="max-w-6xl mx-auto p-4 lg:p-8 space-y-6">
      {/* Top Header matching Screenshot 15 */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className={`text-xl font-bold tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              Meetings
            </h1>
            <span className={`px-2 py-0.5 rounded-full border text-[10px] font-semibold ${
              darkMode ? 'bg-indigo-950 border-indigo-800/60 text-indigo-300' : 'bg-indigo-50 border-indigo-200 text-indigo-700'
            }`}>
              {isRealTimeMode ? 'PRIVATE MEETINGS' : 'DEMO DATA'}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Zoom Video SDK rooms with private notes, live chat, and optional live captions
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New room</span>
        </button>
      </div>

      {/* Consent Reminder Banner matching Screenshot 15 */}
      <div className={`p-4 rounded-xl border flex items-start gap-3 ${
        darkMode ? 'bg-amber-950/20 border-amber-900/40 text-amber-300/90' : 'bg-amber-50 border-amber-200 text-amber-900'
      }`}>
        <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs leading-relaxed">
          <span className="font-semibold text-amber-300">Provider & privacy</span> — calls connect to Zoom Video SDK. No recording is started. Participants must consent before joining and before live transcription/translation is enabled. Provider privacy terms apply.
        </div>
      </div>

      {/* Main Split: Left Meeting List & Right Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="space-y-3">
          {meetings.map((m) => {
            const isSelected = selectedMeeting?.id === m.id;
            return (
              <button
                type="button"
                key={m.id}
                onClick={() => {
                  setSelectedMeeting(m);
                  setJoinRoomId('');
                }}
                aria-pressed={isSelected}
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
                <div className={`text-xs font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  {m.title}
                </div>
                <div className="text-[10px] text-slate-400 font-mono mt-1">
                  {m.date ? new Date(m.date).toLocaleDateString() : 'Date not set'}{m.provider ? ` · ${m.provider}` : ' · demo preset'}
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Details Panel matching Screenshot 15 */}
        <div className={`lg:col-span-2 p-6 rounded-2xl border space-y-6 ${
          darkMode ? 'bg-[#0c1024] border-indigo-950/80' : 'bg-white border-slate-200'
        }`}>
          {selectedMeeting ? (
            <>
              {/* Title & Export */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-indigo-950/60">
                <div>
                  <h2 className={`text-lg font-bold tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    {selectedMeeting.title}
                  </h2>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                    {selectedMeeting.date ? new Date(selectedMeeting.date).toLocaleDateString() : 'Date not set'} · {selectedMeeting.provider || 'Demo preset'}{selectedMeeting.roomId ? ` · ${selectedMeeting.roomId}` : ''}
                  </div>
                </div>

                <button
                  onClick={handleExportMarkdown}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                    darkMode
                      ? 'bg-[#141b3d] hover:bg-[#1b2555] border-indigo-800/50 text-slate-200'
                      : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800'
                  }`}
                >
                  <Download className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Export .md</span>
                </button>
              </div>

              {!joinRoomId && !selectedMeeting.id.startsWith('invited-') && <div className="space-y-4">
                <div className={`p-4 rounded-xl border space-y-2 ${
                  darkMode ? 'bg-[#090d22] border-indigo-950' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
                    Meeting notes · editable record
                  </div>
                  {!isRealTimeMode && <p className="text-[10px] text-amber-300">Sample demo content; not an actual call, transcript, or AI output.</p>}
                  <textarea
                    rows={5}
                    maxLength={10000}
                    value={newSummary}
                    onChange={(event) => setNewSummary(event.target.value)}
                    aria-label="Editable meeting notes"
                    placeholder="Write your meeting notes here…"
                    className={`w-full resize-y rounded-lg border px-3 py-2 text-xs leading-relaxed outline-none focus:border-indigo-500 ${darkMode ? 'bg-[#080b18] border-indigo-950 text-slate-200' : 'bg-white border-slate-300 text-slate-800'}`}
                  />
                  <button type="button" onClick={handleSaveNotes} className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500">
                    Save notes
                  </button>
                  {notesFeedback && <p className={`text-xs ${notesFeedback === 'Notes saved.' ? 'text-emerald-300' : 'text-rose-300'}`} role="status">{notesFeedback}</p>}
                </div>
              </div>}

              {(selectedMeeting.roomId || invitation) && (
                <section className={`space-y-3 rounded-xl border p-4 ${darkMode ? 'bg-[#090d22] border-indigo-950' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="flex items-center gap-2 text-xs font-semibold">
                    <Video className="h-4 w-4 text-indigo-400" />
                    Live room · Zoom Video SDK
                  </div>
                  <p className="text-[11px] leading-relaxed text-slate-400">
                    Joining sends your connection to Zoom. Camera and microphone permission prompts are controlled by your browser. This app does not record the call.
                  </p>
                  {!joinRoomId && (
                    <>
                      <label className="flex items-start gap-2 text-[11px] leading-relaxed text-slate-300">
                        <input type="checkbox" checked={providerConsent} onChange={(event) => setProviderConsent(event.target.checked)} className="mt-0.5" />
                        <span>I have informed participants that Zoom will process meeting audio/video and have their consent to join. I understand live captions require separate participant notice and may be processed by translation providers.</span>
                      </label>
                      {providerError && <p className="text-xs text-rose-300" role="alert">{providerError}</p>}
                      <button type="button" onClick={() => handleJoinRoom(selectedMeeting)} className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-600">
                        <Video className="h-4 w-4" /> Continue to Zoom
                      </button>
                    </>
                  )}
                  {!selectedMeeting.id.startsWith('invited-') && <form onSubmit={handleCreateInvite} className="flex flex-col gap-2 sm:flex-row">
                    <label className="sr-only" htmlFor={`invite-email-${selectedMeeting.id}`}>Invitee email address</label>
                    <input id={`invite-email-${selectedMeeting.id}`} type="email" required maxLength={254} value={inviteEmail} onChange={(event) => setInviteEmail(event.target.value)} placeholder="Participant email" className={`min-w-0 flex-1 rounded-lg border px-3 py-2 text-xs ${darkMode ? 'bg-[#0e1329] border-indigo-950 text-white' : 'bg-white border-slate-300 text-slate-900'}`} />
                    <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-lg border border-indigo-700 px-3 py-2 text-xs font-semibold text-indigo-300 hover:bg-indigo-950/50"><Copy className="h-3.5 w-3.5" /> Create secure invite</button>
                  </form>}
                  {inviteFeedback && <p role="status" className="text-xs text-slate-400">{inviteFeedback}</p>}
                  {inviteLink && <input readOnly aria-label="Secure meeting invitation link" value={inviteLink} onFocus={(event) => event.target.select()} className="w-full rounded-lg border border-slate-700 bg-slate-950 px-2 py-2 text-[10px] text-slate-300" />}
                  {joinRoomId && joinRoomId === (selectedMeeting.roomId || invitation) && (
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-[11px] text-emerald-300">Secure Zoom session · {selectedMeeting.roomId || 'invitation verified by server'}</p>
                        <button type="button" onClick={() => setJoinRoomId('')} className="text-xs text-slate-300 underline">Close meeting</button>
                      </div>
                      <ZoomMeetingRoom
                        key={`${selectedMeeting.id}-${invitation}`}
                        meeting={selectedMeeting}
                        invitation={invitation}
                        isRealTimeMode={isRealTimeMode}
                        userName={userName}
                        summary={newSummary}
                        onSummaryChange={setNewSummary}
                        onSaveNotes={handleSaveNotes}
                        notesFeedback={notesFeedback}
                        darkMode={darkMode}
                        onLeave={() => setJoinRoomId('')}
                      />
                    </div>
                  )}
                  {selectedMeeting.roomId && <p className="text-[10px] text-slate-500">Room name: {selectedMeeting.roomId}</p>}
                </section>
              )}

              {selectedMeeting.decisions?.length > 0 && (
                <div className={`space-y-2 rounded-xl border p-4 ${darkMode ? 'bg-[#090d22] border-indigo-950' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">Demo decisions</div>
                  <ul className="space-y-1.5 text-xs">
                    {selectedMeeting.decisions.map((decision, index) => <li key={index} className="text-slate-300">• {decision}</li>)}
                  </ul>
                </div>
              )}

              {selectedMeeting.actionItems?.length > 0 && <div className="space-y-3">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  ACTION ITEMS · OWNERS · DUE
                </div>
                <div className="space-y-2">
                  {selectedMeeting.actionItems.map((act) => (
                    <div
                      key={act.id}
                      className={`p-3 rounded-lg border flex items-center justify-between gap-3 transition-colors ${
                        act.done
                          ? darkMode
                            ? 'bg-emerald-950/20 border-emerald-900/40 text-slate-400 line-through'
                            : 'bg-emerald-50 border-emerald-200 text-slate-500 line-through'
                          : darkMode
                          ? 'bg-[#0e142f] border-indigo-950/80 hover:border-indigo-800 text-slate-200'
                          : 'bg-white border-slate-200 hover:border-indigo-300 text-slate-800'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => toggleActionItem(selectedMeeting.id, act.id)}
                        className="flex min-w-0 flex-1 items-center gap-2.5 text-left"
                        aria-pressed={act.done}
                      >
                        {act.done ? (
                          <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-400 shrink-0" />
                        )}
                        <span className="min-w-0 break-words text-xs font-medium">{act.text}</span>
                      </button>
                      <div className="flex items-center gap-2 text-[10px] font-mono shrink-0">
                        <span className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/40">
                          {act.owner}
                        </span>
                        <span className="text-slate-400">{act.dueDate}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>}

              {selectedMeeting.transcript?.length > 0 && <div className="space-y-3 pt-2">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  SAMPLE DEMO TRANSCRIPT · NOT RECORDED
                </div>
                <div className={`p-4 rounded-xl border space-y-3 text-xs font-sans ${
                  darkMode ? 'bg-[#070914] border-indigo-950/80 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}>
                  {selectedMeeting.transcript.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <span className="text-[10px] text-slate-400 font-mono shrink-0 mt-0.5">
                        {item.time}
                      </span>
                      <div>
                        <span className="font-bold text-indigo-400 mr-2">
                          {item.speaker}:
                        </span>
                        <span className="leading-relaxed">{item.text}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>}
            </>
          ) : (
            <div className="text-center py-12 text-slate-500 text-xs">
              Select a meeting to view its summary, decisions, and transcript.
            </div>
          )}
        </div>
      </div>

      {/* New Meeting Recording & Consent Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className={`w-full max-w-md rounded-2xl border p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150 ${
            darkMode ? 'bg-[#0c1024] border-indigo-900 text-white' : 'bg-white border-slate-300 text-slate-900'
          }`}>
            <div>
              <h3 className="text-sm font-bold">Create meeting notes & Zoom room</h3>
              <p className="text-xs text-slate-400 mt-1">
                Saves a meeting record and a Zoom session name. A secure server-issued token is required to join; no recording or AI summary is created.
              </p>
            </div>

            {formError && (
              <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreateMeeting} className="space-y-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">Meeting Title</label>
                <input
                  type="text"
                  placeholder="e.g. Q4 Growth & Knowledge Architecture"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className={`w-full px-3 py-2 text-xs rounded-lg border focus:outline-none focus:border-indigo-500 ${
                    darkMode ? 'bg-[#0e1329] border-indigo-950 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">Initial notes (optional)</label>
                <textarea
                  rows={2}
                  placeholder="Key items discussed or preliminary notes..."
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
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
                  className="px-4 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-md transition-colors"
                >
                  Save Meeting
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
