const express = require("express");
const multer = require("multer");
const path = require("path");

const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow only images
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  },
});

// @route   POST /api/upload/image
// @desc    Upload single image
// @access  Private
router.post("/image", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file provided",
      });
    }

    // In a real implementation, you would upload to a cloud service like Cloudinary
    // For now, we'll just return a mock response
    const mockImageUrl = `https://via.placeholder.com/300x300.png?text=Uploaded+Image`;

    res.json({
      success: true,
      message: "Image uploaded successfully",
      data: {
        url: mockImageUrl,
        filename: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype,
      },
    });
  } catch (error) {
    console.error("Upload image error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to upload image",
    });
  }
});

// @route   POST /api/upload/images
// @desc    Upload multiple images
// @access  Private
router.post("/images", upload.array("images", 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No image files provided",
      });
    }

    // Mock multiple image uploads
    const uploadedImages = req.files.map((file, index) => ({
      url: `https://via.placeholder.com/300x300.png?text=Image+${index + 1}`,
      filename: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
    }));

    res.json({
      success: true,
      message: "Images uploaded successfully",
      data: {
        images: uploadedImages,
        count: uploadedImages.length,
      },
    });
  } catch (error) {
    console.error("Upload images error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to upload images",
    });
  }
});

module.exports = router;
