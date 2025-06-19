import React from "react";
import { Container, Row, Col, Card, Breadcrumb, Button } from "react-bootstrap";

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

          {/* Contact Form Section */}
          <Row className="mt-5">
            <Col lg={12}>
              <Card className="medical-form">
                <Card.Body>
                  <h4 className="text-center mb-4">Send Us a Message</h4>
                  <Row>
                    <Col lg={6} className="mb-3">
                      <label className="form-label">Full Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter your full name"
                      />
                    </Col>
                    <Col lg={6} className="mb-3">
                      <label className="form-label">Email Address *</label>
                      <input
                        type="email"
                        className="form-control"
                        placeholder="Enter your email"
                      />
                    </Col>
                    <Col lg={6} className="mb-3">
                      <label className="form-label">Phone Number</label>
                      <input
                        type="tel"
                        className="form-control"
                        placeholder="Enter your phone number"
                      />
                    </Col>
                    <Col lg={6} className="mb-3">
                      <label className="form-label">Subject</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Message subject"
                      />
                    </Col>
                    <Col lg={12} className="mb-3">
                      <label className="form-label">Message *</label>
                      <textarea
                        className="form-control"
                        rows="5"
                        placeholder="Write your message here..."
                      ></textarea>
                    </Col>
                    <Col lg={12} className="text-center">
                      <Button className="btn-medical-primary px-5">
                        Send Message
                      </Button>
                    </Col>
                  </Row>
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
