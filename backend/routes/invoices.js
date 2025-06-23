const express = require("express");
const Invoice = require("../models/Invoice");
const Order = require("../models/Order");
const { auth, adminAuth } = require("../middleware/auth");
const {
  validateObjectId,
  validatePagination,
} = require("../middleware/validate");
const QRCode = require("qrcode");

const router = express.Router();

// @route   GET /api/invoices
// @desc    Get user invoices
// @access  Private
router.get("/", auth, validatePagination, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      paymentStatus,
      startDate,
      endDate,
    } = req.query;

    // Build filter
    const filter = { user: req.user.id };

    if (status) filter.status = status;
    if (paymentStatus) filter.paymentStatus = paymentStatus;

    // Date range filter
    if (startDate || endDate) {
      filter.invoiceDate = {};
      if (startDate) filter.invoiceDate.$gte = new Date(startDate);
      if (endDate) filter.invoiceDate.$lte = new Date(endDate);
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const [invoices, totalInvoices] = await Promise.all([
      Invoice.find(filter)
        .sort({ invoiceDate: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .populate("order", "orderId orderStatus")
        .populate("user", "fullName email"),
      Invoice.countDocuments(filter),
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(totalInvoices / limit);

    res.json({
      success: true,
      data: invoices,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalInvoices,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    console.error("Get invoices error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch invoices",
      error: error.message,
    });
  }
});

// @route   GET /api/invoices/:id
// @desc    Get single invoice
// @access  Private
router.get("/:id", auth, validateObjectId("id"), async (req, res) => {
  try {
    let filter = { _id: req.params.id };

    // Non-admin users can only access their own invoices
    if (req.user.role !== 1) {
      filter.user = req.user.id;
    }

    const invoice = await Invoice.findOne(filter)
      .populate("order", "orderId orderStatus items shippingAddress")
      .populate("user", "fullName email mobile");

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
    }

    res.json({
      success: true,
      data: invoice,
    });
  } catch (error) {
    console.error("Get invoice error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch invoice",
      error: error.message,
    });
  }
});

// @route   GET /api/invoices/verify/:invoiceId
// @desc    Verify invoice by invoice ID (Public access for QR verification)
// @access  Public
router.get("/verify/:invoiceId", async (req, res) => {
  try {
    const { invoiceId } = req.params;

    const invoice = await Invoice.findOne({ invoiceId })
      .populate("order", "orderId orderStatus")
      .populate("user", "fullName email mobile");

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
    }

    // Return only necessary info for verification
    const verificationData = {
      invoiceId: invoice.invoiceId,
      invoiceDate: invoice.invoiceDate,
      customerName: invoice.customerDetails.fullName,
      customerEmail: invoice.customerDetails.email,
      customerMobile: invoice.customerDetails.mobile,
      total: invoice.total,
      status: invoice.status,
      paymentStatus: invoice.paymentStatus,
      paymentMethod: invoice.paymentMethod,
      items: invoice.items.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        total: item.total,
      })),
      subtotal: invoice.subtotal,
      tax: invoice.tax,
      shipping: invoice.shipping,
      qrCode: invoice.qrCode,
      companyInfo: {
        name: "Hare Krishna Medical",
        address:
          "3 Sahyog Complex, Man Sarovar circle, Amroli, 394107, Gujarat",
        phone: "+91 76989 13354",
        email: "hkmedicalamroli@gmail.com",
      },
    };

    res.json({
      success: true,
      data: verificationData,
    });
  } catch (error) {
    console.error("Verify invoice error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to verify invoice",
      error: error.message,
    });
  }
});

// @route   PUT /api/invoices/:id/payment-status
// @desc    Update invoice payment status
// @access  Admin
router.put(
  "/:id/payment-status",
  adminAuth,
  validateObjectId("id"),
  async (req, res) => {
    try {
      const { status, method } = req.body;

      const validStatuses = ["Pending", "Completed", "Failed", "Refunded"];
      const validMethods = ["COD", "Online", "Card", "UPI"];

      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid payment status",
        });
      }

      if (method && !validMethods.includes(method)) {
        return res.status(400).json({
          success: false,
          message: "Invalid payment method",
        });
      }

      const invoice = await Invoice.findById(req.params.id).populate(
        "order user",
      );

      if (!invoice) {
        return res.status(404).json({
          success: false,
          message: "Invoice not found",
        });
      }

      // Update invoice payment status
      await invoice.updatePaymentStatus(status, method);

      // Update related order payment status
      if (invoice.order) {
        invoice.order.paymentStatus = status;
        if (method) {
          invoice.order.paymentMethod = method;
        }
        await invoice.order.save();
      }

      // Emit real-time updates
      const io = req.app.get("io");

      // Notify admin
      io.to("admin-room").emit("payment-status-updated", {
        invoiceId: invoice._id,
        invoiceNumber: invoice.invoiceId,
        newStatus: status,
        newMethod: method,
        updatedBy: req.user.fullName,
        customerName: invoice.customerDetails.fullName,
      });

      // Notify user
      if (invoice.user) {
        io.to(`user-${invoice.user._id}`).emit("payment-status-changed", {
          invoiceId: invoice._id,
          invoiceNumber: invoice.invoiceId,
          newStatus: status,
          orderId: invoice.order?._id,
        });
      }

      res.json({
        success: true,
        message: "Payment status updated successfully",
        data: {
          paymentStatus: invoice.paymentStatus,
          paymentMethod: invoice.paymentMethod,
          paymentDate: invoice.paymentDate,
          status: invoice.status,
        },
      });
    } catch (error) {
      console.error("Update payment status error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update payment status",
        error: error.message,
      });
    }
  },
);

// @route   POST /api/invoices/:id/regenerate-qr
// @desc    Regenerate QR code for invoice
// @access  Admin
router.post(
  "/:id/regenerate-qr",
  adminAuth,
  validateObjectId("id"),
  async (req, res) => {
    try {
      const invoice = await Invoice.findById(req.params.id);

      if (!invoice) {
        return res.status(404).json({
          success: false,
          message: "Invoice not found",
        });
      }

      // Generate new QR code with direct verification URL
      const verificationUrl = `${process.env.FRONTEND_URL}/invoice-verify/${invoice.invoiceId}`;

      invoice.qrCodeData = JSON.stringify({
        invoice_id: invoice.invoiceId,
        customer_name: invoice.customerDetails.fullName,
        total_amount: invoice.total,
        verification_url: verificationUrl,
        generated_at: new Date().toISOString(),
      });

      invoice.qrCode = await QRCode.toDataURL(verificationUrl, {
        width: 180,
        margin: 2,
        color: {
          dark: "#1a202c",
          light: "#ffffff",
        },
        errorCorrectionLevel: "M",
      });

      await invoice.save();

      res.json({
        success: true,
        message: "QR code regenerated successfully",
        data: {
          qrCode: invoice.qrCode,
          qrCodeData: invoice.qrCodeData,
        },
      });
    } catch (error) {
      console.error("Regenerate QR error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to regenerate QR code",
        error: error.message,
      });
    }
  },
);

// @route   GET /api/invoices/admin/all
// @desc    Get all invoices (Admin)
// @access  Admin
router.get("/admin/all", adminAuth, validatePagination, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      paymentStatus,
      paymentMethod,
      startDate,
      endDate,
      search,
    } = req.query;

    // Build filter
    const filter = {};

    if (status) filter.status = status;
    if (paymentStatus) filter.paymentStatus = paymentStatus;
    if (paymentMethod) filter.paymentMethod = paymentMethod;

    // Date range filter
    if (startDate || endDate) {
      filter.invoiceDate = {};
      if (startDate) filter.invoiceDate.$gte = new Date(startDate);
      if (endDate) filter.invoiceDate.$lte = new Date(endDate);
    }

    // Search filter
    if (search) {
      filter.$or = [
        { invoiceId: new RegExp(search, "i") },
        { "customerDetails.fullName": new RegExp(search, "i") },
        { "customerDetails.email": new RegExp(search, "i") },
        { "customerDetails.mobile": new RegExp(search, "i") },
      ];
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const [invoices, totalInvoices] = await Promise.all([
      Invoice.find(filter)
        .sort({ invoiceDate: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .populate("order", "orderId orderStatus")
        .populate("user", "fullName email mobile"),
      Invoice.countDocuments(filter),
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(totalInvoices / limit);

    res.json({
      success: true,
      data: invoices,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalInvoices,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    console.error("Get admin invoices error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch invoices",
      error: error.message,
    });
  }
});

// @route   GET /api/invoices/admin/stats
// @desc    Get invoice statistics
// @access  Admin
router.get("/admin/stats", adminAuth, async (req, res) => {
  try {
    const stats = await Invoice.getInvoiceStats();

    // Additional stats
    const recentInvoices = await Invoice.find()
      .sort({ invoiceDate: -1 })
      .limit(5)
      .populate("user", "fullName")
      .select("invoiceId total status paymentStatus invoiceDate");

    const monthlyStats = await Invoice.aggregate([
      {
        $match: {
          invoiceDate: {
            $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      },
      {
        $group: {
          _id: { $dayOfMonth: "$invoiceDate" },
          count: { $sum: 1 },
          total: { $sum: "$total" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      success: true,
      data: {
        ...stats,
        recentInvoices,
        monthlyStats,
      },
    });
  } catch (error) {
    console.error("Get invoice stats error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch invoice statistics",
      error: error.message,
    });
  }
});

// @route   POST /api/invoices/:id/send-email
// @desc    Send invoice via email
// @access  Admin
router.post(
  "/:id/send-email",
  adminAuth,
  validateObjectId("id"),
  async (req, res) => {
    try {
      const invoice = await Invoice.findById(req.params.id).populate("user");

      if (!invoice) {
        return res.status(404).json({
          success: false,
          message: "Invoice not found",
        });
      }

      // Send invoice email
      const emailService = require("../utils/emailService");
      await emailService.sendInvoiceEmail(invoice);

      // Mark as sent
      await invoice.markAsSent();

      res.json({
        success: true,
        message: "Invoice sent successfully",
      });
    } catch (error) {
      console.error("Send invoice email error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to send invoice email",
        error: error.message,
      });
    }
  },
);

module.exports = router;
