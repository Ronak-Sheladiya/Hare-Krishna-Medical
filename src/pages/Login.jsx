import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Alert,
  InputGroup,
} from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "../store/slices/authSlice.js";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  // Get the intended redirect URL from state
  const from = location.state?.from || null;

  const [formData, setFormData] = useState({
    emailOrMobile: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.emailOrMobile.trim()) {
      newErrors.emailOrMobile = "Email or mobile number is required";
    }
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    dispatch(loginStart());

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock authentication logic
      const { emailOrMobile, password } = formData;

      // Check for admin credentials
      if (
        (emailOrMobile === "admin@gmail.com" && password === "Ronak@95865") ||
        (emailOrMobile === "ronaksheladiya652@gmail.com" &&
          password === "admin@123") ||
        (emailOrMobile === "mayurgajera098@gmail.com" &&
          password === "admin@123")
      ) {
        const adminUser = {
          id: 1,
          fullName:
            emailOrMobile === "ronaksheladiya652@gmail.com"
              ? "Ronak Sheladiya"
              : emailOrMobile === "mayurgajera098@gmail.com"
                ? "Mayur Gajera"
                : "Admin",
          name:
            emailOrMobile === "ronaksheladiya652@gmail.com"
              ? "Ronak Sheladiya"
              : emailOrMobile === "mayurgajera098@gmail.com"
                ? "Mayur Gajera"
                : "Admin",
          email: emailOrMobile,
          role: 1, // Admin role
          profileImage: null,
        };
        // Store redirect URL before login
        const redirectUrl =
          sessionStorage.getItem("redirectAfterLogin") || from;

        dispatch(
          loginSuccess({
            user: adminUser,
            rememberMe: formData.rememberMe,
          }),
        );

        // Navigate to intended URL or default admin dashboard
        if (
          redirectUrl &&
          redirectUrl !== "/login" &&
          redirectUrl !== "/register"
        ) {
          navigate(redirectUrl, { replace: true });
        } else {
          navigate("/admin/dashboard", { replace: true });
        }
        return;
      }

      // Mock user authentication
      if (
        (emailOrMobile === "user@example.com" ||
          emailOrMobile === "9876543210") &&
        password === "password123"
      ) {
        const user = {
          id: 2,
          fullName: "John Doe",
          name: "John Doe",
          email: "user@example.com",
          mobile: "9876543210",
          role: 0, // User role
          profileImage: null,
        };
        // Store redirect URL before login
        const redirectUrl =
          sessionStorage.getItem("redirectAfterLogin") || from;

        dispatch(
          loginSuccess({
            user,
            rememberMe: formData.rememberMe,
          }),
        );

        // Navigate to intended URL or default user dashboard
        if (
          redirectUrl &&
          redirectUrl !== "/login" &&
          redirectUrl !== "/register"
        ) {
          navigate(redirectUrl, { replace: true });
        } else {
          navigate("/user/dashboard", { replace: true });
        }
        return;
      }

      // If credentials don't match
      throw new Error("Invalid credentials");
    } catch (error) {
      dispatch(loginFailure(error.message || "Login failed"));
    }
  };

  const mockCredentials = [
    {
      type: "Admin",
      email: "admin@gmail.com",
      password: "Ronak@95865",
      description: "Access admin dashboard",
    },
    {
      type: "Admin (Ronak)",
      email: "ronaksheladiya652@gmail.com",
      password: "admin@123",
      description: "Access admin dashboard",
    },
    {
      type: "Admin (Mayur)",
      email: "mayurgajera098@gmail.com",
      password: "admin@123",
      description: "Access admin dashboard",
    },
    {
      type: "User",
      email: "user@example.com",
      mobile: "9876543210",
      password: "password123",
      description: "Access user dashboard",
    },
  ];

  const handleUseCredentials = (credentials) => {
    setFormData({
      emailOrMobile: credentials.email,
      password: credentials.password,
      rememberMe: false,
    });
    setErrors({});
  };

  return (
    <div className="fade-in">
      <section className="section-padding bg-medical-light">
        <Container>
          <Row className="justify-content-center">
            <Col lg={10}>
              <Row className="align-items-center">
                {/* Login Form */}
                <Col lg={6} className="mb-4">
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

                      {error && (
                        <Alert variant="danger" className="mb-4">
                          <i className="bi bi-exclamation-circle me-2"></i>
                          {error}
                        </Alert>
                      )}

                      <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                          <Form.Label>
                            Email Address / Mobile Number
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="emailOrMobile"
                            value={formData.emailOrMobile}
                            onChange={handleInputChange}
                            isInvalid={!!errors.emailOrMobile}
                            placeholder="Enter email or mobile number"
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.emailOrMobile}
                          </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Label>
                            Password <span className="text-danger">*</span>
                          </Form.Label>
                          <InputGroup>
                            <Form.Control
                              type={showPassword ? "text" : "password"}
                              name="password"
                              value={formData.password}
                              onChange={handleInputChange}
                              isInvalid={!!errors.password}
                              placeholder="Enter your password"
                            />
                            <Button
                              variant="outline-secondary"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              <i
                                className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}
                              ></i>
                            </Button>
                          </InputGroup>
                          <Form.Control.Feedback type="invalid">
                            {errors.password}
                          </Form.Control.Feedback>
                        </Form.Group>

                        <Row className="mb-3">
                          <Col>
                            <Form.Check
                              type="checkbox"
                              name="rememberMe"
                              checked={formData.rememberMe}
                              onChange={handleInputChange}
                              label="Remember me"
                              id="rememberMe"
                            />
                          </Col>
                          <Col className="text-end">
                            <Link
                              to="/forgot-password"
                              className="text-medical-red text-decoration-none"
                            >
                              Forgot Password?
                            </Link>
                          </Col>
                        </Row>

                        <Button
                          type="submit"
                          className="btn-medical-primary w-100 mb-3"
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <span
                                className="spinner-border spinner-border-sm me-2"
                                role="status"
                              ></span>
                              Signing In...
                            </>
                          ) : (
                            <>
                              <i className="bi bi-box-arrow-in-right me-2"></i>
                              Sign In
                            </>
                          )}
                        </Button>

                        <div className="text-center">
                          <p className="text-muted">
                            Don't have an account?{" "}
                            <Link
                              to="/register"
                              className="text-medical-red text-decoration-none fw-bold"
                            >
                              Register here
                            </Link>
                          </p>
                        </div>
                      </Form>
                    </Card.Body>
                  </Card>
                </Col>

                {/* Demo Credentials */}
                <Col lg={6}>
                  <Card className="medical-card">
                    <Card.Header className="bg-medical-light">
                      <h5 className="mb-0">
                        <i className="bi bi-key me-2"></i>
                        Demo Credentials
                      </h5>
                    </Card.Header>
                    <Card.Body>
                      <p className="text-muted mb-3">
                        Use these credentials to test the application:
                      </p>

                      {mockCredentials.map((cred, index) => (
                        <Card key={index} className="mb-3 border">
                          <Card.Body className="p-3">
                            <div className="d-flex justify-content-between align-items-start mb-2">
                              <h6 className="mb-0">{cred.type} Login</h6>
                              <Button
                                size="sm"
                                className="btn-medical-primary"
                                onClick={() => handleUseCredentials(cred)}
                                style={{
                                  fontSize: "12px",
                                  padding: "4px 12px",
                                }}
                              >
                                <i className="bi bi-arrow-right me-1"></i>
                                Use
                              </Button>
                            </div>
                            <p className="mb-1">
                              <strong>Email:</strong> {cred.email}
                            </p>
                            {cred.mobile && (
                              <p className="mb-1">
                                <strong>Mobile:</strong> {cred.mobile}
                              </p>
                            )}
                            <p className="mb-1">
                              <strong>Password:</strong> {cred.password}
                            </p>
                            <p className="text-muted mb-0">
                              {cred.description}
                            </p>
                          </Card.Body>
                        </Card>
                      ))}

                      <Alert variant="info" className="mt-3">
                        <i className="bi bi-info-circle me-2"></i>
                        <strong>Note:</strong> This is a demo application. Click
                        "Use" button above to auto-fill credentials, then click
                        "Sign In".
                      </Alert>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default Login;
