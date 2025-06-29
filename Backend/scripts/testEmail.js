const { sendWelcomeEmail } = require("../utils/emailService");
require("dotenv").config();

const testEmail = async () => {
  console.log("🧪 Testing email service...");
  console.log("📧 Email configuration:");
  console.log("- EMAIL_HOST:", process.env.EMAIL_HOST);
  console.log("- EMAIL_PORT:", process.env.EMAIL_PORT);
  console.log("- EMAIL_USER:", process.env.EMAIL_USER);
  console.log("- EMAIL_FROM:", process.env.EMAIL_FROM);

  try {
    await sendWelcomeEmail("test@example.com", "Test User");
    console.log("✅ Email test completed - check logs above for results");
  } catch (error) {
    console.error("❌ Email test failed:", error);
  }
};

testEmail();
