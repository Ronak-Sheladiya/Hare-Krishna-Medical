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
        color: "#17a2b8",
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
        color: "#dc3545",
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
        color: "#fd7e14",
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
      color: "#6c757d",
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
    <div
      className="fade-in"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
      }}
    >
      <Container>
        <Row
          className="justify-content-center align-items-center"
          style={{ minHeight: "100vh" }}
        >
          <Col lg={6} md={8} className="text-center">
            <div
              className="card border-0 shadow-lg"
              style={{
                borderRadius: "24px",
                background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
                overflow: "hidden",
              }}
            >
              {/* Animated Background Pattern */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "150px",
                  background: `linear-gradient(135deg, ${content.color}20 0%, ${content.color}10 100%)`,
                  zIndex: 1,
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "-50px",
                    right: "-50px",
                    width: "150px",
                    height: "150px",
                    borderRadius: "50%",
                    background: `${content.color}15`,
                    animation: "float 6s ease-in-out infinite",
                  }}
                ></div>
                <div
                  style={{
                    position: "absolute",
                    top: "50px",
                    left: "-30px",
                    width: "100px",
                    height: "100px",
                    borderRadius: "50%",
                    background: `${content.color}10`,
                    animation: "float 4s ease-in-out infinite reverse",
                  }}
                ></div>
              </div>

              <div
                className="card-body p-5"
                style={{ position: "relative", zIndex: 2 }}
              >
                {/* Icon with Pulse Animation */}
                <div
                  className="mb-4"
                  style={{
                    animation: "pulse 2s infinite",
                    fontSize: "6rem",
                    color: content.color,
                  }}
                >
                  <i className={content.icon}></i>
                </div>

                {/* Title */}
                <h1
                  className="mb-3"
                  style={{
                    fontWeight: "800",
                    color: content.color,
                    fontSize: "2.5rem",
                  }}
                >
                  {content.title}
                </h1>

                {/* Subtitle */}
                <h5 className="text-muted mb-4" style={{ fontWeight: "600" }}>
                  {content.subtitle}
                </h5>

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
                      background: `${content.color}10`,
                      border: `1px solid ${content.color}30`,
                      borderRadius: "16px",
                    }}
                  >
                    <div className="d-flex align-items-center">
                      <i
                        className="bi bi-person-circle me-3"
                        style={{ fontSize: "1.5rem", color: content.color }}
                      ></i>
                      <div className="text-start">
                        <div
                          className="fw-bold"
                          style={{ color: content.color }}
                        >
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
                <div className="d-flex gap-3 justify-content-center flex-wrap">
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
                      }}
                    >
                      <i className={`${action.icon} me-2`}></i>
                      {action.text}
                    </Button>
                  ))}
                </div>

                {/* Additional Help */}
                <div className="mt-5 pt-4 border-top">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <Link to="/contact" className="text-decoration-none">
                        <div className="d-flex align-items-center text-muted">
                          <i className="bi bi-headset me-2"></i>
                          <small>Contact Support</small>
                        </div>
                      </Link>
                    </div>
                    <div className="col-md-6">
                      <Link to="/user-guide" className="text-decoration-none">
                        <div className="d-flex align-items-center text-muted">
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

      {/* CSS Animations */}
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
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
