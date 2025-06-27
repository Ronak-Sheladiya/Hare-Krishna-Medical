import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import QRCode from "qrcode";

/**
 * Centralized PDF Generation Service
 * Provides consistent PDF generation across the entire application
 */
class PDFService {
  constructor() {
    this.defaultOptions = {
      format: "a4",
      orientation: "portrait",
      unit: "mm",
      quality: 0.9, // Reduced for faster generation
      useCORS: true,
      allowTaint: false,
      scale: 1.8, // Reduced for faster processing
      backgroundColor: "#ffffff",
    };
  }

  /**
   * Generate QR code for any URL
   */
  async generateQRCode(url, options = {}) {
    try {
      const qrOptions = {
        width: 180,
        margin: 2,
        color: {
          dark: "#1a202c",
          light: "#ffffff",
        },
        errorCorrectionLevel: "M",
        ...options,
      };

      const qrCodeDataUrl = await QRCode.toDataURL(url, qrOptions);
      return {
        success: true,
        qrCode: qrCodeDataUrl,
        url,
        generatedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error("QR Code generation error:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Generate PDF from HTML element
   */
  async generatePDFFromElement(element, options = {}) {
    try {
      const {
        filename = "document.pdf",
        quality = this.defaultOptions.quality,
        scale = this.defaultOptions.scale,
        backgroundColor = this.defaultOptions.backgroundColor,
        addQR = false,
        qrUrl = null,
        qrPosition = { x: 170, y: 10, width: 30, height: 30 },
        margin = 5.3, // Default margin, can be overridden for 98% usage
        onProgress = null,
      } = options;

      if (onProgress) onProgress("Preparing document...", 10);

      // Generate canvas from element
      const canvas = await html2canvas(element, {
        quality,
        scale,
        useCORS: this.defaultOptions.useCORS,
        allowTaint: this.defaultOptions.allowTaint,
        backgroundColor,
        logging: false,
        width: element.scrollWidth,
        height: element.scrollHeight,
      });

      if (onProgress) onProgress("Processing canvas...", 40);

      const imgData = canvas.toDataURL("image/png", quality);
      const pdf = new jsPDF(
        this.defaultOptions.orientation,
        this.defaultOptions.unit,
        this.defaultOptions.format,
      );

      // Calculate dimensions with custom margins (default 5.3mm, can be 2.1mm for 98% usage)
      const imgWidth = 210 - margin * 2; // A4 width minus margins
      const pageHeight = 297; // A4 height in mm
      const availableHeight = pageHeight - margin * 2; // Available height minus margins
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = margin; // Start with top margin

      if (onProgress) onProgress("Adding content to PDF...", 70);

      // Add first page with margins
      if (imgHeight <= availableHeight) {
        // Single page - center vertically within available space
        const yOffset = margin + (availableHeight - imgHeight) / 2;
        pdf.addImage(imgData, "PNG", margin, yOffset, imgWidth, imgHeight);
      } else {
        // Multiple pages with margins
        pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
        heightLeft -= availableHeight;

        while (heightLeft >= 0) {
          position = margin + (heightLeft - imgHeight);
          pdf.addPage();
          pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
          heightLeft -= availableHeight;
        }
      }

      // Add QR code if requested
      if (addQR && qrUrl) {
        if (onProgress) onProgress("Adding QR code...", 90);

        const qrResult = await this.generateQRCode(qrUrl, { width: 120 });
        if (qrResult.success) {
          // Go to first page to add QR
          pdf.setPage(1);
          pdf.addImage(
            qrResult.qrCode,
            "PNG",
            qrPosition.x,
            qrPosition.y,
            qrPosition.width,
            qrPosition.height,
          );
        }
      }

      if (onProgress) onProgress("Finalizing PDF...", 100);

      // Check if we should return blob or download
      if (options.returnBlob) {
        const pdfBlob = pdf.output("blob");
        return {
          success: true,
          blob: pdfBlob,
          filename,
          pageCount: pdf.internal.getNumberOfPages(),
          size: {
            width: imgWidth,
            height: imgHeight,
          },
        };
      } else {
        // Save the PDF (download)
        pdf.save(filename);
        return {
          success: true,
          filename,
          pageCount: pdf.internal.getNumberOfPages(),
          size: {
            width: imgWidth,
            height: imgHeight,
          },
        };
      }
    } catch (error) {
      console.error("PDF generation error:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Generate invoice PDF without additional QR code (invoice design already includes QR)
   */
  async generateInvoicePDF(invoiceElement, invoiceData, options = {}) {
    try {
      const {
        filename = `Invoice-${invoiceData.invoiceId || "Unknown"}.pdf`,
        addQR = false, // Disabled: Invoice design already includes QR code
        onProgress = null,
      } = options;

      // Don't add extra QR code for invoices since the design already includes one
      return await this.generatePDFFromElement(invoiceElement, {
        filename,
        addQR,
        onProgress,
      });
    } catch (error) {
      console.error("Invoice PDF generation error:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Generate invoice PDF as blob for preview (without downloading) - optimized for speed
   */
  async generateInvoicePDFBlob(invoiceElement, invoiceData, options = {}) {
    try {
      const {
        addQR = false, // Disabled: Invoice design already includes QR code
        onProgress = null,
        quality = 0.8, // Lower quality for faster preview generation
        scale = 1.5, // Lower scale for faster processing
        backgroundColor = this.defaultOptions.backgroundColor,
      } = options;

      if (onProgress) onProgress("Preparing document...", 10);

      // Generate canvas from element
      const canvas = await html2canvas(invoiceElement, {
        quality,
        scale,
        useCORS: this.defaultOptions.useCORS,
        allowTaint: this.defaultOptions.allowTaint,
        backgroundColor,
        logging: false,
        width: invoiceElement.scrollWidth,
        height: invoiceElement.scrollHeight,
      });

      if (onProgress) onProgress("Processing canvas...", 40);

      const imgData = canvas.toDataURL("image/png", quality);
      const pdf = new jsPDF(
        this.defaultOptions.orientation,
        this.defaultOptions.unit,
        this.defaultOptions.format,
      );

      // Calculate dimensions with 15px margins (approximately 5.3mm)
      const margin = 5.3; // 15px converted to mm
      const imgWidth = 210 - margin * 2; // A4 width minus margins
      const pageHeight = 297; // A4 height in mm
      const availableHeight = pageHeight - margin * 2; // Available height minus margins
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = margin; // Start with top margin

      if (onProgress) onProgress("Adding content to PDF...", 70);

      // Add first page with margins
      if (imgHeight <= availableHeight) {
        // Single page - center vertically within available space
        const yOffset = margin + (availableHeight - imgHeight) / 2;
        pdf.addImage(imgData, "PNG", margin, yOffset, imgWidth, imgHeight);
      } else {
        // Multiple pages with margins
        pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
        heightLeft -= availableHeight;

        while (heightLeft >= 0) {
          position = margin + (heightLeft - imgHeight);
          pdf.addPage();
          pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
          heightLeft -= availableHeight;
        }
      }

      if (onProgress) onProgress("Finalizing PDF...", 100);

      // Return PDF as blob instead of downloading
      const pdfBlob = pdf.output("blob");

      return {
        success: true,
        blob: pdfBlob,
        filename: `Invoice-${invoiceData.invoiceId || "Unknown"}.pdf`,
        pageCount: pdf.internal.getNumberOfPages(),
        size: {
          width: imgWidth + margin * 2,
          height: imgHeight + margin * 2,
        },
      };
    } catch (error) {
      console.error("Invoice PDF blob generation error:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Generate order PDF with QR code pointing to invoice
   */
  async generateOrderPDF(orderElement, orderData, options = {}) {
    try {
      const {
        filename = `Order-${orderData.orderId || orderData._id || "Unknown"}.pdf`,
        addQR = true,
        onProgress = null,
      } = options;

      // Generate QR URL for invoice verification (fixed bug: use invoiceId instead of orderId)
      let qrUrl = null;
      if (addQR && orderData.invoiceId) {
        qrUrl = `${window.location.origin}/invoice/${orderData.invoiceId}`;
      }

      return await this.generatePDFFromElement(orderElement, {
        filename,
        addQR,
        qrUrl,
        qrPosition: { x: 170, y: 10, width: 30, height: 30 },
        onProgress,
      });
    } catch (error) {
      console.error("Order PDF generation error:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Generate analytics report PDF
   */
  async generateAnalyticsPDF(analyticsElement, analyticsData, options = {}) {
    try {
      const {
        filename = `Analytics-${new Date().toISOString().split("T")[0]}.pdf`,
        onProgress = null,
      } = options;

      return await this.generatePDFFromElement(analyticsElement, {
        filename,
        addQR: false,
        onProgress,
      });
    } catch (error) {
      console.error("Analytics PDF generation error:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Print document with proper formatting
   */
  async printDocument(element, options = {}) {
    try {
      const {
        title = "Document",
        styles = "",
        onBeforePrint = null,
        onAfterPrint = null,
      } = options;

      if (onBeforePrint) onBeforePrint();

      const printWindow = window.open("", "_blank");
      const htmlContent = element.innerHTML || element;

      const printStyles = `
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
        }
        body {
          font-family: 'Segoe UI', Arial, sans-serif !important;
          line-height: 1.3 !important;
          color: #333 !important;
          font-size: 12px !important;
        }
        ${styles}
      `;

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${title}</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
            <style>${printStyles}</style>
          </head>
          <body>
            <div class="print-content">
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

      if (onAfterPrint) onAfterPrint();

      return {
        success: true,
        message: "Print dialog opened successfully",
      };
    } catch (error) {
      console.error("Print error:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Batch PDF generation for multiple documents
   */
  async generateBatchPDFs(documents, options = {}) {
    try {
      const {
        onProgress = null,
        onDocumentComplete = null,
        zipFilename = "documents.zip",
      } = options;

      const results = [];
      const total = documents.length;

      for (let i = 0; i < documents.length; i++) {
        const doc = documents[i];
        const progress = Math.round(((i + 1) / total) * 100);

        if (onProgress) {
          onProgress(`Processing document ${i + 1} of ${total}...`, progress);
        }

        let result;
        switch (doc.type) {
          case "invoice":
            result = await this.generateInvoicePDF(
              doc.element,
              doc.data,
              doc.options || {},
            );
            break;
          case "order":
            result = await this.generateOrderPDF(
              doc.element,
              doc.data,
              doc.options || {},
            );
            break;
          case "analytics":
            result = await this.generateAnalyticsPDF(
              doc.element,
              doc.data,
              doc.options || {},
            );
            break;
          default:
            result = await this.generatePDFFromElement(
              doc.element,
              doc.options || {},
            );
        }

        results.push({
          ...result,
          document: doc,
          index: i,
        });

        if (onDocumentComplete) onDocumentComplete(result, i, total);
      }

      return {
        success: true,
        results,
        total,
        successful: results.filter((r) => r.success).length,
        failed: results.filter((r) => !r.success).length,
      };
    } catch (error) {
      console.error("Batch PDF generation error:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Initialize the PDF service globally
   */
  init() {
    window.pdfService = this;
    console.log("PDF Service initialized globally");
  }
}

// Create and export singleton instance
const pdfService = new PDFService();

// Initialize immediately
pdfService.init();

export default pdfService;
