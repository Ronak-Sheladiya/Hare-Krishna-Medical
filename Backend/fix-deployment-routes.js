// Deployment Route Fix Script - Run this to diagnose and fix route issues

const express = require("express");

// Test function to verify all routes are working
function testRoutes() {
  console.log("🧪 Testing route configurations...\n");

  // Test if all route files exist and are loadable
  const routes = [
    { path: "./routes/auth", name: "Auth Routes" },
    { path: "./routes/users", name: "User Routes" },
    { path: "./routes/products", name: "Product Routes" },
    { path: "./routes/orders", name: "Order Routes" },
    { path: "./routes/invoices", name: "Invoice Routes" },
    { path: "./routes/messages", name: "Message Routes" },
    { path: "./routes/analytics", name: "Analytics Routes" },
    { path: "./routes/upload", name: "Upload Routes" },
    { path: "./routes/seed", name: "Seed Routes" },
    { path: "./routes/dev", name: "Dev Routes" },
    { path: "./routes/verification", name: "Verification Routes" },
    { path: "./routes/notifications", name: "Notification Routes" },
    { path: "./routes/letterheads", name: "Letterhead Routes" },
  ];

  let allRoutesWorking = true;

  routes.forEach((route) => {
    try {
      const routeModule = require(route.path);
      console.log(`✅ ${route.name}: Loaded successfully`);
    } catch (error) {
      console.log(`❌ ${route.name}: Failed to load - ${error.message}`);
      allRoutesWorking = false;
    }
  });

  console.log("\n📊 Route Loading Summary:");
  console.log(
    `Status: ${allRoutesWorking ? "✅ All routes loaded" : "❌ Some routes failed"}`,
  );

  return allRoutesWorking;
}

// Environment check
function checkEnvironment() {
  console.log("\n🌍 Environment Check:");

  const requiredEnvVars = [
    "JWT_SECRET",
    "MONGODB_URI",
    "EMAIL_USER",
    "EMAIL_PASS",
    "PRIMARY_DOMAIN",
  ];

  let envIssues = [];

  requiredEnvVars.forEach((envVar) => {
    if (!process.env[envVar]) {
      envIssues.push(envVar);
      console.log(`❌ Missing: ${envVar}`);
    } else {
      console.log(`✅ Found: ${envVar}`);
    }
  });

  if (envIssues.length > 0) {
    console.log("\n⚠️ Missing Environment Variables:");
    envIssues.forEach((envVar) => {
      console.log(`   - ${envVar}: Required for production deployment`);
    });
  }

  return envIssues.length === 0;
}

// JWT Secret validation
function validateJWTSecret() {
  console.log("\n🔐 JWT Secret Validation:");

  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    console.log("❌ JWT_SECRET not found");
    return false;
  }

  if (jwtSecret === "dev-secret-key") {
    console.log("⚠️ Using default dev JWT secret in production!");
    console.log("   This should be changed for security");
    return false;
  }

  if (jwtSecret.length < 32) {
    console.log("⚠️ JWT secret is too short for production");
    console.log("   Recommended: At least 32 characters");
    return false;
  }

  console.log("✅ JWT Secret is properly configured");
  return true;
}

// Generate production-ready suggestions
function generateProductionFix() {
  console.log("\n🔧 Production Deployment Fix Suggestions:\n");

  console.log("1. Environment Variables for Render:");
  console.log("   Add these in your Render dashboard environment variables:");
  console.log("   ```");
  console.log("   JWT_SECRET=your-super-secure-32-character-secret-here");
  console.log("   MONGODB_URI=your-mongodb-atlas-connection-string");
  console.log("   NODE_ENV=production");
  console.log("   EMAIL_USER=your-email@gmail.com");
  console.log("   EMAIL_PASS=your-app-password");
  console.log("   PRIMARY_DOMAIN=https://hk-medical.vercel.app");
  console.log("   FRONTEND_URL=https://hk-medical.vercel.app");
  console.log("   ```\n");

  console.log("2. Render Deployment Settings:");
  console.log("   - Build Command: npm install");
  console.log("   - Start Command: npm start");
  console.log("   - Node Version: 18+ recommended");
  console.log("   - Health Check Path: /api/health\n");

  console.log("3. CORS Configuration:");
  console.log("   Verify FRONTEND_URL includes your Vercel domain\n");

  console.log("4. Database Connection:");
  console.log("   Ensure MongoDB Atlas allows connections from 0.0.0.0/0\n");

  console.log("5. Route Issues:");
  console.log("   Check that all route files are included in deployment");
  console.log("   Verify case sensitivity in file names");
}

// Main diagnostic function
function runDiagnostics() {
  console.log("🚀 Deployment Diagnostics Starting...\n");

  const routesOK = testRoutes();
  const envOK = checkEnvironment();
  const jwtOK = validateJWTSecret();

  console.log("\n📋 Diagnostic Summary:");
  console.log(`Routes: ${routesOK ? "✅" : "❌"}`);
  console.log(`Environment: ${envOK ? "✅" : "❌"}`);
  console.log(`JWT Security: ${jwtOK ? "✅" : "❌"}`);

  if (!routesOK || !envOK || !jwtOK) {
    generateProductionFix();
  } else {
    console.log("\n🎉 All checks passed! Deployment should work correctly.");
  }
}

// Export for use in other files
module.exports = {
  testRoutes,
  checkEnvironment,
  validateJWTSecret,
  runDiagnostics,
};

// Run diagnostics if called directly
if (require.main === module) {
  runDiagnostics();
}
