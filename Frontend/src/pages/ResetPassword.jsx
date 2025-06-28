import React, { useState, useEffect } from "react";
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
import { Link, useParams, useNavigate } from "react-router-dom";
import { api } from "../utils/apiClient";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [tokenValid, setTokenValid] = useState(null);
  const [validatingToken, setValidatingToken] = useState(true);

  // Validate token on component mount
  useEffect(() => {
    if (!token) {
      setError("Invalid reset link. No token provided.");
      setTokenValid(false);
      setValidatingToken(false);
      return;
    }

    // Token validation can be done by attempting to use it
    // For now, we'll assume it's valid and let the backend validate it
    setTokenValid(true);
    setValidatingToken(false);
  }, [token]);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      // Client-side validation
      if (!password || password.length < 6) {
        throw new Error("Password must be at least 6 characters long");
      }

      if (password !== confirmPassword) {
        throw new Error("Passwords do not match");
      }

      // Call reset password API
      const response = await api.post(`/auth/reset-password/${token}`, {
        password,
      });

      if (response.success === false) {
        throw new Error(
          response.error || response.message || "Password reset failed",
        );
      }

      setMessage(
        response.message ||
          "Password reset successfully! You can now login with your new password.",
      );

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/login", {
          state: {
            message:
              "Password reset successful! Please login with your new password.",
          },
        });
      }, 3000);
    } catch (err) {
      const errorMessage =
        err.message || "Password reset failed. Please try again.";
      setError(errorMessage);

      // If token is invalid or expired, show appropriate message
      if (
        errorMessage.includes("Invalid or expired") ||
        errorMessage.includes("token")
      ) {
        setTokenValid(false);
      }
    } finally {
      setLoading(false);
    }
  };

  // Loading state while validating token
  if (validatingToken) {
    return (
      <div className="section-padding">
        <Container>
          <Row className="justify-content-center">
            <Col lg={6} md={8}>
              <Card className="medical-form">
                <Card.Body className="p-5 text-center">
                  <Spinner animation="border" className="mb-3" />
                  <p>Validating reset link...</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }

  // Invalid token state
  if (tokenValid === false) {
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
                    <h3 className="text-medical-dark">Invalid Reset Link</h3>
                  </div>

                  <Alert variant="danger" className="mb-3">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    {error ||
                      "This password reset link is invalid or has expired."}
                  </Alert>

                  <div className="text-center">
                    <p className="text-muted mb-3">
                      The reset link may have expired or been used already.
                    </p>
                    <Link
                      to="/forgot-password"
                      className="btn btn-medical-primary"
                    >
                      Request New Reset Link
                    </Link>
                  </div>

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
      </div>
    );
  }

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
                  <h3 className="text-medical-dark">Reset Your Password</h3>
                  <p className="text-muted">Enter your new password below</p>
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

                <Form onSubmit={handleResetPassword}>
                  <Form.Group className="mb-3">
                    <Form.Label>New Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Enter new password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      minLength={6}
                      required
                      disabled={loading}
                    />
                    <Form.Text className="text-muted">
                      Password must be at least 6 characters long
                    </Form.Text>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Confirm New Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      minLength={6}
                      required
                      disabled={loading}
                    />
                    {confirmPassword && password !== confirmPassword && (
                      <Form.Text className="text-danger">
                        Passwords do not match
                      </Form.Text>
                    )}
                  </Form.Group>

                  <Button
                    type="submit"
                    className="btn-medical-primary w-100 mb-3"
                    disabled={
                      loading ||
                      password !== confirmPassword ||
                      password.length < 6
                    }
                  >
                    {loading ? (
                      <>
                        <Spinner size="sm" className="me-2" />
                        Resetting Password...
                      </>
                    ) : (
                      "Reset Password"
                    )}
                  </Button>

                  <div className="text-center">
                    <small className="text-muted">
                      <i className="bi bi-shield-check me-1"></i>
                      Your password will be securely encrypted
                    </small>
                  </div>
                </Form>

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

export default ResetPassword;
