const mongoose = require("mongoose");
const QRCode = require("qrcode");

const letterheadSchema = new mongoose.Schema(
  {
    letterId: {
      type: String,
      required: true,
      unique: true,
    },
    letterType: {
      type: String,
      required: true,
      enum: [
        "certificate",
        "request",
        "application",
        "notice",
        "recommendation",
      ],
    },
    title: {
      type: String,
      required: true,
    },
    context: {
      type: String,
      required: true,
      enum: ["respected", "dear", "to_whom_it_may_concern"],
      default: "respected",
    },
    recipient: {
      prefix: {
        type: String,
        enum: ["Mr.", "Mrs.", "Ms.", "Dr.", "Prof.", "Hon.", "Company"],
        default: "Mr.",
      },
      firstName: {
        type: String,
        required: true,
      },
      middleName: {
        type: String,
        default: "",
      },
      lastName: {
        type: String,
        required: true,
      },
      designation: String,
      company: String,
    },
    subject: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true, // Rich text content
    },
    header: {
      type: String,
      default: "",
    },
    footer: {
      type: String,
      default: "",
    },
    host: {
      name: {
        type: String,
        required: true,
      },
      designation: {
        type: String,
        required: true,
      },
      signature: String, // Base64 image or signature path
    },
    status: {
      type: String,
      enum: ["draft", "finalized", "sent", "archived"],
      default: "draft",
    },
    language: {
      type: String,
      enum: ["english", "hindi", "gujarati"],
      default: "english",
    },
    qrCode: String,
    qrCodeData: String,
    letterUrl: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sentDate: Date,
    notes: String,
    attachments: [
      {
        name: String,
        url: String,
        size: Number,
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  },
);

// Generate letter ID and QR code
letterheadSchema.pre("save", async function (next) {
  if (!this.letterId) {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, "0");
    const day = String(new Date().getDate()).padStart(2, "0");
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");

    // Format: HK/[letter type]/[year][month][day][random]
    const typeCode = this.letterType.substring(0, 3).toUpperCase();
    this.letterId = `HK/${typeCode}/${year}${month}${day}${random}`;
  }

  // Always generate/update QR code for letterhead
  if (this.letterId) {
    try {
      // Create public verification URL for QR code
      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
      const verificationUrl = `${frontendUrl}/verify-docs?id=${this.letterId}&type=letterhead`;

      // Store comprehensive data for verification
      this.qrCodeData = JSON.stringify({
        letter_id: this.letterId,
        letter_type: this.letterType,
        recipient_name: `${this.recipient.prefix} ${this.recipient.firstName} ${this.recipient.lastName}`,
        subject: this.subject,
        verification_url: verificationUrl,
        generated_at: new Date().toISOString(),
        company: "Hare Krishna Medical",
        type: "letterhead_verification",
        host: this.host.name,
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

// Instance methods
letterheadSchema.methods.markAsSent = function () {
  this.status = "sent";
  this.sentDate = new Date();
  return this.save();
};

letterheadSchema.methods.finalize = function () {
  this.status = "finalized";
  return this.save();
};

letterheadSchema.methods.archive = function () {
  this.status = "archived";
  return this.save();
};

// Virtual for full recipient name
letterheadSchema.virtual("recipientFullName").get(function () {
  const parts = [this.recipient.prefix, this.recipient.firstName];
  if (this.recipient.middleName) {
    parts.push(this.recipient.middleName);
  }
  parts.push(this.recipient.lastName);
  return parts.join(" ");
});

// Static methods for analytics
letterheadSchema.statics.getLetterheadStats = async function () {
  const stats = await this.aggregate([
    {
      $group: {
        _id: null,
        totalLetterheads: { $sum: 1 },
        draftLetterheads: {
          $sum: { $cond: [{ $eq: ["$status", "draft"] }, 1, 0] },
        },
        finalizedLetterheads: {
          $sum: { $cond: [{ $eq: ["$status", "finalized"] }, 1, 0] },
        },
        sentLetterheads: {
          $sum: { $cond: [{ $eq: ["$status", "sent"] }, 1, 0] },
        },
        archivedLetterheads: {
          $sum: { $cond: [{ $eq: ["$status", "archived"] }, 1, 0] },
        },
      },
    },
  ]);

  return (
    stats[0] || {
      totalLetterheads: 0,
      draftLetterheads: 0,
      finalizedLetterheads: 0,
      sentLetterheads: 0,
      archivedLetterheads: 0,
    }
  );
};

letterheadSchema.statics.getLetterTypeStats = async function () {
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

// Ensure virtual fields are serialized
letterheadSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Letterhead", letterheadSchema);
