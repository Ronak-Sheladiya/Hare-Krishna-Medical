const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [200, "Product name cannot exceed 200 characters"],
    },
    shortDescription: {
      type: String,
      required: [true, "Short description is required"],
      trim: true,
      maxlength: [100, "Short description cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    company: {
      type: String,
      
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
    },
    originalPrice: {
      type: Number,
      min: [0, "Original price cannot be negative"],
    },
    category: {
      type: String,
      
      enum: [
        "Pain Relief",
        "Vitamins",
        "Cough & Cold",
        "First Aid",
        "Medical Devices",
        "Supplements",
        "Antibiotics",
        "Digestive Health",
        "Heart & Blood Pressure",
        "Diabetes Care",
      ],
    },
    weight: {
      type: String,
      trim: true,
    },
    stock: {
      type: Number,
      required: [true, "Stock quantity is required"],
      min: [0, "Stock cannot be negative"],
      default: 0,
    },
    minStock: {
      type: Number,
      default: 5,
    },
    images: {
      type: [String],
      required: [true, "At least one product image is required"],
      validate: {
        validator: function (arr) {
          return arr && arr.length > 0 && arr.length <= 5;
        },
        message: "Product must have between 1 and 5 images",
      },
    },
    // Legacy image structure - keeping for backward compatibility
    imageUrls: [
      {
        url: String,
        public_id: String,
        alt: String,
      },
    ],
    benefits: {
      type: String,
      trim: true,
    },
    composition: {
      type: String,
      trim: true,
    },
    usage: {
      type: String,
      trim: true,
    },
    sideEffects: {
      type: String,
      trim: true,
    },
    contraindications: {
      type: String,
      trim: true,
    },
    batchNo: {
      type: String,
      trim: true,
    },
    mfgDate: {
      type: Date,
    },
    expDate: {
      type: Date,
    },
    tags: [String],
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    rating: {
      average: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
    },
    sales: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
    lastStockUpdate: Date,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
);

// Virtual for discounted price
productSchema.virtual("discountedPrice").get(function () {
  return this.mrp - (this.mrp * this.discount) / 100;
});

// Virtual for stock status
productSchema.virtual("stockStatus").get(function () {
  if (this.stock === 0) return "Out of Stock";
  if (this.stock <= this.minStock) return "Low Stock";
  return "In Stock";
});

// Index for search optimization
productSchema.index({ name: "text", description: "text", tags: "text" });
productSchema.index({ category: 1, subCategory: 1 });
productSchema.index({ price: 1 });
productSchema.index({ rating: -1 });
productSchema.index({ sales: -1 });
productSchema.index({ isActive: 1 });

// Pre-save middleware
productSchema.pre("save", function (next) {
  if (this.isModified("stock")) {
    this.lastStockUpdate = new Date();
  }
  next();
});

// Methods
productSchema.methods.updateStock = function (
  quantity,
  operation = "decrease",
) {
  if (operation === "decrease") {
    this.stock = Math.max(0, this.stock - quantity);
  } else {
    this.stock += quantity;
  }
  this.lastStockUpdate = new Date();
  return this.save();
};

productSchema.methods.incrementViews = function () {
  this.views += 1;
  return this.save();
};

productSchema.methods.updateRating = function (newRating) {
  const totalRating = this.rating.average * this.rating.count + newRating;
  this.rating.count += 1;
  this.rating.average = totalRating / this.rating.count;
  return this.save();
};

module.exports = mongoose.model("Product", productSchema);
