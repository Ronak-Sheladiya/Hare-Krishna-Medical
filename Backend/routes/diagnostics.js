const express = require("express");
const { sendWelcomeEmail } = require("../utils/emailService");
const router = express.Router();

// @route   POST /api/diagnostics/test-email
// @desc    Test email service functionality
// @access  Public (for development only)
router.post("/test-email", async (req, res) => {
  try {
    const { email = "test@example.com", name = "Test User" } = req.body;

    console.log("🧪 Testing email service...");
    console.log("📧 Email configuration:");
    console.log(
      "- EMAIL_USER:",
      process.env.EMAIL_USER ? "✅ Set" : "❌ Not set",
    );
    console.log(
      "- EMAIL_PASS:",
      process.env.EMAIL_PASS ? "✅ Set" : "❌ Not set",
    );
    console.log("- EMAIL_FROM:", process.env.EMAIL_FROM);

    const result = await sendWelcomeEmail(email, name);

    res.json({
      success: result.success,
      message: result.message,
      config: {
        emailUser: process.env.EMAIL_USER ? "configured" : "not configured",
        emailPass: process.env.EMAIL_PASS ? "configured" : "not configured",
        emailFrom: process.env.EMAIL_FROM,
      },
    });
  } catch (error) {
    console.error("Email test error:", error);
    res.status(500).json({
      success: false,
      message: `Email test failed: ${error.message}`,
    });
  }
});

module.exports = router;
