import React, { useState, useRef, useEffect } from 'react';
import {
  Mic,
  Upload,
  Play,
  Pause,
  Square,
  AlertCircle
} from 'lucide-react';
import { loadVoiceAudio } from '../utils/firebase.js';

export const VoiceMemoryPage = ({
  voiceNotes: initialNotes,
  onAddVoiceNote,
  isRealTimeMode = false,
  darkMode,
}) => {
  const [voiceNotes, setVoiceNotes] = useState(initialNotes);
  const [playingId, setPlayingId] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [audioError, setAudioError] = useState('');
  const [audioSources, setAudioSources] = useState({});

  // Keep synced if initialNotes change
  React.useEffect(() => {
    setVoiceNotes(initialNotes);
  }, [initialNotes]);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  const activeAudioElementRef = useRef(null);
  const recordingStartedAtRef = useRef(0);

  const audioSignature = voiceNotes.map((note) => `${note.id}:${note.audioPath || ''}`).join('|');

  useEffect(() => {
    let active = true;
    const objectUrls = [];
    Promise.all(voiceNotes.filter((note) => note.audioPath).map(async (note) => {
      try {
        const blob = await loadVoiceAudio(note.audioPath);
        const url = URL.createObjectURL(blob);
        if (!active) {
          URL.revokeObjectURL(url);
          return null;
        }
        objectUrls.push(url);
        return [note.id, url];
      } catch (error) {
        if (active) setAudioError(`Could not load a saved recording: ${error.message}`);
        return null;
      }
    })).then((entries) => {
      if (active) setAudioSources(Object.fromEntries(entries.filter(Boolean)));
    });
    return () => {
      active = false;
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [audioSignature]);

  const togglePlay = (vn) => {
    if (playingId === vn.id) {
      if (activeAudioElementRef.current) {
        activeAudioElementRef.current.pause();
      }
      setPlayingId(null);
      return;
    }

    const audioUrl = vn.audioBlobUrl || audioSources[vn.id];
    if (audioUrl) {
      if (activeAudioElementRef.current) {
        activeAudioElementRef.current.pause();
      }
      const audio = new Audio(audioUrl);
      activeAudioElementRef.current = audio;
      audio.play().then(() => setPlayingId(vn.id)).catch((error) => {
        setAudioError(`Audio playback failed: ${error.message}`);
      });
      audio.onended = () => setPlayingId(null);
    } else {
      setAudioError('This sample recording has no playable audio file.');
    }
  };

  const startLiveRecording = async () => {
    setAudioError('');
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setAudioError('MediaDevices API is not available on this browser or connection.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      if (!MediaRecorder.isTypeSupported('audio/webm')) {
        stream.getTracks().forEach((track) => track.stop());
        setAudioError('This browser does not support the secure WebM audio format required to save recordings.');
        return;
      }
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mediaRecorder.mimeType });
        const audioUrl = URL.createObjectURL(audioBlob);

        const elapsedSeconds = Math.max(1, Math.round((Date.now() - recordingStartedAtRef.current) / 1000));
        const mins = Math.floor(elapsedSeconds / 60);
        const secs = elapsedSeconds % 60;
        const durStr = `${mins}:${secs < 10 ? '0' : ''}${secs}`;

        const newNote = {
          id: `voice-${Date.now()}`,
          title: `Voice recording · ${new Date().toLocaleString()}`,
          timeAgo: 'JUST NOW',
          duration: durStr || '0:05',
          status: 'RECORDED',
          snippet: 'Captured from this device. No speech-to-text or AI summary service is connected.',
          summary: '',
          actionItems: [],
          audioBlobUrl: audioUrl,
        };

        try {
          await onAddVoiceNote?.({ ...newNote, audioBlobUrl: undefined }, audioBlob);
          setVoiceNotes((previous) => [newNote, ...previous]);
        } catch (error) {
          URL.revokeObjectURL(audioUrl);
          setAudioError(error.message || 'The recording could not be saved.');
        }
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      recordingStartedAtRef.current = Date.now();
      setRecordSeconds(0);

      timerRef.current = setInterval(() => {
        setRecordSeconds((s) => s + 1);
      }, 1000);
    } catch (err) {
      setAudioError(`Microphone error: ${err.message}. Please allow microphone permissions in your browser.`);
      setIsRecording(false);
    }
  };

  const stopLiveRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRecording(false);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 lg:p-8 space-y-6">
      {/* Top Header matching Screenshot 16 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className={`text-xl font-bold tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              Voice memory
            </h1>
            <span className={`px-2 py-0.5 rounded-full border text-[10px] font-semibold ${
              darkMode ? 'bg-indigo-950 border-indigo-800/60 text-indigo-300' : 'bg-indigo-50 border-indigo-200 text-indigo-700'
            }`}>
              {isRealTimeMode ? 'PRIVATE RECORDINGS' : 'DEMO DATA'}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Browser recording · no transcription or AI summaries configured
          </p>
        </div>

        {/* Action Buttons matching Screenshot 16 */}
        <div className="flex items-center gap-3">
          {!isRecording ? (
            <button
              onClick={startLiveRecording}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-[0_0_15px_-2px_rgba(99,102,241,0.5)] transition-all cursor-pointer"
            >
              <Mic className="w-3.5 h-3.5" />
              <span>Record Live Mic</span>
            </button>
          ) : (
            <button
              onClick={stopLiveRecording}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold animate-pulse shadow-lg cursor-pointer"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>Stop Recording ({recordSeconds}s)</span>
            </button>
          )}
        </div>
      </div>

      {/* Microphone Error Notification */}
      {audioError && (
        <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{audioError}</span>
        </div>
      )}

      {/* Grid of Audio Cards matching Screenshot 16 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {voiceNotes.map((note) => {
          const vn = { ...note, audioBlobUrl: note.audioBlobUrl || audioSources[note.id] };
          const isPlaying = playingId === vn.id;
          return (
            <div
              key={vn.id}
              className={`p-5 rounded-2xl border flex flex-col justify-between space-y-4 shadow-sm transition-all ${
                darkMode ? 'bg-[#0c1024] border-indigo-950/80 hover:border-indigo-800/60' : 'bg-white border-slate-200 hover:border-indigo-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">
                    {vn.timeAgo}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold tracking-wider uppercase border ${
                    vn.status === 'READY'
                      ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800/60'
                      : 'bg-cyan-950/80 text-cyan-300 border-cyan-800/60 animate-pulse'
                  }`}>
                    {vn.status}
                  </span>
                </div>

                <h3 className={`text-sm font-bold tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  {vn.title}
                </h3>

                {/* Audio Waveform Player */}
                <div className={`mt-3 p-3 rounded-xl border flex items-center gap-3 ${
                  darkMode ? 'bg-[#070914] border-indigo-950' : 'bg-slate-50 border-slate-200'
                }`}>
                  <button
                    onClick={() => togglePlay(vn)}
                    className="w-8 h-8 rounded-full bg-indigo-600 hover:bg-indigo-500 flex items-center justify-center text-white shrink-0 shadow-sm cursor-pointer"
                  >
                    {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
                  </button>

                  {/* Decorative level bars; they are not an audio waveform. */}
                  <div className="flex items-center gap-1 flex-1 h-8 overflow-hidden">
                    {(vn.waveHeights || [30, 45, 60, 40, 80, 50, 70, 90, 40, 30, 50, 70]).map((h, i) => (
                      <div
                        key={i}
                        className={`w-1 rounded-full transition-all ${
                          isPlaying
                            ? 'bg-cyan-400 animate-pulse'
                            : darkMode
                            ? 'bg-indigo-800/60'
                            : 'bg-slate-300'
                        }`}
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>

                  <span className="text-[10px] font-mono text-slate-400 shrink-0">
                    {vn.duration}
                  </span>
                </div>

                {/* Transcript snippet */}
                <p className="text-xs text-slate-400 mt-3 font-sans italic line-clamp-2">
                  {vn.snippet}
                </p>
              </div>

              {/* Action buttons matching screenshot */}
              <p className="border-t border-indigo-950/40 pt-3 text-[11px] text-slate-500">
                {vn.audioPath ? 'Recording stored in your private Firebase workspace.' : 'Summaries and action extraction require an AI service.'}
              </p>
            </div>
          );
        })}
      </div>

      {/* Footer Notice matching Screenshot 16 */}
      <div className="pt-4 text-center text-[11px] text-slate-500">
        Microphone recording activates only when browser permissions and supported APIs allow it — MindMesh never fakes a recording session.
      </div>
    </div>
  );
};
