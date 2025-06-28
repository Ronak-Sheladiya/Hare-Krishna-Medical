import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const PrivacyPolicy = () => {
  return (
    <div className="fade-in">
      {/* Hero Section - Matching Contact Us */}
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
                Privacy Policy
              </h1>
              <p
                style={{
                  fontSize: "1.2rem",
                  opacity: "0.9",
                  maxWidth: "600px",
                  margin: "0 auto 20px",
                }}
              >
                Your privacy is important to us. This policy explains how we
                collect, use, and protect your information.
              </p>
              <p
                style={{
                  fontSize: "1rem",
                  opacity: "0.8",
                  fontWeight: "500",
                }}
              >
                Last updated: {new Date().toLocaleDateString("en-GB")}
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Privacy Sections Cards */}
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
                  const iconDiv =
                    e.currentTarget.querySelector(".privacy-icon");
                  if (iconDiv) {
                    iconDiv.style.background =
                      "linear-gradient(135deg, #343a40, #495057)";
                  }
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = "#f8f9fa";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                  const iconDiv =
                    e.currentTarget.querySelector(".privacy-icon");
                  if (iconDiv) {
                    iconDiv.style.background =
                      "linear-gradient(135deg, #e63946, #dc3545)";
                  }
                }}
              >
                <div
                  className="privacy-icon"
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
                  <i className="bi bi-shield-lock-fill"></i>
                </div>
                <h5 style={{ color: "#333333", marginBottom: "16px" }}>
                  Data Protection
                </h5>
                <p style={{ color: "#495057", marginBottom: "0" }}>
                  We implement industry-standard security measures to protect
                  your personal information from unauthorized access,
                  disclosure, or misuse.
                </p>
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
                  const iconDiv =
                    e.currentTarget.querySelector(".privacy-icon");
                  if (iconDiv) {
                    iconDiv.style.background =
                      "linear-gradient(135deg, #343a40, #495057)";
                  }
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = "#f8f9fa";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                  const iconDiv =
                    e.currentTarget.querySelector(".privacy-icon");
                  if (iconDiv) {
                    iconDiv.style.background =
                      "linear-gradient(135deg, #e63946, #dc3545)";
                  }
                }}
              >
                <div
                  className="privacy-icon"
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
                  <i className="bi bi-eye-slash-fill"></i>
                </div>
                <h5 style={{ color: "#333333", marginBottom: "16px" }}>
                  Privacy Control
                </h5>
                <p style={{ color: "#495057", marginBottom: "0" }}>
                  You have full control over your personal data. You can request
                  access, modification, or deletion of your information at any
                  time.
                </p>
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
                  const iconDiv =
                    e.currentTarget.querySelector(".privacy-icon");
                  if (iconDiv) {
                    iconDiv.style.background =
                      "linear-gradient(135deg, #343a40, #495057)";
                  }
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = "#f8f9fa";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                  const iconDiv =
                    e.currentTarget.querySelector(".privacy-icon");
                  if (iconDiv) {
                    iconDiv.style.background =
                      "linear-gradient(135deg, #e63946, #dc3545)";
                  }
                }}
              >
                <div
                  className="privacy-icon"
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
                  <i className="bi bi-check-circle-fill"></i>
                </div>
                <h5 style={{ color: "#333333", marginBottom: "16px" }}>
                  Transparency
                </h5>
                <p style={{ color: "#495057", marginBottom: "0" }}>
                  We are transparent about what data we collect, how we use it,
                  and with whom we share it. No hidden practices or unclear
                  terms.
                </p>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Privacy Policy Content */}
      <section
        style={{
          background: "#f8f9fa",
          paddingTop: "80px",
          paddingBottom: "80px",
        }}
      >
        <Container>
          <Row>
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
                    Privacy Policy Details
                  </h3>
                  <p style={{ opacity: "0.9", marginBottom: "0" }}>
                    Comprehensive privacy protection for your peace of mind
                  </p>
                </div>

                <Card.Body style={{ padding: "40px" }}>
                  <div className="privacy-content">
                    <div className="mb-4">
                      <h5
                        style={{
                          color: "#e63946",
                          marginBottom: "16px",
                          fontWeight: "700",
                        }}
                      >
                        1. Information We Collect
                      </h5>
                      <p style={{ color: "#495057", lineHeight: "1.8" }}>
                        We collect information you provide directly to us, such
                        as when you create an account, make a purchase, or
                        contact us. This includes your name, email address,
                        phone number, shipping address, and payment information.
                      </p>
                    </div>

                    <div className="mb-4">
                      <h5
                        style={{
                          color: "#e63946",
                          marginBottom: "16px",
                          fontWeight: "700",
                        }}
                      >
                        2. How We Use Your Information
                      </h5>
                      <ul style={{ color: "#495057", lineHeight: "1.8" }}>
                        <li>Process and fulfill your orders</li>
                        <li>Send order confirmations and shipping updates</li>
                        <li>Provide customer support</li>
                        <li>Improve our services and user experience</li>
                        <li>Send promotional emails (with your consent)</li>
                      </ul>
                    </div>

                    <div className="mb-4">
                      <h5
                        style={{
                          color: "#e63946",
                          marginBottom: "16px",
                          fontWeight: "700",
                        }}
                      >
                        3. Information Sharing
                      </h5>
                      <p style={{ color: "#495057", lineHeight: "1.8" }}>
                        We do not sell, trade, or rent your personal information
                        to third parties. We may share your information only in
                        specific circumstances such as with trusted service
                        providers who help us operate our business.
                      </p>
                    </div>

                    <div className="mb-4">
                      <h5
                        style={{
                          color: "#e63946",
                          marginBottom: "16px",
                          fontWeight: "700",
                        }}
                      >
                        4. Data Security
                      </h5>
                      <p style={{ color: "#495057", lineHeight: "1.8" }}>
                        We implement appropriate technical and organizational
                        security measures to protect your personal information
                        against unauthorized access, alteration, disclosure, or
                        destruction.
                      </p>
                    </div>

                    <div className="mb-4">
                      <h5
                        style={{
                          color: "#e63946",
                          marginBottom: "16px",
                          fontWeight: "700",
                        }}
                      >
                        5. Your Rights
                      </h5>
                      <p style={{ color: "#495057", lineHeight: "1.8" }}>
                        You have the right to access, update, or delete your
                        personal information. You may also opt out of receiving
                        promotional communications from us at any time.
                      </p>
                    </div>

                    <div className="mt-4">
                      <Button
                        as={Link}
                        to="/contact"
                        size="lg"
                        style={{
                          background: "#e63946",
                          border: "none",
                          borderRadius: "8px",
                          padding: "14px 28px",
                          fontSize: "16px",
                          fontWeight: "600",
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
                        Contact Us for Privacy Questions
                      </Button>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={4}>
              <Card
                style={{
                  border: "none",
                  borderRadius: "16px",
                  marginBottom: "24px",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                }}
              >
                <Card.Body style={{ padding: "30px", textAlign: "center" }}>
                  <h5
                    style={{
                      color: "#e63946",
                      marginBottom: "20px",
                      fontSize: "1.3rem",
                      fontWeight: "700",
                    }}
                  >
                    <i className="bi bi-shield-check me-2"></i>
                    Privacy Commitment
                  </h5>
                  <div style={{ color: "#495057", marginBottom: "20px" }}>
                    <div style={{ marginBottom: "12px", fontWeight: "600" }}>
                      🔒 256-bit SSL Encryption
                    </div>
                    <div style={{ marginBottom: "12px", fontWeight: "600" }}>
                      🛡️ GDPR Compliant
                    </div>
                    <div style={{ marginBottom: "12px", fontWeight: "600" }}>
                      🔐 Secure Data Storage
                    </div>
                    <div style={{ marginBottom: "12px", fontWeight: "600" }}>
                      ✅ Regular Security Audits
                    </div>
                  </div>
                  <div
                    style={{
                      padding: "16px",
                      background: "linear-gradient(135deg, #f8f9fa, #e9ecef)",
                      borderRadius: "12px",
                      fontSize: "14px",
                      lineHeight: "1.6",
                    }}
                  >
                    <strong>Need Help?</strong>
                    <br />
                    If you have questions about this Privacy Policy, please
                    contact us at:
                    <br />
                    <strong>hkmedicalamroli@gmail.com</strong>
                  </div>
                </Card.Body>
              </Card>

              <Card
                style={{
                  border: "none",
                  borderRadius: "16px",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
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
                    <i className="bi bi-file-earmark-text me-2"></i>
                    Related Documents
                  </h5>
                  <div className="d-grid gap-2">
                    <Button
                      as={Link}
                      to="/terms-conditions"
                      variant="outline-primary"
                      style={{
                        borderColor: "#e63946",
                        color: "#e63946",
                        borderRadius: "8px",
                        padding: "12px",
                        fontWeight: "600",
                        transition: "all 0.3s ease",
                      }}
                      onMouseOver={(e) => {
                        e.target.style.background = "#e63946";
                        e.target.style.color = "white";
                      }}
                      onMouseOut={(e) => {
                        e.target.style.background = "transparent";
                        e.target.style.color = "#e63946";
                      }}
                    >
                      Terms & Conditions
                    </Button>
                    <Button
                      as={Link}
                      to="/user-guide"
                      variant="outline-primary"
                      style={{
                        borderColor: "#e63946",
                        color: "#e63946",
                        borderRadius: "8px",
                        padding: "12px",
                        fontWeight: "600",
                        transition: "all 0.3s ease",
                      }}
                      onMouseOver={(e) => {
                        e.target.style.background = "#e63946";
                        e.target.style.color = "white";
                      }}
                      onMouseOut={(e) => {
                        e.target.style.background = "transparent";
                        e.target.style.color = "#e63946";
                      }}
                    >
                      User Guide
                    </Button>
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

export default PrivacyPolicy;
