const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  productName: { type: String, required: true },
  productImage: { type: String },
  quantity: {
    type: Number,
    required: true,
    min: [1, "Quantity must be at least 1"],
  },
  price: {
    type: Number,
    required: true,
    min: [0, "Price cannot be negative"],
  },
  totalPrice: {
    type: Number,
    required: true,
    min: [0, "Total price cannot be negative"],
  },
});

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      unique: true,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // Allow null for guest orders
    },
    guestUserInfo: {
      email: { type: String },
      fullName: { type: String },
      mobile: { type: String },
    },
    items: [orderItemSchema],
    shippingAddress: {
      fullName: { type: String, required: true },
      mobile: { type: String, required: true },
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
      landmark: { type: String },
    },
    billingAddress: {
      fullName: { type: String, required: true },
      mobile: { type: String, required: true },
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
      landmark: { type: String },
    },
    subtotal: {
      type: Number,
      required: true,
      min: [0, "Subtotal cannot be negative"],
    },
    shippingCharges: {
      type: Number,
      default: 0,
      min: [0, "Shipping charges cannot be negative"],
    },
    tax: {
      type: Number,
      default: 0,
      min: [0, "Tax cannot be negative"],
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, "Discount cannot be negative"],
    },
    totalAmount: {
      type: Number,
      required: true,
      min: [0, "Total amount cannot be negative"],
    },
    paymentMethod: {
      type: String,
      enum: ["cod", "online", "upi", "card"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
    },
    paymentDetails: {
      transactionId: { type: String },
      paymentGateway: { type: String },
      paidAt: { type: Date },
    },
    orderStatus: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
        "returned",
      ],
      default: "pending",
    },
    statusHistory: [
      {
        status: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        note: { type: String },
        updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      },
    ],
    trackingInfo: {
      trackingNumber: { type: String },
      carrier: { type: String },
      estimatedDelivery: { type: Date },
    },
    notes: {
      customerNote: { type: String, maxlength: 500 },
      adminNote: { type: String, maxlength: 500 },
    },
    invoice: {
      invoiceId: { type: String },
      invoiceDate: { type: Date },
      invoiceUrl: { type: String },
    },
    cancellation: {
      reason: { type: String },
      cancelledAt: { type: Date },
      cancelledBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      refundAmount: { type: Number, default: 0 },
      refundStatus: {
        type: String,
        enum: ["not_applicable", "pending", "processed", "failed"],
        default: "not_applicable",
      },
    },
    deliveredAt: { type: Date },
    expectedDeliveryDate: { type: Date },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Virtuals
orderSchema.virtual("canBeCancelled").get(function () {
  return ["pending", "confirmed"].includes(this.orderStatus);
});

orderSchema.virtual("canBeReturned").get(function () {
  if (this.orderStatus !== "delivered" || !this.deliveredAt) return false;

  // Allow returns within 7 days of delivery
  const returnWindow = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
  return Date.now() - this.deliveredAt.getTime() <= returnWindow;
});

orderSchema.virtual("totalItems").get(function () {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

orderSchema.virtual("currentStatus").get(function () {
  return this.statusHistory[this.statusHistory.length - 1];
});

// Indexes
orderSchema.index({ orderId: 1 });
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ orderStatus: 1 });
orderSchema.index({ paymentStatus: 1 });
orderSchema.index({ createdAt: -1 });

// Pre-save middleware to generate order ID
orderSchema.pre("save", function (next) {
  if (!this.orderId) {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");
    this.orderId = `HKM${timestamp.slice(-6)}${random}`;
  }

  // Update status history if status changed
  if (this.isModified("orderStatus")) {
    this.statusHistory.push({
      status: this.orderStatus,
      timestamp: new Date(),
    });
  }

  next();
});

// Method to update order status
orderSchema.methods.updateStatus = function (
  newStatus,
  note = "",
  updatedBy = null,
) {
  this.orderStatus = newStatus;

  this.statusHistory.push({
    status: newStatus,
    timestamp: new Date(),
    note,
    updatedBy,
  });

  // Set delivered date if status is delivered
  if (newStatus === "delivered") {
    this.deliveredAt = new Date();
  }

  return this.save();
};

// Method to update payment status
orderSchema.methods.updatePaymentStatus = function (status, details = {}) {
  this.paymentStatus = status;

  if (status === "completed") {
    this.paymentDetails.paidAt = new Date();
    if (details.transactionId) {
      this.paymentDetails.transactionId = details.transactionId;
    }
    if (details.paymentGateway) {
      this.paymentDetails.paymentGateway = details.paymentGateway;
    }
  }

  return this.save();
};

// Method to cancel order
orderSchema.methods.cancelOrder = function (reason, cancelledBy = null) {
  if (!this.canBeCancelled) {
    throw new Error("Order cannot be cancelled in current status");
  }

  this.orderStatus = "cancelled";
  this.cancellation.reason = reason;
  this.cancellation.cancelledAt = new Date();
  this.cancellation.cancelledBy = cancelledBy;

  // Set refund amount if payment was completed
  if (this.paymentStatus === "completed") {
    this.cancellation.refundAmount = this.totalAmount;
    this.cancellation.refundStatus = "pending";
  }

  this.statusHistory.push({
    status: "cancelled",
    timestamp: new Date(),
    note: `Order cancelled: ${reason}`,
    updatedBy: cancelledBy,
  });

  return this.save();
};

// Method to calculate estimated delivery date
orderSchema.methods.calculateEstimatedDelivery = function () {
  const businessDays = 7; // Default 7 business days
  let deliveryDate = new Date();

  let daysAdded = 0;
  while (daysAdded < businessDays) {
    deliveryDate.setDate(deliveryDate.getDate() + 1);

    // Skip weekends (Saturday = 6, Sunday = 0)
    if (deliveryDate.getDay() !== 0 && deliveryDate.getDay() !== 6) {
      daysAdded++;
    }
  }

  this.expectedDeliveryDate = deliveryDate;
  return deliveryDate;
};

// Static method to get order statistics
orderSchema.statics.getOrderStats = async function (startDate, endDate) {
  const matchCondition = {};

  if (startDate && endDate) {
    matchCondition.createdAt = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }

  const stats = await this.aggregate([
    { $match: matchCondition },
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        totalRevenue: { $sum: "$totalAmount" },
        avgOrderValue: { $avg: "$totalAmount" },
        pendingOrders: {
          $sum: { $cond: [{ $eq: ["$orderStatus", "pending"] }, 1, 0] },
        },
        deliveredOrders: {
          $sum: { $cond: [{ $eq: ["$orderStatus", "delivered"] }, 1, 0] },
        },
        cancelledOrders: {
          $sum: { $cond: [{ $eq: ["$orderStatus", "cancelled"] }, 1, 0] },
        },
      },
    },
  ]);

  return (
    stats[0] || {
      totalOrders: 0,
      totalRevenue: 0,
      avgOrderValue: 0,
      pendingOrders: 0,
      deliveredOrders: 0,
      cancelledOrders: 0,
    }
  );
};

module.exports = mongoose.model("Order", orderSchema);
