import React from "react";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";

const Register = () => {
  return (
    <div className="fade-in">
      <section className="section-padding bg-medical-light">
        <Container>
          <Row className="justify-content-center">
            <Col lg={8} md={10}>
              <Card className="medical-form">
                <Card.Body>
                  <div className="text-center mb-4">
                    <img
                      src="https://cdn.builder.io/api/v1/assets/ec4b3f82f1ac4275b8bfc1756fcac420/medical_logo-e586be?format=webp&width=800"
                      alt="Hare Krishna Medical"
                      style={{ height: "60px", width: "auto" }}
                    />
                    <h3 className="mt-3">Create Account</h3>
                    <p className="text-muted">Join our medical community</p>
                  </div>

                  <Form>
                    <Row>
                      <Col lg={6} className="mb-3">
                        <Form.Label>Full Name *</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter your full name"
                        />
                      </Col>
                      <Col lg={6} className="mb-3">
                        <Form.Label>Mobile Number *</Form.Label>
                        <Form.Control
                          type="tel"
                          placeholder="Enter mobile number"
                        />
                      </Col>
                      <Col lg={6} className="mb-3">
                        <Form.Label>Email Address *</Form.Label>
                        <Form.Control
                          type="email"
                          placeholder="Enter email address"
                        />
                      </Col>
                      <Col lg={6} className="mb-3">
                        <Form.Label>Gender</Form.Label>
                        <Form.Select>
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </Form.Select>
                      </Col>
                      <Col lg={6} className="mb-3">
                        <Form.Label>Age</Form.Label>
                        <Form.Control
                          type="number"
                          placeholder="Enter your age"
                        />
                      </Col>
                      <Col lg={6} className="mb-3">
                        <Form.Label>Password *</Form.Label>
                        <Form.Control
                          type="password"
                          placeholder="Create a password"
                        />
                      </Col>
                      <Col lg={12} className="mb-3">
                        <Form.Check
                          type="checkbox"
                          label="I agree to the Terms & Conditions and Privacy Policy"
                          id="terms"
                        />
                      </Col>
                      <Col lg={12} className="mb-3">
                        <Button className="btn-medical-primary w-100">
                          Create Account
                        </Button>
                      </Col>
                      <Col lg={12} className="text-center">
                        <p className="text-muted">
                          Already have an account?{" "}
                          <Link
                            to="/login"
                            className="text-medical-red text-decoration-none"
                          >
                            Sign in here
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

export default Register;
