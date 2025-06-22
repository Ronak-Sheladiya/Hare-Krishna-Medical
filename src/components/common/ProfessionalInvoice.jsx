import React, { useEffect } from "react";
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

  // Security measures
  useEffect(() => {
    // Disable right-click context menu for security
    const disableRightClick = (e) => {
      e.preventDefault();
      return false;
    };

    // Disable F12, Ctrl+Shift+I, Ctrl+U, etc.
    const disableKeyboardShortcuts = (e) => {
      // F12 key
      if (e.keyCode === 123) {
        e.preventDefault();
        return false;
      }
      // Ctrl+Shift+I (Developer tools)
      if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
        e.preventDefault();
        return false;
      }
      // Ctrl+U (View source)
      if (e.ctrlKey && e.keyCode === 85) {
        e.preventDefault();
        return false;
      }
      // Ctrl+S (Save page)
      if (e.ctrlKey && e.keyCode === 83) {
        e.preventDefault();
        return false;
      }
    };

    // Add security measures
    document.addEventListener("contextmenu", disableRightClick);
    document.addEventListener("keydown", disableKeyboardShortcuts);

    // Cleanup
    return () => {
      document.removeEventListener("contextmenu", disableRightClick);
      document.removeEventListener("keydown", disableKeyboardShortcuts);
    };
  }, []);

  // Calculate totals without tax (all taxes included in product price)
  const calculatedSubtotal =
    subtotal ||
    items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const calculatedTotal = total || calculatedSubtotal + shipping;

  // Generate QR code with invoice verification URL
  const qrCodeValue =
    qrCode || `https://harekrishan.medical/verify/${invoiceId}`;

  // Print function with proper window handling
  const handlePrint = () => {
    // Create a new window for printing
    const printWindow = window.open("", "_blank", "width=800,height=600");

    if (!printWindow) {
      alert("Please allow popups for printing functionality");
      return;
    }

    // Generate the invoice HTML content
    const invoiceHTML = generateInvoiceHTML();

    // Write content to the new window
    printWindow.document.write(invoiceHTML);
    printWindow.document.close();

    // Wait for content to load then print
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    };
  };

  const generateInvoiceHTML = () => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice ${invoiceId}</title>
          <style>
            @media print {
              @page {
                size: A4;
                margin: 10mm;
              }
              body {
                margin: 0;
                padding: 0;
                -webkit-print-color-adjust: exact;
                color-adjust: exact;
              }
            }
            
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              font-size: 11px;
              line-height: 1.4;
              color: #000000;
              background: #ffffff;
              margin: 0;
              padding: 0;
            }
            
            .invoice-container {
              width: 100%;
              max-width: 210mm;
              margin: 0 auto;
              background: white;
              position: relative;
            }
            
            .header {
              background: linear-gradient(135deg, #e63946 0%, #dc3545 100%);
              color: white;
              padding: 25px 30px;
              margin-bottom: 0;
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
            }
            
            .company-info {
              flex: 2;
            }
            
            .company-logo {
              width: 80px;
              height: 80px;
              margin-bottom: 15px;
              background: white;
              padding: 10px;
              border-radius: 10px;
            }
            
            .company-name {
              font-size: 24px;
              font-weight: bold;
              margin: 0 0 8px 0;
              text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
            }
            
            .company-tagline {
              font-size: 12px;
              margin-bottom: 15px;
              opacity: 0.9;
            }
            
            .company-address {
              font-size: 10px;
              line-height: 1.6;
            }
            
            .invoice-section {
              flex: 1;
              text-align: right;
              padding-left: 30px;
            }
            
            .invoice-title {
              font-size: 36px;
              font-weight: bold;
              margin: 0 0 20px 0;
              text-shadow: 3px 3px 6px rgba(0,0,0,0.3);
            }
            
            .invoice-details {
              background: rgba(255,255,255,0.95);
              color: #333;
              padding: 20px;
              border-radius: 10px;
              font-size: 11px;
              text-align: left;
              box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            }
            
            .invoice-details div {
              margin-bottom: 8px;
            }
            
            .customer-section {
              display: flex;
              gap: 20px;
              margin-bottom: 25px;
            }
            
            .bill-to, .ship-to {
              flex: 1;
              color: white;
              padding: 20px;
            }
            
            .bill-to {
              background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
            }
            
            .ship-to {
              background: linear-gradient(135deg, #27ae60 0%, #229954 100%);
            }
            
            .customer-title {
              font-size: 14px;
              font-weight: bold;
              margin: 0 0 15px 0;
              text-transform: uppercase;
              text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
            }
            
            .customer-details {
              font-size: 11px;
              line-height: 1.8;
            }
            
            .items-section {
              margin-bottom: 25px;
            }
            
            .items-header {
              background: linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%);
              color: white;
              padding: 15px 25px;
              font-size: 16px;
              font-weight: bold;
              text-align: center;
              text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
            }
            
            .items-table {
              width: 100%;
              border-collapse: collapse;
              border: 3px solid #9b59b6;
            }
            
            .items-table th {
              background: linear-gradient(135deg, #f39c12 0%, #e67e22 100%);
              color: white;
              border: 2px solid #e67e22;
              padding: 12px 8px;
              font-size: 11px;
              font-weight: bold;
              text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
            }
            
            .items-table td {
              border: 1px solid #ddd;
              padding: 10px 8px;
              font-size: 10px;
            }
            
            .items-table tbody tr:nth-child(even) {
              background-color: #f8f9fa;
            }
            
            .totals-section {
              display: flex;
              justify-content: flex-end;
              margin-bottom: 25px;
            }
            
            .totals-table {
              min-width: 350px;
              border-collapse: collapse;
              border: 3px solid #e74c3c;
              border-radius: 10px;
              overflow: hidden;
            }
            
            .totals-table td {
              padding: 12px 15px;
              font-size: 11px;
              border: 1px solid #bdc3c7;
            }
            
            .footer {
              background: linear-gradient(135deg, #34495e 0%, #2c3e50 100%);
              color: white;
              padding: 25px;
              border-radius: 15px;
              margin-bottom: 20px;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            
            .footer-content {
              flex: 1;
            }
            
            .footer-title {
              font-size: 16px;
              font-weight: bold;
              margin: 0 0 15px 0;
              text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
            }
            
            .terms-list {
              font-size: 10px;
              line-height: 1.8;
            }
            
            .qr-section {
              text-align: center;
              margin-left: 25px;
            }
            
            .qr-placeholder {
              width: 90px;
              height: 90px;
              border: 3px solid #3498db;
              border-radius: 10px;
              padding: 5px;
              background: white;
              display: flex;
              align-items: center;
              justify-content: center;
              color: #333;
              font-weight: bold;
              font-size: 10px;
              text-align: center;
            }
            
            .computer-generated {
              text-align: center;
              margin-top: 25px;
              font-size: 9px;
              color: #7f8c8d;
              background: #ecf0f1;
              padding: 12px;
              border-radius: 8px;
              border: 1px solid #bdc3c7;
            }
            
            .status-badge {
              background: #27ae60;
              color: white;
              padding: 3px 8px;
              border-radius: 12px;
              font-size: 9px;
            }
            
            .payment-status {
              background: rgba(255,255,255,0.2);
              padding: 2px 6px;
              border-radius: 8px;
            }
          </style>
        </head>
        <body>
          <div class="invoice-container">
            <!-- Header Section -->
            <div class="header">
              <div class="company-info">
                <img src="https://cdn.builder.io/api/v1/assets/ec4b3f82f1ac4275b8bfc1756fcac420/invoice_hkm12345678-1-e0e726" alt="Logo" class="company-logo" onerror="this.style.display='none';" />
                <div>
                  <div class="company-name">HARE KRISHNA MEDICAL</div>
                  <div class="company-tagline">Your Trusted Health Partner</div>
                </div>
                <div class="company-address">
                  <div>📍 3 Sahyog Complex, Man Sarovar circle</div>
                  <div>🏙️ Amroli, 394107, Gujarat, India</div>
                  <div>📞 +91 76989 13354 | +91 91060 18508</div>
                  <div>📧 harekrishnamedical@gmail.com</div>
                </div>
              </div>
              <div class="invoice-section">
                <div class="invoice-title">INVOICE</div>
                <div class="invoice-details">
                  <div><strong>Invoice No:</strong> ${invoiceId}</div>
                  <div><strong>Order No:</strong> ${orderId}</div>
                  <div><strong>Date:</strong> ${orderDate}</div>
                  <div><strong>Time:</strong> ${orderTime}</div>
                  <div><strong>Status:</strong> <span class="status-badge">${status}</span></div>
                </div>
              </div>
            </div>

            <!-- Customer Information -->
            <div class="customer-section">
              <div class="bill-to">
                <div class="customer-title">📍 BILL TO:</div>
                <div class="customer-details">
                  <div style="font-weight: bold; margin-bottom: 8px; font-size: 13px;">${customerDetails.fullName}</div>
                  <div>📧 ${customerDetails.email}</div>
                  <div>📱 ${customerDetails.mobile}</div>
                  <div>🏠 ${customerDetails.address}</div>
                  <div>🏙️ ${customerDetails.city}, ${customerDetails.state} ${customerDetails.pincode}</div>
                </div>
              </div>
              <div class="ship-to">
                <div class="customer-title">🚚 SHIP TO:</div>
                <div class="customer-details">
                  <div style="font-weight: bold; margin-bottom: 8px; font-size: 13px;">${customerDetails.fullName}</div>
                  <div>🏠 ${customerDetails.address}</div>
                  <div>🏙️ ${customerDetails.city}, ${customerDetails.state} ${customerDetails.pincode}</div>
                  <div style="margin-top: 12px;"><strong>💳 Payment:</strong> ${paymentMethod}</div>
                  <div><strong>✅ Status:</strong> <span class="payment-status">${paymentStatus}</span></div>
                </div>
              </div>
            </div>

            <!-- Items Table -->
            <div class="items-section">
              <div class="items-header">🛒 ORDERED ITEMS</div>
              <table class="items-table">
                <thead>
                  <tr>
                    <th style="text-align: center;">S.No</th>
                    <th style="text-align: left;">🏥 Description</th>
                    <th style="text-align: center;">Qty</th>
                    <th style="text-align: right;">💰 Price (₹)</th>
                    <th style="text-align: right;">💵 Amount (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  ${items
                    .map(
                      (item, index) => `
                    <tr>
                      <td style="text-align: center; font-weight: bold; color: #9b59b6;">${index + 1}</td>
                      <td>
                        <div style="font-weight: bold; color: #2c3e50; margin-bottom: 4px;">${item.name}</div>
                        <div style="color: #7f8c8d; font-size: 9px; font-style: italic;">🏢 ${item.company || "Medical Product"}</div>
                      </td>
                      <td style="text-align: center;">
                        <span style="background: #3498db; color: white; padding: 4px 8px; border-radius: 12px; font-size: 9px; font-weight: bold;">${item.quantity}</span>
                      </td>
                      <td style="text-align: right; color: #27ae60; font-weight: bold;">₹${item.price.toFixed(2)}</td>
                      <td style="text-align: right; font-weight: bold; color: #e74c3c;">₹${(item.price * item.quantity).toFixed(2)}</td>
                    </tr>
                  `,
                    )
                    .join("")}
                </tbody>
              </table>
            </div>

            <!-- Totals Section -->
            <div class="totals-section">
              <table class="totals-table">
                <tbody>
                  <tr>
                    <td style="background: linear-gradient(135deg, #ecf0f1 0%, #bdc3c7 100%); font-weight: bold; color: #2c3e50;">📊 Subtotal:</td>
                    <td style="background: #ecf0f1; text-align: right; color: #2c3e50; font-weight: bold;">₹${calculatedSubtotal.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td style="background: linear-gradient(135deg, #d5f4e6 0%, #a2d9ce 100%); font-weight: bold; color: #27ae60;">🚚 Shipping:</td>
                    <td style="background: #d5f4e6; text-align: right; color: #27ae60; font-weight: bold;">${shipping === 0 ? "FREE 🎉" : `₹${shipping.toFixed(2)}`}</td>
                  </tr>
                  <tr>
                    <td style="background: linear-gradient(135deg, #fdeaa7 0%, #f39c12 100%); font-weight: bold; color: #f39c12;">📋 Tax:</td>
                    <td style="background: #fdeaa7; text-align: right; color: #f39c12; font-weight: bold;">Included in price</td>
                  </tr>
                  <tr>
                    <td style="background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%); color: #fff; padding: 18px 15px; font-size: 14px; font-weight: bold; text-shadow: 1px 1px 2px rgba(0,0,0,0.3);">💎 TOTAL:</td>
                    <td style="background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%); color: #fff; padding: 18px 15px; font-size: 16px; text-align: right; font-weight: bold; text-shadow: 1px 1px 2px rgba(0,0,0,0.3);">₹${calculatedTotal.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Footer Section -->
            <div class="footer">
              <div class="footer-content">
                <div class="footer-title">🙏 Thank You for Your Business! 🙏</div>
                <div class="terms-list">
                  <div style="margin-bottom: 10px;"><strong style="color: #f39c12;">📋 Terms & Conditions:</strong></div>
                  <div>✅ Payment due within 30 days</div>
                  <div>❌ Goods once sold will not be taken back</div>
                  <div>⚖️ Subject to Gujarat jurisdiction only</div>
                  <div style="margin-top: 12px;"><strong style="color: #3498db;">📞 Contact:</strong> harekrishnamedical@gmail.com | +91 76989 13354</div>
                </div>
              </div>
              <div class="qr-section">
                <div class="qr-placeholder">QR CODE</div>
                <div style="font-size: 9px; margin-top: 8px; color: #ecf0f1;">📱 Scan for Online Verification</div>
              </div>
            </div>

            <!-- Computer Generated Note -->
            <div class="computer-generated">
              🖥️ This is a computer generated invoice. No physical signature required.<br />
              📅 Generated on: ${new Date().toLocaleString()}<br />
              �� Protected document - Unauthorized modification is strictly prohibited
            </div>
          </div>
        </body>
      </html>
    `;
  };

  const professionalStyles = {
    container: {
      width: forPrint ? "210mm" : "100%",
      maxWidth: "210mm",
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
      userSelect: "none", // Security: Prevent text selection
      WebkitUserSelect: "none",
      MozUserSelect: "none",
      msUserSelect: "none",
    },

    header: {
      background: "linear-gradient(135deg, #e63946 0%, #dc3545 100%)",
      color: "white",
      padding: "25px 30px",
      marginBottom: "0",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },

    companyInfo: {
      flex: "2",
    },

    companyLogo: {
      width: "80px",
      height: "80px",
      marginBottom: "15px",
      background: "white",
      padding: "10px",
      borderRadius: "10px",
    },

    companyName: {
      fontSize: "24px",
      fontWeight: "bold",
      margin: "0 0 8px 0",
      textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
    },

    companyTagline: {
      fontSize: "12px",
      marginBottom: "15px",
      opacity: "0.9",
    },

    companyAddress: {
      fontSize: "10px",
      lineHeight: "1.6",
    },

    invoiceSection: {
      flex: "1",
      textAlign: "right",
      paddingLeft: "30px",
    },

    invoiceTitle: {
      fontSize: "36px",
      fontWeight: "bold",
      margin: "0 0 20px 0",
      textShadow: "3px 3px 6px rgba(0,0,0,0.3)",
    },

    invoiceDetails: {
      background: "rgba(255,255,255,0.95)",
      color: "#333",
      padding: "20px",
      borderRadius: "10px",
      fontSize: "11px",
      textAlign: "left",
      boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
    },

    customerSection: {
      display: "flex",
      gap: "20px",
      marginBottom: "25px",
    },

    billTo: {
      flex: "1",
      background: "linear-gradient(135deg, #3498db 0%, #2980b9 100%)",
      color: "white",
      padding: "20px",
    },

    shipTo: {
      flex: "1",
      background: "linear-gradient(135deg, #27ae60 0%, #229954 100%)",
      color: "white",
      padding: "20px",
    },

    printButton: {
      position: "fixed",
      top: "20px",
      right: "20px",
      zIndex: 1000,
      background: "#e63946",
      color: "white",
      border: "none",
      padding: "12px 20px",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: "600",
      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
      transition: "all 0.3s ease",
    },
  };

  if (forPrint) {
    return (
      <div style={professionalStyles.container}>
        {/* Simplified structure for print */}
        <div style={professionalStyles.header}>
          <div style={professionalStyles.companyInfo}>
            <img
              src="https://cdn.builder.io/api/v1/assets/ec4b3f82f1ac4275b8bfc1756fcac420/invoice_hkm12345678-1-e0e726"
              alt="Logo"
              style={professionalStyles.companyLogo}
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
            <div style={professionalStyles.companyName}>
              HARE KRISHNA MEDICAL
            </div>
            <div style={professionalStyles.companyTagline}>
              Your Trusted Health Partner
            </div>
            <div style={professionalStyles.companyAddress}>
              <div>📍 3 Sahyog Complex, Man Sarovar circle</div>
              <div>🏙️ Amroli, 394107, Gujarat, India</div>
              <div>📞 +91 76989 13354 | +91 91060 18508</div>
              <div>📧 harekrishnamedical@gmail.com</div>
            </div>
          </div>
          <div style={professionalStyles.invoiceSection}>
            <div style={professionalStyles.invoiceTitle}>INVOICE</div>
            <div style={professionalStyles.invoiceDetails}>
              <div style={{ marginBottom: "8px" }}>
                <strong>Invoice No:</strong> {invoiceId}
              </div>
              <div style={{ marginBottom: "8px" }}>
                <strong>Order No:</strong> {orderId}
              </div>
              <div style={{ marginBottom: "8px" }}>
                <strong>Date:</strong> {orderDate}
              </div>
              <div style={{ marginBottom: "8px" }}>
                <strong>Time:</strong> {orderTime}
              </div>
              <div>
                <strong>Status:</strong>{" "}
                <span
                  style={{
                    background: "#27ae60",
                    color: "white",
                    padding: "3px 8px",
                    borderRadius: "12px",
                    fontSize: "9px",
                  }}
                >
                  {status}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Rest of the invoice content simplified for print */}
        <div style={{ padding: "0 30px" }}>
          <div style={professionalStyles.customerSection}>
            <div style={professionalStyles.billTo}>
              <h3
                style={{
                  fontSize: "14px",
                  fontWeight: "bold",
                  margin: "0 0 15px 0",
                  textTransform: "uppercase",
                  textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
                }}
              >
                📍 BILL TO:
              </h3>
              <div style={{ fontSize: "11px", lineHeight: "1.8" }}>
                <div
                  style={{
                    fontWeight: "bold",
                    marginBottom: "8px",
                    fontSize: "13px",
                  }}
                >
                  {customerDetails.fullName}
                </div>
                <div>📧 {customerDetails.email}</div>
                <div>📱 {customerDetails.mobile}</div>
                <div>🏠 {customerDetails.address}</div>
                <div>
                  🏙️ {customerDetails.city}, {customerDetails.state}{" "}
                  {customerDetails.pincode}
                </div>
              </div>
            </div>
            <div style={professionalStyles.shipTo}>
              <h3
                style={{
                  fontSize: "14px",
                  fontWeight: "bold",
                  margin: "0 0 15px 0",
                  textTransform: "uppercase",
                  textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
                }}
              >
                🚚 SHIP TO:
              </h3>
              <div style={{ fontSize: "11px", lineHeight: "1.8" }}>
                <div
                  style={{
                    fontWeight: "bold",
                    marginBottom: "8px",
                    fontSize: "13px",
                  }}
                >
                  {customerDetails.fullName}
                </div>
                <div>🏠 {customerDetails.address}</div>
                <div>
                  🏙️ {customerDetails.city}, {customerDetails.state}{" "}
                  {customerDetails.pincode}
                </div>
                <div style={{ marginTop: "12px" }}>
                  <strong>💳 Payment:</strong> {paymentMethod}
                </div>
                <div>
                  <strong>✅ Status:</strong>{" "}
                  <span
                    style={{
                      background: "rgba(255,255,255,0.2)",
                      padding: "2px 6px",
                      borderRadius: "8px",
                    }}
                  >
                    {paymentStatus}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Security watermark for print */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%) rotate(-45deg)",
              fontSize: "72px",
              color: "rgba(230, 57, 70, 0.05)",
              fontWeight: "bold",
              zIndex: -1,
              pointerEvents: "none",
            }}
          >
            HARE KRISHNA MEDICAL
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={professionalStyles.container}>
      {/* Print Button */}
      <button
        onClick={handlePrint}
        style={professionalStyles.printButton}
        onMouseOver={(e) => {
          e.target.style.background = "#dc3545";
          e.target.style.transform = "translateY(-2px)";
        }}
        onMouseOut={(e) => {
          e.target.style.background = "#e63946";
          e.target.style.transform = "translateY(0)";
        }}
      >
        🖨️ Print Invoice
      </button>

      {/* Security Warning */}
      <div
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          background: "rgba(220, 53, 69, 0.9)",
          color: "white",
          padding: "8px 12px",
          borderRadius: "6px",
          fontSize: "12px",
          zIndex: 999,
        }}
      >
        🔒 Protected Document
      </div>

      {/* Invoice Content */}
      <div dangerouslySetInnerHTML={{ __html: generateInvoiceHTML() }} />

      <style>
        {`
          /* Security styles */
          .invoice-container {
            -webkit-touch-callout: none;
            -webkit-user-select: none;
            -khtml-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
          }
          
          /* Disable highlighting */
          .invoice-container::selection {
            background: transparent;
          }
          
          .invoice-container::-moz-selection {
            background: transparent;
          }
          
          /* Print specific styles */
          @media print {
            .invoice-container {
              -webkit-print-color-adjust: exact;
              color-adjust: exact;
            }
            
            button {
              display: none !important;
            }
            
            .security-warning {
              display: none !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default ProfessionalInvoice;
