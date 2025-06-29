const express = require("express");

const router = express.Router();

// @route   GET /api/cart
// @desc    Get user cart (placeholder - cart is managed client-side)
// @access  Private
router.get("/", async (req, res) => {
  try {
    // Cart is managed client-side with Redux
    // This endpoint can be used for server-side cart storage if needed
    res.json({
      success: true,
      message: "Cart is managed client-side",
      data: {
        cart: {
          items: [],
          totalItems: 0,
          totalAmount: 0,
        },
      },
    });
  } catch (error) {
    console.error("Get cart error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch cart",
    });
  }
});

module.exports = router;
