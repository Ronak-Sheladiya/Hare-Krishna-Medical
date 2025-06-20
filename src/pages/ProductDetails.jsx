import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Breadcrumb,
  Button,
  Card,
  Badge,
  Accordion,
  Carousel,
  Alert,
} from "react-bootstrap";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../store/slices/cartSlice.js";
import { setSelectedProduct } from "../store/slices/productsSlice.js";
import ProductCard from "../components/products/ProductCard.jsx";

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedProduct } = useSelector((state) => state.products);
  const [quantity, setQuantity] = useState(1);
  const [showAddedAlert, setShowAddedAlert] = useState(false);

  // Mock product database
  const productDatabase = {
    1: {
      id: 1,
      name: "Paracetamol Tablets 500mg",
      company: "Hare Krishna Pharma",
      price: 25.99,
      originalPrice: 30.99,
      images: [
        "https://via.placeholder.com/500x400/e6e6e6/666666?text=Paracetamol+Front",
        "https://via.placeholder.com/500x400/cccccc/666666?text=Paracetamol+Back",
        "https://via.placeholder.com/500x400/b3b3b3/666666?text=Paracetamol+Side",
        "https://via.placeholder.com/500x400/999999/666666?text=Paracetamol+Pack",
        "https://via.placeholder.com/500x400/808080/666666?text=Paracetamol+Details",
      ],
      description:
        "Effective pain relief and fever reducer for adults and children. Fast-acting formula provides quick relief from headaches, body aches, and fever.",
      benefits: [
        "Quick and effective pain relief",
        "Reduces fever within 30 minutes",
        "Gentle on stomach when taken as directed",
        "Suitable for adults and children over 12 years",
        "Non-drowsy formula",
      ],
      usage: [
        "Adults and children over 12 years: 1-2 tablets every 4-6 hours",
        "Maximum 8 tablets in 24 hours",
        "Take with water, preferably after food",
        "Do not exceed recommended dose",
        "Consult doctor if symptoms persist beyond 3 days",
      ],
      weight: "50 tablets per pack",
      category: "Pain Relief",
      inStock: true,
      stockCount: 50,
      manufacturer: "Hare Krishna Pharmaceuticals Ltd.",
      batchNo: "HKP2024001",
      mfgDate: "Jan 2024",
      expDate: "Dec 2026",
      composition: "Each tablet contains: Paracetamol IP 500mg",
      sideEffects: [
        "Rare: skin rash or allergic reactions",
        "Very rare: liver damage with overdose",
        "If any adverse reaction occurs, discontinue use",
      ],
      contraindications: [
        "Known hypersensitivity to paracetamol",
        "Severe liver or kidney disease",
        "Chronic alcoholism",
      ],
    },
    2: {
      id: 2,
      name: "Vitamin D3 Capsules",
      company: "Health Plus",
      price: 45.5,
      originalPrice: 52.0,
      images: [
        "https://via.placeholder.com/500x400/e6e6e6/666666?text=Vitamin+D3+Front",
        "https://via.placeholder.com/500x400/cccccc/666666?text=Vitamin+D3+Back",
        "https://via.placeholder.com/500x400/b3b3b3/666666?text=Vitamin+D3+Side",
        "https://via.placeholder.com/500x400/999999/666666?text=Vitamin+D3+Pack",
      ],
      description:
        "Essential vitamin for bone health and immune system support. High-potency vitamin D3 for better calcium absorption.",
      benefits: [
        "Supports bone health and strength",
        "Boosts immune system function",
        "Improves calcium absorption",
        "Supports muscle function",
        "May improve mood and energy",
      ],
      usage: [
        "Adults: 1 capsule daily with food",
        "Take with a meal containing fat for better absorption",
        "Do not exceed recommended dose",
        "Consult doctor before use if pregnant or nursing",
      ],
      weight: "60 capsules per bottle",
      category: "Vitamins",
      inStock: true,
      stockCount: 30,
      manufacturer: "Health Plus Pharmaceuticals",
      batchNo: "HP2024002",
      mfgDate: "Feb 2024",
      expDate: "Jan 2027",
      composition: "Each capsule contains: Vitamin D3 1000 IU",
      sideEffects: [
        "Rare: nausea or vomiting with high doses",
        "Very rare: hypercalcemia with excessive use",
        "Consult doctor if you experience any adverse effects",
      ],
      contraindications: [
        "Hypercalcemia or hypercalciuria",
        "Kidney stones",
        "Kidney disease",
      ],
    },
    3: {
      id: 3,
      name: "Cough Syrup",
      company: "Wellness Care",
      price: 35.75,
      originalPrice: 40.0,
      images: [
        "https://via.placeholder.com/500x400/e6e6e6/666666?text=Cough+Syrup+Front",
        "https://via.placeholder.com/500x400/cccccc/666666?text=Cough+Syrup+Back",
        "https://via.placeholder.com/500x400/b3b3b3/666666?text=Cough+Syrup+Label",
      ],
      description:
        "Natural cough relief formula with honey and herbal extracts. Soothes throat irritation and reduces cough.",
      benefits: [
        "Naturally soothes cough and throat irritation",
        "Contains honey and herbal extracts",
        "Non-drowsy formula",
        "Pleasant taste",
        "Suitable for adults and children over 6 years",
      ],
      usage: [
        "Adults: 10ml (2 teaspoons) 3-4 times daily",
        "Children 6-12 years: 5ml (1 teaspoon) 3 times daily",
        "Take after meals",
        "Shake well before use",
        "Do not exceed recommended dose",
      ],
      weight: "100ml bottle",
      category: "Cough & Cold",
      inStock: true,
      stockCount: 25,
      manufacturer: "Wellness Care Ltd.",
      batchNo: "WC2024003",
      mfgDate: "Mar 2024",
      expDate: "Feb 2027",
      composition: "Honey, Tulsi extract, Ginger extract, Mulethi extract",
      sideEffects: [
        "Generally well tolerated",
        "Rare: allergic reactions to herbal ingredients",
        "May cause drowsiness in sensitive individuals",
      ],
      contraindications: [
        "Known allergy to honey or herbal ingredients",
        "Children under 6 years",
        "Diabetes (due to honey content)",
      ],
    },
  };

  // Get product based on ID, or return a default "not found" product
  const mockProduct = productDatabase[parseInt(id)] || {
    id: parseInt(id),
    name: "Product Not Found",
    company: "Hare Krishna Medical",
    price: 0,
    originalPrice: 0,
    images: [
      "https://via.placeholder.com/500x400/e6e6e6/666666?text=Product+Not+Found",
    ],
    description:
      "Sorry, this product was not found. Please check the product ID or browse our available products.",
    benefits: ["Product not available"],
    usage: ["Please contact us for assistance"],
    weight: "N/A",
    category: "Not Found",
    inStock: false,
    stockCount: 0,
    manufacturer: "N/A",
    batchNo: "N/A",
    mfgDate: "N/A",
    expDate: "N/A",
    composition: "N/A",
    sideEffects: ["Product not available"],
    contraindications: ["Product not available"],
  };

  // Mock related products
  const relatedProducts = [
    {
      id: 2,
      name: "Ibuprofen Tablets 400mg",
      company: "Pain Relief Co.",
      price: 32.5,
      images: [
        "https://via.placeholder.com/300x250/e6e6e6/666666?text=Ibuprofen",
      ],
      description: "Anti-inflammatory pain reliever",
      category: "Pain Relief",
      inStock: true,
    },
    {
      id: 3,
      name: "Aspirin Tablets 75mg",
      company: "Heart Care",
      price: 18.75,
      images: [
        "https://via.placeholder.com/300x250/e6e6e6/666666?text=Aspirin",
      ],
      description: "Low-dose aspirin for heart health",
      category: "Pain Relief",
      inStock: true,
    },
    {
      id: 4,
      name: "Digital Thermometer",
      company: "Med Tech",
      price: 45.0,
      images: [
        "https://via.placeholder.com/300x250/e6e6e6/666666?text=Thermometer",
      ],
      description: "Accurate fever measurement",
      category: "Medical Devices",
      inStock: true,
    },
  ];

  useEffect(() => {
    dispatch(setSelectedProduct(mockProduct));
  }, [id, dispatch]);

  const handleAddToCart = () => {
    const productToAdd = { ...mockProduct, quantity };
    dispatch(addToCart(productToAdd));
    setShowAddedAlert(true);
    setTimeout(() => setShowAddedAlert(false), 3000);
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= mockProduct.stockCount) {
      setQuantity(newQuantity);
    }
  };

  if (!selectedProduct) {
    return (
      <Container className="section-padding">
        <div className="text-center">
          <div className="loading-spinner"></div>
          <p>Loading product details...</p>
        </div>
      </Container>
    );
  }

  const discountPercentage = mockProduct.originalPrice
    ? Math.round(
        ((mockProduct.originalPrice - mockProduct.price) /
          mockProduct.originalPrice) *
          100,
      )
    : 0;

  return (
    <div className="fade-in">
      {/* Breadcrumb */}
      <section className="medical-breadcrumb">
        <Container>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/products">Products</Breadcrumb.Item>
            <Breadcrumb.Item active>{mockProduct.name}</Breadcrumb.Item>
          </Breadcrumb>
        </Container>
      </section>

      {/* Product Details */}
      <section className="section-padding">
        <Container>
          {showAddedAlert && (
            <Alert
              variant="success"
              className="mb-4"
              dismissible
              onClose={() => setShowAddedAlert(false)}
            >
              <i className="bi bi-check-circle me-2"></i>
              Product added to cart successfully!
            </Alert>
          )}

          <Row>
            {/* Product Images */}
            <Col lg={6} className="mb-4">
              <Card className="medical-card">
                <Carousel interval={null} className="product-image-carousel">
                  {mockProduct.images.map((image, index) => (
                    <Carousel.Item key={index}>
                      <img
                        className="d-block w-100"
                        src={image}
                        alt={`${mockProduct.name} - Image ${index + 1}`}
                        style={{ height: "400px", objectFit: "cover" }}
                      />
                    </Carousel.Item>
                  ))}
                </Carousel>
                <div className="text-center mt-3 p-3">
                  <small className="text-muted">
                    {mockProduct.images.length} images available • Use arrows to
                    navigate
                  </small>
                </div>
              </Card>
            </Col>

            {/* Product Information */}
            <Col lg={6} className="mb-4">
              <div className="product-info">
                <div className="mb-3">
                  <Badge bg="secondary" className="mb-2">
                    {mockProduct.category}
                  </Badge>
                  {mockProduct.inStock ? (
                    <Badge bg="success" className="ms-2">
                      <i className="bi bi-check-circle me-1"></i>
                      In Stock ({mockProduct.stockCount} available)
                    </Badge>
                  ) : (
                    <Badge bg="danger" className="ms-2">
                      Out of Stock
                    </Badge>
                  )}
                </div>

                <h1 className="product-title mb-2">{mockProduct.name}</h1>
                <p className="text-muted mb-3">by {mockProduct.company}</p>

                <div className="price-section mb-4">
                  <div className="d-flex align-items-center mb-2">
                    <span className="product-price me-3">
                      ₹{mockProduct.price}
                    </span>
                    {mockProduct.originalPrice && (
                      <>
                        <span className="text-muted text-decoration-line-through me-2">
                          ₹{mockProduct.originalPrice}
                        </span>
                        <Badge bg="success">{discountPercentage}% OFF</Badge>
                      </>
                    )}
                  </div>
                  <small className="text-muted">
                    <i className="bi bi-truck me-1"></i>
                    Free delivery on orders above ₹500
                  </small>
                </div>

                <div className="product-details mb-4">
                  <p className="text-muted">{mockProduct.description}</p>

                  <div className="row">
                    <div className="col-6">
                      <small className="text-muted d-block">
                        <strong>Weight:</strong> {mockProduct.weight}
                      </small>
                      <small className="text-muted d-block">
                        <strong>Manufacturer:</strong>{" "}
                        {mockProduct.manufacturer}
                      </small>
                    </div>
                    <div className="col-6">
                      <small className="text-muted d-block">
                        <strong>Batch No:</strong> {mockProduct.batchNo}
                      </small>
                      <small className="text-muted d-block">
                        <strong>Exp Date:</strong> {mockProduct.expDate}
                      </small>
                    </div>
                  </div>
                </div>

                {/* Quantity Selector */}
                <div className="quantity-section mb-4">
                  <label className="form-label">Quantity:</label>
                  <div className="d-flex align-items-center">
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                    >
                      <i className="bi bi-dash"></i>
                    </Button>
                    <span className="mx-3 fw-bold">{quantity}</span>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= mockProduct.stockCount}
                    >
                      <i className="bi bi-plus"></i>
                    </Button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="action-buttons">
                  <Row>
                    <Col sm={8} className="mb-2">
                      <Button
                        className="btn-medical-primary w-100"
                        onClick={handleAddToCart}
                        disabled={!mockProduct.inStock}
                      >
                        <i className="bi bi-cart-plus me-2"></i>
                        Add to Cart (₹
                        {(mockProduct.price * quantity).toFixed(2)})
                      </Button>
                    </Col>
                    <Col sm={4} className="mb-2">
                      <Button
                        as={Link}
                        to="/cart"
                        variant="outline-primary"
                        className="btn-medical-outline w-100"
                      >
                        <i className="bi bi-cart"></i>
                      </Button>
                    </Col>
                  </Row>
                </div>
              </div>
            </Col>
          </Row>

          {/* Product Details Accordion */}
          <Row className="mt-5">
            <Col lg={12}>
              <h3 className="mb-4">Product Information</h3>
              <Accordion defaultActiveKey="0">
                <Accordion.Item eventKey="0">
                  <Accordion.Header>
                    <i className="bi bi-info-circle me-2"></i>
                    Description & Composition
                  </Accordion.Header>
                  <Accordion.Body>
                    <p>
                      <strong>Description:</strong> {mockProduct.description}
                    </p>
                    <p>
                      <strong>Composition:</strong> {mockProduct.composition}
                    </p>
                    <p>
                      <strong>Manufacturer:</strong> {mockProduct.manufacturer}
                    </p>
                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="1">
                  <Accordion.Header>
                    <i className="bi bi-heart-pulse me-2"></i>
                    Benefits
                  </Accordion.Header>
                  <Accordion.Body>
                    <ul className="list-unstyled">
                      {mockProduct.benefits.map((benefit, index) => (
                        <li key={index} className="mb-2">
                          <i className="bi bi-check-circle-fill text-medical-green me-2"></i>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="2">
                  <Accordion.Header>
                    <i className="bi bi-prescription2 me-2"></i>
                    Usage & Dosage
                  </Accordion.Header>
                  <Accordion.Body>
                    <ul className="list-unstyled">
                      {mockProduct.usage.map((instruction, index) => (
                        <li key={index} className="mb-2">
                          <i className="bi bi-arrow-right-circle text-medical-blue me-2"></i>
                          {instruction}
                        </li>
                      ))}
                    </ul>
                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="3">
                  <Accordion.Header>
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    Side Effects & Precautions
                  </Accordion.Header>
                  <Accordion.Body>
                    <div className="mb-3">
                      <h6>Possible Side Effects:</h6>
                      <ul>
                        {mockProduct.sideEffects.map((effect, index) => (
                          <li key={index}>{effect}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h6>Contraindications:</h6>
                      <ul>
                        {mockProduct.contraindications.map((contra, index) => (
                          <li key={index}>{contra}</li>
                        ))}
                      </ul>
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Col>
          </Row>

          {/* Related Products */}
          <Row className="mt-5">
            <Col lg={12}>
              <h3 className="mb-4">Related Products</h3>
              <Row>
                {relatedProducts.map((product) => (
                  <Col lg={4} md={6} className="mb-4" key={product.id}>
                    <ProductCard
                      product={product}
                      onAddToCart={(p) => dispatch(addToCart(p))}
                    />
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default ProductDetails;
