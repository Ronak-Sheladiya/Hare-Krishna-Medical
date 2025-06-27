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
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import html2pdf from "html2pdf.js";
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

  // Professional PDF generation using html2pdf.js
  const generateLetterheadPDF = async () => {
    setPdfDownloadLoading(true);
    setError(null);

    try {
      // Create a visible container for PDF generation
      const pdfContainer = document.createElement("div");
      pdfContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 794px;
        height: 1123px;
        background: white;
        font-family: Arial, sans-serif;
        z-index: -1000;
        opacity: 0;
        pointer-events: none;
        overflow: hidden;
      `;

      // Create content wrapper with proper structure
      const contentWrapper = document.createElement("div");
      contentWrapper.style.cssText = `
        width: 100%;
        height: 100%;
        background: white;
        position: relative;
      `;

      // Insert the letterhead content
      contentWrapper.innerHTML = createLetterheadTemplate();
      pdfContainer.appendChild(contentWrapper);

      // Append to body for rendering
      document.body.appendChild(pdfContainer);

      // Wait for proper rendering and image loading
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Make sure all images are loaded
      const images = pdfContainer.querySelectorAll("img");
      const imagePromises = Array.from(images).map((img) => {
        return new Promise((resolve) => {
          if (img.complete) {
            resolve();
          } else {
            img.onload = resolve;
            img.onerror = resolve;
          }
        });
      });
      await Promise.all(imagePromises);

      const options = {
        margin: [15, 15, 15, 15], // 15px margins on all sides
        filename: `Letterhead-${letterheadId || "Draft"}.pdf`,
        image: {
          type: "jpeg",
          quality: 1.0,
        },
        html2canvas: {
          scale: 1.5,
          useCORS: true,
          allowTaint: false,
          backgroundColor: "#ffffff",
          width: 794,
          height: 1123,
          x: 0,
          y: 0,
          scrollX: 0,
          scrollY: 0,
          windowWidth: 794,
          windowHeight: 1123,
          logging: false,
        },
        jsPDF: {
          unit: "pt",
          format: "a4",
          orientation: "portrait",
        },
      };

      // Generate and save PDF
      await html2pdf().set(options).from(pdfContainer).save();

      // Cleanup
      document.body.removeChild(pdfContainer);
    } catch (error) {
      console.error("PDF Generation Error:", error);
      setError("Failed to generate PDF. Please try again.");
    } finally {
      setPdfDownloadLoading(false);
    }
  };

  // Professional print functionality
  const handlePrint = () => {
    setPrintLoading(true);

    try {
      const printContent = createLetterheadTemplate();
      const printWindow = window.open("", "_blank", "width=794,height=1123");

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Print Letterhead - ${formData.title}</title>
          <style>
            @page {
              size: A4;
              margin: 15px; /* 15px margins for print */
            }
            * {
              box-sizing: border-box;
            }
            body {
              margin: 0;
              padding: 0;
              font-family: Arial, sans-serif;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            @media print {
              body {
                margin: 0 !important;
                padding: 0 !important;
              }
              #letterhead-print-content {
                page-break-inside: avoid;
                transform: none !important;
                width: 100% !important;
                height: 100% !important;
                margin: 0 !important;
              }
            }
          </style>
        </head>
        <body>
          ${printContent}
          <script>
            window.onload = function() {
              setTimeout(() => {
                window.print();
                window.close();
              }, 100);
            };
          </script>
        </body>
        </html>
      `);

      printWindow.document.close();
    } catch (error) {
      console.error("Print Error:", error);
      setError("Failed to open print dialog. Please try again.");
    } finally {
      setPrintLoading(false);
    }
  };

  const createLetterheadTemplate = () => {
    const currentDate = new Date().toLocaleDateString("en-IN");
    const currentLetterheadId = letterheadId || generateTempLetterheadId();

    return `
      <div id="letterhead-print-content" style="
        font-family: Arial, sans-serif;
        width: 764px;
        height: 1093px;
        background: white;
        position: relative;
        margin: 15px;
        padding: 0;
        box-sizing: border-box;
        font-size: 13px;
        line-height: 1.5;
        color: #333;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        transform: scale(1) !important;
      ">
        <!-- Page Content Container with 15px safe margins -->
        <div style="
          padding: 15px;
          height: calc(100% - 30px);
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
          min-height: 1063px;
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
            position: absolute;
            bottom: 15px;
            left: 15px;
            right: 15px;
            width: calc(100% - 30px);
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
          <Col lg={6} md={6}>
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

                  {/* Form Buttons */}
                  <div className="d-flex gap-3 flex-wrap">
                    <div className="flex-grow-1">
                      <Button
                        variant="outline-secondary"
                        onClick={() => navigate("/admin/letterheads")}
                        disabled={loading}
                        className="me-3"
                      >
                        <i className="bi bi-arrow-left me-2"></i>
                        Back to Letterheads
                      </Button>
                    </div>
                    <div>
                      <Button
                        variant="outline-primary"
                        onClick={() => setShowPreview(true)}
                        disabled={!formData.title || !formData.content}
                        className="me-3"
                      >
                        <i className="bi bi-eye me-2"></i>
                        Preview
                      </Button>
                      <Button
                        type="submit"
                        variant="success"
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
                      </Button>
                    </div>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>

          {/* Preview Column */}
          <Col lg={6}>
            <Card
              style={{
                height: "calc(100vh - 180px)",
                display: "flex",
                flexDirection: "column",
                background: "linear-gradient(135deg, #f8f9fa, #ffffff)",
                border: "1px solid #e0e6ed",
                borderRadius: "20px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
              }}
            >
              <Card.Header
                style={{
                  background: "linear-gradient(135deg, #e63946, #dc3545)",
                  color: "white",
                  borderRadius: "20px 20px 0 0",
                  padding: "20px",
                  border: "none",
                }}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="mb-0 d-flex align-items-center">
                      <i className="bi bi-eye me-2"></i>
                      A4 Letterhead Preview
                    </h5>
                    <small style={{ opacity: "0.9" }}>
                      Real-time preview with A4 dimensions (210mm × 297mm)
                    </small>
                  </div>

                  {/* Professional Action Buttons */}
                  {formData.title && formData.content && (
                    <div className="d-flex gap-2">
                      <Button
                        variant="light"
                        size="sm"
                        onClick={handlePrint}
                        disabled={printLoading}
                        style={{
                          background: "rgba(255,255,255,0.9)",
                          border: "none",
                          borderRadius: "8px",
                          fontWeight: "600",
                          padding: "8px 16px",
                        }}
                      >
                        {printLoading ? (
                          <Spinner size="sm" />
                        ) : (
                          <>
                            <i className="bi bi-printer me-2"></i>
                            Print
                          </>
                        )}
                      </Button>

                      <Button
                        variant="light"
                        size="sm"
                        onClick={generateLetterheadPDF}
                        disabled={pdfDownloadLoading}
                        style={{
                          background: "rgba(255,255,255,0.9)",
                          border: "none",
                          borderRadius: "8px",
                          fontWeight: "600",
                          padding: "8px 16px",
                        }}
                      >
                        {pdfDownloadLoading ? (
                          <Spinner size="sm" />
                        ) : (
                          <>
                            <i className="bi bi-filetype-pdf me-2"></i>
                            PDF
                          </>
                        )}
                      </Button>

                      <Button
                        variant="light"
                        size="sm"
                        onClick={() => setShowPreview(true)}
                        style={{
                          background: "rgba(255,255,255,0.9)",
                          border: "none",
                          borderRadius: "8px",
                          fontWeight: "600",
                          padding: "8px 16px",
                        }}
                      >
                        <i className="bi bi-arrows-fullscreen me-2"></i>
                        Full
                      </Button>
                    </div>
                  )}
                </div>
              </Card.Header>

              <Card.Body
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  overflow: "auto",
                  flexGrow: 1,
                  background: "#f8f9fa",
                  padding: "20px",
                }}
              >
                {!formData.title || !formData.content ? (
                  <div
                    style={{
                      textAlign: "center",
                      color: "#6c757d",
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
                        margin: "0 auto 20px",
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
                      A4 preview with print and PDF options
                    </p>
                  </div>
                ) : (
                  <div
                    style={{
                      width: "250px", // Reduced width for smaller column
                      height: "353px", // Proportional height
                      backgroundColor: "white",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
                      borderRadius: "4px",
                      overflow: "hidden",
                      border: "1px solid #ddd",
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        width: "794px",
                        height: "1123px",
                        transform: "scale(0.315)", // Adjusted scale for smaller preview
                        transformOrigin: "top left",
                        position: "absolute",
                        top: "0",
                        left: "0",
                      }}
                      dangerouslySetInnerHTML={{
                        __html: createLetterheadTemplate(),
                      }}
                    />
                  </div>
                )}
              </Card.Body>

              {/* Professional Features Info */}
              {formData.title && formData.content && (
                <div
                  style={{
                    padding: "15px 20px",
                    background: "linear-gradient(135deg, #f8f9fa, #ffffff)",
                    borderTop: "1px solid #e0e6ed",
                    borderRadius: "0 0 20px 20px",
                  }}
                >
                  <div className="d-flex justify-content-between align-items-center text-muted">
                    <div className="d-flex gap-4">
                      <small>
                        <i className="bi bi-check-circle text-success me-1"></i>
                        A4 Format Ready
                      </small>
                      <small>
                        <i className="bi bi-qr-code text-primary me-1"></i>
                        QR Verification
                      </small>
                      <small>
                        <i className="bi bi-printer text-info me-1"></i>
                        Print Optimized
                      </small>
                    </div>
                    <small>
                      ID: <code>{letterheadId || "Not Generated"}</code>
                    </small>
                  </div>
                </div>
              )}
            </Card>
          </Col>
        </Row>
      </Container>

      {/* A4 Preview Modal */}
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

            {/* Professional Action Buttons */}
            <div className="d-flex gap-2">
              <Button
                onClick={handlePrint}
                disabled={printLoading}
                style={{
                  background: "linear-gradient(135deg, #28a745, #20c997)",
                  border: "none",
                  borderRadius: "10px",
                  padding: "12px 20px",
                  fontWeight: "600",
                  color: "white",
                  boxShadow: "0 4px 15px rgba(40, 167, 69, 0.3)",
                }}
              >
                {printLoading ? (
                  <Spinner size="sm" className="me-2" />
                ) : (
                  <i className="bi bi-printer me-2"></i>
                )}
                Print
              </Button>

              <Button
                onClick={generateLetterheadPDF}
                disabled={pdfDownloadLoading}
                style={{
                  background: "linear-gradient(135deg, #dc3545, #c82333)",
                  border: "none",
                  borderRadius: "10px",
                  padding: "12px 20px",
                  fontWeight: "600",
                  color: "white",
                  boxShadow: "0 4px 15px rgba(220, 53, 69, 0.3)",
                }}
              >
                {pdfDownloadLoading ? (
                  <Spinner size="sm" className="me-2" />
                ) : (
                  <i className="bi bi-filetype-pdf me-2"></i>
                )}
                Download PDF
              </Button>
            </div>
          </div>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AddLetterhead;
