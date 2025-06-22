import React, { useState } from "react";
import { Container, Row, Col, Button, Card, Accordion } from "react-bootstrap";
import { Link } from "react-router-dom";

const UserGuide = () => {
  const [activeSection, setActiveSection] = useState("getting-started");

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="fade-in">
      {/* Hero Section - Matching About/Contact */}
      <section
        style={{
          background: "linear-gradient(135deg, #e63946 0%, #dc3545 100%)",
          paddingTop: "80px",
          paddingBottom: "80px",
          color: "white",
        }}
      >
        <Container>
          <Row className="text-center">
            <Col lg={12}>
              <h1
                style={{
                  fontSize: "3rem",
                  fontWeight: "800",
                  marginBottom: "20px",
                  textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
                }}
              >
                User Guide
              </h1>
              <p
                style={{
                  fontSize: "1.2rem",
                  opacity: "0.9",
                  maxWidth: "600px",
                  margin: "0 auto",
                }}
              >
                Complete guide to navigate and use all features of Hare Krishna
                Medical platform
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Quick Start Cards */}
      <section
        style={{
          background: "#ffffff",
          paddingTop: "80px",
          paddingBottom: "40px",
        }}
      >
        <Container>
          <Row>
            <Col lg={4} md={6} className="mb-4">
              <Card
                style={{
                  border: "2px solid #f8f9fa",
                  borderRadius: "16px",
                  padding: "30px",
                  textAlign: "center",
                  height: "100%",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                }}
                onClick={() => scrollToSection("getting-started")}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = "#343a40";
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 25px rgba(52, 58, 64, 0.2)";
                  const iconDiv = e.currentTarget.querySelector(".guide-icon");
                  if (iconDiv) {
                    iconDiv.style.background =
                      "linear-gradient(135deg, #343a40, #495057)";
                  }
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = "#f8f9fa";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                  const iconDiv = e.currentTarget.querySelector(".guide-icon");
                  if (iconDiv) {
                    iconDiv.style.background =
                      "linear-gradient(135deg, #e63946, #dc3545)";
                  }
                }}
              >
                <div
                  className="guide-icon"
                  style={{
                    width: "80px",
                    height: "80px",
                    background: "linear-gradient(135deg, #e63946, #dc3545)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 24px",
                    color: "white",
                    fontSize: "32px",
                    transition: "all 0.3s ease",
                  }}
                >
                  <i className="bi bi-play-circle-fill"></i>
                </div>
                <h5 style={{ color: "#333333", marginBottom: "16px" }}>
                  Getting Started
                </h5>
                <p style={{ color: "#495057", marginBottom: "0" }}>
                  Learn the basics of creating account, browsing products, and
                  placing your first order
                </p>
              </Card>
            </Col>

            <Col lg={4} md={6} className="mb-4">
              <Card
                style={{
                  border: "2px solid #f8f9fa",
                  borderRadius: "16px",
                  padding: "30px",
                  textAlign: "center",
                  height: "100%",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                }}
                onClick={() => scrollToSection("shopping-guide")}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = "#343a40";
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 25px rgba(52, 58, 64, 0.2)";
                  const iconDiv = e.currentTarget.querySelector(".guide-icon");
                  if (iconDiv) {
                    iconDiv.style.background =
                      "linear-gradient(135deg, #343a40, #495057)";
                  }
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = "#f8f9fa";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                  const iconDiv = e.currentTarget.querySelector(".guide-icon");
                  if (iconDiv) {
                    iconDiv.style.background =
                      "linear-gradient(135deg, #dc3545, #e63946)";
                  }
                }}
              >
                <div
                  className="guide-icon"
                  style={{
                    width: "80px",
                    height: "80px",
                    background: "linear-gradient(135deg, #dc3545, #e63946)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 24px",
                    color: "white",
                    fontSize: "32px",
                    transition: "all 0.3s ease",
                  }}
                >
                  <i className="bi bi-cart-check-fill"></i>
                </div>
                <h5 style={{ color: "#333333", marginBottom: "16px" }}>
                  Shopping Guide
                </h5>
                <p style={{ color: "#495057", marginBottom: "0" }}>
                  Complete guide to browsing, filtering, adding to cart, and
                  managing your orders
                </p>
              </Card>
            </Col>

            <Col lg={4} md={6} className="mb-4">
              <Card
                style={{
                  border: "2px solid #f8f9fa",
                  borderRadius: "16px",
                  padding: "30px",
                  textAlign: "center",
                  height: "100%",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                }}
                onClick={() => scrollToSection("account-management")}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = "#343a40";
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 25px rgba(52, 58, 64, 0.2)";
                  const iconDiv = e.currentTarget.querySelector(".guide-icon");
                  if (iconDiv) {
                    iconDiv.style.background =
                      "linear-gradient(135deg, #343a40, #495057)";
                  }
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = "#f8f9fa";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                  const iconDiv = e.currentTarget.querySelector(".guide-icon");
                  if (iconDiv) {
                    iconDiv.style.background =
                      "linear-gradient(135deg, #e63946, #dc3545)";
                  }
                }}
              >
                <div
                  className="guide-icon"
                  style={{
                    width: "80px",
                    height: "80px",
                    background: "linear-gradient(135deg, #e63946, #dc3545)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 24px",
                    color: "white",
                    fontSize: "32px",
                    transition: "all 0.3s ease",
                  }}
                >
                  <i className="bi bi-person-gear"></i>
                </div>
                <h5 style={{ color: "#333333", marginBottom: "16px" }}>
                  Account Management
                </h5>
                <p style={{ color: "#495057", marginBottom: "0" }}>
                  Manage your profile, view order history, download invoices,
                  and more
                </p>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Main Guide Content */}
      <section
        style={{
          background: "#f8f9fa",
          paddingTop: "80px",
          paddingBottom: "80px",
        }}
      >
        <Container>
          <Row>
            {/* Navigation Sidebar */}
            <Col lg={3} className="mb-5">
              <Card
                style={{
                  border: "none",
                  borderRadius: "16px",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                  position: "sticky",
                  top: "20px",
                }}
              >
                <Card.Body style={{ padding: "30px" }}>
                  <h5
                    style={{
                      color: "#e63946",
                      marginBottom: "20px",
                      fontSize: "1.3rem",
                      fontWeight: "700",
                    }}
                  >
                    <i className="bi bi-list-ul me-2"></i>
                    Quick Navigation
                  </h5>
                  <div className="d-grid gap-2">
                    {[
                      {
                        id: "getting-started",
                        title: "Getting Started",
                        icon: "play-circle",
                      },
                      {
                        id: "shopping-guide",
                        title: "Shopping Guide",
                        icon: "cart-check",
                      },
                      {
                        id: "account-management",
                        title: "Account Management",
                        icon: "person-gear",
                      },
                      {
                        id: "order-tracking",
                        title: "Order Tracking",
                        icon: "truck",
                      },
                      {
                        id: "invoices",
                        title: "Invoices & QR",
                        icon: "receipt",
                      },
                      {
                        id: "support",
                        title: "Support & FAQ",
                        icon: "question-circle",
                      },
                    ].map((item) => (
                      <Button
                        key={item.id}
                        variant={
                          activeSection === item.id
                            ? "primary"
                            : "outline-secondary"
                        }
                        onClick={() => scrollToSection(item.id)}
                        style={{
                          textAlign: "left",
                          border: "1px solid #dee2e6",
                          borderRadius: "8px",
                          padding: "12px 16px",
                          fontSize: "14px",
                          fontWeight: "500",
                          backgroundColor:
                            activeSection === item.id
                              ? "#e63946"
                              : "transparent",
                          borderColor:
                            activeSection === item.id ? "#e63946" : "#dee2e6",
                          color:
                            activeSection === item.id ? "white" : "#495057",
                        }}
                      >
                        <i className={`bi bi-${item.icon} me-2`}></i>
                        {item.title}
                      </Button>
                    ))}
                  </div>
                </Card.Body>
              </Card>
            </Col>

            {/* Content Area */}
            <Col lg={9}>
              {/* Getting Started Section */}
              <Card
                id="getting-started"
                style={{
                  border: "none",
                  borderRadius: "16px",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                  marginBottom: "30px",
                }}
              >
                <div
                  style={{
                    background: "linear-gradient(135deg, #e63946, #dc3545)",
                    padding: "30px",
                    color: "white",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "2rem",
                      fontWeight: "700",
                      marginBottom: "12px",
                    }}
                  >
                    <i className="bi bi-play-circle-fill me-3"></i>
                    Getting Started
                  </h3>
                  <p style={{ opacity: "0.9", marginBottom: "0" }}>
                    Welcome to Hare Krishna Medical! Here's how to get started
                  </p>
                </div>

                <Card.Body style={{ padding: "40px" }}>
                  <Row>
                    <Col md={6} className="mb-4">
                      <div className="d-flex align-items-start mb-3">
                        <div
                          style={{
                            width: "40px",
                            height: "40px",
                            background: "#e63946",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                            fontSize: "18px",
                            fontWeight: "bold",
                            marginRight: "15px",
                            flexShrink: 0,
                          }}
                        >
                          1
                        </div>
                        <div>
                          <h6 style={{ color: "#333333", marginBottom: "8px" }}>
                            Create Your Account
                          </h6>
                          <p
                            style={{
                              color: "#6c757d",
                              fontSize: "14px",
                              marginBottom: "10px",
                            }}
                          >
                            Click on "Register" to create your account with
                            email, phone, and address details.
                          </p>
                          <Button
                            as={Link}
                            to="/register"
                            size="sm"
                            style={{
                              background: "#e63946",
                              border: "none",
                              borderRadius: "6px",
                              fontSize: "12px",
                            }}
                          >
                            Register Now
                          </Button>
                        </div>
                      </div>
                    </Col>

                    <Col md={6} className="mb-4">
                      <div className="d-flex align-items-start mb-3">
                        <div
                          style={{
                            width: "40px",
                            height: "40px",
                            background: "#e63946",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                            fontSize: "18px",
                            fontWeight: "bold",
                            marginRight: "15px",
                            flexShrink: 0,
                          }}
                        >
                          2
                        </div>
                        <div>
                          <h6 style={{ color: "#333333", marginBottom: "8px" }}>
                            Browse Products
                          </h6>
                          <p
                            style={{
                              color: "#6c757d",
                              fontSize: "14px",
                              marginBottom: "10px",
                            }}
                          >
                            Explore our medical products, use filters to find
                            what you need.
                          </p>
                          <Button
                            as={Link}
                            to="/products"
                            size="sm"
                            style={{
                              background: "#e63946",
                              border: "none",
                              borderRadius: "6px",
                              fontSize: "12px",
                            }}
                          >
                            View Products
                          </Button>
                        </div>
                      </div>
                    </Col>

                    <Col md={6} className="mb-4">
                      <div className="d-flex align-items-start mb-3">
                        <div
                          style={{
                            width: "40px",
                            height: "40px",
                            background: "#e63946",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                            fontSize: "18px",
                            fontWeight: "bold",
                            marginRight: "15px",
                            flexShrink: 0,
                          }}
                        >
                          3
                        </div>
                        <div>
                          <h6 style={{ color: "#333333", marginBottom: "8px" }}>
                            Add to Cart
                          </h6>
                          <p
                            style={{
                              color: "#6c757d",
                              fontSize: "14px",
                              marginBottom: "10px",
                            }}
                          >
                            Select products, specify quantities, and add them to
                            your cart.
                          </p>
                          <Button
                            as={Link}
                            to="/cart"
                            size="sm"
                            style={{
                              background: "#e63946",
                              border: "none",
                              borderRadius: "6px",
                              fontSize: "12px",
                            }}
                          >
                            View Cart
                          </Button>
                        </div>
                      </div>
                    </Col>

                    <Col md={6} className="mb-4">
                      <div className="d-flex align-items-start mb-3">
                        <div
                          style={{
                            width: "40px",
                            height: "40px",
                            background: "#e63946",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                            fontSize: "18px",
                            fontWeight: "bold",
                            marginRight: "15px",
                            flexShrink: 0,
                          }}
                        >
                          4
                        </div>
                        <div>
                          <h6 style={{ color: "#333333", marginBottom: "8px" }}>
                            Place Order
                          </h6>
                          <p
                            style={{
                              color: "#6c757d",
                              fontSize: "14px",
                              marginBottom: "10px",
                            }}
                          >
                            Review your cart, provide delivery details, and
                            place your order.
                          </p>
                          <Button
                            as={Link}
                            to="/order"
                            size="sm"
                            style={{
                              background: "#e63946",
                              border: "none",
                              borderRadius: "6px",
                              fontSize: "12px",
                            }}
                          >
                            Place Order
                          </Button>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              {/* Shopping Guide Section */}
              <Card
                id="shopping-guide"
                style={{
                  border: "none",
                  borderRadius: "16px",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                  marginBottom: "30px",
                }}
              >
                <div
                  style={{
                    background: "linear-gradient(135deg, #dc3545, #e63946)",
                    padding: "30px",
                    color: "white",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "2rem",
                      fontWeight: "700",
                      marginBottom: "12px",
                    }}
                  >
                    <i className="bi bi-cart-check-fill me-3"></i>
                    Shopping Guide
                  </h3>
                  <p style={{ opacity: "0.9", marginBottom: "0" }}>
                    Learn how to effectively browse and purchase medical
                    products
                  </p>
                </div>

                <Card.Body style={{ padding: "40px" }}>
                  <Accordion defaultActiveKey="0">
                    <Accordion.Item eventKey="0">
                      <Accordion.Header>
                        <i className="bi bi-search me-2"></i>
                        Product Search & Filtering
                      </Accordion.Header>
                      <Accordion.Body>
                        <ul style={{ paddingLeft: "20px", lineHeight: "1.8" }}>
                          <li>
                            Use the search bar to find specific medical products
                            by name or brand
                          </li>
                          <li>
                            Apply category filters to narrow down your search
                            (Medicine, Equipment, etc.)
                          </li>
                          <li>
                            Sort products by price, popularity, or newest
                            arrivals
                          </li>
                          <li>
                            Use price range filter to find products within your
                            budget
                          </li>
                          <li>
                            Check product availability and stock status before
                            adding to cart
                          </li>
                        </ul>
                      </Accordion.Body>
                    </Accordion.Item>

                    <Accordion.Item eventKey="1">
                      <Accordion.Header>
                        <i className="bi bi-info-circle me-2"></i>
                        Product Details & Information
                      </Accordion.Header>
                      <Accordion.Body>
                        <ul style={{ paddingLeft: "20px", lineHeight: "1.8" }}>
                          <li>
                            Click on any product to view detailed information
                          </li>
                          <li>
                            Check ingredients, dosage, and usage instructions
                          </li>
                          <li>View product images and read customer reviews</li>
                          <li>Verify expiry dates and manufacturing details</li>
                          <li>
                            Check for prescriptions requirements if applicable
                          </li>
                        </ul>
                      </Accordion.Body>
                    </Accordion.Item>

                    <Accordion.Item eventKey="2">
                      <Accordion.Header>
                        <i className="bi bi-cart-plus me-2"></i>
                        Adding Items to Cart
                      </Accordion.Header>
                      <Accordion.Body>
                        <ul style={{ paddingLeft: "20px", lineHeight: "1.8" }}>
                          <li>
                            Select the desired quantity using the quantity
                            selector
                          </li>
                          <li>
                            Click "Add to Cart" to add the product to your
                            shopping cart
                          </li>
                          <li>
                            View cart icon to see total items and estimated
                            price
                          </li>
                          <li>
                            Continue shopping or proceed to checkout as needed
                          </li>
                          <li>Items remain in cart for your next session</li>
                        </ul>
                      </Accordion.Body>
                    </Accordion.Item>

                    <Accordion.Item eventKey="3">
                      <Accordion.Header>
                        <i className="bi bi-credit-card me-2"></i>
                        Checkout Process
                      </Accordion.Header>
                      <Accordion.Body>
                        <ul style={{ paddingLeft: "20px", lineHeight: "1.8" }}>
                          <li>Review all items in your cart before checkout</li>
                          <li>
                            Verify delivery address and contact information
                          </li>
                          <li>Choose your preferred payment method</li>
                          <li>
                            Apply any discount codes or offers if available
                          </li>
                          <li>Confirm order and receive order confirmation</li>
                        </ul>
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                </Card.Body>
              </Card>

              {/* Account Management Section */}
              <Card
                id="account-management"
                style={{
                  border: "none",
                  borderRadius: "16px",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                  marginBottom: "30px",
                }}
              >
                <div
                  style={{
                    background: "linear-gradient(135deg, #e63946, #dc3545)",
                    padding: "30px",
                    color: "white",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "2rem",
                      fontWeight: "700",
                      marginBottom: "12px",
                    }}
                  >
                    <i className="bi bi-person-gear me-3"></i>
                    Account Management
                  </h3>
                  <p style={{ opacity: "0.9", marginBottom: "0" }}>
                    Manage your profile, preferences, and account settings
                  </p>
                </div>

                <Card.Body style={{ padding: "40px" }}>
                  <Row>
                    <Col md={6} className="mb-4">
                      <Card
                        style={{
                          border: "1px solid #dee2e6",
                          borderRadius: "8px",
                        }}
                      >
                        <Card.Body>
                          <h6
                            style={{ color: "#e63946", marginBottom: "12px" }}
                          >
                            <i className="bi bi-person-circle me-2"></i>
                            Profile Management
                          </h6>
                          <ul
                            style={{
                              fontSize: "14px",
                              color: "#6c757d",
                              paddingLeft: "20px",
                            }}
                          >
                            <li>Update personal information</li>
                            <li>Change password and security settings</li>
                            <li>Manage delivery addresses</li>
                            <li>Update contact preferences</li>
                          </ul>
                        </Card.Body>
                      </Card>
                    </Col>

                    <Col md={6} className="mb-4">
                      <Card
                        style={{
                          border: "1px solid #dee2e6",
                          borderRadius: "8px",
                        }}
                      >
                        <Card.Body>
                          <h6
                            style={{ color: "#e63946", marginBottom: "12px" }}
                          >
                            <i className="bi bi-clock-history me-2"></i>
                            Order History
                          </h6>
                          <ul
                            style={{
                              fontSize: "14px",
                              color: "#6c757d",
                              paddingLeft: "20px",
                            }}
                          >
                            <li>View all previous orders</li>
                            <li>Track current order status</li>
                            <li>Reorder previous purchases</li>
                            <li>Download order invoices</li>
                          </ul>
                        </Card.Body>
                      </Card>
                    </Col>

                    <Col md={6} className="mb-4">
                      <Card
                        style={{
                          border: "1px solid #dee2e6",
                          borderRadius: "8px",
                        }}
                      >
                        <Card.Body>
                          <h6
                            style={{ color: "#e63946", marginBottom: "12px" }}
                          >
                            <i className="bi bi-bell me-2"></i>
                            Notifications
                          </h6>
                          <ul
                            style={{
                              fontSize: "14px",
                              color: "#6c757d",
                              paddingLeft: "20px",
                            }}
                          >
                            <li>Order status updates</li>
                            <li>Delivery notifications</li>
                            <li>Special offers and promotions</li>
                            <li>Medicine reminders</li>
                          </ul>
                        </Card.Body>
                      </Card>
                    </Col>

                    <Col md={6} className="mb-4">
                      <Card
                        style={{
                          border: "1px solid #dee2e6",
                          borderRadius: "8px",
                        }}
                      >
                        <Card.Body>
                          <h6
                            style={{ color: "#e63946", marginBottom: "12px" }}
                          >
                            <i className="bi bi-heart me-2"></i>
                            Wishlist & Favorites
                          </h6>
                          <ul
                            style={{
                              fontSize: "14px",
                              color: "#6c757d",
                              paddingLeft: "20px",
                            }}
                          >
                            <li>Save favorite products</li>
                            <li>Create wishlist for future purchases</li>
                            <li>Get notifications for wishlist items</li>
                            <li>Share wishlist with family</li>
                          </ul>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              {/* Order Tracking Section */}
              <Card
                id="order-tracking"
                style={{
                  border: "none",
                  borderRadius: "16px",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                  marginBottom: "30px",
                }}
              >
                <div
                  style={{
                    background: "linear-gradient(135deg, #343a40, #495057)",
                    padding: "30px",
                    color: "white",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "2rem",
                      fontWeight: "700",
                      marginBottom: "12px",
                    }}
                  >
                    <i className="bi bi-truck me-3"></i>
                    Order Tracking
                  </h3>
                  <p style={{ opacity: "0.9", marginBottom: "0" }}>
                    Track your orders and understand delivery status
                  </p>
                </div>

                <Card.Body style={{ padding: "40px" }}>
                  <div className="row">
                    <div className="col-12 mb-4">
                      <h6 style={{ color: "#333", marginBottom: "20px" }}>
                        Order Status Meanings:
                      </h6>
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <div className="d-flex align-items-center mb-2">
                            <span
                              style={{
                                background: "#ffc107",
                                color: "white",
                                padding: "4px 12px",
                                borderRadius: "15px",
                                fontSize: "12px",
                                fontWeight: "bold",
                                marginRight: "10px",
                              }}
                            >
                              Pending
                            </span>
                            <span
                              style={{ fontSize: "14px", color: "#6c757d" }}
                            >
                              Order received, processing payment
                            </span>
                          </div>
                        </div>
                        <div className="col-md-6 mb-3">
                          <div className="d-flex align-items-center mb-2">
                            <span
                              style={{
                                background: "#17a2b8",
                                color: "white",
                                padding: "4px 12px",
                                borderRadius: "15px",
                                fontSize: "12px",
                                fontWeight: "bold",
                                marginRight: "10px",
                              }}
                            >
                              Processing
                            </span>
                            <span
                              style={{ fontSize: "14px", color: "#6c757d" }}
                            >
                              Preparing your order for shipment
                            </span>
                          </div>
                        </div>
                        <div className="col-md-6 mb-3">
                          <div className="d-flex align-items-center mb-2">
                            <span
                              style={{
                                background: "#fd7e14",
                                color: "white",
                                padding: "4px 12px",
                                borderRadius: "15px",
                                fontSize: "12px",
                                fontWeight: "bold",
                                marginRight: "10px",
                              }}
                            >
                              Shipped
                            </span>
                            <span
                              style={{ fontSize: "14px", color: "#6c757d" }}
                            >
                              Order dispatched, on the way to you
                            </span>
                          </div>
                        </div>
                        <div className="col-md-6 mb-3">
                          <div className="d-flex align-items-center mb-2">
                            <span
                              style={{
                                background: "#28a745",
                                color: "white",
                                padding: "4px 12px",
                                borderRadius: "15px",
                                fontSize: "12px",
                                fontWeight: "bold",
                                marginRight: "10px",
                              }}
                            >
                              Delivered
                            </span>
                            <span
                              style={{ fontSize: "14px", color: "#6c757d" }}
                            >
                              Order successfully delivered
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>

              {/* Invoices & QR Section */}
              <Card
                id="invoices"
                style={{
                  border: "none",
                  borderRadius: "16px",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                  marginBottom: "30px",
                }}
              >
                <div
                  style={{
                    background: "linear-gradient(135deg, #6f42c1, #563d7c)",
                    padding: "30px",
                    color: "white",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "2rem",
                      fontWeight: "700",
                      marginBottom: "12px",
                    }}
                  >
                    <i className="bi bi-receipt me-3"></i>
                    Invoices & QR Codes
                  </h3>
                  <p style={{ opacity: "0.9", marginBottom: "0" }}>
                    Understand invoices, QR codes, and digital verification
                  </p>
                </div>

                <Card.Body style={{ padding: "40px" }}>
                  <Row>
                    <Col md={8} className="mb-4">
                      <h6 style={{ color: "#333", marginBottom: "16px" }}>
                        <i className="bi bi-file-earmark-text me-2"></i>
                        Invoice Features:
                      </h6>
                      <ul
                        style={{
                          paddingLeft: "20px",
                          lineHeight: "1.8",
                          color: "#6c757d",
                        }}
                      >
                        <li>
                          <strong>Digital Invoices:</strong> Access invoices
                          anytime from your account
                        </li>
                        <li>
                          <strong>QR Code Verification:</strong> Each invoice
                          has a unique QR code for authenticity
                        </li>
                        <li>
                          <strong>Print-Ready Format:</strong> Invoices are
                          optimized for A4 printing
                        </li>
                        <li>
                          <strong>Tax Information:</strong> Complete GST and tax
                          details included
                        </li>
                        <li>
                          <strong>Order Details:</strong> Complete product list
                          with pricing breakdown
                        </li>
                        <li>
                          <strong>Company Information:</strong> Official store
                          details and contact information
                        </li>
                      </ul>

                      <h6
                        style={{
                          color: "#333",
                          marginBottom: "16px",
                          marginTop: "24px",
                        }}
                      >
                        <i className="bi bi-qr-code me-2"></i>
                        QR Code Benefits:
                      </h6>
                      <ul
                        style={{
                          paddingLeft: "20px",
                          lineHeight: "1.8",
                          color: "#6c757d",
                        }}
                      >
                        <li>
                          <strong>Instant Verification:</strong> Scan to verify
                          invoice authenticity
                        </li>
                        <li>
                          <strong>Quick Access:</strong> Direct link to digital
                          invoice copy
                        </li>
                        <li>
                          <strong>Order Information:</strong> Contains complete
                          order and customer details
                        </li>
                        <li>
                          <strong>Security:</strong> Encrypted data prevents
                          invoice fraud
                        </li>
                        <li>
                          <strong>Mobile Friendly:</strong> Scan with any QR
                          code reader app
                        </li>
                      </ul>
                    </Col>

                    <Col md={4}>
                      <Card
                        style={{
                          border: "1px solid #dee2e6",
                          borderRadius: "8px",
                          textAlign: "center",
                        }}
                      >
                        <Card.Body style={{ padding: "30px" }}>
                          <div
                            style={{
                              width: "100px",
                              height: "100px",
                              background:
                                "linear-gradient(135deg, #6f42c1, #563d7c)",
                              borderRadius: "8px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              margin: "0 auto 20px",
                              color: "white",
                              fontSize: "32px",
                            }}
                          >
                            <i className="bi bi-qr-code"></i>
                          </div>
                          <h6 style={{ color: "#333", marginBottom: "12px" }}>
                            Sample QR Code
                          </h6>
                          <p style={{ fontSize: "12px", color: "#6c757d" }}>
                            Scan QR codes on invoices to verify authenticity and
                            access digital copies
                          </p>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              {/* Support & FAQ Section */}
              <Card
                id="support"
                style={{
                  border: "none",
                  borderRadius: "16px",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                  marginBottom: "30px",
                }}
              >
                <div
                  style={{
                    background: "linear-gradient(135deg, #20c997, #17a2b8)",
                    padding: "30px",
                    color: "white",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "2rem",
                      fontWeight: "700",
                      marginBottom: "12px",
                    }}
                  >
                    <i className="bi bi-question-circle me-3"></i>
                    Support & FAQ
                  </h3>
                  <p style={{ opacity: "0.9", marginBottom: "0" }}>
                    Common questions and how to get help
                  </p>
                </div>

                <Card.Body style={{ padding: "40px" }}>
                  <Accordion defaultActiveKey="0">
                    <Accordion.Item eventKey="0">
                      <Accordion.Header>
                        How can I track my order?
                      </Accordion.Header>
                      <Accordion.Body>
                        You can track your order by logging into your account
                        and visiting the "My Orders" section. Each order shows
                        real-time status updates from placement to delivery.
                      </Accordion.Body>
                    </Accordion.Item>

                    <Accordion.Item eventKey="1">
                      <Accordion.Header>
                        What payment methods do you accept?
                      </Accordion.Header>
                      <Accordion.Body>
                        We accept various payment methods including Credit/Debit
                        Cards, Net Banking, UPI, Mobile Wallets, and Cash on
                        Delivery (COD) for eligible orders.
                      </Accordion.Body>
                    </Accordion.Item>

                    <Accordion.Item eventKey="2">
                      <Accordion.Header>
                        How do I download my invoice?
                      </Accordion.Header>
                      <Accordion.Body>
                        Visit your account dashboard, go to "My Orders" or
                        "Invoices" section, and click the "Download Invoice"
                        button next to any completed order. You can also scan
                        the QR code on physical receipts.
                      </Accordion.Body>
                    </Accordion.Item>

                    <Accordion.Item eventKey="3">
                      <Accordion.Header>
                        Do you offer home delivery?
                      </Accordion.Header>
                      <Accordion.Body>
                        Yes, we offer home delivery across Gujarat. Delivery
                        charges may apply based on location and order value.
                        Free delivery is available for orders above ₹500.
                      </Accordion.Body>
                    </Accordion.Item>

                    <Accordion.Item eventKey="4">
                      <Accordion.Header>
                        How can I contact customer support?
                      </Accordion.Header>
                      <Accordion.Body>
                        You can reach us through:
                        <ul style={{ marginTop: "10px", paddingLeft: "20px" }}>
                          <li>Phone: +91 76989 13354 or +91 91060 18508</li>
                          <li>Email: harekrishnamedical@gmail.com</li>
                          <li>Contact form on our website</li>
                          <li>
                            Visit our store: 3 Sahyog Complex, Man Sarovar
                            Circle, Amroli, Surat
                          </li>
                        </ul>
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>

                  <div className="mt-4 text-center">
                    <Button
                      as={Link}
                      to="/contact"
                      size="lg"
                      style={{
                        background: "#20c997",
                        border: "none",
                        borderRadius: "8px",
                        padding: "14px 28px",
                        fontSize: "16px",
                        fontWeight: "600",
                        marginRight: "12px",
                      }}
                    >
                      <i className="bi bi-chat-dots me-2"></i>
                      Contact Support
                    </Button>
                    <Button
                      as={Link}
                      to="/about"
                      variant="outline-secondary"
                      size="lg"
                      style={{
                        borderRadius: "8px",
                        padding: "14px 28px",
                        fontSize: "16px",
                        fontWeight: "600",
                      }}
                    >
                      <i className="bi bi-info-circle me-2"></i>
                      About Us
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default UserGuide;
