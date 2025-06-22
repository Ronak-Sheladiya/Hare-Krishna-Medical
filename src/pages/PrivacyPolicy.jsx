import React from "react";
import { Container, Row, Col, Card, Breadcrumb } from "react-bootstrap";

const PrivacyPolicy = () => {
  return (
    <div className="fade-in">
      {/* Privacy Policy Content */}
      <section className="section-padding">
        <Container>
          <Row>
            <Col lg={12}>
              <div className="text-center mb-5">
                <h1 className="section-title">Privacy Policy</h1>
                <p className="section-subtitle">
                  Your privacy is important to us. This policy explains how we
                  collect, use, and protect your information.
                </p>
                <p className="text-muted">
                  <small>
                    Last updated: {new Date().toLocaleDateString("en-GB")}
                  </small>
                </p>
              </div>
            </Col>
          </Row>

          <Row>
            <Col lg={12}>
              <Card className="medical-card">
                <Card.Body className="p-5">
                  <div className="privacy-section mb-5">
                    <h3 className="text-medical-red mb-3">
                      <i className="bi bi-info-circle me-2"></i>
                      Information We Collect
                    </h3>
                    <p>
                      We collect information to provide better services to our
                      customers:
                    </p>
                    <ul className="privacy-list">
                      <li>
                        <strong>Personal Information:</strong> Name, email
                        address, phone number, shipping address
                      </li>
                      <li>
                        <strong>Medical Information:</strong> Prescription
                        details, medical history (when provided)
                      </li>
                      <li>
                        <strong>Payment Information:</strong> Credit card
                        details, billing address (securely processed)
                      </li>
                      <li>
                        <strong>Usage Data:</strong> Website interactions,
                        preferences, search history
                      </li>
                      <li>
                        <strong>Device Information:</strong> IP address, browser
                        type, operating system
                      </li>
                    </ul>
                  </div>

                  <div className="privacy-section mb-5">
                    <h3 className="text-medical-red mb-3">
                      <i className="bi bi-gear me-2"></i>
                      How We Use Your Information
                    </h3>
                    <p>
                      Your information helps us provide and improve our
                      services:
                    </p>
                    <ul className="privacy-list">
                      <li>Process and fulfill your orders</li>
                      <li>Provide customer support and respond to inquiries</li>
                      <li>
                        Send order confirmations, shipping updates, and receipts
                      </li>
                      <li>Improve our website and services</li>
                      <li>Send promotional emails (with your consent)</li>
                      <li>Comply with legal obligations and regulations</li>
                      <li>Prevent fraud and ensure account security</li>
                    </ul>
                  </div>

                  <div className="privacy-section mb-5">
                    <h3 className="text-medical-red mb-3">
                      <i className="bi bi-share me-2"></i>
                      Information Sharing
                    </h3>
                    <p>
                      We respect your privacy and do not sell your personal
                      information. We may share information only in these
                      circumstances:
                    </p>
                    <ul className="privacy-list">
                      <li>
                        <strong>Service Providers:</strong> Trusted partners who
                        help us operate our business (payment processors,
                        shipping companies)
                      </li>
                      <li>
                        <strong>Legal Requirements:</strong> When required by
                        law or to protect our rights
                      </li>
                      <li>
                        <strong>Business Transfers:</strong> In case of merger,
                        acquisition, or sale of our business
                      </li>
                      <li>
                        <strong>With Your Consent:</strong> When you explicitly
                        agree to share your information
                      </li>
                    </ul>
                  </div>

                  <div className="privacy-section mb-5">
                    <h3 className="text-medical-red mb-3">
                      <i className="bi bi-shield-check me-2"></i>
                      Data Security
                    </h3>
                    <p>
                      We implement appropriate security measures to protect your
                      information:
                    </p>
                    <ul className="privacy-list">
                      <li>SSL encryption for all data transmission</li>
                      <li>Secure servers with regular security updates</li>
                      <li>Access controls and employee training</li>
                      <li>Regular security audits and monitoring</li>
                      <li>PCI DSS compliance for payment processing</li>
                    </ul>
                  </div>

                  <div className="privacy-section mb-5">
                    <h3 className="text-medical-red mb-3">
                      <i className="bi bi-person-check me-2"></i>
                      Your Rights
                    </h3>
                    <p>
                      You have the following rights regarding your personal
                      information:
                    </p>
                    <ul className="privacy-list">
                      <li>
                        <strong>Access:</strong> Request a copy of your personal
                        data
                      </li>
                      <li>
                        <strong>Correction:</strong> Update or correct
                        inaccurate information
                      </li>
                      <li>
                        <strong>Deletion:</strong> Request deletion of your
                        personal data
                      </li>
                      <li>
                        <strong>Portability:</strong> Receive your data in a
                        commonly used format
                      </li>
                      <li>
                        <strong>Opt-out:</strong> Unsubscribe from marketing
                        communications
                      </li>
                      <li>
                        <strong>Restriction:</strong> Limit how we process your
                        information
                      </li>
                    </ul>
                  </div>

                  <div className="privacy-section mb-5">
                    <h3 className="text-medical-red mb-3">
                      <i className="bi bi-cookie me-2"></i>
                      Cookies and Tracking
                    </h3>
                    <p>
                      We use cookies and similar technologies to enhance your
                      experience:
                    </p>
                    <ul className="privacy-list">
                      <li>
                        <strong>Essential Cookies:</strong> Required for website
                        functionality
                      </li>
                      <li>
                        <strong>Analytics Cookies:</strong> Help us understand
                        how you use our site
                      </li>
                      <li>
                        <strong>Marketing Cookies:</strong> Used to show
                        relevant advertisements
                      </li>
                      <li>
                        <strong>Preference Cookies:</strong> Remember your
                        settings and preferences
                      </li>
                    </ul>
                    <p>
                      You can control cookies through your browser settings, but
                      this may affect website functionality.
                    </p>
                  </div>

                  <div className="privacy-section mb-5">
                    <h3 className="text-medical-red mb-3">
                      <i className="bi bi-clock me-2"></i>
                      Data Retention
                    </h3>
                    <p>
                      We retain your information for as long as necessary to:
                    </p>
                    <ul className="privacy-list">
                      <li>Provide our services and support</li>
                      <li>Comply with legal obligations</li>
                      <li>Resolve disputes and enforce agreements</li>
                      <li>Improve our services and prevent fraud</li>
                    </ul>
                    <p>
                      Account information is typically retained for 7 years
                      after account closure, in compliance with medical and
                      financial regulations.
                    </p>
                  </div>

                  <div className="privacy-section mb-5">
                    <h3 className="text-medical-red mb-3">
                      <i className="bi bi-people me-2"></i>
                      Children's Privacy
                    </h3>
                    <p>
                      Our services are not intended for children under 13. We do
                      not knowingly collect personal information from children
                      under 13. If you believe we have collected information
                      from a child under 13, please contact us immediately.
                    </p>
                  </div>

                  <div className="privacy-section mb-5">
                    <h3 className="text-medical-red mb-3">
                      <i className="bi bi-arrow-repeat me-2"></i>
                      Policy Updates
                    </h3>
                    <p>
                      We may update this Privacy Policy from time to time. We
                      will notify you of any changes by:
                    </p>
                    <ul className="privacy-list">
                      <li>Posting the new policy on this page</li>
                      <li>Updating the "Last updated" date</li>
                      <li>
                        Sending email notifications for significant changes
                      </li>
                      <li>Displaying a notice on our website</li>
                    </ul>
                  </div>

                  <div className="privacy-section">
                    <h3 className="text-medical-red mb-3">
                      <i className="bi bi-telephone me-2"></i>
                      Contact Us
                    </h3>
                    <p>
                      If you have any questions about this Privacy Policy or our
                      data practices, please contact us:
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
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      <style>{`
        .privacy-section {
          margin-bottom: 2.5rem;
        }

        .privacy-list {
          list-style: none;
          padding-left: 0;
        }

        .privacy-list li {
          padding: 8px 0;
          border-bottom: 1px solid #f8f9fa;
          position: relative;
          padding-left: 25px;
        }

        .privacy-list li:before {
          content: "✓";
          position: absolute;
          left: 0;
          color: var(--medical-red);
          font-weight: bold;
        }

        .privacy-list li:last-child {
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

export default PrivacyPolicy;
