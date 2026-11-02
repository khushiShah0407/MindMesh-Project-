import test from 'node:test';
import assert from 'node:assert/strict';
import { completeRegistration } from './registration.js';

test('completes account setup before returning the credential', async () => {
  const calls = [];
  const credential = { user: { uid: 'user-1' } };
  const result = await completeRegistration({
    createAccount: async () => {
      calls.push('create');
      return credential;
    },
    updateProfile: async (user) => {
      calls.push(`profile:${user.uid}`);
    },
    saveProfile: async (user) => {
      calls.push(`save:${user.uid}`);
    },
    signOut: async () => calls.push('sign-out'),
  });

  assert.equal(result, credential);
  assert.deepEqual(calls, ['create', 'profile:user-1', 'save:user-1']);
});

test('signs out an auth account when workspace setup fails', async () => {
  const calls = [];
  const setupError = new Error('Firestore unavailable');
  await assert.rejects(completeRegistration({
    createAccount: async () => ({ user: { uid: 'user-1' } }),
    updateProfile: async () => calls.push('profile'),
    saveProfile: async () => {
      calls.push('save');
      throw setupError;
    },
    signOut: async () => calls.push('sign-out'),
  }), (error) => {
    assert.equal(error.code, 'registration/setup-failed');
    assert.equal(error.cause, setupError);
    assert.match(error.message, /account was created/i);
    return true;
  });

  assert.deepEqual(calls, ['profile', 'save', 'sign-out']);
});

test('preserves the setup failure and reports a failed cleanup', async () => {
  const setupError = new Error('Profile update failed');
  const cleanupError = new Error('Could not sign out');
  await assert.rejects(completeRegistration({
    createAccount: async () => ({ user: { uid: 'user-1' } }),
    updateProfile: async () => {
      throw setupError;
    },
    saveProfile: async () => assert.fail('Profile storage should not run'),
    signOut: async () => {
      throw cleanupError;
    },
  }), (error) => {
    assert.equal(error.code, 'registration/setup-failed');
    assert.equal(error.cause, setupError);
    assert.equal(error.cleanupError, cleanupError);
    assert.match(error.message, /automatic sign-out failed/i);
    return true;
  });
});

test('does not attempt cleanup when account creation itself fails', async () => {
  const createError = new Error('Account creation failed');
  let signedOut = false;
  await assert.rejects(completeRegistration({
    createAccount: async () => {
      throw createError;
    },
    updateProfile: async () => assert.fail('Profile update should not run'),
    saveProfile: async () => assert.fail('Profile storage should not run'),
    signOut: async () => {
      signedOut = true;
    },
  }), (error) => error === createError);

  assert.equal(signedOut, false);
});
