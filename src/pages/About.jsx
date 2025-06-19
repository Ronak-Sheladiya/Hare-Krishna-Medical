import React from "react";
import { Container, Row, Col, Breadcrumb } from "react-bootstrap";

const About = () => {
  return (
    <div className="fade-in">
      {/* Breadcrumb */}
      <section className="medical-breadcrumb">
        <Container>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item active>About Us</Breadcrumb.Item>
          </Breadcrumb>
        </Container>
      </section>

      {/* About Content */}
      <section className="section-padding">
        <Container>
          <Row>
            <Col lg={12} className="text-center mb-5">
              <h1 className="section-title">About Hare Krishna Medical</h1>
              <p className="section-subtitle">
                Your trusted partner in health and wellness
              </p>
            </Col>
          </Row>

          <Row className="align-items-center mb-5">
            <Col lg={6} className="mb-4">
              <div className="about-content">
                <h3 className="mb-3">Our Mission</h3>
                <p>
                  At Hare Krishna Medical, we are committed to providing quality
                  healthcare products and services to our community. With years
                  of experience in the medical field, we understand the
                  importance of reliable, accessible healthcare solutions.
                </p>
                <p>
                  Our mission is to ensure that every customer receives the best
                  possible care and products to maintain their health and
                  well-being. We believe in building long-term relationships
                  based on trust, quality, and exceptional service.
                </p>
              </div>
            </Col>
            <Col lg={6} className="mb-4">
              <div className="text-center">
                <img
                  src="https://cdn.builder.io/api/v1/assets/ec4b3f82f1ac4275b8bfc1756fcac420/medical_logo-e586be?format=webp&width=800"
                  alt="Hare Krishna Medical"
                  className="img-fluid"
                  style={{ maxHeight: "300px" }}
                />
              </div>
            </Col>
          </Row>

          <Row>
            <Col lg={12}>
              <div className="about-highlight">
                <h4 className="mb-3">Why Choose Hare Krishna Medical?</h4>
                <Row>
                  <Col md={6} className="mb-3">
                    <ul className="list-unstyled">
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-medical-green me-2"></i>
                        Quality assured products from trusted manufacturers
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-medical-green me-2"></i>
                        Expert guidance and consultation
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-medical-green me-2"></i>
                        Competitive pricing and transparent billing
                      </li>
                    </ul>
                  </Col>
                  <Col md={6} className="mb-3">
                    <ul className="list-unstyled">
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-medical-green me-2"></i>
                        Fast and reliable delivery service
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-medical-green me-2"></i>
                        Customer support and after-sales service
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-medical-green me-2"></i>
                        Easy online ordering and digital invoices
                      </li>
                    </ul>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default About;
