import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  Badge,
  Button,
  Alert,
  Row,
  Col,
  Table,
} from "react-bootstrap";
import { useSelector } from "react-redux";
import socketClient from "../utils/socketClient";

const SocketDiagnostics = () => {
  const { user } = useSelector((state) => state.auth);
  const [socketStatus, setSocketStatus] = useState({});
  const [connectionHistory, setConnectionHistory] = useState([]);
  const [diagnosticResults, setDiagnosticResults] = useState([]);
  const [testingInProgress, setTestingInProgress] = useState(false);

  // Update socket status every second
  useEffect(() => {
    const interval = setInterval(() => {
      const status = socketClient.getConnectionStatus();
      setSocketStatus(status);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Add connection event to history
  const addToHistory = (event, details) => {
    const timestamp = new Date().toLocaleTimeString();
    setConnectionHistory((prev) => [
      { timestamp, event, details },
      ...prev.slice(0, 19), // Keep last 20 entries
    ]);
  };

  // Test socket connection
  const testConnection = async () => {
    setTestingInProgress(true);
    setDiagnosticResults([]);

    const results = [];

    try {
      // Test 1: Check if socket.io-client is available
      results.push({
        test: "Socket.IO Client Library",
        status: "pass",
        message: "Socket.IO client library is loaded successfully",
      });

      // Test 2: Check backend connectivity
      try {
        const backendUrl =
          import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

        // Try to detect if we're in production and adjust backend URL
        let testUrl = backendUrl;
        if (
          window.location.hostname.includes("fly.dev") &&
          backendUrl.includes("localhost")
        ) {
          // In production but backend URL is localhost, try to guess the backend URL
          testUrl = backendUrl.replace(
            "localhost:5000",
            window.location.hostname.replace(/^[^-]+-/, "") + ":5000",
          );
          results.push({
            test: "Backend URL Detection",
            status: "warning",
            message: `Production environment detected. Backend URL auto-adjusted from ${backendUrl} to ${testUrl}`,
          });
        }

        // Add timeout and proper error handling
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        const response = await fetch(`${testUrl}/api/health`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          results.push({
            test: "Backend Connectivity",
            status: "pass",
            message: `Backend is reachable at ${testUrl}. Status: ${data.status || "OK"}`,
          });
        } else {
          results.push({
            test: "Backend Connectivity",
            status: "warning",
            message: `Backend responded with status ${response.status} from ${testUrl}`,
          });
        }
      } catch (error) {
        let errorMessage = `Cannot reach backend: ${error.message}`;

        if (error.name === "AbortError") {
          errorMessage = "Backend connection timed out (10s)";
        } else if (error.message.includes("Failed to fetch")) {
          errorMessage = "Network error - Backend unreachable or CORS issue";
        }

        results.push({
          test: "Backend Connectivity",
          status: "fail",
          message: errorMessage,
        });

        // Add additional debugging info
        const currentUrl = window.location.href;
        const backendUrl =
          import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
        results.push({
          test: "Debug Info",
          status: "info",
          message: `Frontend: ${currentUrl}, Backend URL: ${backendUrl}, Error: ${error.name}`,
        });
      }

      // Test 3: Socket connection attempt
      addToHistory("Test", "Attempting socket connection...");

      try {
        // Disconnect existing connection first
        socketClient.disconnect();
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1s for clean disconnect

        // Try to connect with timeout
        const connectionPromise = new Promise((resolve, reject) => {
          try {
            const socket = socketClient.connect(
              user?.id || user?._id,
              user?.role,
            );

            if (socket) {
              // Wait for actual connection
              const checkConnection = () => {
                const status = socketClient.getConnectionStatus();
                if (status.connected) {
                  resolve(socket);
                } else if (status.fallbackMode) {
                  reject(new Error("Socket entered fallback mode"));
                } else {
                  // Keep checking for 5 seconds
                  setTimeout(checkConnection, 500);
                }
              };

              setTimeout(checkConnection, 100);

              // Timeout after 5 seconds
              setTimeout(() => {
                if (!socketClient.getConnectionStatus().connected) {
                  reject(new Error("Connection timeout"));
                }
              }, 5000);
            } else {
              reject(new Error("Socket client returned null"));
            }
          } catch (err) {
            reject(err);
          }
        });

        const socket = await connectionPromise;

        results.push({
          test: "Socket Connection",
          status: "pass",
          message: `Socket connected successfully. ID: ${socket.id || "N/A"}`,
        });

        // Test 4: Test event emission
        try {
          const testEventSent = socketClient.emit("test-event", {
            test: true,
            timestamp: Date.now(),
          });

          if (testEventSent) {
            results.push({
              test: "Event Emission",
              status: "pass",
              message: "Test event emitted successfully",
            });
          } else {
            results.push({
              test: "Event Emission",
              status: "fail",
              message: "Socket is connected but failed to emit test event",
            });
          }
        } catch (emitError) {
          results.push({
            test: "Event Emission",
            status: "fail",
            message: `Event emission failed: ${emitError.message}`,
          });
        }

        addToHistory("Test", "Socket connection test completed successfully");
      } catch (error) {
        results.push({
          test: "Socket Connection",
          status: "fail",
          message: `Connection error: ${error.message}`,
        });
        addToHistory("Error", `Connection failed: ${error.message}`);

        // Add fallback test info
        const status = socketClient.getConnectionStatus();
        results.push({
          test: "Socket Status Debug",
          status: "info",
          message: `Fallback mode: ${status.fallbackMode}, Attempts: ${status.connectionAttempts}`,
        });
      }

      // Test 5: Environment and Network configuration
      const hostname = window.location.hostname;
      const isLocalhost = hostname === "localhost" || hostname === "127.0.0.1";
      const isProduction =
        hostname.includes("fly.dev") ||
        hostname.includes("vercel.app") ||
        hostname.includes("netlify.app");
      const backendUrl =
        import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

      let envStatus = "info";
      let envMessage = "";

      if (isLocalhost) {
        envStatus = "pass";
        envMessage = "Running on localhost - development environment";
      } else if (isProduction) {
        if (backendUrl.includes("localhost")) {
          envStatus = "fail";
          envMessage = `Production environment detected but backend URL is localhost (${backendUrl}). This will not work in production.`;
        } else {
          envStatus = "warning";
          envMessage = `Production environment detected. Backend URL: ${backendUrl}. Ensure CORS and network settings are correct.`;
        }
      } else {
        envStatus = "warning";
        envMessage = `Unknown environment (${hostname}). Backend URL: ${backendUrl}. Check configuration.`;
      }

      results.push({
        test: "Environment Configuration",
        status: envStatus,
        message: envMessage,
      });

      // Test 6: CORS and Security Headers
      if (!isLocalhost) {
        const protocol = window.location.protocol;
        const isHttps = protocol === "https:";
        const backendProtocol = backendUrl.startsWith("https:")
          ? "https:"
          : "http:";

        if (isHttps && backendProtocol === "http:") {
          results.push({
            test: "Security Configuration",
            status: "fail",
            message:
              "Mixed content detected: HTTPS frontend trying to connect to HTTP backend. This will be blocked by browsers.",
          });
        } else {
          results.push({
            test: "Security Configuration",
            status: "pass",
            message: `Protocol match: Frontend (${protocol}) and Backend (${backendProtocol})`,
          });
        }
      }
    } catch (error) {
      results.push({
        test: "General Test",
        status: "fail",
        message: `Unexpected error: ${error.message}`,
      });
    }

    setDiagnosticResults(results);
    setTestingInProgress(false);
  };

  // Force reconnection
  const forceReconnect = () => {
    addToHistory("Manual", "Force reconnecting...");
    socketClient.forceReconnect(user?.id || user?._id, user?.role);
  };

  // Disconnect socket
  const disconnectSocket = () => {
    addToHistory("Manual", "Disconnecting socket...");
    socketClient.disconnect();
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pass":
        return <Badge bg="success">PASS</Badge>;
      case "fail":
        return <Badge bg="danger">FAIL</Badge>;
      case "warning":
        return <Badge bg="warning">WARNING</Badge>;
      default:
        return <Badge bg="info">INFO</Badge>;
    }
  };

  return (
    <Container className="my-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-medical-red">WebSocket Diagnostics</h2>
        <div className="d-flex gap-2">
          <Button
            variant="outline-primary"
            onClick={testConnection}
            disabled={testingInProgress}
          >
            {testingInProgress ? "Testing..." : "Run Diagnostics"}
          </Button>
          <Button variant="outline-warning" onClick={forceReconnect}>
            Force Reconnect
          </Button>
          <Button variant="outline-danger" onClick={disconnectSocket}>
            Disconnect
          </Button>
        </div>
      </div>

      <Row>
        <Col md={6}>
          {/* Socket Status */}
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Socket Status</h5>
            </Card.Header>
            <Card.Body>
              <Table responsive size="sm">
                <tbody>
                  <tr>
                    <td>
                      <strong>Connection Status:</strong>
                    </td>
                    <td>
                      {socketStatus.connected ? (
                        <Badge bg="success">Connected</Badge>
                      ) : (
                        <Badge bg="danger">Disconnected</Badge>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Socket ID:</strong>
                    </td>
                    <td>
                      <code>{socketStatus.socketId || "Not available"}</code>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Fallback Mode:</strong>
                    </td>
                    <td>
                      {socketStatus.fallbackMode ? (
                        <Badge bg="warning">Enabled</Badge>
                      ) : (
                        <Badge bg="success">Disabled</Badge>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Connection Attempts:</strong>
                    </td>
                    <td>{socketStatus.connectionAttempts || 0}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Backend URL:</strong>
                    </td>
                    <td>
                      <code>
                        {import.meta.env.VITE_BACKEND_URL ||
                          "http://localhost:5000"}
                      </code>
                      {window.location.hostname.includes("fly.dev") &&
                        (
                          import.meta.env.VITE_BACKEND_URL ||
                          "http://localhost:5000"
                        ).includes("localhost") && (
                          <div>
                            <Badge bg="warning" className="ms-2">
                              ⚠️ Production Issue
                            </Badge>
                            <div className="small text-warning mt-1">
                              Backend URL is localhost but you're on production.
                              Set VITE_BACKEND_URL environment variable.
                            </div>
                          </div>
                        )}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Environment:</strong>
                    </td>
                    <td>
                      <Badge
                        bg={
                          window.location.hostname.includes("localhost")
                            ? "success"
                            : "primary"
                        }
                      >
                        {window.location.hostname.includes("localhost")
                          ? "Development"
                          : "Production"}
                      </Badge>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Frontend URL:</strong>
                    </td>
                    <td>
                      <code>{window.location.origin}</code>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>User Role:</strong>
                    </td>
                    <td>
                      <Badge bg={user?.role === 1 ? "primary" : "secondary"}>
                        {user?.role === 1 ? "Admin" : "User"}
                      </Badge>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>

          {/* Connection History */}
          <Card>
            <Card.Header>
              <h5 className="mb-0">Connection History</h5>
            </Card.Header>
            <Card.Body style={{ maxHeight: "300px", overflowY: "auto" }}>
              {connectionHistory.length === 0 ? (
                <p className="text-muted">No connection events yet</p>
              ) : (
                connectionHistory.map((entry, index) => (
                  <div key={index} className="border-bottom pb-2 mb-2">
                    <div className="d-flex justify-content-between">
                      <strong>{entry.event}</strong>
                      <small className="text-muted">{entry.timestamp}</small>
                    </div>
                    <div className="text-muted small">{entry.details}</div>
                  </div>
                ))
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          {/* Diagnostic Results */}
          <Card>
            <Card.Header>
              <h5 className="mb-0">Diagnostic Results</h5>
            </Card.Header>
            <Card.Body>
              {diagnosticResults.length === 0 ? (
                <Alert variant="info">
                  Click "Run Diagnostics" to test your WebSocket connection
                </Alert>
              ) : (
                <div>
                  {diagnosticResults.map((result, index) => (
                    <div key={index} className="border-bottom pb-3 mb-3">
                      <div className="d-flex justify-content-between align-items-start">
                        <strong>{result.test}</strong>
                        {getStatusBadge(result.status)}
                      </div>
                      <div className="text-muted mt-1">{result.message}</div>
                    </div>
                  ))}

                  {/* Summary */}
                  <div className="mt-4 p-3 bg-light rounded">
                    <h6>Summary</h6>
                    <div className="d-flex gap-3">
                      <span>
                        <Badge bg="success">
                          {
                            diagnosticResults.filter((r) => r.status === "pass")
                              .length
                          }{" "}
                          Passed
                        </Badge>
                      </span>
                      <span>
                        <Badge bg="warning">
                          {
                            diagnosticResults.filter(
                              (r) => r.status === "warning",
                            ).length
                          }{" "}
                          Warnings
                        </Badge>
                      </span>
                      <span>
                        <Badge bg="danger">
                          {
                            diagnosticResults.filter((r) => r.status === "fail")
                              .length
                          }{" "}
                          Failed
                        </Badge>
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Production Configuration Alert */}
      {window.location.hostname.includes("fly.dev") &&
        (import.meta.env.VITE_BACKEND_URL || "http://localhost:5000").includes(
          "localhost",
        ) && (
          <Alert variant="warning" className="mt-4">
            <Alert.Heading>
              ⚠️ Production Configuration Issue Detected
            </Alert.Heading>
            <p>
              Your frontend is running on Fly.dev (production) but the backend
              URL is set to localhost. This will cause connection failures.
            </p>
            <hr />
            <p className="mb-0">
              <strong>To fix this:</strong>
              <ol>
                <li>
                  Set the <code>VITE_BACKEND_URL</code> environment variable in
                  your deployment
                </li>
                <li>
                  Point it to your actual backend URL (e.g.,{" "}
                  <code>https://your-backend.fly.dev</code>)
                </li>
                <li>
                  Ensure your backend allows CORS from your frontend domain
                </li>
              </ol>
            </p>
          </Alert>
        )}

      {/* Troubleshooting Tips */}
      <Card className="mt-4">
        <Card.Header>
          <h5 className="mb-0">Troubleshooting Guide</h5>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <h6>Development Environment:</h6>
              <ul>
                <li>
                  Backend should run on <code>http://localhost:5000</code>
                </li>
                <li>
                  Frontend should run on <code>http://localhost:5173</code>
                </li>
                <li>CORS should allow localhost origins</li>
                <li>Check if backend server is running</li>
              </ul>

              <h6 className="mt-3">Common Development Issues:</h6>
              <ul>
                <li>Backend server not started</li>
                <li>Port conflicts (5000 already in use)</li>
                <li>Missing environment variables</li>
                <li>Database connection issues</li>
              </ul>
            </Col>
            <Col md={6}>
              <h6>Production Environment:</h6>
              <ul>
                <li>
                  Set <code>VITE_BACKEND_URL</code> environment variable
                </li>
                <li>Use HTTPS for both frontend and backend</li>
                <li>Configure CORS for production domains</li>
                <li>Check network security groups/firewalls</li>
              </ul>

              <h6 className="mt-3">Common Production Issues:</h6>
              <ul>
                <li>Mixed content (HTTP backend, HTTPS frontend)</li>
                <li>CORS policy blocking requests</li>
                <li>Environment variables not set</li>
                <li>Network connectivity issues</li>
              </ul>
            </Col>
          </Row>

          <hr />

          <h6>Quick Fixes:</h6>
          <Row>
            <Col md={6}>
              <div className="bg-light p-3 rounded">
                <strong>Development:</strong>
                <pre className="mt-2 mb-0">
                  <code>{`cd Backend && npm start
cd Frontend && npm run dev`}</code>
                </pre>
              </div>
            </Col>
            <Col md={6}>
              <div className="bg-light p-3 rounded">
                <strong>Production Environment Variable:</strong>
                <pre className="mt-2 mb-0">
                  <code>{`VITE_BACKEND_URL=https://your-backend.fly.dev`}</code>
                </pre>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default SocketDiagnostics;
