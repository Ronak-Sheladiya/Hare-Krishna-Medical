require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

const debugLogin = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB");

    // Find all users
    const users = await User.find({}).select("+password");
    console.log(`📊 Total users in database: ${users.length}`);

    if (users.length === 0) {
      console.log("❌ No users found in database");
      return;
    }

    // Debug each user
    for (const user of users) {
      console.log("\n🔍 User Debug Info:");
      console.log(`Email: ${user.email}`);
      console.log(`Full Name: ${user.fullName}`);
      console.log(`Password Hash: ${user.password ? "EXISTS" : "MISSING"}`);
      console.log(
        `Password Hash Length: ${user.password ? user.password.length : 0}`,
      );
      console.log(`Is Active: ${user.isActive}`);
      console.log(`Email Verified: ${user.emailVerified}`);

      // Test password comparison with common passwords
      const testPasswords = ["admin123", "password", "123456", "test123"];

      for (const testPassword of testPasswords) {
        try {
          const isMatch = await user.comparePassword(testPassword);
          console.log(
            `Testing password "${testPassword}": ${isMatch ? "✅ MATCH" : "❌ NO MATCH"}`,
          );

          // Also test direct bcrypt comparison
          const directMatch = await bcrypt.compare(testPassword, user.password);
          console.log(
            `Direct bcrypt test "${testPassword}": ${directMatch ? "✅ MATCH" : "❌ NO MATCH"}`,
          );
        } catch (error) {
          console.log(
            `Error testing password "${testPassword}": ${error.message}`,
          );
        }
      }
    }

    // Test creating a new user with known password
    console.log("\n🧪 Testing user creation with known password...");
    const testEmail = "test-debug@example.com";
    const testPassword = "testpassword123";

    // Delete existing test user if exists
    await User.deleteOne({ email: testEmail });

    // Create new test user
    const testUser = new User({
      fullName: "Test Debug User",
      email: testEmail,
      mobile: "9876543210",
      password: testPassword,
      address: { street: "Test Street" },
    });

    await testUser.save();
    console.log("✅ Test user created");

    // Try to login with the test user
    const savedUser = await User.findOne({ email: testEmail }).select(
      "+password",
    );
    const loginTest = await savedUser.comparePassword(testPassword);
    console.log(
      `Login test for new user: ${loginTest ? "✅ SUCCESS" : "❌ FAILED"}`,
    );

    // Clean up test user
    await User.deleteOne({ email: testEmail });
    console.log("🧹 Test user cleaned up");
  } catch (error) {
    console.error("❌ Debug error:", error);
  } finally {
    await mongoose.connection.close();
    console.log("📡 Database connection closed");
  }
};

debugLogin();
