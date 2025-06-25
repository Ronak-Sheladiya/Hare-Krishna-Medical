import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";

// Responsive Container Component
export const ResponsiveContainer = ({
  children,
  fluid = false,
  className = "",
}) => {
  return (
    <Container fluid={fluid} className={`px-2 px-sm-3 px-md-4 ${className}`}>
      {children}
    </Container>
  );
};

// Responsive Grid Component
export const ResponsiveGrid = ({ children, className = "" }) => {
  return <Row className={`g-2 g-sm-3 g-md-4 ${className}`}>{children}</Row>;
};

// Responsive Column with smart sizing
export const ResponsiveCol = ({
  children,
  xs = 12,
  sm = null,
  md = null,
  lg = null,
  xl = null,
  className = "",
  ...props
}) => {
  return (
    <Col
      xs={xs}
      sm={sm}
      md={md}
      lg={lg}
      xl={xl}
      className={`mb-2 mb-sm-3 ${className}`}
      {...props}
    >
      {children}
    </Col>
  );
};

// Responsive Button Group
export const ResponsiveButtonGroup = ({
  children,
  vertical = false,
  className = "",
}) => {
  return (
    <div
      className={`d-flex ${vertical ? "flex-column" : "flex-wrap"} gap-2 gap-sm-3 ${className}`}
    >
      {children}
    </div>
  );
};

// Mobile-First Card Component
export const ResponsiveCard = ({
  children,
  title,
  icon,
  className = "",
  bodyClassName = "",
  ...props
}) => {
  return (
    <div className={`card h-100 border-0 shadow-sm ${className}`} {...props}>
      {title && (
        <div className="card-header bg-white border-0 pb-0">
          <h5 className="card-title mb-0 d-flex align-items-center">
            {icon && <i className={`${icon} me-2 text-medical-red`}></i>}
            {title}
          </h5>
        </div>
      )}
      <div className={`card-body p-3 p-sm-4 ${bodyClassName}`}>{children}</div>
    </div>
  );
};

// Responsive Table Wrapper
export const ResponsiveTable = ({ children, className = "" }) => {
  return (
    <div className={`table-responsive rounded ${className}`}>
      <table className="table table-hover mb-0">{children}</table>
    </div>
  );
};

// Mobile Navigation Helper
export const MobileNavHelper = ({ isOpen, onToggle }) => {
  return (
    <div className="d-lg-none">
      <Button
        variant="outline-secondary"
        size="sm"
        onClick={onToggle}
        className="d-flex align-items-center"
      >
        <i className={`bi bi-${isOpen ? "x" : "list"} me-1`}></i>
        {isOpen ? "Close" : "Menu"}
      </Button>
    </div>
  );
};

// Responsive Form Group
export const ResponsiveFormGroup = ({
  label,
  children,
  required = false,
  helpText,
  className = "",
}) => {
  return (
    <div className={`mb-3 ${className}`}>
      {label && (
        <label className="form-label fw-medium">
          {label}
          {required && <span className="text-danger ms-1">*</span>}
        </label>
      )}
      {children}
      {helpText && <div className="form-text text-muted small">{helpText}</div>}
    </div>
  );
};

// Responsive Stats Card
export const ResponsiveStatsCard = ({
  icon,
  value,
  label,
  color = "primary",
  trend,
  className = "",
}) => {
  return (
    <ResponsiveCard className={`text-center ${className}`}>
      <div className={`display-6 text-${color} mb-2`}>
        <i className={icon}></i>
      </div>
      <h3 className="fw-bold mb-1">{value}</h3>
      <p className="text-muted small mb-0">{label}</p>
      {trend && (
        <div className={`small mt-1 text-${trend.type}`}>
          <i
            className={`bi bi-${trend.type === "success" ? "arrow-up" : "arrow-down"} me-1`}
          ></i>
          {trend.value}
        </div>
      )}
    </ResponsiveCard>
  );
};

// Responsive Modal Helper
export const ResponsiveModal = ({
  show,
  onHide,
  title,
  children,
  size = "md",
  fullscreen = false,
  ...props
}) => {
  return (
    <div
      className={`modal fade ${show ? "show d-block" : ""}`}
      tabIndex="-1"
      style={{ backgroundColor: show ? "rgba(0,0,0,0.5)" : "transparent" }}
      onClick={onHide}
      {...props}
    >
      <div
        className={`modal-dialog modal-${size} ${fullscreen ? "modal-fullscreen-sm-down" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content border-0 shadow">
          {title && (
            <div className="modal-header border-bottom">
              <h5 className="modal-title fw-bold">{title}</h5>
              <button
                type="button"
                className="btn-close"
                onClick={onHide}
                aria-label="Close"
              ></button>
            </div>
          )}
          <div className="modal-body p-3 p-sm-4">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default {
  ResponsiveContainer,
  ResponsiveGrid,
  ResponsiveCol,
  ResponsiveButtonGroup,
  ResponsiveCard,
  ResponsiveTable,
  MobileNavHelper,
  ResponsiveFormGroup,
  ResponsiveStatsCard,
  ResponsiveModal,
};
