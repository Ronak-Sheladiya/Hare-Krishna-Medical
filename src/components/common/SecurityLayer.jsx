import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import SecurityPopup from "./SecurityPopup";

const SecurityLayer = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const location = useLocation();
  const [showPopup, setShowPopup] = useState(false);
  const [popupAction, setPopupAction] = useState("");
  const [popupContext, setPopupContext] = useState("");

  const showSecurityPopup = (action, context = "") => {
    setPopupAction(action);
    setPopupContext(context);
    setShowPopup(true);
  };

  useEffect(() => {
    const isAuthenticatedPage =
      location.pathname.startsWith("/admin") ||
      location.pathname.startsWith("/user");

    // Disable right-click context menu
    const disableRightClick = (e) => {
      e.preventDefault();
      showSecurityPopup("rightClick", "public page");
      return false;
    };

    // Disable keyboard shortcuts
    const disableKeyboardShortcuts = (e) => {
      // Disable Ctrl+A (Select All)
      if (e.ctrlKey && e.key === "a") {
        if (!isAuthenticatedPage || !isAuthenticated) {
          e.preventDefault();
          showSecurityPopup("selectAll", "public page");
          return false;
        }
      }

      // Disable Ctrl+C (Copy)
      if (e.ctrlKey && e.key === "c") {
        if (!isAuthenticatedPage || !isAuthenticated) {
          e.preventDefault();
          showSecurityPopup("copy", "public page");
          return false;
        }
      }

      // Disable Ctrl+V (Paste) - only on public pages
      if (e.ctrlKey && e.key === "v") {
        if (!isAuthenticatedPage || !isAuthenticated) {
          e.preventDefault();
          showSecurityPopup("paste", "public page");
          return false;
        }
      }

      // Disable Ctrl+X (Cut)
      if (e.ctrlKey && e.key === "x") {
        if (!isAuthenticatedPage || !isAuthenticated) {
          e.preventDefault();
          showSecurityPopup("cut", "public page");
          return false;
        }
      }

      // Disable Ctrl+S (Save) - prevent saving pages
      if (e.ctrlKey && e.key === "s") {
        e.preventDefault();
        showSecurityPopup("save", "page save");
        return false;
      }

      // Disable Ctrl+P (Print) - prevent printing
      if (e.ctrlKey && e.key === "p") {
        e.preventDefault();
        showSecurityPopup("print", "keyboard shortcut");
        return false;
      }

      // Disable F12 (Developer Tools)
      if (e.key === "F12") {
        e.preventDefault();
        showSecurityPopup("devTools", "F12 key");
        return false;
      }

      // Disable Ctrl+Shift+I (Developer Tools)
      if (e.ctrlKey && e.shiftKey && e.key === "I") {
        e.preventDefault();
        showSecurityPopup("devTools", "keyboard shortcut");
        return false;
      }

      // Disable Ctrl+Shift+C (Inspect Element)
      if (e.ctrlKey && e.shiftKey && e.key === "C") {
        e.preventDefault();
        showSecurityPopup("devTools", "inspect element");
        return false;
      }

      // Disable Ctrl+Shift+J (Console)
      if (e.ctrlKey && e.shiftKey && e.key === "J") {
        e.preventDefault();
        showSecurityPopup("devTools", "console access");
        return false;
      }

      // Disable Ctrl+U (View Source)
      if (e.ctrlKey && e.key === "u") {
        e.preventDefault();
        showSecurityPopup("viewSource", "keyboard shortcut");
        return false;
      }
    };

    // Disable text selection
    const disableSelection = () => {
      if (window.getSelection) {
        if (!isAuthenticatedPage || !isAuthenticated) {
          window.getSelection().removeAllRanges();
        }
      }
    };

    // Disable drag and drop
    const disableDragDrop = (e) => {
      e.preventDefault();
      return false;
    };

    // Disable image dragging
    const disableImageDrag = (e) => {
      if (e.target.tagName === "IMG") {
        e.preventDefault();
        return false;
      }
    };

    // Add security classes to body based on authentication
    const updateBodyClasses = () => {
      const body = document.body;

      // Remove all security classes first
      body.classList.remove(
        "security-public",
        "security-authenticated",
        "security-contact",
      );

      if (isAuthenticatedPage && isAuthenticated) {
        body.classList.add("security-authenticated");
      } else if (location.pathname === "/contact") {
        body.classList.add("security-contact");
      } else {
        body.classList.add("security-public");
      }
    };

    // Disable print functionality
    const disablePrint = () => {
      // Override window.print
      window.print = function () {
        if (!isAuthenticatedPage || !isAuthenticated) {
          console.warn("Printing is disabled for security reasons");
          return false;
        }
      };

      // Disable Ctrl+P through media query (backup)
      const style = document.createElement("style");
      style.innerHTML = `
        @media print {
          body { display: none !important; }
        }
      `;

      if (!isAuthenticatedPage || !isAuthenticated) {
        document.head.appendChild(style);
        return () => document.head.removeChild(style);
      }
    };

    // Console warning message
    const addConsoleWarning = () => {
      console.clear();
      console.log(
        "%c⚠️ SECURITY WARNING ⚠️",
        "color: red; font-size: 20px; font-weight: bold;",
      );
      console.log(
        "%cThis is a secure medical website. Unauthorized access or tampering is prohibited.",
        "color: orange; font-size: 14px;",
      );
      console.log(
        "%cIf you are a developer, please contact the administrator.",
        "color: blue; font-size: 12px;",
      );
    };

    // Apply security measures
    updateBodyClasses();
    addConsoleWarning();
    const printStyleCleanup = disablePrint();

    // Add event listeners
    document.addEventListener("contextmenu", disableRightClick);
    document.addEventListener("keydown", disableKeyboardShortcuts);
    document.addEventListener("selectstart", disableSelection);
    document.addEventListener("dragstart", disableDragDrop);
    document.addEventListener("drop", disableDragDrop);
    document.addEventListener("mousedown", disableImageDrag);

    // Cleanup function
    return () => {
      document.removeEventListener("contextmenu", disableRightClick);
      document.removeEventListener("keydown", disableKeyboardShortcuts);
      document.removeEventListener("selectstart", disableSelection);
      document.removeEventListener("dragstart", disableDragDrop);
      document.removeEventListener("drop", disableDragDrop);
      document.removeEventListener("mousedown", disableImageDrag);

      if (printStyleCleanup && typeof printStyleCleanup === "function") {
        printStyleCleanup();
      }

      // Remove security classes
      document.body.classList.remove(
        "security-public",
        "security-authenticated",
        "security-contact",
      );
    };
  }, [isAuthenticated, location.pathname, user]);

  // Additional security: Detect developer tools
  useEffect(() => {
    let devtools = { open: false, orientation: null };

    const threshold = 160;
    const checkDevTools = () => {
      if (
        window.outerHeight - window.innerHeight > threshold ||
        window.outerWidth - window.innerWidth > threshold
      ) {
        if (!devtools.open) {
          devtools.open = true;
          console.clear();
          console.log(
            "%c⚠️ Developer tools detected! This action has been logged.",
            "color: red; font-size: 16px; font-weight: bold;",
          );
        }
      } else {
        devtools.open = false;
      }
    };

    // Check for developer tools every 500ms
    const devToolsInterval = setInterval(checkDevTools, 500);

    return () => clearInterval(devToolsInterval);
  }, []);

  return (
    <SecurityPopup
      show={showPopup}
      onClose={() => setShowPopup(false)}
      action={popupAction}
      context={popupContext}
    />
  );
};

export default SecurityLayer;
