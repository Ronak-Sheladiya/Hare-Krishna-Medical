const express = require("express");
const { auth, adminAuth } = require("../middleware/auth");
const {
  validateObjectId,
  validatePagination,
} = require("../middleware/validate");
const usersController = require("../controllers/usersController");

const router = express.Router();

// @route   GET /api/users/dashboard
// @desc    Get user dashboard data
// @access  Private
router.get("/dashboard", auth, usersController.getDashboard);

// @route   GET /api/users/dashboard-stats
// @desc    Get user dashboard statistics
// @access  Private
router.get("/dashboard-stats", auth, usersController.getDashboardStats);

// @route   GET /api/users/profile
// @desc    Get user profile with order history
// @access  Private
router.get("/profile", auth, usersController.getProfile);

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put("/profile", auth, usersController.updateProfile);

// @route   GET /api/users/admin/all
// @desc    Get all users (Admin)
// @access  Admin
router.get(
  "/admin/all",
  adminAuth,
  validatePagination,
  usersController.getAllUsers,
);

// @route   GET /api/users/admin/stats
// @desc    Get user statistics
// @access  Admin
router.get("/admin/stats", adminAuth, usersController.getUserStats);

// @route   PUT /api/users/admin/:id/status
// @desc    Update user status (Admin)
// @access  Admin
router.put(
  "/admin/:id/status",
  adminAuth,
  validateObjectId("id"),
  usersController.updateUserStatus,
);

// @route   PUT /api/users/admin/:id/role
// @desc    Update user role (Admin)
// @access  Admin
router.put(
  "/admin/:id/role",
  adminAuth,
  validateObjectId("id"),
  usersController.updateUserRole,
);

// @route   DELETE /api/users/admin/:id
// @desc    Delete user (Admin)
// @access  Admin
router.delete(
  "/admin/:id",
  adminAuth,
  validateObjectId("id"),
  usersController.deleteUser,
);

// @route   POST /api/users/upload-profile-image
// @desc    Upload profile image to database
// @access  Private
router.post("/upload-profile-image", auth, usersController.uploadProfileImage);

// @route   DELETE /api/users/delete-profile-image/:userId
// @desc    Delete profile image
// @access  Private
router.delete(
  "/delete-profile-image/:userId",
  auth,
  usersController.deleteProfileImage,
);

module.exports = router;
