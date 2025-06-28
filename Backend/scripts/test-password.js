const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
require("dotenv").config();

const User = require("../models/User");

async function testPassword() {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("🔐 Password Testing Script");
    console.log("==========================");

    // Test 1: Basic bcrypt functionality
    console.log("\n1. Testing basic bcrypt functionality:");
    const testPassword = "admin123";
    const hashedPassword = await bcrypt.hash(testPassword, 12);
    const isMatch = await bcrypt.compare(testPassword, hashedPassword);

    console.log(`   Original: ${testPassword}`);
    console.log(`   Hashed: ${hashedPassword}`);
    console.log(`   Comparison result: ${isMatch}`);

    // Test 2: Check existing users in database
    console.log("\n2. Checking existing users in database:");
    const users = await User.find({}).select("+password").limit(5);

    if (users.length === 0) {
      console.log("   No users found in database");
    } else {
      for (const user of users) {
        console.log(`\n   User: ${user.email}`);
        console.log(`   Password hash exists: ${!!user.password}`);
        console.log(
          `   Password hash length: ${user.password ? user.password.length : 0}`,
        );

        // Test password comparison with known passwords
        const testPasswords = ["admin123", "admin@123", "user123"];

        for (const pwd of testPasswords) {
          try {
            const match = await user.comparePassword(pwd);
            if (match) {
              console.log(`   ✅ Password "${pwd}" matches!`);
            }
          } catch (error) {
            console.log(
              `   ❌ Error testing password "${pwd}": ${error.message}`,
            );
          }
        }
      }
    }

    // Test 3: Create and test a new user
    console.log("\n3. Creating and testing a new user:");

    const testUser = new User({
      fullName: "Test User",
      email: "test-password@example.com",
      mobile: "9999999999",
      password: "testpass123",
      emailVerified: true,
    });

    await testUser.save();
    console.log("   ✅ Test user created");

    // Retrieve and test
    const retrievedUser = await User.findOne({
      email: "test-password@example.com",
    }).select("+password");
    const passwordMatch = await retrievedUser.comparePassword("testpass123");
    const wrongPasswordMatch =
      await retrievedUser.comparePassword("wrongpassword");

    console.log(`   Correct password match: ${passwordMatch}`);
    console.log(`   Wrong password match: ${wrongPasswordMatch}`);

    // Cleanup
    await User.deleteOne({ email: "test-password@example.com" });
    console.log("   🗑️ Test user cleaned up");

    console.log("\n✅ Password testing completed!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Password testing failed:", error);
    process.exit(1);
  }
}

testPassword();
