import React, { useState, useRef } from "react";
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

  const handlePrint = () => {
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${formData.title}</title>
        <style>
          body {
            font-family: 'Times New Roman', serif;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
          }
          .letterhead-header {
            text-align: center;
            border-bottom: 2px solid #e63946;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .letterhead-title {
            color: #e63946;
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 10px;
          }
          .letterhead-content {
            font-size: 14px;
            text-align: justify;
          }
          @media print {
            body { margin: 0; }
          }
        </style>
      </head>
      <body>
        <div class="letterhead-header">
          <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 10px;">
            <img src="https://cdn.builder.io/api/v1/assets/030c65a34d11492ab1cc545443b12540/hk-e0ec29?format=webp&width=800"
                 alt="Hare Krishna Medical" style="width: 60px; height: 60px; margin-right: 15px;" />
            <div>
              <h1 style="margin: 0; color: #e63946; font-size: 20px;">HARE KRISHNA MEDICAL STORE</h1>
              <p style="margin: 0; font-size: 12px; color: #666;">Your Trusted Health & Wellness Partner</p>
            </div>
          </div>
          <p style="font-size: 12px; color: #666; margin: 5px 0;">
            📍 3 Sahyog Complex, Man Sarovar circle, Amroli, 394107, Gujarat<br/>
            📞 +91 76989 13354 | 📧 hkmedicalamroli@gmail.com
          </p>
        </div>

        <div class="letterhead-title">${formData.title}</div>
        <div class="letterhead-content">${formData.content}</div>

        <div style="margin-top: 50px; border-top: 1px solid #ddd; padding-top: 20px; font-size: 12px; color: #666; text-align: center;">
          Generated on ${new Date().toLocaleDateString()} | Hare Krishna Medical Store
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open("", "_blank");
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };

  const handleDownload = () => {
    const content = `
<!DOCTYPE html>
<html>
<head>
  <title>${formData.title}</title>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: 'Times New Roman', serif;
      line-height: 1.6;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    .letterhead-header {
      text-align: center;
      border-bottom: 2px solid #e63946;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .letterhead-title {
      color: #e63946;
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 10px;
    }
    .letterhead-content {
      font-size: 14px;
      text-align: justify;
    }
  </style>
</head>
<body>
  <div class="letterhead-header">
    <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 10px;">
      <img src="https://cdn.builder.io/api/v1/assets/030c65a34d11492ab1cc545443b12540/hk-e0ec29?format=webp&width=800"
           alt="Hare Krishna Medical" style="width: 60px; height: 60px; margin-right: 15px;" />
      <div>
        <h1 style="margin: 0; color: #e63946; font-size: 20px;">HARE KRISHNA MEDICAL STORE</h1>
        <p style="margin: 0; font-size: 12px; color: #666;">Your Trusted Health & Wellness Partner</p>
      </div>
    </div>
    <p style="font-size: 12px; color: #666; margin: 5px 0;">
      📍 3 Sahyog Complex, Man Sarovar circle, Amroli, 394107, Gujarat<br/>
      📞 +91 76989 13354 | 📧 hkmedicalamroli@gmail.com
    </p>
  </div>

  <div class="letterhead-title">${formData.title}</div>
  <div class="letterhead-content">${formData.content}</div>

  <div style="margin-top: 50px; border-top: 1px solid #ddd; padding-top: 20px; font-size: 12px; color: #666; text-align: center;">
    Generated on ${new Date().toLocaleDateString()} | Hare Krishna Medical Store
  </div>
</body>
</html>
    `;

    const blob = new Blob([content], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${formData.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_letterhead.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Container fluid className="py-4">
      <PageHeroSection
        title="Create Letterhead"
        subtitle="Create professional letterheads with rich text formatting"
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Letterheads", href: "/admin/letterheads" },
          { label: "Create", active: true },
        ]}
      />

      <Container className="mt-4">
        <Row className="justify-content-center">
          <Col lg={10}>
            <Card className="shadow-sm">
              <Card.Header className="bg-primary text-white">
                <h5 className="mb-0">
                  <i className="bi bi-file-earmark-text me-2"></i>
                  New Letterhead
                </h5>
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

                    <div className="d-flex gap-2">
                      <Button
                        type="button"
                        variant="outline-info"
                        onClick={() => setShowPreview(true)}
                        disabled={!formData.title || !formData.content}
                      >
                        <i className="bi bi-eye me-2"></i>
                        Preview
                      </Button>

                      <Button
                        type="button"
                        variant="outline-success"
                        onClick={handlePrint}
                        disabled={!formData.title || !formData.content}
                      >
                        <i className="bi bi-printer me-2"></i>
                        Print
                      </Button>

                      <Button
                        type="button"
                        variant="outline-primary"
                        onClick={handleDownload}
                        disabled={!formData.title || !formData.content}
                      >
                        <i className="bi bi-download me-2"></i>
                        Download
                      </Button>

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
        </Row>
      </Container>

      {/* Preview Modal */}
      <Modal show={showPreview} onHide={() => setShowPreview(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-eye me-2"></i>
            Letterhead Preview
          </Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{
            backgroundColor: "#f8f9fa",
            maxHeight: "70vh",
            overflowY: "auto",
          }}
        >
          <div
            className="letterhead-preview"
            style={{ margin: "20px auto", maxWidth: "800px" }}
          >
            <div className="preview-content">
              {/* Header */}
              <div
                style={{
                  textAlign: "center",
                  borderBottom: "2px solid #e63946",
                  paddingBottom: "20px",
                  marginBottom: "30px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "10px",
                  }}
                >
                  <img
                    src="https://cdn.builder.io/api/v1/assets/030c65a34d11492ab1cc545443b12540/hk-e0ec29?format=webp&width=800"
                    alt="Hare Krishna Medical"
                    style={{
                      width: "60px",
                      height: "60px",
                      marginRight: "15px",
                    }}
                  />
                  <div>
                    <h1
                      style={{
                        margin: "0",
                        color: "#e63946",
                        fontSize: "20px",
                      }}
                    >
                      HARE KRISHNA MEDICAL STORE
                    </h1>
                    <p style={{ margin: "0", fontSize: "12px", color: "#666" }}>
                      Your Trusted Health & Wellness Partner
                    </p>
                  </div>
                </div>
                <p style={{ fontSize: "12px", color: "#666", margin: "5px 0" }}>
                  📍 3 Sahyog Complex, Man Sarovar circle, Amroli, 394107,
                  Gujarat
                  <br />
                  📞 +91 76989 13354 | 📧 hkmedicalamroli@gmail.com
                </p>
              </div>

              {/* Title */}
              <div
                style={{
                  color: "#e63946",
                  fontSize: "24px",
                  fontWeight: "bold",
                  marginBottom: "20px",
                  textAlign: "center",
                }}
              >
                {formData.title}
              </div>

              {/* Content */}
              <div
                style={{ fontSize: "14px", textAlign: "justify" }}
                dangerouslySetInnerHTML={{ __html: formData.content }}
              />

              {/* Footer */}
              <div
                style={{
                  marginTop: "50px",
                  borderTop: "1px solid #ddd",
                  paddingTop: "20px",
                  fontSize: "12px",
                  color: "#666",
                  textAlign: "center",
                }}
              >
                Generated on {new Date().toLocaleDateString()} | Hare Krishna
                Medical Store
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-secondary"
            onClick={() => setShowPreview(false)}
          >
            Close Preview
          </Button>
          <Button variant="success" onClick={handlePrint}>
            <i className="bi bi-printer me-2"></i>
            Print
          </Button>
          <Button variant="primary" onClick={handleDownload}>
            <i className="bi bi-download me-2"></i>
            Download
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AddLetterhead;
