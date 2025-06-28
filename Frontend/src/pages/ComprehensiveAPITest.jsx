import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Alert,
  Badge,
  Form,
  Table,
  ProgressBar,
  Modal,
} from "react-bootstrap";
import { getBackendURL } from "../utils/config";

const ComprehensiveAPITest = () => {
  const [testResults, setTestResults] = useState({});
  const [loading, setLoading] = useState(false);
  const [testEmail, setTestEmail] = useState("");
  const [currentTest, setCurrentTest] = useState("");
  const [progress, setProgress] = useState(0);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailTestResult, setEmailTestResult] = useState(null);

  const backendURL = getBackendURL();

  // Comprehensive API test suite
  const apiTests = [
    // Health & Status
    {
      category: "Health",
      name: "Health Check",
      method: "GET",
      endpoint: "/health",
      public: true,
    },

    // Authentication
    {
      category: "Auth",
      name: "User Registration",
      method: "POST",
      endpoint: "/auth/register",
      public: true,
      data: () => ({
        fullName: "Test User",
        email: testEmail || `test${Date.now()}@example.com`,
        mobile: "9876543210",
        password: "test123456",
        address: "Test Address",
      }),
    },
    {
      category: "Auth",
      name: "User Login",
      method: "POST",
      endpoint: "/auth/login",
      public: true,
      data: () => ({
        email: testEmail || `test${Date.now()}@example.com`,
        password: "test123456",
      }),
    },
    {
      category: "Auth",
      name: "Forgot Password",
      method: "POST",
      endpoint: "/auth/forgot-password",
      public: true,
      data: () => ({ email: testEmail || `test${Date.now()}@example.com` }),
    },
    {
      category: "Auth",
      name: "Resend OTP",
      method: "POST",
      endpoint: "/auth/resend-otp",
      public: true,
      data: () => ({ email: testEmail || `test${Date.now()}@example.com` }),
    },

    // Products
    {
      category: "Products",
      name: "Get All Products",
      method: "GET",
      endpoint: "/products",
      public: true,
    },
    {
      category: "Products",
      name: "Get Categories",
      method: "GET",
      endpoint: "/products/categories",
      public: true,
    },
    {
      category: "Products",
      name: "Get Featured Products",
      method: "GET",
      endpoint: "/products/featured",
      public: true,
    },
    {
      category: "Products",
      name: "Search Suggestions",
      method: "GET",
      endpoint: "/products/search-suggestions",
      public: true,
    },

    // Messages
    {
      category: "Messages",
      name: "Get Messages",
      method: "GET",
      endpoint: "/messages",
      public: true,
    },
    {
      category: "Messages",
      name: "Send Message",
      method: "POST",
      endpoint: "/messages",
      public: true,
      data: () => ({
        name: "Test User",
        email: testEmail || "test@example.com",
        subject: "API Test Message",
        message: "This is a test message from the API test suite",
      }),
    },

    // Analytics
    {
      category: "Analytics",
      name: "Get Stats",
      method: "GET",
      endpoint: "/analytics/stats",
      public: true,
    },

    // Letterheads
    {
      category: "Letterheads",
      name: "Get Letterheads",
      method: "GET",
      endpoint: "/letterheads",
      public: true,
    },

    // Verification
    {
      category: "Verification",
      name: "Get Status",
      method: "GET",
      endpoint: "/verification",
      public: true,
    },
  ];

  const runSingleTest = async (test) => {
    setCurrentTest(test.name);

    try {
      const config = {
        method: test.method,
        headers: {
          "Content-Type": "application/json",
        },
      };

      let url = `${backendURL}/api${test.endpoint}`;

      if (test.data && (test.method === "POST" || test.method === "PUT")) {
        config.body = JSON.stringify(test.data());
      }

      const response = await fetch(url, config);
      const data = await response.json();

      const result = {
        status: response.ok ? "success" : "error",
        statusCode: response.status,
        message: response.ok
          ? "Success"
          : data.message || `HTTP ${response.status}`,
        data: response.ok ? data : null,
        timestamp: new Date().toLocaleTimeString(),
      };

      setTestResults((prev) => ({
        ...prev,
        [`${test.category}-${test.name}`]: result,
      }));

      return result;
    } catch (error) {
      const result = {
        status: "error",
        statusCode: 0,
        message: error.message,
        data: null,
        timestamp: new Date().toLocaleTimeString(),
      };

      setTestResults((prev) => ({
        ...prev,
        [`${test.category}-${test.name}`]: result,
      }));

      return result;
    }
  };

  const runAllTests = async () => {
    setLoading(true);
    setTestResults({});
    setProgress(0);

    for (let i = 0; i < apiTests.length; i++) {
      await runSingleTest(apiTests[i]);
      setProgress(((i + 1) / apiTests.length) * 100);

      // Small delay between tests
      await new Promise((resolve) => setTimeout(resolve, 200));
    }

    setCurrentTest("");
    setLoading(false);
  };

  const testEmailDelivery = async () => {
    if (!testEmail) {
      alert("Please enter your email address first");
      return;
    }

    setShowEmailModal(true);
    setEmailTestResult({ status: "testing" });

    try {
      // Test registration with real email
      const response = await fetch(`${backendURL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: "Email Test User",
          email: testEmail,
          mobile: "9876543210",
          password: "test123456",
          address: "Test Address",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setEmailTestResult({
          status: "success",
          message:
            "Registration successful! Check your email for OTP verification.",
          instruction: `Please check your email inbox (and spam folder) for an OTP verification email sent to ${testEmail}`,
        });
      } else if (
        response.status === 400 &&
        data.message.includes("already exists")
      ) {
        // Try resend OTP instead
        const resendResponse = await fetch(
          `${backendURL}/api/auth/resend-otp`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: testEmail }),
          },
        );

        if (resendResponse.ok) {
          setEmailTestResult({
            status: "success",
            message: "OTP resent successfully! Check your email.",
            instruction: `A new OTP has been sent to ${testEmail}. Please check your email inbox and spam folder.`,
          });
        } else {
          const resendData = await resendResponse.json();
          setEmailTestResult({
            status: "error",
            message: `Failed to resend OTP: ${resendData.message}`,
          });
        }
      } else {
        setEmailTestResult({
          status: "error",
          message: `Registration failed: ${data.message}`,
        });
      }
    } catch (error) {
      setEmailTestResult({
        status: "error",
        message: `Email test failed: ${error.message}`,
      });
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "success":
        return <Badge bg="success">✅ Pass</Badge>;
      case "error":
        return <Badge bg="danger">❌ Fail</Badge>;
      default:
        return <Badge bg="secondary">Not Tested</Badge>;
    }
  };

  const groupedResults = apiTests.reduce((acc, test) => {
    const key = test.category;
    if (!acc[key]) acc[key] = [];
    acc[key].push({
      ...test,
      result: testResults[`${test.category}-${test.name}`],
    });
    return acc;
  }, {});

  const totalTests = apiTests.length;
  const completedTests = Object.keys(testResults).length;
  const passedTests = Object.values(testResults).filter(
    (r) => r.status === "success",
  ).length;
  const failedTests = Object.values(testResults).filter(
    (r) => r.status === "error",
  ).length;

  return (
    <Container className="my-5">
      <Row>
        <Col lg={10} className="mx-auto">
          <Card>
            <Card.Header className="bg-primary text-white">
              <h4 className="mb-0">🧪 Comprehensive API Test Suite</h4>
              <small>
                Test all website APIs and email delivery functionality
              </small>
            </Card.Header>
            <Card.Body>
              <Alert variant="info">
                <strong>Backend URL:</strong> {backendURL}
                <br />
                <strong>Total APIs:</strong> {totalTests} endpoints
              </Alert>

              {/* Email Test Section */}
              <Card className="mb-4 border-warning">
                <Card.Header className="bg-warning text-dark">
                  <h6 className="mb-0">📧 Email Delivery Test</h6>
                </Card.Header>
                <Card.Body>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      Your Email Address (for real email testing)
                    </Form.Label>
                    <Form.Control
                      type="email"
                      value={testEmail}
                      onChange={(e) => setTestEmail(e.target.value)}
                      placeholder="Enter your email to test email delivery"
                    />
                  </Form.Group>
                  <Button
                    variant="warning"
                    onClick={testEmailDelivery}
                    disabled={!testEmail}
                  >
                    🚀 Test Email Delivery
                  </Button>
                </Card.Body>
              </Card>

              {/* Test Controls */}
              <div className="d-grid gap-2 mb-4">
                <Button
                  variant="primary"
                  onClick={runAllTests}
                  disabled={loading}
                  size="lg"
                >
                  {loading
                    ? `Testing ${currentTest}...`
                    : "🚀 Run All API Tests"}
                </Button>
              </div>

              {/* Progress Bar */}
              {loading && (
                <div className="mb-4">
                  <div className="d-flex justify-content-between mb-2">
                    <small>Progress: {Math.round(progress)}%</small>
                    <small>
                      {completedTests}/{totalTests} tests completed
                    </small>
                  </div>
                  <ProgressBar now={progress} variant="primary" />
                  {currentTest && (
                    <small className="text-muted">
                      Currently testing: {currentTest}
                    </small>
                  )}
                </div>
              )}

              {/* Summary */}
              {completedTests > 0 && (
                <Row className="mb-4">
                  <Col md={3}>
                    <Card className="text-center border-primary">
                      <Card.Body>
                        <h5 className="text-primary">{completedTests}</h5>
                        <small>Completed</small>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={3}>
                    <Card className="text-center border-success">
                      <Card.Body>
                        <h5 className="text-success">{passedTests}</h5>
                        <small>Passed</small>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={3}>
                    <Card className="text-center border-danger">
                      <Card.Body>
                        <h5 className="text-danger">{failedTests}</h5>
                        <small>Failed</small>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={3}>
                    <Card className="text-center border-info">
                      <Card.Body>
                        <h5 className="text-info">
                          {completedTests > 0
                            ? Math.round((passedTests / completedTests) * 100)
                            : 0}
                          %
                        </h5>
                        <small>Success Rate</small>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              )}

              {/* Detailed Results by Category */}
              {Object.keys(groupedResults).map((category) => (
                <Card key={category} className="mb-3">
                  <Card.Header>
                    <h6 className="mb-0">{category} APIs</h6>
                  </Card.Header>
                  <Card.Body>
                    <Table responsive size="sm">
                      <thead>
                        <tr>
                          <th>API Name</th>
                          <th>Method</th>
                          <th>Endpoint</th>
                          <th>Status</th>
                          <th>Response</th>
                          <th>Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        {groupedResults[category].map((test, index) => (
                          <tr key={index}>
                            <td>{test.name}</td>
                            <td>
                              <Badge
                                bg={
                                  test.method === "GET"
                                    ? "info"
                                    : test.method === "POST"
                                      ? "success"
                                      : "warning"
                                }
                              >
                                {test.method}
                              </Badge>
                            </td>
                            <td>
                              <code>{test.endpoint}</code>
                            </td>
                            <td>{getStatusBadge(test.result?.status)}</td>
                            <td>
                              {test.result?.statusCode && (
                                <Badge
                                  bg={
                                    test.result.status === "success"
                                      ? "success"
                                      : "danger"
                                  }
                                >
                                  {test.result.statusCode}
                                </Badge>
                              )}
                              {test.result?.message && (
                                <div className="small text-muted mt-1">
                                  {test.result.message}
                                </div>
                              )}
                            </td>
                            <td className="small text-muted">
                              {test.result?.timestamp}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              ))}

              {/* Email Test Modal */}
              <Modal
                show={showEmailModal}
                onHide={() => setShowEmailModal(false)}
                centered
              >
                <Modal.Header closeButton>
                  <Modal.Title>📧 Email Delivery Test Results</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  {emailTestResult?.status === "testing" && (
                    <div className="text-center">
                      <div
                        className="spinner-border text-primary mb-3"
                        role="status"
                      ></div>
                      <p>Testing email delivery...</p>
                    </div>
                  )}

                  {emailTestResult?.status === "success" && (
                    <Alert variant="success">
                      <h6>✅ {emailTestResult.message}</h6>
                      <p className="mb-0">{emailTestResult.instruction}</p>
                    </Alert>
                  )}

                  {emailTestResult?.status === "error" && (
                    <Alert variant="danger">
                      <h6>❌ Email Test Failed</h6>
                      <p className="mb-0">{emailTestResult.message}</p>
                    </Alert>
                  )}
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    variant="secondary"
                    onClick={() => setShowEmailModal(false)}
                  >
                    Close
                  </Button>
                </Modal.Footer>
              </Modal>

              <Alert variant="info" className="mt-4">
                <strong>📝 Testing Notes:</strong>
                <ul className="mb-0 mt-2">
                  <li>
                    Use a real email address in the email test to verify actual
                    email delivery
                  </li>
                  <li>
                    Check your spam folder if you don't receive emails in your
                    inbox
                  </li>
                  <li>
                    Some tests may fail due to authentication requirements or
                    data validation
                  </li>
                  <li>Green tests indicate the API is working correctly</li>
                </ul>
              </Alert>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ComprehensiveAPITest;
