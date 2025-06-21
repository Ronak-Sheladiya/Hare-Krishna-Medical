import React from "react";

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

  const invoiceStyles = {
    // A4 dimensions: 210mm x 297mm
    container: {
      width: forPrint ? "210mm" : "100%",
      maxWidth: "210mm",
      height: forPrint ? "297mm" : "auto",
      margin: "0 auto",
      padding: "20mm",
      fontFamily: "'Segoe UI', Arial, sans-serif",
      fontSize: "11px",
      lineHeight: "1.4",
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
      padding: "24px",
      marginBottom: "32px",
      borderRadius: "8px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    companyInfo: {
      flex: "1",
    },
    companyLogo: {
      width: "70px",
      height: "70px",
      marginBottom: "16px",
      borderRadius: "8px",
      background: "#ffffff",
      padding: "8px",
    },
    companyName: {
      fontSize: "28px",
      fontWeight: "800",
      color: "#ffffff",
      margin: "0 0 8px 0",
      lineHeight: "1.2",
      textShadow: "0 2px 4px rgba(0,0,0,0.2)",
    },
    companyTagline: {
      fontSize: "14px",
      color: "#ffffff",
      marginBottom: "16px",
      opacity: "0.9",
    },
    companyAddress: {
      fontSize: "12px",
      color: "#ffffff",
      lineHeight: "1.4",
      opacity: "0.9",
    },
    invoiceTitle: {
      textAlign: "right",
      flex: "0 0 auto",
    },
    invoiceTitleText: {
      fontSize: "36px",
      fontWeight: "900",
      color: "#ffffff",
      margin: "0 0 16px 0",
      textShadow: "0 2px 4px rgba(0,0,0,0.2)",
    },
    invoiceDetails: {
      background: "rgba(255,255,255,0.15)",
      backdropFilter: "blur(10px)",
      border: "1px solid rgba(255,255,255,0.2)",
      padding: "16px",
      borderRadius: "8px",
      fontSize: "12px",
      color: "#ffffff",
    },
    customerSection: {
      display: "flex",
      gap: "24px",
      marginBottom: "32px",
    },
    customerBox: {
      flex: "1",
      background: "#f8f9fa",
      border: "2px solid #ffffff",
      borderRadius: "12px",
      padding: "24px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    },
    customerTitle: {
      fontSize: "14px",
      fontWeight: "700",
      color: "#e63946",
      marginBottom: "16px",
      textTransform: "uppercase",
      letterSpacing: "1px",
      borderBottom: "2px solid #e63946",
      paddingBottom: "8px",
    },
    customerText: {
      color: "#333333",
      fontSize: "12px",
      lineHeight: "1.5",
    },
    itemsTable: {
      width: "100%",
      borderCollapse: "collapse",
      marginBottom: "32px",
      border: "2px solid #f8f9fa",
      borderRadius: "12px",
      overflow: "hidden",
      boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    },
    tableHeader: {
      background: "linear-gradient(135deg, #343a40, #495057)",
      color: "#ffffff",
    },
    tableHeaderCell: {
      padding: "16px 12px",
      fontSize: "12px",
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
      padding: "16px 12px",
      fontSize: "11px",
      color: "#333333",
      verticalAlign: "top",
      borderRight: "1px solid #f8f9fa",
    },
    totalsSection: {
      display: "flex",
      justifyContent: "flex-end",
      marginBottom: "40px",
    },
    totalsTable: {
      width: "320px",
      borderCollapse: "collapse",
      border: "2px solid #f8f9fa",
      borderRadius: "12px",
      overflow: "hidden",
      boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
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
      padding: "12px 16px",
      fontSize: "12px",
      fontWeight: "600",
    },
    footer: {
      marginTop: "40px",
      borderTop: "3px solid #e63946",
      paddingTop: "24px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      background: "#f8f9fa",
      padding: "24px",
      borderRadius: "12px",
      marginLeft: "-20mm",
      marginRight: "-20mm",
      marginBottom: "-20mm",
    },
    footerLeft: {
      flex: "1",
    },
    footerTitle: {
      fontSize: "16px",
      fontWeight: "700",
      color: "#e63946",
      marginBottom: "16px",
    },
    termsText: {
      fontSize: "10px",
      color: "#495057",
      lineHeight: "1.4",
    },
    qrSection: {
      textAlign: "center",
      marginLeft: "32px",
    },
    qrCode: {
      width: "80px",
      height: "80px",
      border: "2px solid #e9ecef",
      borderRadius: "12px",
      padding: "8px",
      background: "#ffffff",
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
      padding: "6px 12px",
      borderRadius: "6px",
      fontSize: "10px",
      fontWeight: "600",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    },
    paymentBadge: {
      background: paymentStatus === "Paid" ? "#28a745" : "#dc3545",
      color: "#ffffff",
      padding: "4px 8px",
      borderRadius: "4px",
      fontSize: "10px",
      fontWeight: "600",
      marginLeft: "8px",
    },
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
            <div style={{ marginBottom: "8px" }}>
              <strong>Invoice:</strong> {invoiceId}
            </div>
            <div style={{ marginBottom: "8px" }}>
              <strong>Order:</strong> {orderId}
            </div>
            <div style={{ marginBottom: "8px" }}>
              <strong>Date:</strong> {orderDate}
            </div>
            <div style={{ marginBottom: "8px" }}>
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
                marginBottom: "8px",
                fontSize: "14px",
                color: "#e63946",
              }}
            >
              {customerDetails.fullName}
            </div>
            <div style={{ marginBottom: "4px" }}>
              📧 {customerDetails.email}
            </div>
            <div style={{ marginBottom: "4px" }}>
              📱 {customerDetails.mobile}
            </div>
            <div style={{ marginBottom: "4px" }}>
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
            <div style={{ marginBottom: "8px" }}>
              <strong>Payment Method:</strong>
              <br />
              {paymentMethod}
            </div>
            <div style={{ marginBottom: "8px" }}>
              <strong>Payment Status:</strong>
              <span style={invoiceStyles.paymentBadge}>{paymentStatus}</span>
            </div>
            <div style={{ marginBottom: "8px" }}>
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
              #
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
              Qty
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
                    marginBottom: "4px",
                    color: "#333333",
                  }}
                >
                  {item.name}
                </div>
                <div style={{ fontSize: "10px", color: "#495057" }}>
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
                  fontSize: "14px",
                  fontWeight: "800",
                }}
              >
                GRAND TOTAL:
              </td>
              <td
                style={{
                  ...invoiceStyles.totalCell,
                  textAlign: "right",
                  fontSize: "16px",
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
            <div style={{ marginBottom: "8px" }}>
              <strong>Terms & Conditions:</strong>
            </div>
            <div style={{ marginBottom: "4px" }}>
              • Payment due within 30 days
            </div>
            <div style={{ marginBottom: "4px" }}>
              • Goods once sold will not be taken back
            </div>
            <div style={{ marginBottom: "4px" }}>
              • Subject to Gujarat jurisdiction only
            </div>
            <div style={{ marginTop: "12px", fontSize: "11px" }}>
              <strong>Contact Us:</strong>
              <br />
              📧 harekrishnamedical@gmail.com
              <br />
              📞 +91 76989 13354 | +91 91060 18508
            </div>
          </div>
        </div>

        {qrCode && (
          <div style={invoiceStyles.qrSection}>
            <img src={qrCode} alt="QR Code" style={invoiceStyles.qrCode} />
            <div
              style={{
                fontSize: "9px",
                marginTop: "8px",
                color: "#495057",
                fontWeight: "600",
              }}
            >
              📱 Scan for Online Verification
            </div>
          </div>
        )}
      </div>

      {/* Bottom Note */}
      <div
        style={{
          position: "absolute",
          bottom: "10mm",
          left: "20mm",
          right: "20mm",
          textAlign: "center",
          fontSize: "8px",
          color: "#495057",
          borderTop: "1px solid #e9ecef",
          paddingTop: "8px",
          background: "#ffffff",
        }}
      >
        🏥 This is a computer generated invoice. No physical signature required.
        | Generated on: {new Date().toLocaleString()} | Powered by Hare Krishna
        Medical System
      </div>
    </div>
  );
};

export default ProfessionalInvoice;
