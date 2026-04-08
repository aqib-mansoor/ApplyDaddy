import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { UserProfile } from '../types';
import { handleFirestoreError, OperationType } from './firestoreErrorHandler';

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const path = `users/${uid}`;
  try {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return null; // Should not reach here as handleFirestoreError throws
  }
}

export async function createUserProfile(profile: Partial<UserProfile>): Promise<void> {
  if (!profile.uid) return;
  const path = `users/${profile.uid}`;
  try {
    const docRef = doc(db, 'users', profile.uid);
    await setDoc(docRef, {
      ...profile,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function updateUserProfile(uid: string, profile: Partial<UserProfile>): Promise<void> {
  const path = `users/${uid}`;
  try {
    const docRef = doc(db, 'users', uid);
    await updateDoc(docRef, {
      ...profile,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}
