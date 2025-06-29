const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB for quick seeding");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

const quickSeed = async () => {
  try {
    await connectDB();

    // Define Product schema inline
    const productSchema = new mongoose.Schema(
      {
        name: { type: String, required: true },
        shortDescription: { type: String, required: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        stock: { type: Number, required: true },
        category: { type: String, default: "" },
        company: { type: String, default: "" },
        images: {
          type: [String],
          required: true,
          validate: {
            validator: (val) => val.length >= 1 && val.length <= 5,
            message: "Product must have between 1 and 5 images",
          },
        },
        isActive: { type: Boolean, default: true },
      },
      { timestamps: true },
    );

    const Product = mongoose.model("Product", productSchema);

    const products = [
      {
        name: "Paracetamol 500mg",
        shortDescription: "Pain relief tablets",
        description:
          "Effective pain reliever and fever reducer for adults and children.",
        price: 25,
        stock: 150,
        category: "Tablet",
        company: "Cipla",
        images: ["https://via.placeholder.com/200x200?text=Paracetamol"],
        isActive: true,
      },
      {
        name: "Vitamin D3",
        shortDescription: "Vitamin D3 supplement",
        description: "Essential vitamin D3 for bone health and immunity.",
        price: 180,
        stock: 100,
        category: "Tablet",
        company: "Sun Pharma",
        images: ["https://via.placeholder.com/200x200?text=Vitamin+D3"],
        isActive: true,
      },
      {
        name: "Cough Syrup",
        shortDescription: "Natural cough relief",
        description: "Herbal cough syrup for effective cough relief.",
        price: 85,
        stock: 200,
        category: "Syrup",
        company: "Himalaya",
        images: ["https://via.placeholder.com/200x200?text=Cough+Syrup"],
        isActive: true,
      },
      {
        name: "Vitamin C Tablets",
        shortDescription: "Immunity booster",
        description:
          "High potency Vitamin C for immunity and antioxidant support.",
        price: 120,
        stock: 80,
        category: "Tablet",
        company: "HealthKart",
        images: ["https://via.placeholder.com/200x200?text=Vitamin+C"],
        isActive: true,
      },
      {
        name: "Antiseptic Cream",
        shortDescription: "Wound care cream",
        description: "Antiseptic cream for cuts, wounds and skin protection.",
        price: 65,
        stock: 90,
        category: "Cream",
        company: "Johnson & Johnson",
        images: ["https://via.placeholder.com/200x200?text=Antiseptic"],
        isActive: true,
      },
    ];

    // Clear existing products and insert new ones
    await Product.deleteMany({});
    console.log("🗑️ Cleared existing products");

    const result = await Product.insertMany(products);
    console.log(`✅ Successfully inserted ${result.length} products`);

    result.forEach((product, index) => {
      console.log(`   ${index + 1}. ${product.name} - ₹${product.price}`);
    });

    console.log("🎉 Quick seeding completed!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Quick seeding failed:", error);
    process.exit(1);
  }
};

quickSeed();
