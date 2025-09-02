const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://dvryosjtfrscdbrzssdz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR2cnlvc2p0ZnJzY2Ricnpzc2R6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4MTI4ODYsImV4cCI6MjA3MjM4ODg4Nn0.k0d3-hg_3zOyYbBncK9oXjk5cJdmZaUEXonCBWhpOd4';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR2cnlvc2p0ZnJzY2Ricnpzc2R6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjgxMjg4NiwiZXhwIjoyMDcyMzg4ODg2fQ.bswBMI3qgPYRB2RSn_p1X_S7dzVAPKD4XPHG1yJ9CLg';

// Client for regular operations
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client for service operations
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

module.exports = { supabase, supabaseAdmin };