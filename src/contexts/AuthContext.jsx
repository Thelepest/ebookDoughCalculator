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
  const [subscriptionTier, setSubscriptionTier] = useState('free');
  const [subscriptionLoading, setSubscriptionLoading] = useState(true);

  useEffect(() => {
    let unsubscribeSubscription = null;

    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      setLoading(false);
      
      // Cleanup previous subscription listener
      if (unsubscribeSubscription) {
        unsubscribeSubscription();
        unsubscribeSubscription = null;
      }

      // Reset subscription state when user logs out
      if (!u) {
        setSubscriptionTier('free');
        setSubscriptionLoading(false);
        return;
      }

      // Check subscription status from Firestore
      setSubscriptionLoading(true);
      try {
        const userDocRef = doc(db, 'users', u.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          setSubscriptionTier(userDoc.data().subscriptionTier || 'free');
        } else {
          // Create user document if it doesn't exist
          await setDoc(userDocRef, {
            email: u.email,
            subscriptionTier: 'free',
            createdAt: new Date().toISOString(),
          });
          setSubscriptionTier('free');
        }
      } catch (error) {
        console.error('Error checking subscription status:', error);
        if (isNetworkError(error)) {
          const handlePageError = getGlobalNetworkErrorHandler();
          if (handlePageError) {
            handlePageError(error);
          }
        }
        setSubscriptionTier('free');
      } finally {
        setSubscriptionLoading(false);
      }

      // Listen to real-time updates for subscription status
      const userDocRef = doc(db, 'users', u.uid);
      unsubscribeSubscription = onSnapshot(
        userDocRef, 
        (snapshot) => {
          if (snapshot.exists()) {
            setSubscriptionTier(snapshot.data().subscriptionTier || 'free');
          } else {
            setSubscriptionTier('free');
          }
        },
        (error) => {
          console.error('Error in subscription snapshot:', error);
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
      if (unsubscribeSubscription) {
        unsubscribeSubscription();
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
    loading: loading || subscriptionLoading,
    subscriptionTier,
    signup,
    login,
    logout,
    resetPassword,
    signInWithGoogle,
    deleteAccount,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
