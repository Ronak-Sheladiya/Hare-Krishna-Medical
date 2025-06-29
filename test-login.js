// Test script to debug login issues
const axios = require("axios");

const backendUrl = "http://localhost:5000"; // Backend port

async function testLogin() {
  try {
    console.log("🧪 Testing login functionality...\n");

    // Test 1: Check backend health
    console.log("1. Checking backend health...");
    try {
      const healthResponse = await axios.get(`${backendUrl}/api/health`);
      console.log("✅ Backend health:", healthResponse.data);
    } catch (error) {
      console.log("❌ Backend health check failed:", error.message);
      return;
    }

    // Test 2: Check existing users
    console.log("\n2. Checking existing users...");
    try {
      const usersResponse = await axios.get(
        `${backendUrl}/api/debug-auth/users`,
      );
      console.log("Users data:", usersResponse.data);
    } catch (error) {
      console.log("❌ Failed to get users:", error.message);
    }

    // Test 3: Try login with development credentials
    console.log("\n3. Testing login with development credentials...");
    const testCredentials = [
      { email: "admin@harekrishnamedical.com", password: "admin123" },
      { email: "user@test.com", password: "admin123" },
      { email: "admin@test.com", password: "admin123456" },
    ];

    for (const cred of testCredentials) {
      console.log(`\nTesting login: ${cred.email} / ${cred.password}`);
      try {
        const loginResponse = await axios.post(
          `${backendUrl}/api/auth/login`,
          cred,
        );
        console.log("✅ Login successful:", {
          message: loginResponse.data.message,
          userEmail: loginResponse.data.user?.email,
          userRole: loginResponse.data.user?.role,
        });
      } catch (error) {
        console.log(
          "❌ Login failed:",
          error.response?.data?.message || error.message,
        );

        // Test password specifically
        try {
          const passwordTest = await axios.post(
            `${backendUrl}/api/debug-auth/test-password`,
            cred,
          );
          console.log("🔐 Password test result:", passwordTest.data);
        } catch (testError) {
          console.log("❌ Password test failed:", testError.message);
        }
      }
    }

    // Test 4: Create and test with a new user
    console.log("\n4. Creating test user...");
    try {
      const createResponse = await axios.post(
        `${backendUrl}/api/debug-auth/create-test-user`,
      );
      console.log("✅ Test user created:", createResponse.data);

      // Try to login with the new test user
      const testLogin = await axios.post(`${backendUrl}/api/auth/login`, {
        email: createResponse.data.email,
        password: createResponse.data.password,
      });
      console.log("✅ Test user login successful:", testLogin.data.message);
    } catch (error) {
      console.log(
        "❌ Test user creation/login failed:",
        error.response?.data?.message || error.message,
      );
    }
  } catch (error) {
    console.error("❌ Test failed:", error.message);
  }
}

// Run tests
testLogin();
