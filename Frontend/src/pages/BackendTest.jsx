import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Alert,
  Badge,
  Table,
} from "react-bootstrap";
import { getBackendURL, getAppConfig } from "../utils/config";
import unifiedApi from "../utils/unifiedApiClient";

const BackendTest = () => {
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState({});

  useEffect(() => {
    setConfig(getAppConfig());
    runInitialTests();
  }, []);

  const addResult = (test, success, message, details = null) => {
    setTestResults((prev) => [
      ...prev,
      {
        test,
        success,
        message,
        details,
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
  };

  const runInitialTests = async () => {
    setLoading(true);
    setTestResults([]);

    // Test 1: Check configuration
    const backendURL = getBackendURL();
    addResult("Configuration Check", true, `Backend URL: ${backendURL}`, {
      backendURL,
      config: getAppConfig(),
    });

    // Test 2: Basic fetch to backend
    await testBasicConnectivity();

    // Test 3: Health endpoint
    await testHealthEndpoint();

    // Test 4: Auth endpoints
    await testAuthEndpoints();

    setLoading(false);
  };

  const testBasicConnectivity = async () => {
    try {
      const backendURL = getBackendURL();
      const response = await fetch(backendURL, {
        method: "GET",
        mode: "cors",
        headers: {
          Accept: "application/json",
        },
      });

      addResult(
        "Basic Connectivity",
        true,
        `Successfully connected to ${backendURL}`,
        { status: response.status, statusText: response.statusText },
      );
    } catch (error) {
      addResult(
        "Basic Connectivity",
        false,
        `Failed to connect: ${error.message}`,
        { error: error.message },
      );
    }
  };

  const testHealthEndpoint = async () => {
    try {
      const response = await unifiedApi.get("/api/health");
      addResult(
        "Health Endpoint",
        true,
        "Health endpoint responding",
        response,
      );
    } catch (error) {
      addResult(
        "Health Endpoint",
        false,
        `Health check failed: ${error.message}`,
        { error: error.message },
      );
    }
  };

  const testAuthEndpoints = async () => {
    try {
      // Test debug auth endpoint
      const response = await unifiedApi.get("/api/debug-auth/users");
      addResult(
        "Auth Debug Endpoint",
        true,
        `Found ${response.usersCount || 0} users`,
        response,
      );
    } catch (error) {
      addResult(
        "Auth Debug Endpoint",
        false,
        `Auth debug failed: ${error.message}`,
        { error: error.message },
      );
    }
  };

  const testSpecificEndpoint = async (
    endpoint,
    method = "GET",
    body = null,
  ) => {
    try {
      let response;
      if (method === "GET") {
        response = await unifiedApi.get(endpoint);
      } else if (method === "POST") {
        response = await unifiedApi.post(endpoint, body);
      } else if (method === "PUT") {
        response = await unifiedApi.put(endpoint, body);
      }

      addResult(`${method} ${endpoint}`, true, "Endpoint responding", response);
    } catch (error) {
      addResult(`${method} ${endpoint}`, false, `Failed: ${error.message}`, {
        error: error.message,
      });
    }
  };

  const testProfileUpdate = async () => {
    const testData = {
      fullName: "Test User",
      email: "test@example.com",
      phone: "1234567890",
    };

    await testSpecificEndpoint("/api/auth/update-profile", "PUT", testData);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <Container className="py-4">
      <Row>
        <Col>
          <Card>
            <Card.Header>
              <h4>🔌 Backend Connectivity Test</h4>
            </Card.Header>
            <Card.Body>
              {/* Configuration Display */}
              <Alert variant="info">
                <h6>Current Configuration:</h6>
                <ul className="mb-0">
                  <li>
                    <strong>Backend URL:</strong> {config.backendURL}
                  </li>
                  <li>
                    <strong>Environment:</strong> {config.environment}
                  </li>
                  <li>
                    <strong>Production Mode:</strong>{" "}
                    {config.isProduction ? "Yes" : "No"}
                  </li>
                  <li>
                    <strong>Development Mode:</strong>{" "}
                    {config.isDevelopment ? "Yes" : "No"}
                  </li>
                </ul>
              </Alert>

              {/* Test Controls */}
              <div className="mb-3">
                <Button
                  variant="primary"
                  onClick={runInitialTests}
                  disabled={loading}
                  className="me-2"
                >
                  {loading ? "Testing..." : "Run All Tests"}
                </Button>

                <Button
                  variant="success"
                  onClick={testHealthEndpoint}
                  disabled={loading}
                  className="me-2"
                >
                  Test Health
                </Button>

                <Button
                  variant="warning"
                  onClick={testProfileUpdate}
                  disabled={loading}
                  className="me-2"
                >
                  Test Profile Update
                </Button>

                <Button variant="secondary" onClick={clearResults}>
                  Clear Results
                </Button>
              </div>

              {/* Results Display */}
              {testResults.length > 0 && (
                <>
                  <h5>Test Results:</h5>
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>Time</th>
                        <th>Test</th>
                        <th>Status</th>
                        <th>Message</th>
                        <th>Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      {testResults.map((result, index) => (
                        <tr
                          key={index}
                          className={
                            result.success ? "table-success" : "table-danger"
                          }
                        >
                          <td>{result.timestamp}</td>
                          <td>{result.test}</td>
                          <td>
                            <Badge bg={result.success ? "success" : "danger"}>
                              {result.success ? "✅ Pass" : "❌ Fail"}
                            </Badge>
                          </td>
                          <td>{result.message}</td>
                          <td>
                            {result.details && (
                              <details>
                                <summary>View Details</summary>
                                <pre
                                  className="mt-2"
                                  style={{ fontSize: "0.8em" }}
                                >
                                  {JSON.stringify(result.details, null, 2)}
                                </pre>
                              </details>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </>
              )}

              {/* Instructions */}
              <Alert variant="light" className="mt-4">
                <h6>Troubleshooting Steps:</h6>
                <ol>
                  <li>
                    If all tests fail, check if the backend server is running
                  </li>
                  <li>
                    If running locally, start backend with:{" "}
                    <code>npm run start:backend</code>
                  </li>
                  <li>Check if the backend URL is correct in configuration</li>
                  <li>Verify CORS settings allow frontend domain</li>
                  <li>Check browser console for additional error details</li>
                </ol>
              </Alert>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default BackendTest;
