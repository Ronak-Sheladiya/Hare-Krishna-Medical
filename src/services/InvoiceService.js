import QRCode from "qrcode";

/**
 * Centralized Invoice Service
 * Provides print, download, view, and QR generation functionality for invoices
 */
class InvoiceService {
  constructor() {
    this.baseUrl = window.location.origin;
  }

  /**
   * Generate QR code for invoice with public verification link
   */
  async generateInvoiceQR(invoiceId) {
    try {
      const verificationUrl = `${this.baseUrl}/invoice-verify/${invoiceId}`;

      const qrCodeDataUrl = await QRCode.toDataURL(verificationUrl, {
        width: 180,
        margin: 2,
        color: {
          dark: "#1a202c",
          light: "#ffffff",
        },
        errorCorrectionLevel: "M",
      });

      return {
        qrCode: qrCodeDataUrl,
        verificationUrl,
        qrData: {
          invoice_id: invoiceId,
          verification_url: verificationUrl,
          generated_at: new Date().toISOString(),
        },
      };
    } catch (error) {
      console.error("QR Code generation error:", error);
      return null;
    }
  }

  /**
   * Normalize invoice data to standard format
   */
  normalizeInvoiceData(invoice) {
    return {
      invoiceId: invoice.invoiceId || invoice._id || invoice.id,
      orderId: invoice.order?.orderId || invoice.orderId,
      orderDate: new Date(
        invoice.invoiceDate || invoice.createdAt || Date.now(),
      ).toLocaleDateString("en-IN"),
      orderTime: new Date(
        invoice.invoiceDate || invoice.createdAt || Date.now(),
      ).toLocaleTimeString("en-IN"),
      customerDetails: {
        fullName:
          invoice.customerDetails?.fullName ||
          invoice.customerName ||
          "Customer",
        email: invoice.customerDetails?.email || invoice.customerEmail || "",
        mobile:
          invoice.customerDetails?.mobile ||
          invoice.customerMobile ||
          invoice.customerPhone ||
          "",
        address:
          invoice.customerDetails?.address || invoice.customerAddress || "",
        city: invoice.customerDetails?.city || invoice.customerCity || "",
        state: invoice.customerDetails?.state || invoice.customerState || "",
        pincode:
          invoice.customerDetails?.pincode || invoice.customerPincode || "",
      },
      items: invoice.items || [],
      subtotal: invoice.subtotal || invoice.total || invoice.totalAmount || 0,
      shipping: invoice.shipping || invoice.shippingCharges || 0,
      tax: 0, // Always 0 as per requirements
      total: invoice.total || invoice.totalAmount || 0,
      paymentMethod: invoice.paymentMethod || "COD",
      paymentStatus: invoice.paymentStatus || invoice.status || "Pending",
      status: invoice.status || invoice.paymentStatus || "Pending",
      qrCode: invoice.qrCode,
    };
  }

  /**
   * Get professional print styles for A4 page
   */
  getPrintStyles() {
    return `
      @page {
        size: A4;
        margin: 15mm;
      }
      @media print {
        body {
          margin: 0 !important;
          color: black !important;
          font-size: 11px !important;
          line-height: 1.3 !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        .no-print { 
          display: none !important; 
        }
        .page-break { 
          page-break-before: always; 
        }
        .invoice-content {
          max-height: none !important;
          overflow: visible !important;
          display: block !important;
        }
        .invoice-header {
          background: #e63946 !important;
          color: white !important;
          padding: 15px !important;
          margin-bottom: 10px !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        .company-info {
          font-size: 10px !important;
          line-height: 1.2 !important;
        }
        .invoice-title {
          font-size: 28px !important;
          margin-bottom: 10px !important;
        }
        .customer-info, .payment-info {
          padding: 12px !important;
          margin-bottom: 8px !important;
        }
        .table {
          font-size: 10px !important;
          margin-bottom: 8px !important;
        }
        .table th, .table td {
          padding: 4px 6px !important;
          border: 1px solid #dee2e6 !important;
          line-height: 1.2 !important;
        }
        .total-section {
          margin-top: 8px !important;
        }
        .footer-text {
          font-size: 9px !important;
          margin-top: 10px !important;
          border-top: 1px solid #dee2e6 !important;
          padding-top: 8px !important;
        }
      }
      body {
        font-family: 'Segoe UI', Arial, sans-serif !important;
        line-height: 1.3 !important;
        color: #333 !important;
        font-size: 12px !important;
      }
      .text-medical-red { 
        color: #e63946 !important; 
      }
      .text-success { 
        color: #28a745 !important; 
      }
      .company-logo { 
        max-width: 60px !important; 
        height: auto !important; 
      }
      .table th, .table td { 
        padding: 6px !important; 
        border: 1px solid #dee2e6 !important; 
      }
    `;
  }

  /**
   * Print invoice with professional A4 formatting
   */
  async printInvoice(invoice, customContent = null) {
    try {
      const normalizedInvoice = this.normalizeInvoiceData(invoice);
      const invoiceId = normalizedInvoice.invoiceId;

      // Generate QR code if not present
      if (!normalizedInvoice.qrCode) {
        const qrResult = await this.generateInvoiceQR(invoiceId);
        if (qrResult) {
          normalizedInvoice.qrCode = qrResult.qrCode;
        }
      }

      const printContent =
        customContent || document.getElementById("invoice-print-content");
      if (!printContent) {
        throw new Error("Invoice content not found for printing");
      }

      const printWindow = window.open("", "_blank");
      const htmlContent =
        typeof printContent === "string"
          ? printContent
          : printContent.innerHTML;

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Invoice ${invoiceId}</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
            <style>
              ${this.getPrintStyles()}
            </style>
          </head>
          <body>
            <div class="invoice-content">
              ${htmlContent}
            </div>
            <script>
              window.onload = function() {
                setTimeout(function() {
                  window.print();
                  window.close();
                }, 500);
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();

      return { success: true, message: "Print dialog opened successfully" };
    } catch (error) {
      console.error("Print failed:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Download invoice as PDF with A4 formatting
   */
  async downloadInvoice(invoice, customContent = null) {
    try {
      const normalizedInvoice = this.normalizeInvoiceData(invoice);
      const invoiceId = normalizedInvoice.invoiceId;

      // Generate QR code if not present
      if (!normalizedInvoice.qrCode) {
        const qrResult = await this.generateInvoiceQR(invoiceId);
        if (qrResult) {
          normalizedInvoice.qrCode = qrResult.qrCode;
        }
      }

      const printContent =
        customContent || document.getElementById("invoice-print-content");
      if (!printContent) {
        throw new Error("Invoice content not found for download");
      }

      // Create hidden iframe for PDF generation
      const iframe = document.createElement("iframe");
      iframe.style.display = "none";
      document.body.appendChild(iframe);

      const htmlContent =
        typeof printContent === "string"
          ? printContent
          : printContent.innerHTML;
      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

      iframeDoc.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Invoice ${invoiceId}</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
            <style>
              ${this.getPrintStyles()}
            </style>
          </head>
          <body>
            ${htmlContent}
          </body>
        </html>
      `);
      iframeDoc.close();

      // Wait for content to load then trigger download
      setTimeout(() => {
        try {
          iframe.contentWindow.print();
          setTimeout(() => {
            document.body.removeChild(iframe);
          }, 1000);
        } catch (error) {
          document.body.removeChild(iframe);
          throw error;
        }
      }, 1000);

      return { success: true, message: "Download initiated successfully" };
    } catch (error) {
      console.error("Download failed:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * View invoice in new tab with print and download options
   */
  viewInvoice(invoice) {
    try {
      const normalizedInvoice = this.normalizeInvoiceData(invoice);
      const invoiceId = normalizedInvoice.invoiceId;

      // Navigate to the centralized invoice details page
      const viewUrl = `${this.baseUrl}/invoice-details/${invoiceId}`;
      window.open(viewUrl, "_blank");

      return {
        success: true,
        message: "Invoice opened in new tab",
        url: viewUrl,
      };
    } catch (error) {
      console.error("View failed:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get public verification URL for invoice
   */
  getVerificationUrl(invoiceId) {
    return `${this.baseUrl}/invoice-verify/${invoiceId}`;
  }

  /**
   * Get invoice details URL
   */
  getInvoiceUrl(invoiceId) {
    return `${this.baseUrl}/invoice-details/${invoiceId}`;
  }

  /**
   * Create invoice action buttons HTML
   */
  createActionButtons(invoice, options = {}) {
    const normalizedInvoice = this.normalizeInvoiceData(invoice);
    const invoiceId = normalizedInvoice.invoiceId;

    const {
      showPrint = true,
      showDownload = true,
      showView = true,
      buttonClass = "btn btn-sm",
      containerClass = "d-flex gap-2",
    } = options;

    const buttons = [];

    if (showView) {
      buttons.push(`
        <button 
          class="${buttonClass} btn-outline-primary" 
          onclick="window.invoiceService.viewInvoice(${JSON.stringify(normalizedInvoice).replace(/"/g, "&quot;")})"
          title="View Invoice"
        >
          <i class="bi bi-eye"></i> View
        </button>
      `);
    }

    if (showPrint) {
      buttons.push(`
        <button 
          class="${buttonClass} btn-outline-secondary" 
          onclick="window.invoiceService.printInvoice(${JSON.stringify(normalizedInvoice).replace(/"/g, "&quot;")})"
          title="Print Invoice"
        >
          <i class="bi bi-printer"></i> Print
        </button>
      `);
    }

    if (showDownload) {
      buttons.push(`
        <button 
          class="${buttonClass} btn-outline-success" 
          onclick="window.invoiceService.downloadInvoice(${JSON.stringify(normalizedInvoice).replace(/"/g, "&quot;")})"
          title="Download PDF"
        >
          <i class="bi bi-download"></i> Download
        </button>
      `);
    }

    return `<div class="${containerClass}">${buttons.join("")}</div>`;
  }

  /**
   * Initialize global invoice service
   */
  init() {
    // Make service globally available
    window.invoiceService = this;

    // Add global styles for invoice actions
    if (!document.getElementById("invoice-service-styles")) {
      const styleSheet = document.createElement("style");
      styleSheet.id = "invoice-service-styles";
      styleSheet.textContent = `
        .invoice-actions .btn {
          font-size: 12px;
          padding: 6px 12px;
          font-weight: 500;
        }
        .invoice-actions .btn i {
          font-size: 14px;
        }
        .invoice-actions .btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        }
        @media print {
          .invoice-actions {
            display: none !important;
          }
        }
      `;
      document.head.appendChild(styleSheet);
    }

    console.log("Invoice Service initialized successfully");
  }
}

// Create and export singleton instance
const invoiceService = new InvoiceService();

export default invoiceService;
