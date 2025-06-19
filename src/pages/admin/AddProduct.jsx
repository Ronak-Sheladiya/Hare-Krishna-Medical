import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Alert,
  Modal,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
  const navigate = useNavigate();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    price: "",
    originalPrice: "",
    stock: "",
    category: "",
    weight: "",
    description: "",
    benefits: "",
    usage: "",
    composition: "",
    sideEffects: "",
    contraindications: "",
    batchNo: "",
    mfgDate: "",
    expDate: "",
    images: [],
  });
  const [errors, setErrors] = useState({});
  const [productId, setProductId] = useState("");

  const categories = [
    "Pain Relief",
    "Vitamins",
    "Cough & Cold",
    "First Aid",
    "Medical Devices",
    "Supplements",
    "Antibiotics",
    "Digestive Health",
    "Heart & Blood Pressure",
    "Diabetes Care",
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    // In a real app, you would upload these to a server
    // For now, we'll just create object URLs
    const imageUrls = files.map((file) => URL.createObjectURL(file));
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...imageUrls].slice(0, 5), // Max 5 images
    }));
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields
    if (!formData.name.trim()) newErrors.name = "Product name is required";
    if (!formData.company.trim())
      newErrors.company = "Company name is required";
    if (!formData.price) newErrors.price = "Price is required";
    if (!formData.stock) newErrors.stock = "Stock quantity is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";

    // Validation rules
    if (formData.price && parseFloat(formData.price) <= 0) {
      newErrors.price = "Price must be greater than 0";
    }
    if (
      formData.originalPrice &&
      parseFloat(formData.originalPrice) < parseFloat(formData.price)
    ) {
      newErrors.originalPrice =
        "Original price must be greater than current price";
    }
    if (formData.stock && parseInt(formData.stock) < 0) {
      newErrors.stock = "Stock cannot be negative";
    }

    // Date validations
    if (formData.mfgDate && formData.expDate) {
      const mfgDate = new Date(formData.mfgDate);
      const expDate = new Date(formData.expDate);
      if (expDate <= mfgDate) {
        newErrors.expDate = "Expiry date must be after manufacturing date";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateProductId = () => {
    return "PRD" + Date.now().toString().slice(-8);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Generate product ID
    const newProductId = generateProductId();
    setProductId(newProductId);

    // In a real app, this would be an API call
    console.log("New Product Data:", {
      id: newProductId,
      ...formData,
      price: parseFloat(formData.price),
      originalPrice: formData.originalPrice
        ? parseFloat(formData.originalPrice)
        : null,
      stock: parseInt(formData.stock),
      status: parseInt(formData.stock) > 0 ? "Active" : "Out of Stock",
      createdDate: new Date().toISOString().split("T")[0],
    });

    // Show success modal
    setShowSuccessModal(true);
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    // Reset form
    setFormData({
      name: "",
      company: "",
      price: "",
      originalPrice: "",
      stock: "",
      category: "",
      weight: "",
      description: "",
      benefits: "",
      usage: "",
      composition: "",
      sideEffects: "",
      contraindications: "",
      batchNo: "",
      mfgDate: "",
      expDate: "",
      images: [],
    });
    setProductId("");
    // Optionally navigate back to products list
    // navigate("/admin/products");
  };

  return (
    <div className="fade-in">
      <section className="section-padding-sm">
        <Container>
          {/* Header */}
          <Row className="mb-4">
            <Col lg={12}>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h2>Add New Product</h2>
                  <p className="text-muted">
                    Add a new medical product to your inventory
                  </p>
                </div>
                <Button
                  variant="outline-secondary"
                  onClick={() => navigate("/admin/products")}
                  className="btn-medical-outline"
                >
                  <i className="bi bi-arrow-left me-2"></i>
                  Back to Products
                </Button>
              </div>
            </Col>
          </Row>

          <Form onSubmit={handleSubmit}>
            <Row>
              {/* Basic Information */}
              <Col lg={8}>
                <Card className="medical-card mb-4">
                  <Card.Header className="bg-medical-light">
                    <h5 className="mb-0">
                      <i className="bi bi-info-circle me-2"></i>
                      Basic Information
                    </h5>
                  </Card.Header>
                  <Card.Body>
                    <Row>
                      <Col md={6} className="mb-3">
                        <Form.Label>
                          Product Name <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          isInvalid={!!errors.name}
                          placeholder="Enter product name"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.name}
                        </Form.Control.Feedback>
                      </Col>
                      <Col md={6} className="mb-3">
                        <Form.Label>
                          Company/Manufacturer{" "}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="company"
                          value={formData.company}
                          onChange={handleInputChange}
                          isInvalid={!!errors.company}
                          placeholder="Enter company name"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.company}
                        </Form.Control.Feedback>
                      </Col>
                      <Col md={4} className="mb-3">
                        <Form.Label>
                          Current Price (₹){" "}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="number"
                          name="price"
                          value={formData.price}
                          onChange={handleInputChange}
                          isInvalid={!!errors.price}
                          placeholder="0.00"
                          step="0.01"
                          min="0"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.price}
                        </Form.Control.Feedback>
                      </Col>
                      <Col md={4} className="mb-3">
                        <Form.Label>Original Price (₹)</Form.Label>
                        <Form.Control
                          type="number"
                          name="originalPrice"
                          value={formData.originalPrice}
                          onChange={handleInputChange}
                          isInvalid={!!errors.originalPrice}
                          placeholder="0.00"
                          step="0.01"
                          min="0"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.originalPrice}
                        </Form.Control.Feedback>
                        <Form.Text className="text-muted">
                          Optional - for displaying discounts
                        </Form.Text>
                      </Col>
                      <Col md={4} className="mb-3">
                        <Form.Label>
                          Stock Quantity <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="number"
                          name="stock"
                          value={formData.stock}
                          onChange={handleInputChange}
                          isInvalid={!!errors.stock}
                          placeholder="0"
                          min="0"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.stock}
                        </Form.Control.Feedback>
                      </Col>
                      <Col md={6} className="mb-3">
                        <Form.Label>
                          Category <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Select
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          isInvalid={!!errors.category}
                        >
                          <option value="">Select Category</option>
                          {categories.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          {errors.category}
                        </Form.Control.Feedback>
                      </Col>
                      <Col md={6} className="mb-3">
                        <Form.Label>Weight/Size</Form.Label>
                        <Form.Control
                          type="text"
                          name="weight"
                          value={formData.weight}
                          onChange={handleInputChange}
                          placeholder="e.g., 500mg, 100ml, 50 tablets"
                        />
                      </Col>
                      <Col md={12} className="mb-3">
                        <Form.Label>
                          Description <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          isInvalid={!!errors.description}
                          placeholder="Enter detailed product description"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.description}
                        </Form.Control.Feedback>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>

                {/* Medical Information */}
                <Card className="medical-card mb-4">
                  <Card.Header className="bg-medical-light">
                    <h5 className="mb-0">
                      <i className="bi bi-heart-pulse me-2"></i>
                      Medical Information
                    </h5>
                  </Card.Header>
                  <Card.Body>
                    <Row>
                      <Col md={12} className="mb-3">
                        <Form.Label>Composition</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={2}
                          name="composition"
                          value={formData.composition}
                          onChange={handleInputChange}
                          placeholder="Enter product composition/ingredients"
                        />
                      </Col>
                      <Col md={12} className="mb-3">
                        <Form.Label>Benefits</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          name="benefits"
                          value={formData.benefits}
                          onChange={handleInputChange}
                          placeholder="Enter product benefits (one per line or comma separated)"
                        />
                      </Col>
                      <Col md={12} className="mb-3">
                        <Form.Label>Usage Instructions</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          name="usage"
                          value={formData.usage}
                          onChange={handleInputChange}
                          placeholder="Enter usage instructions and dosage"
                        />
                      </Col>
                      <Col md={12} className="mb-3">
                        <Form.Label>Side Effects</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={2}
                          name="sideEffects"
                          value={formData.sideEffects}
                          onChange={handleInputChange}
                          placeholder="Enter possible side effects"
                        />
                      </Col>
                      <Col md={12} className="mb-3">
                        <Form.Label>Contraindications</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={2}
                          name="contraindications"
                          value={formData.contraindications}
                          onChange={handleInputChange}
                          placeholder="Enter contraindications and warnings"
                        />
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>

                {/* Manufacturing Details */}
                <Card className="medical-card mb-4">
                  <Card.Header className="bg-medical-light">
                    <h5 className="mb-0">
                      <i className="bi bi-gear me-2"></i>
                      Manufacturing Details
                    </h5>
                  </Card.Header>
                  <Card.Body>
                    <Row>
                      <Col md={4} className="mb-3">
                        <Form.Label>Batch Number</Form.Label>
                        <Form.Control
                          type="text"
                          name="batchNo"
                          value={formData.batchNo}
                          onChange={handleInputChange}
                          placeholder="Enter batch number"
                        />
                      </Col>
                      <Col md={4} className="mb-3">
                        <Form.Label>Manufacturing Date</Form.Label>
                        <Form.Control
                          type="date"
                          name="mfgDate"
                          value={formData.mfgDate}
                          onChange={handleInputChange}
                        />
                      </Col>
                      <Col md={4} className="mb-3">
                        <Form.Label>Expiry Date</Form.Label>
                        <Form.Control
                          type="date"
                          name="expDate"
                          value={formData.expDate}
                          onChange={handleInputChange}
                          isInvalid={!!errors.expDate}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.expDate}
                        </Form.Control.Feedback>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>

              {/* Product Images and Actions */}
              <Col lg={4}>
                <Card className="medical-card mb-4">
                  <Card.Header className="bg-medical-light">
                    <h5 className="mb-0">
                      <i className="bi bi-images me-2"></i>
                      Product Images
                    </h5>
                  </Card.Header>
                  <Card.Body>
                    <Form.Group className="mb-3">
                      <Form.Label>Upload Images (Max 5)</Form.Label>
                      <Form.Control
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={formData.images.length >= 5}
                      />
                      <Form.Text className="text-muted">
                        Upload up to 5 product images. First image will be the
                        main product image.
                      </Form.Text>
                    </Form.Group>

                    {formData.images.length > 0 && (
                      <div>
                        <h6>Uploaded Images:</h6>
                        <div className="d-flex flex-wrap gap-2">
                          {formData.images.map((image, index) => (
                            <div key={index} className="position-relative">
                              <img
                                src={image}
                                alt={`Product ${index + 1}`}
                                style={{
                                  width: "80px",
                                  height: "80px",
                                  objectFit: "cover",
                                  borderRadius: "8px",
                                }}
                                className="border"
                              />
                              <Button
                                size="sm"
                                variant="danger"
                                className="position-absolute top-0 end-0"
                                style={{
                                  width: "20px",
                                  height: "20px",
                                  borderRadius: "50%",
                                  padding: "0",
                                  fontSize: "10px",
                                }}
                                onClick={() => removeImage(index)}
                              >
                                ×
                              </Button>
                              {index === 0 && (
                                <div className="position-absolute bottom-0 start-0 end-0">
                                  <small className="bg-primary text-white px-1 rounded-bottom">
                                    Main
                                  </small>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </Card.Body>
                </Card>

                {/* Submit Actions */}
                <Card className="medical-card">
                  <Card.Header className="bg-medical-light">
                    <h5 className="mb-0">
                      <i className="bi bi-check-circle me-2"></i>
                      Actions
                    </h5>
                  </Card.Header>
                  <Card.Body>
                    <div className="d-grid gap-2">
                      <Button
                        type="submit"
                        className="btn-medical-primary"
                        size="lg"
                      >
                        <i className="bi bi-plus-circle me-2"></i>
                        Add Product
                      </Button>
                      <Button
                        type="button"
                        variant="outline-secondary"
                        onClick={() => navigate("/admin/products")}
                        className="btn-medical-outline"
                      >
                        <i className="bi bi-x-circle me-2"></i>
                        Cancel
                      </Button>
                    </div>
                    <div className="mt-3 text-center">
                      <small className="text-muted">
                        <i className="bi bi-info-circle me-1"></i>
                        Product will be added to your inventory
                      </small>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Form>
        </Container>
      </section>

      {/* Success Modal */}
      <Modal
        show={showSuccessModal}
        onHide={() => {}}
        centered
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header>
          <Modal.Title>Product Added Successfully!</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <i className="bi bi-check-circle-fill text-success display-1 mb-3"></i>
          <h5>Product Added to Inventory</h5>
          <p className="text-muted">
            Your new product has been successfully added to the medical
            inventory.
          </p>
          <div className="alert alert-info">
            <strong>Product ID:</strong> {productId}
          </div>
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <div className="d-flex gap-2">
            <Button
              className="btn-medical-primary"
              onClick={handleSuccessClose}
            >
              Add Another Product
            </Button>
            <Button
              variant="outline-primary"
              onClick={() => {
                setShowSuccessModal(false);
                navigate("/admin/products");
              }}
              className="btn-medical-outline"
            >
              View Products
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AddProduct;
