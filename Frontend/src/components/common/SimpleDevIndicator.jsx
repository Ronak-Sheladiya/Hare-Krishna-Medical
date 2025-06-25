import React, { useState, useEffect } from "react";
import { Alert } from "react-bootstrap";

const SimpleDevIndicator = () => {
  const [showIndicator, setShowIndicator] = useState(false);

  useEffect(() => {
    // Only show in development mode
    if (!import.meta.env.DEV) return;

    setShowIndicator(true);

    // Hide after 8 seconds
    const timer = setTimeout(() => {
      setShowIndicator(false);
    }, 8000);

    return () => clearTimeout(timer);
  }, []);

  if (!import.meta.env.DEV || !showIndicator) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        zIndex: 1050,
        maxWidth: "350px",
        animation: "slideInRight 0.5s ease-out",
      }}
    >
      <Alert
        variant="info"
        dismissible
        onClose={() => setShowIndicator(false)}
        className="d-flex align-items-center shadow-lg"
        style={{
          borderRadius: "12px",
          border: "none",
          fontSize: "14px",
          backgroundColor: "#e3f2fd",
          borderColor: "#2196f3",
          color: "#1976d2",
        }}
      >
        <i className="bi bi-code-slash me-2"></i>
        <div>
          <strong>Development Mode</strong>
          <br />
          App is running with graceful API fallbacks. Backend at{" "}
          <code>
            {import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}
          </code>
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

export default SimpleDevIndicator;
