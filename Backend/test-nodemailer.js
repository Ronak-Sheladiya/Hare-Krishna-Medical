const nodemailer = require("nodemailer");

console.log("🔧 Testing nodemailer setup...");

try {
  // Test the correct method name
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "test@gmail.com",
      pass: "testpass",
    },
  });

  console.log("✅ nodemailer.createTransport() works correctly!");
  console.log("✅ EmailService should now work without errors");
} catch (error) {
  console.error("❌ Error with nodemailer:", error.message);
}

// Also test if the incorrect method exists (it shouldn't)
if (typeof nodemailer.createTransporter === "function") {
  console.log("❌ createTransporter method exists (this is wrong!)");
} else {
  console.log("✅ createTransporter method does not exist (this is correct!)");
}
