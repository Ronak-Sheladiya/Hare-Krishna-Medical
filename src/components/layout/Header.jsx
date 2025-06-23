import React, { useState } from "react";
import {
  Navbar,
  Nav,
  Container,
  Button,
  Badge,
  Dropdown,
  Modal,
} from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../store/slices/authSlice.js";
import NotificationSystem from "../common/NotificationSystem.jsx";
import UserAvatar from "../common/UserAvatar.jsx";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { totalItems } = useSelector((state) => state.cart);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { unreadCount } = useSelector((state) => state.messages);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    dispatch(logout());
    setShowLogoutModal(false);
    navigate("/");
  };

  const getUserDisplayName = () => {
    if (!user) return "User";
    return user.name || "User";
  };

  const getUserRole = () => {
    if (!user) return null;
    return user.role === 1 ? "Admin" : "User";
  };

  const getDashboardLink = () => {
    if (!user) return "/";
    return user.role === 1 ? "/admin/dashboard" : "/user/dashboard";
  };

  return (
    <>
      <Navbar expand="lg" className="medical-header" sticky="top">
        <Container fluid className="px-4">
          <div className="header-3-part-layout">
            {/* LEFT SECTION - Logo and Brand */}
            <div className="header-left">
              <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
                <img
                  src="https://cdn.builder.io/api/v1/assets/ec4b3f82f1ac4275b8bfc1756fcac420/medical_logo-e586be?format=webp&width=800"
                  alt="Hare Krishna Medical"
                  className="medical-logo me-3"
                  style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "12px",
                    boxShadow: "0 4px 12px rgba(230, 57, 70, 0.2)"
                  }}
                />
                <div className="brand-text-container d-none d-md-block">
                  <div className="brand-stacked">
                    <div style={{
                      color: "#E63946",
                      fontWeight: "700",
                      fontSize: "1.8rem",
                      fontFamily: "'Poppins', sans-serif",
                      letterSpacing: "-0.5px",
                      lineHeight: "1.2",
                      textAlign: "left"
                    }}>
                      Hare Krishna
                    </div>
                    <div style={{
                      color: "#E63946",
                      fontWeight: "600",
                      fontSize: "1.4rem",
                      fontFamily: "'Poppins', sans-serif",
                      letterSpacing: "-0.3px",
                      lineHeight: "1",
                      textAlign: "left",
                      marginTop: "-2px"
                    }}>
                      Medical
                    </div>
                  </div>
                </div>
                {/* Mobile Brand Text */}
                <div className="d-md-none">
                  <div style={{
                    color: "#E63946",
                    fontWeight: "700",
                    fontSize: "1rem",
                    fontFamily: "'Poppins', sans-serif",
                    lineHeight: "1.2"
                  }}>
                    Hare Krishna
                  </div>
                  <div style={{
                    color: "#E63946",
                    fontWeight: "600",
                    fontSize: "0.8rem",
                    fontFamily: "'Poppins', sans-serif",
                    lineHeight: "1",
                    marginTop: "-2px"
                  }}>
                    Medical
                  </div>
                </div>
              </Navbar.Brand>
            </div>

            {/* CENTER SECTION - Navigation Links */}
            <div className="header-center d-none d-lg-flex">
              <Nav className="navigation-links">
                <Nav.Link
                  as={Link}
                  to="/"
                  className={`nav-item-custom ${isActiveRoute("/") ? "active" : ""}`}
                >
                  Home
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/products"
                  className={`nav-item-custom ${
                    isActiveRoute("/products") ||
                    location.pathname.startsWith("/products/")
                      ? "active"
                      : ""
                  }`}
                >
                  Products
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/about"
                  className={`nav-item-custom ${isActiveRoute("/about") ? "active" : ""}`}
                >
                  About Us
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/contact"
                  className={`nav-item-custom ${isActiveRoute("/contact") ? "active" : ""}`}
                >
                  Contact
                </Nav.Link>
              </Nav>
            </div>

            {/* RIGHT SECTION - Cart and User Actions */}
            <div className="header-right">
              <div className="d-flex align-items-center gap-3">
                {/* Cart Icon */}
                <Link
                  to="/cart"
                  className="cart-icon-wrapper position-relative"
                >
                  <div className="cart-icon">
                    <i className="bi bi-cart3"></i>
                    {totalItems > 0 && (
                      <Badge
                        bg="danger"
                        className="cart-badge position-absolute"
                      >
                        {totalItems}
                      </Badge>
                    )}
                  </div>
                </Link>

                {/* Real-time Notifications for Admin */}
                {isAuthenticated && user?.role === 1 && <NotificationSystem />}

              {/* Authentication Buttons/User Menu */}
              {isAuthenticated ? (
                <Dropdown align="end">
                  <Dropdown.Toggle
                    variant="link"
                    className="d-flex align-items-center text-decoration-none text-dark border-0 bg-transparent"
                    id="user-dropdown"
                  >
                    <div className="d-flex align-items-center">
                      <UserAvatar
                        user={user}
                        size={40}
                        className="me-2"
                        showBorder={true}
                      />
                      <div className="d-none d-md-block text-start">
                        <div className="fw-bold small">
                          {getUserDisplayName()}
                        </div>
                        <div
                          className="text-muted"
                          style={{ fontSize: "0.75rem" }}
                        >
                          {getUserRole()}
                        </div>
                      </div>
                      <i className="bi bi-chevron-down ms-2"></i>
                    </div>
                  </Dropdown.Toggle>

                  <Dropdown.Menu className="border-0 shadow">
                    <Dropdown.Header>
                      <div className="text-center">
                        <strong>{getUserDisplayName()}</strong>
                        <br />
                        <small className="text-muted">{user?.email}</small>
                      </div>
                    </Dropdown.Header>
                    <Dropdown.Divider />

                    <Dropdown.Item as={Link} to={getDashboardLink()}>
                      <i className="bi bi-speedometer2 me-2"></i>
                      Dashboard
                    </Dropdown.Item>

                    {user?.role === 0 && (
                      <>
                        <Dropdown.Item as={Link} to="/user/orders">
                          <i className="bi bi-bag me-2"></i>
                          My Orders
                        </Dropdown.Item>
                        <Dropdown.Item as={Link} to="/user/invoices">
                          <i className="bi bi-receipt me-2"></i>
                          Invoices
                        </Dropdown.Item>
                        <Dropdown.Item as={Link} to="/user/profile">
                          <i className="bi bi-person me-2"></i>
                          Edit Profile
                        </Dropdown.Item>
                      </>
                    )}

                    {user?.role === 1 && (
                      <>
                        <Dropdown.Item as={Link} to="/admin/users">
                          <i className="bi bi-people me-2"></i>
                          Manage Users
                        </Dropdown.Item>
                        <Dropdown.Item as={Link} to="/admin/products">
                          <i className="bi bi-box me-2"></i>
                          Manage Products
                        </Dropdown.Item>
                        <Dropdown.Item as={Link} to="/admin/orders">
                          <i className="bi bi-bag-check me-2"></i>
                          Manage Orders
                        </Dropdown.Item>
                        <Dropdown.Item as={Link} to="/admin/invoices">
                          <i className="bi bi-receipt-cutoff me-2"></i>
                          Manage Invoices
                        </Dropdown.Item>
                        <Dropdown.Item as={Link} to="/admin/payment-methods">
                          <i className="bi bi-credit-card me-2"></i>
                          Payment Methods
                        </Dropdown.Item>
                        <Dropdown.Item as={Link} to="/admin/analytics">
                          <i className="bi bi-graph-up me-2"></i>
                          Analytics
                        </Dropdown.Item>
                        <Dropdown.Item as={Link} to="/admin/messages">
                          <i className="bi bi-envelope me-2"></i>
                          Messages
                        </Dropdown.Item>
                      </>
                    )}

                    <Dropdown.Divider />
                    <Dropdown.Item
                      onClick={() => setShowLogoutModal(true)}
                      className="text-danger"
                    >
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
                    variant="outline-primary"
                    size="sm"
                    className="btn-medical-outline"
                  >
                    <i className="bi bi-box-arrow-in-right me-1 d-lg-none"></i>
                    Login
                  </Button>
                  <Button
                    as={Link}
                    to="/register"
                    variant="primary"
                    size="sm"
                    className="btn-medical-primary"
                  >
                    <i className="bi bi-person-plus me-1 d-lg-none"></i>
                    Register
                  </Button>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <Navbar.Toggle
                aria-controls="mobile-navbar-nav"
                className="d-lg-none ms-2"
              />
            </div>
          </div>

          {/* Mobile Navigation Collapse */}
          <Navbar.Collapse id="mobile-navbar-nav" className="d-lg-none">
            <Nav className="mobile-nav mt-3">
              <Nav.Link
                as={Link}
                to="/"
                className={`mobile-nav-item ${isActiveRoute("/") ? "active" : ""}`}
              >
                <i className="bi bi-house me-2"></i>
                Home
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/products"
                className={`mobile-nav-item ${
                  isActiveRoute("/products") ||
                  location.pathname.startsWith("/products/")
                    ? "active"
                    : ""
                }`}
              >
                <i className="bi bi-grid3x3-gap me-2"></i>
                Products
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/about"
                className={`mobile-nav-item ${isActiveRoute("/about") ? "active" : ""}`}
              >
                <i className="bi bi-info-circle me-2"></i>
                About Us
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/contact"
                className={`mobile-nav-item ${isActiveRoute("/contact") ? "active" : ""}`}
              >
                <i className="bi bi-telephone me-2"></i>
                Contact
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Logout Confirmation Modal */}
      <Modal
        show={showLogoutModal}
        onHide={() => setShowLogoutModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Logout</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <i className="bi bi-question-circle display-1 text-warning mb-3"></i>
            <h5>Are you sure you want to logout?</h5>
            <p className="text-muted">
              You will need to login again to access your account features.
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowLogoutModal(false)}
            className="btn-medical-outline"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleLogout}
            className="btn-medical-primary"
          >
            <i className="bi bi-box-arrow-right me-2"></i>
            Logout
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Header;