import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Alert,
  Modal,
  InputGroup,
} from "react-bootstrap";
import { useSelector } from "react-redux";

const UserProfile = () => {
  const { user } = useSelector((state) => state.auth);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(user?.profileImage || null);

  const [formData, setFormData] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    mobile: user?.mobile || "",
    gender: user?.gender || "",
    age: user?.age || "",
    address: user?.address || "",
    city: user?.city || "",
    state: user?.state || "",
    pincode: user?.pincode || "",
    landmark: user?.landmark || "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (passwordErrors[name]) {
      setPasswordErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setProfileImage(null);
    setImagePreview(null);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }
    if (!formData.mobile.trim()) {
      newErrors.mobile = "Mobile number is required";
    } else if (!/^\d{10}$/.test(formData.mobile.replace(/\s+/g, ""))) {
      newErrors.mobile = "Mobile number must be 10 digits";
    }
    if (
      formData.age &&
      (parseInt(formData.age) < 18 || parseInt(formData.age) > 120)
    ) {
      newErrors.age = "Age must be between 18 and 120";
    }
    if (formData.pincode && !/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = "Pincode must be 6 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePasswordForm = () => {
    const newErrors = {};

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }
    if (!passwordData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (passwordData.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
    }
    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setPasswordErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // In a real app, this would be an API call
    console.log("Profile update data:", formData);
    if (profileImage) {
      console.log("Profile image:", profileImage);
    }

    // Show success message
    setShowSuccessAlert(true);
    setTimeout(() => setShowSuccessAlert(false), 5000);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();

    if (!validatePasswordForm()) {
      return;
    }

    // In a real app, this would be an API call
    console.log("Password change data:", {
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword,
    });

    // Reset password form and close modal
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setShowPasswordModal(false);

    // Show success message
    setShowSuccessAlert(true);
    setTimeout(() => setShowSuccessAlert(false), 5000);
  };

  return (
    <div className="fade-in">
      <section className="section-padding-sm">
        <Container>
          {/* Header */}
          <Row className="mb-4">
            <Col lg={12}>
              <h2>Edit Profile</h2>
              <p className="text-muted">
                Update your personal information and account settings
              </p>
            </Col>
          </Row>

          {showSuccessAlert && (
            <Alert
              variant="success"
              className="mb-4"
              dismissible
              onClose={() => setShowSuccessAlert(false)}
            >
              <i className="bi bi-check-circle me-2"></i>
              Profile updated successfully!
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Row>
              {/* Profile Information */}
              <Col lg={8}>
                <Card className="medical-card mb-4">
                  <Card.Header className="bg-medical-light">
                    <h5 className="mb-0">
                      <i className="bi bi-person me-2"></i>
                      Personal Information
                    </h5>
                  </Card.Header>
                  <Card.Body>
                    <Row>
                      <Col md={6} className="mb-3">
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
                      <Col md={6} className="mb-3">
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email}
                          readOnly
                          className="bg-light"
                        />
                        <Form.Text className="text-muted">
                          Email cannot be changed for security reasons
                        </Form.Text>
                      </Col>
                      <Col md={6} className="mb-3">
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
                        <Form.Text className="text-muted">
                          Mobile number cannot be changed for security reasons
                        </Form.Text>
                      </Col>
                      <Col md={3} className="mb-3">
                        <Form.Label>Gender</Form.Label>
                        <Form.Select
                          name="gender"
                          value={formData.gender}
                          onChange={handleInputChange}
                        >
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </Form.Select>
                      </Col>
                      <Col md={3} className="mb-3">
                        <Form.Label>Age</Form.Label>
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
                    </Row>
                  </Card.Body>
                </Card>

                {/* Address Information */}
                <Card className="medical-card mb-4">
                  <Card.Header className="bg-medical-light">
                    <h5 className="mb-0">
                      <i className="bi bi-geo-alt me-2"></i>
                      Address Information
                    </h5>
                  </Card.Header>
                  <Card.Body>
                    <Row>
                      <Col md={12} className="mb-3">
                        <Form.Label>Address</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          placeholder="Enter your complete address"
                        />
                      </Col>
                      <Col md={6} className="mb-3">
                        <Form.Label>City</Form.Label>
                        <Form.Control
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          placeholder="Enter city"
                        />
                      </Col>
                      <Col md={6} className="mb-3">
                        <Form.Label>State</Form.Label>
                        <Form.Control
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          placeholder="Enter state"
                        />
                      </Col>
                      <Col md={6} className="mb-3">
                        <Form.Label>Pincode</Form.Label>
                        <Form.Control
                          type="text"
                          name="pincode"
                          value={formData.pincode}
                          onChange={handleInputChange}
                          isInvalid={!!errors.pincode}
                          placeholder="Enter pincode"
                          maxLength={6}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.pincode}
                        </Form.Control.Feedback>
                      </Col>
                      <Col md={6} className="mb-3">
                        <Form.Label>Landmark</Form.Label>
                        <Form.Control
                          type="text"
                          name="landmark"
                          value={formData.landmark}
                          onChange={handleInputChange}
                          placeholder="Nearby landmark"
                        />
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>

              {/* Profile Image and Actions */}
              <Col lg={4}>
                <Card className="medical-card mb-4">
                  <Card.Header className="bg-medical-light">
                    <h5 className="mb-0">
                      <i className="bi bi-image me-2"></i>
                      Profile Picture
                    </h5>
                  </Card.Header>
                  <Card.Body className="text-center">
                    <div className="mb-3">
                      {imagePreview ? (
                        <div className="position-relative d-inline-block">
                          <img
                            src={imagePreview}
                            alt="Profile Preview"
                            style={{
                              width: "150px",
                              height: "150px",
                              objectFit: "cover",
                              borderRadius: "50%",
                            }}
                            className="border"
                          />
                          <Button
                            size="sm"
                            variant="danger"
                            className="position-absolute top-0 end-0 rounded-circle"
                            style={{ width: "30px", height: "30px" }}
                            onClick={removeImage}
                          >
                            <i className="bi bi-x"></i>
                          </Button>
                        </div>
                      ) : (
                        <div
                          className="bg-light border rounded-circle d-flex align-items-center justify-content-center mx-auto"
                          style={{ width: "150px", height: "150px" }}
                        >
                          <i className="bi bi-person display-4 text-muted"></i>
                        </div>
                      )}
                    </div>

                    <Form.Group className="mb-3">
                      <Form.Control
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                      <Form.Text className="text-muted">
                        Upload a profile picture (optional)
                      </Form.Text>
                    </Form.Group>
                  </Card.Body>
                </Card>

                {/* Action Buttons */}
                <Card className="medical-card">
                  <Card.Header className="bg-medical-light">
                    <h5 className="mb-0">
                      <i className="bi bi-gear me-2"></i>
                      Account Actions
                    </h5>
                  </Card.Header>
                  <Card.Body>
                    <div className="d-grid gap-2 mb-3">
                      <Button
                        type="submit"
                        className="btn-medical-primary"
                        size="lg"
                      >
                        <i className="bi bi-check-circle me-2"></i>
                        Update Profile
                      </Button>
                      <Button
                        type="button"
                        variant="outline-warning"
                        onClick={() => setShowPasswordModal(true)}
                        className="btn-medical-outline"
                      >
                        <i className="bi bi-lock me-2"></i>
                        Change Password
                      </Button>
                    </div>
                    <div className="text-center">
                      <small className="text-muted">
                        <i className="bi bi-info-circle me-1"></i>
                        Email and mobile number cannot be changed
                      </small>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Form>
        </Container>
      </section>

      {/* Change Password Modal */}
      <Modal
        show={showPasswordModal}
        onHide={() => setShowPasswordModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Change Password</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handlePasswordSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>
                Current Password <span className="text-danger">*</span>
              </Form.Label>
              <InputGroup>
                <Form.Control
                  type={showCurrentPassword ? "text" : "password"}
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  isInvalid={!!passwordErrors.currentPassword}
                  placeholder="Enter current password"
                />
                <Button
                  variant="outline-secondary"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  <i
                    className={`bi ${showCurrentPassword ? "bi-eye-slash" : "bi-eye"}`}
                  ></i>
                </Button>
              </InputGroup>
              <Form.Control.Feedback type="invalid">
                {passwordErrors.currentPassword}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>
                New Password <span className="text-danger">*</span>
              </Form.Label>
              <InputGroup>
                <Form.Control
                  type={showNewPassword ? "text" : "password"}
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  isInvalid={!!passwordErrors.newPassword}
                  placeholder="Enter new password"
                />
                <Button
                  variant="outline-secondary"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  <i
                    className={`bi ${showNewPassword ? "bi-eye-slash" : "bi-eye"}`}
                  ></i>
                </Button>
              </InputGroup>
              <Form.Control.Feedback type="invalid">
                {passwordErrors.newPassword}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>
                Confirm New Password <span className="text-danger">*</span>
              </Form.Label>
              <InputGroup>
                <Form.Control
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  isInvalid={!!passwordErrors.confirmPassword}
                  placeholder="Confirm new password"
                />
                <Button
                  variant="outline-secondary"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <i
                    className={`bi ${showConfirmPassword ? "bi-eye-slash" : "bi-eye"}`}
                  ></i>
                </Button>
              </InputGroup>
              <Form.Control.Feedback type="invalid">
                {passwordErrors.confirmPassword}
              </Form.Control.Feedback>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowPasswordModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="btn-medical-primary">
              <i className="bi bi-check-circle me-2"></i>
              Change Password
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default UserProfile;
