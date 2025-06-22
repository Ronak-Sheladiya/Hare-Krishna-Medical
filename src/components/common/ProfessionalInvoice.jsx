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

  // Generate QR Code with proper invoice data
  useEffect(() => {
    const generateQR = async () => {
      try {
        setIsLoading(true);
        // Create comprehensive QR data for verification
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
          width: 120,
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

  const invoiceStyle = `
    <style>
      @media print {
        @page {
          size: A4;
          margin: 20px;
        }
        
        body {
          margin: 0;
          padding: 0;
          font-family: 'Arial', sans-serif;
          line-height: 1.4;
          color: #333;
          background: white;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        
        .no-print {
          display: none !important;
        }
        
        .invoice-container {
          width: 100%;
          max-width: none;
          background: white;
          box-shadow: none;
          border-radius: 0;
        }
      }
      
      @media screen {
        .invoice-container {
          width: 210mm;
          min-height: 297mm;
          margin: 0 auto;
          background: white;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
          padding: 20px;
          box-sizing: border-box;
        }
      }
      
      .invoice-body {
        font-family: 'Arial', sans-serif;
        font-size: 12px;
        line-height: 1.4;
        color: #333;
      }
      
      .header-section {
        border-bottom: 3px solid #e63946;
        padding-bottom: 20px;
        margin-bottom: 30px;
      }
      
      .company-info {
        float: left;
        width: 60%;
      }
      
      .invoice-meta {
        float: right;
        width: 35%;
        text-align: right;
      }
      
      .company-name {
        font-size: 24px;
        font-weight: bold;
        color: #e63946;
        margin-bottom: 5px;
      }
      
      .company-tagline {
        font-size: 12px;
        color: #666;
        margin-bottom: 15px;
      }
      
      .company-details {
        font-size: 10px;
        line-height: 1.6;
        color: #555;
      }
      
      .invoice-title {
        font-size: 32px;
        font-weight: bold;
        color: #333;
        margin-bottom: 15px;
      }
      
      .invoice-info {
        background: #f8f9fa;
        padding: 15px;
        border: 1px solid #e63946;
        border-radius: 5px;
        font-size: 11px;
      }
      
      .customer-section {
        width: 100%;
        margin-bottom: 30px;
      }
      
      .bill-to, .ship-to {
        width: 48%;
        float: left;
        padding: 15px;
        border: 1px solid #ddd;
        border-radius: 5px;
        margin-right: 2%;
        margin-bottom: 15px;
      }
      
      .ship-to {
        margin-right: 0;
        float: right;
      }
      
      .customer-title {
        font-size: 14px;
        font-weight: bold;
        color: #e63946;
        margin-bottom: 10px;
        text-transform: uppercase;
      }
      
      .customer-name {
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 10px;
      }
      
      .items-table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 20px;
      }
      
      .items-table th {
        background: #e63946;
        color: white;
        padding: 12px 8px;
        font-size: 11px;
        font-weight: bold;
        text-transform: uppercase;
        border: 1px solid #e63946;
      }
      
      .items-table td {
        padding: 10px 8px;
        border: 1px solid #ddd;
        font-size: 11px;
      }
      
      .items-table tr:nth-child(even) {
        background: #f9f9f9;
      }
      
      .text-center { text-align: center; }
      .text-right { text-align: right; }
      .text-left { text-align: left; }
      
      .totals-section {
        float: right;
        width: 300px;
        margin-bottom: 30px;
      }
      
      .total-row {
        display: flex;
        justify-content: space-between;
        padding: 8px 15px;
        border: 1px solid #ddd;
        font-size: 12px;
      }
      
      .total-row.grand-total {
        background: #e63946;
        color: white;
        font-weight: bold;
        font-size: 14px;
      }
      
      .footer-section {
        clear: both;
        margin-top: 40px;
        border-top: 2px solid #f1f1f1;
        padding-top: 20px;
      }
      
      .terms-column {
        float: left;
        width: 65%;
      }
      
      .qr-column {
        float: right;
        width: 30%;
        text-align: center;
      }
      
      .terms-title {
        font-size: 14px;
        font-weight: bold;
        color: #e63946;
        margin-bottom: 10px;
      }
      
      .terms-list {
        font-size: 10px;
        line-height: 1.5;
        color: #555;
      }
      
      .terms-list li {
        margin-bottom: 5px;
      }
      
      .qr-title {
        font-size: 12px;
        font-weight: bold;
        color: #333;
        margin-bottom: 10px;
      }
      
      .qr-code {
        width: 100px;
        height: 100px;
        border: 1px solid #ddd;
        border-radius: 5px;
      }
      
      .clearfix::after {
        content: "";
        display: table;
        clear: both;
      }
      
      .bottom-note {
        text-align: center;
        font-size: 10px;
        color: #666;
        margin-top: 20px;
        padding: 10px;
        background: #f8f9fa;
        border-radius: 5px;
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
        ${invoiceStyle}
      </head>
      <body>
        <div class="invoice-container">
          <div class="invoice-body">
            <!-- Header Section -->
            <div class="header-section clearfix">
              <div class="company-info">
                <div class="company-name">HARE KRISHNA MEDICAL</div>
                <div class="company-tagline">Your Trusted Healthcare Partner</div>
                <div class="company-details">
                  📍 3 Sahyog Complex, Man Sarovar Circle, Amroli, Surat - 394107, Gujarat<br>
                  📞 +91 76989 13354 | 📱 +91 91060 18508<br>
                  📧 harekrishnamedical@gmail.com
                </div>
              </div>
              
              <div class="invoice-meta">
                <div class="invoice-title">INVOICE</div>
                <div class="invoice-info">
                  <div><strong>Invoice #:</strong> ${invoiceId}</div>
                  <div><strong>Order #:</strong> ${orderId}</div>
                  <div><strong>Date:</strong> ${orderDate}</div>
                  <div><strong>Time:</strong> ${orderTime}</div>
                  <div><strong>Status:</strong> ${status}</div>
                </div>
              </div>
            </div>

            <!-- Customer Information -->
            <div class="customer-section clearfix">
              <div class="bill-to">
                <div class="customer-title">📋 Bill To</div>
                <div class="customer-name">${customerDetails.fullName}</div>
                <div>Email: ${customerDetails.email}</div>
                <div>Phone: ${customerDetails.mobile}</div>
                <div>Address: ${customerDetails.address}</div>
                <div>City: ${customerDetails.city}, ${customerDetails.state}</div>
                <div>PIN: ${customerDetails.pincode}</div>
              </div>
              
              <div class="ship-to">
                <div class="customer-title">🚚 Ship To</div>
                <div class="customer-name">${customerDetails.fullName}</div>
                <div>Address: ${customerDetails.address}</div>
                <div>City: ${customerDetails.city}, ${customerDetails.state}</div>
                <div>PIN: ${customerDetails.pincode}</div>
                <div>Payment: ${paymentMethod}</div>
                <div>Status: ${paymentStatus}</div>
              </div>
            </div>

            <!-- Items Table -->
            <table class="items-table">
              <thead>
                <tr>
                  <th class="text-center" style="width: 40px;">#</th>
                  <th class="text-left">Description</th>
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
                      <strong>${item.name}</strong><br>
                      <small style="color: #666;">${item.company || "Medical Product"}</small>
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

            <!-- Totals -->
            <div class="totals-section">
              <div class="total-row">
                <span>Subtotal:</span>
                <span>₹${calculatedSubtotal.toFixed(2)}</span>
              </div>
              <div class="total-row">
                <span>Shipping:</span>
                <span>${shipping === 0 ? "FREE" : `₹${shipping.toFixed(2)}`}</span>
              </div>
              <div class="total-row">
                <span>Tax (GST):</span>
                <span>Included</span>
              </div>
              <div class="total-row grand-total">
                <span>TOTAL AMOUNT:</span>
                <span>₹${calculatedTotal.toFixed(2)}</span>
              </div>
            </div>

            <!-- Footer -->
            <div class="footer-section clearfix">
              <div class="terms-column">
                <div class="terms-title">📋 Terms & Conditions</div>
                <ul class="terms-list">
                  <li>• Payment is due within 30 days from invoice date</li>
                  <li>• Returns accepted only for damaged items within 7 days</li>
                  <li>• This invoice is computer-generated and legally valid</li>
                  <li>• Subject to Gujarat jurisdiction for legal disputes</li>
                  <li>• All prices are inclusive of applicable taxes</li>
                </ul>
                
                <div style="margin-top: 15px; padding: 10px; background: #f8f9fa; border-left: 3px solid #e63946; font-size: 10px;">
                  <strong>📞 Contact Support:</strong><br>
                  Email: harekrishnamedical@gmail.com<br>
                  Phone: +91 76989 13354 | Emergency: +91 91060 18508<br>
                  Hours: Mon-Sat, 9:00 AM - 8:00 PM
                </div>
              </div>
              
              <div class="qr-column">
                <div class="qr-title">📱 Verification QR</div>
                ${
                  generatedQR
                    ? `<img src="${generatedQR}" alt="Verification QR Code" class="qr-code" />`
                    : '<div style="width: 100px; height: 100px; border: 2px dashed #ccc; display: flex; align-items: center; justify-content: center; margin: 0 auto; font-size: 10px; color: #666;">QR Code</div>'
                }
                <div style="font-size: 9px; color: #666; margin-top: 5px;">
                  Scan to verify invoice<br>
                  authenticity and access<br>
                  online copy
                </div>
              </div>
            </div>

            <!-- Bottom Note -->
            <div class="bottom-note">
              🖥️ This is a computer-generated invoice - No signature required<br>
              Generated: ${new Date().toLocaleString()} | Invoice ID: ${invoiceId}<br>
              <strong>Hare Krishna Medical</strong> - Licensed Medical Store - Gujarat, India
            </div>
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
