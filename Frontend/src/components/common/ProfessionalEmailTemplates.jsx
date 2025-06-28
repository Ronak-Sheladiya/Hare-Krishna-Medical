import React from "react";

// Welcome Email Template
export const WelcomeEmailTemplate = ({ userName, userEmail }) => (
  <div className="email-container" style={emailContainerStyle}>
    <div className="email-header" style={emailHeaderStyle}>
      <div style={companyLogoStyle}>
        <h2 style={companyNameStyle}>🏥 HARE KRISHNA MEDICAL</h2>
        <p style={companyTaglineStyle}>Your Health, Our Priority</p>
      </div>
    </div>

    <div className="email-body" style={emailBodyStyle}>
      <div style={greetingStyle}>
        <h3 style={welcomeTitleStyle}>Welcome to Hare Krishna Medical! 🎉</h3>
      </div>

      <div style={contentStyle}>
        <p style={paragraphStyle}>
          Dear <strong>{userName}</strong>,
        </p>

        <p style={paragraphStyle}>
          Thank you for joining the Hare Krishna Medical family! We're thrilled
          to have you as part of our community.
        </p>

        <div style={benefitsBoxStyle}>
          <h4 style={benefitsHeaderStyle}>
            What you can do with your account:
          </h4>
          <ul style={benefitsListStyle}>
            <li style={benefitItemStyle}>
              🛒 Browse and order medicines online
            </li>
            <li style={benefitItemStyle}>📋 Track your order history</li>
            <li style={benefitItemStyle}>💊 Get medication reminders</li>
            <li style={benefitItemStyle}>
              🏥 Access health tips and information
            </li>
            <li style={benefitItemStyle}>📞 24/7 customer support</li>
          </ul>
        </div>

        <div style={ctaContainerStyle}>
          <a href="#" style={ctaButtonStyle}>
            Start Shopping Now
          </a>
        </div>

        <p style={paragraphStyle}>
          If you have any questions, feel free to contact our customer support
          team at
          <strong> +91 76989 13354</strong> or reply to this email.
        </p>
      </div>
    </div>

    <div className="email-footer" style={emailFooterStyle}>
      <div style={footerContentStyle}>
        <p style={footerTextStyle}>
          <strong>Hare Krishna Medical Store</strong>
          <br />
          📍 3 Sahyog Complex, Man Sarovar circle, Amroli, 394107, Gujarat
          <br />
          📞 +91 76989 13354 | 📧 hkmedicalamroli@gmail.com
          <br />
          🌐 Visit our store for the best medical care
        </p>

        <div style={socialLinksStyle}>
          <a href="#" style={socialLinkStyle}>
            Facebook
          </a>
          <a href="#" style={socialLinkStyle}>
            WhatsApp
          </a>
          <a href="#" style={socialLinkStyle}>
            Instagram
          </a>
        </div>

        <p style={disclaimerStyle}>
          This is an automated email. Please do not reply to this email address.
        </p>
      </div>
    </div>
  </div>
);

// Order Confirmation Email Template
export const OrderConfirmationEmailTemplate = ({ orderData, customerName }) => (
  <div className="email-container" style={emailContainerStyle}>
    <div className="email-header" style={emailHeaderStyle}>
      <h2 style={companyNameStyle}>🏥 HARE KRISHNA MEDICAL</h2>
      <div style={orderHeaderStyle}>
        <h3 style={orderTitleStyle}>Order Confirmation ✅</h3>
        <p style={orderNumberStyle}>Order #{orderData.orderId}</p>
      </div>
    </div>

    <div className="email-body" style={emailBodyStyle}>
      <p style={paragraphStyle}>
        Dear <strong>{customerName}</strong>,
      </p>

      <p style={paragraphStyle}>
        Thank you for your order! We've received your order and are preparing it
        for shipment.
      </p>

      <div style={orderSummaryBoxStyle}>
        <h4 style={sectionHeaderStyle}>📦 Order Summary</h4>
        <div style={orderDetailsStyle}>
          <div style={orderRowStyle}>
            <span>
              <strong>Order Date:</strong>
            </span>
            <span>{new Date(orderData.orderDate).toLocaleDateString()}</span>
          </div>
          <div style={orderRowStyle}>
            <span>
              <strong>Delivery Method:</strong>
            </span>
            <span>{orderData.deliveryMethod}</span>
          </div>
          <div style={orderRowStyle}>
            <span>
              <strong>Payment Method:</strong>
            </span>
            <span>{orderData.paymentMethod}</span>
          </div>
          <div style={orderRowStyle}>
            <span>
              <strong>Total Amount:</strong>
            </span>
            <span style={totalAmountStyle}>₹{orderData.total}</span>
          </div>
        </div>

        <div style={itemsListStyle}>
          <h5 style={itemsHeaderStyle}>Items Ordered:</h5>
          {orderData.items?.map((item, index) => (
            <div key={index} style={itemRowStyle}>
              <span>{item.name}</span>
              <span>Qty: {item.quantity}</span>
              <span>₹{item.price}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={ctaContainerStyle}>
        <a href="#" style={ctaButtonStyle}>
          Track Your Order
        </a>
      </div>
    </div>

    <div className="email-footer" style={emailFooterStyle}>
      <div style={footerContentStyle}>
        <p style={footerTextStyle}>
          <strong>Hare Krishna Medical Store</strong>
          <br />
          📍 3 Sahyog Complex, Man Sarovar circle, Amroli, 394107, Gujarat
          <br />
          📞 +91 76989 13354 | 📧 hkmedicalamroli@gmail.com
        </p>
      </div>
    </div>
  </div>
);

// Contact Form Response Email Template
export const ContactResponseEmailTemplate = ({
  customerName,
  originalMessage,
  response,
}) => (
  <div className="email-container" style={emailContainerStyle}>
    <div className="email-header" style={emailHeaderStyle}>
      <h2 style={companyNameStyle}>🏥 HARE KRISHNA MEDICAL</h2>
      <div style={responseHeaderStyle}>
        <h3 style={responseTitleStyle}>Response to Your Inquiry 💬</h3>
      </div>
    </div>

    <div className="email-body" style={emailBodyStyle}>
      <p style={paragraphStyle}>
        Dear <strong>{customerName}</strong>,
      </p>

      <p style={paragraphStyle}>
        Thank you for contacting us. We're pleased to respond to your inquiry.
      </p>

      <div style={originalMessageBoxStyle}>
        <h4 style={sectionHeaderStyle}>📝 Your Original Message:</h4>
        <div style={originalMessageStyle}>"{originalMessage}"</div>
      </div>

      <div style={responseBoxStyle}>
        <h4 style={sectionHeaderStyle}>💡 Our Response:</h4>
        <div style={responseContentStyle}>{response}</div>
      </div>

      <p style={paragraphStyle}>
        If you have any additional questions, please don't hesitate to contact
        us again.
      </p>

      <div style={ctaContainerStyle}>
        <a href="#" style={ctaButtonStyle}>
          Contact Us Again
        </a>
      </div>
    </div>

    <div className="email-footer" style={emailFooterStyle}>
      <div style={footerContentStyle}>
        <p style={footerTextStyle}>
          <strong>Hare Krishna Medical Store</strong>
          <br />
          📍 3 Sahyog Complex, Man Sarovar circle, Amroli, 394107, Gujarat
          <br />
          📞 +91 76989 13354 | 📧 hkmedicalamroli@gmail.com
        </p>
      </div>
    </div>
  </div>
);

// Styles with Red Theme
const emailContainerStyle = {
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  lineHeight: "1.6",
  color: "#333333",
  maxWidth: "600px",
  margin: "0 auto",
  backgroundColor: "#ffffff",
  border: "1px solid #e0e0e0",
  borderRadius: "8px",
  overflow: "hidden",
  boxShadow: "0 4px 12px rgba(220, 53, 69, 0.15)",
};

const emailHeaderStyle = {
  background: "linear-gradient(135deg, #dc3545 0%, #b91c2c 100%)",
  color: "#ffffff",
  padding: "2rem",
  textAlign: "center",
};

const companyLogoStyle = {
  marginBottom: "1rem",
};

const companyNameStyle = {
  margin: "0",
  fontSize: "28px",
  fontWeight: "bold",
  letterSpacing: "1px",
  textShadow: "0 2px 4px rgba(0,0,0,0.3)",
};

const companyTaglineStyle = {
  margin: "0.5rem 0 0 0",
  fontSize: "14px",
  opacity: "0.9",
  fontStyle: "italic",
};

const emailBodyStyle = {
  padding: "2rem",
};

const greetingStyle = {
  textAlign: "center",
  marginBottom: "2rem",
};

const welcomeTitleStyle = {
  color: "#dc3545",
  fontSize: "24px",
  margin: "0 0 1rem 0",
  fontWeight: "600",
};

const contentStyle = {
  fontSize: "16px",
  lineHeight: "1.7",
};

const paragraphStyle = {
  margin: "1rem 0",
  color: "#444444",
};

const benefitsBoxStyle = {
  background: "linear-gradient(135deg, #fff5f5 0%, #ffe6e6 100%)",
  border: "2px solid #dc3545",
  borderRadius: "8px",
  padding: "1.5rem",
  margin: "2rem 0",
};

const benefitsHeaderStyle = {
  color: "#dc3545",
  fontSize: "18px",
  margin: "0 0 1rem 0",
  fontWeight: "600",
};

const benefitsListStyle = {
  listStyle: "none",
  padding: "0",
  margin: "0",
};

const benefitItemStyle = {
  padding: "0.5rem 0",
  fontSize: "15px",
  color: "#555555",
};

const ctaContainerStyle = {
  textAlign: "center",
  margin: "2rem 0",
};

const ctaButtonStyle = {
  display: "inline-block",
  background: "linear-gradient(135deg, #dc3545 0%, #b91c2c 100%)",
  color: "#ffffff",
  padding: "1rem 2rem",
  textDecoration: "none",
  borderRadius: "25px",
  fontWeight: "600",
  fontSize: "16px",
  textTransform: "uppercase",
  letterSpacing: "1px",
  boxShadow: "0 4px 15px rgba(220, 53, 69, 0.4)",
  transition: "all 0.3s ease",
};

const emailFooterStyle = {
  background: "#f8f9fa",
  borderTop: "3px solid #dc3545",
  padding: "2rem",
};

const footerContentStyle = {
  textAlign: "center",
};

const footerTextStyle = {
  margin: "0 0 1rem 0",
  fontSize: "14px",
  color: "#666666",
  lineHeight: "1.5",
};

const socialLinksStyle = {
  margin: "1rem 0",
  display: "flex",
  justifyContent: "center",
  gap: "1rem",
};

const socialLinkStyle = {
  color: "#dc3545",
  textDecoration: "none",
  fontWeight: "600",
  fontSize: "14px",
};

const disclaimerStyle = {
  margin: "1rem 0 0 0",
  fontSize: "12px",
  color: "#999999",
  fontStyle: "italic",
};

// Order specific styles
const orderHeaderStyle = {
  backgroundColor: "rgba(255, 255, 255, 0.2)",
  padding: "1rem",
  borderRadius: "8px",
  marginTop: "1rem",
};

const orderTitleStyle = {
  margin: "0",
  fontSize: "20px",
  fontWeight: "600",
};

const orderNumberStyle = {
  margin: "0.5rem 0 0 0",
  fontSize: "16px",
  opacity: "0.9",
};

const orderSummaryBoxStyle = {
  background: "#f8f9fa",
  border: "2px solid #dc3545",
  borderRadius: "8px",
  padding: "1.5rem",
  margin: "2rem 0",
};

const sectionHeaderStyle = {
  color: "#dc3545",
  fontSize: "18px",
  margin: "0 0 1rem 0",
  fontWeight: "600",
};

const orderDetailsStyle = {
  marginBottom: "1.5rem",
};

const orderRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  padding: "0.5rem 0",
  borderBottom: "1px solid #e0e0e0",
};

const totalAmountStyle = {
  color: "#dc3545",
  fontWeight: "bold",
  fontSize: "18px",
};

const itemsListStyle = {
  marginTop: "1.5rem",
};

const itemsHeaderStyle = {
  color: "#333333",
  fontSize: "16px",
  margin: "0 0 1rem 0",
  fontWeight: "600",
};

const itemRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  padding: "0.5rem 0",
  fontSize: "14px",
  color: "#555555",
};

// Contact response specific styles
const responseHeaderStyle = {
  backgroundColor: "rgba(255, 255, 255, 0.2)",
  padding: "1rem",
  borderRadius: "8px",
  marginTop: "1rem",
};

const responseTitleStyle = {
  margin: "0",
  fontSize: "20px",
  fontWeight: "600",
};

const originalMessageBoxStyle = {
  background: "#f8f9fa",
  border: "1px solid #e0e0e0",
  borderRadius: "8px",
  padding: "1.5rem",
  margin: "2rem 0",
};

const originalMessageStyle = {
  fontStyle: "italic",
  color: "#666666",
  padding: "1rem",
  background: "#ffffff",
  borderLeft: "4px solid #dc3545",
  borderRadius: "4px",
};

const responseBoxStyle = {
  background: "linear-gradient(135deg, #fff5f5 0%, #ffe6e6 100%)",
  border: "2px solid #dc3545",
  borderRadius: "8px",
  padding: "1.5rem",
  margin: "2rem 0",
};

const responseContentStyle = {
  color: "#333333",
  lineHeight: "1.7",
};

export default {
  WelcomeEmailTemplate,
  OrderConfirmationEmailTemplate,
  ContactResponseEmailTemplate,
};
