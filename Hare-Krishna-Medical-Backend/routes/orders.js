const express = require("express");
const { auth, adminAuth } = require("../middleware/auth");
const {
  validateOrder,
  validateObjectId,
  validatePagination,
} = require("../middleware/validate");
const ordersController = require("../controllers/ordersController");

const router = express.Router();

// @route   POST /api/orders
// @desc    Create new order
// @access  Private
router.post("/", auth, validateOrder, ordersController.createOrder);

// @route   GET /api/orders
// @desc    Get user orders
// @access  Private
router.get("/", auth, validatePagination, ordersController.getUserOrders);

// @route   GET /api/orders/admin/all
// @desc    Get all orders (Admin)
// @access  Admin
router.get(
  "/admin/all",
  adminAuth,
  validatePagination,
  ordersController.getAllOrders,
);

// @route   GET /api/orders/:id
// @desc    Get single order
// @access  Private
router.get("/:id", auth, validateObjectId("id"), ordersController.getOrder);

// @route   PUT /api/orders/:id/status
// @desc    Update order status
// @access  Admin
router.put(
  "/:id/status",
  adminAuth,
  validateObjectId("id"),
  ordersController.updateOrderStatus,
);

// @route   POST /api/orders/:id/cancel
// @desc    Cancel order
// @access  Private
router.post(
  "/:id/cancel",
  auth,
  validateObjectId("id"),
  ordersController.cancelOrder,
);

module.exports = router;
