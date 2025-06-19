import React from "react";
import { Container, Row, Col, Breadcrumb } from "react-bootstrap";

const Cart = () => {
  return (
    <div className="fade-in">
      <section className="medical-breadcrumb">
        <Container>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item active>Shopping Cart</Breadcrumb.Item>
          </Breadcrumb>
        </Container>
      </section>

      <section className="section-padding">
        <Container>
          <Row>
            <Col lg={12} className="text-center">
              <div className="medical-card p-5">
                <i className="bi bi-cart3 display-1 text-medical-red mb-3"></i>
                <h3>Shopping Cart</h3>
                <p className="text-muted">
                  Cart functionality with quantity controls, item management,
                  and order summary.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default Cart;
