const nodemailer = require("nodemailer");

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransporter({
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
    const mailOptions = {
      from: `"Hare Krishna Medical" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Welcome to Hare Krishna Medical! 🏥",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #e63946, #dc3545); color: white; padding: 30px; border-radius: 10px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">Welcome to Hare Krishna Medical!</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">Your trusted healthcare partner</p>
          </div>

          <div style="padding: 30px; background: #f8f9fa; border-radius: 10px; margin-top: 20px;">
            <h2 style="color: #333; margin-top: 0;">Hello ${fullName}! 👋</h2>

            <p style="color: #666; line-height: 1.6;">
              Thank you for joining Hare Krishna Medical! We're excited to serve you with the best healthcare products and medical supplies.
            </p>

            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #e63946; margin-top: 0;">What you can do now:</h3>
              <ul style="color: #666; line-height: 1.8;">
                <li>🛒 Browse our extensive product catalog</li>
                <li>💊 Order medicines and healthcare products</li>
                <li>📋 Track your orders in real-time</li>
                <li>🧾 Access digital invoices with QR verification</li>
                <li>🏥 Get expert healthcare advice</li>
              </ul>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL}/products"
                 style="background: #e63946; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                Start Shopping
              </a>
            </div>

            <div style="border-top: 1px solid #ddd; padding-top: 20px; margin-top: 30px; text-align: center;">
              <p style="color: #888; font-size: 14px; margin: 0;">
                📍 3 Sahyog Complex, Man Sarovar circle, Amroli, 394107, Gujarat<br>
                📞 +91 76989 13354 | 📧 harekrishnamedical@gmail.com
              </p>
            </div>
          </div>
        </div>
      `,
    };

    return this.transporter.sendMail(mailOptions);
  }

  async sendOrderConfirmation(email, fullName, order) {
    const mailOptions = {
      from: `"Hare Krishna Medical" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Order Confirmation - ${order.orderId} 📦`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #28a745, #20c997); color: white; padding: 30px; border-radius: 10px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">Order Confirmed! ✅</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">Order #${order.orderId}</p>
          </div>

          <div style="padding: 30px; background: #f8f9fa; border-radius: 10px; margin-top: 20px;">
            <h2 style="color: #333; margin-top: 0;">Thank you ${fullName}!</h2>

            <p style="color: #666; line-height: 1.6;">
              Your order has been confirmed and is being processed. We'll notify you once it's shipped.
            </p>

            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #28a745; margin-top: 0;">Order Details:</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Order ID:</strong></td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${order.orderId}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Order Date:</strong></td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${new Date(order.createdAt).toLocaleDateString()}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Payment Method:</strong></td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${order.paymentMethod}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Total Amount:</strong></td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #eee; font-weight: bold; color: #28a745;">₹${order.total.toFixed(2)}</td>
                </tr>
              </table>
            </div>

            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">Items Ordered:</h3>
              ${order.items
                .map(
                  (item) => `
                <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f0f0f0;">
                  <div>
                    <strong>${item.name}</strong><br>
                    <small style="color: #666;">Qty: ${item.quantity}</small>
                  </div>
                  <div style="text-align: right;">
                    <strong>₹${item.total.toFixed(2)}</strong>
                  </div>
                </div>
              `,
                )
                .join("")}
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL}/orders/${order._id}"
                 style="background: #28a745; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; margin-right: 10px;">
                Track Order
              </a>
              <a href="${process.env.FRONTEND_URL}/products"
                 style="background: #6c757d; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                Continue Shopping
              </a>
            </div>

            <div style="border-top: 1px solid #ddd; padding-top: 20px; margin-top: 30px; text-align: center;">
              <p style="color: #888; font-size: 14px; margin: 0;">
                📍 3 Sahyog Complex, Man Sarovar circle, Amroli, 394107, Gujarat<br>
                📞 +91 76989 13354 | 📧 harekrishnamedical@gmail.com
              </p>
            </div>
          </div>
        </div>
      `,
    };

    return this.transporter.sendMail(mailOptions);
  }

  async sendOrderStatusUpdate(email, fullName, order, newStatus) {
    const statusColors = {
      Confirmed: "#ffc107",
      Processing: "#17a2b8",
      Shipped: "#6610f2",
      Delivered: "#28a745",
      Cancelled: "#dc3545",
    };

    const statusEmojis = {
      Confirmed: "✅",
      Processing: "⚙️",
      Shipped: "🚚",
      Delivered: "📦",
      Cancelled: "❌",
    };

    const mailOptions = {
      from: `"Hare Krishna Medical" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Order ${newStatus} - ${order.orderId} ${statusEmojis[newStatus] || "📋"}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, ${statusColors[newStatus] || "#6c757d"}, ${statusColors[newStatus] || "#6c757d"}); color: white; padding: 30px; border-radius: 10px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">Order ${newStatus} ${statusEmojis[newStatus] || "📋"}</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">Order #${order.orderId}</p>
          </div>

          <div style="padding: 30px; background: #f8f9fa; border-radius: 10px; margin-top: 20px;">
            <h2 style="color: #333; margin-top: 0;">Hello ${fullName}!</h2>

            <p style="color: #666; line-height: 1.6;">
              Your order status has been updated to <strong style="color: ${statusColors[newStatus] || "#6c757d"};">${newStatus}</strong>.
              ${
                newStatus === "Shipped"
                  ? order.trackingNumber
                    ? `Your tracking number is: <strong>${order.trackingNumber}</strong>`
                    : ""
                  : ""
              }
            </p>

            ${
              newStatus === "Delivered"
                ? `
            <div style="background: #d4edda; border: 1px solid #c3e6cb; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #155724; margin-top: 0;">🎉 Order Delivered Successfully!</h3>
              <p style="color: #155724; margin: 0;">
                Thank you for choosing Hare Krishna Medical. We hope you're satisfied with your purchase!
              </p>
            </div>
            `
                : ""
            }

            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL}/orders/${order._id}"
                 style="background: ${statusColors[newStatus] || "#6c757d"}; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                View Order Details
              </a>
            </div>

            <div style="border-top: 1px solid #ddd; padding-top: 20px; margin-top: 30px; text-align: center;">
              <p style="color: #888; font-size: 14px; margin: 0;">
                📍 3 Sahyog Complex, Man Sarovar circle, Amroli, 394107, Gujarat<br>
                📞 +91 76989 13354 | 📧 harekrishnamedical@gmail.com
              </p>
            </div>
          </div>
        </div>
      `,
    };

    return this.transporter.sendMail(mailOptions);
  }

  async sendPasswordResetEmail(email, fullName, resetUrl) {
    const mailOptions = {
      from: `"Hare Krishna Medical" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset Request 🔑",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #dc3545, #e63946); color: white; padding: 30px; border-radius: 10px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">Password Reset 🔑</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">Secure your account</p>
          </div>

          <div style="padding: 30px; background: #f8f9fa; border-radius: 10px; margin-top: 20px;">
            <h2 style="color: #333; margin-top: 0;">Hello ${fullName}!</h2>

            <p style="color: #666; line-height: 1.6;">
              You requested a password reset for your Hare Krishna Medical account. Click the button below to reset your password.
            </p>

            <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="color: #856404; margin: 0; font-size: 14px;">
                ⚠️ This link will expire in 10 minutes. If you didn't request this, please ignore this email.
              </p>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}"
                 style="background: #dc3545; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                Reset Password
              </a>
            </div>

            <p style="color: #666; font-size: 14px; text-align: center;">
              Or copy and paste this link in your browser:<br>
              <a href="${resetUrl}" style="color: #dc3545; word-break: break-all;">${resetUrl}</a>
            </p>

            <div style="border-top: 1px solid #ddd; padding-top: 20px; margin-top: 30px; text-align: center;">
              <p style="color: #888; font-size: 14px; margin: 0;">
                📍 3 Sahyog Complex, Man Sarovar circle, Amroli, 394107, Gujarat<br>
                📞 +91 76989 13354 | 📧 harekrishnamedical@gmail.com
              </p>
            </div>
          </div>
        </div>
      `,
    };

    return this.transporter.sendMail(mailOptions);
  }

  async sendInvoiceEmail(invoice) {
    const mailOptions = {
      from: `"Hare Krishna Medical" <${process.env.EMAIL_USER}>`,
      to: invoice.customerDetails.email,
      subject: `Invoice ${invoice.invoiceId} - Hare Krishna Medical 🧾`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #6610f2, #6f42c1); color: white; padding: 30px; border-radius: 10px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">Invoice Ready 🧾</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">Invoice #${invoice.invoiceId}</p>
          </div>

          <div style="padding: 30px; background: #f8f9fa; border-radius: 10px; margin-top: 20px;">
            <h2 style="color: #333; margin-top: 0;">Hello ${invoice.customerDetails.fullName}!</h2>

            <p style="color: #666; line-height: 1.6;">
              Your invoice is ready for download. You can view and download it using the link below.
            </p>

            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #6610f2; margin-top: 0;">Invoice Details:</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Invoice ID:</strong></td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${invoice.invoiceId}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Invoice Date:</strong></td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${new Date(invoice.invoiceDate).toLocaleDateString()}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Total Amount:</strong></td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #eee; font-weight: bold; color: #6610f2;">₹${invoice.total.toFixed(2)}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Payment Status:</strong></td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #eee;">
                    <span style="background: ${invoice.paymentStatus === "Completed" ? "#d4edda" : "#fff3cd"};
                                 color: ${invoice.paymentStatus === "Completed" ? "#155724" : "#856404"};
                                 padding: 4px 8px; border-radius: 4px; font-size: 12px;">
                      ${invoice.paymentStatus}
                    </span>
                  </td>
                </tr>
              </table>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL}/invoice/${invoice.invoiceId}"
                 style="background: #6610f2; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                View Invoice
              </a>
            </div>

            <div style="border-top: 1px solid #ddd; padding-top: 20px; margin-top: 30px; text-align: center;">
              <p style="color: #888; font-size: 14px; margin: 0;">
                📍 3 Sahyog Complex, Man Sarovar circle, Amroli, 394107, Gujarat<br>
                📞 +91 76989 13354 | 📧 harekrishnamedical@gmail.com
              </p>
            </div>
          </div>
        </div>
      `,
    };

    return this.transporter.sendMail(mailOptions);
  }

  async sendOrderCancellation(email, fullName, order, reason) {
    const mailOptions = {
      from: `"Hare Krishna Medical" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Order Cancelled - ${order.orderId} ❌`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #dc3545, #e63946); color: white; padding: 30px; border-radius: 10px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">Order Cancelled ❌</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">Order #${order.orderId}</p>
          </div>

          <div style="padding: 30px; background: #f8f9fa; border-radius: 10px; margin-top: 20px;">
            <h2 style="color: #333; margin-top: 0;">Hello ${fullName}!</h2>

            <p style="color: #666; line-height: 1.6;">
              Your order has been cancelled as requested.
              ${order.refundAmount > 0 ? `A refund of ₹${order.refundAmount.toFixed(2)} has been processed.` : ""}
            </p>

            <div style="background: #f8d7da; border: 1px solid #f5c6cb; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #721c24; margin-top: 0;">Cancellation Reason:</h3>
              <p style="color: #721c24; margin: 0;">${reason}</p>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL}/products"
                 style="background: #dc3545; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                Continue Shopping
              </a>
            </div>

            <div style="border-top: 1px solid #ddd; padding-top: 20px; margin-top: 30px; text-align: center;">
              <p style="color: #888; font-size: 14px; margin: 0;">
                📍 3 Sahyog Complex, Man Sarovar circle, Amroli, 394107, Gujarat<br>
                📞 +91 76989 13354 | 📧 harekrishnamedical@gmail.com
              </p>
            </div>
          </div>
        </div>
      `,
    };

    return this.transporter.sendMail(mailOptions);
  }

  async sendEmailVerification(email, fullName, verificationUrl) {
    const mailOptions = {
      from: `"Hare Krishna Medical" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify Your Email - Hare Krishna Medical ✉️",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #17a2b8, #20c997); color: white; padding: 30px; border-radius: 10px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">Verify Your Email ✉️</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">Complete your registration</p>
          </div>

          <div style="padding: 30px; background: #f8f9fa; border-radius: 10px; margin-top: 20px;">
            <h2 style="color: #333; margin-top: 0;">Hello ${fullName}!</h2>

            <p style="color: #666; line-height: 1.6;">
              Thank you for registering with Hare Krishna Medical! To complete your registration and start shopping, please verify your email address by clicking the button below.
            </p>

            <div style="background: #e7f3ff; border: 1px solid #b3d7ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #0066cc; margin-top: 0;">Why verify your email?</h3>
              <ul style="color: #0066cc; margin: 0; padding-left: 20px;">
                <li>Secure your account</li>
                <li>Receive order updates</li>
                <li>Get exclusive offers</li>
                <li>Access all features</li>
              </ul>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}"
                 style="background: #17a2b8; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                Verify Email Address
              </a>
            </div>

            <p style="color: #666; font-size: 14px; text-align: center;">
              Or copy and paste this link in your browser:<br>
              <a href="${verificationUrl}" style="color: #17a2b8; word-break: break-all;">${verificationUrl}</a>
            </p>

            <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="color: #856404; margin: 0; font-size: 14px;">
                ⚠️ This verification link will expire in 24 hours. If you didn't create an account, please ignore this email.
              </p>
            </div>

            <div style="border-top: 1px solid #ddd; padding-top: 20px; margin-top: 30px; text-align: center;">
              <p style="color: #888; font-size: 14px; margin: 0;">
                📍 3 Sahyog Complex, Man Sarovar circle, Amroli, 394107, Gujarat<br>
                📞 +91 76989 13354 | 📧 harekrishnamedical@gmail.com
              </p>
            </div>
          </div>
        </div>
      `,
    };

    return this.transporter.sendMail(mailOptions);
  }
}

module.exports = new EmailService();
