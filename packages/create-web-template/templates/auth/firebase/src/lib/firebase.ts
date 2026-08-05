import { getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

/**
 * Client-side Firebase initialisation. All values are public (NEXT_PUBLIC_*);
 * security lives in Firebase rules and token verification, not in hiding these.
 *
 * The `?? ''` keeps the config assignable under exactOptionalPropertyTypes —
 * NEXT_PUBLIC_* vars are inlined at build time, so a missing one is a build
 * configuration error surfaced by Firebase at init, not a runtime branch.
 */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "",
};

export const firebaseApp = getApps()[0] ?? initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(firebaseApp);
