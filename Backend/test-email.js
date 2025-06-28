const emailService = require("./utils/emailService");
require("dotenv").config();

async function testEmailService() {
  console.log("🧪 Testing Email Service...");
  console.log("================================");

  // Test connection
  console.log("\n1. Testing email connection...");
  const connectionTest = await emailService.testConnection();
  console.log(
    "Connection test result:",
    connectionTest ? "✅ Success" : "❌ Failed",
  );

  if (!connectionTest) {
    console.log("\n❌ Email service not properly configured");
    console.log(
      "Please check your EMAIL_USER and EMAIL_PASS environment variables",
    );
    return false;
  }

  // Test sending verification email
  console.log("\n2. Testing verification email...");
  try {
    const testOtp = "123456";
    const testEmail = "test@example.com"; // This won't actually send
    const testName = "Test User";

    // This would fail for a real email, but we're testing the email service setup
    await emailService.sendVerificationEmail(testEmail, testName, testOtp);
    console.log("✅ Verification email service is working");
  } catch (error) {
    console.log("❌ Verification email failed:", error.message);
    // This is expected for invalid email addresses
    if (error.message.includes("Invalid email")) {
      console.log("   (This is expected for test email addresses)");
    }
  }

  console.log("\n================================");
  console.log("✅ Email Service Test Complete");

  return true;
}

// Check configuration
console.log("📧 Email Configuration:");
console.log("  EMAIL_HOST:", process.env.EMAIL_HOST || "smtp.gmail.com");
console.log("  EMAIL_PORT:", process.env.EMAIL_PORT || 587);
console.log("  EMAIL_USER:", process.env.EMAIL_USER ? "✅ Set" : "❌ Missing");
console.log("  EMAIL_PASS:", process.env.EMAIL_PASS ? "✅ Set" : "❌ Missing");
console.log("");

testEmailService().catch(console.error);
