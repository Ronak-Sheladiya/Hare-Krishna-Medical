const express = require("express");
const { adminAuth } = require("../middleware/auth");
const analyticsController = require("../controllers/analyticsController");

const router = express.Router();

// @route   GET /api/analytics/dashboard
// @desc    Get dashboard statistics
// @access  Admin
router.get("/dashboard", adminAuth, analyticsController.getDashboard);

// @route   GET /api/analytics/dashboard-stats
// @desc    Get dashboard statistics (alias)
// @access  Admin
router.get("/dashboard-stats", adminAuth, analyticsController.getDashboard);

// @route   GET /api/analytics/revenue
// @desc    Get revenue analytics
// @access  Admin
router.get("/revenue", adminAuth, analyticsController.getRevenue);

// @route   GET /api/analytics/orders
// @desc    Get order analytics
// @access  Admin
router.get("/orders", adminAuth, analyticsController.getOrders);

// @route   GET /api/analytics/products
// @desc    Get product analytics
// @access  Admin
router.get("/products", adminAuth, analyticsController.getProducts);

// @route   GET /api/analytics/customers
// @desc    Get customer analytics
// @access  Admin
router.get("/customers", adminAuth, analyticsController.getCustomers);

module.exports = router;
