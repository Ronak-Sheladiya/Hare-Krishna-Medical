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
      <div id="letterhead-print-content" style="font-family: Arial, sans-serif; padding: 10px; background: white; max-width: 210mm; margin: 0 auto; min-height: 277mm; page-break-inside: avoid; box-sizing: border-box;">
        <!-- Header Section - Professional Design -->
        <div style="background: #e63946; color: white; padding: 15px; border-radius: 6px; margin-bottom: 15px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <!-- Left Side - Company Info -->
            <div style="flex: 1;">
              <div style="display: flex; align-items: center; margin-bottom: 10px;">
                <div style="position: relative; margin-right: 15px;">
                  <div style="background: white; border-radius: 50%; padding: 8px; border: 2px solid rgba(255,255,255,0.9); box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                    <img src="https://cdn.builder.io/api/v1/assets/030c65a34d11492ab1cc545443b12540/hk-e0ec29?format=webp&width=800" alt="Hare Krishna Medical Logo" style="height: 40px; width: 40px; object-fit: contain; border-radius: 50%;" onerror="this.style.display='none';" />
                  </div>
                  <div style="position: absolute; top: -3px; right: -3px; width: 15px; height: 15px; background: #28a745; border-radius: 50%; border: 2px solid white;"></div>
                </div>
                <div>
                  <h1 style="font-size: 22px; font-weight: 900; margin: 0; line-height: 1.1; text-shadow: 1px 1px 2px rgba(0,0,0,0.1);">HARE KRISHNA MEDICAL</h1>
                  <p style="font-size: 11px; margin: 3px 0 0 0; opacity: 0.95; font-weight: 500; letter-spacing: 0.3px;">🏥 Your Trusted Health Partner Since 2020</p>
                  <div style="display: flex; align-items: center; margin-top: 5px; font-size: 9px; opacity: 0.9;">
                    <span style="background: rgba(255,255,255,0.2); padding: 1px 6px; border-radius: 8px; margin-right: 6px;">✓ Verified</span>
                    <span style="background: rgba(255,255,255,0.2); padding: 1px 6px; border-radius: 8px;">📋 Official Document</span>
                  </div>
                </div>
              </div>
              <div style="background: rgba(255,255,255,0.1); padding: 8px; border-radius: 6px; font-size: 9px; line-height: 1.3;">
                <div style="display: flex; align-items: center; margin-bottom: 2px;"><i style="margin-right: 6px;">📍</i> 3 Sahyog Complex, Man Sarovar circle, Amroli, 394107, Gujarat</div>
                <div style="display: flex; align-items: center; margin-bottom: 2px;"><i style="margin-right: 6px;">📞</i> +91 76989 13354 | +91 91060 18508</div>
                <div style="display: flex; align-items: center;"><i style="margin-right: 6px;">✉️</i> hkmedicalamroli@gmail.com</div>
              </div>
            </div>

            <!-- Right Side - QR Code Only -->
            <div style="text-align: center; min-width: 120px;">
              <div style="background: white; padding: 8px; border-radius: 8px; box-shadow: 0 3px 8px rgba(0,0,0,0.1);">
                ${
                  qrCode
                    ? `<img src="${qrCode}" alt="Verification QR Code" style="width: 80px; height: 80px; border: 2px solid #e63946; border-radius: 6px;" />`
                    : `<div style="width: 80px; height: 80px; border: 2px dashed #e63946; border-radius: 6px; background: #f8f9fa; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #e63946;">
                         <div style="font-size: 12px; margin-bottom: 3px;">📱</div>
                         <div style="font-size: 8px; font-weight: bold; text-align: center; line-height: 1.1;">QR CODE<br>VERIFICATION</div>
                       </div>`
                }
                <div style="margin-top: 5px; color: #333; font-size: 8px; font-weight: bold;">📱 SCAN TO VERIFY</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Reference and Date - After Header, Right Aligned -->
        <div style="text-align: right; margin-bottom: 15px; font-size: 10px; color: #666;">
          <div style="margin-bottom: 2px;">Ref: ${currentLetterheadId}</div>
          <div>Date: ${currentDate}</div>
        </div>

        <!-- Letterhead Title -->
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="color: #e63946; font-size: 20px; font-weight: bold; margin: 0; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #e63946; display: inline-block; padding-bottom: 6px;">
            ${formData.title}
          </h2>
        </div>

        <!-- Letterhead Content -->
        <div style="font-size: 12px; line-height: 1.6; text-align: justify; margin-bottom: 40px; min-height: 200px; color: #333;">
          ${formData.content}
        </div>

        <!-- Footer Section - From VerifyDocs -->
        <div style="position: absolute; bottom: 10px; left: 10px; right: 10px; border-top: 2px solid #e63946; padding-top: 10px;">
          <div style="text-align: center;">
            <p style="font-size: 10px; color: #666; margin-bottom: 3px;">
              ✅ This letterhead has been verified and is authentic
            </p>
            <p style="font-size: 9px; color: #999; margin-bottom: 0;">
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

  // Generate actual PDF for letterhead
  const generateLetterheadPDF = async () => {
    if (!formData.title || !formData.content) return null;

    setPdfGenerating(true);
    try {
      // Import PDF service
      const pdfService = (await import("../../services/PDFService")).default;

      // Wait for DOM to render letterhead content
      await new Promise((resolve) => setTimeout(resolve, 500));

      const letterheadElement = document.getElementById(
        "letterhead-print-content",
      );
      if (!letterheadElement) {
        throw new Error("Letterhead content not found");
      }

      // Generate actual PDF blob
      const result = await pdfService.generatePDFFromElement(
        letterheadElement,
        {
          filename: `${formData.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_letterhead.pdf`,
          onProgress: (message, progress) => {
            console.log(`PDF Generation: ${message} (${progress}%)`);
          },
          returnBlob: true, // Request blob return instead of direct download
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

  // PRINT FUNCTIONALITY - Generate PDF and open in new window
  const handlePrint = async () => {
    try {
      setPdfGenerating(true);

      // Generate PDF first
      const pdfBlob = await generateLetterheadPDF();

      if (pdfBlob) {
        // Create PDF URL and open in new window for printing
        const pdfUrl = URL.createObjectURL(pdfBlob);
        const printWindow = window.open(
          pdfUrl,
          "_blank",
          "width=1200,height=800,scrollbars=yes,resizable=yes,toolbar=yes,menubar=yes",
        );

        if (printWindow) {
          printWindow.document.title = `${formData.title} - Letterhead Print`;

          // Setup print handlers
          printWindow.onload = () => {
            printWindow.focus();
            printWindow.print();
          };

          // Fallback print trigger
          setTimeout(() => {
            try {
              printWindow.focus();
              printWindow.print();
            } catch (error) {
              console.log("Fallback print trigger:", error);
            }
          }, 1000);
        }
      } else {
        alert("Failed to generate PDF for printing. Please try again.");
      }
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
        title="Create Professional Letterhead"
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
              className="shadow-lg h-100"
              style={{ borderRadius: "12px", border: "none" }}
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
                  Fill in the details below to create your professional
                  letterhead
                </small>
              </Card.Header>
              <Card.Body style={{ padding: "10px" }}>
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
              className="shadow-lg h-100"
              style={{ borderRadius: "12px", border: "none" }}
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
                      onClick={handlePreview}
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
              </Card.Header>
              <Card.Body
                className="p-2"
                style={{
                  backgroundColor: "#f8f9fa",
                  minHeight: "500px",
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
                      transform: "scale(0.45)",
                      transformOrigin: "top left",
                      width: "222%",
                      height: "222%",
                      overflow: "hidden",
                      border: "2px solid #dee2e6",
                      borderRadius: "12px",
                      backgroundColor: "white",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                    dangerouslySetInnerHTML={{
                      __html: createLetterheadTemplate(),
                    }}
                  />
                )}
              </Card.Body>
              <Card.Footer
                className="bg-transparent border-0"
                style={{ padding: "20px" }}
              >
                <div className="d-flex gap-3 justify-content-center">
                  <Button
                    variant="success"
                    onClick={handlePrint}
                    disabled={
                      !formData.title || !formData.content || pdfGenerating
                    }
                    style={{
                      borderRadius: "10px",
                      fontWeight: "600",
                      padding: "10px 20px",
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
                      borderRadius: "10px",
                      fontWeight: "600",
                      padding: "10px 20px",
                      border: "none",
                      background: "linear-gradient(135deg, #007bff, #0056b3)",
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
                  <div className="text-center mt-2">
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
