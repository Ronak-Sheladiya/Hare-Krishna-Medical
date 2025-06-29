require("dotenv").config();
const emailService = require("./utils/emailService");

async function debugEmail() {
  console.log("🔍 Debugging Email Service...\n");

  // Check environment variables
  console.log("📋 Environment Variables:");
  console.log("EMAIL_USER:", process.env.EMAIL_USER || "❌ NOT SET");
  console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "✅ SET" : "❌ NOT SET");
  console.log("EMAIL_HOST:", process.env.EMAIL_HOST || "❌ NOT SET");
  console.log("EMAIL_PORT:", process.env.EMAIL_PORT || "❌ NOT SET");
  console.log("");

  try {
    console.log("🧪 Testing email service connection...");
    const isConnected = await emailService.testConnection();
    console.log(
      "Connection result:",
      isConnected ? "✅ CONNECTED" : "❌ FAILED",
    );

    if (isConnected) {
      console.log("\n📤 Testing email send...");
      const testResult = await emailService.sendEmail({
        to: "test@example.com",
        subject: "Test Email",
        text: "This is a test email",
        html: "<p>This is a test email</p>",
      });
      console.log(
        "Email send result:",
        testResult ? "✅ SUCCESS" : "❌ FAILED",
      );
    }
  } catch (error) {
    console.error("❌ Email test error:", error.message);
    console.error("Full error:", error);
  }
}

debugEmail();
