const express = require("express");
const multer = require("multer");
const { auth, adminAuth } = require("../middleware/auth");
const uploadController = require("../controllers/uploadController");

const router = express.Router();

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

// @route   GET /api/upload/image/:id
// @desc    Get image from MongoDB GridFS
// @access  Public
router.get("/image/:id", uploadController.getImage);

// @route   POST /api/upload/image
// @desc    Upload single product image to MongoDB
// @access  Admin
router.post(
  "/image",
  adminAuth,
  upload.single("image"),
  uploadController.uploadImage,
);

// @route   POST /api/upload/product-images
// @desc    Upload multiple product images to MongoDB
// @access  Admin
router.post(
  "/product-images",
  adminAuth,
  upload.array("images", 5),
  uploadController.uploadProductImages,
);

// @route   DELETE /api/upload/delete-image
// @desc    Delete image from MongoDB GridFS
// @access  Admin
router.delete("/delete-image", adminAuth, uploadController.deleteImage);

// @route   POST /api/upload/user-avatar
// @desc    Upload user avatar to MongoDB
// @access  Private
router.post(
  "/user-avatar",
  auth,
  upload.single("avatar"),
  uploadController.uploadUserAvatar,
);

// Error handling middleware for multer
router.use(uploadController.handleMulterError);

module.exports = router;
