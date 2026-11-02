import test from 'node:test';
import assert from 'node:assert/strict';
import { loadJson, loadText, saveJson, saveText } from './localStore.js';

const withStorage = (storage, run) => {
  const previousStorage = globalThis.localStorage;
  const previousWarn = console.warn;
  globalThis.localStorage = storage;
  console.warn = () => {};
  try {
    run();
  } finally {
    if (previousStorage === undefined) delete globalThis.localStorage;
    else globalThis.localStorage = previousStorage;
    console.warn = previousWarn;
  }
};

test('loadJson returns parsed values and fallback for corrupt data', () => {
  const storage = new Map([['valid', '{"answer":42}'], ['broken', '{']]);
  withStorage({
    getItem: (key) => storage.get(key) ?? null,
    setItem: (key, value) => storage.set(key, value),
  }, () => {
    assert.deepEqual(loadJson('valid', {}), { answer: 42 });
    const fallback = [];
    assert.equal(loadJson('broken', fallback), fallback);
    assert.equal(loadJson('missing', fallback), fallback);
  });
});

test('local storage access failures return defaults without crashing', () => {
  withStorage({
    getItem() { throw new Error('storage disabled'); },
    setItem() { throw new Error('storage disabled'); },
  }, () => {
    assert.equal(loadJson('key', 'fallback'), 'fallback');
    assert.equal(loadText('key', 'fallback'), 'fallback');
    assert.doesNotThrow(() => saveJson('key', { value: 1 }));
    assert.doesNotThrow(() => saveText('key', 'value'));
  });
});

test('text storage preserves legacy unquoted values', () => {
  const storage = new Map();
  withStorage({
    getItem: (key) => storage.get(key) ?? null,
    setItem: (key, value) => storage.set(key, value),
  }, () => {
    saveText('mode', 'realtime');
    assert.equal(loadText('mode', 'demo'), 'realtime');
  });
});
