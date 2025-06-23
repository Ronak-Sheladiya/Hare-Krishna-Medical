const express = require("express");
const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");
const Invoice = require("../models/Invoice");
const { adminAuth } = require("../middleware/auth");
const moment = require("moment");

const router = express.Router();

// @route   GET /api/analytics/dashboard
// @desc    Get dashboard statistics
// @access  Admin
router.get("/dashboard", adminAuth, async (req, res) => {
  try {
    // Get current date ranges
    const today = moment().startOf("day");
    const yesterday = moment().subtract(1, "day").startOf("day");
    const thisMonth = moment().startOf("month");
    const lastMonth = moment().subtract(1, "month").startOf("month");
    const thisYear = moment().startOf("year");

    // Parallel execution of all statistics
    const [
      totalOrders,
      totalRevenue,
      totalCustomers,
      totalProducts,
      pendingOrders,
      completedOrders,
      todayOrders,
      monthlyRevenue,
      recentOrders,
      topProducts,
      lowStockProducts,
      invoiceStats,
    ] = await Promise.all([
      // Total orders
      Order.countDocuments(),

      // Total revenue (from completed payments)
      Order.aggregate([
        { $match: { paymentStatus: "Completed" } },
        { $group: { _id: null, total: { $sum: "$total" } } },
      ]),

      // Total customers
      User.countDocuments({ role: 0 }),

      // Total products
      Product.countDocuments({ isActive: true }),

      // Pending orders
      Order.countDocuments({ orderStatus: "Pending" }),

      // Completed orders
      Order.countDocuments({ orderStatus: "Delivered" }),

      // Today's orders
      Order.countDocuments({
        createdAt: { $gte: today.toDate() },
      }),

      // Monthly revenue
      Order.aggregate([
        {
          $match: {
            paymentStatus: "Completed",
            createdAt: { $gte: thisMonth.toDate() },
          },
        },
        { $group: { _id: null, total: { $sum: "$total" } } },
      ]),

      // Recent orders
      Order.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .populate("user", "fullName email")
        .populate("items.product", "name")
        .select("orderId orderStatus total paymentStatus createdAt"),

      // Top selling products
      Product.find({ isActive: true })
        .sort({ sales: -1 })
        .limit(10)
        .select("name sales stock price images"),

      // Low stock products
      Product.find({
        isActive: true,
        $expr: { $lte: ["$stock", "$minStock"] },
      })
        .sort({ stock: 1 })
        .limit(10)
        .select("name stock minStock price"),

      // Invoice statistics
      Invoice.getInvoiceStats(),
    ]);

    // Calculate growth percentages
    const [yesterdayOrders, lastMonthRevenue] = await Promise.all([
      Order.countDocuments({
        createdAt: {
          $gte: yesterday.toDate(),
          $lt: today.toDate(),
        },
      }),
      Order.aggregate([
        {
          $match: {
            paymentStatus: "Completed",
            createdAt: {
              $gte: lastMonth.toDate(),
              $lt: thisMonth.toDate(),
            },
          },
        },
        { $group: { _id: null, total: { $sum: "$total" } } },
      ]),
    ]);

    // Calculate growth rates
    const orderGrowth =
      yesterdayOrders > 0
        ? ((todayOrders - yesterdayOrders) / yesterdayOrders) * 100
        : 0;

    const currentMonthRevenue = monthlyRevenue[0]?.total || 0;
    const previousMonthRevenue = lastMonthRevenue[0]?.total || 0;
    const revenueGrowth =
      previousMonthRevenue > 0
        ? ((currentMonthRevenue - previousMonthRevenue) /
            previousMonthRevenue) *
          100
        : 0;

    // Get order status distribution
    const orderStatusDistribution = await Order.aggregate([
      {
        $group: {
          _id: "$orderStatus",
          count: { $sum: 1 },
        },
      },
    ]);

    // Get payment method distribution
    const paymentMethodDistribution = await Order.aggregate([
      {
        $group: {
          _id: "$paymentMethod",
          count: { $sum: 1 },
          total: { $sum: "$total" },
        },
      },
    ]);

    // Get daily sales for the last 30 days
    const dailySales = await Order.aggregate([
      {
        $match: {
          paymentStatus: "Completed",
          createdAt: {
            $gte: moment().subtract(30, "days").toDate(),
          },
        },
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          },
          orders: { $sum: 1 },
          revenue: { $sum: "$total" },
        },
      },
      { $sort: { "_id.date": 1 } },
    ]);

    // Get category-wise sales
    const categorySales = await Order.aggregate([
      { $unwind: "$items" },
      {
        $lookup: {
          from: "products",
          localField: "items.product",
          foreignField: "_id",
          as: "productInfo",
        },
      },
      { $unwind: "$productInfo" },
      {
        $group: {
          _id: "$productInfo.category",
          quantity: { $sum: "$items.quantity" },
          revenue: { $sum: "$items.total" },
        },
      },
      { $sort: { revenue: -1 } },
    ]);

    res.json({
      success: true,
      data: {
        statistics: {
          totalOrders,
          totalRevenue: totalRevenue[0]?.total || 0,
          totalCustomers,
          totalProducts,
          pendingOrders,
          completedOrders,
          todayOrders,
          monthlyRevenue: currentMonthRevenue,
          orderGrowth: Math.round(orderGrowth * 100) / 100,
          revenueGrowth: Math.round(revenueGrowth * 100) / 100,
        },
        recentOrders,
        topProducts,
        lowStockProducts,
        invoiceStats,
        orderStatusDistribution,
        paymentMethodDistribution,
        dailySales,
        categorySales,
        lastUpdated: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Dashboard analytics error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard analytics",
      error: error.message,
    });
  }
});

// @route   GET /api/analytics/revenue
// @desc    Get revenue analytics
// @access  Admin
router.get("/revenue", adminAuth, async (req, res) => {
  try {
    const { period = "30days", startDate, endDate } = req.query;

    let dateFilter = {};

    if (startDate && endDate) {
      dateFilter = {
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      };
    } else {
      switch (period) {
        case "7days":
          dateFilter = {
            createdAt: { $gte: moment().subtract(7, "days").toDate() },
          };
          break;
        case "30days":
          dateFilter = {
            createdAt: { $gte: moment().subtract(30, "days").toDate() },
          };
          break;
        case "90days":
          dateFilter = {
            createdAt: { $gte: moment().subtract(90, "days").toDate() },
          };
          break;
        case "1year":
          dateFilter = {
            createdAt: { $gte: moment().subtract(1, "year").toDate() },
          };
          break;
      }
    }

    // Revenue trend
    const revenueTrend = await Order.aggregate([
      {
        $match: {
          paymentStatus: "Completed",
          ...dateFilter,
        },
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          },
          revenue: { $sum: "$total" },
          orders: { $sum: 1 },
          avgOrderValue: { $avg: "$total" },
        },
      },
      { $sort: { "_id.date": 1 } },
    ]);

    // Monthly comparison
    const monthlyComparison = await Order.aggregate([
      {
        $match: {
          paymentStatus: "Completed",
          createdAt: { $gte: moment().subtract(12, "months").toDate() },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          revenue: { $sum: "$total" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    // Revenue by payment method
    const revenueByPaymentMethod = await Order.aggregate([
      {
        $match: {
          paymentStatus: "Completed",
          ...dateFilter,
        },
      },
      {
        $group: {
          _id: "$paymentMethod",
          revenue: { $sum: "$total" },
          orders: { $sum: 1 },
          avgOrderValue: { $avg: "$total" },
        },
      },
    ]);

    res.json({
      success: true,
      data: {
        revenueTrend,
        monthlyComparison,
        revenueByPaymentMethod,
      },
    });
  } catch (error) {
    console.error("Revenue analytics error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch revenue analytics",
      error: error.message,
    });
  }
});

// @route   GET /api/analytics/orders
// @desc    Get order analytics
// @access  Admin
router.get("/orders", adminAuth, async (req, res) => {
  try {
    const { period = "30days" } = req.query;

    let dateFilter = {};
    switch (period) {
      case "7days":
        dateFilter = {
          createdAt: { $gte: moment().subtract(7, "days").toDate() },
        };
        break;
      case "30days":
        dateFilter = {
          createdAt: { $gte: moment().subtract(30, "days").toDate() },
        };
        break;
      case "90days":
        dateFilter = {
          createdAt: { $gte: moment().subtract(90, "days").toDate() },
        };
        break;
    }

    // Order trend
    const orderTrend = await Order.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          },
          orders: { $sum: 1 },
          revenue: { $sum: "$total" },
        },
      },
      { $sort: { "_id.date": 1 } },
    ]);

    // Order status distribution
    const statusDistribution = await Order.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: "$orderStatus",
          count: { $sum: 1 },
          totalValue: { $sum: "$total" },
        },
      },
    ]);

    // Average order processing time
    const processingTime = await Order.aggregate([
      {
        $match: {
          orderStatus: "Delivered",
          ...dateFilter,
        },
      },
      {
        $project: {
          processingDays: {
            $divide: [
              { $subtract: ["$actualDeliveryDate", "$createdAt"] },
              1000 * 60 * 60 * 24,
            ],
          },
        },
      },
      {
        $group: {
          _id: null,
          avgProcessingTime: { $avg: "$processingDays" },
          minProcessingTime: { $min: "$processingDays" },
          maxProcessingTime: { $max: "$processingDays" },
        },
      },
    ]);

    res.json({
      success: true,
      data: {
        orderTrend,
        statusDistribution,
        processingTime: processingTime[0] || {},
      },
    });
  } catch (error) {
    console.error("Order analytics error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch order analytics",
      error: error.message,
    });
  }
});

// @route   GET /api/analytics/products
// @desc    Get product analytics
// @access  Admin
router.get("/products", adminAuth, async (req, res) => {
  try {
    // Top selling products
    const topSellingProducts = await Product.find({ isActive: true })
      .sort({ sales: -1 })
      .limit(20)
      .select("name sales stock price category");

    // Category performance
    const categoryPerformance = await Order.aggregate([
      { $unwind: "$items" },
      {
        $lookup: {
          from: "products",
          localField: "items.product",
          foreignField: "_id",
          as: "productInfo",
        },
      },
      { $unwind: "$productInfo" },
      {
        $group: {
          _id: "$productInfo.category",
          totalSales: { $sum: "$items.quantity" },
          totalRevenue: { $sum: "$items.total" },
          uniqueProducts: { $addToSet: "$productInfo._id" },
        },
      },
      {
        $project: {
          _id: 1,
          totalSales: 1,
          totalRevenue: 1,
          productCount: { $size: "$uniqueProducts" },
        },
      },
      { $sort: { totalRevenue: -1 } },
    ]);

    // Stock analysis
    const stockAnalysis = await Product.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: null,
          totalProducts: { $sum: 1 },
          outOfStock: {
            $sum: { $cond: [{ $eq: ["$stock", 0] }, 1, 0] },
          },
          lowStock: {
            $sum: { $cond: [{ $lte: ["$stock", "$minStock"] }, 1, 0] },
          },
          totalStockValue: { $sum: { $multiply: ["$stock", "$price"] } },
          avgStock: { $avg: "$stock" },
        },
      },
    ]);

    // Product performance over time
    const productTrend = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: moment().subtract(30, "days").toDate() },
        },
      },
      { $unwind: "$items" },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          },
          productsSold: { $sum: "$items.quantity" },
          uniqueProducts: { $addToSet: "$items.product" },
        },
      },
      {
        $project: {
          _id: 1,
          productsSold: 1,
          uniqueProductCount: { $size: "$uniqueProducts" },
        },
      },
      { $sort: { "_id.date": 1 } },
    ]);

    res.json({
      success: true,
      data: {
        topSellingProducts,
        categoryPerformance,
        stockAnalysis: stockAnalysis[0] || {},
        productTrend,
      },
    });
  } catch (error) {
    console.error("Product analytics error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch product analytics",
      error: error.message,
    });
  }
});

// @route   GET /api/analytics/customers
// @desc    Get customer analytics
// @access  Admin
router.get("/customers", adminAuth, async (req, res) => {
  try {
    // Customer growth
    const customerGrowth = await User.aggregate([
      { $match: { role: 0 } },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          },
          newCustomers: { $sum: 1 },
        },
      },
      { $sort: { "_id.date": 1 } },
    ]);

    // Top customers by orders
    const topCustomers = await Order.aggregate([
      {
        $group: {
          _id: "$user",
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: "$total" },
          avgOrderValue: { $avg: "$total" },
          lastOrderDate: { $max: "$createdAt" },
        },
      },
      { $sort: { totalSpent: -1 } },
      { $limit: 20 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "customerInfo",
        },
      },
      { $unwind: "$customerInfo" },
      {
        $project: {
          customerName: "$customerInfo.fullName",
          customerEmail: "$customerInfo.email",
          totalOrders: 1,
          totalSpent: 1,
          avgOrderValue: 1,
          lastOrderDate: 1,
        },
      },
    ]);

    // Customer retention analysis
    const retentionAnalysis = await Order.aggregate([
      {
        $group: {
          _id: "$user",
          orderCount: { $sum: 1 },
          firstOrder: { $min: "$createdAt" },
          lastOrder: { $max: "$createdAt" },
        },
      },
      {
        $group: {
          _id: null,
          oneTimeCustomers: {
            $sum: { $cond: [{ $eq: ["$orderCount", 1] }, 1, 0] },
          },
          repeatCustomers: {
            $sum: { $cond: [{ $gt: ["$orderCount", 1] }, 1, 0] },
          },
          avgOrdersPerCustomer: { $avg: "$orderCount" },
        },
      },
    ]);

    res.json({
      success: true,
      data: {
        customerGrowth,
        topCustomers,
        retentionAnalysis: retentionAnalysis[0] || {},
      },
    });
  } catch (error) {
    console.error("Customer analytics error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch customer analytics",
      error: error.message,
    });
  }
});

module.exports = router;
