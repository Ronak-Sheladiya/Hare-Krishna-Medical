const axios = require("axios");
const mongoose = require("mongoose");
require("dotenv").config();

const API_BASE = "http://localhost:5000/api";

// Test data
const testData = {
  user: {
    fullName: "Test User API",
    email: `test${Date.now()}@example.com`,
    mobile: "9876543210",
    password: "test123456",
    address: "Test Address",
  },
  admin: {
    email: "admin@test.com",
    password: "admin123456",
  },
};

let authTokens = {
  user: null,
  admin: null,
};

// Color console output
const colors = {
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  reset: "\x1b[0m",
};

const log = (color, message) =>
  console.log(`${colors[color]}${message}${colors.reset}`);

// API Test Results Storage
const testResults = {
  passed: 0,
  failed: 0,
  total: 0,
  details: [],
};

async function testAPI(
  name,
  method,
  endpoint,
  data = null,
  auth = null,
  expectedStatus = 200,
) {
  testResults.total++;

  try {
    const config = {
      method: method.toLowerCase(),
      url: `${API_BASE}${endpoint}`,
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (auth) {
      config.headers.Authorization = `Bearer ${auth}`;
    }

    if (data && (method === "POST" || method === "PUT" || method === "PATCH")) {
      config.data = data;
    }

    const response = await axios(config);

    if (response.status === expectedStatus) {
      log("green", `✅ ${name} - PASS`);
      testResults.passed++;
      testResults.details.push({
        name,
        status: "PASS",
        endpoint: `${method} ${endpoint}`,
        response: response.status,
      });
      return { success: true, data: response.data };
    } else {
      log("yellow", `⚠️ ${name} - UNEXPECTED STATUS: ${response.status}`);
      testResults.failed++;
      testResults.details.push({
        name,
        status: "UNEXPECTED_STATUS",
        endpoint: `${method} ${endpoint}`,
        expected: expectedStatus,
        actual: response.status,
      });
      return { success: false, error: `Unexpected status: ${response.status}` };
    }
  } catch (error) {
    const status = error.response?.status || "NO_RESPONSE";
    const message = error.response?.data?.message || error.message;

    log("red", `❌ ${name} - FAIL: ${status} - ${message}`);
    testResults.failed++;
    testResults.details.push({
      name,
      status: "FAIL",
      endpoint: `${method} ${endpoint}`,
      error: message,
      statusCode: status,
    });
    return { success: false, error: message };
  }
}

async function runComprehensiveAPITests() {
  log("cyan", "🚀 Starting Comprehensive API Test Suite");
  log("cyan", "==========================================");

  // 1. Health Check APIs
  log("blue", "\n📊 1. HEALTH & STATUS APIS");
  await testAPI("Health Check", "GET", "/health");

  // 2. Authentication APIs
  log("blue", "\n🔐 2. AUTHENTICATION APIS");

  // Register new user
  const regResult = await testAPI(
    "User Registration",
    "POST",
    "/auth/register",
    testData.user,
    null,
    201,
  );

  // Login user
  const loginResult = await testAPI("User Login", "POST", "/auth/login", {
    email: testData.user.email,
    password: testData.user.password,
  });

  if (loginResult.success) {
    authTokens.user = loginResult.data.token;
  }

  // Auth profile
  await testAPI(
    "Get User Profile",
    "GET",
    "/auth/profile",
    null,
    authTokens.user,
  );

  // Password reset request
  await testAPI("Forgot Password", "POST", "/auth/forgot-password", {
    email: testData.user.email,
  });

  // OTP verification (will fail with fake OTP, but tests endpoint)
  await testAPI(
    "Verify OTP",
    "POST",
    "/auth/verify-otp",
    {
      email: testData.user.email,
      otp: "123456",
    },
    null,
    400,
  ); // Expecting 400 for invalid OTP

  // Resend OTP
  await testAPI("Resend OTP", "POST", "/auth/resend-otp", {
    email: testData.user.email,
  });

  // 3. Products APIs
  log("blue", "\n🛍️ 3. PRODUCTS APIS");
  await testAPI("Get All Products", "GET", "/products");
  await testAPI("Get Product Categories", "GET", "/products/categories");
  await testAPI("Get Featured Products", "GET", "/products/featured");
  await testAPI(
    "Get Search Suggestions",
    "GET",
    "/products/search-suggestions",
  );

  // 4. Orders APIs (requires auth)
  log("blue", "\n📦 4. ORDERS APIS");
  if (authTokens.user) {
    await testAPI("Get User Orders", "GET", "/orders", null, authTokens.user);
    await testAPI(
      "Get Recent Orders",
      "GET",
      "/orders/user/recent",
      null,
      authTokens.user,
    );

    // Create order (might fail due to empty cart or validation)
    await testAPI(
      "Create Order",
      "POST",
      "/orders",
      {
        items: [
          {
            product: "507f1f77bcf86cd799439011", // Fake ObjectId
            quantity: 1,
            price: 100,
          },
        ],
        total: 100,
      },
      authTokens.user,
      400,
    ); // Expecting validation error
  }

  // 5. Users APIs
  log("blue", "\n👥 5. USERS APIS");
  if (authTokens.user) {
    await testAPI(
      "Update Profile",
      "PUT",
      "/users/profile",
      {
        fullName: "Updated Test User",
      },
      authTokens.user,
    );
  }

  // 6. Messages APIs
  log("blue", "\n💬 6. MESSAGES APIS");
  await testAPI("Get Messages", "GET", "/messages");
  await testAPI("Send Message", "POST", "/messages", {
    name: "Test User",
    email: testData.user.email,
    subject: "Test Message",
    message: "This is a test message",
  });

  // 7. Analytics APIs
  log("blue", "\n📈 7. ANALYTICS APIS");
  await testAPI("Get Analytics Stats", "GET", "/analytics/stats");

  // 8. Invoices APIs
  log("blue", "\n🧾 8. INVOICES APIS");
  if (authTokens.user) {
    await testAPI(
      "Get User Invoices",
      "GET",
      "/invoices",
      null,
      authTokens.user,
    );
  }

  // 9. Letterheads APIs
  log("blue", "\n📄 9. LETTERHEADS APIS");
  await testAPI("Get Letterheads", "GET", "/letterheads");

  // 10. Upload APIs
  log("blue", "\n📤 10. UPLOAD APIS");
  // Skip file upload tests as they require multipart/form-data

  // 11. Verification APIs
  log("blue", "\n✅ 11. VERIFICATION APIS");
  await testAPI("Get Verification Status", "GET", "/verification");

  // 12. Notifications APIs
  log("blue", "\n🔔 12. NOTIFICATIONS APIS");
  await testAPI("Get Notifications", "GET", "/admin/notifications");

  // Email Service Test
  log("blue", "\n📧 13. EMAIL SERVICE TEST");
  const emailService = require("./utils/emailService");

  try {
    log("yellow", "Testing email service connection...");
    const emailConnected = await emailService.testConnection();
    if (emailConnected) {
      log("green", "✅ Email Service Connection - PASS");
      testResults.passed++;
    } else {
      log("red", "❌ Email Service Connection - FAIL");
      testResults.failed++;
    }
    testResults.total++;
  } catch (error) {
    log("red", `❌ Email Service Test - ERROR: ${error.message}`);
    testResults.failed++;
    testResults.total++;
  }

  // Summary
  log("cyan", "\n==========================================");
  log("cyan", "📊 TEST RESULTS SUMMARY");
  log("cyan", "==========================================");
  log("green", `✅ Passed: ${testResults.passed}`);
  log("red", `❌ Failed: ${testResults.failed}`);
  log("blue", `📊 Total: ${testResults.total}`);
  log(
    "yellow",
    `📈 Success Rate: ${((testResults.passed / testResults.total) * 100).toFixed(1)}%`,
  );

  // Detailed results
  console.log("\n📋 Detailed Results:");
  testResults.details.forEach((test) => {
    const status = test.status === "PASS" ? "✅" : "❌";
    console.log(`${status} ${test.name}: ${test.endpoint}`);
    if (test.error) {
      console.log(`   Error: ${test.error}`);
    }
  });

  // Email-specific recommendations
  if (
    testResults.details.some(
      (t) => t.name.includes("Email") && t.status !== "PASS",
    )
  ) {
    log("yellow", "\n📧 EMAIL TROUBLESHOOTING RECOMMENDATIONS:");
    console.log("1. Check EMAIL_USER and EMAIL_PASS in .env file");
    console.log("2. Verify Gmail App Password is correctly set");
    console.log("3. Ensure 2-factor authentication is enabled on Gmail");
    console.log("4. Check Gmail account for any security alerts");
    console.log("5. Try generating a new App Password");
  }

  return testResults;
}

// Database connection test
async function testDatabaseConnection() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    });
    log("green", "✅ Database Connection - PASS");
    return true;
  } catch (error) {
    log("red", `❌ Database Connection - FAIL: ${error.message}`);
    return false;
  }
}

// Main execution
async function main() {
  console.clear();
  log("magenta", "🏥 HARE KRISHNA MEDICAL STORE - API TEST SUITE");
  log("magenta", "==============================================");

  // Test database first
  log("blue", "\n🗄️ DATABASE CONNECTION TEST");
  await testDatabaseConnection();

  // Run API tests
  const results = await runComprehensiveAPITests();

  // Final summary
  log("cyan", "\n🎯 FINAL ASSESSMENT:");
  if (results.passed >= results.total * 0.8) {
    log("green", "✅ System is mostly healthy");
  } else if (results.passed >= results.total * 0.6) {
    log("yellow", "⚠️ System has some issues that need attention");
  } else {
    log(
      "red",
      "❌ System has significant issues that require immediate attention",
    );
  }

  process.exit(0);
}

if (require.main === module) {
  main().catch((error) => {
    log("red", `❌ Test suite failed: ${error.message}`);
    process.exit(1);
  });
}

module.exports = { runComprehensiveAPITests, testResults };
