const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");

// Enhanced rate limiting for different endpoints
const createRateLimit = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      error:
        message || "Too many requests from this IP, please try again later.",
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
};

// Different rate limits for different routes
const rateLimits = {
  // General API rate limit
  general: createRateLimit(
    15 * 60 * 1000, // 15 minutes
    100, // limit each IP to 100 requests per windowMs
    "Too many requests from this IP, please try again later.",
  ),

  // Strict rate limit for authentication endpoints
  auth: createRateLimit(
    15 * 60 * 1000, // 15 minutes
    5, // limit each IP to 5 requests per windowMs
    "Too many authentication attempts, please try again later.",
  ),

  // Medium rate limit for file uploads
  upload: createRateLimit(
    15 * 60 * 1000, // 15 minutes
    10, // limit each IP to 10 uploads per windowMs
    "Too many upload attempts, please try again later.",
  ),

  // Loose rate limit for public endpoints
  public: createRateLimit(
    15 * 60 * 1000, // 15 minutes
    200, // limit each IP to 200 requests per windowMs
    "Too many requests, please try again later.",
  ),
};

// Enhanced security headers
const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'"],
      frameAncestors: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false, // Allow embedding for iframe previews
});

// Input sanitization
const sanitizeInput = [
  mongoSanitize({
    replaceWith: "_",
    onSanitize: ({ req, key }) => {
      console.warn(
        `Sanitized input detected: ${key} in ${req.method} ${req.path}`,
      );
    },
  }),
];

// File upload security
const fileUploadSecurity = (req, res, next) => {
  // Additional file upload validations
  if (req.file || req.files) {
    const files = req.files || [req.file];

    for (const file of files) {
      if (!file) continue;

      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        return res.status(400).json({
          success: false,
          message: "File size too large. Maximum 5MB allowed.",
        });
      }

      // Check file type
      if (!file.mimetype.startsWith("image/")) {
        return res.status(400).json({
          success: false,
          message: "Only image files are allowed.",
        });
      }

      // Check for malicious file extensions
      const dangerousExtensions = [
        ".exe",
        ".bat",
        ".cmd",
        ".scr",
        ".pif",
        ".com",
      ];
      const fileName = file.originalname.toLowerCase();

      if (dangerousExtensions.some((ext) => fileName.endsWith(ext))) {
        return res.status(400).json({
          success: false,
          message: "File type not allowed for security reasons.",
        });
      }
    }
  }

  next();
};

// Request logging for security monitoring
const securityLogger = (req, res, next) => {
  // Log potentially suspicious requests
  const suspiciousPatterns = [
    /eval\(/i,
    /javascript:/i,
    /vbscript:/i,
    /onload=/i,
    /onerror=/i,
    /<script/i,
    /union.*select/i,
    /drop.*table/i,
  ];

  const requestData = JSON.stringify({
    body: req.body,
    query: req.query,
    params: req.params,
  });

  const isSuspicious = suspiciousPatterns.some(
    (pattern) => pattern.test(requestData) || pattern.test(req.url),
  );

  if (isSuspicious) {
    console.warn(`🚨 Suspicious request detected:`, {
      ip: req.ip,
      userAgent: req.get("User-Agent"),
      url: req.url,
      method: req.method,
      timestamp: new Date().toISOString(),
    });
  }

  next();
};

// IP validation middleware
const validateIP = (req, res, next) => {
  const clientIP = req.ip || req.connection.remoteAddress;

  // Block requests from localhost in production (if needed)
  if (
    process.env.NODE_ENV === "production" &&
    (clientIP === "127.0.0.1" || clientIP === "::1")
  ) {
    return res.status(403).json({
      success: false,
      message: "Access denied from this IP address.",
    });
  }

  next();
};

module.exports = {
  rateLimits,
  securityHeaders,
  sanitizeInput,
  fileUploadSecurity,
  securityLogger,
  validateIP,
};
