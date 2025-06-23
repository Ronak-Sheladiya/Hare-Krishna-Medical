import React from "react";
import { Card, Button } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { getPageIcon, getIconColor, ProfessionalIcon } from "./PageIcon.jsx";

// Hero Section Component - Consistent across all pages with professional icons
export const PageHeroSection = ({
  title,
  subtitle,
  icon = null,
  iconContext = "default",
  background = null,
}) => {
  const location = useLocation();

  // Auto-determine icon if not provided
  const displayIcon = icon || getPageIcon(location.pathname);

  // Auto-determine color scheme based on path
  let colorContext = iconContext;
  if (iconContext === "default") {
    const path = location.pathname.toLowerCase();
    if (path.includes("admin")) colorContext = "admin";
    else if (path.includes("user")) colorContext = "user";
    else if (path.includes("login") || path.includes("register"))
      colorContext = "auth";
    else if (path.includes("invoice")) colorContext = "invoice";
    else if (path.includes("error") || path.includes("denied"))
      colorContext = "error";
  }

  const iconGradient = getIconColor(colorContext);
  const heroBackground =
    background ||
    (colorContext === "admin"
      ? "linear-gradient(135deg, #343a40 0%, #495057 100%)"
      : colorContext === "user"
        ? "linear-gradient(135deg, #17a2b8 0%, #007bff 100%)"
        : colorContext === "invoice"
          ? "linear-gradient(135deg, #28a745 0%, #20c997 100%)"
          : colorContext === "error"
            ? "linear-gradient(135deg, #dc3545 0%, #c82333 100%)"
            : "linear-gradient(135deg, #e63946 0%, #dc3545 100%)");

  return (
    <section
      style={{
        background: heroBackground,
        paddingTop: "80px",
        paddingBottom: "80px",
        color: "white",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background pattern */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "repeating-linear-gradient(45deg, transparent, transparent 50px, rgba(255,255,255,0.03) 50px, rgba(255,255,255,0.03) 100px)",
          pointerEvents: "none",
        }}
      />

      <div className="container" style={{ position: "relative", zIndex: 2 }}>
        <div className="row text-center">
          <div className="col-lg-12">
            <div className="d-flex justify-content-center align-items-center mb-4 flex-wrap">
              {/* Professional Icon with Circle Background */}
              <ProfessionalIcon
                icon={displayIcon}
                size={90}
                gradient="rgba(255, 255, 255, 0.9)"
                iconSize={42}
                style={{
                  marginRight: "25px",
                  marginBottom: "10px",
                  color:
                    colorContext === "admin"
                      ? "#343a40"
                      : colorContext === "user"
                        ? "#17a2b8"
                        : colorContext === "invoice"
                          ? "#28a745"
                          : colorContext === "error"
                            ? "#dc3545"
                            : "#e63946",
                  boxShadow: "0 12px 40px rgba(0,0,0,0.25)",
                  border: "4px solid rgba(255,255,255,0.95)",
                  animation: "heroIconFloat 3s ease-in-out infinite",
                }}
              />
              <div>
                <h1
                  style={{
                    fontSize: "3.2rem",
                    fontWeight: "800",
                    marginBottom: "8px",
                    textShadow: "2px 2px 8px rgba(0,0,0,0.3)",
                    lineHeight: "1.1",
                  }}
                >
                  {title}
                </h1>
              </div>
            </div>
            <p
              style={{
                fontSize: "1.25rem",
                opacity: "0.95",
                maxWidth: "700px",
                margin: "0 auto",
                lineHeight: "1.6",
                textShadow: "1px 1px 3px rgba(0,0,0,0.2)",
              }}
            >
              {subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* CSS Animation */}
      <style>{`
        @keyframes heroIconFloat {
          0%, 100% {
            transform: translateY(0px) scale(1);
          }
          50% {
            transform: translateY(-8px) scale(1.05);
          }
        }
        
        @media (max-width: 768px) {
          .hero-section h1 {
            font-size: 2.5rem !important;
          }
          .hero-section .professional-icon {
            margin-right: 0 !important;
            margin-bottom: 20px !important;
          }
        }
      `}</style>
    </section>
  );
};

// Consistent Card Component
export const ThemeCard = ({
  children,
  className = "",
  padding = "30px",
  hover = true,
  ...props
}) => (
  <Card
    className={className}
    style={{
      border: "2px solid #f8f9fa",
      borderRadius: "16px",
      padding: padding,
      height: "100%",
      transition: hover ? "all 0.3s ease" : "none",
      boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
      ...props.style,
    }}
    onMouseOver={
      hover
        ? (e) => {
            e.currentTarget.style.borderColor = "#343a40";
            e.currentTarget.style.transform = "translateY(-4px)";
            e.currentTarget.style.boxShadow =
              "0 12px 40px rgba(52, 58, 64, 0.15)";
          }
        : undefined
    }
    onMouseOut={
      hover
        ? (e) => {
            e.currentTarget.style.borderColor = "#f8f9fa";
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.08)";
          }
        : undefined
    }
    {...props}
  >
    {children}
  </Card>
);

// Enhanced Icon Component using ProfessionalIcon
export const ThemeIcon = ({
  icon,
  gradient = "linear-gradient(135deg, #e63946, #dc3545)",
  size = 80,
  fontSize = 32,
  className = "",
}) => (
  <ProfessionalIcon
    icon={icon}
    size={size}
    gradient={gradient}
    iconSize={fontSize}
    className={className}
    style={{
      margin: "0 auto 24px",
      transition: "all 0.3s ease",
    }}
  />
);

// Consistent Button Component
export const ThemeButton = ({
  children,
  variant = "primary",
  size = "md",
  icon,
  ...props
}) => {
  const getButtonStyle = () => {
    const baseStyle = {
      borderRadius: size === "lg" ? "12px" : "8px",
      padding:
        size === "lg" ? "14px 28px" : size === "sm" ? "8px 16px" : "12px 24px",
      fontSize: size === "lg" ? "16px" : size === "sm" ? "14px" : "15px",
      fontWeight: "600",
      transition: "all 0.3s ease",
      border: "none",
    };

    if (variant === "primary") {
      return {
        ...baseStyle,
        background: "#e63946",
        color: "white",
      };
    } else if (variant === "outline") {
      return {
        ...baseStyle,
        background: "transparent",
        border: "2px solid #e63946",
        color: "#e63946",
      };
    }
    return baseStyle;
  };

  return (
    <Button
      style={getButtonStyle()}
      onMouseOver={(e) => {
        if (variant === "primary") {
          e.target.style.background = "#343a40";
          e.target.style.transform = "translateY(-2px)";
        } else if (variant === "outline") {
          e.target.style.background = "#e63946";
          e.target.style.color = "white";
          e.target.style.transform = "translateY(-2px)";
        }
      }}
      onMouseOut={(e) => {
        if (variant === "primary") {
          e.target.style.background = "#e63946";
          e.target.style.transform = "translateY(0)";
        } else if (variant === "outline") {
          e.target.style.background = "transparent";
          e.target.style.color = "#e63946";
          e.target.style.transform = "translateY(0)";
        }
      }}
      {...props}
    >
      {icon && <i className={`${icon} me-2`}></i>}
      {children}
    </Button>
  );
};

// Section Container Component
export const ThemeSection = ({
  children,
  background = "#ffffff",
  padding = "80px",
}) => (
  <section
    style={{
      background,
      paddingTop: padding,
      paddingBottom: padding,
    }}
  >
    <div className="container">{children}</div>
  </section>
);

// Stats Card Component
export const StatsCard = ({
  icon,
  value,
  label,
  gradient = "linear-gradient(135deg, #e63946, #dc3545)",
  badge,
  isLoading = false,
}) => (
  <ThemeCard hover={true}>
    <div className="text-center">
      <ThemeIcon icon={icon} gradient={gradient} />
      <h1
        style={{
          color: "#333",
          fontWeight: "900",
          marginBottom: "10px",
          fontSize: "3rem",
          lineHeight: "1",
        }}
      >
        {isLoading ? "..." : value}
      </h1>
      <h5
        style={{
          color: "#6c757d",
          marginBottom: "15px",
          fontWeight: "600",
          textTransform: "uppercase",
          letterSpacing: "1px",
          fontSize: "14px",
        }}
      >
        {label}
      </h5>
      {badge && (
        <div
          style={{
            background: "linear-gradient(135deg, #28a745, #20c997)",
            color: "white",
            padding: "6px 12px",
            borderRadius: "20px",
            fontSize: "11px",
            fontWeight: "600",
            display: "inline-block",
          }}
        >
          {badge}
        </div>
      )}
    </div>
  </ThemeCard>
);

export default {
  PageHeroSection,
  ThemeCard,
  ThemeIcon,
  ThemeButton,
  ThemeSection,
  StatsCard,
};
