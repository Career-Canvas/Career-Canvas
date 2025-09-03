// backend/supabaseClient.js
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load .env variables (needed if not already loaded in server.js)
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Supabase URL or Key missing in environment variables");
  throw new Error("Supabase client initialization failed. Check your .env file.");
}

const supabase = createClient(supabaseUrl, supabaseKey);

export { supabase };
