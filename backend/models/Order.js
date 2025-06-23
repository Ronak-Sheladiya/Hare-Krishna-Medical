const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: String,
        price: Number,
        mrp: Number,
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        total: Number,
        image: String,
      },
    ],
    shippingAddress: {
      fullName: String,
      mobile: String,
      email: String,
      address: String,
      city: String,
      state: String,
      pincode: String,
      landmark: String,
    },
    orderStatus: {
      type: String,
      enum: [
        "Pending",
        "Confirmed",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled",
        "Returned",
      ],
      default: "Pending",
    },
    paymentMethod: {
      type: String,
      enum: ["COD", "Online", "Card", "UPI"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: [
        "Pending",
        "Completed",
        "Failed",
        "Refunded",
        "Partially Refunded",
      ],
      default: "Pending",
    },
    paymentId: String,
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,
    subtotal: {
      type: Number,
      required: true,
    },
    shippingCharges: {
      type: Number,
      default: 0,
    },
    tax: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      required: true,
    },
    estimatedDeliveryDate: Date,
    actualDeliveryDate: Date,
    trackingNumber: String,
    courierService: String,
    notes: String,
    adminNotes: String,
    invoice: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Invoice",
    },
    statusHistory: [
      {
        status: String,
        timestamp: { type: Date, default: Date.now },
        note: String,
        updatedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
    cancellationReason: String,
    returnReason: String,
    refundAmount: Number,
    refundDate: Date,
  },
  {
    timestamps: true,
  },
);

// Generate order ID
orderSchema.pre("save", function (next) {
  if (!this.orderId) {
    const timestamp = Date.now().toString();
    this.orderId = "HKM" + timestamp.slice(-8);
  }
  next();
});

// Calculate totals
orderSchema.pre("save", function (next) {
  // Calculate subtotal from items
  this.subtotal = this.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  // Calculate tax (5% of subtotal)
  this.tax = this.subtotal * 0.05;

  // Calculate shipping charges (free for orders above 500)
  if (this.subtotal >= 500) {
    this.shippingCharges = 0;
  } else {
    this.shippingCharges = 50;
  }

  // Calculate total
  this.total = this.subtotal + this.shippingCharges + this.tax - this.discount;

  next();
});

// Add status change to history
orderSchema.methods.updateStatus = function (
  newStatus,
  note = "",
  updatedBy = null,
) {
  this.statusHistory.push({
    status: newStatus,
    note: note,
    updatedBy: updatedBy,
  });
  this.orderStatus = newStatus;

  // Set delivery date if delivered
  if (newStatus === "Delivered") {
    this.actualDeliveryDate = new Date();
  }

  return this.save();
};

// Calculate estimated delivery date
orderSchema.methods.setEstimatedDelivery = function () {
  const deliveryDays = this.shippingAddress.state === "Gujarat" ? 2 : 5;
  this.estimatedDeliveryDate = new Date(
    Date.now() + deliveryDays * 24 * 60 * 60 * 1000,
  );
  return this.save();
};

// Process cancellation
orderSchema.methods.cancelOrder = function (reason, refundAmount = 0) {
  this.orderStatus = "Cancelled";
  this.cancellationReason = reason;
  if (refundAmount > 0) {
    this.refundAmount = refundAmount;
    this.refundDate = new Date();
    this.paymentStatus = "Refunded";
  }
  this.statusHistory.push({
    status: "Cancelled",
    note: `Order cancelled: ${reason}`,
    timestamp: new Date(),
  });
  return this.save();
};

// Static methods for analytics
orderSchema.statics.getOrderStats = async function () {
  const stats = await this.aggregate([
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        totalRevenue: { $sum: "$total" },
        averageOrderValue: { $avg: "$total" },
        pendingOrders: {
          $sum: { $cond: [{ $eq: ["$orderStatus", "Pending"] }, 1, 0] },
        },
        completedOrders: {
          $sum: { $cond: [{ $eq: ["$orderStatus", "Delivered"] }, 1, 0] },
        },
      },
    },
  ]);

  return (
    stats[0] || {
      totalOrders: 0,
      totalRevenue: 0,
      averageOrderValue: 0,
      pendingOrders: 0,
      completedOrders: 0,
    }
  );
};

module.exports = mongoose.model("Order", orderSchema);
