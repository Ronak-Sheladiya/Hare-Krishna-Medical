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
import "../../styles/RichTextEditor.css";

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

  // Generate QR code for preview
  const generatePreviewQRCode = async (tempId) => {
    try {
      const QRCode = await import("qrcode");
      const verificationUrl = `${window.location.origin}/verify-docs?id=${tempId}&type=letterhead`;
      const qrDataURL = await QRCode.toDataURL(verificationUrl, {
        width: 150,
        margin: 2,
        color: {
          dark: "#1a202c",
          light: "#ffffff",
        },
        errorCorrectionLevel: "M",
      });
      return qrDataURL;
    } catch (error) {
      console.error("QR generation error:", error);
      return null;
    }
  };

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

  const createLetterheadTemplate = () => {
    const currentDate = new Date().toLocaleDateString("en-IN");
    const currentLetterheadId = letterheadId || generateTempLetterheadId();

    return `
      <div id="letterhead-print-content" style="font-family: Arial, sans-serif; padding: 15px; background: white; max-width: 210mm; margin: 0 auto; min-height: 297mm; page-break-inside: avoid;">
        <!-- Header Section - Professional Design -->
        <div style="background: #e63946; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
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
                <div style="display: flex; align-items: center; margin-bottom: 4px;"><i style="margin-right: 8px;">📍</i> 3 Sahyog Complex, Man Sarovar circle, Amroli, 394107, Gujarat</div>
                <div style="display: flex; align-items: center; margin-bottom: 4px;"><i style="margin-right: 8px;">📞</i> +91 76989 13354 | +91 91060 18508</div>
                <div style="display: flex; align-items: center;"><i style="margin-right: 8px;">✉️</i> hkmedicalamroli@gmail.com</div>
              </div>
            </div>

            <!-- Right Side - QR Code Only -->
            <div style="text-align: center; min-width: 160px;">
              <div style="background: white; padding: 12px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                ${
                  qrCode
                    ? `<img src="${qrCode}" alt="Verification QR Code" style="width: 120px; height: 120px; border: 2px solid #e63946; border-radius: 8px;" />`
                    : `<div style="width: 120px; height: 120px; border: 2px dashed #e63946; border-radius: 8px; background: #f8f9fa; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #e63946;">
                         <div style="font-size: 14px; margin-bottom: 5px;">📱</div>
                         <div style="font-size: 10px; font-weight: bold; text-align: center; line-height: 1.2;">QR CODE<br>VERIFICATION</div>
                       </div>`
                }
                <div style="margin-top: 8px; color: #333; font-size: 10px; font-weight: bold;">📱 SCAN TO VERIFY</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Reference and Date - After Header, Right Aligned -->
        <div style="text-align: right; margin-bottom: 20px; font-size: 12px; color: #666;">
          <div style="margin-bottom: 4px;">Ref: ${currentLetterheadId}</div>
          <div>Date: ${currentDate}</div>
        </div>

        <!-- Letterhead Title -->
        <div style="text-align: center; margin-bottom: 30px;">
          <h2 style="color: #e63946; font-size: 28px; font-weight: bold; margin: 0; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #e63946; display: inline-block; padding-bottom: 8px;">
            ${formData.title}
          </h2>
        </div>

        <!-- Letterhead Content -->
        <div style="font-size: 14px; line-height: 1.8; text-align: justify; margin-bottom: 80px; min-height: 300px; color: #333;">
          ${formData.content}
        </div>

        <!-- Footer Section - From VerifyDocs -->
        <div style="position: absolute; bottom: 20px; left: 15px; right: 15px; border-top: 2px solid #28a745; padding-top: 15px;">
          <div style="text-align: center;">
            <p style="font-size: 0.9rem; color: #666; margin-bottom: 5px;">
              ✅ This letterhead has been verified and is authentic
            </p>
            <p style="font-size: 0.8rem; color: #999; margin-bottom: 0;">
              Verified on ${new Date().toLocaleString("en-IN")} | For queries: +91 76989 13354 | hkmedicalamroli@gmail.com
            </p>
          </div>
        </div>
      </div>
    `;
  };

  // PDF generation state
  const [pdfGenerating, setPdfGenerating] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);

  // Generate PDF blob for letterhead preview
  const generateLetterheadPDF = async () => {
    setPdfGenerating(true);
    try {
      // Wait for DOM to render letterhead content
      setTimeout(async () => {
        const letterheadElement = document.getElementById(
          "letterhead-print-content",
        );
        if (!letterheadElement) {
          setPdfGenerating(false);
          return;
        }

        // Create a print-friendly version
        const printContent = createLetterheadTemplate();

        // Create temporary iframe for PDF generation
        const iframe = document.createElement("iframe");
        iframe.style.display = "none";
        document.body.appendChild(iframe);

        const iframeDoc =
          iframe.contentDocument || iframe.contentWindow.document;
        iframeDoc.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>${formData.title} - Letterhead</title>
              <style>
                @page { size: A4; margin: 15mm; }
                body {
                  font-family: Arial, sans-serif;
                  margin: 0;
                  color: black !important;
                  font-size: 11px;
                  line-height: 1.3;
                  -webkit-print-color-adjust: exact;
                  print-color-adjust: exact;
                }
                .letterhead-header {
                  background: #e63946 !important;
                  color: white !important;
                  -webkit-print-color-adjust: exact !important;
                  print-color-adjust: exact !important;
                }
              </style>
            </head>
            <body>${printContent}</body>
          </html>
        `);
        iframeDoc.close();

        // Create blob URL for preview
        setTimeout(() => {
          try {
            const htmlContent = iframeDoc.documentElement.outerHTML;
            const blob = new Blob([htmlContent], { type: "text/html" });
            const pdfObjectUrl = URL.createObjectURL(blob);
            setPdfUrl(pdfObjectUrl);

            // Clean up iframe
            document.body.removeChild(iframe);
          } catch (error) {
            document.body.removeChild(iframe);
            throw error;
          }
          setPdfGenerating(false);
        }, 500);
      }, 1000);
    } catch (error) {
      console.error("PDF generation failed:", error);
      setPdfGenerating(false);
    }
  };

  // Generate PDF when letterhead content changes
  useEffect(() => {
    if (formData.title && formData.content) {
      generateLetterheadPDF();
    }
  }, [formData.title, formData.content, qrCode]);

  // IMMEDIATE PRINT FUNCTIONALITY - Like Invoice Verify Page
  const handlePrint = () => {
    const printContent = createLetterheadTemplate();

    // Create print window immediately with proper PDF-like content
    const printWindow = window.open("", "_blank");

    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${formData.title} - Letterhead</title>
            <style>
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
              }
              body {
                font-family: Arial, sans-serif !important;
                line-height: 1.3 !important;
                color: #333 !important;
                font-size: 12px !important;
              }
              .letterhead-header {
                background: #e63946 !important;
                color: white !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
            </style>
          </head>
          <body>
            ${printContent}
            <script>
              window.onload = function() {
                window.focus();
                window.print();
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const handleDownload = async () => {
    if (!formData.title || !formData.content) return;

    try {
      // Import PDF service
      const pdfService = (await import("../../services/PDFService")).default;

      const letterheadElement = document.getElementById(
        "letterhead-print-content",
      );
      if (!letterheadElement) {
        alert("Letterhead content not found. Please try again.");
        return;
      }

      const result = await pdfService.generatePDFFromElement(
        letterheadElement,
        {
          filename: `${formData.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_letterhead.pdf`,
          onProgress: (message, progress) => {
            console.log(`PDF Download: ${message} (${progress}%)`);
          },
        },
      );

      if (!result.success) {
        alert("PDF download failed. Please try again.");
        console.error("PDF generation error:", result.error);
      } else {
        console.log("PDF downloaded successfully:", result.filename);
      }
    } catch (error) {
      console.error("PDF download failed:", error);
      alert("PDF download failed. Please try again.");
    }
  };

  // Cleanup PDF URL on unmount
  useEffect(() => {
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  return (
    <Container fluid className="py-4">
      <PageHeroSection
        title="Create Professional Letterhead"
        subtitle="Create official letterheads with verification QR codes, real-time preview, and PDF generation"
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Letterheads", href: "/admin/letterheads" },
          { label: "Create", active: true },
        ]}
      />

      <Container className="mt-4">
        <Row>
          {/* Form Section */}
          <Col lg={6}>
            <Card
              className="shadow-lg h-100"
              style={{ borderRadius: "12px", border: "none" }}
            >
              <Card.Header
                className="text-white"
                style={{
                  background: "linear-gradient(135deg, #e63946, #dc3545)",
                  borderRadius: "12px 12px 0 0",
                  padding: "20px",
                }}
              >
                <h5 className="mb-0" style={{ fontWeight: "600" }}>
                  <i className="bi bi-file-earmark-text me-2"></i>
                  Letterhead Information
                </h5>
                <small style={{ opacity: "0.9" }}>
                  Fill in the details below to create your professional
                  letterhead
                </small>
              </Card.Header>
              <Card.Body>
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
          <Col lg={6}>
            <Card className="shadow-sm h-100">
              <Card.Header className="bg-success text-white">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">
                    <i className="bi bi-eye me-2"></i>
                    Live Preview
                  </h5>
                  <div className="d-flex gap-2">
                    <Button
                      size="sm"
                      variant="outline-light"
                      onClick={handlePreview}
                      disabled={!formData.title || !formData.content}
                    >
                      <i className="bi bi-arrow-clockwise me-1"></i>
                      Refresh
                    </Button>
                    <Button
                      size="sm"
                      variant="outline-light"
                      onClick={() => setShowPreview(true)}
                      disabled={!formData.title || !formData.content}
                    >
                      <i className="bi bi-arrows-fullscreen me-1"></i>
                      Full View
                    </Button>
                  </div>
                </div>
              </Card.Header>
              <Card.Body className="p-2" style={{ backgroundColor: "#f8f9fa" }}>
                {!formData.title || !formData.content ? (
                  <div className="d-flex flex-column align-items-center justify-content-center h-100 text-muted">
                    <i
                      className="bi bi-file-earmark-text"
                      style={{ fontSize: "4rem" }}
                    ></i>
                    <h5>Enter title and content to see preview</h5>
                    <p>Your letterhead will appear here as you type</p>
                  </div>
                ) : (
                  <div
                    style={{
                      transform: "scale(0.5)",
                      transformOrigin: "top left",
                      width: "200%",
                      height: "200%",
                      overflow: "hidden",
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                      backgroundColor: "white",
                    }}
                    dangerouslySetInnerHTML={{
                      __html: createLetterheadTemplate(),
                    }}
                  />
                )}
              </Card.Body>
              <Card.Footer className="bg-transparent">
                <div className="d-flex gap-2 justify-content-center">
                  <Button
                    variant="outline-success"
                    size="sm"
                    onClick={handlePrint}
                    disabled={
                      !formData.title || !formData.content || pdfGenerating
                    }
                  >
                    {pdfGenerating ? (
                      <>
                        <Spinner size="sm" className="me-2" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-printer me-2"></i>
                        Print PDF
                      </>
                    )}
                  </Button>

                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={handleDownload}
                    disabled={
                      !formData.title || !formData.content || pdfGenerating
                    }
                  >
                    {pdfGenerating ? (
                      <>
                        <Spinner size="sm" className="me-2" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-download me-2"></i>
                        Download PDF
                      </>
                    )}
                  </Button>
                </div>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Full Preview Modal */}
      <Modal
        show={showPreview}
        onHide={() => setShowPreview(false)}
        size="xl"
        fullscreen
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-eye me-2"></i>
            Full Letterhead Preview
          </Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{
            backgroundColor: "#f8f9fa",
            maxHeight: "80vh",
            overflowY: "auto",
          }}
        >
          <div className="d-flex justify-content-center">
            <div
              style={{
                maxWidth: "210mm",
                backgroundColor: "white",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                borderRadius: "8px",
              }}
              dangerouslySetInnerHTML={{ __html: createLetterheadTemplate() }}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-secondary"
            onClick={() => setShowPreview(false)}
          >
            Close Preview
          </Button>
          <Button
            variant="success"
            onClick={handlePrint}
            disabled={pdfGenerating}
          >
            {pdfGenerating ? (
              <>
                <Spinner size="sm" className="me-2" />
                Generating PDF...
              </>
            ) : (
              <>
                <i className="bi bi-printer me-2"></i>
                Print PDF
              </>
            )}
          </Button>
          <Button
            variant="primary"
            onClick={handleDownload}
            disabled={pdfGenerating}
          >
            {pdfGenerating ? (
              <>
                <Spinner size="sm" className="me-2" />
                Generating PDF...
              </>
            ) : (
              <>
                <i className="bi bi-download me-2"></i>
                Download PDF
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AddLetterhead;
