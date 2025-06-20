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
      {/* Hero Section with Modern Background */}
      <section
        className="hero-section"
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "linear-gradient(45deg, rgba(255,255,255,0.1) 25%, transparent 25%), linear-gradient(-45deg, rgba(255,255,255,0.1) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, rgba(255,255,255,0.1) 75%), linear-gradient(-45deg, transparent 75%, rgba(255,255,255,0.1) 75%)",
            backgroundSize: "30px 30px",
            backgroundPosition: "0 0, 0 15px, 15px -15px, -15px 0px",
          }}
        ></div>
        <Container style={{ position: "relative", zIndex: 2 }}>
          <Row className="align-items-center min-vh-75">
            <Col lg={6} className="slide-in-left">
              <h1
                className="hero-title text-white"
                style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.3)" }}
              >
                Your Health, <br />
                <span className="text-warning">Our Priority</span>
              </h1>
              <p
                className="hero-subtitle text-white"
                style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.2)" }}
              >
                Welcome to Hare Krishna Medical - your trusted partner in health
                and wellness. We provide quality medical products with a
                commitment to excellence and care for your family's health.
              </p>
              <div className="d-flex gap-3 flex-wrap">
                <Button
                  as={Link}
                  to="/products"
                  className="btn-medical-primary"
                  size="lg"
                  style={{
                    background: "linear-gradient(45deg, #ff6b6b, #ee5a24)",
                    border: "none",
                    boxShadow: "0 4px 15px rgba(255,107,107,0.4)",
                  }}
                >
                  Shop Products
                </Button>
                <Button
                  as={Link}
                  to="/about"
                  variant="outline-light"
                  size="lg"
                  style={{
                    borderColor: "rgba(255,255,255,0.8)",
                    color: "white",
                    backdropFilter: "blur(10px)",
                    background: "rgba(255,255,255,0.1)",
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
                    background: "rgba(255,255,255,0.1)",
                    backdropFilter: "blur(10px)",
                    borderRadius: "20px",
                    padding: "30px",
                    border: "1px solid rgba(255,255,255,0.2)",
                  }}
                >
                  <img
                    src="https://cdn.builder.io/api/v1/assets/ec4b3f82f1ac4275b8bfc1756fcac420/medical_logo-e586be?format=webp&width=800"
                    alt="Hare Krishna Medical"
                    className="img-fluid"
                    style={{ maxHeight: "400px" }}
                  />
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section with Modern Background */}
      <section
        className="section-padding"
        style={{
          background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.2) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(255,255,255,0.2) 0%, transparent 50%)",
          }}
        ></div>
        <Container style={{ position: "relative", zIndex: 2 }}>
          <Row>
            <Col lg={12} className="text-center mb-5">
              <h2
                className="section-title text-white"
                style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.3)" }}
              >
                Why Choose Us?
              </h2>
              <p
                className="section-subtitle text-white"
                style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.2)" }}
              >
                We are committed to providing the best healthcare solutions with
                quality products and exceptional service.
              </p>
            </Col>
          </Row>
          <Row>
            <Col lg={4} md={6} className="mb-4">
              <div
                className="service-card fade-in"
                style={{
                  background: "rgba(255,255,255,0.95)",
                  backdropFilter: "blur(10px)",
                  borderRadius: "15px",
                  padding: "30px",
                  border: "1px solid rgba(255,255,255,0.3)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                }}
              >
                <div
                  className="feature-icon"
                  style={{
                    background: "linear-gradient(45deg, #667eea, #764ba2)",
                    color: "white",
                    borderRadius: "50%",
                    width: "60px",
                    height: "60px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 20px",
                    fontSize: "24px",
                  }}
                >
                  <i className="bi bi-shield-check"></i>
                </div>
                <h4>Quality Assured</h4>
                <p>
                  All our products are sourced from trusted manufacturers and
                  undergo strict quality checks to ensure safety and efficacy.
                </p>
              </div>
            </Col>
            <Col lg={4} md={6} className="mb-4">
              <div
                className="service-card fade-in"
                style={{
                  background: "rgba(255,255,255,0.95)",
                  backdropFilter: "blur(10px)",
                  borderRadius: "15px",
                  padding: "30px",
                  border: "1px solid rgba(255,255,255,0.3)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                }}
              >
                <div
                  className="feature-icon"
                  style={{
                    background: "linear-gradient(45deg, #f093fb, #f5576c)",
                    color: "white",
                    borderRadius: "50%",
                    width: "60px",
                    height: "60px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 20px",
                    fontSize: "24px",
                  }}
                >
                  <i className="bi bi-truck"></i>
                </div>
                <h4>Fast Delivery</h4>
                <p>
                  Quick and reliable delivery service to ensure you get your
                  medical needs fulfilled on time, every time.
                </p>
              </div>
            </Col>
            <Col lg={4} md={6} className="mb-4">
              <div
                className="service-card fade-in"
                style={{
                  background: "rgba(255,255,255,0.95)",
                  backdropFilter: "blur(10px)",
                  borderRadius: "15px",
                  padding: "30px",
                  border: "1px solid rgba(255,255,255,0.3)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                }}
              >
                <div
                  className="feature-icon"
                  style={{
                    background: "linear-gradient(45deg, #ff6b6b, #ee5a24)",
                    color: "white",
                    borderRadius: "50%",
                    width: "60px",
                    height: "60px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 20px",
                    fontSize: "24px",
                  }}
                >
                  <i className="bi bi-headset"></i>
                </div>
                <h4>Expert Support</h4>
                <p>
                  Our knowledgeable team is always ready to help you with
                  product information and health-related queries.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Featured Products Section with Modern Background */}
      <section
        className="section-padding"
        style={{
          background: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              'url(\'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>\')',
            opacity: 0.5,
          }}
        ></div>
        <Container style={{ position: "relative", zIndex: 2 }}>
          <Row>
            <Col lg={12} className="text-center mb-5">
              <h2
                className="section-title"
                style={{
                  color: "#2c3e50",
                  textShadow: "1px 1px 2px rgba(255,255,255,0.5)",
                }}
              >
                Featured Products
              </h2>
              <p className="section-subtitle" style={{ color: "#34495e" }}>
                Discover our most popular and trusted medical products
              </p>
            </Col>
          </Row>
          <Row>
            {productsToShow.map((product, index) => (
              <Col lg={4} md={6} className="mb-4" key={product.id || index}>
                <Card
                  className="product-card fade-in"
                  style={{
                    background: "rgba(255,255,255,0.9)",
                    backdropFilter: "blur(10px)",
                    borderRadius: "15px",
                    border: "1px solid rgba(255,255,255,0.3)",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                    transition: "all 0.3s ease",
                    height: "100%",
                  }}
                >
                  <Link
                    to={`/products/${product.id}`}
                    className="text-decoration-none"
                  >
                    <Card.Img
                      variant="top"
                      src={product.image}
                      className="product-image"
                      alt={product.name}
                      style={{ borderRadius: "15px 15px 0 0" }}
                    />
                  </Link>
                  <Card.Body className="d-flex flex-column">
                    <Link
                      to={`/products/${product.id}`}
                      className="text-decoration-none"
                    >
                      <Card.Title className="product-title text-dark">
                        {product.name}
                      </Card.Title>
                    </Link>
                    <Card.Text className="flex-grow-1">
                      {product.description}
                    </Card.Text>
                    <div className="d-flex justify-content-between align-items-center mt-auto">
                      <span
                        className="product-price fw-bold"
                        style={{ color: "#e74c3c", fontSize: "18px" }}
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
                          background:
                            "linear-gradient(45deg, #667eea, #764ba2)",
                          border: "none",
                          borderRadius: "25px",
                          padding: "8px 20px",
                          boxShadow: "0 4px 15px rgba(102,126,234,0.4)",
                          transition: "all 0.3s ease",
                        }}
                        onMouseOver={(e) => {
                          e.target.style.transform = "translateY(-2px)";
                          e.target.style.boxShadow =
                            "0 6px 20px rgba(102,126,234,0.6)";
                        }}
                        onMouseOut={(e) => {
                          e.target.style.transform = "translateY(0)";
                          e.target.style.boxShadow =
                            "0 4px 15px rgba(102,126,234,0.4)";
                        }}
                      >
                        <i className="bi bi-cart-plus me-1"></i>
                        Add to Cart
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
          <Row>
            <Col lg={12} className="text-center mt-4">
              <Button
                as={Link}
                to="/products"
                size="lg"
                style={{
                  background: "linear-gradient(45deg, #667eea, #764ba2)",
                  border: "none",
                  borderRadius: "25px",
                  padding: "12px 30px",
                  boxShadow: "0 6px 20px rgba(102,126,234,0.4)",
                }}
              >
                View All Products
              </Button>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Stats Section with Modern Background */}
      <section
        className="stats-section section-padding"
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "linear-gradient(45deg, rgba(255,255,255,0.05) 25%, transparent 25%), linear-gradient(-45deg, rgba(255,255,255,0.05) 25%, transparent 25%)",
            backgroundSize: "60px 60px",
          }}
        ></div>
        <Container style={{ position: "relative", zIndex: 2 }}>
          <Row>
            <Col lg={3} md={6} className="mb-4">
              <div
                className="stat-item fade-in text-center"
                style={{
                  background: "rgba(255,255,255,0.1)",
                  backdropFilter: "blur(10px)",
                  borderRadius: "15px",
                  padding: "30px",
                  border: "1px solid rgba(255,255,255,0.2)",
                }}
              >
                <span
                  className="stat-number text-white"
                  style={{
                    fontSize: "3rem",
                    fontWeight: "bold",
                    textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
                  }}
                >
                  500+
                </span>
                <div
                  className="stat-label text-white"
                  style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.2)" }}
                >
                  Happy Customers
                </div>
              </div>
            </Col>
            <Col lg={3} md={6} className="mb-4">
              <div
                className="stat-item fade-in text-center"
                style={{
                  background: "rgba(255,255,255,0.1)",
                  backdropFilter: "blur(10px)",
                  borderRadius: "15px",
                  padding: "30px",
                  border: "1px solid rgba(255,255,255,0.2)",
                }}
              >
                <span
                  className="stat-number text-white"
                  style={{
                    fontSize: "3rem",
                    fontWeight: "bold",
                    textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
                  }}
                >
                  1000+
                </span>
                <div
                  className="stat-label text-white"
                  style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.2)" }}
                >
                  Products Available
                </div>
              </div>
            </Col>
            <Col lg={3} md={6} className="mb-4">
              <div
                className="stat-item fade-in text-center"
                style={{
                  background: "rgba(255,255,255,0.1)",
                  backdropFilter: "blur(10px)",
                  borderRadius: "15px",
                  padding: "30px",
                  border: "1px solid rgba(255,255,255,0.2)",
                }}
              >
                <span
                  className="stat-number text-white"
                  style={{
                    fontSize: "3rem",
                    fontWeight: "bold",
                    textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
                  }}
                >
                  5+
                </span>
                <div
                  className="stat-label text-white"
                  style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.2)" }}
                >
                  Years of Experience
                </div>
              </div>
            </Col>
            <Col lg={3} md={6} className="mb-4">
              <div
                className="stat-item fade-in text-center"
                style={{
                  background: "rgba(255,255,255,0.1)",
                  backdropFilter: "blur(10px)",
                  borderRadius: "15px",
                  padding: "30px",
                  border: "1px solid rgba(255,255,255,0.2)",
                }}
              >
                <span
                  className="stat-number text-white"
                  style={{
                    fontSize: "3rem",
                    fontWeight: "bold",
                    textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
                  }}
                >
                  24/7
                </span>
                <div
                  className="stat-label text-white"
                  style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.2)" }}
                >
                  Customer Support
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* CTA Section with Modern Background */}
      <section
        className="cta-section section-padding"
        style={{
          background: "linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "radial-gradient(circle at 30% 40%, rgba(255,255,255,0.2) 0%, transparent 50%), radial-gradient(circle at 70% 60%, rgba(255,255,255,0.1) 0%, transparent 50%)",
          }}
        ></div>
        <Container style={{ position: "relative", zIndex: 2 }}>
          <Row>
            <Col lg={12} className="text-center">
              <h2
                className="cta-title text-white"
                style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.3)" }}
              >
                Ready to Take Care of Your Health?
              </h2>
              <p
                className="cta-subtitle text-white"
                style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.2)" }}
              >
                Join thousands of satisfied customers who trust us with their
                healthcare needs.
              </p>
              <div className="d-flex gap-3 justify-content-center flex-wrap">
                <Button
                  as={Link}
                  to="/products"
                  size="lg"
                  style={{
                    background: "rgba(255,255,255,0.9)",
                    color: "#ff6b6b",
                    border: "none",
                    borderRadius: "25px",
                    padding: "12px 30px",
                    fontWeight: "bold",
                    boxShadow: "0 6px 20px rgba(255,255,255,0.3)",
                  }}
                >
                  Start Shopping
                </Button>
                <Button
                  as={Link}
                  to="/contact"
                  variant="outline-light"
                  size="lg"
                  style={{
                    borderColor: "rgba(255,255,255,0.8)",
                    color: "white",
                    borderRadius: "25px",
                    padding: "12px 30px",
                    backdropFilter: "blur(10px)",
                    background: "rgba(255,255,255,0.1)",
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
