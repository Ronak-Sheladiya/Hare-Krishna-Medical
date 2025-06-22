import React, { useEffect, useState } from "react";
import QRCode from "qrcode";

const ProfessionalInvoice = ({
  invoiceData,
  qrCode = null,
  forPrint = false,
}) => {
  const [generatedQR, setGeneratedQR] = useState("");
  const [isPrintReady, setIsPrintReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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
        setIsLoading(true);
        const qrText = `Invoice: ${invoiceId}\nOrder: ${orderId}\nAmount: ₹${total}\nVerify: https://harekrishan.medical/verify/${invoiceId}`;
        const qrDataURL = await QRCode.toDataURL(qrText, {
          width: 100,
          margin: 1,
          color: {
            dark: "#1a202c",
            light: "#ffffff",
          },
        });
        setGeneratedQR(qrDataURL);
        setIsPrintReady(true);
      } catch (error) {
        console.error("QR generation error:", error);
        setIsPrintReady(true);
      } finally {
        setIsLoading(false);
      }
    };

    if (invoiceId && orderId) {
      generateQR();
    } else {
      setIsLoading(false);
      setIsPrintReady(true);
    }
  }, [invoiceId, orderId, total]);

  // Calculate totals
  const calculatedSubtotal =
    subtotal ||
    items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const calculatedTotal = total || calculatedSubtotal + shipping;

  // Enhanced print function
  const handlePrint = async () => {
    if (!isPrintReady || isLoading) {
      alert("Please wait, invoice is still loading...");
      return;
    }

    try {
      // Create print window with better configuration
      const printWindow = window.open(
        "",
        "PRINT",
        "height=800,width=1000,toolbar=no,menubar=no,scrollbars=yes,resizable=yes",
      );

      if (!printWindow) {
        alert("Please allow popups for printing functionality");
        return;
      }

      // Generate complete HTML for printing
      const printHTML = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Invoice ${invoiceId} - Hare Krishna Medical</title>
          <style>
            ${getPrintCSS()}
          </style>
        </head>
        <body onload="window.print(); window.close();">
          ${generateInvoiceHTML()}
        </body>
        </html>
      `;

      // Write HTML content
      printWindow.document.write(printHTML);
      printWindow.document.close();

      // Focus on print window
      printWindow.focus();
    } catch (error) {
      console.error("Print error:", error);
      alert("An error occurred while printing. Please try again.");
    }
  };

  const getPrintCSS = () => {
    return `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
      
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      @page {
        size: A4;
        margin: 10mm;
      }

      body {
        font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        line-height: 1.4;
        color: #1a202c;
        background: white;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
        font-size: 12px;
      }

      .professional-invoice {
        width: 100%;
        max-width: 210mm;
        margin: 0 auto;
        background: white;
        position: relative;
      }

      /* Header Section - Professional */
      .invoice-header {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 40px;
        margin-bottom: 50px;
        padding-bottom: 25px;
        border-bottom: 4px solid #e53e3e;
        position: relative;
      }

      .company-section {
        display: flex;
        flex-direction: column;
      }

      .company-brand {
        display: flex;
        align-items: center;
        margin-bottom: 20px;
      }

      .company-logo {
        width: 90px;
        height: 90px;
        object-fit: contain;
        margin-right: 20px;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      }

      .brand-text {
        flex: 1;
      }

      .company-name {
        font-size: 32px;
        font-weight: 700;
        color: #e53e3e;
        margin-bottom: 8px;
        letter-spacing: -0.8px;
        line-height: 1.1;
      }

      .company-tagline {
        font-size: 14px;
        color: #718096;
        font-weight: 500;
        margin-bottom: 20px;
        font-style: italic;
      }

      .company-details {
        background: #f8fafc;
        padding: 20px;
        border-radius: 12px;
        border-left: 5px solid #3182ce;
      }

      .detail-group {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
        font-size: 11px;
        line-height: 1.6;
      }

      .detail-item {
        display: flex;
        align-items: center;
        color: #4a5568;
      }

      .detail-icon {
        margin-right: 8px;
        font-size: 12px;
        color: #e53e3e;
        font-weight: bold;
        width: 14px;
      }

      .invoice-meta {
        text-align: right;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }

      .invoice-title {
        font-size: 48px;
        font-weight: 800;
        color: #1a202c;
        margin-bottom: 25px;
        text-shadow: 0 2px 4px rgba(0,0,0,0.1);
        letter-spacing: -1px;
      }

      .invoice-info {
        background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
        padding: 25px;
        border-radius: 12px;
        border: 1px solid #e2e8f0;
        box-shadow: 0 2px 8px rgba(0,0,0,0.05);
      }

      .info-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 12px;
        font-size: 12px;
        align-items: center;
      }

      .info-row:last-child {
        margin-bottom: 0;
      }

      .info-label {
        font-weight: 600;
        color: #2d3748;
      }

      .info-value {
        font-weight: 500;
        color: #4a5568;
      }

      .status-badge {
        background: linear-gradient(135deg, #48bb78, #38a169);
        color: white;
        padding: 6px 14px;
        border-radius: 20px;
        font-size: 10px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        box-shadow: 0 2px 4px rgba(72, 187, 120, 0.3);
      }

      /* Customer Section - Modern Grid */
      .customer-section {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 30px;
        margin-bottom: 50px;
      }

      .customer-block {
        background: white;
        border: 2px solid #e2e8f0;
        border-radius: 12px;
        padding: 30px;
        position: relative;
        transition: all 0.3s ease;
      }

      .customer-block::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 6px;
        border-radius: 12px 12px 0 0;
      }

      .bill-to::before {
        background: linear-gradient(90deg, #3182ce, #2c5282);
      }

      .ship-to::before {
        background: linear-gradient(90deg, #38a169, #2f855a);
      }

      .customer-header {
        display: flex;
        align-items: center;
        margin-bottom: 20px;
        padding-bottom: 12px;
        border-bottom: 1px solid #f1f5f9;
      }

      .customer-icon {
        font-size: 18px;
        margin-right: 10px;
        color: #4a5568;
      }

      .customer-title {
        font-size: 16px;
        font-weight: 700;
        color: #2d3748;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .customer-name {
        font-size: 18px;
        font-weight: 700;
        color: #1a202c;
        margin-bottom: 15px;
        letter-spacing: -0.2px;
      }

      .customer-details {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .detail-row {
        display: flex;
        align-items: flex-start;
        font-size: 12px;
        line-height: 1.5;
      }

      .detail-label {
        font-weight: 600;
        color: #4a5568;
        min-width: 80px;
        margin-right: 10px;
      }

      .detail-value {
        color: #2d3748;
        font-weight: 500;
        flex: 1;
      }

      /* Items Section - Professional Table */
      .items-section {
        margin-bottom: 50px;
      }

      .section-header {
        background: linear-gradient(135deg, #2d3748, #1a202c);
        color: white;
        padding: 20px 30px;
        margin-bottom: 0;
        border-radius: 12px 12px 0 0;
        text-align: center;
      }

      .section-title {
        font-size: 18px;
        font-weight: 700;
        margin: 0;
        text-transform: uppercase;
        letter-spacing: 1px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
      }

      .items-table {
        width: 100%;
        border-collapse: collapse;
        border: 2px solid #e2e8f0;
        border-radius: 0 0 12px 12px;
        overflow: hidden;
        box-shadow: 0 4px 12px rgba(0,0,0,0.05);
      }

      .items-table th {
        background: linear-gradient(135deg, #f7fafc, #edf2f7);
        color: #2d3748;
        padding: 18px 15px;
        text-align: left;
        font-weight: 700;
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        border-bottom: 2px solid #e2e8f0;
      }

      .items-table th:first-child { text-align: center; width: 60px; }
      .items-table th:nth-child(3) { text-align: center; width: 80px; }
      .items-table th:nth-child(4),
      .items-table th:nth-child(5) { text-align: right; width: 120px; }

      .items-table td {
        padding: 20px 15px;
        border-bottom: 1px solid #f1f5f9;
        font-size: 12px;
        vertical-align: top;
      }

      .items-table tbody tr:nth-child(even) {
        background: #fafbfc;
      }

      .items-table tbody tr:hover {
        background: #f0f9ff;
      }

      .item-number {
        text-align: center;
        font-weight: 700;
        color: #3182ce;
        font-size: 14px;
      }

      .item-description {
        font-weight: 600;
        color: #1a202c;
        margin-bottom: 6px;
        font-size: 13px;
        line-height: 1.3;
      }

      .item-company {
        font-size: 10px;
        color: #718096;
        font-style: italic;
        font-weight: 500;
      }

      .quantity-cell {
        text-align: center;
      }

      .quantity-badge {
        background: linear-gradient(135deg, #3182ce, #2c5282);
        color: white;
        padding: 6px 12px;
        border-radius: 16px;
        font-size: 11px;
        font-weight: 700;
        display: inline-block;
        min-width: 35px;
        box-shadow: 0 2px 4px rgba(49, 130, 206, 0.3);
      }

      .price-cell,
      .amount-cell {
        text-align: right;
        font-weight: 600;
        font-size: 12px;
      }

      .price-cell {
        color: #4a5568;
      }

      .amount-cell {
        color: #38a169;
        font-weight: 700;
      }

      /* Totals Section - Professional */
      .totals-section {
        display: flex;
        justify-content: flex-end;
        margin-bottom: 50px;
      }

      .totals-container {
        min-width: 400px;
        border: 2px solid #e2e8f0;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 12px rgba(0,0,0,0.05);
      }

      .total-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px 25px;
        font-size: 13px;
        border-bottom: 1px solid #f1f5f9;
        transition: all 0.2s ease;
      }

      .total-row:last-child {
        border-bottom: none;
      }

      .total-row.subtotal {
        background: linear-gradient(135deg, #f7fafc, #edf2f7);
      }

      .total-row.shipping {
        background: linear-gradient(135deg, #f0fff4, #dcfce7);
      }

      .total-row.tax {
        background: linear-gradient(135deg, #fffbeb, #fef3c7);
      }

      .total-row.grand-total {
        background: linear-gradient(135deg, #e53e3e, #c53030);
        color: white;
        font-weight: 700;
        font-size: 16px;
        padding: 20px 25px;
      }

      .total-label {
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .total-value {
        font-weight: 700;
      }

      .free-text {
        color: #38a169;
        font-weight: 700;
      }

      .included-text {
        color: #3182ce;
        font-weight: 700;
      }

      /* Footer Section - Professional */
      .invoice-footer {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 40px;
        margin-top: 50px;
        padding-top: 30px;
        border-top: 3px solid #f1f5f9;
      }

      .footer-content {
        display: flex;
        flex-direction: column;
      }

      .footer-section {
        margin-bottom: 30px;
      }

      .footer-section:last-child {
        margin-bottom: 0;
      }

      .footer-title {
        font-size: 16px;
        font-weight: 700;
        color: #1a202c;
        margin-bottom: 15px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .terms-list {
        list-style: none;
        padding: 0;
        margin: 0;
      }

      .terms-list li {
        margin-bottom: 8px;
        font-size: 11px;
        line-height: 1.5;
        color: #4a5568;
        position: relative;
        padding-left: 20px;
      }

      .terms-list li::before {
        content: '●';
        color: #e53e3e;
        font-weight: bold;
        position: absolute;
        left: 0;
        top: 0;
      }

      .contact-box {
        background: linear-gradient(135deg, #f7fafc, #edf2f7);
        padding: 20px;
        border-radius: 10px;
        border-left: 4px solid #3182ce;
        margin-top: 20px;
      }

      .contact-title {
        font-weight: 700;
        color: #2d3748;
        font-size: 12px;
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        gap: 6px;
      }

      .contact-details {
        font-size: 10px;
        color: #4a5568;
        line-height: 1.6;
      }

      .qr-section {
        text-align: center;
        background: white;
        border: 2px solid #e2e8f0;
        border-radius: 12px;
        padding: 25px;
        height: fit-content;
      }

      .qr-title {
        font-size: 12px;
        font-weight: 700;
        color: #2d3748;
        margin-bottom: 15px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
      }

      .qr-code {
        width: 100px;
        height: 100px;
        margin: 0 auto 15px;
        border: 2px solid #f1f5f9;
        border-radius: 8px;
        display: block;
      }

      .qr-placeholder {
        width: 100px;
        height: 100px;
        margin: 0 auto 15px;
        border: 2px dashed #cbd5e0;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f7fafc;
        color: #718096;
        font-size: 10px;
        font-weight: 600;
      }

      .qr-description {
        font-size: 9px;
        color: #718096;
        line-height: 1.4;
        font-weight: 500;
      }

      /* Bottom Notes */
      .invoice-notes {
        margin-top: 40px;
        text-align: center;
        padding: 20px;
        background: linear-gradient(135deg, #f8fafc, #f1f5f9);
        border-radius: 10px;
        border: 1px solid #e2e8f0;
      }

      .notes-content {
        font-size: 10px;
        color: #718096;
        line-height: 1.6;
      }

      .notes-highlight {
        font-weight: 700;
        color: #2d3748;
      }

      /* Print Optimizations */
      @media print {
        body { 
          margin: 0;
          padding: 0;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        
        .professional-invoice {
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

        .totals-section {
          page-break-inside: avoid;
        }
      }
    `;
  };

  const generateInvoiceHTML = () => {
    return `
      <div class="professional-invoice">
        <!-- Header Section -->
        <div class="invoice-header">
          <div class="company-section">
            <div class="company-brand">
              <img src="https://cdn.builder.io/api/v1/assets/139c2ae6a3bb4d7a819ea70b65921f45/invoice_hkm12345678-321076" 
                   alt="Hare Krishna Medical" 
                   class="company-logo"
                   onerror="this.style.display='none';" />
              <div class="brand-text">
                <div class="company-name">HARE KRISHNA MEDICAL</div>
                <div class="company-tagline">Your Trusted Healthcare Partner</div>
              </div>
            </div>
            
            <div class="company-details">
              <div class="detail-group">
                <div class="detail-item">
                  <span class="detail-icon">📍</span>
                  <span>3 Sahyog Complex, Man Sarovar Circle</span>
                </div>
                <div class="detail-item">
                  <span class="detail-icon">🏙️</span>
                  <span>Amroli, Surat - 394107, Gujarat</span>
                </div>
                <div class="detail-item">
                  <span class="detail-icon">📞</span>
                  <span>+91 76989 13354</span>
                </div>
                <div class="detail-item">
                  <span class="detail-icon">📱</span>
                  <span>+91 91060 18508</span>
                </div>
                <div class="detail-item">
                  <span class="detail-icon">📧</span>
                  <span>harekrishnamedical@gmail.com</span>
                </div>
                <div class="detail-item">
                  <span class="detail-icon">🌐</span>
                  <span>www.harekrishan.medical</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="invoice-meta">
            <div class="invoice-title">INVOICE</div>
            <div class="invoice-info">
              <div class="info-row">
                <span class="info-label">Invoice Number:</span>
                <span class="info-value">${invoiceId}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Order Number:</span>
                <span class="info-value">${orderId}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Invoice Date:</span>
                <span class="info-value">${orderDate}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Invoice Time:</span>
                <span class="info-value">${orderTime}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Status:</span>
                <span class="status-badge">${status}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Customer Information -->
        <div class="customer-section">
          <div class="customer-block bill-to">
            <div class="customer-header">
              <span class="customer-icon">📋</span>
              <span class="customer-title">Bill To</span>
            </div>
            <div class="customer-name">${customerDetails.fullName}</div>
            <div class="customer-details">
              <div class="detail-row">
                <span class="detail-label">Email:</span>
                <span class="detail-value">${customerDetails.email}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Phone:</span>
                <span class="detail-value">${customerDetails.mobile}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Address:</span>
                <span class="detail-value">${customerDetails.address}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">City:</span>
                <span class="detail-value">${customerDetails.city}, ${customerDetails.state}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">PIN Code:</span>
                <span class="detail-value">${customerDetails.pincode}</span>
              </div>
            </div>
          </div>
          
          <div class="customer-block ship-to">
            <div class="customer-header">
              <span class="customer-icon">🚚</span>
              <span class="customer-title">Ship To</span>
            </div>
            <div class="customer-name">${customerDetails.fullName}</div>
            <div class="customer-details">
              <div class="detail-row">
                <span class="detail-label">Address:</span>
                <span class="detail-value">${customerDetails.address}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">City:</span>
                <span class="detail-value">${customerDetails.city}, ${customerDetails.state}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">PIN Code:</span>
                <span class="detail-value">${customerDetails.pincode}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Payment:</span>
                <span class="detail-value">${paymentMethod}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Status:</span>
                <span class="status-badge">${paymentStatus}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Items Section -->
        <div class="items-section">
          <div class="section-header">
            <div class="section-title">
              <span>🛒</span>
              <span>Medical Products & Services</span>
            </div>
          </div>
          <table class="items-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Description</th>
                <th>Qty</th>
                <th>Unit Price</th>
                <th>Total Amount</th>
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
            <div class="total-row subtotal">
              <span class="total-label">
                <span>📊</span>
                <span>Subtotal</span>
              </span>
              <span class="total-value">₹${calculatedSubtotal.toFixed(2)}</span>
            </div>
            <div class="total-row shipping">
              <span class="total-label">
                <span>🚚</span>
                <span>Shipping & Handling</span>
              </span>
              <span class="total-value ${shipping === 0 ? "free-text" : ""}">
                ${shipping === 0 ? "FREE" : `₹${shipping.toFixed(2)}`}
              </span>
            </div>
            <div class="total-row tax">
              <span class="total-label">
                <span>📋</span>
                <span>Tax (GST)</span>
              </span>
              <span class="total-value included-text">Included in Price</span>
            </div>
            <div class="total-row grand-total">
              <span class="total-label">
                <span>💎</span>
                <span>TOTAL AMOUNT</span>
              </span>
              <span class="total-value">₹${calculatedTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <!-- Footer Section -->
        <div class="invoice-footer">
          <div class="footer-content">
            <div class="footer-section">
              <div class="footer-title">
                <span>📋</span>
                <span>Terms & Conditions</span>
              </div>
              <ul class="terms-list">
                <li>Payment is due within 30 days from the invoice date</li>
                <li>All medical products are subject to proper usage guidelines and prescriptions</li>
                <li>Returns are accepted only for damaged or defective items within 7 days of delivery</li>
                <li>This invoice is computer-generated and legally valid without physical signature</li>
                <li>Subject to Gujarat jurisdiction for any legal disputes or claims</li>
                <li>Keep this invoice safe for warranty claims and return purposes</li>
                <li>All prices are inclusive of applicable taxes and charges</li>
              </ul>
            </div>
            
            <div class="footer-section">
              <div class="contact-box">
                <div class="contact-title">
                  <span>📞</span>
                  <span>Contact Information</span>
                </div>
                <div class="contact-details">
                  <strong>Customer Support:</strong> harekrishnamedical@gmail.com<br>
                  <strong>Phone Support:</strong> +91 76989 13354<br>
                  <strong>Emergency Contact:</strong> +91 91060 18508<br>
                  <strong>Business Hours:</strong> Mon-Sat, 9:00 AM - 8:00 PM
                </div>
              </div>
            </div>
          </div>
          
          <div class="qr-section">
            <div class="qr-title">
              <span>📱</span>
              <span>Verification QR</span>
            </div>
            ${generatedQR ? `<img src="${generatedQR}" alt="QR Code" class="qr-code" />` : '<div class="qr-placeholder">QR Code</div>'}
            <div class="qr-description">
              Scan this QR code to verify<br>
              invoice authenticity and<br>
              access online copy
            </div>
          </div>
        </div>

        <!-- Bottom Notes -->
        <div class="invoice-notes">
          <div class="notes-content">
            <span class="notes-highlight">🖥️ This is a computer-generated invoice - No signature required</span><br>
            Generated on: ${new Date().toLocaleString()} | 
            Invoice ID: ${invoiceId} | 
            <span class="notes-highlight">🔒 This document is protected and verified</span><br>
            <strong>Hare Krishna Medical</strong> - Licensed Medical Store - Gujarat, India
          </div>
        </div>
      </div>
    `;
  };

  if (forPrint) {
    return (
      <div style={{ width: "100%", height: "100%" }}>
        <div dangerouslySetInnerHTML={{ __html: generateInvoiceHTML() }} />
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: "1100px",
        margin: "0 auto",
        background: "white",
        boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
        borderRadius: "16px",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Enhanced Print Button */}
      <button
        onClick={handlePrint}
        disabled={!isPrintReady || isLoading}
        style={{
          position: "fixed",
          top: "30px",
          right: "30px",
          zIndex: 1000,
          background:
            isPrintReady && !isLoading
              ? "linear-gradient(135deg, #e53e3e, #c53030)"
              : "linear-gradient(135deg, #a0aec0, #718096)",
          color: "white",
          border: "none",
          padding: "16px 28px",
          borderRadius: "50px",
          cursor: isPrintReady && !isLoading ? "pointer" : "not-allowed",
          fontSize: "16px",
          fontWeight: "700",
          boxShadow:
            isPrintReady && !isLoading
              ? "0 8px 25px rgba(229, 62, 62, 0.3)"
              : "0 4px 15px rgba(160, 174, 192, 0.3)",
          transition: "all 0.3s ease",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          fontFamily: "inherit",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
        }}
        onMouseOver={(e) => {
          if (isPrintReady && !isLoading) {
            e.target.style.transform = "translateY(-3px)";
            e.target.style.boxShadow = "0 12px 35px rgba(229, 62, 62, 0.4)";
          }
        }}
        onMouseOut={(e) => {
          if (isPrintReady && !isLoading) {
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "0 8px 25px rgba(229, 62, 62, 0.3)";
          }
        }}
      >
        <span style={{ fontSize: "20px" }}>{isLoading ? "⏳" : "🖨️"}</span>
        {isLoading
          ? "Loading..."
          : isPrintReady
            ? "Print Invoice"
            : "Not Ready"}
      </button>

      {/* Invoice Content */}
      <div
        style={{
          padding: "50px",
          background: "white",
        }}
      >
        <div dangerouslySetInnerHTML={{ __html: generateInvoiceHTML() }} />
      </div>

      {/* Inject CSS */}
      <style>{getPrintCSS()}</style>
    </div>
  );
};

export default ProfessionalInvoice;
