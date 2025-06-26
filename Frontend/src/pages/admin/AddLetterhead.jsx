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
      const response = await safeApiCall(() =>
        api.get(`/api/letterheads/${id}`),
      );
      if (response.success) {
        setFormData(response.data);
      } else {
        setError(response.error || "Failed to fetch letterhead");
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
          api.put(`/api/letterheads/${id}`, formData),
        );
      } else {
        response = await safeApiCall(() =>
          api.post("/api/letterheads", formData),
        );
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
            detail: response.data,
          }),
        );

        setTimeout(() => {
          navigate("/admin/letterheads");
        }, 2000);
      } else {
        setError(response.error || "Failed to save letterhead");
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
      <Container className="py-5">
        <div className="text-center">
          <Spinner animation="border" variant="danger" />
          <p className="mt-3">Loading letterhead data...</p>
        </div>
      </Container>
    );
  }

  return (
    <div className="letterhead-container">
      <style>{`
        .letterhead-container {
          background: #f8f9fa;
          min-height: 100vh;
          padding-bottom: 2rem;
        }

        .letterhead-hero {
          background: linear-gradient(135deg, #dc3545 0%, #b91c2c 100%);
          color: white;
          padding: 4rem 0 3rem 0;
          margin-bottom: 2rem;
          position: relative;
          overflow: hidden;
        }

        .letterhead-hero::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E") repeat;
        }

        .letterhead-hero .container {
          position: relative;
          z-index: 2;
        }

        .letterhead-card {
          border: none;
          border-radius: 15px;
          box-shadow: 0 10px 30px rgba(220, 53, 69, 0.1);
          margin-bottom: 2rem;
          overflow: hidden;
          transition: all 0.3s ease;
          background: white;
        }

        .letterhead-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 40px rgba(220, 53, 69, 0.15);
        }

        .letterhead-card .card-header {
          background: linear-gradient(135deg, #dc3545 0%, #b91c2c 100%);
          color: white;
          border: none;
          padding: 1.5rem;
        }

        .letterhead-tabs {
          background: white;
          border-radius: 15px;
          padding: 1rem;
          margin-bottom: 2rem;
          box-shadow: 0 5px 20px rgba(220, 53, 69, 0.1);
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
          justify-content: center;
        }

        .letterhead-tab {
          background: transparent;
          border: 2px solid #e9ecef;
          color: #6c757d;
          padding: 1rem 1.5rem;
          border-radius: 10px;
          font-weight: 500;
          transition: all 0.3s ease;
          cursor: pointer;
          display: flex;
          align-items: center;
          text-decoration: none;
          min-width: 120px;
          justify-content: center;
          flex: 1;
          max-width: 200px;
        }

        .letterhead-tab:hover {
          border-color: #dc3545;
          color: #dc3545;
          transform: translateY(-2px);
        }

        .letterhead-tab.active {
          background: linear-gradient(135deg, #dc3545 0%, #b91c2c 100%);
          border-color: #dc3545;
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(220, 53, 69, 0.3);
        }

        .letterhead-form-control {
          border: 2px solid #e9ecef;
          border-radius: 10px;
          padding: 0.75rem 1rem;
          transition: all 0.3s ease;
          font-size: 0.95rem;
          width: 100%;
        }

        .letterhead-form-control:focus {
          border-color: #dc3545;
          box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
          transform: translateY(-1px);
        }

        .letterhead-btn {
          background: linear-gradient(135deg, #dc3545 0%, #b91c2c 100%);
          border: none;
          color: white;
          padding: 0.75rem 2rem;
          border-radius: 10px;
          font-weight: 600;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
        }

        .letterhead-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(220, 53, 69, 0.3);
          color: white;
        }

        .letterhead-btn:disabled {
          opacity: 0.7;
          transform: none;
        }

        .letterhead-btn-outline {
          background: transparent;
          border: 2px solid #dc3545;
          color: #dc3545;
          padding: 0.75rem 2rem;
          border-radius: 10px;
          font-weight: 600;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          text-decoration: none;
        }

        .letterhead-btn-outline:hover {
          background: #dc3545;
          color: white;
          transform: translateY(-2px);
        }

        .preview-panel {
          position: sticky;
          top: 20px;
          background: white;
          border-radius: 15px;
          padding: 1.5rem;
          box-shadow: 0 10px 30px rgba(220, 53, 69, 0.1);
          border: 2px solid #f8f9fa;
          max-height: 80vh;
          overflow-y: auto;
        }

        .toolbar-btn {
          background: #f8f9fa;
          border: 1px solid #dee2e6;
          color: #495057;
          padding: 0.5rem 0.75rem;
          border-radius: 6px;
          transition: all 0.2s ease;
          cursor: pointer;
        }

        .toolbar-btn:hover {
          background: #dc3545;
          border-color: #dc3545;
          color: white;
        }

        .form-section {
          margin-bottom: 3rem;
          padding-bottom: 2rem;
          border-bottom: 1px solid #f0f0f0;
        }

        .form-section:last-child {
          border-bottom: none;
          margin-bottom: 0;
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

        .content-editor {
          border: 2px solid #e9ecef;
          border-radius: 10px;
          overflow: hidden;
          transition: all 0.3s ease;
          background: white;
        }

        .content-editor:focus-within {
          border-color: #dc3545;
          box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
        }

        .content-toolbar {
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          padding: 1rem;
          border-bottom: 1px solid #dee2e6;
        }

        .content-editor-area {
          padding: 1.5rem;
          background: white;
          font-family: 'Times New Roman', serif;
          font-size: 14px;
          line-height: 1.6;
          border: none;
          min-height: 300px;
          width: 100%;
          outline: none;
          color: #333;
        }

        .content-editor-area:focus {
          background: #fefefe;
        }

        .preview-content {
          font-family: "Times New Roman", serif;
          font-size: 12px;
          line-height: 1.5;
          background: white;
          padding: 2rem;
          border: 1px solid #dee2e6;
          border-radius: 8px;
          margin-bottom: 1rem;
          color: #333;
        }

        .letterhead-template {
          background: white;
          width: 100%;
          max-width: 800px;
          margin: 0 auto;
          font-family: 'Times New Roman', serif;
          font-size: 14px;
          line-height: 1.6;
          color: #333;
          border: 2px solid #dc3545;
          border-radius: 0;
          overflow: hidden;
          page-break-inside: avoid;
        }

        .letterhead-header {
          background: linear-gradient(135deg, #dc3545 0%, #b91c2c 100%);
          color: white;
          padding: 2rem;
          text-align: center;
          border-bottom: 3px solid #dc3545;
        }

        .letterhead-content {
          padding: 2.5rem;
          min-height: 400px;
        }

        .letterhead-footer {
          background: #f8f9fa;
          padding: 1.5rem 2rem;
          border-top: 2px solid #dc3545;
          font-size: 12px;
          color: #6c757d;
          text-align: center;
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

        .action-buttons {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          margin-top: 2rem;
        }

        /* Responsive Design */
        @media (max-width: 1200px) {
          .preview-panel {
            position: static;
            margin-top: 2rem;
            max-height: none;
          }
        }

        @media (max-width: 768px) {
          .letterhead-hero {
            padding: 2rem 0;
            margin-bottom: 1rem;
          }

          .letterhead-hero h1 {
            font-size: 1.75rem;
          }

          .letterhead-card {
            margin-bottom: 1rem;
          }

          .letterhead-tabs {
            flex-direction: column;
            gap: 0.5rem;
          }

          .letterhead-tab {
            margin: 0;
            text-align: center;
            min-width: auto;
            width: 100%;
            max-width: none;
            flex: none;
          }

          .content-toolbar {
            padding: 0.75rem;
          }

          .content-toolbar .d-flex {
            flex-wrap: wrap;
            gap: 0.5rem;
          }

          .toolbar-btn {
            padding: 0.4rem 0.6rem;
            font-size: 0.85rem;
          }

          .content-editor-area {
            padding: 1rem;
            font-size: 13px;
            min-height: 250px;
          }

          .preview-content {
            padding: 1rem;
            font-size: 11px;
          }

          .letterhead-template {
            margin: 0;
            border-radius: 8px;
          }

          .letterhead-header, .letterhead-body {
            padding: 1.5rem 1rem;
            border-radius: 8px;
          }

          .letterhead-footer {
            padding: 1rem;
            background: #f8f9fa;
          }
            flex-direction: column;
          }

          .letterhead-btn, .letterhead-btn-outline {
            padding: 0.6rem 1.5rem;
            font-size: 0.9rem;
            width: 100%;
            justify-content: center;
          }
        }

        @media (max-width: 576px) {
          .letterhead-hero {
            padding: 1.5rem 0;
          }

          .letterhead-hero h1 {
            font-size: 1.5rem;
          }

          .letterhead-card .card-header {
            padding: 1rem;
          }

          .letterhead-card .card-body {
            padding: 1rem !important;
          }

          .content-editor-area {
            min-height: 200px;
            font-size: 12px;
          }

          .preview-content {
            font-size: 10px;
            padding: 0.75rem;
          }

          .letterhead-header, .letterhead-body {
            padding: 1rem 0.75rem;
            font-size: 0.9rem;
          }
          .form-section {
            margin-bottom: 2rem;
            padding-bottom: 1.5rem;
          }
        }

        /* Print Styles for Letterhead Templates */
        @media print {
          .letterhead-container {
            background: white;
          }

          .letterhead-template {
            border: none;
            box-shadow: none;
          }
            width: 100%;
          }

          .letterhead-hero,
          .letterhead-tabs,
          .alert-custom,
          .preview-panel,
          button,
          .action-buttons {
            display: none !important;
          }

          .content-editor-area {
            border: none;
            padding: 0;
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
                {isEditing ? "Edit Letterhead" : "Create Letterhead"}
              </h1>
              <p className="lead opacity-90">
                {isEditing
                  ? "Update your letterhead with proper formatting and design"
                  : "Design letterheads with our advanced editor"}
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
          <div className="letterhead-tabs">
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
                            placeholder="Enter the title of your letterhead"
                            className="letterhead-form-control"
                            required
                          />
                        </Form.Group>

                        <Form.Group className="mb-4">
                          <Form.Label className="fw-semibold">
                            Context Type
                          </Form.Label>
                          <Form.Select
                            name="context"
                            value={formData.context}
                            onChange={handleInputChange}
                            className="letterhead-form-control"
                          >
                            <option value="respected">Respected</option>
                            <option value="dear">Dear</option>
                            <option value="to_whom_it_may_concern">
                              To Whom It May Concern
                            </option>
                          </Form.Select>
                        </Form.Group>
                      </div>
                    </Card.Body>
                  </Card>
                )}

                {/* Recipient Tab */}
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
                                placeholder="Job title or position"
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

                      <div className="form-section">
                        <h6 className="section-title">Subject</h6>
                        <Form.Group className="mb-4">
                          <Form.Label className="fw-semibold">
                            Subject Line *
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="subject"
                            value={formData.subject}
                            onChange={handleInputChange}
                            placeholder="Enter the subject of your letterhead"
                            className="letterhead-form-control"
                            required
                          />
                        </Form.Group>
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
                        Professional Document Content
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
                        <h6 className="section-title">
                          Main Document Content *
                        </h6>
                        <div className="content-editor">
                          <div className="content-toolbar">
                            <div className="d-flex align-items-center gap-2 flex-wrap">
                              <small className="text-muted me-3 fw-semibold">
                                Document Formatting Tools:
                              </small>

                              <OverlayTrigger
                                placement="top"
                                overlay={<Tooltip>Bold Text</Tooltip>}
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
                                overlay={<Tooltip>Italic Text</Tooltip>}
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
                                overlay={<Tooltip>Underline Text</Tooltip>}
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
                                overlay={<Tooltip>Insert Current Date</Tooltip>}
                              >
                                <button
                                  type="button"
                                  className="toolbar-btn"
                                  onClick={() =>
                                    insertTextAtCursor(
                                      new Date().toLocaleDateString("en-GB"),
                                    )
                                  }
                                >
                                  <i className="bi bi-calendar-date"></i>
                                </button>
                              </OverlayTrigger>

                              <OverlayTrigger
                                placement="top"
                                overlay={
                                  <Tooltip>Insert Paragraph Break</Tooltip>
                                }
                              >
                                <button
                                  type="button"
                                  className="toolbar-btn"
                                  onClick={() => insertTextAtCursor("\n\n")}
                                >
                                  <i className="bi bi-text-paragraph"></i>
                                </button>
                              </OverlayTrigger>

                              <OverlayTrigger
                                placement="top"
                                overlay={
                                  <Tooltip>Create Professional List</Tooltip>
                                }
                              >
                                <button
                                  type="button"
                                  className="toolbar-btn"
                                  onClick={() =>
                                    formatText("insertUnorderedList")
                                  }
                                >
                                  <i className="bi bi-list-ul"></i>
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
                            placeholder="Write your professional letterhead content here. Use the toolbar for formatting..."
                          />
                        </div>
                        <Form.Text className="text-muted">
                          <div className="letterhead-footer">
                            This is a computer-generated letterhead document
                            with proper formatting and official verification.
                          </div>
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
                            placeholder="Footer content (appears at the bottom of the letterhead document)"
                            className="letterhead-form-control"
                          />
                          <Form.Text className="text-muted">
                            Professional footer content such as disclaimers,
                            contact information, or company policies.
                          </Form.Text>
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
                            placeholder="Internal notes and comments (not visible in the letterhead document)"
                            className="letterhead-form-control"
                          />
                          <Form.Text className="text-muted">
                            These notes are for internal use only and will not
                            appear in the final letterhead document.
                          </Form.Text>
                        </Form.Group>
                      </div>
                    </Card.Body>
                  </Card>
                )}

                {/* Action Buttons */}
                <div className="action-buttons">
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
                    Full Letterhead Preview
                  </button>
                </div>
              </Col>

              {/* Live Preview Panel */}
              <Col lg={4}>
                <div className="preview-panel">
                  <h6 className="fw-bold mb-3 text-center text-danger">
                    <i className="bi bi-eye me-2"></i>
                    Live Letterhead Preview
                  </h6>

                  <div className="letterhead-template">
                    <div className="email-header">
                      <h6
                        style={{
                          margin: 0,
                          fontSize: "16px",
                          fontWeight: "bold",
                        }}
                      >
                        HARE KRISHNA MEDICAL
                      </h6>
                      {formData.title && (
                        <div
                          style={{
                            fontSize: "14px",
                            fontWeight: "600",
                            marginTop: "0.5rem",
                          }}
                        >
                          {formData.title}
                        </div>
                      )}
                    </div>

                    <div className="email-body">
                      <div
                        className="d-flex justify-content-between mb-3"
                        style={{ fontSize: "11px", color: "#666" }}
                      >
                        <span>
                          <strong>Ref:</strong> [Auto-generated]
                        </span>
                        <span>
                          <strong>Date:</strong>{" "}
                          {new Date().toLocaleDateString("en-GB")}
                        </span>
                      </div>

                      {formData.recipient.firstName && (
                        <div className="mb-3" style={{ fontSize: "12px" }}>
                          <div style={{ marginBottom: "0.5rem" }}>
                            <strong>
                              {getPreviewText().context}{" "}
                              {getPreviewText().recipientName},
                            </strong>
                          </div>
                          {formData.recipient.designation && (
                            <div style={{ color: "#666" }}>
                              {formData.recipient.designation}
                            </div>
                          )}
                          {formData.recipient.company && (
                            <div style={{ color: "#666" }}>
                              {formData.recipient.company}
                            </div>
                          )}
                        </div>
                      )}

                      {formData.subject && (
                        <div className="mb-3" style={{ fontSize: "12px" }}>
                          <strong style={{ color: "#dc3545" }}>
                            Subject:{" "}
                          </strong>
                          {formData.subject}
                        </div>
                      )}

                      <div
                        className="mb-4"
                        style={{
                          fontSize: "12px",
                          minHeight: "100px",
                          textAlign: "justify",
                          lineHeight: "1.6",
                          color: "#333",
                        }}
                      >
                        <div
                          dangerouslySetInnerHTML={{
                            __html: getPreviewText().content,
                          }}
                        />
                      </div>

                      <div className="mb-3" style={{ fontSize: "12px" }}>
                        <div>With warm regards,</div>
                        <div
                          style={{ marginTop: "2rem", marginBottom: "1rem" }}
                        >
                          <div
                            style={{
                              borderBottom: "1px solid #333",
                              width: "200px",
                            }}
                          ></div>
                        </div>
                        <div style={{ fontWeight: "600" }}>
                          {formData.host.name || "[Host Name]"}
                        </div>
                        <div style={{ color: "#666" }}>
                          {formData.host.designation || "[Host Designation]"}
                        </div>
                        <div style={{ color: "#dc3545", fontWeight: "600" }}>
                          Hare Krishna Medical
                        </div>
                      </div>
                    </div>

                    <div className="letterhead-footer">
                      <div style={{ marginBottom: "1rem" }}>
                        <div
                          style={{
                            border: "2px dashed #dc3545",
                            padding: "1rem",
                            textAlign: "center",
                            backgroundColor: "#fafafa",
                          }}
                        >
                          <i className="bi bi-shield-check me-1"></i>
                          Official Stamp & Verification
                        </div>
                      </div>
                      <div style={{ fontSize: "10px", color: "#999" }}>
                        This is a computer-generated letterhead document. QR
                        code verification available.
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 text-center">
                    <span className="badge-professional">
                      <i className="bi bi-file-text-check me-1"></i>
                      Official Document Template
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
          size="xl"
          centered
        >
          <Modal.Header closeButton className="bg-danger text-white">
            <Modal.Title>
              <i className="bi bi-file-text me-2"></i>
              Full Letterhead Document Preview
            </Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ padding: 0 }}>
            <div
              className="letterhead-template"
              style={{ margin: 0, borderRadius: 0 }}
            >
              <div className="letterhead-header">
                <h4 style={{ margin: 0, fontSize: "18px", fontWeight: "bold" }}>
                  HARE KRISHNA MEDICAL
                </h4>
                {formData.title && (
                  <div
                    style={{
                      fontSize: "16px",
                      fontWeight: "600",
                      marginTop: "1rem",
                    }}
                  >
                    {formData.title}
                  </div>
                )}
              </div>

              <div className="letterhead-content" style={{ padding: "3rem" }}>
                <div
                  className="d-flex justify-content-between mb-4"
                  style={{ fontSize: "12px", color: "#666" }}
                >
                  <span>
                    <strong>Reference:</strong> [Auto-generated ID]
                  </span>
                  <span>
                    <strong>Date:</strong>{" "}
                    {new Date().toLocaleDateString("en-GB")}
                  </span>
                </div>

                {formData.recipient.firstName && (
                  <div className="mb-4" style={{ fontSize: "14px" }}>
                    <div style={{ marginBottom: "1rem" }}>
                      <strong>
                        {getPreviewText().context}{" "}
                        {getPreviewText().recipientName},
                      </strong>
                    </div>
                    {formData.recipient.designation && (
                      <div style={{ color: "#666", marginBottom: "0.25rem" }}>
                        {formData.recipient.designation}
                      </div>
                    )}
                    {formData.recipient.company && (
                      <div style={{ color: "#666" }}>
                        {formData.recipient.company}
                      </div>
                    )}
                  </div>
                )}

                {formData.subject && (
                  <div className="mb-4" style={{ fontSize: "14px" }}>
                    <strong style={{ color: "#dc3545" }}>Subject: </strong>
                    {formData.subject}
                  </div>
                )}

                <div
                  className="mb-4"
                  style={{
                    fontSize: "14px",
                    lineHeight: "1.8",
                    textAlign: "justify",
                    color: "#333",
                    minHeight: "150px",
                  }}
                >
                  <div
                    dangerouslySetInnerHTML={{
                      __html:
                        formData.content ||
                        "Your professional letterhead content will appear here...",
                    }}
                  />
                </div>

                <div style={{ fontSize: "14px", marginTop: "3rem" }}>
                  <div>With warm regards,</div>
                  <div style={{ marginTop: "3rem", marginBottom: "1rem" }}>
                    <div
                      style={{ borderBottom: "2px solid #333", width: "250px" }}
                    ></div>
                  </div>
                  <div style={{ fontWeight: "600", fontSize: "15px" }}>
                    {formData.host.name || "[Host Name]"}
                  </div>
                  <div style={{ color: "#666", marginBottom: "0.5rem" }}>
                    {formData.host.designation || "[Host Designation]"}
                  </div>
                  <div style={{ color: "#dc3545", fontWeight: "600" }}>
                    Hare Krishna Medical
                  </div>
                </div>
              </div>

              <div className="email-footer">
                <div style={{ marginBottom: "1.5rem" }}>
                  <div
                    style={{
                      border: "2px dashed #ccc",
                      padding: "1.5rem",
                      textAlign: "center",
                      backgroundColor: "#fafafa",
                      borderRadius: "8px",
                    }}
                  >
                    <i
                      className="bi bi-shield-check me-2"
                      style={{ fontSize: "1.2rem" }}
                    ></i>
                    <strong>Official Stamp & Digital Verification</strong>
                    <div
                      style={{
                        fontSize: "11px",
                        marginTop: "0.5rem",
                        color: "#666",
                      }}
                    >
                      QR Code verification and digital signature space
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "#999",
                    textAlign: "center",
                  }}
                >
                  This is a computer-generated letterhead with proper
                  formatting.
                  <br />
                  For verification, scan the QR code or visit our verification
                  portal.
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer className="bg-light">
            <Button
              variant="outline-danger"
              onClick={() => setShowPreview(false)}
            >
              <i className="bi bi-x-circle me-2"></i>
              Close Preview
            </Button>
            <Button variant="danger" onClick={() => window.print()}>
              <i className="bi bi-printer me-2"></i>
              Print Email
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
};

export default AddLetterhead;
