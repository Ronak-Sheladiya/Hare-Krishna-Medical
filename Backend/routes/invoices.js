const express = require("express");
const { auth, adminAuth } = require("../middleware/auth");
const {
  validateObjectId,
  validatePagination,
} = require("../middleware/validate");
const invoicesController = require("../controllers/invoicesController");

const router = express.Router();

// @route   GET /api/invoices
// @desc    Get user invoices
// @access  Private
router.get("/", auth, validatePagination, invoicesController.getUserInvoices);

// @route   GET /api/invoices/verify/:invoiceId
// @desc    Verify invoice by invoice ID (Public access for QR verification)
// @access  Public
router.get("/verify/:invoiceId", invoicesController.verifyInvoice);

// @route   GET /api/invoices/admin/all
// @desc    Get all invoices (Admin)
// @access  Admin
router.get(
  "/admin/all",
  adminAuth,
  validatePagination,
  invoicesController.getAllInvoices,
);

// @route   GET /api/invoices/admin/stats
// @desc    Get invoice statistics
// @access  Admin
router.get("/admin/stats", adminAuth, invoicesController.getInvoiceStats);

// @route   GET /api/invoices/:id
// @desc    Get single invoice
// @access  Private
router.get("/:id", auth, validateObjectId("id"), invoicesController.getInvoice);

// @route   PUT /api/invoices/:id/payment-status
// @desc    Update invoice payment status
// @access  Admin
router.put(
  "/:id/payment-status",
  adminAuth,
  validateObjectId("id"),
  invoicesController.updatePaymentStatus,
);

// @route   POST /api/invoices/:id/regenerate-qr
// @desc    Regenerate QR code for invoice
// @access  Admin
router.post(
  "/:id/regenerate-qr",
  adminAuth,
  validateObjectId("id"),
  invoicesController.regenerateQr,
);

// @route   GET /api/invoices/:id/qr
// @desc    Get QR code for invoice (generate if not exists)
// @access  Private
router.get(
  "/:id/qr",
  auth,
  validateObjectId("id"),
  invoicesController.getQrCode,
);

// @route   POST /api/invoices/:id/send-email
// @desc    Send invoice via email
// @access  Admin
router.post(
  "/:id/send-email",
  adminAuth,
  validateObjectId("id"),
  invoicesController.sendInvoiceEmail,
);

module.exports = router;
