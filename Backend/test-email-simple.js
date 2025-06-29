require("dotenv").config();
const emailService = require("./utils/emailService");

async function testEmailService() {
  console.log("🔍 Testing Email Service...\n");

  // Check environment variables
  console.log("📧 Email Configuration:");
  console.log("EMAIL_USER:", process.env.EMAIL_USER || "❌ NOT SET");
  console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "✅ SET" : "❌ NOT SET");
  console.log("EMAIL_HOST:", process.env.EMAIL_HOST || "❌ NOT SET");
  console.log("EMAIL_PORT:", process.env.EMAIL_PORT || "❌ NOT SET");

  try {
    // Test connection
    console.log("\n🔗 Testing connection...");
    const isConnected = await emailService.testConnection();

    if (isConnected) {
      console.log("✅ Email service connection successful!");

      // Test sending actual email
      console.log("\n📤 Testing email send...");
      const result = await emailService.sendEmail({
        to: process.env.EMAIL_USER, // Send to self for testing
        subject: "Test Email - Hare Krishna Medical",
        text: "This is a test email from Hare Krishna Medical Store backend.",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #e63946;">✅ Email Service Test</h2>
            <p>This is a test email from Hare Krishna Medical Store backend.</p>
            <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
            <p><strong>Status:</strong> Email service is working correctly!</p>
          </div>
        `,
      });

      console.log("✅ Test email sent successfully!");
      console.log(
        "📧 You should receive a test email at:",
        process.env.EMAIL_USER,
      );
    } else {
      console.log("❌ Email service connection failed");
    }
  } catch (error) {
    console.error("❌ Email test failed:", error.message);

    // Provide specific troubleshooting tips
    if (error.code === "EAUTH") {
      console.log("\n🔧 TROUBLESHOOTING TIPS:");
      console.log(
        "1. Make sure you are using an App Password for Gmail, not your regular password",
      );
      console.log("2. Enable 2-Factor Authentication in your Google account");
      console.log(
        "3. Generate an App Password: https://support.google.com/accounts/answer/185833",
      );
      console.log("4. Use the App Password in EMAIL_PASS environment variable");
    } else if (error.code === "ECONNECTION") {
      console.log("\n🔧 TROUBLESHOOTING TIPS:");
      console.log("1. Check your internet connection");
      console.log("2. Verify EMAIL_HOST and EMAIL_PORT settings");
      console.log("3. Check if firewall is blocking SMTP connections");
    }
  }
}

// Run the test
testEmailService()
  .then(() => {
    console.log("\n✨ Email test completed");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Test script error:", error);
    process.exit(1);
  });
