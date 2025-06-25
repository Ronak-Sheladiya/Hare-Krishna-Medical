const mongoose = require("mongoose");

class UploadController {
  constructor() {
    this.gridfsBucket = null;
    // Initialize GridFS bucket when MongoDB connection is ready
    mongoose.connection.once("open", () => {
      this.gridfsBucket = new mongoose.mongo.GridFSBucket(
        mongoose.connection.db,
        {
          bucketName: "images",
        },
      );
    });
  }

  // Helper function to store image in MongoDB GridFS
  storeImageInMongoDB(buffer, filename, mimetype) {
    return new Promise((resolve, reject) => {
      if (!this.gridfsBucket) {
        return reject(new Error("GridFS bucket not initialized"));
      }

      const uploadStream = this.gridfsBucket.openUploadStream(filename, {
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
  }

  // Get image from MongoDB GridFS
  async getImage(req, res) {
    try {
      if (!this.gridfsBucket) {
        return res.status(500).json({
          success: false,
          message: "GridFS bucket not initialized",
        });
      }

      const objectId = new mongoose.Types.ObjectId(req.params.id);

      // Find the file
      const files = await this.gridfsBucket.find({ _id: objectId }).toArray();

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
      const downloadStream = this.gridfsBucket.openDownloadStream(objectId);
      downloadStream.pipe(res);
    } catch (error) {
      console.error("Error retrieving image:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve image",
        error: error.message,
      });
    }
  }

  // Upload single product image to MongoDB
  async uploadImage(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No image file provided",
        });
      }

      const filename = `product_${Date.now()}_${req.file.originalname}`;
      const result = await this.storeImageInMongoDB(
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
  }

  // Upload multiple product images to MongoDB
  async uploadProductImages(req, res) {
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
        return await this.storeImageInMongoDB(
          file.buffer,
          filename,
          file.mimetype,
        );
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
  }

  // Delete image from MongoDB GridFS
  async deleteImage(req, res) {
    try {
      const { image_id } = req.body;

      if (!image_id) {
        return res.status(400).json({
          success: false,
          message: "Image ID is required",
        });
      }

      if (!this.gridfsBucket) {
        return res.status(500).json({
          success: false,
          message: "GridFS bucket not initialized",
        });
      }

      const objectId = new mongoose.Types.ObjectId(image_id);

      // Delete from MongoDB GridFS
      await this.gridfsBucket.delete(objectId);

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
  }

  // Upload user avatar to MongoDB
  async uploadUserAvatar(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No avatar file provided",
        });
      }

      const filename = `avatar_${Date.now()}_${req.file.originalname}`;
      const result = await this.storeImageInMongoDB(
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
  }

  // Error handling for multer errors
  handleMulterError(error, req, res, next) {
    const multer = require("multer");

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
  }
}

module.exports = new UploadController();
