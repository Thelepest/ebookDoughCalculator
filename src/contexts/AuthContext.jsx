import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  deleteUser,
} from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { isNetworkError, getGlobalNetworkErrorHandler } from '../contexts/NetworkErrorContext';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);
  const [premiumLoading, setPremiumLoading] = useState(true);

  useEffect(() => {
    let unsubscribePremium = null;

    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      setLoading(false);
      
      // Cleanup previous premium listener
      if (unsubscribePremium) {
        unsubscribePremium();
        unsubscribePremium = null;
      }

      // Reset premium state when user logs out
      if (!u) {
        setIsPremium(false);
        setPremiumLoading(false);
        return;
      }

      // Check premium status from Firestore
      setPremiumLoading(true);
      try {
        const userDocRef = doc(db, 'users', u.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          setIsPremium(userDoc.data().isPremium || false);
        } else {
          // Create user document if it doesn't exist
          await setDoc(userDocRef, {
            email: u.email,
            isPremium: false,
            createdAt: new Date().toISOString(),
          });
          setIsPremium(false);
        }
      } catch (error) {
        console.error('Error checking premium status:', error);
        if (isNetworkError(error)) {
          const handlePageError = getGlobalNetworkErrorHandler();
          if (handlePageError) {
            handlePageError(error);
          }
        }
        setIsPremium(false);
      } finally {
        setPremiumLoading(false);
      }

      // Listen to real-time updates for premium status
      const userDocRef = doc(db, 'users', u.uid);
      unsubscribePremium = onSnapshot(
        userDocRef, 
        (snapshot) => {
          if (snapshot.exists()) {
            setIsPremium(snapshot.data().isPremium || false);
          } else {
            setIsPremium(false);
          }
        },
        (error) => {
          console.error('Error in premium snapshot:', error);
          if (isNetworkError(error)) {
            const handlePageError = getGlobalNetworkErrorHandler();
            if (handlePageError) {
              handlePageError(error);
            }
          }
        }
      );
    });

    return () => {
      unsub();
      if (unsubscribePremium) {
        unsubscribePremium();
      }
    };
  }, []);

  const signup = (email, password) => createUserWithEmailAndPassword(auth, email, password);
  const login = (email, password) => signInWithEmailAndPassword(auth, email, password);
  const logout = () => signOut(auth);
  
  // resetPassword con supporto per lingua e URL personalizzato
  const resetPassword = (email, lang = 'EN') => {
    // Mappa le lingue dell'app ai codici lingua Firebase
    const langMap = {
      'PL': 'pl',
      'EN': 'en',
      'IT': 'it'
    };
    const firebaseLang = langMap[lang] || 'en';
    
    // Costruisci l'URL di redirect con parametro lingua
    const continueUrl = `${window.location.origin}/login?lang=${lang}&mode=resetPassword`;
    
    return sendPasswordResetEmail(auth, email, {
      url: continueUrl,
      handleCodeInApp: false,
      // Imposta la lingua dell'email (se supportata da Firebase)
      // Nota: Firebase usa la lingua del browser dell'utente, ma possiamo provare a forzarla
    });
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };

  const deleteAccount = async () => {
    if (!auth.currentUser) {
      throw new Error('No user logged in');
    }
    return deleteUser(auth.currentUser);
  };

  const value = {
    user,
    loading: loading || premiumLoading,
    isPremium,
    signup,
    login,
    logout,
    resetPassword,
    signInWithGoogle,
    deleteAccount,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
