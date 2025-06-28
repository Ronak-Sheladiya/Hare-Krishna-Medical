import QRCode from "qrcode";

/**
 * Centralized Letterhead Service
 * Provides print, download, view, and QR generation functionality for letterheads
 */
class LetterheadService {
  constructor() {
    this.baseUrl = window.location.origin;
  }

  /**
   * Generate QR code for letterhead with public verification link
   */
  async generateLetterheadQR(letterheadId) {
    try {
      const verificationUrl = `${this.baseUrl}/verify-docs?id=${letterheadId}&type=letterhead`;

      const qrCodeDataUrl = await QRCode.toDataURL(verificationUrl, {
        width: 150,
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
          letterhead_id: letterheadId,
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
   * Normalize letterhead data to standard format
   */
  normalizeLetterheadData(letterhead) {
    return {
      letterheadId: letterhead.letterheadId || letterhead._id || letterhead.id,
      title: letterhead.title || "Letterhead",
      content: letterhead.content || "",
      letterType: letterhead.letterType || "document",
      issueDate: letterhead.issueDate || letterhead.createdAt,
      status: letterhead.status || "draft",
      qrCode: letterhead.qrCode,
      recipient: letterhead.recipient || {},
      issuer: letterhead.issuer || {
        name: "Hare Krishna Medical Store",
        designation: "Administrator",
      },
      header: letterhead.header || {
        companyName: "Hare Krishna Medical Store",
        companyAddress:
          "3 Sahyog Complex, Man Sarovar circle, Amroli, 394107, Gujarat",
        companyPhone: "+91 76989 13354 | +91 91060 18508",
        companyEmail: "hkmedicalamroli@gmail.com",
      },
      footer: letterhead.footer || {
        terms:
          "This is an official document issued by Hare Krishna Medical Store. For verification, please contact us at the above details.",
      },
    };
  }

  /**
   * Create professional letterhead template
   */
  createLetterheadTemplate(letterheadData, options = {}) {
    const { showActions = false, forPrint = false } = options;

    const normalizedData = this.normalizeLetterheadData(letterheadData);
    const currentDate = new Date(normalizedData.issueDate).toLocaleDateString(
      "en-IN",
    );

    return `
      <div id="letterhead-print-content" style="font-family: Arial, sans-serif; padding: ${forPrint ? "5px" : "15px"}; background: white; max-width: 210mm; margin: 0 auto; min-height: 297mm; ${forPrint ? "transform: scale(0.85); transform-origin: top;" : ""}">
        <!-- Header Section - Professional Design like Invoice -->
        <div style="background: #e63946; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; position: relative;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <!-- Left Side - Company Info -->
            <div style="flex: 1;">
              <div style="display: flex; align-items: center; margin-bottom: 15px;">
                <div style="position: relative; margin-right: 20px;">
                  <div style="background: white; border-radius: 50%; padding: 12px; border: 3px solid rgba(255,255,255,0.9); box-shadow: 0 6px 20px rgba(0,0,0,0.15);">
                    <img src="https://cdn.builder.io/api/v1/assets/030c65a34d11492ab1cc545443b12540/hk-e0ec29?format=webp&width=800" alt="Hare Krishna Medical Logo" style="height: 56px; width: 56px; object-fit: contain; border-radius: 50%;" onerror="this.style.display='none';" />
                  </div>
                  <div style="position: absolute; top: -5px; right: -5px; width: 20px; height: 20px; background: #27ae60; border-radius: 50%; border: 2px solid white;"></div>
                </div>
                <div>
                  <h1 style="font-size: 28px; font-weight: 900; margin: 0; line-height: 1.1; text-shadow: 1px 1px 2px rgba(0,0,0,0.1);">HARE KRISHNA MEDICAL</h1>
                  <p style="font-size: 14px; margin: 5px 0 0 0; opacity: 0.95; font-weight: 500; letter-spacing: 0.5px;">🏥 Your Trusted Health Partner Since 2020</p>
                  <div style="display: flex; align-items: center; margin-top: 8px; font-size: 12px; opacity: 0.9;">
                    <span style="background: rgba(255,255,255,0.2); padding: 2px 8px; border-radius: 12px; margin-right: 8px;">✓ Verified</span>
                    <span style="background: rgba(255,255,255,0.2); padding: 2px 8px; border-radius: 12px;">📋 Official Document</span>
                  </div>
                </div>
              </div>
              <div style="background: rgba(255,255,255,0.1); padding: 12px; border-radius: 8px; font-size: 11px; line-height: 1.5;">
                <div style="display: flex; align-items: center; margin-bottom: 4px;"><i style="margin-right: 8px;">📍</i> ${normalizedData.header.companyAddress}</div>
                <div style="display: flex; align-items: center; margin-bottom: 4px;"><i style="margin-right: 8px;">📞</i> ${normalizedData.header.companyPhone}</div>
                <div style="display: flex; align-items: center;"><i style="margin-right: 8px;">✉️</i> ${normalizedData.header.companyEmail}</div>
              </div>
            </div>
            
            <!-- Right Side - QR Code and Reference Info -->
            <div style="text-align: right; min-width: 200px;">
              <!-- QR Code Section -->
              <div style="background: white; padding: 12px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); margin-bottom: 15px;">
                ${
                  normalizedData.qrCode
                    ? `<img src="${normalizedData.qrCode}" alt="Verification QR Code" style="width: 120px; height: 120px; border: 2px solid #e63946; border-radius: 8px;" />`
                    : `<div style="width: 120px; height: 120px; border: 2px dashed #e63946; border-radius: 8px; background: #f8f9fa; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #e63946;">
                         <div style="font-size: 14px; margin-bottom: 5px;">📱</div>
                         <div style="font-size: 10px; font-weight: bold; text-align: center; line-height: 1.2;">QR CODE<br>VERIFICATION</div>
                       </div>`
                }
                <div style="margin-top: 8px; color: #333; font-size: 10px; font-weight: bold;">📱 SCAN TO VERIFY</div>
              </div>
              
              <!-- Reference and Date Info -->
              <div style="background: rgba(255,255,255,0.95); color: #333; padding: 15px; border-radius: 8px; font-size: 12px; text-align: left;">
                <div style="margin-bottom: 8px; font-weight: bold; color: #e63946;">LETTERHEAD</div>
                <div style="margin-bottom: 6px;"><strong>Ref:</strong> ${normalizedData.letterheadId}</div>
                <div style="margin-bottom: 6px;"><strong>Date:</strong> ${currentDate}</div>
                <div><strong>Status:</strong> <span style="background: #27ae60; color: white; padding: 2px 8px; border-radius: 12px; font-size: 10px; font-weight: bold;">${normalizedData.status || "Official"}</span></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Letterhead Title -->
        <div style="text-align: center; margin-bottom: 30px;">
          <h2 style="color: #e63946; font-size: 28px; font-weight: bold; margin: 0; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #e63946; display: inline-block; padding-bottom: 8px;">
            ${normalizedData.title}
          </h2>
        </div>

        <!-- Letterhead Content -->
        <div style="font-size: 14px; line-height: 1.8; text-align: justify; margin-bottom: 50px; min-height: 300px; color: #333;">
          ${normalizedData.content}
        </div>

        <!-- Footer Section - Enhanced like Invoice -->
        <div style="position: absolute; bottom: 20px; left: 20px; right: 20px;">
          <div style="display: flex; justify-content: space-between; align-items: stretch; background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); padding: 20px; border-radius: 12px; border: 1px solid #e0e0e0;">
            <div style="flex: 1;">
              <h5 style="font-size: 16px; font-weight: bold; margin: 0 0 12px 0; color: #e63946;">🙏 Hare Krishna Medical Store</h5>
              <div style="font-size: 12px; line-height: 1.6; color: #444;">
                <div style="background: white; padding: 8px 12px; border-radius: 8px; margin-bottom: 8px; border-left: 4px solid #e63946;">
                  <strong>Verification Notice:</strong><br>
                  ${normalizedData.footer.terms}
                </div>
                <div style="display: flex; align-items: center; margin-top: 10px; font-size: 11px;">
                  <span style="background: #e63946; color: white; padding: 4px 8px; border-radius: 12px; margin-right: 8px; font-weight: bold;">📞 24/7 Support</span>
                  <span>${normalizedData.header.companyEmail} | ${normalizedData.header.companyPhone.split(" | ")[0]}</span>
                </div>
              </div>
            </div>

            <!-- Footer QR placeholder if needed -->
            <div style="margin-left: 25px; text-align: center; background: white; padding: 15px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); border: 1px solid #e0e0e0; min-width: 140px;">
              <div style="margin-bottom: 10px;">
                <img src="https://cdn.builder.io/api/v1/assets/030c65a34d11492ab1cc545443b12540/hk-e0ec29?format=webp&width=800" alt="Logo" style="height: 30px; width: 30px; object-fit: contain;" onerror="this.style.display='none';" />
              </div>
              <div style="font-size: 11px; font-weight: bold; color: #e63946;">OFFICIAL DOCUMENT</div>
              <div style="font-size: 9px; color: #666; margin-top: 2px;">Ref: ${normalizedData.letterheadId}</div>
            </div>
          </div>
          
          <!-- Computer Generated Note -->
          <div style="text-align: center; margin-top: 10px; font-size: 10px; color: #888; background: #f8f9fa; padding: 8px; border-radius: 5px;">
            Computer generated letterhead - No signature required | Generated: ${new Date().toLocaleString()}
          </div>
        </div>

        ${
          showActions && !forPrint
            ? `
        <!-- Action Buttons (only show when not printing) -->
        <div class="no-print" style="margin-top: 20px; text-align: center; padding: 20px; background: #f8f9fa; border-radius: 12px; border: 1px solid #e9ecef;">
          <h6 style="margin-bottom: 15px; color: #333; font-weight: 600;">Letterhead Actions</h6>
          <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
            <button onclick="window.handleLetterheadPrint && window.handleLetterheadPrint()" style="background: #e63946; color: white; border: none; padding: 10px 20px; border-radius: 8px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 8px;" onmouseover="this.style.background='#d02943'" onmouseout="this.style.background='#e63946'">
              <span>🖨️</span> Print Letterhead
            </button>
            <button onclick="window.handleLetterheadDownload && window.handleLetterheadDownload()" style="background: #28a745; color: white; border: none; padding: 10px 20px; border-radius: 8px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 8px;" onmouseover="this.style.background='#218838'" onmouseout="this.style.background='#28a745'">
              <span>📥</span> Download PDF
            </button>
          </div>
          <p style="margin-top: 10px; font-size: 12px; color: #666; margin-bottom: 0;">Use the buttons above to print or download this letterhead</p>
        </div>
        `
            : ""
        }
      </div>
    `;
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
        .letterhead-header {
          background: #e63946 !important;
          color: white !important;
          padding: 15px !important;
          margin-bottom: 10px !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
      }
      body {
        font-family: 'Arial', sans-serif !important;
        line-height: 1.3 !important;
        color: #333 !important;
        font-size: 12px !important;
      }
    `;
  }

  /**
   * Print letterhead with professional A4 formatting
   */
  async printLetterhead(letterhead, customContent = null) {
    try {
      const normalizedLetterhead = this.normalizeLetterheadData(letterhead);
      const letterheadId = normalizedLetterhead.letterheadId;

      // Generate QR code if not present
      if (!normalizedLetterhead.qrCode) {
        const qrResult = await this.generateLetterheadQR(letterheadId);
        if (qrResult) {
          normalizedLetterhead.qrCode = qrResult.qrCode;
        }
      }

      const printContent =
        customContent || document.getElementById("letterhead-print-content");
      if (!printContent) {
        // Create content if not found
        const htmlContent = this.createLetterheadTemplate(
          normalizedLetterhead,
          { forPrint: true },
        );
        const printWindow = window.open("", "_blank");
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>${normalizedLetterhead.title} - Letterhead</title>
              <style>
                ${this.getPrintStyles()}
              </style>
            </head>
            <body>
              ${htmlContent}
              <script>
                window.onload = function() {
                  window.print();
                };
              </script>
            </body>
          </html>
        `);
        printWindow.document.close();
        return { success: true, message: "Print dialog opened successfully" };
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
            <title>${normalizedLetterhead.title} - Letterhead</title>
            <style>
              ${this.getPrintStyles()}
            </style>
          </head>
          <body>
            ${htmlContent}
            <script>
              window.onload = function() {
                window.print();
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
   * Download letterhead as HTML file
   */
  async downloadLetterhead(letterhead, customContent = null) {
    try {
      const normalizedLetterhead = this.normalizeLetterheadData(letterhead);
      const letterheadId = normalizedLetterhead.letterheadId;

      // Generate QR code if not present
      if (!normalizedLetterhead.qrCode) {
        const qrResult = await this.generateLetterheadQR(letterheadId);
        if (qrResult) {
          normalizedLetterhead.qrCode = qrResult.qrCode;
        }
      }

      let htmlContent;
      if (customContent) {
        htmlContent =
          typeof customContent === "string"
            ? customContent
            : customContent.innerHTML;
      } else {
        htmlContent = this.createLetterheadTemplate(normalizedLetterhead, {
          forPrint: true,
        });
      }

      const fullHtmlContent = `
<!DOCTYPE html>
<html>
<head>
  <title>${normalizedLetterhead.title} - Letterhead</title>
  <meta charset="UTF-8">
  <style>
    ${this.getPrintStyles()}
  </style>
</head>
<body>
  ${htmlContent}
</body>
</html>
      `;

      const blob = new Blob([fullHtmlContent], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${normalizedLetterhead.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_letterhead.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      return { success: true, message: "Download initiated successfully" };
    } catch (error) {
      console.error("Download failed:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * View letterhead in new tab with print and download options
   */
  viewLetterhead(letterhead) {
    try {
      const normalizedLetterhead = this.normalizeLetterheadData(letterhead);
      const letterheadId = normalizedLetterhead.letterheadId;

      // Navigate to the letterhead verification page
      const viewUrl = `${this.baseUrl}/verify-docs?id=${letterheadId}&type=letterhead`;
      window.open(viewUrl, "_blank");

      return {
        success: true,
        message: "Letterhead opened in new tab",
        url: viewUrl,
      };
    } catch (error) {
      console.error("View failed:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Create letterhead action buttons HTML
   */
  createActionButtons(letterhead, options = {}) {
    const normalizedLetterhead = this.normalizeLetterheadData(letterhead);

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
          onclick="window.letterheadService.viewLetterhead(${JSON.stringify(normalizedLetterhead).replace(/"/g, "&quot;")})"
          title="View Letterhead"
        >
          <i class="bi bi-eye"></i> View
        </button>
      `);
    }

    if (showPrint) {
      buttons.push(`
        <button
          class="${buttonClass} btn-outline-secondary"
          onclick="window.letterheadService.printLetterhead(${JSON.stringify(normalizedLetterhead).replace(/"/g, "&quot;")})"
          title="Print Letterhead"
        >
          <i class="bi bi-printer"></i> Print
        </button>
      `);
    }

    if (showDownload) {
      buttons.push(`
        <button
          class="${buttonClass} btn-outline-success"
          onclick="window.letterheadService.downloadLetterhead(${JSON.stringify(normalizedLetterhead).replace(/"/g, "&quot;")})"
          title="Download Letterhead"
        >
          <i class="bi bi-download"></i> Download
        </button>
      `);
    }

    return `<div class="${containerClass}">${buttons.join("")}</div>`;
  }
}

// Create and export singleton instance
const letterheadService = new LetterheadService();

// Make service globally available for inline button calls
if (typeof window !== "undefined") {
  window.letterheadService = letterheadService;
}

export default letterheadService;
