import React from "react";
import { Navbar, Nav, Container, Button, Badge } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const Header = () => {
  const location = useLocation();
  const { totalItems } = useSelector((state) => state.cart);
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  return (
    <Navbar expand="lg" className="medical-header" sticky="top">
      <Container>
        {/* Logo Section */}
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <img
            src="https://cdn.builder.io/api/v1/assets/ec4b3f82f1ac4275b8bfc1756fcac420/medical_logo-e586be?format=webp&width=800"
            alt="Hare Krishna Medical"
            className="medical-logo me-2"
          />
          <span className="fw-bold text-dark d-none d-md-inline">
            Hare Krishna Medical
          </span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {/* Navigation Links */}
          <Nav className="medical-nav me-auto">
            <Nav.Link
              as={Link}
              to="/"
              className={isActiveRoute("/") ? "active" : ""}
            >
              Home
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/products"
              className={isActiveRoute("/products") ? "active" : ""}
            >
              Products
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/about"
              className={isActiveRoute("/about") ? "active" : ""}
            >
              About Us
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/contact"
              className={isActiveRoute("/contact") ? "active" : ""}
            >
              Contact
            </Nav.Link>
          </Nav>

          {/* Right side - Cart and Auth */}
          <Nav className="d-flex align-items-center">
            {/* Cart Icon */}
            <Nav.Link as={Link} to="/cart" className="position-relative me-3">
              <i className="bi bi-cart3 fs-5"></i>
              {totalItems > 0 && (
                <Badge
                  bg="danger"
                  className="cart-badge position-absolute"
                  style={{
                    top: "-8px",
                    right: "-8px",
                    fontSize: "0.75rem",
                  }}
                >
                  {totalItems}
                </Badge>
              )}
            </Nav.Link>

            {/* Authentication Buttons */}
            {isAuthenticated ? (
              <div className="d-flex align-items-center">
                <div className="d-flex align-items-center me-3">
                  {user?.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={user.name}
                      className="rounded-circle"
                      width="35"
                      height="35"
                    />
                  ) : (
                    <i className="bi bi-person-circle fs-4 text-medical-red"></i>
                  )}
                  <span className="ms-2 d-none d-md-inline text-dark">
                    {user?.name || "User"}
                  </span>
                </div>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => {
                    // Handle logout
                  }}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="d-flex gap-2">
                <Button
                  as={Link}
                  to="/login"
                  variant="outline-primary"
                  size="sm"
                  className="btn-medical-outline"
                >
                  Login
                </Button>
                <Button
                  as={Link}
                  to="/register"
                  variant="primary"
                  size="sm"
                  className="btn-medical-primary"
                >
                  Register
                </Button>
              </div>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
