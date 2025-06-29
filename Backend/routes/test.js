const express = require("express");
const router = express.Router();

// Test endpoint for connectivity checks
router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Backend API is working!",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    version: "1.0.0",
  });
});

// Health check endpoint
router.get("/health", (req, res) => {
  res.json({
    success: true,
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    environment: process.env.NODE_ENV || "development",
  });
});

module.exports = router;
