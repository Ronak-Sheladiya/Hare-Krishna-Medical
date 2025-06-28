import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Alert,
  Badge,
  Table,
  ProgressBar,
} from "react-bootstrap";
import { getBackendURL } from "../utils/config";
import {
  robustApiCall,
  clearBackendCache,
  workingBackendURL,
} from "../utils/robust-api-client";

const BackendDebug = () => {
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState([]);
  const [progress, setProgress] = useState(0);

  const BACKEND_URLS = [
    "https://hare-krishna-medical.onrender.com",
    "https://hare-krishna-medical-backend.onrender.com",
    "https://hk-medical-backend.onrender.com",
    "http://localhost:5000",
  ];

  const testSingleBackend = async (url) => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const startTime = Date.now();
      const response = await fetch(`${url}/api/health`, {
        method: "GET",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
        },
        mode: "cors",
      });

      clearTimeout(timeoutId);
      const responseTime = Date.now() - startTime;

      if (response.ok) {
        const data = await response.json();
        return {
          url,
          status: "success",
          responseTime,
          data,
          httpStatus: response.status,
        };
      } else {
        return {
          url,
          status: "error",
          responseTime,
          error: `HTTP ${response.status}: ${response.statusText}`,
          httpStatus: response.status,
        };
      }
    } catch (error) {
      return {
        url,
        status: "error",
        responseTime: 0,
        error: error.message,
        httpStatus: 0,
      };
    }
  };

  const testAllBackends = async () => {
    setTesting(true);
    setResults([]);
    setProgress(0);

    const configuredURL = getBackendURL();
    const urlsToTest = [
      configuredURL,
      ...BACKEND_URLS.filter((url) => url !== configuredURL),
    ];

    for (let i = 0; i < urlsToTest.length; i++) {
      const url = urlsToTest[i];
      const result = await testSingleBackend(url);

      setResults((prev) => [...prev, result]);
      setProgress(((i + 1) / urlsToTest.length) * 100);
    }

    setTesting(false);
  };

  const testRobustClient = async () => {
    try {
      setTesting(true);
      const result = await robustApiCall("/api/health");

      setResults([
        {
          url: result.backendURL || "Unknown",
          status: result.success ? "success" : "error",
          responseTime: 0,
          data: result.success ? result.data : null,
          error: result.success ? null : result.error,
          method: "Robust Client",
        },
      ]);
    } catch (error) {
      setResults([
        {
          url: "Robust Client Failed",
          status: "error",
          responseTime: 0,
          error: error.message,
          method: "Robust Client",
        },
      ]);
    }
    setTesting(false);
  };

  return (
    <Container className="my-5">
      <Row>
        <Col lg={10} className="mx-auto">
          <Card>
            <Card.Header className="bg-warning text-dark">
              <h4 className="mb-0">🔧 Backend Connection Debug</h4>
              <small>Test and debug backend connectivity issues</small>
            </Card.Header>
            <Card.Body>
              {/* Current Configuration */}
              <Card className="mb-4">
                <Card.Header>
                  <h6 className="mb-0">⚙️ Current Configuration</h6>
                </Card.Header>
                <Card.Body>
                  <Table responsive size="sm">
                    <tbody>
                      <tr>
                        <td>
                          <strong>Configured Backend URL</strong>
                        </td>
                        <td>
                          <code>{getBackendURL()}</code>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Working Backend URL</strong>
                        </td>
                        <td>
                          <code>{workingBackendURL || "Not determined"}</code>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Current Environment</strong>
                        </td>
                        <td>
                          {window.location.hostname.includes("localhost")
                            ? "Development"
                            : "Production"}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Current Domain</strong>
                        </td>
                        <td>
                          <code>{window.location.hostname}</code>
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>

              {/* Test Controls */}
              <div className="d-grid gap-2 mb-4">
                <Button
                  variant="primary"
                  onClick={testAllBackends}
                  disabled={testing}
                >
                  {testing
                    ? "Testing All Backends..."
                    : "🧪 Test All Backend URLs"}
                </Button>

                <Button
                  variant="info"
                  onClick={testRobustClient}
                  disabled={testing}
                >
                  {testing ? "Testing..." : "🚀 Test Robust API Client"}
                </Button>

                <Button
                  variant="outline-warning"
                  onClick={() => {
                    clearBackendCache();
                    alert("Backend cache cleared!");
                  }}
                  disabled={testing}
                >
                  🧹 Clear Backend Cache
                </Button>
              </div>

              {/* Progress */}
              {testing && progress > 0 && progress < 100 && (
                <div className="mb-4">
                  <ProgressBar
                    now={progress}
                    label={`${Math.round(progress)}%`}
                  />
                </div>
              )}

              {/* Results */}
              {results.length > 0 && (
                <Card className="mb-4">
                  <Card.Header>
                    <h6 className="mb-0">📊 Test Results</h6>
                  </Card.Header>
                  <Card.Body>
                    <Table responsive size="sm">
                      <thead>
                        <tr>
                          <th>Backend URL</th>
                          <th>Status</th>
                          <th>Response Time</th>
                          <th>Details</th>
                        </tr>
                      </thead>
                      <tbody>
                        {results.map((result, index) => (
                          <tr key={index}>
                            <td>
                              <code className="small">{result.url}</code>
                              {result.method && (
                                <div>
                                  <small className="text-muted">
                                    via {result.method}
                                  </small>
                                </div>
                              )}
                            </td>
                            <td>
                              <Badge
                                bg={
                                  result.status === "success"
                                    ? "success"
                                    : "danger"
                                }
                              >
                                {result.status === "success"
                                  ? "✅ Working"
                                  : "❌ Failed"}
                              </Badge>
                            </td>
                            <td>
                              {result.responseTime > 0
                                ? `${result.responseTime}ms`
                                : "N/A"}
                            </td>
                            <td>
                              {result.status === "success" ? (
                                <div>
                                  <Badge bg="info">
                                    HTTP {result.httpStatus}
                                  </Badge>
                                  {result.data && (
                                    <div className="small text-muted mt-1">
                                      Server: {result.data.status}, DB:{" "}
                                      {result.data.database}
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className="small text-danger">
                                  {result.error}
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              )}

              {/* Instructions */}
              <Alert variant="info">
                <h6>🔍 How to Use This Debug Tool:</h6>
                <ol className="mb-0">
                  <li>
                    <strong>Test All Backend URLs:</strong> Checks all possible
                    backend URLs to find working ones
                  </li>
                  <li>
                    <strong>Test Robust API Client:</strong> Uses the smart
                    client that automatically finds working backends
                  </li>
                  <li>
                    <strong>Clear Cache:</strong> Forces rediscovery of backend
                    URLs
                  </li>
                </ol>
              </Alert>

              {/* Backend URLs List */}
              <Card className="mb-4">
                <Card.Header>
                  <h6 className="mb-0">🌐 Available Backend URLs</h6>
                </Card.Header>
                <Card.Body>
                  <ul className="mb-0">
                    {BACKEND_URLS.map((url, index) => (
                      <li key={index}>
                        <code>{url}</code>
                      </li>
                    ))}
                  </ul>
                </Card.Body>
              </Card>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default BackendDebug;
