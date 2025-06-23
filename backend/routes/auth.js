const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");
const { auth } = require("../middleware/auth");
const {
  validateUserRegistration,
  validateUserLogin,
} = require("../middleware/validate");
const emailService = require("../utils/emailService");

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post("/register", validateUserRegistration, async (req, res) => {
  try {
    const { fullName, email, mobile, password, address } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { mobile }],
    });

    if (existingUser) {
      return res.status(400).json({
        message:
          existingUser.email === email
            ? "User with this email already exists"
            : "User with this mobile number already exists",
      });
    }

    // Create new user
    const user = new User({
      fullName,
      email,
      mobile,
      password,
      address,
      emailVerificationToken: crypto.randomBytes(32).toString("hex"),
    });

    await user.save();

    // Generate JWT token
    const token = user.generateAuthToken();

    // Send welcome email
    try {
      await emailService.sendWelcomeEmail(user.email, user.fullName);
    } catch (emailError) {
      console.error("Welcome email failed:", emailError);
    }

    // Emit real-time update
    const io = req.app.get("io");
    io.to("admin-room").emit("new-user-registered", {
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        registeredAt: user.createdAt,
      },
    });

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        address: user.address,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      message: "Registration failed",
      error: error.message,
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post("/login", validateUserLogin, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user and include password for comparison
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    if (!user.isActive) {
      return res.status(400).json({
        message: "Account has been deactivated. Please contact support.",
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    // Update last login
    await user.updateLastLogin();

    // Generate JWT token
    const token = user.generateAuthToken();

    // Emit real-time update
    const io = req.app.get("io");
    io.to("admin-room").emit("user-logged-in", {
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        lastLogin: user.lastLogin,
      },
    });

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        address: user.address,
        lastLogin: user.lastLogin,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      message: "Login failed",
      error: error.message,
    });
  }
});

// @route   GET /api/auth/profile
// @desc    Get user profile
// @access  Private
router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json({
      user,
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    res.status(500).json({
      message: "Failed to fetch profile",
      error: error.message,
    });
  }
});

// @route   PUT /api/auth/update-profile
// @desc    Update user profile
// @access  Private
router.put("/update-profile", auth, async (req, res) => {
  try {
    const { fullName, mobile, address, preferences } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Update fields
    if (fullName) user.fullName = fullName;
    if (mobile) user.mobile = mobile;
    if (address) user.address = address;
    if (preferences) user.preferences = { ...user.preferences, ...preferences };

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        address: user.address,
        preferences: user.preferences,
      },
    });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({
      message: "Profile update failed",
      error: error.message,
    });
  }
});

// @route   POST /api/auth/change-password
// @desc    Change user password
// @access  Private
router.post("/change-password", auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Current password and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "New password must be at least 6 characters",
      });
    }

    const user = await User.findById(req.user.id).select("+password");

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(400).json({
        message: "Current password is incorrect",
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Password change error:", error);
    res.status(500).json({
      message: "Password change failed",
      error: error.message,
    });
  }
});

// @route   POST /api/auth/forgot-password
// @desc    Send password reset email
// @access  Public
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User with this email does not exist",
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save();

    // Send reset email
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    try {
      await emailService.sendPasswordResetEmail(
        user.email,
        user.fullName,
        resetUrl,
      );

      res.json({
        message: "Password reset email sent successfully",
      });
    } catch (emailError) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();

      return res.status(500).json({
        message: "Email could not be sent",
      });
    }
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({
      message: "Failed to process password reset request",
      error: error.message,
    });
  }
});

// @route   POST /api/auth/reset-password/:token
// @desc    Reset password
// @access  Public
router.post("/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    // Hash token to compare with stored hash
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired reset token",
      });
    }

    // Set new password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.json({
      message: "Password reset successful",
    });
  } catch (error) {
    console.error("Password reset error:", error);
    res.status(500).json({
      message: "Password reset failed",
      error: error.message,
    });
  }
});

// @route   POST /api/auth/logout
// @desc    Logout user (client-side token removal)
// @access  Private
router.post("/logout", auth, (req, res) => {
  res.json({
    message: "Logout successful",
  });
});

module.exports = router;
