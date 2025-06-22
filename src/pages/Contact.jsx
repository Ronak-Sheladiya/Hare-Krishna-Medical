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
import { getCurrentISOString } from "../utils/dateUtils";

const Contact = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    subject: "",
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

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Create message object for admin
      const newMessage = {
        id: Date.now(),
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile,
        subject: formData.subject || "Contact Form Inquiry",
        message: formData.message,
        priority: "Medium",
        status: "Open",
        isRead: false,
        createdAt: getCurrentISOString(),
        reply: "",
        repliedAt: null,
      };

      // Add to Redux store
      dispatch(addMessage(newMessage));

      // Reset form and show success
      setFormData({
        name: "",
        email: "",
        mobile: "",
        subject: "",
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
    <div className="fade-in">
      {/* Hero Section */}
      <section
        style={{
          background: "linear-gradient(135deg, #e63946 0%, #dc3545 100%)",
          paddingTop: "80px",
          paddingBottom: "80px",
          color: "white",
        }}
      >
        <Container>
          <Row className="text-center">
            <Col lg={12}>
              <h1
                style={{
                  fontSize: "3rem",
                  fontWeight: "800",
                  marginBottom: "20px",
                  textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
                }}
              >
                Get in Touch
              </h1>
              <p
                style={{
                  fontSize: "1.2rem",
                  opacity: "0.9",
                  maxWidth: "600px",
                  margin: "0 auto",
                }}
              >
                We're here to help with all your medical needs. Reach out to us
                anytime!
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Contact Cards */}
      <section
        style={{
          background: "#ffffff",
          paddingTop: "80px",
          paddingBottom: "40px",
        }}
      >
        <Container>
          <Row>
            <Col lg={4} md={6} className="mb-4">
              <Card
                style={{
                  border: "2px solid #f8f9fa",
                  borderRadius: "16px",
                  padding: "30px",
                  textAlign: "center",
                  height: "100%",
                  transition: "all 0.3s ease",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = "#343a40";
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 25px rgba(52, 58, 64, 0.2)";
                  // Change icon background color on hover
                  const iconDiv =
                    e.currentTarget.querySelector(".contact-icon");
                  if (iconDiv) {
                    iconDiv.style.background =
                      "linear-gradient(135deg, #343a40, #495057)";
                  }
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = "#f8f9fa";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                  // Restore icon background color
                  const iconDiv =
                    e.currentTarget.querySelector(".contact-icon");
                  if (iconDiv) {
                    iconDiv.style.background =
                      "linear-gradient(135deg, #e63946, #dc3545)";
                  }
                }}
              >
                <div
                  className="contact-icon"
                  style={{
                    width: "80px",
                    height: "80px",
                    background: "linear-gradient(135deg, #e63946, #dc3545)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 24px",
                    color: "white",
                    fontSize: "32px",
                    transition: "all 0.3s ease",
                  }}
                >
                  <i className="bi bi-geo-alt-fill"></i>
                </div>
                <h5 style={{ color: "#333333", marginBottom: "16px" }}>
                  Our Location
                </h5>
                <p style={{ color: "#495057", marginBottom: "20px" }}>
                  3 Sahyog Complex, Man Sarovar Circle
                  <br />
                  Amroli, 394107, Gujarat, India
                </p>
                <Button
                  href="https://maps.google.com?q=3+Sahyog+Complex+Man+Sarovar+circle+Amroli+394107"
                  target="_blank"
                  style={{
                    background: "#e63946",
                    border: "none",
                    borderRadius: "8px",
                    padding: "10px 20px",
                    transition: "all 0.3s ease",
                  }}
                  onMouseOver={(e) => {
                    e.target.style.background = "#343a40";
                    e.target.style.color = "white";
                    const icon = e.target.querySelector("i");
                    if (icon) icon.style.color = "white";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = "#e63946";
                    e.target.style.color = "white";
                    const icon = e.target.querySelector("i");
                    if (icon) icon.style.color = "white";
                  }}
                >
                  <i className="bi bi-map me-2"></i>
                  View on Map
                </Button>
              </Card>
            </Col>

            <Col lg={4} md={6} className="mb-4">
              <Card
                style={{
                  border: "2px solid #f8f9fa",
                  borderRadius: "16px",
                  padding: "30px",
                  textAlign: "center",
                  height: "100%",
                  transition: "all 0.3s ease",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = "#343a40";
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 25px rgba(52, 58, 64, 0.2)";
                  // Change icon background color on hover
                  const iconDiv =
                    e.currentTarget.querySelector(".contact-icon");
                  if (iconDiv) {
                    iconDiv.style.background =
                      "linear-gradient(135deg, #343a40, #495057)";
                  }
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = "#f8f9fa";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                  // Restore icon background color
                  const iconDiv =
                    e.currentTarget.querySelector(".contact-icon");
                  if (iconDiv) {
                    iconDiv.style.background =
                      "linear-gradient(135deg, #e63946, #dc3545)";
                  }
                }}
              >
                <div
                  className="contact-icon"
                  style={{
                    width: "80px",
                    height: "80px",
                    background: "linear-gradient(135deg, #e63946, #dc3545)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 24px",
                    color: "white",
                    fontSize: "32px",
                    transition: "all 0.3s ease",
                  }}
                >
                  <i className="bi bi-telephone-fill"></i>
                </div>
                <h5 style={{ color: "#333333", marginBottom: "16px" }}>
                  Phone Numbers
                </h5>
                <p style={{ color: "#495057", marginBottom: "8px" }}>
                  <a
                    href="tel:+917698913354"
                    style={{ textDecoration: "none", color: "#495057" }}
                  >
                    +91 76989 13354
                  </a>
                </p>
                <p style={{ color: "#495057", marginBottom: "20px" }}>
                  <a
                    href="tel:+919106018508"
                    style={{ textDecoration: "none", color: "#495057" }}
                  >
                    +91 91060 18508
                  </a>
                </p>
                <Button
                  href="tel:+917698913354"
                  style={{
                    background: "#e63946",
                    border: "none",
                    borderRadius: "8px",
                    padding: "10px 20px",
                    transition: "all 0.3s ease",
                  }}
                  onMouseOver={(e) => {
                    e.target.style.background = "#343a40";
                    e.target.style.color = "white";
                    const icon = e.target.querySelector("i");
                    if (icon) icon.style.color = "white";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = "#e63946";
                    e.target.style.color = "white";
                    const icon = e.target.querySelector("i");
                    if (icon) icon.style.color = "white";
                  }}
                >
                  <i className="bi bi-telephone me-2"></i>
                  Call Now
                </Button>
              </Card>
            </Col>

            <Col lg={4} md={6} className="mb-4">
              <Card
                style={{
                  border: "2px solid #f8f9fa",
                  borderRadius: "16px",
                  padding: "30px",
                  textAlign: "center",
                  height: "100%",
                  transition: "all 0.3s ease",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = "#343a40";
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 25px rgba(52, 58, 64, 0.2)";
                  // Change icon background color on hover
                  const iconDiv =
                    e.currentTarget.querySelector(".contact-icon");
                  if (iconDiv) {
                    iconDiv.style.background =
                      "linear-gradient(135deg, #343a40, #495057)";
                  }
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = "#f8f9fa";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                  // Restore icon background color
                  const iconDiv =
                    e.currentTarget.querySelector(".contact-icon");
                  if (iconDiv) {
                    iconDiv.style.background =
                      "linear-gradient(135deg, #e63946, #dc3545)";
                  }
                }}
              >
                <div
                  className="contact-icon"
                  style={{
                    width: "80px",
                    height: "80px",
                    background: "linear-gradient(135deg, #e63946, #dc3545)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 24px",
                    color: "white",
                    fontSize: "32px",
                    transition: "all 0.3s ease",
                  }}
                >
                  <i className="bi bi-envelope-fill"></i>
                </div>
                <h5 style={{ color: "#333333", marginBottom: "16px" }}>
                  Email Address
                </h5>
                <p style={{ color: "#495057", marginBottom: "20px" }}>
                  <a
                    href="mailto:harekrishnamedical@gmail.com"
                    style={{ textDecoration: "none", color: "#495057" }}
                  >
                    harekrishnamedical@gmail.com
                  </a>
                </p>
                <Button
                  href="mailto:harekrishnamedical@gmail.com"
                  style={{
                    background: "#e63946",
                    border: "none",
                    borderRadius: "8px",
                    padding: "10px 20px",
                    transition: "all 0.3s ease",
                  }}
                  onMouseOver={(e) => {
                    e.target.style.background = "#343a40";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = "#e63946";
                  }}
                >
                  <i className="bi bi-envelope me-2"></i>
                  Send Email
                </Button>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Contact Form & Info Section */}
      <section
        style={{
          background: "#f8f9fa",
          paddingTop: "80px",
          paddingBottom: "80px",
        }}
      >
        <Container>
          <Row>
            {/* Contact Form */}
            <Col lg={8} className="mb-5">
              <Card
                style={{
                  border: "none",
                  borderRadius: "16px",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    background: "linear-gradient(135deg, #e63946, #dc3545)",
                    padding: "40px",
                    color: "white",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "2rem",
                      fontWeight: "700",
                      marginBottom: "12px",
                    }}
                  >
                    Send us a Message
                  </h3>
                  <p style={{ opacity: "0.9", marginBottom: "0" }}>
                    Fill out the form below and we'll get back to you as soon as
                    possible
                  </p>
                </div>

                <Card.Body style={{ padding: "40px" }}>
                  {submitted && (
                    <Alert
                      variant="success"
                      style={{
                        marginBottom: "30px",
                        borderRadius: "8px",
                        border: "none",
                      }}
                    >
                      <i className="bi bi-check-circle me-2"></i>
                      Thank you! Your message has been sent successfully. We'll
                      get back to you soon.
                    </Alert>
                  )}

                  <Form onSubmit={handleSubmit}>
                    <Row>
                      <Col md={6} className="mb-3">
                        <Form.Label style={{ fontWeight: "600" }}>
                          Full Name *
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Enter your full name"
                          required
                          disabled={loading}
                          style={{
                            borderRadius: "8px",
                            padding: "12px 16px",
                            border: "2px solid #e9ecef",
                          }}
                        />
                      </Col>
                      <Col md={6} className="mb-3">
                        <Form.Label style={{ fontWeight: "600" }}>
                          Email Address *
                        </Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Enter your email"
                          required
                          disabled={loading}
                          style={{
                            borderRadius: "8px",
                            padding: "12px 16px",
                            border: "2px solid #e9ecef",
                          }}
                        />
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6} className="mb-3">
                        <Form.Label style={{ fontWeight: "600" }}>
                          Mobile Number
                        </Form.Label>
                        <Form.Control
                          type="tel"
                          name="mobile"
                          value={formData.mobile}
                          onChange={handleInputChange}
                          placeholder="Enter your mobile number"
                          disabled={loading}
                          style={{
                            borderRadius: "8px",
                            padding: "12px 16px",
                            border: "2px solid #e9ecef",
                          }}
                        />
                      </Col>
                      <Col md={6} className="mb-3">
                        <Form.Label style={{ fontWeight: "600" }}>
                          Subject
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          placeholder="Subject of your message"
                          disabled={loading}
                          style={{
                            borderRadius: "8px",
                            padding: "12px 16px",
                            border: "2px solid #e9ecef",
                          }}
                        />
                      </Col>
                    </Row>

                    <Form.Group className="mb-4">
                      <Form.Label style={{ fontWeight: "600" }}>
                        Message *
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={5}
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="How can we help you?"
                        required
                        disabled={loading}
                        style={{
                          borderRadius: "8px",
                          padding: "12px 16px",
                          border: "2px solid #e9ecef",
                        }}
                      />
                    </Form.Group>

                    <Button
                      type="submit"
                      disabled={loading}
                      size="lg"
                      style={{
                        background: "#e63946",
                        border: "none",
                        borderRadius: "8px",
                        padding: "14px 40px",
                        fontSize: "16px",
                        fontWeight: "600",
                        width: "100%",
                        transition: "all 0.3s ease",
                      }}
                      onMouseOver={(e) => {
                        if (!loading) e.target.style.background = "#343a40";
                      }}
                      onMouseOut={(e) => {
                        if (!loading) e.target.style.background = "#e63946";
                      }}
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
                  </Form>
                </Card.Body>
              </Card>
            </Col>

            {/* Additional Info */}
            <Col lg={4}>
              <Card
                style={{
                  border: "none",
                  borderRadius: "16px",
                  marginBottom: "24px",
                  overflow: "hidden",
                }}
              >
                <Card.Body style={{ padding: "30px" }}>
                  <h5
                    style={{
                      color: "#e63946",
                      marginBottom: "20px",
                      fontSize: "1.3rem",
                      fontWeight: "700",
                    }}
                  >
                    <i className="bi bi-clock me-2"></i>
                    Business Hours
                  </h5>
                  <div style={{ color: "#495057" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "12px",
                      }}
                    >
                      <span style={{ fontWeight: "600" }}>
                        Monday - Saturday:
                      </span>
                      <span>9:00 AM - 9:00 PM</span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "16px",
                      }}
                    >
                      <span style={{ fontWeight: "600" }}>Sunday:</span>
                      <span>10:00 AM - 6:00 PM</span>
                    </div>
                    <div
                      style={{
                        padding: "12px",
                        background: "#f8f9fa",
                        borderRadius: "8px",
                        fontSize: "14px",
                      }}
                    >
                      <i className="bi bi-info-circle me-2 text-primary"></i>
                      Emergency services available 24/7
                    </div>
                  </div>
                </Card.Body>
              </Card>

              <Card
                style={{
                  border: "none",
                  borderRadius: "16px",
                  overflow: "hidden",
                }}
              >
                <Card.Body style={{ padding: "30px" }}>
                  <h5
                    style={{
                      color: "#e63946",
                      marginBottom: "20px",
                      fontSize: "1.3rem",
                      fontWeight: "700",
                    }}
                  >
                    <i className="bi bi-share me-2"></i>
                    Follow Us
                  </h5>
                  <p style={{ color: "#495057", marginBottom: "20px" }}>
                    Stay connected with us on social media for health tips and
                    updates.
                  </p>
                  <div className="d-flex gap-3">
                    <a
                      href="https://www.instagram.com/harekrishna_medical/"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        width: "50px",
                        height: "50px",
                        background: "linear-gradient(135deg, #e63946, #dc3545)",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        textDecoration: "none",
                        fontSize: "20px",
                        transition: "all 0.3s ease",
                      }}
                      onMouseOver={(e) => {
                        e.target.style.transform = "translateY(-2px)";
                      }}
                      onMouseOut={(e) => {
                        e.target.style.transform = "translateY(0)";
                      }}
                    >
                      <i className="bi bi-instagram"></i>
                    </a>
                    <a
                      href="mailto:harekrishnamedical@gmail.com"
                      style={{
                        width: "50px",
                        height: "50px",
                        background: "linear-gradient(135deg, #343a40, #495057)",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        textDecoration: "none",
                        fontSize: "20px",
                        transition: "all 0.3s ease",
                      }}
                      onMouseOver={(e) => {
                        e.target.style.transform = "translateY(-2px)";
                      }}
                      onMouseOut={(e) => {
                        e.target.style.transform = "translateY(0)";
                      }}
                    >
                      <i className="bi bi-envelope"></i>
                    </a>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default Contact;
