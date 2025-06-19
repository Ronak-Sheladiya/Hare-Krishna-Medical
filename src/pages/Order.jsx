import React from "react";
import { Container, Row, Col, Breadcrumb } from "react-bootstrap";

const Order = () => {
  return (
    <div className="fade-in">
      <section className="medical-breadcrumb">
        <Container>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/cart">Cart</Breadcrumb.Item>
            <Breadcrumb.Item active>Place Order</Breadcrumb.Item>
          </Breadcrumb>
        </Container>
      </section>

      <section className="section-padding">
        <Container>
          <Row>
            <Col lg={12} className="text-center">
              <div className="medical-card p-5">
                <i className="bi bi-clipboard-check display-1 text-medical-red mb-3"></i>
                <h3>Order Processing</h3>
                <p className="text-muted">
                  Order form with customer details, address collection, and
                  invoice generation.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default Order;
