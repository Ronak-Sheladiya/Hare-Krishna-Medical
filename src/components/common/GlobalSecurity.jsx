import React, { useEffect, useState } from "react";

const GlobalSecurity = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Disable right-click during loading
    const handleContextMenu = (e) => {
      if (isLoading) {
        e.preventDefault();
        return false;
      }
    };

    // Disable certain key combinations during loading
    const handleKeyDown = (e) => {
      if (isLoading) {
        // Disable F12, Ctrl+Shift+I, Ctrl+U, Ctrl+Shift+C
        if (
          e.key === "F12" ||
          (e.ctrlKey && e.shiftKey && e.key === "I") ||
          (e.ctrlKey && e.key === "u") ||
          (e.ctrlKey && e.shiftKey && e.key === "C")
        ) {
          e.preventDefault();
          return false;
        }
      }
    };

    // Add event listeners
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);

    // Simulate loading completion after 3 seconds or when page is fully loaded
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    // Also check for document ready state
    const checkLoading = () => {
      if (document.readyState === "complete") {
        setTimeout(() => setIsLoading(false), 1000);
      }
    };

    document.addEventListener("readystatechange", checkLoading);
    checkLoading(); // Check immediately

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("readystatechange", checkLoading);
      clearTimeout(timer);
    };
  }, [isLoading]);

  // Add loading overlay
  if (isLoading) {
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(255, 255, 255, 0.9)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 9999,
          backdropFilter: "blur(5px)",
        }}
      >
        <div
          style={{
            width: "60px",
            height: "60px",
            border: "4px solid #f3f3f3",
            borderTop: "4px solid #e63946",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            marginBottom: "20px",
          }}
        />
        <h4 style={{ color: "#333", marginBottom: "10px" }}>Loading...</h4>
        <p style={{ color: "#666", textAlign: "center", maxWidth: "300px" }}>
          Hare Krishna Medical Store is preparing your experience
        </p>
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    );
  }

  return null;
};

export default GlobalSecurity;
