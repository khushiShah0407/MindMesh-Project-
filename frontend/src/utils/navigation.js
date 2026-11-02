export const PUBLIC_VIEWS = [
  'home',
  'features',
  'pricing',
  'security',
  'use-cases',
  'signin',
  'register',
  'not-found',
];

export const WORKSPACE_VIEWS = [
  'dashboard',
  'assistant',
  'graph',
  'search',
  'notes',
  'documents',
  'meetings',
  'voice',
  'screenshots',
  'timeline',
  'insights',
  'collections',
  'food',
  'contacts',
  'map',
  'cloudsql',
  'flashcards',
  'canvas',
  'workflows',
  'webhooks',
  'firebase',
  'settings',
  'billing',
  'admin',
];

export const returnViewAfterAuth = (historyState) => (
  WORKSPACE_VIEWS.includes(historyState?.returnTo) ? historyState.returnTo : 'dashboard'
);

const VALID_VIEWS = new Set([...PUBLIC_VIEWS, ...WORKSPACE_VIEWS]);

export const viewFromPathname = (pathname) => {
  const rawSegments = pathname.split('/');
  if (rawSegments[0] === '') rawSegments.shift();
  if (rawSegments.at(-1) === '') rawSegments.pop();
  if (rawSegments.some((segment) => !segment)) return 'not-found';
  const segments = rawSegments;
  if (segments.length === 0) return 'home';
  if (segments[0] === 'notes' && (segments.length === 2 || (segments.length === 3 && segments[2] === 'edit'))) {
    try {
      const noteId = decodeURIComponent(segments[1]);
      if (!noteId || noteId.includes('/') || noteId.length > 128) return 'not-found';
      return segments.length === 3 ? 'note-edit' : 'note-detail';
    } catch {
      return 'not-found';
    }
  }
  if (segments.length !== 1) return 'not-found';

  let view;
  try {
    view = decodeURIComponent(segments[0]);
  } catch {
    return 'not-found';
  }
  return VALID_VIEWS.has(view) ? view : 'not-found';
};

export const noteIdFromPathname = (pathname) => {
  const rawSegments = pathname.split('/');
  if (rawSegments[0] === '') rawSegments.shift();
  if (rawSegments.at(-1) === '') rawSegments.pop();
  const segments = rawSegments;
  if (
    segments.some((segment) => !segment) ||
    segments[0] !== 'notes' ||
    !(segments.length === 2 || (segments.length === 3 && segments[2] === 'edit'))
  ) return null;
  try {
    const noteId = decodeURIComponent(segments[1]);
    return noteId && !noteId.includes('/') && noteId.length <= 128 ? noteId : null;
  } catch {
    return null;
  }
};

export const urlForNote = (noteId, currentUrl) => {
  const url = new URL(currentUrl);
  const safeId = typeof noteId === 'string' && noteId.trim() && !noteId.includes('/') && noteId.length <= 128
    ? noteId
    : '';
  url.pathname = safeId ? `/notes/${encodeURIComponent(safeId)}` : '/not-found';
  return url;
};

export const urlForNoteEdit = (noteId, currentUrl) => {
  const url = urlForNote(noteId, currentUrl);
  if (url.pathname !== '/not-found') url.pathname += '/edit';
  return url;
};

export const urlForView = (view, currentUrl) => {
  const url = new URL(currentUrl);
  const nextView = VALID_VIEWS.has(view) ? view : 'not-found';
  url.pathname = nextView === 'home' ? '/' : `/${nextView}`;
  return url;
};
