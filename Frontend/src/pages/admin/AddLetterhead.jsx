import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
  Spinner,
  Modal,
  ButtonGroup,
  Dropdown,
} from "react-bootstrap";
import { api, safeApiCall } from "../../utils/apiClient";
import {
  PageHeroSection,
  ThemeButton,
} from "../../components/common/ConsistentTheme";
import letterheadService from "../../services/LetterheadService";
import PDFService from "../../services/PDFService";
import "../../styles/RichTextEditor.css";
import "../../styles/LetterheadPreview.css";

const AddLetterhead = () => {
  const navigate = useNavigate();
  const editorRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [letterheadId, setLetterheadId] = useState("");
  const [qrCode, setQrCode] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });

  // Loading states for print and download
  const [printLoading, setPrintLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [pdfDownloadLoading, setPdfDownloadLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);

  // Rich text editor functionality
  const formatText = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current.focus();
  };

  const handleContentChange = () => {
    if (editorRef.current) {
      setFormData((prev) => ({
        ...prev,
        content: editorRef.current.innerHTML,
      }));
    }
  };

  // Generate QR code for preview - Enhanced for real-time generation
  const generatePreviewQRCode = async (tempId) => {
    try {
      const QRCode = await import("qrcode");
      const verificationUrl = `${window.location.origin}/verify/letterhead/${tempId}`;
      const qrDataURL = await QRCode.toDataURL(verificationUrl, {
        width: 200,
        margin: 2,
        color: {
          dark: "#1a202c",
          light: "#ffffff",
        },
        errorCorrectionLevel: "H", // High error correction for better scanning
        type: "image/png",
        quality: 0.95,
      });
      return qrDataURL;
    } catch (error) {
      console.error("QR generation error:", error);
      return null;
    }
  };

  // Auto-generate QR when form data changes
  useEffect(() => {
    const generateQRCodeOnChange = async () => {
      if (formData.title && formData.content) {
        const tempId = letterheadId || generateTempLetterheadId();
        if (!letterheadId) {
          setLetterheadId(tempId);
        }

        // Only generate new QR if we don't have one yet
        if (!qrCode) {
          const generatedQR = await generatePreviewQRCode(tempId);
          if (generatedQR) {
            setQrCode(generatedQR);
          }
        }
      }
    };

    // Debounce QR generation to avoid too many calls
    const timeoutId = setTimeout(generateQRCodeOnChange, 500);
    return () => clearTimeout(timeoutId);
  }, [formData.title, formData.content, letterheadId, qrCode]);

  // Cleanup PDF URL on unmount
  useEffect(() => {
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!formData.title.trim() || !formData.content.trim()) {
        setError("Please fill in both title and content");
        return;
      }

      const safeResponse = await safeApiCall(() =>
        api.post("/api/letterheads", {
          title: formData.title,
          content: formData.content,
          letterType: "document",
          createdAt: new Date().toISOString(),
        }),
      );

      if (safeResponse?.success) {
        const response = safeResponse.data;
        if (response?.success) {
          setSuccess("Letterhead created successfully!");
          // Set letterhead ID and QR from response for immediate use
          const createdLetterhead = response.letterhead;
          if (createdLetterhead) {
            setLetterheadId(createdLetterhead.letterheadId);
            setQrCode(createdLetterhead.qrCode);
          }
          setTimeout(() => {
            navigate("/admin/letterheads");
          }, 1500);
        } else {
          throw new Error(response?.message || "Failed to create letterhead");
        }
      } else {
        throw new Error(safeResponse?.error || "Failed to create letterhead");
      }
    } catch (error) {
      console.error("Submit error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Generate temp letterhead ID for preview
  const generateTempLetterheadId = () => {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, "0");
    const day = String(new Date().getDate()).padStart(2, "0");
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");
    return `HKMS/LH/${year}/${month}/${day}/${random}`;
  };

  // Handle preview with QR generation
  const handlePreview = async () => {
    if (!formData.title || !formData.content) return;

    const tempId = letterheadId || generateTempLetterheadId();
    setLetterheadId(tempId);

    if (!qrCode) {
      const generatedQR = await generatePreviewQRCode(tempId);
      if (generatedQR) {
        setQrCode(generatedQR);
      }
    }

    setShowPreview(true);
  };

  // Manual refresh QR code
  const handleRefreshPreview = async () => {
    if (!formData.title || !formData.content) return;

    const tempId = letterheadId || generateTempLetterheadId();
    setLetterheadId(tempId);

    // Force regenerate QR code
    const generatedQR = await generatePreviewQRCode(tempId);
    if (generatedQR) {
      setQrCode(generatedQR);
    }
  };

  const createLetterheadTemplate = () => {
    const currentDate = new Date().toLocaleDateString("en-IN");
    const currentLetterheadId = letterheadId || generateTempLetterheadId();

    return `
      <div id="letterhead-print-content" style="
        font-family: Arial, sans-serif;
        width: 794px;
        height: 1123px;
        background: white;
        position: relative;
        margin: 0 !important;
        padding: 0 !important;
        box-sizing: border-box;
        font-size: 13px;
        line-height: 1.5;
        color: #333;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        transform: scale(1) !important;
      ">
        <!-- Page Content Container using full page -->
        <div style="
          padding: 8px;
          height: 100%;
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
        ">
          <!-- Header Section -->
          <div style="
            background: #e63946;
            color: white;
            padding: 15px;
            border-radius: 6px;
            margin-bottom: 15px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-shrink: 0;
          ">
          <!-- Company Information -->
          <div style="flex: 1;">
            <div style="display: flex; align-items: center; margin-bottom: 12px;">
              <div style="
                background: white;
                border-radius: 50%;
                padding: 10px;
                margin-right: 15px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.1);
              ">
                <img src="https://cdn.builder.io/api/v1/assets/030c65a34d11492ab1cc545443b12540/hk-e0ec29?format=webp&width=800"
                     alt="Hare Krishna Medical Logo"
                     style="height: 45px; width: 45px; object-fit: contain;"
                     onerror="this.style.display='none';" />
              </div>
              <div>
                <h1 style="
                  font-size: 24px;
                  font-weight: 900;
                  margin: 0;
                  line-height: 1.1;
                  text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
                  font-family: 'Georgia', serif;
                ">HARE KRISHNA MEDICAL</h1>
                <p style="
                  font-size: 12px;
                  margin: 4px 0 0 0;
                  opacity: 0.95;
                  font-weight: 500;
                ">🏥 Your Trusted Health Partner Since 2020</p>
              </div>
            </div>
            <div style="
              background: rgba(255,255,255,0.1);
              padding: 10px;
              border-radius: 6px;
              font-size: 10px;
              line-height: 1.4;
            ">
              <div style="margin-bottom: 4px;">📍 3 Sahyog Complex, Man Sarovar circle, Amroli, 394107, Gujarat</div>
              <div style="margin-bottom: 4px;">📞 +91 76989 13354 | +91 91060 18508</div>
              <div>✉️ hkmedicalamroli@gmail.com</div>
            </div>
          </div>

          <!-- QR Code Section - Properly Aligned -->
          <div style="
            text-align: center;
            min-width: 110px;
            margin-left: 20px;
          ">
            <div style="
              background: white;
              padding: 10px;
              border-radius: 8px;
              box-shadow: 0 3px 10px rgba(0,0,0,0.15);
            ">
              ${
                qrCode
                  ? `<img src="${qrCode}" alt="Verification QR Code" style="
                       width: 85px;
                       height: 85px;
                       border: 2px solid #e63946;
                       border-radius: 6px;
                       display: block;
                     " />`
                  : `<div style="
                       width: 85px;
                       height: 85px;
                       border: 2px dashed #e63946;
                       border-radius: 6px;
                       background: #f8f9fa;
                       display: flex;
                       flex-direction: column;
                       align-items: center;
                       justify-content: center;
                       color: #e63946;
                     ">
                       <div style="font-size: 14px; margin-bottom: 4px;">📱</div>
                       <div style="font-size: 9px; font-weight: bold; text-align: center; line-height: 1.1;">QR CODE<br>VERIFICATION</div>
                     </div>`
              }
              <div style="
                margin-top: 6px;
                color: #333;
                font-size: 9px;
                font-weight: bold;
              ">📱 SCAN TO VERIFY</div>
            </div>
          </div>
        </div>

          <!-- Reference and Date - Top Right, Left Aligned -->
          <div style="
            text-align: left;
            margin: 0 0 16px auto;
            font-size: 11px;
            color: #666;
            width: fit-content;
            flex-shrink: 0;
          ">
            <div style="margin-bottom: 3px; font-weight: 600;">Ref: ${currentLetterheadId}</div>
            <div style="font-weight: 600;">Date: ${currentDate}</div>
          </div>

          <!-- Document Title -->
          <div style="text-align: center; margin-bottom: 20px; flex-shrink: 0;">
            <h2 style="
              color: #e63946;
              font-size: 20px;
              font-weight: bold;
              margin: 0;
              text-transform: uppercase;
              letter-spacing: 1.2px;
              border-bottom: 3px solid #e63946;
              display: inline-block;
              padding-bottom: 6px;
              font-family: 'Georgia', serif;
            ">
              ${formData.title}
            </h2>
          </div>

          <!-- Content Section - Uses remaining space -->
          <div style="
            font-size: 13px;
            line-height: 1.5;
            text-align: justify;
            color: #333;
            font-family: Arial, sans-serif;
            flex: 1;
            overflow: hidden;
            margin-bottom: 15px;
            min-height: 180px;
          ">
            ${formData.content}
          </div>

          <!-- Footer Section - Fixed at bottom -->
          <div style="
            border-top: 2px solid #e63946;
            padding-top: 10px;
            margin-top: auto;
            background: white;
            flex-shrink: 0;
          ">
          <div style="text-align: center;">
            <p style="
              font-size: 11px;
              color: #666;
              margin-bottom: 5px;
              font-weight: 600;
            ">
              ✅ This letterhead has been verified and is authentic
            </p>
            <p style="
              font-size: 10px;
              color: #999;
              margin-bottom: 0;
              line-height: 1.3;
            ">
              Verified on ${new Date().toLocaleString("en-IN")} | For queries: +91 76989 13354 | hkmedicalamroli@gmail.com
            </p>
          </div>
        </div>
        </div>
      </div>
    `;
  };

  // PROFESSIONAL PDF GENERATION FUNCTIONALITY
  const generateLetterheadPDF = async () => {
    if (!formData.title || !formData.content) {
      setError("Please fill in both title and content before generating PDF.");
      return null;
    }

    try {
      // Ensure QR code is generated
      if (!qrCode) {
        const tempId = letterheadId || generateTempLetterheadId();
        setLetterheadId(tempId);
        const generatedQR = await generatePreviewQRCode(tempId);
        if (generatedQR) {
          setQrCode(generatedQR);
        }
      }

      // Wait for QR code to render
      await new Promise((resolve) => setTimeout(resolve, 500));

      const letterheadElement = document.getElementById(
        "letterhead-print-content",
      );
      if (!letterheadElement) {
        throw new Error("Letterhead content not found");
      }

      // Apply professional styling for PDF generation
      const originalStyles = letterheadElement.style.cssText;
      const originalClass = letterheadElement.className;

      // Enhanced styling for professional PDF output
      letterheadElement.style.cssText = `
        width: 794px !important;
        height: auto !important;
        min-height: 1123px !important;
        transform: scale(1) !important;
        background: white !important;
        font-family: 'Times New Roman', serif !important;
        color: #000 !important;
        line-height: 1.6 !important;
        box-shadow: none !important;
        margin: 0 !important;
        padding: 40px !important;
        position: relative !important;
        z-index: 1 !important;
        border: none !important;
        outline: none !important;
      `;

      letterheadElement.className = originalClass + " pdf-export-mode";

      // Add temporary CSS for enhanced PDF quality
      const tempStyle = document.createElement("style");
      tempStyle.textContent = `
        .pdf-export-mode * {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          color-adjust: exact !important;
        }
        .pdf-export-mode .letterhead-header {
          border-bottom: 4px solid #dc3545 !important;
          margin-bottom: 30px !important;
          padding-bottom: 20px !important;
        }
        .pdf-export-mode .letterhead-footer {
          border-top: 2px solid #6c757d !important;
          margin-top: 40px !important;
          padding-top: 20px !important;
        }
        .pdf-export-mode .company-logo {
          max-width: 80px !important;
          height: auto !important;
        }
        .pdf-export-mode h1, .pdf-export-mode h2, .pdf-export-mode h3 {
          color: #dc3545 !important;
          font-weight: bold !important;
        }
        .pdf-export-mode .qr-code {
          border: 2px solid #ddd !important;
          padding: 5px !important;
          background: white !important;
        }
        .pdf-export-mode table {
          border-collapse: collapse !important;
        }
        .pdf-export-mode table td, .pdf-export-mode table th {
          border: 1px solid #000 !important;
          padding: 8px !important;
        }
      `;
      document.head.appendChild(tempStyle);

      // Professional PDF generation with highest quality settings
      const result = await PDFService.generatePDFFromElement(
        letterheadElement,
        {
          filename: `${formData.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_letterhead_${new Date().toISOString().split("T")[0]}.pdf`,
          returnBlob: true,
          margin: 0, // Full page for professional letterhead
          quality: 0.98, // Highest quality for professional documents
          scale: 3, // Very high resolution for crisp text and graphics
          backgroundColor: "#ffffff",
          useCORS: true,
          allowTaint: false,
          logging: false,
          onProgress: (message, progress) => {
            console.log(`PDF Generation: ${message} (${progress}%)`);
            // You could show progress to user here if needed
          },
        },
      );

      // Cleanup: Restore original styles and remove temp CSS
      letterheadElement.style.cssText = originalStyles;
      letterheadElement.className = originalClass;
      document.head.removeChild(tempStyle);

      if (result.success) {
        const pdfBlobUrl = URL.createObjectURL(result.blob);
        setPdfUrl(pdfBlobUrl);
        setSuccess("Professional letterhead PDF generated successfully!");
        setTimeout(() => setSuccess(null), 3000);
        return pdfBlobUrl;
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("PDF generation failed:", error);
      setError(`PDF generation failed: ${error.message}`);
      return null;
    }
  };

  // PDF DOWNLOAD FUNCTIONALITY
  const handlePDFDownload = async () => {
    try {
      setPdfDownloadLoading(true);
      setError(null);

      const pdfBlobUrl = await generateLetterheadPDF();
      if (pdfBlobUrl) {
        // Create download link
        const a = document.createElement("a");
        a.href = pdfBlobUrl;
        a.download = `${formData.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_letterhead_${new Date().toISOString().split("T")[0]}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        setSuccess("PDF downloaded successfully!");
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (error) {
      console.error("PDF download failed:", error);
      setError(`PDF download failed: ${error.message}`);
    } finally {
      setPdfDownloadLoading(false);
    }
  };

  // PROFESSIONAL PRINT FUNCTIONALITY
  const handlePrint = async () => {
    if (!formData.title || !formData.content) {
      setError("Please fill in both title and content before printing.");
      return;
    }

    try {
      setPrintLoading(true);
      setError(null);

      // Ensure QR code is generated
      if (!qrCode) {
        const tempId = letterheadId || generateTempLetterheadId();
        setLetterheadId(tempId);
        const generatedQR = await generatePreviewQRCode(tempId);
        if (generatedQR) {
          setQrCode(generatedQR);
        }
      }

      // Wait for QR code to render
      await new Promise((resolve) => setTimeout(resolve, 500));

      const letterheadElement = document.getElementById(
        "letterhead-print-content",
      );
      if (!letterheadElement) {
        throw new Error("Letterhead content not found");
      }

      // Create professional print window with enhanced styling
      const printWindow = window.open("", "_blank");
      const htmlContent = letterheadElement.outerHTML;

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${formData.title} - Professional Letterhead</title>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              @page {
                size: A4 portrait;
                margin: 15mm;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
                color-adjust: exact;
              }

              @media print {
                * {
                  -webkit-print-color-adjust: exact !important;
                  print-color-adjust: exact !important;
                  color-adjust: exact !important;
                  box-shadow: none !important;
                  text-shadow: none !important;
                }

                body {
                  margin: 0 !important;
                  padding: 0 !important;
                  color: #000 !important;
                  background: white !important;
                  font-family: 'Times New Roman', serif !important;
                  font-size: 12pt !important;
                  line-height: 1.6 !important;
                }

                .no-print, .print-button, button, .btn {
                  display: none !important;
                }

                .letterhead-header {
                  border-bottom: 4px solid #dc3545 !important;
                  margin-bottom: 20pt !important;
                  padding-bottom: 15pt !important;
                  page-break-inside: avoid;
                }

                .letterhead-footer {
                  border-top: 2px solid #6c757d !important;
                  margin-top: 20pt !important;
                  padding-top: 15pt !important;
                  page-break-inside: avoid;
                }

                .company-logo {
                  max-width: 60pt !important;
                  height: auto !important;
                }

                h1, h2, h3, h4, h5, h6 {
                  color: #dc3545 !important;
                  font-weight: bold !important;
                  page-break-after: avoid;
                }

                .qr-code {
                  border: 1pt solid #ddd !important;
                  padding: 3pt !important;
                  background: white !important;
                }

                table {
                  border-collapse: collapse !important;
                  width: 100% !important;
                }

                table td, table th {
                  border: 1pt solid #000 !important;
                  padding: 6pt !important;
                  text-align: left !important;
                }

                p, div {
                  orphans: 3;
                  widows: 3;
                }

                .letterhead-content {
                  page-break-inside: avoid;
                }
              }

              @media screen {
                body {
                  font-family: 'Times New Roman', serif;
                  max-width: 210mm;
                  margin: 0 auto;
                  background: white;
                  padding: 20px;
                }
              }
            </style>
          </head>
          <body>
            ${htmlContent}
            <script>
              window.onload = function() {
                setTimeout(function() {
                  window.print();
                  window.onafterprint = function() {
                    window.close();
                  };
                }, 500);
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();

      setSuccess("Professional print dialog opened successfully!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error("Print failed:", error);
      setError(`Print failed: ${error.message}`);
    } finally {
      setPrintLoading(false);
    }
  };

  // DIRECT HTML DOWNLOAD FUNCTIONALITY
  const handleDownload = async () => {
    if (!formData.title || !formData.content) {
      setError("Please fill in both title and content before downloading.");
      return;
    }

    try {
      setDownloadLoading(true);
      setError(null);

      // Ensure QR code is generated
      if (!qrCode) {
        const tempId = letterheadId || generateTempLetterheadId();
        setLetterheadId(tempId);
        const generatedQR = await generatePreviewQRCode(tempId);
        if (generatedQR) {
          setQrCode(generatedQR);
        }
      }

      // Wait for QR code to render
      await new Promise((resolve) => setTimeout(resolve, 300));

      const letterheadElement = document.getElementById(
        "letterhead-print-content",
      );
      if (!letterheadElement) {
        throw new Error("Letterhead content not found");
      }

      // Create complete HTML document
      const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${formData.title} - Letterhead</title>
  <style>
    @page {
      size: A4;
      margin: 0;
    }
    @media print {
      body {
        margin: 0 !important;
        padding: 0 !important;
        color: black !important;
        background: white !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      .no-print {
        display: none !important;
      }
    }
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      background: white;
      color: black;
    }
  </style>
</head>
<body>
  ${letterheadElement.outerHTML}
</body>
</html>`;

      // Create and download HTML file
      const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${formData.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_letterhead_${new Date().toISOString().split("T")[0]}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setSuccess("HTML file downloaded successfully!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error("Download failed:", error);
      setError(`Download failed: ${error.message}`);
    } finally {
      setDownloadLoading(false);
    }
  };

  return (
    <Container fluid style={{ padding: "10px" }}>
      <PageHeroSection
        title="Create Letterhead"
        subtitle="Create official letterheads with verification QR codes, real-time preview, and PDF generation"
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Letterheads", href: "/admin/letterheads" },
          { label: "Create", active: true },
        ]}
      />

      <Container fluid style={{ marginTop: "10px", padding: "20px" }}>
        <Row className="g-3" style={{ minHeight: "calc(100vh - 150px)" }}>
          {/* Form Section */}
          <Col lg={4} md={5}>
            <Card
              className="shadow-lg"
              style={{
                borderRadius: "12px",
                border: "none",
                height: "calc(100vh - 180px)",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Card.Header
                className="text-white"
                style={{
                  background: "linear-gradient(135deg, #e63946, #dc3545)",
                  borderRadius: "12px 12px 0 0",
                  padding: "15px",
                }}
              >
                <h5 className="mb-0" style={{ fontWeight: "600" }}>
                  <i className="bi bi-file-earmark-text me-2"></i>
                  Letterhead Information
                </h5>
                <small style={{ opacity: "0.9" }}>
                  Fill in the details below to create your letterhead
                </small>
              </Card.Header>
              <Card.Body
                style={{
                  padding: "20px",
                  overflowY: "auto",
                  flex: 1,
                }}
              >
                {error && (
                  <Alert
                    variant="danger"
                    dismissible
                    onClose={() => setError(null)}
                  >
                    {error}
                  </Alert>
                )}

                {success && (
                  <Alert
                    variant="success"
                    dismissible
                    onClose={() => setSuccess(null)}
                  >
                    {success}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  {/* Letterhead ID Display */}
                  {letterheadId && (
                    <Alert variant="info" className="mb-4">
                      <div className="d-flex align-items-center">
                        <i className="bi bi-info-circle me-2"></i>
                        <div>
                          <strong>Letterhead ID:</strong>{" "}
                          <code>{letterheadId}</code>
                          <br />
                          <small>
                            This ID will be used for verification and QR code
                            generation
                          </small>
                        </div>
                      </div>
                    </Alert>
                  )}

                  {/* Title Input */}
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-bold">
                      <i className="bi bi-type-h1 me-2"></i>
                      Letterhead Title
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter letterhead title (e.g., Certificate of Appreciation, Medical Report, etc.)"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      required
                      size="lg"
                    />
                  </Form.Group>

                  {/* Rich Text Editor */}
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-bold">
                      <i className="bi bi-file-earmark-richtext me-2"></i>
                      Content
                    </Form.Label>

                    {/* Formatting Toolbar */}
                    <Card className="mb-2 editor-toolbar">
                      <Card.Body className="py-2">
                        <div className="d-flex flex-wrap gap-2 align-items-center">
                          {/* Font Size */}
                          <Dropdown>
                            <Dropdown.Toggle
                              variant="outline-secondary"
                              size="sm"
                            >
                              <i className="bi bi-fonts me-1"></i>
                              Size
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              <Dropdown.Item
                                onClick={() => formatText("fontSize", "1")}
                              >
                                Small
                              </Dropdown.Item>
                              <Dropdown.Item
                                onClick={() => formatText("fontSize", "3")}
                              >
                                Normal
                              </Dropdown.Item>
                              <Dropdown.Item
                                onClick={() => formatText("fontSize", "4")}
                              >
                                Medium
                              </Dropdown.Item>
                              <Dropdown.Item
                                onClick={() => formatText("fontSize", "5")}
                              >
                                Large
                              </Dropdown.Item>
                              <Dropdown.Item
                                onClick={() => formatText("fontSize", "6")}
                              >
                                Extra Large
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>

                          <div className="vr"></div>

                          {/* Basic Formatting */}
                          <ButtonGroup>
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              onClick={() => formatText("bold")}
                              title="Bold"
                            >
                              <i className="bi bi-type-bold"></i>
                            </Button>
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              onClick={() => formatText("italic")}
                              title="Italic"
                            >
                              <i className="bi bi-type-italic"></i>
                            </Button>
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              onClick={() => formatText("underline")}
                              title="Underline"
                            >
                              <i className="bi bi-type-underline"></i>
                            </Button>
                          </ButtonGroup>

                          <div className="vr"></div>

                          {/* Text Alignment */}
                          <ButtonGroup>
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              onClick={() => formatText("justifyLeft")}
                              title="Align Left"
                            >
                              <i className="bi bi-text-left"></i>
                            </Button>
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              onClick={() => formatText("justifyCenter")}
                              title="Center"
                            >
                              <i className="bi bi-text-center"></i>
                            </Button>
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              onClick={() => formatText("justifyRight")}
                              title="Align Right"
                            >
                              <i className="bi bi-text-right"></i>
                            </Button>
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              onClick={() => formatText("justifyFull")}
                              title="Justify"
                            >
                              <i className="bi bi-justify"></i>
                            </Button>
                          </ButtonGroup>

                          <div className="vr"></div>

                          {/* Lists */}
                          <ButtonGroup>
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              onClick={() => formatText("insertUnorderedList")}
                              title="Bullet List"
                            >
                              <i className="bi bi-list-ul"></i>
                            </Button>
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              onClick={() => formatText("insertOrderedList")}
                              title="Numbered List"
                            >
                              <i className="bi bi-list-ol"></i>
                            </Button>
                          </ButtonGroup>

                          <div className="vr"></div>

                          {/* Additional Actions */}
                          <ButtonGroup>
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              onClick={() => formatText("removeFormat")}
                              title="Clear Formatting"
                            >
                              <i className="bi bi-eraser"></i>
                            </Button>
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              onClick={() => formatText("insertHorizontalRule")}
                              title="Insert Line"
                            >
                              <i className="bi bi-hr"></i>
                            </Button>
                          </ButtonGroup>
                        </div>
                      </Card.Body>
                    </Card>

                    {/* Editor */}
                    <div
                      ref={editorRef}
                      contentEditable
                      onInput={handleContentChange}
                      className="rich-text-editor"
                      placeholder="Start typing your letterhead content here. Use the formatting tools above to style your text..."
                      data-placeholder="Start typing your letterhead content here. Use the formatting tools above to style your text..."
                    />
                    <Form.Text className="text-muted">
                      Use the formatting toolbar above to style your content
                      like in Microsoft Word.
                    </Form.Text>
                  </Form.Group>

                  {/* Action Buttons */}
                  <div className="d-flex gap-3 justify-content-between">
                    <div>
                      <Button
                        type="button"
                        variant="outline-secondary"
                        onClick={() => navigate("/admin/letterheads")}
                        disabled={loading}
                      >
                        <i className="bi bi-arrow-left me-2"></i>
                        Back to Letterheads
                      </Button>
                    </div>

                    <div className="d-flex gap-2 flex-wrap">
                      <ThemeButton
                        type="submit"
                        disabled={
                          loading || !formData.title || !formData.content
                        }
                      >
                        {loading ? (
                          <>
                            <Spinner size="sm" className="me-2" />
                            Creating...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-save me-2"></i>
                            Create Letterhead
                          </>
                        )}
                      </ThemeButton>
                    </div>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>

          {/* Live Preview Section */}
          <Col lg={8} md={7}>
            <div
              style={{
                height: "calc(100vh - 180px)",
                display: "flex",
                flexDirection: "column",
                background: "white",
                borderRadius: "12px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                overflow: "hidden",
              }}
            >
              {/* Preview Header */}
              <div
                style={{
                  background: "linear-gradient(135deg, #28a745, #20c997)",
                  color: "white",
                  padding: "15px 20px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexShrink: 0,
                }}
              >
                <div>
                  <h5 className="mb-0" style={{ fontWeight: "600" }}>
                    <i className="bi bi-eye me-2"></i>
                    A4 Letterhead Preview
                  </h5>
                  <small style={{ opacity: "0.9" }}>
                    Real-time preview with professional A4 layout
                  </small>
                </div>
                <div className="d-flex gap-2">
                  <Button
                    size="sm"
                    variant="outline-light"
                    onClick={handleRefreshPreview}
                    disabled={!formData.title || !formData.content}
                    style={{ borderRadius: "8px" }}
                  >
                    <i className="bi bi-arrow-clockwise me-1"></i>
                    Refresh
                  </Button>
                  <Button
                    size="sm"
                    variant="outline-light"
                    onClick={() => setShowPreview(true)}
                    disabled={!formData.title || !formData.content}
                    style={{ borderRadius: "8px" }}
                  >
                    <i className="bi bi-arrows-fullscreen me-1"></i>
                    Full View
                  </Button>
                </div>
              </div>

              {/* Preview Content */}
              <div
                style={{
                  flex: 1,
                  background: "#f1f3f5",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "20px",
                  overflow: "hidden",
                }}
              >
                {!formData.title || !formData.content ? (
                  <div
                    className="d-flex flex-column align-items-center justify-content-center text-muted"
                    style={{
                      background: "white",
                      borderRadius: "12px",
                      border: "2px dashed #dee2e6",
                      padding: "60px 40px",
                      textAlign: "center",
                      maxWidth: "400px",
                    }}
                  >
                    <div
                      style={{
                        width: "80px",
                        height: "80px",
                        background: "linear-gradient(135deg, #28a745, #20c997)",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: "20px",
                        color: "white",
                      }}
                    >
                      <i
                        className="bi bi-file-earmark-text"
                        style={{ fontSize: "2rem" }}
                      ></i>
                    </div>
                    <h5 style={{ fontWeight: "600", color: "#495057" }}>
                      A4 Preview Ready
                    </h5>
                    <p style={{ marginBottom: "0", color: "#6c757d" }}>
                      Enter your letterhead title and content to see a perfect
                      A4 preview
                    </p>
                  </div>
                ) : (
                  <div
                    style={{
                      width: "794px",
                      height: "1123px",
                      backgroundColor: "white",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
                      borderRadius: "4px",
                      overflow: "hidden",
                      transform: "scale(0.45)",
                      transformOrigin: "center center",
                      border: "1px solid #ddd",
                    }}
                  >
                    <div
                      style={{ width: "100%", height: "100%" }}
                      dangerouslySetInnerHTML={{
                        __html: createLetterheadTemplate(),
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Action Buttons - Only show when content exists */}
              {formData.title && formData.content && (
                <div
                  style={{
                    padding: "20px",
                    background: "white",
                    borderTop: "1px solid #e9ecef",
                    flexShrink: 0,
                  }}
                >
                  <div className="d-flex gap-3 justify-content-center flex-wrap">
                    {/* Professional Print Button */}
                    <Button
                      variant="success"
                      onClick={handlePrint}
                      disabled={
                        printLoading || downloadLoading || pdfDownloadLoading
                      }
                      style={{
                        borderRadius: "12px",
                        fontWeight: "600",
                        padding: "14px 28px",
                        border: "none",
                        background: "linear-gradient(135deg, #28a745, #20c997)",
                        minWidth: "160px",
                        boxShadow: "0 4px 15px rgba(40, 167, 69, 0.25)",
                        transition: "all 0.3s ease",
                        fontSize: "14px",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                      onMouseEnter={(e) => {
                        if (
                          !printLoading &&
                          !downloadLoading &&
                          !pdfDownloadLoading
                        ) {
                          e.target.style.transform = "translateY(-2px)";
                          e.target.style.boxShadow =
                            "0 8px 25px rgba(40, 167, 69, 0.35)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (
                          !printLoading &&
                          !downloadLoading &&
                          !pdfDownloadLoading
                        ) {
                          e.target.style.transform = "translateY(0)";
                          e.target.style.boxShadow =
                            "0 4px 15px rgba(40, 167, 69, 0.25)";
                        }
                      }}
                      title="Print professional letterhead directly from browser"
                    >
                      {printLoading ? (
                        <>
                          <Spinner size="sm" className="me-2" />
                          Preparing Print...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-printer-fill me-2"></i>
                          Professional Print
                        </>
                      )}
                    </Button>

                    {/* Professional PDF Download Button */}
                    <Button
                      variant="warning"
                      onClick={handlePDFDownload}
                      disabled={
                        pdfDownloadLoading || downloadLoading || printLoading
                      }
                      style={{
                        borderRadius: "12px",
                        fontWeight: "600",
                        padding: "14px 28px",
                        border: "none",
                        background: "linear-gradient(135deg, #fd7e14, #e63946)",
                        color: "white",
                        minWidth: "160px",
                        boxShadow: "0 4px 15px rgba(253, 126, 20, 0.25)",
                        transition: "all 0.3s ease",
                        fontSize: "14px",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                      onMouseEnter={(e) => {
                        if (
                          !pdfDownloadLoading &&
                          !downloadLoading &&
                          !printLoading
                        ) {
                          e.target.style.transform = "translateY(-2px)";
                          e.target.style.boxShadow =
                            "0 8px 25px rgba(253, 126, 20, 0.35)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (
                          !pdfDownloadLoading &&
                          !downloadLoading &&
                          !printLoading
                        ) {
                          e.target.style.transform = "translateY(0)";
                          e.target.style.boxShadow =
                            "0 4px 15px rgba(253, 126, 20, 0.25)";
                        }
                      }}
                      title="Download high-quality PDF with professional formatting"
                    >
                      {pdfDownloadLoading ? (
                        <>
                          <Spinner size="sm" className="me-2" />
                          Generating PDF...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-file-earmark-pdf-fill me-2"></i>
                          Download PDF
                        </>
                      )}
                    </Button>

                    {/* HTML Download Button */}
                    <Button
                      variant="primary"
                      onClick={handleDownload}
                      disabled={
                        downloadLoading || printLoading || pdfDownloadLoading
                      }
                      style={{
                        borderRadius: "12px",
                        fontWeight: "600",
                        padding: "14px 28px",
                        border: "none",
                        background: "linear-gradient(135deg, #6f42c1, #6610f2)",
                        minWidth: "160px",
                        boxShadow: "0 4px 15px rgba(111, 66, 193, 0.25)",
                        transition: "all 0.3s ease",
                        fontSize: "14px",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                      onMouseEnter={(e) => {
                        if (
                          !downloadLoading &&
                          !printLoading &&
                          !pdfDownloadLoading
                        ) {
                          e.target.style.transform = "translateY(-2px)";
                          e.target.style.boxShadow =
                            "0 8px 25px rgba(111, 66, 193, 0.35)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (
                          !downloadLoading &&
                          !printLoading &&
                          !pdfDownloadLoading
                        ) {
                          e.target.style.transform = "translateY(0)";
                          e.target.style.boxShadow =
                            "0 4px 15px rgba(111, 66, 193, 0.25)";
                        }
                      }}
                      title="Download editable HTML version of the letterhead"
                    >
                      {downloadLoading ? (
                        <>
                          <Spinner size="sm" className="me-2" />
                          Preparing HTML...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-file-earmark-code-fill me-2"></i>
                          HTML Source
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Professional Features Info */}
                  <div className="text-center mt-4">
                    <div
                      style={{
                        background: "linear-gradient(135deg, #f8f9fa, #e9ecef)",
                        borderRadius: "12px",
                        padding: "20px",
                        border: "1px solid #dee2e6",
                      }}
                    >
                      <div className="mb-3">
                        <small className="text-success d-flex align-items-center justify-content-center gap-2 mb-2">
                          <i
                            className="bi bi-shield-check-fill text-success"
                            style={{ fontSize: "16px" }}
                          ></i>
                          <span style={{ fontWeight: "600", fontSize: "14px" }}>
                            Professional A4 Letterhead with QR Verification
                            Ready for Official Use
                          </span>
                        </small>
                      </div>

                      <div className="d-flex justify-content-center gap-4 flex-wrap">
                        <small className="text-muted d-flex align-items-center gap-1">
                          <i
                            className="bi bi-file-earmark-pdf-fill text-danger"
                            style={{ fontSize: "14px" }}
                          ></i>
                          <span style={{ fontWeight: "500" }}>
                            High-Quality PDF
                          </span>
                        </small>
                        <small className="text-muted d-flex align-items-center gap-1">
                          <i
                            className="bi bi-printer-fill text-success"
                            style={{ fontSize: "14px" }}
                          ></i>
                          <span style={{ fontWeight: "500" }}>
                            Professional Print
                          </span>
                        </small>
                        <small className="text-muted d-flex align-items-center gap-1">
                          <i
                            className="bi bi-file-earmark-code-fill text-primary"
                            style={{ fontSize: "14px" }}
                          ></i>
                          <span style={{ fontWeight: "500" }}>
                            Editable HTML
                          </span>
                        </small>
                        <small className="text-muted d-flex align-items-center gap-1">
                          <i
                            className={`bi ${qrCode ? "bi-qr-code-scan text-success" : "bi-qr-code text-warning"}`}
                            style={{ fontSize: "14px" }}
                          ></i>
                          <span style={{ fontWeight: "500" }}>
                            {qrCode ? "QR Verified" : "QR Processing"}
                          </span>
                        </small>
                      </div>

                      {letterheadId && (
                        <div className="mt-3 pt-3 border-top">
                          <small className="text-info d-flex align-items-center justify-content-center gap-2">
                            <i className="bi bi-info-circle-fill"></i>
                            <span>
                              <strong>Letterhead ID:</strong>{" "}
                              <code>{letterheadId}</code> |
                              <strong className="ms-2">
                                Verification URL:
                              </strong>{" "}
                              <a
                                href={`${window.location.origin}/verify?id=${letterheadId}&type=letterhead`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  textDecoration: "none",
                                  color: "#0d6efd",
                                }}
                              >
                                View Verification Page
                              </a>
                            </span>
                          </small>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Col>
        </Row>
      </Container>

      {/* A4 Preview Modal - Not Fullscreen */}
      <Modal
        show={showPreview}
        onHide={() => setShowPreview(false)}
        backdrop="static"
        keyboard={false}
        size="xl"
        centered
        style={{
          "--bs-modal-width": "900px",
        }}
      >
        <Modal.Header closeButton style={{ padding: "15px 20px" }}>
          <Modal.Title style={{ fontSize: "18px", fontWeight: "600" }}>
            <i className="bi bi-eye me-2"></i>
            A4 Letterhead Preview
          </Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{
            backgroundColor: "#f8f9fa",
            height: "70vh",
            overflowY: "auto",
            padding: "20px",
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
          }}
        >
          {/* A4 Size Container */}
          <div
            style={{
              width: "210mm",
              minHeight: "297mm",
              backgroundColor: "white",
              boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
              borderRadius: "8px",
              transform: "scale(0.8)",
              transformOrigin: "top center",
              margin: "0 auto",
            }}
            dangerouslySetInnerHTML={{ __html: createLetterheadTemplate() }}
          />
        </Modal.Body>
        <Modal.Footer
          style={{
            padding: "20px",
            background: "linear-gradient(135deg, #f8f9fa, #ffffff)",
            borderTop: "1px solid #dee2e6",
            borderRadius: "0 0 0.5rem 0.5rem",
          }}
        >
          <div className="d-flex gap-3 w-100 justify-content-between align-items-center flex-wrap">
            <div className="d-flex align-items-center gap-2">
              <Button
                variant="outline-secondary"
                onClick={() => setShowPreview(false)}
                style={{
                  borderRadius: "10px",
                  padding: "12px 20px",
                  fontWeight: "500",
                  border: "2px solid #6c757d",
                  transition: "all 0.2s ease",
                }}
              >
                <i className="bi bi-x-lg me-2"></i>
                Close Preview
              </Button>

              <small className="text-muted ms-2">
                <i className="bi bi-info-circle me-1"></i>
                Preview in A4 format (scaled 80%)
              </small>
            </div>

            <div className="d-flex gap-2 align-items-center">
              {/* Professional Print Button */}
              <Button
                variant="success"
                onClick={handlePrint}
                disabled={printLoading || downloadLoading || pdfDownloadLoading}
                style={{
                  borderRadius: "10px",
                  padding: "12px 20px",
                  fontWeight: "600",
                  border: "none",
                  background: "linear-gradient(135deg, #28a745, #20c997)",
                  boxShadow: "0 4px 12px rgba(40, 167, 69, 0.25)",
                  transition: "all 0.2s ease",
                  minWidth: "130px",
                }}
                title="Print with professional formatting"
              >
                {printLoading ? (
                  <>
                    <Spinner size="sm" className="me-2" />
                    Printing...
                  </>
                ) : (
                  <>
                    <i className="bi bi-printer-fill me-2"></i>
                    Print
                  </>
                )}
              </Button>

              {/* Professional PDF Download Button */}
              <Button
                variant="warning"
                onClick={handlePDFDownload}
                disabled={pdfDownloadLoading || downloadLoading || printLoading}
                style={{
                  borderRadius: "10px",
                  padding: "12px 20px",
                  fontWeight: "600",
                  border: "none",
                  background: "linear-gradient(135deg, #fd7e14, #e63946)",
                  color: "white",
                  boxShadow: "0 4px 12px rgba(253, 126, 20, 0.25)",
                  transition: "all 0.2s ease",
                  minWidth: "130px",
                }}
                title="Download high-quality PDF"
              >
                {pdfDownloadLoading ? (
                  <>
                    <Spinner size="sm" className="me-2" />
                    PDF...
                  </>
                ) : (
                  <>
                    <i className="bi bi-file-earmark-pdf-fill me-2"></i>
                    PDF
                  </>
                )}
              </Button>

              {/* HTML Download Button */}
              <Button
                variant="info"
                onClick={handleDownload}
                disabled={downloadLoading || printLoading || pdfDownloadLoading}
                style={{
                  borderRadius: "10px",
                  padding: "12px 20px",
                  fontWeight: "600",
                  border: "none",
                  background: "linear-gradient(135deg, #6f42c1, #6610f2)",
                  boxShadow: "0 4px 12px rgba(111, 66, 193, 0.25)",
                  transition: "all 0.2s ease",
                  minWidth: "130px",
                }}
                title="Download editable HTML source"
              >
                {downloadLoading ? (
                  <>
                    <Spinner size="sm" className="me-2" />
                    HTML...
                  </>
                ) : (
                  <>
                    <i className="bi bi-file-earmark-code-fill me-2"></i>
                    HTML
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Professional Features Summary */}
          <div className="w-100 mt-3 pt-3 border-top">
            <div className="d-flex justify-content-center gap-4 flex-wrap">
              <small className="text-muted d-flex align-items-center gap-1">
                <i className="bi bi-shield-check-fill text-success"></i>
                <span>QR Verified</span>
              </small>
              <small className="text-muted d-flex align-items-center gap-1">
                <i className="bi bi-file-earmark-pdf-fill text-danger"></i>
                <span>PDF Ready</span>
              </small>
              <small className="text-muted d-flex align-items-center gap-1">
                <i className="bi bi-printer-fill text-success"></i>
                <span>Print Optimized</span>
              </small>
              <small className="text-muted d-flex align-items-center gap-1">
                <i className="bi bi-aspect-ratio text-primary"></i>
                <span>A4 Format</span>
              </small>
            </div>
          </div>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AddLetterhead;
