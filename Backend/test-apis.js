const axios = require("axios");

const API_BASE = "http://localhost:5000/api";

// Test data
const testUser = {
  fullName: "Test User API",
  email: `testapi${Date.now()}@example.com`,
  mobile: "9876543210",
  password: "test123456",
  address: "Test Address API",
};

async function testHealthCheck() {
  try {
    console.log("\n🔍 Testing Health Check...");
    const response = await axios.get(`${API_BASE}/health`);
    console.log("✅ Health Check:", response.data);
    return true;
  } catch (error) {
    console.error("❌ Health Check failed:", error.message);
    return false;
  }
}

async function testRegistrationAPI() {
  try {
    console.log("\n🔍 Testing Registration API...");
    console.log("📤 Sending registration data:", {
      ...testUser,
      password: "[HIDDEN]",
    });

    const response = await axios.post(`${API_BASE}/auth/register`, testUser);
    console.log("✅ Registration successful:", {
      message: response.data.message,
      userCreated: !!response.data.user,
      tokenProvided: !!response.data.token,
      emailVerified: response.data.user?.emailVerified,
    });

    return {
      success: true,
      token: response.data.token,
      user: response.data.user,
    };
  } catch (error) {
    console.error("❌ Registration failed:");
    if (error.response) {
      console.error("   Status:", error.response.status);
      console.error("   Error:", error.response.data);
    } else {
      console.error("   Error:", error.message);
    }
    return { success: false };
  }
}

async function testLoginAPI() {
  try {
    console.log("\n🔍 Testing Login API...");
    const loginData = {
      email: testUser.email,
      password: testUser.password,
    };

    const response = await axios.post(`${API_BASE}/auth/login`, loginData);
    console.log("✅ Login successful:", {
      message: response.data.message,
      tokenProvided: !!response.data.token,
    });

    return {
      success: true,
      token: response.data.token,
    };
  } catch (error) {
    console.error("❌ Login failed:");
    if (error.response) {
      console.error("   Status:", error.response.status);
      console.error("   Error:", error.response.data);
    } else {
      console.error("   Error:", error.message);
    }
    return { success: false };
  }
}

async function testOtherAPIs() {
  try {
    console.log("\n🔍 Testing Other API Endpoints...");

    // Test products API
    try {
      const productsResponse = await axios.get(`${API_BASE}/products`);
      console.log(
        "✅ Products API working - Found",
        productsResponse.data.products?.length || 0,
        "products",
      );
    } catch (error) {
      console.error(
        "❌ Products API failed:",
        error.response?.data?.message || error.message,
      );
    }

    // Test analytics API (might need auth)
    try {
      const analyticsResponse = await axios.get(`${API_BASE}/analytics/stats`);
      console.log("✅ Analytics API working");
    } catch (error) {
      console.error(
        "❌ Analytics API failed:",
        error.response?.data?.message || error.message,
      );
    }

    // Test messages API
    try {
      const messagesResponse = await axios.get(`${API_BASE}/messages`);
      console.log("✅ Messages API working");
    } catch (error) {
      console.error(
        "❌ Messages API failed:",
        error.response?.data?.message || error.message,
      );
    }
  } catch (error) {
    console.error("❌ Error testing APIs:", error.message);
  }
}

async function runAllTests() {
  console.log("🚀 Starting API Test Suite...");
  console.log("================================");

  // Test health check first
  const healthOk = await testHealthCheck();
  if (!healthOk) {
    console.log("❌ Server not responding, stopping tests");
    return;
  }

  // Test registration
  const regResult = await testRegistrationAPI();

  // Test login if registration succeeded
  if (regResult.success) {
    await testLoginAPI();
  }

  // Test other APIs
  await testOtherAPIs();

  console.log("\n================================");
  console.log("✅ API Test Suite Complete");
}

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = { runAllTests, testRegistrationAPI };
