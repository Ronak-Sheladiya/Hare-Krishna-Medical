import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Table,
  Badge,
  Alert,
  ProgressBar,
} from "react-bootstrap";
import { useParams, Link, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const OrderDetails = () => {
  const { orderId } = useParams();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <Navigate to="/login" state={{ from: `/order/${orderId}` }} replace />
    );
  }

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);

        // Mock API call - in real app, this would be fetched from backend
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const mockOrder = {
          orderId: orderId || "HKM12345678",
          invoiceId: `INV${orderId?.slice(-6) || "123456"}`,
          userId: user?.id || "1",
          customerDetails: {
            fullName: user?.name || "John Doe",
            email: user?.email || "john.doe@example.com",
            mobile: "+91 9876543210",
            address: "123 Medical Street",
            city: "Surat",
            state: "Gujarat",
            pincode: "395007",
          },
          items: [
            {
              id: 1,
              name: "Paracetamol Tablets 500mg",
              company: "Hare Krishna Pharma",
              quantity: 2,
              price: 25.99,
              total: 51.98,
              image:
                "https://cdn.builder.io/api/v1/assets/ec4b3f82f1ac4275b8bfc1756fcac420/paracetamol-placeholder",
            },
            {
              id: 2,
              name: "Vitamin D3 Capsules",
              company: "Health Plus",
              quantity: 1,
              price: 45.5,
              total: 45.5,
              image:
                "https://cdn.builder.io/api/v1/assets/ec4b3f82f1ac4275b8bfc1756fcac420/vitamin-d3-placeholder",
            },
          ],
          subtotal: 97.48,
          shipping: 0,
          tax: 4.87,
          total: 102.35,
          orderDate: "2024-01-15",
          orderTime: "14:30:25",
          status: "Delivered",
          paymentMethod: "Cash on Delivery",
          paymentStatus: "Paid",
          trackingNumber: "TRK123456789",
          estimatedDelivery: "2024-01-18",
          orderNotes: "Please handle with care",
          timeline: [
            {
              status: "Order Placed",
              date: "2024-01-15 14:30",
              completed: true,
              description: "Order has been placed successfully",
            },
            {
              status: "Confirmed",
              date: "2024-01-15 15:45",
              completed: true,
              description: "Order confirmed and being prepared",
            },
            {
              status: "Shipped",
              date: "2024-01-16 10:20",
              completed: true,
              description: "Order shipped and on the way",
            },
            {
              status: "Delivered",
              date: "2024-01-17 16:30",
              completed: true,
              description: "Order delivered successfully",
            },
          ],
        };

        // Check if user has permission to view this order
        if (user?.role !== 1 && mockOrder.userId !== user?.id) {
          setError("You don't have permission to view this order.");
          return;
        }

        setOrder(mockOrder);
      } catch (err) {
        setError("Failed to load order details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrderDetails();
    } else {
      setError("Invalid order ID.");
      setLoading(false);
    }
  }, [orderId, user]);

  const getStatusVariant = (status) => {
    switch (status) {
      case "Pending":
        return "warning";
      case "Confirmed":
        return "info";
      case "Shipped":
        return "primary";
      case "Delivered":
        return "success";
      case "Cancelled":
        return "danger";
      default:
        return "secondary";
    }
  };

  const getPaymentStatusVariant = (status) => {
    switch (status) {
      case "Paid":
        return "success";
      case "Unpaid":
        return "danger";
      case "Partial":
        return "warning";
      default:
        return "secondary";
    }
  };

  const calculateProgress = () => {
    const completedSteps =
      order?.timeline?.filter((step) => step.completed).length || 0;
    const totalSteps = order?.timeline?.length || 4;
    return (completedSteps / totalSteps) * 100;
  };

  const downloadInvoice = async () => {
    if (!order) return;

    try {
      // Import required libraries dynamically
      const jsPDF = (await import("jspdf")).default;
      const html2canvas = (await import("html2canvas")).default;
      const QRCode = (await import("qrcode")).default;

      // Generate QR code for verification
      const verifyUrl = `${window.location.origin}/invoice/${orderId}`;
      const qrDataURL = await QRCode.toDataURL(verifyUrl, {
        width: 120,
        margin: 2,
        color: {
          dark: "#1a202c",
          light: "#ffffff",
        },
        errorCorrectionLevel: "M",
      });

      // Create invoice data
      const invoiceData = {
        invoiceId: order.invoiceId,
        orderId: order.orderId,
        orderDate: order.orderDate,
        orderTime: order.orderTime,
        customerDetails: order.customerDetails,
        items: order.items,
        subtotal: order.subtotal,
        shipping: order.shipping,
        tax: order.tax,
        total: order.total,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        status: order.status,
        qrCode: qrDataURL,
      };

      // Create temporary element with invoice
      const tempDiv = document.createElement("div");
      tempDiv.style.position = "absolute";
      tempDiv.style.left = "-9999px";
      tempDiv.style.width = "210mm";
      tempDiv.style.backgroundColor = "white";
      document.body.appendChild(tempDiv);

      // Import and render OfficialInvoiceDesign component
      const OfficialInvoiceDesign = (
        await import("../components/common/OfficialInvoiceDesign.jsx")
      ).default;
      const React = (await import("react")).default;
      const { createRoot } = await import("react-dom/client");

      const root = createRoot(tempDiv);
      root.render(
        React.createElement(ProfessionalInvoice, {
          invoiceData,
          qrCode: qrDataURL,
          forPrint: true,
        }),
      );

      // Wait for rendering
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Generate PDF
      const canvas = await html2canvas(tempDiv, {
        scale: 2.5,
        logging: false,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      if (imgHeight > pageHeight) {
        const scaleFactor = (pageHeight - 5) / imgHeight;
        const scaledWidth = imgWidth * scaleFactor;
        const scaledHeight = pageHeight - 5;
        const xOffset = (imgWidth - scaledWidth) / 2;
        pdf.addImage(imgData, "PNG", xOffset, 2.5, scaledWidth, scaledHeight);
      } else {
        const yOffset = (pageHeight - imgHeight) / 2;
        pdf.addImage(imgData, "PNG", 0, yOffset, imgWidth, imgHeight);
      }

      // Download with invoice ID as filename
      pdf.save(`${order.invoiceId}.pdf`);

      // Clean up
      root.unmount();
      document.body.removeChild(tempDiv);

      // Show success message
      alert("Official Invoice downloaded successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF. Please try again.");
    }
  };

  if (loading) {
    return (
      <Container className="text-center my-5">
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "300px" }}
        >
          <div className="text-center">
            <div className="spinner-border text-medical-red" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading order details...</p>
          </div>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="text-center my-5">
        <Alert variant="danger" className="text-center">
          <h4>Error</h4>
          <p>{error}</p>
          <Button
            as={Link}
            to={user?.role === 1 ? "/admin/orders" : "/user/orders"}
            className="btn-medical-primary"
          >
            Back to Orders
          </Button>
        </Alert>
      </Container>
    );
  }

  if (!order) {
    return (
      <Container className="text-center my-5">
        <Alert variant="warning" className="text-center">
          <h4>Order Not Found</h4>
          <p>The requested order could not be found.</p>
          <Button
            as={Link}
            to={user?.role === 1 ? "/admin/orders" : "/user/orders"}
            className="btn-medical-primary"
          >
            Back to Orders
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <div className="fade-in">
      <section className="section-padding-sm">
        <Container>
          {/* Header */}
          <Row className="mb-4">
            <Col lg={12}>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h2>Order Details</h2>
                  <p className="text-muted">Order ID: {order.orderId}</p>
                </div>
                <div className="d-flex gap-2">
                  <Button
                    onClick={downloadInvoice}
                    className="btn-medical-primary"
                  >
                    <i className="bi bi-download me-2"></i>
                    Download Invoice
                  </Button>
                  <Button
                    as={Link}
                    to={user?.role === 1 ? "/admin/orders" : "/user/orders"}
                    variant="outline-secondary"
                    className="btn-medical-outline"
                  >
                    <i className="bi bi-arrow-left me-2"></i>
                    Back to Orders
                  </Button>
                </div>
              </div>
            </Col>
          </Row>

          {/* Order Status & Progress */}
          <Row className="mb-4">
            <Col lg={12}>
              <Card className="medical-card">
                <Card.Header className="bg-medical-light">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">
                      <i className="bi bi-truck me-2"></i>
                      Order Status
                    </h5>
                    <div className="d-flex gap-2">
                      <Badge
                        bg={getStatusVariant(order.status)}
                        className="fs-6"
                      >
                        {order.status}
                      </Badge>
                      <Badge
                        bg={getPaymentStatusVariant(order.paymentStatus)}
                        className="fs-6"
                      >
                        {order.paymentStatus}
                      </Badge>
                    </div>
                  </div>
                </Card.Header>
                <Card.Body>
                  <Row className="mb-4">
                    <Col md={6}>
                      <p className="mb-2">
                        <strong>Tracking Number:</strong> {order.trackingNumber}
                      </p>
                      <p className="mb-2">
                        <strong>Payment Method:</strong> {order.paymentMethod}
                      </p>
                      <p className="mb-0">
                        <strong>Estimated Delivery:</strong>{" "}
                        {order.estimatedDelivery}
                      </p>
                    </Col>
                    <Col md={6}>
                      <div className="mb-2">
                        <small className="text-muted">Order Progress</small>
                        <ProgressBar
                          now={calculateProgress()}
                          variant="success"
                          className="mb-2"
                          style={{ height: "8px" }}
                        />
                        <small className="text-muted">
                          {Math.round(calculateProgress())}% Complete
                        </small>
                      </div>
                    </Col>
                  </Row>

                  {/* Order Timeline */}
                  <h6 className="mb-3">Order Timeline</h6>
                  <div className="timeline">
                    {order.timeline.map((step, index) => (
                      <div
                        key={index}
                        className={`timeline-item ${step.completed ? "completed" : "pending"}`}
                      >
                        <div className="timeline-marker">
                          <i
                            className={`bi bi-${step.completed ? "check-circle-fill" : "circle"}`}
                          ></i>
                        </div>
                        <div className="timeline-content">
                          <h6 className="mb-1">{step.status}</h6>
                          <p className="text-muted mb-1">{step.description}</p>
                          <small className="text-muted">{step.date}</small>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row>
            {/* Order Items */}
            <Col lg={8} className="mb-4">
              <Card className="medical-card">
                <Card.Header className="bg-medical-light">
                  <h5 className="mb-0">
                    <i className="bi bi-box me-2"></i>
                    Order Items ({order.items.length})
                  </h5>
                </Card.Header>
                <Card.Body className="p-0">
                  <div className="table-responsive">
                    <Table className="mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>Product</th>
                          <th>Company</th>
                          <th className="text-center">Qty</th>
                          <th className="text-end">Price</th>
                          <th className="text-end">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.items.map((item) => (
                          <tr key={item.id}>
                            <td>
                              <div className="d-flex align-items-center">
                                <img
                                  src={
                                    item.image ||
                                    "https://via.placeholder.com/50"
                                  }
                                  alt={item.name}
                                  className="me-3"
                                  style={{
                                    width: "50px",
                                    height: "50px",
                                    objectFit: "cover",
                                    borderRadius: "5px",
                                  }}
                                />
                                <div>
                                  <div className="fw-bold">{item.name}</div>
                                  <small className="text-muted">
                                    Product ID: {item.id}
                                  </small>
                                </div>
                              </div>
                            </td>
                            <td>{item.company}</td>
                            <td className="text-center">
                              <Badge bg="secondary">{item.quantity}</Badge>
                            </td>
                            <td className="text-end">
                              ₹{item.price.toFixed(2)}
                            </td>
                            <td className="text-end fw-bold">
                              ₹{item.total.toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            {/* Order Summary */}
            <Col lg={4} className="mb-4">
              <Card className="medical-card">
                <Card.Header className="bg-medical-light">
                  <h5 className="mb-0">
                    <i className="bi bi-receipt me-2"></i>
                    Order Summary
                  </h5>
                </Card.Header>
                <Card.Body>
                  <div className="order-summary">
                    <div className="d-flex justify-content-between mb-2">
                      <span>Subtotal:</span>
                      <span>₹{order.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Shipping:</span>
                      <span>
                        {order.shipping === 0
                          ? "FREE"
                          : `₹${order.shipping.toFixed(2)}`}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between mb-3">
                      <span>Tax (5%):</span>
                      <span>₹{order.tax.toFixed(2)}</span>
                    </div>
                    <hr />
                    <div className="d-flex justify-content-between fw-bold fs-5">
                      <span>Total:</span>
                      <span className="text-medical-red">
                        ₹{order.total.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <hr />

                  {/* Customer Information */}
                  <h6 className="mb-3">Delivery Address</h6>
                  <div className="customer-info">
                    <p className="mb-2">
                      <strong>{order.customerDetails.fullName}</strong>
                    </p>
                    <p className="mb-2">{order.customerDetails.mobile}</p>
                    <p className="mb-2">{order.customerDetails.address}</p>
                    <p className="mb-0">
                      {order.customerDetails.city},{" "}
                      {order.customerDetails.state}{" "}
                      {order.customerDetails.pincode}
                    </p>
                  </div>

                  <hr />

                  {/* Quick Actions */}
                  <div className="d-grid gap-2">
                    <Button
                      onClick={downloadInvoice}
                      variant="outline-primary"
                      className="btn-medical-outline"
                    >
                      <i className="bi bi-download me-2"></i>
                      Download Invoice
                    </Button>
                    <Button
                      as={Link}
                      to={`/invoice/${order.orderId}`}
                      variant="outline-info"
                      className="btn-medical-outline"
                    >
                      <i className="bi bi-eye me-2"></i>
                      View Invoice Online
                    </Button>
                    {order.status !== "Delivered" &&
                      order.status !== "Cancelled" && (
                        <Button
                          variant="outline-secondary"
                          className="btn-medical-outline"
                          onClick={() => alert("Feature coming soon!")}
                        >
                          <i className="bi bi-x-circle me-2"></i>
                          Cancel Order
                        </Button>
                      )}
                  </div>

                  {order.orderNotes && (
                    <>
                      <hr />
                      <h6 className="mb-2">Order Notes</h6>
                      <p className="text-muted small mb-0">
                        {order.orderNotes}
                      </p>
                    </>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Timeline Styles */}
      <style>{`
        .timeline {
          position: relative;
          padding-left: 30px;
        }

        .timeline-item {
          position: relative;
          padding-bottom: 20px;
        }

        .timeline-item:not(:last-child):before {
          content: '';
          position: absolute;
          left: -19px;
          top: 25px;
          width: 2px;
          height: calc(100% - 20px);
          background-color: #e9ecef;
        }

        .timeline-item.completed:not(:last-child):before {
          background-color: var(--medical-red);
        }

        .timeline-marker {
          position: absolute;
          left: -30px;
          top: 0;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: white;
          border-radius: 50%;
        }

        .timeline-item.completed .timeline-marker i {
          color: var(--medical-red);
          font-size: 16px;
        }

        .timeline-item.pending .timeline-marker i {
          color: #6c757d;
          font-size: 16px;
        }

        .timeline-content h6 {
          color: var(--medical-red);
          margin-bottom: 4px;
        }

        .timeline-item.pending .timeline-content h6 {
          color: #6c757d;
        }

        .order-summary .d-flex {
          align-items: center;
        }

        .customer-info p {
          line-height: 1.4;
          font-size: 0.95rem;
        }
      `}</style>
    </div>
  );
};

export default OrderDetails;
