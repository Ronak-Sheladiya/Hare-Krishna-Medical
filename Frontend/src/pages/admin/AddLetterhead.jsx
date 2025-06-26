import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  Badge,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import { api, safeApiCall } from "../../utils/apiClient";
import {
  PageHeroSection,
  ThemeCard,
  ThemeButton,
  ThemeSection,
} from "../../components/common/ConsistentTheme";
import LetterheadDesign from "../../components/common/LetterheadDesign";

const AddLetterhead = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const [formData, setFormData] = useState({
    title: "",
    letterType: "certificate",
    recipient: {
      name: "",
      designation: "",
      organization: "",
      address: "",
    },
    subject: "",
    content: "",
    issuer: {
      name: "",
      designation: "",
      signature: "",
    },
    header: {
      companyName: "Hare Krishna Medical Store",
      companyAddress: "123 Main Street, Healthcare District",
      companyCity: "Medical City, State 12345",
      companyPhone: "+91 98765 43210",
      companyEmail: "info@harekrishnamedical.com",
      logo: "",
    },
    footer: {
      terms:
        "This is an official document issued by Hare Krishna Medical Store. For verification, please contact us at the above details.",
      additionalInfo: "",
    },
    tags: [],
    notes: "",
  });

  const letterTypes = [
    { value: "certificate", label: "Certificate", icon: "bi-award" },
    {
      value: "recommendation",
      label: "Recommendation",
      icon: "bi-hand-thumbs-up",
    },
    { value: "authorization", label: "Authorization", icon: "bi-check-circle" },
    { value: "notice", label: "Notice", icon: "bi-megaphone" },
    { value: "announcement", label: "Announcement", icon: "bi-broadcast" },
    { value: "invitation", label: "Invitation", icon: "bi-envelope-heart" },
    {
      value: "acknowledgment",
      label: "Acknowledgment",
      icon: "bi-chat-square-text",
    },
    { value: "verification", label: "Verification", icon: "bi-shield-check" },
  ];

  // Load mock data for professional demonstration
  const loadMockData = () => {
    const mockData = {
      title: "Certificate of Professional Excellence",
      letterType: "certificate",
      recipient: {
        name: "Dr. Sarah Johnson",
        designation: "Senior Pharmacist",
        organization: "HealthCare Plus Medical Center",
        address:
          "456 Wellness Boulevard, Medical District, Healthcare City, HC 54321",
      },
      subject:
        "Recognition of Outstanding Professional Achievement and Dedication",
      content: `We are pleased to certify that Dr. Sarah Johnson has demonstrated exceptional professional excellence and unwavering dedication in the field of pharmaceutical sciences. 

Through her outstanding contributions to patient care, innovative pharmaceutical research, and commitment to medical ethics, Dr. Johnson has consistently exceeded industry standards and expectations.

This certificate acknowledges her significant achievements in:
• Advanced pharmaceutical consultation and patient counseling
• Implementation of innovative drug therapy management protocols
• Leadership in clinical pharmacy services
• Contribution to medical research and drug safety initiatives

We hereby recognize Dr. Sarah Johnson's exemplary professional conduct and recommend her expertise to colleagues and institutions within the healthcare community.

This certification is awarded in recognition of proven competency, professional integrity, and continued commitment to excellence in pharmaceutical practice.`,
      issuer: {
        name: "Dr. Rajesh Kumar Sharma",
        designation: "Chief Medical Officer & Director",
        signature: "",
      },
      header: {
        companyName: "Hare Krishna Medical Store",
        companyAddress: "123 Main Street, Healthcare District",
        companyCity: "Medical City, State 12345",
        companyPhone: "+91 98765 43210",
        companyEmail: "info@harekrishnamedical.com",
        logo: "",
      },
      footer: {
        terms:
          "This certificate is issued by Hare Krishna Medical Store, a certified healthcare institution. For verification and authentication, please contact us through the provided official channels. This document is valid for professional reference and verification purposes.",
        additionalInfo:
          "Certificate ID: CERT-2024-001 | Issue Date: " +
          new Date().toLocaleDateString() +
          " | Valid Until: " +
          new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      },
      tags: [
        "certificate",
        "professional",
        "excellence",
        "pharmaceutical",
        "healthcare",
      ],
      notes:
        "Professional excellence certificate for outstanding pharmaceutical services and dedication to patient care.",
    };

    setFormData(mockData);
    setShowToast(true);
  };

  // Validation function
  const validateForm = () => {
    const errors = {};

    if (!formData.title?.trim()) errors.title = "Title is required";
    if (!formData.recipient.name?.trim())
      errors.recipientName = "Recipient name is required";
    if (!formData.subject?.trim()) errors.subject = "Subject is required";
    if (!formData.content?.trim()) errors.content = "Content is required";
    if (!formData.issuer.name?.trim())
      errors.issuerName = "Issuer name is required";
    if (!formData.issuer.designation?.trim())
      errors.issuerDesignation = "Issuer designation is required";

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Fetch letterhead data for editing
  const fetchLetterhead = async () => {
    if (!isEditing) return;

    try {
      setLoading(true);
      setError(null);

      const response = await safeApiCall(api.get(`/api/letterheads/${id}`));

      if (response?.success) {
        const letterhead = response.letterhead;
        setFormData({
          title: letterhead.title || "",
          letterType: letterhead.letterType || "certificate",
          recipient: {
            name: letterhead.recipient?.name || "",
            designation: letterhead.recipient?.designation || "",
            organization: letterhead.recipient?.organization || "",
            address: letterhead.recipient?.address || "",
          },
          subject: letterhead.subject || "",
          content: letterhead.content || "",
          issuer: {
            name: letterhead.issuer?.name || "",
            designation: letterhead.issuer?.designation || "",
            signature: letterhead.issuer?.signature || "",
          },
          header: {
            companyName:
              letterhead.header?.companyName || "Hare Krishna Medical Store",
            companyAddress:
              letterhead.header?.companyAddress ||
              "123 Main Street, Healthcare District",
            companyCity:
              letterhead.header?.companyCity || "Medical City, State 12345",
            companyPhone: letterhead.header?.companyPhone || "+91 98765 43210",
            companyEmail:
              letterhead.header?.companyEmail || "info@harekrishnamedical.com",
            logo: letterhead.header?.logo || "",
          },
          footer: {
            terms:
              letterhead.footer?.terms ||
              "This is an official document issued by Hare Krishna Medical Store. For verification, please contact us at the above details.",
            additionalInfo: letterhead.footer?.additionalInfo || "",
          },
          tags: letterhead.tags || [],
          notes: letterhead.notes || "",
        });
      } else {
        throw new Error(response?.message || "Failed to fetch letterhead");
      }
    } catch (error) {
      console.error("Fetch letterhead error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setError("Please fill in all required fields correctly");
      return;
    }

    try {
      setSubmitLoading(true);
      setError(null);
      setSuccess(null);

      const url = isEditing ? `/api/letterheads/${id}` : "/api/letterheads";
      const method = isEditing ? "put" : "post";

      const response = await safeApiCall(api[method](url, formData));

      if (response?.success) {
        setSuccess(
          isEditing
            ? "Letterhead updated successfully!"
            : "Letterhead created successfully!",
        );

        // Redirect after a short delay
        setTimeout(() => {
          navigate("/admin/letterheads");
        }, 1500);
      } else {
        throw new Error(response?.message || "Failed to save letterhead");
      }
    } catch (error) {
      console.error("Submit letterhead error:", error);
      setError(error.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [section, field] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  // Handle tags change
  const handleTagsChange = (e) => {
    const value = e.target.value;
    const tags = value
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag);
    setFormData((prev) => ({
      ...prev,
      tags,
    }));
  };

  // Create preview data
  const getPreviewData = () => ({
    letterheadId: "PREVIEW-" + Date.now(),
    title: formData.title || "Sample Title",
    letterType: formData.letterType,
    recipient: formData.recipient,
    subject: formData.subject || "Sample Subject",
    content: formData.content || "Sample content for preview",
    issuer: formData.issuer,
    header: formData.header,
    footer: formData.footer,
    status: "draft",
    issueDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  });

  useEffect(() => {
    fetchLetterhead();
  }, [id]);

  if (loading) {
    return (
      <Container fluid>
        <div className="text-center py-5">
          <Spinner animation="border" role="status" size="lg">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-3 text-muted">Loading letterhead data...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid>
      <PageHeroSection
        title={isEditing ? "Edit Letterhead" : "Create Letterhead"}
        subtitle={
          isEditing
            ? "Update letterhead details and preview changes"
            : "Create a new professional letterhead with live preview"
        }
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Letterheads", href: "/admin/letterheads" },
          { label: isEditing ? "Edit" : "Create", active: true },
        ]}
      />

      <ThemeSection>
        {/* Action Bar */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h4 className="mb-1 fw-bold text-dark">
              {isEditing ? "Edit Letterhead" : "Create New Letterhead"}
            </h4>
            <p className="text-muted mb-0">
              <i className="bi bi-info-circle me-1"></i>
              Fill in the details below to create a professional letterhead
            </p>
          </div>
          <div className="d-flex gap-2">
            <Button
              variant="outline-info"
              size="sm"
              onClick={loadMockData}
              className="d-flex align-items-center"
            >
              <i className="bi bi-magic me-1"></i>
              Load Sample Data
            </Button>
            <Button
              variant="outline-primary"
              size="sm"
              onClick={() => setShowPreview(true)}
              disabled={!formData.title && !formData.subject}
              className="d-flex align-items-center"
            >
              <i className="bi bi-eye me-1"></i>
              Preview Letterhead
            </Button>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <Alert variant="danger" className="mb-4 d-flex align-items-center">
            <i className="bi bi-exclamation-triangle me-2 fs-5"></i>
            <div>
              <strong>Error:</strong> {error}
            </div>
          </Alert>
        )}

        {success && (
          <Alert variant="success" className="mb-4 d-flex align-items-center">
            <i className="bi bi-check-circle me-2 fs-5"></i>
            <div>
              <strong>Success:</strong> {success}
            </div>
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Row className="g-4">
            {/* Main Content - Left Column */}
            <Col xl={8} lg={7}>
              {/* Basic Information */}
              <ThemeCard
                className="mb-4"
                style={{ borderLeft: "4px solid #e63946" }}
              >
                <Card.Header className="bg-light border-0 rounded-top">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                      <i className="bi bi-file-earmark-text text-primary me-2 fs-5"></i>
                      <h5 className="mb-0 fw-bold">Basic Information</h5>
                    </div>
                    <Badge bg="primary" className="fs-6">
                      Step 1
                    </Badge>
                  </div>
                </Card.Header>
                <Card.Body className="p-4">
                  <Row className="g-3">
                    <Col lg={8} md={7}>
                      <Form.Group className="position-relative">
                        <Form.Label className="fw-semibold">
                          <i className="bi bi-card-heading me-1"></i>
                          Title <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="title"
                          value={formData.title}
                          onChange={handleChange}
                          placeholder="e.g., Certificate of Professional Excellence"
                          required
                          className={`form-control-lg ${validationErrors.title ? "is-invalid" : ""}`}
                          style={{ borderLeft: "3px solid #e63946" }}
                        />
                        {validationErrors.title && (
                          <div className="invalid-feedback">
                            {validationErrors.title}
                          </div>
                        )}
                      </Form.Group>
                    </Col>
                    <Col lg={4} md={5}>
                      <Form.Group>
                        <Form.Label className="fw-semibold">
                          <i className="bi bi-tag me-1"></i>
                          Letter Type <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Select
                          name="letterType"
                          value={formData.letterType}
                          onChange={handleChange}
                          required
                          className="form-select-lg"
                          style={{ borderLeft: "3px solid #28a745" }}
                        >
                          {letterTypes.map((type) => (
                            <option key={type.value} value={type.value}>
                              {type.label}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col xs={12}>
                      <Form.Group>
                        <Form.Label className="fw-semibold">
                          <i className="bi bi-chat-square-quote me-1"></i>
                          Subject <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          placeholder="e.g., Recognition of Outstanding Professional Achievement"
                          required
                          className={`form-control-lg ${validationErrors.subject ? "is-invalid" : ""}`}
                          style={{ borderLeft: "3px solid #fd7e14" }}
                        />
                        {validationErrors.subject && (
                          <div className="invalid-feedback">
                            {validationErrors.subject}
                          </div>
                        )}
                      </Form.Group>
                    </Col>
                    <Col xs={12}>
                      <Form.Group>
                        <Form.Label className="fw-semibold">
                          <i className="bi bi-file-text me-1"></i>
                          Content <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={8}
                          name="content"
                          value={formData.content}
                          onChange={handleChange}
                          placeholder="Enter the detailed content of the letterhead. Use professional language and include all relevant information..."
                          required
                          className={`${validationErrors.content ? "is-invalid" : ""}`}
                          style={{
                            resize: "vertical",
                            minHeight: "200px",
                            borderLeft: "3px solid #6f42c1",
                          }}
                        />
                        {validationErrors.content && (
                          <div className="invalid-feedback">
                            {validationErrors.content}
                          </div>
                        )}
                        <Form.Text className="text-muted">
                          <i className="bi bi-lightbulb me-1"></i>
                          Use professional language, include bullet points for
                          achievements, and maintain formal tone
                        </Form.Text>
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </ThemeCard>

              {/* Recipient & Issuer Information */}
              <Row className="g-4 mb-4">
                <Col lg={6}>
                  {/* Recipient Information */}
                  <ThemeCard
                    className="h-100"
                    style={{ borderLeft: "4px solid #28a745" }}
                  >
                    <Card.Header className="bg-light border-0 rounded-top">
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center">
                          <i className="bi bi-person-badge text-success me-2 fs-5"></i>
                          <h5 className="mb-0 fw-bold">Recipient Details</h5>
                        </div>
                        <Badge bg="success" className="fs-6">
                          Step 2
                        </Badge>
                      </div>
                    </Card.Header>
                    <Card.Body className="p-4">
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">
                          <i className="bi bi-person me-1"></i>
                          Full Name <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="recipient.name"
                          value={formData.recipient.name}
                          onChange={handleChange}
                          placeholder="Dr. Sarah Johnson"
                          required
                          className={`${validationErrors.recipientName ? "is-invalid" : ""}`}
                          style={{ borderLeft: "3px solid #28a745" }}
                        />
                        {validationErrors.recipientName && (
                          <div className="invalid-feedback">
                            {validationErrors.recipientName}
                          </div>
                        )}
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">
                          <i className="bi bi-briefcase me-1"></i>
                          Designation
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="recipient.designation"
                          value={formData.recipient.designation}
                          onChange={handleChange}
                          placeholder="Senior Pharmacist"
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">
                          <i className="bi bi-building me-1"></i>
                          Organization
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="recipient.organization"
                          value={formData.recipient.organization}
                          onChange={handleChange}
                          placeholder="HealthCare Plus Medical Center"
                        />
                      </Form.Group>

                      <Form.Group className="mb-0">
                        <Form.Label className="fw-semibold">
                          <i className="bi bi-geo-alt me-1"></i>
                          Address
                        </Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          name="recipient.address"
                          value={formData.recipient.address}
                          onChange={handleChange}
                          placeholder="Complete mailing address"
                          style={{ resize: "vertical" }}
                        />
                      </Form.Group>
                    </Card.Body>
                  </ThemeCard>
                </Col>

                <Col lg={6}>
                  {/* Issuer Information */}
                  <ThemeCard
                    className="h-100"
                    style={{ borderLeft: "4px solid #fd7e14" }}
                  >
                    <Card.Header className="bg-light border-0 rounded-top">
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center">
                          <i className="bi bi-person-check text-warning me-2 fs-5"></i>
                          <h5 className="mb-0 fw-bold">Issuer Details</h5>
                        </div>
                        <Badge bg="warning" className="fs-6">
                          Step 3
                        </Badge>
                      </div>
                    </Card.Header>
                    <Card.Body className="p-4">
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">
                          <i className="bi bi-person-check me-1"></i>
                          Issuer Name <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="issuer.name"
                          value={formData.issuer.name}
                          onChange={handleChange}
                          placeholder="Dr. Rajesh Kumar Sharma"
                          required
                          className={`${validationErrors.issuerName ? "is-invalid" : ""}`}
                          style={{ borderLeft: "3px solid #fd7e14" }}
                        />
                        {validationErrors.issuerName && (
                          <div className="invalid-feedback">
                            {validationErrors.issuerName}
                          </div>
                        )}
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">
                          <i className="bi bi-award me-1"></i>
                          Designation <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="issuer.designation"
                          value={formData.issuer.designation}
                          onChange={handleChange}
                          placeholder="Chief Medical Officer & Director"
                          required
                          className={`${validationErrors.issuerDesignation ? "is-invalid" : ""}`}
                          style={{ borderLeft: "3px solid #fd7e14" }}
                        />
                        {validationErrors.issuerDesignation && (
                          <div className="invalid-feedback">
                            {validationErrors.issuerDesignation}
                          </div>
                        )}
                      </Form.Group>

                      <Form.Group className="mb-0">
                        <Form.Label className="fw-semibold">
                          <i className="bi bi-image me-1"></i>
                          Digital Signature
                          <small className="text-muted ms-1">(Optional)</small>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="issuer.signature"
                          value={formData.issuer.signature}
                          onChange={handleChange}
                          placeholder="Signature image URL or base64"
                        />
                        <Form.Text className="text-muted">
                          <i className="bi bi-upload me-1"></i>
                          Upload signature image for professional appearance
                        </Form.Text>
                      </Form.Group>
                    </Card.Body>
                  </ThemeCard>
                </Col>
              </Row>
            </Col>

            {/* Configuration Sidebar - Right Column */}
            <Col xl={4} lg={5}>
              {/* Sticky Configuration Panel */}
              <div className="sticky-top" style={{ top: "100px" }}>
                {/* Primary Actions */}
                <ThemeCard
                  className="mb-4"
                  style={{ borderLeft: "4px solid #6f42c1" }}
                >
                  <Card.Header className="bg-light border-0 rounded-top">
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center">
                        <i className="bi bi-lightning text-primary me-2 fs-5"></i>
                        <h5 className="mb-0 fw-bold">Actions</h5>
                      </div>
                      <Badge bg="primary" className="fs-6">
                        Final
                      </Badge>
                    </div>
                  </Card.Header>
                  <Card.Body className="p-4">
                    <div className="d-grid gap-3">
                      <ThemeButton
                        type="submit"
                        disabled={submitLoading}
                        size="lg"
                        className="btn-gradient"
                      >
                        {submitLoading ? (
                          <>
                            <Spinner size="sm" className="me-2" />
                            {isEditing ? "Updating..." : "Creating..."}
                          </>
                        ) : (
                          <>
                            <i className="bi bi-check-circle me-2"></i>
                            {isEditing
                              ? "Update Letterhead"
                              : "Create Letterhead"}
                          </>
                        )}
                      </ThemeButton>

                      <Button
                        type="button"
                        variant="outline-secondary"
                        size="lg"
                        onClick={() => navigate("/admin/letterheads")}
                        disabled={submitLoading}
                      >
                        <i className="bi bi-arrow-left me-2"></i>
                        Back to Letterheads
                      </Button>
                    </div>
                  </Card.Body>
                </ThemeCard>

                {/* Company Header Configuration */}
                <ThemeCard
                  className="mb-4"
                  style={{ borderLeft: "4px solid #20c997" }}
                >
                  <Card.Header className="bg-light border-0 rounded-top">
                    <div className="d-flex align-items-center">
                      <i className="bi bi-building text-info me-2 fs-5"></i>
                      <h5 className="mb-0 fw-bold">Header Configuration</h5>
                    </div>
                  </Card.Header>
                  <Card.Body className="p-4">
                    <Row className="g-3">
                      <Col xs={12}>
                        <Form.Group>
                          <Form.Label className="fw-semibold">
                            <i className="bi bi-shop me-1"></i>
                            Company Name
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="header.companyName"
                            value={formData.header.companyName}
                            onChange={handleChange}
                            placeholder="Hare Krishna Medical Store"
                          />
                        </Form.Group>
                      </Col>
                      <Col xs={12}>
                        <Form.Group>
                          <Form.Label className="fw-semibold">
                            <i className="bi bi-geo-alt me-1"></i>
                            Address
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="header.companyAddress"
                            value={formData.header.companyAddress}
                            onChange={handleChange}
                            placeholder="123 Main Street, Healthcare District"
                          />
                        </Form.Group>
                      </Col>
                      <Col xs={12}>
                        <Form.Group>
                          <Form.Label className="fw-semibold">
                            <i className="bi bi-pin-map me-1"></i>
                            City & State
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="header.companyCity"
                            value={formData.header.companyCity}
                            onChange={handleChange}
                            placeholder="Medical City, State 12345"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={12}>
                        <Form.Group>
                          <Form.Label className="fw-semibold">
                            <i className="bi bi-telephone me-1"></i>
                            Phone
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="header.companyPhone"
                            value={formData.header.companyPhone}
                            onChange={handleChange}
                            placeholder="+91 98765 43210"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={12}>
                        <Form.Group>
                          <Form.Label className="fw-semibold">
                            <i className="bi bi-envelope me-1"></i>
                            Email
                          </Form.Label>
                          <Form.Control
                            type="email"
                            name="header.companyEmail"
                            value={formData.header.companyEmail}
                            onChange={handleChange}
                            placeholder="info@harekrishnamedical.com"
                          />
                        </Form.Group>
                      </Col>
                      <Col xs={12}>
                        <Form.Group>
                          <Form.Label className="fw-semibold">
                            <i className="bi bi-image me-1"></i>
                            Logo URL
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="header.logo"
                            value={formData.header.logo}
                            onChange={handleChange}
                            placeholder="https://example.com/logo.png"
                          />
                          <Form.Text className="text-muted">
                            <i className="bi bi-cloud-upload me-1"></i>
                            Company logo for letterhead header
                          </Form.Text>
                        </Form.Group>
                      </Col>
                    </Row>
                  </Card.Body>
                </ThemeCard>

                {/* Footer & Metadata Configuration */}
                <ThemeCard
                  className="mb-4"
                  style={{ borderLeft: "4px solid #dc3545" }}
                >
                  <Card.Header className="bg-light border-0 rounded-top">
                    <div className="d-flex align-items-center">
                      <i className="bi bi-card-text text-danger me-2 fs-5"></i>
                      <h5 className="mb-0 fw-bold">Footer & Metadata</h5>
                    </div>
                  </Card.Header>
                  <Card.Body className="p-4">
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">
                        <i className="bi bi-shield-check me-1"></i>
                        Terms & Verification
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="footer.terms"
                        value={formData.footer.terms}
                        onChange={handleChange}
                        placeholder="Legal terms and verification information"
                        style={{ resize: "vertical" }}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">
                        <i className="bi bi-info-circle me-1"></i>
                        Additional Information
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={2}
                        name="footer.additionalInfo"
                        value={formData.footer.additionalInfo}
                        onChange={handleChange}
                        placeholder="Certificate ID, validity period, etc."
                        style={{ resize: "vertical" }}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">
                        <i className="bi bi-tags me-1"></i>
                        Tags
                      </Form.Label>
                      <Form.Control
                        type="text"
                        value={formData.tags.join(", ")}
                        onChange={handleTagsChange}
                        placeholder="certificate, professional, excellence"
                      />
                      <Form.Text className="text-muted">
                        <i className="bi bi-lightbulb me-1"></i>
                        Comma-separated keywords for organization
                      </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-0">
                      <Form.Label className="fw-semibold">
                        <i className="bi bi-journal-text me-1"></i>
                        Internal Notes
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={2}
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        placeholder="Private notes for internal reference"
                        style={{ resize: "vertical" }}
                      />
                    </Form.Group>
                  </Card.Body>
                </ThemeCard>
              </div>
            </Col>
          </Row>
        </Form>

        {/* Preview Modal */}
        <Modal
          show={showPreview}
          onHide={() => setShowPreview(false)}
          size="xl"
          fullscreen="lg-down"
        >
          <Modal.Header closeButton className="bg-light">
            <Modal.Title className="d-flex align-items-center">
              <i className="bi bi-eye me-2"></i>
              Letterhead Preview
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-0">
            <LetterheadDesign
              letterheadData={getPreviewData()}
              showActions={false}
              printMode={false}
            />
          </Modal.Body>
          <Modal.Footer className="bg-light">
            <Button variant="secondary" onClick={() => setShowPreview(false)}>
              Close Preview
            </Button>
            <Button variant="primary" onClick={() => setShowPreview(false)}>
              Continue Editing
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Toast Notification */}
        <ToastContainer position="bottom-end" className="p-3">
          <Toast
            show={showToast}
            onClose={() => setShowToast(false)}
            delay={3000}
            autohide
          >
            <Toast.Header>
              <i className="bi bi-magic text-primary me-2"></i>
              <strong className="me-auto">Sample Data Loaded</strong>
            </Toast.Header>
            <Toast.Body>
              Professional sample data has been loaded. You can customize it as
              needed.
            </Toast.Body>
          </Toast>
        </ToastContainer>
      </ThemeSection>

      {/* Custom Styles */}
      <style>{`
        .btn-gradient {
          background: linear-gradient(135deg, #e63946 0%, #dc3545 100%);
          border: none;
          color: white;
          transition: all 0.3s ease;
        }
        
        .btn-gradient:hover {
          background: linear-gradient(135deg, #dc3545 0%, #b02a37 100%);
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(220, 53, 69, 0.3);
        }
        
        .form-control:focus,
        .form-select:focus {
          border-color: #e63946;
          box-shadow: 0 0 0 0.2rem rgba(230, 57, 70, 0.25);
        }
        
        .sticky-top {
          z-index: 1020;
        }
        
        .badge {
          font-size: 0.7rem;
          padding: 0.25rem 0.5rem;
        }
      `}</style>
    </Container>
  );
};

export default AddLetterhead;
