import React from "react";
import { Card, Button } from "react-bootstrap";

// Hero Section Component - Consistent across all pages
export const PageHeroSection = ({
  title,
  subtitle,
  icon = "bi-shield-check",
}) => (
  <section
    style={{
      background: "linear-gradient(135deg, #e63946 0%, #dc3545 100%)",
      paddingTop: "80px",
      paddingBottom: "80px",
      color: "white",
    }}
  >
    <div className="container">
      <div className="row text-center">
        <div className="col-lg-12">
          <div className="d-flex justify-content-center align-items-center mb-4">
            <div
              style={{
                width: "80px",
                height: "80px",
                background: "rgba(255, 255, 255, 0.2)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginRight: "20px",
              }}
            >
              <i
                className={`${icon}`}
                style={{ fontSize: "32px", color: "white" }}
              ></i>
            </div>
            <h1
              style={{
                fontSize: "3rem",
                fontWeight: "800",
                marginBottom: "0",
                textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
              }}
            >
              {title}
            </h1>
          </div>
          <p
            style={{
              fontSize: "1.2rem",
              opacity: "0.9",
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  </section>
);

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
              "0 8px 25px rgba(52, 58, 64, 0.2)";
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

// Consistent Icon Component
export const ThemeIcon = ({
  icon,
  gradient = "linear-gradient(135deg, #e63946, #dc3545)",
  size = "80px",
  fontSize = "32px",
}) => (
  <div
    style={{
      width: size,
      height: size,
      background: gradient,
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      margin: "0 auto 24px",
      color: "white",
      fontSize: fontSize,
      transition: "all 0.3s ease",
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
    }}
    className="theme-icon"
  >
    <i className={icon}></i>
  </div>
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
        } else if (variant === "outline") {
          e.target.style.background = "#e63946";
          e.target.style.color = "white";
        }
      }}
      onMouseOut={(e) => {
        if (variant === "primary") {
          e.target.style.background = "#e63946";
        } else if (variant === "outline") {
          e.target.style.background = "transparent";
          e.target.style.color = "#e63946";
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
