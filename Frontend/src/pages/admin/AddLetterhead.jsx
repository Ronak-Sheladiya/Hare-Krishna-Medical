import React, { useState, useEffect } from "react";
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
} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { api, safeApiCall } from "../../utils/apiClient";
import {
  PageHeroSection,
  ThemeCard,
  ThemeButton,
} from "../../components/common/ConsistentTheme";

const AddLetterhead = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

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
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-2">Loading letterhead...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <PageHeroSection
        title={isEditing ? "Edit Letterhead" : "Create New Letterhead"}
        subtitle={
          isEditing
            ? "Update letterhead details"
            : "Fill in the details to create a new letterhead"
        }
      />

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert variant="success" dismissible onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        <Row>
          <Col lg={8}>
            {/* Basic Information */}
            <ThemeCard className="mb-4">
              <Card.Header>
                <h5 className="mb-0">
                  <i className="bi bi-info-circle me-2"></i>Basic Information
                </h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Letter Type *</Form.Label>
                      <Form.Select
                        name="letterType"
                        value={formData.letterType}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="certificate">Certificate</option>
                        <option value="request">Request</option>
                        <option value="application">Application</option>
                        <option value="notice">Notice</option>
                        <option value="recommendation">Recommendation</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Language</Form.Label>
                      <Form.Select
                        name="language"
                        value={formData.language}
                        onChange={handleInputChange}
                      >
                        <option value="english">English</option>
                        <option value="hindi">Hindi</option>
                        <option value="gujarati">Gujarati</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Title *</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter letterhead title"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Context *</Form.Label>
                  <Form.Select
                    name="context"
                    value={formData.context}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="respected">Respected</option>
                    <option value="dear">Dear</option>
                    <option value="to_whom_it_may_concern">
                      To Whom It May Concern
                    </option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Subject *</Form.Label>
                  <Form.Control
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="Enter subject"
                    required
                  />
                </Form.Group>
              </Card.Body>
            </ThemeCard>

            {/* Recipient Information */}
            <ThemeCard className="mb-4">
              <Card.Header>
                <h5 className="mb-0">
                  <i className="bi bi-person me-2"></i>Recipient Information
                </h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>Prefix *</Form.Label>
                      <Form.Select
                        name="recipient.prefix"
                        value={formData.recipient.prefix}
                        onChange={handleInputChange}
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
                    <Form.Group className="mb-3">
                      <Form.Label>First Name *</Form.Label>
                      <Form.Control
                        type="text"
                        name="recipient.firstName"
                        value={formData.recipient.firstName}
                        onChange={handleInputChange}
                        placeholder="First name"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>Middle Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="recipient.middleName"
                        value={formData.recipient.middleName}
                        onChange={handleInputChange}
                        placeholder="Middle name (optional)"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>Last Name *</Form.Label>
                      <Form.Control
                        type="text"
                        name="recipient.lastName"
                        value={formData.recipient.lastName}
                        onChange={handleInputChange}
                        placeholder="Last name"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Designation</Form.Label>
                      <Form.Control
                        type="text"
                        name="recipient.designation"
                        value={formData.recipient.designation}
                        onChange={handleInputChange}
                        placeholder="Recipient's designation"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Company</Form.Label>
                      <Form.Control
                        type="text"
                        name="recipient.company"
                        value={formData.recipient.company}
                        onChange={handleInputChange}
                        placeholder="Company name"
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </ThemeCard>

            {/* Content */}
            <ThemeCard className="mb-4">
              <Card.Header>
                <h5 className="mb-0">
                  <i className="bi bi-file-text me-2"></i>Content
                </h5>
              </Card.Header>
              <Card.Body>
                <Form.Group className="mb-3">
                  <Form.Label>Header (Optional)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="header"
                    value={formData.header}
                    onChange={handleInputChange}
                    placeholder="Header content..."
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Main Content *</Form.Label>
                  <div className="border rounded">
                    <div className="p-2 border-bottom bg-light">
                      <small className="text-muted">
                        Use the toolbar for basic formatting (Bold, Italic,
                        etc.)
                      </small>
                    </div>
                    <div className="p-2">
                      <div className="btn-group btn-group-sm mb-2">
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={() => {
                            document.execCommand("bold", false, null);
                          }}
                        >
                          <i className="bi bi-type-bold"></i>
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={() => {
                            document.execCommand("italic", false, null);
                          }}
                        >
                          <i className="bi bi-type-italic"></i>
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={() => {
                            document.execCommand("underline", false, null);
                          }}
                        >
                          <i className="bi bi-type-underline"></i>
                        </button>
                      </div>
                      <div
                        contentEditable
                        style={{
                          minHeight: "200px",
                          border: "1px solid #dee2e6",
                          borderRadius: "0.375rem",
                          padding: "0.5rem",
                          fontFamily: "Times New Roman, serif",
                          fontSize: "12px",
                          lineHeight: "1.5",
                        }}
                        onInput={(e) => handleContentChange(e.target.innerHTML)}
                        dangerouslySetInnerHTML={{ __html: formData.content }}
                      />
                    </div>
                  </div>
                  <Form.Text className="text-muted">
                    Write the main content of your letterhead. Use basic
                    formatting as needed.
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Footer (Optional)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="footer"
                    value={formData.footer}
                    onChange={handleInputChange}
                    placeholder="Footer content..."
                  />
                </Form.Group>
              </Card.Body>
            </ThemeCard>

            {/* Host Information */}
            <ThemeCard className="mb-4">
              <Card.Header>
                <h5 className="mb-0">
                  <i className="bi bi-person-badge me-2"></i>Host Information
                  (Signature)
                </h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Host Name *</Form.Label>
                      <Form.Control
                        type="text"
                        name="host.name"
                        value={formData.host.name}
                        onChange={handleInputChange}
                        placeholder="Name of the signatory"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Host Designation *</Form.Label>
                      <Form.Control
                        type="text"
                        name="host.designation"
                        value={formData.host.designation}
                        onChange={handleInputChange}
                        placeholder="Designation of the signatory"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Notes (Internal)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Internal notes (not visible in the letterhead)"
                  />
                </Form.Group>
              </Card.Body>
            </ThemeCard>
          </Col>

          <Col lg={4}>
            {/* Preview Panel */}
            <ThemeCard className="position-sticky" style={{ top: "2rem" }}>
              <Card.Header>
                <h5 className="mb-0">
                  <i className="bi bi-eye me-2"></i>Quick Preview
                </h5>
              </Card.Header>
              <Card.Body
                style={{
                  fontSize: "12px",
                  fontFamily: "Times New Roman, serif",
                }}
              >
                <div className="text-center mb-3">
                  <h6 style={{ fontSize: "16px", fontWeight: "bold" }}>
                    HARE KRISHNA MEDICAL
                  </h6>
                  {formData.title && (
                    <div
                      style={{
                        fontSize: "14px",
                        fontWeight: "bold",
                        marginTop: "1rem",
                      }}
                    >
                      {formData.title}
                    </div>
                  )}
                </div>

                <div className="d-flex justify-content-between mb-3">
                  <small>Ref: [Auto-generated]</small>
                  <small>Date: {new Date().toLocaleDateString("en-GB")}</small>
                </div>

                {formData.recipient.firstName && (
                  <div className="mb-3">
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
                  <div className="mb-3">
                    <strong>Subject: </strong>
                    {formData.subject}
                  </div>
                )}

                <div
                  className="mb-3"
                  style={{
                    minHeight: "100px",
                    border: "1px dashed #ccc",
                    padding: "0.5rem",
                  }}
                >
                  <div
                    dangerouslySetInnerHTML={{
                      __html: getPreviewText().content,
                    }}
                  />
                </div>

                <div className="mb-3">
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

                <div className="text-center">
                  <small className="text-muted">Place for Official Stamp</small>
                </div>
              </Card.Body>
            </ThemeCard>
          </Col>
        </Row>

        {/* Action Buttons */}
        <Row className="mt-4">
          <Col>
            <div className="d-flex gap-2">
              <ThemeButton type="submit" disabled={loading} variant="primary">
                {loading ? (
                  <Spinner animation="border" size="sm" className="me-1" />
                ) : (
                  <i className="bi bi-check-circle me-1"></i>
                )}
                {isEditing ? "Update Letterhead" : "Create Letterhead"}
              </ThemeButton>

              <ThemeButton
                type="button"
                variant="outline-secondary"
                onClick={() => navigate("/admin/letterheads")}
              >
                <i className="bi bi-arrow-left me-1"></i>
                Back to List
              </ThemeButton>

              <ThemeButton
                type="button"
                variant="outline-info"
                onClick={() => setShowPreview(true)}
              >
                <i className="bi bi-eye me-1"></i>
                Full Preview
              </ThemeButton>
            </div>
          </Col>
        </Row>
      </Form>

      {/* Full Preview Modal */}
      <Modal show={showPreview} onHide={() => setShowPreview(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Letterhead Preview</Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{ fontFamily: "Times New Roman, serif", fontSize: "12px" }}
        >
          <div
            className="letterhead-preview p-4"
            style={{ backgroundColor: "white" }}
          >
            <div className="text-center mb-4">
              <h4 style={{ fontSize: "16px", fontWeight: "bold" }}>
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
              style={{ textAlign: "justify", lineHeight: "1.5" }}
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
                  border: "1px dashed #ccc",
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
          <Button variant="secondary" onClick={() => setShowPreview(false)}>
            Close Preview
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AddLetterhead;
