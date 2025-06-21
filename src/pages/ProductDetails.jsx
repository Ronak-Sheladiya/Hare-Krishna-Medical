import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  Breadcrumb,
  Tab,
  Tabs,
  ListGroup,
  Carousel,
  Alert,
} from "react-bootstrap";
import { useParams, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../store/slices/cartSlice.js";

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Mock product data
  const mockProduct = {
    id: parseInt(id),
    name: "Paracetamol Tablets 500mg",
    company: "Hare Krishna Pharma",
    price: 25.99,
    originalPrice: 30.99,
    images: [
      "https://via.placeholder.com/500x400/e6e6e6/666666?text=Paracetamol+Main",
      "https://via.placeholder.com/500x400/cccccc/666666?text=Paracetamol+Side",
      "https://via.placeholder.com/500x400/b3b3b3/666666?text=Paracetamol+Back",
      "https://via.placeholder.com/500x400/999999/666666?text=Paracetamol+Pack",
    ],
    description:
      "Effective pain relief and fever reducer for adults and children. Fast-acting formula that provides quick relief from headaches, body aches, and fever.",
    benefits: [
      "Quick pain relief within 30 minutes",
      "Reduces fever effectively",
      "Gentle on stomach",
      "Suitable for adults and children",
      "Non-drowsy formula",
    ],
    usage:
      "Adults: Take 1-2 tablets every 4-6 hours as needed. Do not exceed 8 tablets in 24 hours. Children: Consult healthcare provider for appropriate dosage.",
    weight: "50 tablets (500mg each)",
    inStock: true,
    stockCount: 45,
    ingredients: [
      "Paracetamol 500mg",
      "Microcrystalline Cellulose",
      "Starch",
      "Magnesium Stearate",
    ],
    warnings: [
      "Do not exceed recommended dosage",
      "Consult doctor if symptoms persist",
      "Keep out of reach of children",
      "Store in cool, dry place",
    ],
    reviews: [
      {
        id: 1,
        name: "John D.",
        rating: 5,
        comment: "Very effective for headaches. Works quickly.",
        date: "2024-01-10",
      },
      {
        id: 2,
        name: "Sarah M.",
        rating: 4,
        comment: "Good quality product. Gentle on stomach.",
        date: "2024-01-08",
      },
    ],
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProduct(mockProduct);
      setLoading(false);
    }, 1000);
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      dispatch(
        addToCart({
          ...product,
          quantity: quantity,
        }),
      );
    }
  };

  const handleQuantityChange = (increment) => {
    setQuantity((prev) => Math.max(1, prev + increment));
  };

  const handleShare = async () => {
    const url = window.location.href;
    const text = `Check out ${product.name} at Hare Krishna Medical`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: text,
          url: url,
        });
      } catch (error) {
        // Fallback to clipboard
        navigator.clipboard.writeText(url);
        alert("Product link copied to clipboard!");
      }
    } else {
      // Fallback for browsers without native sharing
      navigator.clipboard.writeText(url);
      alert("Product link copied to clipboard!");
    }
  };

  // Calculate total price based on quantity
  const totalPrice = product ? (product.price * quantity).toFixed(2) : "0.00";

  if (loading) {
    return (
      <div className="fade-in">
        <Container className="section-padding">
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading product details...</p>
          </div>
        </Container>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="fade-in">
        <Container className="section-padding">
          <Alert variant="danger">
            <h4>Product Not Found</h4>
            <p>The product you're looking for doesn't exist.</p>
            <Button as={Link} to="/products" variant="outline-danger">
              Back to Products
            </Button>
          </Alert>
        </Container>
      </div>
    );
  }

  return (
    <div className="fade-in">
      {/* Breadcrumb */}
      <section
        style={{
          background: "#f8f9fa",
          paddingTop: "20px",
          paddingBottom: "20px",
        }}
      >
        <Container>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/products">Products</Breadcrumb.Item>
            <Breadcrumb.Item active>{product.name}</Breadcrumb.Item>
          </Breadcrumb>
        </Container>
      </section>

      {/* Product Details */}
      <section style={{ padding: "60px 0", background: "#ffffff" }}>
        <Container>
          <Row>
            {/* Modern Product Image Carousel */}
            <Col lg={6} className="mb-4">
              <Card
                style={{
                  border: "2px solid #f8f9fa",
                  borderRadius: "16px",
                  overflow: "hidden",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                }}
              >
                {/* Main Carousel */}
                <div style={{ position: "relative" }}>
                  <Carousel
                    interval={null}
                    activeIndex={activeImageIndex}
                    onSelect={(selectedIndex) =>
                      setActiveImageIndex(selectedIndex)
                    }
                    style={{
                      borderRadius: "16px 16px 0 0",
                      overflow: "hidden",
                    }}
                    indicators={false}
                    prevIcon={
                      <div
                        style={{
                          background:
                            "linear-gradient(135deg, #e63946, #dc3545)",
                          borderRadius: "50%",
                          width: "50px",
                          height: "50px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backdropFilter: "blur(10px)",
                        }}
                      >
                        <i
                          className="bi bi-chevron-left"
                          style={{ color: "#ffffff", fontSize: "20px" }}
                        ></i>
                      </div>
                    }
                    nextIcon={
                      <div
                        style={{
                          background:
                            "linear-gradient(135deg, #e63946, #dc3545)",
                          borderRadius: "50%",
                          width: "50px",
                          height: "50px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backdropFilter: "blur(10px)",
                        }}
                      >
                        <i
                          className="bi bi-chevron-right"
                          style={{ color: "#ffffff", fontSize: "20px" }}
                        ></i>
                      </div>
                    }
                  >
                    {product.images.map((image, index) => (
                      <Carousel.Item key={index}>
                        <img
                          className="d-block w-100"
                          src={image}
                          alt={`${product.name} - Image ${index + 1}`}
                          style={{
                            height: "450px",
                            objectFit: "cover",
                            cursor: "zoom-in",
                          }}
                        />
                      </Carousel.Item>
                    ))}
                  </Carousel>

                  {/* Colorful Custom Indicators */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: "20px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      display: "flex",
                      gap: "8px",
                      background: "rgba(0,0,0,0.5)",
                      padding: "8px 16px",
                      borderRadius: "20px",
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    {product.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveImageIndex(index)}
                        style={{
                          width: "12px",
                          height: "12px",
                          borderRadius: "50%",
                          border: "none",
                          background:
                            activeImageIndex === index
                              ? "linear-gradient(135deg, #e63946, #dc3545)"
                              : "rgba(255,255,255,0.5)",
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                          transform:
                            activeImageIndex === index
                              ? "scale(1.2)"
                              : "scale(1)",
                        }}
                        onMouseOver={(e) => {
                          if (activeImageIndex !== index) {
                            e.target.style.background =
                              "linear-gradient(135deg, #343a40, #495057)";
                          }
                        }}
                        onMouseOut={(e) => {
                          if (activeImageIndex !== index) {
                            e.target.style.background = "rgba(255,255,255,0.5)";
                          }
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Colorful Thumbnail Navigation */}
                <div
                  style={{
                    padding: "20px",
                    background: "#f8f9fa",
                    display: "flex",
                    gap: "12px",
                    overflowX: "auto",
                    scrollbarWidth: "thin",
                  }}
                >
                  {product.images.map((image, index) => (
                    <div
                      key={index}
                      onClick={() => setActiveImageIndex(index)}
                      style={{
                        minWidth: "80px",
                        height: "80px",
                        borderRadius: "8px",
                        overflow: "hidden",
                        cursor: "pointer",
                        border:
                          activeImageIndex === index
                            ? "3px solid #e63946"
                            : "2px solid #e9ecef",
                        transition: "all 0.3s ease",
                        transform:
                          activeImageIndex === index
                            ? "scale(1.05)"
                            : "scale(1)",
                        boxShadow:
                          activeImageIndex === index
                            ? "0 4px 12px rgba(230, 57, 70, 0.3)"
                            : "none",
                      }}
                      onMouseOver={(e) => {
                        if (activeImageIndex !== index) {
                          e.currentTarget.style.borderColor = "#343a40";
                          e.currentTarget.style.transform = "scale(1.02)";
                        }
                      }}
                      onMouseOut={(e) => {
                        if (activeImageIndex !== index) {
                          e.currentTarget.style.borderColor = "#e9ecef";
                          e.currentTarget.style.transform = "scale(1)";
                        }
                      }}
                    >
                      <img
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    padding: "20px",
                    textAlign: "center",
                    background: "#f8f9fa",
                  }}
                >
                  <small style={{ color: "#495057", fontWeight: "600" }}>
                    <i className="bi bi-images me-2"></i>
                    {product.images.length} High-Quality Images • Click to zoom
                  </small>
                </div>
              </Card>
            </Col>

            {/* Product Information */}
            <Col lg={6} className="mb-4">
              <div className="product-info">
                <h1
                  style={{
                    color: "#333333",
                    fontSize: "2.5rem",
                    fontWeight: "700",
                    marginBottom: "12px",
                  }}
                >
                  {product.name}
                </h1>

                <p
                  style={{
                    color: "#495057",
                    fontSize: "16px",
                    marginBottom: "24px",
                  }}
                >
                  by <strong>{product.company}</strong>
                </p>

                <div className="price-section mb-4">
                  <div className="d-flex align-items-center gap-3 mb-2">
                    <span
                      style={{
                        color: "#e63946",
                        fontSize: "2.5rem",
                        fontWeight: "800",
                      }}
                    >
                      ₹{product.price}
                    </span>
                    {product.originalPrice && (
                      <span
                        style={{
                          color: "#495057",
                          fontSize: "1.5rem",
                          textDecoration: "line-through",
                        }}
                      >
                        ₹{product.originalPrice}
                      </span>
                    )}
                  </div>
                </div>

                <p
                  style={{
                    color: "#333333",
                    fontSize: "16px",
                    lineHeight: "1.6",
                    marginBottom: "32px",
                  }}
                >
                  {product.description}
                </p>

                {/* Quantity Selector */}
                <div className="quantity-section mb-4">
                  <label
                    style={{
                      color: "#333333",
                      fontWeight: "600",
                      marginBottom: "12px",
                      display: "block",
                    }}
                  >
                    Quantity:
                  </label>
                  <div className="d-flex align-items-center gap-3">
                    <div
                      className="d-flex align-items-center"
                      style={{
                        border: "2px solid #e9ecef",
                        borderRadius: "8px",
                        overflow: "hidden",
                      }}
                    >
                      <Button
                        onClick={() => handleQuantityChange(-1)}
                        style={{
                          background: "#f8f9fa",
                          border: "none",
                          color: "#333333",
                          padding: "8px 16px",
                          borderRadius: "0",
                        }}
                      >
                        <i className="bi bi-dash"></i>
                      </Button>
                      <span
                        style={{
                          padding: "8px 20px",
                          fontSize: "16px",
                          fontWeight: "600",
                          minWidth: "60px",
                          textAlign: "center",
                          background: "#ffffff",
                          color: "#333333",
                        }}
                      >
                        {quantity}
                      </span>
                      <Button
                        onClick={() => handleQuantityChange(1)}
                        style={{
                          background: "#f8f9fa",
                          border: "none",
                          color: "#333333",
                          padding: "8px 16px",
                          borderRadius: "0",
                        }}
                      >
                        <i className="bi bi-plus"></i>
                      </Button>
                    </div>
                    <span style={{ color: "#495057", fontSize: "14px" }}>
                      {product.stockCount} available
                    </span>
                  </div>

                  {/* Dynamic Total Price */}
                  <div style={{ marginTop: "16px" }}>
                    <div
                      style={{
                        background: "#f8f9fa",
                        padding: "16px",
                        borderRadius: "8px",
                        border: "2px solid #e9ecef",
                      }}
                    >
                      <div className="d-flex justify-content-between align-items-center">
                        <span style={{ color: "#495057", fontWeight: "600" }}>
                          Total Price:
                        </span>
                        <span
                          style={{
                            color: "#e63946",
                            fontSize: "1.8rem",
                            fontWeight: "800",
                          }}
                        >
                          ₹{totalPrice}
                        </span>
                      </div>
                      <small style={{ color: "#6c757d" }}>
                        ₹{product.price} × {quantity}{" "}
                        {quantity > 1 ? "items" : "item"}
                      </small>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="action-buttons d-flex gap-3 mb-4">
                  <Button
                    onClick={handleAddToCart}
                    disabled={!product.inStock}
                    size="lg"
                    style={{
                      background: "#e63946",
                      border: "none",
                      borderRadius: "8px",
                      padding: "16px 32px",
                      fontSize: "16px",
                      fontWeight: "600",
                      flex: "1",
                      boxShadow: "0 4px 12px rgba(230, 57, 70, 0.3)",
                    }}
                  >
                    <i className="bi bi-cart-plus me-2"></i>
                    {product.inStock ? "Add to Cart" : "Out of Stock"}
                  </Button>
                  <Button
                    onClick={handleShare}
                    variant="outline-secondary"
                    size="lg"
                    style={{
                      borderColor: "#343a40",
                      color: "#343a40",
                      borderRadius: "8px",
                      padding: "16px 20px",
                      fontSize: "16px",
                      fontWeight: "600",
                    }}
                  >
                    <i className="bi bi-share"></i>
                  </Button>
                </div>

                {/* Product Info Pills */}
                <div className="product-pills d-flex flex-wrap gap-2">
                  <Badge
                    style={{
                      background: "#343a40",
                      padding: "8px 12px",
                      borderRadius: "20px",
                    }}
                  >
                    <i className="bi bi-box-seam me-1"></i>
                    {product.weight}
                  </Badge>
                  <Badge
                    style={{
                      background: "#495057",
                      padding: "8px 12px",
                      borderRadius: "20px",
                    }}
                  >
                    <i className="bi bi-truck me-1"></i>
                    Free Delivery
                  </Badge>
                  <Badge
                    style={{
                      background: "#6c757d",
                      padding: "8px 12px",
                      borderRadius: "20px",
                    }}
                  >
                    <i className="bi bi-shield-check me-1"></i>
                    Authentic
                  </Badge>
                </div>
              </div>
            </Col>
          </Row>

          {/* Product Details Tabs */}
          <Row className="mt-5">
            <Col lg={12}>
              <Tabs
                defaultActiveKey="description"
                className="mb-4"
                style={{
                  borderBottom: "2px solid #f8f9fa",
                }}
              >
                <Tab eventKey="description" title="Description & Benefits">
                  <div
                    style={{
                      padding: "32px",
                      background: "#f8f9fa",
                      borderRadius: "12px",
                    }}
                  >
                    <h4 style={{ color: "#333333", marginBottom: "20px" }}>
                      Product Description
                    </h4>
                    <p
                      style={{
                        color: "#495057",
                        lineHeight: "1.6",
                        marginBottom: "24px",
                      }}
                    >
                      {product.description}
                    </p>

                    <h5 style={{ color: "#e63946", marginBottom: "16px" }}>
                      Key Benefits:
                    </h5>
                    <ul style={{ color: "#495057", lineHeight: "1.8" }}>
                      {product.benefits.map((benefit, index) => (
                        <li key={index} style={{ marginBottom: "8px" }}>
                          <i
                            className="bi bi-check-circle-fill me-2"
                            style={{ color: "#28a745" }}
                          ></i>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Tab>

                <Tab eventKey="usage" title="Usage & Dosage">
                  <div
                    style={{
                      padding: "32px",
                      background: "#f8f9fa",
                      borderRadius: "12px",
                    }}
                  >
                    <h4 style={{ color: "#333333", marginBottom: "20px" }}>
                      How to Use
                    </h4>
                    <p
                      style={{
                        color: "#495057",
                        lineHeight: "1.6",
                        marginBottom: "24px",
                      }}
                    >
                      {product.usage}
                    </p>

                    <h5 style={{ color: "#e63946", marginBottom: "16px" }}>
                      Important Warnings:
                    </h5>
                    <ul style={{ color: "#dc3545", lineHeight: "1.8" }}>
                      {product.warnings.map((warning, index) => (
                        <li key={index} style={{ marginBottom: "8px" }}>
                          <i className="bi bi-exclamation-triangle-fill me-2"></i>
                          {warning}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Tab>

                <Tab eventKey="ingredients" title="Ingredients">
                  <div
                    style={{
                      padding: "32px",
                      background: "#f8f9fa",
                      borderRadius: "12px",
                    }}
                  >
                    <h4 style={{ color: "#333333", marginBottom: "20px" }}>
                      Active Ingredients
                    </h4>
                    <ListGroup>
                      {product.ingredients.map((ingredient, index) => (
                        <ListGroup.Item
                          key={index}
                          style={{
                            border: "none",
                            background: "#ffffff",
                            marginBottom: "8px",
                            borderRadius: "8px",
                            padding: "16px",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                          }}
                        >
                          <i
                            className="bi bi-capsule me-2"
                            style={{ color: "#e63946" }}
                          ></i>
                          {ingredient}
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  </div>
                </Tab>

                <Tab
                  eventKey="reviews"
                  title={`Reviews (${product.reviews.length})`}
                >
                  <div
                    style={{
                      padding: "32px",
                      background: "#f8f9fa",
                      borderRadius: "12px",
                    }}
                  >
                    <h4 style={{ color: "#333333", marginBottom: "20px" }}>
                      Customer Reviews
                    </h4>
                    {product.reviews.map((review) => (
                      <Card
                        key={review.id}
                        className="mb-3"
                        style={{ border: "none", borderRadius: "12px" }}
                      >
                        <Card.Body>
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <div>
                              <h6
                                style={{
                                  color: "#333333",
                                  marginBottom: "4px",
                                }}
                              >
                                {review.name}
                              </h6>
                              <div>
                                {[...Array(5)].map((_, i) => (
                                  <i
                                    key={i}
                                    className={`bi bi-star${i < review.rating ? "-fill" : ""}`}
                                    style={{
                                      color:
                                        i < review.rating
                                          ? "#ffc107"
                                          : "#e9ecef",
                                      marginRight: "2px",
                                    }}
                                  ></i>
                                ))}
                              </div>
                            </div>
                            <small style={{ color: "#495057" }}>
                              {review.date}
                            </small>
                          </div>
                          <p style={{ color: "#495057", margin: "0" }}>
                            {review.comment}
                          </p>
                        </Card.Body>
                      </Card>
                    ))}
                  </div>
                </Tab>
              </Tabs>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default ProductDetails;
