const nodemailer = require("nodemailer");
require("dotenv").config();

async function quickEmailTest() {
  console.log("🚀 Quick Email Service Test");
  console.log("===========================");

  // Check environment variables
  console.log("\n📋 Configuration Check:");
  console.log("EMAIL_HOST:", process.env.EMAIL_HOST || "smtp.gmail.com");
  console.log("EMAIL_PORT:", process.env.EMAIL_PORT || 587);
  console.log("EMAIL_USER:", process.env.EMAIL_USER ? "✅ Set" : "❌ Missing");
  console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "✅ Set" : "❌ Missing");

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log("\n❌ Missing email credentials in .env file");
    return false;
  }

  // Create transporter
  const transporter = nodemailer.createTransporter({
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    connectionTimeout: 10000,
    greetingTimeout: 5000,
    socketTimeout: 10000,
  });

  // Test connection
  console.log("\n🔍 Testing SMTP Connection...");
  try {
    await transporter.verify();
    console.log("✅ SMTP Connection: SUCCESS");
  } catch (error) {
    console.log("❌ SMTP Connection: FAILED");
    console.log("Error:", error.message);

    if (error.code === "EAUTH") {
      console.log("\n🔧 Authentication Error Solutions:");
      console.log("1. Verify EMAIL_USER and EMAIL_PASS are correct");
      console.log(
        "2. For Gmail, use an App Password instead of regular password",
      );
      console.log("3. Enable 2-factor authentication on Gmail");
      console.log(
        "4. Generate new App Password: https://myaccount.google.com/apppasswords",
      );
    }
    return false;
  }

  // Test email sending (dry run)
  console.log("\n📧 Testing Email Template Generation...");
  const testOTP = "123456";
  const testEmail = "test@example.com";
  const testName = "Test User";

  const mailOptions = {
    from: `"Hare Krishna Medical Store" <${process.env.EMAIL_USER}>`,
    to: testEmail,
    subject: "🏥 Email Verification - Hare Krishna Medical Store",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #e63946;">📧 Email Verification Required</h2>
        <p>Dear <strong>${testName}</strong>,</p>
        <p>Your verification code is:</p>
        <div style="background: #f8f9fa; padding: 20px; text-align: center; margin: 20px 0;">
          <h1 style="color: #e63946; font-size: 36px; letter-spacing: 10px; margin: 0;">${testOTP}</h1>
        </div>
        <p><strong>This code expires in 10 minutes.</strong></p>
        <p>If you didn't request this verification, please ignore this email.</p>
      </div>
    `,
  };

  console.log("✅ Email Template: Generated successfully");
  console.log("📧 Subject:", mailOptions.subject);
  console.log("📧 From:", mailOptions.from);
  console.log("📧 Test recipient:", mailOptions.to);

  console.log("\n✅ Email Service Test Complete");
  console.log("\n📝 Summary:");
  console.log("- SMTP Configuration: ✅ Valid");
  console.log("- Connection Test: ✅ Successful");
  console.log("- Email Template: ✅ Generated");
  console.log("\n🎯 The email service is ready to send emails!");

  return true;
}

// Run test
quickEmailTest()
  .then((success) => {
    if (success) {
      console.log("\n🚀 Email service is fully operational!");
      console.log(
        "You can now test actual email delivery through the registration process.",
      );
    } else {
      console.log("\n❌ Email service needs configuration fixes.");
    }
    process.exit(success ? 0 : 1);
  })
  .catch((error) => {
    console.error("\n💥 Test failed with error:", error.message);
    process.exit(1);
  });
