const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { adminAuth } = require("../middleware/auth");

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow only image files
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  },
});

// @route   POST /api/upload/product-image
// @desc    Upload product image
// @access  Admin
router.post(
  "/product-image",
  adminAuth,
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No image file provided",
        });
      }

      // Upload to Cloudinary
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              resource_type: "image",
              folder: "hare-krishna-medical/products",
              transformation: [
                { width: 800, height: 800, crop: "fill", quality: "auto" },
                { fetch_format: "auto" },
              ],
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            },
          )
          .end(req.file.buffer);
      });

      res.json({
        success: true,
        message: "Image uploaded successfully",
        data: {
          url: result.secure_url,
          public_id: result.public_id,
          width: result.width,
          height: result.height,
        },
      });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to upload image",
        error: error.message,
      });
    }
  },
);

// @route   POST /api/upload/product-images
// @desc    Upload multiple product images
// @access  Admin
router.post(
  "/product-images",
  adminAuth,
  upload.array("images", 5),
  async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: "No image files provided",
        });
      }

      // Upload all images to Cloudinary
      const uploadPromises = req.files.map((file) => {
        return new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              {
                resource_type: "image",
                folder: "hare-krishna-medical/products",
                transformation: [
                  { width: 800, height: 800, crop: "fill", quality: "auto" },
                  { fetch_format: "auto" },
                ],
              },
              (error, result) => {
                if (error) reject(error);
                else resolve(result);
              },
            )
            .end(file.buffer);
        });
      });

      const results = await Promise.all(uploadPromises);

      const uploadedImages = results.map((result) => ({
        url: result.secure_url,
        public_id: result.public_id,
        width: result.width,
        height: result.height,
      }));

      res.json({
        success: true,
        message: `${uploadedImages.length} images uploaded successfully`,
        data: uploadedImages,
      });
    } catch (error) {
      console.error("Multiple upload error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to upload images",
        error: error.message,
      });
    }
  },
);

// @route   DELETE /api/upload/delete-image
// @desc    Delete image from Cloudinary
// @access  Admin
router.delete("/delete-image", adminAuth, async (req, res) => {
  try {
    const { public_id } = req.body;

    if (!public_id) {
      return res.status(400).json({
        success: false,
        message: "Public ID is required",
      });
    }

    // Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(public_id);

    if (result.result === "ok") {
      res.json({
        success: true,
        message: "Image deleted successfully",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Failed to delete image",
        error: result.result,
      });
    }
  } catch (error) {
    console.error("Delete image error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete image",
      error: error.message,
    });
  }
});

// @route   POST /api/upload/user-avatar
// @desc    Upload user avatar
// @access  Private
router.post("/user-avatar", upload.single("avatar"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No avatar file provided",
      });
    }

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: "image",
            folder: "hare-krishna-medical/avatars",
            transformation: [
              { width: 200, height: 200, crop: "fill", gravity: "face" },
              { quality: "auto" },
              { fetch_format: "auto" },
            ],
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          },
        )
        .end(req.file.buffer);
    });

    res.json({
      success: true,
      message: "Avatar uploaded successfully",
      data: {
        url: result.secure_url,
        public_id: result.public_id,
      },
    });
  } catch (error) {
    console.error("Avatar upload error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to upload avatar",
      error: error.message,
    });
  }
});

// Error handling middleware for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File too large. Maximum size is 5MB.",
      });
    }
    if (error.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({
        success: false,
        message: "Too many files. Maximum is 5 files.",
      });
    }
  }

  if (error.message === "Only image files are allowed") {
    return res.status(400).json({
      success: false,
      message: "Only image files are allowed",
    });
  }

  res.status(500).json({
    success: false,
    message: "Upload failed",
    error: error.message,
  });
});

module.exports = router;
