import { initializeApp } from 'firebase/app';
import { getAuth, signOut as fbSignOut, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Use environment variables for keys. Create .env.local with REACT_APP_FIREBASE_* entries.
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

// (Optional) helpful debug during dev — remove or guard in production
if (process.env.NODE_ENV === 'development') {
  // eslint-disable-next-line no-console
  console.log('⚙️  Firebase config loaded for project:', firebaseConfig.projectId);
}

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Connect to emulators in development
if (window.location.hostname === 'localhost') {
  try {
    console.log('🔌 Connecting to Firebase Emulators');
    connectAuthEmulator(auth, 'http://localhost:9099');
    connectFirestoreEmulator(db, 'localhost', 8080);
    // If you're using the storage emulator, uncomment the following line
    // connectStorageEmulator(storage, 'localhost', 9199);
    console.log('✅ Successfully connected to Firebase Emulators');
  } catch (error) {
    console.error('⚠️ Error connecting to Firebase Emulators:', error);
  }
}

export const logout = () => fbSignOut(auth);

export default app;
