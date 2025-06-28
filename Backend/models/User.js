const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      unique: true,
      default: () => "USER" + Math.floor(1000 + Math.random() * 9000), // e.g., USER-ab12cd
    },
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      maxlength: [100, "Name cannot be more than 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    mobile: {
      type: String,
      required: [true, "Mobile number is required"],
      unique: true,
      match: [/^[6-9]\d{9}$/, "Please enter a valid mobile number"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    role: {
      type: Number,
      default: 0,
      enum: [0, 1],
    },
    address: {
      street: String,
      city: String,
      state: String,
      pincode: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: Date,
    avatar: String,
    profileImage: {
      type: String,
      default: "",
      validate: {
        validator: function (v) {
          if (!v) return true;
          return /^(https?:\/\/|data:image\/)/.test(v);
        },
        message: "Profile image must be a valid URL or base64 image",
      },
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    emailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: String,
    emailOTP: String,
    emailOTPExpires: Date,
    preferences: {
      notifications: {
        email: { type: Boolean, default: true },
      },
      newsletter: { type: Boolean, default: false },
    },
  },
  {
    timestamps: true,
  }
);

// ✅ Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    this.password = await bcrypt.hash(this.password, 12);
    next();
  } catch (err) {
    next(err);
  }
});

// ✅ Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password || !candidatePassword) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

// ✅ Generate JWT
userSchema.methods.generateAuthToken = function () {
  return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// ✅ Update login time
userSchema.methods.updateLastLogin = function () {
  this.lastLogin = new Date();
  return this.save();
};

module.exports = mongoose.model("User", userSchema);
