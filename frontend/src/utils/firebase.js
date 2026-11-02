import { initializeApp } from 'firebase/app';
import config, { firebaseConfigured } from './firebaseConfig.js';
import { firebaseErrorMessage } from './firebaseErrors.js';
import {
  browserLocalPersistence,
  browserSessionPersistence,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import {
  collection,
  deleteDoc,
  doc,
  getFirestore,
  onSnapshot,
  serverTimestamp,
  setDoc,
  writeBatch,
} from 'firebase/firestore';
import {
  deleteObject,
  getBlob,
  getStorage,
  ref,
  uploadBytes,
} from 'firebase/storage';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { completeRegistration } from './registration.js';

const app = firebaseConfigured ? initializeApp(config) : null;
export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;
export const storage = app ? getStorage(app) : null;
const functions = app ? getFunctions(app) : null;

export const observeAuth = (callback) => (auth
  ? onAuthStateChanged(auth, callback)
  : () => {});

export const signIn = async (email, password, rememberMe = true) => {
  if (!auth) throw new Error('Firebase is not configured. Add the VITE_FIREBASE_* values to .env.local.');
  await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
  return signInWithEmailAndPassword(auth, email, password);
};

export const register = async (email, password, name, useCase) => {
  if (!auth || !db) throw new Error('Firebase is not configured. Add the VITE_FIREBASE_* values to .env.local.');
  return completeRegistration({
    createAccount: () => createUserWithEmailAndPassword(auth, email, password),
    updateProfile: (user) => updateProfile(user, { displayName: name }),
    saveProfile: (user) => setDoc(doc(db, 'users', user.uid), {
      name,
      email,
      useCase,
      createdAt: serverTimestamp(),
    }),
    signOut: () => signOut(auth),
  });
};

export const resetPassword = (email) => {
  if (!auth) throw new Error('Firebase is not configured. Add the VITE_FIREBASE_* values to .env.local.');
  return sendPasswordResetEmail(auth, email);
};

export const logout = () => (auth ? signOut(auth) : Promise.resolve());

const callMeetingFunction = async (name, data) => {
  if (!functions || !auth?.currentUser) {
    throw new Error('Sign in with a configured Firebase project to use live meeting services.');
  }
  const callable = httpsCallable(functions, name);
  const result = await callable(data);
  return result.data;
};

export const getZoomMeetingToken = (data) => callMeetingFunction('getZoomMeetingToken', data);
export const createZoomMeetingInvite = (data) => callMeetingFunction('createZoomMeetingInvite', data);
export const translateMeetingCaption = (data) => callMeetingFunction('translateMeetingCaption', data);

export const updateUserProfile = async (name) => {
  if (!auth?.currentUser) throw new Error('You must be signed in to update your profile.');
  await updateProfile(auth.currentUser, { displayName: name });
  if (db) {
    await setDoc(doc(db, 'users', auth.currentUser.uid), {
      name,
      email: auth.currentUser.email || '',
      updatedAt: serverTimestamp(),
    }, { merge: true });
  }
};

export const watchUserRecords = (uid, onRecords, onError) => {
  if (!db) {
    onError(new Error('Firebase Firestore is not configured.'));
    return () => {};
  }
  return onSnapshot(
    collection(db, 'users', uid, 'records'),
    (snapshot) => onRecords(snapshot.docs.map((record) => ({
      id: record.id,
      ...record.data().payload,
      recordType: record.data().type,
    })), snapshot.metadata),
    onError,
  );
};

export const saveUserRecord = (uid, type, record) => {
  if (!db) throw new Error('Firebase Firestore is not configured.');
  return setDoc(doc(db, 'users', uid, 'records', String(record.id)), {
    type,
    payload: record,
    updatedAt: serverTimestamp(),
  });
};

export const saveUserRecords = async (uid, records) => {
  if (!db) throw new Error('Firebase Firestore is not configured.');
  if (!Array.isArray(records) || records.length > 500) {
    throw new Error('A restore may contain no more than 500 records.');
  }
  if (records.length === 0) return records;
  const validTypes = new Set(['notes', 'documents', 'meetings', 'voiceNotes', 'geoMemories', 'contacts', 'flashcards', 'canvasItems', 'workflows', 'webhooks', 'screenshots', 'collections', 'foodMemories']);
  const batch = writeBatch(db);
  const ids = new Set();
  for (const record of records) {
    if (!record || typeof record.id !== 'string' || !record.id.trim() || record.id.includes('/') || record.id.length > 128 || !validTypes.has(record.recordType)) {
      throw new Error('A restored record has an invalid ID or type.');
    }
    if (ids.has(record.id)) throw new Error(`The restore contains duplicate record ID "${record.id}".`);
    ids.add(record.id);
    batch.set(doc(db, 'users', uid, 'records', record.id), {
      type: record.recordType,
      payload: record,
      updatedAt: serverTimestamp(),
    });
  }
  await batch.commit();
  return records;
};

export const removeUserRecord = (uid, id) => {
  if (!db) throw new Error('Firebase Firestore is not configured.');
  return deleteDoc(doc(db, 'users', uid, 'records', String(id)));
};

export const uploadFoodPhoto = async (uid, memoryId, file) => {
  if (!storage) throw new Error('Firebase Storage is not configured.');
  const extension = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg';
  const imagePath = `users/${uid}/food-memories/${memoryId}/photo.${extension}`;
  const imageRef = ref(storage, imagePath);
  await uploadBytes(imageRef, file, { contentType: file.type });
  return { imagePath };
};

export const loadFoodPhoto = async (imagePath) => {
  if (!storage) throw new Error('Firebase Storage is not configured.');
  return getBlob(ref(storage, imagePath), 5 * 1024 * 1024);
};

export const removeFoodPhoto = (imagePath) => {
  if (!storage || !imagePath) return Promise.resolve();
  return deleteObject(ref(storage, imagePath));
};

export const uploadVoiceAudio = async (uid, recordId, blob) => {
  if (!storage) throw new Error('Firebase Storage is not configured.');
  if (blob.type !== 'audio/webm') throw new Error('This browser produced an unsupported audio format.');
  const audioPath = `users/${uid}/voice-notes/${recordId}/audio.webm`;
  await uploadBytes(ref(storage, audioPath), blob, { contentType: blob.type });
  return { audioPath };
};

export const loadVoiceAudio = async (audioPath) => {
  if (!storage) throw new Error('Firebase Storage is not configured.');
  return getBlob(ref(storage, audioPath), 20 * 1024 * 1024);
};

export const removeVoiceAudio = (audioPath) => {
  if (!storage || !audioPath) return Promise.resolve();
  return deleteObject(ref(storage, audioPath));
};

export { firebaseErrorMessage };
