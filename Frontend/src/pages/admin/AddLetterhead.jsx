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
} from "react-bootstrap";
import { api, safeApiCall } from "../../utils/apiClient";
import {
  PageHeroSection,
  ThemeCard,
  ThemeButton,
  ThemeSection,
} from "../../components/common/ConsistentTheme";

const AddLetterhead = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

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
    { value: "certificate", label: "Certificate" },
    { value: "recommendation", label: "Recommendation" },
    { value: "authorization", label: "Authorization" },
    { value: "notice", label: "Notice" },
    { value: "announcement", label: "Announcement" },
    { value: "invitation", label: "Invitation" },
    { value: "acknowledgment", label: "Acknowledgment" },
    { value: "verification", label: "Verification" },
  ];

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

    try {
      setSubmitLoading(true);
      setError(null);
      setSuccess(null);

      // Validate required fields
      const requiredFields = [
        { field: formData.title, name: "Title" },
        { field: formData.recipient.name, name: "Recipient Name" },
        { field: formData.subject, name: "Subject" },
        { field: formData.content, name: "Content" },
        { field: formData.issuer.name, name: "Issuer Name" },
        { field: formData.issuer.designation, name: "Issuer Designation" },
      ];

      for (const { field, name } of requiredFields) {
        if (!field?.trim()) {
          throw new Error(`${name} is required`);
        }
      }

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

  useEffect(() => {
    fetchLetterhead();
  }, [id]);

  if (loading) {
    return (
      <Container fluid>
        <div className="text-center py-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
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
            ? "Update letterhead details"
            : "Create a new official letterhead"
        }
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Letterheads", href: "/admin/letterheads" },
          { label: isEditing ? "Edit" : "Create", active: true },
        ]}
      />

      <ThemeSection>
        {error && (
          <Alert variant="danger" className="mb-4">
            <i className="bi bi-exclamation-triangle me-2"></i>
            {error}
          </Alert>
        )}

        {success && (
          <Alert variant="success" className="mb-4">
            <i className="bi bi-check-circle me-2"></i>
            {success}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          {/* Form Progress Indicator */}
          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center text-muted">
              <small>
                <i className="bi bi-info-circle me-1"></i>Complete all required
                fields (*) to create the letterhead
              </small>
              <small className="text-end">
                <i className="bi bi-save me-1"></i>
                Auto-saved as draft
              </small>
            </div>
          </div>

          <Row className="g-4">
            {/* Main Content - Left Column */}
            <Col xl={8} lg={7}>
              {/* Basic Information */}
              <ThemeCard
                className="mb-4"
                style={{ borderLeft: "4px solid #e63946" }}
              >
                <Card.Header className="bg-light border-0 rounded-top">
                  <div className="d-flex align-items-center">
                    <i className="bi bi-file-earmark-text text-primary me-2 fs-5"></i>
                    <h5 className="mb-0 fw-bold">Basic Information</h5>
                  </div>
                </Card.Header>
                <Card.Body className="p-4">
                  <Row className="g-3">
                    <Col lg={8} md={7}>
                      <Form.Group className="position-relative">
                        <Form.Label className="fw-semibold">
                          Title <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="title"
                          value={formData.title}
                          onChange={handleChange}
                          placeholder="e.g., Certificate of Appreciation"
                          required
                          className="form-control-lg"
                        />
                      </Form.Group>
                    </Col>
                    <Col lg={4} md={5}>
                      <Form.Group>
                        <Form.Label className="fw-semibold">
                          Letter Type <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Select
                          name="letterType"
                          value={formData.letterType}
                          onChange={handleChange}
                          required
                          className="form-select-lg"
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
                          Subject <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          placeholder="e.g., Outstanding Performance Recognition"
                          required
                          className="form-control-lg"
                        />
                      </Form.Group>
                    </Col>
                    <Col xs={12}>
                      <Form.Group>
                        <Form.Label className="fw-semibold">
                          Content <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={6}
                          name="content"
                          value={formData.content}
                          onChange={handleChange}
                          placeholder="Enter the main content of the letterhead..."
                          required
                          style={{ resize: "vertical", minHeight: "150px" }}
                        />
                        <Form.Text className="text-muted">
                          <i className="bi bi-lightbulb me-1"></i>
                          Use professional language and include all relevant
                          details
                        </Form.Text>
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </ThemeCard>

              {/* Recipient & Issuer Information - Responsive Layout */}
              <Row className="g-4 mb-4">
                <Col lg={6}>
                  {/* Recipient Information */}
                  <ThemeCard
                    className="h-100"
                    style={{ borderLeft: "4px solid #28a745" }}
                  >
                    <Card.Header className="bg-light border-0 rounded-top">
                      <div className="d-flex align-items-center">
                        <i className="bi bi-person-badge text-success me-2 fs-5"></i>
                        <h5 className="mb-0 fw-bold">Recipient Information</h5>
                      </div>
                    </Card.Header>
                    <Card.Body className="p-4">
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">
                          Name <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="recipient.name"
                          value={formData.recipient.name}
                          onChange={handleChange}
                          placeholder="Full name of recipient"
                          required
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">
                          Designation
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="recipient.designation"
                          value={formData.recipient.designation}
                          onChange={handleChange}
                          placeholder="Job title or position"
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">
                          Organization
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="recipient.organization"
                          value={formData.recipient.organization}
                          onChange={handleChange}
                          placeholder="Company or institution name"
                        />
                      </Form.Group>

                      <Form.Group className="mb-0">
                        <Form.Label className="fw-semibold">Address</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          name="recipient.address"
                          value={formData.recipient.address}
                          onChange={handleChange}
                          placeholder="Complete address"
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
                      <div className="d-flex align-items-center">
                        <i className="bi bi-person-check text-warning me-2 fs-5"></i>
                        <h5 className="mb-0 fw-bold">Issuer Information</h5>
                      </div>
                    </Card.Header>
                    <Card.Body className="p-4">
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">
                          Name <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="issuer.name"
                          value={formData.issuer.name}
                          onChange={handleChange}
                          placeholder="Full name of issuer"
                          required
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">
                          Designation <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="issuer.designation"
                          value={formData.issuer.designation}
                          onChange={handleChange}
                          placeholder="Official title or position"
                          required
                        />
                      </Form.Group>

                      <Form.Group className="mb-0">
                        <Form.Label className="fw-semibold">
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
                          <i className="bi bi-image me-1"></i>
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
              {/* Quick Actions - Sticky on Desktop */}
              <div className="sticky-top" style={{ top: "100px" }}>
                {/* Primary Actions */}
                <ThemeCard
                  className="mb-4"
                  style={{ borderLeft: "4px solid #6f42c1" }}
                >
                  <Card.Header className="bg-light border-0 rounded-top">
                    <div className="d-flex align-items-center">
                      <i className="bi bi-lightning text-primary me-2 fs-5"></i>
                      <h5 className="mb-0 fw-bold">Quick Actions</h5>
                    </div>
                  </Card.Header>
                  <Card.Body className="p-4">
                    <div className="d-grid gap-3">
                      <ThemeButton
                        type="submit"
                        disabled={submitLoading}
                        size="lg"
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
                            Company Name
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="header.companyName"
                            value={formData.header.companyName}
                            onChange={handleChange}
                            placeholder="Your company name"
                          />
                        </Form.Group>
                      </Col>
                      <Col xs={12}>
                        <Form.Group>
                          <Form.Label className="fw-semibold">
                            Address
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="header.companyAddress"
                            value={formData.header.companyAddress}
                            onChange={handleChange}
                            placeholder="Street address"
                          />
                        </Form.Group>
                      </Col>
                      <Col xs={12}>
                        <Form.Group>
                          <Form.Label className="fw-semibold">
                            City & State
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="header.companyCity"
                            value={formData.header.companyCity}
                            onChange={handleChange}
                            placeholder="City, State ZIP"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label className="fw-semibold">Phone</Form.Label>
                          <Form.Control
                            type="text"
                            name="header.companyPhone"
                            value={formData.header.companyPhone}
                            onChange={handleChange}
                            placeholder="Contact number"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label className="fw-semibold">Email</Form.Label>
                          <Form.Control
                            type="email"
                            name="header.companyEmail"
                            value={formData.header.companyEmail}
                            onChange={handleChange}
                            placeholder="company@email.com"
                          />
                        </Form.Group>
                      </Col>
                      <Col xs={12}>
                        <Form.Group>
                          <Form.Label className="fw-semibold">
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
                            <i className="bi bi-image me-1"></i>
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
                        Terms & Conditions
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="footer.terms"
                        value={formData.footer.terms}
                        onChange={handleChange}
                        placeholder="Legal terms and verification info"
                        style={{ resize: "vertical" }}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">
                        Additional Information
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={2}
                        name="footer.additionalInfo"
                        value={formData.footer.additionalInfo}
                        onChange={handleChange}
                        placeholder="Extra footer details"
                        style={{ resize: "vertical" }}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">Tags</Form.Label>
                      <Form.Control
                        type="text"
                        value={formData.tags.join(", ")}
                        onChange={handleTagsChange}
                        placeholder="certificate, official, 2024"
                      />
                      <Form.Text className="text-muted">
                        <i className="bi bi-tags me-1"></i>
                        Comma-separated keywords for organization
                      </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-0">
                      <Form.Label className="fw-semibold">
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
      </ThemeSection>
    </Container>
  );
};

export default AddLetterhead;
