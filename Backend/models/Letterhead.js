const mongoose = require("mongoose");

const letterheadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Letterhead name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    companyInfo: {
      name: {
        type: String,
        required: [true, "Company name is required"],
        default: "Hare Krishna Medical Store",
      },
      address: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        pincode: { type: String, required: true },
        country: { type: String, default: "India" },
      },
      contact: {
        phone: { type: String, required: true },
        mobile: { type: String },
        email: { type: String, required: true },
        website: { type: String },
      },
      registration: {
        gst: { type: String },
        pan: { type: String },
        registrationNumber: { type: String },
        licenseNumber: { type: String },
      },
    },
    logo: {
      url: { type: String },
      publicId: { type: String },
      width: { type: Number, default: 100 },
      height: { type: Number, default: 100 },
      position: {
        type: String,
        enum: ["left", "center", "right"],
        default: "left",
      },
    },
    styling: {
      headerBackgroundColor: { type: String, default: "#ffffff" },
      headerTextColor: { type: String, default: "#000000" },
      primaryColor: { type: String, default: "#e63946" },
      secondaryColor: { type: String, default: "#6c757d" },
      fontFamily: {
        type: String,
        enum: ["Arial", "Times New Roman", "Calibri", "Georgia", "Verdana"],
        default: "Arial",
      },
      fontSize: {
        company: { type: Number, default: 24 },
        address: { type: Number, default: 12 },
        contact: { type: Number, default: 10 },
      },
    },
    layout: {
      showLogo: { type: Boolean, default: true },
      showCompanyName: { type: Boolean, default: true },
      showAddress: { type: Boolean, default: true },
      showContact: { type: Boolean, default: true },
      showRegistration: { type: Boolean, default: true },
      headerHeight: { type: Number, default: 120 },
      footerText: {
        type: String,
        default: "Thank you for your business!",
      },
      showFooter: { type: Boolean, default: true },
    },
    template: {
      type: String,
      enum: ["modern", "classic", "minimal", "professional", "medical"],
      default: "medical",
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    usageCount: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    lastUsed: {
      type: Date,
    },
    preview: {
      thumbnailUrl: { type: String },
      generatedAt: { type: Date },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Virtual for full company address
letterheadSchema.virtual("fullAddress").get(function () {
  const addr = this.companyInfo.address;
  return `${addr.street}, ${addr.city}, ${addr.state} - ${addr.pincode}, ${addr.country}`;
});

// Virtual for complete contact info
letterheadSchema.virtual("contactInfo").get(function () {
  const contact = this.companyInfo.contact;
  let info = [];

  if (contact.phone) info.push(`Phone: ${contact.phone}`);
  if (contact.mobile) info.push(`Mobile: ${contact.mobile}`);
  if (contact.email) info.push(`Email: ${contact.email}`);
  if (contact.website) info.push(`Website: ${contact.website}`);

  return info.join(" | ");
});

// Indexes
letterheadSchema.index({ createdBy: 1 });
letterheadSchema.index({ isDefault: 1 });
letterheadSchema.index({ isActive: 1 });
letterheadSchema.index({ template: 1 });
letterheadSchema.index({ createdAt: -1 });

// Pre-save middleware
letterheadSchema.pre("save", async function (next) {
  // Ensure only one default letterhead per user
  if (this.isDefault) {
    await this.constructor.updateMany(
      {
        createdBy: this.createdBy,
        _id: { $ne: this._id },
        isDefault: true,
      },
      { isDefault: false },
    );
  }

  next();
});

// Method to increment usage count
letterheadSchema.methods.incrementUsage = function () {
  this.usageCount += 1;
  this.lastUsed = new Date();
  return this.save();
};

// Method to set as default
letterheadSchema.methods.setAsDefault = async function () {
  // Remove default from other letterheads of the same user
  await this.constructor.updateMany(
    {
      createdBy: this.createdBy,
      _id: { $ne: this._id },
      isDefault: true,
    },
    { isDefault: false },
  );

  this.isDefault = true;
  return this.save();
};

// Method to generate CSS styles
letterheadSchema.methods.generateCSS = function () {
  const styles = this.styling;

  return `
    .letterhead-header {
      background-color: ${styles.headerBackgroundColor};
      color: ${styles.headerTextColor};
      font-family: ${styles.fontFamily}, sans-serif;
      height: ${this.layout.headerHeight}px;
      padding: 20px;
      border-bottom: 2px solid ${styles.primaryColor};
    }
    
    .company-name {
      font-size: ${styles.fontSize.company}px;
      font-weight: bold;
      color: ${styles.primaryColor};
      margin-bottom: 10px;
    }
    
    .company-address {
      font-size: ${styles.fontSize.address}px;
      color: ${styles.secondaryColor};
      margin-bottom: 5px;
    }
    
    .company-contact {
      font-size: ${styles.fontSize.contact}px;
      color: ${styles.secondaryColor};
    }
    
    .letterhead-logo {
      width: ${this.logo.width}px;
      height: ${this.logo.height}px;
      object-fit: contain;
    }
    
    .letterhead-footer {
      text-align: center;
      font-size: 12px;
      color: ${styles.secondaryColor};
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid ${styles.secondaryColor};
    }
  `;
};

// Method to generate HTML template
letterheadSchema.methods.generateHTML = function () {
  const logo =
    this.layout.showLogo && this.logo.url
      ? `<img src="${this.logo.url}" alt="Logo" class="letterhead-logo" style="float: ${this.logo.position}; margin-right: 20px;">`
      : "";

  const companyName = this.layout.showCompanyName
    ? `<div class="company-name">${this.companyInfo.name}</div>`
    : "";

  const address = this.layout.showAddress
    ? `<div class="company-address">${this.fullAddress}</div>`
    : "";

  const contact = this.layout.showContact
    ? `<div class="company-contact">${this.contactInfo}</div>`
    : "";

  const registration =
    this.layout.showRegistration && this.companyInfo.registration.gst
      ? `<div class="company-contact">GST: ${this.companyInfo.registration.gst}</div>`
      : "";

  const footer = this.layout.showFooter
    ? `<div class="letterhead-footer">${this.layout.footerText}</div>`
    : "";

  return `
    <div class="letterhead-header">
      ${logo}
      <div>
        ${companyName}
        ${address}
        ${contact}
        ${registration}
      </div>
      <div style="clear: both;"></div>
    </div>
    <!-- Invoice content will be inserted here -->
    ${footer}
  `;
};

// Static method to get default letterhead for user
letterheadSchema.statics.getDefaultForUser = function (userId) {
  return this.findOne({
    createdBy: userId,
    isDefault: true,
    isActive: true,
  });
};

// Static method to get system default letterhead
letterheadSchema.statics.getSystemDefault = function () {
  return this.findOne({
    isDefault: true,
    isActive: true,
  }).sort({ createdAt: 1 });
};

module.exports = mongoose.model("Letterhead", letterheadSchema);
