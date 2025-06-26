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

        // Try to connect
        const socket = socketClient.connect(user?.id || user?._id, user?.role);

        if (socket) {
          results.push({
            test: "Socket Connection",
            status: "pass",
            message: "Socket connection established successfully",
          });

          // Test 4: Test event emission
          const testEventSent = socketClient.emit("test-event", { test: true });

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
              message: "Failed to emit test event",
            });
          }

          addToHistory("Test", "Socket connection test completed");
        } else {
          results.push({
            test: "Socket Connection",
            status: "fail",
            message: "Failed to establish socket connection",
          });
        }
      } catch (error) {
        results.push({
          test: "Socket Connection",
          status: "fail",
          message: `Connection error: ${error.message}`,
        });
        addToHistory("Error", `Connection failed: ${error.message}`);
      }

      // Test 5: Network configuration
      const isLocalhost = window.location.hostname === "localhost";
      results.push({
        test: "Network Configuration",
        status: isLocalhost ? "pass" : "info",
        message: isLocalhost
          ? "Running on localhost - should work fine"
          : "Running on remote host - check CORS and network settings",
      });
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

      {/* Troubleshooting Tips */}
      <Card className="mt-4">
        <Card.Header>
          <h5 className="mb-0">Troubleshooting Tips</h5>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <h6>Common Issues:</h6>
              <ul>
                <li>Backend server is not running</li>
                <li>CORS configuration issues</li>
                <li>Network firewall blocking WebSocket connections</li>
                <li>Browser blocking mixed content (HTTP/HTTPS)</li>
              </ul>
            </Col>
            <Col md={6}>
              <h6>Solutions:</h6>
              <ul>
                <li>Ensure backend is running on port 5000</li>
                <li>Check CORS settings in backend server.js</li>
                <li>Try using polling transport as fallback</li>
                <li>Use HTTPS in production environments</li>
              </ul>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default SocketDiagnostics;
