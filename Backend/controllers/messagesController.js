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

      // Send confirmation email to user
      try {
        const confirmationHtml = `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333333; max-width: 600px; margin: 0 auto; backgroundColor: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(220, 53, 69, 0.15);">
            <div style="background: linear-gradient(135deg, #dc3545 0%, #b91c2c 100%); color: #ffffff; padding: 2rem; text-align: center;">
              <h2 style="margin: 0; font-size: 28px; font-weight: bold; letter-spacing: 1px; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">🏥 HARE KRISHNA MEDICAL</h2>
              <p style="margin: 0.5rem 0 0 0; font-size: 14px; opacity: 0.9; font-style: italic;">Your Health, Our Priority</p>
              <div style="background-color: rgba(255, 255, 255, 0.2); padding: 1rem; border-radius: 8px; margin-top: 1rem;">
                <h3 style="margin: 0; font-size: 20px; font-weight: 600;">Message Received ✅</h3>
              </div>
            </div>

            <div style="padding: 2rem;">
              <div style="text-align: center; margin-bottom: 2rem;">
                <h3 style="color: #dc3545; font-size: 24px; margin: 0 0 1rem 0; font-weight: 600;">Thank You for Contacting Us! 🎉</h3>
              </div>

              <div style="font-size: 16px; line-height: 1.7;">
                <p style="margin: 1rem 0; color: #444444;">
                  Dear <strong>${name}</strong>,
                </p>

                <p style="margin: 1rem 0; color: #444444;">
                  We have received your message and our team will get back to you within 24 hours.
                </p>

                <div style="background: linear-gradient(135deg, #fff5f5 0%, #ffe6e6 100%); border: 2px solid #dc3545; border-radius: 8px; padding: 1.5rem; margin: 2rem 0;">
                  <h4 style="color: #dc3545; font-size: 18px; margin: 0 0 1rem 0; font-weight: 600;">📝 Your Message Details:</h4>
                  <div style="background: #ffffff; padding: 1rem; border-left: 4px solid #dc3545; border-radius: 4px;">
                    <p style="margin: 0;"><strong>Subject:</strong> ${subject}</p>
                    <p style="margin: 10px 0 0 0; color: #666;">${message}</p>
                  </div>
                </div>

                <p style="margin: 1rem 0; color: #444444;">
                  If you have any urgent questions, feel free to contact our customer support team at
                  <strong style="color: #dc3545;"> +91 76989 13354</strong> or reply to this email.
                </p>
              </div>
            </div>

            <div style="background: #f8f9fa; border-top: 3px solid #dc3545; padding: 2rem;">
              <div style="text-align: center;">
                <p style="margin: 0 0 1rem 0; font-size: 14px; color: #666666; line-height: 1.5;">
                  <strong>Hare Krishna Medical Store</strong><br/>
                  📍 3 Sahyog Complex, Man Sarovar circle, Amroli, 394107, Gujarat<br/>
                  📞 +91 76989 13354 | 📧 hkmedicalamroli@gmail.com<br/>
                  🌐 Visit our store for the best medical care
                </p>

                <p style="margin: 1rem 0 0 0; font-size: 12px; color: #999999; font-style: italic;">
                  This is an automated email. Please do not reply to this email address.
                </p>
              </div>
            </div>
          </div>
        `;

        await emailService.transporter.sendMail({
          from: `"Hare Krishna Medical" <${process.env.EMAIL_USER}>`,
          to: email,
          subject: "Message Received - Hare Krishna Medical",
          html: confirmationHtml,
        });
      } catch (emailError) {
        console.error("Confirmation email failed:", emailError);
      }

      // Send notification email to admin
      try {
        const adminNotificationHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #e63946, #dc3545); color: white; padding: 30px; border-radius: 10px; text-align: center;">
              <h1 style="margin: 0; font-size: 28px;">New Message Received! 📧</h1>
              <p style="margin: 10px 0 0 0; font-size: 16px;">Contact Form Submission</p>
            </div>

            <div style="padding: 30px; background: #f8f9fa; border-radius: 10px; margin-top: 20px;">
              <h2 style="color: #333; margin-top: 0;">Message Details:</h2>

              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Name:</strong></td>
                    <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${name}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Email:</strong></td>
                    <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${email}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Mobile:</strong></td>
                    <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${mobile || "Not provided"}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Subject:</strong></td>
                    <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${subject}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; vertical-align: top;"><strong>Message:</strong></td>
                    <td style="padding: 8px 0;">${message}</td>
                  </tr>
                </table>
              </div>

              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.FRONTEND_URL}/admin/messages"
                   style="background: #e63946; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                  View in Admin Panel
                </a>
              </div>
            </div>
          </div>
        `;

        await emailService.transporter.sendMail({
          from: `"Hare Krishna Medical" <${process.env.EMAIL_USER}>`,
          to: process.env.EMAIL_USER,
          subject: `New Contact Form Message - ${subject}`,
          html: adminNotificationHtml,
        });
      } catch (emailError) {
        console.error("Admin notification email failed:", emailError);
      }

      // Emit real-time notification to admin
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
      console.error("Contact form error:", error);
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
        const searchResults = await Message.searchMessages(search, {
          skip: (parseInt(page) - 1) * parseInt(limit),
          limit: parseInt(limit),
        }).populate("respondedBy", "fullName email");

        messages = searchResults;
        totalMessages = await Message.countDocuments({
          $text: { $search: search },
          isDeleted: false,
          ...query,
        });
      } else {
        // Regular query
        messages = await Message.find(query)
          .populate("respondedBy", "fullName email")
          .sort(sortObj)
          .skip((parseInt(page) - 1) * parseInt(limit))
          .limit(parseInt(limit));

        totalMessages = await Message.countDocuments(query);
      }

      const totalPages = Math.ceil(totalMessages / limit);

      res.json({
        success: true,
        data: messages,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalMessages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
          limit: parseInt(limit),
        },
      });
    } catch (error) {
      console.error("Get messages error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch messages",
        error: error.message,
      });
    }
  }

  // Get single message (Admin)
  async getMessage(req, res) {
    try {
      const messageId = req.params.id;
      const message = await Message.findById(messageId)
        .populate("respondedBy", "fullName email")
        .lean();

      if (!message || message.isDeleted) {
        return res.status(404).json({
          success: false,
          message: "Message not found",
        });
      }

      // Mark as read if it's unread
      if (message.status === "unread") {
        await Message.findByIdAndUpdate(messageId, { status: "read" });
        message.status = "read";
      }

      res.json({
        success: true,
        data: message,
      });
    } catch (error) {
      console.error("Get message error:", error);
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
      const messageId = req.params.id;
      const { status } = req.body;

      const validStatuses = ["unread", "read", "responded", "archived"];

      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid status",
        });
      }

      const message = await Message.findById(messageId);

      if (!message || message.isDeleted) {
        return res.status(404).json({
          success: false,
          message: "Message not found",
        });
      }

      message.status = status;
      if (status === "responded" && !message.respondedAt) {
        message.respondedAt = new Date();
      }
      await message.save();

      // Emit real-time update
      const io = req.app.get("io");
      if (io) {
        io.to("admin-room").emit("message-status-updated", {
          messageId: message._id,
          newStatus: status,
          updatedBy: req.user ? req.user.fullName : "Admin",
        });
      }

      res.json({
        success: true,
        message: "Message status updated successfully",
        data: {
          id: message._id,
          status: message.status,
        },
      });
    } catch (error) {
      console.error("Update message status error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update message status",
        error: error.message,
      });
    }
  }

  // Respond to message (Admin)
  async respondToMessage(req, res) {
    try {
      const messageId = req.params.id;
      const { response } = req.body;

      const message = await Message.findById(messageId);

      if (!message || message.isDeleted) {
        return res.status(404).json({
          success: false,
          message: "Message not found",
        });
      }

      // Update message
      message.response = response;
      message.status = "responded";
      message.respondedAt = new Date();
      if (req.user) {
        message.respondedBy = req.user._id;
      }
      await message.save();

      // Send response email
      try {
        const responseHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #17a2b8, #20c997); color: white; padding: 30px; border-radius: 10px; text-align: center;">
              <h1 style="margin: 0; font-size: 28px;">Response from Hare Krishna Medical 💬</h1>
              <p style="margin: 10px 0 0 0; font-size: 16px;">Re: ${message.subject}</p>
            </div>

            <div style="padding: 30px; background: #f8f9fa; border-radius: 10px; margin-top: 20px;">
              <h2 style="color: #333; margin-top: 0;">Hello ${message.name}!</h2>

              <div style="background: #e7f3ff; border-left: 4px solid #17a2b8; padding: 20px; margin: 20px 0;">
                <h3 style="color: #17a2b8; margin-top: 0;">Your Original Message:</h3>
                <p style="color: #666; margin: 0; font-style: italic;">"${message.message}"</p>
              </div>

              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #17a2b8; margin-top: 0;">Our Response:</h3>
                <p style="color: #333; line-height: 1.6; margin: 0;">${response}</p>
              </div>

              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.FRONTEND_URL}/contact"
                   style="background: #17a2b8; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                  Contact Us Again
                </a>
              </div>

              <div style="border-top: 1px solid #ddd; padding-top: 20px; margin-top: 30px; text-align: center;">
                <p style="color: #888; font-size: 14px; margin: 0;">
                  📍 3 Sahyog Complex, Man Sarovar circle, Amroli, 394107, Gujarat<br>
                  📞 +91 76989 13354 | 📧 hkmedicalamroli@gmail.com
                </p>
              </div>
            </div>
          </div>
        `;

        await emailService.transporter.sendMail({
          from: `"Hare Krishna Medical" <${process.env.EMAIL_USER}>`,
          to: message.email,
          subject: `Re: ${message.subject} - Hare Krishna Medical`,
          html: responseHtml,
        });
      } catch (emailError) {
        console.error("Response email failed:", emailError);
      }

      // Emit real-time update
      const io = req.app.get("io");
      if (io) {
        io.to("admin-room").emit("message-responded", {
          messageId: message._id,
          respondedBy: req.user ? req.user.fullName : "Admin",
          respondedAt: message.respondedAt,
        });
      }

      res.json({
        success: true,
        message: "Response sent successfully",
        data: {
          id: message._id,
          status: message.status,
          response: message.response,
          respondedAt: message.respondedAt,
        },
      });
    } catch (error) {
      console.error("Send response error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to send response",
        error: error.message,
      });
    }
  }

  // Get message statistics (Admin)
  async getMessageStats(req, res) {
    try {
      const totalMessages = await Message.countDocuments({ isDeleted: false });
      const unreadMessages = await Message.countDocuments({
        status: "unread",
        isDeleted: false,
      });
      const readMessages = await Message.countDocuments({
        status: "read",
        isDeleted: false,
      });
      const respondedMessages = await Message.countDocuments({
        status: "responded",
        isDeleted: false,
      });

      // Messages by category
      const categoryStats = await Message.aggregate([
        { $match: { isDeleted: false } },
        { $group: { _id: "$category", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]);

      // Messages by priority
      const priorityStats = await Message.aggregate([
        { $match: { isDeleted: false } },
        { $group: { _id: "$priority", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]);

      // Daily message trend (last 30 days)
      const last30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const dailyMessages = await Message.aggregate([
        {
          $match: {
            createdAt: { $gte: last30Days },
            isDeleted: false,
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]);

      const messageTrend = dailyMessages.map((item) => ({
        date: item._id,
        count: item.count,
      }));

      // Response time analysis
      const responseTimeStats = await Message.aggregate([
        {
          $match: {
            status: "responded",
            respondedAt: { $exists: true },
            isDeleted: false,
          },
        },
        {
          $project: {
            responseTime: {
              $subtract: ["$respondedAt", "$createdAt"],
            },
          },
        },
        {
          $group: {
            _id: null,
            avgResponseTime: { $avg: "$responseTime" },
            minResponseTime: { $min: "$responseTime" },
            maxResponseTime: { $max: "$responseTime" },
            count: { $sum: 1 },
          },
        },
      ]);

      const avgResponseTime =
        responseTimeStats.length > 0 ? responseTimeStats[0].avgResponseTime : 0;

      res.json({
        success: true,
        data: {
          totalMessages,
          unreadMessages,
          readMessages,
          respondedMessages,
          categoryStats,
          priorityStats,
          messageTrend,
          avgResponseTimeHours:
            Math.round((avgResponseTime / (1000 * 60 * 60)) * 100) / 100,
          responseRate:
            totalMessages > 0
              ? Math.round((respondedMessages / totalMessages) * 100)
              : 0,
        },
      });
    } catch (error) {
      console.error("Message stats error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch message statistics",
        error: error.message,
      });
    }
  }
}

module.exports = new MessagesController();
