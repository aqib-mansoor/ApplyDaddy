import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { UserProfile } from '../types';

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const docRef = doc(db, 'users', uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data() as UserProfile;
  }
  return null;
}

export async function createUserProfile(profile: Partial<UserProfile>): Promise<void> {
  if (!profile.uid) return;
  const docRef = doc(db, 'users', profile.uid);
  await setDoc(docRef, {
    ...profile,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateUserProfile(uid: string, profile: Partial<UserProfile>): Promise<void> {
  const docRef = doc(db, 'users', uid);
  await updateDoc(docRef, {
    ...profile,
    updatedAt: serverTimestamp(),
  });
}
