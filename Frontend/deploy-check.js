#!/usr/bin/env node

/**
 * Deployment Readiness Check for Hare Krishna Medical Store
 * This script verifies that both frontend and backend are properly configured
 */

const fs = require("fs");
const path = require("path");

// Colors for console output
const colors = {
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  reset: "\x1b[0m",
  bold: "\x1b[1m",
};

const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  header: (msg) =>
    console.log(`\n${colors.bold}${colors.blue}🔍 ${msg}${colors.reset}\n`),
};

// Check if file exists
function fileExists(filePath) {
  return fs.existsSync(filePath);
}

// Read and parse JSON file
function readJsonFile(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    return null;
  }
}

// Read .env file
function readEnvFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    const env = {};
    content.split("\n").forEach((line) => {
      const [key, ...valueParts] = line.split("=");
      if (key && !key.startsWith("#")) {
        env[key.trim()] = valueParts.join("=").trim();
      }
    });
    return env;
  } catch (error) {
    return null;
  }
}

// Main check function
function runDeploymentChecks() {
  log.header("HARE KRISHNA MEDICAL STORE - DEPLOYMENT READINESS CHECK");

  let allChecksPass = true;

  // 1. Check project structure
  log.header("PROJECT STRUCTURE");

  const requiredFrontendFiles = [
    "package.json",
    "vite.config.js",
    "src/App.jsx",
    "src/main.jsx",
    ".env",
  ];

  const requiredBackendFiles = [
    "Hare-Krishna-Medical-Backend/package.json",
    "Hare-Krishna-Medical-Backend/server.js",
    "Hare-Krishna-Medical-Backend/.env",
  ];

  // Check frontend files
  requiredFrontendFiles.forEach((file) => {
    if (fileExists(file)) {
      log.success(`Frontend: ${file} exists`);
    } else {
      log.error(`Frontend: ${file} missing`);
      allChecksPass = false;
    }
  });

  // Check backend files
  requiredBackendFiles.forEach((file) => {
    if (fileExists(file)) {
      log.success(`Backend: ${file} exists`);
    } else {
      log.error(`Backend: ${file} missing`);
      allChecksPass = false;
    }
  });

  // 2. Check package.json files
  log.header("PACKAGE.JSON VALIDATION");

  const frontendPkg = readJsonFile("package.json");
  const backendPkg = readJsonFile("Hare-Krishna-Medical-Backend/package.json");

  if (frontendPkg) {
    log.success("Frontend package.json is valid JSON");
    if (frontendPkg.dependencies && frontendPkg.dependencies["react"]) {
      log.success("React dependency found in frontend");
    } else {
      log.error("React dependency missing in frontend");
      allChecksPass = false;
    }
  } else {
    log.error("Frontend package.json is invalid or missing");
    allChecksPass = false;
  }

  if (backendPkg) {
    log.success("Backend package.json is valid JSON");
    if (backendPkg.dependencies && backendPkg.dependencies["express"]) {
      log.success("Express dependency found in backend");
    } else {
      log.error("Express dependency missing in backend");
      allChecksPass = false;
    }
  } else {
    log.error("Backend package.json is invalid or missing");
    allChecksPass = false;
  }

  // 3. Check environment variables
  log.header("ENVIRONMENT CONFIGURATION");

  const frontendEnv = readEnvFile(".env");
  const backendEnv = readEnvFile("Hare-Krishna-Medical-Backend/.env");

  // Frontend env checks
  if (frontendEnv) {
    log.success("Frontend .env file exists and is readable");

    if (frontendEnv.VITE_BACKEND_URL) {
      log.success(`Frontend backend URL: ${frontendEnv.VITE_BACKEND_URL}`);
    } else {
      log.error("VITE_BACKEND_URL missing in frontend .env");
      allChecksPass = false;
    }
  } else {
    log.error("Frontend .env file missing or unreadable");
    allChecksPass = false;
  }

  // Backend env checks
  if (backendEnv) {
    log.success("Backend .env file exists and is readable");

    const requiredBackendEnvs = [
      "MONGODB_URI",
      "JWT_SECRET",
      "EMAIL_HOST",
      "EMAIL_USER",
      "EMAIL_PASS",
      "FRONTEND_URL",
    ];

    requiredBackendEnvs.forEach((envVar) => {
      if (backendEnv[envVar]) {
        log.success(`${envVar} is configured`);
      } else {
        log.warning(`${envVar} is missing (optional for some features)`);
      }
    });
  } else {
    log.error("Backend .env file missing or unreadable");
    allChecksPass = false;
  }

  // 4. Check controllers
  log.header("BACKEND CONTROLLERS");

  const controllers = [
    "authController.js",
    "productsController.js",
    "ordersController.js",
    "usersController.js",
    "invoicesController.js",
    "analyticsController.js",
    "messagesController.js",
    "uploadController.js",
  ];

  controllers.forEach((controller) => {
    const path = `Hare-Krishna-Medical-Backend/controllers/${controller}`;
    if (fileExists(path)) {
      log.success(`Controller: ${controller} exists`);
    } else {
      log.error(`Controller: ${controller} missing`);
      allChecksPass = false;
    }
  });

  // 5. Check routes
  log.header("BACKEND ROUTES");

  const routes = [
    "auth.js",
    "products.js",
    "orders.js",
    "users.js",
    "invoices.js",
    "analytics.js",
    "messages.js",
    "upload.js",
    "verification.js",
  ];

  routes.forEach((route) => {
    const path = `Hare-Krishna-Medical-Backend/routes/${route}`;
    if (fileExists(path)) {
      log.success(`Route: ${route} exists`);
    } else {
      log.error(`Route: ${route} missing`);
      allChecksPass = false;
    }
  });

  // 6. Check utilities
  log.header("BACKEND UTILITIES");

  const utilities = ["emailService.js", "smsService.js"];

  utilities.forEach((util) => {
    const path = `Hare-Krishna-Medical-Backend/utils/${util}`;
    if (fileExists(path)) {
      log.success(`Utility: ${util} exists`);
    } else {
      log.warning(`Utility: ${util} missing (some features may not work)`);
    }
  });

  // 7. Final assessment
  log.header("DEPLOYMENT READINESS ASSESSMENT");

  if (allChecksPass) {
    log.success("✨ ALL CHECKS PASSED! Ready for deployment");
    log.info("Frontend URL: https://harekrishnamedical.vercel.app");
    log.info("Backend URL: https://hare-krishna-medical-backend.onrender.com");

    log.header("DEPLOYMENT INSTRUCTIONS");
    console.log(`
${colors.blue}Frontend Deployment (Vercel):${colors.reset}
1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

${colors.blue}Backend Deployment (Render):${colors.reset}
1. Push code to GitHub
2. Connect repository to Render
3. Set environment variables in Render dashboard
4. Deploy

${colors.blue}Post-Deployment Verification:${colors.reset}
1. Test user registration with OTP
2. Test email functionality
3. Test product CRUD operations
4. Test order placement
5. Test admin dashboard
    `);
  } else {
    log.error("⚠️  SOME CHECKS FAILED! Fix issues before deployment");
    log.info(
      "Review the errors above and fix them before proceeding with deployment.",
    );
  }

  return allChecksPass;
}

// Run the checks
if (require.main === module) {
  runDeploymentChecks();
}

module.exports = { runDeploymentChecks };
