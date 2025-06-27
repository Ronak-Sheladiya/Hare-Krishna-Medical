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
  Spinner,
} from "react-bootstrap";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../store/slices/cartSlice.js";
import { api, safeApiCall } from "../utils/apiClient.js";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState([]);

  // Fetch product details
  const fetchProduct = async () => {
    setLoading(true);
    setError(null);

    const {
      success,
      data,
      error: apiError,
    } = await safeApiCall(() => api.get(`/api/products/${id}`), null);

    if (success && data) {
      const productData = data.data || data;
      setProduct(productData);
      // Fetch related products in the same category
      fetchRelatedProducts(productData.category);
    } else {
      setError(apiError || "Product not found");
    }

    setLoading(false);
  };

  // Fetch related products
  const fetchRelatedProducts = async (category) => {
    if (!category) return;

    const { success, data } = await safeApiCall(
      () =>
        api.get(
          `/api/products/public?category=${encodeURIComponent(category)}&limit=4`,
        ),
      [],
    );

    if (success && data) {
      const productsData = data.data || data;
      const products = productsData.products || [];
      // Filter out the current product
      setRelatedProducts(products.filter((p) => p._id !== id));
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;

    dispatch(
      addToCart({
        id: product._id,
        name: product.name,
        price: product.discountPrice || product.price,
        image: product.images?.[0] || "/placeholder.svg",
        company: product.company,
        quantity: quantity,
      }),
    );

    // Show success feedback
    alert(`${quantity} ${product.name} added to cart!`);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/cart");
  };

  if (loading) {
    return (
      <div className="fade-in">
        <Container className="py-5">
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ minHeight: "60vh" }}
          >
            <Spinner animation="border" variant="danger" />
            <span className="ms-3">Loading product details...</span>
          </div>
        </Container>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="fade-in">
        <Container className="py-5">
          <div className="text-center py-5">
            <div className="mb-3">
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  background: "linear-gradient(135deg, #f8f9fa, #e9ecef)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto",
                  fontSize: "32px",
                  color: "#6c757d",
                }}
              >
                <i className="bi bi-exclamation-triangle"></i>
              </div>
            </div>
            <h3>Product Not Found</h3>
            <p className="text-muted">
              {error || "The product you're looking for doesn't exist."}
            </p>
            <div className="d-flex gap-2 justify-content-center">
              <Button variant="outline-secondary" onClick={() => navigate(-1)}>
                <i className="bi bi-arrow-left me-2"></i>
                Go Back
              </Button>
              <Link to="/products">
                <Button
                  variant="danger"
                  style={{
                    background:
                      "linear-gradient(135deg, #e63946 0%, #dc3545 100%)",
                    border: "none",
                  }}
                >
                  <i className="bi bi-grid-3x3-gap me-2"></i>
                  Browse Products
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div
      className="fade-in product-details-content"
      data-page="product-details"
    >
      <Container className="py-4">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-4">
          <Breadcrumb.Item>
            <Link to="/" className="text-decoration-none">
              <i className="bi bi-house me-1"></i>
              Home
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to="/products" className="text-decoration-none">
              <i className="bi bi-grid-3x3-gap me-1"></i>
              Products
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item active>{product.name}</Breadcrumb.Item>
        </Breadcrumb>

        <Row>
          {/* Product Images */}
          <Col lg={6} md={6} className="mb-4">
            <Card
              style={{
                border: "2px solid #f8f9fa",
                borderRadius: "16px",
                overflow: "hidden",
              }}
            >
              <Card.Body className="p-0">
                {product.images && product.images.length > 0 ? (
                  <div>
                    {/* Main Image */}
                    <div
                      style={{
                        height: "400px",
                        overflow: "hidden",
                        position: "relative",
                      }}
                    >
                      <img
                        src={product.images[activeImageIndex]}
                        alt={product.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                        onError={(e) => {
                          e.target.src = "/placeholder.svg";
                        }}
                      />
                      {product.discountPrice && (
                        <Badge
                          bg="danger"
                          style={{
                            position: "absolute",
                            top: "16px",
                            right: "16px",
                            fontSize: "14px",
                            padding: "8px 12px",
                          }}
                        >
                          <i className="bi bi-percent me-1"></i>
                          {Math.round(
                            ((product.price - product.discountPrice) /
                              product.price) *
                              100,
                          )}
                          % OFF
                        </Badge>
                      )}
                    </div>

                    {/* Thumbnail Images */}
                    {product.images.length > 1 && (
                      <div
                        className="d-flex p-3 gap-2"
                        style={{ backgroundColor: "#f8f9fa" }}
                      >
                        {product.images.map((image, index) => (
                          <img
                            key={index}
                            src={image}
                            alt={`${product.name} ${index + 1}`}
                            style={{
                              width: "80px",
                              height: "80px",
                              objectFit: "cover",
                              borderRadius: "8px",
                              cursor: "pointer",
                              border:
                                activeImageIndex === index
                                  ? "3px solid #e63946"
                                  : "2px solid #dee2e6",
                              transition: "all 0.3s ease",
                            }}
                            onClick={() => setActiveImageIndex(index)}
                            onError={(e) => {
                              e.target.src = "/placeholder.svg";
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div
                    style={{
                      height: "400px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#f8f9fa",
                    }}
                  >
                    <div className="text-center text-muted">
                      <i
                        className="bi bi-image"
                        style={{ fontSize: "48px" }}
                      ></i>
                      <p className="mt-2">No Image Available</p>
                    </div>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>

          {/* Product Information */}
          <Col lg={6} md={6}>
            <div className="sticky-top" style={{ top: "100px" }}>
              <Card
                style={{
                  border: "2px solid #f8f9fa",
                  borderRadius: "16px",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                }}
              >
                <Card.Body style={{ padding: "30px" }}>
                  {/* Product Header */}
                  <div className="mb-3">
                    <h1 className="h3 mb-2">{product.name}</h1>
                    <div className="d-flex align-items-center gap-2 mb-3">
                      <Badge bg="primary" style={{ fontSize: "12px" }}>
                        <i className="bi bi-building me-1"></i>
                        {product.company}
                      </Badge>
                      {product.category && (
                        <Badge bg="info" style={{ fontSize: "12px" }}>
                          <i className="bi bi-tag me-1"></i>
                          {product.category}
                        </Badge>
                      )}
                    </div>
                    {/* Short Description */}
                    {product.shortDescription && (
                      <p
                        className="text-muted mb-3"
                        style={{ fontSize: "16px", lineHeight: "1.5" }}
                      >
                        {product.shortDescription}
                      </p>
                    )}
                  </div>

                  {/* Price */}
                  <div className="mb-4">
                    <div className="d-flex align-items-center gap-2">
                      <h3 className="text-danger mb-0">
                        ₹
                        {(
                          product.discountPrice || product.price
                        )?.toLocaleString()}
                      </h3>
                      {product.discountPrice && (
                        <span
                          className="text-muted"
                          style={{ textDecoration: "line-through" }}
                        >
                          ₹{product.price?.toLocaleString()}
                        </span>
                      )}
                    </div>
                    <small className="text-muted">
                      Taxes included in product price
                    </small>
                  </div>

                  {/* Stock Status */}
                  <div className="mb-4">
                    {product.stock > 0 ? (
                      <div className="d-flex align-items-center text-success">
                        <i className="bi bi-check-circle-fill me-2"></i>
                        <strong>In Stock</strong>
                        {product.stock <= 10 && (
                          <Badge bg="warning" className="ms-2">
                            Only {product.stock} left
                          </Badge>
                        )}
                      </div>
                    ) : (
                      <div className="d-flex align-items-center text-danger">
                        <i className="bi bi-x-circle-fill me-2"></i>
                        <strong>Out of Stock</strong>
                      </div>
                    )}
                  </div>

                  {/* Quantity Selector */}
                  {product.stock > 0 && (
                    <div className="mb-4">
                      <label className="form-label fw-bold">
                        <i className="bi bi-plus-slash-minus me-2"></i>
                        Quantity
                      </label>
                      <div className="d-flex align-items-center gap-2">
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          disabled={quantity <= 1}
                        >
                          <i className="bi bi-dash"></i>
                        </Button>
                        <span
                          className="px-3 py-2 border rounded text-center"
                          style={{ minWidth: "60px" }}
                        >
                          {quantity}
                        </span>
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() =>
                            setQuantity(Math.min(product.stock, quantity + 1))
                          }
                          disabled={quantity >= product.stock}
                        >
                          <i className="bi bi-plus"></i>
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="d-grid gap-2">
                    {product.stock > 0 ? (
                      <>
                        <Button
                          variant="danger"
                          size="lg"
                          onClick={handleBuyNow}
                          style={{
                            background:
                              "linear-gradient(135deg, #e63946 0%, #dc3545 100%)",
                            border: "none",
                            padding: "12px",
                            fontWeight: "600",
                          }}
                        >
                          <i className="bi bi-lightning-fill me-2"></i>
                          Buy Now
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="lg"
                          onClick={handleAddToCart}
                          style={{
                            border: "2px solid #e63946",
                            padding: "12px",
                            fontWeight: "600",
                          }}
                        >
                          <i className="bi bi-cart-plus me-2"></i>
                          Add to Cart
                        </Button>
                      </>
                    ) : (
                      <Button variant="secondary" size="lg" disabled>
                        <i className="bi bi-x-circle me-2"></i>
                        Out of Stock
                      </Button>
                    )}
                  </div>

                  {/* Product Features */}
                  <div className="mt-4 pt-4 border-top">
                    <h6 className="fw-bold mb-3">
                      <i className="bi bi-shield-check me-2"></i>
                      Product Features
                    </h6>
                    <div className="row g-2">
                      <div className="col-6">
                        <div className="d-flex align-items-center text-sm">
                          <i className="bi bi-truck me-2 text-success"></i>
                          <small>Free Delivery</small>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="d-flex align-items-center text-sm">
                          <i className="bi bi-arrow-clockwise me-2 text-info"></i>
                          <small>Easy Returns</small>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="d-flex align-items-center text-sm">
                          <i className="bi bi-shield-check me-2 text-success"></i>
                          <small>Quality Assured</small>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="d-flex align-items-center text-sm">
                          <i className="bi bi-telephone me-2 text-primary"></i>
                          <small>24/7 Support</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </div>
          </Col>
        </Row>

        {/* Product Details Tabs */}
        <Row className="mt-5">
          <Col>
            <Card
              style={{
                border: "2px solid #f8f9fa",
                borderRadius: "16px",
                overflow: "hidden",
              }}
            >
              <Tabs
                defaultActiveKey="description"
                className="border-bottom-0"
                style={{ backgroundColor: "#f8f9fa" }}
              >
                <Tab
                  eventKey="description"
                  title={
                    <span>
                      <i className="bi bi-file-text me-2"></i>
                      Description
                    </span>
                  }
                >
                  <div style={{ padding: "30px" }}>
                    {product.shortDescription && (
                      <>
                        <h5 className="mb-3">
                          <i className="bi bi-info-circle me-2"></i>
                          Overview
                        </h5>
                        <p
                          style={{
                            lineHeight: "1.8",
                            fontSize: "18px",
                            fontWeight: "500",
                            color: "#2c3e50",
                          }}
                        >
                          {product.shortDescription}
                        </p>
                      </>
                    )}

                    <h5 className="mb-3 mt-4">
                      <i className="bi bi-file-text me-2"></i>
                      Detailed Description
                    </h5>
                    <p style={{ lineHeight: "1.8", fontSize: "16px" }}>
                      {product.description ||
                        "No detailed description available for this product."}
                    </p>
                  </div>
                </Tab>

                <Tab
                  eventKey="specifications"
                  title={
                    <span>
                      <i className="bi bi-list-ul me-2"></i>
                      Specifications
                    </span>
                  }
                >
                  <div style={{ padding: "30px" }}>
                    <h5 className="mb-3">
                      <i className="bi bi-gear me-2"></i>
                      Product Specifications
                    </h5>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <div className="border rounded p-3 h-100">
                          <h6 className="fw-bold text-primary mb-2">
                            <i className="bi bi-box me-2"></i>
                            General Information
                          </h6>
                          <div className="mb-2">
                            <strong>Brand:</strong> {product.company}
                          </div>
                          <div className="mb-2">
                            <strong>Category:</strong>{" "}
                            {product.category || "General"}
                          </div>
                          {product.weight && (
                            <div className="mb-2">
                              <strong>Weight:</strong> {product.weight}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="border rounded p-3 h-100">
                          <h6 className="fw-bold text-success mb-2">
                            <i className="bi bi-shield-check me-2"></i>
                            Quality & Safety
                          </h6>
                          <div className="mb-2">
                            <i className="bi bi-check text-success me-2"></i>
                            Quality Tested
                          </div>
                          <div className="mb-2">
                            <i className="bi bi-check text-success me-2"></i>
                            FDA Approved
                          </div>
                          <div className="mb-2">
                            <i className="bi bi-check text-success me-2"></i>
                            Safe for Use
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Tab>
              </Tabs>
            </Card>
          </Col>
        </Row>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <Row className="mt-5">
            <Col>
              <Card
                style={{
                  border: "2px solid #f8f9fa",
                  borderRadius: "16px",
                  overflow: "hidden",
                }}
              >
                <Card.Header
                  style={{
                    background:
                      "linear-gradient(135deg, #e63946 0%, #dc3545 100%)",
                    color: "white",
                    padding: "20px 30px",
                    border: "none",
                  }}
                >
                  <h4 className="mb-0 d-flex align-items-center">
                    <i className="bi bi-grid-3x3-gap me-2"></i>
                    Related Products
                  </h4>
                </Card.Header>
                <Card.Body style={{ padding: "30px" }}>
                  <Row>
                    {relatedProducts.slice(0, 4).map((relatedProduct) => (
                      <Col
                        lg={3}
                        md={6}
                        className="mb-4"
                        key={relatedProduct._id}
                      >
                        <Card
                          className="h-100"
                          style={{
                            border: "2px solid #f8f9fa",
                            borderRadius: "12px",
                            transition: "all 0.3s ease",
                            cursor: "pointer",
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.borderColor = "#e63946";
                            e.currentTarget.style.transform =
                              "translateY(-4px)";
                            e.currentTarget.style.boxShadow =
                              "0 8px 25px rgba(230, 57, 70, 0.2)";
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.borderColor = "#f8f9fa";
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "none";
                          }}
                          onClick={() =>
                            navigate(`/product/${relatedProduct._id}`)
                          }
                        >
                          <Card.Img
                            variant="top"
                            src={
                              relatedProduct.images?.[0] || "/placeholder.svg"
                            }
                            style={{ height: "200px", objectFit: "cover" }}
                            onError={(e) => {
                              e.target.src = "/placeholder.svg";
                            }}
                          />
                          <Card.Body>
                            <Card.Title className="h6">
                              {relatedProduct.name}
                            </Card.Title>
                            <div className="d-flex justify-content-between align-items-center">
                              <div>
                                <span className="fw-bold text-danger">
                                  ₹
                                  {(
                                    relatedProduct.discountPrice ||
                                    relatedProduct.price
                                  )?.toLocaleString()}
                                </span>
                                {relatedProduct.discountPrice && (
                                  <small
                                    className="text-muted ms-2"
                                    style={{ textDecoration: "line-through" }}
                                  >
                                    ₹{relatedProduct.price?.toLocaleString()}
                                  </small>
                                )}
                              </div>
                              <Badge bg="primary" style={{ fontSize: "10px" }}>
                                {relatedProduct.company}
                              </Badge>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
};

export default ProductDetails;
