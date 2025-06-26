const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    mobile: {
      type: String,
      trim: true,
      maxlength: [20, "Mobile number cannot exceed 20 characters"],
    },
    subject: {
      type: String,
      required: [true, "Subject is required"],
      trim: true,
      maxlength: [200, "Subject cannot exceed 200 characters"],
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
      maxlength: [2000, "Message cannot exceed 2000 characters"],
    },
    status: {
      type: String,
      enum: ["unread", "read", "responded", "archived"],
      default: "unread",
    },
    response: {
      type: String,
      trim: true,
      maxlength: [2000, "Response cannot exceed 2000 characters"],
    },
    respondedAt: {
      type: Date,
    },
    respondedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    ipAddress: {
      type: String,
      trim: true,
    },
    userAgent: {
      type: String,
      trim: true,
    },
    priority: {
      type: String,
      enum: ["low", "normal", "high", "urgent"],
      default: "normal",
    },
    category: {
      type: String,
      enum: [
        "general",
        "product_inquiry",
        "order_issue",
        "complaint",
        "suggestion",
        "technical_support",
        "billing",
        "other",
      ],
      default: "general",
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    attachments: [
      {
        filename: String,
        originalName: String,
        mimetype: String,
        size: Number,
        url: String,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Indexes for better query performance
messageSchema.index({ email: 1 });
messageSchema.index({ status: 1 });
messageSchema.index({ createdAt: -1 });
messageSchema.index({ category: 1 });
messageSchema.index({ priority: 1 });
messageSchema.index({ isDeleted: 1 });

// Text index for search functionality
messageSchema.index({
  name: "text",
  email: "text",
  subject: "text",
  message: "text",
  response: "text",
});

// Virtual for message age
messageSchema.virtual("messageAge").get(function () {
  return Date.now() - this.createdAt;
});

// Virtual for response time (if responded)
messageSchema.virtual("responseTime").get(function () {
  if (this.respondedAt && this.createdAt) {
    return this.respondedAt - this.createdAt;
  }
  return null;
});

// Middleware to update respondedAt when status changes to responded
messageSchema.pre("save", function (next) {
  if (
    this.isModified("status") &&
    this.status === "responded" &&
    !this.respondedAt
  ) {
    this.respondedAt = new Date();
  }
  next();
});

// Middleware to set deletedAt when isDeleted is set to true
messageSchema.pre("save", function (next) {
  if (this.isModified("isDeleted") && this.isDeleted && !this.deletedAt) {
    this.deletedAt = new Date();
  }
  next();
});

// Static method to get unread count
messageSchema.statics.getUnreadCount = function () {
  return this.countDocuments({ status: "unread", isDeleted: false });
};

// Static method to get messages by status
messageSchema.statics.getByStatus = function (status, options = {}) {
  const query = { status, isDeleted: false };
  return this.find(query, null, options).sort({ createdAt: -1 });
};

// Static method to search messages
messageSchema.statics.searchMessages = function (searchTerm, options = {}) {
  const query = {
    $text: { $search: searchTerm },
    isDeleted: false,
  };
  return this.find(query, { score: { $meta: "textScore" } }, options).sort({
    score: { $meta: "textScore" },
    createdAt: -1,
  });
};

// Instance method to mark as read
messageSchema.methods.markAsRead = function () {
  this.status = "read";
  return this.save();
};

// Instance method to archive
messageSchema.methods.archive = function () {
  this.status = "archived";
  return this.save();
};

// Instance method to soft delete
messageSchema.methods.softDelete = function () {
  this.isDeleted = true;
  this.deletedAt = new Date();
  return this.save();
};

// Instance method to respond to message
messageSchema.methods.respond = function (responseText, respondedBy) {
  this.response = responseText;
  this.status = "responded";
  this.respondedAt = new Date();
  this.respondedBy = respondedBy;
  return this.save();
};

module.exports = mongoose.model("Message", messageSchema);
