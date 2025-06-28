#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

console.log(
  "🔧 Setting up environment files for Hare Krishna Medical Store...\n",
);

// Environment configurations
const environments = {
  frontend: {
    development: {
      file: "Frontend/.env",
      content: `# ===== DEVELOPMENT BACKEND API CONFIGURATION =====
VITE_BACKEND_URL=http://localhost:5000

# ===== APPLICATION CONFIGURATION =====
VITE_APP_NAME=Hare Krishna Medical Store
VITE_VERSION=1.0.0

# ===== DEVELOPMENT CONFIGURATION =====
VITE_DEBUG=true
VITE_NODE_ENV=development

# ===== REAL-TIME FEATURES =====
VITE_SOCKET_URL=http://localhost:5000

# ===== SECURITY CONFIGURATION =====
VITE_SESSION_TIMEOUT=3600000
VITE_MAX_FILE_SIZE=5242880

# ===== FALLBACK TO PRODUCTION IF LOCAL BACKEND NOT AVAILABLE =====
VITE_BACKEND_URL_FALLBACK=https://hare-krishna-medical.onrender.com
VITE_SOCKET_URL_FALLBACK=https://hare-krishna-medical.onrender.com
`,
    },
    production: {
      file: "Frontend/.env.production",
      content: `# ===== PRODUCTION BACKEND API CONFIGURATION =====
VITE_BACKEND_URL=https://hare-krishna-medical.onrender.com

# ===== APPLICATION CONFIGURATION =====
VITE_APP_NAME=Hare Krishna Medical Store
VITE_VERSION=1.0.0

# ===== PRODUCTION CONFIGURATION =====
VITE_DEBUG=false
VITE_NODE_ENV=production

# ===== REAL-TIME FEATURES =====
VITE_SOCKET_URL=https://hare-krishna-medical.onrender.com

# ===== SECURITY CONFIGURATION =====
VITE_SESSION_TIMEOUT=3600000
VITE_MAX_FILE_SIZE=5242880

# ===== DEPLOYMENT URLS =====
VITE_FRONTEND_URLS=https://hk-medical.vercel.app,https://hkmedical.vercel.app,https://harekrishnamedical.vercel.app,https://hare-krishna-medical.vercel.app
VITE_PRIMARY_DOMAIN=https://hk-medical.vercel.app
`,
    },
  },
  backend: {
    development: {
      file: "Backend/.env",
      content: `# MongoDB Atlas Configuration - Production Database
MONGODB_URI=mongodb+srv://ronaksheladiya652:Ronak95865@cluster0.idf2afh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL for CORS
FRONTEND_URL=http://localhost:5173

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# Email Configuration (Gmail SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=sheladiyaronak8@gmail.com
EMAIL_PASS=vsnwhqgdmkzczyfa

# Cloudinary Configuration (for image uploads)
CLOUDINARY_CLOUD_NAME=dhrr2pk3z
CLOUDINARY_API_KEY=793151465941582
CLOUDINARY_API_SECRET=Nrvxd62NH1KKL4F1gi7DflzT8eE
CLOUDINARY_URL=cloudinary://793151465941582:Nrvxd62NH1KKL4F1gi7DflzT8eE@dhrr2pk3z

# Razorpay Configuration (if using payments)
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret

# Production Backend URL (for reference)
PRODUCTION_BACKEND_URL=https://hare-krishna-medical.onrender.com
`,
    },
    production: {
      file: "Backend/.env.production",
      content: `# MongoDB Atlas Configuration
MONGODB_URI=mongodb+srv://ronaksheladiya652:Ronak95865@cluster0.idf2afh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

# Server Configuration
PORT=5000
NODE_ENV=production

# Frontend URLs for CORS (Multiple Vercel domains)
FRONTEND_URL=https://hk-medical.vercel.app,https://hkmedical.vercel.app,https://harekrishnamedical.vercel.app,https://hare-krishna-medical.vercel.app

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production-2024
JWT_EXPIRES_IN=7d

# Email Configuration (Gmail SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=sheladiyaronak8@gmail.com
EMAIL_PASS=vsnwhqgdmkzczyfa

# Cloudinary Configuration (for image uploads)
CLOUDINARY_CLOUD_NAME=dhrr2pk3z
CLOUDINARY_API_KEY=793151465941582
CLOUDINARY_API_SECRET=Nrvxd62NH1KKL4F1gi7DflzT8eE
CLOUDINARY_URL=cloudinary://793151465941582:Nrvxd62NH1KKL4F1gi7DflzT8eE@dhrr2pk3z

# Razorpay Configuration (if using payments)
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret

# Deployment Configuration
BACKEND_URL=https://hare-krishna-medical.onrender.com
`,
    },
  },
};

// Create environment files
function createEnvFile(filePath, content) {
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(filePath, content);
    console.log(`✅ Created: ${filePath}`);
  } catch (error) {
    console.error(`❌ Failed to create ${filePath}:`, error.message);
  }
}

// Main setup function
function setupEnvironments() {
  console.log("📂 Creating Frontend environment files...");
  createEnvFile(
    environments.frontend.development.file,
    environments.frontend.development.content,
  );
  createEnvFile(
    environments.frontend.production.file,
    environments.frontend.production.content,
  );

  console.log("\n📂 Creating Backend environment files...");
  createEnvFile(
    environments.backend.development.file,
    environments.backend.development.content,
  );
  createEnvFile(
    environments.backend.production.file,
    environments.backend.production.content,
  );

  console.log("\n🎉 Environment setup complete!");
  console.log("\n📋 Next steps:");
  console.log("1. Review the created .env files");
  console.log("2. Update any credentials or secrets as needed");
  console.log("3. For production deployment, set environment variables in:");
  console.log("   - Vercel: Project Settings > Environment Variables");
  console.log("   - Render: Service Settings > Environment Variables");
  console.log(
    "\n📖 For detailed deployment instructions, see DEPLOYMENT_CONFIG.md",
  );
}

// Run the setup
setupEnvironments();
