const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    senderName: {
      type: String,
      required: true,
    },
    senderEmail: {
      type: String,
      required: true,
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
    type: {
      type: String,
      enum: [
        "inquiry",
        "complaint",
        "support",
        "feedback",
        "order_related",
        "general",
      ],
      default: "general",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    status: {
      type: String,
      enum: ["new", "read", "replied", "resolved", "closed"],
      default: "new",
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    attachments: [
      {
        filename: { type: String, required: true },
        originalName: { type: String, required: true },
        url: { type: String, required: true },
        fileSize: { type: Number },
        mimeType: { type: String },
      },
    ],
    replies: [
      {
        sender: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        senderName: { type: String, required: true },
        message: { type: String, required: true, maxlength: 2000 },
        isAdmin: { type: Boolean, default: false },
        attachments: [
          {
            filename: { type: String },
            originalName: { type: String },
            url: { type: String },
            fileSize: { type: Number },
            mimeType: { type: String },
          },
        ],
        createdAt: { type: Date, default: Date.now },
      },
    ],
    relatedOrder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
    relatedProduct: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
    },
    readBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
    archivedAt: {
      type: Date,
    },
    resolvedAt: {
      type: Date,
    },
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    customerSatisfaction: {
      rating: { type: Number, min: 1, max: 5 },
      feedback: { type: String, maxlength: 500 },
      ratedAt: { type: Date },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Virtuals
messageSchema.virtual("isOverdue").get(function () {
  if (this.status === "resolved" || this.status === "closed") return false;

  // Consider messages overdue after 24 hours for urgent, 48 hours for high, 72 hours for others
  const overdueHours = {
    urgent: 24,
    high: 48,
    medium: 72,
    low: 96,
  };

  const hours = overdueHours[this.priority] || 72;
  const overdueTime = new Date(
    this.createdAt.getTime() + hours * 60 * 60 * 1000,
  );

  return new Date() > overdueTime;
});

messageSchema.virtual("responseTime").get(function () {
  if (this.replies.length === 0) return null;

  const firstReply = this.replies[0];
  const timeDiff = firstReply.createdAt - this.createdAt;

  return {
    milliseconds: timeDiff,
    hours: Math.floor(timeDiff / (1000 * 60 * 60)),
    minutes: Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60)),
  };
});

messageSchema.virtual("totalReplies").get(function () {
  return this.replies.length;
});

messageSchema.virtual("lastReply").get(function () {
  return this.replies[this.replies.length - 1];
});

// Indexes
messageSchema.index({ sender: 1, createdAt: -1 });
messageSchema.index({ recipient: 1, createdAt: -1 });
messageSchema.index({ status: 1 });
messageSchema.index({ priority: 1 });
messageSchema.index({ type: 1 });
messageSchema.index({ isRead: 1 });
messageSchema.index({ assignedTo: 1 });
messageSchema.index({ createdAt: -1 });
messageSchema.index({ subject: "text", message: "text" });

// Pre-save middleware
messageSchema.pre("save", function (next) {
  // Set readAt when marking as read
  if (this.isModified("isRead") && this.isRead && !this.readAt) {
    this.readAt = new Date();
  }

  // Set resolvedAt when marking as resolved
  if (
    this.isModified("status") &&
    this.status === "resolved" &&
    !this.resolvedAt
  ) {
    this.resolvedAt = new Date();
  }

  // Set archivedAt when archiving
  if (this.isModified("isArchived") && this.isArchived && !this.archivedAt) {
    this.archivedAt = new Date();
  }

  next();
});

// Method to mark as read
messageSchema.methods.markAsRead = function (readBy = null) {
  this.isRead = true;
  this.readAt = new Date();
  if (readBy) {
    this.readBy = readBy;
  }
  return this.save();
};

// Method to add reply
messageSchema.methods.addReply = function (
  senderId,
  senderName,
  message,
  isAdmin = false,
  attachments = [],
) {
  this.replies.push({
    sender: senderId,
    senderName,
    message,
    isAdmin,
    attachments,
    createdAt: new Date(),
  });

  // Update status to replied if it was new or read
  if (["new", "read"].includes(this.status)) {
    this.status = "replied";
  }

  return this.save();
};

// Method to resolve message
messageSchema.methods.resolve = function (resolvedBy = null) {
  this.status = "resolved";
  this.resolvedAt = new Date();
  if (resolvedBy) {
    this.resolvedBy = resolvedBy;
  }
  return this.save();
};

// Method to close message
messageSchema.methods.close = function () {
  this.status = "closed";
  return this.save();
};

// Method to assign to user
messageSchema.methods.assignTo = function (userId) {
  this.assignedTo = userId;
  return this.save();
};

// Method to add satisfaction rating
messageSchema.methods.addSatisfactionRating = function (rating, feedback = "") {
  this.customerSatisfaction = {
    rating,
    feedback,
    ratedAt: new Date(),
  };
  return this.save();
};

// Method to archive message
messageSchema.methods.archive = function () {
  this.isArchived = true;
  this.archivedAt = new Date();
  return this.save();
};

// Static method to get message statistics
messageSchema.statics.getMessageStats = async function (startDate, endDate) {
  const matchCondition = { isArchived: { $ne: true } };

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
        totalMessages: { $sum: 1 },
        newMessages: {
          $sum: { $cond: [{ $eq: ["$status", "new"] }, 1, 0] },
        },
        readMessages: {
          $sum: { $cond: [{ $eq: ["$status", "read"] }, 1, 0] },
        },
        repliedMessages: {
          $sum: { $cond: [{ $eq: ["$status", "replied"] }, 1, 0] },
        },
        resolvedMessages: {
          $sum: { $cond: [{ $eq: ["$status", "resolved"] }, 1, 0] },
        },
        urgentMessages: {
          $sum: { $cond: [{ $eq: ["$priority", "urgent"] }, 1, 0] },
        },
        highPriorityMessages: {
          $sum: { $cond: [{ $eq: ["$priority", "high"] }, 1, 0] },
        },
      },
    },
  ]);

  // Calculate average response time
  const responseTimeStats = await this.aggregate([
    { $match: { ...matchCondition, "replies.0": { $exists: true } } },
    {
      $project: {
        responseTime: {
          $subtract: [
            { $arrayElemAt: ["$replies.createdAt", 0] },
            "$createdAt",
          ],
        },
      },
    },
    {
      $group: {
        _id: null,
        avgResponseTime: { $avg: "$responseTime" },
        messagesWithResponse: { $sum: 1 },
      },
    },
  ]);

  const baseStats = stats[0] || {
    totalMessages: 0,
    newMessages: 0,
    readMessages: 0,
    repliedMessages: 0,
    resolvedMessages: 0,
    urgentMessages: 0,
    highPriorityMessages: 0,
  };

  const responseStats = responseTimeStats[0] || {
    avgResponseTime: 0,
    messagesWithResponse: 0,
  };

  return {
    ...baseStats,
    ...responseStats,
    avgResponseTimeHours: responseStats.avgResponseTime
      ? Math.round((responseStats.avgResponseTime / (1000 * 60 * 60)) * 100) /
        100
      : 0,
  };
};

module.exports = mongoose.model("Message", messageSchema);
