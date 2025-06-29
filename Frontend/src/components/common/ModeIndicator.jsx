import React, { useState, useEffect } from "react";
import { Alert, Badge, Button } from "react-bootstrap";
import smartApi from "../../utils/smartApiClient";

const ModeIndicator = ({ show = true }) => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (show) {
      checkStatus();
      // Check every 30 seconds
      const interval = setInterval(checkStatus, 30000);
      return () => clearInterval(interval);
    }
  }, [show]);

  const checkStatus = async () => {
    const currentStatus = smartApi.getStatus();
    setStatus(currentStatus);
  };

  const forceCheck = async () => {
    setLoading(true);
    try {
      await smartApi.forceBackendCheck();
      await checkStatus();
    } finally {
      setLoading(false);
    }
  };

  if (!show || !status) return null;

  const getModeColor = () => {
    switch (status.mode) {
      case "backend":
        return "success";
      case "client-side":
        return "warning";
      case "unavailable":
        return "danger";
      default:
        return "secondary";
    }
  };

  const getModeText = () => {
    switch (status.mode) {
      case "backend":
        return "Server Connected";
      case "client-side":
        return "Client-Side Mode";
      case "unavailable":
        return "Offline";
      default:
        return "Unknown";
    }
  };

  const getModeDescription = () => {
    switch (status.mode) {
      case "backend":
        return "Connected to the backend server. All features are available.";
      case "client-side":
        return "Backend server is not available. Running in client-side mode with limited features. Data is stored locally in your browser.";
      case "unavailable":
        return "No connectivity available. Some features may not work.";
      default:
        return "Checking connectivity...";
    }
  };

  return (
    <div className="mode-indicator mb-3">
      <div className="d-flex align-items-center gap-2 mb-2">
        <Badge bg={getModeColor()}>{getModeText()}</Badge>

        <Button
          size="sm"
          variant="outline-secondary"
          onClick={forceCheck}
          disabled={loading}
        >
          {loading ? "Checking..." : "Refresh"}
        </Button>

        {status.lastChecked > 0 && (
          <small className="text-muted">
            Last checked: {new Date(status.lastChecked).toLocaleTimeString()}
          </small>
        )}
      </div>

      {status.mode !== "backend" && (
        <Alert
          variant={status.mode === "client-side" ? "warning" : "danger"}
          className="mb-0"
        >
          <small>
            <strong>Note:</strong> {getModeDescription()}
            {status.mode === "client-side" && (
              <>
                <br />
                <strong>Client-side features:</strong> Profile updates, basic
                settings (stored in browser)
                <br />
                <strong>Unavailable:</strong> Email notifications, server-side
                data sync, real-time updates
              </>
            )}
          </small>
        </Alert>
      )}
    </div>
  );
};

export default ModeIndicator;
