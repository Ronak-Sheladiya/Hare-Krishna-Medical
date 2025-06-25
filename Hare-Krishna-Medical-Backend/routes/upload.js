const express = require("express");
const multer = require("multer");
const { adminAuth } = require("../middleware/auth");
const mongoose = require("mongoose");

const router = express.Router();

// GridFS setup for storing images in MongoDB
let gridfsBucket;
mongoose.connection.once("open", () => {
  gridfsBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: "images",
  });
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

// Helper function to store image in MongoDB GridFS
const storeImageInMongoDB = (buffer, filename, mimetype) => {
  return new Promise((resolve, reject) => {
    if (!gridfsBucket) {
      return reject(new Error("GridFS bucket not initialized"));
    }

    const uploadStream = gridfsBucket.openUploadStream(filename, {
      metadata: {
        contentType: mimetype,
        uploadDate: new Date(),
      },
    });

    uploadStream.on("error", reject);
    uploadStream.on("finish", (file) => {
      resolve({
        _id: file._id,
        filename: file.filename,
        url: `/api/upload/image/${file._id}`,
        contentType: mimetype,
        length: file.length,
      });
    });

    uploadStream.end(buffer);
  });
};

// @route   GET /api/upload/image/:id
// @desc    Get image from MongoDB GridFS
// @access  Public
router.get("/image/:id", async (req, res) => {
  try {
    if (!gridfsBucket) {
      return res.status(500).json({
        success: false,
        message: "GridFS bucket not initialized",
      });
    }

    const objectId = new mongoose.Types.ObjectId(req.params.id);

    // Find the file
    const files = await gridfsBucket.find({ _id: objectId }).toArray();

    if (!files || files.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }

    const file = files[0];

    // Set appropriate headers
    res.set({
      "Content-Type": file.metadata.contentType || "image/jpeg",
      "Content-Length": file.length,
    });

    // Stream the file
    const downloadStream = gridfsBucket.openDownloadStream(objectId);
    downloadStream.pipe(res);
  } catch (error) {
    console.error("Error retrieving image:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve image",
      error: error.message,
    });
  }
});

// @route   POST /api/upload/image
// @desc    Upload single product image to MongoDB
// @access  Admin
router.post("/image", adminAuth, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file provided",
      });
    }

    const filename = `product_${Date.now()}_${req.file.originalname}`;
    const result = await storeImageInMongoDB(
      req.file.buffer,
      filename,
      req.file.mimetype,
    );

    res.json({
      success: true,
      message: "Image uploaded successfully",
      data: {
        url: result.url,
        id: result._id,
        filename: result.filename,
        contentType: result.contentType,
        size: result.length,
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
});

// @route   POST /api/upload/product-images
// @desc    Upload multiple product images to MongoDB
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

      // Upload all images to MongoDB GridFS
      const uploadPromises = req.files.map(async (file, index) => {
        const filename = `product_${Date.now()}_${index}_${file.originalname}`;
        return await storeImageInMongoDB(file.buffer, filename, file.mimetype);
      });

      const results = await Promise.all(uploadPromises);

      const uploadedImages = results.map((result) => ({
        url: result.url,
        id: result._id,
        filename: result.filename,
        contentType: result.contentType,
        size: result.length,
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
// @desc    Delete image from MongoDB GridFS
// @access  Admin
router.delete("/delete-image", adminAuth, async (req, res) => {
  try {
    const { image_id } = req.body;

    if (!image_id) {
      return res.status(400).json({
        success: false,
        message: "Image ID is required",
      });
    }

    if (!gridfsBucket) {
      return res.status(500).json({
        success: false,
        message: "GridFS bucket not initialized",
      });
    }

    const objectId = new mongoose.Types.ObjectId(image_id);

    // Delete from MongoDB GridFS
    await gridfsBucket.delete(objectId);

    res.json({
      success: true,
      message: "Image deleted successfully",
    });
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
// @desc    Upload user avatar to MongoDB
// @access  Private
router.post("/user-avatar", upload.single("avatar"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No avatar file provided",
      });
    }

    const filename = `avatar_${Date.now()}_${req.file.originalname}`;
    const result = await storeImageInMongoDB(
      req.file.buffer,
      filename,
      req.file.mimetype,
    );

    res.json({
      success: true,
      message: "Avatar uploaded successfully",
      data: {
        url: result.url,
        id: result._id,
        filename: result.filename,
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
