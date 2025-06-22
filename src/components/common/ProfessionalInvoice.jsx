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

  const professionalStyles = {
    // Print-optimized container
    container: {
      width: "210mm",
      minHeight: "297mm",
      maxWidth: "100%",
      margin: "0 auto",
      padding: "0",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      fontSize: "11px",
      lineHeight: "1.4",
      color: "#000000",
      backgroundColor: "#ffffff",
      boxSizing: "border-box",
      position: "relative",
      border: forPrint ? "none" : "1px solid #ddd",
      pageBreakAfter: "always",
    },

    // Header section with company branding
    header: {
      background: "#ffffff",
      padding: "25px 30px",
      borderBottom: "3px solid #e63946",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },

    // Company info section
    companyInfo: {
      flex: "2",
    },

    companyLogo: {
      width: "80px",
      height: "80px",
      marginBottom: "15px",
    },

    companyName: {
      fontSize: "24px",
      fontWeight: "bold",
      color: "#e63946",
      margin: "0 0 8px 0",
      letterSpacing: "-0.5px",
    },

    companyTagline: {
      fontSize: "12px",
      color: "#666666",
      marginBottom: "15px",
      fontStyle: "italic",
    },

    companyAddress: {
      fontSize: "10px",
      color: "#333333",
      lineHeight: "1.5",
    },

    // Invoice details section
    invoiceSection: {
      flex: "1",
      textAlign: "right",
      paddingLeft: "30px",
    },

    invoiceTitle: {
      fontSize: "28px",
      fontWeight: "bold",
      color: "#333333",
      margin: "0 0 15px 0",
      letterSpacing: "1px",
    },

    invoiceDetails: {
      background: "#f8f9fa",
      padding: "15px",
      borderRadius: "8px",
      border: "1px solid #e0e0e0",
    },

    invoiceDetailRow: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "5px",
      fontSize: "10px",
    },

    invoiceLabel: {
      fontWeight: "bold",
      color: "#666666",
    },

    invoiceValue: {
      color: "#333333",
      fontWeight: "normal",
    },

    // Status badge
    statusBadge: {
      display: "inline-block",
      padding: "4px 8px",
      borderRadius: "4px",
      fontSize: "9px",
      fontWeight: "bold",
      textTransform: "uppercase",
      marginTop: "8px",
      background:
        status === "Delivered"
          ? "#28a745"
          : status === "Pending"
            ? "#ffc107"
            : status === "Processing"
              ? "#17a2b8"
              : "#6c757d",
      color: "#ffffff",
    },

    // Main content area
    contentArea: {
      padding: "30px",
    },

    // Customer details section
    customerSection: {
      display: "flex",
      gap: "30px",
      marginBottom: "30px",
    },

    customerBox: {
      flex: "1",
      border: "1px solid #e0e0e0",
      borderRadius: "8px",
      padding: "20px",
      background: "#fafafa",
    },

    customerTitle: {
      fontSize: "12px",
      fontWeight: "bold",
      color: "#e63946",
      marginBottom: "12px",
      textTransform: "uppercase",
      borderBottom: "1px solid #e63946",
      paddingBottom: "5px",
    },

    customerInfo: {
      fontSize: "10px",
      lineHeight: "1.6",
      color: "#333333",
    },

    customerName: {
      fontWeight: "bold",
      fontSize: "12px",
      color: "#000000",
      marginBottom: "8px",
    },

    // Items table
    itemsSection: {
      marginBottom: "30px",
    },

    sectionTitle: {
      fontSize: "14px",
      fontWeight: "bold",
      color: "#333333",
      marginBottom: "15px",
      paddingBottom: "8px",
      borderBottom: "2px solid #e63946",
    },

    table: {
      width: "100%",
      borderCollapse: "collapse",
      border: "1px solid #e0e0e0",
      borderRadius: "8px",
      overflow: "hidden",
    },

    tableHeader: {
      background: "#e63946",
      color: "#ffffff",
    },

    tableHeaderCell: {
      padding: "12px 10px",
      fontSize: "10px",
      fontWeight: "bold",
      textAlign: "left",
      border: "1px solid #d43847",
    },

    tableRow: {
      borderBottom: "1px solid #e0e0e0",
    },

    tableRowAlt: {
      background: "#f8f9fa",
    },

    tableCell: {
      padding: "10px",
      fontSize: "10px",
      border: "1px solid #e0e0e0",
      verticalAlign: "top",
    },

    // Summary section
    summarySection: {
      display: "flex",
      justifyContent: "flex-end",
      marginBottom: "30px",
    },

    summaryTable: {
      width: "300px",
      borderCollapse: "collapse",
      border: "1px solid #e0e0e0",
    },

    summaryRow: {
      borderBottom: "1px solid #e0e0e0",
    },

    summaryCell: {
      padding: "8px 12px",
      fontSize: "10px",
      border: "1px solid #e0e0e0",
    },

    summaryLabelCell: {
      background: "#f8f9fa",
      fontWeight: "bold",
      textAlign: "right",
      width: "60%",
    },

    summaryValueCell: {
      textAlign: "right",
      fontWeight: "bold",
    },

    totalRow: {
      background: "#e63946",
      color: "#ffffff",
    },

    totalCell: {
      padding: "12px",
      fontSize: "12px",
      fontWeight: "bold",
      border: "1px solid #d43847",
    },

    // Footer section
    footer: {
      marginTop: "auto",
      borderTop: "2px solid #e63946",
      padding: "20px 30px",
      background: "#f8f9fa",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },

    // Terms section
    termsSection: {
      flex: "2",
      paddingRight: "30px",
    },

    termsTitle: {
      fontSize: "12px",
      fontWeight: "bold",
      color: "#333333",
      marginBottom: "10px",
    },

    termsList: {
      fontSize: "9px",
      lineHeight: "1.4",
      color: "#666666",
      margin: "0",
      padding: "0",
      listStyle: "none",
    },

    termsItem: {
      marginBottom: "3px",
      paddingLeft: "10px",
      position: "relative",
    },

    // QR Code section
    qrSection: {
      flex: "1",
      textAlign: "center",
    },

    qrContainer: {
      border: "1px solid #e0e0e0",
      borderRadius: "8px",
      padding: "15px",
      background: "#ffffff",
      display: "inline-block",
    },

    qrCode: {
      width: "80px",
      height: "80px",
      marginBottom: "8px",
    },

    qrLabel: {
      fontSize: "8px",
      color: "#666666",
      fontWeight: "bold",
      textAlign: "center",
      lineHeight: "1.2",
    },

    // Tax notice
    taxNotice: {
      background: "#fff3cd",
      border: "1px solid #ffeaa7",
      borderRadius: "6px",
      padding: "12px",
      marginBottom: "20px",
      color: "#856404",
      fontSize: "10px",
      textAlign: "center",
      fontWeight: "bold",
    },

    // Thank you section
    thankYou: {
      textAlign: "center",
      padding: "15px",
      background: "#e63946",
      color: "#ffffff",
      margin: "20px -30px -20px -30px",
      fontSize: "12px",
      fontWeight: "bold",
    },

    // Print-specific styles
    printOnly: {
      display: forPrint ? "block" : "none",
    },

    noprint: {
      display: forPrint ? "none" : "block",
    },
  };

  // QR Code Component
  const QRCodeComponent = () => {
    const [qrDataUrl, setQrDataUrl] = React.useState("");

    React.useEffect(() => {
      QRCode.toDataURL(qrCodeValue, {
        width: 80,
        margin: 1,
        color: {
          dark: "#333333",
          light: "#ffffff",
        },
        errorCorrectionLevel: "M",
      }).then(setQrDataUrl);
    }, []);

    return (
      <div style={professionalStyles.qrContainer}>
        {qrDataUrl && (
          <img
            src={qrDataUrl}
            alt="Invoice Verification QR Code"
            style={professionalStyles.qrCode}
          />
        )}
      </div>
    );
  };

  return (
    <div style={professionalStyles.container} className="invoice-container">
      {/* Header Section */}
      <div style={professionalStyles.header}>
        {/* Company Information */}
        <div style={professionalStyles.companyInfo}>
          <img
            src="https://cdn.builder.io/api/v1/assets/ec4b3f82f1ac4275b8bfc1756fcac420/medical_logo-e586be?format=webp&width=800"
            alt="Hare Krishna Medical"
            style={professionalStyles.companyLogo}
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
          <h1 style={professionalStyles.companyName}>HARE KRISHNA MEDICAL</h1>
          <p style={professionalStyles.companyTagline}>
            Your Trusted Health Partner
          </p>
          <div style={professionalStyles.companyAddress}>
            <div>3 Sahyog Complex, Man Sarovar Circle</div>
            <div>Amroli, 394107, Gujarat, India</div>
            <div>Phone: +91 76989 13354 | +91 91060 18508</div>
            <div>Email: harekrishnamedical@gmail.com</div>
            <div>Website: www.harekrishnamedical.com</div>
          </div>
        </div>

        {/* Invoice Details */}
        <div style={professionalStyles.invoiceSection}>
          <h2 style={professionalStyles.invoiceTitle}>INVOICE</h2>
          <div style={professionalStyles.invoiceDetails}>
            <div style={professionalStyles.invoiceDetailRow}>
              <span style={professionalStyles.invoiceLabel}>Invoice No:</span>
              <span style={professionalStyles.invoiceValue}>{invoiceId}</span>
            </div>
            <div style={professionalStyles.invoiceDetailRow}>
              <span style={professionalStyles.invoiceLabel}>Order No:</span>
              <span style={professionalStyles.invoiceValue}>{orderId}</span>
            </div>
            <div style={professionalStyles.invoiceDetailRow}>
              <span style={professionalStyles.invoiceLabel}>Date:</span>
              <span style={professionalStyles.invoiceValue}>{orderDate}</span>
            </div>
            <div style={professionalStyles.invoiceDetailRow}>
              <span style={professionalStyles.invoiceLabel}>Time:</span>
              <span style={professionalStyles.invoiceValue}>{orderTime}</span>
            </div>
            <div style={professionalStyles.statusBadge}>{status}</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={professionalStyles.contentArea}>
        {/* Tax Notice */}
        <div style={professionalStyles.taxNotice}>
          ⚠️ All taxes and duties are included in product prices. No additional
          charges apply.
        </div>

        {/* Customer Information */}
        <div style={professionalStyles.customerSection}>
          <div style={professionalStyles.customerBox}>
            <h3 style={professionalStyles.customerTitle}>Bill To</h3>
            <div style={professionalStyles.customerInfo}>
              <div style={professionalStyles.customerName}>
                {customerDetails.fullName}
              </div>
              <div>Email: {customerDetails.email}</div>
              <div>Phone: {customerDetails.mobile}</div>
              <div>Address: {customerDetails.address}</div>
              <div>
                City: {customerDetails.city}, {customerDetails.state}{" "}
                {customerDetails.pincode}
              </div>
            </div>
          </div>

          <div style={professionalStyles.customerBox}>
            <h3 style={professionalStyles.customerTitle}>Payment Details</h3>
            <div style={professionalStyles.customerInfo}>
              <div>
                <strong>Payment Method:</strong> {paymentMethod}
              </div>
              <div>
                <strong>Payment Status:</strong>{" "}
                <span
                  style={{
                    padding: "2px 6px",
                    borderRadius: "3px",
                    fontSize: "9px",
                    fontWeight: "bold",
                    background:
                      paymentStatus === "Paid" ? "#28a745" : "#ffc107",
                    color: "#ffffff",
                  }}
                >
                  {paymentStatus}
                </span>
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
        <div style={professionalStyles.itemsSection}>
          <h3 style={professionalStyles.sectionTitle}>Items Ordered</h3>
          <table style={professionalStyles.table}>
            <thead style={professionalStyles.tableHeader}>
              <tr>
                <th
                  style={{
                    ...professionalStyles.tableHeaderCell,
                    textAlign: "center",
                    width: "40px",
                  }}
                >
                  Sr.
                </th>
                <th
                  style={{
                    ...professionalStyles.tableHeaderCell,
                    width: "50%",
                  }}
                >
                  Product Description
                </th>
                <th
                  style={{
                    ...professionalStyles.tableHeaderCell,
                    textAlign: "center",
                    width: "60px",
                  }}
                >
                  Qty
                </th>
                <th
                  style={{
                    ...professionalStyles.tableHeaderCell,
                    textAlign: "right",
                    width: "80px",
                  }}
                >
                  Unit Price (₹)
                </th>
                <th
                  style={{
                    ...professionalStyles.tableHeaderCell,
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
                      ? professionalStyles.tableRow
                      : {
                          ...professionalStyles.tableRow,
                          ...professionalStyles.tableRowAlt,
                        }
                  }
                >
                  <td
                    style={{
                      ...professionalStyles.tableCell,
                      textAlign: "center",
                      fontWeight: "bold",
                      color: "#e63946",
                    }}
                  >
                    {index + 1}
                  </td>
                  <td style={professionalStyles.tableCell}>
                    <div style={{ fontWeight: "bold", marginBottom: "2px" }}>
                      {item.name}
                    </div>
                    <div style={{ fontSize: "8px", color: "#666666" }}>
                      Manufactured by: {item.company || "Medical Product"}
                    </div>
                  </td>
                  <td
                    style={{
                      ...professionalStyles.tableCell,
                      textAlign: "center",
                      fontWeight: "bold",
                    }}
                  >
                    {item.quantity}
                  </td>
                  <td
                    style={{
                      ...professionalStyles.tableCell,
                      textAlign: "right",
                      fontWeight: "bold",
                    }}
                  >
                    ₹{item.price?.toFixed(2) || "0.00"}
                  </td>
                  <td
                    style={{
                      ...professionalStyles.tableCell,
                      textAlign: "right",
                      fontWeight: "bold",
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
        <div style={professionalStyles.summarySection}>
          <table style={professionalStyles.summaryTable}>
            <tbody>
              <tr style={professionalStyles.summaryRow}>
                <td
                  style={{
                    ...professionalStyles.summaryCell,
                    ...professionalStyles.summaryLabelCell,
                  }}
                >
                  Subtotal:
                </td>
                <td
                  style={{
                    ...professionalStyles.summaryCell,
                    ...professionalStyles.summaryValueCell,
                  }}
                >
                  ₹{calculatedSubtotal.toFixed(2)}
                </td>
              </tr>
              <tr style={professionalStyles.summaryRow}>
                <td
                  style={{
                    ...professionalStyles.summaryCell,
                    ...professionalStyles.summaryLabelCell,
                  }}
                >
                  Shipping:
                </td>
                <td
                  style={{
                    ...professionalStyles.summaryCell,
                    ...professionalStyles.summaryValueCell,
                    color: shipping === 0 ? "#28a745" : "#000000",
                  }}
                >
                  {shipping === 0 ? "FREE" : `₹${shipping.toFixed(2)}`}
                </td>
              </tr>
              <tr style={professionalStyles.summaryRow}>
                <td
                  style={{
                    ...professionalStyles.summaryCell,
                    ...professionalStyles.summaryLabelCell,
                  }}
                >
                  All Taxes:
                </td>
                <td
                  style={{
                    ...professionalStyles.summaryCell,
                    ...professionalStyles.summaryValueCell,
                    color: "#28a745",
                  }}
                >
                  INCLUDED
                </td>
              </tr>
              <tr style={professionalStyles.totalRow}>
                <td
                  style={{
                    ...professionalStyles.totalCell,
                    textAlign: "right",
                  }}
                >
                  GRAND TOTAL:
                </td>
                <td
                  style={{
                    ...professionalStyles.totalCell,
                    textAlign: "right",
                    fontSize: "14px",
                  }}
                >
                  ₹{calculatedTotal.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Section */}
      <div style={professionalStyles.footer}>
        {/* Terms and Conditions */}
        <div style={professionalStyles.termsSection}>
          <h3 style={professionalStyles.termsTitle}>Terms & Conditions</h3>
          <ul style={professionalStyles.termsList}>
            <li style={professionalStyles.termsItem}>
              • Payment due within 30 days of invoice date
            </li>
            <li style={professionalStyles.termsItem}>
              • All prices include applicable taxes and duties
            </li>
            <li style={professionalStyles.termsItem}>
              • Goods once sold will not be taken back or exchanged
            </li>
            <li style={professionalStyles.termsItem}>
              • All disputes subject to Gujarat jurisdiction only
            </li>
            <li style={professionalStyles.termsItem}>
              • For queries: harekrishnamedical@gmail.com
            </li>
          </ul>
        </div>

        {/* QR Code Section */}
        <div style={professionalStyles.qrSection}>
          <QRCodeComponent />
          <div style={professionalStyles.qrLabel}>
            Scan to Verify
            <br />
            Invoice & Track Order
          </div>
        </div>
      </div>

      {/* Thank You Section */}
      <div style={professionalStyles.thankYou}>
        Thank You for Your Business! | Generated:{" "}
        {new Date().toLocaleDateString("en-GB")} | This is a computer-generated
        invoice
      </div>

      {/* Print-specific CSS */}
      <style>
        {`
          @media print {
            .invoice-container {
              margin: 0 !important;
              padding: 0 !important;
              box-shadow: none !important;
              border: none !important;
              font-size: 10px !important;
            }
            
            @page {
              size: A4;
              margin: 0.5in;
            }
            
            body {
              margin: 0;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            
            .no-print {
              display: none !important;
            }
            
            .invoice-container * {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
          }
        `}
      </style>
    </div>
  );
};

export default ProfessionalInvoice;
