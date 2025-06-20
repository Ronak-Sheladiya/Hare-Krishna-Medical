import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Breadcrumb,
  Button,
  Form,
  Alert,
  Spinner,
} from "react-bootstrap";
import { useDispatch } from "react-redux";
import { addMessage } from "../store/slices/messageSlice";

const ContactForm = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    subject: "",
    message: "",
    priority: "Medium",
  });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: "", variant: "" });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const showAlert = (message, variant) => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert({ show: false, message: "", variant: "" }), 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (
        !formData.name.trim() ||
        !formData.email.trim() ||
        !formData.message.trim()
      ) {
        throw new Error("Please fill in all required fields");
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        throw new Error("Please enter a valid email address");
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Create message object
      const newMessage = {
        id: Date.now(),
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile,
        subject: formData.subject || "General Inquiry",
        message: formData.message,
        priority: formData.priority,
        status: "Open",
        isRead: false,
        createdAt: new Date(),
        reply: "",
        repliedAt: null,
      };

      // Add to Redux store (simulating backend)
      dispatch(addMessage(newMessage));

      // Reset form
      setFormData({
        name: "",
        email: "",
        mobile: "",
        subject: "",
        message: "",
        priority: "Medium",
      });

      showAlert(
        "Message sent successfully! We'll get back to you soon.",
        "success",
      );
    } catch (error) {
      showAlert(error.message, "danger");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="medical-form shadow-lg">
      <Card.Body className="p-5">
        <div className="text-center mb-4">
          <h3 className="text-medical-red mb-2">
            <i className="bi bi-envelope-heart me-2"></i>
            Send Us a Message
          </h3>
          <p className="text-muted">
            We're here to help! Send us your questions, concerns, or feedback
            and we'll respond promptly.
          </p>
        </div>

        {alert.show && (
          <Alert variant={alert.variant} className="mb-4">
            <i
              className={`bi bi-${alert.variant === "success" ? "check-circle" : "exclamation-triangle"} me-2`}
            ></i>
            {alert.message}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">
                  Full Name <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  required
                  disabled={loading}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">
                  Email Address <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email address"
                  required
                  disabled={loading}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Phone Number</Form.Label>
                <Form.Control
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                  disabled={loading}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Priority</Form.Label>
                <Form.Select
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  disabled={loading}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col lg={12}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Subject</Form.Label>
                <Form.Control
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="Brief subject of your message"
                  disabled={loading}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col lg={12}>
              <Form.Group className="mb-4">
                <Form.Label className="fw-bold">
                  Message <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={6}
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Write your message here... Please provide as much detail as possible so we can assist you better."
                  required
                  disabled={loading}
                />
                <Form.Text className="text-muted">
                  <i className="bi bi-info-circle me-1"></i>
                  Your message will be sent to our admin team and you'll receive
                  a response via email.
                </Form.Text>
              </Form.Group>
            </Col>
          </Row>

          <div className="text-center">
            <Button
              type="submit"
              className="btn-medical-primary px-5 py-2"
              disabled={loading}
              size="lg"
            >
              {loading ? (
                <>
                  <Spinner size="sm" className="me-2" />
                  Sending Message...
                </>
              ) : (
                <>
                  <i className="bi bi-send me-2"></i>
                  Send Message
                </>
              )}
            </Button>
          </div>

          <div className="text-center mt-3">
            <small className="text-muted">
              <i className="bi bi-clock me-1"></i>
              We typically respond within 24 hours during business days
            </small>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

const Contact = () => {
  return (
    <div className="fade-in">
      {/* Breadcrumb */}
      <section className="medical-breadcrumb">
        <Container>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item active>Contact Us</Breadcrumb.Item>
          </Breadcrumb>
        </Container>
      </section>

      {/* Contact Content */}
      <section className="section-padding">
        <Container>
          <Row>
            <Col lg={12} className="text-center mb-5">
              <h1 className="section-title">Contact Us</h1>
              <p className="section-subtitle">
                Get in touch with us for any medical needs or inquiries
              </p>
            </Col>
          </Row>

          <Row>
            {/* Address Card */}
            <Col lg={4} md={6} className="mb-4">
              <Card className="contact-card h-100">
                <Card.Body className="text-center">
                  <div className="contact-icon">
                    <i className="bi bi-geo-alt-fill"></i>
                  </div>
                  <h5>Our Location</h5>
                  <p className="text-muted">
                    3 Sahyog Complex, Man Sarovar circle,
                    <br />
                    Amroli, 394107
                  </p>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    href="https://maps.google.com?q=3+Sahyog+Complex+Man+Sarovar+circle+Amroli+394107"
                    target="_blank"
                    className="btn-medical-outline"
                  >
                    View on Map
                  </Button>
                </Card.Body>
              </Card>
            </Col>

            {/* Phone Card */}
            <Col lg={4} md={6} className="mb-4">
              <Card className="contact-card h-100">
                <Card.Body className="text-center">
                  <div className="contact-icon">
                    <i className="bi bi-telephone-fill"></i>
                  </div>
                  <h5>Phone Numbers</h5>
                  <p className="text-muted mb-2">
                    <a
                      href="tel:+917698913354"
                      className="text-decoration-none"
                    >
                      +91 76989 13354
                    </a>
                  </p>
                  <p className="text-muted">
                    <a
                      href="tel:+919106018508"
                      className="text-decoration-none"
                    >
                      +91 91060 18508
                    </a>
                  </p>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    href="tel:+917698913354"
                    className="btn-medical-outline"
                  >
                    Call Now
                  </Button>
                </Card.Body>
              </Card>
            </Col>

            {/* Email Card */}
            <Col lg={4} md={6} className="mb-4">
              <Card className="contact-card h-100">
                <Card.Body className="text-center">
                  <div className="contact-icon">
                    <i className="bi bi-envelope-fill"></i>
                  </div>
                  <h5>Email Address</h5>
                  <p className="text-muted">
                    <a
                      href="mailto:harekrishnamedical@gmail.com"
                      className="text-decoration-none"
                    >
                      harekrishnamedical@gmail.com
                    </a>
                  </p>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    href="mailto:harekrishnamedical@gmail.com"
                    className="btn-medical-outline"
                  >
                    Send Email
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Social Media & Hours */}
          <Row className="mt-5">
            <Col lg={6} className="mb-4">
              <Card className="medical-card h-100">
                <Card.Body>
                  <h5 className="mb-3">
                    <i className="bi bi-clock-fill text-medical-red me-2"></i>
                    Business Hours
                  </h5>
                  <div className="row">
                    <div className="col-6">
                      <p className="mb-1">
                        <strong>Monday - Saturday:</strong>
                      </p>
                      <p className="text-muted">9:00 AM - 9:00 PM</p>
                    </div>
                    <div className="col-6">
                      <p className="mb-1">
                        <strong>Sunday:</strong>
                      </p>
                      <p className="text-muted">10:00 AM - 6:00 PM</p>
                    </div>
                  </div>
                  <p className="text-muted small">
                    <i className="bi bi-info-circle me-1"></i>
                    Emergency services available 24/7
                  </p>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={6} className="mb-4">
              <Card className="medical-card h-100">
                <Card.Body>
                  <h5 className="mb-3">
                    <i className="bi bi-share-fill text-medical-red me-2"></i>
                    Follow Us
                  </h5>
                  <p className="text-muted mb-3">
                    Stay connected with us on social media for health tips and
                    updates.
                  </p>
                  <div className="social-icons justify-content-start">
                    <a
                      href="https://www.instagram.com/harekrishna_medical/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-icon instagram"
                    >
                      <i className="bi bi-instagram"></i>
                    </a>
                    <a href="#" className="social-icon facebook">
                      <i className="bi bi-facebook"></i>
                    </a>
                    <a
                      href="mailto:harekrishnamedical@gmail.com"
                      className="social-icon email"
                    >
                      <i className="bi bi-envelope"></i>
                    </a>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Enhanced Contact Form Section */}
          <Row className="mt-5">
            <Col lg={8} className="mx-auto">
              <ContactForm />
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default Contact;
