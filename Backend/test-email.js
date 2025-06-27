require("dotenv").config();
const emailService = require("./utils/emailService");

async function testEmailService() {
  console.log("🧪 Testing Email Service Configuration...\n");

  try {
    // Test connection
    const connectionResult = await emailService.testConnection();

    if (connectionResult) {
      console.log("\n✅ Email service is ready!");
      console.log(
        "📧 You can now send professional emails with the new red-themed templates",
      );

      // Optionally send a test email to yourself
      /* 
      console.log('\n🧪 Sending test email...');
      await emailService.sendWelcomeEmail(
        process.env.EMAIL_USER, 
        'Test User'
      );
      console.log('✅ Test email sent successfully!');
      */
    } else {
      console.log("\n❌ Email service connection failed");
      console.log("Please check your email configuration in .env file");
    }
  } catch (error) {
    console.error("\n❌ Email service test failed:", error.message);

    if (error.code === "EAUTH") {
      console.log("\n💡 Gmail Users: You may need to:");
      console.log("   1. Enable 2-factor authentication");
      console.log("   2. Generate an App Password");
      console.log(
        "   3. Use the App Password instead of your regular password",
      );
      console.log("   Guide: https://support.google.com/mail/answer/185833");
    }
  }

  process.exit(0);
}

testEmailService();
