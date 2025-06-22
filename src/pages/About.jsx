import React from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";

const About = () => {
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
                About Hare Krishna Medical
              </h1>
              <p
                style={{
                  fontSize: "1.2rem",
                  opacity: "0.9",
                  maxWidth: "600px",
                  margin: "0 auto",
                }}
              >
                Your trusted partner in health and wellness since years
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Mission & Values Cards */}
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
                  const iconDiv = e.currentTarget.querySelector(".about-icon");
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
                  const iconDiv = e.currentTarget.querySelector(".about-icon");
                  if (iconDiv) {
                    iconDiv.style.background =
                      "linear-gradient(135deg, #e63946, #dc3545)";
                  }
                }}
              >
                <div
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
                  }}
                >
                  <i className="bi bi-heart-pulse-fill"></i>
                </div>
                <h5 style={{ color: "#333333", marginBottom: "16px" }}>
                  Our Mission
                </h5>
                <p style={{ color: "#495057", marginBottom: "0" }}>
                  To provide quality healthcare products and services to our
                  community with compassion, integrity, and dedication to
                  improving lives.
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
                  e.currentTarget.style.borderColor = "#dc3545";
                  e.currentTarget.style.transform = "translateY(-8px)";
                  e.currentTarget.style.boxShadow =
                    "0 12px 30px rgba(220, 53, 69, 0.15)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = "#f8f9fa";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div
                  style={{
                    width: "80px",
                    height: "80px",
                    background: "linear-gradient(135deg, #dc3545, #e63946)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 24px",
                    color: "white",
                    fontSize: "32px",
                  }}
                >
                  <i className="bi bi-shield-check"></i>
                </div>
                <h5 style={{ color: "#333333", marginBottom: "16px" }}>
                  Our Vision
                </h5>
                <p style={{ color: "#495057", marginBottom: "0" }}>
                  To be the most trusted healthcare partner, making quality
                  medical care accessible to everyone through innovation and
                  excellence.
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
                  e.currentTarget.style.borderColor = "#e63946";
                  e.currentTarget.style.transform = "translateY(-8px)";
                  e.currentTarget.style.boxShadow =
                    "0 12px 30px rgba(230, 57, 70, 0.15)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = "#f8f9fa";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div
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
                  }}
                >
                  <i className="bi bi-award-fill"></i>
                </div>
                <h5 style={{ color: "#333333", marginBottom: "16px" }}>
                  Our Values
                </h5>
                <p style={{ color: "#495057", marginBottom: "0" }}>
                  Quality, integrity, customer care, and continuous improvement
                  guide everything we do in serving our community's health
                  needs.
                </p>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* About Content & Image Section */}
      <section
        style={{
          background: "#f8f9fa",
          paddingTop: "80px",
          paddingBottom: "80px",
        }}
      >
        <Container>
          <Row className="align-items-center">
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
                    Our Story
                  </h3>
                  <p style={{ opacity: "0.9", marginBottom: "0" }}>
                    Building trust through quality healthcare services
                  </p>
                </div>

                <Card.Body style={{ padding: "40px" }}>
                  <div className="about-content">
                    <p
                      style={{
                        color: "#495057",
                        fontSize: "16px",
                        lineHeight: "1.8",
                        marginBottom: "24px",
                      }}
                    >
                      At Hare Krishna Medical, we are committed to providing
                      quality healthcare products and services to our community.
                      With years of experience in the medical field, we
                      understand the importance of reliable, accessible
                      healthcare solutions.
                    </p>
                    <p
                      style={{
                        color: "#495057",
                        fontSize: "16px",
                        lineHeight: "1.8",
                        marginBottom: "24px",
                      }}
                    >
                      Our mission is to ensure that every customer receives the
                      best possible care and products to maintain their health
                      and well-being. We believe in building long-term
                      relationships based on trust, quality, and exceptional
                      service.
                    </p>

                    <h5
                      style={{
                        color: "#e63946",
                        marginBottom: "20px",
                        fontWeight: "700",
                      }}
                    >
                      Why Choose Hare Krishna Medical?
                    </h5>

                    <Row>
                      <Col md={6} className="mb-3">
                        <div className="d-flex align-items-start mb-3">
                          <i
                            className="bi bi-check-circle-fill me-3 mt-1"
                            style={{ color: "#28a745", fontSize: "18px" }}
                          ></i>
                          <div>
                            <h6
                              style={{ color: "#333333", marginBottom: "4px" }}
                            >
                              Quality Assured Products
                            </h6>
                            <p
                              style={{
                                color: "#6c757d",
                                fontSize: "14px",
                                marginBottom: "0",
                              }}
                            >
                              From trusted manufacturers with strict quality
                              checks
                            </p>
                          </div>
                        </div>
                        <div className="d-flex align-items-start mb-3">
                          <i
                            className="bi bi-check-circle-fill me-3 mt-1"
                            style={{ color: "#28a745", fontSize: "18px" }}
                          ></i>
                          <div>
                            <h6
                              style={{ color: "#333333", marginBottom: "4px" }}
                            >
                              Expert Guidance
                            </h6>
                            <p
                              style={{
                                color: "#6c757d",
                                fontSize: "14px",
                                marginBottom: "0",
                              }}
                            >
                              Professional consultation and health advice
                            </p>
                          </div>
                        </div>
                        <div className="d-flex align-items-start mb-3">
                          <i
                            className="bi bi-check-circle-fill me-3 mt-1"
                            style={{ color: "#28a745", fontSize: "18px" }}
                          ></i>
                          <div>
                            <h6
                              style={{ color: "#333333", marginBottom: "4px" }}
                            >
                              Competitive Pricing
                            </h6>
                            <p
                              style={{
                                color: "#6c757d",
                                fontSize: "14px",
                                marginBottom: "0",
                              }}
                            >
                              Transparent billing with best market rates
                            </p>
                          </div>
                        </div>
                      </Col>
                      <Col md={6} className="mb-3">
                        <div className="d-flex align-items-start mb-3">
                          <i
                            className="bi bi-check-circle-fill me-3 mt-1"
                            style={{ color: "#28a745", fontSize: "18px" }}
                          ></i>
                          <div>
                            <h6
                              style={{ color: "#333333", marginBottom: "4px" }}
                            >
                              Fast Delivery
                            </h6>
                            <p
                              style={{
                                color: "#6c757d",
                                fontSize: "14px",
                                marginBottom: "0",
                              }}
                            >
                              Quick and reliable delivery service
                            </p>
                          </div>
                        </div>
                        <div className="d-flex align-items-start mb-3">
                          <i
                            className="bi bi-check-circle-fill me-3 mt-1"
                            style={{ color: "#28a745", fontSize: "18px" }}
                          ></i>
                          <div>
                            <h6
                              style={{ color: "#333333", marginBottom: "4px" }}
                            >
                              Customer Support
                            </h6>
                            <p
                              style={{
                                color: "#6c757d",
                                fontSize: "14px",
                                marginBottom: "0",
                              }}
                            >
                              24/7 support and after-sales service
                            </p>
                          </div>
                        </div>
                        <div className="d-flex align-items-start mb-3">
                          <i
                            className="bi bi-check-circle-fill me-3 mt-1"
                            style={{ color: "#28a745", fontSize: "18px" }}
                          ></i>
                          <div>
                            <h6
                              style={{ color: "#333333", marginBottom: "4px" }}
                            >
                              Digital Solutions
                            </h6>
                            <p
                              style={{
                                color: "#6c757d",
                                fontSize: "14px",
                                marginBottom: "0",
                              }}
                            >
                              Easy online ordering and digital invoices
                            </p>
                          </div>
                        </div>
                      </Col>
                    </Row>

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
                        Get in Touch
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
                  overflow: "hidden",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                }}
              >
                <div
                  style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "300px",
                    background:
                      "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
                    padding: "40px",
                  }}
                >
                  <img
                    src="https://cdn.builder.io/api/v1/assets/ec4b3f82f1ac4275b8bfc1756fcac420/medical_logo-e586be?format=webp&width=800"
                    alt="Hare Krishna Medical"
                    className="img-fluid"
                    style={{
                      maxWidth: "200px",
                      maxHeight: "200px",
                      objectFit: "contain",
                      filter: "brightness(1.1) contrast(1.2)",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      bottom: "0",
                      left: "0",
                      right: "0",
                      background:
                        "linear-gradient(transparent, rgba(230, 57, 70, 0.9))",
                      color: "white",
                      padding: "40px 20px 20px",
                      textAlign: "center",
                    }}
                  >
                    <h5
                      style={{
                        marginBottom: "8px",
                        fontWeight: "700",
                        textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
                      }}
                    >
                      Trusted Since Years
                    </h5>
                    <p
                      style={{
                        fontSize: "14px",
                        opacity: "1",
                        marginBottom: "0",
                        textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
                        fontWeight: "500",
                      }}
                    >
                      Serving our community with dedication
                    </p>
                  </div>
                </div>
              </Card>

              <Card
                style={{
                  border: "none",
                  borderRadius: "16px",
                  marginTop: "24px",
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
                    <i className="bi bi-geo-alt me-2"></i>
                    Visit Our Store
                  </h5>
                  <div style={{ color: "#495057", marginBottom: "20px" }}>
                    <div style={{ marginBottom: "8px", fontWeight: "600" }}>
                      📍 3 Sahyog Complex, Man Sarovar Circle
                    </div>
                    <div style={{ marginBottom: "8px" }}>
                      Amroli, 394107, Gujarat, India
                    </div>
                    <div style={{ marginBottom: "8px" }}>
                      📞 +91 76989 13354 | +91 91060 18508
                    </div>
                    <div>✉️ harekrishnamedical@gmail.com</div>
                  </div>
                  <Button
                    href="https://maps.google.com?q=3+Sahyog+Complex+Man+Sarovar+circle+Amroli+394107"
                    target="_blank"
                    style={{
                      background: "#e63946",
                      border: "none",
                      borderRadius: "8px",
                      padding: "10px 20px",
                      fontSize: "14px",
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
                    <i className="bi bi-map me-2"></i>
                    View on Map
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default About;
