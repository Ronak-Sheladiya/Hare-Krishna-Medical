const express = require("express");
const router = express.Router();
const letterheadController = require("../controllers/letterheadController");
const { auth, adminAuth } = require("../middleware/auth");
const { body, param, query } = require("express-validator");
const { handleValidationErrors } = require("../middleware/validate");

// Validation middleware
const validateLetterheadId = [
  param("id").isMongoId().withMessage("Invalid letterhead ID"),
];

const validateCreateLetterhead = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("letterType")
    .optional()
    .isIn([
      "certificate",
      "recommendation",
      "authorization",
      "notice",
      "announcement",
      "invitation",
      "acknowledgment",
      "verification",
      "document",
    ])
    .withMessage("Invalid letter type"),
  body("recipient.name")
    .optional({ values: "falsy" })
    .isString()
    .trim()
    .withMessage("Recipient name must be a string"),
  body("subject")
    .optional({ values: "falsy" })
    .isString()
    .trim()
    .withMessage("Subject must be a string"),
  body("content").trim().notEmpty().withMessage("Content is required"),
  body("issuer.name")
    .optional({ values: "falsy" })
    .isString()
    .trim()
    .withMessage("Issuer name must be a string"),
  body("issuer.designation")
    .optional({ values: "falsy" })
    .isString()
    .trim()
    .withMessage("Issuer designation must be a string"),
];

const validateUpdateLetterhead = [
  body("title")
    .optional({ values: "falsy" })
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Title cannot be empty"),
  body("letterType")
    .optional()
    .isIn([
      "certificate",
      "recommendation",
      "authorization",
      "notice",
      "announcement",
      "invitation",
      "acknowledgment",
      "verification",
      "document",
    ])
    .withMessage("Invalid letter type"),
  body("recipient.name")
    .optional({ values: "falsy" })
    .isString()
    .trim()
    .withMessage("Recipient name must be a string"),
  body("subject")
    .optional({ values: "falsy" })
    .isString()
    .trim()
    .withMessage("Subject must be a string"),
  body("content")
    .optional({ values: "falsy" })
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Content cannot be empty"),
  body("issuer.name")
    .optional({ values: "falsy" })
    .isString()
    .trim()
    .withMessage("Issuer name must be a string"),
  body("issuer.designation")
    .optional()
    .trim()
    .withMessage("Issuer designation must be a string"),
];

const validateQueryParams = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
  query("status")
    .optional()
    .isIn(["draft", "issued", "sent", "archived"])
    .withMessage("Invalid status"),
  query("letterType")
    .optional()
    .isIn([
      "certificate",
      "recommendation",
      "authorization",
      "notice",
      "announcement",
      "invitation",
      "acknowledgment",
      "verification",
      "document",
    ])
    .withMessage("Invalid letter type"),
  query("startDate").optional().isISO8601().withMessage("Invalid start date"),
  query("endDate").optional().isISO8601().withMessage("Invalid end date"),
];

// Routes

// GET /api/letterheads/health - Health check for letterheads API
router.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Letterheads API is working",
    timestamp: new Date().toISOString(),
  });
});

// GET /api/letterheads - Get all letterheads (Admin only)
router.get(
  "/",
  adminAuth,
  validateQueryParams,
  handleValidationErrors,
  letterheadController.getAllLetterheads,
);

// GET /api/letterheads/stats - Get letterhead statistics (Admin only)
router.get("/stats", adminAuth, letterheadController.getStats);

// GET /api/letterheads/:id - Get single letterhead by ID (Admin only)
router.get(
  "/:id",
  adminAuth,
  validateLetterheadId,
  handleValidationErrors,
  letterheadController.getLetterheadById,
);

// POST /api/letterheads - Create new letterhead (Admin only)
router.post(
  "/",
  adminAuth,
  validateCreateLetterhead,
  handleValidationErrors,
  letterheadController.createLetterhead,
);

// PUT /api/letterheads/:id - Update letterhead (Admin only)
router.put(
  "/:id",
  adminAuth,
  validateLetterheadId,
  validateUpdateLetterhead,
  handleValidationErrors,
  letterheadController.updateLetterhead,
);

// DELETE /api/letterheads/:id - Delete letterhead (Admin only)
router.delete(
  "/:id",
  adminAuth,
  validateLetterheadId,
  handleValidationErrors,
  letterheadController.deleteLetterhead,
);

// PUT /api/letterheads/:id/mark-issued - Mark letterhead as issued (Admin only)
router.put(
  "/:id/mark-issued",
  adminAuth,
  validateLetterheadId,
  handleValidationErrors,
  letterheadController.markAsIssued,
);

// PUT /api/letterheads/:id/mark-sent - Mark letterhead as sent (Admin only)
router.put(
  "/:id/mark-sent",
  adminAuth,
  validateLetterheadId,
  handleValidationErrors,
  letterheadController.markAsSent,
);

// Public verification route
// GET /api/letterheads/verify/:letterheadId - Verify letterhead by letterhead ID (Public)
router.get(
  "/verify/:letterheadId",
  param("letterheadId").notEmpty().withMessage("Letterhead ID is required"),
  handleValidationErrors,
  letterheadController.verifyLetterhead,
);

module.exports = router;
