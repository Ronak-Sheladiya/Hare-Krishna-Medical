const mongoose = require("mongoose");
const QRCode = require("qrcode");

const letterheadSchema = new mongoose.Schema(
  {
    letterheadId: {
      type: String,
      required: true,
      unique: true,
      default: () => `DOC-${uuidv4().split("-")[0]}`, // e.g., USER-ab12cd
    },
    // Header Information (similar to invoice header)
    header: {
      companyName: {
        type: String,
        default: "Hare Krishna Medical Store",
      },
      companyAddress: {
        type: String,
        default: "123 Main Street, Healthcare District",
      },
      companyCity: {
        type: String,
        default: "Medical City, State 12345",
      },
      companyPhone: {
        type: String,
        default: "+91 98765 43210",
      },
      companyEmail: {
        type: String,
        default: "info@harekrishnamedical.com",
      },
      logo: {
        type: String, // URL or base64 image
        default: "",
      },
    },
    // Letterhead Content
    title: {
      type: String,
      required: [true, "Letterhead title is required"],
      trim: true,
    },
    letterType: {
      type: String,
      required: false,
      enum: [
        "certificate",
        "recommendation",
        "authorization",
        "notice",
        "announcement",
        "invitation",
        "acknowledgment",
        "verification",
        "document", // Added for simplified letterheads
      ],
      default: "document",
    },
    // Recipient Information (optional for simplified letterheads)
    recipient: {
      name: {
        type: String,
        required: false,
        trim: true,
      },
      designation: {
        type: String,
        trim: true,
      },
      organization: {
        type: String,
        trim: true,
      },
      address: {
        type: String,
        trim: true,
      },
    },
    // Letter Content
    subject: {
      type: String,
      required: false, // Not required for simplified letterheads
      trim: true,
    },
    content: {
      type: String,
      required: [true, "Letter content is required"],
    },
    // Issuer Information (optional for simplified letterheads)
    issuer: {
      name: {
        type: String,
        required: false,
        trim: true,
        default: "Hare Krishna Medical Store",
      },
      designation: {
        type: String,
        required: false,
        trim: true,
        default: "Administrator",
      },
      signature: {
        type: String, // base64 image or URL
        default: "",
      },
    },
    // Footer Information (similar to invoice footer)
    footer: {
      terms: {
        type: String,
        default:
          "This is an official document issued by Hare Krishna Medical Store. For verification, please contact us at the above details.",
      },
      additionalInfo: {
        type: String,
        default: "",
      },
    },
    // Status and Metadata
    status: {
      type: String,
      enum: ["draft", "issued", "sent", "archived"],
      default: "draft",
    },
    issueDate: {
      type: Date,
      default: Date.now,
    },
    validUntil: {
      type: Date,
      default: function () {
        return new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 1 year from now
      },
    },
    // QR Code and Verification (similar to invoice)
    qrCode: {
      type: String,
    },
    qrCodeData: {
      type: String,
    },
    verificationUrl: {
      type: String,
    },
    // Metadata
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

// Generate letterhead ID and QR code before saving
letterheadSchema.pre("save", async function (next) {
  // Generate letterheadId if not exists
  if (!this.letterheadId) {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, "0");
    const day = String(new Date().getDate()).padStart(2, "0");
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");

    // Format: HKMS/LH/YYYY/MM/DD/XXX
    this.letterheadId = `HKMS/LH/${year}/${month}/${day}/${random}`;
  }

  // Generate QR code for verification
  if (this.letterheadId) {
    try {
      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
      this.verificationUrl = `${frontendUrl}/verify-docs?id=${this.letterheadId}&type=letterhead`;

      // Create verification data
      this.qrCodeData = JSON.stringify({
        letterhead_id: this.letterheadId,
        letter_type: this.letterType,
        recipient_name: this.recipient?.name || "General",
        subject: this.subject || this.title,
        issue_date: this.issueDate,
        verification_url: this.verificationUrl,
        issued_by: this.issuer?.name || "Hare Krishna Medical Store",
        company: "Hare Krishna Medical Store",
        type: "letterhead_verification",
      });

      // Generate QR code
      this.qrCode = await QRCode.toDataURL(this.verificationUrl, {
        width: 200,
        margin: 2,
        color: {
          dark: "#1a202c",
          light: "#ffffff",
        },
        errorCorrectionLevel: "M",
      });
    } catch (error) {
      console.error("QR Code generation error:", error);
      this.qrCode = null;
      this.qrCodeData = null;
    }
  }

  next();
});

// Instance methods
letterheadSchema.methods.markAsIssued = function () {
  this.status = "issued";
  this.issueDate = new Date();
  return this.save();
};

letterheadSchema.methods.markAsSent = function () {
  this.status = "sent";
  return this.save();
};

letterheadSchema.methods.archive = function () {
  this.status = "archived";
  return this.save();
};

// Static methods
letterheadSchema.statics.getStats = async function () {
  const stats = await this.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        draft: { $sum: { $cond: [{ $eq: ["$status", "draft"] }, 1, 0] } },
        issued: { $sum: { $cond: [{ $eq: ["$status", "issued"] }, 1, 0] } },
        sent: { $sum: { $cond: [{ $eq: ["$status", "sent"] }, 1, 0] } },
        archived: { $sum: { $cond: [{ $eq: ["$status", "archived"] }, 1, 0] } },
      },
    },
  ]);

  return (
    stats[0] || {
      total: 0,
      draft: 0,
      issued: 0,
      sent: 0,
      archived: 0,
    }
  );
};

letterheadSchema.statics.getTypeStats = async function () {
  return await this.aggregate([
    {
      $group: {
        _id: "$letterType",
        count: { $sum: 1 },
      },
    },
    {
      $sort: { count: -1 },
    },
  ]);
};

// Virtual for full recipient display
letterheadSchema.virtual("recipientDisplay").get(function () {
  let display = this.recipient.name;
  if (this.recipient.designation) {
    display += `, ${this.recipient.designation}`;
  }
  if (this.recipient.organization) {
    display += ` (${this.recipient.organization})`;
  }
  return display;
});

// Ensure virtuals are serialized
letterheadSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Letterhead", letterheadSchema);
