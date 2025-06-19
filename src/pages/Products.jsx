import React from "react";
import { Container, Row, Col, Breadcrumb } from "react-bootstrap";

const Products = () => {
  return (
    <div className="fade-in">
      {/* Breadcrumb */}
      <section className="medical-breadcrumb">
        <Container>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item active>Products</Breadcrumb.Item>
          </Breadcrumb>
        </Container>
      </section>

      {/* Products Content */}
      <section className="section-padding">
        <Container>
          <Row>
            <Col lg={12} className="text-center">
              <h1 className="section-title">Our Products</h1>
              <p className="section-subtitle">
                Comprehensive range of quality medical products
              </p>
              <div className="medical-card p-5 mt-5">
                <i className="bi bi-tools display-1 text-medical-red mb-3"></i>
                <h3>Products Page</h3>
                <p className="text-muted">
                  This page will contain the complete product catalog with
                  search, filtering, and cart functionality. Features will
                  include:
                </p>
                <ul className="list-unstyled">
                  <li>• Product search and filters</li>
                  <li>• Price sorting (low to high, high to low)</li>
                  <li>• Card/List view options</li>
                  <li>• Add to cart functionality</li>
                  <li>• Product details and images</li>
                </ul>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default Products;
