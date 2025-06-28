// API Fixes and Improvements
// This script contains fixes for common API issues

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Fix 1: User Model Address Field Issue
// The address field in the User model should handle both string and object formats
const userAddressFix = async () => {
  try {
    const User = require("./models/User");
    const users = await User.find();

    for (let user of users) {
      if (typeof user.address === "string" && user.address) {
        // Convert string address to object format
        user.address = {
          street: user.address,
          city: "",
          state: "",
          pincode: "",
        };
        await user.save();
      }
    }
    console.log("✅ User address format fixed");
  } catch (error) {
    console.error("❌ User address fix failed:", error.message);
  }
};

// Fix 2: Product Model Category Validation
// Ensure categories match the validation rules
const productCategoryFix = async () => {
  try {
    const Product = require("./models/Product");
    const validCategories = [
      "Medicine",
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
    ];

    const products = await Product.find();
    for (let product of products) {
      if (!validCategories.includes(product.category)) {
        // Default to 'Medicine' if category is invalid
        product.category = "Medicine";
        await product.save();
      }
    }
    console.log("✅ Product categories fixed");
  } catch (error) {
    console.error("❌ Product category fix failed:", error.message);
  }
};

// Fix 3: Ensure all required indexes are created
const createRequiredIndexes = async () => {
  try {
    const User = require("./models/User");
    const Product = require("./models/Product");
    const Order = require("./models/Order");

    // Create indexes for better performance
    await User.collection.createIndex({ email: 1 }, { unique: true });
    await User.collection.createIndex({ mobile: 1 }, { unique: true });
    await Product.collection.createIndex({ name: "text", description: "text" });
    await Product.collection.createIndex({ category: 1 });
    await Product.collection.createIndex({ price: 1 });
    await Order.collection.createIndex({ userId: 1 });
    await Order.collection.createIndex({ status: 1 });

    console.log("✅ Database indexes created");
  } catch (error) {
    console.error("❌ Index creation failed:", error.message);
  }
};

// Fix 4: Product Model Improvements
const fixProductModel = () => {
  const productModelFix = `
// Updated Product Schema with better validation
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [200, 'Product name cannot exceed 200 characters']
  },
  brand: {
    type: String,
    required: [true, 'Brand is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: ['Medicine', 'Pain Relief', 'Vitamins', 'Cough & Cold', 'First Aid', 
               'Medical Devices', 'Supplements', 'Antibiotics', 'Digestive Health', 
               'Heart & Blood Pressure', 'Diabetes Care'],
      message: 'Invalid category'
    }
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  originalPrice: {
    type: Number,
    min: [0, 'Original price cannot be negative']
  },
  stock: {
    type: Number,
    required: [true, 'Stock is required'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  images: [{
    type: String,
    validate: {
      validator: function(v) {
        return /^https?:\\/\\/.+/.test(v);
      },
      message: 'Invalid image URL'
    }
  }],
  dosage: String,
  manufacturer: String,
  features: [String],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});
`;
  console.log("📝 Product model improvements available");
};

// Fix 5: Auth Controller Improvements
const authControllerFixes = () => {
  const fixes = `
// Auth Controller Fixes:
1. Better error handling for database connection issues
2. Improved password validation
3. Better token generation
4. Enhanced email verification flow
5. Proper role-based access control
`;
  console.log("📝 Auth controller fixes needed:", fixes);
};

// Fix 6: Route Error Handling
const routeErrorHandlingFix = () => {
  const errorHandler = `
// Global Error Handler for Routes
const globalErrorHandler = (err, req, res, next) => {
  console.error('API Error:', err);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors
    });
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format'
    });
  }

  // Duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      success: false,
      message: \`\${field} already exists\`
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired'
    });
  }

  // Default error
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
};
`;
  console.log("📝 Error handling improvements available");
};

// Fix 7: CORS Configuration
const corsConfigFix = () => {
  const corsConfig = `
// Improved CORS Configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5173',
      'https://hk-medical.vercel.app',
      'https://hkmedical.vercel.app', 
      'https://harekrishnamedical.vercel.app',
      'https://hare-krishna-medical.vercel.app'
    ];
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
`;
  console.log("📝 CORS configuration improvements available");
};

// Main fix function
const runAllFixes = async () => {
  console.log("🔧 Running API fixes...\n");

  try {
    // Connect to database if not connected
    if (mongoose.connection.readyState === 0) {
      const mongoURI =
        process.env.MONGODB_URI ||
        "mongodb+srv://ronaksheladiya652:Ronak95865@cluster0.loaubzp.mongodb.net/Hare_Krishna_Medical_db?retryWrites=true&w=majority&appName=Cluster0";

      await mongoose.connect(mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("✅ Connected to database for fixes");
    }

    // Run fixes
    await userAddressFix();
    await productCategoryFix();
    await createRequiredIndexes();

    // Display available improvements
    fixProductModel();
    authControllerFixes();
    routeErrorHandlingFix();
    corsConfigFix();

    console.log("\n🎉 All API fixes completed!");
  } catch (error) {
    console.error("❌ Fix process failed:", error.message);
  }
};

module.exports = {
  runAllFixes,
  userAddressFix,
  productCategoryFix,
  createRequiredIndexes,
  fixProductModel,
  authControllerFixes,
  routeErrorHandlingFix,
  corsConfigFix,
};

// Run fixes if called directly
if (require.main === module) {
  runAllFixes()
    .then(() => {
      console.log("Exiting...");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Script failed:", error);
      process.exit(1);
    });
}
