import test from 'node:test';
import assert from 'node:assert/strict';
import {
  noteIdFromPathname,
  returnViewAfterAuth,
  urlForNote,
  urlForNoteEdit,
  urlForView,
  viewFromPathname,
} from './navigation.js';

test('resolves the landing page and valid public and workspace routes', () => {
  assert.equal(viewFromPathname('/'), 'home');
  assert.equal(viewFromPathname('/features'), 'features');
  assert.equal(viewFromPathname('/use-cases/'), 'use-cases');
  assert.equal(viewFromPathname('/notes'), 'notes');
  assert.equal(viewFromPathname('/notes/note-123'), 'note-detail');
  assert.equal(viewFromPathname('/notes/note-123/edit'), 'note-edit');
  assert.equal(viewFromPathname('/notes/note-123/edit/'), 'note-edit');
  assert.equal(viewFromPathname('/admin'), 'admin');
});

test('maps unknown and malformed paths to the existing not-found view', () => {
  assert.equal(viewFromPathname('/unknown'), 'not-found');
  assert.equal(viewFromPathname('/notes/extra'), 'note-detail');
  assert.equal(viewFromPathname('/notes/extra/deeper'), 'not-found');
  assert.equal(viewFromPathname('/notes/id/edit/extra'), 'not-found');
  assert.equal(viewFromPathname('/notes//id'), 'not-found');
  assert.equal(viewFromPathname('/notes/a%2Fb'), 'not-found');
  assert.equal(viewFromPathname('/notes/a%2Fb/edit'), 'not-found');
  assert.equal(viewFromPathname('/%E0%A4%A'), 'not-found');
});

test('resolves safe note IDs and creates detail and editor URLs', () => {
  assert.equal(noteIdFromPathname('/notes/note-123'), 'note-123');
  assert.equal(noteIdFromPathname('/notes/note-123/edit'), 'note-123');
  assert.equal(noteIdFromPathname('/notes/a%2Fb'), null);
  assert.equal(noteIdFromPathname('/notes//id/edit'), null);
  const url = urlForNote('note with spaces', 'https://mindmesh.example/dashboard?source=home');
  assert.equal(url.pathname, '/notes/note%20with%20spaces');
  assert.equal(url.search, '?source=home');
  assert.equal(
    urlForNoteEdit('note with spaces', 'https://mindmesh.example/notes').pathname,
    '/notes/note%20with%20spaces/edit',
  );
  assert.equal(urlForNote('invalid/id', 'https://mindmesh.example/').pathname, '/not-found');
  assert.equal(urlForNoteEdit('invalid/id', 'https://mindmesh.example/').pathname, '/not-found');
});

test('changes the route path while retaining query parameters and hash fragments', () => {
  const url = urlForView('notes', 'https://mindmesh.example/search?filter=recent#result-2');
  assert.equal(url.pathname, '/notes');
  assert.equal(url.search, '?filter=recent');
  assert.equal(url.hash, '#result-2');
});

test('normalizes invalid internal destinations to the existing not-found route', () => {
  assert.equal(urlForView('admin-tools', 'https://mindmesh.example/').pathname, '/not-found');
  assert.equal(urlForView('home', 'https://mindmesh.example/notes').pathname, '/');
});

test('returns authenticated users to a valid requested workspace view', () => {
  assert.equal(returnViewAfterAuth({ returnTo: 'notes' }), 'notes');
  assert.equal(returnViewAfterAuth({ returnTo: 'dashboard' }), 'dashboard');
  assert.equal(returnViewAfterAuth({ returnTo: '/dashboard' }), 'dashboard');
  assert.equal(returnViewAfterAuth({ returnTo: 'https://example.com' }), 'dashboard');
  assert.equal(returnViewAfterAuth(null), 'dashboard');
});
