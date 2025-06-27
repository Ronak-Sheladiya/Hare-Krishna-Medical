import React, { useState } from "react";
import { Container, Row, Col, Button, Alert, Card, Nav } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

const NavigationTest = () => {
  const navigate = useNavigate();
  const [testResults, setTestResults] = useState([]);

  const testRoutes = [
    { path: "/", name: "Home" },
    { path: "/products", name: "Products" },
    { path: "/about", name: "About" },
    { path: "/contact", name: "Contact" },
    { path: "/cart", name: "Cart" },
    { path: "/login", name: "Login" },
    { path: "/register", name: "Register" },
    { path: "/user-guide", name: "User Guide" },
    { path: "/backend-docs", name: "Backend Docs" },
    { path: "/localsetup-guide", name: "Local Setup Guide" },
    { path: "/privacy-policy", name: "Privacy Policy" },
    { path: "/terms-conditions", name: "Terms & Conditions" },
  ];

  const testNavigation = async (path, name) => {
    try {
      navigate(path);
      setTestResults((prev) => [
        ...prev,
        { path, name, status: "success", message: "Navigation successful" },
      ]);
    } catch (error) {
      setTestResults((prev) => [
        ...prev,
        { path, name, status: "error", message: error.message },
      ]);
    }
  };

  const testAllRoutes = async () => {
    setTestResults([]);
    for (const route of testRoutes) {
      await new Promise((resolve) => setTimeout(resolve, 100)); // Small delay
      await testNavigation(route.path, route.name);
    }
  };

  const testAPIConnection = async () => {
    try {
      const backendUrl =
        import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
      const response = await fetch(`${backendUrl}/api/health`);
      if (response.ok) {
        const data = await response.json();
        setTestResults((prev) => [
          ...prev,
          {
            path: "/api/health",
            name: "Backend Health",
            status: "success",
            message: `Backend is responsive (${data.status})`,
          },
        ]);
      } else {
        throw new Error(`Backend returned ${response.status}`);
      }
    } catch (error) {
      setTestResults((prev) => [
        ...prev,
        {
          path: "/api/health",
          name: "Backend Health",
          status: "error",
          message: `Backend error: ${error.message}. Using URL: ${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}`,
        },
      ]);
    }
  };

  return (
    <Container className="py-5">
      <Row>
        <Col lg={12}>
          <Card>
            <Card.Header>
              <h3>🧪 Navigation & Button Test Suite</h3>
              <p className="mb-0">
                Test all routes and functionality to ensure everything works
                properly
              </p>
            </Card.Header>
            <Card.Body>
              <Row className="mb-4">
                <Col md={6}>
                  <Button
                    variant="primary"
                    onClick={testAllRoutes}
                    className="me-2 mb-2"
                    size="lg"
                  >
                    🔗 Test All Routes
                  </Button>
                  <Button
                    variant="info"
                    onClick={testAPIConnection}
                    className="me-2 mb-2"
                    size="lg"
                  >
                    🔌 Test Backend
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => setTestResults([])}
                    className="mb-2"
                    size="lg"
                  >
                    🗑️ Clear Results
                  </Button>
                </Col>
                <Col md={6}>
                  <Alert variant="info">
                    <h6>Quick Navigation Links:</h6>
                    <Nav className="flex-column">
                      <Nav.Link as={Link} to="/localsetup-guide">
                        📚 Local Setup Guide
                      </Nav.Link>
                      <Nav.Link as={Link} to="/backend-docs">
                        🔧 Backend Documentation
                      </Nav.Link>
                      <Nav.Link as={Link} to="/user-guide">
                        📖 User Guide
                      </Nav.Link>
                    </Nav>
                  </Alert>
                </Col>
              </Row>

              {/* Test Results */}
              {testResults.length > 0 && (
                <Row>
                  <Col lg={12}>
                    <h5>Test Results:</h5>
                    {testResults.map((result, index) => (
                      <Alert
                        key={index}
                        variant={
                          result.status === "success" ? "success" : "danger"
                        }
                        className="d-flex align-items-center"
                      >
                        <i
                          className={`bi bi-${result.status === "success" ? "check-circle" : "x-circle"} me-2`}
                        ></i>
                        <div>
                          <strong>{result.name}</strong> ({result.path}):{" "}
                          {result.message}
                        </div>
                      </Alert>
                    ))}
                  </Col>
                </Row>
              )}

              {/* Manual Test Links */}
              <Row className="mt-4">
                <Col lg={12}>
                  <h5>Manual Test Links:</h5>
                  <Row>
                    {testRoutes.map((route) => (
                      <Col md={3} key={route.path} className="mb-2">
                        <Button
                          as={Link}
                          to={route.path}
                          variant="outline-primary"
                          size="sm"
                          className="w-100"
                        >
                          {route.name}
                        </Button>
                      </Col>
                    ))}
                  </Row>
                </Col>
              </Row>

              {/* Common Issues & Solutions */}
              <Row className="mt-4">
                <Col lg={12}>
                  <Card className="border-warning">
                    <Card.Header className="bg-warning text-dark">
                      <h5 className="mb-0">⚠️ Common Issues & Solutions</h5>
                    </Card.Header>
                    <Card.Body>
                      <Row>
                        <Col md={6}>
                          <h6>🔄 Loading Spinner Issues:</h6>
                          <ul>
                            <li>Check if backend is running on port 5000</li>
                            <li>Verify environment variables are set</li>
                            <li>Clear browser cache and reload</li>
                            <li>Check browser console for errors</li>
                          </ul>
                        </Col>
                        <Col md={6}>
                          <h6>🔗 Navigation Issues:</h6>
                          <ul>
                            <li>Ensure React Router is properly configured</li>
                            <li>Check for route typos or missing components</li>
                            <li>Verify imports in App.jsx</li>
                            <li>Check for JavaScript errors in console</li>
                          </ul>
                        </Col>
                      </Row>
                      <Row className="mt-3">
                        <Col lg={12}>
                          <h6>🔧 Quick Fixes:</h6>
                          <Alert variant="light">
                            <strong>1. Restart Development Servers:</strong>
                            <br />• Backend:{" "}
                            <code>cd backend && npm run dev</code>
                            <br />• Frontend: <code>npm run dev</code>
                            <br />
                            <br />
                            <strong>2. Check URLs:</strong>
                            <br />• Frontend:{" "}
                            <a
                              href="http://localhost:5173"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              http://localhost:5173
                            </a>
                            <br />• Backend:{" "}
                            <a
                              href="http://localhost:5000/api/health"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              http://localhost:5000/api/health
                            </a>
                            <br />
                            <br />
                            <strong>3. Correct Setup Guide URL:</strong>
                            <br />• Use:{" "}
                            <Link to="/localsetup-guide">
                              /localsetup-guide
                            </Link>{" "}
                            (with hyphen)
                            <br />• Not: /localguidesetup
                          </Alert>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default NavigationTest;
