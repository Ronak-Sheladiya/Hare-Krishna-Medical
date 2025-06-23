import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="fade-in">
      <section className="section-padding">
        <Container>
          <Row className="justify-content-center text-center">
            <Col lg={8}>
              <div className="medical-card p-5">
                <h1
                  className="display-1 text-medical-red mb-3"
                  style={{ fontSize: "8rem", fontWeight: "bold" }}
                >
                  404
                </h1>
                <h2 className="mb-3">Page Not Found</h2>
                <p className="text-muted mb-4">
                  The page you are looking for might have been moved, deleted,
                  or is temporarily unavailable.
                </p>
                <div className="d-flex gap-3 justify-content-center flex-wrap">
                  <Button
                    as={Link}
                    to="/"
                    className="btn-medical-primary"
                    size="lg"
                  >
                    <i className="bi bi-house-heart-fill me-2"></i>
                    Go Home
                  </Button>
                  <Button
                    as={Link}
                    to="/products"
                    className="btn-medical-outline"
                    size="lg"
                  >
                    <i className="bi bi-bag-heart me-2"></i>
                    Browse Products
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default NotFound;
