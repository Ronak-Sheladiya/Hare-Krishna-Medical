const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema(
  {
    invoiceId: {
      type: String,
      unique: true,
      required: true,
    },
    invoiceNumber: {
      type: String,
      unique: true,
      required: true,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    customerInfo: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      mobile: { type: String, required: true },
      address: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        pincode: { type: String, required: true },
        landmark: { type: String },
      },
    },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        name: { type: String, required: true },
        description: { type: String },
        quantity: { type: Number, required: true, min: 1 },
        unitPrice: { type: Number, required: true, min: 0 },
        totalPrice: { type: Number, required: true, min: 0 },
        hsn: { type: String }, // HSN code for tax purposes
        taxRate: { type: Number, default: 0 },
      },
    ],
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    taxDetails: {
      cgst: { type: Number, default: 0 },
      sgst: { type: Number, default: 0 },
      igst: { type: Number, default: 0 },
      totalTax: { type: Number, default: 0 },
    },
    discount: {
      amount: { type: Number, default: 0 },
      percentage: { type: Number, default: 0 },
      description: { type: String },
    },
    shippingCharges: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentDetails: {
      method: { type: String, required: true },
      status: {
        type: String,
        enum: ["paid", "pending", "failed"],
        default: "pending",
      },
      transactionId: { type: String },
      paidAt: { type: Date },
    },
    invoiceDate: {
      type: Date,
      default: Date.now,
      required: true,
    },
    dueDate: {
      type: Date,
    },
    letterhead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Letterhead",
    },
    companyInfo: {
      name: { type: String, default: "Hare Krishna Medical Store" },
      address: { type: String },
      phone: { type: String },
      email: { type: String },
      gst: { type: String },
      logo: { type: String },
    },
    notes: {
      public: { type: String, maxlength: 500 }, // Visible to customer
      private: { type: String, maxlength: 500 }, // Internal notes
    },
    status: {
      type: String,
      enum: ["draft", "sent", "paid", "overdue", "cancelled"],
      default: "draft",
    },
    qrCode: {
      data: { type: String },
      image: { type: String }, // Base64 or URL
    },
    verificationUrl: {
      type: String,
    },
    downloadCount: {
      type: Number,
      default: 0,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    emailSent: {
      type: Boolean,
      default: false,
    },
    emailSentAt: {
      type: Date,
    },
    createdBy: {
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
invoiceSchema.virtual("isOverdue").get(function () {
  return this.dueDate && this.dueDate < new Date() && this.status !== "paid";
});

invoiceSchema.virtual("daysOverdue").get(function () {
  if (!this.isOverdue) return 0;
  const diffTime = Math.abs(new Date() - this.dueDate);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

invoiceSchema.virtual("totalItems").get(function () {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

// Indexes
invoiceSchema.index({ invoiceId: 1 });
invoiceSchema.index({ invoiceNumber: 1 });
invoiceSchema.index({ user: 1, createdAt: -1 });
invoiceSchema.index({ order: 1 });
invoiceSchema.index({ status: 1 });
invoiceSchema.index({ invoiceDate: -1 });

// Pre-save middleware to generate invoice ID and number
invoiceSchema.pre("save", function (next) {
  if (!this.invoiceId) {
    this.invoiceId = `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }

  if (!this.invoiceNumber) {
    const year = new Date().getFullYear();
    const month = (new Date().getMonth() + 1).toString().padStart(2, "0");
    const timestamp = Date.now().toString().slice(-6);
    this.invoiceNumber = `HKM/${year}/${month}/${timestamp}`;
  }

  // Calculate total tax
  this.taxDetails.totalTax =
    this.taxDetails.cgst + this.taxDetails.sgst + this.taxDetails.igst;

  // Set due date if not provided (default 30 days)
  if (!this.dueDate) {
    this.dueDate = new Date();
    this.dueDate.setDate(this.dueDate.getDate() + 30);
  }

  // Generate verification URL
  if (!this.verificationUrl) {
    this.verificationUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/invoice/${this.invoiceId}`;
  }

  next();
});

// Method to mark as paid
invoiceSchema.methods.markAsPaid = function (transactionId = null) {
  this.status = "paid";
  this.paymentDetails.status = "paid";
  this.paymentDetails.paidAt = new Date();

  if (transactionId) {
    this.paymentDetails.transactionId = transactionId;
  }

  return this.save();
};

// Method to increment view count
invoiceSchema.methods.incrementViewCount = function () {
  this.viewCount += 1;
  return this.save();
};

// Method to increment download count
invoiceSchema.methods.incrementDownloadCount = function () {
  this.downloadCount += 1;
  return this.save();
};

// Method to mark email as sent
invoiceSchema.methods.markEmailSent = function () {
  this.emailSent = true;
  this.emailSentAt = new Date();
  return this.save();
};

// Method to calculate tax (GST)
invoiceSchema.methods.calculateGST = function (isInterState = false) {
  const taxableAmount = this.subtotal - this.discount.amount;
  const taxRate = 0.18; // 18% GST (can be made configurable)

  if (isInterState) {
    // Inter-state: IGST
    this.taxDetails.igst = Math.round(taxableAmount * taxRate * 100) / 100;
    this.taxDetails.cgst = 0;
    this.taxDetails.sgst = 0;
  } else {
    // Intra-state: CGST + SGST
    const halfTaxRate = taxRate / 2;
    this.taxDetails.cgst = Math.round(taxableAmount * halfTaxRate * 100) / 100;
    this.taxDetails.sgst = Math.round(taxableAmount * halfTaxRate * 100) / 100;
    this.taxDetails.igst = 0;
  }

  this.taxDetails.totalTax =
    this.taxDetails.cgst + this.taxDetails.sgst + this.taxDetails.igst;

  // Update total amount
  this.totalAmount =
    this.subtotal +
    this.taxDetails.totalTax +
    this.shippingCharges -
    this.discount.amount;

  return this;
};

// Static method to get invoice statistics
invoiceSchema.statics.getInvoiceStats = async function (startDate, endDate) {
  const matchCondition = {};

  if (startDate && endDate) {
    matchCondition.invoiceDate = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }

  const stats = await this.aggregate([
    { $match: matchCondition },
    {
      $group: {
        _id: null,
        totalInvoices: { $sum: 1 },
        totalAmount: { $sum: "$totalAmount" },
        paidAmount: {
          $sum: { $cond: [{ $eq: ["$status", "paid"] }, "$totalAmount", 0] },
        },
        pendingAmount: {
          $sum: { $cond: [{ $ne: ["$status", "paid"] }, "$totalAmount", 0] },
        },
        paidInvoices: {
          $sum: { $cond: [{ $eq: ["$status", "paid"] }, 1, 0] },
        },
        pendingInvoices: {
          $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] },
        },
        overdueInvoices: {
          $sum: { $cond: [{ $eq: ["$status", "overdue"] }, 1, 0] },
        },
      },
    },
  ]);

  return (
    stats[0] || {
      totalInvoices: 0,
      totalAmount: 0,
      paidAmount: 0,
      pendingAmount: 0,
      paidInvoices: 0,
      pendingInvoices: 0,
      overdueInvoices: 0,
    }
  );
};

module.exports = mongoose.model("Invoice", invoiceSchema);
