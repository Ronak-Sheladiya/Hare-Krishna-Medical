import React, { useState } from "react";
import { Card, Button, Badge, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";

const ProductCard = ({ product, onAddToCart }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleAddToCart = () => {
    // Direct add to cart without confirmation
    onAddToCart(product);
  };

  const discountPercentage = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100,
      )
    : 0;

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === product.images.length - 1 ? 0 : prev + 1,
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1,
    );
  };

  return (
    <Card className="product-card h-100">
      <div className="position-relative">
        <Card.Img
          variant="top"
          src={product.images[currentImageIndex]}
          className="product-image"
        />

        {/* Image Navigation */}
        {product.images.length > 1 && (
          <>
            <Button
              variant="light"
              size="sm"
              className="position-absolute top-50 start-0 translate-middle-y ms-2 rounded-circle"
              style={{ width: "30px", height: "30px", opacity: 0.8 }}
              onClick={prevImage}
            >
              <i className="bi bi-chevron-left"></i>
            </Button>
            <Button
              variant="light"
              size="sm"
              className="position-absolute top-50 end-0 translate-middle-y me-2 rounded-circle"
              style={{ width: "30px", height: "30px", opacity: 0.8 }}
              onClick={nextImage}
            >
              <i className="bi bi-chevron-right"></i>
            </Button>
            <div className="position-absolute bottom-0 start-50 translate-middle-x mb-2">
              <div className="d-flex gap-1">
                {product.images.map((_, index) => (
                  <div
                    key={index}
                    className={`bg-white rounded-circle ${
                      index === currentImageIndex ? "opacity-100" : "opacity-50"
                    }`}
                    style={{ width: "6px", height: "6px" }}
                  ></div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Badges */}
        <div className="position-absolute top-0 start-0 m-2">
          {!product.inStock && (
            <Badge bg="danger" className="mb-1 d-block">
              Out of Stock
            </Badge>
          )}
          {discountPercentage > 0 && (
            <Badge bg="success" className="d-block">
              {discountPercentage}% OFF
            </Badge>
          )}
        </div>

        {/* Quick Actions */}
        <div className="position-absolute top-0 end-0 m-2">
          <OverlayTrigger
            placement="left"
            overlay={<Tooltip>View Details</Tooltip>}
          >
            <Button
              as={Link}
              to={`/products/${product.id}`}
              variant="light"
              size="sm"
              className="rounded-circle mb-1 d-block"
              style={{ width: "35px", height: "35px" }}
            >
              <i className="bi bi-eye"></i>
            </Button>
          </OverlayTrigger>
        </div>
      </div>

      <Card.Body className="d-flex flex-column">
        <div className="mb-2">
          <Badge bg="secondary" className="mb-2">
            {product.category}
          </Badge>
        </div>

        <Card.Title className="product-title">{product.name}</Card.Title>
        <Card.Text className="text-muted small mb-1">
          by {product.company}
        </Card.Text>
        <Card.Text className="text-muted small flex-grow-1">
          {product.description}
        </Card.Text>

        <div className="product-details mb-3">
          <small className="text-muted">
            <i className="bi bi-box-seam me-1"></i>
            {product.weight}
          </small>
        </div>

        <div className="price-section mb-3">
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <span className="product-price">₹{product.price}</span>
              {product.originalPrice && (
                <span className="text-muted text-decoration-line-through ms-2 small">
                  ₹{product.originalPrice}
                </span>
              )}
            </div>
            {product.inStock && (
              <Badge bg="success" className="small">
                <i className="bi bi-check-circle me-1"></i>
                In Stock
              </Badge>
            )}
          </div>
        </div>

        <div className="mt-auto">
          <div className="d-grid gap-2">
            <Button
              className="btn-medical-primary"
              onClick={handleAddToCart}
              disabled={!product.inStock}
            >
              {product.inStock ? (
                <>
                  <i className="bi bi-cart-plus me-2"></i>
                  Add to Cart
                </>
              ) : (
                "Out of Stock"
              )}
            </Button>
            <Button
              as={Link}
              to={`/products/${product.id}`}
              variant="outline-secondary"
              size="sm"
              className="btn-medical-outline"
            >
              View Details
            </Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;
