import React, { useState, useEffect } from "react";
import { Badge, Tooltip, OverlayTrigger } from "react-bootstrap";
import { useSelector } from "react-redux";

const RealTimeStatus = ({ position = "fixed" }) => {
  const [connectionStatus, setConnectionStatus] = useState("connecting");
  const [lastUpdate, setLastUpdate] = useState(null);
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      setConnectionStatus("disconnected");
      return;
    }

    let statusTimeout;
    let socket = null;

    const initializeConnection = async () => {
      try {
        // Import socket client
        const socketModule = await import("../../utils/socketClient");
        const socketClient = socketModule.default;

        if (socketClient && typeof socketClient.connect === "function") {
          socket = socketClient.connect();

          if (socket) {
            setConnectionStatus("connected");
            setLastUpdate(new Date());

            // Listen for connection events
            socket.on("connect", () => {
              setConnectionStatus("connected");
              setLastUpdate(new Date());
            });

            socket.on("disconnect", () => {
              setConnectionStatus("disconnected");
            });

            socket.on("reconnect", () => {
              setConnectionStatus("connected");
              setLastUpdate(new Date());
            });

            // Listen for any data update to show activity
            socket.on("data_updated", () => {
              setLastUpdate(new Date());
            });

            // Simulate heartbeat
            const heartbeat = setInterval(() => {
              if (socket && socket.connected) {
                setLastUpdate(new Date());
              }
            }, 30000); // 30 seconds

            return () => clearInterval(heartbeat);
          }
        } else {
          setConnectionStatus("mock");
        }
      } catch (error) {
        console.warn("Real-time connection failed:", error);
        setConnectionStatus("error");
      }
    };

    // Initialize with delay
    statusTimeout = setTimeout(initializeConnection, 2000);

    return () => {
      clearTimeout(statusTimeout);
      if (socket) {
        try {
          socket.off("connect");
          socket.off("disconnect");
          socket.off("reconnect");
          socket.off("data_updated");
        } catch (error) {
          console.warn("Error cleaning up socket listeners:", error);
        }
      }
    };
  }, [isAuthenticated]);

  const getStatusConfig = () => {
    switch (connectionStatus) {
      case "connected":
        return {
          variant: "success",
          icon: "bi-wifi",
          text: "Live",
          tooltip: `Real-time connection active${lastUpdate ? ` (Last update: ${lastUpdate.toLocaleTimeString()})` : ""}`,
        };
      case "connecting":
        return {
          variant: "warning",
          icon: "bi-arrow-repeat",
          text: "Connecting",
          tooltip: "Establishing real-time connection...",
        };
      case "disconnected":
        return {
          variant: "danger",
          icon: "bi-wifi-off",
          text: "Offline",
          tooltip: "Real-time connection lost. Data may not be current.",
        };
      case "mock":
        return {
          variant: "info",
          icon: "bi-gear",
          text: "Mock",
          tooltip:
            "Running in mock mode. Install socket.io-client for real-time features.",
        };
      case "error":
        return {
          variant: "secondary",
          icon: "bi-exclamation-triangle",
          text: "Error",
          tooltip: "Real-time connection error. Check console for details.",
        };
      default:
        return {
          variant: "secondary",
          icon: "bi-question",
          text: "Unknown",
          tooltip: "Connection status unknown",
        };
    }
  };

  const config = getStatusConfig();

  // Don't show for non-authenticated users
  if (!isAuthenticated) return null;

  const statusBadge = (
    <Badge
      bg={config.variant}
      className="d-flex align-items-center gap-1"
      style={{
        fontSize: "0.75rem",
        padding: "4px 8px",
        borderRadius: "8px",
        cursor: "help",
        transition: "all 0.3s ease",
        ...(position === "fixed" && {
          position: "fixed",
          bottom: "20px",
          right: "20px",
          zIndex: 1000,
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        }),
      }}
    >
      <i
        className={`${config.icon} ${connectionStatus === "connecting" ? "spin" : ""}`}
      ></i>
      {config.text}
      {connectionStatus === "connected" && (
        <span
          className="pulse-dot"
          style={{
            width: "6px",
            height: "6px",
            backgroundColor: "currentColor",
            borderRadius: "50%",
            marginLeft: "2px",
            animation: "pulse 2s infinite",
          }}
        />
      )}
    </Badge>
  );

  return (
    <OverlayTrigger
      placement="left"
      overlay={
        <Tooltip id="realtime-status-tooltip">
          {config.tooltip}
          {user?.role === 1 && connectionStatus === "connected" && (
            <div style={{ marginTop: "4px", fontSize: "0.8rem" }}>
              🔔 Admin notifications enabled
            </div>
          )}
        </Tooltip>
      }
    >
      {statusBadge}
    </OverlayTrigger>
  );
};

// CSS for animations
const style = document.createElement("style");
style.textContent = `
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  .spin {
    animation: spin 1s linear infinite;
  }
`;
document.head.appendChild(style);

export default RealTimeStatus;
