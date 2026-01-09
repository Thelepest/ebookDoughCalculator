import { db } from '../firebase';
import {
  collection,
  doc,
  setDoc,
  addDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp,
  deleteDoc,
  updateDoc,
  getDoc,
} from 'firebase/firestore';

// Notes collection helpers (per-user)
export const notesCollectionRef = (uid) => collection(db, 'users', uid, 'notes');

export const createNote = async (uid, note) => {
  const ref = await addDoc(notesCollectionRef(uid), {
    ...note,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
};

export const updateNote = async (uid, noteId, data) => {
  const ref = doc(db, 'users', uid, 'notes', noteId);
  await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
};

export const deleteNote = async (uid, noteId) => {
  const ref = doc(db, 'users', uid, 'notes', noteId);
  await deleteDoc(ref);
};

export const subscribeToNotes = (uid, callback) => {
  const q = query(notesCollectionRef(uid), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const notes = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(notes);
  });
};

// Calendar events (per-user)
export const createEvent = async (uid, event) => {
  const ref = await addDoc(collection(db, 'users', uid, 'calendar'), {
    ...event,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
};

export const subscribeToEvents = (uid, callback) => {
  const q = query(collection(db, 'users', uid, 'calendar'), orderBy('start', 'asc'));
  return onSnapshot(q, (snapshot) => {
    const events = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(events);
  });
};

// Admin messaging
export const sendAdminMessage = async (uid, payload) => {
  // payload: { message, attachments?: [], fromDisplayName }
  const ref = await addDoc(collection(db, 'adminMessages'), {
    uid,
    ...payload,
    createdAt: serverTimestamp(),
    read: false,
  });
  // Also create a per-user log
  await setDoc(doc(db, 'users', uid, 'sentToAdmin', ref.id), {
    ...payload,
    messageId: ref.id,
    createdAt: serverTimestamp(),
    read: false,
  });
  return ref.id;
};

export const subscribeToAdminMessagesForUser = (uid, callback) => {
  const q = query(collection(db, 'adminMessages'), where('uid', '==', uid), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const msgs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(msgs);
  });
};

export const markAdminMessageRead = async (messageId) => {
  const ref = doc(db, 'adminMessages', messageId);
  await updateDoc(ref, { read: true });
};

// Generic user update
export const updateUser = async (uid, data) => {
  const ref = doc(db, 'users', uid);
  await updateDoc(ref, data);
};
