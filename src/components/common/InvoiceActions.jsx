import React from "react";
import { Button, Dropdown } from "react-bootstrap";
import invoiceService from "../../services/InvoiceService";

/**
 * Reusable Invoice Actions Component
 * Provides consistent print, download, and view functionality
 */
const InvoiceActions = ({
  invoice,
  variant = "buttons", // "buttons" | "dropdown" | "icons"
  size = "sm",
  showLabels = true,
  className = "",
  onAction = null, // Callback function for action events
}) => {
  const handlePrint = async () => {
    const result = await invoiceService.printInvoice(invoice);
    if (onAction) onAction("print", result);
  };

  const handleDownload = async () => {
    const result = await invoiceService.downloadInvoice(invoice);
    if (onAction) onAction("download", result);
  };

  const handleView = () => {
    const result = invoiceService.viewInvoice(invoice);
    if (onAction) onAction("view", result);
  };

  const getButtonClass = (type) => {
    const baseClass = `btn btn-${size}`;
    switch (type) {
      case "view":
        return `${baseClass} btn-outline-primary`;
      case "print":
        return `${baseClass} btn-outline-secondary`;
      case "download":
        return `${baseClass} btn-outline-success`;
      default:
        return baseClass;
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case "view":
        return "bi-eye";
      case "print":
        return "bi-printer";
      case "download":
        return "bi-download";
      default:
        return "";
    }
  };

  if (variant === "dropdown") {
    return (
      <Dropdown className={`invoice-actions ${className}`}>
        <Dropdown.Toggle
          variant="outline-secondary"
          size={size}
          className="border-0"
        >
          <i className="bi bi-three-dots"></i>
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item onClick={handleView}>
            <i className="bi bi-eye me-2"></i>
            View Invoice
          </Dropdown.Item>
          <Dropdown.Item onClick={handlePrint}>
            <i className="bi bi-printer me-2"></i>
            Print Invoice
          </Dropdown.Item>
          <Dropdown.Item onClick={handleDownload}>
            <i className="bi bi-download me-2"></i>
            Download PDF
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  }

  if (variant === "icons") {
    return (
      <div className={`invoice-actions d-flex gap-1 ${className}`}>
        <Button
          variant="outline-primary"
          size={size}
          onClick={handleView}
          title="View Invoice"
        >
          <i className={getIcon("view")}></i>
        </Button>
        <Button
          variant="outline-secondary"
          size={size}
          onClick={handlePrint}
          title="Print Invoice"
        >
          <i className={getIcon("print")}></i>
        </Button>
        <Button
          variant="outline-success"
          size={size}
          onClick={handleDownload}
          title="Download PDF"
        >
          <i className={getIcon("download")}></i>
        </Button>
      </div>
    );
  }

  // Default: buttons variant
  return (
    <div className={`invoice-actions d-flex gap-2 ${className}`}>
      <Button className={getButtonClass("view")} onClick={handleView}>
        <i className={`${getIcon("view")} ${showLabels ? "me-2" : ""}`}></i>
        {showLabels && "View"}
      </Button>
      <Button className={getButtonClass("print")} onClick={handlePrint}>
        <i className={`${getIcon("print")} ${showLabels ? "me-2" : ""}`}></i>
        {showLabels && "Print"}
      </Button>
      <Button className={getButtonClass("download")} onClick={handleDownload}>
        <i className={`${getIcon("download")} ${showLabels ? "me-2" : ""}`}></i>
        {showLabels && "Download"}
      </Button>
    </div>
  );
};

export default InvoiceActions;
