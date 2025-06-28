const axios = require("axios");
const fs = require("fs");

// Base URL - adjust if needed
const BASE_URL = "http://localhost:5000/api";
let authToken = "";

// Colors for console output
const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
};

function log(message, color = "reset") {
  console.log(colors[color] + message + colors.reset);
}

// Test results storage
const testResults = {
  passed: 0,
  failed: 0,
  errors: [],
  details: [],
};

async function testEndpoint(
  method,
  endpoint,
  data = null,
  requiresAuth = false,
  description = "",
) {
  try {
    const headers = {
      "Content-Type": "application/json",
    };

    if (requiresAuth && authToken) {
      headers["Authorization"] = `Bearer ${authToken}`;
    }

    const config = {
      method,
      url: `${BASE_URL}${endpoint}`,
      headers,
      timeout: 10000,
    };

    if (data && (method === "POST" || method === "PUT" || method === "PATCH")) {
      config.data = data;
    }

    log(`\n🧪 Testing: ${method} ${endpoint}`, "cyan");
    if (description) log(`📝 Description: ${description}`, "blue");

    const response = await axios(config);

    log(`✅ Success: ${response.status} - ${response.statusText}`, "green");
    log(
      `📊 Response: ${JSON.stringify(response.data, null, 2).substring(0, 200)}...`,
      "blue",
    );

    testResults.passed++;
    testResults.details.push({
      endpoint,
      method,
      status: "PASSED",
      statusCode: response.status,
      description,
    });

    return response.data;
  } catch (error) {
    const statusCode = error.response?.status || "TIMEOUT";
    const errorMessage = error.response?.data?.message || error.message;

    log(`❌ Failed: ${statusCode} - ${errorMessage}`, "red");
    if (error.response?.data) {
      log(
        `📊 Error Response: ${JSON.stringify(error.response.data, null, 2).substring(0, 200)}...`,
        "yellow",
      );
    }

    testResults.failed++;
    testResults.errors.push({
      endpoint,
      method,
      error: errorMessage,
      statusCode,
    });
    testResults.details.push({
      endpoint,
      method,
      status: "FAILED",
      statusCode,
      description,
      error: errorMessage,
    });

    return null;
  }
}

async function runAllTests() {
  log("🚀 Starting Comprehensive API Testing...", "magenta");
  log("=".repeat(50), "magenta");

  // 1. Health Check
  log("\n📋 HEALTH & STATUS CHECKS", "magenta");
  await testEndpoint("GET", "/health", null, false, "Server health check");

  // 2. Authentication Tests
  log("\n🔐 AUTHENTICATION TESTS", "magenta");

  // Test login with admin credentials
  const loginData = await testEndpoint(
    "POST",
    "/auth/login",
    {
      email: "admin@gmail.com",
      password: "Ronak@95865",
    },
    false,
    "Admin login",
  );

  if (loginData && loginData.token) {
    authToken = loginData.token;
    log(`🔑 Auth token acquired: ${authToken.substring(0, 20)}...`, "green");
  }

  // Test user registration
  await testEndpoint(
    "POST",
    "/auth/register",
    {
      fullName: "Test User",
      email: "test@example.com",
      mobile: "1234567890",
      password: "password123",
      address: "Test Address",
    },
    false,
    "User registration",
  );

  // Test forgot password
  await testEndpoint(
    "POST",
    "/auth/forgot-password",
    {
      email: "admin@gmail.com",
    },
    false,
    "Forgot password request",
  );

  // 3. User Management Tests
  log("\n👥 USER MANAGEMENT TESTS", "magenta");
  await testEndpoint("GET", "/users", null, true, "Get all users");
  await testEndpoint("GET", "/users/profile", null, true, "Get user profile");

  // 4. Product Tests
  log("\n🛍️ PRODUCT TESTS", "magenta");
  await testEndpoint("GET", "/products", null, false, "Get all products");
  await testEndpoint(
    "GET",
    "/products/search?query=medicine",
    null,
    false,
    "Search products",
  );

  // Create a test product
  const productData = await testEndpoint(
    "POST",
    "/products",
    {
      name: "Test Medicine",
      brand: "Test Brand",
      category: "Medicine",
      price: 100,
      stock: 50,
      description: "Test medicine description",
      dosage: "500mg",
      manufacturer: "Test Manufacturer",
    },
    true,
    "Create new product",
  );

  let productId = null;
  if (productData && productData.data && productData.data._id) {
    productId = productData.data._id;

    // Test get specific product
    await testEndpoint(
      "GET",
      `/products/${productId}`,
      null,
      false,
      "Get specific product",
    );

    // Test update product
    await testEndpoint(
      "PUT",
      `/products/${productId}`,
      {
        name: "Updated Test Medicine",
        price: 120,
      },
      true,
      "Update product",
    );
  }

  // 5. Order Tests
  log("\n📦 ORDER TESTS", "magenta");
  await testEndpoint("GET", "/orders", null, true, "Get all orders");

  // Create test order
  const orderData = await testEndpoint(
    "POST",
    "/orders",
    {
      items: [
        {
          product: productId || "60f7b3b3e1d4c3a8b8b8b8b8",
          quantity: 2,
          price: 100,
        },
      ],
      customerInfo: {
        name: "Test Customer",
        email: "customer@test.com",
        mobile: "9876543210",
        address: "Test Address",
      },
      totalAmount: 200,
    },
    true,
    "Create new order",
  );

  let orderId = null;
  if (orderData && orderData.data && orderData.data._id) {
    orderId = orderData.data._id;

    // Test get specific order
    await testEndpoint(
      "GET",
      `/orders/${orderId}`,
      null,
      true,
      "Get specific order",
    );

    // Test update order status
    await testEndpoint(
      "PATCH",
      `/orders/${orderId}/status`,
      {
        status: "processing",
      },
      true,
      "Update order status",
    );
  }

  // 6. Invoice Tests
  log("\n🧾 INVOICE TESTS", "magenta");
  await testEndpoint("GET", "/invoices", null, true, "Get all invoices");

  if (orderId) {
    await testEndpoint(
      "POST",
      "/invoices/generate",
      {
        orderId: orderId,
      },
      true,
      "Generate invoice for order",
    );
  }

  // 7. Message Tests
  log("\n💬 MESSAGE TESTS", "magenta");
  await testEndpoint("GET", "/messages", null, true, "Get all messages");

  await testEndpoint(
    "POST",
    "/messages",
    {
      name: "Test User",
      email: "test@example.com",
      subject: "Test Message",
      message: "This is a test message",
    },
    false,
    "Send contact message",
  );

  // 8. Analytics Tests
  log("\n📊 ANALYTICS TESTS", "magenta");
  await testEndpoint(
    "GET",
    "/analytics/dashboard",
    null,
    true,
    "Get dashboard analytics",
  );
  await testEndpoint(
    "GET",
    "/analytics/sales",
    null,
    true,
    "Get sales analytics",
  );
  await testEndpoint(
    "GET",
    "/analytics/products",
    null,
    true,
    "Get product analytics",
  );

  // 9. Upload Tests
  log("\n📤 UPLOAD TESTS", "magenta");
  await testEndpoint(
    "GET",
    "/upload/test",
    null,
    false,
    "Test upload endpoint",
  );

  // 10. Seed & Dev Tests
  log("\n🌱 SEED & DEV TESTS", "magenta");
  await testEndpoint("GET", "/seed/status", null, true, "Get seed status");
  await testEndpoint("GET", "/dev/status", null, true, "Get dev status");
  await testEndpoint("POST", "/dev/seed-products", null, true, "Seed products");

  // 11. Letterhead Tests
  log("\n📄 LETTERHEAD TESTS", "magenta");
  await testEndpoint("GET", "/letterheads", null, true, "Get all letterheads");

  await testEndpoint(
    "POST",
    "/letterheads",
    {
      name: "Test Letterhead",
      companyName: "Test Company",
      address: "Test Address",
      phone: "1234567890",
      email: "test@company.com",
    },
    true,
    "Create letterhead",
  );

  // 12. Verification Tests
  log("\n✅ VERIFICATION TESTS", "magenta");
  await testEndpoint(
    "GET",
    "/verification/test",
    null,
    false,
    "Test verification",
  );

  // 13. Notification Tests
  log("\n🔔 NOTIFICATION TESTS", "magenta");
  await testEndpoint(
    "GET",
    "/admin/notifications",
    null,
    true,
    "Get admin notifications",
  );

  // Cleanup - Delete test product if created
  if (productId) {
    log("\n🧹 CLEANUP", "magenta");
    await testEndpoint(
      "DELETE",
      `/products/${productId}`,
      null,
      true,
      "Delete test product",
    );
  }

  // Print final results
  log("\n" + "=".repeat(50), "magenta");
  log("📊 TEST RESULTS SUMMARY", "magenta");
  log("=".repeat(50), "magenta");
  log(`✅ Passed: ${testResults.passed}`, "green");
  log(`❌ Failed: ${testResults.failed}`, "red");
  log(
    `📈 Success Rate: ${((testResults.passed / (testResults.passed + testResults.failed)) * 100).toFixed(2)}%`,
    testResults.failed === 0 ? "green" : "yellow",
  );

  if (testResults.errors.length > 0) {
    log("\n❌ FAILED ENDPOINTS:", "red");
    testResults.errors.forEach((error) => {
      log(
        `   ${error.method} ${error.endpoint} - ${error.statusCode}: ${error.error}`,
        "red",
      );
    });
  }

  // Save detailed results to file
  fs.writeFileSync(
    "api-test-results.json",
    JSON.stringify(testResults, null, 2),
  );
  log("\n💾 Detailed results saved to api-test-results.json", "blue");
}

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  log(`❌ Unhandled Rejection at: ${promise}, reason: ${reason}`, "red");
});

// Run tests
if (require.main === module) {
  runAllTests().catch((error) => {
    log(`❌ Test suite failed: ${error.message}`, "red");
    process.exit(1);
  });
}

module.exports = { runAllTests, testEndpoint };
