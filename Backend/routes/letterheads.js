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
  body("letterType")
    .isIn(["certificate", "request", "application", "notice", "recommendation"])
    .withMessage("Invalid letter type"),
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("context")
    .isIn(["respected", "dear", "to_whom_it_may_concern"])
    .withMessage("Invalid context"),
  body("recipient.prefix")
    .isIn(["Mr.", "Mrs.", "Ms.", "Dr.", "Prof.", "Hon.", "Company"])
    .withMessage("Invalid prefix"),
  body("recipient.firstName")
    .trim()
    .notEmpty()
    .withMessage("First name is required"),
  body("recipient.lastName")
    .trim()
    .notEmpty()
    .withMessage("Last name is required"),
  body("subject").trim().notEmpty().withMessage("Subject is required"),
  body("content").trim().notEmpty().withMessage("Content is required"),
  body("host.name").trim().notEmpty().withMessage("Host name is required"),
  body("host.designation")
    .trim()
    .notEmpty()
    .withMessage("Host designation is required"),
  body("language")
    .optional()
    .isIn(["english", "hindi", "gujarati"])
    .withMessage("Invalid language"),
];

const validateUpdateLetterhead = [
  body("letterType")
    .optional()
    .isIn(["certificate", "request", "application", "notice", "recommendation"])
    .withMessage("Invalid letter type"),
  body("title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Title cannot be empty"),
  body("context")
    .optional()
    .isIn(["respected", "dear", "to_whom_it_may_concern"])
    .withMessage("Invalid context"),
  body("recipient.prefix")
    .optional()
    .isIn(["Mr.", "Mrs.", "Ms.", "Dr.", "Prof.", "Hon.", "Company"])
    .withMessage("Invalid prefix"),
  body("recipient.firstName")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("First name cannot be empty"),
  body("recipient.lastName")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Last name cannot be empty"),
  body("subject")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Subject cannot be empty"),
  body("content")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Content cannot be empty"),
  body("host.name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Host name cannot be empty"),
  body("host.designation")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Host designation cannot be empty"),
  body("language")
    .optional()
    .isIn(["english", "hindi", "gujarati"])
    .withMessage("Invalid language"),
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
    .isIn(["draft", "finalized", "sent", "archived"])
    .withMessage("Invalid status"),
  query("letterType")
    .optional()
    .isIn(["certificate", "request", "application", "notice", "recommendation"])
    .withMessage("Invalid letter type"),
  query("startDate").optional().isISO8601().withMessage("Invalid start date"),
  query("endDate").optional().isISO8601().withMessage("Invalid end date"),
];

// Routes

// GET /api/letterheads - Get all letterheads (Admin only)
router.get(
  "/",
  adminAuth,
  validateQueryParams,
  handleValidationErrors,
  letterheadController.getAllLetterheads,
);

// GET /api/letterheads/stats - Get letterhead statistics (Admin only)
router.get("/stats", adminAuth, letterheadController.getLetterheadStats);

// GET /api/letterheads/:id - Get single letterhead by ID
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
  validate,
  letterheadController.createLetterhead,
);

// PUT /api/letterheads/:id - Update letterhead (Admin only)
router.put(
  "/:id",
  adminAuth,
  validateLetterheadId,
  validateUpdateLetterhead,
  validate,
  letterheadController.updateLetterhead,
);

// DELETE /api/letterheads/:id - Delete letterhead (Admin only)
router.delete(
  "/:id",
  adminAuth,
  validateLetterheadId,
  validate,
  letterheadController.deleteLetterhead,
);

// GET /api/letterheads/:id/pdf - Generate PDF for letterhead
router.get(
  "/:id/pdf",
  adminAuth,
  validateLetterheadId,
  validate,
  letterheadController.generateLetterheadPDF,
);

// PUT /api/letterheads/:id/mark-sent - Mark letterhead as sent (Admin only)
router.put(
  "/:id/mark-sent",
  adminAuth,
  validateLetterheadId,
  validate,
  letterheadController.markAsSent,
);

// Public verification route
// GET /api/letterheads/verify/:letterId - Verify letterhead by letter ID (Public)
router.get(
  "/verify/:letterId",
  param("letterId").notEmpty().withMessage("Letter ID is required"),
  validate,
  letterheadController.verifyLetterhead,
);

module.exports = router;
