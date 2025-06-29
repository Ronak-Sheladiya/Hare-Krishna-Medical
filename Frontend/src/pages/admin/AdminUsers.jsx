import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Table,
  Badge,
  Modal,
  Form,
  Alert,
  Spinner,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import { useSelector } from "react-redux";
import { api, safeApiCall } from "../../utils/apiClient";
import {
  PageHeroSection,
  ThemeCard,
  ThemeButton,
  ThemeSection,
  StatsCard,
} from "../../components/common/ConsistentTheme";
import useRealTime from "../../hooks/useRealTime";
import { Link } from "react-router-dom";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Toast notifications
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");

  // User statistics
  const [userStats, setUserStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    admins: 0,
    regularUsers: 0,
    newUsersToday: 0,
    newUsersThisWeek: 0,
  });

  const { user: currentUser } = useSelector((state) => state.auth);

  // Real-time event handlers
  const handleUserStatusUpdated = (data) => {
    setUsers((prev) =>
      prev.map((user) =>
        user._id === data.userId ? { ...user, isActive: data.isActive } : user,
      ),
    );
    showNotification(
      `User ${data.isActive ? "activated" : "deactivated"} successfully`,
    );
  };

  const handleUserRoleUpdated = (data) => {
    setUsers((prev) =>
      prev.map((user) =>
        user._id === data.userId ? { ...user, role: data.role } : user,
      ),
    );
    showNotification("User role updated successfully");
  };

  const handleUserDeleted = (data) => {
    setUsers((prev) => prev.filter((user) => user._id !== data.userId));
    showNotification("User deleted successfully", "info");
  };

  const refreshData = () => {
    fetchUserStats();
    fetchUsers();
  };

  // Set up real-time listeners
  useRealTime("user-status-updated", handleUserStatusUpdated);
  useRealTime("user-role-updated", handleUserRoleUpdated);
  useRealTime("user-deleted", handleUserDeleted);

  const showNotification = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);

    // Check if user is authenticated first
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
      setError("Please log in as an admin to access user management.");
      setLoading(false);
      return;
    }

    const queryParams = new URLSearchParams({
      ...(searchTerm && { search: searchTerm }),
      ...(roleFilter && { role: roleFilter }),
      ...(statusFilter && { isActive: statusFilter }),
    });

    const { success, data, error } = await safeApiCall(
      () => api.get(`/api/users/admin/all?${queryParams}`),
      [],
    );

    if (success && data?.data) {
      setUsers(data.data);
    } else {
      // Handle specific error types
      if (error?.includes("401")) {
        setError("Authentication failed. Please log in as an admin.");
      } else if (error?.includes("403")) {
        setError("Access denied. Admin privileges required.");
      } else if (error?.includes("Network error")) {
        setError(
          "Unable to connect to the backend server. Please check if it's running.",
        );
      } else if (error?.includes("timeout")) {
        setError("Server is taking too long to respond. Please try again.");
      } else {
        setError(
          error || "Failed to fetch users. Please try refreshing the page.",
        );
      }
    }

    setLoading(false);
  };

  const fetchUserStats = async () => {
    // Check if user is authenticated first
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
      return; // Skip stats if not authenticated
    }

    const { success, data, error } = await safeApiCall(
      () => api.get("/api/users/admin/stats"),
      {},
    );

    if (success && data?.data) {
      setUserStats(data.data);
    } else {
      console.warn("Failed to fetch user stats:", error);
      // Don't show error for stats, just log it
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchUserStats();
  }, [searchTerm, roleFilter, statusFilter]);

  const handleStatusChange = async (userId, currentStatus) => {
    setActionLoading(true);

    const { success, error } = await safeApiCall(
      () =>
        api.patch(`/api/users/admin/${userId}/status`, {
          isActive: !currentStatus,
        }),
      null,
    );

    if (success) {
      // Update will be handled by real-time event
      showNotification(
        `User ${!currentStatus ? "activated" : "deactivated"} successfully`,
      );
    } else {
      showNotification(error || "Failed to update user status", "error");
    }

    setActionLoading(false);
  };

  const handleRoleChange = async (userId, newRole) => {
    setActionLoading(true);

    const { success, error } = await safeApiCall(
      () =>
        api.patch(`/api/users/admin/${userId}/role`, {
          role: newRole,
        }),
      null,
    );

    if (success) {
      // Update will be handled by real-time event
      showNotification("User role updated successfully");
    } else {
      showNotification(error || "Failed to update user role", "error");
    }

    setActionLoading(false);
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    setActionLoading(true);

    const { success, error } = await safeApiCall(
      () => api.delete(`/api/users/admin/${userId}`),
      null,
    );

    if (success) {
      // Update will be handled by real-time event
      showNotification("User deleted successfully", "info");
    } else {
      showNotification(error || "Failed to delete user", "error");
    }

    setActionLoading(false);
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !roleFilter || user.role.toString() === roleFilter;
    const matchesStatus =
      !statusFilter || user.isActive.toString() === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleBadge = (role) => {
    return role === 1 ? (
      <Badge bg="danger">Admin</Badge>
    ) : (
      <Badge bg="primary">User</Badge>
    );
  };

  const getStatusBadge = (isActive) => {
    return isActive ? (
      <Badge bg="success">Active</Badge>
    ) : (
      <Badge bg="secondary">Inactive</Badge>
    );
  };

  return (
    <div className="fade-in">
      {/* Hero Section */}
      <PageHeroSection
        title="User Management"
        subtitle="Manage users, roles, and permissions for your medical store"
        icon="bi-people"
      />

      <ThemeSection background="#f8f9fa">
        <Container>
          {error && (
            <Row className="mb-4">
              <Col lg={12}>
                <Alert variant="danger" className="d-flex align-items-center">
                  <i className="bi bi-exclamation-triangle-fill me-3"></i>
                  <div className="flex-grow-1">
                    {error}
                    {error.includes("log in") && (
                      <div className="mt-2">
                        <Link
                          to="/login"
                          className="btn btn-sm btn-primary me-2"
                        >
                          <i className="bi bi-box-arrow-in-right me-1"></i>
                          Go to Login
                        </Link>
                        <small className="text-muted">
                          Use admin credentials to access user management
                        </small>
                      </div>
                    )}
                  </div>
                  <ThemeButton
                    variant="outline"
                    size="sm"
                    onClick={refreshData}
                  >
                    <i className="bi bi-arrow-clockwise me-1"></i>
                    Retry
                  </ThemeButton>
                </Alert>
              </Col>
            </Row>
          )}

          {/* Statistics Cards */}
          <Row className="mb-5 g-4">
            <Col lg={3} md={6}>
              <StatsCard
                icon="bi bi-people"
                value={userStats.totalUsers}
                label="Total Users"
                gradient="linear-gradient(135deg, #e63946, #dc3545)"
                isLoading={loading}
              />
            </Col>

            <Col lg={3} md={6}>
              <StatsCard
                icon="bi bi-person-check"
                value={userStats.activeUsers}
                label="Active Users"
                gradient="linear-gradient(135deg, #28a745, #20c997)"
                isLoading={loading}
              />
            </Col>

            <Col lg={3} md={6}>
              <StatsCard
                icon="bi bi-shield"
                value={userStats.admins}
                label="Admins"
                gradient="linear-gradient(135deg, #6f42c1, #6610f2)"
                isLoading={loading}
              />
            </Col>

            <Col lg={3} md={6}>
              <StatsCard
                icon="bi bi-person-plus"
                value={userStats.newUsersToday}
                label="New Today"
                gradient="linear-gradient(135deg, #17a2b8, #20c997)"
                badge={`${userStats.newUsersThisWeek} this week`}
                isLoading={loading}
              />
            </Col>
          </Row>

          {/* Filters and Search */}
          <Row className="mb-4">
            <Col lg={12}>
              <ThemeCard>
                <Row className="align-items-center">
                  <Col lg={4}>
                    <Form.Control
                      type="text"
                      placeholder="Search users by name or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </Col>
                  <Col lg={3}>
                    <Form.Select
                      value={roleFilter}
                      onChange={(e) => setRoleFilter(e.target.value)}
                    >
                      <option value="">All Roles</option>
                      <option value="1">Admins</option>
                      <option value="0">Users</option>
                    </Form.Select>
                  </Col>
                  <Col lg={3}>
                    <Form.Select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="">All Status</option>
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </Form.Select>
                  </Col>
                  <Col lg={2}>
                    <ThemeButton
                      variant="outline"
                      onClick={refreshData}
                      icon="bi bi-arrow-clockwise"
                      className="w-100"
                    >
                      Refresh
                    </ThemeButton>
                  </Col>
                </Row>
              </ThemeCard>
            </Col>
          </Row>

          {/* Users Table */}
          <Row>
            <Col lg={12}>
              <ThemeCard>
                <div
                  style={{
                    background: "linear-gradient(135deg, #e63946, #dc3545)",
                    color: "white",
                    borderRadius: "12px 12px 0 0",
                    padding: "20px 25px",
                    margin: "-30px -30px 25px -30px",
                  }}
                >
                  <h5 className="mb-0" style={{ fontWeight: "700" }}>
                    <i className="bi bi-people me-2"></i>
                    User Management ({filteredUsers.length} users)
                  </h5>
                </div>

                {loading ? (
                  <div className="text-center py-5">
                    <Spinner animation="border" role="status" />
                    <p className="mt-3 text-muted">Loading users...</p>
                  </div>
                ) : filteredUsers.length > 0 ? (
                  <Table responsive hover>
                    <thead>
                      <tr>
                        <th>User</th>
                        <th>Contact</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Joined</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => (
                        <tr key={user._id}>
                          <td>
                            <div className="d-flex align-items-center">
                              <div
                                style={{
                                  width: "40px",
                                  height: "40px",
                                  borderRadius: "50%",
                                  background: "#e63946",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  color: "white",
                                  fontSize: "16px",
                                  fontWeight: "600",
                                  marginRight: "12px",
                                }}
                              >
                                {user.fullName?.charAt(0)?.toUpperCase() || "U"}
                              </div>
                              <div>
                                <div style={{ fontWeight: "600" }}>
                                  {user.fullName || "Unknown User"}
                                </div>
                                <small className="text-muted">
                                  ID: {user._id}
                                </small>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div>
                              <div>{user.email}</div>
                              <small className="text-muted">
                                {user.phone || "No phone"}
                              </small>
                            </div>
                          </td>
                          <td>{getRoleBadge(user.role)}</td>
                          <td>{getStatusBadge(user.isActive)}</td>
                          <td>
                            <small>
                              {user.createdAt
                                ? new Date(user.createdAt).toLocaleDateString()
                                : "Unknown"}
                            </small>
                          </td>
                          <td>
                            <div className="d-flex gap-2">
                              {currentUser?._id !== user._id && (
                                <>
                                  <ThemeButton
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      handleStatusChange(
                                        user._id,
                                        user.isActive,
                                      )
                                    }
                                    disabled={actionLoading}
                                    icon={
                                      user.isActive
                                        ? "bi bi-pause"
                                        : "bi bi-play"
                                    }
                                  />
                                  <ThemeButton
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      handleRoleChange(
                                        user._id,
                                        user.role === 1 ? 0 : 1,
                                      )
                                    }
                                    disabled={actionLoading}
                                    icon="bi bi-person-gear"
                                  />
                                  <ThemeButton
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDeleteUser(user._id)}
                                    disabled={actionLoading}
                                    icon="bi bi-trash"
                                    style={{
                                      borderColor: "#dc3545",
                                      color: "#dc3545",
                                    }}
                                  />
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <div className="text-center py-5">
                    <i
                      className="bi bi-people"
                      style={{ fontSize: "3rem", color: "#6c757d" }}
                    ></i>
                    <h5 className="mt-3 text-muted">No Users Found</h5>
                    <p className="text-muted">
                      {searchTerm || roleFilter || statusFilter
                        ? "Try adjusting your search filters."
                        : "No users available."}
                    </p>
                  </div>
                )}
              </ThemeCard>
            </Col>
          </Row>
        </Container>
      </ThemeSection>

      {/* Toast Notifications */}
      <ToastContainer position="top-end" className="p-3">
        <Toast
          show={showToast}
          onClose={() => setShowToast(false)}
          delay={3000}
          autohide
          bg={toastType === "error" ? "danger" : toastType}
        >
          <Toast.Header>
            <strong className="me-auto">
              {toastType === "error" ? "Error" : "Success"}
            </strong>
          </Toast.Header>
          <Toast.Body className="text-white">{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
};

export default AdminUsers;
