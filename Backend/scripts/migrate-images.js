#!/usr/bin/env node

/**
 * Database Migration Script for Image Updates
 * This script migrates existing data to support the new image structure
 */

const mongoose = require("mongoose");
require("dotenv").config();

// Import models
const User = require("../models/User");
const Product = require("../models/Product");

const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI ||
        "mongodb://localhost:27017/hare_krishna_medical",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    );
    console.log("✅ Connected to MongoDB for migration");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

const migrateUserImages = async () => {
  console.log("\n🔄 Migrating user profile images...");

  try {
    // Find users with avatar field but no profileImage
    const usersToMigrate = await User.find({
      avatar: { $exists: true, $ne: "" },
      profileImage: { $exists: false },
    });

    console.log(`Found ${usersToMigrate.length} users to migrate`);

    for (const user of usersToMigrate) {
      // Copy avatar to profileImage
      user.profileImage = user.avatar;
      await user.save();
      console.log(`✅ Migrated user: ${user.email}`);
    }

    console.log("✅ User image migration completed");
  } catch (error) {
    console.error("❌ User migration error:", error);
  }
};

const migrateProductImages = async () => {
  console.log("\n🔄 Migrating product images...");

  try {
    // Find products with old image structure
    const productsToMigrate = await Product.find({
      $or: [
        { imageUrls: { $exists: true, $ne: [] } },
        { images: { $type: "object" } }, // Old array of objects
      ],
    });

    console.log(`Found ${productsToMigrate.length} products to migrate`);

    for (const product of productsToMigrate) {
      let newImages = [];

      // Extract URLs from old structure
      if (product.imageUrls && product.imageUrls.length > 0) {
        newImages = product.imageUrls
          .map((img) => img.url || img)
          .filter(Boolean);
      } else if (product.images && Array.isArray(product.images)) {
        // Handle different old structures
        newImages = product.images
          .map((img) => {
            if (typeof img === "string") return img;
            if (img.url) return img.url;
            return null;
          })
          .filter(Boolean);
      }

      // Ensure we have at least one image
      if (newImages.length === 0) {
        newImages = ["/placeholder.svg"]; // Default placeholder
      }

      // Update to new structure
      product.images = newImages.slice(0, 5); // Limit to 5 images

      // Clear old fields
      if (product.imageUrls) {
        product.imageUrls = undefined;
      }

      await product.save();
      console.log(
        `✅ Migrated product: ${product.name} (${newImages.length} images)`,
      );
    }

    console.log("✅ Product image migration completed");
  } catch (error) {
    console.error("❌ Product migration error:", error);
  }
};

const addImageValidation = async () => {
  console.log("\n🔄 Adding image validation...");

  try {
    // Find products without any images
    const productsWithoutImages = await Product.find({
      $or: [
        { images: { $exists: false } },
        { images: { $size: 0 } },
        { images: null },
      ],
    });

    console.log(
      `Found ${productsWithoutImages.length} products without images`,
    );

    for (const product of productsWithoutImages) {
      product.images = ["/placeholder.svg"];
      await product.save();
      console.log(`✅ Added placeholder image to: ${product.name}`);
    }

    console.log("✅ Image validation completed");
  } catch (error) {
    console.error("❌ Image validation error:", error);
  }
};

const createImageIndexes = async () => {
  console.log("\n🔄 Creating database indexes for images...");

  try {
    // Create indexes for better performance
    await User.collection.createIndex({ profileImage: 1 });
    await Product.collection.createIndex({ images: 1 });

    console.log("✅ Database indexes created");
  } catch (error) {
    console.error("❌ Index creation error:", error);
  }
};

const validateMigration = async () => {
  console.log("\n🔍 Validating migration results...");

  try {
    // Check user migration
    const usersWithImages = await User.countDocuments({
      profileImage: { $exists: true, $ne: "" },
    });

    // Check product migration
    const productsWithImages = await Product.countDocuments({
      images: { $exists: true, $not: { $size: 0 } },
    });

    const totalProducts = await Product.countDocuments();

    console.log(`📊 Migration Results:`);
    console.log(`   Users with profile images: ${usersWithImages}`);
    console.log(
      `   Products with images: ${productsWithImages}/${totalProducts}`,
    );

    if (productsWithImages === totalProducts) {
      console.log("✅ All products have images - migration successful!");
    } else {
      console.log("⚠️  Some products may need manual image assignment");
    }
  } catch (error) {
    console.error("❌ Validation error:", error);
  }
};

const runMigration = async () => {
  console.log("🚀 Starting Image Migration Script");
  console.log("==================================");

  await connectDB();

  try {
    await migrateUserImages();
    await migrateProductImages();
    await addImageValidation();
    await createImageIndexes();
    await validateMigration();

    console.log("\n🎉 Migration completed successfully!");
    console.log("\n📋 Next Steps:");
    console.log("1. Test image upload functionality");
    console.log("2. Verify product images display correctly");
    console.log("3. Check user profile image uploads");
    console.log("4. Update any remaining placeholder images");
  } catch (error) {
    console.error("❌ Migration failed:", error);
  } finally {
    await mongoose.connection.close();
    console.log("\n💾 Database connection closed");
  }
};

// Run migration if called directly
if (require.main === module) {
  runMigration();
}

module.exports = {
  migrateUserImages,
  migrateProductImages,
  addImageValidation,
  createImageIndexes,
  validateMigration,
};
