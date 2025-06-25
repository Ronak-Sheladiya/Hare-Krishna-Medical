const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Verify JWT token
const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        message: "Access denied. No token provided.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

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

    res.status(401).json({
      message: "Invalid token.",
      error: error.message,
    });
  }
};

// Admin authorization
const adminAuth = async (req, res, next) => {
  try {
    await auth(req, res, () => {});

    if (req.user.role !== 1) {
      return res.status(403).json({
        message: "Access denied. Admin privileges required.",
      });
    }

    next();
  } catch (error) {
    res.status(401).json({
      message: "Authentication failed.",
      error: error.message,
    });
  }
};

// Optional auth (for public routes that benefit from user info)
const optionalAuth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");

      if (user && user.isActive) {
        req.user = user;
      }
    }

    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};

module.exports = {
  auth,
  adminAuth,
  optionalAuth,
};
