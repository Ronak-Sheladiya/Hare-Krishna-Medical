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
    return user.fullName || user.name || "User";
  };

  const getUserRole = () => {
    if (!user) return null;
    return user.role === 1 ? "Admin" : "User";
  };

  const handleDashboardClick = (e) => {
    e.preventDefault();
    if (!user) return;
    const dashboardPath =
      user.role === 1 ? "/admin/dashboard" : "/user/dashboard";
    navigate(dashboardPath);
  };

  return (
    <>
      <Navbar expand="lg" className="medical-header" sticky="top">
        <Container>
          {/* Simplified Header Layout */}
          <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
            <img
              src="https://cdn.builder.io/api/v1/assets/ec4b3f82f1ac4275b8bfc1756fcac420/medical_logo-e586be?format=webp&width=800"
              alt="Hare Krishna Medical"
              className="medical-logo me-3"
            />
            <div className="brand-text-container">
              <h4 className="mb-0 text-medical-red fw-bold">
                Hare Krishna Medical
              </h4>
            </div>
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />

          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link
                as={Link}
                to="/"
                className={isActiveRoute("/") ? "active" : ""}
              >
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
                Products
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/about"
                className={isActiveRoute("/about") ? "active" : ""}
              >
                About
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/contact"
                className={isActiveRoute("/contact") ? "active" : ""}
              >
                Contact
              </Nav.Link>
            </Nav>

            <Nav className="ms-auto d-flex align-items-center">
              {/* Cart */}
              <Nav.Link as={Link} to="/cart" className="position-relative me-3">
                <i className="bi bi-cart3 fs-5"></i>
                {totalItems > 0 && (
                  <Badge
                    bg="danger"
                    className="position-absolute top-0 start-100 translate-middle"
                  >
                    {totalItems}
                  </Badge>
                )}
              </Nav.Link>

              {/* Notifications for Admin */}
              {isAuthenticated && user?.role === 1 && <NotificationSystem />}

              {/* Authentication */}
              {isAuthenticated ? (
                <Dropdown align="end">
                  <Dropdown.Toggle
                    variant="link"
                    className="text-decoration-none"
                  >
                    <div className="d-flex align-items-center">
                      <UserAvatar user={user} size={45} className="me-2" />
                      <div className="d-none d-md-block text-start">
                        <div className="fw-bold small text-medical-red">
                          {getUserDisplayName()}
                        </div>
                        <div
                          className="text-muted"
                          style={{ fontSize: "0.7rem" }}
                        >
                          {getUserRole()}
                        </div>
                      </div>
                      <i className="bi bi-chevron-down ms-2"></i>
                    </div>
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Header>
                      <strong>{getUserDisplayName()}</strong>
                      <br />
                      <small className="text-muted">{user?.email}</small>
                    </Dropdown.Header>
                    <Dropdown.Divider />

                    <Dropdown.Item onClick={handleDashboardClick}>
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
                          My Invoices
                        </Dropdown.Item>
                        <Dropdown.Item as={Link} to="/user/profile">
                          <i className="bi bi-person me-2"></i>
                          Profile Settings
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
                          Payment Management
                        </Dropdown.Item>
                        <Dropdown.Item as={Link} to="/admin/analytics">
                          <i className="bi bi-graph-up me-2"></i>
                          Analytics
                        </Dropdown.Item>
                        <Dropdown.Item as={Link} to="/admin/messages">
                          <i className="bi bi-envelope me-2"></i>
                          Messages
                        </Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Header>
                          <small className="text-muted">Admin Tools</small>
                        </Dropdown.Header>
                        <Dropdown.Item as={Link} to="/functionality-test">
                          <i className="bi bi-gear me-2"></i>
                          Functionality Test
                        </Dropdown.Item>
                        <Dropdown.Item as={Link} to="/navigation-test">
                          <i className="bi bi-list-ul me-2"></i>
                          Navigation Test
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
                    variant="outline-secondary"
                    size="sm"
                    className="btn-login-custom"
                  >
                    Login
                  </Button>
                  <Button
                    as={Link}
                    to="/register"
                    size="sm"
                    className="btn-register-custom"
                  >
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
            className="btn-modal-cancel"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleLogout}
            className="btn-modal-confirm"
          >
            <i className="bi bi-box-arrow-right me-2"></i>
            Logout
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Header Styling */}
      <style jsx>{`
        .medical-logo {
          width: 45px;
          height: 45px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(230, 57, 70, 0.2);
        }

        .nav-link {
          color: #6c757d !important;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .nav-link:hover {
          color: #e63946 !important;
        }

        .nav-link.active {
          color: #e63946 !important;
          font-weight: 600;
        }

        .dropdown-toggle::after {
          display: none;
        }

        .dropdown-menu {
          border-radius: 10px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
          border: none;
          min-width: 220px;
          max-height: 400px;
          overflow-y: auto;
        }

        .dropdown-item {
          padding: 0.75rem 1rem;
          transition: all 0.3s ease;
        }

        .dropdown-item:hover {
          background-color: rgba(230, 57, 70, 0.1);
          color: #e63946;
        }

        .btn-login-custom {
          border-color: #6c757d !important;
          color: #6c757d !important;
          font-weight: 500;
          padding: 8px 20px;
          border-radius: 6px;
          transition: all 0.3s ease;
        }

        .btn-login-custom:hover {
          background-color: #6c757d !important;
          border-color: #6c757d !important;
          color: white !important;
          transform: translateY(-1px);
        }

        .btn-register-custom {
          background: linear-gradient(135deg, #e63946, #dc3545) !important;
          border: none !important;
          color: white !important;
          font-weight: 500;
          padding: 8px 20px;
          border-radius: 6px;
          transition: all 0.3s ease;
        }

        .btn-register-custom:hover {
          background: linear-gradient(135deg, #dc3545, #c82333) !important;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(230, 57, 70, 0.3);
        }

        @media (max-width: 768px) {
          .medical-logo {
            width: 40px;
            height: 40px;
          }

          .brand-text-container h4 {
            font-size: 1rem;
          }
        }
      `}</style>
    </>
  );
};

export default Header;
