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
  Modal,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../store/slices/authSlice.js";
import unifiedApi from "../utils/unifiedApiClient";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    email: "",
    gender: "",
    age: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");

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

    // Full Name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = "Full name must be at least 2 characters";
    }

    // Mobile validation
    if (!formData.mobile.trim()) {
      newErrors.mobile = "Mobile number is required";
    } else if (!/^\d{10}$/.test(formData.mobile.replace(/\s+/g, ""))) {
      newErrors.mobile = "Mobile number must be exactly 10 digits";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email format is invalid";
    }

    // Gender validation
    if (!formData.gender) {
      newErrors.gender = "Please select your gender";
    }

    // Age validation
    if (!formData.age) {
      newErrors.age = "Age is required";
    } else if (parseInt(formData.age) < 18 || parseInt(formData.age) > 120) {
      newErrors.age = "Age must be between 18 and 120";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (
      !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(
        formData.password,
      )
    ) {
      newErrors.password =
        "Password must contain uppercase, lowercase, number and special character";
    }

    // Confirm Password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Terms validation
    if (!formData.terms) {
      newErrors.terms = "You must agree to the terms and conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Try backend API first, fallback to demo mode
      try {
        const data = await unifiedApi.post("/api/auth/register", {
          fullName: formData.fullName,
          email: formData.email,
          mobile: formData.mobile,
          password: formData.password,
          address: {
            street: "",
            city: "",
            state: "",
            pincode: "",
          },
        });

        // If we get here, registration was successful
        setShowOtpModal(true);
        return;
      } catch (error) {
        // Handle API errors
        console.log("Registration API error:", error.message);

        if (error.message && error.message.includes("already exists")) {
          // User already exists, redirect to login with prefilled email
          const isEmailExists = error.message.includes("email");
          const message = isEmailExists
            ? "An account with this email already exists. Redirecting to login..."
            : "An account with this mobile number already exists. Please login instead.";

          alert(message);

          // Store email for prefilling login form
          sessionStorage.setItem("prefillEmail", formData.email);

          // Redirect to login after short delay
          setTimeout(() => {
            navigate("/login");
          }, 1500);
          return;
        }

        // For other errors, fall back to demo mode
        console.log("Backend not available, using demo mode");
      }

      // Fallback to demo mode
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setShowOtpModal(true);
    } catch (error) {
      console.error("Registration error:", error);
      setErrors({
        general: error.message || "Registration failed. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerification = async () => {
    if (!otp || otp.length !== 6) {
      alert("Please enter a valid 6-digit OTP.");
      return;
    }

    try {
      // Try backend verification first
      try {
        const response = await fetch("/api/auth/verify-otp", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            otp: otp,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setShowOtpModal(false);
          setShowSuccessModal(true);

          setTimeout(() => {
            const newUser = {
              id: data.user?.id || Date.now(),
              fullName: formData.fullName,
              name: formData.fullName,
              email: formData.email,
              mobile: formData.mobile,
              gender: formData.gender,
              age: formData.age,
              role: 0,
              emailVerified: true,
              profileImage: null,
            };

            dispatch(loginSuccess({ user: newUser, rememberMe: false }));
            setShowSuccessModal(false);
            navigate("/user/dashboard");
          }, 2000);
          return;
        }
      } catch (backendError) {
        console.log("Backend verification not available, using demo mode");
      }

      // Fallback verification failed
      alert("OTP verification failed. Backend not available.");
    } catch (error) {
      console.error("OTP verification error:", error);
      alert("OTP verification failed. Please try again.");
    }
  };

  const resendOtp = async () => {
    try {
      // Try backend first
      try {
        const response = await fetch("/api/auth/resend-otp", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
          }),
        });

        if (response.ok) {
          alert(`New OTP sent to ${formData.email}`);
          return;
        }
      } catch (backendError) {
        console.log("Backend not available, using demo mode");
      }

      // Fallback mode
      alert(`OTP resent to ${formData.email} (backend not available)`);
    } catch (error) {
      console.error("Resend OTP error:", error);
      alert("Failed to resend OTP. Please try again later.");
    }
  };

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
                    <h3 className="mt-3">Create Your Account</h3>
                    <p className="text-muted">
                      Join our medical community for better healthcare
                    </p>
                  </div>

                  {errors.general && (
                    <Alert variant="danger" className="mb-4">
                      <i className="bi bi-exclamation-circle me-2"></i>
                      {errors.general}
                    </Alert>
                  )}

                  <Form onSubmit={handleSubmit}>
                    <Row>
                      {/* Personal Information */}
                      <Col lg={12} className="mb-4">
                        <h5 className="border-bottom pb-2 mb-3">
                          <i className="bi bi-person me-2"></i>
                          Personal Information
                        </h5>
                      </Col>

                      <Col lg={6} className="mb-3">
                        <Form.Label>
                          Full Name <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          isInvalid={!!errors.fullName}
                          placeholder="Enter your full name"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.fullName}
                        </Form.Control.Feedback>
                      </Col>

                      <Col lg={6} className="mb-3">
                        <Form.Label>
                          Mobile Number <span className="text-danger">*</span>
                        </Form.Label>
                        <InputGroup>
                          <InputGroup.Text>+91</InputGroup.Text>
                          <Form.Control
                            type="tel"
                            name="mobile"
                            value={formData.mobile}
                            onChange={handleInputChange}
                            isInvalid={!!errors.mobile}
                            placeholder="Enter mobile number"
                            maxLength={10}
                          />
                        </InputGroup>
                        <Form.Control.Feedback type="invalid">
                          {errors.mobile}
                        </Form.Control.Feedback>
                      </Col>

                      <Col lg={6} className="mb-3">
                        <Form.Label>
                          Email Address <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          isInvalid={!!errors.email}
                          placeholder="Enter email address"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.email}
                        </Form.Control.Feedback>
                        <Form.Text className="text-muted">
                          OTP will be sent to this email for verification
                        </Form.Text>
                      </Col>

                      <Col lg={3} className="mb-3">
                        <Form.Label>
                          Gender <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Select
                          name="gender"
                          value={formData.gender}
                          onChange={handleInputChange}
                          isInvalid={!!errors.gender}
                        >
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          {errors.gender}
                        </Form.Control.Feedback>
                      </Col>

                      <Col lg={3} className="mb-3">
                        <Form.Label>
                          Age <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="number"
                          name="age"
                          value={formData.age}
                          onChange={handleInputChange}
                          isInvalid={!!errors.age}
                          placeholder="Age"
                          min="18"
                          max="120"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.age}
                        </Form.Control.Feedback>
                      </Col>

                      {/* Security Information */}
                      <Col lg={12} className="mb-4 mt-3">
                        <h5 className="border-bottom pb-2 mb-3">
                          <i className="bi bi-shield-lock me-2"></i>
                          Security Information
                        </h5>
                      </Col>

                      <Col lg={6} className="mb-3">
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
                            placeholder="Create a strong password"
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
                        <Form.Text className="text-muted">
                          Must contain uppercase, lowercase, number and special
                          character
                        </Form.Text>
                      </Col>

                      <Col lg={6} className="mb-3">
                        <Form.Label>
                          Confirm Password{" "}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <InputGroup>
                          <Form.Control
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            isInvalid={!!errors.confirmPassword}
                            placeholder="Confirm your password"
                          />
                          <Button
                            variant="outline-secondary"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                          >
                            <i
                              className={`bi ${showConfirmPassword ? "bi-eye-slash" : "bi-eye"}`}
                            ></i>
                          </Button>
                        </InputGroup>
                        <Form.Control.Feedback type="invalid">
                          {errors.confirmPassword}
                        </Form.Control.Feedback>
                      </Col>

                      {/* Terms and Conditions */}
                      <Col lg={12} className="mb-4">
                        <Form.Check
                          type="checkbox"
                          name="terms"
                          checked={formData.terms}
                          onChange={handleInputChange}
                          isInvalid={!!errors.terms}
                          label={
                            <>
                              I agree to the{" "}
                              <Link
                                to="#"
                                className="text-medical-red text-decoration-none"
                              >
                                Terms & Conditions
                              </Link>{" "}
                              and{" "}
                              <Link
                                to="#"
                                className="text-medical-red text-decoration-none"
                              >
                                Privacy Policy
                              </Link>
                            </>
                          }
                          id="terms"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.terms}
                        </Form.Control.Feedback>
                      </Col>

                      <Col lg={12} className="mb-3">
                        <Button
                          type="submit"
                          className="btn-medical-primary w-100"
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <span
                                className="spinner-border spinner-border-sm me-2"
                                role="status"
                              ></span>
                              Creating Account...
                            </>
                          ) : (
                            <>
                              <i className="bi bi-person-plus me-2"></i>
                              Create Account
                            </>
                          )}
                        </Button>
                      </Col>

                      <Col lg={12} className="text-center">
                        <p className="text-muted">
                          Already have an account?{" "}
                          <Link
                            to="/login"
                            className="text-medical-red text-decoration-none fw-bold"
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

      {/* OTP Verification Modal */}
      <Modal
        show={showOtpModal}
        onHide={() => {}}
        centered
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header>
          <Modal.Title>Email Verification</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center mb-4">
            <i className="bi bi-envelope-check display-1 text-medical-blue mb-3"></i>
            <h5>Verify Your Email</h5>
            <p className="text-muted">
              We've sent a 6-digit OTP to <strong>{formData.email}</strong>
            </p>
          </div>

          <Form.Group className="mb-3">
            <Form.Label>Enter OTP</Form.Label>
            <Form.Control
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter 6-digit OTP"
              maxLength={6}
              className="text-center fs-4 letter-spacing-wide"
            />
          </Form.Group>

          <div className="text-center">
            <Button
              variant="link"
              onClick={resendOtp}
              className="text-medical-red text-decoration-none"
            >
              Didn't receive OTP? Resend
            </Button>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="btn-medical-primary w-100"
            onClick={handleOtpVerification}
            disabled={otp.length !== 6}
          >
            Verify Email
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Success Modal */}
      <Modal
        show={showSuccessModal}
        onHide={() => {}}
        centered
        backdrop="static"
        keyboard={false}
      >
        <Modal.Body className="text-center">
          <i className="bi bi-check-circle-fill text-success display-1 mb-3"></i>
          <h4>Registration Successful!</h4>
          <p className="text-muted">
            Your account has been created successfully. You will be redirected
            to your dashboard.
          </p>
          <div className="spinner-border text-medical-red" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Register;
