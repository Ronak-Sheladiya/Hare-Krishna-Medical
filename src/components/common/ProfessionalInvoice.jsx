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

  // Generate QR Code with comprehensive invoice data or use provided QR
  useEffect(() => {
    const generateQR = async () => {
      try {
        setIsLoading(true);

        // Use provided QR code from order if available
        if (qrCode) {
          setGeneratedQR(qrCode);
          setIsPrintReady(true);
          setIsLoading(false);
          return;
        }

        // Check if QR code is provided in invoice data
        if (invoiceData.qrCode) {
          setGeneratedQR(invoiceData.qrCode);
          setIsPrintReady(true);
          setIsLoading(false);
          return;
        }

        // Generate new QR code if none provided
        const verifyUrl = `${window.location.origin}/invoice/${orderId}`;
        const qrData = {
          type: "invoice_verification",
          invoice_id: invoiceId,
          order_id: orderId,
          customer_name: customerDetails.fullName,
          total_amount: `₹${total.toFixed(2)}`,
          invoice_date: orderDate,
          payment_status: status,
          verify_url: verifyUrl,
          company: "Hare Krishna Medical",
          location: "Surat, Gujarat, India",
          phone: "+91 76989 13354",
          email: "hkmedicalamroli@gmail.com",
          generated_at: new Date().toISOString(),
        };

        const qrText = JSON.stringify(qrData);
        const qrDataURL = await QRCode.toDataURL(qrText, {
          width: 180,
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
  }, [
    invoiceId,
    orderId,
    total,
    orderDate,
    status,
    customerDetails.fullName,
    qrCode,
    invoiceData.qrCode,
  ]);

  // Calculate totals
  const calculatedSubtotal =
    subtotal ||
    items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const calculatedTotal = total || calculatedSubtotal + shipping;

  const simpleInvoiceStyle = `
    <style>
      @page {
        size: A4;
        margin: 10px;
      }

      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      body {
        font-family: 'Arial', sans-serif;
        font-size: 12px;
        line-height: 1.4;
        color: #333;
        background: white;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }

      .simple-invoice {
        width: 100%;
        max-width: 210mm;
        min-height: 287mm;
        margin: 0 auto;
        background: white;
        padding: 15px;
      }

      /* Clean Header - About Us Color Palette */
      .invoice-header {
        background: linear-gradient(135deg, #e63946 0%, #dc3545 100%);
        margin: -20px -20px 30px -20px;
        padding: 30px;
        color: white;
        box-shadow: 0 4px 15px rgba(230, 57, 70, 0.3);
      }

      .header-flex {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
      }

      .company-info h1 {
        font-size: 24px;
        font-weight: bold;
        margin-bottom: 5px;
      }

      .company-tagline {
        font-size: 12px;
        opacity: 0.9;
        margin-bottom: 15px;
      }

      .company-details {
        font-size: 11px;
        line-height: 1.5;
      }

      .invoice-title-section {
        text-align: right;
      }

      .invoice-title {
        font-size: 36px;
        font-weight: bold;
        margin-bottom: 15px;
      }

      .invoice-meta {
        background: rgba(255,255,255,0.1);
        padding: 15px;
        border-radius: 5px;
        font-size: 11px;
      }

      .meta-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 5px;
      }

      .meta-row:last-child {
        margin-bottom: 0;
      }

      /* Customer Section */
      .customer-section {
        display: flex;
        gap: 20px;
        margin-bottom: 30px;
      }

      .customer-block {
        flex: 1;
        padding: 20px;
        border: 1px solid #ddd;
        border-radius: 5px;
        background: #f9f9f9;
      }

      .customer-title {
        font-size: 14px;
        font-weight: bold;
        color: #e63946;
        margin-bottom: 10px;
        text-transform: uppercase;
        text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
      }

      .customer-name {
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 10px;
      }

      .customer-info {
        font-size: 11px;
        line-height: 1.5;
      }

      .customer-info div {
        margin-bottom: 3px;
      }

      /* Items Table */
      .items-section {
        margin-bottom: 30px;
      }

      .section-title {
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 15px;
        padding-bottom: 5px;
        border-bottom: 2px solid #e63946;
        color: #343a40;
        text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
      }

      .items-table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 15px;
      }

      .items-table th {
        background: linear-gradient(135deg, #343a40 0%, #495057 100%);
        color: white;
        padding: 12px 8px;
        font-size: 11px;
        font-weight: bold;
        text-transform: uppercase;
        border: 1px solid #343a40;
        text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
      }

      .items-table td {
        padding: 10px 8px;
        border: 1px solid #ddd;
        font-size: 11px;
      }

      .items-table tr:nth-child(even) {
        background: #f9f9f9;
      }

      .item-name {
        font-weight: bold;
        margin-bottom: 2px;
      }

      .item-company {
        font-size: 10px;
        color: #666;
      }

      .text-center { text-align: center; }
      .text-right { text-align: right; }
      .text-left { text-align: left; }

      /* Totals Section */
      .totals-section {
        float: right;
        width: 300px;
        margin-bottom: 30px;
      }

      .totals-table {
        width: 100%;
        border-collapse: collapse;
      }

      .total-row td {
        padding: 8px 12px;
        border: 1px solid #ddd;
        font-size: 12px;
      }

      .total-row.grand-total td {
        background: linear-gradient(135deg, #e63946 0%, #dc3545 100%);
        color: white;
        font-weight: bold;
        font-size: 14px;
        text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
        box-shadow: 0 2px 8px rgba(230, 57, 70, 0.3);
      }

      .total-label {
        font-weight: 600;
      }

      .total-value {
        text-align: right;
        font-weight: bold;
      }

      /* Footer */
      .footer-section {
        clear: both;
        display: flex;
        gap: 20px;
        padding-top: 20px;
        border-top: 1px solid #ddd;
      }

      .terms-section {
        flex: 2;
      }

      .footer-title {
        font-size: 14px;
        font-weight: bold;
        margin-bottom: 10px;
        color: #e63946;
        text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
      }

      .terms-list {
        font-size: 10px;
        line-height: 1.5;
        list-style: none;
      }

      .terms-list li {
        margin-bottom: 4px;
        position: relative;
        padding-left: 12px;
      }

      .terms-list li::before {
        content: '•';
        color: #e63946;
        position: absolute;
        left: 0;
        font-weight: bold;
      }

      .contact-info {
        background: #f9f9f9;
        padding: 10px;
        border-radius: 5px;
        margin-top: 10px;
        font-size: 10px;
        line-height: 1.4;
      }

      .qr-section {
        flex: 1;
        text-align: center;
      }

      .qr-title {
        font-size: 12px;
        font-weight: bold;
        margin-bottom: 10px;
        color: #333;
      }

      .qr-code {
        width: 140px;
        height: 140px;
        border: 1px solid #ddd;
        border-radius: 5px;
        margin-bottom: 5px;
      }

      .qr-placeholder {
        width: 140px;
        height: 140px;
        border: 2px dashed #ccc;
        border-radius: 5px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 5px;
        font-size: 10px;
        color: #666;
      }

      .qr-description {
        font-size: 9px;
        color: #666;
        line-height: 1.3;
      }

      /* Bottom Note */
      .bottom-note {
        text-align: center;
        margin-top: 20px;
        padding: 10px;
        background: #f9f9f9;
        border-radius: 5px;
        font-size: 10px;
        color: #666;
      }

      .highlight {
        font-weight: bold;
        color: #333;
      }

      /* Print Styles */
      @media print {
        body {
          margin: 0;
          padding: 0;
        }

        .simple-invoice {
          box-shadow: none;
          border: none;
        }

        .no-print {
          display: none !important;
        }
      }
    </style>
  `;

  const generateSimpleInvoiceHTML = () => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Invoice ${invoiceId} - Hare Krishna Medical</title>
        ${simpleInvoiceStyle}
      </head>
      <body>
        <div class="simple-invoice">
          <!-- Header -->
          <div class="invoice-header">
            <div class="header-flex">
              <div class="company-info">
                <h1>HARE KRISHNA MEDICAL</h1>
                <div class="company-tagline">Your Trusted Healthcare Partner</div>
                <div class="company-details">
                  📍 3 Sahyog Complex, Man Sarovar Circle, Amroli, Surat - 394107, Gujarat<br>
                  📞 +91 76989 13354 | 📱 +91 91060 18508<br>
                  📧 hkmedicalamroli@gmail.com
                </div>
              </div>

              <div class="invoice-title-section">
                <div class="invoice-title">INVOICE</div>
                <div class="invoice-meta">
                  <div class="meta-row">
                    <span>Invoice #:</span>
                    <span>${invoiceId}</span>
                  </div>
                  <div class="meta-row">
                    <span>Order #:</span>
                    <span>${orderId}</span>
                  </div>
                  <div class="meta-row">
                    <span>Date:</span>
                    <span>${orderDate}</span>
                  </div>
                  <div class="meta-row">
                    <span>Time:</span>
                    <span>${orderTime}</span>
                  </div>
                  <div class="meta-row">
                    <span>Status:</span>
                    <span style="background: #27ae60; color: white; padding: 4px 12px; border-radius: 15px; font-weight: bold; text-shadow: 1px 1px 2px rgba(0,0,0,0.3);">${status}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Customer Information -->
          <div class="customer-section">
            <div class="customer-block">
              <div class="customer-title">📋 Bill To</div>
              <div class="customer-name">${customerDetails.fullName}</div>
              <div class="customer-info">
                <div><strong>Email:</strong> ${customerDetails.email}</div>
                <div><strong>Phone:</strong> ${customerDetails.mobile}</div>
                <div><strong>Address:</strong> ${customerDetails.address}</div>
                <div><strong>City:</strong> ${customerDetails.city}, ${customerDetails.state}</div>
                <div><strong>PIN Code:</strong> ${customerDetails.pincode}</div>
              </div>
            </div>

            <div class="customer-block">
              <div class="customer-title">🚚 Ship To</div>
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

          <!-- Items -->
          <div class="items-section">
            <div class="section-title">🛒 Medical Products & Services</div>
            <table class="items-table">
              <thead>
                <tr>
                  <th class="text-center" style="width: 40px;">#</th>
                  <th class="text-left">Product Description</th>
                  <th class="text-center" style="width: 60px;">Qty</th>
                  <th class="text-right" style="width: 80px;">Unit Price</th>
                  <th class="text-right" style="width: 80px;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${items
                  .map(
                    (item, index) => `
                  <tr>
                    <td class="text-center">${index + 1}</td>
                    <td>
                      <div class="item-name">${item.name}</div>
                      <div class="item-company">${item.company || "Medical Product"}</div>
                    </td>
                    <td class="text-center">${item.quantity}</td>
                    <td class="text-right">₹${item.price.toFixed(2)}</td>
                    <td class="text-right">₹${(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                `,
                  )
                  .join("")}
              </tbody>
            </table>
          </div>

          <!-- Totals -->
          <div class="totals-section">
            <table class="totals-table">
              <tr class="total-row">
                <td class="total-label">Subtotal:</td>
                <td class="total-value">₹${calculatedSubtotal.toFixed(2)}</td>
              </tr>
              <tr class="total-row">
                <td class="total-label">Shipping:</td>
                <td class="total-value">${shipping === 0 ? "FREE" : `₹${shipping.toFixed(2)}`}</td>
              </tr>
              <tr class="total-row">
                <td class="total-label">Tax (GST):</td>
                <td class="total-value">Included</td>
              </tr>
              <tr class="total-row grand-total">
                <td class="total-label">TOTAL AMOUNT:</td>
                <td class="total-value">₹${calculatedTotal.toFixed(2)}</td>
              </tr>
            </table>
          </div>

          <!-- Footer -->
          <div class="footer-section">
            <div class="terms-section">
              <div class="footer-title">📋 Terms & Conditions</div>
              <ul class="terms-list">
                <li>Payment is due within 30 days from the invoice date</li>
                <li>Returns are accepted only for damaged items within 7 days</li>
                <li>This invoice is computer-generated and legally valid</li>
                <li>Subject to Gujarat jurisdiction for legal disputes</li>
                <li>All prices are inclusive of applicable taxes</li>
                <li>Keep this invoice safe for warranty and return purposes</li>
              </ul>

              <div class="contact-info">
                <strong>📞 Customer Support:</strong><br>
                Email: hkmedicalamroli@gmail.com<br>
                Phone: +91 76989 13354 | Emergency: +91 91060 18508<br>
                Hours: Monday-Saturday, 9:00 AM - 8:00 PM
              </div>
            </div>

            <div class="qr-section">
              <div class="qr-title">📱 Verification QR</div>
              ${
                generatedQR
                  ? `<img src="${generatedQR}" alt="QR Code" class="qr-code" />`
                  : '<div class="qr-placeholder">QR Code</div>'
              }
              <div class="qr-description">
                Scan or click to verify<br>
                invoice authenticity<br>
                and access digital copy
              </div>
            </div>
          </div>

          <!-- Bottom Note -->
          <div class="bottom-note">
            <span class="highlight">🖥️ Computer-generated invoice</span> - No signature required<br>
            Generated: ${new Date().toLocaleString()} | Invoice ID: ${invoiceId}<br>
            <span class="highlight">Hare Krishna Medical</span> - Licensed Medical Store - Gujarat, India
          </div>
        </div>
      </body>
      </html>
    `;
  };

  if (forPrint) {
    return (
      <div dangerouslySetInnerHTML={{ __html: generateSimpleInvoiceHTML() }} />
    );
  }

  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: generateSimpleInvoiceHTML() }} />
    </div>
  );
};

export default ProfessionalInvoice;
