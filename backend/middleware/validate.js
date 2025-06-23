const { body, param, query, validationResult } = require("express-validator");

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation failed",
      errors: errors.array(),
    });
  }
  next();
};

// User validation rules
const validateUserRegistration = [
  body("fullName")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Full name must be between 2 and 100 characters"),
  body("email").isEmail().normalizeEmail().withMessage("Invalid email address"),
  body("mobile")
    .matches(/^[6-9]\d{9}$/)
    .withMessage("Invalid mobile number format"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  handleValidationErrors,
];

const validateUserLogin = [
  body("email").isEmail().normalizeEmail().withMessage("Invalid email address"),
  body("password").notEmpty().withMessage("Password is required"),
  handleValidationErrors,
];

// Product validation rules
const validateProduct = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage("Product name must be between 2 and 200 characters"),
  body("description")
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage("Description must be between 10 and 2000 characters"),
  body("price")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),
  body("mrp").isFloat({ min: 0 }).withMessage("MRP must be a positive number"),
  body("category")
    .isIn([
      "Medicine",
      "Healthcare",
      "Personal Care",
      "Supplements",
      "Baby Care",
      "Ayurvedic",
    ])
    .withMessage("Invalid category"),
  body("brand").trim().notEmpty().withMessage("Brand is required"),
  body("stock")
    .isInt({ min: 0 })
    .withMessage("Stock must be a non-negative integer"),
  handleValidationErrors,
];

// Order validation rules
const validateOrder = [
  body("items")
    .isArray({ min: 1 })
    .withMessage("Order must contain at least one item"),
  body("items.*.product").isMongoId().withMessage("Invalid product ID"),
  body("items.*.quantity")
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1"),
  body("shippingAddress.fullName")
    .trim()
    .notEmpty()
    .withMessage("Full name is required"),
  body("shippingAddress.mobile")
    .matches(/^[6-9]\d{9}$/)
    .withMessage("Invalid mobile number"),
  body("shippingAddress.email").isEmail().withMessage("Invalid email address"),
  body("shippingAddress.address")
    .trim()
    .notEmpty()
    .withMessage("Address is required"),
  body("shippingAddress.city")
    .trim()
    .notEmpty()
    .withMessage("City is required"),
  body("shippingAddress.state")
    .trim()
    .notEmpty()
    .withMessage("State is required"),
  body("shippingAddress.pincode")
    .matches(/^\d{6}$/)
    .withMessage("Invalid pincode"),
  body("paymentMethod")
    .isIn(["COD", "Online", "Card", "UPI"])
    .withMessage("Invalid payment method"),
  handleValidationErrors,
];

// MongoDB ObjectId validation
const validateObjectId = (field) => [
  param(field).isMongoId().withMessage(`Invalid ${field} format`),
  handleValidationErrors,
];

// Pagination validation
const validatePagination = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
  handleValidationErrors,
];

// Search validation
const validateSearch = [
  query("q")
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Search query must be between 1 and 100 characters"),
  handleValidationErrors,
];

module.exports = {
  handleValidationErrors,
  validateUserRegistration,
  validateUserLogin,
  validateProduct,
  validateOrder,
  validateObjectId,
  validatePagination,
  validateSearch,
};
