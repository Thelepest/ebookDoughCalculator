import { createClient } from '@supabase/supabase-js';

// Use environment variables for keys. Create .env.local with REACT_APP_SUPABASE_* entries.
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.');
}

// (Optional) helpful debug during dev - remove or guard in production
if (process.env.NODE_ENV === 'development') {
  // eslint-disable-next-line no-console
  console.log('Supabase client initialized for project:', supabaseUrl);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Give the auth lock more time to avoid spurious AbortError in multi-tab/redirect flows.
    lockAcquireTimeout: 30000,
  },
});

export default supabase;
