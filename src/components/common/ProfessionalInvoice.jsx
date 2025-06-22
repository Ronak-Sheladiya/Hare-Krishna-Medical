import React, { useEffect, useState } from "react";
import QRCode from "qrcode";

const ProfessionalInvoice = ({
  invoiceData,
  qrCode = null,
  forPrint = false,
}) => {
  const [generatedQR, setGeneratedQR] = useState("");
  const [isPrintReady, setIsPrintReady] = useState(false);

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
          width: 100,
          margin: 1,
          color: {
            dark: "#1a365d",
            light: "#ffffff",
          },
        });
        setGeneratedQR(qrDataURL);
        setIsPrintReady(true);
      } catch (error) {
        console.error("QR generation error:", error);
        setIsPrintReady(true);
      }
    };

    if (invoiceId && orderId) {
      generateQR();
    }
  }, [invoiceId, orderId, total]);

  // Security measures for screen viewing
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

  // Enhanced print function with better handling
  const handlePrint = () => {
    if (!isPrintReady) {
      alert("Please wait, invoice is still loading...");
      return;
    }

    // Create a new window for printing
    const printWindow = window.open("", "_blank", "width=900,height=650");

    if (!printWindow) {
      alert("Please allow popups to enable printing functionality");
      return;
    }

    // Write the complete HTML structure
    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Invoice ${invoiceId} - Hare Krishna Medical</title>
        <style>
          ${getPrintStyles()}
        </style>
      </head>
      <body>
        ${generateInvoiceHTML()}
      </body>
      </html>
    `);

    printWindow.document.close();

    // Enhanced print handling
    const handlePrintExecution = () => {
      try {
        printWindow.focus();
        const printResult = printWindow.print();

        // Close window after a delay
        setTimeout(() => {
          if (printWindow && !printWindow.closed) {
            printWindow.close();
          }
        }, 1000);

        return printResult;
      } catch (error) {
        console.error("Print error:", error);
        alert("An error occurred while printing. Please try again.");
        if (printWindow && !printWindow.closed) {
          printWindow.close();
        }
      }
    };

    // Wait for content to load then print
    if (printWindow.document.readyState === "complete") {
      handlePrintExecution();
    } else {
      printWindow.onload = () => {
        setTimeout(handlePrintExecution, 300);
      };

      // Fallback timeout
      setTimeout(() => {
        if (printWindow && !printWindow.closed) {
          handlePrintExecution();
        }
      }, 1500);
    }
  };

  const getPrintStyles = () => {
    return `
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      @page {
        size: A4;
        margin: 15mm;
      }

      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        line-height: 1.4;
        color: #1a202c;
        background: white;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }

      .modern-invoice {
        width: 100%;
        max-width: 210mm;
        margin: 0 auto;
        background: white;
        position: relative;
      }

      /* Header Styles */
      .invoice-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 40px;
        padding-bottom: 20px;
        border-bottom: 3px solid #e53e3e;
      }

      .company-section {
        flex: 1.5;
      }

      .company-logo {
        width: 85px;
        height: 85px;
        object-fit: contain;
        margin-bottom: 15px;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      }

      .company-name {
        font-size: 28px;
        font-weight: bold;
        color: #e53e3e;
        margin-bottom: 8px;
        letter-spacing: -0.5px;
      }

      .company-tagline {
        font-size: 13px;
        color: #718096;
        margin-bottom: 15px;
        font-style: italic;
      }

      .company-contact {
        font-size: 11px;
        color: #4a5568;
        line-height: 1.6;
      }

      .company-contact div {
        margin-bottom: 3px;
        display: flex;
        align-items: center;
      }

      .contact-icon {
        margin-right: 8px;
        width: 12px;
        font-weight: bold;
        color: #e53e3e;
      }

      .invoice-meta {
        flex: 1;
        text-align: right;
        padding-left: 30px;
      }

      .invoice-title {
        font-size: 42px;
        font-weight: bold;
        color: #1a202c;
        margin-bottom: 20px;
        text-shadow: 0 1px 2px rgba(0,0,0,0.1);
      }

      .invoice-details-grid {
        background: #f7fafc;
        padding: 20px;
        border-radius: 8px;
        border-left: 4px solid #3182ce;
      }

      .detail-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 8px;
        font-size: 12px;
      }

      .detail-label {
        font-weight: 600;
        color: #2d3748;
      }

      .detail-value {
        color: #4a5568;
        font-weight: 500;
      }

      .status-badge {
        display: inline-block;
        background: #48bb78;
        color: white;
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 10px;
        font-weight: bold;
        text-transform: uppercase;
      }

      /* Customer Information */
      .customer-section {
        display: flex;
        gap: 30px;
        margin-bottom: 40px;
      }

      .customer-block {
        flex: 1;
        background: #ffffff;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        padding: 25px;
        position: relative;
      }

      .customer-block::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 3px;
        border-radius: 8px 8px 0 0;
      }

      .bill-to::before {
        background: linear-gradient(90deg, #3182ce, #2c5282);
      }

      .ship-to::before {
        background: linear-gradient(90deg, #38a169, #2f855a);
      }

      .customer-title {
        font-size: 14px;
        font-weight: bold;
        color: #2d3748;
        margin-bottom: 15px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        display: flex;
        align-items: center;
      }

      .customer-icon {
        margin-right: 8px;
        font-size: 16px;
      }

      .customer-name {
        font-size: 16px;
        font-weight: bold;
        color: #1a202c;
        margin-bottom: 12px;
      }

      .customer-info {
        font-size: 12px;
        line-height: 1.6;
        color: #4a5568;
      }

      .customer-info div {
        margin-bottom: 6px;
      }

      .info-label {
        font-weight: 600;
        color: #2d3748;
        margin-right: 8px;
      }

      /* Items Table */
      .items-section {
        margin-bottom: 40px;
      }

      .items-header {
        background: linear-gradient(135deg, #2d3748, #1a202c);
        color: white;
        padding: 15px 0;
        text-align: center;
        margin-bottom: 0;
        border-radius: 8px 8px 0 0;
      }

      .items-title {
        font-size: 16px;
        font-weight: bold;
        margin: 0;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .items-table {
        width: 100%;
        border-collapse: collapse;
        border: 1px solid #e2e8f0;
        border-radius: 0 0 8px 8px;
        overflow: hidden;
      }

      .items-table th {
        background: #f7fafc;
        color: #2d3748;
        padding: 15px 12px;
        text-align: left;
        font-weight: bold;
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        border-bottom: 2px solid #e2e8f0;
      }

      .items-table th:first-child {
        text-align: center;
        width: 50px;
      }

      .items-table th:nth-child(3),
      .items-table th:nth-child(4),
      .items-table th:nth-child(5) {
        text-align: right;
        width: 100px;
      }

      .items-table td {
        padding: 15px 12px;
        border-bottom: 1px solid #f1f5f9;
        font-size: 11px;
        vertical-align: middle;
      }

      .items-table tbody tr:nth-child(even) {
        background: #fafafa;
      }

      .item-number {
        text-align: center;
        font-weight: bold;
        color: #3182ce;
      }

      .item-description {
        font-weight: 600;
        color: #1a202c;
        margin-bottom: 4px;
        font-size: 12px;
      }

      .item-company {
        font-size: 10px;
        color: #718096;
        font-style: italic;
      }

      .quantity-cell {
        text-align: center;
      }

      .quantity-badge {
        background: #3182ce;
        color: white;
        padding: 4px 10px;
        border-radius: 15px;
        font-size: 10px;
        font-weight: bold;
      }

      .amount-cell {
        text-align: right;
        font-weight: 600;
        color: #38a169;
        font-size: 12px;
      }

      .price-cell {
        text-align: right;
        color: #4a5568;
        font-weight: 500;
      }

      /* Totals Section */
      .totals-section {
        display: flex;
        justify-content: flex-end;
        margin-bottom: 40px;
      }

      .totals-container {
        min-width: 350px;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        overflow: hidden;
      }

      .totals-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 20px;
        font-size: 12px;
        border-bottom: 1px solid #f1f5f9;
      }

      .totals-row:last-child {
        border-bottom: none;
      }

      .totals-row.subtotal {
        background: #f7fafc;
      }

      .totals-row.shipping {
        background: #f0fff4;
      }

      .totals-row.tax {
        background: #fffaf0;
      }

      .totals-row.total {
        background: linear-gradient(135deg, #e53e3e, #c53030);
        color: white;
        font-weight: bold;
        font-size: 14px;
      }

      .totals-label {
        font-weight: 600;
      }

      .totals-value {
        font-weight: 600;
      }

      .free-text {
        color: #38a169;
        font-weight: bold;
      }

      .included-text {
        color: #3182ce;
        font-weight: bold;
      }

      /* Footer Section */
      .invoice-footer {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-top: 40px;
        padding-top: 30px;
        border-top: 2px solid #f1f5f9;
      }

      .footer-left {
        flex: 2;
        padding-right: 40px;
      }

      .footer-title {
        font-size: 14px;
        font-weight: bold;
        color: #1a202c;
        margin-bottom: 15px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .terms-list {
        font-size: 10px;
        line-height: 1.6;
        color: #4a5568;
      }

      .terms-list li {
        margin-bottom: 6px;
        list-style: none;
        position: relative;
        padding-left: 15px;
      }

      .terms-list li::before {
        content: '•';
        color: #e53e3e;
        font-weight: bold;
        position: absolute;
        left: 0;
      }

      .contact-info {
        margin-top: 20px;
        padding: 15px;
        background: #f7fafc;
        border-radius: 6px;
        border-left: 3px solid #3182ce;
      }

      .contact-info-title {
        font-weight: bold;
        color: #2d3748;
        font-size: 11px;
        margin-bottom: 8px;
      }

      .contact-details {
        font-size: 10px;
        color: #4a5568;
        line-height: 1.5;
      }

      .footer-right {
        flex: 1;
        text-align: center;
      }

      .qr-container {
        background: #ffffff;
        border: 2px solid #e2e8f0;
        border-radius: 8px;
        padding: 20px;
        text-align: center;
      }

      .qr-title {
        font-size: 11px;
        font-weight: bold;
        color: #2d3748;
        margin-bottom: 12px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .qr-code {
        width: 80px;
        height: 80px;
        margin: 0 auto 10px;
        border: 1px solid #e2e8f0;
        border-radius: 4px;
      }

      .qr-description {
        font-size: 9px;
        color: #718096;
        line-height: 1.4;
      }

      /* Bottom Notes */
      .invoice-notes {
        margin-top: 30px;
        text-align: center;
        padding: 15px;
        background: #f7fafc;
        border-radius: 6px;
        border: 1px solid #e2e8f0;
      }

      .notes-content {
        font-size: 9px;
        color: #718096;
        line-height: 1.5;
      }

      .notes-highlight {
        font-weight: bold;
        color: #2d3748;
      }

      /* Print specific adjustments */
      @media print {
        body { 
          margin: 0;
          padding: 0;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        
        .modern-invoice {
          box-shadow: none;
          border: none;
          page-break-inside: avoid;
        }
        
        .items-table {
          page-break-inside: avoid;
        }
        
        .invoice-footer {
          page-break-inside: avoid;
        }
      }
    `;
  };

  const generateInvoiceHTML = () => {
    return `
      <div class="modern-invoice">
        <!-- Header Section -->
        <div class="invoice-header">
          <div class="company-section">
            <img src="https://cdn.builder.io/api/v1/assets/139c2ae6a3bb4d7a819ea70b65921f45/invoice_hkm12345678-321076" 
                 alt="Hare Krishna Medical" 
                 class="company-logo"
                 onerror="this.style.display='none';" />
            
            <div class="company-name">HARE KRISHNA MEDICAL</div>
            <div class="company-tagline">Your Trusted Healthcare Partner</div>
            
            <div class="company-contact">
              <div><span class="contact-icon">📍</span>3 Sahyog Complex, Man Sarovar Circle</div>
              <div><span class="contact-icon">🏙️</span>Amroli, Surat - 394107, Gujarat, India</div>
              <div><span class="contact-icon">📞</span>+91 76989 13354 | +91 91060 18508</div>
              <div><span class="contact-icon">📧</span>harekrishnamedical@gmail.com</div>
              <div><span class="contact-icon">🌐</span>www.harekrishan.medical</div>
            </div>
          </div>
          
          <div class="invoice-meta">
            <div class="invoice-title">INVOICE</div>
            <div class="invoice-details-grid">
              <div class="detail-row">
                <span class="detail-label">Invoice Number:</span>
                <span class="detail-value">${invoiceId}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Order Number:</span>
                <span class="detail-value">${orderId}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Invoice Date:</span>
                <span class="detail-value">${orderDate}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Invoice Time:</span>
                <span class="detail-value">${orderTime}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Status:</span>
                <span class="status-badge">${status}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Customer Information -->
        <div class="customer-section">
          <div class="customer-block bill-to">
            <div class="customer-title">
              <span class="customer-icon">📋</span>Bill To
            </div>
            <div class="customer-name">${customerDetails.fullName}</div>
            <div class="customer-info">
              <div><span class="info-label">Email:</span>${customerDetails.email}</div>
              <div><span class="info-label">Phone:</span>${customerDetails.mobile}</div>
              <div><span class="info-label">Address:</span>${customerDetails.address}</div>
              <div><span class="info-label">City:</span>${customerDetails.city}, ${customerDetails.state}</div>
              <div><span class="info-label">PIN Code:</span>${customerDetails.pincode}</div>
            </div>
          </div>
          
          <div class="customer-block ship-to">
            <div class="customer-title">
              <span class="customer-icon">🚚</span>Ship To
            </div>
            <div class="customer-name">${customerDetails.fullName}</div>
            <div class="customer-info">
              <div><span class="info-label">Address:</span>${customerDetails.address}</div>
              <div><span class="info-label">City:</span>${customerDetails.city}, ${customerDetails.state}</div>
              <div><span class="info-label">PIN Code:</span>${customerDetails.pincode}</div>
              <div style="margin-top: 15px;">
                <div><span class="info-label">Payment Method:</span>${paymentMethod}</div>
                <div><span class="info-label">Payment Status:</span><span class="status-badge">${paymentStatus}</span></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Items Section -->
        <div class="items-section">
          <div class="items-header">
            <div class="items-title">🛒 Medical Products & Services</div>
          </div>
          <table class="items-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Description</th>
                <th>Qty</th>
                <th>Unit Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${items
                .map(
                  (item, index) => `
                <tr>
                  <td class="item-number">${index + 1}</td>
                  <td>
                    <div class="item-description">${item.name}</div>
                    <div class="item-company">${item.company || "Medical Product"}</div>
                  </td>
                  <td class="quantity-cell">
                    <span class="quantity-badge">${item.quantity}</span>
                  </td>
                  <td class="price-cell">₹${item.price.toFixed(2)}</td>
                  <td class="amount-cell">₹${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              `,
                )
                .join("")}
            </tbody>
          </table>
        </div>

        <!-- Totals Section -->
        <div class="totals-section">
          <div class="totals-container">
            <div class="totals-row subtotal">
              <span class="totals-label">Subtotal:</span>
              <span class="totals-value">₹${calculatedSubtotal.toFixed(2)}</span>
            </div>
            <div class="totals-row shipping">
              <span class="totals-label">Shipping & Handling:</span>
              <span class="totals-value ${shipping === 0 ? "free-text" : ""}">
                ${shipping === 0 ? "FREE" : `₹${shipping.toFixed(2)}`}
              </span>
            </div>
            <div class="totals-row tax">
              <span class="totals-label">Tax (GST):</span>
              <span class="totals-value included-text">Included in Price</span>
            </div>
            <div class="totals-row total">
              <span class="totals-label">TOTAL AMOUNT:</span>
              <span class="totals-value">₹${calculatedTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <!-- Footer Section -->
        <div class="invoice-footer">
          <div class="footer-left">
            <div class="footer-title">📋 Terms & Conditions</div>
            <ul class="terms-list">
              <li>Payment is due within 30 days from the invoice date</li>
              <li>All medical products are subject to proper usage guidelines</li>
              <li>Returns are accepted only for damaged or defective items within 7 days</li>
              <li>This invoice is computer-generated and legally valid without signature</li>
              <li>Subject to Gujarat jurisdiction for any legal disputes</li>
              <li>Keep this invoice safe for warranty and return purposes</li>
            </ul>
            
            <div class="contact-info">
              <div class="contact-info-title">📞 Contact Information</div>
              <div class="contact-details">
                For queries: harekrishnamedical@gmail.com<br>
                Customer Support: +91 76989 13354<br>
                Emergency Contact: +91 91060 18508
              </div>
            </div>
          </div>
          
          <div class="footer-right">
            <div class="qr-container">
              <div class="qr-title">📱 Verification QR</div>
              ${generatedQR ? `<img src="${generatedQR}" alt="QR Code" class="qr-code" />` : '<div class="qr-code" style="display: flex; align-items: center; justify-content: center; border: 2px dashed #e2e8f0; background: #f7fafc; color: #718096; font-size: 10px;">QR Code</div>'}
              <div class="qr-description">
                Scan to verify invoice<br>
                authenticity online
              </div>
            </div>
          </div>
        </div>

        <!-- Bottom Notes -->
        <div class="invoice-notes">
          <div class="notes-content">
            <span class="notes-highlight">🖥️ This is a computer-generated invoice - No signature required</span><br>
            Generated on: ${new Date().toLocaleString()} | 
            Invoice ID: ${invoiceId} | 
            <span class="notes-highlight">🔒 This document is protected and verified</span>
          </div>
        </div>
      </div>
    `;
  };

  if (forPrint) {
    return (
      <div
        style={{ width: "100%", height: "100%" }}
        dangerouslySetInnerHTML={{ __html: generateInvoiceHTML() }}
      />
    );
  }

  return (
    <div
      style={{
        maxWidth: "1000px",
        margin: "0 auto",
        background: "white",
        boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
        borderRadius: "12px",
        overflow: "hidden",
        position: "relative",
        userSelect: "none",
        WebkitUserSelect: "none",
        MozUserSelect: "none",
        msUserSelect: "none",
      }}
    >
      {/* Modern Print Button */}
      <button
        onClick={handlePrint}
        disabled={!isPrintReady}
        style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          zIndex: 1000,
          background: isPrintReady
            ? "linear-gradient(135deg, #e53e3e, #c53030)"
            : "#a0aec0",
          color: "white",
          border: "none",
          padding: "15px 25px",
          borderRadius: "30px",
          cursor: isPrintReady ? "pointer" : "not-allowed",
          fontSize: "16px",
          fontWeight: "600",
          boxShadow: isPrintReady
            ? "0 4px 20px rgba(229, 62, 62, 0.3)"
            : "0 2px 10px rgba(160, 174, 192, 0.3)",
          transition: "all 0.3s ease",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontFamily: "inherit",
        }}
        onMouseOver={(e) => {
          if (isPrintReady) {
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow = "0 6px 25px rgba(229, 62, 62, 0.4)";
          }
        }}
        onMouseOut={(e) => {
          if (isPrintReady) {
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "0 4px 20px rgba(229, 62, 62, 0.3)";
          }
        }}
      >
        <span style={{ fontSize: "18px" }}>🖨️</span>
        {isPrintReady ? "Print Invoice" : "Loading..."}
      </button>

      {/* Security Badge */}
      <div
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          background: "rgba(26, 32, 44, 0.9)",
          color: "white",
          padding: "8px 15px",
          borderRadius: "20px",
          fontSize: "12px",
          zIndex: 999,
          display: "flex",
          alignItems: "center",
          gap: "5px",
          fontFamily: "inherit",
        }}
      >
        <span style={{ fontSize: "14px" }}>🔒</span>
        Protected Document
      </div>

      {/* Invoice Content with Modern Styling */}
      <div
        style={{
          padding: "40px",
          background: "white",
        }}
        dangerouslySetInnerHTML={{ __html: generateInvoiceHTML() }}
      />

      {/* Additional CSS for screen display */}
      <style>{`
        ${getPrintStyles()}
        
        .modern-invoice {
          border: none;
          box-shadow: none;
        }
        
        /* Prevent text selection on sensitive content */
        .modern-invoice {
          -webkit-touch-callout: none;
          -webkit-user-select: none;
          -khtml-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }
        
        .modern-invoice::selection {
          background: transparent;
        }
        
        .modern-invoice::-moz-selection {
          background: transparent;
        }
        
        /* Screen-specific adjustments */
        @media screen {
          .modern-invoice {
            border-radius: 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default ProfessionalInvoice;
