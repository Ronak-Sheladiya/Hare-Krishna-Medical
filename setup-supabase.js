#!/usr/bin/env node

/**
 * Supabase Setup Verification Script
 * Hare Krishna Medical Store
 */

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://dvryosjtfrscdbrzssdz.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR2cnlvc2p0ZnJzY2Ricnpzc2R6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjgxMjg4NiwiZXhwIjoyMDcyMzg4ODg2fQ.bswBMI3qgPYRB2RSn_p1X_S7dzVAPKD4XPHG1yJ9CLg';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function verifySetup() {
  console.log('🚀 Verifying Supabase Setup...');
  console.log('====================================');

  try {
    // Test connection
    console.log('📡 Testing connection...');
    const { data, error } = await supabase.from('users').select('count');
    
    if (error && error.code !== 'PGRST116') {
      throw error;
    }
    
    console.log('✅ Connection successful');

    // Check tables
    const tables = ['users', 'products', 'orders', 'invoices', 'messages', 'letterheads', 'verifications'];
    
    console.log('\n📋 Checking tables...');
    for (const table of tables) {
      try {
        const { error } = await supabase.from(table).select('count').limit(1);
        if (error && error.code !== 'PGRST116') {
          console.log(`❌ ${table} - Error: ${error.message}`);
        } else {
          console.log(`✅ ${table} - OK`);
        }
      } catch (err) {
        console.log(`❌ ${table} - Error: ${err.message}`);
      }
    }

    // Check sample data
    console.log('\n📊 Checking sample data...');
    const { data: products } = await supabase.from('products').select('*').limit(5);
    console.log(`✅ Products: ${products?.length || 0} found`);

    const { data: users } = await supabase.from('users').select('*').limit(5);
    console.log(`✅ Users: ${users?.length || 0} found`);

    console.log('\n🎉 Supabase setup verification complete!');
    console.log('\n📝 Next steps:');
    console.log('1. Run the SQL script in Supabase SQL Editor if tables are missing');
    console.log('2. Start the frontend: cd Frontend && npm run dev');
    console.log('3. Start the backend: cd Backend && npm start');

  } catch (error) {
    console.error('❌ Setup verification failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Check if Supabase project is active');
    console.log('2. Verify API keys are correct');
    console.log('3. Run the SQL setup script in Supabase dashboard');
  }
}

verifySetup();