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

    // Show success message (you can enhance this with a toast notification)
    alert(`${product.name} added to cart!`);
  };

  useEffect(() => {
    // In a real app, this would fetch featured products from API
  }, [dispatch]);

  return (
    <div className="fade-in">
      {/* Hero Section */}
      <section className="hero-section">
        <Container>
          <Row className="align-items-center min-vh-75">
            <Col lg={6} className="slide-in-left">
              <h1 className="hero-title">
                Your Health, <br />
                <span className="text-medical-red">Our Priority</span>
              </h1>
              <p className="hero-subtitle">
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
                >
                  Shop Products
                </Button>
                <Button
                  as={Link}
                  to="/about"
                  variant="outline-secondary"
                  size="lg"
                  className="btn-medical-outline"
                >
                  Learn More
                </Button>
              </div>
            </Col>
            <Col lg={6} className="slide-in-right">
              <div className="text-center">
                <img
                  src="https://cdn.builder.io/api/v1/assets/ec4b3f82f1ac4275b8bfc1756fcac420/medical_logo-e586be?format=webp&width=800"
                  alt="Hare Krishna Medical"
                  className="img-fluid"
                  style={{ maxHeight: "400px" }}
                />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-medical-light">
        <Container>
          <Row>
            <Col lg={12} className="text-center mb-5">
              <h2 className="section-title">Why Choose Us?</h2>
              <p className="section-subtitle">
                We are committed to providing the best healthcare solutions with
                quality products and exceptional service.
              </p>
            </Col>
          </Row>
          <Row>
            <Col lg={4} md={6} className="mb-4">
              <div className="service-card fade-in">
                <div className="feature-icon">
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
              <div className="service-card fade-in">
                <div className="feature-icon">
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
              <div className="service-card fade-in">
                <div className="feature-icon">
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

      {/* Featured Products Section */}
      <section className="section-padding">
        <Container>
          <Row>
            <Col lg={12} className="text-center mb-5">
              <h2 className="section-title">Featured Products</h2>
              <p className="section-subtitle">
                Discover our most popular and trusted medical products
              </p>
            </Col>
          </Row>
          <Row>
            {productsToShow.map((product, index) => (
              <Col lg={4} md={6} className="mb-4" key={product.id || index}>
                <Card className="product-card fade-in">
                  <div
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      (window.location.href = `/products/${product.id}`)
                    }
                  >
                    <Card.Img
                      variant="top"
                      src={product.image}
                      className="product-image"
                      alt={product.name}
                    />
                  </div>
                  <Card.Body>
                    <Card.Title
                      className="product-title"
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        (window.location.href = `/products/${product.id}`)
                      }
                    >
                      {product.name}
                    </Card.Title>
                    <Card.Text>{product.description}</Card.Text>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="product-price">₹{product.price}</span>
                      <Button
                        className="btn-medical-primary btn-sm"
                        onClick={() => handleAddToCart(product)}
                      >
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
                className="btn-medical-outline"
                size="lg"
              >
                View All Products
              </Button>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Stats Section */}
      <section className="stats-section section-padding">
        <Container>
          <Row>
            <Col lg={3} md={6} className="mb-4">
              <div className="stat-item fade-in">
                <span className="stat-number">500+</span>
                <div className="stat-label">Happy Customers</div>
              </div>
            </Col>
            <Col lg={3} md={6} className="mb-4">
              <div className="stat-item fade-in">
                <span className="stat-number">1000+</span>
                <div className="stat-label">Products Available</div>
              </div>
            </Col>
            <Col lg={3} md={6} className="mb-4">
              <div className="stat-item fade-in">
                <span className="stat-number">5+</span>
                <div className="stat-label">Years of Experience</div>
              </div>
            </Col>
            <Col lg={3} md={6} className="mb-4">
              <div className="stat-item fade-in">
                <span className="stat-number">24/7</span>
                <div className="stat-label">Customer Support</div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="cta-section section-padding">
        <Container>
          <Row>
            <Col lg={12} className="text-center">
              <h2 className="cta-title">Ready to Take Care of Your Health?</h2>
              <p className="cta-subtitle">
                Join thousands of satisfied customers who trust us with their
                healthcare needs.
              </p>
              <div className="d-flex gap-3 justify-content-center flex-wrap">
                <Button
                  as={Link}
                  to="/products"
                  variant="light"
                  size="lg"
                  className="fw-bold"
                >
                  Start Shopping
                </Button>
                <Button
                  as={Link}
                  to="/contact"
                  variant="outline-light"
                  size="lg"
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
