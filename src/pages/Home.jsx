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
      {/* Hero Section with Professional Medical Theme */}
      <section
        className="hero-section"
        style={{
          background: "linear-gradient(135deg, #2c5aa0 0%, #1e3f73 100%)",
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
              "radial-gradient(circle at 20% 30%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.08) 0%, transparent 50%)",
          }}
        ></div>
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              'url(\'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="medical-pattern" width="50" height="50" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="rgba(255,255,255,0.1)"/><path d="M20 25h10M25 20v10" stroke="rgba(255,255,255,0.05)" stroke-width="0.5"/></pattern></defs><rect width="100" height="100" fill="url(%23medical-pattern)"/></svg>\')',
            opacity: 0.3,
          }}
        ></div>
        <Container style={{ position: "relative", zIndex: 2 }}>
          <Row className="align-items-center min-vh-75">
            <Col lg={6} className="slide-in-left">
              <h1
                className="hero-title text-white"
                style={{
                  textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
                  fontSize: "3.5rem",
                  fontWeight: "700",
                }}
              >
                Your Health, <br />
                <span style={{ color: "#a8d8f0" }}>Our Priority</span>
              </h1>
              <p
                className="hero-subtitle text-white"
                style={{
                  textShadow: "1px 1px 2px rgba(0,0,0,0.2)",
                  fontSize: "1.2rem",
                  opacity: "0.95",
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
                    background: "linear-gradient(45deg, #28a745, #20c997)",
                    border: "none",
                    borderRadius: "25px",
                    padding: "12px 30px",
                    boxShadow: "0 4px 15px rgba(40,167,69,0.4)",
                    fontWeight: "600",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
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
                    borderRadius: "25px",
                    padding: "12px 30px",
                    fontWeight: "600",
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
                    background: "rgba(255,255,255,0.15)",
                    backdropFilter: "blur(15px)",
                    borderRadius: "30px",
                    padding: "40px",
                    border: "1px solid rgba(255,255,255,0.2)",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                  }}
                >
                  <img
                    src="https://cdn.builder.io/api/v1/assets/ec4b3f82f1ac4275b8bfc1756fcac420/medical_logo-e586be?format=webp&width=800"
                    alt="Hare Krishna Medical"
                    className="img-fluid"
                    style={{ maxHeight: "350px", filter: "brightness(1.1)" }}
                  />
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section with Professional Theme */}
      <section
        className="section-padding"
        style={{
          background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
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
              "repeating-linear-gradient(45deg, transparent, transparent 50px, rgba(44, 90, 160, 0.03) 50px, rgba(44, 90, 160, 0.03) 100px)",
          }}
        ></div>
        <Container style={{ position: "relative", zIndex: 2 }}>
          <Row>
            <Col lg={12} className="text-center mb-5">
              <h2
                className="section-title"
                style={{
                  color: "#2c5aa0",
                  fontWeight: "700",
                  fontSize: "2.5rem",
                  marginBottom: "1rem",
                }}
              >
                Why Choose Us?
              </h2>
              <p
                className="section-subtitle"
                style={{
                  color: "#6c757d",
                  fontSize: "1.1rem",
                  maxWidth: "600px",
                  margin: "0 auto",
                }}
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
                  background:
                    "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
                  backdropFilter: "blur(10px)",
                  borderRadius: "20px",
                  padding: "40px 30px",
                  border: "1px solid rgba(44, 90, 160, 0.1)",
                  boxShadow: "0 10px 40px rgba(44, 90, 160, 0.08)",
                  height: "100%",
                  transition: "all 0.3s ease",
                }}
              >
                <div
                  className="feature-icon"
                  style={{
                    background: "linear-gradient(135deg, #2c5aa0, #4a73b8)",
                    color: "white",
                    borderRadius: "50%",
                    width: "70px",
                    height: "70px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 25px",
                    fontSize: "28px",
                    boxShadow: "0 8px 25px rgba(44, 90, 160, 0.3)",
                  }}
                >
                  <i className="bi bi-shield-check"></i>
                </div>
                <h4
                  style={{
                    color: "#2c5aa0",
                    fontWeight: "600",
                    marginBottom: "15px",
                  }}
                >
                  Quality Assured
                </h4>
                <p style={{ color: "#6c757d", lineHeight: "1.6" }}>
                  All our products are sourced from trusted manufacturers and
                  undergo strict quality checks to ensure safety and efficacy.
                </p>
              </div>
            </Col>
            <Col lg={4} md={6} className="mb-4">
              <div
                className="service-card fade-in"
                style={{
                  background:
                    "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
                  backdropFilter: "blur(10px)",
                  borderRadius: "20px",
                  padding: "40px 30px",
                  border: "1px solid rgba(40, 167, 69, 0.1)",
                  boxShadow: "0 10px 40px rgba(40, 167, 69, 0.08)",
                  height: "100%",
                  transition: "all 0.3s ease",
                }}
              >
                <div
                  className="feature-icon"
                  style={{
                    background: "linear-gradient(135deg, #28a745, #20c997)",
                    color: "white",
                    borderRadius: "50%",
                    width: "70px",
                    height: "70px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 25px",
                    fontSize: "28px",
                    boxShadow: "0 8px 25px rgba(40, 167, 69, 0.3)",
                  }}
                >
                  <i className="bi bi-truck"></i>
                </div>
                <h4
                  style={{
                    color: "#28a745",
                    fontWeight: "600",
                    marginBottom: "15px",
                  }}
                >
                  Fast Delivery
                </h4>
                <p style={{ color: "#6c757d", lineHeight: "1.6" }}>
                  Quick and reliable delivery service to ensure you get your
                  medical needs fulfilled on time, every time.
                </p>
              </div>
            </Col>
            <Col lg={4} md={6} className="mb-4">
              <div
                className="service-card fade-in"
                style={{
                  background:
                    "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
                  backdropFilter: "blur(10px)",
                  borderRadius: "20px",
                  padding: "40px 30px",
                  border: "1px solid rgba(108, 117, 125, 0.1)",
                  boxShadow: "0 10px 40px rgba(108, 117, 125, 0.08)",
                  height: "100%",
                  transition: "all 0.3s ease",
                }}
              >
                <div
                  className="feature-icon"
                  style={{
                    background: "linear-gradient(135deg, #6c757d, #495057)",
                    color: "white",
                    borderRadius: "50%",
                    width: "70px",
                    height: "70px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 25px",
                    fontSize: "28px",
                    boxShadow: "0 8px 25px rgba(108, 117, 125, 0.3)",
                  }}
                >
                  <i className="bi bi-headset"></i>
                </div>
                <h4
                  style={{
                    color: "#6c757d",
                    fontWeight: "600",
                    marginBottom: "15px",
                  }}
                >
                  Expert Support
                </h4>
                <p style={{ color: "#6c757d", lineHeight: "1.6" }}>
                  Our knowledgeable team is always ready to help you with
                  product information and health-related queries.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Featured Products Section with Medical Theme */}
      <section
        className="section-padding"
        style={{
          background: "linear-gradient(135deg, #2c5aa0 0%, #1e3f73 100%)",
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
            <Col lg={12} className="text-center mb-5">
              <h2
                className="section-title text-white"
                style={{
                  textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
                  fontWeight: "700",
                  fontSize: "2.5rem",
                  marginBottom: "1rem",
                }}
              >
                Featured Products
              </h2>
              <p
                className="section-subtitle text-white"
                style={{
                  textShadow: "1px 1px 2px rgba(0,0,0,0.2)",
                  opacity: "0.9",
                  fontSize: "1.1rem",
                }}
              >
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
                    background:
                      "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
                    backdropFilter: "blur(15px)",
                    borderRadius: "20px",
                    border: "1px solid rgba(255,255,255,0.8)",
                    boxShadow: "0 15px 45px rgba(0,0,0,0.1)",
                    transition: "all 0.3s ease",
                    height: "100%",
                    overflow: "hidden",
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
                      style={{
                        borderRadius: "20px 20px 0 0",
                        height: "200px",
                        objectFit: "cover",
                      }}
                    />
                  </Link>
                  <Card.Body
                    className="d-flex flex-column"
                    style={{ padding: "25px" }}
                  >
                    <Link
                      to={`/products/${product.id}`}
                      className="text-decoration-none"
                    >
                      <Card.Title
                        className="product-title"
                        style={{
                          color: "#2c5aa0",
                          fontWeight: "600",
                          fontSize: "1.2rem",
                        }}
                      >
                        {product.name}
                      </Card.Title>
                    </Link>
                    <Card.Text
                      className="flex-grow-1"
                      style={{
                        color: "#6c757d",
                        lineHeight: "1.5",
                      }}
                    >
                      {product.description}
                    </Card.Text>
                    <div className="d-flex justify-content-between align-items-center mt-auto">
                      <span
                        className="product-price fw-bold"
                        style={{
                          color: "#28a745",
                          fontSize: "1.4rem",
                          fontWeight: "700",
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
                          background:
                            "linear-gradient(135deg, #2c5aa0, #4a73b8)",
                          border: "none",
                          borderRadius: "25px",
                          padding: "10px 20px",
                          boxShadow: "0 4px 15px rgba(44, 90, 160, 0.4)",
                          transition: "all 0.3s ease",
                          fontWeight: "600",
                        }}
                        onMouseOver={(e) => {
                          e.target.style.transform = "translateY(-2px)";
                          e.target.style.boxShadow =
                            "0 6px 20px rgba(44, 90, 160, 0.6)";
                        }}
                        onMouseOut={(e) => {
                          e.target.style.transform = "translateY(0)";
                          e.target.style.boxShadow =
                            "0 4px 15px rgba(44, 90, 160, 0.4)";
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
                  background: "linear-gradient(135deg, #28a745, #20c997)",
                  border: "none",
                  borderRadius: "25px",
                  padding: "15px 40px",
                  boxShadow: "0 6px 20px rgba(40, 167, 69, 0.4)",
                  fontWeight: "600",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                View All Products
              </Button>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Stats Section with Professional Theme */}
      <section
        className="stats-section section-padding"
        style={{
          background: "linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)",
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
              "radial-gradient(circle at 25% 25%, rgba(44, 90, 160, 0.05) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(40, 167, 69, 0.05) 0%, transparent 50%)",
          }}
        ></div>
        <Container style={{ position: "relative", zIndex: 2 }}>
          <Row>
            <Col lg={3} md={6} className="mb-4">
              <div
                className="stat-item fade-in text-center"
                style={{
                  background:
                    "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
                  backdropFilter: "blur(10px)",
                  borderRadius: "20px",
                  padding: "40px 20px",
                  border: "1px solid rgba(44, 90, 160, 0.1)",
                  boxShadow: "0 10px 30px rgba(44, 90, 160, 0.1)",
                  transition: "all 0.3s ease",
                }}
              >
                <span
                  className="stat-number"
                  style={{
                    fontSize: "3.5rem",
                    fontWeight: "800",
                    color: "#2c5aa0",
                    display: "block",
                    marginBottom: "10px",
                  }}
                >
                  500+
                </span>
                <div
                  className="stat-label"
                  style={{
                    color: "#6c757d",
                    fontWeight: "600",
                    fontSize: "1.1rem",
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
                  background:
                    "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
                  backdropFilter: "blur(10px)",
                  borderRadius: "20px",
                  padding: "40px 20px",
                  border: "1px solid rgba(40, 167, 69, 0.1)",
                  boxShadow: "0 10px 30px rgba(40, 167, 69, 0.1)",
                  transition: "all 0.3s ease",
                }}
              >
                <span
                  className="stat-number"
                  style={{
                    fontSize: "3.5rem",
                    fontWeight: "800",
                    color: "#28a745",
                    display: "block",
                    marginBottom: "10px",
                  }}
                >
                  1000+
                </span>
                <div
                  className="stat-label"
                  style={{
                    color: "#6c757d",
                    fontWeight: "600",
                    fontSize: "1.1rem",
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
                  background:
                    "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
                  backdropFilter: "blur(10px)",
                  borderRadius: "20px",
                  padding: "40px 20px",
                  border: "1px solid rgba(108, 117, 125, 0.1)",
                  boxShadow: "0 10px 30px rgba(108, 117, 125, 0.1)",
                  transition: "all 0.3s ease",
                }}
              >
                <span
                  className="stat-number"
                  style={{
                    fontSize: "3.5rem",
                    fontWeight: "800",
                    color: "#6c757d",
                    display: "block",
                    marginBottom: "10px",
                  }}
                >
                  5+
                </span>
                <div
                  className="stat-label"
                  style={{
                    color: "#6c757d",
                    fontWeight: "600",
                    fontSize: "1.1rem",
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
                  background:
                    "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
                  backdropFilter: "blur(10px)",
                  borderRadius: "20px",
                  padding: "40px 20px",
                  border: "1px solid rgba(44, 90, 160, 0.1)",
                  boxShadow: "0 10px 30px rgba(44, 90, 160, 0.1)",
                  transition: "all 0.3s ease",
                }}
              >
                <span
                  className="stat-number"
                  style={{
                    fontSize: "3.5rem",
                    fontWeight: "800",
                    color: "#2c5aa0",
                    display: "block",
                    marginBottom: "10px",
                  }}
                >
                  24/7
                </span>
                <div
                  className="stat-label"
                  style={{
                    color: "#6c757d",
                    fontWeight: "600",
                    fontSize: "1.1rem",
                  }}
                >
                  Customer Support
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* CTA Section with Professional Medical Theme */}
      <section
        className="cta-section section-padding"
        style={{
          background: "linear-gradient(135deg, #28a745 0%, #20c997 100%)",
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
              "radial-gradient(circle at 30% 40%, rgba(255,255,255,0.15) 0%, transparent 50%), radial-gradient(circle at 70% 60%, rgba(255,255,255,0.1) 0%, transparent 50%)",
          }}
        ></div>
        <Container style={{ position: "relative", zIndex: 2 }}>
          <Row>
            <Col lg={12} className="text-center">
              <h2
                className="cta-title text-white"
                style={{
                  textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
                  fontWeight: "700",
                  fontSize: "2.8rem",
                  marginBottom: "1.5rem",
                }}
              >
                Ready to Take Care of Your Health?
              </h2>
              <p
                className="cta-subtitle text-white"
                style={{
                  textShadow: "1px 1px 2px rgba(0,0,0,0.2)",
                  fontSize: "1.2rem",
                  opacity: "0.95",
                  maxWidth: "600px",
                  margin: "0 auto 2rem auto",
                }}
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
                    background: "rgba(255,255,255,0.95)",
                    color: "#28a745",
                    border: "none",
                    borderRadius: "25px",
                    padding: "15px 40px",
                    fontWeight: "700",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
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
                    padding: "15px 40px",
                    backdropFilter: "blur(10px)",
                    background: "rgba(255,255,255,0.15)",
                    fontWeight: "600",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
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
