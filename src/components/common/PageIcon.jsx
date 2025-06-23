import React from "react";

// Professional icon mapping for different page types
export const PAGE_ICONS = {
  // Main Pages
  home: "bi-house-heart-fill",
  products: "bi-capsule",
  cart: "bi-cart3",
  orders: "bi-bag-check-fill",
  invoices: "bi-receipt-cutoff",

  // User Pages
  profile: "bi-person-circle",
  dashboard: "bi-speedometer2",
  "user-orders": "bi-bag-heart",
  "user-invoices": "bi-file-earmark-text",
  "user-profile": "bi-person-gear",

  // Admin Pages
  "admin-dashboard": "bi-graph-up-arrow",
  "admin-products": "bi-box-seam",
  "admin-orders": "bi-clipboard-check",
  "admin-users": "bi-people-fill",
  "admin-analytics": "bi-bar-chart-line",
  "admin-messages": "bi-chat-dots",
  "admin-invoices": "bi-receipt",
  "admin-payment": "bi-credit-card-2-front",

  // Auth Pages
  login: "bi-shield-lock",
  register: "bi-person-plus",
  "forgot-password": "bi-key",
  "verify-email": "bi-envelope-check",

  // Info Pages
  about: "bi-info-circle",
  contact: "bi-telephone",
  "privacy-policy": "bi-shield-check",
  "terms-conditions": "bi-file-text",
  "user-guide": "bi-book",

  // Invoice Pages
  "invoice-verify": "bi-patch-check",
  "invoice-view": "bi-file-earmark-pdf",
  "qr-verify": "bi-qr-code-scan",

  // Error/Status Pages
  "not-found": "bi-exclamation-triangle",
  "access-denied": "bi-shield-x",
  error: "bi-exclamation-octagon",

  // Default fallback
  default: "bi-circle-fill",
};

// Professional color schemes for different page types
export const ICON_COLORS = {
  // Primary medical red
  medical: "linear-gradient(135deg, #e63946, #dc3545)",

  // Success green
  success: "linear-gradient(135deg, #28a745, #20c997)",

  // Warning amber
  warning: "linear-gradient(135deg, #ffc107, #fd7e14)",

  // Info blue
  info: "linear-gradient(135deg, #17a2b8, #007bff)",

  // Dark professional
  dark: "linear-gradient(135deg, #343a40, #495057)",

  // Error red
  error: "linear-gradient(135deg, #dc3545, #c82333)",

  // Default medical theme
  default: "linear-gradient(135deg, #e63946, #dc3545)",
};

// Get icon for page based on pathname or type
export const getPageIcon = (pathname, pageType = null) => {
  // If specific pageType is provided, use it
  if (pageType && PAGE_ICONS[pageType]) {
    return PAGE_ICONS[pageType];
  }

  // Parse pathname to determine icon
  const path = pathname.toLowerCase().replace(/^\/+|\/+$/g, ""); // Remove leading/trailing slashes

  // Direct mapping for exact paths
  if (PAGE_ICONS[path]) {
    return PAGE_ICONS[path];
  }

  // Check for pattern matches
  if (path.startsWith("admin/")) {
    const adminPage = path.replace("admin/", "");
    return PAGE_ICONS[`admin-${adminPage}`] || PAGE_ICONS["admin-dashboard"];
  }

  if (path.startsWith("user/")) {
    const userPage = path.replace("user/", "");
    return PAGE_ICONS[`user-${userPage}`] || PAGE_ICONS["user-profile"];
  }

  if (path.includes("invoice")) {
    if (path.includes("verify")) return PAGE_ICONS["invoice-verify"];
    if (path.includes("qr")) return PAGE_ICONS["qr-verify"];
    return PAGE_ICONS["invoice-view"];
  }

  // Fallback patterns
  if (path.includes("product")) return PAGE_ICONS.products;
  if (path.includes("order")) return PAGE_ICONS.orders;
  if (path.includes("cart")) return PAGE_ICONS.cart;
  if (path.includes("login")) return PAGE_ICONS.login;
  if (path.includes("register")) return PAGE_ICONS.register;
  if (path.includes("profile")) return PAGE_ICONS.profile;
  if (path.includes("dashboard")) return PAGE_ICONS.dashboard;

  return PAGE_ICONS.default;
};

// Get color scheme based on page type or context
export const getIconColor = (context = "default") => {
  switch (context) {
    case "admin":
      return ICON_COLORS.dark;
    case "user":
      return ICON_COLORS.info;
    case "auth":
      return ICON_COLORS.medical;
    case "error":
      return ICON_COLORS.error;
    case "success":
      return ICON_COLORS.success;
    case "warning":
      return ICON_COLORS.warning;
    case "invoice":
      return ICON_COLORS.success;
    default:
      return ICON_COLORS.medical;
  }
};

// Professional icon component with background circle
export const ProfessionalIcon = ({
  icon,
  size = 60,
  gradient = ICON_COLORS.medical,
  iconSize = null,
  className = "",
  style = {},
}) => {
  const calculatedIconSize = iconSize || Math.round(size * 0.5);

  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        background: gradient,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
        border: "3px solid rgba(255,255,255,0.9)",
        ...style,
      }}
    >
      <i
        className={icon}
        style={{
          fontSize: `${calculatedIconSize}px`,
          color: "white",
          fontWeight: "bold",
        }}
      />
    </div>
  );
};

export default {
  PAGE_ICONS,
  ICON_COLORS,
  getPageIcon,
  getIconColor,
  ProfessionalIcon,
};
