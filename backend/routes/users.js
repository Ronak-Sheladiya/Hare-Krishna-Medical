const express = require("express");
const User = require("../models/User");
const Order = require("../models/Order");
const { auth, adminAuth } = require("../middleware/auth");
const {
  validateObjectId,
  validatePagination,
} = require("../middleware/validate");

const router = express.Router();

// @route   GET /api/users/dashboard
// @desc    Get user dashboard data
// @access  Private
router.get("/dashboard", auth, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user orders statistics
    const [orderStats, recentOrders, recentInvoices] = await Promise.all([
      Order.aggregate([
        { $match: { user: userId } },
        {
          $group: {
            _id: null,
            totalOrders: { $sum: 1 },
            totalSpent: { $sum: "$total" },
            pendingOrders: {
              $sum: { $cond: [{ $eq: ["$orderStatus", "Pending"] }, 1, 0] },
            },
            completedOrders: {
              $sum: { $cond: [{ $eq: ["$orderStatus", "Delivered"] }, 1, 0] },
            },
          },
        },
      ]),
      Order.find({ user: userId })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("items.product", "name images")
        .select("orderId orderStatus total createdAt"),
      Order.find({ user: userId, invoice: { $exists: true } })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("invoice", "invoiceId status paymentStatus total")
        .select("orderId"),
    ]);

    const stats = orderStats[0] || {
      totalOrders: 0,
      totalSpent: 0,
      pendingOrders: 0,
      completedOrders: 0,
    };

    res.json({
      success: true,
      data: {
        statistics: stats,
        recentOrders,
        recentInvoices,
      },
    });
  } catch (error) {
    console.error("User dashboard error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard data",
      error: error.message,
    });
  }
});

// @route   GET /api/users/profile
// @desc    Get user profile with order history
// @access  Private
router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    // Get user order statistics
    const orderStats = await Order.aggregate([
      { $match: { user: req.user.id } },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: "$total" },
          lastOrderDate: { $max: "$createdAt" },
        },
      },
    ]);

    res.json({
      success: true,
      data: {
        user,
        orderStats: orderStats[0] || {
          totalOrders: 0,
          totalSpent: 0,
          lastOrderDate: null,
        },
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
      error: error.message,
    });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put("/profile", auth, async (req, res) => {
  try {
    const { fullName, mobile, address, preferences } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update allowed fields
    if (fullName) user.fullName = fullName;
    if (mobile) user.mobile = mobile;
    if (address) user.address = { ...user.address, ...address };
    if (preferences) user.preferences = { ...user.preferences, ...preferences };

    await user.save();

    // Remove password from response
    const updatedUser = user.toObject();
    delete updatedUser.password;

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update profile",
      error: error.message,
    });
  }
});

// @route   GET /api/users/admin/all
// @desc    Get all users (Admin)
// @access  Admin
router.get("/admin/all", adminAuth, validatePagination, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      role,
      isActive,
      startDate,
      endDate,
    } = req.query;

    // Build filter
    const filter = {};

    if (search) {
      filter.$or = [
        { fullName: new RegExp(search, "i") },
        { email: new RegExp(search, "i") },
        { mobile: new RegExp(search, "i") },
      ];
    }

    if (role !== undefined) filter.role = parseInt(role);
    if (isActive !== undefined) filter.isActive = isActive === "true";

    // Date range filter
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const [users, totalUsers] = await Promise.all([
      User.find(filter)
        .select("-password")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      User.countDocuments(filter),
    ]);

    // Get order statistics for each user
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const orderStats = await Order.aggregate([
          { $match: { user: user._id } },
          {
            $group: {
              _id: null,
              totalOrders: { $sum: 1 },
              totalSpent: { $sum: "$total" },
              lastOrderDate: { $max: "$createdAt" },
            },
          },
        ]);

        return {
          ...user.toObject(),
          orderStats: orderStats[0] || {
            totalOrders: 0,
            totalSpent: 0,
            lastOrderDate: null,
          },
        };
      }),
    );

    // Calculate pagination info
    const totalPages = Math.ceil(totalUsers / limit);

    res.json({
      success: true,
      data: usersWithStats,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalUsers,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message,
    });
  }
});

// @route   GET /api/users/admin/stats
// @desc    Get user statistics
// @access  Admin
router.get("/admin/stats", adminAuth, async (req, res) => {
  try {
    const [userStats, registrationTrend, topCustomers] = await Promise.all([
      // User statistics
      User.aggregate([
        {
          $group: {
            _id: null,
            totalUsers: { $sum: 1 },
            activeUsers: {
              $sum: { $cond: [{ $eq: ["$isActive", true] }, 1, 0] },
            },
            adminUsers: { $sum: { $cond: [{ $eq: ["$role", 1] }, 1, 0] } },
            regularUsers: { $sum: { $cond: [{ $eq: ["$role", 0] }, 1, 0] } },
            verifiedUsers: {
              $sum: { $cond: [{ $eq: ["$emailVerified", true] }, 1, 0] },
            },
          },
        },
      ]),

      // Registration trend (last 30 days)
      User.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            },
          },
        },
        {
          $group: {
            _id: {
              date: {
                $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
              },
            },
            registrations: { $sum: 1 },
          },
        },
        { $sort: { "_id.date": 1 } },
      ]),

      // Top customers by orders
      Order.aggregate([
        {
          $group: {
            _id: "$user",
            totalOrders: { $sum: 1 },
            totalSpent: { $sum: "$total" },
          },
        },
        { $sort: { totalSpent: -1 } },
        { $limit: 10 },
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "userInfo",
          },
        },
        { $unwind: "$userInfo" },
        {
          $project: {
            customerName: "$userInfo.fullName",
            customerEmail: "$userInfo.email",
            totalOrders: 1,
            totalSpent: 1,
          },
        },
      ]),
    ]);

    res.json({
      success: true,
      data: {
        userStats: userStats[0] || {},
        registrationTrend,
        topCustomers,
      },
    });
  } catch (error) {
    console.error("User stats error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user statistics",
      error: error.message,
    });
  }
});

// @route   PUT /api/users/admin/:id/status
// @desc    Update user status (Admin)
// @access  Admin
router.put(
  "/admin/:id/status",
  adminAuth,
  validateObjectId("id"),
  async (req, res) => {
    try {
      const { isActive } = req.body;

      if (typeof isActive !== "boolean") {
        return res.status(400).json({
          success: false,
          message: "isActive must be a boolean value",
        });
      }

      const user = await User.findById(req.params.id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Prevent deactivating admin users
      if (user.role === 1 && !isActive) {
        return res.status(400).json({
          success: false,
          message: "Cannot deactivate admin users",
        });
      }

      user.isActive = isActive;
      await user.save();

      // Emit real-time update
      const io = req.app.get("io");
      io.to("admin-room").emit("user-status-updated", {
        userId: user._id,
        userName: user.fullName,
        newStatus: isActive ? "Active" : "Inactive",
        updatedBy: req.user.fullName,
      });

      res.json({
        success: true,
        message: `User ${isActive ? "activated" : "deactivated"} successfully`,
        data: {
          userId: user._id,
          isActive: user.isActive,
        },
      });
    } catch (error) {
      console.error("Update user status error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update user status",
        error: error.message,
      });
    }
  },
);

// @route   PUT /api/users/admin/:id/role
// @desc    Update user role (Admin)
// @access  Admin
router.put(
  "/admin/:id/role",
  adminAuth,
  validateObjectId("id"),
  async (req, res) => {
    try {
      const { role } = req.body;

      if (![0, 1].includes(role)) {
        return res.status(400).json({
          success: false,
          message: "Role must be 0 (User) or 1 (Admin)",
        });
      }

      const user = await User.findById(req.params.id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Prevent changing own role
      if (user._id.toString() === req.user.id) {
        return res.status(400).json({
          success: false,
          message: "Cannot change your own role",
        });
      }

      user.role = role;
      await user.save();

      // Emit real-time update
      const io = req.app.get("io");
      io.to("admin-room").emit("user-role-updated", {
        userId: user._id,
        userName: user.fullName,
        newRole: role === 1 ? "Admin" : "User",
        updatedBy: req.user.fullName,
      });

      res.json({
        success: true,
        message: `User role updated to ${role === 1 ? "Admin" : "User"} successfully`,
        data: {
          userId: user._id,
          role: user.role,
        },
      });
    } catch (error) {
      console.error("Update user role error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update user role",
        error: error.message,
      });
    }
  },
);

// @route   DELETE /api/users/admin/:id
// @desc    Delete user (Admin)
// @access  Admin
router.delete(
  "/admin/:id",
  adminAuth,
  validateObjectId("id"),
  async (req, res) => {
    try {
      const user = await User.findById(req.params.id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Prevent deleting admin users
      if (user.role === 1) {
        return res.status(400).json({
          success: false,
          message: "Cannot delete admin users",
        });
      }

      // Prevent deleting own account
      if (user._id.toString() === req.user.id) {
        return res.status(400).json({
          success: false,
          message: "Cannot delete your own account",
        });
      }

      await User.findByIdAndDelete(req.params.id);

      // Emit real-time update
      const io = req.app.get("io");
      io.to("admin-room").emit("user-deleted", {
        userId: user._id,
        userName: user.fullName,
        deletedBy: req.user.fullName,
      });

      res.json({
        success: true,
        message: "User deleted successfully",
      });
    } catch (error) {
      console.error("Delete user error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to delete user",
        error: error.message,
      });
    }
  },
);

// @route   POST /api/users/upload-profile-image
// @desc    Upload profile image to database
// @access  Private
router.post("/upload-profile-image", auth, async (req, res) => {
  try {
    const { userId, imageData } = req.body;

    // Validate user ID matches authenticated user or is admin
    if (req.user.id !== userId && req.user.role !== 1) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to update this profile",
      });
    }

    // Validate image data
    if (!imageData || !imageData.startsWith("data:image/")) {
      return res.status(400).json({
        success: false,
        message: "Invalid image data provided",
      });
    }

    // Check image size (base64 encoded, roughly 1.37x the actual size)
    const imageSizeBytes = (imageData.length * 3) / 4;
    const maxSizeBytes = 5 * 1024 * 1024; // 5MB

    if (imageSizeBytes > maxSizeBytes) {
      return res.status(400).json({
        success: false,
        message: "Image size too large. Maximum 5MB allowed.",
      });
    }

    // Update user profile image
    const user = await User.findByIdAndUpdate(
      userId,
      { profileImage: imageData },
      { new: true, runValidators: true },
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "Profile image uploaded successfully",
      data: {
        imageUrl: imageData,
        user,
      },
    });
  } catch (error) {
    console.error("Profile image upload error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to upload profile image",
      error: error.message,
    });
  }
});

// @route   DELETE /api/users/delete-profile-image/:userId
// @desc    Delete profile image
// @access  Private
router.delete("/delete-profile-image/:userId", auth, async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate user ID matches authenticated user or is admin
    if (req.user.id !== userId && req.user.role !== 1) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to update this profile",
      });
    }

    // Update user to remove profile image
    const user = await User.findByIdAndUpdate(
      userId,
      { $unset: { profileImage: 1 } },
      { new: true, runValidators: true },
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "Profile image deleted successfully",
      data: { user },
    });
  } catch (error) {
    console.error("Profile image delete error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete profile image",
      error: error.message,
    });
  }
});

module.exports = router;
