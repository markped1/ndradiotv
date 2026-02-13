import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validation: Ensure URL is present, not a placeholder, and starts with https://
const hasUrl = !!supabaseUrl;
const isPlaceholder = supabaseUrl?.includes('REPLACE');
const isHttps = supabaseUrl?.startsWith('https://');

if (!hasUrl) console.error('❌ Supabase Error: VITE_SUPABASE_URL is missing in Vercel settings.');
else if (isPlaceholder) console.error('❌ Supabase Error: VITE_SUPABASE_URL is still set to placeholder.');
else if (!isHttps) console.error('❌ Supabase Error: VITE_SUPABASE_URL must start with https:// - You likely pasted the Project ID instead of the full URL.');

if (!supabaseAnonKey) console.error('❌ Supabase Error: VITE_SUPABASE_ANON_KEY is missing in Vercel settings.');

const isValidUrl = hasUrl && !isPlaceholder && isHttps;

export const supabase = (isValidUrl && supabaseAnonKey)
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

if (supabase) {
    console.log('✅ Supabase Client Initialized Successfully.');
}
