import React, { useState, useEffect } from "react";
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
import socketClient from "../../utils/socketClient.js";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { totalItems } = useSelector((state) => state.cart);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { unreadCount } = useSelector((state) => state.messages);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Admin notification counts
  const [adminCounts, setAdminCounts] = useState({
    orders: 0,
    users: 0,
    products: 0,
    messages: 0,
    payments: 0,
  });

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    dispatch(logout());
    setShowLogoutModal(false);
    navigate("/", { replace: true });
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

  // Initialize socket connection and load admin counts
  useEffect(() => {
    if (isAuthenticated && user) {
      // Connect socket with user info
      const socket = socketClient.connect(user.id || user._id, user.role);

      if (user.role === 1) {
        // Load initial admin notification counts
        loadAdminCounts();

        // Set up real-time count updates
        if (socket) {
          socket.on("admin_notification", (data) => {
            // Update counts based on notification type
            setAdminCounts((prev) => ({
              ...prev,
              [data.type]: (prev[data.type] || 0) + 1,
            }));
          });

          socket.on("data_update", (updateData) => {
            // Refresh counts when data updates
            if (updateData.type === "orders" || updateData.type === "all") {
              loadAdminCounts();
            }
          });
        }
      }
    }

    return () => {
      // Cleanup socket listeners
      const socket = socketClient.getSocket();
      if (socket) {
        socket.off("admin_notification");
        socket.off("data_update");
      }
    };
  }, [isAuthenticated, user]);

  // Load admin notification counts
  const loadAdminCounts = async () => {
    if (!user || user.role !== 1) return;

    try {
      const { api } = await import("../../utils/apiClient");
      const response = await api.get("/api/admin/notifications");

      if (response.data.success && response.data.stats) {
        const stats = response.data.stats;
        setAdminCounts({
          orders: stats.pendingOrders || 0,
          users: stats.todayOrders || 0,
          products: stats.lowStockProducts || 0,
          messages: unreadCount || 0,
          payments: 0, // You can add payment notifications later
        });
      }
    } catch (error) {
      console.warn("Could not load admin counts:", error);
      // Use fallback values
      setAdminCounts({
        orders: 0,
        users: 0,
        products: 0,
        messages: unreadCount || 0,
        payments: 0,
      });
    }
  };

  // Helper component for admin dropdown items with badges
  const AdminDropdownItem = ({ to, icon, children, count = 0 }) => (
    <Dropdown.Item
      as={Link}
      to={to}
      className="d-flex justify-content-between align-items-center"
    >
      <span>
        <i className={`${icon} me-2`}></i>
        {children}
      </span>
      {count > 0 && (
        <Badge
          bg="danger"
          className="ms-2"
          style={{
            fontSize: "0.7rem",
            minWidth: "18px",
            height: "18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
          }}
        >
          {count > 99 ? "99+" : count}
        </Badge>
      )}
    </Dropdown.Item>
  );

  return (
    <>
      <Navbar expand="lg" className="medical-header" sticky="top">
        <Container>
          {/* Simplified Header Layout */}
          <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
            <div
              style={{
                background: "white",
                borderRadius: "50%",
                padding: "10px",
                border: "2px solid rgba(230, 57, 70, 0.1)",
                boxShadow: "0 4px 16px rgba(230, 57, 70, 0.25)",
                width: "80px",
                height: "80px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src="https://cdn.builder.io/api/v1/assets/030c65a34d11492ab1cc545443b12540/hk-e0ec29?format=webp&width=800"
                alt="Hare Krishna Medical"
                className="medical-logo"
              />
            </div>
            <div className="brand-text-container ms-3">
              <h4
                className="mb-0 fw-bold"
                style={{
                  color: "#e63946",
                  fontSize: "1.4rem",
                  letterSpacing: "0.5px",
                  textShadow: "0 1px 2px rgba(0,0,0,0.1)",
                }}
              >
                HARE KRISHNA MEDICAL
              </h4>
            </div>
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />

          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mx-auto">
              <Nav.Link
                as={Link}
                to="/"
                className={`nav-link-custom ${isActiveRoute("/") ? "active" : ""}`}
              >
                Home
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/products"
                className={`nav-link-custom ${
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
                className={`nav-link-custom ${isActiveRoute("/about") ? "active" : ""}`}
              >
                About
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/contact"
                className={`nav-link-custom ${isActiveRoute("/contact") ? "active" : ""}`}
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
                        <AdminDropdownItem
                          to="/admin/users"
                          icon="bi-people"
                          count={adminCounts.users}
                        >
                          Manage Users
                        </AdminDropdownItem>
                        <AdminDropdownItem
                          to="/admin/products"
                          icon="bi-box"
                          count={adminCounts.products}
                        >
                          Manage Products
                        </AdminDropdownItem>
                        <AdminDropdownItem
                          to="/admin/orders"
                          icon="bi-bag-check"
                          count={adminCounts.orders}
                        >
                          Manage Orders
                        </AdminDropdownItem>
                        <Dropdown.Item as={Link} to="/admin/invoices">
                          <i className="bi bi-receipt-cutoff me-2"></i>
                          Manage Invoices
                        </Dropdown.Item>
                        <AdminDropdownItem
                          to="/admin/payment-methods"
                          icon="bi-credit-card"
                          count={adminCounts.payments}
                        >
                          Payment Management
                        </AdminDropdownItem>
                        <Dropdown.Item as={Link} to="/admin/analytics">
                          <i className="bi bi-graph-up me-2"></i>
                          Analytics
                        </Dropdown.Item>
                        <Dropdown.Item as={Link} to="/admin/profile">
                          <i className="bi bi-person-gear me-2"></i>
                          Edit Profile
                        </Dropdown.Item>
                        <AdminDropdownItem
                          to="/admin/messages"
                          icon="bi-envelope"
                          count={adminCounts.messages}
                        >
                          Messages
                        </AdminDropdownItem>

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
                        <Dropdown.Item as={Link} to="/socket-diagnostics">
                          <i className="bi bi-wifi me-2"></i>
                          WebSocket Diagnostics
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
          width: 60px;
          height: 60px;
          border-radius: 50%;
          transition: all 0.3s ease;
          object-fit: contain;
          margin: 0 !important;
          background: transparent;
        }

        .medical-logo:hover {
          transform: scale(1.05);
        }

        .nav-link-custom {
          color: #6c757d !important;
          font-weight: 500;
          transition: all 0.3s ease;
          padding: 10px 16px !important;
          border-radius: 25px;
          margin: 0 4px;
          display: flex;
          align-items: center;
          position: relative;
          text-decoration: none;
        }

        .nav-link-custom:hover {
          color: #e63946 !important;
          background: linear-gradient(
            135deg,
            rgba(230, 57, 70, 0.1),
            rgba(230, 57, 70, 0.05)
          );
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(230, 57, 70, 0.2);
        }

        .nav-link-custom.active {
          color: white !important;
          font-weight: 600;
          background: linear-gradient(135deg, #e63946, #dc3545);
          box-shadow: 0 4px 15px rgba(230, 57, 70, 0.4);
          transform: translateY(-1px);
        }

        .nav-link-custom.active::before {
          content: "";
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(135deg, #e63946, #dc3545);
          border-radius: 27px;
          z-index: -1;
          opacity: 0.3;
          animation: activeGlow 2s ease-in-out infinite;
        }

        @keyframes activeGlow {
          0%,
          100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.02);
          }
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
            width: 50px;
            height: 50px;
          }

          .brand-text-container h4 {
            font-size: 1.1rem !important;
          }

          .navbar-brand > div {
            width: 60px !important;
            height: 60px !important;
            padding: 8px !important;
          }
        }

        @media (max-width: 576px) {
          .navbar-brand > div {
            width: 50px !important;
            height: 50px !important;
            padding: 6px !important;
          }

          .brand-text-container {
            display: none;
          }
        }
      `}</style>
    </>
  );
};

export default Header;
