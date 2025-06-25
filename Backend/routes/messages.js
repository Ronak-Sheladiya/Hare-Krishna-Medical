const express = require("express");
const { body, validationResult } = require("express-validator");
const { auth, adminAuth } = require("../middleware/auth");
const { validatePagination } = require("../middleware/validate");
const messagesController = require("../controllers/messagesController");

const router = express.Router();

// @route   POST /api/messages/contact
// @desc    Submit contact form
// @access  Public
router.post(
  "/contact",
  [
    body("name")
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage("Name must be between 2 and 100 characters"),
    body("email").isEmail().withMessage("Please provide a valid email"),
    body("mobile")
      .optional()
      .matches(/^[6-9]\d{9}$/)
      .withMessage("Please provide a valid mobile number"),
    body("subject")
      .trim()
      .isLength({ min: 5, max: 200 })
      .withMessage("Subject must be between 5 and 200 characters"),
    body("message")
      .trim()
      .isLength({ min: 10, max: 1000 })
      .withMessage("Message must be between 10 and 1000 characters"),
  ],
  (req, res, next) => {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }
    next();
  },
  messagesController.submitContact,
);

// @route   GET /api/messages/admin/all
// @desc    Get all messages (Admin)
// @access  Admin
router.get(
  "/admin/all",
  adminAuth,
  validatePagination,
  messagesController.getAllMessages,
);

// @route   GET /api/messages/admin/stats
// @desc    Get message statistics (Admin)
// @access  Admin
router.get("/admin/stats", adminAuth, messagesController.getMessageStats);

// @route   GET /api/messages/admin/:id
// @desc    Get single message (Admin)
// @access  Admin
router.get("/admin/:id", adminAuth, messagesController.getMessage);

// @route   PUT /api/messages/admin/:id/status
// @desc    Update message status (Admin)
// @access  Admin
router.put(
  "/admin/:id/status",
  adminAuth,
  messagesController.updateMessageStatus,
);

// @route   POST /api/messages/admin/:id/respond
// @desc    Respond to message (Admin)
// @access  Admin
router.post(
  "/admin/:id/respond",
  adminAuth,
  [
    body("response")
      .trim()
      .isLength({ min: 10, max: 2000 })
      .withMessage("Response must be between 10 and 2000 characters"),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }
    next();
  },
  messagesController.respondToMessage,
);

module.exports = router;
