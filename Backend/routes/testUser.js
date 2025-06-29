const express = require("express");
const User = require("../models/User");
const router = express.Router();

// Import email service
const emailService = require("../utils/emailService");

// Simple test endpoint
router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "API test endpoint is working!",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

router.get("/create-user", async (req, res) => {
  try {
    const userExists = await User.findOne({ email: "geeta@example.com" });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new User({
      fullName: "Ronak Sheladiya",
      email: "ronak2@example.com",
      mobile: "9876543210",
      password: "test1234",
      address: {
        street: "123 Main Street",
        city: "Surat",
        state: "Gujarat",
        pincode: "395007",
      },
    });

    await newUser.save();
    res
      .status(201)
      .json({ message: "User created. DB & Collection initialized." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Test email endpoint
router.post("/test-email/send", async (req, res) => {
  try {
    const { to, subject, message } = req.body;

    // Use default values if not provided
    const emailTo = to || "test@example.com";
    const emailSubject =
      subject || "Test Email from Hare Krishna Medical Store";
    const emailMessage =
      message ||
      "This is a test email to verify the email service is working correctly.";

    // Test email connection first
    const isConnected = await emailService.testConnection();
    if (!isConnected) {
      return res.status(500).json({
        success: false,
        message: "Email service is not connected",
      });
    }

    // Send test email
    const emailOptions = {
      to: emailTo,
      subject: emailSubject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2c5aa0;">🏥 Hare Krishna Medical Store</h2>
          <h3 style="color: #333;">Test Email Verification</h3>
          <p style="color: #666; line-height: 1.6;">${emailMessage}</p>
          <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h4 style="color: #333; margin: 0 0 10px 0;">Email Service Status:</h4>
            <p style="margin: 5px 0; color: #28a745;">✅ Email service is working correctly</p>
            <p style="margin: 5px 0; color: #666;">📧 Sent from: ${process.env.EMAIL_USER}</p>
            <p style="margin: 5px 0; color: #666;">🕐 Timestamp: ${new Date().toLocaleString()}</p>
          </div>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #999; font-size: 12px;">
            This is an automated test email. If you received this, the email service is functioning properly.
          </p>
        </div>
      `,
    };

    const result = await emailService.sendEmail(emailOptions);

    if (result.success) {
      res.json({
        success: true,
        message: "Test email sent successfully",
        data: {
          to: emailTo,
          subject: emailSubject,
          messageId: result.messageId,
          timestamp: new Date().toISOString(),
        },
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Failed to send test email",
        error: result.error,
      });
    }
  } catch (error) {
    console.error("Test email error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while sending test email",
      error: error.message,
    });
  }
});

module.exports = router;
