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
        <Container>
          {/* Logo Section */}
          <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
            <img
              src="https://cdn.builder.io/api/v1/assets/ec4b3f82f1ac4275b8bfc1756fcac420/medical_logo-e586be?format=webp&width=800"
              alt="Hare Krishna Medical"
              className="medical-logo me-2"
            />
            <span className="fw-bold text-dark d-none d-md-inline">
              Hare Krishna Medical
            </span>
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            {/* Navigation Links */}
            <Nav className="medical-nav me-auto">
              <Nav.Link
                as={Link}
                to="/"
                className={isActiveRoute("/") ? "active" : ""}
              >
                <i className="bi bi-house me-1 d-lg-none"></i>
                Home
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/products"
                className={
                  isActiveRoute("/products") ||
                  location.pathname.startsWith("/products/")
                    ? "active"
                    : ""
                }
              >
                <i className="bi bi-grid3x3-gap me-1 d-lg-none"></i>
                Products
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/about"
                className={isActiveRoute("/about") ? "active" : ""}
              >
                <i className="bi bi-info-circle me-1 d-lg-none"></i>
                About Us
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/contact"
                className={isActiveRoute("/contact") ? "active" : ""}
              >
                <i className="bi bi-telephone me-1 d-lg-none"></i>
                Contact
              </Nav.Link>
            </Nav>

            {/* Right side - Cart and Auth */}
            <Nav className="d-flex align-items-center">
              {/* Cart Icon */}
              <Nav.Link
                as={Link}
                to="/cart"
                className="position-relative me-3 cart-link"
              >
                <i className="bi bi-cart3 fs-5"></i>
                {totalItems > 0 && (
                  <Badge
                    bg="danger"
                    className="cart-badge position-absolute"
                    style={{
                      top: "-8px",
                      right: "-8px",
                      fontSize: "0.75rem",
                      minWidth: "20px",
                      height: "20px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "50%",
                    }}
                  >
                    {totalItems}
                  </Badge>
                )}
              </Nav.Link>

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
                      {user?.profileImage ? (
                        <img
                          src={user.profileImage}
                          alt={getUserDisplayName()}
                          className="rounded-circle me-2"
                          width="35"
                          height="35"
                        />
                      ) : (
                        <div className="bg-medical-red text-white rounded-circle d-flex align-items-center justify-content-center me-2">
                          <i
                            className="bi bi-person-fill"
                            style={{
                              width: "35px",
                              height: "35px",
                              fontSize: "1.2rem",
                            }}
                          ></i>
                        </div>
                      )}
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
