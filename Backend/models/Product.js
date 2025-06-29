const mongoose = require("mongoose");
const slugify = require("slugify");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [200, "Product name cannot exceed 200 characters"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    company: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
      maxlength: [100, "Company name cannot exceed 100 characters"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    originalPrice: {
      type: Number,
      min: [0, "Original price cannot be negative"],
    },
    stock: {
      type: Number,
      required: [true, "Stock quantity is required"],
      min: [0, "Stock cannot be negative"],
      default: 0,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
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
        "Other",
      ],
    },
    weight: {
      type: String,
      trim: true,
    },
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String },
        alt: { type: String, default: "" },
        isPrimary: { type: Boolean, default: false },
      },
    ],
    shortDescription: {
      type: String,
      maxlength: [500, "Short description cannot exceed 500 characters"],
      trim: true,
    },
    description: {
      type: String,
      maxlength: [2000, "Description cannot exceed 2000 characters"],
      trim: true,
    },
    benefits: {
      type: String,
      maxlength: [1000, "Benefits cannot exceed 1000 characters"],
      trim: true,
    },
    usage: {
      type: String,
      maxlength: [1000, "Usage instructions cannot exceed 1000 characters"],
      trim: true,
    },
    composition: {
      type: String,
      maxlength: [1000, "Composition cannot exceed 1000 characters"],
      trim: true,
    },
    sideEffects: {
      type: String,
      maxlength: [1000, "Side effects cannot exceed 1000 characters"],
      trim: true,
    },
    contraindications: {
      type: String,
      maxlength: [1000, "Contraindications cannot exceed 1000 characters"],
      trim: true,
    },
    batchNo: {
      type: String,
      trim: true,
      maxlength: [50, "Batch number cannot exceed 50 characters"],
    },
    mfgDate: {
      type: Date,
    },
    expDate: {
      type: Date,
      validate: {
        validator: function (value) {
          return !this.mfgDate || !value || value > this.mfgDate;
        },
        message: "Expiry date must be after manufacturing date",
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isOnSale: {
      type: Boolean,
      default: false,
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    ratings: {
      average: { type: Number, default: 0, min: 0, max: 5 },
      count: { type: Number, default: 0, min: 0 },
    },
    reviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        name: { type: String, required: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
        comment: {
          type: String,
          maxlength: [500, "Review comment cannot exceed 500 characters"],
        },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    salesCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    viewCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Virtuals
productSchema.virtual("discountPercentage").get(function () {
  if (this.originalPrice && this.originalPrice > this.price) {
    return Math.round(
      ((this.originalPrice - this.price) / this.originalPrice) * 100,
    );
  }
  return 0;
});

productSchema.virtual("isInStock").get(function () {
  return this.stock > 0;
});

productSchema.virtual("isExpired").get(function () {
  return this.expDate && this.expDate < new Date();
});

productSchema.virtual("isExpiringSoon").get(function () {
  if (!this.expDate) return false;
  const threeMonthsFromNow = new Date();
  threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
  return this.expDate < threeMonthsFromNow;
});

productSchema.virtual("primaryImage").get(function () {
  const primary = this.images.find((img) => img.isPrimary);
  return primary || this.images[0];
});

// Indexes for performance
productSchema.index({ name: "text", description: "text", company: "text" });
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ isActive: 1 });
productSchema.index({ isFeatured: 1 });
productSchema.index({ stock: 1 });
productSchema.index({ slug: 1 });
productSchema.index({ "ratings.average": -1 });
productSchema.index({ salesCount: -1 });

// Pre-save middleware to generate slug
productSchema.pre("save", async function (next) {
  if (this.isModified("name") && this.name) {
    let baseSlug = slugify(this.name, {
      lower: true,
      strict: true,
      remove: /[*+~.()'"!:@]/g,
    });

    // Ensure unique slug
    let slug = baseSlug;
    let counter = 1;

    // Check if slug already exists
    while (true) {
      const existingProduct = await this.constructor.findOne({
        slug: slug,
        _id: { $ne: this._id },
      });

      if (!existingProduct) {
        break;
      }

      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    this.slug = slug;
  }

  // Ensure at least one image is primary
  if (this.images && this.images.length > 0) {
    const hasPrimary = this.images.some((img) => img.isPrimary);
    if (!hasPrimary) {
      this.images[0].isPrimary = true;
    }
  }

  // Calculate if on sale
  this.isOnSale = this.originalPrice && this.originalPrice > this.price;

  next();
});

// Method to add review
productSchema.methods.addReview = function (userId, userName, rating, comment) {
  // Check if user already reviewed this product
  const existingReview = this.reviews.find(
    (review) => review.user.toString() === userId.toString(),
  );

  if (existingReview) {
    // Update existing review
    existingReview.rating = rating;
    existingReview.comment = comment;
  } else {
    // Add new review
    this.reviews.push({
      user: userId,
      name: userName,
      rating,
      comment,
    });
  }

  // Recalculate ratings
  this.calculateRatings();

  return this.save();
};

// Method to calculate average ratings
productSchema.methods.calculateRatings = function () {
  if (this.reviews.length === 0) {
    this.ratings.average = 0;
    this.ratings.count = 0;
  } else {
    const totalRating = this.reviews.reduce(
      (sum, review) => sum + review.rating,
      0,
    );
    this.ratings.average =
      Math.round((totalRating / this.reviews.length) * 10) / 10;
    this.ratings.count = this.reviews.length;
  }
};

// Method to increment view count
productSchema.methods.incrementViews = function () {
  this.viewCount += 1;
  return this.save();
};

// Method to increment sales count
productSchema.methods.incrementSales = function (quantity = 1) {
  this.salesCount += quantity;
  return this.save();
};

// Method to update stock
productSchema.methods.updateStock = function (
  quantity,
  operation = "subtract",
) {
  if (operation === "subtract") {
    this.stock = Math.max(0, this.stock - quantity);
  } else if (operation === "add") {
    this.stock += quantity;
  }
  return this.save();
};

// Static method to get featured products
productSchema.statics.getFeatured = function (limit = 8) {
  return this.find({
    isActive: true,
    isFeatured: true,
    stock: { $gt: 0 },
  })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate("createdBy", "fullName");
};

// Static method to search products
productSchema.statics.searchProducts = function (query, options = {}) {
  const {
    category,
    minPrice,
    maxPrice,
    sortBy = "createdAt",
    sortOrder = -1,
    page = 1,
    limit = 20,
  } = options;

  const searchCriteria = {
    isActive: true,
    stock: { $gt: 0 },
  };

  if (query) {
    searchCriteria.$text = { $search: query };
  }

  if (category && category !== "") {
    searchCriteria.category = category;
  }

  if (minPrice !== undefined) {
    searchCriteria.price = { ...searchCriteria.price, $gte: minPrice };
  }

  if (maxPrice !== undefined) {
    searchCriteria.price = { ...searchCriteria.price, $lte: maxPrice };
  }

  const skip = (page - 1) * limit;

  return this.find(searchCriteria)
    .sort({ [sortBy]: sortOrder })
    .skip(skip)
    .limit(limit)
    .populate("createdBy", "fullName");
};

module.exports = mongoose.model("Product", productSchema);
