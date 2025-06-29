const express = require("express");
const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");
const Message = require("../models/Message");

const router = express.Router();

// @route   GET /api/analytics/dashboard
// @desc    Get dashboard analytics
// @access  Private (Admin only)
router.get("/dashboard", async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Date range for queries
    const dateFilter = {};
    if (startDate && endDate) {
      dateFilter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    // Get various statistics
    const [
      orderStats,
      userStats,
      productStats,
      messageStats,
      recentOrders,
      topProducts,
    ] = await Promise.all([
      // Order statistics
      Order.aggregate([
        { $match: dateFilter },
        {
          $group: {
            _id: null,
            totalOrders: { $sum: 1 },
            totalRevenue: { $sum: "$totalAmount" },
            avgOrderValue: { $avg: "$totalAmount" },
            pendingOrders: {
              $sum: { $cond: [{ $eq: ["$orderStatus", "pending"] }, 1, 0] },
            },
            deliveredOrders: {
              $sum: { $cond: [{ $eq: ["$orderStatus", "delivered"] }, 1, 0] },
            },
          },
        },
      ]),

      // User statistics
      User.aggregate([
        { $match: dateFilter },
        {
          $group: {
            _id: null,
            totalUsers: { $sum: 1 },
            activeUsers: {
              $sum: { $cond: [{ $eq: ["$isActive", true] }, 1, 0] },
            },
            verifiedUsers: {
              $sum: { $cond: [{ $eq: ["$isVerified", true] }, 1, 0] },
            },
          },
        },
      ]),

      // Product statistics
      Product.aggregate([
        { $match: { isActive: true } },
        {
          $group: {
            _id: null,
            totalProducts: { $sum: 1 },
            lowStockProducts: {
              $sum: { $cond: [{ $lte: ["$stock", 10] }, 1, 0] },
            },
            outOfStockProducts: {
              $sum: { $cond: [{ $eq: ["$stock", 0] }, 1, 0] },
            },
            featuredProducts: {
              $sum: { $cond: [{ $eq: ["$isFeatured", true] }, 1, 0] },
            },
          },
        },
      ]),

      // Message statistics
      Message.aggregate([
        { $match: { ...dateFilter, isArchived: false } },
        {
          $group: {
            _id: null,
            totalMessages: { $sum: 1 },
            newMessages: {
              $sum: { $cond: [{ $eq: ["$status", "new"] }, 1, 0] },
            },
            resolvedMessages: {
              $sum: { $cond: [{ $eq: ["$status", "resolved"] }, 1, 0] },
            },
          },
        },
      ]),

      // Recent orders
      Order.find(dateFilter)
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("user", "fullName email")
        .select("orderId orderStatus totalAmount createdAt"),

      // Top selling products
      Product.find({ isActive: true })
        .sort({ salesCount: -1 })
        .limit(5)
        .select("name salesCount stock price"),
    ]);

    res.json({
      success: true,
      data: {
        orders: orderStats[0] || {
          totalOrders: 0,
          totalRevenue: 0,
          avgOrderValue: 0,
          pendingOrders: 0,
          deliveredOrders: 0,
        },
        users: userStats[0] || {
          totalUsers: 0,
          activeUsers: 0,
          verifiedUsers: 0,
        },
        products: productStats[0] || {
          totalProducts: 0,
          lowStockProducts: 0,
          outOfStockProducts: 0,
          featuredProducts: 0,
        },
        messages: messageStats[0] || {
          totalMessages: 0,
          newMessages: 0,
          resolvedMessages: 0,
        },
        recentOrders,
        topProducts,
      },
    });
  } catch (error) {
    console.error("Get dashboard analytics error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch analytics data",
    });
  }
});

module.exports = router;
