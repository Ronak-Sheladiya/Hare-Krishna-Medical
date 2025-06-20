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
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
        alert("Please fill in all required fields");
        setLoading(false);
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        alert("Please enter a valid email address");
        setLoading(false);
        return;
      }

      // Simulate API call to save to database
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Create message object for admin
      const newMessage = {
        id: Date.now(),
        name: formData.name,
        email: formData.email,
        mobile: "",
        subject: "Contact Form Inquiry",
        message: formData.message,
        priority: "Medium",
        status: "Open",
        isRead: false,
        createdAt: new Date(),
        reply: "",
        repliedAt: null,
      };

      // Add to Redux store (this simulates saving to database)
      dispatch(addMessage(newMessage));

      // Reset form and show success
      setFormData({
        name: "",
        email: "",
        message: "",
      });
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="contact-form-card">
      <Card.Body className="p-4">
        <div className="text-center mb-4">
          <h4 className="text-medical-red">
            <i className="bi bi-envelope me-2"></i>
            Contact Us
          </h4>
          <p className="text-muted">
            Send us a message and we'll respond quickly
          </p>
        </div>

        {submitted && (
          <Alert variant="success" className="mb-4">
            <i className="bi bi-check-circle me-2"></i>
            Thank you! Your message has been sent successfully. We'll get back
            to you soon.
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Name *</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Your full name"
              required
              disabled={loading}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email *</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Your email address"
              required
              disabled={loading}
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Message *</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder="How can we help you?"
              required
              disabled={loading}
            />
          </Form.Group>

          <div className="d-grid">
            <Button
              type="submit"
              className="btn-medical-primary"
              disabled={loading}
              size="lg"
            >
              {loading ? (
                <>
                  <Spinner size="sm" className="me-2" />
                  Sending...
                </>
              ) : (
                <>
                  <i className="bi bi-send me-2"></i>
                  Send Message
                </>
              )}
            </Button>
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
