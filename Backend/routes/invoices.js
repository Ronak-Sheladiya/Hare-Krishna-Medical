const express = require("express");
const Invoice = require("../models/Invoice");
const Order = require("../models/Order");
const {
  authenticateToken,
  requireAdmin,
  optionalAuth,
} = require("../middleware/auth");
const {
  validationRules,
  handleValidationErrors,
} = require("../middleware/validation");

const router = express.Router();

// @route   GET /api/invoices/:id/verify
// @desc    Verify and view invoice (public access for QR verification)
// @access  Public
router.get("/:id/verify", optionalAuth, async (req, res) => {
  try {
    const invoice = await Invoice.findOne({ invoiceId: req.params.id })
      .populate("order")
      .populate("user", "fullName email mobile");

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
    }

    // Increment view count
    invoice
      .incrementViewCount()
      .catch((err) => console.error("Failed to increment view count:", err));

    // Return limited data for public verification
    const publicData = {
      invoiceId: invoice.invoiceId,
      invoiceNumber: invoice.invoiceNumber,
      invoiceDate: invoice.invoiceDate,
      status: invoice.status,
      totalAmount: invoice.totalAmount,
      customerInfo: {
        name: invoice.customerInfo.name,
      },
      companyInfo: invoice.companyInfo,
      items: invoice.items.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
      })),
      subtotal: invoice.subtotal,
      taxDetails: invoice.taxDetails,
      isVerified: true,
    };

    res.json({
      success: true,
      data: { invoice: publicData },
    });
  } catch (error) {
    console.error("Verify invoice error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to verify invoice",
    });
  }
});

// @route   GET /api/invoices
// @desc    Get user invoices or all invoices (admin)
// @access  Private
router.get(
  "/",
  authenticateToken,
  validationRules.pagination,
  handleValidationErrors,
  async (req, res) => {
    try {
      const { page = 1, limit = 10, status } = req.query;

      let query = {};

      // Non-admin users can only see their own invoices
      if (req.user.role !== "admin") {
        query.user = req.user._id;
      }

      if (status) {
        query.status = status;
      }

      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);
      const skip = (pageNum - 1) * limitNum;

      const [invoices, totalInvoices] = await Promise.all([
        Invoice.find(query)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limitNum)
          .populate("user", "fullName email")
          .populate("order", "orderId"),
        Invoice.countDocuments(query),
      ]);

      const totalPages = Math.ceil(totalInvoices / limitNum);

      res.json({
        success: true,
        data: {
          invoices,
          pagination: {
            currentPage: pageNum,
            totalPages,
            totalInvoices,
            hasNextPage: pageNum < totalPages,
            hasPrevPage: pageNum > 1,
            limit: limitNum,
          },
        },
      });
    } catch (error) {
      console.error("Get invoices error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch invoices",
      });
    }
  },
);

// @route   POST /api/invoices/generate/:orderId
// @desc    Generate invoice for order
// @access  Private (Admin only)
router.post(
  "/generate/:orderId",
  authenticateToken,
  requireAdmin,
  validationRules.mongoId,
  handleValidationErrors,
  async (req, res) => {
    try {
      const order = await Order.findById(req.params.orderId).populate("user");

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }

      // Check if invoice already exists
      const existingInvoice = await Invoice.findOne({ order: order._id });
      if (existingInvoice) {
        return res.status(400).json({
          success: false,
          message: "Invoice already exists for this order",
          data: { invoice: existingInvoice },
        });
      }

      // Create invoice from order
      const invoice = new Invoice({
        order: order._id,
        user: order.user._id,
        customerInfo: {
          name: order.shippingAddress.fullName,
          email: order.user.email,
          mobile: order.shippingAddress.mobile,
          address: {
            street: order.shippingAddress.street,
            city: order.shippingAddress.city,
            state: order.shippingAddress.state,
            pincode: order.shippingAddress.pincode,
            landmark: order.shippingAddress.landmark,
          },
        },
        items: order.items.map((item) => ({
          productId: item.product,
          name: item.productName,
          quantity: item.quantity,
          unitPrice: item.price,
          totalPrice: item.totalPrice,
        })),
        subtotal: order.subtotal,
        shippingCharges: order.shippingCharges,
        totalAmount: order.totalAmount,
        paymentDetails: {
          method: order.paymentMethod,
          status: order.paymentStatus === "completed" ? "paid" : "pending",
        },
        createdBy: req.user._id,
      });

      // Calculate GST
      invoice.calculateGST(false); // Assuming intra-state for now

      await invoice.save();

      // Update order with invoice info
      order.invoice = {
        invoiceId: invoice.invoiceId,
        invoiceDate: invoice.invoiceDate,
      };
      await order.save();

      res.status(201).json({
        success: true,
        message: "Invoice generated successfully",
        data: { invoice },
      });
    } catch (error) {
      console.error("Generate invoice error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to generate invoice",
      });
    }
  },
);

module.exports = router;
