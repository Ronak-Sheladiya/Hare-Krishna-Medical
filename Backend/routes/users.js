const express = require("express");
const User = require("../models/User");
const { requireAdmin, requireOwnershipOrAdmin } = require("../middleware/auth");
const {
  validationRules,
  handleValidationErrors,
} = require("../middleware/validation");

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get current user profile
// @access  Private
router.get("/profile", async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    res.json({
      success: true,
      data: { user },
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
    });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put(
  "/profile",
  validationRules.userProfileUpdate,
  handleValidationErrors,
  async (req, res) => {
    try {
      const updateData = { ...req.body };
      delete updateData.password; // Don't allow password updates here
      delete updateData.role; // Don't allow role updates
      delete updateData.email; // Don't allow email updates

      const user = await User.findByIdAndUpdate(req.user._id, updateData, {
        new: true,
        runValidators: true,
      }).select("-password");

      res.json({
        success: true,
        message: "Profile updated successfully",
        data: { user },
      });
    } catch (error) {
      console.error("Update profile error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update profile",
      });
    }
  },
);

// @route   GET /api/users
// @desc    Get all users (Admin only)
// @access  Private (Admin)
router.get(
  "/",
  requireAdmin,
  validationRules.pagination,
  handleValidationErrors,
  async (req, res) => {
    try {
      const { page = 1, limit = 20, search, role } = req.query;

      let query = {};

      if (search) {
        query.$or = [
          { fullName: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ];
      }

      if (role) {
        query.role = role;
      }

      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);
      const skip = (pageNum - 1) * limitNum;

      const [users, totalUsers] = await Promise.all([
        User.find(query)
          .select("-password")
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limitNum),
        User.countDocuments(query),
      ]);

      const totalPages = Math.ceil(totalUsers / limitNum);

      res.json({
        success: true,
        data: {
          users,
          pagination: {
            currentPage: pageNum,
            totalPages,
            totalUsers,
            hasNextPage: pageNum < totalPages,
            hasPrevPage: pageNum > 1,
            limit: limitNum,
          },
        },
      });
    } catch (error) {
      console.error("Get users error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch users",
      });
    }
  },
);

module.exports = router;
