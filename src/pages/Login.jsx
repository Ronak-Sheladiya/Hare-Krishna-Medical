import React from "react";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <div className="fade-in">
      <section className="section-padding bg-medical-light">
        <Container>
          <Row className="justify-content-center">
            <Col lg={6} md={8}>
              <Card className="medical-form">
                <Card.Body>
                  <div className="text-center mb-4">
                    <img
                      src="https://cdn.builder.io/api/v1/assets/ec4b3f82f1ac4275b8bfc1756fcac420/medical_logo-e586be?format=webp&width=800"
                      alt="Hare Krishna Medical"
                      style={{ height: "60px", width: "auto" }}
                    />
                    <h3 className="mt-3">Welcome Back</h3>
                    <p className="text-muted">Sign in to your account</p>
                  </div>

                  <Form>
                    <Row>
                      <Col lg={12} className="mb-3">
                        <Form.Label>Email Address / Mobile Number</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter email or mobile number"
                        />
                      </Col>
                      <Col lg={12} className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                          type="password"
                          placeholder="Enter your password"
                        />
                      </Col>
                      <Col lg={12} className="mb-3">
                        <Form.Check
                          type="checkbox"
                          label="Remember me"
                          id="remember"
                        />
                      </Col>
                      <Col lg={12} className="mb-3">
                        <Button className="btn-medical-primary w-100">
                          Sign In
                        </Button>
                      </Col>
                      <Col lg={12} className="text-center">
                        <p className="text-muted">
                          Don't have an account?{" "}
                          <Link
                            to="/register"
                            className="text-medical-red text-decoration-none"
                          >
                            Register here
                          </Link>
                        </p>
                      </Col>
                    </Row>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default Login;
