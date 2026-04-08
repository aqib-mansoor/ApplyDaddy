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
import { handleFirestoreError, OperationType } from './firestoreErrorHandler';

const COLLECTION_NAME = 'applications';

export async function getApplications(userId: string): Promise<Application[]> {
  const path = COLLECTION_NAME;
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Application));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

export async function saveApplication(application: Omit<Application, 'id'>): Promise<string> {
  const path = COLLECTION_NAME;
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...application,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
    return '';
  }
}

export async function updateApplicationStatus(id: string, status: Application['status']): Promise<void> {
  const path = `${COLLECTION_NAME}/${id}`;
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, { status });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteApplication(id: string): Promise<void> {
  const path = `${COLLECTION_NAME}/${id}`;
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}
