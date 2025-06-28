const mongoose = require("mongoose");
const emailService = require("./utils/emailService");
require("dotenv").config();

// Test data
const testRegistrationData = {
  fullName: "API Test User",
  email: `apitest${Date.now()}@test.com`,
  mobile: "9876543210",
  password: "test123456",
  address: "Test Address",
};

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log("✅ Database connected");
    return true;
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    return false;
  }
}

async function testEmailService() {
  console.log("\n🧪 Testing Email Service...");

  try {
    const isConnected = await emailService.testConnection();
    if (isConnected) {
      console.log("✅ Email service connection successful");
      return true;
    } else {
      console.log("❌ Email service connection failed");
      return false;
    }
  } catch (error) {
    console.error("❌ Email service error:", error.message);
    return false;
  }
}

async function testUserModel() {
  console.log("\n🧪 Testing User Model...");

  try {
    const User = require("./models/User");

    // Test if we can create a user (without saving)
    const testUser = new User(testRegistrationData);

    // Validate the model
    const validationError = testUser.validateSync();
    if (validationError) {
      console.error(
        "❌ User model validation failed:",
        validationError.message,
      );
      return false;
    }

    console.log("✅ User model validation successful");
    return true;
  } catch (error) {
    console.error("❌ User model error:", error.message);
    return false;
  }
}

async function testAuthController() {
  console.log("\n🧪 Testing Auth Controller (Registration Logic)...");

  try {
    const authController = require("./controllers/authController");

    // Mock request and response objects
    const mockReq = {
      body: testRegistrationData,
      app: {
        get: () => null, // Mock socket.io
      },
    };

    const mockRes = {
      status: function (code) {
        this.statusCode = code;
        return this;
      },
      json: function (data) {
        this.responseData = data;
        return this;
      },
    };

    // Test registration
    await authController.register(mockReq, mockRes);

    if (mockRes.statusCode === 201) {
      console.log("✅ Registration controller working");
      console.log("   Response:", mockRes.responseData.message);
      return true;
    } else {
      console.log("❌ Registration controller failed");
      console.log("   Status:", mockRes.statusCode);
      console.log("   Response:", mockRes.responseData);
      return false;
    }
  } catch (error) {
    console.error("❌ Auth controller error:", error.message);
    return false;
  }
}

async function runHealthCheck() {
  console.log("🚀 Starting API Health Check...");
  console.log("=====================================");

  const results = {
    database: false,
    email: false,
    userModel: false,
    authController: false,
  };

  // Test database connection
  console.log("\n1. Testing Database Connection...");
  results.database = await connectDB();

  // Test email service
  console.log("\n2. Testing Email Service...");
  results.email = await testEmailService();

  // Test user model
  if (results.database) {
    console.log("\n3. Testing User Model...");
    results.userModel = await testUserModel();
  } else {
    console.log("\n❌ Skipping User Model test (database not connected)");
  }

  // Test auth controller
  if (results.database && results.userModel) {
    console.log("\n4. Testing Auth Controller...");
    results.authController = await testAuthController();
  } else {
    console.log("\n❌ Skipping Auth Controller test (dependencies not ready)");
  }

  // Summary
  console.log("\n=====================================");
  console.log("📊 Health Check Summary:");
  console.log("=====================================");
  console.log("Database Connection:", results.database ? "✅ OK" : "❌ FAIL");
  console.log("Email Service:", results.email ? "✅ OK" : "❌ FAIL");
  console.log("User Model:", results.userModel ? "✅ OK" : "❌ FAIL");
  console.log("Auth Controller:", results.authController ? "✅ OK" : "❌ FAIL");

  const allPassed = Object.values(results).every((result) => result);
  console.log(
    "\nOverall Status:",
    allPassed ? "✅ ALL SYSTEMS OK" : "❌ SOME ISSUES FOUND",
  );

  if (!results.email) {
    console.log("\n🔧 Email Issue Troubleshooting:");
    console.log("1. Check EMAIL_USER and EMAIL_PASS in .env file");
    console.log("2. For Gmail, ensure you use an App Password");
    console.log("3. Verify EMAIL_HOST and EMAIL_PORT settings");
  }

  return allPassed;
}

// Run health check if this file is executed directly
if (require.main === module) {
  runHealthCheck()
    .then(() => {
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Health check failed:", error);
      process.exit(1);
    });
}

module.exports = { runHealthCheck };
