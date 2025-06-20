import React from "react";
import { Container, Row, Col, Card, Breadcrumb } from "react-bootstrap";

const TermsConditions = () => {
  return (
    <div className="fade-in">
      {/* Breadcrumb */}
      <section className="medical-breadcrumb">
        <Container>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item active>Terms & Conditions</Breadcrumb.Item>
          </Breadcrumb>
        </Container>
      </section>

      {/* Terms & Conditions Content */}
      <section className="section-padding">
        <Container>
          <Row>
            <Col lg={12}>
              <div className="text-center mb-5">
                <h1 className="section-title">Terms & Conditions</h1>
                <p className="section-subtitle">
                  Please read these terms and conditions carefully before using
                  our services.
                </p>
                <p className="text-muted">
                  <small>Last updated: {new Date().toLocaleDateString()}</small>
                </p>
              </div>
            </Col>
          </Row>

          <Row>
            <Col lg={12}>
              <Card className="medical-card">
                <Card.Body className="p-5">
                  <div className="terms-section mb-5">
                    <h3 className="text-medical-red mb-3">
                      <i className="bi bi-file-text me-2"></i>
                      Acceptance of Terms
                    </h3>
                    <p>
                      By accessing and using the Hare Krishna Medical website
                      and services, you agree to be bound by these Terms and
                      Conditions. If you do not agree with any part of these
                      terms, you may not use our services.
                    </p>
                    <p>
                      These terms apply to all visitors, users, and customers
                      who access or use our service.
                    </p>
                  </div>

                  <div className="terms-section mb-5">
                    <h3 className="text-medical-red mb-3">
                      <i className="bi bi-building me-2"></i>
                      About Our Services
                    </h3>
                    <p>
                      Hare Krishna Medical is a licensed medical store
                      providing:
                    </p>
                    <ul className="terms-list">
                      <li>Prescription and over-the-counter medications</li>
                      <li>Medical devices and equipment</li>
                      <li>Health and wellness products</li>
                      <li>Online ordering and delivery services</li>
                      <li>Medical consultation and advice</li>
                    </ul>
                    <p>
                      All products are sourced from licensed manufacturers and
                      distributors in compliance with applicable regulations.
                    </p>
                  </div>

                  <div className="terms-section mb-5">
                    <h3 className="text-medical-red mb-3">
                      <i className="bi bi-person-check me-2"></i>
                      User Accounts
                    </h3>
                    <p>
                      To access certain features, you must create an account:
                    </p>
                    <ul className="terms-list">
                      <li>
                        You must provide accurate and complete information
                      </li>
                      <li>
                        You are responsible for maintaining account security
                      </li>
                      <li>
                        You must notify us immediately of any unauthorized
                        access
                      </li>
                      <li>
                        You are responsible for all activities under your
                        account
                      </li>
                      <li>
                        We reserve the right to suspend or terminate accounts
                      </li>
                    </ul>
                  </div>

                  <div className="terms-section mb-5">
                    <h3 className="text-medical-red mb-3">
                      <i className="bi bi-prescription2 me-2"></i>
                      Prescription Requirements
                    </h3>
                    <p>For prescription medications:</p>
                    <ul className="terms-list">
                      <li>
                        Valid prescription from licensed healthcare provider
                        required
                      </li>
                      <li>Prescription must be current and not expired</li>
                      <li>We reserve the right to verify prescriptions</li>
                      <li>
                        Original prescription may be required for certain
                        medications
                      </li>
                      <li>
                        We comply with all applicable pharmacy laws and
                        regulations
                      </li>
                    </ul>
                  </div>

                  <div className="terms-section mb-5">
                    <h3 className="text-medical-red mb-3">
                      <i className="bi bi-cart me-2"></i>
                      Orders and Payments
                    </h3>
                    <p>When placing orders with us:</p>
                    <ul className="terms-list">
                      <li>
                        All orders are subject to acceptance and availability
                      </li>
                      <li>Prices are subject to change without notice</li>
                      <li>We accept various payment methods as displayed</li>
                      <li>Payment must be completed for order processing</li>
                      <li>
                        We reserve the right to cancel orders for any reason
                      </li>
                      <li>Bulk orders may require special terms</li>
                    </ul>
                  </div>

                  <div className="terms-section mb-5">
                    <h3 className="text-medical-red mb-3">
                      <i className="bi bi-truck me-2"></i>
                      Shipping and Delivery
                    </h3>
                    <p>Our delivery terms:</p>
                    <ul className="terms-list">
                      <li>Delivery times are estimates, not guarantees</li>
                      <li>Risk of loss passes to you upon delivery</li>
                      <li>Someone must be available to receive the package</li>
                      <li>
                        We are not responsible for failed deliveries due to
                        incorrect addresses
                      </li>
                      <li>
                        Special handling may be required for certain products
                      </li>
                      <li>Delivery charges apply as displayed at checkout</li>
                    </ul>
                  </div>

                  <div className="terms-section mb-5">
                    <h3 className="text-medical-red mb-3">
                      <i className="bi bi-arrow-return-left me-2"></i>
                      Returns and Refunds
                    </h3>
                    <p>Due to the nature of medical products:</p>
                    <ul className="terms-list">
                      <li>
                        Prescription medications cannot be returned once
                        dispensed
                      </li>
                      <li>
                        Over-the-counter items may be returned if unopened
                      </li>
                      <li>
                        Returns must be requested within 7 days of delivery
                      </li>
                      <li>Products must be in original packaging</li>
                      <li>
                        Refunds will be processed within 5-7 business days
                      </li>
                      <li>Return shipping costs may apply</li>
                    </ul>
                  </div>

                  <div className="terms-section mb-5">
                    <h3 className="text-medical-red mb-3">
                      <i className="bi bi-exclamation-triangle me-2"></i>
                      Medical Disclaimer
                    </h3>
                    <p>Important medical information:</p>
                    <ul className="terms-list">
                      <li>
                        Our products are not intended to diagnose, treat, cure,
                        or prevent any disease
                      </li>
                      <li>
                        Always consult healthcare professionals before use
                      </li>
                      <li>We are not responsible for misuse of products</li>
                      <li>
                        Information provided is for educational purposes only
                      </li>
                      <li>Individual results may vary</li>
                      <li>
                        Report adverse reactions to appropriate authorities
                      </li>
                    </ul>
                  </div>

                  <div className="terms-section mb-5">
                    <h3 className="text-medical-red mb-3">
                      <i className="bi bi-shield-exclamation me-2"></i>
                      Limitation of Liability
                    </h3>
                    <p>To the maximum extent permitted by law:</p>
                    <ul className="terms-list">
                      <li>
                        We are not liable for indirect, incidental, or
                        consequential damages
                      </li>
                      <li>
                        Our total liability is limited to the amount paid for
                        the product
                      </li>
                      <li>
                        We do not warrant uninterrupted or error-free service
                      </li>
                      <li>You use our services at your own risk</li>
                      <li>
                        Some jurisdictions may not allow certain limitations
                      </li>
                    </ul>
                  </div>

                  <div className="terms-section mb-5">
                    <h3 className="text-medical-red mb-3">
                      <i className="bi bi-copyright me-2"></i>
                      Intellectual Property
                    </h3>
                    <p>Regarding our content and materials:</p>
                    <ul className="terms-list">
                      <li>
                        All content is owned by Hare Krishna Medical or licensed
                      </li>
                      <li>
                        You may not reproduce, distribute, or modify our content
                      </li>
                      <li>Trademarks and logos are protected property</li>
                      <li>User-generated content may be used by us</li>
                      <li>Respect third-party intellectual property rights</li>
                    </ul>
                  </div>

                  <div className="terms-section mb-5">
                    <h3 className="text-medical-red mb-3">
                      <i className="bi bi-x-circle me-2"></i>
                      Prohibited Uses
                    </h3>
                    <p>You may not use our services for:</p>
                    <ul className="terms-list">
                      <li>Illegal or unauthorized purposes</li>
                      <li>Violating laws or regulations</li>
                      <li>Transmitting harmful or offensive content</li>
                      <li>Interfering with service security</li>
                      <li>
                        Impersonating others or providing false information
                      </li>
                      <li>Reselling products without authorization</li>
                    </ul>
                  </div>

                  <div className="terms-section mb-5">
                    <h3 className="text-medical-red mb-3">
                      <i className="bi bi-shield-check me-2"></i>
                      Privacy and Data Protection
                    </h3>
                    <p>Your privacy is important to us:</p>
                    <ul className="terms-list">
                      <li>
                        Our Privacy Policy explains data collection and use
                      </li>
                      <li>We implement appropriate security measures</li>
                      <li>You consent to data processing as described</li>
                      <li>You have rights regarding your personal data</li>
                      <li>We comply with applicable data protection laws</li>
                    </ul>
                  </div>

                  <div className="terms-section mb-5">
                    <h3 className="text-medical-red mb-3">
                      <i className="bi bi-arrow-repeat me-2"></i>
                      Changes to Terms
                    </h3>
                    <p>We reserve the right to modify these terms:</p>
                    <ul className="terms-list">
                      <li>Changes will be posted on this page</li>
                      <li>Continued use constitutes acceptance</li>
                      <li>Major changes will be communicated via email</li>
                      <li>Check this page regularly for updates</li>
                    </ul>
                  </div>

                  <div className="terms-section mb-5">
                    <h3 className="text-medical-red mb-3">
                      <i className="bi bi-gavel me-2"></i>
                      Governing Law
                    </h3>
                    <p>These terms are governed by:</p>
                    <ul className="terms-list">
                      <li>Laws of Gujarat State, India</li>
                      <li>Jurisdiction of Surat courts</li>
                      <li>
                        Indian pharmaceutical and medical device regulations
                      </li>
                      <li>Consumer protection laws</li>
                    </ul>
                  </div>

                  <div className="terms-section">
                    <h3 className="text-medical-red mb-3">
                      <i className="bi bi-telephone me-2"></i>
                      Contact Information
                    </h3>
                    <p>
                      For questions about these Terms & Conditions, contact us:
                    </p>
                    <div className="contact-info">
                      <p>
                        <strong>Hare Krishna Medical</strong>
                      </p>
                      <p>
                        <i className="bi bi-geo-alt me-2"></i>3 Sahyog Complex,
                        Man Sarovar circle, Amroli, 394107
                      </p>
                      <p>
                        <i className="bi bi-envelope me-2"></i>
                        <a href="mailto:harekrishnamedical@gmail.com">
                          harekrishnamedical@gmail.com
                        </a>
                      </p>
                      <p>
                        <i className="bi bi-telephone me-2"></i>
                        <a href="tel:+917698913354">+91 76989 13354</a> |
                        <a href="tel:+919106018508" className="ms-1">
                          +91 91060 18508
                        </a>
                      </p>
                      <p>
                        <i className="bi bi-clock me-2"></i>
                        Monday - Saturday: 9:00 AM - 9:00 PM | Sunday: 10:00 AM
                        - 6:00 PM
                      </p>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      <style>{`
        .terms-section {
          margin-bottom: 2.5rem;
        }
        
        .terms-list {
          list-style: none;
          padding-left: 0;
        }
        
        .terms-list li {
          padding: 8px 0;
          border-bottom: 1px solid #f8f9fa;
          position: relative;
          padding-left: 25px;
        }
        
        .terms-list li:before {
          content: "•";
          position: absolute;
          left: 0;
          color: var(--medical-red);
          font-weight: bold;
          font-size: 1.2rem;
        }
        
        .terms-list li:last-child {
          border-bottom: none;
        }
        
        .contact-info {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          margin-top: 15px;
        }
        
        .contact-info p {
          margin-bottom: 8px;
        }
        
        .contact-info a {
          color: var(--medical-red);
          text-decoration: none;
        }
        
        .contact-info a:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};

export default TermsConditions;
