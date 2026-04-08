import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { handleFirestoreError, OperationType } from '../lib/firestoreUtils';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const googleProvider = new GoogleAuthProvider();

// Connection test to diagnose "Could not reach Cloud Firestore backend"
async function testConnection() {
  const path = '_connection_test_/ping';
  try {
    // Attempt to fetch a non-existent document from the server to test connectivity
    await getDocFromServer(doc(db, '_connection_test_', 'ping'));
    console.log("Firestore connection successful.");
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Firestore connection failed: The client is offline. Please check your Firebase configuration and firestoreDatabaseId.");
    } else if (error instanceof Error && error.message.includes('insufficient permissions')) {
      handleFirestoreError(error, OperationType.GET, path);
    } else {
      console.error("Firestore connection test error:", error);
    }
  }
}

testConnection();
