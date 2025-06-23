import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  PageHeroSection,
  ThemeCard,
} from "../components/common/ConsistentTheme";
import {
  ProfessionalIcon,
  PAGE_ICONS,
  getPageIcon,
  getIconColor,
} from "../components/common/PageIcon";

const IconShowcase = () => {
  const iconCategories = [
    {
      title: "Main Pages",
      icons: ["home", "products", "cart", "orders", "invoices"],
    },
    {
      title: "User Pages",
      icons: [
        "profile",
        "dashboard",
        "user-orders",
        "user-invoices",
        "user-profile",
      ],
    },
    {
      title: "Admin Pages",
      icons: [
        "admin-dashboard",
        "admin-products",
        "admin-orders",
        "admin-users",
        "admin-analytics",
      ],
    },
    {
      title: "Authentication",
      icons: ["login", "register", "forgot-password", "verify-email"],
    },
    {
      title: "Information Pages",
      icons: [
        "about",
        "contact",
        "privacy-policy",
        "terms-conditions",
        "user-guide",
      ],
    },
    {
      title: "Invoice & QR",
      icons: ["invoice-verify", "invoice-view", "qr-verify"],
    },
    {
      title: "Error Pages",
      icons: ["not-found", "access-denied", "error"],
    },
  ];

  return (
    <div className="fade-in">
      {/* Professional Hero Section */}
      <PageHeroSection
        title="Icon System Showcase"
        subtitle="Professional icons with background circles for all page types throughout the application"
        iconContext="info"
      />

      <Container className="py-5">
        {iconCategories.map((category, categoryIndex) => (
          <div key={categoryIndex} className="mb-5">
            <h3
              className="mb-4 text-center"
              style={{
                color: "#333",
                fontWeight: "700",
                fontSize: "2rem",
                borderBottom: "3px solid #e63946",
                paddingBottom: "10px",
                display: "inline-block",
                width: "100%",
                textAlign: "center",
              }}
            >
              {category.title}
            </h3>

            <Row>
              {category.icons.map((iconKey, index) => (
                <Col lg={3} md={4} sm={6} className="mb-4" key={index}>
                  <ThemeCard hover={true} padding="25px">
                    <div className="text-center">
                      <ProfessionalIcon
                        icon={PAGE_ICONS[iconKey] || PAGE_ICONS.default}
                        size={80}
                        gradient={getIconColor(
                          iconKey.includes("admin")
                            ? "admin"
                            : iconKey.includes("user")
                              ? "user"
                              : iconKey.includes("invoice") ||
                                  iconKey.includes("qr")
                                ? "invoice"
                                : iconKey.includes("login") ||
                                    iconKey.includes("register")
                                  ? "auth"
                                  : iconKey.includes("error") ||
                                      iconKey.includes("denied")
                                    ? "error"
                                    : "default",
                        )}
                        style={{ margin: "0 auto 20px" }}
                      />
                      <h6
                        style={{
                          color: "#333",
                          fontWeight: "600",
                          marginBottom: "8px",
                          textTransform: "capitalize",
                        }}
                      >
                        {iconKey.replace(/-/g, " ")}
                      </h6>
                      <small style={{ color: "#6c757d" }}>
                        {PAGE_ICONS[iconKey] || PAGE_ICONS.default}
                      </small>
                    </div>
                  </ThemeCard>
                </Col>
              ))}
            </Row>
          </div>
        ))}

        {/* Color Context Examples */}
        <div className="mb-5">
          <h3
            className="mb-4 text-center"
            style={{
              color: "#333",
              fontWeight: "700",
              fontSize: "2rem",
              borderBottom: "3px solid #e63946",
              paddingBottom: "10px",
              display: "inline-block",
              width: "100%",
              textAlign: "center",
            }}
          >
            Color Context Examples
          </h3>

          <Row>
            {[
              {
                context: "default",
                name: "Default Medical",
                icon: "bi-heart-pulse",
              },
              { context: "admin", name: "Admin Dark", icon: "bi-gear" },
              { context: "user", name: "User Info", icon: "bi-person-circle" },
              {
                context: "auth",
                name: "Authentication",
                icon: "bi-shield-lock",
              },
              {
                context: "invoice",
                name: "Invoice Success",
                icon: "bi-receipt-cutoff",
              },
              {
                context: "error",
                name: "Error/Warning",
                icon: "bi-exclamation-triangle",
              },
              {
                context: "success",
                name: "Success Green",
                icon: "bi-check-circle",
              },
              {
                context: "warning",
                name: "Warning Amber",
                icon: "bi-exclamation-circle",
              },
            ].map((item, index) => (
              <Col lg={3} md={4} sm={6} className="mb-4" key={index}>
                <ThemeCard hover={true} padding="25px">
                  <div className="text-center">
                    <ProfessionalIcon
                      icon={item.icon}
                      size={70}
                      gradient={getIconColor(item.context)}
                      style={{ margin: "0 auto 15px" }}
                    />
                    <h6
                      style={{
                        color: "#333",
                        fontWeight: "600",
                        marginBottom: "5px",
                      }}
                    >
                      {item.name}
                    </h6>
                    <small style={{ color: "#6c757d" }}>
                      Context: {item.context}
                    </small>
                  </div>
                </ThemeCard>
              </Col>
            ))}
          </Row>
        </div>

        {/* Usage Examples */}
        <div className="mb-5">
          <ThemeCard>
            <h4 style={{ color: "#e63946", marginBottom: "20px" }}>
              <i className="bi bi-code-square me-2"></i>
              Usage Examples
            </h4>

            <div className="mb-4">
              <h6 style={{ color: "#333" }}>
                Hero Section with Auto Icon Detection:
              </h6>
              <pre
                style={{
                  background: "#f8f9fa",
                  padding: "15px",
                  borderRadius: "8px",
                  overflow: "auto",
                }}
              >
                {`<PageHeroSection
  title="Dashboard" 
  subtitle="Welcome to your dashboard"
  iconContext="admin" // auto-detects from URL if not provided
/>`}
              </pre>
            </div>

            <div className="mb-4">
              <h6 style={{ color: "#333" }}>Standalone Professional Icon:</h6>
              <pre
                style={{
                  background: "#f8f9fa",
                  padding: "15px",
                  borderRadius: "8px",
                  overflow: "auto",
                }}
              >
                {`<ProfessionalIcon
  icon="bi-shield-check"
  size={80}
  gradient={getIconColor("success")}
/>`}
              </pre>
            </div>

            <div>
              <h6 style={{ color: "#333" }}>Get Icon for Any Page:</h6>
              <pre
                style={{
                  background: "#f8f9fa",
                  padding: "15px",
                  borderRadius: "8px",
                  overflow: "auto",
                }}
              >
                {`const icon = getPageIcon(location.pathname);
const color = getIconColor("admin");`}
              </pre>
            </div>
          </ThemeCard>
        </div>

        <div className="text-center">
          <Link
            to="/"
            className="btn btn-primary"
            style={{
              background: "#e63946",
              border: "none",
              borderRadius: "8px",
              padding: "12px 24px",
              fontWeight: "600",
            }}
          >
            <i className="bi bi-house me-2"></i>
            Back to Home
          </Link>
        </div>
      </Container>
    </div>
  );
};

export default IconShowcase;
