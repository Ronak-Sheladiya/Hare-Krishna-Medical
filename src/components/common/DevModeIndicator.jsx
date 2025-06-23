import React, { useState, useEffect } from "react";
import { Alert } from "react-bootstrap";
import { api, safeApiCall } from "../../utils/apiClient";

const DevModeIndicator = () => {
  const [backendStatus, setBackendStatus] = useState("checking");
  const [showIndicator, setShowIndicator] = useState(false);

  useEffect(() => {
    // Only show in development mode
    if (!import.meta.env.DEV) return;

    checkBackendStatus();
    setShowIndicator(true);

    // Hide after 10 seconds
    const timer = setTimeout(() => {
      setShowIndicator(false);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  const checkBackendStatus = async () => {
    try {
      // Use safeApiCall to properly handle all error types
      const result = await import("../../utils/apiClient").then(
        ({ safeApiCall, api }) =>
          safeApiCall(() => api.get("/api/health", { timeout: 3000 }), null),
      );

      if (result.success) {
        setBackendStatus("connected");
      } else {
        setBackendStatus("disconnected");
      }
    } catch (error) {
      // Fallback error handling
      console.warn("Backend status check failed:", error);
      setBackendStatus("disconnected");
    }
  };

  if (!import.meta.env.DEV || !showIndicator) return null;

  const getStatusInfo = () => {
    switch (backendStatus) {
      case "checking":
        return {
          variant: "info",
          icon: "bi-clock",
          message: "Checking backend connection...",
        };
      case "connected":
        return {
          variant: "success",
          icon: "bi-check-circle",
          message: "Backend API is connected and running",
        };
      case "disconnected":
        return {
          variant: "warning",
          icon: "bi-exclamation-triangle",
          message: `Backend API not available at ${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}. Start the backend server to see real data.`,
        };
      default:
        return null;
    }
  };

  const statusInfo = getStatusInfo();
  if (!statusInfo) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        zIndex: 1050,
        maxWidth: "400px",
        animation: "slideInRight 0.5s ease-out",
      }}
    >
      <Alert
        variant={statusInfo.variant}
        dismissible
        onClose={() => setShowIndicator(false)}
        className="d-flex align-items-center shadow-lg"
        style={{
          borderRadius: "12px",
          border: "none",
          fontSize: "14px",
        }}
      >
        <i className={`${statusInfo.icon} me-2`}></i>
        <div>
          <strong>Development Mode:</strong>
          <br />
          {statusInfo.message}
        </div>
      </Alert>

      <style>
        {`
          @keyframes slideInRight {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
        `}
      </style>
    </div>
  );
};

export default DevModeIndicator;
