import React, { useEffect, useRef, useState } from 'react';
import {
  Captions,
  MessageSquare,
  Mic,
  MicOff,
  MonitorUp,
  PhoneOff,
  Users,
  Video,
  VideoOff,
} from 'lucide-react';

const languageNames = { en: 'English', hi: 'Hindi', gu: 'Gujarati' };

const ensureZoomSuccess = async (result, operation) => {
  const outcome = await result;
  if (outcome && typeof outcome === 'object' && 'type' in outcome) {
    throw new Error(`${operation}: ${outcome.reason || outcome.type}`);
  }
  return outcome;
};

export default function ZoomMeetingRoom({
  meeting,
  invitation,
  isRealTimeMode,
  userName,
  summary,
  onSummaryChange,
  onSaveNotes,
  notesFeedback,
  darkMode,
  onLeave,
}) {
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [muted, setMuted] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [captions, setCaptions] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatDraft, setChatDraft] = useState('');
  const [captionLanguage, setCaptionLanguage] = useState('en');
  const [speakingLanguage, setSpeakingLanguage] = useState('en');
  const [activePanel, setActivePanel] = useState('notes');
  const [translationNotice, setTranslationNotice] = useState('');
  const clientRef = useRef(null);
  const streamRef = useRef(null);
  const chatRef = useRef(null);
  const videoGridRef = useRef(null);
  const screenVideoRef = useRef(null);
  const renderedVideoIds = useRef(new Set());
  const captionLanguageRef = useRef(captionLanguage);
  captionLanguageRef.current = captionLanguage;

  const panelClass = `rounded-xl border ${darkMode ? 'bg-[#080b18] border-indigo-950 text-slate-200' : 'bg-white border-slate-200 text-slate-800'}`;

  const refreshParticipants = () => {
    const client = clientRef.current;
    if (client) {
      const users = client.getAllUser();
      setParticipants(users);
      users.forEach((participant) => void renderParticipantVideo(participant));
    }
  };

  const renderParticipantVideo = async (participant) => {
    const client = clientRef.current;
    const container = videoGridRef.current;
    if (!client || !container || participant?.userId == null || renderedVideoIds.current.has(participant.userId)) return;
    renderedVideoIds.current.add(participant.userId);
    try {
      const { VideoQuality } = await import('@zoom/videosdk');
      const element = await streamRef.current.attachVideo(participant.userId, VideoQuality.Video_720P);
      if (element && typeof element === 'object' && 'type' in element) {
        throw new Error(element.reason || 'Video could not be attached.');
      }
      if (videoGridRef.current && element) {
        element.setAttribute('aria-label', `${participant.displayName || 'Participant'} video`);
        element.classList.add('h-full', 'w-full', 'object-cover');
        const tile = document.createElement('div');
        tile.className = 'relative min-h-40 overflow-hidden rounded-xl border border-slate-700 bg-black';
        tile.dataset.zoomUserId = String(participant.userId);
        tile.appendChild(element);
        const label = document.createElement('span');
        label.className = 'absolute bottom-2 left-2 rounded bg-black/70 px-2 py-1 text-xs text-white';
        label.textContent = participant.displayName || 'Participant';
        tile.appendChild(label);
        videoGridRef.current.appendChild(tile);
      }
    } catch (videoError) {
      renderedVideoIds.current.delete(participant.userId);
      setError(`Video could not be displayed: ${videoError.message || 'Check camera permissions and browser support.'}`);
    }
  };

  const addCaption = async (message) => {
    if (!message?.text?.trim()) return;
    const item = {
      id: message.msgId || `${message.userId}-${message.timestamp}-${message.text.slice(0, 20)}`,
      speaker: message.displayName || 'Participant',
      text: message.text.trim(),
      time: message.timestamp,
      translatedText: '',
      translating: message.done !== false && captionLanguageRef.current !== 'en',
    };
    setCaptions((previous) => {
      const existing = previous.findIndex((caption) => caption.id === item.id);
      if (existing < 0) return [...previous.slice(-99), item];
      const next = [...previous];
      next[existing] = { ...next[existing], ...item };
      return next;
    });

    if (message.done === false || captionLanguageRef.current === 'en') return;
    try {
      const { translateMeetingCaption } = await import('../utils/firebase.js');
      const result = await translateMeetingCaption({ text: item.text, target: captionLanguageRef.current });
      setCaptions((previous) => previous.map((caption) => (
        caption.id === item.id ? { ...caption, translatedText: result.text, translating: false } : caption
      )));
    } catch (translationError) {
      setTranslationNotice(translationError.message || 'Live translation is unavailable.');
      setCaptions((previous) => previous.map((caption) => (
        caption.id === item.id ? { ...caption, translating: false } : caption
      )));
    }
  };

  const joinMeeting = async () => {
    if (!isRealTimeMode) {
      setError('Live meetings are unavailable in demo mode. Sign in with Firebase to join a real Zoom session.');
      return;
    }
    setStatus('joining');
    setError('');
    try {
      const { getZoomMeetingToken } = await import('../utils/firebase.js');
      const tokenData = await getZoomMeetingToken(invitation
        ? { invitation }
        : { meetingId: meeting.id });
      const ZoomVideo = await import('@zoom/videosdk');
      const client = ZoomVideo.default.createClient();
      clientRef.current = client;
      client.on('user-added', refreshParticipants);
      client.on('user-removed', refreshParticipants);
      client.on('user-updated', refreshParticipants);
      client.on('video-active-change', () => {
        refreshParticipants();
        client.getAllUser().forEach((participant) => void renderParticipantVideo(participant));
      });
      client.on('chat-on-message', (message) => setChatMessages((previous) => [...previous.slice(-99), message]));
      client.on('caption-message', addCaption);
      await ensureZoomSuccess(client.init('en-US', 'Global'), 'Zoom initialization failed');
      await ensureZoomSuccess(client.join(tokenData.roomId, tokenData.token, userName || 'MindMesh participant'), 'Could not join Zoom');
      const stream = client.getMediaStream();
      streamRef.current = stream;
      refreshParticipants();
      setStatus('connected');
      try {
        await ensureZoomSuccess(stream.startAudio(), 'Microphone could not start');
        setMuted(false);
      } catch (audioError) {
        setError(`Joined, but microphone could not start: ${audioError.message || 'Check microphone permissions.'}`);
      }
      try {
        await ensureZoomSuccess(stream.startVideo(), 'Camera could not start');
        setCameraOn(true);
        await renderParticipantVideo(client.getCurrentUserInfo());
      } catch {
        setCameraOn(false);
      }
      try {
        const transcription = client.getLiveTranscriptionClient();
        const transcriptionStatus = transcription.getLiveTranscriptionStatus();
        if (transcriptionStatus.isLiveTranscriptionEnabled) {
          await ensureZoomSuccess(transcription.setSpeakingLanguage(speakingLanguage), 'Speech recognition language could not be selected');
          if (tokenData.roleType === 1) await ensureZoomSuccess(transcription.startLiveTranscription(), 'Live captions could not start');
        } else {
          setTranslationNotice('Live captions are not enabled for this Zoom account or meeting.');
        }
      } catch {
        setTranslationNotice('Zoom could not start live captions. Check host settings and transcription entitlement.');
      }
    } catch (joinError) {
      await cleanupRoom();
      setStatus('idle');
      setError(joinError.message || 'Could not join this Zoom meeting. Check credentials, meeting access, and network.');
    }
  };

  const cleanupRoom = async () => {
    const client = clientRef.current;
    if (client) {
      try {
        await streamRef.current?.stopShareScreen();
        await streamRef.current?.stopVideo();
        await streamRef.current?.stopAudio();
        await client.leave();
      } catch {
        // The session may already have disconnected; local controls still need to reset.
      }
      clientRef.current = null;
      streamRef.current = null;
      chatRef.current = null;
    }
    renderedVideoIds.current.clear();
    if (videoGridRef.current) videoGridRef.current.replaceChildren();
    setStatus('idle');
    setMuted(false);
    setCameraOn(false);
    setSharing(false);
    setParticipants([]);
  };

  useEffect(() => () => {
    void cleanupRoom();
  }, []);

  const toggleMicrophone = async () => {
    try {
      if (muted) await ensureZoomSuccess(streamRef.current.unmuteAudio(), 'Microphone could not unmute');
      else await ensureZoomSuccess(streamRef.current.muteAudio(), 'Microphone could not mute');
      setMuted(!muted);
      if (muted) await renderParticipantVideo(clientRef.current.getCurrentUserInfo());
    } catch (controlError) {
      setError(`Microphone control failed: ${controlError.message || 'Check device permissions.'}`);
    }
  };

  const toggleCamera = async () => {
    try {
      if (cameraOn) {
        await ensureZoomSuccess(streamRef.current.stopVideo(), 'Camera could not stop');
        setCameraOn(false);
      } else {
        await ensureZoomSuccess(streamRef.current.startVideo(), 'Camera could not start');
        setCameraOn(true);
        await renderParticipantVideo(clientRef.current.getCurrentUserInfo());
      }
    } catch (controlError) {
      setError(`Camera control failed: ${controlError.message || 'Check device permissions.'}`);
    }
  };

  const toggleScreenShare = async () => {
    try {
      if (sharing) {
        await ensureZoomSuccess(streamRef.current.stopShareScreen(), 'Screen sharing could not stop');
        setSharing(false);
      } else {
        await ensureZoomSuccess(streamRef.current.startShareScreen(screenVideoRef.current), 'Screen sharing could not start');
        setSharing(true);
      }
    } catch (shareError) {
      setError(`Screen sharing failed: ${shareError.message || 'Your browser may not support screen sharing.'}`);
    }
  };

  const sendChat = async (event) => {
    event.preventDefault();
    const message = chatDraft.trim();
    if (!message || !clientRef.current) return;
    try {
      const chat = clientRef.current.getChatClient();
      const result = await chat.sendToAll(message);
      if (result instanceof Error) throw result;
      setChatMessages((previous) => [...previous.slice(-99), result]);
      setChatDraft('');
    } catch (chatError) {
      setError(`Message could not be sent: ${chatError.message || 'Check meeting chat permissions.'}`);
    }
  };

  const leaveMeeting = async () => {
    await cleanupRoom();
    onLeave?.();
  };

  return (
    <section className={`${panelClass} space-y-3 p-3 sm:p-4`} aria-label="Zoom meeting">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Video className="h-4 w-4 text-indigo-400" />
          Zoom Video SDK
          {status === 'connected' && <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] text-emerald-400">Live</span>}
        </div>
        {status === 'idle' ? (
          <button type="button" onClick={joinMeeting} className="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white hover:bg-indigo-500">
            Join live meeting
          </button>
        ) : status === 'joining' ? (
          <span role="status" className="text-xs text-indigo-300">Connecting securely…</span>
        ) : (
          <button type="button" onClick={leaveMeeting} className="inline-flex items-center gap-2 rounded-lg bg-rose-700 px-3 py-2 text-xs font-semibold text-white hover:bg-rose-600">
            <PhoneOff className="h-4 w-4" /> Leave meeting
          </button>
        )}
      </div>
      <p className="text-[11px] leading-relaxed text-slate-400">
        Zoom receives meeting audio/video. Captions are processed for your selected language only when live transcription and the translation provider are configured. No recording is started.
      </p>
      {error && <p role="alert" className="rounded-lg border border-rose-800 bg-rose-950/40 p-2 text-xs text-rose-300">{error}</p>}

      <div className="grid min-w-0 grid-cols-1 gap-3 xl:grid-cols-[minmax(0,1.65fr)_minmax(260px,1fr)]">
        <div className="min-w-0 space-y-3">
          <div ref={videoGridRef} className="grid min-h-52 grid-cols-1 gap-2 bg-[#05070f] p-2 sm:min-h-72 sm:grid-cols-2" aria-label="Meeting participants' video" />
          <video ref={screenVideoRef} className={sharing ? 'h-48 w-full rounded-xl bg-black' : 'hidden'} muted playsInline />
          {status === 'connected' && (
            <div className="flex flex-wrap items-center gap-2">
              <button type="button" onClick={toggleMicrophone} aria-label={muted ? 'Unmute microphone' : 'Mute microphone'} className="rounded-lg border border-slate-700 p-2 text-xs hover:bg-slate-800">
                {muted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </button>
              <button type="button" onClick={toggleCamera} aria-label={cameraOn ? 'Turn camera off' : 'Turn camera on'} className="rounded-lg border border-slate-700 p-2 text-xs hover:bg-slate-800">
                {cameraOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
              </button>
              <button type="button" onClick={toggleScreenShare} aria-pressed={sharing} className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-xs hover:bg-slate-800">
                <MonitorUp className="h-4 w-4" /> {sharing ? 'Stop sharing' : 'Share screen'}
              </button>
              <span className="ml-auto inline-flex items-center gap-1 text-xs text-slate-400"><Users className="h-4 w-4" /> {participants.length}</span>
            </div>
          )}
        </div>

        <div className="flex min-h-[22rem] min-w-0 flex-col overflow-hidden rounded-xl border border-slate-800">
          <div role="tablist" aria-label="Meeting tools" className="flex border-b border-slate-800">
            {[
              ['notes', 'Notes'],
              ['chat', 'Chat'],
              ['captions', 'Live captions'],
            ].map(([id, label]) => (
              <button key={id} type="button" role="tab" aria-selected={activePanel === id} onClick={() => setActivePanel(id)} className={`flex-1 px-2 py-2 text-[11px] ${activePanel === id ? 'border-b-2 border-indigo-400 text-indigo-300' : 'text-slate-400'}`}>
                {label}
              </button>
            ))}
          </div>

          {activePanel === 'notes' && (
            <div className="flex flex-1 flex-col gap-2 p-3">
              <label htmlFor={`meeting-notes-${meeting.id}`} className="text-xs font-semibold">Private meeting notes</label>
              <textarea id={`meeting-notes-${meeting.id}`} rows={8} maxLength={10000} value={summary} onChange={(event) => onSummaryChange(event.target.value)} placeholder="Capture decisions and follow-ups…" className="min-h-36 flex-1 resize-y rounded-lg border border-slate-700 bg-slate-950/70 p-3 text-xs leading-relaxed text-slate-200 outline-none focus:border-indigo-500" />
              <button type="button" onClick={onSaveNotes} className="self-start rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white hover:bg-indigo-500">Save notes</button>
              {notesFeedback && <p role="status" className="text-xs text-slate-400">{notesFeedback}</p>}
            </div>
          )}

          {activePanel === 'chat' && (
            <div className="flex min-h-0 flex-1 flex-col p-3">
              <div className="min-h-40 flex-1 space-y-2 overflow-auto text-xs">
                {chatMessages.length === 0 && <p className="text-slate-500">Meeting chat messages appear here after you join.</p>}
                {chatMessages.map((message, index) => (
                  <p key={message.id || `${message.timestamp}-${index}`} className="break-words"><span className="font-semibold text-indigo-300">{message.sender?.name || 'Participant'}: </span>{message.message}</p>
                ))}
              </div>
              <form onSubmit={sendChat} className="mt-3 flex gap-2">
                <input value={chatDraft} onChange={(event) => setChatDraft(event.target.value)} maxLength={1000} aria-label="Meeting chat message" placeholder="Send a message" className="min-w-0 flex-1 rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-xs outline-none focus:border-indigo-500" />
                <button type="submit" disabled={!chatDraft.trim() || status !== 'connected'} className="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white disabled:opacity-40">Send</button>
              </form>
            </div>
          )}

          {activePanel === 'captions' && (
            <div className="flex min-h-0 flex-1 flex-col p-3">
              <label htmlFor={`caption-language-${meeting.id}`} className="mb-2 flex items-center gap-2 text-xs font-semibold"><Captions className="h-4 w-4 text-indigo-400" /> Show original + translation</label>
              <label htmlFor={`speaking-language-${meeting.id}`} className="mb-1 text-[11px] text-slate-400">Speech recognition language</label>
              <select id={`speaking-language-${meeting.id}`} value={speakingLanguage} onChange={(event) => {
                const language = event.target.value;
                setSpeakingLanguage(language);
                try {
                  void ensureZoomSuccess(clientRef.current?.getLiveTranscriptionClient().setSpeakingLanguage(language), 'Speech recognition language unavailable')
                    .catch((languageError) => setTranslationNotice(languageError.message));
                } catch (languageError) {
                  setTranslationNotice(languageError.message || 'This speech recognition language is unavailable.');
                }
              }} className="mb-2 rounded-lg border border-slate-700 bg-slate-950 px-2 py-2 text-xs">
                <option value="en">English</option>
                <option value="hi">Hindi</option>
              </select>
              <select id={`caption-language-${meeting.id}`} value={captionLanguage} onChange={(event) => setCaptionLanguage(event.target.value)} className="mb-3 rounded-lg border border-slate-700 bg-slate-950 px-2 py-2 text-xs">
                {Object.entries(languageNames).map(([code, name]) => <option key={code} value={code}>{name}</option>)}
              </select>
              {translationNotice && <p role="status" className="mb-2 text-[11px] text-amber-300">{translationNotice}</p>}
              <div className="min-h-36 flex-1 space-y-3 overflow-auto text-xs">
                {captions.length === 0 && <p className="text-slate-500">Original speech captions appear here when Zoom live transcription is enabled for this meeting.</p>}
                {captions.map((caption) => (
                  <article key={caption.id} className="space-y-1 border-b border-slate-800 pb-2">
                    <p className="text-[10px] text-slate-500">{caption.speaker} · {new Date(caption.time).toLocaleTimeString()}</p>
                    <p className="leading-relaxed">{caption.text}</p>
                    {captionLanguage !== 'en' && (
                      <p lang={captionLanguage} className="leading-relaxed text-cyan-300">
                        {caption.translating ? 'Translating…' : caption.translatedText || 'Translation unavailable'}
                      </p>
                    )}
                  </article>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <p className="text-[10px] leading-relaxed text-slate-500">
        Hindi and English speech recognition are available in the Zoom SDK. Gujarati speech recognition is not listed by Zoom; Gujarati text translation uses the configured Google Cloud Translation service. Translation requires a live transcript and may incur provider charges.
      </p>
    </section>
  );
}
