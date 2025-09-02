#!/usr/bin/env node

/**
 * Deployment Configuration Script
 * Hare Krishna Medical Store
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Hare Krishna Medical Store - Deployment Configuration');
console.log('====================================================');

// Check if required files exist
const requiredFiles = [
  'vercel.json',
  'Backend/vercel.json',
  'Frontend/vercel.json',
  'Backend/package.json',
  'Frontend/package.json',
  'Frontend/.env.production'
];

console.log('\n📋 Checking deployment files...');

let allFilesExist = true;
requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
    allFilesExist = false;
  }
});

if (allFilesExist) {
  console.log('\n✅ All deployment files are ready!');
  console.log('\n📝 Deployment Instructions:');
  console.log('1. Push your code to GitHub');
  console.log('2. Connect your GitHub repo to Vercel');
  console.log('3. Set environment variables in Vercel dashboard');
  console.log('4. Deploy!');
  
  console.log('\n🔧 Required Environment Variables for Backend:');
  console.log('- MONGODB_URI');
  console.log('- JWT_SECRET');
  console.log('- EMAIL_HOST');
  console.log('- EMAIL_PORT');
  console.log('- EMAIL_USER');
  console.log('- EMAIL_PASS');
  console.log('- CLOUDINARY_CLOUD_NAME');
  console.log('- CLOUDINARY_API_KEY');
  console.log('- CLOUDINARY_API_SECRET');
  console.log('- RAZORPAY_KEY_ID');
  console.log('- RAZORPAY_KEY_SECRET');
  
  console.log('\n🌐 Deployment URLs:');
  console.log('Frontend: https://harekrishnamedical.vercel.app');
  console.log('Backend: https://hare-krishna-medical-backend.vercel.app');
} else {
  console.log('\n❌ Some deployment files are missing. Please run the setup again.');
  process.exit(1);
}

console.log('\n🎉 Ready for deployment!');