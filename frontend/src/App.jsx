import React, { lazy, Suspense, useState, useEffect, useRef } from 'react';
import { Sidebar } from './components/Sidebar.jsx';
import { Header } from './components/Header.jsx';
import { QuickCaptureModal } from './components/QuickCaptureModal.jsx';
import { CommandPalette } from './components/CommandPalette.jsx';
import { NoteDetailPage } from './pages/NoteDetailPage.jsx';
import { NoteEditorPage } from './pages/NoteEditorPage.jsx';

const lazyNamed = (loadModule, exportName) => lazy(() => loadModule().then((module) => ({
  default: module[exportName],
})));

const LandingPage = lazyNamed(() => import('./pages/LandingPage.jsx'), 'LandingPage');
const FeaturesPage = lazyNamed(() => import('./pages/FeaturesPage.jsx'), 'FeaturesPage');
const PricingPage = lazyNamed(() => import('./pages/PricingPage.jsx'), 'PricingPage');
const SecurityPage = lazyNamed(() => import('./pages/SecurityPage.jsx'), 'SecurityPage');
const UseCasesPage = lazyNamed(() => import('./pages/UseCasesPage.jsx'), 'UseCasesPage');
const SignInPage = lazyNamed(() => import('./pages/SignInPage.jsx'), 'SignInPage');
const RegisterPage = lazyNamed(() => import('./pages/RegisterPage.jsx'), 'RegisterPage');
const NotFoundPage = lazyNamed(() => import('./pages/NotFoundPage.jsx'), 'NotFoundPage');
const DashboardPage = lazyNamed(() => import('./pages/DashboardPage.jsx'), 'DashboardPage');
const AssistantPage = lazyNamed(() => import('./pages/AssistantPage.jsx'), 'AssistantPage');
const KnowledgeGraphPage = lazyNamed(() => import('./pages/KnowledgeGraphPage.jsx'), 'KnowledgeGraphPage');
const HybridSearchPage = lazyNamed(() => import('./pages/HybridSearchPage.jsx'), 'HybridSearchPage');
const NotesPage = lazyNamed(() => import('./pages/NotesPage.jsx'), 'NotesPage');
const DocumentsPage = lazyNamed(() => import('./pages/DocumentsPage.jsx'), 'DocumentsPage');
const MeetingsPage = lazyNamed(() => import('./pages/MeetingsPage.jsx'), 'MeetingsPage');
const VoiceMemoryPage = lazyNamed(() => import('./pages/VoiceMemoryPage.jsx'), 'VoiceMemoryPage');
const ScreenshotSearchPage = lazyNamed(() => import('./pages/ScreenshotSearchPage.jsx'), 'ScreenshotSearchPage');
const TimelinePage = lazyNamed(() => import('./pages/TimelinePage.jsx'), 'TimelinePage');
const InsightsPage = lazyNamed(() => import('./pages/InsightsPage.jsx'), 'InsightsPage');
const CollectionsPage = lazyNamed(() => import('./pages/CollectionsPage.jsx'), 'CollectionsPage');
const SettingsPage = lazyNamed(() => import('./pages/SettingsPage.jsx'), 'SettingsPage');
const BillingPage = lazyNamed(() => import('./pages/BillingPage.jsx'), 'BillingPage');
const AdminPage = lazyNamed(() => import('./pages/AdminPage.jsx'), 'AdminPage');
const ContactsPage = lazyNamed(() => import('./pages/ContactsPage.jsx'), 'ContactsPage');
const MemoryMapPage = lazyNamed(() => import('./pages/MemoryMapPage.jsx'), 'MemoryMapPage');
const CloudSqlPage = lazyNamed(() => import('./pages/CloudSqlPage.jsx'), 'CloudSqlPage');
const FirebaseSyncPage = lazyNamed(() => import('./pages/FirebaseSyncPage.jsx'), 'FirebaseSyncPage');
const FlashcardsPage = lazyNamed(() => import('./pages/FlashcardsPage.jsx'), 'FlashcardsPage');
const CanvasBoardPage = lazyNamed(() => import('./pages/CanvasBoardPage.jsx'), 'CanvasBoardPage');
const WorkflowsPage = lazyNamed(() => import('./pages/WorkflowsPage.jsx'), 'WorkflowsPage');
const WebhooksPage = lazyNamed(() => import('./pages/WebhooksPage.jsx'), 'WebhooksPage');
const FoodMemoriesPage = lazyNamed(() => import('./pages/FoodMemoriesPage.jsx'), 'FoodMemoriesPage');

class PageErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error('MindMesh page failed to render.', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 px-4 text-center" role="alert">
          <p className="text-sm font-semibold">This page could not be loaded.</p>
          <p className="text-xs text-slate-400">Your saved records were not changed. Try reloading the application.</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="min-h-10 rounded-lg bg-indigo-600 px-4 text-xs font-semibold text-white hover:bg-indigo-500"
          >
            Reload MindMesh
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

import { loadJson, loadText, saveJson, saveText } from './utils/localStore.js';
import { buildGraphFromRecords } from './utils/engine.js';
import { firebaseConfigured } from './utils/firebaseConfig.js';
import { firebaseErrorMessage } from './utils/firebaseErrors.js';
import {
  PUBLIC_VIEWS,
  returnViewAfterAuth,
  urlForView,
  urlForNote,
  urlForNoteEdit,
  noteIdFromPathname,
  viewFromPathname,
} from './utils/navigation.js';

// Initial Data (PDF demo preset only — never mixed into Live Real-Time)
import {
  initialUserProfile,
  initialNotes,
  initialDocuments,
  initialMeetings,
  initialVoiceNotes,
  initialScreenshots,
  initialTimelineEvents,
  initialGraphNodes,
  initialGraphEdges,
  initialCollections,
  initialGeoMemories,
  initialFlashcards,
  initialCanvasItems,
  initialWorkflows,
  initialWebhooks,
  initialContacts,
} from './data/mockData.js';

const loadFirebase = () => import('./utils/firebase.js');

export default function App() {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [demoSession, setDemoSession] = useState(null);
  const pendingAuthenticatedNavigation = useRef(false);
  const registrationInProgress = useRef(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(() => navigator.onLine);
  const [currentView, setCurrentView] = useState(() => viewFromPathname(window.location.pathname));
  const isPublicView = PUBLIC_VIEWS.includes(currentView);
  const [liveRecords, setLiveRecords] = useState([]);
  const [syncState, setSyncState] = useState('idle');
  const [syncError, setSyncError] = useState('');
  const [darkMode, setDarkMode] = useState(() => loadJson('mindmesh_theme', 'dark') !== 'light');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [quickCaptureOpen, setQuickCaptureOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [isRealTimeMode, setIsRealTimeMode] = useState(() => {
    return loadText('mindmesh_mode', 'demo') === 'realtime';
  });
  const isAuthenticated = Boolean(firebaseUser || demoSession);

  const navigateToView = (view, { replace = false, state = {} } = {}) => {
    const nextUrl = urlForView(view, window.location.href);
    const nextLocation = `${nextUrl.pathname}${nextUrl.search}${nextUrl.hash}`;
    const currentLocation = `${window.location.pathname}${window.location.search}${window.location.hash}`;

    if (nextLocation !== currentLocation) {
      const updateHistory = replace ? window.history.replaceState : window.history.pushState;
      updateHistory.call(window.history, {
        ...state,
        view: viewFromPathname(nextUrl.pathname),
      }, '', nextLocation);
    }

    setCurrentView(viewFromPathname(nextUrl.pathname));
    setMobileNavOpen(false);
  };

  const navigateToNote = (noteId, { edit = false, replace = false, state = {} } = {}) => {
    const makeUrl = edit ? urlForNoteEdit : urlForNote;
    const nextUrl = makeUrl(noteId, window.location.href);
    const nextState = {
      ...state,
      view: edit ? 'note-edit' : 'note-detail',
      noteId,
    };
    const updateHistory = replace ? window.history.replaceState : window.history.pushState;
    updateHistory.call(window.history, nextState, '', `${nextUrl.pathname}${nextUrl.search}${nextUrl.hash}`);
    setCurrentView(viewFromPathname(nextUrl.pathname));
    setMobileNavOpen(false);
  };

  const navigateAfterAuth = () => {
    const historyState = window.history.state || {};
    if (historyState.noteId && (historyState.returnToNoteEdit || historyState.returnToNoteDetail)) {
      navigateToNote(historyState.noteId, {
        edit: Boolean(historyState.returnToNoteEdit),
        replace: true,
        state: historyState.initialNote ? { initialNote: historyState.initialNote } : {},
      });
      return;
    }
    navigateToView(returnViewAfterAuth(historyState), {
      replace: true,
      state: historyState.noteId ? { noteId: historyState.noteId } : {},
    });
  };

  // Real-time localStorage state management (Preset Demo Data)
  const [user, setUser] = useState(() => {
    return loadJson('mindmesh_demo_profile', initialUserProfile);
  });

  const [notes, setNotes] = useState(() => loadJson('mindmesh_notes', initialNotes));
  const [documents, setDocuments] = useState(() => loadJson('mindmesh_docs', initialDocuments));
  const [meetings, setMeetings] = useState(() => loadJson('mindmesh_meetings', initialMeetings));

  const [voiceNotes, setVoiceNotes] = useState(() => loadJson('mindmesh_voice', initialVoiceNotes));
  const [screenshots, setScreenshots] = useState(() => loadJson('mindmesh_screenshots', initialScreenshots));
  const [timelineEvents, setTimelineEvents] = useState(() => loadJson('mindmesh_timeline', initialTimelineEvents));
  const [geoMemories, setGeoMemories] = useState(() => loadJson('mindmesh_geo', initialGeoMemories));

  const [graphNodes, setGraphNodes] = useState(initialGraphNodes);
  const [graphEdges, setGraphEdges] = useState(initialGraphEdges);
  const [collections, setCollections] = useState(() => loadJson('mindmesh_collections', initialCollections));
  const [contacts, setContacts] = useState(() => loadJson('mindmesh_contacts', initialContacts));

  const [flashcards, setFlashcards] = useState(() => loadJson('mindmesh_flashcards', initialFlashcards));
  const [canvasItems, setCanvasItems] = useState(() => loadJson('mindmesh_canvas', initialCanvasItems));
  const [workflows, setWorkflows] = useState(() => loadJson('mindmesh_workflows', initialWorkflows));
  const [webhooks, setWebhooks] = useState(() => loadJson('mindmesh_webhooks', initialWebhooks));

  // Demo state is intentionally isolated from Firebase-backed user records.
  useEffect(() => {
    saveJson('mindmesh_flashcards', flashcards);
  }, [flashcards]);

  useEffect(() => {
    saveJson('mindmesh_theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  useEffect(() => {
    saveText('mindmesh_mode', isRealTimeMode ? 'realtime' : 'demo');
  }, [isRealTimeMode]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    saveJson('mindmesh_collections', collections);
  }, [collections]);

  useEffect(() => {
    saveJson('mindmesh_canvas', canvasItems);
  }, [canvasItems]);

  useEffect(() => {
    saveJson('mindmesh_workflows', workflows);
  }, [workflows]);

  useEffect(() => {
    saveJson('mindmesh_webhooks', webhooks);
  }, [webhooks]);

  useEffect(() => {
    saveJson('mindmesh_notes', notes);
  }, [notes]);

  useEffect(() => {
    saveJson('mindmesh_docs', documents);
  }, [documents]);

  useEffect(() => {
    saveJson('mindmesh_meetings', meetings);
  }, [meetings]);

  useEffect(() => {
    saveJson('mindmesh_contacts', contacts);
  }, [contacts]);

  useEffect(() => {
    saveJson('mindmesh_screenshots', screenshots);
  }, [screenshots]);

  useEffect(() => {
    saveJson('mindmesh_geo', geoMemories);
  }, [geoMemories]);

  useEffect(() => {
    saveJson('mindmesh_voice', voiceNotes);
  }, [voiceNotes]);

  useEffect(() => {
    saveJson('mindmesh_timeline', timelineEvents);
  }, [timelineEvents]);

  useEffect(() => {
    if (!firebaseConfigured) {
      setAuthLoading(false);
      return undefined;
    }
    let cancelled = false;
    let unsubscribe = () => {};
    loadFirebase().then(({ observeAuth }) => {
      if (cancelled) return;
      unsubscribe = observeAuth((nextUser) => {
        if (registrationInProgress.current) return;
        setFirebaseUser(nextUser);
        setAuthLoading(false);
        if (nextUser) {
          setDemoSession(null);
          setUser((previous) => ({
            ...previous,
            name: nextUser.displayName || nextUser.email?.split('@')[0] || 'Your workspace',
            email: nextUser.email || '',
            avatar: (nextUser.displayName || nextUser.email || 'U').slice(0, 2).toUpperCase(),
          }));
          setIsRealTimeMode(true);
        }
      });
    }).catch((error) => {
      console.error('Firebase authentication could not be initialized.', error);
      setSyncState('error');
      setSyncError(firebaseErrorMessage(error));
      setAuthLoading(false);
    });
    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentView(viewFromPathname(window.location.pathname));
      setMobileNavOpen(false);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    if (!firebaseUser) {
      setLiveRecords([]);
      setSyncState('idle');
      setSyncError('');
      return undefined;
    }
    setSyncState('loading');
    let cancelled = false;
    let unsubscribe = () => {};
    loadFirebase().then(({ watchUserRecords }) => {
      if (cancelled) return;
      unsubscribe = watchUserRecords(firebaseUser.uid, (records, metadata) => {
        setLiveRecords(records);
        setSyncState(metadata.fromCache ? 'cached' : 'synced');
        setSyncError('');
      }, (error) => {
        setSyncState('error');
        setSyncError(firebaseErrorMessage(error));
      });
    }).catch((error) => {
      console.error('Firebase records could not be loaded.', error);
      setSyncState('error');
      setSyncError(firebaseErrorMessage(error));
    });
    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [firebaseUser]);

  useEffect(() => {
    if (isAuthenticated) {
      pendingAuthenticatedNavigation.current = false;
      if (currentView === 'home') navigateToView('dashboard', { replace: true });
    } else if (!authLoading && !isPublicView && !pendingAuthenticatedNavigation.current) {
      const noteRoute = currentView === 'note-detail' || currentView === 'note-edit';
      const noteId = noteRoute ? noteIdFromPathname(window.location.pathname) : null;
      navigateToView('signin', {
        replace: true,
        state: {
          returnTo: noteRoute ? 'notes' : currentView,
          ...(noteId ? {
            noteId,
            returnToNoteEdit: currentView === 'note-edit',
            returnToNoteDetail: currentView === 'note-detail',
            ...(window.history.state?.initialNote ? { initialNote: window.history.state.initialNote } : {}),
          } : {}),
        },
      });
    }
  }, [isAuthenticated, authLoading, currentView, isPublicView]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const liveOfType = (type) => liveRecords.filter((record) => record.recordType === type);

  const persistRecord = async (type, record) => {
    if (!firebaseUser) {
      setSyncState('error');
      setSyncError('Sign in with a configured Firebase account to save live records.');
      throw new Error('Sign in with a configured Firebase account to save live records.');
    }
    setSyncState('saving');
    setSyncError('');
    try {
      const { saveUserRecord } = await loadFirebase();
      await saveUserRecord(firebaseUser.uid, type, record);
      setSyncState('synced');
      return record;
    } catch (error) {
      setSyncState('error');
      setSyncError(firebaseErrorMessage(error));
      throw new Error(firebaseErrorMessage(error));
    }
  };

  const removeRecord = async (id) => {
    if (!firebaseUser) throw new Error('Sign in before deleting live records.');
    setSyncState('saving');
    setSyncError('');
    try {
      const { removeUserRecord } = await loadFirebase();
      await removeUserRecord(firebaseUser.uid, id);
      setSyncState('synced');
    } catch (error) {
      setSyncState('error');
      setSyncError(firebaseErrorMessage(error));
      throw new Error(firebaseErrorMessage(error));
    }
  };

  const persistRecords = async (records) => {
    if (!firebaseUser) throw new Error('Sign in before restoring private records.');
    setSyncState('saving');
    setSyncError('');
    try {
      const { saveUserRecords } = await loadFirebase();
      await saveUserRecords(firebaseUser.uid, records);
      setSyncState('synced');
      return records;
    } catch (error) {
      setSyncState('error');
      setSyncError(firebaseErrorMessage(error));
      throw new Error(firebaseErrorMessage(error));
    }
  };

  const handleToggleTheme = () => {
    setDarkMode((previous) => !previous);
  };

  const handleQuickSave = async (text) => {
    if (!text.trim()) return;
    const newNote = {
      id: `note-${Date.now()}`,
      title: text.slice(0, 36) + (text.length > 36 ? '...' : ''),
      content: text,
      tags: [],
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString().split('T')[0],
      backlinks: [],
    };
    if (isRealTimeMode) {
      await persistRecord('notes', newNote);
      showToast('Saved to your private Firestore workspace.');
    } else {
      setNotes((prev) => [newNote, ...prev]);
      setTimelineEvents((prev) => [{
        id: `time-${Date.now()}`,
        title: `Quick capture: "${newNote.title}"`,
        category: 'NOTES',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        dateGroup: 'Today',
      }, ...prev]);
      showToast('Saved to the separate demo dataset.');
    }
    return newNote;
  };

  const handleSaveCaptureModal = async (newNote) => {
    if (isRealTimeMode) {
      await persistRecord('notes', newNote);
      showToast('Note saved to your private Firestore workspace.');
    } else {
      setNotes((prev) => [newNote, ...prev]);
      showToast('Saved to the separate demo dataset.');
    }
  };

  const handleAddGeoMemory = async (newGeo) => {
    if (isRealTimeMode) await persistRecord('geoMemories', newGeo);
    else setGeoMemories((prev) => [newGeo, ...prev]);
    showToast(isRealTimeMode ? 'Location saved to your private Firestore workspace.' : 'Location saved to the demo dataset.');
  };

  const handleAddDocument = async (newDoc) => {
    if (isRealTimeMode) await persistRecord('documents', newDoc);
    else setDocuments((prev) => [newDoc, ...prev]);
    showToast(isRealTimeMode ? 'Document metadata saved to Firestore. File contents are not uploaded.' : 'Document added to the demo dataset.');
  };

  const handleDeleteNote = async (id) => {
    if (isRealTimeMode) await removeRecord(id);
    else setNotes((previous) => previous.filter((note) => note.id !== id));
    showToast('Note deleted.');
  };

  const handleSaveNote = (note) => {
    if (isRealTimeMode) return persistRecord('notes', note);
    setNotes((previous) => [note, ...previous.filter((item) => item.id !== note.id)]);
    return Promise.resolve(note);
  };

  const handleCreateNote = async (note) => {
    await handleSaveNote(note);
    navigateToNote(note.id, { edit: true, state: { initialNote: note } });
  };

  const handleAddMeeting = async (newMeeting) => {
    if (isRealTimeMode) await persistRecord('meetings', newMeeting);
    else setMeetings((prev) => [newMeeting, ...prev.filter((meeting) => meeting.id !== newMeeting.id)]);
    showToast(isRealTimeMode ? 'Meeting record saved to your private Firestore workspace.' : 'Meeting added to the demo dataset.');
    return newMeeting;
  };

  const handleAddVoiceNote = async (newVn, audioBlob) => {
    if (isRealTimeMode) {
      if (!firebaseUser || !audioBlob) throw new Error('Sign in before saving a voice recording.');
      const { uploadVoiceAudio, removeVoiceAudio } = await loadFirebase();
      const uploaded = await uploadVoiceAudio(firebaseUser.uid, newVn.id, audioBlob);
      try {
        await persistRecord('voiceNotes', { ...newVn, ...uploaded });
      } catch (error) {
        try {
          await removeVoiceAudio(uploaded.audioPath);
        } catch (cleanupError) {
          console.error('Unable to remove the unlinked voice recording.', cleanupError);
        }
        throw error;
      }
    } else setVoiceNotes((prev) => [newVn, ...prev]);
    showToast(isRealTimeMode ? 'Voice recording saved to your private workspace.' : 'Voice memo added to the demo dataset.');
  };

  const handleAddContact = async (newContact) => {
    if (isRealTimeMode) await persistRecord('contacts', newContact);
    else setContacts((previous) => [newContact, ...previous]);
    showToast(isRealTimeMode ? 'Contact saved to your private workspace.' : 'Contact added to the demo dataset.');
  };

  const handleAddCollection = (collection) => {
    if (isRealTimeMode) return persistRecord('collections', collection);
    setCollections((previous) => [collection, ...previous]);
    return Promise.resolve(collection);
  };

  const handleAddFoodMemory = async ({ photoFile, ...memory }) => {
    if (!firebaseUser || !isRealTimeMode) {
      throw new Error('Sign in to Firebase and switch to Live Real-Time before uploading a food photo.');
    }
    let uploadedPhoto;
    const { uploadFoodPhoto, removeFoodPhoto } = await loadFirebase();
    try {
      uploadedPhoto = await uploadFoodPhoto(firebaseUser.uid, memory.id, photoFile);
      return await persistRecord('foodMemories', { ...memory, ...uploadedPhoto });
    } catch (error) {
      if (uploadedPhoto?.imagePath) {
        await removeFoodPhoto(uploadedPhoto.imagePath).catch(() => {});
      }
      throw error;
    }
  };

  const handleLoginSuccess = async (profile) => {
    if (profile.isDemo) {
      if (profile.email !== 'ava@mindmesh.demo' || profile.password !== 'password123') {
        throw new Error('Use ava@mindmesh.demo / password123 for the explicit demo account.');
      }
      pendingAuthenticatedNavigation.current = true;
      setDemoSession({ name: 'Ava Lindqvist', email: 'ava@mindmesh.demo' });
      setUser(loadJson('mindmesh_demo_profile', initialUserProfile));
      setIsRealTimeMode(false);
      navigateAfterAuth();
      return;
    }
    if (!firebaseConfigured) {
      throw new Error('Firebase is not configured. Add the VITE_FIREBASE_* values in .env.local, or sign in with the explicit demo account.');
    }
    try {
      const { signIn } = await loadFirebase();
      await signIn(profile.email.trim(), profile.password, profile.rememberMe);
      pendingAuthenticatedNavigation.current = true;
      navigateAfterAuth();
    } catch (error) {
      throw new Error(firebaseErrorMessage(error));
    }
  };

  const handleRegisterSuccess = async (profile) => {
    if (!firebaseConfigured) {
      throw new Error('Firebase is not configured. Add the VITE_FIREBASE_* values in .env.local before creating an account.');
    }
    registrationInProgress.current = true;
    try {
      const { register } = await loadFirebase();
      const credential = await register(profile.email.trim(), profile.password, profile.name, profile.useCase);
      setFirebaseUser(credential.user);
      setIsRealTimeMode(true);
      pendingAuthenticatedNavigation.current = true;
      navigateAfterAuth();
    } catch (error) {
      setFirebaseUser(null);
      throw new Error(firebaseErrorMessage(error));
    } finally {
      registrationInProgress.current = false;
    }
  };

  const handleResetPassword = async (email) => {
    if (!firebaseConfigured) throw new Error('Firebase is not configured. Set up `.env.local` before requesting a reset.');
    try {
      const { resetPassword } = await loadFirebase();
      await resetPassword(email);
    } catch (error) {
      throw new Error(firebaseErrorMessage(error));
    }
  };

  const handleProfileSave = async (name) => {
    if (!name.trim()) throw new Error('Display name is required.');
    if (firebaseUser) {
      try {
        const { updateUserProfile } = await loadFirebase();
        await updateUserProfile(name);
      } catch (error) {
        throw new Error(firebaseErrorMessage(error));
      }
    } else if (demoSession) {
      saveJson('mindmesh_demo_profile', { ...user, name: name.trim() });
    }
    setUser((previous) => ({ ...previous, name: name.trim() }));
  };

  const handleToggleRealTimeMode = () => {
    const nextMode = !isRealTimeMode;
    if (nextMode && !firebaseUser) {
      showToast(firebaseConfigured
        ? 'Sign in with your Firebase account to access live mode.'
        : 'Live mode requires Firebase configuration. Demo records remain separate.');
      return;
    }
    setIsRealTimeMode(nextMode);
    showToast(nextMode ? 'Viewing your Firebase-synced records.' : 'Viewing the separate demo preset.');
  };

  const handleLogout = async () => {
    try {
      if (firebaseUser) {
        const { logout } = await loadFirebase();
        await logout();
      }
      setDemoSession(null);
      navigateToView('signin', { replace: true });
      showToast('Signed out from MindMesh.');
    } catch (error) {
      showToast(firebaseErrorMessage(error));
    }
  };

  const handleAddFlashcard = async (card) => {
    if (isRealTimeMode) await persistRecord('flashcards', card);
    else setFlashcards((prev) => [card, ...prev]);
    showToast(isRealTimeMode ? 'Flashcard saved to Firestore.' : 'Flashcard added to the demo deck.');
    return card;
  };

  const handleReviewFlashcard = async (reviewedCard) => {
    if (isRealTimeMode) await persistRecord('flashcards', reviewedCard);
    else setFlashcards((prev) => prev.map((c) => (c.id === reviewedCard.id ? reviewedCard : c)));
    return reviewedCard;
  };

  const handleAddCanvasItem = async (item) => {
    if (isRealTimeMode) await persistRecord('canvasItems', item);
    else setCanvasItems((prev) => [...prev, item]);
    return item;
  };

  const handleUpdateCanvasItem = async (item) => {
    if (isRealTimeMode) await persistRecord('canvasItems', item);
    else setCanvasItems((prev) => prev.map((current) => (current.id === item.id ? item : current)));
    return item;
  };

  const handleDeleteCanvasItem = async (id) => {
    if (isRealTimeMode) await removeRecord(id);
    else setCanvasItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleAddWorkflow = async (wf) => {
    if (isRealTimeMode) await persistRecord('workflows', wf);
    else setWorkflows((prev) => [wf, ...prev]);
    showToast(isRealTimeMode ? 'Workflow definition saved. No automation service is connected.' : 'Workflow added to demo dataset (not executed).');
    return wf;
  };

  const handleToggleWorkflow = async (id) => {
    const current = isRealTimeMode ? liveOfType('workflows') : workflows;
    const updated = current.find((workflow) => workflow.id === id);
    if (!updated) throw new Error('This workflow definition is no longer available.');
    const next = { ...updated, active: !updated.active };
    if (isRealTimeMode) await persistRecord('workflows', next);
    else setWorkflows((prev) => prev.map((workflow) => workflow.id === id ? next : workflow));
    return next;
  };

  const handleDeleteWorkflow = async (id) => {
    if (isRealTimeMode) await removeRecord(id);
    else setWorkflows((prev) => prev.filter((w) => w.id !== id));
    showToast('Workflow definition deleted.');
  };

  const handleAddWebhook = async (wh) => {
    if (isRealTimeMode) await persistRecord('webhooks', wh);
    else setWebhooks((prev) => [wh, ...prev]);
    showToast(isRealTimeMode ? 'Webhook definition saved only; no endpoint is registered or invoked.' : 'Webhook definition added to demo data; no requests were sent.');
    return wh;
  };

  const handleDeleteWebhook = async (id) => {
    if (isRealTimeMode) await removeRecord(id);
    else setWebhooks((prev) => prev.filter((w) => w.id !== id));
    showToast('Webhook definition removed.');
  };

  // Active datasets determined strictly by mode
  const activeNotes = isRealTimeMode ? liveOfType('notes') : notes;
  const activeDocs = isRealTimeMode ? liveOfType('documents') : documents;
  const activeMeetings = isRealTimeMode ? liveOfType('meetings') : meetings;
  const activeVoiceNotes = isRealTimeMode ? liveOfType('voiceNotes') : voiceNotes;
  const activeGeoMemories = isRealTimeMode ? liveOfType('geoMemories') : geoMemories;
  const activeFlashcards = isRealTimeMode ? liveOfType('flashcards') : flashcards;
  const activeCanvasItems = isRealTimeMode ? liveOfType('canvasItems') : canvasItems;
  const activeWorkflows = isRealTimeMode ? liveOfType('workflows') : workflows;
  const activeWebhooks = isRealTimeMode ? liveOfType('webhooks') : webhooks;
  const activeContacts = isRealTimeMode ? liveOfType('contacts') : contacts;
  const activeCollections = isRealTimeMode ? liveOfType('collections') : collections;
  const activeFoodMemories = isRealTimeMode ? liveOfType('foodMemories') : [];
  const activeScreenshots = isRealTimeMode ? liveOfType('screenshots') : screenshots;
  const activeTimelineEvents = isRealTimeMode
    ? liveRecords.map((record) => ({
      id: record.id,
      title: record.title || record.name || record.question || 'Saved record',
      category: record.recordType.toUpperCase(),
      time: 'Saved',
      dateGroup: 'Your records',
    }))
    : timelineEvents;
  const liveGraph = buildGraphFromRecords(activeNotes, activeMeetings, activeContacts);
  const activeGraphNodes = isRealTimeMode ? liveGraph.nodes : graphNodes;
  const activeGraphEdges = isRealTimeMode ? liveGraph.edges : graphEdges;
  const activeUser = {
    ...user,
    records: isRealTimeMode ? liveRecords : user.records || [],
    memoryNodesCount: activeNotes.length + activeDocs.length + activeGeoMemories.length + activeVoiceNotes.length + activeMeetings.length + activeFlashcards.length,
    notesCount: activeNotes.length,
    meetingsCount: activeMeetings.length,
    vectorsCount: '—',
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-[#070913] text-slate-100' : 'bg-slate-50 text-slate-900 theme-light'} antialiased font-sans transition-colors`}>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold shadow-[0_0_25px_rgba(99,102,241,0.6)] animate-in fade-in slide-in-from-bottom-2 duration-200">
          {toastMessage}
        </div>
      )}

      {/* Command Palette (Cmd+K) */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onNavigate={navigateToView}
        darkMode={darkMode}
      />

      {/* Quick Capture Modal */}
      <QuickCaptureModal
        isOpen={quickCaptureOpen}
        onClose={() => setQuickCaptureOpen(false)}
        onSaveCapture={handleSaveCaptureModal}
        darkMode={darkMode}
      />

      <PageErrorBoundary key={currentView}>
        <Suspense fallback={
          <div className="flex min-h-[50vh] items-center justify-center px-4 text-sm text-slate-400" role="status">
            Loading MindMesh…
          </div>
        }>
      {/* Render Public Pages */}
      {currentView === 'home' && (
        <LandingPage
          onNavigate={navigateToView}
          darkMode={darkMode}
          onToggleTheme={handleToggleTheme}
        />
      )}

      {currentView === 'features' && (
        <FeaturesPage
          onNavigate={navigateToView}
          darkMode={darkMode}
        />
      )}

      {currentView === 'pricing' && (
        <PricingPage
          onNavigate={navigateToView}
          darkMode={darkMode}
        />
      )}

      {currentView === 'security' && (
        <SecurityPage
          onNavigate={navigateToView}
          darkMode={darkMode}
        />
      )}

      {currentView === 'use-cases' && (
        <UseCasesPage
          onNavigate={navigateToView}
          darkMode={darkMode}
        />
      )}

      {currentView === 'signin' && (
        <SignInPage
          onNavigate={navigateToView}
          onLoginSuccess={handleLoginSuccess}
          onResetPassword={handleResetPassword}
          firebaseConfigured={firebaseConfigured}
        />
      )}

      {currentView === 'register' && (
        <RegisterPage
          onNavigate={navigateToView}
          onRegisterSuccess={handleRegisterSuccess}
          firebaseConfigured={firebaseConfigured}
        />
      )}

      {currentView === 'not-found' && (
        <NotFoundPage
          onNavigate={navigateToView}
          darkMode={darkMode}
        />
      )}

      {/* Render Authenticated Workspace Views */}
      {!isPublicView && authLoading && (
        <div className="min-h-screen flex items-center justify-center bg-[#070913] text-slate-300 text-sm">
          Checking your secure session…
        </div>
      )}

      {!isPublicView && isAuthenticated && (
        <div className="flex min-h-screen">
          <Sidebar
            currentView={currentView === 'note-detail' || currentView === 'note-edit' ? 'notes' : currentView}
            onNavigate={navigateToView}
            mobileOpen={mobileNavOpen}
            onCloseMobile={() => setMobileNavOpen(false)}
            onLogout={handleLogout}
            darkMode={darkMode}
          />

          <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
            <Header
              user={activeUser}
              darkMode={darkMode}
              isRealTimeMode={isRealTimeMode}
              onToggleRealTimeMode={handleToggleRealTimeMode}
              onToggleTheme={handleToggleTheme}
              onOpenCapture={() => setQuickCaptureOpen(true)}
              onOpenCommand={() => setCommandPaletteOpen(true)}
              onOpenMobileNav={() => setMobileNavOpen(true)}
              onOpenProfile={() => navigateToView('settings')}
              onLogout={handleLogout}
              syncState={isRealTimeMode ? syncState : 'demo'}
              isOnline={isOnline}
              syncError={syncError}
            />

            <main className={`workspace-canvas flex-1 overflow-y-auto ${darkMode ? 'workspace-canvas-dark' : ''}`}>
              {isRealTimeMode && (syncState === 'error' || syncState === 'cached' || syncState === 'loading' || syncState === 'saving') && (
                <div className={`mx-4 mt-4 lg:mx-8 p-3 rounded-lg border text-xs ${
                  syncState === 'error'
                    ? 'bg-rose-950/40 border-rose-800 text-rose-200'
                    : 'bg-amber-950/40 border-amber-800 text-amber-100'
                }`} role="status">
                  {syncState === 'error' && `Firestore sync error: ${syncError}`}
                  {syncState === 'cached' && 'Showing a local Firestore snapshot while checking the network. Changes may not be current.'}
                  {syncState === 'loading' && 'Connecting to your private Firestore records…'}
                  {syncState === 'saving' && 'Saving changes to Firestore…'}
                </div>
              )}
              <div key={currentView} className="mesh-enter">
              {currentView === 'dashboard' && (
                <DashboardPage
                  user={activeUser}
                  onNavigate={navigateToView}
                  onQuickSave={handleQuickSave}
                  darkMode={darkMode}
                  isRealTimeMode={isRealTimeMode}
                  notes={activeNotes}
                />
              )}

              {currentView === 'assistant' && (
                <AssistantPage
                  notes={activeNotes}
                  meetings={activeMeetings}
                  onNavigate={navigateToView}
                  darkMode={darkMode}
                />
              )}

              {currentView === 'graph' && (
                <KnowledgeGraphPage
                  nodes={activeGraphNodes}
                  edges={activeGraphEdges}
                  onNavigate={navigateToView}
                  darkMode={darkMode}
                />
              )}

              {currentView === 'search' && (
                <HybridSearchPage
                  onNavigate={navigateToView}
                  records={isRealTimeMode
                    ? liveRecords
                    : [
                      ...notes.map((record) => ({ ...record, recordType: 'notes' })),
                      ...documents.map((record) => ({ ...record, recordType: 'documents' })),
                      ...meetings.map((record) => ({ ...record, recordType: 'meetings' })),
                      ...voiceNotes.map((record) => ({ ...record, recordType: 'voiceNotes' })),
                    ]}
                  darkMode={darkMode}
                />
              )}

              {currentView === 'notes' && (
                <NotesPage
                  notes={activeNotes}
                  onCreateNote={handleCreateNote}
                  isRealTimeMode={isRealTimeMode}
                  darkMode={darkMode}
                  onOpenNote={(note) => navigateToNote(note.id)}
                />
              )}

              {currentView === 'note-detail' && (
                <NoteDetailPage
                  note={activeNotes.find((note) => note.id === noteIdFromPathname(window.location.pathname))}
                  onBack={() => navigateToView('notes')}
                  onEdit={() => navigateToNote(noteIdFromPathname(window.location.pathname), { edit: true })}
                  darkMode={darkMode}
                />
              )}

              {currentView === 'note-edit' && (
                <NoteEditorPage
                  note={
                    activeNotes.find((item) => item.id === noteIdFromPathname(window.location.pathname)) ||
                    (window.history.state?.initialNote?.id === noteIdFromPathname(window.location.pathname)
                      ? window.history.state.initialNote
                      : null)
                  }
                  onSaveNote={handleSaveNote}
                  onDeleteNote={handleDeleteNote}
                  onBackToDetail={() => navigateToNote(noteIdFromPathname(window.location.pathname), { replace: true })}
                  onBackToNotes={() => navigateToView('notes')}
                  onDeleted={() => navigateToView('notes', { replace: true })}
                  isRealTimeMode={isRealTimeMode}
                  darkMode={darkMode}
                />
              )}

              {currentView === 'documents' && (
                <DocumentsPage
                  documents={activeDocs}
                  onAddDocument={handleAddDocument}
                  darkMode={darkMode}
                />
              )}

              {currentView === 'meetings' && (
                <MeetingsPage
                  meetings={activeMeetings}
                  onAddMeeting={handleAddMeeting}
                  isRealTimeMode={isRealTimeMode}
                  userName={firebaseUser?.displayName || user?.name || ''}
                  darkMode={darkMode}
                />
              )}

              {currentView === 'voice' && (
                <VoiceMemoryPage
                  voiceNotes={activeVoiceNotes}
                  onAddVoiceNote={handleAddVoiceNote}
                  isRealTimeMode={isRealTimeMode}
                  darkMode={darkMode}
                />
              )}

              {currentView === 'screenshots' && (
                <ScreenshotSearchPage
                  screenshots={activeScreenshots}
                  darkMode={darkMode}
                />
              )}

              {currentView === 'timeline' && (
                <TimelinePage
                  events={activeTimelineEvents}
                  onNavigate={navigateToView}
                  darkMode={darkMode}
                />
              )}

              {currentView === 'insights' && (
                <InsightsPage
                  onNavigate={navigateToView}
                  darkMode={darkMode}
                />
              )}

              {currentView === 'collections' && (
                <CollectionsPage
                  collections={activeCollections}
                  onAddCollection={handleAddCollection}
                  onNavigate={navigateToView}
                  darkMode={darkMode}
                />
              )}

              {currentView === 'food' && (
                <FoodMemoriesPage
                  memories={activeFoodMemories}
                  onAddMemory={handleAddFoodMemory}
                  isRealTimeMode={isRealTimeMode && Boolean(firebaseUser)}
                  darkMode={darkMode}
                />
              )}

              {currentView === 'contacts' && (
                <ContactsPage
                  contacts={activeContacts}
                  onNavigate={navigateToView}
                  onAddContact={handleAddContact}
                  darkMode={darkMode}
                />
              )}

              {currentView === 'map' && (
                <MemoryMapPage
                  geoMemories={activeGeoMemories}
                  onAddGeoMemory={handleAddGeoMemory}
                  onNavigate={navigateToView}
                  isRealTimeMode={isRealTimeMode}
                  darkMode={darkMode}
                />
              )}

              {currentView === 'cloudsql' && (
                <CloudSqlPage
                  onNavigate={navigateToView}
                  darkMode={darkMode}
                />
              )}

              {currentView === 'flashcards' && (
                <FlashcardsPage
                  flashcards={activeFlashcards}
                  onAddCard={handleAddFlashcard}
                  onReviewCard={handleReviewFlashcard}
                  darkMode={darkMode}
                />
              )}

              {currentView === 'canvas' && (
                <CanvasBoardPage
                  items={activeCanvasItems}
                  onAddItem={handleAddCanvasItem}
                  onUpdateItem={handleUpdateCanvasItem}
                  onDeleteItem={handleDeleteCanvasItem}
                  darkMode={darkMode}
                />
              )}

              {currentView === 'workflows' && (
                <WorkflowsPage
                  workflows={activeWorkflows}
                  onAddWorkflow={handleAddWorkflow}
                  onToggleWorkflow={handleToggleWorkflow}
                  onDeleteWorkflow={handleDeleteWorkflow}
                  darkMode={darkMode}
                />
              )}

              {currentView === 'webhooks' && (
                <WebhooksPage
                  webhooks={activeWebhooks}
                  onAddWebhook={handleAddWebhook}
                  onDeleteWebhook={handleDeleteWebhook}
                  darkMode={darkMode}
                />
              )}

              {currentView === 'firebase' && (
                <FirebaseSyncPage
                  darkMode={darkMode}
                  firebaseConfigured={firebaseConfigured}
                  syncState={syncState}
                  syncError={syncError}
                  recordCount={liveRecords.length}
                />
              )}

              {currentView === 'settings' && (
                <SettingsPage
                  user={user}
                  records={isRealTimeMode ? liveRecords : []}
                  isRealTimeMode={isRealTimeMode}
                  onImportRecords={persistRecords}
                  onSaveProfile={handleProfileSave}
                  darkMode={darkMode}
                  onToggleTheme={handleToggleTheme}
                />
              )}

              {currentView === 'billing' && (
                <BillingPage
                  onNavigate={navigateToView}
                  darkMode={darkMode}
                />
              )}

              {currentView.startsWith('admin') && (
                <AdminPage
                  onNavigate={navigateToView}
                  darkMode={darkMode}
                />
              )}
              </div>
            </main>
          </div>
        </div>
      )}
        </Suspense>
      </PageErrorBoundary>
    </div>
  );
}
