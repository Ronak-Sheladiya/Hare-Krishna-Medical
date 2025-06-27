const emailService = require("../utils/emailService");
const Message = require("../models/Message");

class MessagesController {
  // Submit contact form
  async submitContact(req, res) {
    try {
      const { name, email, mobile, subject, message, category, priority } =
        req.body;

      // Get client info for tracking
      const ipAddress =
        req.ip ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        (req.connection.socket ? req.connection.socket.remoteAddress : null);
      const userAgent = req.headers["user-agent"];

      // Create new message in database
      const newMessage = await Message.create({
        name,
        email,
        mobile: mobile || "",
        subject,
        message,
        category: category || "general",
        priority: priority || "normal",
        ipAddress,
        userAgent,
        status: "unread",
      });

      console.log("📝 New contact message created:", {
        id: newMessage._id,
        name: name,
        subject: subject,
        category: category || "general",
        priority: priority || "normal",
      });

      // Send professional notification email to admin
      try {
        await emailService.sendContactFormEmail({
          name: name,
          email: email,
          phone: mobile,
          subject: subject,
          message: message,
        });
        console.log("✅ Admin notification email sent successfully");
      } catch (emailError) {
        console.error("❌ Admin notification email failed:", emailError);
      }

      // Send professional confirmation email to user
      try {
        await emailService.sendMessageConfirmationEmail(email, name, message);
        console.log("✅ User confirmation email sent successfully");
      } catch (emailError) {
        console.error("❌ User confirmation email failed:", emailError);
      }

      // Send real-time notification to admin dashboard
      const io = req.app.get("io");
      if (io) {
        io.to("admin-room").emit("new-message", {
          message: {
            id: newMessage._id,
            name: newMessage.name,
            email: newMessage.email,
            subject: newMessage.subject,
            category: newMessage.category,
            priority: newMessage.priority,
            createdAt: newMessage.createdAt,
            status: newMessage.status,
          },
        });
        console.log("📡 Real-time notification sent to admin dashboard");
      }

      res.status(201).json({
        success: true,
        message: "Message sent successfully! We'll get back to you soon.",
        data: {
          id: newMessage._id,
          status: "sent",
        },
      });
    } catch (error) {
      console.error("❌ Contact form submission error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to send message. Please try again.",
        error: error.message,
      });
    }
  }

  // Get all messages (Admin)
  async getAllMessages(req, res) {
    try {
      const {
        page = 1,
        limit = 20,
        status,
        search,
        startDate,
        endDate,
        category,
        priority,
        sortBy = "createdAt",
        sortOrder = "desc",
      } = req.query;

      // Build query
      const query = { isDeleted: false };

      // Filter by status
      if (status) {
        query.status = status;
      }

      // Filter by category
      if (category) {
        query.category = category;
      }

      // Filter by priority
      if (priority) {
        query.priority = priority;
      }

      // Date range filter
      if (startDate || endDate) {
        query.createdAt = {};
        if (startDate) {
          query.createdAt.$gte = new Date(startDate);
        }
        if (endDate) {
          query.createdAt.$lte = new Date(endDate);
        }
      }

      // Build sort object
      const sortObj = {};
      sortObj[sortBy] = sortOrder === "desc" ? -1 : 1;

      // Count total messages for pagination
      let totalMessages;
      let messages;

      if (search) {
        // Use text search if search term provided
        const searchRegex = new RegExp(search, "i");
        const searchQuery = {
          ...query,
          $or: [
            { name: searchRegex },
            { email: searchRegex },
            { subject: searchRegex },
            { message: searchRegex },
          ],
        };

        totalMessages = await Message.countDocuments(searchQuery);
        messages = await Message.find(searchQuery)
          .sort(sortObj)
          .limit(parseInt(limit))
          .skip((parseInt(page) - 1) * parseInt(limit))
          .lean();
      } else {
        totalMessages = await Message.countDocuments(query);
        messages = await Message.find(query)
          .sort(sortObj)
          .limit(parseInt(limit))
          .skip((parseInt(page) - 1) * parseInt(limit))
          .lean();
      }

      // Calculate pagination info
      const totalPages = Math.ceil(totalMessages / parseInt(limit));
      const hasNextPage = parseInt(page) < totalPages;
      const hasPrevPage = parseInt(page) > 1;

      // Get message statistics
      const stats = await Message.aggregate([
        { $match: { isDeleted: false } },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]);

      const statsObj = stats.reduce((acc, stat) => {
        acc[stat._id] = stat.count;
        return acc;
      }, {});

      res.json({
        success: true,
        data: {
          messages,
          pagination: {
            currentPage: parseInt(page),
            totalPages,
            totalMessages,
            hasNextPage,
            hasPrevPage,
            limit: parseInt(limit),
          },
          stats: {
            unread: statsObj.unread || 0,
            read: statsObj.read || 0,
            replied: statsObj.replied || 0,
            archived: statsObj.archived || 0,
            total: totalMessages,
          },
        },
      });
    } catch (error) {
      console.error("❌ Error fetching messages:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch messages",
        error: error.message,
      });
    }
  }

  // Get single message by ID (Admin)
  async getMessageById(req, res) {
    try {
      const { id } = req.params;

      const message = await Message.findOne({
        _id: id,
        isDeleted: false,
      });

      if (!message) {
        return res.status(404).json({
          success: false,
          message: "Message not found",
        });
      }

      res.json({
        success: true,
        data: { message },
      });
    } catch (error) {
      console.error("❌ Error fetching message:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch message",
        error: error.message,
      });
    }
  }

  // Update message status (Admin)
  async updateMessageStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const validStatuses = ["unread", "read", "replied", "archived"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid status. Must be: unread, read, replied, or archived",
        });
      }

      const message = await Message.findOneAndUpdate(
        { _id: id, isDeleted: false },
        {
          status,
          updatedAt: new Date(),
          ...(status === "read" && { readAt: new Date() }),
          ...(status === "replied" && { repliedAt: new Date() }),
        },
        { new: true },
      );

      if (!message) {
        return res.status(404).json({
          success: false,
          message: "Message not found",
        });
      }

      // Send real-time update to admin dashboard
      const io = req.app.get("io");
      if (io) {
        io.to("admin-room").emit("message-status-updated", {
          messageId: id,
          newStatus: status,
          updatedAt: message.updatedAt,
        });
      }

      console.log("📝 Message status updated:", {
        id: id,
        oldStatus: req.body.oldStatus || "unknown",
        newStatus: status,
      });

      res.json({
        success: true,
        message: "Message status updated successfully",
        data: { message },
      });
    } catch (error) {
      console.error("❌ Error updating message status:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update message status",
        error: error.message,
      });
    }
  }

  // Reply to message (Admin)
  async replyToMessage(req, res) {
    try {
      const { id } = req.params;
      const { replyMessage, adminName = "Hare Krishna Medical Team" } =
        req.body;

      if (!replyMessage || replyMessage.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: "Reply message is required",
        });
      }

      const message = await Message.findOne({
        _id: id,
        isDeleted: false,
      });

      if (!message) {
        return res.status(404).json({
          success: false,
          message: "Message not found",
        });
      }

      // Update message with reply
      const updatedMessage = await Message.findByIdAndUpdate(
        id,
        {
          status: "replied",
          replyMessage,
          repliedAt: new Date(),
          repliedBy: adminName,
          updatedAt: new Date(),
        },
        { new: true },
      );

      // Send professional reply email to user
      try {
        await emailService.sendMessageReplyEmail(
          message.email,
          message.name,
          message.subject,
          message.message,
          replyMessage,
          adminName,
        );
        console.log("✅ Reply email sent successfully to user");
      } catch (emailError) {
        console.error("❌ Reply email failed:", emailError);
        // Don't fail the entire operation if email fails
      }

      // Send real-time update to admin dashboard
      const io = req.app.get("io");
      if (io) {
        io.to("admin-room").emit("message-replied", {
          messageId: id,
          repliedAt: updatedMessage.repliedAt,
          repliedBy: adminName,
        });
      }

      console.log("💬 Message reply sent:", {
        id: id,
        customerEmail: message.email,
        repliedBy: adminName,
      });

      res.json({
        success: true,
        message: "Reply sent successfully",
        data: { message: updatedMessage },
      });
    } catch (error) {
      console.error("❌ Error replying to message:", error);
      res.status(500).json({
        success: false,
        message: "Failed to send reply",
        error: error.message,
      });
    }
  }

  // Delete message (Admin)
  async deleteMessage(req, res) {
    try {
      const { id } = req.params;

      const message = await Message.findOneAndUpdate(
        { _id: id, isDeleted: false },
        {
          isDeleted: true,
          deletedAt: new Date(),
          updatedAt: new Date(),
        },
        { new: true },
      );

      if (!message) {
        return res.status(404).json({
          success: false,
          message: "Message not found",
        });
      }

      // Send real-time update to admin dashboard
      const io = req.app.get("io");
      if (io) {
        io.to("admin-room").emit("message-deleted", {
          messageId: id,
          deletedAt: message.deletedAt,
        });
      }

      console.log("🗑️ Message deleted:", {
        id: id,
        customerEmail: message.email,
        subject: message.subject,
      });

      res.json({
        success: true,
        message: "Message deleted successfully",
      });
    } catch (error) {
      console.error("❌ Error deleting message:", error);
      res.status(500).json({
        success: false,
        message: "Failed to delete message",
        error: error.message,
      });
    }
  }

  // Get message statistics (Admin)
  async getMessageStats(req, res) {
    try {
      const { period = "week" } = req.query;

      let dateFilter = {};
      const now = new Date();

      switch (period) {
        case "today":
          dateFilter = {
            createdAt: {
              $gte: new Date(now.setHours(0, 0, 0, 0)),
              $lt: new Date(now.setHours(23, 59, 59, 999)),
            },
          };
          break;
        case "week":
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          dateFilter = { createdAt: { $gte: weekAgo } };
          break;
        case "month":
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          dateFilter = { createdAt: { $gte: monthAgo } };
          break;
        case "year":
          const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          dateFilter = { createdAt: { $gte: yearAgo } };
          break;
      }

      // Get status distribution
      const statusStats = await Message.aggregate([
        { $match: { isDeleted: false, ...dateFilter } },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]);

      // Get category distribution
      const categoryStats = await Message.aggregate([
        { $match: { isDeleted: false, ...dateFilter } },
        {
          $group: {
            _id: "$category",
            count: { $sum: 1 },
          },
        },
      ]);

      // Get priority distribution
      const priorityStats = await Message.aggregate([
        { $match: { isDeleted: false, ...dateFilter } },
        {
          $group: {
            _id: "$priority",
            count: { $sum: 1 },
          },
        },
      ]);

      // Get daily message counts for the period
      const dailyStats = await Message.aggregate([
        { $match: { isDeleted: false, ...dateFilter } },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
              day: { $dayOfMonth: "$createdAt" },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
      ]);

      // Calculate response time statistics
      const responseTimeStats = await Message.aggregate([
        {
          $match: {
            isDeleted: false,
            status: "replied",
            repliedAt: { $exists: true },
            ...dateFilter,
          },
        },
        {
          $project: {
            responseTime: {
              $divide: [
                { $subtract: ["$repliedAt", "$createdAt"] },
                1000 * 60 * 60, // Convert to hours
              ],
            },
          },
        },
        {
          $group: {
            _id: null,
            avgResponseTime: { $avg: "$responseTime" },
            minResponseTime: { $min: "$responseTime" },
            maxResponseTime: { $max: "$responseTime" },
            totalReplies: { $sum: 1 },
          },
        },
      ]);

      const stats = {
        period,
        statusDistribution: statusStats.reduce((acc, stat) => {
          acc[stat._id] = stat.count;
          return acc;
        }, {}),
        categoryDistribution: categoryStats.reduce((acc, stat) => {
          acc[stat._id] = stat.count;
          return acc;
        }, {}),
        priorityDistribution: priorityStats.reduce((acc, stat) => {
          acc[stat._id] = stat.count;
          return acc;
        }, {}),
        dailyTrend: dailyStats.map((stat) => ({
          date: `${stat._id.year}-${String(stat._id.month).padStart(2, "0")}-${String(stat._id.day).padStart(2, "0")}`,
          count: stat.count,
        })),
        responseTime: responseTimeStats[0] || {
          avgResponseTime: 0,
          minResponseTime: 0,
          maxResponseTime: 0,
          totalReplies: 0,
        },
      };

      res.json({
        success: true,
        data: { stats },
      });
    } catch (error) {
      console.error("❌ Error fetching message statistics:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch message statistics",
        error: error.message,
      });
    }
  }
}

module.exports = new MessagesController();
