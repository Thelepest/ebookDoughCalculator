import { supabase } from '../supabase';

const getAccessToken = async () => {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    throw error;
  }
  return data?.session?.access_token || null;
};

const invokeFunction = async (name, body, headers = {}) => {
  const accessToken = await getAccessToken();
  const mergedHeaders = { ...headers };
  if (accessToken) {
    mergedHeaders.Authorization = `Bearer ${accessToken}`;
  }
  const { data, error } = await supabase.functions.invoke(name, {
    body,
    headers: mergedHeaders,
  });
  if (error) {
    throw new Error(error.message || 'Function request failed');
  }
  return data;
};

export const confirmPayPalSubscription = async (payload) => {
  return invokeFunction('paypal-confirm-subscription', payload);
};

export const cancelPayPalSubscription = async () => {
  return invokeFunction('paypal-cancel-subscription');
};

export const deleteAccountRequest = async () => {
  return invokeFunction('admin-delete-account');
};
