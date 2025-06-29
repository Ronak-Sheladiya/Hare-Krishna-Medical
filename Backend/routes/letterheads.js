const express = require("express");
const Letterhead = require("../models/Letterhead");
const { requireAdmin } = require("../middleware/auth");

const router = express.Router();

// @route   GET /api/letterheads
// @desc    Get letterheads (Admin only)
// @access  Private (Admin)
router.get("/", requireAdmin, async (req, res) => {
  try {
    const letterheads = await Letterhead.find({ isActive: true })
      .sort({ isDefault: -1, createdAt: -1 })
      .populate("createdBy", "fullName");

    res.json({
      success: true,
      data: { letterheads },
    });
  } catch (error) {
    console.error("Get letterheads error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch letterheads",
    });
  }
});

// @route   POST /api/letterheads
// @desc    Create letterhead (Admin only)
// @access  Private (Admin)
router.post("/", requireAdmin, async (req, res) => {
  try {
    const letterheadData = {
      ...req.body,
      createdBy: req.user._id,
    };

    const letterhead = new Letterhead(letterheadData);
    await letterhead.save();

    res.status(201).json({
      success: true,
      message: "Letterhead created successfully",
      data: { letterhead },
    });
  } catch (error) {
    console.error("Create letterhead error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create letterhead",
    });
  }
});

module.exports = router;
