const twilio = require("twilio");

class SMSService {
  constructor() {
    this.client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN,
    );
    this.fromNumber = process.env.TWILIO_PHONE_NUMBER;
  }

  async sendOrderConfirmation(mobile, orderId) {
    try {
      const message = `🏥 Hare Krishna Medical
Order Confirmed! 
Order ID: ${orderId}
Track your order: ${process.env.FRONTEND_URL}/orders
Thank you for choosing us!`;

      const result = await this.client.messages.create({
        body: message,
        from: this.fromNumber,
        to: mobile,
      });

      console.log("Order confirmation SMS sent:", result.sid);
      return result;
    } catch (error) {
      console.error("SMS sending error:", error);
      throw error;
    }
  }

  async sendOrderStatusUpdate(mobile, orderId, status) {
    try {
      const statusMessages = {
        Confirmed: "✅ Order Confirmed",
        Processing: "⚙️ Order is being processed",
        Shipped: "🚚 Order shipped",
        Delivered: "📦 Order delivered",
        Cancelled: "❌ Order cancelled",
      };

      const message = `🏥 Hare Krishna Medical
${statusMessages[status] || `Order status: ${status}`}
Order ID: ${orderId}
Track: ${process.env.FRONTEND_URL}/orders`;

      const result = await this.client.messages.create({
        body: message,
        from: this.fromNumber,
        to: mobile,
      });

      console.log("Order status SMS sent:", result.sid);
      return result;
    } catch (error) {
      console.error("SMS sending error:", error);
      throw error;
    }
  }

  async sendOTP(mobile, otp) {
    try {
      const message = `🏥 Hare Krishna Medical
Your OTP is: ${otp}
Valid for 5 minutes.
Do not share with anyone.`;

      const result = await this.client.messages.create({
        body: message,
        from: this.fromNumber,
        to: mobile,
      });

      console.log("OTP SMS sent:", result.sid);
      return result;
    } catch (error) {
      console.error("OTP SMS sending error:", error);
      throw error;
    }
  }

  async sendPaymentReminder(mobile, invoiceId, amount) {
    try {
      const message = `🏥 Hare Krishna Medical
Payment reminder for Invoice: ${invoiceId}
Amount: ₹${amount}
Pay now: ${process.env.FRONTEND_URL}/invoice/${invoiceId}`;

      const result = await this.client.messages.create({
        body: message,
        from: this.fromNumber,
        to: mobile,
      });

      console.log("Payment reminder SMS sent:", result.sid);
      return result;
    } catch (error) {
      console.error("Payment reminder SMS error:", error);
      throw error;
    }
  }

  async sendLowStockAlert(mobile, productName, currentStock) {
    try {
      const message = `🏥 Hare Krishna Medical - ADMIN ALERT
⚠️ LOW STOCK ALERT
Product: ${productName}
Current Stock: ${currentStock}
Please reorder immediately.`;

      const result = await this.client.messages.create({
        body: message,
        from: this.fromNumber,
        to: mobile,
      });

      console.log("Low stock alert SMS sent:", result.sid);
      return result;
    } catch (error) {
      console.error("Low stock alert SMS error:", error);
      throw error;
    }
  }
}

module.exports = new SMSService();
