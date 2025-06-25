import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const AccessDenied = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  // Determine the reason for access denial
  const reason = location.state?.reason || "access_denied";
  const requiredRole = location.state?.requiredRole;
  const attemptedPath = location.state?.attemptedPath || location.pathname;

  const getAccessDeniedContent = () => {
    if (!isAuthenticated) {
      return {
        icon: "bi-shield-lock",
        title: "Authentication Required",
        subtitle: "Please log in to continue",
        message:
          "You need to be logged in to access this page. Please sign in with your credentials to continue.",
        color: "#e63946",
        actions: [
          {
            text: "Sign In",
            variant: "primary",
            icon: "bi-box-arrow-in-right",
            action: () => navigate("/login"),
          },
          {
            text: "Create Account",
            variant: "outline-primary",
            icon: "bi-person-plus",
            action: () => navigate("/register"),
          },
        ],
      };
    }

    if (requiredRole === "admin" && user?.role !== 1) {
      return {
        icon: "bi-shield-exclamation",
        title: "Admin Access Required",
        subtitle: "Restricted Area",
        message:
          "This area is restricted to administrators only. You don't have sufficient permissions to access this resource.",
        color: "#e63946",
        actions: [
          {
            text: "User Dashboard",
            variant: "primary",
            icon: "bi-speedometer2",
            action: () => navigate("/user/dashboard"),
          },
          {
            text: "Go Back",
            variant: "outline-secondary",
            icon: "bi-arrow-left",
            action: () => window.history.back(),
          },
        ],
      };
    }

    if (requiredRole === "user" && user?.role === 1) {
      return {
        icon: "bi-shield-exclamation",
        title: "User-Only Access",
        subtitle: "Admin Restriction",
        message:
          "This section is exclusively for regular users. As an administrator, you have access to enhanced management capabilities in the admin dashboard.",
        color: "#e63946",
        actions: [
          {
            text: "Admin Dashboard",
            variant: "primary",
            icon: "bi-speedometer2",
            action: () => navigate("/admin/dashboard"),
          },
          {
            text: "Go Back",
            variant: "outline-secondary",
            icon: "bi-arrow-left",
            action: () => window.history.back(),
          },
        ],
      };
    }

    // Default access denied
    return {
      icon: "bi-shield-x",
      title: "Access Denied",
      subtitle: "Insufficient Permissions",
      message:
        "You don't have the necessary permissions to access this resource. Please contact your administrator if you believe this is an error.",
      color: "#e63946",
      actions: [
        {
          text: "Go Home",
          variant: "primary",
          icon: "bi-house",
          action: () => navigate("/"),
        },
        {
          text: "Go Back",
          variant: "outline-secondary",
          icon: "bi-arrow-left",
          action: () => window.history.back(),
        },
      ],
    };
  };

  const content = getAccessDeniedContent();

  return (
    <div className="fade-in">
      {/* Hero Section with Red Theme */}
      <section
        style={{
          background: "linear-gradient(135deg, #e63946 0%, #dc3545 100%)",
          minHeight: "50vh",
          paddingTop: "80px",
          paddingBottom: "40px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background Pattern */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            opacity: 0.3,
          }}
        ></div>

        <Container style={{ position: "relative", zIndex: 2 }}>
          <Row className="justify-content-center text-center">
            <Col lg={8}>
              <div
                className="mb-4"
                style={{
                  animation: "pulse 2s infinite",
                  fontSize: "6rem",
                  color: "white",
                }}
              >
                <i className={content.icon}></i>
              </div>
              <h1
                className="text-white mb-3"
                style={{
                  fontWeight: "800",
                  fontSize: "3rem",
                  textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
                }}
              >
                {content.title}
              </h1>
              <p
                className="text-white-50 mb-0"
                style={{
                  fontSize: "1.3rem",
                  fontWeight: "300",
                }}
              >
                {content.subtitle}
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Content Section */}
      <section style={{ padding: "80px 0", background: "#f8f9fa" }}>
        <Container>
          <Row className="justify-content-center">
            <Col lg={8}>
              <div
                className="card border-0 shadow-lg"
                style={{
                  borderRadius: "20px",
                  background: "white",
                  boxShadow: "0 15px 50px rgba(0,0,0,0.1)",
                  marginTop: "-60px",
                  position: "relative",
                  zIndex: 3,
                }}
              >
                <div className="card-body p-5 text-center">
                  {/* Description */}
                  <p
                    className="text-secondary mb-4 lead"
                    style={{ fontSize: "1.1rem", lineHeight: "1.6" }}
                  >
                    {content.message}
                  </p>

                  {/* User Info (if authenticated) */}
                  {isAuthenticated && user && (
                    <div
                      className="alert mb-4"
                      style={{
                        background: "rgba(230, 57, 70, 0.1)",
                        border: "1px solid rgba(230, 57, 70, 0.3)",
                        borderRadius: "16px",
                        borderLeft: "4px solid #e63946",
                      }}
                    >
                      <div className="d-flex align-items-center justify-content-center">
                        <i
                          className="bi bi-person-circle me-3"
                          style={{ fontSize: "1.5rem", color: "#e63946" }}
                        ></i>
                        <div className="text-start">
                          <div className="fw-bold" style={{ color: "#e63946" }}>
                            {user.fullName || user.name || "User"}
                          </div>
                          <small className="text-muted">
                            {user.email} •{" "}
                            {user.role === 1 ? "Administrator" : "User"}
                          </small>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Attempted Path Info */}
                  {attemptedPath && attemptedPath !== "/access-denied" && (
                    <div className="mb-4">
                      <small className="text-muted">
                        <i className="bi bi-link-45deg me-1"></i>
                        Attempted to access:{" "}
                        <code className="bg-light px-2 py-1 rounded">
                          {attemptedPath}
                        </code>
                      </small>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="d-flex gap-3 justify-content-center flex-wrap mb-4">
                    {content.actions.map((action, index) => (
                      <Button
                        key={index}
                        variant={action.variant}
                        size="lg"
                        onClick={action.action}
                        className="px-4"
                        style={{
                          borderRadius: "16px",
                          fontWeight: "600",
                          transition: "all 0.3s ease",
                          minWidth: "140px",
                          background:
                            action.variant === "primary"
                              ? "linear-gradient(135deg, #e63946, #dc3545)"
                              : undefined,
                          border:
                            action.variant === "primary" ? "none" : undefined,
                        }}
                      >
                        <i className={`${action.icon} me-2`}></i>
                        {action.text}
                      </Button>
                    ))}
                  </div>

                  {/* Additional Help */}
                  <div className="pt-4 border-top">
                    <div className="row g-3">
                      <div className="col-md-6">
                        <Link to="/contact" className="text-decoration-none">
                          <div className="d-flex align-items-center justify-content-center text-muted">
                            <i className="bi bi-headset me-2"></i>
                            <small>Contact Support</small>
                          </div>
                        </Link>
                      </div>
                      <div className="col-md-6">
                        <Link to="/user-guide" className="text-decoration-none">
                          <div className="d-flex align-items-center justify-content-center text-muted">
                            <i className="bi bi-book me-2"></i>
                            <small>User Guide</small>
                          </div>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* CSS Animations */}
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }

        .btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        }

        .alert {
          transition: all 0.3s ease;
        }

        .card {
          transition: all 0.3s ease;
        }
      `}</style>
    </div>
  );
};

export default AccessDenied;
