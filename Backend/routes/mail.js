const express = require("express");
const { auth } = require("../middleware/auth");
const emailService = require("../utils/emailService");
const User = require("../models/User");

const router = express.Router();

// @route   GET /api/mail/sent
// @desc    Get sent emails (for admin tracking)
// @access  Private (Admin only)
router.get("/sent", auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin privileges required.",
      });
    }

    // Get email logs (this would require implementing email logging)
    // For now, return a basic response
    res.json({
      success: true,
      message: "Email tracking endpoint",
      data: {
        totalSent: 0,
        recentEmails: [],
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Mail sent tracking error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve email data",
      error: error.message,
    });
  }
});

// @route   POST /api/mail/send-test
// @desc    Send a test email
// @access  Private (Admin only)
router.post("/send-test", auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin privileges required.",
      });
    }

    const { email, type = "test" } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email address is required",
      });
    }

    // Send test email based on type
    let result;
    switch (type) {
      case "welcome":
        result = await emailService.sendWelcomeEmail(email, "Test User");
        break;
      case "verification":
        const testOtp = "123456";
        result = await emailService.sendVerificationEmail(
          email,
          "Test User",
          testOtp,
        );
        break;
      default:
        // Send a basic test email
        result = await emailService.sendEmail({
          to: email,
          subject: "Test Email from Hare Krishna Medical Store",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #e63946;">Test Email</h2>
              <p>This is a test email from Hare Krishna Medical Store backend.</p>
              <p>Timestamp: ${new Date().toISOString()}</p>
            </div>
          `,
        });
    }

    res.json({
      success: true,
      message: `Test email sent successfully to ${email}`,
      type,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Test email send error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send test email",
      error: error.message,
    });
  }
});

// @route   POST /api/mail/resend-verification
// @desc    Resend verification email for a user
// @access  Private (Admin only)
router.post("/resend-verification", auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin privileges required.",
      });
    }

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email address is required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.emailVerified) {
      return res.status(400).json({
        success: false,
        message: "Email is already verified",
      });
    }

    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.emailOTP = otp;
    user.emailOTPExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    // Send verification email
    await emailService.sendVerificationEmail(user.email, user.fullName, otp);

    res.json({
      success: true,
      message: `Verification email resent to ${email}`,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Resend verification error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to resend verification email",
      error: error.message,
    });
  }
});

// @route   GET /api/mail/status
// @desc    Get email service status
// @access  Private (Admin only)
router.get("/status", auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin privileges required.",
      });
    }

    // Test email service connection
    const isConnected = await emailService.testConnection();

    res.json({
      success: true,
      data: {
        connected: isConnected,
        service: "Gmail SMTP",
        host: "smtp.gmail.com",
        port: 587,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Email status check error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to check email service status",
      error: error.message,
    });
  }
});

module.exports = router;
