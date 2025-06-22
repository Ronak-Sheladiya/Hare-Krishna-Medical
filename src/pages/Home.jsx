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

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { featuredProducts } = useSelector((state) => state.products);

  // Mock featured products - 4 products for single line
  const defaultFeaturedProducts = [
    {
      id: 1,
      name: "Paracetamol Tablets",
      company: "Hare Krishna Pharma",
      price: 25.99,
      originalPrice: 30.99,
      image:
        "https://via.placeholder.com/300x250/e6e6e6/666666?text=Medicine+1",
      description: "Effective pain relief and fever reducer",
      inStock: true,
    },
    {
      id: 2,
      name: "Vitamin D3 Capsules",
      company: "Health Plus",
      price: 45.5,
      originalPrice: 55.0,
      image:
        "https://via.placeholder.com/300x250/e6e6e6/666666?text=Medicine+2",
      description: "Essential vitamin for bone health",
      inStock: true,
    },
    {
      id: 3,
      name: "Cough Syrup",
      company: "Wellness Care",
      price: 35.75,
      originalPrice: 42.0,
      image:
        "https://via.placeholder.com/300x250/e6e6e6/666666?text=Medicine+3",
      description: "Natural cough relief formula",
      inStock: true,
    },
    {
      id: 4,
      name: "Antiseptic Liquid",
      company: "Safe Guard",
      price: 28.0,
      originalPrice: 35.0,
      image:
        "https://via.placeholder.com/300x250/e6e6e6/666666?text=Medicine+4",
      description: "Multipurpose antiseptic for wound care",
      inStock: true,
    },
  ];

  const productsToShow =
    featuredProducts.length > 0 ? featuredProducts : defaultFeaturedProducts;

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
    // In a real app, this would fetch featured products from API
  }, [dispatch]);

  return (
    <div className="fade-in">
      {/* Hero Section with Product Page Theme */}
      <section
        className="hero-section"
        style={{
          background: "linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)",
          paddingTop: "60px",
          paddingBottom: "80px",
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
              "repeating-linear-gradient(45deg, transparent, transparent 100px, rgba(230, 57, 70, 0.02) 100px, rgba(230, 57, 70, 0.02) 200px)",
          }}
        ></div>

        <Container style={{ position: "relative", zIndex: 2 }}>
          <Row className="align-items-center">
            <Col lg={6} className="mb-4">
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

            <Col lg={6}>
              <div className="hero-image text-center">
                <div
                  style={{
                    background: "transparent",
                    borderRadius: "20px",
                    padding: "40px",
                  }}
                >
                  <img
                    src="https://cdn.builder.io/api/v1/assets/ec4b3f82f1ac4275b8bfc1756fcac420/medical_logo-e586be?format=webp&width=800"
                    alt="Hare Krishna Medical"
                    className="img-fluid"
                    style={{ maxHeight: "300px" }}
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
            {productsToShow.map((product, index) => (
              <Col lg={3} md={6} className="mb-4" key={product.id || index}>
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
                  onClick={() => handleCardClick(product.id)}
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
                      src={product.image}
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
                      by {product.company}
                    </p>
                    <p
                      style={{
                        color: "#495057",
                        fontSize: "14px",
                        marginBottom: "20px",
                        lineHeight: "1.5",
                      }}
                    >
                      {product.description}
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
                          ₹{product.price}
                        </span>
                        {product.originalPrice && (
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
                        disabled={!product.inStock}
                        style={{
                          background: product.inStock ? "#e63946" : "#495057",
                          border: "none",
                          borderRadius: "6px",
                          padding: "8px 16px",
                          fontSize: "14px",
                          fontWeight: "600",
                        }}
                      >
                        <i className="bi bi-cart-plus me-1"></i>
                        {product.inStock ? "Add to Cart" : "Out of Stock"}
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
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
