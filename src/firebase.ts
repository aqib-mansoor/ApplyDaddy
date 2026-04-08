import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { initializeFirestore, setLogLevel, enableIndexedDbPersistence } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || firebaseConfig.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || firebaseConfig.authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || firebaseConfig.projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || firebaseConfig.storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || firebaseConfig.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || firebaseConfig.appId,
  firestoreDatabaseId: import.meta.env.VITE_FIREBASE_FIRESTORE_DATABASE_ID || firebaseConfig.firestoreDatabaseId
};

// Debug log for configuration (safe fields only)
console.log('Firebase Config:', {
  projectId: config.projectId,
  authDomain: config.authDomain,
  databaseId: config.firestoreDatabaseId,
  hasApiKey: !!config.apiKey,
  env: import.meta.env.MODE
});

setLogLevel('debug');

const app = initializeApp(config);
export const auth = getAuth(app);

// Initialize Firestore with robust settings for restricted environments
const firestoreSettings = {
  experimentalForceLongPolling: true,
  host: 'firestore.googleapis.com',
  ssl: true,
};

export const db = config.firestoreDatabaseId && config.firestoreDatabaseId !== '(default)'
  ? initializeFirestore(app, firestoreSettings, config.firestoreDatabaseId)
  : initializeFirestore(app, firestoreSettings);

// Log the effective database ID being used
console.log('Firestore Database ID:', config.firestoreDatabaseId || '(default)');

// Enable offline persistence
if (typeof window !== 'undefined') {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('Firestore persistence failed: Multiple tabs open');
    } else if (err.code === 'unimplemented') {
      console.warn('Firestore persistence failed: Browser not supported');
    } else {
      console.error('Firestore persistence error:', err);
    }
  });
}

/**
 * Resets the Firestore client by terminating the current instance and clearing persistence.
 * Useful for recovering from stuck "offline" states.
 */
export async function resetFirestore() {
  try {
    const { terminate, clearIndexedDbPersistence } = await import('firebase/firestore');
    await terminate(db);
    await clearIndexedDbPersistence(db);
    window.location.reload();
  } catch (error) {
    console.error('Failed to reset Firestore:', error);
  }
}

export const googleProvider = new GoogleAuthProvider();
