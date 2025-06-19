import React from "react";
import { Container, Row, Col, Breadcrumb } from "react-bootstrap";

const ProductDetails = () => {
  return (
    <div className="fade-in">
      <section className="medical-breadcrumb">
        <Container>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/products">Products</Breadcrumb.Item>
            <Breadcrumb.Item active>Product Details</Breadcrumb.Item>
          </Breadcrumb>
        </Container>
      </section>

      <section className="section-padding">
        <Container>
          <Row>
            <Col lg={12} className="text-center">
              <div className="medical-card p-5">
                <i className="bi bi-box-seam display-1 text-medical-red mb-3"></i>
                <h3>Product Details Page</h3>
                <p className="text-muted">
                  Complete product information with image slider, benefits,
                  usage, and related products.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default ProductDetails;
