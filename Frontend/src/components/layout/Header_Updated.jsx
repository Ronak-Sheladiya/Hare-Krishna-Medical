import React, { useState, useEffect } from "react";
import {
  Navbar,
  Nav,
  Container,
  Button,
  Badge,
  Dropdown,
  Modal,
  Offcanvas,
} from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../store/slices/authSlice.js";
import NotificationSystem from "../common/NotificationSystem.jsx";
import UserAvatar from "../common/UserAvatar.jsx";
import ServerStatus from "../common/ServerStatus.jsx";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { totalItems } = useSelector((state) => state.cart);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { unreadCount } = useSelector((state) => state.messages);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Auto-close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    dispatch(logout());
    setShowLogoutModal(false);
    setIsMobileMenuOpen(false);
    navigate("/");
  };

  const handleDashboardNavigate = () => {
    const dashboardPath =
      user.role === 1 ? "/admin/dashboard" : "/user/dashboard";
    navigate(dashboardPath);
    setIsMobileMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const navLinkStyle = (isActive) => ({
    color: isActive ? "#e63946" : "#495057",
    fontWeight: isActive ? "600" : "500",
    fontSize: "0.95rem",
    padding: "8px 16px",
    borderRadius: "6px",
    transition: "all 0.3s ease",
    background: isActive ? "rgba(230, 57, 70, 0.1)" : "transparent",
  });

  return (
    <>
      {/* Compact Professional Header */}
      <Navbar
        expand="lg"
        className="medical-header shadow-sm"
        sticky="top"
        style={{
          background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
          borderBottom: "2px solid rgba(230, 57, 70, 0.1)",
          padding: "8px 0", // Reduced padding for smaller height
        }}
      >
        <Container>
          {/* Compact Brand */}
          <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
            <div
              style={{
                background: "white",
                borderRadius: "50%",
                padding: "6px", // Reduced padding
                border: "2px solid rgba(230, 57, 70, 0.1)",
                boxShadow: "0 2px 8px rgba(230, 57, 70, 0.15)", // Reduced shadow
                width: "50px", // Reduced from 80px
                height: "50px", // Reduced from 80px
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src="https://cdn.builder.io/api/v1/assets/030c65a34d11492ab1cc545443b12540/hk-e0ec29?format=webp&width=800"
                alt="Hare Krishna Medical"
                style={{
                  width: "32px", // Reduced logo size
                  height: "32px",
                  objectFit: "contain",
                }}
              />
            </div>
            <div className="brand-text-container ms-2 d-none d-md-block">
              <h4
                className="mb-0 fw-bold"
                style={{
                  color: "#e63946",
                  fontSize: "1.1rem", // Reduced from 1.4rem
                  letterSpacing: "0.3px",
                  textShadow: "0 1px 2px rgba(0,0,0,0.1)",
                }}
              >
                HARE KRISHNA MEDICAL
              </h4>
            </div>
            {/* Mobile brand text - shorter */}
            <div className="brand-text-container ms-2 d-md-none">
              <h4
                className="mb-0 fw-bold"
                style={{
                  color: "#e63946",
                  fontSize: "1rem",
                  letterSpacing: "0.3px",
                }}
              >
                HK MEDICAL
              </h4>
            </div>
          </Navbar.Brand>

          {/* Desktop Navigation */}
          <div className="d-none d-lg-flex align-items-center">
            <Nav className="me-auto">
              <Nav.Link
                as={Link}
                to="/"
                style={navLinkStyle(isActiveRoute("/"))}
              >
                <i className="bi bi-house me-1"></i>
                Home
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/products"
                style={navLinkStyle(isActiveRoute("/products"))}
              >
                <i className="bi bi-grid me-1"></i>
                Products
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/about"
                style={navLinkStyle(isActiveRoute("/about"))}
              >
                <i className="bi bi-info-circle me-1"></i>
                About
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/contact"
                style={navLinkStyle(isActiveRoute("/contact"))}
              >
                <i className="bi bi-envelope me-1"></i>
                Contact
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/verify"
                style={navLinkStyle(isActiveRoute("/verify"))}
              >
                <i className="bi bi-shield-check me-1"></i>
                Verify
              </Nav.Link>
            </Nav>

            {/* Desktop Actions */}
            <div className="d-flex align-items-center gap-2">
              {/* Server Status */}
              <ServerStatus />
              {/* Cart */}
              <Button
                as={Link}
                to="/cart"
                variant="outline-danger"
                size="sm"
                className="position-relative"
                style={{
                  borderRadius: "8px",
                  padding: "6px 12px",
                  border: "1.5px solid #e63946",
                }}
              >
                <i className="bi bi-cart3"></i>
                {totalItems > 0 && (
                  <Badge
                    bg="danger"
                    pill
                    className="position-absolute top-0 start-100 translate-middle"
                    style={{ fontSize: "0.7rem" }}
                  >
                    {totalItems}
                  </Badge>
                )}
              </Button>

              {/* User Authentication */}
              {isAuthenticated ? (
                <Dropdown align="end">
                  <Dropdown.Toggle
                    variant="light"
                    size="sm"
                    className="d-flex align-items-center"
                    style={{
                      background: "rgba(230, 57, 70, 0.1)",
                      border: "1px solid rgba(230, 57, 70, 0.2)",
                      borderRadius: "8px",
                      padding: "6px 12px",
                    }}
                  >
                    <UserAvatar user={user} size="24" />
                    <span className="ms-2 fw-medium">{user?.name}</span>
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={handleDashboardNavigate}>
                      <i className="bi bi-speedometer2 me-2"></i>
                      Dashboard
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={() => setShowLogoutModal(true)}>
                      <i className="bi bi-box-arrow-right me-2"></i>
                      Logout
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              ) : (
                <div className="d-flex gap-2">
                  <Button
                    as={Link}
                    to="/login"
                    variant="outline-danger"
                    size="sm"
                    style={{
                      borderRadius: "8px",
                      padding: "6px 16px",
                      fontWeight: "500",
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    as={Link}
                    to="/register"
                    variant="danger"
                    size="sm"
                    style={{
                      borderRadius: "8px",
                      padding: "6px 16px",
                      fontWeight: "500",
                    }}
                  >
                    Register
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <Button
            variant="outline-danger"
            size="sm"
            className="d-lg-none"
            onClick={() => setIsMobileMenuOpen(true)}
            style={{
              borderRadius: "6px",
              padding: "6px 10px",
              border: "1.5px solid #e63946",
            }}
          >
            <i className="bi bi-list" style={{ fontSize: "1.2rem" }}></i>
          </Button>
        </Container>
      </Navbar>

      {/* Mobile Offcanvas Menu */}
      <Offcanvas
        show={isMobileMenuOpen}
        onHide={closeMobileMenu}
        placement="end"
        className="medical-mobile-menu"
        style={{
          width: "280px",
          background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
        }}
      >
        <Offcanvas.Header
          style={{
            background: "linear-gradient(135deg, #e63946, #dc3545)",
            color: "white",
            padding: "16px 20px",
          }}
        >
          <Offcanvas.Title className="fw-bold">
            <i className="bi bi-grid-3x3-gap me-2"></i>
            Menu
          </Offcanvas.Title>
          <Button
            variant=""
            size="sm"
            onClick={closeMobileMenu}
            style={{
              color: "white",
              border: "1px solid rgba(255,255,255,0.3)",
              borderRadius: "6px",
              padding: "4px 8px",
            }}
          >
            <i className="bi bi-x-lg"></i>
          </Button>
        </Offcanvas.Header>

        <Offcanvas.Body style={{ padding: "20px" }}>
          {/* Mobile Navigation Links */}
          <Nav className="flex-column mb-4">
            <Nav.Link
              as={Link}
              to="/"
              onClick={closeMobileMenu}
              className="mobile-nav-link"
              style={{
                ...navLinkStyle(isActiveRoute("/")),
                marginBottom: "8px",
              }}
            >
              <i className="bi bi-house me-2"></i>
              Home
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/products"
              onClick={closeMobileMenu}
              className="mobile-nav-link"
              style={{
                ...navLinkStyle(isActiveRoute("/products")),
                marginBottom: "8px",
              }}
            >
              <i className="bi bi-grid me-2"></i>
              Products
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/about"
              onClick={closeMobileMenu}
              className="mobile-nav-link"
              style={{
                ...navLinkStyle(isActiveRoute("/about")),
                marginBottom: "8px",
              }}
            >
              <i className="bi bi-info-circle me-2"></i>
              About Us
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/contact"
              onClick={closeMobileMenu}
              className="mobile-nav-link"
              style={{
                ...navLinkStyle(isActiveRoute("/contact")),
                marginBottom: "8px",
              }}
            >
              <i className="bi bi-envelope me-2"></i>
              Contact
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/verify"
              onClick={closeMobileMenu}
              className="mobile-nav-link"
              style={{
                ...navLinkStyle(isActiveRoute("/verify")),
                marginBottom: "8px",
              }}
            >
              <i className="bi bi-shield-check me-2"></i>
              Verify Invoice
            </Nav.Link>
          </Nav>

          <hr style={{ margin: "20px 0", opacity: 0.3 }} />

          {/* Mobile Actions */}
          <div className="d-flex flex-column gap-3">
            {/* Cart Button */}
            <Button
              as={Link}
              to="/cart"
              onClick={closeMobileMenu}
              variant="outline-danger"
              className="d-flex align-items-center justify-content-between"
              style={{
                borderRadius: "8px",
                padding: "12px 16px",
                border: "1.5px solid #e63946",
              }}
            >
              <span>
                <i className="bi bi-cart3 me-2"></i>
                Shopping Cart
              </span>
              {totalItems > 0 && (
                <Badge bg="danger" pill>
                  {totalItems}
                </Badge>
              )}
            </Button>

            {/* User Authentication */}
            {isAuthenticated ? (
              <div>
                <div
                  className="d-flex align-items-center mb-3 p-3"
                  style={{
                    background: "rgba(230, 57, 70, 0.1)",
                    borderRadius: "8px",
                    border: "1px solid rgba(230, 57, 70, 0.2)",
                  }}
                >
                  <UserAvatar user={user} size="32" />
                  <div className="ms-3">
                    <div className="fw-bold text-dark">{user?.name}</div>
                    <small className="text-muted">{user?.email}</small>
                  </div>
                </div>

                <Button
                  onClick={() => {
                    handleDashboardNavigate();
                    closeMobileMenu();
                  }}
                  variant="outline-primary"
                  className="w-100 mb-2"
                  style={{
                    borderRadius: "8px",
                    padding: "10px",
                  }}
                >
                  <i className="bi bi-speedometer2 me-2"></i>
                  Dashboard
                </Button>

                <Button
                  onClick={() => {
                    setShowLogoutModal(true);
                    closeMobileMenu();
                  }}
                  variant="outline-danger"
                  className="w-100"
                  style={{
                    borderRadius: "8px",
                    padding: "10px",
                  }}
                >
                  <i className="bi bi-box-arrow-right me-2"></i>
                  Logout
                </Button>
              </div>
            ) : (
              <div className="d-flex flex-column gap-2">
                <Button
                  as={Link}
                  to="/login"
                  onClick={closeMobileMenu}
                  variant="outline-danger"
                  className="w-100"
                  style={{
                    borderRadius: "8px",
                    padding: "12px",
                    fontWeight: "500",
                  }}
                >
                  <i className="bi bi-box-arrow-in-right me-2"></i>
                  Login
                </Button>
                <Button
                  as={Link}
                  to="/register"
                  onClick={closeMobileMenu}
                  variant="danger"
                  className="w-100"
                  style={{
                    borderRadius: "8px",
                    padding: "12px",
                    fontWeight: "500",
                  }}
                >
                  <i className="bi bi-person-plus me-2"></i>
                  Register
                </Button>
              </div>
            )}
          </div>
        </Offcanvas.Body>
      </Offcanvas>

      {/* Logout Confirmation Modal */}
      <Modal
        show={showLogoutModal}
        onHide={() => setShowLogoutModal(false)}
        centered
        size="sm"
      >
        <Modal.Header
          closeButton
          style={{
            background: "linear-gradient(135deg, #e63946, #dc3545)",
            color: "white",
          }}
        >
          <Modal.Title>
            <i className="bi bi-question-circle me-2"></i>
            Confirm Logout
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center py-4">
          <p className="mb-0">Are you sure you want to logout?</p>
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button
            variant="outline-secondary"
            onClick={() => setShowLogoutModal(false)}
            style={{ borderRadius: "6px" }}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleLogout}
            style={{ borderRadius: "6px" }}
          >
            <i className="bi bi-box-arrow-right me-1"></i>
            Logout
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Notification System */}
      <NotificationSystem />

      {/* Custom Styles */}
      <style jsx>{`
        .medical-header {
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }

        .mobile-nav-link:hover {
          background: rgba(230, 57, 70, 0.1) !important;
          color: #e63946 !important;
          transform: translateX(4px);
        }

        @media (max-width: 991.98px) {
          .brand-text-container h4 {
            font-size: 0.9rem !important;
          }
        }

        .medical-mobile-menu .offcanvas-header {
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </>
  );
};

export default Header;
