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

  // Generate QR code with invoice URL
  const qrCodeValue =
    qrCode || `https://harekrishan.medical/invoice/${invoiceId}`;

  const invoiceStyles = {
    // A4 dimensions: 210mm x 297mm
    container: {
      width: "210mm",
      minHeight: "297mm",
      maxWidth: "210mm",
      margin: "0 auto",
      padding: "15mm",
      fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
      fontSize: "11px",
      lineHeight: "1.5",
      color: "#2d3748",
      backgroundColor: "#ffffff",
      boxSizing: "border-box",
      position: "relative",
      border: forPrint ? "none" : "2px solid #e2e8f0",
      borderRadius: forPrint ? "0" : "12px",
      boxShadow: forPrint ? "none" : "0 20px 40px rgba(0,0,0,0.1)",
      pageBreakAfter: "always",
    },
    header: {
      background:
        "linear-gradient(135deg, #1a365d 0%, #2d3748 50%, #e63946 100%)",
      color: "#ffffff",
      padding: "25mm 20mm",
      margin: "-15mm -15mm 20mm -15mm",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      borderRadius: forPrint ? "0" : "12px 12px 0 0",
      position: "relative",
      overflow: "hidden",
    },
    companyInfo: {
      flex: "1",
    },
    companyLogo: {
      width: "80px",
      height: "80px",
      marginBottom: "15mm",
      borderRadius: "8px",
      background: "#ffffff",
      padding: "8px",
    },
    companyName: {
      fontSize: "28px",
      fontWeight: "900",
      color: "#ffffff",
      margin: "0 0 8mm 0",
      lineHeight: "1.1",
      textShadow: "0 2px 4px rgba(0,0,0,0.3)",
    },
    companyTagline: {
      fontSize: "16px",
      color: "#ffffff",
      marginBottom: "15mm",
      opacity: "0.95",
      fontWeight: "500",
    },
    companyAddress: {
      fontSize: "14px",
      color: "#ffffff",
      lineHeight: "1.5",
      opacity: "0.9",
    },
    invoiceTitle: {
      textAlign: "right",
      flex: "0 0 auto",
    },
    invoiceTitleText: {
      fontSize: "42px",
      fontWeight: "900",
      color: "#ffffff",
      margin: "0 0 15mm 0",
      textShadow: "0 3px 6px rgba(0,0,0,0.3)",
      letterSpacing: "2px",
    },
    invoiceDetails: {
      background: "rgba(255,255,255,0.15)",
      backdropFilter: "blur(15px)",
      border: "1px solid rgba(255,255,255,0.2)",
      padding: "15mm",
      borderRadius: "12px",
      fontSize: "13px",
      color: "#ffffff",
      minWidth: "220px",
      boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
    },
    customerSection: {
      display: "flex",
      gap: "25mm",
      marginBottom: "25mm",
    },
    customerBox: {
      flex: "1",
      background: "linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)",
      border: "1px solid #e2e8f0",
      borderRadius: "16px",
      padding: "20mm",
      boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
      position: "relative",
    },
    customerTitle: {
      fontSize: "16px",
      fontWeight: "800",
      color: "#e63946",
      marginBottom: "15mm",
      textTransform: "uppercase",
      letterSpacing: "1px",
      borderBottom: "3px solid #e63946",
      paddingBottom: "8mm",
    },
    customerText: {
      color: "#333333",
      fontSize: "14px",
      lineHeight: "1.6",
    },
    itemsTable: {
      width: "100%",
      borderCollapse: "collapse",
      marginBottom: "25mm",
      border: "1px solid #e2e8f0",
      borderRadius: "16px",
      overflow: "hidden",
      boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
      background: "#ffffff",
    },
    tableHeader: {
      background: "linear-gradient(135deg, #343a40, #495057)",
      color: "#ffffff",
    },
    tableHeaderCell: {
      padding: "15mm 12mm",
      fontSize: "14px",
      fontWeight: "800",
      textAlign: "left",
      textTransform: "uppercase",
      letterSpacing: "1px",
    },
    tableRow: {
      borderBottom: "2px solid #f8f9fa",
      background: "#ffffff",
    },
    tableRowAlt: {
      background: "#f8f9fa",
      borderBottom: "2px solid #e9ecef",
    },
    tableCell: {
      padding: "12mm 12mm",
      fontSize: "13px",
      color: "#333333",
      verticalAlign: "top",
      borderRight: "2px solid #f8f9fa",
    },
    totalsSection: {
      display: "flex",
      justifyContent: "flex-end",
      marginBottom: "25mm",
    },
    totalsTable: {
      width: "350px",
      borderCollapse: "collapse",
      border: "3px solid #f8f9fa",
      borderRadius: "12px",
      overflow: "hidden",
      boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
    },
    totalRow: {
      background: "linear-gradient(135deg, #e63946, #dc3545)",
      color: "#ffffff",
      fontWeight: "800",
    },
    totalRowRegular: {
      background: "#f8f9fa",
      color: "#333333",
    },
    totalCell: {
      padding: "12mm 15mm",
      fontSize: "14px",
      fontWeight: "700",
    },
    footer: {
      marginTop: "25mm",
      borderTop: "4px solid #e63946",
      paddingTop: "20mm",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      background: "#f8f9fa",
      padding: "25mm",
      borderRadius: "12px",
      margin: "25mm -20mm -20mm -20mm",
    },
    footerLeft: {
      flex: "1",
    },
    footerTitle: {
      fontSize: "18px",
      fontWeight: "800",
      color: "#e63946",
      marginBottom: "15mm",
    },
    termsText: {
      fontSize: "12px",
      color: "#495057",
      lineHeight: "1.5",
    },
    qrSection: {
      textAlign: "center",
      marginLeft: "25mm",
      position: "relative",
    },
    qrContainer: {
      position: "relative",
      display: "inline-block",
    },
    qrCode: {
      width: "120px",
      height: "120px",
      border: "3px solid #e9ecef",
      borderRadius: "12px",
      padding: "8px",
      background: "#ffffff",
    },
    qrLogo: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: "30px",
      height: "30px",
      background: "#ffffff",
      borderRadius: "50%",
      padding: "4px",
      border: "2px solid #e63946",
      zIndex: 10,
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
      padding: "6mm 10mm",
      borderRadius: "6px",
      fontSize: "12px",
      fontWeight: "700",
      textTransform: "uppercase",
      letterSpacing: "1px",
    },
    paymentBadge: {
      background: paymentStatus === "Paid" ? "#28a745" : "#dc3545",
      color: "#ffffff",
      padding: "4mm 8mm",
      borderRadius: "4px",
      fontSize: "11px",
      fontWeight: "700",
      marginLeft: "8mm",
    },
    taxNote: {
      background: "#fff3cd",
      border: "2px solid #ffeaa7",
      borderRadius: "8px",
      padding: "15mm",
      marginBottom: "20mm",
      color: "#856404",
    },
  };

  // QR Code Component with Logo
  const QRCodeWithLogo = () => {
    const [qrDataUrl, setQrDataUrl] = React.useState("");

    React.useEffect(() => {
      QRCode.toDataURL(qrCodeValue, {
        width: 120,
        margin: 1,
        color: {
          dark: "#333333",
          light: "#ffffff",
        },
        errorCorrectionLevel: "M",
      }).then(setQrDataUrl);
    }, []);

    return (
      <div style={invoiceStyles.qrContainer}>
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
            <div style={{ marginBottom: "8mm" }}>
              <strong>Invoice No:</strong> {invoiceId}
            </div>
            <div style={{ marginBottom: "8mm" }}>
              <strong>Order No:</strong> {orderId}
            </div>
            <div style={{ marginBottom: "8mm" }}>
              <strong>Date:</strong> {orderDate}
            </div>
            <div style={{ marginBottom: "8mm" }}>
              <strong>Time:</strong> {orderTime}
            </div>
            <div>
              <strong>Status:</strong>
              <br />
              <span style={invoiceStyles.statusBadge}>{status}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tax Included Notice */}
      <div style={invoiceStyles.taxNote}>
        <div
          style={{ textAlign: "center", fontWeight: "700", fontSize: "14px" }}
        >
          ⚠️ IMPORTANT: All taxes and duties are included in the product prices.
          No additional tax will be charged.
        </div>
      </div>

      {/* Customer Information */}
      <div style={invoiceStyles.customerSection}>
        <div style={invoiceStyles.customerBox}>
          <div style={invoiceStyles.customerTitle}>Bill To</div>
          <div style={invoiceStyles.customerText}>
            <div
              style={{
                fontWeight: "800",
                marginBottom: "8mm",
                fontSize: "16px",
                color: "#e63946",
              }}
            >
              {customerDetails.fullName}
            </div>
            <div style={{ marginBottom: "4mm" }}>
              📧 {customerDetails.email}
            </div>
            <div style={{ marginBottom: "4mm" }}>
              📱 {customerDetails.mobile}
            </div>
            <div style={{ marginBottom: "4mm" }}>
              🏠 {customerDetails.address}
            </div>
            <div>
              📍 {customerDetails.city}, {customerDetails.state}{" "}
              {customerDetails.pincode}
            </div>
          </div>
        </div>

        <div style={invoiceStyles.customerBox}>
          <div style={invoiceStyles.customerTitle}>Payment & Shipping</div>
          <div style={invoiceStyles.customerText}>
            <div style={{ marginBottom: "8mm" }}>
              <strong>Payment Method:</strong>
              <br />
              {paymentMethod}
            </div>
            <div style={{ marginBottom: "8mm" }}>
              <strong>Payment Status:</strong>
              <span style={invoiceStyles.paymentBadge}>{paymentStatus}</span>
            </div>
            <div>
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
                width: "50px",
              }}
            >
              Sr.
            </th>
            <th style={{ ...invoiceStyles.tableHeaderCell, width: "45%" }}>
              Product Description
            </th>
            <th
              style={{
                ...invoiceStyles.tableHeaderCell,
                textAlign: "center",
                width: "80px",
              }}
            >
              Quantity
            </th>
            <th
              style={{
                ...invoiceStyles.tableHeaderCell,
                textAlign: "right",
                width: "100px",
              }}
            >
              Unit Price (₹)
            </th>
            <th
              style={{
                ...invoiceStyles.tableHeaderCell,
                textAlign: "right",
                width: "100px",
              }}
            >
              Total Amount (₹)
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
                  fontWeight: "800",
                  color: "#e63946",
                  fontSize: "14px",
                }}
              >
                {index + 1}
              </td>
              <td style={invoiceStyles.tableCell}>
                <div
                  style={{
                    fontWeight: "800",
                    marginBottom: "4mm",
                    color: "#333333",
                    fontSize: "14px",
                  }}
                >
                  {item.name}
                </div>
                <div style={{ fontSize: "11px", color: "#495057" }}>
                  Manufactured by: {item.company || "Medical Product"}
                </div>
              </td>
              <td
                style={{
                  ...invoiceStyles.tableCell,
                  textAlign: "center",
                  fontWeight: "700",
                  fontSize: "14px",
                }}
              >
                {item.quantity}
              </td>
              <td
                style={{
                  ...invoiceStyles.tableCell,
                  textAlign: "right",
                  fontWeight: "700",
                  fontSize: "14px",
                }}
              >
                ₹{item.price?.toFixed(2) || "0.00"}
              </td>
              <td
                style={{
                  ...invoiceStyles.tableCell,
                  textAlign: "right",
                  fontWeight: "800",
                  color: "#e63946",
                  fontSize: "14px",
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
              <td style={{ ...invoiceStyles.totalCell, fontWeight: "700" }}>
                Subtotal:
              </td>
              <td
                style={{
                  ...invoiceStyles.totalCell,
                  textAlign: "right",
                  fontWeight: "800",
                }}
              >
                ₹{calculatedSubtotal.toFixed(2)}
              </td>
            </tr>
            <tr style={invoiceStyles.totalRowRegular}>
              <td style={{ ...invoiceStyles.totalCell, fontWeight: "700" }}>
                Shipping Charges:
              </td>
              <td
                style={{
                  ...invoiceStyles.totalCell,
                  textAlign: "right",
                  fontWeight: "800",
                }}
              >
                {shipping === 0 ? "FREE" : `₹${shipping.toFixed(2)}`}
              </td>
            </tr>
            <tr style={invoiceStyles.totalRowRegular}>
              <td style={{ ...invoiceStyles.totalCell, fontWeight: "700" }}>
                All Taxes & Duties:
              </td>
              <td
                style={{
                  ...invoiceStyles.totalCell,
                  textAlign: "right",
                  fontWeight: "800",
                  color: "#28a745",
                }}
              >
                INCLUDED
              </td>
            </tr>
            <tr style={invoiceStyles.totalRow}>
              <td
                style={{
                  ...invoiceStyles.totalCell,
                  fontSize: "16px",
                  fontWeight: "900",
                }}
              >
                GRAND TOTAL:
              </td>
              <td
                style={{
                  ...invoiceStyles.totalCell,
                  textAlign: "right",
                  fontSize: "18px",
                  fontWeight: "900",
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
            <div style={{ marginBottom: "8mm", fontWeight: "700" }}>
              <strong>Terms & Conditions:</strong>
            </div>
            <div style={{ marginBottom: "4mm" }}>
              • Payment due within 30 days of invoice date
            </div>
            <div style={{ marginBottom: "4mm" }}>
              • Goods once sold will not be taken back or exchanged
            </div>
            <div style={{ marginBottom: "4mm" }}>
              • All disputes subject to Gujarat jurisdiction only
            </div>
            <div style={{ marginBottom: "4mm" }}>
              • All prices include applicable taxes and duties
            </div>
            <div
              style={{ marginTop: "10mm", fontSize: "13px", fontWeight: "700" }}
            >
              <strong>Contact Information:</strong>
              <br />
              📧 Email: harekrishnamedical@gmail.com
              <br />
              📞 Phone: +91 76989 13354 | +91 91060 18508
              <br />
              🌐 Website: www.harekrishnamedical.com
            </div>
          </div>
        </div>

        <div style={invoiceStyles.qrSection}>
          <QRCodeWithLogo />
          <div
            style={{
              fontSize: "11px",
              marginTop: "8mm",
              color: "#495057",
              fontWeight: "700",
              lineHeight: "1.4",
            }}
          >
            📱 Scan QR Code for
            <br />
            Online Verification
            <br />& Order Tracking
          </div>
        </div>
      </div>

      {/* Footer Note for Print */}
      <div
        style={{
          position: "absolute",
          bottom: "10mm",
          left: "20mm",
          right: "20mm",
          textAlign: "center",
          fontSize: "10px",
          color: "#495057",
          borderTop: "1px solid #e9ecef",
          paddingTop: "5mm",
          background: "#ffffff",
        }}
      >
        🏥 This is a computer-generated invoice. No physical signature required.
        | Generated on: {new Date().toLocaleString()} | Powered by Hare Krishna
        Medical System
      </div>
    </div>
  );
};

export default ProfessionalInvoice;
