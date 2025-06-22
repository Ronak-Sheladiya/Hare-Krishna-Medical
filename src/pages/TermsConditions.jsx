import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const TermsConditions = () => {
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
                Terms & Conditions
              </h1>
              <p
                style={{
                  fontSize: "1.2rem",
                  opacity: "0.9",
                  maxWidth: "600px",
                  margin: "0 auto 20px",
                }}
              >
                Please read these terms and conditions carefully before using
                our services.
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

      {/* Terms Sections Cards */}
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
                  const iconDiv = e.currentTarget.querySelector(".terms-icon");
                  if (iconDiv) {
                    iconDiv.style.background =
                      "linear-gradient(135deg, #343a40, #495057)";
                  }
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = "#f8f9fa";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                  const iconDiv = e.currentTarget.querySelector(".terms-icon");
                  if (iconDiv) {
                    iconDiv.style.background =
                      "linear-gradient(135deg, #e63946, #dc3545)";
                  }
                }}
              >
                <div
                  className="terms-icon"
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
                  <i className="bi bi-file-earmark-text-fill"></i>
                </div>
                <h5 style={{ color: "#333333", marginBottom: "16px" }}>
                  Service Agreement
                </h5>
                <p style={{ color: "#495057", marginBottom: "0" }}>
                  By using our services, you agree to abide by these terms and
                  conditions. Our agreement ensures fair and transparent
                  business practices.
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
                  const iconDiv = e.currentTarget.querySelector(".terms-icon");
                  if (iconDiv) {
                    iconDiv.style.background =
                      "linear-gradient(135deg, #343a40, #495057)";
                  }
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = "#f8f9fa";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                  const iconDiv = e.currentTarget.querySelector(".terms-icon");
                  if (iconDiv) {
                    iconDiv.style.background =
                      "linear-gradient(135deg, #e63946, #dc3545)";
                  }
                }}
              >
                <div
                  className="terms-icon"
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
                  <i className="bi bi-person-check-fill"></i>
                </div>
                <h5 style={{ color: "#333333", marginBottom: "16px" }}>
                  User Responsibilities
                </h5>
                <p style={{ color: "#495057", marginBottom: "0" }}>
                  Users are responsible for providing accurate information,
                  maintaining account security, and using our services in
                  accordance with applicable laws.
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
                  const iconDiv = e.currentTarget.querySelector(".terms-icon");
                  if (iconDiv) {
                    iconDiv.style.background =
                      "linear-gradient(135deg, #343a40, #495057)";
                  }
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = "#f8f9fa";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                  const iconDiv = e.currentTarget.querySelector(".terms-icon");
                  if (iconDiv) {
                    iconDiv.style.background =
                      "linear-gradient(135deg, #e63946, #dc3545)";
                  }
                }}
              >
                <div
                  className="terms-icon"
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
                  <i className="bi bi-hand-thumbs-up-fill"></i>
                </div>
                <h5 style={{ color: "#333333", marginBottom: "16px" }}>
                  Fair Usage
                </h5>
                <p style={{ color: "#495057", marginBottom: "0" }}>
                  We promote fair usage of our platform. Our terms protect both
                  customers and the business while ensuring a positive
                  experience for all.
                </p>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Terms & Conditions Content */}
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
                    Terms & Conditions Details
                  </h3>
                  <p style={{ opacity: "0.9", marginBottom: "0" }}>
                    Clear guidelines for using our medical services and platform
                  </p>
                </div>

                <Card.Body style={{ padding: "40px" }}>
                  <div className="terms-content">
                    <div className="mb-4">
                      <h5
                        style={{
                          color: "#e63946",
                          marginBottom: "16px",
                          fontWeight: "700",
                        }}
                      >
                        1. Acceptance of Terms
                      </h5>
                      <p style={{ color: "#495057", lineHeight: "1.8" }}>
                        By accessing and using Hare Krishna Medical's services,
                        you accept and agree to be bound by the terms and
                        provision of this agreement. These terms apply to all
                        users of the service.
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
                        2. Medical Disclaimer
                      </h5>
                      <ul style={{ color: "#495057", lineHeight: "1.8" }}>
                        <li>
                          Our products are for informational purposes and should
                          not replace professional medical advice
                        </li>
                        <li>
                          Always consult with a healthcare professional before
                          starting any medication
                        </li>
                        <li>
                          We are not responsible for any adverse reactions or
                          misuse of products
                        </li>
                        <li>
                          Prescription medications require valid prescriptions
                        </li>
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
                        3. Order and Payment Terms
                      </h5>
                      <p style={{ color: "#495057", lineHeight: "1.8" }}>
                        All orders are subject to availability and confirmation.
                        Prices are inclusive of all taxes unless otherwise
                        stated. We reserve the right to refuse or cancel any
                        order at our discretion.
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
                        4. Return and Refund Policy
                      </h5>
                      <p style={{ color: "#495057", lineHeight: "1.8" }}>
                        Due to the nature of medical products, returns are only
                        accepted for damaged or defective items. Refunds will be
                        processed within 7-10 business days of approval.
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
                        5. Limitation of Liability
                      </h5>
                      <p style={{ color: "#495057", lineHeight: "1.8" }}>
                        Hare Krishna Medical shall not be liable for any
                        indirect, incidental, special, consequential, or
                        punitive damages arising from your use of our services
                        or products.
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
                        6. Governing Law
                      </h5>
                      <p style={{ color: "#495057", lineHeight: "1.8" }}>
                        These terms and conditions are governed by and construed
                        in accordance with the laws of India, and any disputes
                        shall be subject to the jurisdiction of Gujarat courts.
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
                        <i className="bi bi-chat-dots me-2"></i>
                        Have Questions? Contact Us
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
                    <i className="bi bi-info-circle me-2"></i>
                    Important Notes
                  </h5>
                  <div style={{ color: "#495057", marginBottom: "20px" }}>
                    <div style={{ marginBottom: "12px", fontWeight: "600" }}>
                      📋 Read Before Purchase
                    </div>
                    <div style={{ marginBottom: "12px", fontWeight: "600" }}>
                      💊 Medical Product Guidelines
                    </div>
                    <div style={{ marginBottom: "12px", fontWeight: "600" }}>
                      🏥 Professional Medical Advice
                    </div>
                    <div style={{ marginBottom: "12px", fontWeight: "600" }}>
                      ⚖️ Legal Compliance
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
                    <strong>Questions about Terms?</strong>
                    <br />
                    Contact our support team for clarification on any terms or
                    conditions.
                    <br />
                    <strong>harekrishnamedical@gmail.com</strong>
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
                      to="/privacy-policy"
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
                      Privacy Policy
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

export default TermsConditions;
