import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";

const GlobalSecurity = () => {
  const [showWarning, setShowWarning] = useState(false);
  const [warningType, setWarningType] = useState("");

  useEffect(() => {
    // Disable right-click context menu
    const handleRightClick = (e) => {
      e.preventDefault();
      setWarningType("Right-click");
      setShowWarning(true);
      return false;
    };

    // Disable keyboard shortcuts
    const handleKeyDown = (e) => {
      // F12 - Developer Tools
      if (e.keyCode === 123) {
        e.preventDefault();
        setWarningType("Developer tools");
        setShowWarning(true);
        return false;
      }

      // Ctrl+Shift+I - Developer Tools
      if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
        e.preventDefault();
        setWarningType("Developer tools");
        setShowWarning(true);
        return false;
      }

      // Ctrl+U - View Source
      if (e.ctrlKey && e.keyCode === 85) {
        e.preventDefault();
        setWarningType("View source");
        setShowWarning(true);
        return false;
      }

      // Ctrl+S - Save Page
      if (e.ctrlKey && e.keyCode === 83) {
        e.preventDefault();
        setWarningType("Save page");
        setShowWarning(true);
        return false;
      }

      // Ctrl+A - Select All
      if (e.ctrlKey && e.keyCode === 65) {
        e.preventDefault();
        setWarningType("Select all");
        setShowWarning(true);
        return false;
      }

      // Ctrl+C - Copy
      if (e.ctrlKey && e.keyCode === 67) {
        e.preventDefault();
        setWarningType("Copy");
        setShowWarning(true);
        return false;
      }

      // Ctrl+V - Paste
      if (e.ctrlKey && e.keyCode === 86) {
        e.preventDefault();
        setWarningType("Paste");
        setShowWarning(true);
        return false;
      }

      // Ctrl+X - Cut
      if (e.ctrlKey && e.keyCode === 88) {
        e.preventDefault();
        setWarningType("Cut");
        setShowWarning(true);
        return false;
      }

      // Ctrl+P - Print (allow for invoice and contact pages)
      if (
        e.ctrlKey &&
        e.keyCode === 80 &&
        !window.location.pathname.includes("invoice") &&
        !window.location.pathname.includes("contact")
      ) {
        e.preventDefault();
        setWarningType("Print");
        setShowWarning(true);
        return false;
      }
    };

    // Disable drag and drop
    const handleDragStart = (e) => {
      e.preventDefault();
      setWarningType("Drag and drop");
      setShowWarning(true);
      return false;
    };

    // Disable text selection (except on invoice, contact, admin, and user pages)
    const handleSelectStart = (e) => {
      if (
        window.location.pathname.includes("invoice") ||
        window.location.pathname.includes("contact") ||
        window.location.pathname.includes("/admin/") ||
        window.location.pathname.includes("/user/")
      ) {
        return true; // Allow selection
      }
      e.preventDefault();
      return false;
    };

    // Add event listeners
    document.addEventListener("contextmenu", handleRightClick);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("dragstart", handleDragStart);
    document.addEventListener("selectstart", handleSelectStart);

    // Cleanup event listeners
    return () => {
      document.removeEventListener("contextmenu", handleRightClick);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("dragstart", handleDragStart);
      document.removeEventListener("selectstart", handleSelectStart);
    };
  }, []);

  // Apply global CSS for security
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      /* Disable text selection globally */
      * {
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        user-select: none !important;
        -webkit-touch-callout: none !important;
        -webkit-tap-highlight-color: transparent !important;
      }

      /* Disable drag and drop */
      img, a {
        -webkit-user-drag: none !important;
        -khtml-user-drag: none !important;
        -moz-user-drag: none !important;
        -o-user-drag: none !important;
        user-drag: none !important;
        pointer-events: auto !important;
      }

      /* Allow input fields to be selectable for forms */
      input, textarea, select, [contenteditable="true"] {
        -webkit-user-select: text !important;
        -moz-user-select: text !important;
        -ms-user-select: text !important;
        user-select: text !important;
      }

      /* Allow text selection on contact, invoice, admin, and user pages */
      .contact-page-content, .contact-page-content *,
      .invoice-container, .invoice-container *,
      .admin-page-content, .admin-page-content *,
      .user-page-content, .user-page-content *,
      [data-page="contact"] *, [data-page="invoice"] *,
      [data-page="admin"] *, [data-page="user"] * {
        -webkit-user-select: text !important;
        -moz-user-select: text !important;
        -ms-user-select: text !important;
        user-select: text !important;
      }

      /* Red selection theme for contact page */
      .contact-page-content ::selection {
        background: #e63946 !important;
        color: white !important;
      }

      .contact-page-content ::-moz-selection {
        background: #e63946 !important;
        color: white !important;
      }

      /* Blue selection theme for admin pages */
      .admin-page-content ::selection {
        background: #3182ce !important;
        color: white !important;
      }

      .admin-page-content ::-moz-selection {
        background: #3182ce !important;
        color: white !important;
      }

      /* Green selection theme for user pages */
      .user-page-content ::selection {
        background: #38a169 !important;
        color: white !important;
      }

      .user-page-content ::-moz-selection {
        background: #38a169 !important;
        color: white !important;
      }

      /* Hide scrollbars in developer tools */
      ::-webkit-scrollbar {
        width: 8px;
      }

      ::-webkit-scrollbar-track {
        background: #f1f1f1;
      }

      ::-webkit-scrollbar-thumb {
        background: #c1c1c1;
        border-radius: 4px;
      }

      ::-webkit-scrollbar-thumb:hover {
        background: #a1a1a1;
      }

      /* Disable highlighting */
      ::selection {
        background: transparent !important;
      }

      ::-moz-selection {
        background: transparent !important;
      }

      /* Security watermark for print */
      @media print {
        body::before {
          content: "HARE KRISHNA MEDICAL - CONFIDENTIAL";
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-45deg);
          font-size: 72px;
          color: rgba(230, 57, 70, 0.05);
          font-weight: bold;
          z-index: -1;
          pointer-events: none;
        }
      }
    `;

    document.head.appendChild(style);

    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  const handleCloseWarning = () => {
    setShowWarning(false);
    setWarningType("");
  };

  return (
    <>
      {/* Security Warning Modal */}
      <Modal
        show={showWarning}
        onHide={handleCloseWarning}
        centered
        backdrop="static"
        keyboard={false}
        size="md"
      >
        <Modal.Header className="bg-danger text-white">
          <Modal.Title className="d-flex align-items-center">
            <i className="bi bi-shield-exclamation me-2 fs-3"></i>
            Security Alert
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center py-4">
          <div className="mb-4">
            <i
              className="bi bi-exclamation-triangle-fill text-warning"
              style={{ fontSize: "4rem" }}
            ></i>
          </div>
          <h5 className="text-danger mb-3">Access Restricted!</h5>
          <p className="mb-2">
            <strong>{warningType}</strong> is disabled for security reasons.
          </p>
          <p className="text-muted small mb-0">
            This website's content is protected. Unauthorized access attempts
            are logged and monitored.
          </p>
          <div className="mt-3 p-3 bg-light rounded">
            <small className="text-muted">
              <i className="bi bi-info-circle me-1"></i>
              <strong>Hare Krishna Medical</strong> - Your Trusted Healthcare
              Partner
            </small>
          </div>
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button
            variant="danger"
            onClick={handleCloseWarning}
            className="px-4"
          >
            <i className="bi bi-check-circle me-2"></i>I Understand
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default GlobalSecurity;
