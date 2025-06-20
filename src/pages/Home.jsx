import React, { useEffect } from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../store/slices/cartSlice";

const Home = () => {
  const dispatch = useDispatch();
  const { featuredProducts } = useSelector((state) => state.products);

  // Mock featured products
  const defaultFeaturedProducts = [
    {
      id: 1,
      name: "Paracetamol Tablets",
      company: "Hare Krishna Pharma",
      price: 25.99,
      image:
        "https://via.placeholder.com/300x250/e6e6e6/666666?text=Medicine+1",
      description: "Effective pain relief and fever reducer",
    },
    {
      id: 2,
      name: "Vitamin D3 Capsules",
      company: "Health Plus",
      price: 45.5,
      image:
        "https://via.placeholder.com/300x250/e6e6e6/666666?text=Medicine+2",
      description: "Essential vitamin for bone health",
    },
    {
      id: 3,
      name: "Cough Syrup",
      company: "Wellness Care",
      price: 35.75,
      image:
        "https://via.placeholder.com/300x250/e6e6e6/666666?text=Medicine+3",
      description: "Natural cough relief formula",
    },
  ];

  // Use featured products from store or fallback to default
  const productsToShow =
    featuredProducts.length > 0 ? featuredProducts : defaultFeaturedProducts;

  const handleAddToCart = (product) => {
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    };

    dispatch(addToCart(cartItem));
    // No confirmation alert - direct add to cart
  };

  useEffect(() => {
    // In a real app, this would fetch featured products from API
  }, [dispatch]);

  return (
    <div className="fade-in">
      {/* Hero Section with Official Color Palette */}
      <section
        className="hero-section"
        style={{
          background: `linear-gradient(135deg, #343a40 0%, #495057 100%)`,
          position: "relative",
          overflow: "hidden",
          minHeight: "100vh",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `repeating-linear-gradient(
              45deg,
              transparent,
              transparent 100px,
              rgba(230, 57, 70, 0.03) 100px,
              rgba(230, 57, 70, 0.03) 200px
            )`,
          }}
        ></div>
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `radial-gradient(circle at 20% 30%, rgba(230, 57, 70, 0.1) 0%, transparent 50%), 
                         radial-gradient(circle at 80% 70%, rgba(220, 53, 69, 0.08) 0%, transparent 50%)`,
          }}
        ></div>
        <Container
          style={{
            position: "relative",
            zIndex: 2,
            paddingTop: "100px",
            paddingBottom: "100px",
          }}
        >
          <Row className="align-items-center min-vh-75">
            <Col lg={6} className="slide-in-left">
              <h1
                className="hero-title"
                style={{
                  color: "#ffffff",
                  fontSize: "4rem",
                  fontWeight: "800",
                  lineHeight: "1.1",
                  marginBottom: "2rem",
                  textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
                }}
              >
                Your Health, <br />
                <span style={{ color: "#e63946" }}>Our Priority</span>
              </h1>
              <p
                className="hero-subtitle"
                style={{
                  color: "#ffffff",
                  fontSize: "1.3rem",
                  lineHeight: "1.6",
                  marginBottom: "3rem",
                  opacity: "0.95",
                  textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
                }}
              >
                Welcome to Hare Krishna Medical - your trusted partner in health
                and wellness. We provide quality medical products with a
                commitment to excellence and care for your family's health.
              </p>
              <div className="d-flex gap-3 flex-wrap">
                <Button
                  as={Link}
                  to="/products"
                  size="lg"
                  style={{
                    background: "#e63946",
                    border: "none",
                    borderRadius: "8px",
                    padding: "16px 32px",
                    fontSize: "1.1rem",
                    fontWeight: "700",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    boxShadow: "0 8px 25px rgba(230, 57, 70, 0.3)",
                    transition: "all 0.3s ease",
                  }}
                  onMouseOver={(e) => {
                    e.target.style.background = "#dc3545";
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow =
                      "0 12px 35px rgba(220, 53, 69, 0.4)";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = "#e63946";
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow =
                      "0 8px 25px rgba(230, 57, 70, 0.3)";
                  }}
                >
                  Shop Products
                </Button>
                <Button
                  as={Link}
                  to="/about"
                  size="lg"
                  style={{
                    background: "transparent",
                    color: "#ffffff",
                    border: "2px solid #ffffff",
                    borderRadius: "8px",
                    padding: "16px 32px",
                    fontSize: "1.1rem",
                    fontWeight: "700",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    transition: "all 0.3s ease",
                  }}
                  onMouseOver={(e) => {
                    e.target.style.background = "#ffffff";
                    e.target.style.color = "#343a40";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = "transparent";
                    e.target.style.color = "#ffffff";
                  }}
                >
                  Learn More
                </Button>
              </div>
            </Col>
            <Col lg={6} className="slide-in-right">
              <div className="text-center">
                <div
                  style={{
                    background: "rgba(255, 255, 255, 0.1)",
                    backdropFilter: "blur(15px)",
                    borderRadius: "20px",
                    padding: "50px",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    boxShadow: "0 25px 50px rgba(0, 0, 0, 0.2)",
                  }}
                >
                  <img
                    src="https://cdn.builder.io/api/v1/assets/ec4b3f82f1ac4275b8bfc1756fcac420/medical_logo-e586be?format=webp&width=800"
                    alt="Hare Krishna Medical"
                    className="img-fluid"
                    style={{
                      maxHeight: "350px",
                      filter: "brightness(1.2) contrast(1.1)",
                    }}
                  />
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section with Professional Gray Background */}
      <section
        className="section-padding"
        style={{
          background: "#ffffff",
          position: "relative",
          paddingTop: "100px",
          paddingBottom: "100px",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `linear-gradient(45deg, 
              rgba(52, 58, 64, 0.02) 25%, 
              transparent 25%), 
            linear-gradient(-45deg, 
              rgba(52, 58, 64, 0.02) 25%, 
              transparent 25%)`,
            backgroundSize: "60px 60px",
          }}
        ></div>
        <Container style={{ position: "relative", zIndex: 2 }}>
          <Row>
            <Col lg={12} className="text-center mb-5">
              <h2
                className="section-title"
                style={{
                  color: "#333333",
                  fontSize: "3rem",
                  fontWeight: "800",
                  marginBottom: "1.5rem",
                  position: "relative",
                }}
              >
                Why Choose Us?
                <div
                  style={{
                    position: "absolute",
                    bottom: "-10px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "80px",
                    height: "4px",
                    background: "#e63946",
                    borderRadius: "2px",
                  }}
                ></div>
              </h2>
              <p
                className="section-subtitle"
                style={{
                  color: "#495057",
                  fontSize: "1.2rem",
                  maxWidth: "700px",
                  margin: "2rem auto 0",
                  lineHeight: "1.6",
                }}
              >
                We are committed to providing the best healthcare solutions with
                quality products and exceptional service.
              </p>
            </Col>
          </Row>
          <Row className="mt-5">
            <Col lg={4} md={6} className="mb-5">
              <div
                className="service-card fade-in"
                style={{
                  background: "#ffffff",
                  borderRadius: "15px",
                  padding: "50px 30px",
                  border: `2px solid #f8f9fa`,
                  boxShadow: "0 15px 50px rgba(52, 58, 64, 0.08)",
                  height: "100%",
                  transition: "all 0.3s ease",
                  textAlign: "center",
                  position: "relative",
                  overflow: "hidden",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "translateY(-10px)";
                  e.currentTarget.style.borderColor = "#e63946";
                  e.currentTarget.style.boxShadow =
                    "0 25px 60px rgba(230, 57, 70, 0.15)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.borderColor = "#f8f9fa";
                  e.currentTarget.style.boxShadow =
                    "0 15px 50px rgba(52, 58, 64, 0.08)";
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "5px",
                    background: "#e63946",
                  }}
                ></div>
                <div
                  className="feature-icon"
                  style={{
                    background: `linear-gradient(135deg, #e63946, #dc3545)`,
                    color: "white",
                    borderRadius: "50%",
                    width: "80px",
                    height: "80px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 30px",
                    fontSize: "32px",
                    boxShadow: "0 10px 30px rgba(230, 57, 70, 0.3)",
                  }}
                >
                  <i className="bi bi-shield-check"></i>
                </div>
                <h4
                  style={{
                    color: "#333333",
                    fontWeight: "700",
                    fontSize: "1.4rem",
                    marginBottom: "20px",
                  }}
                >
                  Quality Assured
                </h4>
                <p
                  style={{
                    color: "#495057",
                    lineHeight: "1.6",
                    fontSize: "1rem",
                  }}
                >
                  All our products are sourced from trusted manufacturers and
                  undergo strict quality checks to ensure safety and efficacy.
                </p>
              </div>
            </Col>
            <Col lg={4} md={6} className="mb-5">
              <div
                className="service-card fade-in"
                style={{
                  background: "#ffffff",
                  borderRadius: "15px",
                  padding: "50px 30px",
                  border: `2px solid #f8f9fa`,
                  boxShadow: "0 15px 50px rgba(52, 58, 64, 0.08)",
                  height: "100%",
                  transition: "all 0.3s ease",
                  textAlign: "center",
                  position: "relative",
                  overflow: "hidden",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "translateY(-10px)";
                  e.currentTarget.style.borderColor = "#e63946";
                  e.currentTarget.style.boxShadow =
                    "0 25px 60px rgba(230, 57, 70, 0.15)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.borderColor = "#f8f9fa";
                  e.currentTarget.style.boxShadow =
                    "0 15px 50px rgba(52, 58, 64, 0.08)";
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "5px",
                    background: "#dc3545",
                  }}
                ></div>
                <div
                  className="feature-icon"
                  style={{
                    background: `linear-gradient(135deg, #dc3545, #e63946)`,
                    color: "white",
                    borderRadius: "50%",
                    width: "80px",
                    height: "80px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 30px",
                    fontSize: "32px",
                    boxShadow: "0 10px 30px rgba(220, 53, 69, 0.3)",
                  }}
                >
                  <i className="bi bi-truck"></i>
                </div>
                <h4
                  style={{
                    color: "#333333",
                    fontWeight: "700",
                    fontSize: "1.4rem",
                    marginBottom: "20px",
                  }}
                >
                  Fast Delivery
                </h4>
                <p
                  style={{
                    color: "#495057",
                    lineHeight: "1.6",
                    fontSize: "1rem",
                  }}
                >
                  Quick and reliable delivery service to ensure you get your
                  medical needs fulfilled on time, every time.
                </p>
              </div>
            </Col>
            <Col lg={4} md={6} className="mb-5">
              <div
                className="service-card fade-in"
                style={{
                  background: "#ffffff",
                  borderRadius: "15px",
                  padding: "50px 30px",
                  border: `2px solid #f8f9fa`,
                  boxShadow: "0 15px 50px rgba(52, 58, 64, 0.08)",
                  height: "100%",
                  transition: "all 0.3s ease",
                  textAlign: "center",
                  position: "relative",
                  overflow: "hidden",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "translateY(-10px)";
                  e.currentTarget.style.borderColor = "#e63946";
                  e.currentTarget.style.boxShadow =
                    "0 25px 60px rgba(230, 57, 70, 0.15)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.borderColor = "#f8f9fa";
                  e.currentTarget.style.boxShadow =
                    "0 15px 50px rgba(52, 58, 64, 0.08)";
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "5px",
                    background: "#495057",
                  }}
                ></div>
                <div
                  className="feature-icon"
                  style={{
                    background: `linear-gradient(135deg, #495057, #343a40)`,
                    color: "white",
                    borderRadius: "50%",
                    width: "80px",
                    height: "80px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 30px",
                    fontSize: "32px",
                    boxShadow: "0 10px 30px rgba(73, 80, 87, 0.3)",
                  }}
                >
                  <i className="bi bi-headset"></i>
                </div>
                <h4
                  style={{
                    color: "#333333",
                    fontWeight: "700",
                    fontSize: "1.4rem",
                    marginBottom: "20px",
                  }}
                >
                  Expert Support
                </h4>
                <p
                  style={{
                    color: "#495057",
                    lineHeight: "1.6",
                    fontSize: "1rem",
                  }}
                >
                  Our knowledgeable team is always ready to help you with
                  product information and health-related queries.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Featured Products Section with Dark Background */}
      <section
        className="section-padding"
        style={{
          background: `linear-gradient(135deg, #343a40 0%, #495057 100%)`,
          position: "relative",
          paddingTop: "100px",
          paddingBottom: "100px",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `repeating-linear-gradient(
              90deg,
              transparent,
              transparent 200px,
              rgba(230, 57, 70, 0.03) 200px,
              rgba(230, 57, 70, 0.03) 400px
            )`,
          }}
        ></div>
        <Container style={{ position: "relative", zIndex: 2 }}>
          <Row>
            <Col lg={12} className="text-center mb-5">
              <h2
                className="section-title"
                style={{
                  color: "#ffffff",
                  fontSize: "3rem",
                  fontWeight: "800",
                  marginBottom: "1.5rem",
                  textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
                  position: "relative",
                }}
              >
                Featured Products
                <div
                  style={{
                    position: "absolute",
                    bottom: "-10px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "80px",
                    height: "4px",
                    background: "#e63946",
                    borderRadius: "2px",
                  }}
                ></div>
              </h2>
              <p
                className="section-subtitle"
                style={{
                  color: "#ffffff",
                  fontSize: "1.2rem",
                  opacity: "0.9",
                  maxWidth: "700px",
                  margin: "2rem auto 0",
                  textShadow: "1px 1px 2px rgba(0,0,0,0.2)",
                }}
              >
                Discover our most popular and trusted medical products
              </p>
            </Col>
          </Row>
          <Row className="mt-5">
            {productsToShow.map((product, index) => (
              <Col lg={4} md={6} className="mb-4" key={product.id || index}>
                <Card
                  className="product-card fade-in"
                  style={{
                    background: "#ffffff",
                    borderRadius: "15px",
                    border: "none",
                    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15)",
                    transition: "all 0.3s ease",
                    height: "100%",
                    overflow: "hidden",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "translateY(-10px)";
                    e.currentTarget.style.boxShadow =
                      "0 30px 80px rgba(230, 57, 70, 0.2)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 20px 60px rgba(0, 0, 0, 0.15)";
                  }}
                >
                  <div style={{ position: "relative", overflow: "hidden" }}>
                    <Link
                      to={`/products/${product.id}`}
                      className="text-decoration-none"
                    >
                      <Card.Img
                        variant="top"
                        src={product.image}
                        className="product-image"
                        alt={product.name}
                        style={{
                          height: "220px",
                          objectFit: "cover",
                          transition: "all 0.3s ease",
                        }}
                      />
                    </Link>
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: "5px",
                        background: `linear-gradient(90deg, #e63946, #dc3545)`,
                      }}
                    ></div>
                  </div>
                  <Card.Body
                    className="d-flex flex-column"
                    style={{ padding: "30px" }}
                  >
                    <Link
                      to={`/products/${product.id}`}
                      className="text-decoration-none"
                    >
                      <Card.Title
                        className="product-title"
                        style={{
                          color: "#333333",
                          fontWeight: "700",
                          fontSize: "1.3rem",
                          marginBottom: "10px",
                        }}
                      >
                        {product.name}
                      </Card.Title>
                    </Link>
                    <p
                      style={{
                        color: "#495057",
                        fontSize: "0.9rem",
                        marginBottom: "15px",
                      }}
                    >
                      {product.company}
                    </p>
                    <Card.Text
                      className="flex-grow-1"
                      style={{
                        color: "#495057",
                        lineHeight: "1.5",
                        marginBottom: "25px",
                      }}
                    >
                      {product.description}
                    </Card.Text>
                    <div className="d-flex justify-content-between align-items-center mt-auto">
                      <span
                        className="product-price fw-bold"
                        style={{
                          color: "#e63946",
                          fontSize: "1.6rem",
                          fontWeight: "800",
                        }}
                      >
                        ₹{product.price}
                      </span>
                      <Button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleAddToCart(product);
                        }}
                        style={{
                          background: "#e63946",
                          border: "none",
                          borderRadius: "8px",
                          padding: "12px 24px",
                          fontWeight: "600",
                          fontSize: "0.9rem",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          transition: "all 0.3s ease",
                        }}
                        onMouseOver={(e) => {
                          e.target.style.background = "#dc3545";
                          e.target.style.transform = "translateY(-2px)";
                        }}
                        onMouseOut={(e) => {
                          e.target.style.background = "#e63946";
                          e.target.style.transform = "translateY(0)";
                        }}
                      >
                        <i className="bi bi-cart-plus me-2"></i>
                        Add to Cart
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
          <Row>
            <Col lg={12} className="text-center mt-5">
              <Button
                as={Link}
                to="/products"
                size="lg"
                style={{
                  background: "#e63946",
                  border: "none",
                  borderRadius: "8px",
                  padding: "16px 40px",
                  fontSize: "1.1rem",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  boxShadow: "0 8px 25px rgba(230, 57, 70, 0.3)",
                  transition: "all 0.3s ease",
                }}
                onMouseOver={(e) => {
                  e.target.style.background = "#dc3545";
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow =
                    "0 12px 35px rgba(220, 53, 69, 0.4)";
                }}
                onMouseOut={(e) => {
                  e.target.style.background = "#e63946";
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow =
                    "0 8px 25px rgba(230, 57, 70, 0.3)";
                }}
              >
                View All Products
              </Button>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Stats Section with Light Background */}
      <section
        className="stats-section section-padding"
        style={{
          background: "#ffffff",
          paddingTop: "100px",
          paddingBottom: "100px",
        }}
      >
        <Container>
          <Row>
            <Col lg={3} md={6} className="mb-4">
              <div
                className="stat-item fade-in text-center"
                style={{
                  background: "#ffffff",
                  borderRadius: "15px",
                  padding: "50px 30px",
                  border: `2px solid #f8f9fa`,
                  boxShadow: "0 15px 50px rgba(52, 58, 64, 0.08)",
                  transition: "all 0.3s ease",
                  position: "relative",
                  overflow: "hidden",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.borderColor = "#e63946";
                  e.currentTarget.style.boxShadow =
                    "0 25px 60px rgba(230, 57, 70, 0.15)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.borderColor = "#f8f9fa";
                  e.currentTarget.style.boxShadow =
                    "0 15px 50px rgba(52, 58, 64, 0.08)";
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "5px",
                    background: "#e63946",
                  }}
                ></div>
                <span
                  className="stat-number"
                  style={{
                    fontSize: "4rem",
                    fontWeight: "900",
                    color: "#e63946",
                    display: "block",
                    marginBottom: "15px",
                    lineHeight: "1",
                  }}
                >
                  500+
                </span>
                <div
                  className="stat-label"
                  style={{
                    color: "#333333",
                    fontWeight: "600",
                    fontSize: "1.2rem",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                  }}
                >
                  Happy Customers
                </div>
              </div>
            </Col>
            <Col lg={3} md={6} className="mb-4">
              <div
                className="stat-item fade-in text-center"
                style={{
                  background: "#ffffff",
                  borderRadius: "15px",
                  padding: "50px 30px",
                  border: `2px solid #f8f9fa`,
                  boxShadow: "0 15px 50px rgba(52, 58, 64, 0.08)",
                  transition: "all 0.3s ease",
                  position: "relative",
                  overflow: "hidden",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.borderColor = "#dc3545";
                  e.currentTarget.style.boxShadow =
                    "0 25px 60px rgba(220, 53, 69, 0.15)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.borderColor = "#f8f9fa";
                  e.currentTarget.style.boxShadow =
                    "0 15px 50px rgba(52, 58, 64, 0.08)";
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "5px",
                    background: "#dc3545",
                  }}
                ></div>
                <span
                  className="stat-number"
                  style={{
                    fontSize: "4rem",
                    fontWeight: "900",
                    color: "#dc3545",
                    display: "block",
                    marginBottom: "15px",
                    lineHeight: "1",
                  }}
                >
                  1000+
                </span>
                <div
                  className="stat-label"
                  style={{
                    color: "#333333",
                    fontWeight: "600",
                    fontSize: "1.2rem",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                  }}
                >
                  Products Available
                </div>
              </div>
            </Col>
            <Col lg={3} md={6} className="mb-4">
              <div
                className="stat-item fade-in text-center"
                style={{
                  background: "#ffffff",
                  borderRadius: "15px",
                  padding: "50px 30px",
                  border: `2px solid #f8f9fa`,
                  boxShadow: "0 15px 50px rgba(52, 58, 64, 0.08)",
                  transition: "all 0.3s ease",
                  position: "relative",
                  overflow: "hidden",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.borderColor = "#495057";
                  e.currentTarget.style.boxShadow =
                    "0 25px 60px rgba(73, 80, 87, 0.15)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.borderColor = "#f8f9fa";
                  e.currentTarget.style.boxShadow =
                    "0 15px 50px rgba(52, 58, 64, 0.08)";
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "5px",
                    background: "#495057",
                  }}
                ></div>
                <span
                  className="stat-number"
                  style={{
                    fontSize: "4rem",
                    fontWeight: "900",
                    color: "#495057",
                    display: "block",
                    marginBottom: "15px",
                    lineHeight: "1",
                  }}
                >
                  5+
                </span>
                <div
                  className="stat-label"
                  style={{
                    color: "#333333",
                    fontWeight: "600",
                    fontSize: "1.2rem",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                  }}
                >
                  Years of Experience
                </div>
              </div>
            </Col>
            <Col lg={3} md={6} className="mb-4">
              <div
                className="stat-item fade-in text-center"
                style={{
                  background: "#ffffff",
                  borderRadius: "15px",
                  padding: "50px 30px",
                  border: `2px solid #f8f9fa`,
                  boxShadow: "0 15px 50px rgba(52, 58, 64, 0.08)",
                  transition: "all 0.3s ease",
                  position: "relative",
                  overflow: "hidden",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.borderColor = "#343a40";
                  e.currentTarget.style.boxShadow =
                    "0 25px 60px rgba(52, 58, 64, 0.15)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.borderColor = "#f8f9fa";
                  e.currentTarget.style.boxShadow =
                    "0 15px 50px rgba(52, 58, 64, 0.08)";
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "5px",
                    background: "#343a40",
                  }}
                ></div>
                <span
                  className="stat-number"
                  style={{
                    fontSize: "4rem",
                    fontWeight: "900",
                    color: "#343a40",
                    display: "block",
                    marginBottom: "15px",
                    lineHeight: "1",
                  }}
                >
                  24/7
                </span>
                <div
                  className="stat-label"
                  style={{
                    color: "#333333",
                    fontWeight: "600",
                    fontSize: "1.2rem",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                  }}
                >
                  Customer Support
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* CTA Section with Red Gradient */}
      <section
        className="cta-section section-padding"
        style={{
          background: `linear-gradient(135deg, #e63946 0%, #dc3545 100%)`,
          position: "relative",
          paddingTop: "100px",
          paddingBottom: "100px",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `radial-gradient(circle at 30% 40%, rgba(255,255,255,0.1) 0%, transparent 50%), 
                         radial-gradient(circle at 70% 60%, rgba(255,255,255,0.05) 0%, transparent 50%)`,
          }}
        ></div>
        <Container style={{ position: "relative", zIndex: 2 }}>
          <Row>
            <Col lg={12} className="text-center">
              <h2
                className="cta-title"
                style={{
                  color: "#ffffff",
                  fontSize: "3.5rem",
                  fontWeight: "900",
                  marginBottom: "2rem",
                  textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
                  lineHeight: "1.2",
                }}
              >
                Ready to Take Care of Your Health?
              </h2>
              <p
                className="cta-subtitle"
                style={{
                  color: "#ffffff",
                  fontSize: "1.3rem",
                  opacity: "0.95",
                  maxWidth: "700px",
                  margin: "0 auto 3rem auto",
                  textShadow: "1px 1px 2px rgba(0,0,0,0.2)",
                  lineHeight: "1.6",
                }}
              >
                Join thousands of satisfied customers who trust us with their
                healthcare needs.
              </p>
              <div className="d-flex gap-4 justify-content-center flex-wrap">
                <Button
                  as={Link}
                  to="/products"
                  size="lg"
                  style={{
                    background: "#ffffff",
                    color: "#e63946",
                    border: "none",
                    borderRadius: "8px",
                    padding: "18px 40px",
                    fontSize: "1.1rem",
                    fontWeight: "700",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    boxShadow: "0 8px 25px rgba(255,255,255,0.2)",
                    transition: "all 0.3s ease",
                  }}
                  onMouseOver={(e) => {
                    e.target.style.background = "#f8f9fa";
                    e.target.style.transform = "translateY(-3px)";
                    e.target.style.boxShadow =
                      "0 12px 35px rgba(255,255,255,0.3)";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = "#ffffff";
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow =
                      "0 8px 25px rgba(255,255,255,0.2)";
                  }}
                >
                  Start Shopping
                </Button>
                <Button
                  as={Link}
                  to="/contact"
                  size="lg"
                  style={{
                    background: "transparent",
                    color: "#ffffff",
                    border: "3px solid #ffffff",
                    borderRadius: "8px",
                    padding: "18px 40px",
                    fontSize: "1.1rem",
                    fontWeight: "700",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    transition: "all 0.3s ease",
                  }}
                  onMouseOver={(e) => {
                    e.target.style.background = "#ffffff";
                    e.target.style.color = "#e63946";
                    e.target.style.transform = "translateY(-3px)";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = "transparent";
                    e.target.style.color = "#ffffff";
                    e.target.style.transform = "translateY(0)";
                  }}
                >
                  Contact Us
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default Home;
