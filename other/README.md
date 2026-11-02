# MindMesh

React 19 + Vite 8 frontend for the MindMesh SaaS workspace. Pure JavaScript (`.js` / `.jsx`), Tailwind CSS v4, Leaflet GPS map, MediaRecorder voice capture, and a Live Real-Time / Demo Data toggle.

## Project layout

- `frontend/` contains the Vite application, assets, environment template, and frontend package files.
- `backend/` contains Firebase Functions, Firestore and Storage rules, and the Firebase CLI configuration.
- `other/` contains project documentation and supplemental metadata.
- The root `.gitignore` applies to generated files and environment files throughout the project.

## Run locally

```bash
cd frontend
npm install
npm run dev
```

### Firebase live workspace

Live mode requires a Firebase project. From `frontend/`, copy `.env.example` to `.env.local` and
fill in the Firebase Web app configuration from Project settings. Enable
**Email/Password** in Firebase Authentication and create a Cloud Firestore
database, then deploy the rules and Functions from the Firebase CLI:

```bash
cd ..
firebase --config backend/firebase.json deploy --only firestore:rules,storage,functions
```

`backend/firebase.json` maps both rules files; Storage is
used for private food-memory photos and voice recordings. Firebase web configuration values
are public client identifiers, not admin credentials; never put service-account
keys in this app. If configuration is missing, live sign-in and writes remain
disabled and the app explains what is needed.

The authenticated workspace records are stored in the signed-in user's
`users/{uid}/records` Firestore collection. Firestore realtime listeners report
network and permission errors in the app. No local record cache is enabled;
offline edits are not queued or described as synchronized. Demo mode is a
separate, explicit preset and is not mixed with Firebase records.

From `frontend/`:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). If that port is in use,
Vite reports the alternate port it selected.

- **Demo sign-in**: `ava@mindmesh.demo` / `password123` (explicit demo mode only)
- **Live Real-Time** requires Firebase setup above and stores only the signed-in user's records in Firestore.
- Theme toggle and command palette (`Ctrl/Cmd + K`) are available in the workspace.
- Notes can be pinned for quick access; pin state is saved with each note in the active dataset and synchronized to Firestore in Live Real-Time mode.
- The dashboard can resurface the least-recently-updated saved note and open it directly in Notes; this is a local reminder, not an AI-generated recommendation.
- The sign-in “Keep me signed in” choice uses Firebase local or session persistence. It does not claim to enforce a 30-day expiration.
- Live meeting rooms use the Zoom Video SDK through authenticated Firebase
  callable Functions. Configure `ZOOM_VIDEO_SDK_KEY` and
  `ZOOM_VIDEO_SDK_SECRET` with Firebase Secret Manager; never put these values
  in `.env.local` or the browser bundle. Meeting access requires an authenticated
  owner or a valid email-bound invitation. The app does not record calls or
  persist live captions. Translation additionally requires
  `GOOGLE_TRANSLATE_API_KEY` in Firebase Secret Manager.
- Location capture requires an explicit browser permission and uses the
  device's geolocation API. Food memories upload only user-selected JPEG, PNG,
  or WebP images (5 MB maximum) to the signed-in user's Firebase Storage path.
- Assistant results are local keyword matches, not generated AI. Document
  capture saves metadata only; it does not upload or index document contents.
  Billing, admin metrics, SQL execution, and cloud infrastructure screens are
  previews unless backed by a separately configured server service.
- Workflow and webhook screens store configuration previews only. No automation
  runner dispatches actions, no webhook request is sent, and no webhook signing
  secret is generated or stored in the browser.
- Run the focused utility checks from `frontend/` with `node --test src/utils/engine.test.js`;
  or run the available utility suite with `npm test`. `npm run build` checks
  the production bundle. The current `npm run lint` script is a legacy alias
  for `vite build`; it is not an ESLint or type-check run.
- Run `npm run functions:lint` from `frontend/` to syntax-check the Firebase Functions source.

## Stack

- React 19 (JSX only — no TypeScript sources)
- Vite 8, Tailwind CSS v4, Lucide icons
- Canvas knowledge graph, Leaflet map, Firebase Authentication and Firestore
- Any model names shown in the interface are labels only; no AI provider is
  configured or called by this frontend.
