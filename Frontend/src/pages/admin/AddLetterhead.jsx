import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
  Badge,
  Modal,
  Spinner,
  InputGroup,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { api, safeApiCall } from "../../utils/apiClient";
import { formatDateTime } from "../../utils/dateUtils";

const AddLetterhead = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  const contentRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");

  const [formData, setFormData] = useState({
    letterType: "certificate",
    title: "",
    context: "respected",
    recipient: {
      prefix: "Mr.",
      firstName: "",
      middleName: "",
      lastName: "",
      designation: "",
      company: "",
    },
    subject: "",
    content: "",
    header: "",
    footer: "",
    host: {
      name: "",
      designation: "",
    },
    language: "english",
    notes: "",
  });

  // Fetch letterhead data for editing
  useEffect(() => {
    if (isEditing) {
      fetchLetterhead();
    }
  }, [id, isEditing]);

  const fetchLetterhead = async () => {
    setLoading(true);
    try {
      const response = await safeApiCall(() => api.get(`/letterheads/${id}`));
      if (response.success) {
        setFormData(response.letterhead);
      } else {
        setError(response.message || "Failed to fetch letterhead");
      }
    } catch (err) {
      console.error("Fetch letterhead error:", err);
      setError("Failed to fetch letterhead");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleContentChange = (content) => {
    setFormData((prev) => ({
      ...prev,
      content,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      let response;
      if (isEditing) {
        response = await safeApiCall(() =>
          api.put(`/letterheads/${id}`, formData),
        );
      } else {
        response = await safeApiCall(() => api.post("/letterheads", formData));
      }

      if (response.success) {
        setSuccess(
          isEditing
            ? "Letterhead updated successfully!"
            : "Letterhead created successfully!",
        );

        // Trigger real-time refresh
        window.dispatchEvent(
          new CustomEvent("refreshLetterheads", {
            detail: response.letterhead,
          }),
        );

        setTimeout(() => {
          navigate("/admin/letterheads");
        }, 2000);
      } else {
        setError(response.message || "Failed to save letterhead");
      }
    } catch (err) {
      console.error("Save letterhead error:", err);
      setError("Failed to save letterhead");
    } finally {
      setLoading(false);
    }
  };

  const insertTextAtCursor = (text) => {
    if (contentRef.current) {
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        range.insertNode(document.createTextNode(text));
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);

        // Update content
        handleContentChange(contentRef.current.innerHTML);
      }
    }
  };

  const formatText = (command, value = null) => {
    document.execCommand(command, false, value);
    if (contentRef.current) {
      handleContentChange(contentRef.current.innerHTML);
    }
  };

  const getPreviewText = () => {
    const contextText = {
      respected: "Respected",
      dear: "Dear",
      to_whom_it_may_concern: "To Whom It May Concern",
    };

    const recipientName = [
      formData.recipient.prefix,
      formData.recipient.firstName,
      formData.recipient.middleName,
      formData.recipient.lastName,
    ]
      .filter(Boolean)
      .join(" ");

    return {
      context: contextText[formData.context],
      recipientName,
      content: formData.content || "Your content will appear here...",
    };
  };

  if (loading && isEditing) {
    return (
      <Container className="py-4">
        <div className="text-center">
          <Spinner animation="border" variant="danger">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-2 text-muted">Loading letterhead...</p>
        </div>
      </Container>
    );
  }

  return (
    <div className="admin-letterhead-form">
      <style jsx>{`
        .admin-letterhead-form {
          background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
          min-height: 100vh;
          padding: 2rem 0;
        }

        .letterhead-hero {
          background: linear-gradient(135deg, #dc3545 0%, #b91c2c 100%);
          color: white;
          padding: 3rem 0;
          margin-bottom: 2rem;
          border-radius: 0 0 20px 20px;
          box-shadow: 0 10px 30px rgba(220, 53, 69, 0.3);
        }

        .letterhead-card {
          border: none;
          border-radius: 15px;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          margin-bottom: 2rem;
        }

        .letterhead-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
        }

        .letterhead-card .card-header {
          background: linear-gradient(135deg, #dc3545 0%, #b91c2c 100%);
          color: white;
          border-radius: 15px 15px 0 0 !important;
          padding: 1.25rem 2rem;
          border: none;
        }

        .letterhead-tabs {
          background: white;
          border-radius: 10px;
          padding: 0.5rem;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          margin-bottom: 2rem;
        }

        .letterhead-tab {
          background: transparent;
          border: none;
          padding: 1rem 2rem;
          border-radius: 8px;
          color: #6c757d;
          font-weight: 500;
          transition: all 0.3s ease;
          margin: 0 0.25rem;
        }

        .letterhead-tab.active {
          background: linear-gradient(135deg, #dc3545 0%, #b91c2c 100%);
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(220, 53, 69, 0.3);
        }

        .letterhead-form-control {
          border: 2px solid #e9ecef;
          border-radius: 10px;
          padding: 0.75rem 1rem;
          font-size: 0.95rem;
          transition: all 0.3s ease;
        }

        .letterhead-form-control:focus {
          border-color: #dc3545;
          box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
          transform: translateY(-1px);
        }

        .content-editor {
          border: 2px solid #e9ecef;
          border-radius: 10px;
          background: white;
          min-height: 300px;
        }

        .content-toolbar {
          background: #f8f9fa;
          border-bottom: 1px solid #dee2e6;
          padding: 0.75rem;
          border-radius: 10px 10px 0 0;
        }

        .content-editor-area {
          padding: 1.5rem;
          min-height: 250px;
          font-family: "Times New Roman", serif;
          font-size: 12px;
          line-height: 1.6;
          border-radius: 0 0 10px 10px;
        }

        .content-editor-area:focus {
          outline: none;
          background: #fafbfc;
        }

        .toolbar-btn {
          background: white;
          border: 1px solid #dee2e6;
          border-radius: 6px;
          padding: 0.5rem 0.75rem;
          margin: 0 0.25rem;
          color: #495057;
          transition: all 0.2s ease;
        }

        .toolbar-btn:hover {
          background: #dc3545;
          color: white;
          border-color: #dc3545;
        }

        .preview-panel {
          background: white;
          border-radius: 15px;
          padding: 2rem;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
          position: sticky;
          top: 2rem;
          max-height: calc(100vh - 4rem);
          overflow-y: auto;
        }

        .preview-content {
          font-family: "Times New Roman", serif;
          font-size: 12px;
          line-height: 1.6;
          border: 1px dashed #dee2e6;
          padding: 1.5rem;
          border-radius: 8px;
          background: #fafbfc;
        }

        .letterhead-btn {
          background: linear-gradient(135deg, #dc3545 0%, #b91c2c 100%);
          border: none;
          border-radius: 10px;
          padding: 0.75rem 2rem;
          font-weight: 600;
          color: white;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(220, 53, 69, 0.3);
        }

        .letterhead-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(220, 53, 69, 0.4);
          color: white;
        }

        .letterhead-btn:disabled {
          opacity: 0.6;
          transform: none;
          box-shadow: none;
        }

        .letterhead-btn-outline {
          background: transparent;
          border: 2px solid #dc3545;
          color: #dc3545;
          border-radius: 10px;
          padding: 0.75rem 2rem;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .letterhead-btn-outline:hover {
          background: #dc3545;
          color: white;
          transform: translateY(-2px);
        }

        .form-section {
          margin-bottom: 2rem;
        }

        .section-title {
          color: #dc3545;
          font-weight: 600;
          margin-bottom: 1.5rem;
          font-size: 1.1rem;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid #dc3545;
          display: inline-block;
        }

        .alert-custom {
          border: none;
          border-radius: 10px;
          padding: 1rem 1.5rem;
          margin-bottom: 2rem;
        }

        .alert-danger-custom {
          background: linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%);
          color: #721c24;
          border-left: 4px solid #dc3545;
        }

        .alert-success-custom {
          background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
          color: #155724;
          border-left: 4px solid #28a745;
        }

        .badge-professional {
          background: linear-gradient(135deg, #dc3545 0%, #b91c2c 100%);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .letterhead-hero {
            padding: 2rem 0;
            margin-bottom: 1rem;
          }

          .letterhead-card {
            margin-bottom: 1rem;
          }

          .preview-panel {
            position: static;
            margin-top: 2rem;
            max-height: none;
          }

          .letterhead-tabs {
            flex-direction: column;
          }

          .letterhead-tab {
            margin: 0.25rem 0;
            text-align: center;
          }
        }
      `}</style>

      <Container fluid>
        {/* Hero Section */}
        <div className="letterhead-hero">
          <Container>
            <div className="text-center">
              <h1 className="display-5 fw-bold mb-3">
                <i className="bi bi-file-text-fill me-3"></i>
                {isEditing
                  ? "Edit Letterhead"
                  : "Create Professional Letterhead"}
              </h1>
              <p className="lead opacity-90">
                {isEditing
                  ? "Update your letterhead with professional formatting and design"
                  : "Design professional letterheads with our advanced editor"}
              </p>
            </div>
          </Container>
        </div>

        <Container>
          {/* Alerts */}
          {error && (
            <div className="alert-custom alert-danger-custom">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              {error}
              <button
                type="button"
                className="btn-close float-end"
                onClick={() => setError(null)}
              ></button>
            </div>
          )}

          {success && (
            <div className="alert-custom alert-success-custom">
              <i className="bi bi-check-circle-fill me-2"></i>
              {success}
              <button
                type="button"
                className="btn-close float-end"
                onClick={() => setSuccess(null)}
              ></button>
            </div>
          )}

          {/* Navigation Tabs */}
          <div className="letterhead-tabs d-flex justify-content-center">
            {[
              { key: "basic", label: "Basic Info", icon: "bi-info-circle" },
              { key: "recipient", label: "Recipient", icon: "bi-person" },
              { key: "content", label: "Content", icon: "bi-file-text" },
              { key: "signature", label: "Signature", icon: "bi-pen" },
            ].map((tab) => (
              <button
                key={tab.key}
                className={`letterhead-tab ${activeTab === tab.key ? "active" : ""}`}
                onClick={() => setActiveTab(tab.key)}
              >
                <i className={`${tab.icon} me-2`}></i>
                {tab.label}
              </button>
            ))}
          </div>

          <Form onSubmit={handleSubmit}>
            <Row>
              <Col lg={8}>
                {/* Basic Information Tab */}
                {activeTab === "basic" && (
                  <Card className="letterhead-card">
                    <Card.Header>
                      <h5 className="mb-0">
                        <i className="bi bi-info-circle me-2"></i>
                        Basic Information
                      </h5>
                    </Card.Header>
                    <Card.Body className="p-4">
                      <div className="form-section">
                        <h6 className="section-title">
                          Document Type & Settings
                        </h6>
                        <Row>
                          <Col md={6}>
                            <Form.Group className="mb-4">
                              <Form.Label className="fw-semibold">
                                Letter Type *
                              </Form.Label>
                              <Form.Select
                                name="letterType"
                                value={formData.letterType}
                                onChange={handleInputChange}
                                className="letterhead-form-control"
                                required
                              >
                                <option value="certificate">Certificate</option>
                                <option value="request">Request</option>
                                <option value="application">Application</option>
                                <option value="notice">Notice</option>
                                <option value="recommendation">
                                  Recommendation
                                </option>
                              </Form.Select>
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group className="mb-4">
                              <Form.Label className="fw-semibold">
                                Language
                              </Form.Label>
                              <Form.Select
                                name="language"
                                value={formData.language}
                                onChange={handleInputChange}
                                className="letterhead-form-control"
                              >
                                <option value="english">English</option>
                                <option value="hindi">Hindi</option>
                                <option value="gujarati">Gujarati</option>
                              </Form.Select>
                            </Form.Group>
                          </Col>
                        </Row>
                      </div>

                      <div className="form-section">
                        <h6 className="section-title">Document Details</h6>
                        <Form.Group className="mb-4">
                          <Form.Label className="fw-semibold">
                            Title *
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            placeholder="Enter letterhead title (e.g., Certificate of Excellence)"
                            className="letterhead-form-control"
                            required
                          />
                        </Form.Group>

                        <Row>
                          <Col md={6}>
                            <Form.Group className="mb-4">
                              <Form.Label className="fw-semibold">
                                Context *
                              </Form.Label>
                              <Form.Select
                                name="context"
                                value={formData.context}
                                onChange={handleInputChange}
                                className="letterhead-form-control"
                                required
                              >
                                <option value="respected">Respected</option>
                                <option value="dear">Dear</option>
                                <option value="to_whom_it_may_concern">
                                  To Whom It May Concern
                                </option>
                              </Form.Select>
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group className="mb-4">
                              <Form.Label className="fw-semibold">
                                Subject *
                              </Form.Label>
                              <Form.Control
                                type="text"
                                name="subject"
                                value={formData.subject}
                                onChange={handleInputChange}
                                placeholder="Enter subject line"
                                className="letterhead-form-control"
                                required
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                      </div>
                    </Card.Body>
                  </Card>
                )}

                {/* Recipient Information Tab */}
                {activeTab === "recipient" && (
                  <Card className="letterhead-card">
                    <Card.Header>
                      <h5 className="mb-0">
                        <i className="bi bi-person me-2"></i>
                        Recipient Information
                      </h5>
                    </Card.Header>
                    <Card.Body className="p-4">
                      <div className="form-section">
                        <h6 className="section-title">Personal Details</h6>
                        <Row>
                          <Col md={3}>
                            <Form.Group className="mb-4">
                              <Form.Label className="fw-semibold">
                                Prefix *
                              </Form.Label>
                              <Form.Select
                                name="recipient.prefix"
                                value={formData.recipient.prefix}
                                onChange={handleInputChange}
                                className="letterhead-form-control"
                                required
                              >
                                <option value="Mr.">Mr.</option>
                                <option value="Mrs.">Mrs.</option>
                                <option value="Ms.">Ms.</option>
                                <option value="Dr.">Dr.</option>
                                <option value="Prof.">Prof.</option>
                                <option value="Hon.">Hon.</option>
                                <option value="Company">Company</option>
                              </Form.Select>
                            </Form.Group>
                          </Col>
                          <Col md={3}>
                            <Form.Group className="mb-4">
                              <Form.Label className="fw-semibold">
                                First Name *
                              </Form.Label>
                              <Form.Control
                                type="text"
                                name="recipient.firstName"
                                value={formData.recipient.firstName}
                                onChange={handleInputChange}
                                placeholder="First name"
                                className="letterhead-form-control"
                                required
                              />
                            </Form.Group>
                          </Col>
                          <Col md={3}>
                            <Form.Group className="mb-4">
                              <Form.Label className="fw-semibold">
                                Middle Name
                              </Form.Label>
                              <Form.Control
                                type="text"
                                name="recipient.middleName"
                                value={formData.recipient.middleName}
                                onChange={handleInputChange}
                                placeholder="Middle name"
                                className="letterhead-form-control"
                              />
                            </Form.Group>
                          </Col>
                          <Col md={3}>
                            <Form.Group className="mb-4">
                              <Form.Label className="fw-semibold">
                                Last Name *
                              </Form.Label>
                              <Form.Control
                                type="text"
                                name="recipient.lastName"
                                value={formData.recipient.lastName}
                                onChange={handleInputChange}
                                placeholder="Last name"
                                className="letterhead-form-control"
                                required
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                      </div>

                      <div className="form-section">
                        <h6 className="section-title">Professional Details</h6>
                        <Row>
                          <Col md={6}>
                            <Form.Group className="mb-4">
                              <Form.Label className="fw-semibold">
                                Designation
                              </Form.Label>
                              <Form.Control
                                type="text"
                                name="recipient.designation"
                                value={formData.recipient.designation}
                                onChange={handleInputChange}
                                placeholder="Recipient's designation"
                                className="letterhead-form-control"
                              />
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group className="mb-4">
                              <Form.Label className="fw-semibold">
                                Company/Organization
                              </Form.Label>
                              <Form.Control
                                type="text"
                                name="recipient.company"
                                value={formData.recipient.company}
                                onChange={handleInputChange}
                                placeholder="Company or organization name"
                                className="letterhead-form-control"
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                      </div>
                    </Card.Body>
                  </Card>
                )}

                {/* Content Tab */}
                {activeTab === "content" && (
                  <Card className="letterhead-card">
                    <Card.Header>
                      <h5 className="mb-0">
                        <i className="bi bi-file-text me-2"></i>
                        Document Content
                      </h5>
                    </Card.Header>
                    <Card.Body className="p-4">
                      <div className="form-section">
                        <h6 className="section-title">
                          Header Section (Optional)
                        </h6>
                        <Form.Group className="mb-4">
                          <Form.Control
                            as="textarea"
                            rows={3}
                            name="header"
                            value={formData.header}
                            onChange={handleInputChange}
                            placeholder="Header content (appears at the top of the letterhead)"
                            className="letterhead-form-control"
                          />
                        </Form.Group>
                      </div>

                      <div className="form-section">
                        <h6 className="section-title">Main Content *</h6>
                        <div className="content-editor">
                          <div className="content-toolbar">
                            <div className="d-flex align-items-center gap-2 flex-wrap">
                              <small className="text-muted me-3">
                                Formatting:
                              </small>

                              <OverlayTrigger
                                placement="top"
                                overlay={<Tooltip>Bold</Tooltip>}
                              >
                                <button
                                  type="button"
                                  className="toolbar-btn"
                                  onClick={() => formatText("bold")}
                                >
                                  <i className="bi bi-type-bold"></i>
                                </button>
                              </OverlayTrigger>

                              <OverlayTrigger
                                placement="top"
                                overlay={<Tooltip>Italic</Tooltip>}
                              >
                                <button
                                  type="button"
                                  className="toolbar-btn"
                                  onClick={() => formatText("italic")}
                                >
                                  <i className="bi bi-type-italic"></i>
                                </button>
                              </OverlayTrigger>

                              <OverlayTrigger
                                placement="top"
                                overlay={<Tooltip>Underline</Tooltip>}
                              >
                                <button
                                  type="button"
                                  className="toolbar-btn"
                                  onClick={() => formatText("underline")}
                                >
                                  <i className="bi bi-type-underline"></i>
                                </button>
                              </OverlayTrigger>

                              <div
                                className="border-start mx-2"
                                style={{ height: "24px" }}
                              ></div>

                              <OverlayTrigger
                                placement="top"
                                overlay={<Tooltip>Insert Date</Tooltip>}
                              >
                                <button
                                  type="button"
                                  className="toolbar-btn"
                                  onClick={() =>
                                    insertTextAtCursor(
                                      new Date().toLocaleDateString(),
                                    )
                                  }
                                >
                                  <i className="bi bi-calendar-date"></i>
                                </button>
                              </OverlayTrigger>

                              <OverlayTrigger
                                placement="top"
                                overlay={<Tooltip>Insert Line Break</Tooltip>}
                              >
                                <button
                                  type="button"
                                  className="toolbar-btn"
                                  onClick={() => insertTextAtCursor("\n\n")}
                                >
                                  <i className="bi bi-text-paragraph"></i>
                                </button>
                              </OverlayTrigger>
                            </div>
                          </div>

                          <div
                            ref={contentRef}
                            contentEditable
                            className="content-editor-area"
                            onInput={(e) =>
                              handleContentChange(e.target.innerHTML)
                            }
                            dangerouslySetInnerHTML={{
                              __html: formData.content,
                            }}
                            style={{
                              outline: "none",
                              minHeight: "250px",
                            }}
                          />
                        </div>
                        <Form.Text className="text-muted">
                          <i className="bi bi-info-circle me-1"></i>
                          Write the main content of your letterhead. Use the
                          toolbar for basic formatting.
                        </Form.Text>
                      </div>

                      <div className="form-section">
                        <h6 className="section-title">
                          Footer Section (Optional)
                        </h6>
                        <Form.Group className="mb-4">
                          <Form.Control
                            as="textarea"
                            rows={3}
                            name="footer"
                            value={formData.footer}
                            onChange={handleInputChange}
                            placeholder="Footer content (appears at the bottom of the letterhead)"
                            className="letterhead-form-control"
                          />
                        </Form.Group>
                      </div>
                    </Card.Body>
                  </Card>
                )}

                {/* Signature Tab */}
                {activeTab === "signature" && (
                  <Card className="letterhead-card">
                    <Card.Header>
                      <h5 className="mb-0">
                        <i className="bi bi-pen me-2"></i>
                        Signature & Host Information
                      </h5>
                    </Card.Header>
                    <Card.Body className="p-4">
                      <div className="form-section">
                        <h6 className="section-title">Signatory Details</h6>
                        <Row>
                          <Col md={6}>
                            <Form.Group className="mb-4">
                              <Form.Label className="fw-semibold">
                                Host Name *
                              </Form.Label>
                              <Form.Control
                                type="text"
                                name="host.name"
                                value={formData.host.name}
                                onChange={handleInputChange}
                                placeholder="Name of the signatory"
                                className="letterhead-form-control"
                                required
                              />
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group className="mb-4">
                              <Form.Label className="fw-semibold">
                                Host Designation *
                              </Form.Label>
                              <Form.Control
                                type="text"
                                name="host.designation"
                                value={formData.host.designation}
                                onChange={handleInputChange}
                                placeholder="Designation of the signatory"
                                className="letterhead-form-control"
                                required
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                      </div>

                      <div className="form-section">
                        <h6 className="section-title">Internal Notes</h6>
                        <Form.Group className="mb-4">
                          <Form.Label className="fw-semibold">
                            Notes (Internal Use Only)
                          </Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={4}
                            name="notes"
                            value={formData.notes}
                            onChange={handleInputChange}
                            placeholder="Internal notes and comments (not visible in the letterhead)"
                            className="letterhead-form-control"
                          />
                          <Form.Text className="text-muted">
                            These notes are for internal use only and will not
                            appear in the final letterhead.
                          </Form.Text>
                        </Form.Group>
                      </div>
                    </Card.Body>
                  </Card>
                )}

                {/* Action Buttons */}
                <div className="d-flex gap-3 mt-4 flex-wrap">
                  <button
                    type="submit"
                    disabled={loading}
                    className="letterhead-btn"
                  >
                    {loading ? (
                      <>
                        <Spinner
                          animation="border"
                          size="sm"
                          className="me-2"
                        />
                        {isEditing ? "Updating..." : "Creating..."}
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-circle me-2"></i>
                        {isEditing ? "Update Letterhead" : "Create Letterhead"}
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    className="letterhead-btn-outline"
                    onClick={() => navigate("/admin/letterheads")}
                  >
                    <i className="bi bi-arrow-left me-2"></i>
                    Back to List
                  </button>

                  <button
                    type="button"
                    className="letterhead-btn-outline"
                    onClick={() => setShowPreview(true)}
                  >
                    <i className="bi bi-eye me-2"></i>
                    Full Preview
                  </button>
                </div>
              </Col>

              {/* Live Preview Panel */}
              <Col lg={4}>
                <div className="preview-panel">
                  <h6 className="fw-bold mb-3 text-center">
                    <i className="bi bi-eye me-2"></i>
                    Live Preview
                  </h6>

                  <div className="preview-content">
                    <div className="text-center mb-3">
                      <h6
                        style={{
                          fontSize: "14px",
                          fontWeight: "bold",
                          color: "#dc3545",
                        }}
                      >
                        HARE KRISHNA MEDICAL
                      </h6>
                      {formData.title && (
                        <div
                          style={{
                            fontSize: "12px",
                            fontWeight: "bold",
                            marginTop: "1rem",
                          }}
                        >
                          {formData.title}
                        </div>
                      )}
                    </div>

                    <div
                      className="d-flex justify-content-between mb-3"
                      style={{ fontSize: "10px" }}
                    >
                      <span>Ref: [Auto-generated]</span>
                      <span>
                        Date: {new Date().toLocaleDateString("en-GB")}
                      </span>
                    </div>

                    {formData.recipient.firstName && (
                      <div className="mb-3" style={{ fontSize: "11px" }}>
                        <div>
                          {getPreviewText().context}{" "}
                          {getPreviewText().recipientName},
                        </div>
                        {formData.recipient.designation && (
                          <div>{formData.recipient.designation}</div>
                        )}
                        {formData.recipient.company && (
                          <div>{formData.recipient.company}</div>
                        )}
                      </div>
                    )}

                    {formData.subject && (
                      <div className="mb-3" style={{ fontSize: "11px" }}>
                        <strong>Subject: </strong>
                        {formData.subject}
                      </div>
                    )}

                    <div
                      className="mb-3"
                      style={{
                        fontSize: "11px",
                        minHeight: "100px",
                        textAlign: "justify",
                      }}
                    >
                      <div
                        dangerouslySetInnerHTML={{
                          __html: getPreviewText().content,
                        }}
                      />
                    </div>

                    <div className="mb-3" style={{ fontSize: "11px" }}>
                      <div>With regards,</div>
                      <div style={{ marginTop: "2rem" }}>
                        <div>_____________________</div>
                        <div>{formData.host.name || "[Host Name]"}</div>
                        <div>
                          {formData.host.designation || "[Host Designation]"}
                        </div>
                        <div>Hare Krishna Medical</div>
                      </div>
                    </div>

                    <div className="text-center" style={{ fontSize: "10px" }}>
                      <div
                        style={{ border: "1px dashed #ccc", padding: "0.5rem" }}
                      >
                        Place for Official Stamp
                      </div>
                    </div>
                  </div>

                  <div className="mt-3">
                    <span className="badge-professional">
                      <i className="bi bi-shield-check me-1"></i>
                      Official Document
                    </span>
                  </div>
                </div>
              </Col>
            </Row>
          </Form>
        </Container>

        {/* Full Preview Modal */}
        <Modal
          show={showPreview}
          onHide={() => setShowPreview(false)}
          size="lg"
          centered
        >
          <Modal.Header closeButton className="bg-danger text-white">
            <Modal.Title>
              <i className="bi bi-eye me-2"></i>
              Full Letterhead Preview
            </Modal.Title>
          </Modal.Header>
          <Modal.Body
            style={{ fontFamily: "Times New Roman, serif", fontSize: "12px" }}
          >
            <div
              className="letterhead-preview p-4"
              style={{ backgroundColor: "white" }}
            >
              <div className="text-center mb-4">
                <h4
                  style={{
                    fontSize: "16px",
                    fontWeight: "bold",
                    color: "#dc3545",
                  }}
                >
                  HARE KRISHNA MEDICAL
                </h4>
                {formData.title && (
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: "bold",
                      margin: "1rem 0",
                    }}
                  >
                    {formData.title}
                  </div>
                )}
              </div>

              <div className="d-flex justify-content-between mb-4">
                <div>Ref: [Auto-generated]</div>
                <div>Date: {new Date().toLocaleDateString("en-GB")}</div>
              </div>

              <div className="mb-4">
                <div>
                  {getPreviewText().context} {getPreviewText().recipientName},
                </div>
                {formData.recipient.designation && (
                  <div>{formData.recipient.designation}</div>
                )}
                {formData.recipient.company && (
                  <div>{formData.recipient.company}</div>
                )}
              </div>

              {formData.subject && (
                <div className="mb-4">
                  <strong>Subject: </strong>
                  {formData.subject}
                </div>
              )}

              <div
                className="mb-4"
                style={{ textAlign: "justify", lineHeight: "1.6" }}
              >
                <div
                  dangerouslySetInnerHTML={{
                    __html:
                      formData.content || "Your content will appear here...",
                  }}
                />
              </div>

              <div className="mb-4">
                <div>With regards,</div>
                <div style={{ marginTop: "3rem" }}>
                  <div>_____________________</div>
                  <div>{formData.host.name || "[Host Name]"}</div>
                  <div>{formData.host.designation || "[Host Designation]"}</div>
                  <div>Hare Krishna Medical</div>
                </div>
              </div>

              <div className="text-end">
                <div
                  style={{
                    border: "2px dashed #dc3545",
                    padding: "1rem",
                    width: "150px",
                    marginLeft: "auto",
                  }}
                >
                  <small>Place for Official Stamp</small>
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
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
};

export default AddLetterhead;
