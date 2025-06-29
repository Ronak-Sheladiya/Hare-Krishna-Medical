const express = require("express");
const Order = require("../models/Order");
const Product = require("../models/Product");
const { requireAdmin, requireOwnershipOrAdmin } = require("../middleware/auth");
const {
  validationRules,
  handleValidationErrors,
} = require("../middleware/validation");
const { sendOrderConfirmationEmail } = require("../utils/emailService");

const router = express.Router();

// @route   POST /api/orders
// @desc    Create new order
// @access  Private
router.post(
  "/",
  validationRules.orderCreate,
  handleValidationErrors,
  async (req, res) => {
    try {
      const {
        items,
        shippingAddress,
        billingAddress,
        paymentMethod,
        customerNote,
      } = req.body;

      // Validate and calculate order totals
      let subtotal = 0;
      const orderItems = [];

      for (const item of items) {
        const product = await Product.findById(item.productId);

        if (!product || !product.isActive) {
          return res.status(400).json({
            success: false,
            message: `Product not found or inactive: ${item.productId}`,
          });
        }

        if (product.stock < item.quantity) {
          return res.status(400).json({
            success: false,
            message: `Insufficient stock for product: ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`,
          });
        }

        const itemTotal = product.price * item.quantity;
        subtotal += itemTotal;

        orderItems.push({
          product: product._id,
          productName: product.name,
          productImage: product.images?.[0]?.url || "",
          quantity: item.quantity,
          price: product.price,
          totalPrice: itemTotal,
        });
      }

      // Calculate charges
      const shippingCharges = subtotal >= 500 ? 0 : 50; // Free shipping above ₹500
      const tax = Math.round(subtotal * 0.18 * 100) / 100; // 18% GST
      const totalAmount = subtotal + shippingCharges + tax;

      // Create order
      const order = new Order({
        user: req.user._id,
        items: orderItems,
        shippingAddress: shippingAddress || billingAddress,
        billingAddress: billingAddress || shippingAddress,
        subtotal,
        shippingCharges,
        tax,
        totalAmount,
        paymentMethod,
        notes: { customerNote },
      });

      await order.save();

      // Update product stock and sales count
      for (let i = 0; i < items.length; i++) {
        const product = await Product.findById(items[i].productId);
        await product.updateStock(items[i].quantity, "subtract");
        await product.incrementSales(items[i].quantity);
      }

      // Calculate estimated delivery
      order.calculateEstimatedDelivery();
      await order.save();

      await order.populate("user", "fullName email");

      // Send order confirmation email (don't wait for it)
      sendOrderConfirmationEmail(
        order.user.email,
        order.user.fullName,
        order,
      ).catch((err) => console.error("Order confirmation email failed:", err));

      // Emit socket event for real-time updates
      const io = req.app.get("io");
      if (io) {
        io.notifyUser(req.user._id.toString(), "order-created", {
          orderId: order.orderId,
          totalAmount: order.totalAmount,
        });

        io.broadcastToAdmins("new-order", {
          orderId: order.orderId,
          customerName: order.user.fullName,
          totalAmount: order.totalAmount,
          timestamp: order.createdAt,
        });
      }

      res.status(201).json({
        success: true,
        message: "Order placed successfully",
        data: { order },
      });
    } catch (error) {
      console.error("Create order error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create order",
      });
    }
  },
);

// @route   GET /api/orders
// @desc    Get user orders or all orders (admin)
// @access  Private
router.get(
  "/",
  validationRules.pagination,
  handleValidationErrors,
  async (req, res) => {
    try {
      const { page = 1, limit = 10, status, startDate, endDate } = req.query;

      // Build query
      let query = {};

      // Non-admin users can only see their own orders
      if (req.user.role !== "admin") {
        query.user = req.user._id;
      }

      // Filter by status
      if (status) {
        query.orderStatus = status;
      }

      // Filter by date range
      if (startDate || endDate) {
        query.createdAt = {};
        if (startDate) query.createdAt.$gte = new Date(startDate);
        if (endDate) query.createdAt.$lte = new Date(endDate);
      }

      // Pagination
      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);
      const skip = (pageNum - 1) * limitNum;

      const [orders, totalOrders] = await Promise.all([
        Order.find(query)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limitNum)
          .populate("user", "fullName email mobile")
          .populate("items.product", "name images"),
        Order.countDocuments(query),
      ]);

      const totalPages = Math.ceil(totalOrders / limitNum);

      res.json({
        success: true,
        data: {
          orders,
          pagination: {
            currentPage: pageNum,
            totalPages,
            totalOrders,
            hasNextPage: pageNum < totalPages,
            hasPrevPage: pageNum > 1,
            limit: limitNum,
          },
        },
      });
    } catch (error) {
      console.error("Get orders error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch orders",
      });
    }
  },
);

// @route   GET /api/orders/:id
// @desc    Get single order
// @access  Private (Owner or Admin)
router.get(
  "/:id",
  validationRules.mongoId,
  handleValidationErrors,
  async (req, res) => {
    try {
      const order = await Order.findById(req.params.id)
        .populate("user", "fullName email mobile")
        .populate("items.product", "name images company");

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }

      // Check ownership or admin access
      if (
        req.user.role !== "admin" &&
        order.user._id.toString() !== req.user._id.toString()
      ) {
        return res.status(403).json({
          success: false,
          message: "Access denied",
        });
      }

      res.json({
        success: true,
        data: { order },
      });
    } catch (error) {
      console.error("Get order error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch order",
      });
    }
  },
);

// @route   PUT /api/orders/:id/status
// @desc    Update order status
// @access  Private (Admin only)
router.put(
  "/:id/status",
  requireAdmin,
  validationRules.mongoId,
  handleValidationErrors,
  async (req, res) => {
    try {
      const { status, note } = req.body;

      const validStatuses = [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid order status",
        });
      }

      const order = await Order.findById(req.params.id).populate(
        "user",
        "fullName email",
      );

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }

      await order.updateStatus(status, note, req.user._id);

      // Emit socket event for real-time updates
      const io = req.app.get("io");
      if (io) {
        io.notifyUser(order.user._id.toString(), "order-status-update", {
          orderId: order.orderId,
          status: status,
          message: `Your order has been ${status}${note ? ": " + note : ""}`,
        });
      }

      res.json({
        success: true,
        message: "Order status updated successfully",
        data: { order },
      });
    } catch (error) {
      console.error("Update order status error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update order status",
      });
    }
  },
);

// @route   POST /api/orders/:id/cancel
// @desc    Cancel order
// @access  Private (Owner or Admin)
router.post(
  "/:id/cancel",
  validationRules.mongoId,
  handleValidationErrors,
  async (req, res) => {
    try {
      const { reason } = req.body;

      if (!reason || reason.trim().length < 5) {
        return res.status(400).json({
          success: false,
          message: "Cancellation reason is required (minimum 5 characters)",
        });
      }

      const order = await Order.findById(req.params.id).populate(
        "user",
        "fullName email",
      );

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }

      // Check ownership or admin access
      if (
        req.user.role !== "admin" &&
        order.user._id.toString() !== req.user._id.toString()
      ) {
        return res.status(403).json({
          success: false,
          message: "Access denied",
        });
      }

      if (!order.canBeCancelled) {
        return res.status(400).json({
          success: false,
          message: "Order cannot be cancelled in current status",
        });
      }

      await order.cancelOrder(reason, req.user._id);

      // Restore product stock
      for (const item of order.items) {
        const product = await Product.findById(item.product);
        if (product) {
          await product.updateStock(item.quantity, "add");
        }
      }

      // Emit socket event
      const io = req.app.get("io");
      if (io) {
        io.notifyUser(order.user._id.toString(), "order-cancelled", {
          orderId: order.orderId,
          reason: reason,
        });

        io.broadcastToAdmins("order-cancelled", {
          orderId: order.orderId,
          customerName: order.user.fullName,
          reason: reason,
        });
      }

      res.json({
        success: true,
        message: "Order cancelled successfully",
        data: { order },
      });
    } catch (error) {
      console.error("Cancel order error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to cancel order",
      });
    }
  },
);

// @route   GET /api/orders/stats/summary
// @desc    Get order statistics
// @access  Private (Admin only)
router.get("/stats/summary", requireAdmin, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const stats = await Order.getOrderStats(startDate, endDate);

    res.json({
      success: true,
      data: { stats },
    });
  } catch (error) {
    console.error("Get order stats error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch order statistics",
    });
  }
});

module.exports = router;
