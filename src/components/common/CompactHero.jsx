import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const CompactHero = ({
  icon,
  title,
  subtitle,
  gradientStart = "#e63946",
  gradientEnd = "#dc3545",
}) => {
  return (
    <section
      style={{
        background: `linear-gradient(135deg, ${gradientStart} 0%, ${gradientEnd} 100%)`,
        paddingTop: "40px",
        paddingBottom: "40px",
        color: "white",
      }}
    >
      <Container>
        <Row className="text-center">
          <Col lg={12}>
            <div
              style={{
                width: "60px",
                height: "60px",
                background: "rgba(255,255,255,0.2)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
                fontSize: "24px",
              }}
            >
              {typeof icon === "string" ? <i className={icon}></i> : icon}
            </div>
            <h1
              style={{
                fontSize: "2.5rem",
                fontWeight: "800",
                marginBottom: "12px",
                textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
              }}
            >
              {title}
            </h1>
            <p
              style={{
                fontSize: "1rem",
                opacity: "0.9",
                maxWidth: "500px",
                margin: "0 auto",
              }}
            >
              {subtitle}
            </p>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default CompactHero;
