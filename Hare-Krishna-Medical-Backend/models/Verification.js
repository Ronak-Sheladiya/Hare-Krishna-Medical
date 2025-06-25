const mongoose = require("mongoose");

const verificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    emailVerificationToken: {
      type: String,
      required: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerifiedAt: Date,
    mobileVerificationOTP: {
      type: String,
    },
    mobileVerified: {
      type: Boolean,
      default: false,
    },
    mobileVerifiedAt: Date,
    otpAttempts: {
      type: Number,
      default: 0,
    },
    otpExpiresAt: Date,
    isCompleted: {
      type: Boolean,
      default: false,
    },
    completedAt: Date,
  },
  {
    timestamps: true,
  },
);

// Index for quick lookups
verificationSchema.index({ user: 1 });
verificationSchema.index({ emailVerificationToken: 1 });
verificationSchema.index({ email: 1 });
verificationSchema.index({ mobile: 1 });

// Methods
verificationSchema.methods.generateOTP = function () {
  // Generate 6-digit OTP
  this.mobileVerificationOTP = Math.floor(
    100000 + Math.random() * 900000,
  ).toString();
  this.otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
  this.otpAttempts = 0;
  return this.mobileVerificationOTP;
};

verificationSchema.methods.verifyOTP = function (otp) {
  if (this.otpAttempts >= 3) {
    throw new Error("Maximum OTP attempts exceeded");
  }

  if (new Date() > this.otpExpiresAt) {
    throw new Error("OTP has expired");
  }

  if (this.mobileVerificationOTP !== otp) {
    this.otpAttempts += 1;
    throw new Error("Invalid OTP");
  }

  this.mobileVerified = true;
  this.mobileVerifiedAt = new Date();
  this.mobileVerificationOTP = undefined;
  this.otpExpiresAt = undefined;
  this.otpAttempts = 0;

  // Check if verification is complete
  if (this.emailVerified && this.mobileVerified) {
    this.isCompleted = true;
    this.completedAt = new Date();
  }

  return true;
};

verificationSchema.methods.verifyEmail = function () {
  this.emailVerified = true;
  this.emailVerifiedAt = new Date();
  this.emailVerificationToken = undefined;

  // Check if verification is complete
  if (this.emailVerified && this.mobileVerified) {
    this.isCompleted = true;
    this.completedAt = new Date();
  }

  return true;
};

module.exports = mongoose.model("Verification", verificationSchema);
