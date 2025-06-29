import React, { useState, useEffect } from "react";
import { Alert, Badge, Spinner } from "react-bootstrap";
import unifiedApi from "../../utils/unifiedApiClient";
import smartApi from "../../utils/smartApiClient";

const BackendStatusIndicator = ({ show = true, onStatusChange = null }) => {
  const [status, setStatus] = useState("checking"); // checking, online, offline, slow
  const [lastCheck, setLastCheck] = useState(null);
  const [responseTime, setResponseTime] = useState(null);

  useEffect(() => {
    if (show) {
      checkBackendStatus();
      // Check every 30 seconds
      const interval = setInterval(checkBackendStatus, 30000);
      return () => clearInterval(interval);
    }
  }, [show]);

  const checkBackendStatus = async () => {
    if (!show) return;

    const startTime = Date.now();

    // Try multiple methods to check backend connectivity
    const checkMethods = [
      // Method 1: Try unified API with health endpoint
      async () => {
        return await unifiedApi.get("/api/health", {
          timeout: 8000,
          retries: 0,
        });
      },
      // Method 2: Try direct fetch with relative URL (works with proxy)
      async () => {
        const response = await fetch("/api/health", {
          method: "GET",
          headers: { Accept: "application/json" },
          signal: AbortSignal.timeout(8000),
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return await response.json();
      },
      // Method 3: Try a simple auth endpoint that we know works
      async () => {
        return await unifiedApi.get("/api/debug-auth/users", {
          timeout: 8000,
          retries: 0,
        });
      },
    ];

    let lastError;

    for (let i = 0; i < checkMethods.length; i++) {
      try {
        await checkMethods[i]();
        const responseTime = Date.now() - startTime;

        setResponseTime(responseTime);
        setLastCheck(new Date());

        if (responseTime > 8000) {
          setStatus("slow");
        } else {
          setStatus("online");
        }

        if (onStatusChange) {
          onStatusChange({ status: "online", responseTime });
        }

        console.log(
          `✅ Backend status check succeeded with method ${i + 1}, response time: ${responseTime}ms`,
        );
        return; // Success, exit function
      } catch (error) {
        lastError = error;
        console.log(
          `❌ Backend status check method ${i + 1} failed:`,
          error.message,
        );
        continue; // Try next method
      }
    }

    // All methods failed
    console.log(
      "❌ All backend status check methods failed:",
      lastError?.message,
    );
    setStatus("offline");
    setLastCheck(new Date());

    if (onStatusChange) {
      onStatusChange({ status: "offline", error: lastError?.message });
    }
  };
  if (!show) return null;

  const getStatusColor = () => {
    switch (status) {
      case "online":
        return "success";
      case "slow":
        return "warning";
      case "offline":
        return "danger";
      case "checking":
        return "secondary";
      default:
        return "secondary";
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "online":
        return responseTime ? `Online (${responseTime}ms)` : "Online";
      case "slow":
        return `Slow (${responseTime}ms)`;
      case "offline":
        return "Offline";
      case "checking":
        return "Checking...";
      default:
        return "Unknown";
    }
  };

  const getStatusMessage = () => {
    switch (status) {
      case "online":
        return null;
      case "slow":
        return (
          <Alert variant="warning" className="mb-2">
            <small>
              ⚠️ The server is responding slowly. This is normal for free
              hosting services that may need time to wake up. Your requests may
              take longer than usual.
            </small>
          </Alert>
        );
      case "offline":
        return (
          <Alert variant="danger" className="mb-2">
            <small>
              ❌ Cannot connect to the server. This might be temporary. Please
              check your internet connection or try again later.
            </small>
          </Alert>
        );
      case "checking":
        return null;
      default:
        return null;
    }
  };

  return (
    <div className="backend-status-indicator">
      {getStatusMessage()}

      <div className="d-flex align-items-center gap-2 mb-2">
        <small className="text-muted">Backend Status:</small>
        <Badge bg={getStatusColor()}>
          {status === "checking" && <Spinner size="sm" className="me-1" />}
          {getStatusText()}
        </Badge>
        {lastCheck && (
          <small className="text-muted">
            Last checked: {lastCheck.toLocaleTimeString()}
          </small>
        )}
      </div>
    </div>
  );
};

export default BackendStatusIndicator;
