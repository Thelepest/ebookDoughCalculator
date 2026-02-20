import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { supabase } from '../supabase';
import { isNetworkError, getGlobalNetworkErrorHandler } from '../contexts/NetworkErrorContext';
import { getUser } from '../services/supabaseService';
import { deleteAccountRequest } from '../services/apiService';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

/**
 * Redirect URL per OAuth. In web usa l'origine corrente.
 * Per app Capacitor (Android/iOS) configura in Supabase Dashboard una URL di tipo:
 * - Web: https://tuodominio.com/login
 * - App: aggiungi lo custom URL scheme (es. it.marcobiasone://login) in Authentication > URL Configuration
 */
const getRedirectUrl = () => {
  if (typeof window === 'undefined') return undefined;
  return `${window.location.origin}/login`;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subscriptionTier, setSubscriptionTier] = useState('free');
  const [subscriptionLoading, setSubscriptionLoading] = useState(true);
  const [needsPrivacyAcceptance, setNeedsPrivacyAcceptance] = useState(false);
  const subscriptionChannelRef = useRef(null);
  const privacyVersion = '1.0';

  useEffect(() => {
    const handleOAuthRedirect = async () => {
      const url = new URL(window.location.href);
      const code = url.searchParams.get('code');
      if (!code) return;

      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) {
        console.error('OAuth code exchange failed:', error);
      }

      url.searchParams.delete('code');
      url.searchParams.delete('state');
      url.searchParams.delete('error');
      url.searchParams.delete('error_description');
      window.history.replaceState({}, document.title, url.pathname + url.search + url.hash);
    };

    handleOAuthRedirect();

    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);

        if (session?.user) {
          await loadUserSubscription(session.user.id);
        } else {
          setSubscriptionTier('free');
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
        setUser(null);
        setSubscriptionTier('free');
      } finally {
        setLoading(false);
        setSubscriptionLoading(false);
      }
    };

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        try {
          setUser(session?.user ?? null);
          setLoading(false);

          if (subscriptionChannelRef.current) {
            supabase.removeChannel(subscriptionChannelRef.current);
            subscriptionChannelRef.current = null;
          }

          if (!session?.user) {
            setSubscriptionTier('free');
            setSubscriptionLoading(false);
            return;
          }

          await ensureUserRecord(session.user.id, session.user.email);
          await loadUserSubscription(session.user.id);
        } catch (error) {
          console.error('Error handling auth change:', error);
          setSubscriptionTier('free');
          setSubscriptionLoading(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
      if (subscriptionChannelRef.current) {
        supabase.removeChannel(subscriptionChannelRef.current);
        subscriptionChannelRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!user) {
      setNeedsPrivacyAcceptance(false);
      return;
    }
    const privacyAccepted = localStorage.getItem(`privacy_accepted_${user.id}`);
    const privacyVersionStored = localStorage.getItem(`privacy_version_${user.id}`);
    setNeedsPrivacyAcceptance(!privacyAccepted || privacyVersionStored !== privacyVersion);
  }, [user]);

  const ensureUserRecord = async (userId, email) => {
    try {
      const { error } = await supabase
        .from('users')
        .upsert(
          { id: userId, email: email || '', subscriptiontier: 'free' },
          { onConflict: 'id' }
        );
      if (error) console.error('Error ensuring user record:', error);
    } catch (error) {
      console.error('Error ensuring user record:', error);
    }
  };

  const loadUserSubscription = async (userId) => {
    setSubscriptionLoading(true);
    try {
      const userData = await getUser(userId);
      setSubscriptionTier(userData?.subscriptiontier || userData?.subscriptionTier || 'free');

      subscriptionChannelRef.current = supabase
        .channel('user_subscription_changes')
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'users', filter: `id=eq.${userId}` },
          (payload) => {
            setSubscriptionTier(payload.new.subscriptiontier || payload.new.subscriptionTier || 'free');
          }
        )
        .subscribe();
    } catch (error) {
      console.error('Error checking subscription status:', error);
      if (isNetworkError(error)) {
        const handlePageError = getGlobalNetworkErrorHandler();
        if (handlePageError) handlePageError(error);
      }
      setSubscriptionTier('free');
    } finally {
      setSubscriptionLoading(false);
    }
  };

  const clearAuthState = () => {
    if (subscriptionChannelRef.current) {
      supabase.removeChannel(subscriptionChannelRef.current);
      subscriptionChannelRef.current = null;
    }
    setUser(null);
    setSubscriptionTier('free');
    setSubscriptionLoading(false);
    setLoading(false);
  };

  const signOutSafely = async () => {
    try {
      await Promise.race([
        supabase.auth.signOut({ scope: 'global' }),
        new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 5000)),
      ]);
    } catch (e) {
      console.warn('Global sign out failed or timed out:', e);
    }
    try {
      await supabase.auth.signOut({ scope: 'local' });
    } catch (e) {
      console.warn('Local sign out failed:', e);
    }
  };

  const logout = async () => {
    try {
      await signOutSafely();
    } finally {
      clearAuthState();
    }
  };

  /**
   * Login solo tramite provider OAuth (Google, Facebook, ecc.).
   * Supabase non supporta "Login with Instagram" come provider; per altri provider
   * aggiungili in Authentication > Providers nel dashboard Supabase.
   */
  const signInWithOAuth = async (provider) => {
    const redirectTo = getRedirectUrl();
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo },
    });
    if (error) throw error;
    return data;
  };

  /**
   * Cancellazione account: chiama l'edge function (che elimina dati + auth user).
   * Solo in caso di successo viene fatto logout e clear state.
   */
  const deleteAccount = async () => {
    await deleteAccountRequest();
    try {
      await signOutSafely();
    } finally {
      clearAuthState();
    }
  };

  const value = {
    user,
    loading,
    subscriptionLoading,
    subscriptionTier,
    needsPrivacyAcceptance,
    setNeedsPrivacyAcceptance,
    logout,
    signInWithOAuth,
    deleteAccount,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
