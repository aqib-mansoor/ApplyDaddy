import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase';
import { Application } from '../types';

const COLLECTION_NAME = 'applications';

export async function getApplications(userId: string): Promise<Application[]> {
  const q = query(
    collection(db, COLLECTION_NAME),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Application));
}

export async function saveApplication(application: Omit<Application, 'id'>): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTION_NAME), {
    ...application,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateApplicationStatus(id: string, status: Application['status']): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(docRef, { status });
}

export async function deleteApplication(id: string): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
}
