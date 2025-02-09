
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mvlqxajlbkxaebghxevq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12bHF4YWpsYmt4YWViZ2h4ZXZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTA2MjQyODgsImV4cCI6MjAyNjIwMDI4OH0.JL26sZCmBDZ_sIcMDa5wZxYogcAtNOQxijALrxxIUUk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  },
  db: {
    schema: 'public'
  }
});
