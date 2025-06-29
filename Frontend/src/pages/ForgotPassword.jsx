import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
  Spinner,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { api } from "../utils/apiClient";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      // Call forgot password API
      const response = await api.post("/api/auth/forgot-password", { email });

      if (response.success === false) {
        throw new Error(
          response.error || response.message || "Failed to send reset email",
        );
      }

      setMessage(
        response.message ||
          "Password reset email sent successfully! Please check your email.",
      );
      setEmailSent(true);
    } catch (err) {
      const errorMessage =
        err.message || "Failed to send reset email. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section-padding">
      <Container>
        <Row className="justify-content-center">
          <Col lg={6} md={8}>
            <Card className="medical-form">
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <img
                    src="https://cdn.builder.io/api/v1/assets/ec4b3f82f1ac4275b8bfc1756fcac420/medical_logo-e586be?format=webp&width=200"
                    alt="Hare Krishna Medical"
                    className="img-fluid mb-3"
                    style={{ maxHeight: "80px" }}
                  />
                  <h3 className="text-medical-dark">Forgot Password</h3>
                  <p className="text-muted">
                    {!emailSent
                      ? "Enter your email address and we'll send you a reset link"
                      : "Check your email for the reset link"}
                  </p>
                </div>

                {message && (
                  <Alert variant="success" className="mb-3">
                    <i className="bi bi-check-circle me-2"></i>
                    {message}
                  </Alert>
                )}

                {error && (
                  <Alert variant="danger" className="mb-3">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    {error}
                  </Alert>
                )}

                {!emailSent ? (
                  <Form onSubmit={handleSendOTP}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email Address</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="Enter your registered email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={loading}
                      />
                      <Form.Text className="text-muted">
                        We'll send a password reset link to this email address
                      </Form.Text>
                    </Form.Group>
                    <Button
                      type="submit"
                      className="btn-medical-primary w-100"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Spinner size="sm" className="me-2" />
                          Sending Reset Link...
                        </>
                      ) : (
                        "Send Reset Link"
                      )}
                    </Button>
                  </Form>
                ) : (
                  <div className="text-center">
                    <div className="mb-4">
                      <i
                        className="bi bi-envelope-check"
                        style={{ fontSize: "3rem", color: "#28a745" }}
                      ></i>
                    </div>
                    <h5 className="text-success mb-3">Email Sent!</h5>
                    <p className="text-muted mb-4">
                      We've sent a password reset link to{" "}
                      <strong>{email}</strong>.
                      <br />
                      Please check your email and click the link to reset your
                      password.
                    </p>
                    <small className="text-muted">
                      <i className="bi bi-info-circle me-1"></i>
                      If you don't see the email, please check your spam folder.
                    </small>
                  </div>
                )}

                <div className="text-center mt-4">
                  <Link
                    to="/login"
                    className="text-medical-blue text-decoration-none"
                  >
                    <i className="bi bi-arrow-left me-2"></i>
                    Back to Login
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <style>{`
        .medical-form {
          border-radius: 15px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          border: none;
        }

        .btn-medical-primary {
          background: linear-gradient(135deg, #dc3545, #c82333);
          border: none;
          border-radius: 10px;
          font-weight: 600;
          padding: 12px 24px;
          transition: all 0.3s ease;
        }

        .btn-medical-primary:hover {
          background: linear-gradient(135deg, #c82333, #bd2130);
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(220, 53, 69, 0.3);
        }

        .btn-medical-primary:disabled {
          background: #6c757d;
          transform: none;
          box-shadow: none;
        }

        .text-medical-dark {
          color: #2c3e50;
        }

        .text-medical-blue {
          color: #007bff;
        }

        .form-control {
          border-radius: 10px;
          border: 2px solid #e9ecef;
          padding: 12px 16px;
          transition: border-color 0.3s ease;
        }

        .form-control:focus {
          border-color: #dc3545;
          box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
        }

        .section-padding {
          padding: 80px 0;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          min-height: 100vh;
          display: flex;
          align-items: center;
        }

        .alert {
          border-radius: 10px;
          border: none;
        }
      `}</style>
    </div>
  );
};

export default ForgotPassword;
