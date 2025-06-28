const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { devAuth, shouldUseFallback } = require("../utils/devFallback");

// ✅ General User Authentication Middleware
const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        message: "Access denied. No token provided.",
      });
    }

    // Validate JWT secret exists in production
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error("❌ JWT_SECRET environment variable not set");
      return res.status(500).json({
        message: "Server configuration error. Please contact administrator.",
      });
    }

    const decoded = jwt.verify(token, jwtSecret);

    let user;
    if (shouldUseFallback()) {
      user = await devAuth.findUserById(decoded.id);
      if (user) {
        // Remove password from user object for security
        const { password, ...userWithoutPassword } = user;
        user = userWithoutPassword;
      }
    } else {
      user = await User.findById(decoded.id).select("-password");
    }

    if (!user) {
      return res.status(401).json({
        message: "Invalid token. User not found.",
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        message: "Account has been deactivated.",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Token has expired. Please login again.",
      });
    }

    return res.status(401).json({
      message: "Invalid token.",
      error: error.message,
    });
  }
};

// ✅ Admin Only Authentication Middleware
const adminAuth = async (req, res, next) => {
  try {
    // Authenticate user first
    await auth(req, res, async () => {
      // If `auth` already responded, avoid duplicate response
      if (!req.user) return;

      if (req.user.role !== 1) {
        return res.status(403).json({
          message: "Access denied. Admin privileges required.",
        });
      }

      next();
    });
  } catch (error) {
    // Catch fallback for unexpected errors
    if (!res.headersSent) {
      return res.status(500).json({
        message: "Admin authentication failed.",
        error: error.message,
      });
    }
  }
};

// ✅ Optional Auth Middleware (e.g., public pages showing optional user data)
const optionalAuth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (token) {
      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        next(); // Skip auth if JWT secret not configured
        return;
      }

      const decoded = jwt.verify(token, jwtSecret);
      const user = await User.findById(decoded.id).select("-password");

      if (user && user.isActive) {
        req.user = user;
      }
    }

    next(); // Always proceed
  } catch (error) {
    next(); // Proceed even if token fails
  }
};

module.exports = {
  auth,
  adminAuth,
  optionalAuth,
};
