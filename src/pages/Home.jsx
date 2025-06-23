import React, { useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  Badge,
  InputGroup,
  Form,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../store/slices/cartSlice";
import { setFeaturedProducts } from "../store/slices/productsSlice";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { featuredProducts } = useSelector((state) => state.products);

  // Fetch featured products from API
  const API_BASE_URL =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  const fetchFeaturedProducts = async () => {
    try {
      // Add timeout to fetch request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      const response = await fetch(
        `${API_BASE_URL}/api/products/public?featured=true&limit=4`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          signal: controller.signal,
        },
      );

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          dispatch(setFeaturedProducts(data.data));
        }
      } else {
        console.warn("API response not OK:", response.status);
        // Set empty array to show empty state
        dispatch(setFeaturedProducts([]));
      }
    } catch (error) {
      // Handle different types of errors
      if (error.name === "AbortError") {
        console.warn("Featured products fetch timed out");
      } else if (error.message === "Failed to fetch") {
        console.warn("Backend API not available - showing empty state");
      } else {
        console.warn("Error fetching featured products:", error);
      }

      // Always set empty array so component doesn't crash
      dispatch(setFeaturedProducts([]));
    }
  };

  const productsToShow = featuredProducts.length > 0 ? featuredProducts : [];

  const handleAddToCart = (e, product) => {
    e.stopPropagation(); // Prevent card click navigation
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    };
    dispatch(addToCart(cartItem));
  };

  const handleCardClick = (productId) => {
    navigate(`/products/${productId}`);
  };

  useEffect(() => {
    fetchFeaturedProducts();
  }, [dispatch]);

  return (
    <div className="fade-in">
      {/* Hero Section with Product Page Theme */}
      <section
        className="hero-section"
        style={{
          background:
            "linear-gradient(135deg, #e9ecef 0%, #f8f9fa 50%, #ffffff 100%)",
          minHeight: "100vh",
          paddingTop: "60px",
          paddingBottom: "80px",
          position: "relative",
          display: "flex",
          alignItems: "center",
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
              "repeating-linear-gradient(45deg, transparent, transparent 100px, rgba(230, 57, 70, 0.05) 100px, rgba(230, 57, 70, 0.05) 200px)",
          }}
        ></div>

        <Container style={{ position: "relative", zIndex: 2 }}>
          <Row className="align-items-center">
            <Col lg={7} className="mb-4" style={{ paddingRight: "2rem" }}>
              <div className="hero-content">
                <h1
                  style={{
                    color: "#333333",
                    fontSize: "3.5rem",
                    fontWeight: "800",
                    lineHeight: "1.1",
                    marginBottom: "24px",
                  }}
                >
                  Your Health, <br />
                  <span style={{ color: "#e63946" }}>Our Priority</span>
                </h1>
                <p
                  style={{
                    color: "#495057",
                    fontSize: "1.2rem",
                    lineHeight: "1.6",
                    marginBottom: "32px",
                    maxWidth: "500px",
                  }}
                >
                  Quality medical products with professional service. Get
                  authentic medicines and healthcare products delivered to your
                  doorstep.
                </p>

                <div className="hero-actions d-flex gap-3 flex-wrap">
                  <Button
                    as={Link}
                    to="/products"
                    size="lg"
                    style={{
                      background: "#e63946",
                      border: "none",
                      borderRadius: "8px",
                      padding: "14px 28px",
                      fontSize: "16px",
                      fontWeight: "600",
                      boxShadow: "0 4px 12px rgba(230, 57, 70, 0.3)",
                      transition: "all 0.3s ease",
                    }}
                    onMouseOver={(e) => {
                      e.target.style.background = "#343a40";
                    }}
                    onMouseOut={(e) => {
                      e.target.style.background = "#e63946";
                    }}
                  >
                    Shop Now
                  </Button>
                  <Button
                    as={Link}
                    to="/about"
                    variant="outline-secondary"
                    size="lg"
                    style={{
                      color: "#e63946",
                      borderColor: "#e63946",
                      borderRadius: "8px",
                      padding: "14px 28px",
                      fontSize: "16px",
                      fontWeight: "600",
                      transition: "all 0.3s ease",
                    }}
                    onMouseOver={(e) => {
                      e.target.style.background = "#343a40";
                      e.target.style.borderColor = "#343a40";
                      e.target.style.color = "white";
                    }}
                    onMouseOut={(e) => {
                      e.target.style.background = "transparent";
                      e.target.style.borderColor = "#e63946";
                      e.target.style.color = "#e63946";
                    }}
                  >
                    Learn More
                  </Button>
                </div>
              </div>
            </Col>

            <Col lg={5}>
              <div className="hero-image text-center">
                <div
                  style={{
                    background: "transparent",
                    borderRadius: "20px",
                    padding: "20px",
                    paddingLeft: "0px",
                  }}
                >
                  <img
                    src="https://cdn.builder.io/api/v1/assets/ec4b3f82f1ac4275b8bfc1756fcac420/medical_logo-e586be?format=webp&width=800"
                    alt="Hare Krishna Medical"
                    className="img-fluid"
                    style={{
                      maxHeight: "400px",
                      filter: "brightness(1.1) contrast(1.2)",
                    }}
                  />
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Featured Products Section - 4 Cards in Single Line */}
      <section
        className="section-padding"
        style={{
          background: "#f8f9fa",
          paddingTop: "80px",
          paddingBottom: "80px",
        }}
      >
        <Container>
          <Row className="mb-5">
            <Col lg={8}>
              <h2
                style={{
                  color: "#333333",
                  fontSize: "2.5rem",
                  fontWeight: "700",
                  marginBottom: "16px",
                }}
              >
                Featured Products
              </h2>
              <p
                style={{
                  color: "#495057",
                  fontSize: "18px",
                }}
              >
                Our most popular and trusted medical products
              </p>
            </Col>
            <Col lg={4} className="text-end">
              <Button
                as={Link}
                to="/products"
                variant="outline-primary"
                style={{
                  color: "#e63946",
                  borderColor: "#e63946",
                  borderRadius: "8px",
                  padding: "12px 24px",
                  fontWeight: "600",
                  transition: "all 0.3s ease",
                }}
                onMouseOver={(e) => {
                  e.target.style.background = "#343a40";
                  e.target.style.borderColor = "#343a40";
                  e.target.style.color = "white";
                }}
                onMouseOut={(e) => {
                  e.target.style.background = "transparent";
                  e.target.style.borderColor = "#e63946";
                  e.target.style.color = "#e63946";
                }}
              >
                View All Products
              </Button>
            </Col>
          </Row>

          <Row>
            {productsToShow.length > 0 ? (
              productsToShow.map((product, index) => (
                <Col
                  lg={3}
                  md={6}
                  className="mb-4"
                  key={product._id || product.id || index}
                >
                  <Card
                    className="h-100"
                    style={{
                      border: "2px solid #ffffff",
                      borderRadius: "12px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                      transition: "all 0.3s ease",
                      overflow: "hidden",
                      cursor: "pointer",
                    }}
                    onClick={() => handleCardClick(product._id || product.id)}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = "translateY(-8px)";
                      e.currentTarget.style.boxShadow =
                        "0 12px 30px rgba(230, 57, 70, 0.15)";
                      e.currentTarget.style.borderColor = "#e63946";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow =
                        "0 4px 12px rgba(0,0,0,0.08)";
                      e.currentTarget.style.borderColor = "#ffffff";
                    }}
                  >
                    <div style={{ position: "relative" }}>
                      <Card.Img
                        variant="top"
                        src={
                          product.images?.[0] ||
                          product.image ||
                          "https://via.placeholder.com/300x200/e6e6e6/666666?text=No+Image"
                        }
                        style={{ height: "200px", objectFit: "cover" }}
                      />
                    </div>

                    <Card.Body style={{ padding: "24px" }}>
                      <h5
                        style={{
                          color: "#333333",
                          fontWeight: "600",
                          fontSize: "18px",
                          marginBottom: "8px",
                        }}
                      >
                        {product.name}
                      </h5>
                      <p
                        style={{
                          color: "#495057",
                          fontSize: "14px",
                          marginBottom: "12px",
                        }}
                      >
                        by{" "}
                        {product.company ||
                          product.brand ||
                          "Hare Krishna Medical"}
                      </p>
                      <p
                        style={{
                          color: "#495057",
                          fontSize: "14px",
                          marginBottom: "20px",
                          lineHeight: "1.5",
                        }}
                      >
                        {product.description || "Quality medical product"}
                      </p>

                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <span
                            style={{
                              color: "#e63946",
                              fontSize: "20px",
                              fontWeight: "700",
                            }}
                          >
                            ₹{product.price || 0}
                          </span>
                          {product.originalPrice &&
                            product.originalPrice > product.price && (
                              <span
                                style={{
                                  color: "#495057",
                                  fontSize: "14px",
                                  textDecoration: "line-through",
                                  marginLeft: "8px",
                                }}
                              >
                                ₹{product.originalPrice}
                              </span>
                            )}
                        </div>
                        <Button
                          onClick={(e) => handleAddToCart(e, product)}
                          disabled={!product.inStock && product.stock <= 0}
                          style={{
                            background:
                              product.inStock || product.stock > 0
                                ? "#e63946"
                                : "#495057",
                            border: "none",
                            borderRadius: "6px",
                            padding: "8px 16px",
                            fontSize: "14px",
                            fontWeight: "600",
                          }}
                        >
                          <i className="bi bi-cart-plus me-1"></i>
                          {product.inStock || product.stock > 0
                            ? "Add to Cart"
                            : "Out of Stock"}
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            ) : (
              <Col lg={12} className="text-center py-5">
                <div style={{ color: "#6c757d" }}>
                  <i
                    className="bi bi-box"
                    style={{
                      fontSize: "3rem",
                      marginBottom: "1rem",
                      display: "block",
                    }}
                  ></i>
                  <h5>No Featured Products Available</h5>
                  <p>
                    Featured products will appear here when admin adds them.
                  </p>
                  <Button
                    as={Link}
                    to="/products"
                    variant="outline-primary"
                    style={{
                      color: "#e63946",
                      borderColor: "#e63946",
                    }}
                  >
                    Browse All Products
                  </Button>
                </div>
              </Col>
            )}
          </Row>
        </Container>
      </section>

      {/* Why Choose Us Section */}
      <section
        className="section-padding"
        style={{
          background: "#ffffff",
          paddingTop: "80px",
          paddingBottom: "80px",
        }}
      >
        <Container>
          <Row className="mb-5">
            <Col lg={12} className="text-center">
              <h2
                style={{
                  color: "#333333",
                  fontSize: "2.5rem",
                  fontWeight: "700",
                  marginBottom: "16px",
                }}
              >
                Why Choose Us?
              </h2>
              <p
                style={{
                  color: "#495057",
                  fontSize: "18px",
                  maxWidth: "600px",
                  margin: "0 auto",
                }}
              >
                We provide quality healthcare solutions with professional
                service
              </p>
            </Col>
          </Row>

          <Row>
            {[
              {
                icon: "bi-shield-check",
                title: "Quality Assured",
                description: "All products undergo strict quality checks",
                color: "#e63946",
              },
              {
                icon: "bi-truck",
                title: "Fast Delivery",
                description: "Quick and reliable delivery service",
                color: "#e63946",
              },
              {
                icon: "bi-headset",
                title: "24/7 Support",
                description: "Expert support whenever you need it",
                color: "#e63946",
              },
              {
                icon: "bi-award",
                title: "Trusted Brand",
                description: "Years of experience in healthcare",
                color: "#e63946",
              },
            ].map((feature, index) => (
              <Col lg={3} md={6} className="mb-4" key={index}>
                <div
                  className="text-center"
                  style={{
                    padding: "40px 20px",
                    borderRadius: "12px",
                    border: "2px solid #f8f9fa",
                    height: "100%",
                    transition: "all 0.3s ease",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = "#343a40";
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow =
                      "0 8px 25px rgba(52, 58, 64, 0.2)";
                    // Change icon background color on hover
                    const iconDiv =
                      e.currentTarget.querySelector(".feature-icon");
                    if (iconDiv) {
                      iconDiv.style.background =
                        "linear-gradient(135deg, #343a40, #495057)";
                    }
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = "#f8f9fa";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                    // Restore icon background color
                    const iconDiv =
                      e.currentTarget.querySelector(".feature-icon");
                    if (iconDiv) {
                      iconDiv.style.background =
                        "linear-gradient(135deg, #e63946, #dc3545)";
                    }
                  }}
                >
                  <div
                    className="feature-icon"
                    style={{
                      width: "70px",
                      height: "70px",
                      background: `linear-gradient(135deg, ${feature.color}, ${feature.color}dd)`,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 24px",
                      color: "white",
                      fontSize: "28px",
                      transition: "all 0.3s ease",
                    }}
                  >
                    <i className={feature.icon}></i>
                  </div>
                  <h5
                    style={{
                      color: "#333333",
                      fontWeight: "600",
                      marginBottom: "12px",
                    }}
                  >
                    {feature.title}
                  </h5>
                  <p
                    style={{
                      color: "#495057",
                      fontSize: "14px",
                      lineHeight: "1.5",
                    }}
                  >
                    {feature.description}
                  </p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* CTA Section */}
      <section
        className="section-padding"
        style={{
          background: "linear-gradient(135deg, #343a40 0%, #495057 100%)",
          paddingTop: "80px",
          paddingBottom: "80px",
        }}
      >
        <Container>
          <Row>
            <Col lg={12} className="text-center">
              <h2
                style={{
                  color: "#ffffff",
                  fontSize: "3rem",
                  fontWeight: "700",
                  marginBottom: "24px",
                }}
              >
                Ready to Take Care of Your Health?
              </h2>
              <p
                style={{
                  color: "#ffffff",
                  fontSize: "18px",
                  opacity: "0.9",
                  marginBottom: "40px",
                  maxWidth: "600px",
                  margin: "0 auto 40px",
                }}
              >
                Join thousands of satisfied customers who trust us with their
                healthcare needs
              </p>
              <div className="d-flex gap-3 justify-content-center flex-wrap">
                <Button
                  as={Link}
                  to="/products"
                  size="lg"
                  style={{
                    background: "#e63946",
                    border: "none",
                    borderRadius: "8px",
                    padding: "16px 32px",
                    fontSize: "16px",
                    fontWeight: "600",
                    transition: "all 0.3s ease",
                  }}
                  onMouseOver={(e) => {
                    e.target.style.background = "#343a40";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = "#e63946";
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
                    borderRadius: "8px",
                    padding: "16px 32px",
                    fontSize: "16px",
                    fontWeight: "600",
                    transition: "all 0.3s ease",
                  }}
                  onMouseOver={(e) => {
                    e.target.style.background = "#343a40";
                    e.target.style.borderColor = "#343a40";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = "transparent";
                    e.target.style.borderColor = "white";
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
