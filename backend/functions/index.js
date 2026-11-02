import { createHash, createHmac, randomBytes } from 'node:crypto';
import { initializeApp } from 'firebase-admin/app';
import { FieldValue, getFirestore } from 'firebase-admin/firestore';
import { defineSecret } from 'firebase-functions/params';
import { HttpsError, onCall } from 'firebase-functions/v2/https';

initializeApp();
const db = getFirestore();
const zoomSdkKey = defineSecret('ZOOM_VIDEO_SDK_KEY');
const zoomSdkSecret = defineSecret('ZOOM_VIDEO_SDK_SECRET');
const googleTranslateKey = defineSecret('GOOGLE_TRANSLATE_API_KEY');
const inviteTtlMs = 7 * 24 * 60 * 60 * 1000;

const requireAuth = (request) => {
  if (!request.auth?.uid || !request.auth.token.email) {
    throw new HttpsError('unauthenticated', 'Sign in with an email account to join this meeting.');
  }
  return request.auth;
};

const createZoomJwt = ({ roomId, roleType, uid, sdkKey, sdkSecret }) => {
  const now = Math.floor(Date.now() / 1000);
  const encode = (value) => Buffer.from(JSON.stringify(value)).toString('base64url');
  const header = encode({ alg: 'HS256', typ: 'JWT' });
  const payload = encode({
    app_key: sdkKey,
    tpc: roomId,
    role_type: roleType,
    user_identity: uid,
    iat: now - 30,
    exp: now + 60 * 60,
    token_exp: now + 60 * 60,
  });
  const input = `${header}.${payload}`;
  const signature = createHmac('sha256', sdkSecret).update(input).digest('base64url');
  return `${input}.${signature}`;
};

const meetingRefForOwner = async (uid, meetingId) => {
  if (typeof meetingId !== 'string' || !/^[A-Za-z0-9_-]{1,128}$/.test(meetingId)) {
    throw new HttpsError('invalid-argument', 'Meeting ID is invalid.');
  }
  const ref = db.doc(`users/${uid}/records/${meetingId}`);
  const snapshot = await ref.get();
  const payload = snapshot.data()?.payload;
  if (
    !snapshot.exists
    || snapshot.data()?.type !== 'meetings'
    || !payload?.roomId
    || payload.provider !== 'Zoom Video SDK'
  ) {
    throw new HttpsError('not-found', 'This meeting is unavailable or you do not have access.');
  }
  return { ref, payload };
};

const enforceRateLimit = async (uid, key, limit) => {
  const ref = db.doc(`meetingServiceLimits/${uid}_${key}`);
  const minute = Math.floor(Date.now() / 60_000);
  return db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(ref);
    const state = snapshot.data();
    const count = state?.minute === minute ? state.count || 0 : 0;
    if (count >= limit) return false;
    transaction.set(ref, { minute, count: count + 1 });
    return true;
  });
};

export const getZoomMeetingToken = onCall(
  { secrets: [zoomSdkKey, zoomSdkSecret] },
  async (request) => {
    const user = requireAuth(request);
    const meetingId = request.data?.meetingId;
    const invite = request.data?.invitation;
    let roomId;
    let meetingTitle;
    let roleType = 1;

    if (typeof invite === 'string') {
      const [inviteId, secret, ...extra] = invite.split('.');
      if (!inviteId || !secret || extra.length || !/^[A-Za-z0-9_-]{16,128}$/.test(secret)) {
        throw new HttpsError('invalid-argument', 'The meeting invitation is invalid.');
      }
      const inviteRef = db.doc(`meetingInvitations/${inviteId}`);
      const inviteSnapshot = await inviteRef.get();
      const data = inviteSnapshot.data();
      const suppliedHash = createHash('sha256').update(secret).digest('hex');
      if (
        !data
        || data.revokedAt
        || data.expiresAt?.toMillis?.() <= Date.now()
        || data.invitedEmail !== String(user.token.email).toLowerCase()
        || data.secretHash !== suppliedHash
      ) {
        throw new HttpsError('permission-denied', 'This invitation is expired, revoked, or belongs to another account.');
      }
      const ownerMeeting = await meetingRefForOwner(data.ownerUid, data.meetingId);
      roomId = ownerMeeting.payload.roomId;
      meetingTitle = data.meetingTitle;
      roleType = 0;
      await inviteRef.update({ lastJoinedAt: FieldValue.serverTimestamp() });
    } else {
      const meeting = await meetingRefForOwner(user.uid, meetingId);
      roomId = meeting.payload.roomId;
      meetingTitle = meeting.payload.title || 'MindMesh meeting';
    }

    const sdkKey = zoomSdkKey.value();
    const sdkSecret = zoomSdkSecret.value();
    if (!sdkKey || !sdkSecret) {
      throw new HttpsError('failed-precondition', 'Zoom is not configured. Set both Zoom Video SDK secrets in Firebase Secret Manager.');
    }
    return {
      sdkKey,
      token: createZoomJwt({
        roomId,
        roleType,
        uid: user.uid,
        sdkKey,
        sdkSecret,
      }),
      roomId,
      roleType,
      meetingTitle,
    };
  },
);

export const createZoomMeetingInvite = onCall(
  {},
  async (request) => {
    const user = requireAuth(request);
    const { ref, payload } = await meetingRefForOwner(user.uid, request.data?.meetingId);
    const email = String(request.data?.email || '').trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
      throw new HttpsError('invalid-argument', 'Enter a valid invitee email address.');
    }
    if (email === String(user.token.email).toLowerCase()) {
      throw new HttpsError('invalid-argument', 'Invite another participant, not your own account.');
    }
    if (!await enforceRateLimit(user.uid, 'invite', 10)) {
      throw new HttpsError('resource-exhausted', 'Too many invitations were created. Try again in a minute.');
    }
    const inviteId = randomBytes(18).toString('base64url');
    const secret = randomBytes(32).toString('base64url');
    await db.doc(`meetingInvitations/${inviteId}`).create({
      ownerUid: user.uid,
      meetingId: ref.id,
      meetingTitle: String(payload.title || 'MindMesh meeting').slice(0, 120),
      invitedEmail: email,
      secretHash: createHash('sha256').update(secret).digest('hex'),
      createdAt: FieldValue.serverTimestamp(),
      expiresAt: new Date(Date.now() + inviteTtlMs),
      revokedAt: null,
    });
    return { invitation: `${inviteId}.${secret}`, meetingTitle: payload.title || 'MindMesh meeting' };
  },
);

export const translateMeetingCaption = onCall(
  { secrets: [googleTranslateKey] },
  async (request) => {
    const user = requireAuth(request);
    const text = typeof request.data?.text === 'string' ? request.data.text.trim() : '';
    const target = request.data?.target;
    if (!text || text.length > 1000 || !['en', 'hi', 'gu'].includes(target)) {
      throw new HttpsError('invalid-argument', 'Caption text or target language is invalid.');
    }
    const apiKey = googleTranslateKey.value();
    if (!apiKey) {
      throw new HttpsError('failed-precondition', 'Live translation is not configured. Set GOOGLE_TRANSLATE_API_KEY in Firebase Secret Manager.');
    }

    const allowed = await enforceRateLimit(user.uid, 'translation', 90);
    if (!allowed) {
      throw new HttpsError('resource-exhausted', 'Caption translation is temporarily rate-limited.');
    }

    const response = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${encodeURIComponent(apiKey)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ q: text, target, format: 'text' }),
    });
    if (!response.ok) {
      throw new HttpsError('unavailable', 'The translation provider could not translate this caption.');
    }
    const result = await response.json();
    const translatedText = result?.data?.translations?.[0]?.translatedText;
    if (typeof translatedText !== 'string') {
      throw new HttpsError('unavailable', 'The translation provider returned an invalid response.');
    }
    return { text: translatedText };
  },
);
