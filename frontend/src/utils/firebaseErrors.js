export const firebaseErrorMessage = (error) => {
  const messages = {
    'auth/invalid-credential': 'Email or password is incorrect.',
    'auth/user-not-found': 'No account exists for this email.',
    'auth/email-already-in-use': 'An account already exists for this email.',
    'auth/weak-password': 'Use a stronger password with at least 8 characters.',
    'auth/network-request-failed': 'Could not reach Firebase. Check your connection and try again.',
    'auth/too-many-requests': 'Too many attempts. Wait a few minutes and try again.',
    'permission-denied': 'Firestore denied this operation. Verify that firestore.rules are deployed.',
  };
  return messages[error?.code] || error?.message || 'Firebase could not complete the request.';
};
