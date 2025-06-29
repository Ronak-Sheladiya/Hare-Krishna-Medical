import React, { useState, useEffect } from "react";
import { Alert, Badge } from "react-bootstrap";
import smartApi from "../../utils/smartApiClient";

const SimpleModeIndicator = ({ show = true }) => {
  const [mode, setMode] = useState("checking");
  const [hostname] = useState(
    typeof window !== "undefined" ? window.location.hostname : "",
  );

  useEffect(() => {
    if (show) {
      checkMode();
      // Check mode every 30 seconds
      const interval = setInterval(checkMode, 30000);
      return () => clearInterval(interval);
    }
  }, [show]);

  const checkMode = () => {
    const status = smartApi.getStatus();
    setMode(status.mode);
  };

  if (!show) return null;

  // Only show for fly.dev or when backend is unavailable
  if (!hostname.includes("fly.dev") && mode === "backend") {
    return null;
  }

  const getModeInfo = () => {
    switch (mode) {
      case "backend":
        return {
          color: "success",
          text: "🟢 Server Connected",
          description: "All features available",
        };
      case "client-side":
        return {
          color: "warning",
          text: "🟡 Client-Side Mode",
          description:
            "Profile updates work locally. Data saved in your browser.",
        };
      case "unavailable":
        return {
          color: "danger",
          text: "🔴 Limited Mode",
          description: "Some features may not work",
        };
      default:
        return {
          color: "secondary",
          text: "⚪ Checking...",
          description: "Determining connectivity...",
        };
    }
  };

  const modeInfo = getModeInfo();

  return (
    <Alert
      variant={
        modeInfo.color === "success"
          ? "success"
          : modeInfo.color === "warning"
            ? "warning"
            : "info"
      }
      className="mb-3"
    >
      <div className="d-flex align-items-center gap-2">
        <Badge bg={modeInfo.color}>{modeInfo.text}</Badge>
        <small>{modeInfo.description}</small>
      </div>

      {hostname.includes("fly.dev") && mode === "client-side" && (
        <div className="mt-2">
          <small>
            <strong>Fly.dev Notice:</strong> Your app is running in client-side
            mode because the backend server connection is not available. This is
            normal for some cloud deployments. Your profile updates will still
            work and be saved locally.
          </small>
        </div>
      )}
    </Alert>
  );
};

export default SimpleModeIndicator;
