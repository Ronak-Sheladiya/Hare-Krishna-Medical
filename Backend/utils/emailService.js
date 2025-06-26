const nodemailer = require("nodemailer");

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "smtp.gmail.com",
      port: process.env.EMAIL_PORT || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendWelcomeEmail(email, fullName) {
    const websiteUrl = process.env.FRONTEND_URL || "http://localhost:5173";

    const mailOptions = {
      from: `"Hare Krishna Medical" <${process.env.EMAIL_USER}>`,
      to: email,
      subject:
        "Welcome to Hare Krishna Medical Store - Your Trusted Health Partner",
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Hare Krishna Medical</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fa;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">

            <!-- Header Section -->
            <div style="background: linear-gradient(135deg, #e63946, #dc3545); color: #ffffff; padding: 40px 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <div style="background: white; border-radius: 50%; padding: 15px; width: 100px; height: 100px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
                <img src="https://cdn.builder.io/api/v1/assets/030c65a34d11492ab1cc545443b12540/hk-e0ec29?format=webp&width=200"
                     alt="Hare Krishna Medical"
                     style="width: 70px; height: 70px; object-fit: contain;" />
              </div>
              <h1 style="margin: 0; font-size: 28px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">HARE KRISHNA MEDICAL</h1>
              <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.95;">Your Trusted Health Partner</p>
            </div>

            <!-- Welcome Content -->
            <div style="padding: 40px 30px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <h2 style="color: #e63946; margin: 0 0 15px 0; font-size: 24px; font-weight: 600;">
                  Welcome to Our Family! 🎉
                </h2>
                <p style="color: #6c757d; font-size: 16px; line-height: 1.6; margin: 0;">
                  Dear <strong style="color: #e63946;">${fullName}</strong>,
                </p>
              </div>

              <div style="background: linear-gradient(135deg, #fff5f5, #ffeaea); border-left: 4px solid #e63946; padding: 25px; border-radius: 8px; margin: 25px 0;">
                <p style="color: #495057; font-size: 16px; line-height: 1.7; margin: 0;">
                  Thank you for choosing <strong style="color: #e63946;">Hare Krishna Medical Store</strong>!
                  We're thrilled to welcome you to our community of health-conscious individuals who trust us for their medical needs.
                </p>
              </div>

              <!-- Features Grid -->
              <div style="margin: 30px 0;">
                <h3 style="color: #e63946; margin-bottom: 20px; font-size: 18px; text-align: center;">What You Can Do Now:</h3>
                <div style="display: flex; flex-wrap: wrap; gap: 15px; justify-content: space-between;">
                  <div style="flex: 1; min-width: 250px; background: #ffffff; border: 2px solid #f8f9fa; border-radius: 10px; padding: 20px; box-shadow: 0 2px 10px rgba(230,57,70,0.1); text-align: center;">
                    <div style="color: #e63946; font-size: 24px; margin-bottom: 10px;">🏥</div>
                    <h4 style="color: #495057; margin: 0 0 8px 0; font-size: 16px;">Browse Products</h4>
                    <p style="color: #6c757d; margin: 0; font-size: 14px;">Explore our extensive medical product catalog</p>
                  </div>
                  <div style="flex: 1; min-width: 250px; background: #ffffff; border: 2px solid #f8f9fa; border-radius: 10px; padding: 20px; box-shadow: 0 2px 10px rgba(230,57,70,0.1); text-align: center;">
                    <div style="color: #e63946; font-size: 24px; margin-bottom: 10px;">🛒</div>
                    <h4 style="color: #495057; margin: 0 0 8px 0; font-size: 16px;">Easy Orders</h4>
                    <p style="color: #6c757d; margin: 0; font-size: 14px;">Place orders online with just a few clicks</p>
                  </div>
                </div>
                <div style="display: flex; flex-wrap: wrap; gap: 15px; justify-content: space-between; margin-top: 15px;">
                  <div style="flex: 1; min-width: 250px; background: #ffffff; border: 2px solid #f8f9fa; border-radius: 10px; padding: 20px; box-shadow: 0 2px 10px rgba(230,57,70,0.1); text-align: center;">
                    <div style="color: #e63946; font-size: 24px; margin-bottom: 10px;">📦</div>
                    <h4 style="color: #495057; margin: 0 0 8px 0; font-size: 16px;">Track Orders</h4>
                    <p style="color: #6c757d; margin: 0; font-size: 14px;">Monitor your order status in real-time</p>
                  </div>
                  <div style="flex: 1; min-width: 250px; background: #ffffff; border: 2px solid #f8f9fa; border-radius: 10px; padding: 20px; box-shadow: 0 2px 10px rgba(230,57,70,0.1); text-align: center;">
                    <div style="color: #e63946; font-size: 24px; margin-bottom: 10px;">📄</div>
                    <h4 style="color: #495057; margin: 0 0 8px 0; font-size: 16px;">Digital Invoices</h4>
                    <p style="color: #6c757d; margin: 0; font-size: 14px;">Access your order history and invoices</p>
                  </div>
                </div>
              </div>

              <!-- CTA Button -->
              <div style="text-align: center; margin: 35px 0;">
                <a href="${websiteUrl}"
                   style="display: inline-block; background: linear-gradient(135deg, #e63946, #dc3545); color: #ffffff; text-decoration: none; padding: 15px 35px; border-radius: 25px; font-weight: 600; font-size: 16px; box-shadow: 0 6px 20px rgba(230,57,70,0.3); transition: all 0.3s ease;">
                  🌐 Visit Our Website
                </a>
              </div>

              <!-- Support Info -->
              <div style="background: #f8f9fa; border-radius: 10px; padding: 25px; margin: 30px 0; text-align: center;">
                <h4 style="color: #e63946; margin: 0 0 15px 0;">Need Help? We're Here for You!</h4>
                <p style="color: #6c757d; margin: 0 0 15px 0; line-height: 1.6;">
                  Our dedicated support team is ready to assist you with any questions or concerns.
                </p>
                <div style="display: flex; justify-content: center; gap: 30px; flex-wrap: wrap; margin-top: 20px;">
                  <div style="text-align: center;">
                    <div style="color: #e63946; font-size: 18px; margin-bottom: 5px;">📞</div>
                    <strong style="color: #495057;">+91 76989 13354</strong>
                  </div>
                  <div style="text-align: center;">
                    <div style="color: #e63946; font-size: 18px; margin-bottom: 5px;">📧</div>
                    <strong style="color: #495057;">hkmedicalamroli@gmail.com</strong>
                  </div>
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div style="background: linear-gradient(135deg, #495057, #343a40); color: #ffffff; padding: 25px 30px; text-align: center; border-radius: 0 0 10px 10px;">
              <p style="margin: 0 0 10px 0; font-size: 14px; opacity: 0.9;">
                📍 3 Sahyog Complex, Man Sarovar circle, Amroli, 394107, Gujarat
              </p>
              <p style="margin: 0; font-size: 12px; opacity: 0.7;">
                © 2024 Hare Krishna Medical Store. All rights reserved.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Welcome email sent to ${email}`);
    } catch (error) {
      console.error("Error sending welcome email:", error);
      throw error;
    }
  }

  async sendEmailVerification(email, fullName, verificationToken) {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;

    const mailOptions = {
      from: `"Hare Krishna Medical" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Email Verification - Hare Krishna Medical Store",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #007bff;">Email Verification Required</h2>
          <p>Dear ${fullName},</p>
          <p>Please verify your email address by clicking the link below:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}"
               style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Verify Email Address
            </a>
          </div>
          <p>If the button doesn't work, copy and paste this link in your browser:</p>
          <p style="word-break: break-all; color: #007bff;">${verificationUrl}</p>
          <p>This link will expire in 24 hours.</p>
          <p>If you didn't create an account, please ignore this email.</p>
          <p>Best regards,<br>Hare Krishna Medical Store Team</p>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Verification email sent to ${email}`);
    } catch (error) {
      console.error("Error sending verification email:", error);
      throw error;
    }
  }

  async sendVerificationEmail(email, fullName, otp) {
    const mailOptions = {
      from: `"Hare Krishna Medical" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Email Verification OTP - Hare Krishna Medical Store",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #007bff, #0056b3); color: white; padding: 30px; border-radius: 10px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">Email Verification 📧</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">Hare Krishna Medical Store</p>
          </div>

          <div style="padding: 30px; background: #f8f9fa; border-radius: 10px; margin-top: 20px;">
            <h2 style="color: #333; margin-top: 0;">Hello ${fullName}!</h2>

            <p style="color: #666; line-height: 1.6;">
              Thank you for registering with Hare Krishna Medical Store. To complete your registration, please verify your email address using the OTP below:
            </p>

            <div style="background: white; padding: 30px; border-radius: 8px; margin: 30px 0; text-align: center; border: 2px dashed #007bff;">
              <h2 style="color: #007bff; margin: 0; font-size: 36px; letter-spacing: 8px; font-family: monospace;">${otp}</h2>
              <p style="color: #666; margin: 10px 0 0 0;">Enter this 6-digit code to verify your email</p>
            </div>

            <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 15px; margin: 20px 0;">
              <p style="margin: 0; color: #856404;">
                <strong>⏰ This OTP will expire in 10 minutes</strong><br>
                If you didn't create an account, please ignore this email.
              </p>
            </div>

            <div style="border-top: 1px solid #ddd; padding-top: 20px; margin-top: 30px; text-align: center;">
              <p style="color: #888; font-size: 14px; margin: 0;">
                📍 3 Sahyog Complex, Man Sarovar circle, Amroli, 394107, Gujarat<br>
                📞 +91 76989 13354 | 📧 hkmedicalamroli@gmail.com
              </p>
            </div>
          </div>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Verification OTP sent to ${email}`);
    } catch (error) {
      console.error("Error sending verification OTP:", error);
      throw error;
    }
  }

  async sendPasswordResetEmail(email, fullName, resetToken) {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const mailOptions = {
      from: `"Hare Krishna Medical" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset - Hare Krishna Medical Store",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc3545;">Password Reset Request</h2>
          <p>Dear ${fullName},</p>
          <p>You requested a password reset for your account. Click the link below to reset your password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}"
               style="background-color: #dc3545; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p>If the button doesn't work, copy and paste this link in your browser:</p>
          <p style="word-break: break-all; color: #dc3545;">${resetUrl}</p>
          <p>This link will expire in 1 hour for security reasons.</p>
          <p>If you didn't request this password reset, please ignore this email.</p>
          <p>Best regards,<br>Hare Krishna Medical Store Team</p>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Password reset email sent to ${email}`);
    } catch (error) {
      console.error("Error sending password reset email:", error);
      throw error;
    }
  }

  async sendOrderConfirmation(email, fullName, order) {
    const mailOptions = {
      from: `"Hare Krishna Medical" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Order Confirmation #${order.orderId} - Hare Krishna Medical Store`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #28a745;">Order Confirmed!</h2>
          <p>Dear ${fullName},</p>
          <p>Thank you for your order. Your order has been confirmed and is being processed.</p>

          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3>Order Details</h3>
            <p><strong>Order ID:</strong> ${order.orderId}</p>
            <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
            <p><strong>Total Amount:</strong> ₹${order.totalAmount}</p>
            <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
          </div>

          <h3>Items Ordered:</h3>
          <div style="border: 1px solid #dee2e6; border-radius: 5px;">
            ${order.items
              .map(
                (item) => `
              <div style="padding: 10px; border-bottom: 1px solid #dee2e6;">
                <strong>${item.name}</strong><br>
                Quantity: ${item.quantity} × ₹${item.price} = ₹${item.quantity * item.price}
              </div>
            `,
              )
              .join("")}
          </div>

          <p style="margin-top: 20px;">We'll notify you when your order is shipped.</p>
          <p>Track your order status in your dashboard.</p>

          <p>Best regards,<br>Hare Krishna Medical Store Team</p>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Order confirmation sent to ${email}`);
    } catch (error) {
      console.error("Error sending order confirmation:", error);
      throw error;
    }
  }

  async sendOrderStatusUpdate(email, fullName, order, newStatus) {
    const statusMessages = {
      processing: "Your order is being processed",
      shipped: "Your order has been shipped",
      delivered: "Your order has been delivered",
      cancelled: "Your order has been cancelled",
    };

    const mailOptions = {
      from: `"Hare Krishna Medical" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Order Update #${order.orderId} - ${statusMessages[newStatus]}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #007bff;">Order Status Update</h2>
          <p>Dear ${fullName},</p>
          <p>Your order status has been updated:</p>

          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3>Order #${order.orderId}</h3>
            <p><strong>Status:</strong> <span style="color: #28a745; text-transform: uppercase;">${newStatus}</span></p>
            <p><strong>Message:</strong> ${statusMessages[newStatus]}</p>
          </div>

          ${
            newStatus === "shipped"
              ? `
            <p>Your order is on its way! You can track the shipment using the tracking information provided.</p>
          `
              : ""
          }

          ${
            newStatus === "delivered"
              ? `
            <p>Thank you for shopping with us! We hope you're satisfied with your purchase.</p>
            <p>Please rate your experience and leave a review if you have a moment.</p>
          `
              : ""
          }

          <p>You can view full order details in your dashboard.</p>

          <p>Best regards,<br>Hare Krishna Medical Store Team</p>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Status update email sent to ${email}`);
    } catch (error) {
      console.error("Error sending status update email:", error);
      throw error;
    }
  }

  async sendInvoiceEmail(email, fullName, invoice, pdfBuffer) {
    const mailOptions = {
      from: `"Hare Krishna Medical" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Invoice #${invoice.invoiceNumber} - Hare Krishna Medical Store`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #28a745;">Invoice Generated</h2>
          <p>Dear ${fullName},</p>
          <p>Please find your invoice attached for order #${invoice.orderId}.</p>

          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3>Invoice Details</h3>
            <p><strong>Invoice Number:</strong> ${invoice.invoiceNumber}</p>
            <p><strong>Invoice Date:</strong> ${new Date(invoice.createdAt).toLocaleDateString()}</p>
            <p><strong>Total Amount:</strong> ₹${invoice.totalAmount}</p>
          </div>

          <p>You can also view and download your invoice from your dashboard.</p>

          <p>Thank you for your business!</p>
          <p>Best regards,<br>Hare Krishna Medical Store Team</p>
        </div>
      `,
      attachments: pdfBuffer
        ? [
            {
              filename: `invoice-${invoice.invoiceNumber}.pdf`,
              content: pdfBuffer,
              contentType: "application/pdf",
            },
          ]
        : [],
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Invoice email sent to ${email}`);
    } catch (error) {
      console.error("Error sending invoice email:", error);
      throw error;
    }
  }

  async sendContactFormEmail(formData) {
    const mailOptions = {
      from: `"Contact Form" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `New Contact Form Submission from ${formData.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #007bff;">New Contact Form Submission</h2>

          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Name:</strong> ${formData.name}</p>
            <p><strong>Email:</strong> ${formData.email}</p>
            <p><strong>Phone:</strong> ${formData.phone || "Not provided"}</p>
            <p><strong>Subject:</strong> ${formData.subject}</p>
            <p><strong>Message:</strong></p>
            <div style="border-left: 3px solid #007bff; padding-left: 15px; margin-top: 10px;">
              ${formData.message.replace(/\n/g, "<br>")}
            </div>
          </div>

          <p><em>Submitted on: ${new Date().toLocaleString()}</em></p>
        </div>
      `,
      replyTo: formData.email,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Contact form email sent from ${formData.email}`);
    } catch (error) {
      console.error("Error sending contact form email:", error);
      throw error;
    }
  }

  async testConnection() {
    try {
      await this.transporter.verify();
      console.log("✅ Email service connection successful");
      return true;
    } catch (error) {
      console.error("❌ Email service connection failed:", error);
      return false;
    }
  }
}

// Create and export singleton instance
const emailService = new EmailService();

module.exports = emailService;
