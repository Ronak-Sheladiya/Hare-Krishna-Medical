require("dotenv").config();
const emailService = require("./utils/emailService");

async function testOTPEmail() {
  console.log("🧪 Testing OTP Email Functionality...");
  console.log(
    "📧 Email User:",
    process.env.EMAIL_USER ? "✅ Set" : "❌ Missing",
  );
  console.log(
    "📧 Email Pass:",
    process.env.EMAIL_PASS ? "✅ Set" : "❌ Missing",
  );

  try {
    // Test email service connection
    console.log("\n1️⃣ Testing email service connection...");
    const isConnected = await emailService.testConnection();

    if (!isConnected) {
      console.log(
        "❌ Email service connection failed. Cannot proceed with OTP test.",
      );
      return;
    }

    // Test OTP email
    console.log("\n2️⃣ Testing OTP verification email...");
    const testEmail = "test@example.com"; // Change this to your email for testing
    const testName = "Test User";
    const testOTP = "123456";

    console.log(`📧 Sending OTP email to: ${testEmail}`);
    await emailService.sendVerificationEmail(testEmail, testName, testOTP);
    console.log("✅ OTP email sent successfully!");

    // Test welcome email
    console.log("\n3️⃣ Testing welcome email...");
    await emailService.sendWelcomeEmail(testEmail, testName);
    console.log("✅ Welcome email sent successfully!");
  } catch (error) {
    console.error("❌ Email test failed:", error.message);
    console.error("Stack:", error.stack);
  }
}

// Run the test
testOTPEmail()
  .then(() => {
    console.log("\n🏁 Email test completed.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Test script failed:", error);
    process.exit(1);
  });
