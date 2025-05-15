import { initializeApp } from "firebase/app";
import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    signOut as fbSignOut
} from "firebase/auth";
const firebaseConfig = {
    apiKey: "AIzaSyCGVh1zEwEQeUEahklVablh29NJ13N3_Yw",
    authDomain: "sourdoughtest-9e754.firebaseapp.com",
    projectId: "sourdoughtest-9e754",
    storageBucket: "sourdoughtest-9e754.firebasestorage.app",
    messagingSenderId: "408932112235",
    appId: "1:408932112235:web:66b09dfe6c72e8c874de2e",
    measurementId: "G-16RD0L2656"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Wrapper per il login con Google
const loginWithGoogle = () => signInWithPopup(auth, googleProvider);

// Wrapper per il logout
const logout = () => fbSignOut(auth);

export { auth, loginWithGoogle, logout };
