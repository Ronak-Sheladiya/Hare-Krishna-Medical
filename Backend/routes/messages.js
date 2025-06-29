const express = require("express");
const Message = require("../models/Message");
const { requireAdmin } = require("../middleware/auth");
const {
  validationRules,
  handleValidationErrors,
} = require("../middleware/validation");

const router = express.Router();

// @route   POST /api/messages
// @desc    Create new message
// @access  Private
router.post(
  "/",
  validationRules.messageCreate,
  handleValidationErrors,
  async (req, res) => {
    try {
      const messageData = {
        ...req.body,
        sender: req.user._id,
        senderName: req.user.fullName,
        senderEmail: req.user.email,
      };

      const message = new Message(messageData);
      await message.save();

      // Emit socket event for real-time notifications
      const io = req.app.get("io");
      if (io) {
        io.broadcastToAdmins("new-message", {
          messageId: message._id,
          sender: message.senderName,
          subject: message.subject,
          priority: message.priority,
          type: message.type,
        });
      }

      res.status(201).json({
        success: true,
        message: "Message sent successfully",
        data: { message },
      });
    } catch (error) {
      console.error("Create message error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to send message",
      });
    }
  },
);

// @route   GET /api/messages
// @desc    Get messages (user sees own, admin sees all)
// @access  Private
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 20, status, type, priority } = req.query;

    let query = { isArchived: false };

    // Non-admin users see only their own messages
    if (req.user.role !== "admin") {
      query.sender = req.user._id;
    }

    if (status) query.status = status;
    if (type) query.type = type;
    if (priority) query.priority = priority;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const [messages, totalMessages] = await Promise.all([
      Message.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .populate("sender", "fullName email")
        .populate("assignedTo", "fullName"),
      Message.countDocuments(query),
    ]);

    const totalPages = Math.ceil(totalMessages / limitNum);

    res.json({
      success: true,
      data: {
        messages,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalMessages,
          hasNextPage: pageNum < totalPages,
          hasPrevPage: pageNum > 1,
          limit: limitNum,
        },
      },
    });
  } catch (error) {
    console.error("Get messages error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch messages",
    });
  }
});

// @route   POST /api/messages/:id/reply
// @desc    Reply to message
// @access  Private
router.post(
  "/:id/reply",
  validationRules.messageReply,
  handleValidationErrors,
  async (req, res) => {
    try {
      const { message: replyText } = req.body;

      const message = await Message.findById(req.params.id).populate(
        "sender",
        "fullName email",
      );

      if (!message) {
        return res.status(404).json({
          success: false,
          message: "Message not found",
        });
      }

      // Check permissions
      const isAdmin = req.user.role === "admin";
      const isOwner = message.sender._id.toString() === req.user._id.toString();

      if (!isAdmin && !isOwner) {
        return res.status(403).json({
          success: false,
          message: "Access denied",
        });
      }

      await message.addReply(
        req.user._id,
        req.user.fullName,
        replyText,
        isAdmin,
      );

      // Emit socket event
      const io = req.app.get("io");
      if (io) {
        const targetUserId = isAdmin ? message.sender._id.toString() : null;

        if (targetUserId) {
          io.notifyUser(targetUserId, "message-reply", {
            messageId: message._id,
            reply: replyText,
            isAdmin: isAdmin,
          });
        }
      }

      res.json({
        success: true,
        message: "Reply sent successfully",
        data: { message },
      });
    } catch (error) {
      console.error("Reply to message error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to send reply",
      });
    }
  },
);

// @route   PUT /api/messages/:id/status
// @desc    Update message status (Admin only)
// @access  Private (Admin)
router.put("/:id/status", requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = ["new", "read", "replied", "resolved", "closed"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    message.status = status;
    if (status === "resolved") {
      await message.resolve(req.user._id);
    } else {
      await message.save();
    }

    res.json({
      success: true,
      message: "Message status updated successfully",
      data: { message },
    });
  } catch (error) {
    console.error("Update message status error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update message status",
    });
  }
});

module.exports = router;
