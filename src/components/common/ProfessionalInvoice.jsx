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

  // Generate QR Code with comprehensive invoice data
  useEffect(() => {
    const generateQR = async () => {
      try {
        setIsLoading(true);
        const qrData = {
          invoice_id: invoiceId,
          order_id: orderId,
          customer: customerDetails.fullName,
          amount: total,
          date: orderDate,
          status: status,
          verify_url: `https://harekrishan.medical/verify/${invoiceId}`,
          company: "Hare Krishna Medical",
          phone: "+91 76989 13354",
        };

        const qrText = JSON.stringify(qrData);
        const qrDataURL = await QRCode.toDataURL(qrText, {
          width: 140,
          margin: 2,
          color: {
            dark: "#1a202c",
            light: "#ffffff",
          },
          errorCorrectionLevel: "M",
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
  }, [invoiceId, orderId, total, orderDate, status, customerDetails.fullName]);

  // Calculate totals
  const calculatedSubtotal =
    subtotal ||
    items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const calculatedTotal = total || calculatedSubtotal + shipping;

  const modernInvoiceStyle = `
    <style>
      @page {
        size: A4;
        margin: 20px;
      }
      
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      
      body {
        font-family: 'Segoe UI', 'Arial', sans-serif;
        font-size: 11px;
        line-height: 1.5;
        color: #2d3748;
        background: white;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      
      .modern-invoice {
        width: 100%;
        max-width: 210mm;
        min-height: 297mm;
        margin: 0 auto;
        background: white;
        padding: 20px;
        position: relative;
      }
      
      /* Header with professional gradient */
      .invoice-header {
        background: linear-gradient(135deg, #e63946 0%, #dc3545 100%);
        margin: -20px -20px 30px -20px;
        padding: 40px 30px 30px 30px;
        color: white;
        position: relative;
        overflow: hidden;
      }
      
      .invoice-header::before {
        content: '';
        position: absolute;
        top: -50%;
        right: -20%;
        width: 100%;
        height: 200%;
        background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="20" cy="20" r="2" fill="rgba(255,255,255,0.1)"/><circle cx="80" cy="80" r="2" fill="rgba(255,255,255,0.1)"/><circle cx="40" cy="60" r="1" fill="rgba(255,255,255,0.05)"/><circle cx="70" cy="30" r="1.5" fill="rgba(255,255,255,0.08)"/></svg>') repeat;
        animation: float 20s infinite linear;
      }
      
      @keyframes float {
        0% { transform: translateX(0) translateY(0); }
        100% { transform: translateX(-100px) translateY(-100px); }
      }
      
      .header-content {
        position: relative;
        z-index: 2;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
      }
      
      .company-section {
        flex: 1;
      }
      
      .company-logo-name {
        display: flex;
        align-items: center;
        margin-bottom: 20px;
      }
      
      .company-logo {
        width: 70px;
        height: 70px;
        background: rgba(255,255,255,0.1);
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 20px;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255,255,255,0.2);
      }
      
      .company-name {
        font-size: 28px;
        font-weight: 800;
        letter-spacing: -0.5px;
        text-shadow: 0 2px 4px rgba(0,0,0,0.2);
      }
      
      .company-tagline {
        font-size: 12px;
        opacity: 0.9;
        margin-top: 5px;
        font-weight: 500;
      }
      
      .company-details {
        background: rgba(255,255,255,0.1);
        padding: 15px;
        border-radius: 8px;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255,255,255,0.2);
        font-size: 10px;
        line-height: 1.6;
      }
      
      .invoice-title-section {
        text-align: right;
        min-width: 250px;
      }
      
      .invoice-title {
        font-size: 42px;
        font-weight: 900;
        letter-spacing: -1px;
        text-shadow: 0 2px 4px rgba(0,0,0,0.2);
        margin-bottom: 20px;
      }
      
      .invoice-meta {
        background: rgba(255,255,255,0.15);
        padding: 20px;
        border-radius: 12px;
        backdrop-filter: blur(15px);
        border: 1px solid rgba(255,255,255,0.2);
        font-size: 11px;
      }
      
      .meta-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 8px;
        align-items: center;
      }
      
      .meta-row:last-child {
        margin-bottom: 0;
      }
      
      .meta-label {
        font-weight: 600;
        opacity: 0.9;
      }
      
      .meta-value {
        font-weight: 700;
        text-align: right;
      }
      
      .status-badge {
        background: rgba(255,255,255,0.2);
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 9px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        border: 1px solid rgba(255,255,255,0.3);
      }
      
      /* Customer Information Section */
      .customer-section {
        display: flex;
        gap: 30px;
        margin-bottom: 40px;
      }
      
      .customer-block {
        flex: 1;
        background: #f8fafc;
        padding: 25px;
        border-radius: 12px;
        border-left: 4px solid #e63946;
        position: relative;
      }
      
      .customer-block.ship-to {
        border-left-color: #3182ce;
      }
      
      .customer-title {
        font-size: 13px;
        font-weight: 700;
        color: #e63946;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 15px;
        display: flex;
        align-items: center;
      }
      
      .customer-title.ship {
        color: #3182ce;
      }
      
      .customer-title i {
        margin-right: 8px;
        font-size: 14px;
      }
      
      .customer-name {
        font-size: 16px;
        font-weight: 700;
        color: #1a202c;
        margin-bottom: 12px;
      }
      
      .customer-info {
        font-size: 10px;
        line-height: 1.6;
        color: #4a5568;
      }
      
      .customer-info div {
        margin-bottom: 4px;
      }
      
      /* Items Section */
      .items-section {
        margin-bottom: 40px;
      }
      
      .section-title {
        font-size: 16px;
        font-weight: 700;
        color: #1a202c;
        margin-bottom: 20px;
        padding-bottom: 10px;
        border-bottom: 2px solid #e63946;
        display: flex;
        align-items: center;
      }
      
      .section-title i {
        margin-right: 10px;
        color: #e63946;
        font-size: 18px;
      }
      
      .items-table {
        width: 100%;
        border-collapse: separate;
        border-spacing: 0;
        background: white;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      }
      
      .items-table th {
        background: linear-gradient(135deg, #2d3748 0%, #1a202c 100%);
        color: white;
        padding: 15px 12px;
        font-size: 10px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      
      .items-table th:first-child {
        border-radius: 8px 0 0 0;
      }
      
      .items-table th:last-child {
        border-radius: 0 8px 0 0;
      }
      
      .items-table td {
        padding: 15px 12px;
        border-bottom: 1px solid #e2e8f0;
        font-size: 10px;
      }
      
      .items-table tbody tr:nth-child(even) {
        background: #f7fafc;
      }
      
      .items-table tbody tr:hover {
        background: #edf2f7;
      }
      
      .items-table tbody tr:last-child td {
        border-bottom: none;
      }
      
      .items-table tbody tr:last-child td:first-child {
        border-radius: 0 0 0 8px;
      }
      
      .items-table tbody tr:last-child td:last-child {
        border-radius: 0 0 8px 0;
      }
      
      .item-name {
        font-weight: 600;
        color: #1a202c;
        margin-bottom: 2px;
      }
      
      .item-company {
        font-size: 9px;
        color: #718096;
        font-style: italic;
      }
      
      .quantity-badge {
        background: linear-gradient(135deg, #e63946, #dc3545);
        color: white;
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 9px;
        font-weight: 700;
        min-width: 30px;
        text-align: center;
        display: inline-block;
      }
      
      .text-center { text-align: center; }
      .text-right { text-align: right; }
      .text-left { text-align: left; }
      
      /* Totals Section */
      .totals-section {
        display: flex;
        justify-content: flex-end;
        margin-bottom: 40px;
      }
      
      .totals-table {
        min-width: 350px;
        border-collapse: separate;
        border-spacing: 0;
        background: white;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      }
      
      .total-row {
        border-bottom: 1px solid #e2e8f0;
      }
      
      .total-row:last-child {
        border-bottom: none;
      }
      
      .total-row td {
        padding: 12px 15px;
        font-size: 11px;
      }
      
      .total-row.subtotal {
        background: #f7fafc;
      }
      
      .total-row.shipping {
        background: #f0fff4;
      }
      
      .total-row.tax {
        background: #fffbeb;
      }
      
      .total-row.grand-total {
        background: linear-gradient(135deg, #e63946, #dc3545);
        color: white;
        font-weight: 700;
        font-size: 14px;
      }
      
      .total-row.grand-total td:first-child {
        border-radius: 0 0 0 8px;
      }
      
      .total-row.grand-total td:last-child {
        border-radius: 0 0 8px 0;
      }
      
      .total-label {
        font-weight: 600;
      }
      
      .total-value {
        font-weight: 700;
        text-align: right;
      }
      
      /* Footer Section */
      .footer-section {
        display: flex;
        gap: 30px;
        padding-top: 30px;
        border-top: 2px solid #e2e8f0;
      }
      
      .terms-section {
        flex: 2;
      }
      
      .footer-title {
        font-size: 14px;
        font-weight: 700;
        color: #1a202c;
        margin-bottom: 15px;
        display: flex;
        align-items: center;
      }
      
      .footer-title i {
        margin-right: 8px;
        color: #e63946;
      }
      
      .terms-list {
        font-size: 9px;
        line-height: 1.6;
        color: #4a5568;
        list-style: none;
      }
      
      .terms-list li {
        margin-bottom: 6px;
        position: relative;
        padding-left: 15px;
      }
      
      .terms-list li::before {
        content: '●';
        color: #e63946;
        position: absolute;
        left: 0;
        font-weight: bold;
      }
      
      .contact-info {
        background: #f8fafc;
        padding: 15px;
        border-radius: 8px;
        margin-top: 15px;
        border-left: 4px solid #3182ce;
      }
      
      .contact-info-title {
        font-size: 11px;
        font-weight: 700;
        color: #3182ce;
        margin-bottom: 8px;
        display: flex;
        align-items: center;
      }
      
      .contact-info-title i {
        margin-right: 6px;
      }
      
      .contact-details {
        font-size: 9px;
        line-height: 1.5;
        color: #4a5568;
      }
      
      .qr-section {
        flex: 1;
        text-align: center;
      }
      
      .qr-container {
        background: #f8fafc;
        padding: 20px;
        border-radius: 12px;
        border: 2px solid #e2e8f0;
      }
      
      .qr-title {
        font-size: 11px;
        font-weight: 700;
        color: #1a202c;
        margin-bottom: 15px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .qr-title i {
        margin-right: 6px;
        color: #3182ce;
      }
      
      .qr-code {
        width: 120px;
        height: 120px;
        border: 2px solid #e2e8f0;
        border-radius: 8px;
        margin: 0 auto 10px;
        display: block;
      }
      
      .qr-placeholder {
        width: 120px;
        height: 120px;
        border: 2px dashed #cbd5e0;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 10px;
        background: #f7fafc;
        color: #718096;
        font-size: 10px;
        font-weight: 600;
      }
      
      .qr-description {
        font-size: 8px;
        color: #718096;
        line-height: 1.4;
      }
      
      /* Bottom signature */
      .bottom-signature {
        margin-top: 30px;
        text-align: center;
        padding: 15px;
        background: linear-gradient(135deg, #f8fafc 0%, #edf2f7 100%);
        border-radius: 8px;
        border: 1px solid #e2e8f0;
      }
      
      .signature-content {
        font-size: 9px;
        color: #718096;
        line-height: 1.5;
      }
      
      .signature-highlight {
        font-weight: 700;
        color: #1a202c;
      }
      
      /* Print optimizations */
      @media print {
        body {
          margin: 0;
          padding: 0;
        }
        
        .modern-invoice {
          box-shadow: none;
          border: none;
          page-break-inside: avoid;
        }
        
        .items-table {
          page-break-inside: avoid;
        }
        
        .footer-section {
          page-break-inside: avoid;
        }
        
        .totals-section {
          page-break-inside: avoid;
        }
        
        .invoice-header::before {
          display: none;
        }
      }
    </style>
  `;

  const generateModernInvoiceHTML = () => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Invoice ${invoiceId} - Hare Krishna Medical</title>
        ${modernInvoiceStyle}
      </head>
      <body>
        <div class="modern-invoice">
          <!-- Modern Header -->
          <div class="invoice-header">
            <div class="header-content">
              <div class="company-section">
                <div class="company-logo-name">
                  <div class="company-logo">
                    <i style="font-size: 32px; color: white;">🏥</i>
                  </div>
                  <div>
                    <div class="company-name">HARE KRISHNA MEDICAL</div>
                    <div class="company-tagline">Your Trusted Healthcare Partner</div>
                  </div>
                </div>
                <div class="company-details">
                  📍 3 Sahyog Complex, Man Sarovar Circle, Amroli, Surat - 394107, Gujarat<br>
                  📞 +91 76989 13354 | 📱 +91 91060 18508<br>
                  📧 harekrishnamedical@gmail.com | 🌐 www.harekrishan.medical
                </div>
              </div>
              
              <div class="invoice-title-section">
                <div class="invoice-title">INVOICE</div>
                <div class="invoice-meta">
                  <div class="meta-row">
                    <span class="meta-label">Invoice #</span>
                    <span class="meta-value">${invoiceId}</span>
                  </div>
                  <div class="meta-row">
                    <span class="meta-label">Order #</span>
                    <span class="meta-value">${orderId}</span>
                  </div>
                  <div class="meta-row">
                    <span class="meta-label">Date</span>
                    <span class="meta-value">${orderDate}</span>
                  </div>
                  <div class="meta-row">
                    <span class="meta-label">Time</span>
                    <span class="meta-value">${orderTime}</span>
                  </div>
                  <div class="meta-row">
                    <span class="meta-label">Status</span>
                    <span class="status-badge">${status}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Customer Information -->
          <div class="customer-section">
            <div class="customer-block">
              <div class="customer-title">
                <i class="📋"></i>Bill To
              </div>
              <div class="customer-name">${customerDetails.fullName}</div>
              <div class="customer-info">
                <div><strong>Email:</strong> ${customerDetails.email}</div>
                <div><strong>Phone:</strong> ${customerDetails.mobile}</div>
                <div><strong>Address:</strong> ${customerDetails.address}</div>
                <div><strong>City:</strong> ${customerDetails.city}, ${customerDetails.state}</div>
                <div><strong>PIN Code:</strong> ${customerDetails.pincode}</div>
              </div>
            </div>
            
            <div class="customer-block ship-to">
              <div class="customer-title ship">
                <i class="🚚"></i>Ship To
              </div>
              <div class="customer-name">${customerDetails.fullName}</div>
              <div class="customer-info">
                <div><strong>Address:</strong> ${customerDetails.address}</div>
                <div><strong>City:</strong> ${customerDetails.city}, ${customerDetails.state}</div>
                <div><strong>PIN Code:</strong> ${customerDetails.pincode}</div>
                <div><strong>Payment:</strong> ${paymentMethod}</div>
                <div><strong>Status:</strong> ${paymentStatus}</div>
              </div>
            </div>
          </div>

          <!-- Items Section -->
          <div class="items-section">
            <div class="section-title">
              <i class="🛒"></i>Medical Products & Services
            </div>
            <table class="items-table">
              <thead>
                <tr>
                  <th class="text-center" style="width: 40px;">#</th>
                  <th class="text-left">Product Description</th>
                  <th class="text-center" style="width: 80px;">Quantity</th>
                  <th class="text-right" style="width: 100px;">Unit Price</th>
                  <th class="text-right" style="width: 100px;">Total Amount</th>
                </tr>
              </thead>
              <tbody>
                ${items
                  .map(
                    (item, index) => `
                  <tr>
                    <td class="text-center" style="font-weight: 700; color: #e63946;">${index + 1}</td>
                    <td>
                      <div class="item-name">${item.name}</div>
                      <div class="item-company">${item.company || "Medical Product"}</div>
                    </td>
                    <td class="text-center">
                      <span class="quantity-badge">${item.quantity}</span>
                    </td>
                    <td class="text-right" style="font-weight: 600; color: #4a5568;">₹${item.price.toFixed(2)}</td>
                    <td class="text-right" style="font-weight: 700; color: #1a202c;">₹${(item.price * item.quantity).toFixed(2)}</td>
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
              <tr class="total-row subtotal">
                <td class="total-label">Subtotal</td>
                <td class="total-value">₹${calculatedSubtotal.toFixed(2)}</td>
              </tr>
              <tr class="total-row shipping">
                <td class="total-label">Shipping & Handling</td>
                <td class="total-value" style="${shipping === 0 ? "color: #38a169; font-weight: 700;" : ""}">
                  ${shipping === 0 ? "FREE" : `₹${shipping.toFixed(2)}`}
                </td>
              </tr>
              <tr class="total-row tax">
                <td class="total-label">Tax (GST)</td>
                <td class="total-value" style="color: #3182ce; font-weight: 700;">Included in Price</td>
              </tr>
              <tr class="total-row grand-total">
                <td class="total-label">TOTAL AMOUNT</td>
                <td class="total-value">₹${calculatedTotal.toFixed(2)}</td>
              </tr>
            </table>
          </div>

          <!-- Footer Section -->
          <div class="footer-section">
            <div class="terms-section">
              <div class="footer-title">
                <i class="📋"></i>Terms & Conditions
              </div>
              <ul class="terms-list">
                <li>Payment is due within 30 days from the invoice date</li>
                <li>All medical products are subject to proper usage guidelines</li>
                <li>Returns are accepted only for damaged or defective items within 7 days</li>
                <li>This invoice is computer-generated and legally valid without signature</li>
                <li>Subject to Gujarat jurisdiction for any legal disputes or claims</li>
                <li>Keep this invoice safe for warranty claims and return purposes</li>
                <li>All prices are inclusive of applicable taxes and charges</li>
              </ul>
              
              <div class="contact-info">
                <div class="contact-info-title">
                  <i class="📞"></i>Customer Support
                </div>
                <div class="contact-details">
                  <strong>Email:</strong> harekrishnamedical@gmail.com<br>
                  <strong>Phone:</strong> +91 76989 13354<br>
                  <strong>Emergency:</strong> +91 91060 18508<br>
                  <strong>Hours:</strong> Monday-Saturday, 9:00 AM - 8:00 PM
                </div>
              </div>
            </div>
            
            <div class="qr-section">
              <div class="qr-container">
                <div class="qr-title">
                  <i class="📱"></i>Verification QR Code
                </div>
                ${
                  generatedQR
                    ? `<img src="${generatedQR}" alt="Invoice Verification QR Code" class="qr-code" />`
                    : '<div class="qr-placeholder">QR Code</div>'
                }
                <div class="qr-description">
                  Scan this QR code to verify invoice<br>
                  authenticity and access digital copy<br>
                  Contains complete invoice data
                </div>
              </div>
            </div>
          </div>

          <!-- Bottom Signature -->
          <div class="bottom-signature">
            <div class="signature-content">
              <span class="signature-highlight">🖥️ This is a computer-generated invoice</span> - No manual signature required<br>
              Generated on: ${new Date().toLocaleString()} | Invoice ID: ${invoiceId}<br>
              <span class="signature-highlight">🔒 This document is digitally protected and verified</span><br>
              <strong>Hare Krishna Medical</strong> - Licensed Medical Store Registration No: [License#] - Gujarat, India
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  };

  if (forPrint) {
    return (
      <div dangerouslySetInnerHTML={{ __html: generateModernInvoiceHTML() }} />
    );
  }

  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: generateModernInvoiceHTML() }} />
    </div>
  );
};

export default ProfessionalInvoice;
