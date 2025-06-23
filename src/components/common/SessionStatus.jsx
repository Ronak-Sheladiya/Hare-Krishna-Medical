import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Badge, Card, Collapse, Button } from "react-bootstrap";
import centralSessionManager from "../../utils/centralSessionManager.js";

const SessionStatus = ({ showDebug = false }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [sessionInfo, setSessionInfo] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const updateSessionInfo = () => {
      setSessionInfo(centralSessionManager.getSessionInfo());
    };

    updateSessionInfo();
    const interval = setInterval(updateSessionInfo, 5000);

    return () => clearInterval(interval);
  }, []);

  if (!showDebug) return null;

  const formatDuration = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        zIndex: 9999,
        maxWidth: "300px",
      }}
    >
      <Button
        variant={isAuthenticated ? "success" : "secondary"}
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          borderRadius: "20px",
          padding: "8px 16px",
          fontWeight: "600",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        }}
      >
        <i className="bi bi-shield-check me-2"></i>
        Session Status
        <Badge
          bg={isAuthenticated ? "light" : "dark"}
          text={isAuthenticated ? "dark" : "light"}
          className="ms-2"
        >
          {isAuthenticated ? "Active" : "Inactive"}
        </Badge>
      </Button>

      <Collapse in={isOpen}>
        <Card
          className="mt-2"
          style={{
            borderRadius: "12px",
            border: "none",
            boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
          }}
        >
          <Card.Header
            style={{
              background: "linear-gradient(135deg, #e63946, #dc3545)",
              color: "white",
              borderRadius: "12px 12px 0 0",
            }}
          >
            <h6 className="mb-0">
              <i className="bi bi-info-circle me-2"></i>
              HK Medical Session
            </h6>
          </Card.Header>
          <Card.Body style={{ padding: "15px", fontSize: "14px" }}>
            {sessionInfo && (
              <>
                <div className="mb-2">
                  <strong>Status:</strong>{" "}
                  <Badge
                    bg={sessionInfo.isAuthenticated ? "success" : "secondary"}
                  >
                    {sessionInfo.isAuthenticated ? "Authenticated" : "Guest"}
                  </Badge>
                </div>

                {sessionInfo.isAuthenticated && (
                  <>
                    <div className="mb-2">
                      <strong>User:</strong>{" "}
                      {sessionInfo.user?.fullName || "N/A"}
                    </div>
                    <div className="mb-2">
                      <strong>Role:</strong>{" "}
                      <Badge
                        bg={sessionInfo.user?.role === 1 ? "warning" : "info"}
                      >
                        {sessionInfo.user?.role === 1 ? "Admin" : "User"}
                      </Badge>
                    </div>
                    <div className="mb-2">
                      <strong>Session Age:</strong>{" "}
                      {formatDuration(sessionInfo.sessionAge)}
                    </div>
                    <div className="mb-2">
                      <strong>Valid:</strong>{" "}
                      <Badge
                        bg={sessionInfo.sessionValid ? "success" : "danger"}
                      >
                        {sessionInfo.sessionValid ? "Yes" : "No"}
                      </Badge>
                    </div>
                  </>
                )}

                <div className="mb-2">
                  <strong>Tab ID:</strong>{" "}
                  <code style={{ fontSize: "12px" }}>
                    {sessionInfo.tabId.slice(-8)}
                  </code>
                </div>

                <div className="d-flex gap-1 mt-3">
                  <Button
                    size="sm"
                    variant="outline-primary"
                    onClick={() => centralSessionManager.extendSession()}
                    disabled={!sessionInfo.isAuthenticated}
                  >
                    <i className="bi bi-arrow-clockwise"></i>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline-danger"
                    onClick={() => centralSessionManager.forceLogout("Manual")}
                    disabled={!sessionInfo.isAuthenticated}
                  >
                    <i className="bi bi-box-arrow-right"></i>
                  </Button>
                </div>
              </>
            )}
          </Card.Body>
        </Card>
      </Collapse>
    </div>
  );
};

export default SessionStatus;
