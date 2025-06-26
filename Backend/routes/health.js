const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

// @route   GET /api/health
// @desc    Health check endpoint for server and database status
// @access  Public
router.get("/", async (req, res) => {
  try {
    // Check database connection
    const dbStatus = mongoose.connection.readyState;
    const databaseStatus = dbStatus === 1 ? "connected" : "disconnected";

    // Return health status
    res.json({
      success: true,
      message: "Server is running",
      server: "online",
      database: databaseStatus,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  } catch (error) {
    console.error("Health check error:", error);
    res.status(500).json({
      success: false,
      message: "Health check failed",
      server: "error",
      database: "unknown",
      timestamp: new Date().toISOString(),
    });
  }
});

module.exports = router;
