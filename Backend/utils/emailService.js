const nodemailer = require("nodemailer");

// Create reusable transporter
let transporter = null;

const createTransporter = async () => {
  if (transporter) return transporter;

  try {
    // Check if email credentials are configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log(
        "⚠️ Email credentials not configured - emails will be skipped",
      );
      return null;
    }

    transporter = nodemailer.createTransporter({
      service: "gmail", // Use Gmail service directly
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // This should be an app password for Gmail
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // Verify the transporter configuration
    await transporter.verify();
    console.log("✅ Email service configured and verified successfully");

    return transporter;
  } catch (error) {
    console.error(
      "❌ Email transporter creation/verification failed:",
      error.message,
    );
    console.log("💡 Gmail setup instructions:");
    console.log("1. Enable 2-factor authentication on your Gmail account");
    console.log("2. Generate an App Password for this application");
    console.log(
      "3. Use the App Password (not your regular password) in EMAIL_PASS",
    );
    return null;
  }
};

// Send welcome email
const sendWelcomeEmail = async (email, name) => {
  try {
    const transporter = await createTransporter();
    if (!transporter) {
      console.log("📧 Email service not configured, skipping welcome email");
      return { success: false, message: "Email service not configured" };
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM || "noreply@harekrishnamedical.com",
      to: email,
      subject: "Welcome to Hare Krishna Medical Store",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #e63946;">Welcome to Hare Krishna Medical Store!</h2>
          <p>Dear ${name},</p>
          <p>Thank you for registering with us. We're excited to have you as a customer!</p>
          <p>You can now browse our wide range of medical products and place orders online.</p>
          <div style="margin: 30px 0; padding: 20px; background-color: #f8f9fa; border-radius: 5px;">
            <h3 style="color: #e63946; margin-top: 0;">What you can do now:</h3>
            <ul>
              <li>Browse our extensive catalog of medical products</li>
              <li>Add products to your cart and place orders</li>
              <li>Track your order status</li>
              <li>Contact our support team for any assistance</li>
            </ul>
          </div>
          <p>If you have any questions, feel free to contact us.</p>
          <p>Best regards,<br>Hare Krishna Medical Store Team</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Welcome email sent to:", email);
    return { success: true, message: "Welcome email sent successfully" };
  } catch (error) {
    console.error("❌ Welcome email failed:", error.message);
    return {
      success: false,
      message: `Welcome email failed: ${error.message}`,
    };
  }
};

// Send verification email
const sendVerificationEmail = async (email, name, token) => {
  try {
    const transporter = createTransporter();
    if (!transporter) {
      console.log("Email service not configured, skipping verification email");
      return;
    }

    const verificationUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/verify-email?token=${token}`;

    const mailOptions = {
      from: process.env.EMAIL_FROM || "noreply@harekrishnamedical.com",
      to: email,
      subject: "Please verify your email address",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #e63946;">Email Verification Required</h2>
          <p>Dear ${name},</p>
          <p>Thank you for registering with Hare Krishna Medical Store. Please verify your email address by clicking the button below:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" style="background-color: #e63946; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Verify Email Address</a>
          </div>
          <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #6c757d;">${verificationUrl}</p>
          <p><strong>Note:</strong> This verification link will expire in 24 hours.</p>
          <p>If you didn't create an account with us, please ignore this email.</p>
          <p>Best regards,<br>Hare Krishna Medical Store Team</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Verification email sent to:", email);
  } catch (error) {
    console.error("Verification email failed:", error);
  }
};

// Send password reset email
const sendPasswordResetEmail = async (email, name, token) => {
  try {
    const transporter = createTransporter();
    if (!transporter) {
      console.log(
        "Email service not configured, skipping password reset email",
      );
      return;
    }

    const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/reset-password?token=${token}`;

    const mailOptions = {
      from: process.env.EMAIL_FROM || "noreply@harekrishnamedical.com",
      to: email,
      subject: "Password Reset Request",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #e63946;">Password Reset Request</h2>
          <p>Dear ${name},</p>
          <p>We received a request to reset your password. Click the button below to reset it:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #e63946; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
          </div>
          <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #6c757d;">${resetUrl}</p>
          <p><strong>Note:</strong> This reset link will expire in 1 hour.</p>
          <p>If you didn't request a password reset, please ignore this email.</p>
          <p>Best regards,<br>Hare Krishna Medical Store Team</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Password reset email sent to:", email);
  } catch (error) {
    console.error("Password reset email failed:", error);
  }
};

// Send order confirmation email
const sendOrderConfirmationEmail = async (email, name, order) => {
  try {
    const transporter = createTransporter();
    if (!transporter) {
      console.log(
        "Email service not configured, skipping order confirmation email",
      );
      return;
    }

    const itemsHtml = order.items
      .map(
        (item) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.productName}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${item.price}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${item.totalPrice}</td>
      </tr>
    `,
      )
      .join("");

    const mailOptions = {
      from: process.env.EMAIL_FROM || "noreply@harekrishnamedical.com",
      to: email,
      subject: `Order Confirmation - ${order.orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #e63946;">Order Confirmation</h2>
          <p>Dear ${name},</p>
          <p>Thank you for your order! Your order has been confirmed and is being processed.</p>

          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #e63946;">Order Details</h3>
            <p><strong>Order ID:</strong> ${order.orderId}</p>
            <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
            <p><strong>Payment Method:</strong> ${order.paymentMethod.toUpperCase()}</p>
          </div>

          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <thead>
              <tr style="background-color: #e63946; color: white;">
                <th style="padding: 10px; text-align: left;">Product</th>
                <th style="padding: 10px; text-align: center;">Qty</th>
                <th style="padding: 10px; text-align: right;">Price</th>
                <th style="padding: 10px; text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" style="padding: 10px; text-align: right; font-weight: bold;">Total Amount:</td>
                <td style="padding: 10px; text-align: right; font-weight: bold;">₹${order.totalAmount}</td>
              </tr>
            </tfoot>
          </table>

          <div style="background-color: #d4edda; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h4 style="margin-top: 0; color: #155724;">What's Next?</h4>
            <p style="margin-bottom: 0;">We'll send you another email when your order ships with tracking information.</p>
          </div>

          <p>If you have any questions about your order, please contact our support team.</p>
          <p>Best regards,<br>Hare Krishna Medical Store Team</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Order confirmation email sent to:", email);
  } catch (error) {
    console.error("Order confirmation email failed:", error);
  }
};

module.exports = {
  sendWelcomeEmail,
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendOrderConfirmationEmail,
};
