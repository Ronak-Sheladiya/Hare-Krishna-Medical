import React, { useState, useEffect } from "react";
import { Card, Button, Alert, Spinner, Form, Badge } from "react-bootstrap";
import { api } from "../../utils/apiClient";
import socketClient from "../../utils/socketClient";

const CRUDTest = () => {
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [realtimeData, setRealtimeData] = useState([]);
  const [socketStatus, setSocketStatus] = useState({
    connected: false,
    id: null,
  });

  // Test CRUD operations
  const runCRUDTests = async () => {
    setLoading(true);
    setTestResults([]);

    const tests = [
      {
        name: "Health Check",
        operation: () => api.get("/api/health"),
        type: "READ",
      },
      {
        name: "Fetch Products",
        operation: () => api.get("/api/products?limit=5"),
        type: "READ",
      },
      {
        name: "Get User Profile",
        operation: () => api.get("/api/auth/profile"),
        type: "READ",
      },
      {
        name: "Test Contact Form",
        operation: () =>
          api.post("/api/messages/contact", {
            name: "Test User",
            email: "test@example.com",
            subject: "CRUD Test",
            message: "Testing CRUD operations",
            category: "general",
            priority: "normal",
          }),
        type: "CREATE",
      },
    ];

    for (const test of tests) {
      try {
        const startTime = Date.now();
        const result = await test.operation();
        const endTime = Date.now();

        setTestResults((prev) => [
          ...prev,
          {
            ...test,
            status: result.success !== false ? "SUCCESS" : "FAILED",
            response: result,
            duration: endTime - startTime,
            timestamp: new Date().toISOString(),
          },
        ]);
      } catch (error) {
        setTestResults((prev) => [
          ...prev,
          {
            ...test,
            status: "ERROR",
            error: error.message,
            duration: 0,
            timestamp: new Date().toISOString(),
          },
        ]);
      }
    }

    setLoading(false);
  };

  // Test real-time connection
  useEffect(() => {
    const updateSocketStatus = () => {
      if (socketClient) {
        const status = socketClient.getConnectionStatus();
        setSocketStatus(status);
      }
    };

    updateSocketStatus();
    const interval = setInterval(updateSocketStatus, 2000);

    // Listen for real-time events
    if (socketClient && socketClient.on) {
      socketClient.on("connection-confirmed", (data) => {
        setRealtimeData((prev) => [
          ...prev,
          {
            type: "CONNECTION",
            message: "Socket connected successfully",
            data,
            timestamp: new Date().toISOString(),
          },
        ]);
      });

      socketClient.on("admin_notification", (data) => {
        setRealtimeData((prev) => [
          ...prev,
          {
            type: "ADMIN_NOTIFICATION",
            message: "Received admin notification",
            data,
            timestamp: new Date().toISOString(),
          },
        ]);
      });

      socketClient.on("global_notification", (data) => {
        setRealtimeData((prev) => [
          ...prev,
          {
            type: "GLOBAL_NOTIFICATION",
            message: "Received global notification",
            data,
            timestamp: new Date().toISOString(),
          },
        ]);
      });
    }

    return () => {
      clearInterval(interval);
      if (socketClient && socketClient.off) {
        socketClient.off("connection-confirmed");
        socketClient.off("admin_notification");
        socketClient.off("global_notification");
      }
    };
  }, []);

  const sendTestNotification = () => {
    if (socketClient && socketClient.emit) {
      socketClient.emit("send-notification", {
        target: "global",
        type: "test",
        title: "Test Notification",
        message: "Testing real-time functionality",
        timestamp: new Date().toISOString(),
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "SUCCESS":
        return "success";
      case "FAILED":
        return "warning";
      case "ERROR":
        return "danger";
      default:
        return "secondary";
    }
  };

  return (
    <Card className="mb-4">
      <Card.Header>
        <h5>🔧 CRUD & Real-time Test Dashboard</h5>
      </Card.Header>
      <Card.Body>
        {/* Socket Status */}
        <div className="mb-3">
          <h6>📡 Real-time Connection Status</h6>
          <Badge
            bg={socketStatus.connected ? "success" : "danger"}
            className="me-2"
          >
            {socketStatus.connected ? "Connected" : "Disconnected"}
          </Badge>
          {socketStatus.socketId && (
            <Badge bg="info">ID: {socketStatus.socketId}</Badge>
          )}
          {socketStatus.connected && (
            <Button
              size="sm"
              variant="outline-primary"
              className="ms-2"
              onClick={sendTestNotification}
            >
              Send Test Event
            </Button>
          )}
        </div>

        {/* CRUD Tests */}
        <div className="mb-3">
          <h6>🛠️ CRUD Operations Test</h6>
          <Button
            onClick={runCRUDTests}
            disabled={loading}
            variant="primary"
            className="mb-3"
          >
            {loading ? (
              <>
                <Spinner size="sm" className="me-2" />
                Running Tests...
              </>
            ) : (
              "Run CRUD Tests"
            )}
          </Button>

          {testResults.length > 0 && (
            <div style={{ maxHeight: "300px", overflowY: "auto" }}>
              {testResults.map((test, index) => (
                <Alert
                  key={index}
                  variant={getStatusColor(test.status)}
                  className="py-2 mb-2"
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <strong>{test.name}</strong>
                    <div>
                      <Badge bg="secondary" className="me-1">
                        {test.type}
                      </Badge>
                      <Badge bg={getStatusColor(test.status)}>
                        {test.status}
                      </Badge>
                      {test.duration > 0 && (
                        <Badge bg="info" className="ms-1">
                          {test.duration}ms
                        </Badge>
                      )}
                    </div>
                  </div>
                  {test.error && (
                    <div className="mt-1 small">Error: {test.error}</div>
                  )}
                  {test.response && (
                    <div className="mt-1 small">
                      Response:{" "}
                      {JSON.stringify(test.response).substring(0, 100)}...
                    </div>
                  )}
                </Alert>
              ))}
            </div>
          )}
        </div>

        {/* Real-time Events */}
        <div>
          <h6>⚡ Real-time Events</h6>
          {realtimeData.length === 0 ? (
            <Alert variant="info">No real-time events received yet</Alert>
          ) : (
            <div style={{ maxHeight: "200px", overflowY: "auto" }}>
              {realtimeData.slice(-10).map((event, index) => (
                <Alert key={index} variant="success" className="py-2 mb-1">
                  <div className="d-flex justify-content-between">
                    <span>
                      <strong>{event.type}:</strong> {event.message}
                    </span>
                    <small>
                      {new Date(event.timestamp).toLocaleTimeString()}
                    </small>
                  </div>
                </Alert>
              ))}
            </div>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default CRUDTest;
