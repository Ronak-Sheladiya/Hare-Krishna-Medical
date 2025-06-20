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
      padding: "15mm",
      fontFamily: "'Segoe UI', Arial, sans-serif",
      fontSize: "11px",
      lineHeight: "1.4",
      color: "#333",
      backgroundColor: "#fff",
      boxSizing: "border-box",
      position: "relative",
    },
    header: {
      borderBottom: "3px solid #2c5aa0",
      paddingBottom: "15px",
      marginBottom: "20px",
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
      marginBottom: "10px",
      borderRadius: "5px",
    },
    companyName: {
      fontSize: "22px",
      fontWeight: "bold",
      color: "#2c5aa0",
      margin: "0 0 5px 0",
      lineHeight: "1.2",
    },
    companyTagline: {
      fontSize: "12px",
      color: "#666",
      marginBottom: "10px",
    },
    companyAddress: {
      fontSize: "10px",
      color: "#666",
      lineHeight: "1.3",
    },
    invoiceTitle: {
      textAlign: "right",
      flex: "0 0 auto",
    },
    invoiceTitleText: {
      fontSize: "32px",
      fontWeight: "bold",
      color: "#2c5aa0",
      margin: "0 0 15px 0",
    },
    invoiceDetails: {
      backgroundColor: "#f8f9fa",
      border: "1px solid #dee2e6",
      padding: "12px",
      borderRadius: "5px",
      fontSize: "10px",
    },
    customerSection: {
      display: "flex",
      gap: "20px",
      marginBottom: "25px",
    },
    customerBox: {
      flex: "1",
      border: "1px solid #dee2e6",
      borderRadius: "5px",
      padding: "15px",
      backgroundColor: "#f8f9fa",
    },
    customerTitle: {
      fontSize: "12px",
      fontWeight: "bold",
      color: "#2c5aa0",
      marginBottom: "10px",
      borderBottom: "1px solid #dee2e6",
      paddingBottom: "5px",
    },
    itemsTable: {
      width: "100%",
      borderCollapse: "collapse",
      marginBottom: "20px",
      border: "1px solid #dee2e6",
    },
    tableHeader: {
      backgroundColor: "#2c5aa0",
      color: "white",
    },
    tableHeaderCell: {
      padding: "10px 8px",
      fontSize: "11px",
      fontWeight: "bold",
      border: "1px solid #fff",
      textAlign: "left",
    },
    tableRow: {
      borderBottom: "1px solid #dee2e6",
    },
    tableRowAlt: {
      backgroundColor: "#f8f9fa",
      borderBottom: "1px solid #dee2e6",
    },
    tableCell: {
      padding: "8px",
      fontSize: "10px",
      border: "1px solid #dee2e6",
      verticalAlign: "top",
    },
    totalsSection: {
      display: "flex",
      justifyContent: "flex-end",
      marginBottom: "25px",
    },
    totalsTable: {
      width: "250px",
      borderCollapse: "collapse",
      border: "1px solid #dee2e6",
    },
    totalRow: {
      backgroundColor: "#2c5aa0",
      color: "white",
      fontWeight: "bold",
    },
    footer: {
      marginTop: "30px",
      borderTop: "2px solid #2c5aa0",
      paddingTop: "15px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-end",
    },
    footerLeft: {
      flex: "1",
    },
    footerTitle: {
      fontSize: "14px",
      fontWeight: "bold",
      color: "#2c5aa0",
      marginBottom: "10px",
    },
    termsText: {
      fontSize: "9px",
      color: "#666",
      lineHeight: "1.3",
    },
    qrSection: {
      textAlign: "center",
      marginLeft: "20px",
    },
    qrCode: {
      width: "70px",
      height: "70px",
      border: "1px solid #dee2e6",
      borderRadius: "5px",
    },
    footerNote: {
      position: "absolute",
      bottom: "10mm",
      left: "15mm",
      right: "15mm",
      textAlign: "center",
      fontSize: "8px",
      color: "#999",
      borderTop: "1px solid #eee",
      paddingTop: "5px",
    },
  };

  return (
    <div style={invoiceStyles.container}>
      {/* Header Section */}
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
            <div>3 Sahyog Complex, Man Sarovar Circle</div>
            <div>Amroli, 394107, Gujarat, India</div>
            <div>Phone: +91 76989 13354 | +91 91060 18508</div>
            <div>Email: harekrishnamedical@gmail.com</div>
          </div>
        </div>

        <div style={invoiceStyles.invoiceTitle}>
          <h1 style={invoiceStyles.invoiceTitleText}>INVOICE</h1>
          <div style={invoiceStyles.invoiceDetails}>
            <div>
              <strong>Invoice No:</strong> {invoiceId}
            </div>
            <div>
              <strong>Order No:</strong> {orderId}
            </div>
            <div>
              <strong>Date:</strong> {orderDate}
            </div>
            <div>
              <strong>Time:</strong> {orderTime}
            </div>
            <div>
              <strong>Status:</strong> {status}
            </div>
          </div>
        </div>
      </div>

      {/* Customer Information */}
      <div style={invoiceStyles.customerSection}>
        <div style={invoiceStyles.customerBox}>
          <div style={invoiceStyles.customerTitle}>BILL TO</div>
          <div>
            <div style={{ fontWeight: "bold", marginBottom: "5px" }}>
              {customerDetails.fullName}
            </div>
            <div>{customerDetails.email}</div>
            <div>{customerDetails.mobile}</div>
            <div>{customerDetails.address}</div>
            <div>
              {customerDetails.city}, {customerDetails.state}{" "}
              {customerDetails.pincode}
            </div>
          </div>
        </div>

        <div style={invoiceStyles.customerBox}>
          <div style={invoiceStyles.customerTitle}>SHIP TO</div>
          <div>
            <div style={{ fontWeight: "bold", marginBottom: "5px" }}>
              {customerDetails.fullName}
            </div>
            <div>{customerDetails.address}</div>
            <div>
              {customerDetails.city}, {customerDetails.state}{" "}
              {customerDetails.pincode}
            </div>
            <div style={{ marginTop: "10px" }}>
              <strong>Payment Method:</strong> {paymentMethod}
            </div>
            <div>
              <strong>Payment Status:</strong> {paymentStatus}
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
              S.No
            </th>
            <th style={{ ...invoiceStyles.tableHeaderCell, width: "45%" }}>
              Description
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
              Amount (₹)
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
                  fontWeight: "bold",
                }}
              >
                {index + 1}
              </td>
              <td style={invoiceStyles.tableCell}>
                <div style={{ fontWeight: "bold", marginBottom: "2px" }}>
                  {item.name}
                </div>
                <div style={{ fontSize: "9px", color: "#666" }}>
                  {item.company || "Medical Product"}
                </div>
              </td>
              <td style={{ ...invoiceStyles.tableCell, textAlign: "center" }}>
                {item.quantity}
              </td>
              <td style={{ ...invoiceStyles.tableCell, textAlign: "right" }}>
                {item.price?.toFixed(2) || "0.00"}
              </td>
              <td
                style={{
                  ...invoiceStyles.tableCell,
                  textAlign: "right",
                  fontWeight: "bold",
                }}
              >
                {((item.price || 0) * (item.quantity || 0)).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals Section */}
      <div style={invoiceStyles.totalsSection}>
        <table style={invoiceStyles.totalsTable}>
          <tbody>
            <tr>
              <td
                style={{
                  ...invoiceStyles.tableCell,
                  fontWeight: "bold",
                  backgroundColor: "#f8f9fa",
                }}
              >
                Subtotal:
              </td>
              <td style={{ ...invoiceStyles.tableCell, textAlign: "right" }}>
                ₹{calculatedSubtotal.toFixed(2)}
              </td>
            </tr>
            <tr>
              <td
                style={{
                  ...invoiceStyles.tableCell,
                  fontWeight: "bold",
                  backgroundColor: "#f8f9fa",
                }}
              >
                Shipping:
              </td>
              <td style={{ ...invoiceStyles.tableCell, textAlign: "right" }}>
                {shipping === 0 ? "FREE" : `₹${shipping.toFixed(2)}`}
              </td>
            </tr>
            <tr>
              <td
                style={{
                  ...invoiceStyles.tableCell,
                  fontWeight: "bold",
                  backgroundColor: "#f8f9fa",
                }}
              >
                Tax (5%):
              </td>
              <td style={{ ...invoiceStyles.tableCell, textAlign: "right" }}>
                ₹{calculatedTax.toFixed(2)}
              </td>
            </tr>
            <tr style={invoiceStyles.totalRow}>
              <td style={{ ...invoiceStyles.tableCell, fontSize: "12px" }}>
                TOTAL:
              </td>
              <td
                style={{
                  ...invoiceStyles.tableCell,
                  textAlign: "right",
                  fontSize: "12px",
                }}
              >
                ₹{calculatedTotal.toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div style={invoiceStyles.footer}>
        <div style={invoiceStyles.footerLeft}>
          <div style={invoiceStyles.footerTitle}>
            Thank You for Your Business!
          </div>
          <div style={invoiceStyles.termsText}>
            <div>
              <strong>Terms & Conditions:</strong>
            </div>
            <div>• Payment due within 30 days</div>
            <div>• Goods once sold will not be taken back</div>
            <div>• Subject to Gujarat jurisdiction only</div>
            <div style={{ marginTop: "8px" }}>
              <strong>Contact:</strong> harekrishnamedical@gmail.com | +91 76989
              13354
            </div>
          </div>
        </div>

        {qrCode && (
          <div style={invoiceStyles.qrSection}>
            <img src={qrCode} alt="QR Code" style={invoiceStyles.qrCode} />
            <div style={{ fontSize: "8px", marginTop: "5px", color: "#666" }}>
              Scan for Online Verification
            </div>
          </div>
        )}
      </div>

      {/* Footer Note */}
      <div style={invoiceStyles.footerNote}>
        This is a computer generated invoice. No physical signature required. |
        Generated on: {new Date().toLocaleString()}
      </div>
    </div>
  );
};

export default ProfessionalInvoice;
