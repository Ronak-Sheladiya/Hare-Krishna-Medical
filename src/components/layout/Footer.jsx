import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="medical-footer">
      <Container>
        <Row>
          {/* About Section */}
          <Col lg={4} md={6} className="mb-4">
            <h5>Hare Krishna Medical</h5>
            <p className="mb-3">
              Your trusted partner in health and wellness. We provide quality
              medical products with a commitment to excellence and care.
            </p>
            <div className="social-icons">
              <a
                href="https://www.instagram.com/harekrishna_medical/"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon instagram"
              >
                <i className="bi bi-instagram"></i>
              </a>
              <a
                href="mailto:harekrishnamedical@gmail.com"
                className="social-icon email"
              >
                <i className="bi bi-envelope"></i>
              </a>
              <a href="#" className="social-icon facebook">
                <i className="bi bi-facebook"></i>
              </a>
            </div>
          </Col>

          {/* Quick Links */}
          <Col lg={2} md={3} sm={6} className="mb-4">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/">Home</Link>
              </li>
              <li className="mb-2">
                <Link to="/products">Products</Link>
              </li>
              <li className="mb-2">
                <Link to="/about">About Us</Link>
              </li>
              <li className="mb-2">
                <Link to="/contact">Contact</Link>
              </li>
            </ul>
          </Col>

          {/* Customer Service */}
          <Col lg={2} md={3} sm={6} className="mb-4">
            <h5>Customer Service</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/login">My Account</Link>
              </li>
              <li className="mb-2">
                <Link to="/cart">Shopping Cart</Link>
              </li>
              <li className="mb-2">
                <Link to="/privacy-policy">Privacy Policy</Link>
              </li>
              <li className="mb-2">
                <Link to="/terms-conditions">Terms & Conditions</Link>
              </li>
              <li className="mb-2">
                <Link to="/user-guide">User Guide</Link>
              </li>
            </ul>
          </Col>

          {/* Contact Info */}
          <Col lg={4} md={12} className="mb-4">
            <h5>Contact Information</h5>
            <div className="contact-info">
              <p className="mb-2">
                <i className="bi bi-geo-alt-fill me-2 text-medical-red"></i>3
                Sahyog Complex, Man Sarovar circle, Amroli, 394107
              </p>
              <p className="mb-2">
                <i className="bi bi-envelope-fill me-2 text-medical-red"></i>
                <a href="mailto:harekrishnamedical@gmail.com">
                  harekrishnamedical@gmail.com
                </a>
              </p>
              <p className="mb-2">
                <i className="bi bi-telephone-fill me-2 text-medical-red"></i>
                <a href="tel:+917698913354">+91 76989 13354</a>
              </p>
              <p className="mb-0">
                <i className="bi bi-telephone-fill me-2 text-medical-red"></i>
                <a href="tel:+919106018508">+91 91060 18508</a>
              </p>
            </div>
          </Col>
        </Row>

        <hr className="my-4" style={{ borderColor: "var(--color-gray-1)" }} />

        {/* Bottom Bar */}
        <Row>
          <Col md={6}>
            <p className="mb-0">
              &copy; {new Date().getFullYear()} Hare Krishna Medical. All rights
              reserved.
            </p>
          </Col>
          <Col md={6} className="text-md-end">
            <p className="mb-0">
              Designed with{" "}
              <i className="bi bi-heart-fill text-medical-red"></i> for your
              health
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
