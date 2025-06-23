import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Card, Accordion } from "react-bootstrap";
import { Link } from "react-router-dom";

const UserGuide = () => {
  const [activeSection, setActiveSection] = useState("getting-started");

  // Real-time section detection
  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        "getting-started",
        "shopping-guide",
        "account-management",
        "order-tracking",
        "invoices",
        "cart-management",
        "support",
      ];

      const scrollPosition = window.scrollY + 100;

      for (let i = sections.length - 1; i >= 0; i--) {
        const element = document.getElementById(sections[i]);
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const navigationItems = [
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
      id: "cart-management",
      title: "Cart Management",
      icon: "cart3",
    },
    {
      id: "support",
      title: "Support & FAQ",
      icon: "question-circle",
    },
  ];

  return (
    <div className="fade-in">
      {/* Hero Section */}
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
                Complete User Guide
              </h1>
              <p
                style={{
                  fontSize: "1.2rem",
                  opacity: "0.9",
                  maxWidth: "600px",
                  margin: "0 auto",
                }}
              >
                Master every feature of Hare Krishna Medical platform with our
                comprehensive guide
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
            {navigationItems.slice(0, 4).map((item, index) => (
              <Col lg={3} md={6} className="mb-4" key={item.id}>
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
                  onClick={() => scrollToSection(item.id)}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = "#343a40";
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow =
                      "0 8px 25px rgba(52, 58, 64, 0.2)";
                    const iconDiv =
                      e.currentTarget.querySelector(".guide-icon");
                    if (iconDiv) {
                      iconDiv.style.background =
                        "linear-gradient(135deg, #343a40, #495057)";
                    }
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = "#f8f9fa";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                    const iconDiv =
                      e.currentTarget.querySelector(".guide-icon");
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
                    <i className={`bi bi-${item.icon}`}></i>
                  </div>
                  <h5 style={{ color: "#333333", marginBottom: "16px" }}>
                    {item.title}
                  </h5>
                  <p style={{ color: "#495057", marginBottom: "0" }}>
                    {item.id === "getting-started" &&
                      "Learn the basics of account creation and first order"}
                    {item.id === "shopping-guide" &&
                      "Master product browsing and purchasing"}
                    {item.id === "account-management" &&
                      "Manage your profile and preferences"}
                    {item.id === "order-tracking" &&
                      "Track your orders from placement to delivery"}
                  </p>
                </Card>
              </Col>
            ))}
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
            {/* Real-time Navigation Sidebar */}
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
                    {navigationItems.map((item) => (
                      <Button
                        key={item.id}
                        onClick={() => scrollToSection(item.id)}
                        style={{
                          textAlign: "left",
                          border: "2px solid #dee2e6",
                          borderRadius: "12px",
                          padding: "14px 18px",
                          fontSize: "14px",
                          fontWeight: "600",
                          transition: "all 0.3s ease",
                          background:
                            activeSection === item.id
                              ? "linear-gradient(135deg, #e63946, #dc3545)"
                              : "transparent",
                          borderColor:
                            activeSection === item.id ? "#e63946" : "#dee2e6",
                          color:
                            activeSection === item.id ? "white" : "#495057",
                          boxShadow:
                            activeSection === item.id
                              ? "0 4px 15px rgba(230, 57, 70, 0.3)"
                              : "none",
                          transform:
                            activeSection === item.id
                              ? "translateX(5px)"
                              : "translateX(0)",
                        }}
                        onMouseOver={(e) => {
                          if (activeSection !== item.id) {
                            e.target.style.borderColor = "#e63946";
                            e.target.style.color = "#e63946";
                          }
                        }}
                        onMouseOut={(e) => {
                          if (activeSection !== item.id) {
                            e.target.style.borderColor = "#dee2e6";
                            e.target.style.color = "#495057";
                          }
                        }}
                      >
                        <i className={`bi bi-${item.icon} me-2`}></i>
                        {item.title}
                        {activeSection === item.id && (
                          <i
                            className="bi bi-arrow-right ms-auto"
                            style={{ float: "right" }}
                          ></i>
                        )}
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
                    background: "linear-gradient(135deg, #6f42c1, #6610f2)",
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
                            style={{ color: "#6f42c1", marginBottom: "12px" }}
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
                            <li>Change password</li>
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
                            style={{ color: "#6f42c1", marginBottom: "12px" }}
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
                    background: "linear-gradient(135deg, #fd7e14, #ffc107)",
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
                    Order Tracking & Status
                  </h3>
                  <p style={{ opacity: "0.9", marginBottom: "0" }}>
                    Track your orders from placement to delivery
                  </p>
                </div>

                <Card.Body style={{ padding: "40px" }}>
                  <Row>
                    <Col md={6} className="mb-4">
                      <h6 style={{ color: "#333", marginBottom: "20px" }}>
                        <i className="bi bi-info-circle me-2"></i>
                        Order Status Guide:
                      </h6>
                      <div className="mb-3">
                        <div className="d-flex align-items-center mb-2">
                          <span
                            style={{
                              background: "#ffc107",
                              color: "white",
                              padding: "6px 14px",
                              borderRadius: "20px",
                              fontSize: "12px",
                              fontWeight: "bold",
                              marginRight: "12px",
                            }}
                          >
                            Pending
                          </span>
                          <span style={{ fontSize: "14px", color: "#6c757d" }}>
                            Order received, payment processing
                          </span>
                        </div>
                      </div>
                      <div className="mb-3">
                        <div className="d-flex align-items-center mb-2">
                          <span
                            style={{
                              background: "#17a2b8",
                              color: "white",
                              padding: "6px 14px",
                              borderRadius: "20px",
                              fontSize: "12px",
                              fontWeight: "bold",
                              marginRight: "12px",
                            }}
                          >
                            Processing
                          </span>
                          <span style={{ fontSize: "14px", color: "#6c757d" }}>
                            Preparing items for shipment
                          </span>
                        </div>
                      </div>
                      <div className="mb-3">
                        <div className="d-flex align-items-center mb-2">
                          <span
                            style={{
                              background: "#fd7e14",
                              color: "white",
                              padding: "6px 14px",
                              borderRadius: "20px",
                              fontSize: "12px",
                              fontWeight: "bold",
                              marginRight: "12px",
                            }}
                          >
                            Shipped
                          </span>
                          <span style={{ fontSize: "14px", color: "#6c757d" }}>
                            Package dispatched, in transit
                          </span>
                        </div>
                      </div>
                      <div className="mb-3">
                        <div className="d-flex align-items-center mb-2">
                          <span
                            style={{
                              background: "#28a745",
                              color: "white",
                              padding: "6px 14px",
                              borderRadius: "20px",
                              fontSize: "12px",
                              fontWeight: "bold",
                              marginRight: "12px",
                            }}
                          >
                            Delivered
                          </span>
                          <span style={{ fontSize: "14px", color: "#6c757d" }}>
                            Successfully delivered to you
                          </span>
                        </div>
                      </div>
                    </Col>

                    <Col md={6}>
                      <h6 style={{ color: "#333", marginBottom: "20px" }}>
                        <i className="bi bi-clock-history me-2"></i>
                        How to Track Your Order:
                      </h6>
                      <div
                        style={{
                          background: "#f8f9fa",
                          padding: "20px",
                          borderRadius: "12px",
                          marginBottom: "20px",
                        }}
                      >
                        <ol style={{ paddingLeft: "20px", marginBottom: "0" }}>
                          <li style={{ marginBottom: "8px" }}>
                            Go to "My Orders" in your dashboard
                          </li>
                          <li style={{ marginBottom: "8px" }}>
                            Find your order by order ID or date
                          </li>
                          <li style={{ marginBottom: "8px" }}>
                            Click "Track Order" for real-time updates
                          </li>
                          <li style={{ marginBottom: "8px" }}>
                            Receive SMS/Email notifications for status changes
                          </li>
                        </ol>
                      </div>
                      <Button
                        as={Link}
                        to="/user/orders"
                        style={{
                          background: "#fd7e14",
                          border: "none",
                          borderRadius: "8px",
                          padding: "10px 20px",
                          fontSize: "14px",
                          fontWeight: "600",
                        }}
                      >
                        <i className="bi bi-box-seam me-2"></i>
                        Track My Orders
                      </Button>
                    </Col>
                  </Row>
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
                    background: "linear-gradient(135deg, #17a2b8, #20c997)",
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
                    Invoices & QR Verification
                  </h3>
                  <p style={{ opacity: "0.9", marginBottom: "0" }}>
                    Access digital invoices and verify authenticity with QR
                    codes
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
                          <strong>Digital Access:</strong> Download invoices
                          anytime from your account
                        </li>
                        <li>
                          <strong>QR Code Security:</strong> Each invoice
                          contains a unique verification QR code
                        </li>
                        <li>
                          <strong>Print Optimization:</strong> Perfect A4
                          formatting with proper margins
                        </li>
                        <li>
                          <strong>Tax Compliance:</strong> Complete GST and tax
                          details included
                        </li>
                        <li>
                          <strong>Order Details:</strong> Complete breakdown of
                          products and pricing
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
                        QR Code Verification:
                      </h6>
                      <div
                        style={{
                          background: "#e7f3ff",
                          padding: "20px",
                          borderRadius: "12px",
                          marginBottom: "20px",
                        }}
                      >
                        <ol style={{ paddingLeft: "20px", marginBottom: "0" }}>
                          <li style={{ marginBottom: "8px" }}>
                            Open any QR scanner app on your phone
                          </li>
                          <li style={{ marginBottom: "8px" }}>
                            Point camera at the QR code on your invoice
                          </li>
                          <li style={{ marginBottom: "8px" }}>
                            Instantly verify invoice authenticity and details
                          </li>
                          <li>Access digital copy and order information</li>
                        </ol>
                      </div>
                    </Col>

                    <Col md={4}>
                      <Card
                        style={{
                          border: "1px solid #dee2e6",
                          borderRadius: "12px",
                          textAlign: "center",
                        }}
                      >
                        <Card.Body style={{ padding: "30px" }}>
                          <div
                            style={{
                              width: "100px",
                              height: "100px",
                              background:
                                "linear-gradient(135deg, #17a2b8, #20c997)",
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
                            Enhanced QR Codes
                          </h6>
                          <p style={{ fontSize: "12px", color: "#6c757d" }}>
                            Larger, more scannable QR codes with encrypted data
                            for maximum security
                          </p>
                          <Button
                            as={Link}
                            to="/user/invoices"
                            size="sm"
                            style={{
                              background: "#17a2b8",
                              border: "none",
                              borderRadius: "8px",
                              fontSize: "12px",
                            }}
                          >
                            View My Invoices
                          </Button>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              {/* Cart Management Section */}
              <Card
                id="cart-management"
                style={{
                  border: "none",
                  borderRadius: "16px",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                  marginBottom: "30px",
                }}
              >
                <div
                  style={{
                    background: "linear-gradient(135deg, #28a745, #20c997)",
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
                    <i className="bi bi-cart3 me-3"></i>
                    Cart Management
                  </h3>
                  <p style={{ opacity: "0.9", marginBottom: "0" }}>
                    Master your shopping cart for efficient purchasing
                  </p>
                </div>

                <Card.Body style={{ padding: "40px" }}>
                  <Accordion defaultActiveKey="0">
                    <Accordion.Item eventKey="0">
                      <Accordion.Header>
                        <i className="bi bi-cart-plus me-2"></i>
                        Adding Items to Cart
                      </Accordion.Header>
                      <Accordion.Body>
                        <ul style={{ paddingLeft: "20px", lineHeight: "1.8" }}>
                          <li>Browse products and click "Add to Cart"</li>
                          <li>Adjust quantities using +/- buttons</li>
                          <li>View cart summary in the top navigation</li>
                          <li>Items are saved for your next session</li>
                        </ul>
                      </Accordion.Body>
                    </Accordion.Item>

                    <Accordion.Item eventKey="1">
                      <Accordion.Header>
                        <i className="bi bi-pencil-square me-2"></i>
                        Managing Cart Items
                      </Accordion.Header>
                      <Accordion.Body>
                        <ul style={{ paddingLeft: "20px", lineHeight: "1.8" }}>
                          <li>Update quantities directly in cart page</li>
                          <li>Remove unwanted items with delete button</li>
                          <li>Apply discount codes and coupons</li>
                          <li>Save items for later purchase</li>
                        </ul>
                      </Accordion.Body>
                    </Accordion.Item>

                    <Accordion.Item eventKey="2">
                      <Accordion.Header>
                        <i className="bi bi-credit-card me-2"></i>
                        Checkout Process
                      </Accordion.Header>
                      <Accordion.Body>
                        <ul style={{ paddingLeft: "20px", lineHeight: "1.8" }}>
                          <li>Review all items and total amount</li>
                          <li>Confirm delivery address</li>
                          <li>Choose payment method (COD/Online)</li>
                          <li>Place order and receive confirmation</li>
                        </ul>
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
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
                    <i className="bi bi-question-circle me-3"></i>
                    Support & FAQ
                  </h3>
                  <p style={{ opacity: "0.9", marginBottom: "0" }}>
                    Get help and find answers to common questions
                  </p>
                </div>

                <Card.Body style={{ padding: "40px" }}>
                  <Accordion defaultActiveKey="0">
                    <Accordion.Item eventKey="0">
                      <Accordion.Header>
                        How can I track my order in real-time?
                      </Accordion.Header>
                      <Accordion.Body>
                        You can track your order by logging into your account
                        and visiting the "My Orders" section. Each order shows
                        real-time status updates from placement to delivery. You
                        also receive SMS and email notifications for every
                        status change.
                      </Accordion.Body>
                    </Accordion.Item>

                    <Accordion.Item eventKey="1">
                      <Accordion.Header>
                        What payment methods do you accept?
                      </Accordion.Header>
                      <Accordion.Body>
                        We accept various payment methods including Credit/Debit
                        Cards, Net Banking, UPI, Mobile Wallets, and Cash on
                        Delivery (COD) for eligible orders. All online payments
                        are secured with SSL encryption.
                      </Accordion.Body>
                    </Accordion.Item>

                    <Accordion.Item eventKey="2">
                      <Accordion.Header>
                        How do I download and verify my invoice?
                      </Accordion.Header>
                      <Accordion.Body>
                        Visit your account dashboard, go to "My Orders" or
                        "Invoices" section, and click the "Download Invoice"
                        button. Each invoice contains a QR code that you can
                        scan to verify authenticity and access the digital copy.
                      </Accordion.Body>
                    </Accordion.Item>

                    <Accordion.Item eventKey="3">
                      <Accordion.Header>
                        What are your delivery areas and charges?
                      </Accordion.Header>
                      <Accordion.Body>
                        We deliver across Gujarat with free delivery for orders
                        above ₹500. Delivery charges apply based on location and
                        order value. Estimated delivery time is 2-5 business
                        days depending on your location.
                      </Accordion.Body>
                    </Accordion.Item>

                    <Accordion.Item eventKey="4">
                      <Accordion.Header>
                        How can I contact customer support?
                      </Accordion.Header>
                      <Accordion.Body>
                        You can reach us through multiple channels:
                        <ul style={{ marginTop: "10px", paddingLeft: "20px" }}>
                          <li>Phone: +91 76989 13354 or +91 91060 18508</li>
                          <li>Email: harekrishnamedical@gmail.com</li>
                          <li>Contact form on our website</li>
                          <li>
                            Visit our store: 3 Sahyog Complex, Man Sarovar
                            Circle, Amroli, Surat
                          </li>
                        </ul>
                        Our support team is available Monday-Saturday, 9:00 AM -
                        8:00 PM.
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>

                  <div className="mt-4 text-center">
                    <Button
                      as={Link}
                      to="/contact"
                      size="lg"
                      style={{
                        background: "#e63946",
                        border: "none",
                        borderRadius: "12px",
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
                      style={{
                        background: "transparent",
                        border: "2px solid #6c757d",
                        borderRadius: "12px",
                        padding: "14px 28px",
                        fontSize: "16px",
                        fontWeight: "600",
                        color: "#6c757d",
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
