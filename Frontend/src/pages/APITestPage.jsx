import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Alert,
  Badge,
  Form,
} from "react-bootstrap";
import { getBackendURL } from "../utils/config";

const APITestPage = () => {
  const [testResults, setTestResults] = useState({});
  const [loading, setLoading] = useState(false);
  const [testEmail, setTestEmail] = useState(`test${Date.now()}@example.com`);

  const backendURL = getBackendURL();

  const runTest = async (testName, testFunction) => {
    setLoading(true);
    setTestResults((prev) => ({ ...prev, [testName]: { status: "loading" } }));

    try {
      const result = await testFunction();
      setTestResults((prev) => ({
        ...prev,
        [testName]: {
          status: result.success ? "success" : "error",
          message: result.message,
          data: result.data,
        },
      }));
    } catch (error) {
      setTestResults((prev) => ({
        ...prev,
        [testName]: {
          status: "error",
          message: error.message,
        },
      }));
    }
    setLoading(false);
  };

  const testHealthCheck = async () => {
    try {
      const response = await fetch(`${backendURL}/api/health`);
      const data = await response.json();

      return {
        success: response.ok,
        message: response.ok
          ? "Backend is healthy"
          : "Backend health check failed",
        data: data,
      };
    } catch (error) {
      return {
        success: false,
        message: `Backend not reachable: ${error.message}`,
      };
    }
  };

  const testRegistration = async () => {
    try {
      const registrationData = {
        fullName: "Test User",
        email: testEmail,
        mobile: "9876543210",
        password: "test123456",
        address: "Test Address",
      };

      const response = await fetch(`${backendURL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registrationData),
      });

      const data = await response.json();

      return {
        success: response.ok,
        message: response.ok
          ? "Registration successful - Check if OTP email was sent"
          : `Registration failed: ${data.message}`,
        data: data,
      };
    } catch (error) {
      return {
        success: false,
        message: `Registration request failed: ${error.message}`,
      };
    }
  };

  const testEmailOTP = async () => {
    try {
      const response = await fetch(`${backendURL}/api/auth/resend-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: testEmail }),
      });

      const data = await response.json();

      return {
        success: response.ok,
        message: response.ok
          ? "OTP resend successful - Check if email was sent"
          : `OTP resend failed: ${data.message}`,
        data: data,
      };
    } catch (error) {
      return {
        success: false,
        message: `OTP resend request failed: ${error.message}`,
      };
    }
  };

  const testAllAPIs = async () => {
    await runTest("health", testHealthCheck);
    await runTest("registration", testRegistration);
    await runTest("emailOTP", testEmailOTP);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "loading":
        return <Badge bg="warning">Testing...</Badge>;
      case "success":
        return <Badge bg="success">✅ Pass</Badge>;
      case "error":
        return <Badge bg="danger">❌ Fail</Badge>;
      default:
        return <Badge bg="secondary">Not Tested</Badge>;
    }
  };

  return (
    <Container className="my-5">
      <Row>
        <Col lg={8} className="mx-auto">
          <Card>
            <Card.Header className="bg-primary text-white">
              <h4 className="mb-0">🧪 API Test Suite</h4>
              <small>Test all website APIs and email functionality</small>
            </Card.Header>
            <Card.Body>
              <Alert variant="info">
                <strong>Backend URL:</strong> {backendURL}
              </Alert>

              <Form.Group className="mb-3">
                <Form.Label>Test Email Address</Form.Label>
                <Form.Control
                  type="email"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  placeholder="Enter test email"
                />
                <Form.Text className="text-muted">
                  Use a real email address to test if emails are actually sent
                </Form.Text>
              </Form.Group>

              <div className="d-grid gap-2 mb-4">
                <Button
                  variant="primary"
                  onClick={testAllAPIs}
                  disabled={loading}
                  size="lg"
                >
                  {loading ? "Testing..." : "🚀 Run All API Tests"}
                </Button>
              </div>

              <Row>
                <Col md={6}>
                  <h6>Individual Tests</h6>
                  <div className="d-grid gap-2">
                    <Button
                      variant="outline-secondary"
                      onClick={() => runTest("health", testHealthCheck)}
                      disabled={loading}
                    >
                      Test Health Check
                    </Button>
                    <Button
                      variant="outline-secondary"
                      onClick={() => runTest("registration", testRegistration)}
                      disabled={loading}
                    >
                      Test Registration
                    </Button>
                    <Button
                      variant="outline-secondary"
                      onClick={() => runTest("emailOTP", testEmailOTP)}
                      disabled={loading}
                    >
                      Test Email OTP
                    </Button>
                  </div>
                </Col>

                <Col md={6}>
                  <h6>Test Results</h6>
                  <div className="space-y-2">
                    {["health", "registration", "emailOTP"].map((testName) => (
                      <div
                        key={testName}
                        className="d-flex justify-content-between align-items-center p-2 border rounded"
                      >
                        <span className="text-capitalize">
                          {testName.replace(/([A-Z])/g, " $1")}
                        </span>
                        {getStatusBadge(testResults[testName]?.status)}
                      </div>
                    ))}
                  </div>
                </Col>
              </Row>

              {Object.keys(testResults).length > 0 && (
                <div className="mt-4">
                  <h6>Detailed Results</h6>
                  {Object.entries(testResults).map(([testName, result]) => (
                    <Alert
                      key={testName}
                      variant={
                        result.status === "success"
                          ? "success"
                          : result.status === "error"
                            ? "danger"
                            : "warning"
                      }
                      className="mb-2"
                    >
                      <strong>{testName.toUpperCase()}:</strong>{" "}
                      {result.message}
                      {result.data && (
                        <details className="mt-2">
                          <summary>View Response Data</summary>
                          <pre className="mt-2 small">
                            {JSON.stringify(result.data, null, 2)}
                          </pre>
                        </details>
                      )}
                    </Alert>
                  ))}
                </div>
              )}

              <Alert variant="warning" className="mt-4">
                <strong>Email Testing Note:</strong> If you use a real email
                address, check your inbox (and spam folder) to verify if
                registration and OTP emails are actually being sent.
              </Alert>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default APITestPage;
