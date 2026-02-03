import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { supabase } from '../supabase';
import { isNetworkError, getGlobalNetworkErrorHandler } from '../contexts/NetworkErrorContext';
import { getUser } from '../services/supabaseService';
import { deleteAccountRequest } from '../services/apiService';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

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

    // Get initial session
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

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        try {
          setUser(session?.user ?? null);
          setLoading(false);

          // Cleanup previous subscription listener
          if (subscriptionChannelRef.current) {
            supabase.removeChannel(subscriptionChannelRef.current);
            subscriptionChannelRef.current = null;
          }

          // Reset subscription state when user logs out
          if (!session?.user) {
            setSubscriptionTier('free');
            setSubscriptionLoading(false);
            return;
          }

          // Ensure user record exists in public.users table
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
            {
              id: userId,
              email: email,
              subscriptiontier: 'free',
            },
            { onConflict: 'id' }
          );

        if (error) {
          console.error('Error ensuring user record:', error);
        }
      } catch (error) {
        console.error('Error ensuring user record:', error);
      }
    };

  const loadUserSubscription = async (userId) => {
    setSubscriptionLoading(true);
    try {
      const userData = await getUser(userId);
      setSubscriptionTier(userData?.subscriptiontier || userData?.subscriptionTier || 'free');

      // Listen to real-time updates for subscription status
      subscriptionChannelRef.current = supabase
        .channel('user_subscription_changes')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'users',
            filter: `id=eq.${userId}`,
          },
          (payload) => {
            setSubscriptionTier(payload.new.subscriptiontier || payload.new.subscriptionTier || 'free');
          }
        )
        .subscribe();

      // Store the channel reference for cleanup
      // Note: This is a simplified approach; in production you might want better state management
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
  };

  const signup = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;

    // Wait a moment for the auth user to be created, then create the public user record
    if (data.user) {
      // Small delay to ensure auth user is fully created
      await new Promise(resolve => setTimeout(resolve, 100));
      await ensureUserRecord(data.user.id, data.user.email);
    }

    return data;
  };

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
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

  const signOutWithTimeout = async (scope, timeoutMs) => {
    return Promise.race([
      supabase.auth.signOut({ scope }),
      new Promise((_, reject) => {
        setTimeout(() => reject(new Error(`signOut ${scope} timeout`)), timeoutMs);
      }),
    ]);
  };

  const signOutSafely = async () => {
    try {
      await signOutWithTimeout('global', 5000);
    } catch (error) {
      console.warn('Global sign out failed or timed out:', error);
    }

    try {
      await supabase.auth.signOut({ scope: 'local' });
    } catch (error) {
      console.warn('Local sign out failed:', error);
    }
  };

  const logout = async () => {
    try {
      await signOutSafely();
    } finally {
      clearAuthState();
    }
  };

  const resetPassword = async (email) => {
    const redirectTo = process.env.REACT_APP_PASSWORD_RESET_REDIRECT_URL;
    const options = redirectTo ? { redirectTo } : undefined;
    const { error } = await supabase.auth.resetPasswordForEmail(email, options);
    if (error) throw error;
  };

  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/login`,
      },
    });
    if (error) throw error;
    return data;
  };

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
    signup,
    login,
    logout,
    resetPassword,
    signInWithGoogle,
    deleteAccount,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
