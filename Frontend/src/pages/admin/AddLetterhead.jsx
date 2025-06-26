import React, { useState, useEffect, useRef } from "react";
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
  ProgressBar,
  Stepper,
  Step,
  StepLabel,
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
  const timelineRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [autoSaveStatus, setAutoSaveStatus] = useState("saved"); // 'saving', 'saved', 'error'

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
      logo: "https://cdn.builder.io/api/v1/assets/030c65a34d11492ab1cc545443b12540/hk-e0ec29?format=webp&width=800",
    },
    footer: {
      terms:
        "This is an official document issued by Hare Krishna Medical Store. For verification, please contact us at the above details.",
      additionalInfo: "",
    },
    tags: [],
    notes: "",
  });

  const timelineSteps = [
    {
      id: 0,
      title: "Document Type & Title",
      description: "Choose document type and set the main title",
      icon: "bi-file-earmark-text",
      color: "#e63946",
      fields: ["letterType", "title"],
    },
    {
      id: 1,
      title: "Subject & Content",
      description: "Define the subject and main content",
      icon: "bi-chat-square-quote",
      color: "#fd7e14",
      fields: ["subject", "content"],
    },
    {
      id: 2,
      title: "Recipient Details",
      description: "Add recipient information",
      icon: "bi-person-badge",
      color: "#28a745",
      fields: [
        "recipient.name",
        "recipient.designation",
        "recipient.organization",
        "recipient.address",
      ],
    },
    {
      id: 3,
      title: "Issuer Information",
      description: "Configure issuer details and signature",
      icon: "bi-person-check",
      color: "#6f42c1",
      fields: ["issuer.name", "issuer.designation", "issuer.signature"],
    },
    {
      id: 4,
      title: "Header & Branding",
      description: "Customize company header and logo",
      icon: "bi-building",
      color: "#20c997",
      fields: ["header.companyName", "header.logo"],
    },
    {
      id: 5,
      title: "Review & Finalize",
      description: "Review all details and create letterhead",
      icon: "bi-check-circle",
      color: "#0d6efd",
      fields: [],
    },
  ];

  const letterTypes = [
    {
      value: "certificate",
      label: "Certificate",
      icon: "bi-award",
      description: "Official certification documents",
    },
    {
      value: "recommendation",
      label: "Recommendation",
      icon: "bi-hand-thumbs-up",
      description: "Professional recommendations",
    },
    {
      value: "authorization",
      label: "Authorization",
      icon: "bi-check-circle",
      description: "Authorization letters",
    },
    {
      value: "notice",
      label: "Notice",
      icon: "bi-megaphone",
      description: "Official notices",
    },
    {
      value: "announcement",
      label: "Announcement",
      icon: "bi-broadcast",
      description: "Public announcements",
    },
    {
      value: "invitation",
      label: "Invitation",
      icon: "bi-envelope-heart",
      description: "Event invitations",
    },
    {
      value: "acknowledgment",
      label: "Acknowledgment",
      icon: "bi-chat-square-text",
      description: "Acknowledgment letters",
    },
    {
      value: "verification",
      label: "Verification",
      icon: "bi-shield-check",
      description: "Verification documents",
    },
  ];

  // Auto-save functionality
  useEffect(() => {
    const autoSaveTimer = setTimeout(() => {
      if (formData.title || formData.subject || formData.content) {
        handleAutoSave();
      }
    }, 3000);

    return () => clearTimeout(autoSaveTimer);
  }, [formData]);

  const handleAutoSave = async () => {
    if (!formData.title && !formData.subject) return;

    setAutoSaveStatus("saving");
    try {
      localStorage.setItem("letterhead_draft", JSON.stringify(formData));
      setAutoSaveStatus("saved");
    } catch (error) {
      setAutoSaveStatus("error");
    }
  };

  // Load draft from localStorage
  const loadDraft = () => {
    try {
      const draft = localStorage.getItem("letterhead_draft");
      if (draft) {
        const parsedDraft = JSON.parse(draft);
        setFormData(parsedDraft);
        setShowToast(true);
      }
    } catch (error) {
      console.error("Error loading draft:", error);
    }
  };

  // Professional sample data
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
        logo: "https://cdn.builder.io/api/v1/assets/030c65a34d11492ab1cc545443b12540/hk-e0ec29?format=webp&width=800",
      },
      footer: {
        terms:
          "This certificate is issued by Hare Krishna Medical Store, a certified healthcare institution. For verification and authentication, please contact us through the provided official channels.",
        additionalInfo: `Certificate ID: CERT-2024-001 | Issue Date: ${new Date().toLocaleDateString()} | Valid Until: ${new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString()}`,
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
    setCurrentStep(5); // Jump to review step
    setCompletedSteps(new Set([0, 1, 2, 3, 4]));
    setShowToast(true);
  };

  // Validation function
  const validateStep = (stepId) => {
    const step = timelineSteps[stepId];
    const errors = {};
    let isValid = true;

    step.fields.forEach((field) => {
      const value = getNestedValue(formData, field);
      if (!value || !value.toString().trim()) {
        errors[field] = `${field.split(".").pop()} is required`;
        isValid = false;
      }
    });

    setValidationErrors((prev) => ({ ...prev, ...errors }));
    return isValid;
  };

  const getNestedValue = (obj, path) => {
    return path.split(".").reduce((o, p) => o && o[p], obj);
  };

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

  // Step navigation
  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCompletedSteps((prev) => new Set([...prev, currentStep]));
      if (currentStep < timelineSteps.length - 1) {
        setCurrentStep(currentStep + 1);
        scrollToTimeline();
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      scrollToTimeline();
    }
  };

  const goToStep = (stepId) => {
    setCurrentStep(stepId);
    scrollToTimeline();
  };

  const scrollToTimeline = () => {
    if (timelineRef.current) {
      timelineRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
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
        localStorage.removeItem("letterhead_draft");

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
    setFormData((prev) => ({ ...prev, tags }));
  };

  // Progress calculation
  const getProgress = () => {
    return (
      ((completedSteps.size +
        (currentStep === timelineSteps.length - 1 ? 1 : 0)) /
        timelineSteps.length) *
      100
    );
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
            logo:
              letterhead.header?.logo ||
              "https://cdn.builder.io/api/v1/assets/030c65a34d11492ab1cc545443b12540/hk-e0ec29?format=webp&width=800",
          },
          footer: {
            terms:
              letterhead.footer?.terms ||
              "This is an official document issued by Hare Krishna Medical Store.",
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

  useEffect(() => {
    fetchLetterhead();
    if (!isEditing) {
      loadDraft();
    }
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
        title={isEditing ? "Edit Letterhead" : "Create Professional Letterhead"}
        subtitle={
          isEditing
            ? "Update letterhead details and preview changes"
            : "Create a new professional letterhead with guided workflow"
        }
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Letterheads", href: "/admin/letterheads" },
          { label: isEditing ? "Edit" : "Create", active: true },
        ]}
      />

      <ThemeSection>
        {/* Progress Header */}
        <div className="progress-header mb-4" ref={timelineRef}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="py-3">
              <Row className="align-items-center">
                <Col md={8}>
                  <div className="d-flex align-items-center">
                    <div className="me-3">
                      <div
                        className="progress-circle"
                        style={{
                          width: "50px",
                          height: "50px",
                          borderRadius: "50%",
                          background: `conic-gradient(#e63946 ${getProgress()}%, #e9ecef 0%)`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <div
                          className="bg-white rounded-circle d-flex align-items-center justify-content-center"
                          style={{ width: "40px", height: "40px" }}
                        >
                          <span className="fw-bold text-primary">
                            {Math.round(getProgress())}%
                          </span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h5 className="mb-1 fw-bold">
                        Step {currentStep + 1} of {timelineSteps.length}:{" "}
                        {timelineSteps[currentStep].title}
                      </h5>
                      <p className="text-muted mb-0">
                        {timelineSteps[currentStep].description}
                      </p>
                    </div>
                  </div>
                </Col>
                <Col md={4} className="text-end">
                  <div className="d-flex gap-2 justify-content-end">
                    {autoSaveStatus === "saving" && (
                      <Badge
                        bg="secondary"
                        className="d-flex align-items-center"
                      >
                        <Spinner size="sm" className="me-1" />
                        Auto-saving...
                      </Badge>
                    )}
                    {autoSaveStatus === "saved" && (
                      <Badge bg="success" className="d-flex align-items-center">
                        <i className="bi bi-check-circle me-1"></i>
                        Saved
                      </Badge>
                    )}
                    <Button
                      variant="outline-info"
                      size="sm"
                      onClick={loadMockData}
                    >
                      <i className="bi bi-magic me-1"></i>
                      Load Sample
                    </Button>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => setShowPreview(true)}
                      disabled={!formData.title && !formData.subject}
                    >
                      <i className="bi bi-eye me-1"></i>
                      Preview
                    </Button>
                  </div>
                </Col>
              </Row>
              <ProgressBar
                now={getProgress()}
                className="mt-3"
                style={{ height: "6px" }}
                variant="danger"
              />
            </Card.Body>
          </Card>
        </div>

        {/* Timeline Navigation */}
        <Card className="mb-4 border-0 shadow-sm">
          <Card.Body className="py-3">
            <div
              className="timeline-nav d-flex justify-content-between align-items-center"
              style={{ overflowX: "auto" }}
            >
              {timelineSteps.map((step, index) => (
                <div
                  key={step.id}
                  className={`timeline-step d-flex flex-column align-items-center cursor-pointer ${currentStep === index ? "active" : ""} ${completedSteps.has(index) ? "completed" : ""}`}
                  onClick={() => goToStep(index)}
                  style={{
                    minWidth: "120px",
                    transition: "all 0.3s ease",
                    opacity:
                      currentStep === index
                        ? 1
                        : completedSteps.has(index)
                          ? 0.8
                          : 0.5,
                  }}
                >
                  <div
                    className={`timeline-icon rounded-circle d-flex align-items-center justify-content-center mb-2`}
                    style={{
                      width: "40px",
                      height: "40px",
                      backgroundColor:
                        currentStep === index
                          ? step.color
                          : completedSteps.has(index)
                            ? "#28a745"
                            : "#dee2e6",
                      color: "white",
                      transition: "all 0.3s ease",
                    }}
                  >
                    <i
                      className={
                        completedSteps.has(index) ? "bi bi-check-lg" : step.icon
                      }
                    ></i>
                  </div>
                  <span
                    className={`small text-center ${currentStep === index ? "fw-bold text-dark" : "text-muted"}`}
                  >
                    {step.title}
                  </span>
                  {index < timelineSteps.length - 1 && (
                    <div
                      className="timeline-connector"
                      style={{
                        position: "absolute",
                        top: "20px",
                        left: "calc(100% - 10px)",
                        width: "20px",
                        height: "2px",
                        backgroundColor: completedSteps.has(index)
                          ? step.color
                          : "#dee2e6",
                        zIndex: -1,
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </Card.Body>
        </Card>

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
            {/* Main Content */}
            <Col xl={8} lg={7}>
              {/* Step Content */}
              {currentStep === 0 && (
                <ThemeCard
                  className="step-card"
                  style={{ borderLeft: `4px solid ${timelineSteps[0].color}` }}
                >
                  <Card.Header className="bg-light border-0">
                    <div className="d-flex align-items-center">
                      <i
                        className={`${timelineSteps[0].icon} text-primary me-2 fs-5`}
                      ></i>
                      <h5 className="mb-0 fw-bold">{timelineSteps[0].title}</h5>
                    </div>
                  </Card.Header>
                  <Card.Body className="p-4">
                    <Row className="g-4">
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label className="fw-semibold">
                            <i className="bi bi-tag me-1"></i>
                            Document Type <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Select
                            name="letterType"
                            value={formData.letterType}
                            onChange={handleChange}
                            required
                            className="form-select-lg"
                            style={{
                              borderLeft: `3px solid ${timelineSteps[0].color}`,
                            }}
                          >
                            {letterTypes.map((type) => (
                              <option key={type.value} value={type.value}>
                                {type.label}
                              </option>
                            ))}
                          </Form.Select>
                          <Form.Text className="text-muted">
                            <i className="bi bi-info-circle me-1"></i>
                            {
                              letterTypes.find(
                                (t) => t.value === formData.letterType,
                              )?.description
                            }
                          </Form.Text>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <div className="selected-type-preview p-3 bg-light rounded border">
                          <div className="text-center">
                            <i
                              className={`${letterTypes.find((t) => t.value === formData.letterType)?.icon} fs-1 text-primary mb-2`}
                            ></i>
                            <h6 className="fw-bold">
                              {
                                letterTypes.find(
                                  (t) => t.value === formData.letterType,
                                )?.label
                              }
                            </h6>
                            <small className="text-muted">
                              {
                                letterTypes.find(
                                  (t) => t.value === formData.letterType,
                                )?.description
                              }
                            </small>
                          </div>
                        </div>
                      </Col>
                      <Col xs={12}>
                        <Form.Group>
                          <Form.Label className="fw-semibold">
                            <i className="bi bi-card-heading me-1"></i>
                            Document Title{" "}
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="e.g., Certificate of Professional Excellence"
                            required
                            className={`form-control-lg ${validationErrors.title ? "is-invalid" : ""}`}
                            style={{
                              borderLeft: `3px solid ${timelineSteps[0].color}`,
                            }}
                          />
                          {validationErrors.title && (
                            <div className="invalid-feedback">
                              {validationErrors.title}
                            </div>
                          )}
                          <Form.Text className="text-muted">
                            <i className="bi bi-lightbulb me-1"></i>
                            This will be the main heading of your letterhead
                            document
                          </Form.Text>
                        </Form.Group>
                      </Col>
                    </Row>
                  </Card.Body>
                </ThemeCard>
              )}

              {currentStep === 1 && (
                <ThemeCard
                  className="step-card"
                  style={{ borderLeft: `4px solid ${timelineSteps[1].color}` }}
                >
                  <Card.Header className="bg-light border-0">
                    <div className="d-flex align-items-center">
                      <i
                        className={`${timelineSteps[1].icon} text-warning me-2 fs-5`}
                      ></i>
                      <h5 className="mb-0 fw-bold">{timelineSteps[1].title}</h5>
                    </div>
                  </Card.Header>
                  <Card.Body className="p-4">
                    <Row className="g-4">
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
                            style={{
                              borderLeft: `3px solid ${timelineSteps[1].color}`,
                            }}
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
                            rows={12}
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            placeholder="Enter the detailed content of the letterhead. Use professional language and include all relevant information..."
                            required
                            className={`${validationErrors.content ? "is-invalid" : ""}`}
                            style={{
                              resize: "vertical",
                              minHeight: "300px",
                              borderLeft: `3px solid ${timelineSteps[1].color}`,
                              fontSize: "15px",
                              lineHeight: "1.6",
                            }}
                          />
                          {validationErrors.content && (
                            <div className="invalid-feedback">
                              {validationErrors.content}
                            </div>
                          )}
                          <Form.Text className="text-muted">
                            <i className="bi bi-lightbulb me-1"></i>
                            Use professional language, include bullet points (•)
                            for achievements, and maintain formal tone
                          </Form.Text>
                        </Form.Group>
                      </Col>
                    </Row>
                  </Card.Body>
                </ThemeCard>
              )}

              {currentStep === 2 && (
                <ThemeCard
                  className="step-card"
                  style={{ borderLeft: `4px solid ${timelineSteps[2].color}` }}
                >
                  <Card.Header className="bg-light border-0">
                    <div className="d-flex align-items-center">
                      <i
                        className={`${timelineSteps[2].icon} text-success me-2 fs-5`}
                      ></i>
                      <h5 className="mb-0 fw-bold">{timelineSteps[2].title}</h5>
                    </div>
                  </Card.Header>
                  <Card.Body className="p-4">
                    <Row className="g-4">
                      <Col md={6}>
                        <Form.Group>
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
                            style={{
                              borderLeft: `3px solid ${timelineSteps[2].color}`,
                            }}
                          />
                          {validationErrors.recipientName && (
                            <div className="invalid-feedback">
                              {validationErrors.recipientName}
                            </div>
                          )}
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
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
                      </Col>
                      <Col xs={12}>
                        <Form.Group>
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
                      </Col>
                      <Col xs={12}>
                        <Form.Group>
                          <Form.Label className="fw-semibold">
                            <i className="bi bi-geo-alt me-1"></i>
                            Complete Address
                          </Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={3}
                            name="recipient.address"
                            value={formData.recipient.address}
                            onChange={handleChange}
                            placeholder="456 Wellness Boulevard, Medical District, Healthcare City, HC 54321"
                            style={{ resize: "vertical" }}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </Card.Body>
                </ThemeCard>
              )}

              {currentStep === 3 && (
                <ThemeCard
                  className="step-card"
                  style={{ borderLeft: `4px solid ${timelineSteps[3].color}` }}
                >
                  <Card.Header className="bg-light border-0">
                    <div className="d-flex align-items-center">
                      <i
                        className={`${timelineSteps[3].icon} text-primary me-2 fs-5`}
                      ></i>
                      <h5 className="mb-0 fw-bold">{timelineSteps[3].title}</h5>
                    </div>
                  </Card.Header>
                  <Card.Body className="p-4">
                    <Row className="g-4">
                      <Col md={6}>
                        <Form.Group>
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
                            style={{
                              borderLeft: `3px solid ${timelineSteps[3].color}`,
                            }}
                          />
                          {validationErrors.issuerName && (
                            <div className="invalid-feedback">
                              {validationErrors.issuerName}
                            </div>
                          )}
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
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
                            style={{
                              borderLeft: `3px solid ${timelineSteps[3].color}`,
                            }}
                          />
                          {validationErrors.issuerDesignation && (
                            <div className="invalid-feedback">
                              {validationErrors.issuerDesignation}
                            </div>
                          )}
                        </Form.Group>
                      </Col>
                      <Col xs={12}>
                        <Form.Group>
                          <Form.Label className="fw-semibold">
                            <i className="bi bi-image me-1"></i>
                            Digital Signature
                            <small className="text-muted ms-1">
                              (Optional)
                            </small>
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="issuer.signature"
                            value={formData.issuer.signature}
                            onChange={handleChange}
                            placeholder="https://example.com/signature.png or base64 data"
                          />
                          <Form.Text className="text-muted">
                            <i className="bi bi-upload me-1"></i>
                            Upload signature image URL for professional
                            appearance
                          </Form.Text>
                        </Form.Group>
                      </Col>
                    </Row>
                  </Card.Body>
                </ThemeCard>
              )}

              {currentStep === 4 && (
                <ThemeCard
                  className="step-card"
                  style={{ borderLeft: `4px solid ${timelineSteps[4].color}` }}
                >
                  <Card.Header className="bg-light border-0">
                    <div className="d-flex align-items-center">
                      <i
                        className={`${timelineSteps[4].icon} text-info me-2 fs-5`}
                      ></i>
                      <h5 className="mb-0 fw-bold">{timelineSteps[4].title}</h5>
                    </div>
                  </Card.Header>
                  <Card.Body className="p-4">
                    <Row className="g-4">
                      <Col md={6}>
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
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label className="fw-semibold">
                            <i className="bi bi-image me-1"></i>
                            Company Logo URL
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="header.logo"
                            value={formData.header.logo}
                            onChange={handleChange}
                            placeholder="https://example.com/logo.png"
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
                      <Col md={6}>
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
                      <Col md={6}>
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
                    </Row>
                  </Card.Body>
                </ThemeCard>
              )}

              {currentStep === 5 && (
                <ThemeCard
                  className="step-card"
                  style={{ borderLeft: `4px solid ${timelineSteps[5].color}` }}
                >
                  <Card.Header className="bg-light border-0">
                    <div className="d-flex align-items-center">
                      <i
                        className={`${timelineSteps[5].icon} text-primary me-2 fs-5`}
                      ></i>
                      <h5 className="mb-0 fw-bold">{timelineSteps[5].title}</h5>
                    </div>
                  </Card.Header>
                  <Card.Body className="p-4">
                    <div className="review-summary">
                      <Row className="g-4">
                        <Col md={6}>
                          <div className="summary-section">
                            <h6 className="fw-bold text-primary mb-3">
                              <i className="bi bi-file-earmark-text me-2"></i>
                              Document Information
                            </h6>
                            <div className="summary-item mb-2">
                              <strong>Type:</strong>{" "}
                              <span className="ms-2">
                                {
                                  letterTypes.find(
                                    (t) => t.value === formData.letterType,
                                  )?.label
                                }
                              </span>
                            </div>
                            <div className="summary-item mb-2">
                              <strong>Title:</strong>{" "}
                              <span className="ms-2">
                                {formData.title || "Not set"}
                              </span>
                            </div>
                            <div className="summary-item mb-2">
                              <strong>Subject:</strong>{" "}
                              <span className="ms-2">
                                {formData.subject || "Not set"}
                              </span>
                            </div>
                          </div>
                        </Col>
                        <Col md={6}>
                          <div className="summary-section">
                            <h6 className="fw-bold text-success mb-3">
                              <i className="bi bi-person-badge me-2"></i>
                              Recipient
                            </h6>
                            <div className="summary-item mb-2">
                              <strong>Name:</strong>{" "}
                              <span className="ms-2">
                                {formData.recipient.name || "Not set"}
                              </span>
                            </div>
                            <div className="summary-item mb-2">
                              <strong>Designation:</strong>{" "}
                              <span className="ms-2">
                                {formData.recipient.designation || "Not set"}
                              </span>
                            </div>
                            <div className="summary-item mb-2">
                              <strong>Organization:</strong>{" "}
                              <span className="ms-2">
                                {formData.recipient.organization || "Not set"}
                              </span>
                            </div>
                          </div>
                        </Col>
                        <Col md={6}>
                          <div className="summary-section">
                            <h6 className="fw-bold text-warning mb-3">
                              <i className="bi bi-person-check me-2"></i>
                              Issuer
                            </h6>
                            <div className="summary-item mb-2">
                              <strong>Name:</strong>{" "}
                              <span className="ms-2">
                                {formData.issuer.name || "Not set"}
                              </span>
                            </div>
                            <div className="summary-item mb-2">
                              <strong>Designation:</strong>{" "}
                              <span className="ms-2">
                                {formData.issuer.designation || "Not set"}
                              </span>
                            </div>
                          </div>
                        </Col>
                        <Col md={6}>
                          <div className="summary-section">
                            <h6 className="fw-bold text-info mb-3">
                              <i className="bi bi-building me-2"></i>
                              Company
                            </h6>
                            <div className="summary-item mb-2">
                              <strong>Name:</strong>{" "}
                              <span className="ms-2">
                                {formData.header.companyName}
                              </span>
                            </div>
                            <div className="summary-item mb-2">
                              <strong>Logo:</strong>{" "}
                              <span className="ms-2">
                                {formData.header.logo ? "Set" : "Not set"}
                              </span>
                            </div>
                          </div>
                        </Col>
                        <Col xs={12}>
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
                        </Col>
                        <Col xs={12}>
                          <Form.Group>
                            <Form.Label className="fw-semibold">
                              <i className="bi bi-journal-text me-1"></i>
                              Internal Notes
                            </Form.Label>
                            <Form.Control
                              as="textarea"
                              rows={3}
                              name="notes"
                              value={formData.notes}
                              onChange={handleChange}
                              placeholder="Private notes for internal reference"
                              style={{ resize: "vertical" }}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                    </div>
                  </Card.Body>
                </ThemeCard>
              )}

              {/* Step Navigation */}
              <div className="step-navigation mt-4">
                <Row>
                  <Col>
                    {currentStep > 0 && (
                      <Button
                        variant="outline-secondary"
                        onClick={prevStep}
                        className="me-2"
                      >
                        <i className="bi bi-arrow-left me-1"></i>
                        Previous
                      </Button>
                    )}
                  </Col>
                  <Col className="text-end">
                    {currentStep < timelineSteps.length - 1 ? (
                      <Button
                        variant="primary"
                        onClick={nextStep}
                        className="btn-gradient"
                      >
                        Next
                        <i className="bi bi-arrow-right ms-1"></i>
                      </Button>
                    ) : (
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
                    )}
                  </Col>
                </Row>
              </div>
            </Col>

            {/* Sidebar */}
            <Col xl={4} lg={5}>
              <div className="sticky-top" style={{ top: "100px" }}>
                {/* Quick Actions */}
                <ThemeCard className="mb-4">
                  <Card.Header className="bg-light border-0">
                    <h5 className="mb-0 fw-bold">
                      <i className="bi bi-lightning me-2"></i>
                      Quick Actions
                    </h5>
                  </Card.Header>
                  <Card.Body>
                    <div className="d-grid gap-2">
                      <Button
                        variant="outline-primary"
                        onClick={() => setShowPreview(true)}
                        disabled={!formData.title && !formData.subject}
                      >
                        <i className="bi bi-eye me-2"></i>
                        Preview Letterhead
                      </Button>
                      <Button variant="outline-info" onClick={loadMockData}>
                        <i className="bi bi-magic me-2"></i>
                        Load Sample Data
                      </Button>
                      <Button
                        variant="outline-secondary"
                        onClick={() => navigate("/admin/letterheads")}
                        disabled={submitLoading}
                      >
                        <i className="bi bi-arrow-left me-2"></i>
                        Back to List
                      </Button>
                    </div>
                  </Card.Body>
                </ThemeCard>

                {/* Progress Summary */}
                <ThemeCard className="mb-4">
                  <Card.Header className="bg-light border-0">
                    <h5 className="mb-0 fw-bold">
                      <i className="bi bi-list-check me-2"></i>
                      Progress Summary
                    </h5>
                  </Card.Header>
                  <Card.Body>
                    {timelineSteps.map((step, index) => (
                      <div
                        key={step.id}
                        className={`d-flex align-items-center mb-2 ${completedSteps.has(index) ? "text-success" : currentStep === index ? "text-primary" : "text-muted"}`}
                      >
                        <i
                          className={`${completedSteps.has(index) ? "bi-check-circle-fill" : currentStep === index ? "bi-arrow-right-circle" : "bi-circle"} me-2`}
                        ></i>
                        <span
                          className={`${currentStep === index ? "fw-bold" : ""}`}
                        >
                          {step.title}
                        </span>
                      </div>
                    ))}
                  </Card.Body>
                </ThemeCard>

                {/* Tips */}
                <ThemeCard>
                  <Card.Header className="bg-light border-0">
                    <h5 className="mb-0 fw-bold">
                      <i className="bi bi-lightbulb me-2"></i>
                      Professional Tips
                    </h5>
                  </Card.Header>
                  <Card.Body>
                    <div className="tips-list">
                      <div className="tip-item mb-3">
                        <div className="d-flex">
                          <i className="bi bi-check-circle text-success me-2 mt-1"></i>
                          <div>
                            <strong>Professional Language:</strong>
                            <small className="d-block text-muted">
                              Use formal, clear, and respectful language
                              throughout
                            </small>
                          </div>
                        </div>
                      </div>
                      <div className="tip-item mb-3">
                        <div className="d-flex">
                          <i className="bi bi-check-circle text-success me-2 mt-1"></i>
                          <div>
                            <strong>Complete Information:</strong>
                            <small className="d-block text-muted">
                              Include all necessary details for verification
                            </small>
                          </div>
                        </div>
                      </div>
                      <div className="tip-item mb-3">
                        <div className="d-flex">
                          <i className="bi bi-check-circle text-success me-2 mt-1"></i>
                          <div>
                            <strong>Logo Quality:</strong>
                            <small className="d-block text-muted">
                              Use high-resolution logo for professional
                              appearance
                            </small>
                          </div>
                        </div>
                      </div>
                      <div className="tip-item">
                        <div className="d-flex">
                          <i className="bi bi-check-circle text-success me-2 mt-1"></i>
                          <div>
                            <strong>Preview Before Saving:</strong>
                            <small className="d-block text-muted">
                              Always preview to ensure proper formatting
                            </small>
                          </div>
                        </div>
                      </div>
                    </div>
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
              Letterhead Preview - A4 Format
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-0" style={{ backgroundColor: "#f8f9fa" }}>
            <LetterheadDesign
              letterheadData={getPreviewData()}
              showActions={true}
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
            delay={4000}
            autohide
          >
            <Toast.Header>
              <i className="bi bi-magic text-primary me-2"></i>
              <strong className="me-auto">Data Loaded</strong>
            </Toast.Header>
            <Toast.Body>
              {isEditing
                ? "Letterhead data loaded successfully!"
                : "Professional sample data loaded. Customize as needed."}
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
        
        .step-card {
          transition: all 0.3s ease;
          border: 1px solid rgba(0,0,0,.125);
        }
        
        .step-card:hover {
          box-shadow: 0 8px 25px rgba(0,0,0,.1);
        }
        
        .timeline-step {
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
        }
        
        .timeline-step:hover {
          transform: translateY(-2px);
        }
        
        .timeline-step.active .timeline-icon {
          transform: scale(1.1);
          box-shadow: 0 4px 15px rgba(0,0,0,.2);
        }
        
        .summary-item {
          padding: 8px 0;
          border-bottom: 1px solid #f8f9fa;
        }
        
        .summary-item:last-child {
          border-bottom: none;
        }
        
        .cursor-pointer {
          cursor: pointer;
        }
        
        .progress-header {
          position: relative;
          z-index: 10;
        }
        
        .selected-type-preview {
          transition: all 0.3s ease;
        }
        
        .tip-item {
          transition: all 0.3s ease;
        }
        
        .tip-item:hover {
          transform: translateX(5px);
        }
        
        @media (max-width: 768px) {
          .timeline-nav {
            flex-direction: column;
            gap: 15px;
          }
          
          .timeline-step {
            flex-direction: row;
            width: 100%;
            text-align: left;
          }
          
          .timeline-icon {
            margin-right: 15px !important;
            margin-bottom: 0 !important;
          }
          
          .timeline-connector {
            display: none !important;
          }
        }
      `}</style>
    </Container>
  );
};

export default AddLetterhead;
