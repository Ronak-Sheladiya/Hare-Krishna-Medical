const { body, param, query, validationResult } = require("express-validator");

// Middleware to handle validation results
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => ({
      field: error.path || error.param,
      message: error.msg,
      value: error.value,
    }));

    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errorMessages,
    });
  }

  next();
};

// Common validation rules
const validationRules = {
  // User validation
  userRegistration: [
    body("fullName")
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage("Full name must be between 2 and 100 characters"),

    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Please provide a valid email"),

    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long")
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage(
        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
      ),

    body("mobile")
      .optional()
      .isMobilePhone("en-IN")
      .withMessage("Please provide a valid mobile number"),
  ],

  userLogin: [
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Please provide a valid email"),

    body("password").notEmpty().withMessage("Password is required"),
  ],

  userProfileUpdate: [
    body("fullName")
      .optional()
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage("Full name must be between 2 and 100 characters"),

    body("mobile")
      .optional()
      .isMobilePhone("en-IN")
      .withMessage("Please provide a valid mobile number"),

    body("dateOfBirth")
      .optional()
      .isISO8601()
      .withMessage("Please provide a valid date"),

    body("gender")
      .optional()
      .isIn(["male", "female", "other"])
      .withMessage("Gender must be male, female, or other"),
  ],

  passwordChange: [
    body("currentPassword")
      .notEmpty()
      .withMessage("Current password is required"),

    body("newPassword")
      .isLength({ min: 6 })
      .withMessage("New password must be at least 6 characters long")
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage(
        "New password must contain at least one uppercase letter, one lowercase letter, and one number",
      ),

    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error("Confirm password does not match new password");
      }
      return true;
    }),
  ],

  // Product validation
  productCreate: [
    body("name")
      .trim()
      .isLength({ min: 2, max: 200 })
      .withMessage("Product name must be between 2 and 200 characters"),

    body("company")
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage("Company name must be between 2 and 100 characters"),

    body("price")
      .isFloat({ min: 0 })
      .withMessage("Price must be a positive number"),

    body("originalPrice")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("Original price must be a positive number"),

    body("stock")
      .isInt({ min: 0 })
      .withMessage("Stock must be a non-negative integer"),

    body("category")
      .isIn([
        "Pain Relief",
        "Vitamins",
        "Cough & Cold",
        "First Aid",
        "Medical Devices",
        "Supplements",
        "Antibiotics",
        "Digestive Health",
        "Heart & Blood Pressure",
        "Diabetes Care",
        "Other",
      ])
      .withMessage("Please select a valid category"),

    body("shortDescription")
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage("Short description cannot exceed 500 characters"),

    body("description")
      .optional()
      .trim()
      .isLength({ max: 2000 })
      .withMessage("Description cannot exceed 2000 characters"),
  ],

  productUpdate: [
    body("name")
      .optional()
      .trim()
      .isLength({ min: 2, max: 200 })
      .withMessage("Product name must be between 2 and 200 characters"),

    body("company")
      .optional()
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage("Company name must be between 2 and 100 characters"),

    body("price")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("Price must be a positive number"),

    body("stock")
      .optional()
      .isInt({ min: 0 })
      .withMessage("Stock must be a non-negative integer"),

    body("category")
      .optional()
      .isIn([
        "Pain Relief",
        "Vitamins",
        "Cough & Cold",
        "First Aid",
        "Medical Devices",
        "Supplements",
        "Antibiotics",
        "Digestive Health",
        "Heart & Blood Pressure",
        "Diabetes Care",
        "Other",
      ])
      .withMessage("Please select a valid category"),
  ],

  // Order validation
  orderCreate: [
    body("items")
      .isArray({ min: 1 })
      .withMessage("Order must contain at least one item"),

    body("items.*.productId").isMongoId().withMessage("Invalid product ID"),

    body("items.*.quantity")
      .isInt({ min: 1 })
      .withMessage("Quantity must be at least 1"),

    body("shippingAddress.fullName")
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage("Full name is required"),

    body("shippingAddress.mobile")
      .isMobilePhone("en-IN")
      .withMessage("Valid mobile number is required"),

    body("shippingAddress.street")
      .trim()
      .isLength({ min: 5, max: 200 })
      .withMessage("Street address is required"),

    body("shippingAddress.city")
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage("City is required"),

    body("shippingAddress.state")
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage("State is required"),

    body("shippingAddress.pincode")
      .isNumeric()
      .isLength({ min: 6, max: 6 })
      .withMessage("Valid 6-digit pincode is required"),

    body("paymentMethod")
      .isIn(["cod", "online", "upi", "card"])
      .withMessage("Invalid payment method"),
  ],

  // Message validation
  messageCreate: [
    body("subject")
      .trim()
      .isLength({ min: 5, max: 200 })
      .withMessage("Subject must be between 5 and 200 characters"),

    body("message")
      .trim()
      .isLength({ min: 10, max: 2000 })
      .withMessage("Message must be between 10 and 2000 characters"),

    body("type")
      .optional()
      .isIn([
        "inquiry",
        "complaint",
        "support",
        "feedback",
        "order_related",
        "general",
      ])
      .withMessage("Invalid message type"),

    body("priority")
      .optional()
      .isIn(["low", "medium", "high", "urgent"])
      .withMessage("Invalid priority level"),
  ],

  messageReply: [
    body("message")
      .trim()
      .isLength({ min: 1, max: 2000 })
      .withMessage("Reply message must be between 1 and 2000 characters"),
  ],

  // Common parameter validations
  mongoId: [param("id").isMongoId().withMessage("Invalid ID format")],

  pagination: [
    query("page")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Page must be a positive integer"),

    query("limit")
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage("Limit must be between 1 and 100"),
  ],

  // Search validation
  productSearch: [
    query("q")
      .optional()
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage("Search query must be between 1 and 100 characters"),

    query("category")
      .optional()
      .isIn([
        "Pain Relief",
        "Vitamins",
        "Cough & Cold",
        "First Aid",
        "Medical Devices",
        "Supplements",
        "Antibiotics",
        "Digestive Health",
        "Heart & Blood Pressure",
        "Diabetes Care",
        "Other",
      ])
      .withMessage("Invalid category"),

    query("minPrice")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("Minimum price must be a positive number"),

    query("maxPrice")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("Maximum price must be a positive number"),

    query("sortBy")
      .optional()
      .isIn(["name", "price", "createdAt", "rating", "popularity"])
      .withMessage("Invalid sort field"),

    query("sortOrder")
      .optional()
      .isIn(["asc", "desc", "1", "-1"])
      .withMessage("Invalid sort order"),
  ],
};

// Helper function to validate email format
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Helper function to validate mobile number (Indian format)
const isValidMobile = (mobile) => {
  const mobileRegex = /^[6-9]\d{9}$/;
  return mobileRegex.test(mobile);
};

// Helper function to validate pincode (Indian format)
const isValidPincode = (pincode) => {
  const pincodeRegex = /^[1-9][0-9]{5}$/;
  return pincodeRegex.test(pincode);
};

// Custom validator for password strength
const isStrongPassword = (password) => {
  const minLength = 6;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return (
    password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers
  );
};

module.exports = {
  validationRules,
  handleValidationErrors,
  isValidEmail,
  isValidMobile,
  isValidPincode,
  isStrongPassword,
};
