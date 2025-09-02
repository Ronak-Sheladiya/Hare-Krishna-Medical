import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://dvryosjtfrscdbrzssdz.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR2cnlvc2p0ZnJzY2Ricnpzc2R6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4MTI4ODYsImV4cCI6MjA3MjM4ODg4Nn0.k0d3-hg_3zOyYbBncK9oXjk5cJdmZaUEXonCBWhpOd4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Real-time subscriptions helper
export const subscribeToTable = (table, callback) => {
  return supabase
    .channel(`${table}_changes`)
    .on('postgres_changes', { event: '*', schema: 'public', table }, callback)
    .subscribe();
};

export default supabase;