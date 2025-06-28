const mongoose = require("mongoose");
require("dotenv").config();

const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const Invoice = require("../models/Invoice");
const Message = require("../models/Message");
const Letterhead = require("../models/Letterhead");
const Verification = require("../models/Verification");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB for seeding");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

const createEmptyCollection = async (Model, dummyData) => {
  const doc = await Model.create(dummyData);
  await Model.deleteOne({ _id: doc._id });
  console.log(`✅ ${Model.modelName} collection created`);
};

const seedDatabase = async () => {
  try {
    console.log("🌱 Starting collection creation...");

    await createEmptyCollection(User, {
      fullName: "Temp User",
      email: "temp@example.com",
      password: "Temp123!",
      mobile: "9999999999",
    });

    await createEmptyCollection(Product, {
      name: "Temp Product",
      shortDescription: "Short desc",
      description: "Temp description",
      price: 0,
      stock: 0,
      category: "Syrup", // Must be a valid enum in your Product model
      company: "Temp Co",
      images: ["https://via.placeholder.com/150"],
      expiryDate: new Date(),
    });

    const user = await User.create({
      fullName: "ForRefs",
      email: "forrefs@example.com",
      password: "Temp123!",
      mobile: "8888888888",
    });

    const product = await Product.create({
      name: "Ref Product",
      shortDescription: "Short desc",
      description: "Temp description",
      price: 1,
      stock: 10,
      category: "Syrup",
      company: "Ref Co",
      images: ["https://via.placeholder.com/150"],
      expiryDate: new Date(),
    });

    const order = await Order.create({
      user: user._id,
      items: [{ product: product._id, name: product.name, quantity: 1, price: 1, total: 1 }],
      total: 1,
      shippingAddress: {
        fullName: user.fullName,
        mobile: user.mobile,
        email: user.email,
        address: "Temp Addr",
        city: "Temp",
        state: "GJ",
        pincode: "000000",
      },
      paymentMethod:  "COD",
      paymentStatus: "Pending",
      subtotal : 1,
    });

    await Invoice.create({
      user: user._id,
      order: order._id,
      amount: 1,
      invoiceDate: new Date(),
      dueDate: new Date(),
      items: order.items,
      customerDetails: order.shippingAddress,
      subtotal: 1,
      tax: 0,
      shipping: 0,
      discount: 0,
      total: 1,
      paymentMethod: "COD",
      paymentStatus: "Pending",
      status: "Sent",
      notes: "Temp",
    });

    await Message.create({
      name: "Test",
      email: "test@test.com",
      mobile: "7777777777",
      message: "Just for init",
      subject: "Seed",
    });

    await Letterhead.create({
      title: "Temp",
      content: "For init",
      
    });

    await Verification.create({
      user:user._id,
      mobile : "8888888888",
      email: "verify@temp.com",
      emailVerificationToken: "seed-token",
      type: "email_verification",
      expiresAt: new Date(Date.now() + 3600000),
    });

    // cleanup
    await Promise.all([
      User.deleteOne({ _id: user._id }),
      Product.deleteOne({ _id: product._id }),
      Order.deleteOne({ _id: order._id }),
      Invoice.deleteMany({ user: user._id }),
      Message.deleteMany({ email: "test@test.com" }),
      Letterhead.deleteMany({ createdBy: user._id }),
      Verification.deleteMany({ email: "verify@temp.com" }),
    ]);

    console.log("✅ All collections created and cleaned up successfully");

    if (require.main === module) process.exit(0);
  } catch (error) {
    console.error("❌ Database seeding failed:", error);
    if (require.main === module) process.exit(1);
    throw error;
  }
};

if (require.main === module) {
  connectDB().then(() => seedDatabase());
}

module.exports = { seedDatabase };
