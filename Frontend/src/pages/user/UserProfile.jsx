import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
  Tab,
  Nav,
  Modal,
  Spinner,
  InputGroup,
  Badge,
} from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { updateUser } from "../../store/slices/authSlice";
import { api } from "../../utils/apiClient";
import { enhancedApi } from "../../utils/enhancedApiClient";
import { getBackendURL } from "../../utils/config";
import { showNetworkDebugInfo } from "../../utils/networkDebug";
import {
  PageHeroSection,
  ThemeCard,
  ThemeButton,
  ThemeSection,
} from "../../components/common/ConsistentTheme";

const UserProfile = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("personal");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: "", variant: "" });
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // Personal Information State
  const [personalInfo, setPersonalInfo] = useState({
    fullName: "",
    email: "",
    mobile: "",
    dateOfBirth: "",
    gender: "",
    profileImage: "",
  });

  const [profileImageFile, setProfileImageFile] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState("");

  // Address Information State
  const [addressInfo, setAddressInfo] = useState({
    street: "",
    city: "",
    state: "",
    pincode: "",
    landmark: "",
  });

  // Password Change State
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Email Verification State
  const [emailVerification, setEmailVerification] = useState({
    isVerified: false,
    showOtpModal: false,
    otp: "",
    isResending: false,
    otpTimer: 0,
  });

  // Initialize form data from user
  useEffect(() => {
    if (user) {
      setPersonalInfo({
        fullName: user.name || user.fullName || "",
        email: user.email || "",
        mobile: user.mobile || "",
        dateOfBirth: user.dateOfBirth || "",
        gender: user.gender || "",
        profileImage: user.profileImage || "",
      });

      setAddressInfo({
        street: user.address?.street || user.address || "",
        city: user.address?.city || user.city || "",
        state: user.address?.state || user.state || "",
        pincode: user.address?.pincode || user.pincode || "",
        landmark: user.address?.landmark || user.landmark || "",
      });

      // Set email verification status
      setEmailVerification((prev) => ({
        ...prev,
        isVerified: user.emailVerified || false,
      }));
    }
  }, [user]);

  // Debug network connectivity on component mount (safe for production)
  useEffect(() => {
    const debugNetwork = () => {
      const backendURL = getBackendURL();
      console.log("🌐 UserProfile Network Debug:");
      console.log("- Backend URL:", backendURL);
      console.log("- Current Location:", window.location.href);
      console.log(
        "- User Agent:",
        navigator.userAgent.substring(0, 50) + "...",
      );
      console.log(
        "- Connection Status:",
        navigator.onLine ? "Online" : "Offline",
      );

      // Check if auth token exists
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      console.log("- Auth Token Present:", !!token);
      if (token && window.location.hostname === "localhost") {
        console.log("- Token Preview:", token.substring(0, 20) + "...");
      }

      // Add safe connectivity hint for production
      if (
        window.location.hostname !== "localhost" &&
        window.location.hostname !== "127.0.0.1"
      ) {
        console.log(
          "💡 Tip: Add '?debug=true' to URL to enable network testing tools",
        );
      }
    };

    // Only run debug on mount, and catch any errors
    try {
      debugNetwork();
    } catch (error) {
      console.warn("Debug info collection failed:", error.message);
    }
  }, []);

  const showAlert = (message, variant) => {
    setAlert({ show: true, message, variant });
    setTimeout(() => {
      setAlert({ show: false, message: "", variant: "" });
    }, 5000);
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        showAlert("Please select a valid image file", "danger");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        showAlert("Image size must be less than 5MB", "danger");
        return;
      }

      setProfileImageFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImagePreview(e.target.result);
        setPersonalInfo({
          ...personalInfo,
          profileImage: e.target.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeProfileImage = () => {
    setProfileImageFile(null);
    setProfileImagePreview("");
    setPersonalInfo({
      ...personalInfo,
      profileImage: "",
    });
  };

  const handlePersonalInfoSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Prepare profile data for API
      const profileData = {
        fullName: personalInfo.fullName,
        mobile: personalInfo.mobile,
        dateOfBirth: personalInfo.dateOfBirth,
        gender: personalInfo.gender,
        profileImage: personalInfo.profileImage,
      };

      console.log("🔄 Attempting to update profile with data:", profileData);

      // Make actual API call to update profile using enhanced client
      const result = await enhancedApi.put(
        "/api/auth/update-profile",
        profileData,
      );

      console.log("📊 Profile update API response:", result);

      if (result && result.success !== false) {
        // Update Redux store with new user data
        dispatch(
          updateUser({
            name: personalInfo.fullName,
            fullName: personalInfo.fullName,
            mobile: personalInfo.mobile,
            dateOfBirth: personalInfo.dateOfBirth,
            gender: personalInfo.gender,
            profileImage: personalInfo.profileImage,
          }),
        );

        // Trigger real-time sync event for other components
        window.dispatchEvent(
          new CustomEvent("profileUpdated", {
            detail: profileData,
          }),
        );

        showAlert("Personal information updated successfully!", "success");
      } else {
        const errorMsg =
          result?.error || result?.message || "Failed to update profile";
        console.error("❌ Profile update failed:", errorMsg);
        throw new Error(errorMsg);
      }
    } catch (error) {
      console.error("❌ Profile update error:", error);

      // Enhanced error message based on error type
      let errorMessage = "Failed to update information. Please try again.";

      if (error.message === "Failed to fetch") {
        errorMessage =
          "Unable to connect to server. Please check your internet connection and try again.";
      } else if (error.message.includes("timeout")) {
        errorMessage = "Request timed out. Please try again.";
      } else if (
        error.message.includes("401") ||
        error.message.includes("unauthorized")
      ) {
        errorMessage = "Session expired. Please log in again.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      showAlert(errorMessage, "danger");
    } finally {
      setLoading(false);
    }
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("🔄 Attempting to update address with data:", addressInfo);

      // Make actual API call to update address using enhanced client
      const result = await enhancedApi.put("/api/auth/update-profile", {
        address: addressInfo,
      });

      console.log("📊 Address update API response:", result);

      if (result && result.success !== false) {
        // Update Redux store with new address data
        dispatch(
          updateUser({
            address: addressInfo,
          }),
        );

        // Trigger real-time sync event
        window.dispatchEvent(
          new CustomEvent("profileUpdated", {
            detail: { address: addressInfo },
          }),
        );

        showAlert("Address updated successfully!", "success");
      } else {
        const errorMsg =
          result?.error || result?.message || "Failed to update address";
        console.error("❌ Address update failed:", errorMsg);
        throw new Error(errorMsg);
      }
    } catch (error) {
      console.error("❌ Address update error:", error);

      // Enhanced error message based on error type
      let errorMessage = "Failed to update address. Please try again.";

      if (error.message === "Failed to fetch") {
        errorMessage =
          "Unable to connect to server. Please check your internet connection and try again.";
      } else if (error.message.includes("timeout")) {
        errorMessage = "Request timed out. Please try again.";
      } else if (
        error.message.includes("401") ||
        error.message.includes("unauthorized")
      ) {
        errorMessage = "Session expired. Please log in again.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      showAlert(errorMessage, "danger");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword.length < 6) {
      showAlert("New password must be at least 6 characters long.", "danger");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showAlert("New passwords do not match.", "danger");
      return;
    }

    setLoading(true);

    try {
      // Make actual API call to change password using enhanced client
      const result = await enhancedApi.put("/api/auth/change-password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      if (result.success !== false) {
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setShowPasswordModal(false);
        showAlert("Password changed successfully!", "success");
      } else {
        throw new Error(result.error || "Failed to change password");
      }
    } catch (error) {
      console.error("Password change error:", error);
      showAlert(
        error.message || "Failed to change password. Please try again.",
        "danger",
      );
    } finally {
      setLoading(false);
    }
  };

  // Network connectivity test function with enhanced error handling
  const testNetworkConnection = async () => {
    setLoading(true);
    try {
      console.log("🔄 Starting network connectivity test...");
      const results = await showNetworkDebugInfo();

      if (
        results?.tests?.health?.success &&
        results?.tests?.apiClient?.success
      ) {
        showAlert("✅ Network connectivity is working properly!", "success");
      } else if (results?.tests) {
        // Show specific error details
        let errorDetails = "Issues found:\n";
        if (!results.tests.health?.success) {
          errorDetails += `• Health check: ${results.tests.health?.error || "Failed"}\n`;
        }
        if (!results.tests.apiClient?.success) {
          errorDetails += `• API client: ${results.tests.apiClient?.error || "Failed"}\n`;
        }
        if (results.tests.auth?.success === false) {
          errorDetails += `• Authentication: ${results.tests.auth?.error || "Failed"}\n`;
        }

        console.warn("Network connectivity issues:", errorDetails);
        showAlert(
          "❌ Network connectivity issues detected. Check console for details.",
          "warning",
        );
      } else {
        throw new Error("Network test returned invalid results");
      }
    } catch (error) {
      console.error("❌ Network test failed:", error);

      // Show user-friendly error message based on error type
      let userMessage = "Network test failed. ";
      if (error.message === "Failed to fetch") {
        userMessage +=
          "Cannot reach the server. Please check your internet connection.";
      } else if (error.message.includes("timeout")) {
        userMessage +=
          "Request timed out. The server may be slow or unreachable.";
      } else if (error.name === "TypeError") {
        userMessage += "Network request error. Please try again.";
      } else {
        userMessage += error.message || "Unknown error occurred.";
      }

      showAlert("❌ " + userMessage, "danger");
    } finally {
      setLoading(false);
    }
  };

  // Email verification functions
  const sendVerificationOTP = async () => {
    setEmailVerification((prev) => ({ ...prev, isResending: true }));

    try {
      const result = await enhancedApi.post("/api/auth/resend-otp", {
        email: personalInfo.email,
      });

      if (result && result.success !== false) {
        showAlert("✅ Verification OTP sent to your email!", "success");
        setEmailVerification((prev) => ({
          ...prev,
          showOtpModal: true,
          otpTimer: 300, // 5 minutes
        }));
        startOtpTimer();
      } else {
        throw new Error(result?.error || "Failed to send OTP");
      }
    } catch (error) {
      console.error("❌ Send OTP error:", error);
      showAlert(
        error.message || "Failed to send OTP. Please try again.",
        "danger",
      );
    } finally {
      setEmailVerification((prev) => ({ ...prev, isResending: false }));
    }
  };

  const verifyEmailOTP = async () => {
    if (!emailVerification.otp || emailVerification.otp.length !== 6) {
      showAlert("Please enter a valid 6-digit OTP.", "warning");
      return;
    }

    setLoading(true);

    try {
      const result = await enhancedApi.post("/api/auth/verify-otp", {
        email: personalInfo.email,
        otp: emailVerification.otp,
      });

      if (result && result.success !== false) {
        // Update user state
        dispatch(updateUser({ emailVerified: true }));

        setEmailVerification({
          isVerified: true,
          showOtpModal: false,
          otp: "",
          isResending: false,
          otpTimer: 0,
        });

        showAlert("✅ Email verified successfully!", "success");
      } else {
        throw new Error(result?.error || "Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("❌ OTP verification error:", error);
      showAlert(
        error.message || "OTP verification failed. Please try again.",
        "danger",
      );
    } finally {
      setLoading(false);
    }
  };

  const startOtpTimer = () => {
    const timer = setInterval(() => {
      setEmailVerification((prev) => {
        if (prev.otpTimer <= 1) {
          clearInterval(timer);
          return { ...prev, otpTimer: 0 };
        }
        return { ...prev, otpTimer: prev.otpTimer - 1 };
      });
    }, 1000);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="fade-in">
      {/* Hero Section */}
      <PageHeroSection
        title={`Welcome, ${personalInfo.fullName || user?.name || "User"}!`}
        subtitle="Manage your profile information and account settings"
        icon="bi-person-circle"
      />

      <ThemeSection background="#f8f9fa">
        <Container>
          {/* Alert */}
          {alert.show && (
            <Row className="mb-4">
              <Col lg={12}>
                <Alert
                  variant={alert.variant}
                  dismissible
                  onClose={() =>
                    setAlert({ show: false, message: "", variant: "" })
                  }
                >
                  {alert.message}
                </Alert>
              </Col>
            </Row>
          )}

          {/* Network Debug Section (Development/Testing Only) */}
          {(window.location.hostname === "localhost" ||
            window.location.hostname === "127.0.0.1" ||
            (window.location.hostname.includes("fly.dev") &&
              window.location.search.includes("debug=true"))) && (
            <Row className="mb-3">
              <Col lg={12}>
                <div className="text-center">
                  <Button
                    variant="outline-info"
                    size="sm"
                    onClick={testNetworkConnection}
                    disabled={loading}
                    className="me-2"
                  >
                    {loading ? (
                      <Spinner size="sm" className="me-1" />
                    ) : (
                      <i className="bi bi-wifi me-1"></i>
                    )}
                    Test Network Connection
                  </Button>
                  <small className="text-muted">
                    Debug tool for connectivity issues (dev only)
                  </small>
                </div>
              </Col>
            </Row>
          )}

          {/* Profile Overview Card */}
          <Row className="mb-4">
            <Col lg={12}>
              <ThemeCard
                title="Profile Overview"
                icon="bi-person-badge"
                className="mb-4"
              >
                <Row>
                  <Col md={3} className="text-center">
                    <div className="position-relative d-inline-block mb-3">
                      <div
                        className="profile-avatar"
                        style={{
                          width: "120px",
                          height: "120px",
                          borderRadius: "50%",
                          background: personalInfo.profileImage
                            ? "transparent"
                            : "linear-gradient(135deg, #e63946, #dc3545)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          fontSize: "3rem",
                          boxShadow: "0 8px 32px rgba(230, 57, 70, 0.3)",
                          cursor: "pointer",
                          transition: "transform 0.3s ease",
                          overflow: "hidden",
                        }}
                        onClick={() =>
                          document.getElementById("profile-image-input").click()
                        }
                        onMouseOver={(e) =>
                          (e.currentTarget.style.transform = "scale(1.05)")
                        }
                        onMouseOut={(e) =>
                          (e.currentTarget.style.transform = "scale(1)")
                        }
                      >
                        {personalInfo.profileImage ? (
                          <img
                            src={personalInfo.profileImage}
                            alt="Profile"
                            style={{
                              width: "100%",
                              height: "100%",
                              borderRadius: "50%",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <i className="bi bi-person-fill"></i>
                        )}
                        <div
                          className="position-absolute bottom-0 end-0"
                          style={{
                            background: "#e63946",
                            borderRadius: "50%",
                            width: "32px",
                            height: "32px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            border: "3px solid white",
                          }}
                        >
                          <i
                            className="bi bi-camera text-white"
                            style={{ fontSize: "14px" }}
                          ></i>
                        </div>
                      </div>
                      <input
                        type="file"
                        id="profile-image-input"
                        accept="image/*"
                        onChange={handleProfileImageChange}
                        style={{ display: "none" }}
                      />
                    </div>

                    {personalInfo.profileImage && (
                      <div className="mb-2">
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={removeProfileImage}
                        >
                          <i className="bi bi-trash me-1"></i>
                          Remove Photo
                        </Button>
                      </div>
                    )}

                    <h5 className="mb-1">
                      {personalInfo.fullName || "User Name"}
                    </h5>
                    <p className="text-muted mb-2">{personalInfo.email}</p>
                    <Badge bg="success" className="px-3 py-2">
                      Active Account
                    </Badge>
                  </Col>
                  <Col md={9}>
                    <Row>
                      <Col md={6}>
                        <div className="info-item mb-3">
                          <label className="text-muted small">
                            Mobile Number
                          </label>
                          <div className="fw-bold">
                            {personalInfo.mobile || "Not provided"}
                          </div>
                        </div>
                        <div className="info-item mb-3">
                          <label className="text-muted small">
                            Date of Birth
                          </label>
                          <div className="fw-bold">
                            {personalInfo.dateOfBirth || "Not provided"}
                          </div>
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="info-item mb-3">
                          <label className="text-muted small">Gender</label>
                          <div className="fw-bold">
                            {personalInfo.gender || "Not specified"}
                          </div>
                        </div>
                        <div className="info-item mb-3">
                          <label className="text-muted small">
                            Member Since
                          </label>
                          <div className="fw-bold">
                            {new Date().getFullYear()}
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </ThemeCard>
            </Col>
          </Row>

          {/* Tabbed Interface */}
          <Row>
            <Col lg={12}>
              <ThemeCard className="profile-tabs-card">
                <Tab.Container
                  activeKey={activeTab}
                  onSelect={(k) => setActiveTab(k)}
                >
                  <Nav variant="pills" className="nav-pills-custom mb-4">
                    <Nav.Item>
                      <Nav.Link eventKey="personal" className="nav-pill-item">
                        <i className="bi bi-person me-2"></i>
                        Personal Information
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="address" className="nav-pill-item">
                        <i className="bi bi-geo-alt me-2"></i>
                        Address Details
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="security" className="nav-pill-item">
                        <i className="bi bi-shield-lock me-2"></i>
                        Security Settings
                      </Nav.Link>
                    </Nav.Item>
                  </Nav>

                  <Tab.Content>
                    {/* Personal Information Tab */}
                    <Tab.Pane eventKey="personal">
                      <Form onSubmit={handlePersonalInfoSubmit}>
                        <Row>
                          <Col md={6}>
                            <Form.Group className="mb-4">
                              <Form.Label className="form-label-custom">
                                <i className="bi bi-person me-2"></i>Full Name
                              </Form.Label>
                              <Form.Control
                                type="text"
                                placeholder="Enter your full name"
                                value={personalInfo.fullName}
                                onChange={(e) =>
                                  setPersonalInfo({
                                    ...personalInfo,
                                    fullName: e.target.value,
                                  })
                                }
                                className="form-control-custom"
                              />
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group className="mb-4">
                              <Form.Label className="form-label-custom">
                                <i className="bi bi-envelope me-2"></i>Email
                                Address
                              </Form.Label>
                              <div className="position-relative">
                                <Form.Control
                                  type="email"
                                  placeholder="Enter your email"
                                  value={personalInfo.email}
                                  onChange={(e) =>
                                    setPersonalInfo({
                                      ...personalInfo,
                                      email: e.target.value,
                                    })
                                  }
                                  className="form-control-custom"
                                  disabled
                                />
                                <div className="position-absolute top-50 end-0 translate-middle-y pe-3">
                                  {emailVerification.isVerified ? (
                                    <Badge
                                      bg="success"
                                      className="d-flex align-items-center"
                                    >
                                      <i className="bi bi-check-circle me-1"></i>
                                      Verified
                                    </Badge>
                                  ) : (
                                    <Badge
                                      bg="warning"
                                      className="d-flex align-items-center"
                                    >
                                      <i className="bi bi-exclamation-triangle me-1"></i>
                                      Unverified
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              {emailVerification.isVerified ? (
                                <Form.Text className="text-success">
                                  <i className="bi bi-check-circle me-1"></i>
                                  Your email address is verified
                                </Form.Text>
                              ) : (
                                <div className="mt-2">
                                  <Form.Text className="text-warning d-block mb-2">
                                    <i className="bi bi-exclamation-triangle me-1"></i>
                                    Your email is not verified. Click below to
                                    verify.
                                  </Form.Text>
                                  <Button
                                    variant="outline-primary"
                                    size="sm"
                                    onClick={sendVerificationOTP}
                                    disabled={
                                      emailVerification.isResending || loading
                                    }
                                    className="d-flex align-items-center"
                                  >
                                    {emailVerification.isResending ? (
                                      <>
                                        <Spinner size="sm" className="me-2" />
                                        Sending OTP...
                                      </>
                                    ) : (
                                      <>
                                        <i className="bi bi-envelope-check me-2"></i>
                                        Verify Email
                                      </>
                                    )}
                                  </Button>
                                </div>
                              )}
                            </Form.Group>
                          </Col>
                        </Row>

                        <Row>
                          <Col md={6}>
                            <Form.Group className="mb-4">
                              <Form.Label className="form-label-custom">
                                <i className="bi bi-phone me-2"></i>Mobile
                                Number
                              </Form.Label>
                              <InputGroup>
                                <InputGroup.Text>+91</InputGroup.Text>
                                <Form.Control
                                  type="tel"
                                  placeholder="Enter mobile number"
                                  value={personalInfo.mobile}
                                  onChange={(e) =>
                                    setPersonalInfo({
                                      ...personalInfo,
                                      mobile: e.target.value,
                                    })
                                  }
                                  className="form-control-custom"
                                />
                              </InputGroup>
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group className="mb-4">
                              <Form.Label className="form-label-custom">
                                <i className="bi bi-calendar me-2"></i>Date of
                                Birth
                              </Form.Label>
                              <Form.Control
                                type="date"
                                value={personalInfo.dateOfBirth}
                                onChange={(e) =>
                                  setPersonalInfo({
                                    ...personalInfo,
                                    dateOfBirth: e.target.value,
                                  })
                                }
                                className="form-control-custom"
                              />
                            </Form.Group>
                          </Col>
                        </Row>

                        <Row>
                          <Col md={6}>
                            <Form.Group className="mb-4">
                              <Form.Label className="form-label-custom">
                                <i className="bi bi-gender-ambiguous me-2"></i>
                                Gender
                              </Form.Label>
                              <Form.Select
                                value={personalInfo.gender}
                                onChange={(e) =>
                                  setPersonalInfo({
                                    ...personalInfo,
                                    gender: e.target.value,
                                  })
                                }
                                className="form-control-custom"
                              >
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                                <option value="prefer-not-to-say">
                                  Prefer not to say
                                </option>
                              </Form.Select>
                            </Form.Group>
                          </Col>
                        </Row>

                        <div className="text-end">
                          <ThemeButton
                            type="submit"
                            variant="primary"
                            disabled={loading}
                            icon={
                              loading ? "bi-arrow-clockwise" : "bi-check-circle"
                            }
                            size="lg"
                          >
                            {loading
                              ? "Updating..."
                              : "Update Personal Information"}
                          </ThemeButton>
                        </div>
                      </Form>
                    </Tab.Pane>

                    {/* Address Information Tab */}
                    <Tab.Pane eventKey="address">
                      <Form onSubmit={handleAddressSubmit}>
                        <Row>
                          <Col md={12}>
                            <Form.Group className="mb-4">
                              <Form.Label className="form-label-custom">
                                <i className="bi bi-house me-2"></i>Street
                                Address
                              </Form.Label>
                              <Form.Control
                                type="text"
                                placeholder="Enter your street address"
                                value={addressInfo.street}
                                onChange={(e) =>
                                  setAddressInfo({
                                    ...addressInfo,
                                    street: e.target.value,
                                  })
                                }
                                className="form-control-custom"
                              />
                            </Form.Group>
                          </Col>
                        </Row>

                        <Row>
                          <Col md={6}>
                            <Form.Group className="mb-4">
                              <Form.Label className="form-label-custom">
                                <i className="bi bi-building me-2"></i>City
                              </Form.Label>
                              <Form.Control
                                type="text"
                                placeholder="Enter your city"
                                value={addressInfo.city}
                                onChange={(e) =>
                                  setAddressInfo({
                                    ...addressInfo,
                                    city: e.target.value,
                                  })
                                }
                                className="form-control-custom"
                              />
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group className="mb-4">
                              <Form.Label className="form-label-custom">
                                <i className="bi bi-map me-2"></i>State
                              </Form.Label>
                              <Form.Control
                                type="text"
                                placeholder="Enter your state"
                                value={addressInfo.state}
                                onChange={(e) =>
                                  setAddressInfo({
                                    ...addressInfo,
                                    state: e.target.value,
                                  })
                                }
                                className="form-control-custom"
                              />
                            </Form.Group>
                          </Col>
                        </Row>

                        <Row>
                          <Col md={6}>
                            <Form.Group className="mb-4">
                              <Form.Label className="form-label-custom">
                                <i className="bi bi-mailbox me-2"></i>PIN Code
                              </Form.Label>
                              <Form.Control
                                type="text"
                                placeholder="Enter PIN code"
                                value={addressInfo.pincode}
                                onChange={(e) =>
                                  setAddressInfo({
                                    ...addressInfo,
                                    pincode: e.target.value,
                                  })
                                }
                                className="form-control-custom"
                                maxLength={6}
                              />
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group className="mb-4">
                              <Form.Label className="form-label-custom">
                                <i className="bi bi-signpost me-2"></i>Landmark
                                (Optional)
                              </Form.Label>
                              <Form.Control
                                type="text"
                                placeholder="Enter nearby landmark"
                                value={addressInfo.landmark}
                                onChange={(e) =>
                                  setAddressInfo({
                                    ...addressInfo,
                                    landmark: e.target.value,
                                  })
                                }
                                className="form-control-custom"
                              />
                            </Form.Group>
                          </Col>
                        </Row>

                        <div className="text-end">
                          <ThemeButton
                            type="submit"
                            variant="primary"
                            disabled={loading}
                            icon={
                              loading ? "bi-arrow-clockwise" : "bi-check-circle"
                            }
                            size="lg"
                          >
                            {loading
                              ? "Updating..."
                              : "Update Address Information"}
                          </ThemeButton>
                        </div>
                      </Form>
                    </Tab.Pane>

                    {/* Security Settings Tab */}
                    <Tab.Pane eventKey="security">
                      <Row>
                        <Col md={8}>
                          <div className="security-section">
                            <div className="mb-4">
                              <h5 className="mb-3">
                                <i className="bi bi-shield-lock me-2 text-primary"></i>
                                Password & Security
                              </h5>
                              <p className="text-muted">
                                Keep your account secure by using a strong
                                password and enabling additional security
                                features.
                              </p>
                            </div>

                            <Card className="border-light shadow-sm mb-4">
                              <Card.Body>
                                <Row>
                                  <Col md={8}>
                                    <h6 className="mb-2">
                                      <i className="bi bi-key me-2"></i>Password
                                    </h6>
                                    <p className="text-muted mb-0">
                                      Last changed 30 days ago
                                    </p>
                                  </Col>
                                  <Col md={4} className="text-end">
                                    <ThemeButton
                                      variant="outline"
                                      onClick={() => setShowPasswordModal(true)}
                                      icon="bi-pencil"
                                    >
                                      Change Password
                                    </ThemeButton>
                                  </Col>
                                </Row>
                              </Card.Body>
                            </Card>

                            <Card className="border-light shadow-sm mb-4">
                              <Card.Body>
                                <Row>
                                  <Col md={8}>
                                    <h6 className="mb-2">
                                      <i className="bi bi-envelope-check me-2"></i>
                                      Email Verification
                                    </h6>
                                    <p className="text-muted mb-0">
                                      {emailVerification.isVerified
                                        ? "Your email address is verified"
                                        : "Your email address needs verification"}
                                    </p>
                                  </Col>
                                  <Col md={4} className="text-end">
                                    {emailVerification.isVerified ? (
                                      <Badge bg="success" className="px-3 py-2">
                                        <i className="bi bi-check-circle me-1"></i>
                                        Verified
                                      </Badge>
                                    ) : (
                                      <div className="d-flex align-items-center gap-2">
                                        <Badge
                                          bg="warning"
                                          className="px-3 py-2"
                                        >
                                          <i className="bi bi-exclamation-triangle me-1"></i>
                                          Unverified
                                        </Badge>
                                        <Button
                                          variant="outline-primary"
                                          size="sm"
                                          onClick={sendVerificationOTP}
                                          disabled={
                                            emailVerification.isResending ||
                                            loading
                                          }
                                        >
                                          {emailVerification.isResending ? (
                                            <>
                                              <Spinner
                                                size="sm"
                                                className="me-1"
                                              />
                                              Sending...
                                            </>
                                          ) : (
                                            <>
                                              <i className="bi bi-envelope-check me-1"></i>
                                              Verify
                                            </>
                                          )}
                                        </Button>
                                      </div>
                                    )}
                                  </Col>
                                </Row>
                              </Card.Body>
                            </Card>

                            <Card className="border-light shadow-sm">
                              <Card.Body>
                                <Row>
                                  <Col md={8}>
                                    <h6 className="mb-2">
                                      <i className="bi bi-phone-vibrate me-2"></i>
                                      Two-Factor Authentication
                                    </h6>
                                    <p className="text-muted mb-0">
                                      Add an extra layer of security to your
                                      account
                                    </p>
                                  </Col>
                                  <Col md={4} className="text-end">
                                    <ThemeButton
                                      variant="outline"
                                      icon="bi-shield-plus"
                                    >
                                      Enable 2FA
                                    </ThemeButton>
                                  </Col>
                                </Row>
                              </Card.Body>
                            </Card>
                          </div>
                        </Col>
                        <Col md={4}>
                          <Card className="border-primary bg-light">
                            <Card.Body className="text-center">
                              <i className="bi bi-shield-check display-4 text-primary mb-3"></i>
                              <h6>Security Tips</h6>
                              <ul className="list-unstyled text-start small">
                                <li className="mb-2">
                                  <i className="bi bi-check text-success me-2"></i>
                                  Use a strong, unique password
                                </li>
                                <li className="mb-2">
                                  <i className="bi bi-check text-success me-2"></i>
                                  Enable two-factor authentication
                                </li>
                                <li className="mb-2">
                                  <i className="bi bi-check text-success me-2"></i>
                                  Keep your email address updated
                                </li>
                                <li className="mb-0">
                                  <i className="bi bi-check text-success me-2"></i>
                                  Log out from shared devices
                                </li>
                              </ul>
                            </Card.Body>
                          </Card>
                        </Col>
                      </Row>
                    </Tab.Pane>
                  </Tab.Content>
                </Tab.Container>
              </ThemeCard>
            </Col>
          </Row>
        </Container>
      </ThemeSection>

      {/* Change Password Modal */}
      <Modal
        show={showPasswordModal}
        onHide={() => setShowPasswordModal(false)}
        centered
        size="md"
      >
        <Modal.Header closeButton className="border-0">
          <Modal.Title>
            <i className="bi bi-key me-2"></i>Change Password
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="px-4">
          <Form onSubmit={handlePasswordSubmit}>
            <Form.Group className="mb-4">
              <Form.Label className="form-label-custom">
                <i className="bi bi-lock me-2"></i>Current Password
              </Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter your current password"
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    currentPassword: e.target.value,
                  })
                }
                className="form-control-custom"
                required
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="form-label-custom">
                <i className="bi bi-shield-lock me-2"></i>New Password
              </Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter your new password"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    newPassword: e.target.value,
                  })
                }
                className="form-control-custom"
                minLength={6}
                required
              />
              <Form.Text className="text-muted">
                Password must be at least 6 characters long
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="form-label-custom">
                <i className="bi bi-shield-check me-2"></i>Confirm New Password
              </Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm your new password"
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    confirmPassword: e.target.value,
                  })
                }
                className="form-control-custom"
                required
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="border-0 px-4">
          <Button
            variant="secondary"
            onClick={() => setShowPasswordModal(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <ThemeButton
            variant="primary"
            onClick={handlePasswordSubmit}
            disabled={loading}
            icon={loading ? "bi-arrow-clockwise" : "bi-check-circle"}
          >
            {loading ? "Changing..." : "Change Password"}
          </ThemeButton>
        </Modal.Footer>
      </Modal>

      {/* Email Verification OTP Modal */}
      <Modal
        show={emailVerification.showOtpModal}
        onHide={() =>
          setEmailVerification((prev) => ({
            ...prev,
            showOtpModal: false,
            otp: "",
          }))
        }
        centered
        size="md"
      >
        <Modal.Header closeButton className="border-0">
          <Modal.Title>
            <i className="bi bi-envelope-check me-2"></i>Verify Your Email
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="px-4">
          <div className="text-center mb-4">
            <div className="mb-3">
              <i
                className="bi bi-envelope-check"
                style={{ fontSize: "48px", color: "#e63946" }}
              ></i>
            </div>
            <h6 className="mb-2">Verification Code Sent!</h6>
            <p className="text-muted mb-0">
              We've sent a 6-digit verification code to
            </p>
            <p className="fw-bold text-primary mb-3">{personalInfo.email}</p>
            <p className="text-muted small">
              Please enter the code below to verify your email address.
            </p>
          </div>

          <Form>
            <Form.Group className="mb-4">
              <Form.Label className="form-label-custom text-center d-block">
                <i className="bi bi-shield-check me-2"></i>Enter 6-Digit OTP
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="000000"
                value={emailVerification.otp}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                  setEmailVerification((prev) => ({ ...prev, otp: value }));
                }}
                className="form-control-custom text-center"
                style={{
                  fontSize: "18px",
                  letterSpacing: "8px",
                  fontWeight: "600",
                }}
                maxLength="6"
                autoComplete="off"
              />
              <Form.Text className="text-muted text-center d-block mt-2">
                <i className="bi bi-info-circle me-1"></i>
                Enter the 6-digit code sent to your email
              </Form.Text>
            </Form.Group>

            {emailVerification.otpTimer > 0 && (
              <div className="text-center mb-3">
                <Badge bg="info" className="px-3 py-2">
                  <i className="bi bi-clock me-1"></i>
                  Code expires in: {formatTime(emailVerification.otpTimer)}
                </Badge>
              </div>
            )}

            <div className="text-center mb-3">
              <Button
                variant="link"
                size="sm"
                onClick={sendVerificationOTP}
                disabled={
                  emailVerification.isResending ||
                  emailVerification.otpTimer > 240
                } // Disable for first 1 minute
                className="text-decoration-none"
              >
                {emailVerification.isResending ? (
                  <>
                    <Spinner size="sm" className="me-2" />
                    Resending...
                  </>
                ) : (
                  <>
                    <i className="bi bi-arrow-clockwise me-2"></i>
                    Resend OTP
                  </>
                )}
              </Button>
              {emailVerification.otpTimer > 240 && (
                <Form.Text className="text-muted d-block">
                  You can resend the code in{" "}
                  {formatTime(emailVerification.otpTimer - 240)}
                </Form.Text>
              )}
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer className="border-0 px-4">
          <Button
            variant="secondary"
            onClick={() =>
              setEmailVerification((prev) => ({
                ...prev,
                showOtpModal: false,
                otp: "",
              }))
            }
            disabled={loading}
          >
            Cancel
          </Button>
          <ThemeButton
            variant="primary"
            onClick={verifyEmailOTP}
            disabled={loading || emailVerification.otp.length !== 6}
            icon={loading ? "bi-arrow-clockwise" : "bi-check-circle"}
          >
            {loading ? "Verifying..." : "Verify Email"}
          </ThemeButton>
        </Modal.Footer>
      </Modal>

      <style jsx>{`
        .form-label-custom {
          font-weight: 600;
          color: #495057;
          margin-bottom: 8px;
        }

        .form-control-custom {
          border: 2px solid #e9ecef;
          border-radius: 8px;
          padding: 12px 16px;
          font-size: 14px;
          transition: all 0.3s ease;
        }

        .form-control-custom:focus {
          border-color: #e63946;
          box-shadow: 0 0 0 0.2rem rgba(230, 57, 70, 0.25);
        }

        .nav-pills-custom .nav-link {
          border-radius: 10px;
          padding: 12px 20px;
          margin-right: 8px;
          border: 2px solid transparent;
          color: #6c757d;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .nav-pills-custom .nav-link:hover {
          border-color: #e63946;
          color: #e63946;
          background-color: rgba(230, 57, 70, 0.1);
        }

        .nav-pills-custom .nav-link.active {
          background-color: #e63946;
          border-color: #e63946;
          color: white;
        }

        .info-item label {
          display: block;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 4px;
        }

        .profile-tabs-card .card-body {
          padding: 2rem;
        }

        .security-section .card:hover {
          transform: translateY(-2px);
          transition: all 0.3s ease;
        }

        .profile-avatar {
          border: 3px solid rgba(230, 57, 70, 0.2);
          transition: all 0.3s ease;
        }

        .profile-avatar:hover {
          border-color: #e63946;
          box-shadow: 0 8px 32px rgba(230, 57, 70, 0.4) !important;
        }

        #profile-image-input {
          display: none;
        }

        .image-upload-hint {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(0, 0, 0, 0.7);
          color: white;
          text-align: center;
          font-size: 0.7rem;
          padding: 4px;
          border-radius: 0 0 50% 50%;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .profile-avatar:hover .image-upload-hint {
          opacity: 1;
        }
      `}</style>
    </div>
  );
};

export default UserProfile;
