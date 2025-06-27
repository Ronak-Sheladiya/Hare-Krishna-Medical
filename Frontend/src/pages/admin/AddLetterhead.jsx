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
      const verificationUrl = `${window.location.origin}/verify-docs?id=${tempId}&type=letterhead`;
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
        background: white;
        width: 210mm;
        min-height: 297mm;
        margin: 0 auto;
        padding: 15mm;
        box-sizing: border-box;
        position: relative;
        page-break-inside: avoid;
      ">
        <!-- Header Section -->
        <div style="
          background: #e63946;
          color: white;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
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
          margin: 0 0 20px auto;
          font-size: 11px;
          color: #666;
          width: fit-content;
        ">
          <div style="margin-bottom: 3px; font-weight: 600;">Ref: ${currentLetterheadId}</div>
          <div style="font-weight: 600;">Date: ${currentDate}</div>
        </div>

        <!-- Document Title -->
        <div style="text-align: center; margin-bottom: 25px;">
          <h2 style="
            color: #e63946;
            font-size: 22px;
            font-weight: bold;
            margin: 0;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            border-bottom: 3px solid #e63946;
            display: inline-block;
            padding-bottom: 8px;
            font-family: 'Georgia', serif;
          ">
            ${formData.title}
          </h2>
        </div>

        <!-- Content Section -->
        <div style="
          font-size: 13px;
          line-height: 1.7;
          text-align: justify;
          margin-bottom: 80px;
          min-height: 200px;
          color: #333;
          font-family: Arial, sans-serif;
          padding-bottom: 30px;
        ">
          ${formData.content}
        </div>

        <!-- Footer Section - Better positioning to avoid overlap -->
        <div style="
          border-top: 2px solid #e63946;
          padding-top: 15px;
          margin-top: 30px;
          position: fixed;
          bottom: 15mm;
          left: 15mm;
          right: 15mm;
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
    `;
  };

  // PDF generation state
  const [pdfGenerating, setPdfGenerating] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);

  // Generate actual PDF for letterhead with proper A4 sizing
  const generateLetterheadPDF = async () => {
    if (!formData.title || !formData.content) return null;

    setPdfGenerating(true);
    try {
      // Import PDF service
      const pdfService = (await import("../../services/PDFService")).default;

      // Wait for DOM to render letterhead content
      await new Promise((resolve) => setTimeout(resolve, 800));

      const letterheadElement = document.getElementById(
        "letterhead-print-content",
      );
      if (!letterheadElement) {
        throw new Error("Letterhead content not found");
      }

      // Generate actual PDF blob with A4 specifications
      const result = await pdfService.generatePDFFromElement(
        letterheadElement,
        {
          filename: `${formData.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_letterhead.pdf`,
          quality: 1.0, // High quality for letterheads
          scale: 2.0, // Higher scale for better text rendering
          backgroundColor: "#ffffff",
          onProgress: (message, progress) => {
            console.log(`PDF Generation: ${message} (${progress}%)`);
          },
          returnBlob: true, // Request blob return instead of direct download
          // A4 specific settings
          format: "a4",
          orientation: "portrait",
          margin: 0, // No additional margins since template already has proper spacing
        },
      );

      if (result.success && result.blob) {
        const pdfObjectUrl = URL.createObjectURL(result.blob);
        setPdfUrl(pdfObjectUrl);
        setPdfGenerating(false);
        return result.blob;
      } else {
        throw new Error(result.error || "PDF generation failed");
      }
    } catch (error) {
      console.error("PDF generation failed:", error);
      setPdfGenerating(false);
      return null;
    }
  };

  // No auto-generation of PDF - only generate when print/download is clicked

  // PRINT FUNCTIONALITY - Direct HTML print
  const handlePrint = async () => {
    try {
      setPdfGenerating(true);

      // Get the letterhead content
      const letterheadElement = document.getElementById(
        "letterhead-print-content",
      );
      if (!letterheadElement) {
        alert("Letterhead content not found. Please refresh and try again.");
        return;
      }

      // Create print window
      const printWindow = window.open("", "_blank");

      // Print styles for A4
      const printStyles = `
        @page {
          size: A4;
          margin: 0;
        }
        @media print {
          body {
            margin: 0;
            font-family: Arial, sans-serif;
            -webkit-print-color-adjust: exact;
            color-adjust: exact;
          }
          .no-print { display: none !important; }
        }
        body {
          margin: 0;
          font-family: Arial, sans-serif;
        }
      `;

      // Write HTML content to print window
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${formData.title} - Letterhead</title>
            <style>${printStyles}</style>
          </head>
          <body>
            ${letterheadElement.outerHTML}
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
    } catch (error) {
      console.error("Print failed:", error);
      alert("Print failed. Please try again.");
    } finally {
      setPdfGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!formData.title || !formData.content) return;

    try {
      setPdfGenerating(true);

      // Generate PDF first
      const pdfBlob = await generateLetterheadPDF();

      if (pdfBlob) {
        // Create download link and trigger download
        const filename = `${formData.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_letterhead.pdf`;
        const url = URL.createObjectURL(pdfBlob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        console.log("PDF downloaded successfully:", filename);
      } else {
        alert("Failed to generate PDF for download. Please try again.");
      }
    } catch (error) {
      console.error("Download failed:", error);
      alert("Download failed. Please try again.");
    } finally {
      setPdfGenerating(false);
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

      <Container style={{ marginTop: "10px", padding: "10px" }}>
        <Row>
          {/* Form Section */}
          <Col lg={6}>
            <Card
              className="shadow-lg"
              style={{
                borderRadius: "12px",
                border: "none",
                height: "700px",
              }}
            >
              <Card.Header
                className="text-white"
                style={{
                  background: "linear-gradient(135deg, #e63946, #dc3545)",
                  borderRadius: "12px 12px 0 0",
                  padding: "10px",
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
                  padding: "15px",
                  maxHeight: "600px",
                  overflowY: "auto",
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
            <Card
              className="shadow-lg"
              style={{
                borderRadius: "12px",
                border: "none",
                height: "700px",
              }}
            >
              <Card.Header
                className="text-white"
                style={{
                  background: "linear-gradient(135deg, #28a745, #20c997)",
                  borderRadius: "12px 12px 0 0",
                  padding: "10px",
                }}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="mb-0" style={{ fontWeight: "600" }}>
                      <i className="bi bi-eye me-2"></i>
                      Live Preview
                    </h5>
                    <small style={{ opacity: "0.9" }}>
                      Real-time preview of your letterhead design
                    </small>
                  </div>
                  <div className="d-flex gap-2">
                    <Button
                      size="sm"
                      variant="outline-light"
                      onClick={handleRefreshPreview}
                      disabled={!formData.title || !formData.content}
                      style={{ borderRadius: "8px" }}
                      title="Refresh preview and regenerate QR code"
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
              </Card.Header>
              <Card.Body
                className="p-2"
                style={{
                  backgroundColor: "#f8f9fa",
                  height: "500px",
                  overflowY: "auto",
                }}
              >
                {!formData.title || !formData.content ? (
                  <div
                    className="d-flex flex-column align-items-center justify-content-center text-muted"
                    style={{
                      height: "100%",
                      background:
                        "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
                      borderRadius: "12px",
                      border: "2px dashed #dee2e6",
                      padding: "40px",
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
                      Live Preview Ready
                    </h5>
                    <p
                      style={{
                        textAlign: "center",
                        marginBottom: "0",
                        color: "#6c757d",
                      }}
                    >
                      Enter your letterhead title and content in the form to see
                      a real-time preview here
                    </p>
                  </div>
                ) : (
                  <div
                    style={{
                      transform: "scale(0.35)",
                      transformOrigin: "top center",
                      width: "210mm",
                      minHeight: "297mm",
                      overflow: "hidden",
                      border: "2px solid #dee2e6",
                      borderRadius: "12px",
                      backgroundColor: "white",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      margin: "0 auto",
                      display: "block",
                    }}
                    dangerouslySetInnerHTML={{
                      __html: createLetterheadTemplate(),
                    }}
                  />
                )}
              </Card.Body>
              <Card.Footer
                className="bg-transparent border-0"
                style={{ padding: "10px" }}
              >
                <div className="d-flex gap-2 justify-content-center">
                  <Button
                    variant="success"
                    onClick={handlePrint}
                    disabled={
                      !formData.title || !formData.content || pdfGenerating
                    }
                    style={{
                      borderRadius: "8px",
                      fontWeight: "600",
                      padding: "8px 16px",
                      border: "none",
                      background: "linear-gradient(135deg, #28a745, #20c997)",
                    }}
                  >
                    {pdfGenerating ? (
                      <>
                        <Spinner size="sm" className="me-2" />
                        Preparing...
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
                    disabled={
                      !formData.title || !formData.content || pdfGenerating
                    }
                    style={{
                      borderRadius: "8px",
                      fontWeight: "600",
                      padding: "8px 16px",
                      border: "none",
                      background: "linear-gradient(135deg, #e63946, #dc3545)",
                    }}
                  >
                    {pdfGenerating ? (
                      <>
                        <Spinner size="sm" className="me-2" />
                        Preparing...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-download me-2"></i>
                        Download PDF
                      </>
                    )}
                  </Button>
                </div>

                {formData.title && formData.content && (
                  <div className="text-center mt-1">
                    <small className="text-muted">
                      <i className="bi bi-info-circle me-1"></i>
                      Your letterhead is ready for professional use
                    </small>
                  </div>
                )}
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* A4 Preview Modal - Not Fullscreen */}
      <Modal
        show={showPreview}
        onHide={() => setShowPreview(false)}
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
            padding: "15px 20px",
            background: "#fff",
            borderTop: "1px solid #dee2e6",
          }}
        >
          <Button
            variant="outline-secondary"
            onClick={() => setShowPreview(false)}
            style={{
              borderRadius: "8px",
              padding: "8px 16px",
            }}
          >
            <i className="bi bi-x-lg me-2"></i>
            Close Preview
          </Button>
          <Button
            variant="success"
            onClick={handlePrint}
            disabled={pdfGenerating}
            style={{
              borderRadius: "8px",
              background: "linear-gradient(135deg, #28a745, #20c997)",
              border: "none",
              padding: "8px 16px",
              fontWeight: "600",
            }}
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
            onClick={handleDownload}
            disabled={pdfGenerating}
            style={{
              borderRadius: "8px",
              background: "linear-gradient(135deg, #e63946, #dc3545)",
              border: "none",
              color: "white",
              padding: "8px 16px",
              fontWeight: "600",
            }}
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
