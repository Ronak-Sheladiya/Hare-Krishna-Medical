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
    tax,
    total,
    paymentMethod,
    paymentStatus,
    status = "Delivered",
  } = invoiceData;

  // Calculate totals if not provided
  const calculatedSubtotal =
    subtotal ||
    items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const calculatedTax = tax || calculatedSubtotal * 0.05;
  const calculatedTotal =
    total || calculatedSubtotal + shipping + calculatedTax;

  // Generate QR code with invoice URL
  const qrCodeValue =
    qrCode || `https://harekrishan.medical/invoice/${invoiceId}`;

  const invoiceStyles = {
    // A4 dimensions: 210mm x 297mm - Reduced padding to minimize blank space
    container: {
      width: forPrint ? "210mm" : "100%",
      maxWidth: "210mm",
      height: forPrint ? "auto" : "auto",
      margin: "0 auto",
      padding: forPrint ? "10mm" : "20px",
      fontFamily: "'Segoe UI', Arial, sans-serif",
      fontSize: "11px",
      lineHeight: "1.3",
      color: "#333333",
      backgroundColor: "#ffffff",
      boxSizing: "border-box",
      position: "relative",
      border: forPrint ? "none" : "2px solid #f8f9fa",
      borderRadius: forPrint ? "0" : "12px",
      boxShadow: forPrint ? "none" : "0 8px 32px rgba(0,0,0,0.08)",
    },
    header: {
      background: "linear-gradient(135deg, #e63946, #dc3545)",
      color: "#ffffff",
      padding: "20px",
      marginBottom: "20px",
      borderRadius: "8px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    companyInfo: {
      flex: "1",
    },
    companyLogo: {
      width: "60px",
      height: "60px",
      marginBottom: "12px",
      borderRadius: "6px",
      background: "#ffffff",
      padding: "6px",
    },
    companyName: {
      fontSize: "24px",
      fontWeight: "800",
      color: "#ffffff",
      margin: "0 0 6px 0",
      lineHeight: "1.1",
      textShadow: "0 2px 4px rgba(0,0,0,0.2)",
    },
    companyTagline: {
      fontSize: "12px",
      color: "#ffffff",
      marginBottom: "12px",
      opacity: "0.9",
    },
    companyAddress: {
      fontSize: "10px",
      color: "#ffffff",
      lineHeight: "1.3",
      opacity: "0.9",
    },
    invoiceTitle: {
      textAlign: "right",
      flex: "0 0 auto",
    },
    invoiceTitleText: {
      fontSize: "32px",
      fontWeight: "900",
      color: "#ffffff",
      margin: "0 0 12px 0",
      textShadow: "0 2px 4px rgba(0,0,0,0.2)",
    },
    invoiceDetails: {
      background: "rgba(255,255,255,0.15)",
      backdropFilter: "blur(10px)",
      border: "1px solid rgba(255,255,255,0.2)",
      padding: "12px",
      borderRadius: "6px",
      fontSize: "10px",
      color: "#ffffff",
    },
    customerSection: {
      display: "flex",
      gap: "20px",
      marginBottom: "20px",
    },
    customerBox: {
      flex: "1",
      background: "#f8f9fa",
      border: "2px solid #ffffff",
      borderRadius: "8px",
      padding: "16px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    },
    customerTitle: {
      fontSize: "12px",
      fontWeight: "700",
      color: "#e63946",
      marginBottom: "12px",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
      borderBottom: "2px solid #e63946",
      paddingBottom: "6px",
    },
    customerText: {
      color: "#333333",
      fontSize: "10px",
      lineHeight: "1.4",
    },
    itemsTable: {
      width: "100%",
      borderCollapse: "collapse",
      marginBottom: "20px",
      border: "2px solid #f8f9fa",
      borderRadius: "8px",
      overflow: "hidden",
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    },
    tableHeader: {
      background: "linear-gradient(135deg, #343a40, #495057)",
      color: "#ffffff",
    },
    tableHeaderCell: {
      padding: "12px 8px",
      fontSize: "10px",
      fontWeight: "700",
      textAlign: "left",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    },
    tableRow: {
      borderBottom: "1px solid #f8f9fa",
      background: "#ffffff",
    },
    tableRowAlt: {
      background: "#f8f9fa",
      borderBottom: "1px solid #e9ecef",
    },
    tableCell: {
      padding: "10px 8px",
      fontSize: "10px",
      color: "#333333",
      verticalAlign: "top",
      borderRight: "1px solid #f8f9fa",
    },
    totalsSection: {
      display: "flex",
      justifyContent: "flex-end",
      marginBottom: "20px",
    },
    totalsTable: {
      width: "280px",
      borderCollapse: "collapse",
      border: "2px solid #f8f9fa",
      borderRadius: "8px",
      overflow: "hidden",
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    },
    totalRow: {
      background: "linear-gradient(135deg, #e63946, #dc3545)",
      color: "#ffffff",
      fontWeight: "700",
    },
    totalRowRegular: {
      background: "#f8f9fa",
      color: "#333333",
    },
    totalCell: {
      padding: "10px 12px",
      fontSize: "11px",
      fontWeight: "600",
    },
    footer: {
      marginTop: "20px",
      borderTop: "3px solid #e63946",
      paddingTop: "16px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      background: "#f8f9fa",
      padding: "20px",
      borderRadius: "8px",
      marginLeft: forPrint ? "-10mm" : "-20px",
      marginRight: forPrint ? "-10mm" : "-20px",
      marginBottom: forPrint ? "-10mm" : "-20px",
    },
    footerLeft: {
      flex: "1",
    },
    footerTitle: {
      fontSize: "14px",
      fontWeight: "700",
      color: "#e63946",
      marginBottom: "12px",
    },
    termsText: {
      fontSize: "9px",
      color: "#495057",
      lineHeight: "1.3",
    },
    qrSection: {
      textAlign: "center",
      marginLeft: "20px",
      position: "relative",
    },
    qrCode: {
      width: "100px",
      height: "100px",
      border: "2px solid #e9ecef",
      borderRadius: "8px",
      padding: "4px",
      background: "#ffffff",
      position: "relative",
    },
    qrLogo: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: "24px",
      height: "24px",
      background: "#ffffff",
      borderRadius: "50%",
      padding: "2px",
      border: "2px solid #e63946",
    },
    statusBadge: {
      background:
        status === "Delivered"
          ? "#28a745"
          : status === "Pending"
            ? "#ffc107"
            : status === "Processing"
              ? "#17a2b8"
              : "#6c757d",
      color: "#ffffff",
      padding: "4px 8px",
      borderRadius: "4px",
      fontSize: "9px",
      fontWeight: "600",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    },
    paymentBadge: {
      background: paymentStatus === "Paid" ? "#28a745" : "#dc3545",
      color: "#ffffff",
      padding: "3px 6px",
      borderRadius: "3px",
      fontSize: "8px",
      fontWeight: "600",
      marginLeft: "6px",
    },
  };

  // QR Code Component with Logo
  const QRCodeWithLogo = () => {
    const [qrDataUrl, setQrDataUrl] = React.useState("");

    React.useEffect(() => {
      QRCode.toDataURL(qrCodeValue, {
        width: 100,
        margin: 1,
        color: {
          dark: "#333333",
          light: "#ffffff",
        },
      }).then(setQrDataUrl);
    }, []);

    return (
      <div style={{ position: "relative", display: "inline-block" }}>
        {qrDataUrl && (
          <img src={qrDataUrl} alt="QR Code" style={invoiceStyles.qrCode} />
        )}
        <img
          src="https://cdn.builder.io/api/v1/assets/ec4b3f82f1ac4275b8bfc1756fcac420/medical_logo-e586be?format=webp&width=800"
          alt="Logo"
          style={invoiceStyles.qrLogo}
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
      </div>
    );
  };

  return (
    <div style={invoiceStyles.container}>
      {/* Modern Header Section */}
      <div style={invoiceStyles.header}>
        <div style={invoiceStyles.companyInfo}>
          <img
            src="https://cdn.builder.io/api/v1/assets/ec4b3f82f1ac4275b8bfc1756fcac420/medical_logo-e586be?format=webp&width=800"
            alt="Hare Krishna Medical"
            style={invoiceStyles.companyLogo}
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
          <h1 style={invoiceStyles.companyName}>HARE KRISHNA MEDICAL</h1>
          <p style={invoiceStyles.companyTagline}>
            Your Trusted Health Partner
          </p>
          <div style={invoiceStyles.companyAddress}>
            <div>📍 3 Sahyog Complex, Man Sarovar Circle</div>
            <div>Amroli, 394107, Gujarat, India</div>
            <div>📞 +91 76989 13354 | +91 91060 18508</div>
            <div>✉️ harekrishnamedical@gmail.com</div>
          </div>
        </div>

        <div style={invoiceStyles.invoiceTitle}>
          <h1 style={invoiceStyles.invoiceTitleText}>INVOICE</h1>
          <div style={invoiceStyles.invoiceDetails}>
            <div style={{ marginBottom: "6px" }}>
              <strong>Invoice:</strong> {invoiceId}
            </div>
            <div style={{ marginBottom: "6px" }}>
              <strong>Order:</strong> {orderId}
            </div>
            <div style={{ marginBottom: "6px" }}>
              <strong>Date:</strong> {orderDate}
            </div>
            <div style={{ marginBottom: "6px" }}>
              <strong>Time:</strong> {orderTime}
            </div>
            <div>
              <strong>Status:</strong>
              <span style={invoiceStyles.statusBadge}>{status}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Information */}
      <div style={invoiceStyles.customerSection}>
        <div style={invoiceStyles.customerBox}>
          <div style={invoiceStyles.customerTitle}>Bill To</div>
          <div style={invoiceStyles.customerText}>
            <div
              style={{
                fontWeight: "700",
                marginBottom: "6px",
                fontSize: "12px",
                color: "#e63946",
              }}
            >
              {customerDetails.fullName}
            </div>
            <div style={{ marginBottom: "3px" }}>
              📧 {customerDetails.email}
            </div>
            <div style={{ marginBottom: "3px" }}>
              📱 {customerDetails.mobile}
            </div>
            <div style={{ marginBottom: "3px" }}>
              🏠 {customerDetails.address}
            </div>
            <div>
              📍 {customerDetails.city}, {customerDetails.state}{" "}
              {customerDetails.pincode}
            </div>
          </div>
        </div>

        <div style={invoiceStyles.customerBox}>
          <div style={invoiceStyles.customerTitle}>Payment Details</div>
          <div style={invoiceStyles.customerText}>
            <div style={{ marginBottom: "6px" }}>
              <strong>Payment Method:</strong>
              <br />
              {paymentMethod}
            </div>
            <div style={{ marginBottom: "6px" }}>
              <strong>Payment Status:</strong>
              <span style={invoiceStyles.paymentBadge}>{paymentStatus}</span>
            </div>
            <div style={{ marginBottom: "6px" }}>
              <strong>Shipping Address:</strong>
              <br />
              {customerDetails.address}
              <br />
              {customerDetails.city}, {customerDetails.state}{" "}
              {customerDetails.pincode}
            </div>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <table style={invoiceStyles.itemsTable}>
        <thead style={invoiceStyles.tableHeader}>
          <tr>
            <th
              style={{
                ...invoiceStyles.tableHeaderCell,
                textAlign: "center",
                width: "40px",
              }}
            >
              #
            </th>
            <th style={{ ...invoiceStyles.tableHeaderCell, width: "45%" }}>
              Product Description
            </th>
            <th
              style={{
                ...invoiceStyles.tableHeaderCell,
                textAlign: "center",
                width: "60px",
              }}
            >
              Qty
            </th>
            <th
              style={{
                ...invoiceStyles.tableHeaderCell,
                textAlign: "right",
                width: "80px",
              }}
            >
              Price (₹)
            </th>
            <th
              style={{
                ...invoiceStyles.tableHeaderCell,
                textAlign: "right",
                width: "80px",
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
                  ? invoiceStyles.tableRow
                  : invoiceStyles.tableRowAlt
              }
            >
              <td
                style={{
                  ...invoiceStyles.tableCell,
                  textAlign: "center",
                  fontWeight: "700",
                  color: "#e63946",
                }}
              >
                {index + 1}
              </td>
              <td style={invoiceStyles.tableCell}>
                <div
                  style={{
                    fontWeight: "700",
                    marginBottom: "2px",
                    color: "#333333",
                  }}
                >
                  {item.name}
                </div>
                <div style={{ fontSize: "9px", color: "#495057" }}>
                  by {item.company || "Medical Product"}
                </div>
              </td>
              <td
                style={{
                  ...invoiceStyles.tableCell,
                  textAlign: "center",
                  fontWeight: "600",
                }}
              >
                {item.quantity}
              </td>
              <td
                style={{
                  ...invoiceStyles.tableCell,
                  textAlign: "right",
                  fontWeight: "600",
                }}
              >
                ₹{item.price?.toFixed(2) || "0.00"}
              </td>
              <td
                style={{
                  ...invoiceStyles.tableCell,
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

      {/* Totals Section */}
      <div style={invoiceStyles.totalsSection}>
        <table style={invoiceStyles.totalsTable}>
          <tbody>
            <tr style={invoiceStyles.totalRowRegular}>
              <td style={{ ...invoiceStyles.totalCell, fontWeight: "600" }}>
                Subtotal:
              </td>
              <td
                style={{
                  ...invoiceStyles.totalCell,
                  textAlign: "right",
                  fontWeight: "700",
                }}
              >
                ₹{calculatedSubtotal.toFixed(2)}
              </td>
            </tr>
            <tr style={invoiceStyles.totalRowRegular}>
              <td style={{ ...invoiceStyles.totalCell, fontWeight: "600" }}>
                Shipping:
              </td>
              <td
                style={{
                  ...invoiceStyles.totalCell,
                  textAlign: "right",
                  fontWeight: "700",
                }}
              >
                {shipping === 0 ? "FREE" : `₹${shipping.toFixed(2)}`}
              </td>
            </tr>
            <tr style={invoiceStyles.totalRowRegular}>
              <td style={{ ...invoiceStyles.totalCell, fontWeight: "600" }}>
                Tax (5%):
              </td>
              <td
                style={{
                  ...invoiceStyles.totalCell,
                  textAlign: "right",
                  fontWeight: "700",
                }}
              >
                ₹{calculatedTax.toFixed(2)}
              </td>
            </tr>
            <tr style={invoiceStyles.totalRow}>
              <td
                style={{
                  ...invoiceStyles.totalCell,
                  fontSize: "12px",
                  fontWeight: "800",
                }}
              >
                GRAND TOTAL:
              </td>
              <td
                style={{
                  ...invoiceStyles.totalCell,
                  textAlign: "right",
                  fontSize: "14px",
                  fontWeight: "800",
                }}
              >
                ₹{calculatedTotal.toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Modern Footer */}
      <div style={invoiceStyles.footer}>
        <div style={invoiceStyles.footerLeft}>
          <div style={invoiceStyles.footerTitle}>
            Thank You for Your Business! 🙏
          </div>
          <div style={invoiceStyles.termsText}>
            <div style={{ marginBottom: "6px" }}>
              <strong>Terms & Conditions:</strong>
            </div>
            <div style={{ marginBottom: "3px" }}>
              • Payment due within 30 days
            </div>
            <div style={{ marginBottom: "3px" }}>
              • Goods once sold will not be taken back
            </div>
            <div style={{ marginBottom: "3px" }}>
              • Subject to Gujarat jurisdiction only
            </div>
            <div style={{ marginTop: "8px", fontSize: "10px" }}>
              <strong>Contact Us:</strong>
              <br />
              📧 harekrishnamedical@gmail.com
              <br />
              📞 +91 76989 13354 | +91 91060 18508
            </div>
          </div>
        </div>

        <div style={invoiceStyles.qrSection}>
          <QRCodeWithLogo />
          <div
            style={{
              fontSize: "8px",
              marginTop: "6px",
              color: "#495057",
              fontWeight: "600",
            }}
          >
            📱 Scan for Verification
          </div>
        </div>
      </div>

      {/* Reduced Bottom Note */}
      <div
        style={{
          position: "absolute",
          bottom: forPrint ? "5mm" : "10px",
          left: forPrint ? "10mm" : "20px",
          right: forPrint ? "10mm" : "20px",
          textAlign: "center",
          fontSize: "7px",
          color: "#495057",
          borderTop: "1px solid #e9ecef",
          paddingTop: "4px",
          background: "#ffffff",
        }}
      >
        🏥 Computer generated invoice • Generated on:{" "}
        {new Date().toLocaleString()} • Powered by Hare Krishna Medical System
      </div>
    </div>
  );
};

export default ProfessionalInvoice;
