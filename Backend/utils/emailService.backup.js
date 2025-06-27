const nodemailer = require("nodemailer");

class EmailService {
  constructor() {
    // Validate email configuration
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn("⚠️ Email service: EMAIL_USER or EMAIL_PASS not configured");
    }

    // Create transporter using CORRECT nodemailer method
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "smtp.gmail.com",
      port: parseInt(process.env.EMAIL_PORT) || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      // Enhanced connection options for better reliability
      connectionTimeout: 60000, // 60 seconds
      greetingTimeout: 30000, // 30 seconds
      socketTimeout: 60000, // 60 seconds
      pool: true, // Enable connection pooling
      maxConnections: 5,
      maxMessages: 100,
      rateLimit: 14, // send maximum 14 emails per second
    });

    // Configure transporter events for better error handling
    this.transporter.on("error", (error) => {
      console.error("📧 Email transporter error:", error);
    });

    this.transporter.on("idle", () => {
      console.log("📧 Email transporter is idle");
    });

    // Log email configuration status
    console.log("📧 Professional Email Service Configuration:");
    console.log(`   - Host: ${process.env.EMAIL_HOST || "smtp.gmail.com"}`);
    console.log(`   - Port: ${process.env.EMAIL_PORT || 587}`);
    console.log(
      `   - User: ${process.env.EMAIL_USER ? "✅ Configured" : "❌ Not configured"}`,
    );
    console.log(
      `   - Pass: ${process.env.EMAIL_PASS ? "✅ Configured" : "❌ Not configured"}`,
    );
  }

  // Basic test method
  async testConnection() {
    try {
      await this.transporter.verify();
      console.log("✅ Email service connection successful!");
      return true;
    } catch (error) {
      console.error("❌ Email service connection failed:", error.message);
      return false;
    }
  }

  // Simple email sending method
  async sendEmail(to, subject, text, html) {
    try {
      const mailOptions = {
        from: `"Hare Krishna Medical" <${process.env.EMAIL_USER}>`,
        to: to,
        subject: subject,
        text: text,
        html: html || text,
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log("✅ Email sent successfully:", result.messageId);
      return result;
    } catch (error) {
      console.error("❌ Error sending email:", error.message);
      throw error;
    }
  }
}

// Create and export singleton instance
const emailService = new EmailService();

module.exports = emailService;
