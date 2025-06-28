const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      unique: true,
      default: () => "PROD"+ Math.floor(1000 + Math.random() * 9000), // e.g., PROD-ab12cd
    },
    name: {
      type: String,
      required: [true, "Product name is required"],
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
    },
    shortDescription: {
      type: String,
      required: [true, "Short description is required"],
    },
    company: {
      type: String,
      default: "",
    },
    originalPrice: {
      type: Number,
      default: 0,
      min: [0, "Original price must be a non-negative number"],
    },
    price: {
      type: Number,
      required: [true, "Selling price is required"],
      min: [0, "Price must be a non-negative number"],
    },
    weight: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      default: "",
    },
    productBenefits: {
      type: String,
      default: "",
    },
    usageInstructions: {
      type: String,
      default: "",
    },
    stock: {
      type: Number,
      required: [true, "Stock is required"],
      min: [0, "Stock must be a non-negative number"],
    },
    images: {
      type: [String],
      required: [true, "At least one product image is required"],
      validate: {
        validator: (val) => val.length >= 1 && val.length <= 5,
        message: "Product must have between 1 and 5 images",
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);
