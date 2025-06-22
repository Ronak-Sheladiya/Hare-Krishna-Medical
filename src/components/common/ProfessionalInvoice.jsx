import React, { useEffect, useState } from "react";
import QRCode from "qrcode";

const ProfessionalInvoice = ({
  invoiceData,
  qrCode = null,
  forPrint = false,
}) => {
  const [generatedQR, setGeneratedQR] = useState("");

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

  // Generate QR Code
  useEffect(() => {
    const generateQR = async () => {
      try {
        const qrText = `Invoice: ${invoiceId}\nOrder: ${orderId}\nAmount: ₹${total}\nVerify: https://harekrishan.medical/verify/${invoiceId}`;
        const qrDataURL = await QRCode.toDataURL(qrText, {
          width: 120,
          margin: 2,
          color: {
            dark: "#2c3e50",
            light: "#ffffff",
          },
        });
        setGeneratedQR(qrDataURL);
      } catch (error) {
        console.error("QR generation error:", error);
      }
    };

    if (invoiceId && orderId) {
      generateQR();
    }
  }, [invoiceId, orderId, total]);

  // Security measures
  useEffect(() => {
    if (!forPrint) {
      const disableRightClick = (e) => {
        e.preventDefault();
        return false;
      };

      const disableKeyboardShortcuts = (e) => {
        if (
          e.keyCode === 123 ||
          (e.ctrlKey && e.shiftKey && e.keyCode === 73) ||
          (e.ctrlKey && e.keyCode === 85) ||
          (e.ctrlKey && e.keyCode === 83)
        ) {
          e.preventDefault();
          return false;
        }
      };

      document.addEventListener("contextmenu", disableRightClick);
      document.addEventListener("keydown", disableKeyboardShortcuts);

      return () => {
        document.removeEventListener("contextmenu", disableRightClick);
        document.removeEventListener("keydown", disableKeyboardShortcuts);
      };
    }
  }, [forPrint]);

  // Calculate totals
  const calculatedSubtotal =
    subtotal ||
    items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const calculatedTotal = total || calculatedSubtotal + shipping;

  // Enhanced print function
  const handlePrint = () => {
    const printContent = generatePrintHTML();

    // Create print window
    const printWindow = window.open(
      "",
      "_blank",
      "width=800,height=600,scrollbars=yes",
    );

    if (!printWindow) {
      alert("Please allow popups to enable printing functionality");
      return;
    }

    printWindow.document.write(printContent);
    printWindow.document.close();

    // Ensure content is loaded before printing
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
        printWindow.close();
      }, 500);
    };

    // Fallback for older browsers
    setTimeout(() => {
      if (printWindow && !printWindow.closed) {
        printWindow.focus();
        printWindow.print();
        printWindow.close();
      }
    }, 1000);
  };

  const generatePrintHTML = () => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Medical Invoice - ${invoiceId}</title>
    <style>
        @page {
            size: A4;
            margin: 0.5in;
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.4;
            color: #2c3e50;
            background: white;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
        }
        
        .invoice-container {
            width: 100%;
            max-width: 8.5in;
            margin: 0 auto;
            background: white;
            position: relative;
        }
        
        /* Header Section */
        .header {
            border-bottom: 4px solid #e74c3c;
            padding-bottom: 20px;
            margin-bottom: 30px;
            position: relative;
        }
        
        .header-content {
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
            border-radius: 8px;
            margin-bottom: 15px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        .company-name {
            font-size: 32px;
            font-weight: bold;
            color: #e74c3c;
            margin-bottom: 5px;
            letter-spacing: -1px;
        }
        
        .company-tagline {
            font-size: 14px;
            color: #7f8c8d;
            margin-bottom: 15px;
            font-style: italic;
        }
        
        .company-details {
            font-size: 12px;
            color: #34495e;
            line-height: 1.6;
        }
        
        .company-details div {
            margin-bottom: 4px;
        }
        
        .invoice-header {
            flex: 1;
            text-align: right;
            padding-left: 40px;
        }
        
        .invoice-title {
            font-size: 48px;
            font-weight: bold;
            color: #2c3e50;
            margin-bottom: 20px;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
        }
        
        .invoice-details {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #3498db;
            font-size: 13px;
        }
        
        .invoice-details div {
            margin-bottom: 8px;
            display: flex;
            justify-content: space-between;
        }
        
        .invoice-details strong {
            color: #2c3e50;
            margin-right: 10px;
        }
        
        /* Bill To Section */
        .billing-section {
            display: flex;
            gap: 40px;
            margin-bottom: 40px;
        }
        
        .bill-to, .ship-to {
            flex: 1;
            background: #ffffff;
            border: 2px solid #ecf0f1;
            border-radius: 8px;
            padding: 25px;
            position: relative;
        }
        
        .bill-to::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, #3498db, #2980b9);
            border-radius: 8px 8px 0 0;
        }
        
        .ship-to::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, #27ae60, #229954);
            border-radius: 8px 8px 0 0;
        }
        
        .section-title {
            font-size: 16px;
            font-weight: bold;
            color: #2c3e50;
            margin-bottom: 15px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .customer-info {
            font-size: 13px;
            line-height: 1.6;
            color: #34495e;
        }
        
        .customer-name {
            font-size: 16px;
            font-weight: bold;
            color: #2c3e50;
            margin-bottom: 8px;
        }
        
        /* Items Table */
        .items-section {
            margin-bottom: 40px;
        }
        
        .items-title {
            font-size: 18px;
            font-weight: bold;
            color: #2c3e50;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 2px solid #e74c3c;
        }
        
        .items-table {
            width: 100%;
            border-collapse: collapse;
            border: 1px solid #bdc3c7;
            border-radius: 8px;
            overflow: hidden;
        }
        
        .items-table th {
            background: linear-gradient(135deg, #34495e, #2c3e50);
            color: white;
            padding: 15px 12px;
            text-align: left;
            font-weight: bold;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .items-table th:first-child {
            text-align: center;
            width: 60px;
        }
        
        .items-table th:nth-child(3),
        .items-table th:nth-child(4),
        .items-table th:nth-child(5) {
            text-align: right;
            width: 100px;
        }
        
        .items-table td {
            padding: 12px;
            border-bottom: 1px solid #ecf0f1;
            font-size: 12px;
            vertical-align: top;
        }
        
        .items-table tbody tr:nth-child(even) {
            background: #f8f9fa;
        }
        
        .items-table tbody tr:hover {
            background: #e8f4fd;
        }
        
        .item-description {
            font-weight: bold;
            color: #2c3e50;
            margin-bottom: 4px;
        }
        
        .item-company {
            font-size: 11px;
            color: #7f8c8d;
            font-style: italic;
        }
        
        .quantity-badge {
            background: #3498db;
            color: white;
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: bold;
            display: inline-block;
        }
        
        .amount {
            font-weight: bold;
            color: #27ae60;
        }
        
        /* Totals Section */
        .totals-section {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 40px;
        }
        
        .totals-table {
            min-width: 400px;
            border-collapse: collapse;
            border: 2px solid #34495e;
            border-radius: 8px;
            overflow: hidden;
        }
        
        .totals-table td {
            padding: 12px 20px;
            font-size: 13px;
        }
        
        .totals-table tr:nth-child(1) td {
            background: #ecf0f1;
            border-bottom: 1px solid #bdc3c7;
        }
        
        .totals-table tr:nth-child(2) td {
            background: #d5f4e6;
            border-bottom: 1px solid #bdc3c7;
        }
        
        .totals-table tr:nth-child(3) td {
            background: #fef9e7;
            border-bottom: 1px solid #bdc3c7;
        }
        
        .totals-table tr:last-child td {
            background: linear-gradient(135deg, #e74c3c, #c0392b);
            color: white;
            font-weight: bold;
            font-size: 16px;
        }
        
        .totals-table td:first-child {
            font-weight: bold;
        }
        
        .totals-table td:last-child {
            text-align: right;
        }
        
        /* Footer Section */
        .footer {
            margin-top: 40px;
            padding-top: 30px;
            border-top: 2px solid #ecf0f1;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
        }
        
        .terms-section {
            flex: 2;
            padding-right: 40px;
        }
        
        .terms-title {
            font-size: 16px;
            font-weight: bold;
            color: #2c3e50;
            margin-bottom: 15px;
        }
        
        .terms-list {
            font-size: 11px;
            line-height: 1.6;
            color: #34495e;
        }
        
        .terms-list div {
            margin-bottom: 8px;
            padding-left: 15px;
            position: relative;
        }
        
        .terms-list div::before {
            content: '•';
            position: absolute;
            left: 0;
            color: #e74c3c;
            font-weight: bold;
        }
        
        .qr-section {
            flex: 1;
            text-align: center;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 8px;
            border: 2px dashed #bdc3c7;
        }
        
        .qr-title {
            font-size: 12px;
            font-weight: bold;
            color: #2c3e50;
            margin-bottom: 10px;
        }
        
        .qr-code {
            width: 100px;
            height: 100px;
            margin: 0 auto 10px;
            border: 2px solid #34495e;
            border-radius: 8px;
        }
        
        .qr-description {
            font-size: 10px;
            color: #7f8c8d;
            line-height: 1.4;
        }
        
        /* Footer Notes */
        .footer-notes {
            margin-top: 30px;
            text-align: center;
            font-size: 10px;
            color: #7f8c8d;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 8px;
            border: 1px solid #ecf0f1;
        }
        
        /* Status Badge */
        .status-badge {
            background: #27ae60;
            color: white;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 11px;
            font-weight: bold;
        }
        
        /* Payment Badge */
        .payment-badge {
            background: #3498db;
            color: white;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 11px;
            font-weight: bold;
        }
        
        /* Watermark */
        .watermark {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            font-size: 120px;
            color: rgba(231, 76, 60, 0.03);
            font-weight: bold;
            z-index: -1;
            pointer-events: none;
        }
        
        @media print {
            body { 
                margin: 0; 
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }
            .invoice-container { 
                box-shadow: none; 
                border: none; 
            }
            .watermark {
                display: block;
            }
        }
    </style>
</head>
<body>
    <div class="invoice-container">
        <!-- Watermark -->
        <div class="watermark">HARE KRISHNA MEDICAL</div>
        
        <!-- Header Section -->
        <div class="header">
            <div class="header-content">
                <div class="company-info">
                    <img src="${process.env.NODE_ENV === "production" ? "https://cdn.builder.io/api/v1/assets/139c2ae6a3bb4d7a819ea70b65921f45/invoice_hkm12345678-6f51e7" : "https://cdn.builder.io/api/v1/assets/139c2ae6a3bb4d7a819ea70b65921f45/invoice_hkm12345678-6f51e7"}" 
                         alt="Hare Krishna Medical" 
                         class="company-logo"
                         onerror="this.style.display='none';" />
                    
                    <div class="company-name">HARE KRISHNA MEDICAL</div>
                    <div class="company-tagline">Your Trusted Healthcare Partner</div>
                    
                    <div class="company-details">
                        <div><strong>Address:</strong> 3 Sahyog Complex, Man Sarovar Circle</div>
                        <div><strong>Location:</strong> Amroli, Surat - 394107, Gujarat, India</div>
                        <div><strong>Phone:</strong> +91 76989 13354 | +91 91060 18508</div>
                        <div><strong>Email:</strong> harekrishnamedical@gmail.com</div>
                        <div><strong>Website:</strong> www.harekrishan.medical</div>
                    </div>
                </div>
                
                <div class="invoice-header">
                    <div class="invoice-title">INVOICE</div>
                    <div class="invoice-details">
                        <div><strong>Invoice #:</strong> <span>${invoiceId}</span></div>
                        <div><strong>Order #:</strong> <span>${orderId}</span></div>
                        <div><strong>Date:</strong> <span>${orderDate}</span></div>
                        <div><strong>Time:</strong> <span>${orderTime}</span></div>
                        <div><strong>Status:</strong> <span class="status-badge">${status}</span></div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Billing Information -->
        <div class="billing-section">
            <div class="bill-to">
                <div class="section-title">📍 Bill To</div>
                <div class="customer-info">
                    <div class="customer-name">${customerDetails.fullName}</div>
                    <div><strong>Email:</strong> ${customerDetails.email}</div>
                    <div><strong>Phone:</strong> ${customerDetails.mobile}</div>
                    <div><strong>Address:</strong> ${customerDetails.address}</div>
                    <div><strong>City:</strong> ${customerDetails.city}, ${customerDetails.state}</div>
                    <div><strong>PIN:</strong> ${customerDetails.pincode}</div>
                </div>
            </div>
            
            <div class="ship-to">
                <div class="section-title">🚚 Ship To</div>
                <div class="customer-info">
                    <div class="customer-name">${customerDetails.fullName}</div>
                    <div><strong>Address:</strong> ${customerDetails.address}</div>
                    <div><strong>City:</strong> ${customerDetails.city}, ${customerDetails.state}</div>
                    <div><strong>PIN:</strong> ${customerDetails.pincode}</div>
                    <div style="margin-top: 15px;">
                        <div><strong>Payment Method:</strong> <span class="payment-badge">${paymentMethod}</span></div>
                        <div><strong>Payment Status:</strong> <span class="status-badge">${paymentStatus}</span></div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Items Table -->
        <div class="items-section">
            <div class="items-title">🛒 Medical Products & Services</div>
            <table class="items-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Description</th>
                        <th>Qty</th>
                        <th>Rate (₹)</th>
                        <th>Amount (₹)</th>
                    </tr>
                </thead>
                <tbody>
                    ${items
                      .map(
                        (item, index) => `
                        <tr>
                            <td style="text-align: center; font-weight: bold;">${index + 1}</td>
                            <td>
                                <div class="item-description">${item.name}</div>
                                <div class="item-company">${item.company || "Medical Product"}</div>
                            </td>
                            <td style="text-align: center;">
                                <span class="quantity-badge">${item.quantity}</span>
                            </td>
                            <td style="text-align: right;">₹${item.price.toFixed(2)}</td>
                            <td style="text-align: right;" class="amount">₹${(item.price * item.quantity).toFixed(2)}</td>
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
                        <td><strong>Subtotal</strong></td>
                        <td>₹${calculatedSubtotal.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td><strong>Shipping</strong></td>
                        <td>${shipping === 0 ? '<span style="color: #27ae60; font-weight: bold;">FREE</span>' : `₹${shipping.toFixed(2)}`}</td>
                    </tr>
                    <tr>
                        <td><strong>Tax (GST)</strong></td>
                        <td><span style="color: #27ae60; font-weight: bold;">Included</span></td>
                    </tr>
                    <tr>
                        <td><strong>TOTAL AMOUNT</strong></td>
                        <td><strong>₹${calculatedTotal.toFixed(2)}</strong></td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Footer Section -->
        <div class="footer">
            <div class="terms-section">
                <div class="terms-title">📋 Terms & Conditions</div>
                <div class="terms-list">
                    <div>Payment is due within 30 days of invoice date</div>
                    <div>All medical products are subject to proper usage guidelines</div>
                    <div>Returns accepted only for damaged or defective items</div>
                    <div>This invoice is computer generated and legally valid</div>
                    <div>Subject to Gujarat jurisdiction for any disputes</div>
                    <div>Keep this invoice for warranty and return purposes</div>
                </div>
                
                <div style="margin-top: 20px; font-size: 12px; color: #2c3e50;">
                    <strong>Contact Information:</strong><br>
                    For queries: harekrishnamedical@gmail.com<br>
                    Emergency: +91 76989 13354
                </div>
            </div>
            
            <div class="qr-section">
                <div class="qr-title">📱 Verification QR Code</div>
                ${generatedQR ? `<img src="${generatedQR}" alt="QR Code" class="qr-code" />` : '<div class="qr-code" style="display: flex; align-items: center; justify-content: center; border: 2px dashed #bdc3c7; background: #f8f9fa;"><span style="font-size: 10px; color: #7f8c8d;">QR Code</span></div>'}
                <div class="qr-description">
                    Scan to verify invoice authenticity<br>
                    and access online copy
                </div>
            </div>
        </div>

        <!-- Footer Notes -->
        <div class="footer-notes">
            <strong>🖥️ This is a computer generated invoice - No signature required</strong><br>
            Generated on: ${new Date().toLocaleString()} | 
            Invoice ID: ${invoiceId} | 
            🔒 This document is protected and verified
        </div>
    </div>
</body>
</html>`;
  };

  // Styles for screen display
  const screenStyles = {
    container: {
      maxWidth: "900px",
      margin: "0 auto",
      background: "white",
      boxShadow: "0 0 20px rgba(0,0,0,0.1)",
      borderRadius: "8px",
      overflow: "hidden",
      position: "relative",
      userSelect: "none",
      WebkitUserSelect: "none",
      MozUserSelect: "none",
      msUserSelect: "none",
    },

    printButton: {
      position: "fixed",
      top: "20px",
      right: "20px",
      zIndex: 1000,
      background: "linear-gradient(135deg, #e74c3c, #c0392b)",
      color: "white",
      border: "none",
      padding: "15px 25px",
      borderRadius: "25px",
      cursor: "pointer",
      fontSize: "16px",
      fontWeight: "600",
      boxShadow: "0 4px 15px rgba(231, 76, 60, 0.3)",
      transition: "all 0.3s ease",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },

    securityBadge: {
      position: "fixed",
      bottom: "20px",
      right: "20px",
      background: "rgba(52, 73, 94, 0.9)",
      color: "white",
      padding: "8px 15px",
      borderRadius: "20px",
      fontSize: "12px",
      zIndex: 999,
      display: "flex",
      alignItems: "center",
      gap: "5px",
    },
  };

  if (forPrint) {
    return <div dangerouslySetInnerHTML={{ __html: generatePrintHTML() }} />;
  }

  return (
    <div style={screenStyles.container}>
      {/* Print Button */}
      <button
        onClick={handlePrint}
        style={screenStyles.printButton}
        onMouseOver={(e) => {
          e.target.style.transform = "translateY(-2px)";
          e.target.style.boxShadow = "0 6px 20px rgba(231, 76, 60, 0.4)";
        }}
        onMouseOut={(e) => {
          e.target.style.transform = "translateY(0)";
          e.target.style.boxShadow = "0 4px 15px rgba(231, 76, 60, 0.3)";
        }}
      >
        <i className="bi bi-printer-fill"></i>
        Print Invoice
      </button>

      {/* Security Badge */}
      <div style={screenStyles.securityBadge}>
        <i className="bi bi-shield-check"></i>
        Protected Document
      </div>

      {/* Invoice Content */}
      <div dangerouslySetInnerHTML={{ __html: generatePrintHTML() }} />

      {/* Additional CSS for screen display */}
      <style>{`
        .invoice-container {
          padding: 40px;
        }
        
        .watermark {
          display: none;
        }
        
        @media screen {
          .invoice-container {
            border: none;
            border-radius: 8px;
          }
        }
        
        /* Prevent text selection on sensitive content */
        .invoice-container {
          -webkit-touch-callout: none;
          -webkit-user-select: none;
          -khtml-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }
        
        .invoice-container::selection {
          background: transparent;
        }
        
        .invoice-container::-moz-selection {
          background: transparent;
        }
      `}</style>
    </div>
  );
};

export default ProfessionalInvoice;
