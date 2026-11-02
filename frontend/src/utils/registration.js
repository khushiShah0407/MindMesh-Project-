export async function completeRegistration({
  createAccount,
  updateProfile,
  saveProfile,
  signOut,
}) {
  const credential = await createAccount();

  try {
    await updateProfile(credential.user);
    await saveProfile(credential.user);
    return credential;
  } catch (setupError) {
    try {
      await signOut();
    } catch (cleanupError) {
      const error = new Error(
        'Your account was created, but workspace setup did not finish and automatic sign-out failed. Reload the page before continuing.',
        { cause: setupError },
      );
      error.code = 'registration/setup-failed';
      error.cleanupError = cleanupError;
      throw error;
    }

    const error = new Error(
      'Your account was created, but workspace setup did not finish. Sign in again to continue.',
      { cause: setupError },
    );
    error.code = 'registration/setup-failed';
    throw error;
  }
}
