import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";

const SecurityPopup = ({ show, onClose, action, context }) => {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (show && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      onClose();
    }
  }, [show, countdown, onClose]);

  useEffect(() => {
    if (show) {
      setCountdown(5);
    }
  }, [show]);

  const getActionMessage = () => {
    switch (action) {
      case "rightClick":
        return {
          title: "🛡️ Right-Click Disabled",
          message:
            "Right-click context menu is disabled for security reasons to protect our content.",
          icon: "bi-mouse2",
        };
      case "copy":
        return {
          title: "🛡️ Copy Disabled",
          message:
            "Copying content is not allowed on public pages for security reasons.",
          icon: "bi-clipboard-x",
        };
      case "selectAll":
        return {
          title: "🛡️ Select All Disabled",
          message:
            "Text selection is restricted on public pages to protect content.",
          icon: "bi-cursor",
        };
      case "print":
        return {
          title: "🛡️ Print Restricted",
          message:
            "Printing is disabled on public pages. Please log in to access print functionality.",
          icon: "bi-printer",
        };
      case "devTools":
        return {
          title: "🛡️ Developer Tools Blocked",
          message: "Developer tools access is restricted for security reasons.",
          icon: "bi-code-slash",
        };
      case "viewSource":
        return {
          title: "🛡️ View Source Disabled",
          message: "Viewing page source is not allowed for security reasons.",
          icon: "bi-file-code",
        };
      case "save":
        return {
          title: "🛡️ Save Page Disabled",
          message: "Saving pages is restricted to protect our content.",
          icon: "bi-save",
        };
      default:
        return {
          title: "🛡️ Action Restricted",
          message: "This action is not allowed for security reasons.",
          icon: "bi-shield-x",
        };
    }
  };

  const { title, message, icon } = getActionMessage();

  return (
    <Modal
      show={show}
      onHide={onClose}
      centered
      backdrop="static"
      keyboard={false}
      size="sm"
    >
      <Modal.Header
        style={{
          background: "linear-gradient(135deg, #e63946, #dc3545)",
          color: "white",
          border: "none",
          padding: "20px",
        }}
      >
        <Modal.Title
          className="w-100 text-center"
          style={{ fontSize: "1.1rem", fontWeight: "700" }}
        >
          <i className={`bi ${icon} me-2`} style={{ fontSize: "1.3rem" }}></i>
          {title}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body
        style={{
          padding: "25px",
          textAlign: "center",
          background: "#f8f9fa",
        }}
      >
        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "8px",
            border: "2px solid #e9ecef",
            marginBottom: "20px",
          }}
        >
          <p
            style={{
              margin: "0",
              fontSize: "14px",
              lineHeight: "1.5",
              color: "#495057",
            }}
          >
            {message}
          </p>
        </div>

        <div
          style={{
            background: "rgba(230, 57, 70, 0.1)",
            border: "1px solid rgba(230, 57, 70, 0.3)",
            borderRadius: "6px",
            padding: "12px",
            marginBottom: "15px",
          }}
        >
          <p
            style={{
              margin: "0",
              fontSize: "12px",
              color: "#721c24",
              fontWeight: "600",
            }}
          >
            <i className="bi bi-info-circle me-1"></i>
            Auto-closing in {countdown} seconds
          </p>
        </div>

        <div style={{ fontSize: "11px", color: "#6c757d" }}>
          <strong>Hare Krishna Medical</strong> - Secure Medical Platform
        </div>
      </Modal.Body>

      <Modal.Footer
        style={{
          border: "none",
          padding: "15px 25px",
          background: "#f8f9fa",
          justifyContent: "center",
        }}
      >
        <Button
          variant="outline-secondary"
          onClick={onClose}
          size="sm"
          style={{
            borderRadius: "6px",
            fontWeight: "600",
            padding: "8px 20px",
          }}
        >
          <i className="bi bi-x-lg me-1"></i>
          Close ({countdown})
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SecurityPopup;
