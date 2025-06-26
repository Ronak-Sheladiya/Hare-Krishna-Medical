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
          <Row>
            <Col lg={8}>
              {/* Basic Information */}
              <ThemeCard className="mb-4">
                <Card.Header>
                  <h5 className="mb-0">Basic Information</h5>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={8}>
                      <Form.Group className="mb-3">
                        <Form.Label>Title *</Form.Label>
                        <Form.Control
                          type="text"
                          name="title"
                          value={formData.title}
                          onChange={handleChange}
                          placeholder="Enter letterhead title"
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Letter Type *</Form.Label>
                        <Form.Select
                          name="letterType"
                          value={formData.letterType}
                          onChange={handleChange}
                          required
                        >
                          {letterTypes.map((type) => (
                            <option key={type.value} value={type.value}>
                              {type.label}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label>Subject *</Form.Label>
                    <Form.Control
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Enter letter subject"
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Content *</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={8}
                      name="content"
                      value={formData.content}
                      onChange={handleChange}
                      placeholder="Enter the main content of the letterhead"
                      required
                    />
                  </Form.Group>
                </Card.Body>
              </ThemeCard>

              {/* Recipient Information */}
              <ThemeCard className="mb-4">
                <Card.Header>
                  <h5 className="mb-0">Recipient Information</h5>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Recipient Name *</Form.Label>
                        <Form.Control
                          type="text"
                          name="recipient.name"
                          value={formData.recipient.name}
                          onChange={handleChange}
                          placeholder="Enter recipient name"
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Designation</Form.Label>
                        <Form.Control
                          type="text"
                          name="recipient.designation"
                          value={formData.recipient.designation}
                          onChange={handleChange}
                          placeholder="Enter recipient designation"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label>Organization</Form.Label>
                    <Form.Control
                      type="text"
                      name="recipient.organization"
                      value={formData.recipient.organization}
                      onChange={handleChange}
                      placeholder="Enter recipient organization"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="recipient.address"
                      value={formData.recipient.address}
                      onChange={handleChange}
                      placeholder="Enter recipient address"
                    />
                  </Form.Group>
                </Card.Body>
              </ThemeCard>

              {/* Issuer Information */}
              <ThemeCard className="mb-4">
                <Card.Header>
                  <h5 className="mb-0">Issuer Information</h5>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Issuer Name *</Form.Label>
                        <Form.Control
                          type="text"
                          name="issuer.name"
                          value={formData.issuer.name}
                          onChange={handleChange}
                          placeholder="Enter issuer name"
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Issuer Designation *</Form.Label>
                        <Form.Control
                          type="text"
                          name="issuer.designation"
                          value={formData.issuer.designation}
                          onChange={handleChange}
                          placeholder="Enter issuer designation"
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label>Signature (Base64 or URL)</Form.Label>
                    <Form.Control
                      type="text"
                      name="issuer.signature"
                      value={formData.issuer.signature}
                      onChange={handleChange}
                      placeholder="Enter signature image URL or base64"
                    />
                  </Form.Group>
                </Card.Body>
              </ThemeCard>
            </Col>

            <Col lg={4}>
              {/* Header Configuration */}
              <ThemeCard className="mb-4">
                <Card.Header>
                  <h5 className="mb-0">Header Configuration</h5>
                </Card.Header>
                <Card.Body>
                  <Form.Group className="mb-3">
                    <Form.Label>Company Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="header.companyName"
                      value={formData.header.companyName}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Company Address</Form.Label>
                    <Form.Control
                      type="text"
                      name="header.companyAddress"
                      value={formData.header.companyAddress}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>City & State</Form.Label>
                    <Form.Control
                      type="text"
                      name="header.companyCity"
                      value={formData.header.companyCity}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                      type="text"
                      name="header.companyPhone"
                      value={formData.header.companyPhone}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="header.companyEmail"
                      value={formData.header.companyEmail}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Logo (URL)</Form.Label>
                    <Form.Control
                      type="text"
                      name="header.logo"
                      value={formData.header.logo}
                      onChange={handleChange}
                      placeholder="Enter logo image URL"
                    />
                  </Form.Group>
                </Card.Body>
              </ThemeCard>

              {/* Footer Configuration */}
              <ThemeCard className="mb-4">
                <Card.Header>
                  <h5 className="mb-0">Footer Configuration</h5>
                </Card.Header>
                <Card.Body>
                  <Form.Group className="mb-3">
                    <Form.Label>Terms</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      name="footer.terms"
                      value={formData.footer.terms}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Additional Info</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="footer.additionalInfo"
                      value={formData.footer.additionalInfo}
                      onChange={handleChange}
                      placeholder="Additional footer information"
                    />
                  </Form.Group>
                </Card.Body>
              </ThemeCard>

              {/* Metadata */}
              <ThemeCard className="mb-4">
                <Card.Header>
                  <h5 className="mb-0">Metadata</h5>
                </Card.Header>
                <Card.Body>
                  <Form.Group className="mb-3">
                    <Form.Label>Tags</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.tags.join(", ")}
                      onChange={handleTagsChange}
                      placeholder="Enter tags separated by commas"
                    />
                    <Form.Text className="text-muted">
                      Separate tags with commas
                    </Form.Text>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Notes</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      placeholder="Internal notes about this letterhead"
                    />
                  </Form.Group>
                </Card.Body>
              </ThemeCard>

              {/* Actions */}
              <ThemeCard>
                <Card.Body>
                  <div className="d-grid gap-2">
                    <ThemeButton type="submit" disabled={submitLoading}>
                      {submitLoading ? (
                        <>
                          <Spinner size="sm" className="me-2" />
                          {isEditing ? "Updating..." : "Creating..."}
                        </>
                      ) : (
                        <>
                          <i className="bi bi-check-lg me-2"></i>
                          {isEditing
                            ? "Update Letterhead"
                            : "Create Letterhead"}
                        </>
                      )}
                    </ThemeButton>

                    <Button
                      type="button"
                      variant="outline-secondary"
                      onClick={() => navigate("/admin/letterheads")}
                      disabled={submitLoading}
                    >
                      <i className="bi bi-arrow-left me-2"></i>
                      Back to Letterheads
                    </Button>
                  </div>
                </Card.Body>
              </ThemeCard>
            </Col>
          </Row>
        </Form>
      </ThemeSection>
    </Container>
  );
};

export default AddLetterhead;
