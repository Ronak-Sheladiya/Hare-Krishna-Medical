const mongoose = require("mongoose");
const QRCode = require("qrcode");

const invoiceSchema = new mongoose.Schema(
  {
    invoiceId: {
      type: String,
      required: true,
      unique: true,
      default: () => "INV" + Math.floor(1000 + Math.random() * 9000), // e.g., USER-ab12cd
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
    invoiceDate: {
      type: Date,
      default: Date.now,
    },
    dueDate: {
      type: Date,
      default: function () {
        return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now
      },
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        name: String,
        price: Number,
        mrp: Number,
        quantity: Number,
        total: Number,
        image: String,
      },
    ],
    customerDetails: {
      fullName: String,
      email: String,
      mobile: String,
      address: String,
      city: String,
      state: String,
      pincode: String,
    },
    subtotal: Number,
    tax: {
      type: Number,
      default: 0,
    },
    shipping: Number,
    discount: Number,
    total: Number,
    status: {
      type: String,
      enum: ["Draft", "Sent", "Paid", "Overdue", "Cancelled"],
      default: "Draft",
    },
    paymentMethod: String,
    paymentStatus: {
      type: String,
      enum: ["Pending", "Completed", "Failed", "Refunded"],
      default: "Pending",
    },
    paymentDate: Date,
    qrCode: String,
    qrCodeData: String,
    notes: String,
    terms: {
      type: String,
      default:
        "Payment due within 30 days. Goods once sold will not be taken back. Subject to Gujarat jurisdiction only.",
    },
    invoiceUrl: String,
    emailSent: {
      type: Boolean,
      default: false,
    },
    emailSentDate: Date,
    remindersSent: [
      {
        date: Date,
        type: String, // 'email'
      },
    ],
  },
  {
    timestamps: true,
  },
);

// Generate invoice ID and QR code
invoiceSchema.pre("save", async function (next) {
  if (!this.invoiceId) {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, "0");
    const day = String(new Date().getDate()).padStart(2, "0");
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");
    this.invoiceId = `HKM-INV-${year}-${month}${day}-${random}`;
  }

  // Always generate/update QR code for invoice
  if (this.invoiceId) {
    try {
      // Create public verification URL for QR code - use primary domain
      const primaryDomain =
        process.env.PRIMARY_DOMAIN || "https://hk-medical.vercel.app";
      const verificationUrl = `${primaryDomain}/invoice/${this.invoiceId}`;

      // Store comprehensive data for verification
      this.qrCodeData = JSON.stringify({
        invoice_id: this.invoiceId,
        customer_name: this.customerDetails?.fullName || "Customer",
        total_amount: this.total,
        verification_url: verificationUrl,
        invoice_url: verificationUrl,
        generated_at: new Date().toISOString(),
        company: "Hare Krishna Medical",
        type: "invoice_verification",
      });

      // Generate high-quality QR code with verification URL
      this.qrCode = await QRCode.toDataURL(verificationUrl, {
        width: 180,
        margin: 2,
        color: {
          dark: "#1a202c",
          light: "#ffffff",
        },
        errorCorrectionLevel: "M",
      });
    } catch (error) {
      console.error("QR Code generation error:", error);
      // Don't fail the save if QR generation fails
      this.qrCode = null;
      this.qrCodeData = null;
    }
  }

  next();
});

// Update payment status
invoiceSchema.methods.updatePaymentStatus = function (status, method = null) {
  this.paymentStatus = status;
  if (method) {
    this.paymentMethod = method;
  }
  if (status === "Completed") {
    this.status = "Paid";
    this.paymentDate = new Date();
  }
  return this.save();
};

// Mark as sent
invoiceSchema.methods.markAsSent = function () {
  this.status = "Sent";
  this.emailSent = true;
  this.emailSentDate = new Date();
  return this.save();
};

// Add reminder
invoiceSchema.methods.addReminder = function (type = "email") {
  this.remindersSent.push({
    date: new Date(),
    type: type,
  });
  return this.save();
};

// Check if overdue
invoiceSchema.methods.checkOverdue = function () {
  if (this.status !== "Paid" && new Date() > this.dueDate) {
    this.status = "Overdue";
    return this.save();
  }
  return false;
};

// Static methods for analytics
invoiceSchema.statics.getInvoiceStats = async function () {
  const stats = await this.aggregate([
    {
      $group: {
        _id: null,
        totalInvoices: { $sum: 1 },
        totalAmount: { $sum: "$total" },
        paidInvoices: {
          $sum: { $cond: [{ $eq: ["$status", "Paid"] }, 1, 0] },
        },
        pendingInvoices: {
          $sum: { $cond: [{ $eq: ["$status", "Sent"] }, 1, 0] },
        },
        overdueInvoices: {
          $sum: { $cond: [{ $eq: ["$status", "Overdue"] }, 1, 0] },
        },
        paidAmount: {
          $sum: { $cond: [{ $eq: ["$status", "Paid"] }, "$total", 0] },
        },
      },
    },
  ]);

  return (
    stats[0] || {
      totalInvoices: 0,
      totalAmount: 0,
      paidInvoices: 0,
      pendingInvoices: 0,
      overdueInvoices: 0,
      paidAmount: 0,
    }
  );
};

module.exports = mongoose.model("Invoice", invoiceSchema);
