const express = require("express");
const { auth } = require("../middleware/auth");
const {
  validateUserRegistration,
  validateUserLogin,
} = require("../middleware/validate");
const authController = require("../controllers/authController");

const router = express.Router();

// @route   GET /api/auth/register
// @desc    Handle incorrect GET requests to register endpoint
// @access  Public
router.get("/register", (req, res) => {
  res.status(405).json({
    success: false,
    message: "Method Not Allowed. Use POST to register a new user.",
    hint: "This endpoint requires a POST request with user registration data.",
    correctMethod: "POST",
    endpoint: "/api/auth/register",
    timestamp: new Date().toISOString(),
  });
});

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post("/register", validateUserRegistration, authController.register);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post("/login", validateUserLogin, authController.login);

// @route   GET /api/auth/profile
// @desc    Get user profile
// @access  Private
router.get("/profile", auth, authController.getProfile);

// @route   PUT /api/auth/update-profile
// @desc    Update user profile
// @access  Private
router.put("/update-profile", auth, authController.updateProfile);

// @route   POST /api/auth/change-password
// @desc    Change user password
// @access  Private
router.post("/change-password", auth, authController.changePassword);

// @route   POST /api/auth/forgot-password
// @desc    Send password reset email
// @access  Public
router.post("/forgot-password", authController.forgotPassword);

// @route   POST /api/auth/reset-password/:token
// @desc    Reset password
// @access  Public
router.post("/reset-password/:token", authController.resetPassword);

// @route   POST /api/auth/verify-otp
// @desc    Verify email OTP
// @access  Public
router.post("/verify-otp", authController.verifyOtp);

// @route   POST /api/auth/resend-otp
// @desc    Resend email OTP
// @access  Public
router.post("/resend-otp", authController.resendOtp);

// @route   POST /api/auth/logout
// @desc    Logout user (client-side token removal)
// @access  Private
router.post("/logout", auth, authController.logout);

module.exports = router;
