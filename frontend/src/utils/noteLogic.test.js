import test from 'node:test';
import assert from 'node:assert/strict';
import { addNoteTag, filterNotes, getRediscoveryNote, setNotePinned } from './noteLogic.js';

const notes = [
  { id: 'one', title: 'Project plan', content: 'Roadmap', tags: ['work'], pinned: true },
  { id: 'two', title: 'Reading list', content: 'Books', tags: ['personal'] },
  { id: 'three', title: 'Meeting notes', content: 'Project discussion', tags: ['work'], pinned: true },
];

test('sets and clears the persisted pin property without changing other note data', () => {
  const pinned = setNotePinned(notes[1], true);
  assert.deepEqual(pinned, { ...notes[1], pinned: true });
  assert.deepEqual(setNotePinned(pinned, false), { ...notes[1], pinned: false });
  assert.equal(notes[1].pinned, undefined);
});

test('shows pinned notes first and preserves order within each group', () => {
  const mixedNotes = [notes[1], notes[2], notes[0]];
  assert.deepEqual(filterNotes(mixedNotes), [notes[2], notes[0], notes[1]]);
  assert.deepEqual(filterNotes(notes, '', true), [notes[0], notes[2]]);
});

test('combines pinned filtering with case-insensitive title, content, and tag search', () => {
  assert.deepEqual(filterNotes(notes, 'PROJECT', true), [notes[0], notes[2]]);
  assert.deepEqual(filterNotes(notes, 'personal', false), [notes[1]]);
  assert.deepEqual(filterNotes(notes, 'books', true), []);
});

test('adds custom tags, trims hash prefixes, and preserves existing tags', () => {
  assert.deepEqual(addNoteTag(notes[0], '  ## ideas  '), {
    ...notes[0],
    tags: ['work', 'ideas'],
  });
  assert.equal(addNoteTag(notes[0], ' WORK '), null);
  assert.equal(addNoteTag(notes[0], '  '), null);
});

test('resurfaces the oldest dated non-empty note and calculates its age', () => {
  const now = Date.parse('2026-11-02T00:00:00.000Z');
  const candidates = [
    { id: 'newer', title: 'Recent', updatedAt: '2026-10-31T00:00:00.000Z' },
    { id: 'older', title: 'Rediscover this', updatedAt: '2026-10-28T00:00:00.000Z' },
    { id: 'empty', title: '', content: '', updatedAt: '2026-10-01T00:00:00.000Z' },
    { id: 'undated', title: 'No date' },
  ];

  assert.deepEqual(getRediscoveryNote(candidates, now), {
    note: candidates[1],
    daysSinceUpdate: 5,
  });
});

test('returns no rediscovery suggestion when there are no dated notes', () => {
  assert.equal(getRediscoveryNote([{ id: 'empty', content: '' }]), null);
  assert.equal(getRediscoveryNote(null), null);
});
