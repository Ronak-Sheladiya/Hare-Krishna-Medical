const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const { devAuth, shouldUseFallback } = require("../utils/devFallback");

// Debug endpoint to check users and test login
router.get("/users", async (req, res) => {
  try {
    console.log("🔍 Debug: Checking users in database");
    console.log(`Database connection state: ${mongoose.connection.readyState}`);

    if (mongoose.connection.readyState !== 1) {
      return res.json({
        message: "Database not connected",
        dbState: mongoose.connection.readyState,
        fallbackUsers: (await devAuth.devUsers) || [],
      });
    }

    // Get all users (without passwords for security)
    const users = await User.find({}).select("-password");

    res.json({
      message: "Users found",
      dbConnected: true,
      usersCount: users.length,
      users: users.map((user) => ({
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        isActive: user.isActive,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt,
      })),
    });
  } catch (error) {
    console.error("Debug users error:", error);
    res.status(500).json({
      message: "Error fetching users",
      error: error.message,
    });
  }
});

// Debug endpoint to test password for a specific user
router.post("/test-password", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password required",
      });
    }

    console.log(`🔍 Testing password for: ${email}`);

    // Check if using fallback
    if (shouldUseFallback() || mongoose.connection.readyState !== 1) {
      console.log("Using fallback mode for password test");
      try {
        const result = await devAuth.login(email, password);
        return res.json({
          message: "Password test successful (fallback mode)",
          success: true,
          mode: "fallback",
        });
      } catch (error) {
        return res.json({
          message: "Password test failed (fallback mode)",
          success: false,
          mode: "fallback",
          error: error.message,
        });
      }
    }

    // Find user in database
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.json({
        message: "User not found",
        success: false,
      });
    }

    // Test password comparison
    const isMatch = await user.comparePassword(password);
    const directMatch = await bcrypt.compare(password, user.password);

    res.json({
      message: "Password test completed",
      success: isMatch,
      userFound: true,
      passwordHashExists: !!user.password,
      passwordHashLength: user.password ? user.password.length : 0,
      methodMatch: isMatch,
      directMatch: directMatch,
      isActive: user.isActive,
      mode: "database",
    });
  } catch (error) {
    console.error("Password test error:", error);
    res.status(500).json({
      message: "Error testing password",
      error: error.message,
    });
  }
});

// Debug endpoint to create a test user with known password
router.post("/create-test-user", async (req, res) => {
  try {
    const testEmail = "debug@test.com";
    const testPassword = "debug123";

    // Delete existing test user
    await User.deleteOne({ email: testEmail });

    // Create new test user
    const testUser = new User({
      fullName: "Debug Test User",
      email: testEmail,
      mobile: "9999999999",
      password: testPassword,
      address: {
        street: "Test Street",
        city: "Test City",
        state: "Test State",
        pincode: "123456",
      },
    });

    await testUser.save();

    res.json({
      message: "Test user created successfully",
      email: testEmail,
      password: testPassword,
      userId: testUser._id,
    });
  } catch (error) {
    console.error("Create test user error:", error);
    res.status(500).json({
      message: "Error creating test user",
      error: error.message,
    });
  }
});

module.exports = router;
