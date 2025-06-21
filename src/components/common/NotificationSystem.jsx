import React, { useEffect, useState } from "react";
import {
  Toast,
  ToastContainer,
  Dropdown,
  Badge,
  Button,
} from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  markAsRead,
  markAllAsRead,
  removeNotification,
  hideToast,
  simulateNotifications,
} from "../../store/slices/notificationSlice";

const NotificationSystem = () => {
  const dispatch = useDispatch();
  const { notifications, unreadCount, showToast, lastNotification } =
    useSelector((state) => state.notifications);
  const { user } = useSelector((state) => state.auth);
  const [showDropdown, setShowDropdown] = useState(false);

  // Only show for admin users
  if (!user || user.role !== 1) {
    return null;
  }

  // Simulate real-time notifications every 30 seconds (for demo)
  useEffect(() => {
    const interval = setInterval(() => {
      // Only simulate notifications if there are less than 10 unread
      if (unreadCount < 10 && Math.random() > 0.7) {
        dispatch(simulateNotifications());
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [dispatch, unreadCount]);

  const handleMarkAsRead = (id) => {
    dispatch(markAsRead(id));
  };

  const handleMarkAllAsRead = () => {
    dispatch(markAllAsRead());
  };

  const handleRemoveNotification = (id) => {
    dispatch(removeNotification(id));
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const notifTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - notifTime) / (1000 * 60));

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const getNotificationIcon = (notification) => {
    return notification?.icon || "bi-bell";
  };

  const getNotificationColor = (notification) => {
    return notification?.color || "primary";
  };

  return (
    <>
      {/* Notification Bell with Dropdown */}
      <Dropdown
        show={showDropdown}
        onToggle={setShowDropdown}
        align="end"
        className="position-relative me-3"
      >
        <Dropdown.Toggle
          variant="link"
          className="position-relative border-0 bg-transparent p-0"
          id="notifications-dropdown"
        >
          <i className="bi bi-bell fs-5 text-dark"></i>
          {unreadCount > 0 && (
            <Badge
              bg="danger"
              className="position-absolute"
              style={{
                top: "-8px",
                right: "-8px",
                fontSize: "0.75rem",
                minWidth: "20px",
                height: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "50%",
              }}
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Dropdown.Toggle>

        <Dropdown.Menu
          className="border-0 shadow"
          style={{ width: "400px", maxHeight: "500px", overflowY: "auto" }}
        >
          <Dropdown.Header className="d-flex justify-content-between align-items-center">
            <span className="fw-bold">Notifications</span>
            {unreadCount > 0 && (
              <Button
                size="sm"
                variant="link"
                className="p-0 text-decoration-none"
                onClick={handleMarkAllAsRead}
              >
                Mark all read
              </Button>
            )}
          </Dropdown.Header>

          {notifications.length === 0 ? (
            <div className="text-center p-4">
              <i className="bi bi-bell-slash display-4 text-muted mb-3"></i>
              <p className="text-muted">No notifications yet</p>
            </div>
          ) : (
            <>
              {notifications.slice(0, 10).map((notification) => (
                <Dropdown.Item
                  key={notification.id}
                  as="div"
                  className={`p-3 border-bottom ${!notification.isRead ? "bg-light" : ""}`}
                  style={{ cursor: "default" }}
                >
                  <div className="d-flex align-items-start">
                    <div
                      className={`bg-${getNotificationColor(notification)} text-white rounded-circle d-flex align-items-center justify-content-center me-3`}
                      style={{ width: "40px", height: "40px", flexShrink: 0 }}
                    >
                      <i
                        className={`${getNotificationIcon(notification)} fs-6`}
                      ></i>
                    </div>
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between align-items-start mb-1">
                        <h6 className="mb-0 fs-6">{notification.title}</h6>
                        <div className="d-flex gap-1">
                          {!notification.isRead && (
                            <Button
                              size="sm"
                              variant="link"
                              className="p-0 text-primary"
                              onClick={() => handleMarkAsRead(notification.id)}
                              title="Mark as read"
                            >
                              <i className="bi bi-check"></i>
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="link"
                            className="p-0 text-danger"
                            onClick={() =>
                              handleRemoveNotification(notification.id)
                            }
                            title="Remove"
                          >
                            <i className="bi bi-x"></i>
                          </Button>
                        </div>
                      </div>
                      <p className="mb-2 small text-muted">
                        {notification.message}
                      </p>
                      <div className="d-flex justify-content-between align-items-center">
                        <small className="text-muted">
                          {formatTimestamp(notification.timestamp)}
                        </small>
                        {notification.actionUrl && (
                          <Link
                            to={notification.actionUrl}
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => {
                              setShowDropdown(false);
                              if (!notification.isRead) {
                                handleMarkAsRead(notification.id);
                              }
                            }}
                          >
                            View
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </Dropdown.Item>
              ))}

              {notifications.length > 10 && (
                <Dropdown.Item as="div" className="text-center p-2">
                  <small className="text-muted">
                    Showing 10 of {notifications.length} notifications
                  </small>
                </Dropdown.Item>
              )}
            </>
          )}
        </Dropdown.Menu>
      </Dropdown>

      {/* Toast Notification for New Notifications */}
      <ToastContainer
        position="top-end"
        className="p-3"
        style={{ zIndex: 9999 }}
      >
        <Toast
          show={showToast && !!lastNotification}
          onClose={() => dispatch(hideToast())}
          delay={4000}
          autohide
          className="border-0 shadow"
        >
          {lastNotification && (
            <Toast.Header closeButton={true}>
              <div
                className={`bg-${getNotificationColor(lastNotification)} text-white rounded-circle d-flex align-items-center justify-content-center me-2`}
                style={{ width: "20px", height: "20px" }}
              >
                <i
                  className={`${getNotificationIcon(lastNotification)} fs-6`}
                ></i>
              </div>
              <strong className="me-auto">{lastNotification?.title}</strong>
              <small>Now</small>
            </Toast.Header>
          )}
          {lastNotification && (
            <Toast.Body>
              {lastNotification?.message}
              {lastNotification?.actionUrl && (
                <div className="mt-2">
                  <Link
                    to={lastNotification.actionUrl}
                    className="btn btn-sm btn-primary"
                    onClick={() => dispatch(hideToast())}
                  >
                    View Details
                  </Link>
                </div>
              )}
            </Toast.Body>
          )}
        </Toast>
      </ToastContainer>
    </>
  );
};

export default NotificationSystem;
