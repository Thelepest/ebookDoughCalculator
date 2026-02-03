const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  dotenv.config();
}

const supabaseUrl = process.env.SUPABASE_URL || process.env.REACT_APP_SUPABASE_URL;
const anonKey =
  process.env.SUPABASE_ANON_KEY ||
  process.env.REACT_APP_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_PUBLISHABLE_KEY;
const serviceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SECRET_KEY;

const mask = (value) => {
  if (!value) return '(missing)';
  if (value.length <= 10) return `${value[0]}***`;
  return `${value.slice(0, 6)}...${value.slice(-4)}`;
};

const normalizeUrl = (value) => (value ? value.replace(/\/+$/, '') : value);

const fetchJson = async (url, headers) => {
  const res = await fetch(url, { headers });
  const text = await res.text();
  let json = null;
  try {
    json = JSON.parse(text);
  } catch (error) {
    json = null;
  }
  return { res, text, json };
};

const main = async () => {
  console.log('Supabase key check');
  console.log(`URL: ${supabaseUrl || '(missing)'}`);
  console.log(`Publishable/anon key: ${mask(anonKey)}`);
  console.log(`Service role/secret key: ${mask(serviceRoleKey)}`);

  if (!supabaseUrl) {
    console.error('Missing SUPABASE_URL/REACT_APP_SUPABASE_URL.');
    process.exit(1);
  }

  if (!globalThis.fetch) {
    console.error('Missing fetch API. Use Node.js 18+.');
    process.exit(1);
  }

  const baseUrl = normalizeUrl(supabaseUrl);

  if (anonKey) {
    const { res, text } = await fetchJson(`${baseUrl}/auth/v1/settings`, {
      apikey: anonKey,
    });
    if (res.ok) {
      console.log('Publishable/anon key: OK (auth settings reachable).');
    } else {
      console.log(`Publishable/anon key: FAIL (${res.status}).`);
      if (text) {
        console.log(`Response: ${text.slice(0, 200)}`);
      }
    }
  } else {
    console.log('Publishable/anon key: missing, skipped.');
  }

  if (serviceRoleKey) {
    const { res, text } = await fetchJson(`${baseUrl}/auth/v1/admin/users?per_page=1`, {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
    });
    if (res.ok) {
      console.log('Service role/secret key: OK (admin endpoint reachable).');
    } else {
      console.log(`Service role/secret key: FAIL (${res.status}).`);
      if (text) {
        console.log(`Response: ${text.slice(0, 200)}`);
      }
    }
  } else {
    console.log('Service role/secret key: missing, skipped.');
  }
};

main().catch((error) => {
  console.error('Key check failed:', error.message || error);
  process.exit(1);
});
