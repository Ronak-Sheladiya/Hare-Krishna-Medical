// SMS Service - DISABLED (Email-only implementation)
// This is a stub to maintain compatibility while only using email notifications

class SMSService {
  constructor() {
    // SMS functionality disabled - using email only
    console.log("SMS Service initialized (email-only mode)");
  }

  async sendOrderConfirmation(mobile, orderId) {
    // SMS disabled - email notifications will be used instead
    console.log(
      `SMS disabled: Order confirmation for ${orderId} would be sent to ${mobile}`,
    );
    return { success: false, message: "SMS service disabled" };
  }

  async sendOrderStatusUpdate(mobile, orderId, status) {
    // SMS disabled - email notifications will be used instead
    console.log(
      `SMS disabled: Status update for ${orderId} (${status}) would be sent to ${mobile}`,
    );
    return { success: false, message: "SMS service disabled" };
  }

  async sendOTP(mobile, otp) {
    // SMS disabled - email OTP will be used instead
    console.log(`SMS disabled: OTP ${otp} would be sent to ${mobile}`);
    return { success: false, message: "SMS service disabled" };
  }

  async sendPaymentReminder(mobile, invoiceId, amount) {
    // SMS disabled - email notifications will be used instead
    console.log(
      `SMS disabled: Payment reminder for ${invoiceId} would be sent to ${mobile}`,
    );
    return { success: false, message: "SMS service disabled" };
  }

  async sendLowStockAlert(mobile, productName, currentStock) {
    // SMS disabled - email notifications will be used instead
    console.log(
      `SMS disabled: Low stock alert for ${productName} would be sent to ${mobile}`,
    );
    return { success: false, message: "SMS service disabled" };
  }
}

module.exports = new SMSService();
