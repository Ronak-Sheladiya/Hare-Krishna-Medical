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
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #28a745, #20c997); color: white; padding: 30px; border-radius: 10px; text-align: center;">
              <h1 style="margin: 0; font-size: 28px;">Message Received! ✅</h1>
              <p style="margin: 10px 0 0 0; font-size: 16px;">Thank you for contacting us</p>
            </div>

            <div style="padding: 30px; background: #f8f9fa; border-radius: 10px; margin-top: 20px;">
              <h2 style="color: #333; margin-top: 0;">Hello ${name}!</h2>

              <p style="color: #666; line-height: 1.6;">
                We have received your message and our team will get back to you within 24 hours.
              </p>

              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #28a745; margin-top: 0;">Your Message:</h3>
                <p style="margin: 0;"><strong>Subject:</strong> ${subject}</p>
                <p style="margin: 10px 0 0 0; color: #666;">${message}</p>
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
            id: newMessage.id,
            name: newMessage.name,
            email: newMessage.email,
            subject: newMessage.subject,
            createdAt: newMessage.createdAt,
            status: newMessage.status,
          },
        });
      }

      res.status(201).json({
        success: true,
        message: "Message sent successfully! We'll get back to you soon.",
        data: {
          id: newMessage.id,
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
      } = req.query;

      let filteredMessages = [...this.messages];

      // Filter by status
      if (status) {
        filteredMessages = filteredMessages.filter(
          (msg) => msg.status === status,
        );
      }

      // Search filter
      if (search) {
        const searchLower = search.toLowerCase();
        filteredMessages = filteredMessages.filter(
          (msg) =>
            msg.name.toLowerCase().includes(searchLower) ||
            msg.email.toLowerCase().includes(searchLower) ||
            msg.subject.toLowerCase().includes(searchLower) ||
            msg.message.toLowerCase().includes(searchLower),
        );
      }

      // Date range filter
      if (startDate || endDate) {
        filteredMessages = filteredMessages.filter((msg) => {
          const msgDate = new Date(msg.createdAt);
          if (startDate && msgDate < new Date(startDate)) return false;
          if (endDate && msgDate > new Date(endDate)) return false;
          return true;
        });
      }

      // Sort by date (newest first)
      filteredMessages.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );

      // Pagination
      const startIndex = (parseInt(page) - 1) * parseInt(limit);
      const endIndex = startIndex + parseInt(limit);
      const paginatedMessages = filteredMessages.slice(startIndex, endIndex);

      const totalMessages = filteredMessages.length;
      const totalPages = Math.ceil(totalMessages / limit);

      res.json({
        success: true,
        data: paginatedMessages,
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
      const messageId = parseInt(req.params.id);
      const message = this.messages.find((msg) => msg.id === messageId);

      if (!message) {
        return res.status(404).json({
          success: false,
          message: "Message not found",
        });
      }

      // Mark as read
      if (message.status === "unread") {
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
      const messageId = parseInt(req.params.id);
      const { status } = req.body;

      const validStatuses = ["unread", "read", "responded", "archived"];

      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid status",
        });
      }

      const message = this.messages.find((msg) => msg.id === messageId);

      if (!message) {
        return res.status(404).json({
          success: false,
          message: "Message not found",
        });
      }

      message.status = status;

      // Emit real-time update
      const io = req.app.get("io");
      if (io) {
        io.to("admin-room").emit("message-status-updated", {
          messageId: message.id,
          newStatus: status,
          updatedBy: req.user.fullName,
        });
      }

      res.json({
        success: true,
        message: "Message status updated successfully",
        data: {
          id: message.id,
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
      const messageId = parseInt(req.params.id);
      const { response } = req.body;

      const message = this.messages.find((msg) => msg.id === messageId);

      if (!message) {
        return res.status(404).json({
          success: false,
          message: "Message not found",
        });
      }

      // Update message
      message.response = response;
      message.status = "responded";
      message.respondedAt = new Date();

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
          messageId: message.id,
          respondedBy: req.user.fullName,
          respondedAt: message.respondedAt,
        });
      }

      res.json({
        success: true,
        message: "Response sent successfully",
        data: {
          id: message.id,
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
      const totalMessages = this.messages.length;
      const unreadMessages = this.messages.filter(
        (msg) => msg.status === "unread",
      ).length;
      const readMessages = this.messages.filter(
        (msg) => msg.status === "read",
      ).length;
      const respondedMessages = this.messages.filter(
        (msg) => msg.status === "responded",
      ).length;

      // Daily message trend (last 30 days)
      const dailyMessages = {};
      const last30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

      this.messages
        .filter((msg) => new Date(msg.createdAt) >= last30Days)
        .forEach((msg) => {
          const date = new Date(msg.createdAt).toISOString().split("T")[0];
          dailyMessages[date] = (dailyMessages[date] || 0) + 1;
        });

      const messageTrend = Object.entries(dailyMessages).map(
        ([date, count]) => ({
          date,
          count,
        }),
      );

      // Response time analysis
      const respondedMessagesWithTime = this.messages.filter(
        (msg) => msg.status === "responded" && msg.respondedAt,
      );

      let avgResponseTime = 0;
      if (respondedMessagesWithTime.length > 0) {
        const totalResponseTime = respondedMessagesWithTime.reduce(
          (sum, msg) => {
            const responseTime =
              new Date(msg.respondedAt) - new Date(msg.createdAt);
            return sum + responseTime;
          },
          0,
        );
        avgResponseTime = totalResponseTime / respondedMessagesWithTime.length;
      }

      res.json({
        success: true,
        data: {
          totalMessages,
          unreadMessages,
          readMessages,
          respondedMessages,
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
