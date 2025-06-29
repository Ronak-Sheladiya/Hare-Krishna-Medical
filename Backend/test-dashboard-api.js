const axios = require("axios");

// Test dashboard API endpoints
async function testDashboardAPI() {
  const baseURL = "http://localhost:5000";

  console.log("🧪 Testing Dashboard API Endpoints...\n");

  // Test public endpoints first
  const publicTests = [
    { endpoint: "/api/test", description: "Test endpoint" },
    { endpoint: "/api/products", description: "Public products" },
  ];

  for (const test of publicTests) {
    try {
      console.log(`Testing ${test.description} (${test.endpoint})...`);
      const response = await axios.get(`${baseURL}${test.endpoint}`, {
        timeout: 5000,
      });
      console.log(`✅ ${test.description}: Status ${response.status}`);
    } catch (error) {
      console.log(
        `❌ ${test.description}: ${error.response?.status || error.message}`,
      );
    }
  }

  // Test admin endpoints without auth
  const adminTests = [
    {
      endpoint: "/api/analytics/dashboard-stats",
      description: "Dashboard stats",
    },
    { endpoint: "/api/orders?limit=5", description: "Recent orders" },
    {
      endpoint: "/api/products?limit=10&stock=low",
      description: "Low stock products",
    },
  ];

  console.log("\n🔒 Testing Admin Endpoints (without auth)...");
  for (const test of adminTests) {
    try {
      console.log(`Testing ${test.description} (${test.endpoint})...`);
      const response = await axios.get(`${baseURL}${test.endpoint}`, {
        timeout: 5000,
      });
      console.log(`✅ ${test.description}: Status ${response.status}`);
    } catch (error) {
      const status = error.response?.status;
      const message = error.response?.data?.message || error.message;
      console.log(`❌ ${test.description}: Status ${status} - ${message}`);
    }
  }

  // Test with admin token if available
  console.log("\n🔑 Checking for admin user...");
  try {
    // Try to create or login as admin
    const loginResponse = await axios.post(`${baseURL}/api/auth/login`, {
      email: "admin@hkmedical.com",
      password: "admin123",
    });

    const token = loginResponse.data.token;
    console.log("✅ Admin login successful");

    // Test admin endpoints with auth
    console.log("\n🔓 Testing Admin Endpoints (with auth)...");
    for (const test of adminTests) {
      try {
        console.log(`Testing ${test.description} (${test.endpoint})...`);
        const response = await axios.get(`${baseURL}${test.endpoint}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          timeout: 5000,
        });
        console.log(
          `✅ ${test.description}: Status ${response.status}, Data available: ${!!response.data.data}`,
        );
      } catch (error) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        console.log(`❌ ${test.description}: Status ${status} - ${message}`);
      }
    }
  } catch (error) {
    console.log(
      "❌ Admin login failed:",
      error.response?.data?.message || error.message,
    );
    console.log("📝 Attempting to create admin user...");

    try {
      await axios.post(`${baseURL}/api/auth/register`, {
        fullName: "Admin User",
        email: "admin@hkmedical.com",
        password: "admin123",
        role: 1,
      });
      console.log("✅ Admin user created successfully");
    } catch (createError) {
      console.log(
        "❌ Failed to create admin user:",
        createError.response?.data?.message || createError.message,
      );
    }
  }
}

testDashboardAPI().catch(console.error);
