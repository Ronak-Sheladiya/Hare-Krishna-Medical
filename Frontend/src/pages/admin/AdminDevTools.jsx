import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminDevTools = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const devTools = [
    {
      id: "database-seeder",
      title: "Database Seeder",
      description: "Populate database with sample products and data",
      icon: "bi-database-fill-add",
      color: "primary",
      path: "/database-seeder",
      category: "Database",
    },
    {
      id: "fix-database",
      title: "Quick Database Fix",
      description: "Quick fixes for common database issues",
      icon: "bi-tools",
      color: "warning",
      path: "/fix-database",
      category: "Database",
    },
    {
      id: "api-test",
      title: "API Test Suite",
      description: "Basic API endpoint testing interface",
      icon: "bi-cloud-check",
      color: "info",
      path: "/api-test",
      category: "API Testing",
    },
    {
      id: "comprehensive-api-test",
      title: "Comprehensive API Test",
      description: "Advanced API testing with email verification",
      icon: "bi-clipboard-check",
      color: "success",
      path: "/comprehensive-api-test",
      category: "API Testing",
    },
    {
      id: "backend-debug",
      title: "Backend Debug",
      description: "Debug backend connectivity and configuration",
      icon: "bi-bug",
      color: "danger",
      path: "/backend-debug",
      category: "Debug",
    },
    {
      id: "environment-test",
      title: "Environment Test",
      description: "Verify environment configuration and settings",
      icon: "bi-gear",
      color: "secondary",
      path: "/environment-test",
      category: "Debug",
    },
    {
      id: "socket-diagnostics",
      title: "Socket Diagnostics",
      description: "Real-time WebSocket connection diagnostics",
      icon: "bi-broadcast",
      color: "info",
      path: "/socket-diagnostics",
      category: "Debug",
    },
    {
      id: "navigation-test",
      title: "Navigation Test",
      description: "Test navigation and routing functionality",
      icon: "bi-compass",
      color: "primary",
      path: "/navigation-test",
      category: "Debug",
    },
    {
      id: "functionality-test",
      title: "Functionality Test",
      description: "Test core application functionality",
      icon: "bi-check-square",
      color: "success",
      path: "/functionality-test",
      category: "Debug",
    },
  ];

  const categories = [...new Set(devTools.map((tool) => tool.category))];

  const getVariantClass = (color) => {
    const variants = {
      primary: "btn-primary",
      secondary: "btn-secondary",
      success: "btn-success",
      danger: "btn-danger",
      warning: "btn-warning",
      info: "btn-info",
    };
    return variants[color] || "btn-primary";
  };

  const getBorderClass = (color) => {
    const borders = {
      primary: "border-primary",
      secondary: "border-secondary",
      success: "border-success",
      danger: "border-danger",
      warning: "border-warning",
      info: "border-info",
    };
    return borders[color] || "border-primary";
  };

  return (
    <div className="fade-in">
      <section className="section-padding">
        <Container>
          {/* Header */}
          <Row className="mb-5">
            <Col>
              <div className="text-center">
                <div className="mb-3">
                  <i
                    className="bi bi-tools"
                    style={{ fontSize: "3rem", color: "#e63946" }}
                  ></i>
                </div>
                <h1 className="display-5 fw-bold mb-3">Developer Tools</h1>
                <p className="lead text-muted mb-4">
                  Administrative debugging and testing utilities
                </p>
                <div className="alert alert-warning d-inline-flex align-items-center">
                  <i className="bi bi-shield-lock me-2"></i>
                  <strong>Admin Only:</strong> These tools are restricted to
                  administrators
                </div>
              </div>
            </Col>
          </Row>

          {/* User Info */}
          <Row className="mb-4">
            <Col>
              <Card className="bg-light border-0">
                <Card.Body className="py-3">
                  <div className="d-flex align-items-center">
                    <div className="me-3">
                      <i
                        className="bi bi-person-circle"
                        style={{ fontSize: "2rem", color: "#e63946" }}
                      ></i>
                    </div>
                    <div>
                      <h6 className="mb-1">
                        Logged in as: {user?.fullName || user?.name}
                      </h6>
                      <small className="text-muted">
                        {user?.email} • Administrator
                      </small>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Tools by Category */}
          {categories.map((category) => (
            <div key={category} className="mb-5">
              <h3 className="mb-4 text-center">
                <span className="badge bg-medical-red fs-6 px-3 py-2">
                  {category}
                </span>
              </h3>

              <Row className="g-4">
                {devTools
                  .filter((tool) => tool.category === category)
                  .map((tool) => (
                    <Col key={tool.id} lg={4} md={6}>
                      <Card
                        className={`h-100 border-2 ${getBorderClass(tool.color)} shadow-sm hover-card`}
                        style={{
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                        }}
                        onClick={() => navigate(tool.path)}
                      >
                        <Card.Body className="text-center d-flex flex-column">
                          <div className="mb-3">
                            <i
                              className={`${tool.icon}`}
                              style={{
                                fontSize: "2.5rem",
                                color:
                                  tool.color === "primary"
                                    ? "#0d6efd"
                                    : tool.color === "success"
                                      ? "#198754"
                                      : tool.color === "danger"
                                        ? "#dc3545"
                                        : tool.color === "warning"
                                          ? "#fd7e14"
                                          : tool.color === "info"
                                            ? "#0dcaf0"
                                            : "#6c757d",
                              }}
                            ></i>
                          </div>

                          <h5 className="card-title mb-3">{tool.title}</h5>
                          <p className="card-text text-muted mb-4 flex-grow-1">
                            {tool.description}
                          </p>

                          <Button
                            className={`${getVariantClass(tool.color)} w-100`}
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(tool.path);
                            }}
                          >
                            <i className="bi bi-arrow-right me-2"></i>
                            Launch Tool
                          </Button>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
              </Row>
            </div>
          ))}

          {/* Quick Actions */}
          <Row className="mt-5">
            <Col>
              <Card className="bg-dark text-white">
                <Card.Body>
                  <h5 className="mb-3">
                    <i className="bi bi-lightning me-2"></i>
                    Quick Actions
                  </h5>
                  <div className="d-flex gap-3 flex-wrap">
                    <Button
                      variant="outline-light"
                      size="sm"
                      onClick={() => navigate("/admin/dashboard")}
                    >
                      <i className="bi bi-speedometer2 me-1"></i>
                      Admin Dashboard
                    </Button>
                    <Button
                      variant="outline-light"
                      size="sm"
                      onClick={() => navigate("/backend-debug")}
                    >
                      <i className="bi bi-bug me-1"></i>
                      Quick Debug
                    </Button>
                    <Button
                      variant="outline-light"
                      size="sm"
                      onClick={() => navigate("/fix-database")}
                    >
                      <i className="bi bi-tools me-1"></i>
                      Database Fix
                    </Button>
                    <Button
                      variant="outline-light"
                      size="sm"
                      onClick={() => window.open("/backend-docs", "_blank")}
                    >
                      <i className="bi bi-book me-1"></i>
                      API Docs
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Hover Effects */}
      <style>{`
        .hover-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.15) !important;
        }
        
        .bg-medical-red {
          background-color: #e63946 !important;
        }
        
        .card {
          transition: all 0.3s ease;
        }
        
        .btn {
          transition: all 0.2s ease;
        }
        
        .btn:hover {
          transform: translateY(-1px);
        }
      `}</style>
    </div>
  );
};

export default AdminDevTools;
