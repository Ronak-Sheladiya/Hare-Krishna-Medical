import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Table,
  Badge,
  Modal,
  Form,
  InputGroup,
  Alert,
  Spinner,
  Pagination,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import { useSelector } from "react-redux";
import { useRealTime } from "../../hooks/useRealTime";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const usersPerPage = 10;

  // Statistics
  const [userStats, setUserStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    adminUsers: 0,
    verifiedUsers: 0,
  });

  const { user: currentUser } = useSelector((state) => state.auth);
  const API_BASE_URL =
    process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

  // Real-time event handlers
  const handleUserStatusUpdated = (data) => {
    setUsers((prev) =>
      prev.map((user) =>
        user._id === data.userId
          ? { ...user, isActive: data.newStatus === "Active" }
          : user,
      ),
    );
    showNotification(
      `User ${data.userName} status updated to ${data.newStatus}`,
      "info",
    );
    fetchUserStats();
  };

  const handleUserRoleUpdated = (data) => {
    setUsers((prev) =>
      prev.map((user) =>
        user._id === data.userId
          ? { ...user, role: data.newRole === "Admin" ? 1 : 0 }
          : user,
      ),
    );
    showNotification(
      `${data.userName} role changed to ${data.newRole}`,
      "info",
    );
    fetchUserStats();
  };

  const handleUserDeleted = (data) => {
    setUsers((prev) => prev.filter((user) => user._id !== data.userId));
    showNotification(`User ${data.userName} has been deleted`, "warning");
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
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams({
        page: currentPage,
        limit: usersPerPage,
        ...(searchTerm && { search: searchTerm }),
        ...(roleFilter && { role: roleFilter }),
        ...(statusFilter && { isActive: statusFilter }),
      });

      const response = await fetch(
        `${API_BASE_URL}/api/users/admin/all?${queryParams}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success) {
        setUsers(data.data);
        setTotalPages(data.pagination.totalPages);
        setTotalUsers(data.pagination.totalUsers);
      } else {
        throw new Error(data.message || "Failed to fetch users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/admin/stats`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user statistics");
      }

      const data = await response.json();

      if (data.success) {
        setUserStats(data.data.userStats);
      }
    } catch (error) {
      console.error("Error fetching user stats:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchTerm, roleFilter, statusFilter]);

  useEffect(() => {
    fetchUserStats();
  }, []);

  const handleStatusChange = async (userId, newStatus) => {
    if (actionLoading) return;

    try {
      setActionLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/api/users/admin/${userId}/status`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ isActive: newStatus === "Active" }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update user status");
      }

      const data = await response.json();

      if (data.success) {
        setUsers((prev) =>
          prev.map((user) =>
            user._id === userId
              ? { ...user, isActive: newStatus === "Active" }
              : user,
          ),
        );
        showNotification(`User status updated successfully`, "success");
      } else {
        throw new Error(data.message || "Failed to update user status");
      }
    } catch (error) {
      console.error("Error updating user status:", error);
      showNotification(error.message, "danger");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    if (actionLoading) return;

    try {
      setActionLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/api/users/admin/${userId}/role`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ role: parseInt(newRole) }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update user role");
      }

      const data = await response.json();

      if (data.success) {
        setUsers((prev) =>
          prev.map((user) =>
            user._id === userId ? { ...user, role: parseInt(newRole) } : user,
          ),
        );
        showNotification(`User role updated successfully`, "success");
      } else {
        throw new Error(data.message || "Failed to update user role");
      }
    } catch (error) {
      console.error("Error updating user role:", error);
      showNotification(error.message, "danger");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete || actionLoading) return;

    try {
      setActionLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/api/users/admin/${userToDelete._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      const data = await response.json();

      if (data.success) {
        setUsers((prev) =>
          prev.filter((user) => user._id !== userToDelete._id),
        );
        showNotification(`User deleted successfully`, "success");
        setShowDeleteModal(false);
        setUserToDelete(null);
        fetchUserStats();
      } else {
        throw new Error(data.message || "Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      showNotification(error.message, "danger");
    } finally {
      setActionLoading(false);
    }
  };

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setShowDetailsModal(true);
  };

  const confirmDeleteUser = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

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

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.mobile?.includes(searchTerm);

    const matchesRole = !roleFilter || user.role.toString() === roleFilter;
    const matchesStatus =
      !statusFilter || user.isActive.toString() === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount || 0);
  };

  if (loading && users.length === 0) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "400px" }}
      >
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <section className="section-padding-sm">
        <Container>
          {/* Header */}
          <Row className="mb-4">
            <Col lg={12}>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h2>User Management</h2>
                  <p className="text-muted">
                    Manage user accounts, roles, and permissions
                  </p>
                </div>
                <Button
                  variant="outline-primary"
                  onClick={() => fetchUsers()}
                  disabled={loading}
                  className="btn-medical-outline"
                >
                  <i className="bi bi-arrow-clockwise me-2"></i>
                  Refresh
                </Button>
              </div>
            </Col>
          </Row>

          {/* Error Alert */}
          {error && (
            <Alert variant="danger" dismissible onClose={() => setError(null)}>
              <i className="bi bi-exclamation-triangle me-2"></i>
              {error}
            </Alert>
          )}

          {/* User Statistics */}
          <Row className="mb-4">
            <Col lg={3} md={6} className="mb-3">
              <Card className="medical-card text-center h-100">
                <Card.Body>
                  <h3 className="text-medical-blue">
                    {userStats.totalUsers || 0}
                  </h3>
                  <p className="mb-0 small">Total Users</p>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={3} md={6} className="mb-3">
              <Card className="medical-card text-center h-100">
                <Card.Body>
                  <h3 className="text-medical-green">
                    {userStats.activeUsers || 0}
                  </h3>
                  <p className="mb-0 small">Active Users</p>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={3} md={6} className="mb-3">
              <Card className="medical-card text-center h-100">
                <Card.Body>
                  <h3 className="text-medical-red">
                    {userStats.adminUsers || 0}
                  </h3>
                  <p className="mb-0 small">Admin Users</p>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={3} md={6} className="mb-3">
              <Card className="medical-card text-center h-100">
                <Card.Body>
                  <h3 className="text-warning">
                    {userStats.verifiedUsers || 0}
                  </h3>
                  <p className="mb-0 small">Verified Users</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Filters */}
          <Row className="mb-4">
            <Col lg={4}>
              <InputGroup>
                <InputGroup.Text>
                  <i className="bi bi-search"></i>
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search users by name, email, or mobile..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col lg={2}>
              <Form.Select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="">All Roles</option>
                <option value="0">Users</option>
                <option value="1">Admins</option>
              </Form.Select>
            </Col>
            <Col lg={2}>
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
              <Button
                variant="outline-secondary"
                onClick={() => {
                  setSearchTerm("");
                  setRoleFilter("");
                  setStatusFilter("");
                  setCurrentPage(1);
                }}
                className="w-100"
              >
                Clear Filters
              </Button>
            </Col>
            <Col lg={2}>
              <div className="text-muted small">Total: {totalUsers} users</div>
            </Col>
          </Row>

          {/* Users Table */}
          <Card className="medical-card">
            <Card.Header className="bg-medical-light">
              <h5 className="mb-0">
                <i className="bi bi-people me-2"></i>
                Users ({filteredUsers.length})
              </h5>
            </Card.Header>
            <Card.Body className="p-0">
              {loading ? (
                <div className="text-center py-4">
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                </div>
              ) : filteredUsers.length > 0 ? (
                <div className="table-responsive">
                  <Table className="mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>User</th>
                        <th>Contact</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Orders</th>
                        <th>Total Spent</th>
                        <th>Registration</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => (
                        <tr key={user._id}>
                          <td>
                            <div className="d-flex align-items-center">
                              <div
                                className="bg-medical-red text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                                style={{ width: "40px", height: "40px" }}
                              >
                                <i className="bi bi-person-fill"></i>
                              </div>
                              <div>
                                <div className="fw-bold">
                                  {user.fullName || "N/A"}
                                </div>
                                <small className="text-muted">
                                  {user.gender || "N/A"} • {user.age || "N/A"}{" "}
                                  years
                                  {user.emailVerified && (
                                    <i
                                      className="bi bi-patch-check-fill text-success ms-2"
                                      title="Email Verified"
                                    ></i>
                                  )}
                                  {user.mobileVerified && (
                                    <i
                                      className="bi bi-telephone-check-fill text-primary ms-1"
                                      title="Mobile Verified"
                                    ></i>
                                  )}
                                </small>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div>
                              <div>{user.email}</div>
                              <small className="text-muted">
                                {user.mobile || "N/A"}
                              </small>
                            </div>
                          </td>
                          <td>
                            <Form.Select
                              size="sm"
                              value={user.role}
                              onChange={(e) =>
                                handleRoleChange(user._id, e.target.value)
                              }
                              disabled={
                                actionLoading || user._id === currentUser?.id
                              }
                              style={{ minWidth: "100px" }}
                            >
                              <option value={0}>User</option>
                              <option value={1}>Admin</option>
                            </Form.Select>
                            {user._id === currentUser?.id && (
                              <small className="text-muted d-block">You</small>
                            )}
                          </td>
                          <td>
                            <Form.Select
                              size="sm"
                              value={user.isActive ? "Active" : "Inactive"}
                              onChange={(e) =>
                                handleStatusChange(user._id, e.target.value)
                              }
                              disabled={actionLoading || user.role === 1}
                              style={{ minWidth: "100px" }}
                            >
                              <option value="Active">Active</option>
                              <option value="Inactive">Inactive</option>
                            </Form.Select>
                            {user.role === 1 && (
                              <small className="text-muted d-block">
                                Protected
                              </small>
                            )}
                          </td>
                          <td>
                            <Badge bg="secondary">
                              {user.orderStats?.totalOrders || 0}
                            </Badge>
                          </td>
                          <td>
                            <span className="fw-bold">
                              {formatCurrency(user.orderStats?.totalSpent || 0)}
                            </span>
                          </td>
                          <td>
                            <div>{formatDate(user.createdAt)}</div>
                            <small className="text-muted">
                              Last: {formatDate(user.lastLoginDate)}
                            </small>
                          </td>
                          <td>
                            <div className="btn-group" role="group">
                              <Button
                                size="sm"
                                variant="outline-primary"
                                onClick={() => handleViewDetails(user)}
                                className="btn-medical-outline"
                              >
                                <i className="bi bi-eye"></i>
                              </Button>
                              {user.role !== 1 &&
                                user._id !== currentUser?.id && (
                                  <Button
                                    size="sm"
                                    variant="outline-danger"
                                    onClick={() => confirmDeleteUser(user)}
                                    disabled={actionLoading}
                                  >
                                    <i className="bi bi-trash"></i>
                                  </Button>
                                )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-5">
                  <i
                    className="bi bi-people text-muted"
                    style={{ fontSize: "3rem" }}
                  ></i>
                  <h5 className="text-muted mt-3">No users found</h5>
                  <p className="text-muted">
                    {searchTerm || roleFilter || statusFilter
                      ? "Try adjusting your filters"
                      : "No users are registered yet"}
                  </p>
                </div>
              )}
            </Card.Body>
          </Card>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-center mt-4">
              <Pagination>
                <Pagination.First
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(1)}
                />
                <Pagination.Prev
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                />

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const startPage = Math.max(1, currentPage - 2);
                  const pageNumber = startPage + i;

                  if (pageNumber > totalPages) return null;

                  return (
                    <Pagination.Item
                      key={pageNumber}
                      active={pageNumber === currentPage}
                      onClick={() => setCurrentPage(pageNumber)}
                    >
                      {pageNumber}
                    </Pagination.Item>
                  );
                })}

                <Pagination.Next
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                />
                <Pagination.Last
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(totalPages)}
                />
              </Pagination>
            </div>
          )}
        </Container>
      </section>

      {/* User Details Modal */}
      <Modal
        show={showDetailsModal}
        onHide={() => setShowDetailsModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>User Details - {selectedUser?.fullName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <div>
              {/* Personal Information */}
              <Card className="mb-4">
                <Card.Header>
                  <h6 className="mb-0">Personal Information</h6>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <p>
                        <strong>Full Name:</strong>{" "}
                        {selectedUser.fullName || "N/A"}
                      </p>
                      <p>
                        <strong>Email:</strong> {selectedUser.email}
                      </p>
                      <p>
                        <strong>Mobile:</strong> {selectedUser.mobile || "N/A"}
                      </p>
                    </Col>
                    <Col md={6}>
                      <p>
                        <strong>Gender:</strong> {selectedUser.gender || "N/A"}
                      </p>
                      <p>
                        <strong>Age:</strong> {selectedUser.age || "N/A"} years
                      </p>
                      <p>
                        <strong>Role:</strong> {getRoleBadge(selectedUser.role)}
                      </p>
                    </Col>
                  </Row>
                  {selectedUser.address && (
                    <Row>
                      <Col md={12}>
                        <p>
                          <strong>Address:</strong>
                        </p>
                        <p className="text-muted">
                          {typeof selectedUser.address === "object"
                            ? `${selectedUser.address.street}, ${selectedUser.address.city}, ${selectedUser.address.state} - ${selectedUser.address.pincode}`
                            : selectedUser.address}
                        </p>
                      </Col>
                    </Row>
                  )}
                </Card.Body>
              </Card>

              {/* Account Information */}
              <Card className="mb-4">
                <Card.Header>
                  <h6 className="mb-0">Account Information</h6>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <p>
                        <strong>Status:</strong>{" "}
                        {getStatusBadge(selectedUser.isActive)}
                      </p>
                      <p>
                        <strong>Email Verified:</strong>
                        {selectedUser.emailVerified ? (
                          <Badge bg="success" className="ms-2">
                            Verified
                          </Badge>
                        ) : (
                          <Badge bg="warning" className="ms-2">
                            Pending
                          </Badge>
                        )}
                      </p>
                      <p>
                        <strong>Mobile Verified:</strong>
                        {selectedUser.mobileVerified ? (
                          <Badge bg="success" className="ms-2">
                            Verified
                          </Badge>
                        ) : (
                          <Badge bg="warning" className="ms-2">
                            Pending
                          </Badge>
                        )}
                      </p>
                      <p>
                        <strong>Registration Date:</strong>{" "}
                        {formatDate(selectedUser.createdAt)}
                      </p>
                    </Col>
                    <Col md={6}>
                      <p>
                        <strong>Last Login:</strong>{" "}
                        {formatDate(selectedUser.lastLoginDate)}
                      </p>
                      <p>
                        <strong>Total Orders:</strong>{" "}
                        {selectedUser.orderStats?.totalOrders || 0}
                      </p>
                      <p>
                        <strong>Total Spent:</strong>{" "}
                        {formatCurrency(
                          selectedUser.orderStats?.totalSpent || 0,
                        )}
                      </p>
                      <p>
                        <strong>Last Order:</strong>{" "}
                        {formatDate(selectedUser.orderStats?.lastOrderDate)}
                      </p>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowDetailsModal(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <i
              className="bi bi-exclamation-triangle text-warning"
              style={{ fontSize: "3rem" }}
            ></i>
            <h5 className="mt-3">Are you sure?</h5>
            <p className="text-muted">
              This action will permanently delete user{" "}
              <strong>{userToDelete?.fullName}</strong> and all associated data.
              This cannot be undone.
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleDeleteUser}
            disabled={actionLoading}
          >
            {actionLoading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Deleting...
              </>
            ) : (
              <>
                <i className="bi bi-trash me-2"></i>
                Delete User
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Toast Notifications */}
      <ToastContainer position="top-end" className="p-3">
        <Toast
          show={showToast}
          onClose={() => setShowToast(false)}
          delay={4000}
          autohide
          bg={toastType}
        >
          <Toast.Header>
            <strong className="me-auto">
              {toastType === "success"
                ? "Success"
                : toastType === "danger"
                  ? "Error"
                  : toastType === "warning"
                    ? "Warning"
                    : "Info"}
            </strong>
          </Toast.Header>
          <Toast.Body className={toastType === "success" ? "text-white" : ""}>
            {toastMessage}
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
};

export default AdminUsers;
