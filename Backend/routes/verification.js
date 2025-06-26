const express = require("express");
const crypto = require("crypto");
const User = require("../models/User");
const Verification = require("../models/Verification");
const Invoice = require("../models/Invoice");

const { auth } = require("../middleware/auth");
const { body, validationResult, query } = require("express-validator");
const emailService = require("../utils/emailService");

const router = express.Router();

// @route   POST /api/verification/send-email-verification
// @desc    Send email verification link
// @access  Private
router.post("/send-email-verification", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

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

    // Find or create verification record
    let verification = await Verification.findOne({ user: user._id });

    if (!verification) {
      verification = new Verification({
        user: user._id,
        email: user.email,
        mobile: user.mobile,
        emailVerificationToken: crypto.randomBytes(32).toString("hex"),
      });
    } else {
      verification.emailVerificationToken = crypto
        .randomBytes(32)
        .toString("hex");
    }

    await verification.save();

    // Send verification email
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verification.emailVerificationToken}`;

    try {
      await emailService.sendEmailVerification(
        user.email,
        user.fullName,
        verificationUrl,
      );

      res.json({
        success: true,
        message: "Verification email sent successfully",
      });
    } catch (emailError) {
      console.error("Email verification sending failed:", emailError);
      res.status(500).json({
        success: false,
        message: "Failed to send verification email",
      });
    }
  } catch (error) {
    console.error("Send email verification error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send email verification",
      error: error.message,
    });
  }
});

// @route   GET /api/verification/verify-email/:token
// @desc    Verify email with token
// @access  Public
router.get("/verify-email/:token", async (req, res) => {
  try {
    const { token } = req.params;

    const verification = await Verification.findOne({
      emailVerificationToken: token,
    }).populate("user");

    if (!verification) {
      return res.status(400).json({
        success: false,
        message: "Invalid verification token",
      });
    }

    // Verify email
    verification.verifyEmail();
    await verification.save();

    // Update user
    verification.user.emailVerified = true;
    await verification.user.save();

    res.json({
      success: true,
      message: "Email verified successfully",
      data: {
        emailVerified: true,
        verificationCompleted: verification.isCompleted,
      },
    });
  } catch (error) {
    console.error("Email verification error:", error);
    res.status(500).json({
      success: false,
      message: "Email verification failed",
      error: error.message,
    });
  }
});

// @route   POST /api/verification/send-mobile-otp
// @desc    Send mobile OTP
// @access  Private
router.post("/send-mobile-otp", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Find or create verification record
    let verification = await Verification.findOne({ user: user._id });

    if (!verification) {
      verification = new Verification({
        user: user._id,
        email: user.email,
        mobile: user.mobile,
        emailVerificationToken: crypto.randomBytes(32).toString("hex"),
      });
    }

    if (verification.mobileVerified) {
      return res.status(400).json({
        success: false,
        message: "Mobile number is already verified",
      });
    }

    // Generate OTP
    const otp = verification.generateOTP();
    await verification.save();

    res.json({
      success: true,
      message: "OTP sent successfully to your mobile number",
      data: {
        otpExpiresAt: verification.otpExpiresAt,
      },
    });
  } catch (error) {
    console.error("Send mobile OTP error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send OTP",
      error: error.message,
    });
  }
});

// @route   POST /api/verification/verify-mobile-otp
// @desc    Verify mobile OTP
// @access  Private
router.post(
  "/verify-mobile-otp",
  auth,
  [
    body("otp")
      .isLength({ min: 6, max: 6 })
      .withMessage("OTP must be 6 digits"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const { otp } = req.body;
      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      const verification = await Verification.findOne({ user: user._id });

      if (!verification) {
        return res.status(404).json({
          success: false,
          message: "Verification record not found",
        });
      }

      // Verify OTP
      verification.verifyOTP(otp);
      await verification.save();

      res.json({
        success: true,
        message: "Mobile number verified successfully",
        data: {
          mobileVerified: true,
          verificationCompleted: verification.isCompleted,
        },
      });
    } catch (error) {
      console.error("Mobile OTP verification error:", error);
      res.status(400).json({
        success: false,
        message: error.message || "OTP verification failed",
      });
    }
  },
);

// @route   GET /api/verification/status
// @desc    Get verification status
// @access  Private
router.get("/status", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const verification = await Verification.findOne({ user: user._id });

    const status = {
      emailVerified: user.emailVerified || false,
      mobileVerified: verification?.mobileVerified || false,
      verificationCompleted: verification?.isCompleted || false,
      canResendOTP: true,
    };

    // Check if OTP was recently sent
    if (verification?.otpExpiresAt && new Date() < verification.otpExpiresAt) {
      status.canResendOTP = false;
      status.otpExpiresAt = verification.otpExpiresAt;
    }

    res.json({
      success: true,
      data: status,
    });
  } catch (error) {
    console.error("Get verification status error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get verification status",
      error: error.message,
    });
  }
});

// @route   POST /api/verification/resend-email
// @desc    Resend email verification
// @access  Private
router.post("/resend-email", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

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

    // Find verification record
    let verification = await Verification.findOne({ user: user._id });

    if (!verification) {
      verification = new Verification({
        user: user._id,
        email: user.email,
        mobile: user.mobile,
        emailVerificationToken: crypto.randomBytes(32).toString("hex"),
      });
    } else {
      verification.emailVerificationToken = crypto
        .randomBytes(32)
        .toString("hex");
    }

    await verification.save();

    // Send verification email
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verification.emailVerificationToken}`;

    try {
      await emailService.sendEmailVerification(
        user.email,
        user.fullName,
        verificationUrl,
      );

      res.json({
        success: true,
        message: "Verification email resent successfully",
      });
    } catch (emailError) {
      console.error("Resend email verification failed:", emailError);
      res.status(500).json({
        success: false,
        message: "Failed to resend verification email",
      });
    }
  } catch (error) {
    console.error("Resend email verification error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to resend email verification",
      error: error.message,
    });
  }
});

// @route   GET /api/verification/document
// @desc    Verify document (Invoice) by ID and type
// @access  Public
router.get(
  "/document",
  [
    query("id").notEmpty().withMessage("Document ID is required"),
    query("type")
      .isIn(["invoice"])
      .withMessage("Document type must be invoice"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const { id, type } = req.query;
      let document = null;
      let documentData = {};

      if (type === "invoice") {
        // Check if it's MongoDB ObjectId or Invoice ID
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
          document = await Invoice.findById(id).populate(
            "user",
            "fullName email",
          );
        } else {
          document = await Invoice.findOne({ invoiceId: id }).populate(
            "user",
            "fullName email",
          );
        }

        if (document) {
          documentData = {
            id: document.invoiceId,
            type: "invoice",
            title: `Invoice ${document.invoiceId}`,
            customerName: document.customerDetails?.fullName || "N/A",
            amount: document.total,
            date: document.invoiceDate,
            status: document.status,
            paymentStatus: document.paymentStatus,
            qrCodeData: document.qrCodeData,
            verified: true,
          };
        }
      } else if (type === "letterhead") {
        // Check if it's MongoDB ObjectId or Letter ID
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
          document = await Letterhead.findById(id).populate(
            "createdBy",
            "fullName email",
          );
        } else {
          document = await Letterhead.findOne({ letterId: id }).populate(
            "createdBy",
            "fullName email",
          );
        }

        if (document) {
          documentData = {
            id: document.letterId,
            type: "letterhead",
            title: document.title,
            letterType: document.letterType,
            recipientName: document.recipientFullName,
            subject: document.subject,
            date: document.createdAt,
            status: document.status,
            hostName: document.host.name,
            hostDesignation: document.host.designation,
            qrCodeData: document.qrCodeData,
            verified: true,
          };
        }
      }

      if (!document) {
        return res.status(404).json({
          success: false,
          message: `${type.charAt(0).toUpperCase() + type.slice(1)} not found`,
          verified: false,
        });
      }

      res.json({
        success: true,
        verified: true,
        document: documentData,
        message: `${type.charAt(0).toUpperCase() + type.slice(1)} verified successfully`,
      });
    } catch (error) {
      console.error("Document verification error:", error);
      res.status(500).json({
        success: false,
        message: "Document verification failed",
        error: error.message,
        verified: false,
      });
    }
  },
);

module.exports = router;
