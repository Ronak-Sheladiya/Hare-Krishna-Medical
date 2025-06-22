import React from "react";
import QRCode from "qrcode";

const ProfessionalInvoice = ({
  invoiceData,
  qrCode = null,
  forPrint = false,
}) => {
  const {
    invoiceId,
    orderId,
    orderDate,
    orderTime,
    customerDetails,
    items = [],
    subtotal,
    shipping = 0,
    total,
    paymentMethod,
    paymentStatus,
    status = "Delivered",
  } = invoiceData;

  // Calculate totals without tax (all taxes included in product price)
  const calculatedSubtotal =
    subtotal ||
    items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const calculatedTotal = total || calculatedSubtotal + shipping;

  // Generate QR code with invoice verification URL
  const qrCodeValue =
    qrCode || `https://harekrishan.medical/verify/${invoiceId}`;

  const modernInvoiceStyles = {
    // Modern A4 Invoice Container
    container: {
      width: "210mm",
      minHeight: "297mm",
      maxWidth: "210mm",
      margin: "0 auto",
      padding: "0",
      fontFamily:
        "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      fontSize: "14px",
      lineHeight: "1.6",
      color: "#1a202c",
      backgroundColor: "#ffffff",
      boxSizing: "border-box",
      position: "relative",
      border: forPrint ? "none" : "none",
      borderRadius: forPrint ? "0" : "0",
      boxShadow: forPrint ? "none" : "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
      overflow: "hidden",
    },

    // Modern Header with Gradient
    modernHeader: {
      background:
        "linear-gradient(135deg, #e63946 0%, #dc3545 25%, #c53030 50%, #e63946 75%, #2d3748 100%)",
      color: "#ffffff",
      padding: "40px 40px 60px 40px",
      position: "relative",
      overflow: "hidden",
    },

    // Geometric Background Pattern
    headerPattern: {
      position: "absolute",
      top: "0",
      left: "0",
      right: "0",
      bottom: "0",
      background: `
        radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%),
        linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.05) 50%, transparent 60%)
      `,
      zIndex: 1,
    },

    // Header Content
    headerContent: {
      position: "relative",
      zIndex: 2,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      gap: "40px",
    },

    // Company Info Section
    companySection: {
      flex: "1",
    },

    companyLogo: {
      width: "120px",
      height: "120px",
      background: "rgba(255,255,255,0.15)",
      borderRadius: "20px",
      padding: "15px",
      marginBottom: "25px",
      backdropFilter: "blur(10px)",
      border: "2px solid rgba(255,255,255,0.2)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },

    companyName: {
      fontSize: "32px",
      fontWeight: "800",
      color: "#ffffff",
      margin: "0 0 8px 0",
      letterSpacing: "-0.02em",
      textShadow: "0 4px 8px rgba(0,0,0,0.3)",
    },

    companyTagline: {
      fontSize: "16px",
      color: "rgba(255,255,255,0.9)",
      marginBottom: "20px",
      fontWeight: "500",
    },

    companyContact: {
      fontSize: "14px",
      color: "rgba(255,255,255,0.8)",
      lineHeight: "1.8",
    },

    // Invoice Details Card
    invoiceCard: {
      background: "rgba(255,255,255,0.15)",
      backdropFilter: "blur(15px)",
      border: "2px solid rgba(255,255,255,0.2)",
      borderRadius: "20px",
      padding: "30px",
      minWidth: "280px",
      boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
    },

    invoiceTitle: {
      fontSize: "28px",
      fontWeight: "900",
      color: "#ffffff",
      margin: "0 0 20px 0",
      textAlign: "center",
      letterSpacing: "2px",
      textShadow: "0 2px 4px rgba(0,0,0,0.3)",
    },

    invoiceDetails: {
      display: "grid",
      gap: "12px",
    },

    invoiceDetailRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      fontSize: "14px",
    },

    invoiceLabel: {
      color: "rgba(255,255,255,0.8)",
      fontWeight: "500",
    },

    invoiceValue: {
      color: "#ffffff",
      fontWeight: "700",
      fontSize: "15px",
    },

    // Status Badge
    statusBadge: {
      display: "inline-block",
      padding: "8px 16px",
      borderRadius: "12px",
      fontSize: "12px",
      fontWeight: "700",
      textTransform: "uppercase",
      letterSpacing: "1px",
      background:
        status === "Delivered"
          ? "#10b981"
          : status === "Pending"
            ? "#f59e0b"
            : status === "Processing"
              ? "#3b82f6"
              : "#6b7280",
      color: "#ffffff",
      marginTop: "10px",
      textAlign: "center",
      width: "100%",
      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    },

    // Main Content Area
    mainContent: {
      padding: "50px 40px 40px 40px",
      background: "#ffffff",
    },

    // Customer Information Section
    customerSection: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "30px",
      marginBottom: "40px",
    },

    customerCard: {
      background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
      border: "2px solid #e2e8f0",
      borderRadius: "20px",
      padding: "30px",
      position: "relative",
      overflow: "hidden",
    },

    customerCardPattern: {
      position: "absolute",
      top: "0",
      right: "0",
      width: "100px",
      height: "100px",
      background: "linear-gradient(135deg, #e63946, #dc3545)",
      opacity: "0.05",
      borderRadius: "0 20px 0 100px",
    },

    customerTitle: {
      fontSize: "18px",
      fontWeight: "800",
      color: "#e63946",
      marginBottom: "20px",
      textTransform: "uppercase",
      letterSpacing: "1px",
      position: "relative",
      zIndex: 2,
    },

    customerInfo: {
      position: "relative",
      zIndex: 2,
    },

    customerName: {
      fontSize: "20px",
      fontWeight: "700",
      color: "#1a202c",
      marginBottom: "15px",
    },

    customerDetail: {
      fontSize: "14px",
      color: "#4a5568",
      marginBottom: "8px",
      display: "flex",
      alignItems: "center",
      gap: "10px",
    },

    // Items Table
    itemsSection: {
      marginBottom: "40px",
    },

    sectionTitle: {
      fontSize: "20px",
      fontWeight: "700",
      color: "#1a202c",
      marginBottom: "25px",
      display: "flex",
      alignItems: "center",
      gap: "10px",
    },

    modernTable: {
      width: "100%",
      borderCollapse: "collapse",
      borderRadius: "16px",
      overflow: "hidden",
      boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
      background: "#ffffff",
    },

    tableHeader: {
      background: "linear-gradient(135deg, #2d3748 0%, #4a5568 100%)",
      color: "#ffffff",
    },

    tableHeaderCell: {
      padding: "20px 15px",
      fontSize: "14px",
      fontWeight: "700",
      textAlign: "left",
      textTransform: "uppercase",
      letterSpacing: "1px",
      border: "none",
    },

    tableRow: {
      borderBottom: "1px solid #f7fafc",
      transition: "background-color 0.2s ease",
    },

    tableRowAlt: {
      background: "#f8fafc",
    },

    tableCell: {
      padding: "20px 15px",
      fontSize: "14px",
      color: "#2d3748",
      border: "none",
      verticalAlign: "middle",
    },

    // Summary Section
    summarySection: {
      display: "flex",
      justifyContent: "flex-end",
      marginBottom: "40px",
    },

    summaryCard: {
      background: "linear-gradient(135deg, #f8fafc 0%, #edf2f7 100%)",
      border: "2px solid #e2e8f0",
      borderRadius: "20px",
      padding: "30px",
      minWidth: "400px",
      position: "relative",
      overflow: "hidden",
    },

    summaryPattern: {
      position: "absolute",
      top: "-50px",
      right: "-50px",
      width: "150px",
      height: "150px",
      background: "linear-gradient(135deg, #e63946, #dc3545)",
      opacity: "0.05",
      borderRadius: "50%",
    },

    summaryContent: {
      position: "relative",
      zIndex: 2,
    },

    summaryRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "12px 0",
      borderBottom: "1px solid #e2e8f0",
      fontSize: "14px",
    },

    summaryRowTotal: {
      background: "linear-gradient(135deg, #e63946, #dc3545)",
      color: "#ffffff",
      padding: "20px",
      borderRadius: "12px",
      marginTop: "15px",
      fontSize: "18px",
      fontWeight: "800",
      boxShadow: "0 4px 15px rgba(230, 57, 70, 0.3)",
    },

    // Footer Section
    footerSection: {
      background: "linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)",
      padding: "40px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      gap: "40px",
      borderTop: "3px solid #e63946",
    },

    // Terms Section
    termsSection: {
      flex: "1",
    },

    termsTitle: {
      fontSize: "18px",
      fontWeight: "700",
      color: "#1a202c",
      marginBottom: "20px",
      display: "flex",
      alignItems: "center",
      gap: "10px",
    },

    termsList: {
      fontSize: "13px",
      color: "#4a5568",
      lineHeight: "1.8",
      listStyle: "none",
      padding: "0",
      margin: "0",
    },

    termsItem: {
      marginBottom: "8px",
      paddingLeft: "20px",
      position: "relative",
    },

    // QR Code Section
    qrSection: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "15px",
    },

    qrContainer: {
      background: "#ffffff",
      padding: "20px",
      borderRadius: "16px",
      boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
      border: "3px solid #f1f5f9",
      position: "relative",
    },

    qrCode: {
      width: "120px",
      height: "120px",
      borderRadius: "8px",
    },

    qrLabel: {
      fontSize: "13px",
      fontWeight: "600",
      color: "#4a5568",
      textAlign: "center",
      lineHeight: "1.4",
    },

    // Thank You Message
    thankYouSection: {
      background: "linear-gradient(135deg, #e63946, #dc3545)",
      color: "#ffffff",
      padding: "30px",
      textAlign: "center",
      margin: "40px -40px -40px -40px",
    },

    thankYouTitle: {
      fontSize: "24px",
      fontWeight: "700",
      marginBottom: "10px",
    },

    thankYouMessage: {
      fontSize: "14px",
      opacity: "0.9",
      lineHeight: "1.6",
    },

    // Tax Notice
    taxNotice: {
      background: "linear-gradient(135deg, #fed7d7, #feb2b2)",
      border: "2px solid #fc8181",
      borderRadius: "16px",
      padding: "20px",
      marginBottom: "30px",
      color: "#742a2a",
      textAlign: "center",
      fontWeight: "600",
      fontSize: "14px",
    },
  };

  // QR Code Component
  const QRCodeComponent = () => {
    const [qrDataUrl, setQrDataUrl] = React.useState("");

    React.useEffect(() => {
      QRCode.toDataURL(qrCodeValue, {
        width: 120,
        margin: 2,
        color: {
          dark: "#2d3748",
          light: "#ffffff",
        },
        errorCorrectionLevel: "M",
      }).then(setQrDataUrl);
    }, []);

    return (
      <div style={modernInvoiceStyles.qrContainer}>
        {qrDataUrl && (
          <img
            src={qrDataUrl}
            alt="Invoice Verification QR Code"
            style={modernInvoiceStyles.qrCode}
          />
        )}
      </div>
    );
  };

  return (
    <div style={modernInvoiceStyles.container}>
      {/* Modern Header Section */}
      <div style={modernInvoiceStyles.modernHeader}>
        <div style={modernInvoiceStyles.headerPattern}></div>
        <div style={modernInvoiceStyles.headerContent}>
          {/* Company Information */}
          <div style={modernInvoiceStyles.companySection}>
            <div style={modernInvoiceStyles.companyLogo}>
              <img
                src="https://cdn.builder.io/api/v1/assets/ec4b3f82f1ac4275b8bfc1756fcac420/medical_logo-e586be?format=webp&width=800"
                alt="Hare Krishna Medical"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  filter: "brightness(0) invert(1)",
                }}
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            </div>
            <h1 style={modernInvoiceStyles.companyName}>
              HARE KRISHNA MEDICAL
            </h1>
            <p style={modernInvoiceStyles.companyTagline}>
              Your Trusted Health Partner
            </p>
            <div style={modernInvoiceStyles.companyContact}>
              <div>📍 3 Sahyog Complex, Man Sarovar Circle</div>
              <div>Amroli, 394107, Gujarat, India</div>
              <div>📞 +91 76989 13354 | +91 91060 18508</div>
              <div>✉️ harekrishnamedical@gmail.com</div>
            </div>
          </div>

          {/* Invoice Details Card */}
          <div style={modernInvoiceStyles.invoiceCard}>
            <h2 style={modernInvoiceStyles.invoiceTitle}>INVOICE</h2>
            <div style={modernInvoiceStyles.invoiceDetails}>
              <div style={modernInvoiceStyles.invoiceDetailRow}>
                <span style={modernInvoiceStyles.invoiceLabel}>
                  Invoice No:
                </span>
                <span style={modernInvoiceStyles.invoiceValue}>
                  {invoiceId}
                </span>
              </div>
              <div style={modernInvoiceStyles.invoiceDetailRow}>
                <span style={modernInvoiceStyles.invoiceLabel}>Order No:</span>
                <span style={modernInvoiceStyles.invoiceValue}>{orderId}</span>
              </div>
              <div style={modernInvoiceStyles.invoiceDetailRow}>
                <span style={modernInvoiceStyles.invoiceLabel}>Date:</span>
                <span style={modernInvoiceStyles.invoiceValue}>
                  {orderDate}
                </span>
              </div>
              <div style={modernInvoiceStyles.invoiceDetailRow}>
                <span style={modernInvoiceStyles.invoiceLabel}>Time:</span>
                <span style={modernInvoiceStyles.invoiceValue}>
                  {orderTime}
                </span>
              </div>
            </div>
            <div style={modernInvoiceStyles.statusBadge}>{status}</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={modernInvoiceStyles.mainContent}>
        {/* Tax Notice */}
        <div style={modernInvoiceStyles.taxNotice}>
          ⚠️ All taxes and duties are included in product prices. No additional
          charges apply.
        </div>

        {/* Customer Information */}
        <div style={modernInvoiceStyles.customerSection}>
          <div style={modernInvoiceStyles.customerCard}>
            <div style={modernInvoiceStyles.customerCardPattern}></div>
            <h3 style={modernInvoiceStyles.customerTitle}>Bill To</h3>
            <div style={modernInvoiceStyles.customerInfo}>
              <div style={modernInvoiceStyles.customerName}>
                {customerDetails.fullName}
              </div>
              <div style={modernInvoiceStyles.customerDetail}>
                <span>📧</span> {customerDetails.email}
              </div>
              <div style={modernInvoiceStyles.customerDetail}>
                <span>📱</span> {customerDetails.mobile}
              </div>
              <div style={modernInvoiceStyles.customerDetail}>
                <span>🏠</span> {customerDetails.address}
              </div>
              <div style={modernInvoiceStyles.customerDetail}>
                <span>📍</span> {customerDetails.city}, {customerDetails.state}{" "}
                {customerDetails.pincode}
              </div>
            </div>
          </div>

          <div style={modernInvoiceStyles.customerCard}>
            <div style={modernInvoiceStyles.customerCardPattern}></div>
            <h3 style={modernInvoiceStyles.customerTitle}>Payment Details</h3>
            <div style={modernInvoiceStyles.customerInfo}>
              <div style={modernInvoiceStyles.customerDetail}>
                <span>💳</span> <strong>Method:</strong> {paymentMethod}
              </div>
              <div style={modernInvoiceStyles.customerDetail}>
                <span>📊</span> <strong>Status:</strong>
                <span
                  style={{
                    marginLeft: "8px",
                    padding: "4px 8px",
                    borderRadius: "6px",
                    fontSize: "12px",
                    fontWeight: "600",
                    background:
                      paymentStatus === "Paid" ? "#10b981" : "#f59e0b",
                    color: "#ffffff",
                  }}
                >
                  {paymentStatus}
                </span>
              </div>
              <div style={modernInvoiceStyles.customerDetail}>
                <span>🚚</span> <strong>Shipping:</strong>{" "}
                {customerDetails.address}
              </div>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div style={modernInvoiceStyles.itemsSection}>
          <h3 style={modernInvoiceStyles.sectionTitle}>
            <span>📦</span> Items Ordered
          </h3>
          <table style={modernInvoiceStyles.modernTable}>
            <thead style={modernInvoiceStyles.tableHeader}>
              <tr>
                <th
                  style={{
                    ...modernInvoiceStyles.tableHeaderCell,
                    textAlign: "center",
                    width: "60px",
                  }}
                >
                  Sr.
                </th>
                <th
                  style={{
                    ...modernInvoiceStyles.tableHeaderCell,
                    width: "45%",
                  }}
                >
                  Product Description
                </th>
                <th
                  style={{
                    ...modernInvoiceStyles.tableHeaderCell,
                    textAlign: "center",
                    width: "100px",
                  }}
                >
                  Quantity
                </th>
                <th
                  style={{
                    ...modernInvoiceStyles.tableHeaderCell,
                    textAlign: "right",
                    width: "120px",
                  }}
                >
                  Unit Price (₹)
                </th>
                <th
                  style={{
                    ...modernInvoiceStyles.tableHeaderCell,
                    textAlign: "right",
                    width: "120px",
                  }}
                >
                  Total (₹)
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr
                  key={item.id || index}
                  style={
                    index % 2 === 0
                      ? modernInvoiceStyles.tableRow
                      : modernInvoiceStyles.tableRowAlt
                  }
                >
                  <td
                    style={{
                      ...modernInvoiceStyles.tableCell,
                      textAlign: "center",
                      fontWeight: "700",
                      color: "#e63946",
                    }}
                  >
                    {index + 1}
                  </td>
                  <td style={modernInvoiceStyles.tableCell}>
                    <div
                      style={{
                        fontWeight: "700",
                        marginBottom: "5px",
                        color: "#1a202c",
                      }}
                    >
                      {item.name}
                    </div>
                    <div style={{ fontSize: "12px", color: "#718096" }}>
                      Manufactured by: {item.company || "Medical Product"}
                    </div>
                  </td>
                  <td
                    style={{
                      ...modernInvoiceStyles.tableCell,
                      textAlign: "center",
                      fontWeight: "600",
                    }}
                  >
                    {item.quantity}
                  </td>
                  <td
                    style={{
                      ...modernInvoiceStyles.tableCell,
                      textAlign: "right",
                      fontWeight: "600",
                    }}
                  >
                    ₹{item.price?.toFixed(2) || "0.00"}
                  </td>
                  <td
                    style={{
                      ...modernInvoiceStyles.tableCell,
                      textAlign: "right",
                      fontWeight: "700",
                      color: "#e63946",
                    }}
                  >
                    ₹{((item.price || 0) * (item.quantity || 0)).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary Section */}
        <div style={modernInvoiceStyles.summarySection}>
          <div style={modernInvoiceStyles.summaryCard}>
            <div style={modernInvoiceStyles.summaryPattern}></div>
            <div style={modernInvoiceStyles.summaryContent}>
              <div style={modernInvoiceStyles.summaryRow}>
                <span>Subtotal:</span>
                <span style={{ fontWeight: "600" }}>
                  ₹{calculatedSubtotal.toFixed(2)}
                </span>
              </div>
              <div style={modernInvoiceStyles.summaryRow}>
                <span>Shipping Charges:</span>
                <span
                  style={{
                    fontWeight: "600",
                    color: shipping === 0 ? "#10b981" : "#1a202c",
                  }}
                >
                  {shipping === 0 ? "FREE" : `₹${shipping.toFixed(2)}`}
                </span>
              </div>
              <div style={modernInvoiceStyles.summaryRow}>
                <span>All Taxes & Duties:</span>
                <span style={{ fontWeight: "600", color: "#10b981" }}>
                  INCLUDED
                </span>
              </div>
              <div style={modernInvoiceStyles.summaryRowTotal}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span>GRAND TOTAL:</span>
                  <span>₹{calculatedTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div style={modernInvoiceStyles.footerSection}>
        {/* Terms and Conditions */}
        <div style={modernInvoiceStyles.termsSection}>
          <h3 style={modernInvoiceStyles.termsTitle}>
            <span>📋</span> Terms & Conditions
          </h3>
          <ul style={modernInvoiceStyles.termsList}>
            <li style={modernInvoiceStyles.termsItem}>
              • Payment due within 30 days of invoice date
            </li>
            <li style={modernInvoiceStyles.termsItem}>
              • All prices include applicable taxes and duties
            </li>
            <li style={modernInvoiceStyles.termsItem}>
              • Goods once sold will not be taken back or exchanged
            </li>
            <li style={modernInvoiceStyles.termsItem}>
              • All disputes subject to Gujarat jurisdiction only
            </li>
            <li style={modernInvoiceStyles.termsItem}>
              • For queries: harekrishnamedical@gmail.com
            </li>
          </ul>
        </div>

        {/* QR Code Section */}
        <div style={modernInvoiceStyles.qrSection}>
          <QRCodeComponent />
          <div style={modernInvoiceStyles.qrLabel}>
            <strong>Scan to Verify</strong>
            <br />
            Invoice Authenticity
            <br />& Order Tracking
          </div>
        </div>
      </div>

      {/* Thank You Section */}
      <div style={modernInvoiceStyles.thankYouSection}>
        <h3 style={modernInvoiceStyles.thankYouTitle}>
          Thank You for Your Trust! 🙏
        </h3>
        <p style={modernInvoiceStyles.thankYouMessage}>
          Your health is our priority. We appreciate your business and look
          forward to serving you again.
          <br />
          Generated on: {new Date().toLocaleString("en-GB")} | Powered by Hare
          Krishna Medical System
        </p>
      </div>
    </div>
  );
};

export default ProfessionalInvoice;
