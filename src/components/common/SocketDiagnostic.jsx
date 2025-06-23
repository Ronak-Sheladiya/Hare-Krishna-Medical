import React, { useState, useEffect } from "react";
import { Card, Alert, Badge, Button, Row, Col } from "react-bootstrap";
import { useSelector } from "react-redux";

const SocketDiagnostic = ({ onClose }) => {
  const [diagnostics, setDiagnostics] = useState({});
  const [isVisible, setIsVisible] = useState(true);
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) return;

    const runDiagnostics = async () => {
      const results = {
        timestamp: new Date().toISOString(),
        environment: {
          userAgent: navigator.userAgent,
          url: window.location.href,
          protocol: window.location.protocol,
          isSecure: window.location.protocol === "https:",
        },
        configuration: {
          socketUrl: import.meta.env.VITE_SOCKET_URL || "Not configured",
          backendUrl: import.meta.env.VITE_BACKEND_URL || "Not configured",
          nodeEnv: import.meta.env.NODE_ENV || "Not set",
        },
        webSocketSupport: {
          available: typeof WebSocket !== "undefined",
          binaryType:
            typeof WebSocket !== "undefined" ? "supported" : "not available",
        },
        socketIoStatus: {
          installed: false,
          connected: false,
          fallbackMode: false,
          error: null,
        },
      };

      // Test socket.io availability
      try {
        const socketModule = await import("../../utils/socketClient");
        const socketClient = socketModule.default;

        if (socketClient) {
          const status = socketClient.getConnectionStatus();
          results.socketIoStatus = {
            installed: true,
            connected: status.connected,
            fallbackMode: status.fallbackMode,
            attempts: status.attempts,
            error: status.lastError,
            socketId: status.socketId,
          };
        }
      } catch (error) {
        results.socketIoStatus.error = error.message;
      }

      // Test basic connectivity
      try {
        const backendUrl =
          import.meta.env.VITE_BACKEND_URL || window.location.origin;
        const response = await fetch(`${backendUrl}/health`, {
          method: "GET",
          timeout: 5000,
        });
        results.backendConnectivity = {
          reachable: response.ok,
          status: response.status,
          url: backendUrl,
        };
      } catch (error) {
        results.backendConnectivity = {
          reachable: false,
          error: error.message,
          url: import.meta.env.VITE_BACKEND_URL || "Not configured",
        };
      }

      setDiagnostics(results);
    };

    runDiagnostics();
  }, [isAuthenticated]);

  const getStatusBadge = (condition, trueText = "OK", falseText = "Issue") => {
    return (
      <Badge bg={condition ? "success" : "danger"}>
        {condition ? trueText : falseText}
      </Badge>
    );
  };

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  if (!isVisible || !isAuthenticated || user?.role !== 1) return null;

  return (
    <Card
      className="position-fixed"
      style={{
        top: "20px",
        left: "20px",
        width: "400px",
        zIndex: 9999,
        boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
      }}
    >
      <Card.Header className="d-flex justify-content-between align-items-center bg-info text-white">
        <h6 className="mb-0">
          <i className="bi bi-bug me-2"></i>
          WebSocket Diagnostics
        </h6>
        <Button
          variant="link"
          size="sm"
          className="text-white p-0"
          onClick={handleClose}
        >
          <i className="bi bi-x-lg"></i>
        </Button>
      </Card.Header>

      <Card.Body style={{ maxHeight: "500px", overflowY: "auto" }}>
        {/* Socket.io Status */}
        <div className="mb-3">
          <h6>Socket.io Status</h6>
          <Row>
            <Col xs={6}>Installed:</Col>
            <Col xs={6}>
              {getStatusBadge(diagnostics.socketIoStatus?.installed)}
            </Col>
          </Row>
          <Row>
            <Col xs={6}>Connected:</Col>
            <Col xs={6}>
              {getStatusBadge(diagnostics.socketIoStatus?.connected)}
            </Col>
          </Row>
          <Row>
            <Col xs={6}>Mode:</Col>
            <Col xs={6}>
              <Badge
                bg={
                  diagnostics.socketIoStatus?.fallbackMode
                    ? "warning"
                    : "success"
                }
              >
                {diagnostics.socketIoStatus?.fallbackMode
                  ? "Fallback"
                  : "Real-time"}
              </Badge>
            </Col>
          </Row>
          {diagnostics.socketIoStatus?.error && (
            <Alert variant="danger" className="mt-2 py-2">
              <small>
                <strong>Error:</strong> {diagnostics.socketIoStatus.error}
              </small>
            </Alert>
          )}
        </div>

        {/* WebSocket Support */}
        <div className="mb-3">
          <h6>WebSocket Support</h6>
          <Row>
            <Col xs={6}>Browser Support:</Col>
            <Col xs={6}>
              {getStatusBadge(diagnostics.webSocketSupport?.available)}
            </Col>
          </Row>
        </div>

        {/* Backend Connectivity */}
        <div className="mb-3">
          <h6>Backend Connectivity</h6>
          <Row>
            <Col xs={6}>Reachable:</Col>
            <Col xs={6}>
              {getStatusBadge(diagnostics.backendConnectivity?.reachable)}
            </Col>
          </Row>
          <small className="text-muted">
            URL: {diagnostics.backendConnectivity?.url}
          </small>
          {diagnostics.backendConnectivity?.error && (
            <Alert variant="warning" className="mt-2 py-2">
              <small>
                <strong>Error:</strong> {diagnostics.backendConnectivity.error}
              </small>
            </Alert>
          )}
        </div>

        {/* Configuration */}
        <div className="mb-3">
          <h6>Configuration</h6>
          <small>
            <div>
              <strong>Socket URL:</strong>{" "}
              {diagnostics.configuration?.socketUrl}
            </div>
            <div>
              <strong>Backend URL:</strong>{" "}
              {diagnostics.configuration?.backendUrl}
            </div>
            <div>
              <strong>Environment:</strong> {diagnostics.configuration?.nodeEnv}
            </div>
            <div>
              <strong>Protocol:</strong> {diagnostics.environment?.protocol}
            </div>
          </small>
        </div>

        {/* Recommendations */}
        <Alert variant="info" className="py-2">
          <small>
            <strong>💡 Quick Fixes:</strong>
            <ul className="mb-0 mt-1">
              <li>Ensure backend server is running on the configured URL</li>
              <li>
                Check if WebSocket connections are allowed by your
                network/firewall
              </li>
              <li>
                For local development, make sure backend is running on port 5000
              </li>
              <li>
                For production, ensure proper CORS and WebSocket configuration
              </li>
            </ul>
          </small>
        </Alert>

        <div className="text-center">
          <Button
            variant="outline-primary"
            size="sm"
            onClick={() => window.location.reload()}
          >
            <i className="bi bi-arrow-clockwise me-1"></i>
            Retry Connection
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default SocketDiagnostic;
