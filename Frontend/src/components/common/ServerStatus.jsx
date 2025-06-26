import React, { useState, useEffect } from "react";
import { Badge } from "react-bootstrap";

const ServerStatus = () => {
  const [serverStatus, setServerStatus] = useState({
    server: "checking",
    database: "checking",
    lastCheck: null,
  });

  const checkServerStatus = async () => {
    try {
      // Check server health endpoint
      const response = await fetch("http://localhost:5001/api/health", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setServerStatus({
          server: "online",
          database: data.database === "connected" ? "online" : "offline",
          lastCheck: new Date(),
        });
      } else {
        setServerStatus({
          server: "offline",
          database: "unknown",
          lastCheck: new Date(),
        });
      }
    } catch (error) {
      setServerStatus({
        server: "offline",
        database: "unknown",
        lastCheck: new Date(),
      });
    }
  };

  useEffect(() => {
    // Initial check
    checkServerStatus();

    // Check every 30 seconds
    const interval = setInterval(checkServerStatus, 30000);

    return () => clearInterval(interval);
  }, []);

  const getStatusVariant = (status) => {
    switch (status) {
      case "online":
        return "success";
      case "offline":
        return "danger";
      case "checking":
        return "warning";
      default:
        return "secondary";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "online":
        return "●";
      case "offline":
        return "●";
      case "checking":
        return "●";
      default:
        return "●";
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        fontSize: "0.75rem",
      }}
    >
      <Badge
        bg={getStatusVariant(serverStatus.server)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "4px",
          padding: "4px 8px",
        }}
        title={`Server: ${serverStatus.server} | Last checked: ${
          serverStatus.lastCheck
            ? serverStatus.lastCheck.toLocaleTimeString()
            : "Never"
        }`}
      >
        {getStatusText(serverStatus.server)} Server
      </Badge>
      <Badge
        bg={getStatusVariant(serverStatus.database)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "4px",
          padding: "4px 8px",
        }}
        title={`Database: ${serverStatus.database} | Last checked: ${
          serverStatus.lastCheck
            ? serverStatus.lastCheck.toLocaleTimeString()
            : "Never"
        }`}
      >
        {getStatusText(serverStatus.database)} DB
      </Badge>
    </div>
  );
};

export default ServerStatus;
