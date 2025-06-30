import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Breadcrumb,
  Card,
  Button,
  Form,
  Alert,
  Table,
  Modal,
  Badge,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "../store/slices/cartSlice.js";
import PaymentOptions from "../components/common/PaymentOptions.jsx";
import OfficialInvoiceDesign from "../components/common/OfficialInvoiceDesign.jsx";
import QRCode from "qrcode";
import pdfService from "../services/PDFService.js";

const Order = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, totalAmount } = useSelector((state) => state.cart);
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    mobile: user?.mobile || "",
    address: user?.address || "",
    pincode: user?.pincode || "",
    city: user?.city || "",
    state: user?.state || "",
    landmark: "",
    alternatePhone: "",
  });

  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [errors, setErrors] = useState({});
  const [qrCode, setQrCode] = useState("");
  const [pdfGenerating, setPdfGenerating] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cod");

  const shippingCost = 0; // Free shipping for all orders
  const taxAmount = 0; // Tax included in product price
  const finalTotal = totalAmount + shippingCost;

  // Redirect if cart is empty
  if (items.length === 0) {
    return (
      <div className="fade-in">
        {/* Hero Section - Matching About Us */}
        <section
          style={{
            background: "linear-gradient(135deg, #e63946 0%, #dc3545 100%)",
            paddingTop: "80px",
            paddingBottom: "80px",
            color: "white",
          }}
        >
          <Container>
            <Row className="text-center">
              <Col lg={12}>
                <h1
                  style={{
                    fontSize: "3rem",
                    fontWeight: "800",
                    marginBottom: "20px",
                    textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
                  }}
                >
                  Place Your Order
                </h1>
                <p
                  style={{
                    fontSize: "1.2rem",
                    opacity: "0.9",
                    maxWidth: "600px",
                    margin: "0 auto",
                  }}
                >
                  Complete your medical product purchase
                </p>
              </Col>
            </Row>
          </Container>
        </section>

        {/* Order Form Section */}
        <section
          style={{
            background: "#f8f9fa",
            paddingTop: "80px",
            paddingBottom: "80px",
          }}
        >
          <Container>
            <Row className="justify-content-center">
              <Col lg={8} className="text-center">
                <div className="medical-card p-5">
                  <i className="bi bi-cart-x display-1 text-muted mb-4"></i>
                  <h3 className="mb-3">No Items to Order</h3>
                  <p className="text-muted mb-4">
                    Your cart is empty. Please add some products before
                    proceeding to checkout.
                  </p>
                  <Button
                    as={Link}
                    to="/products"
                    className="btn-medical-primary"
                    size="lg"
                  >
                    <i className="bi bi-grid3x3-gap me-2"></i>
                    Continue Shopping
                  </Button>
                </div>
              </Col>
            </Row>
          </Container>
        </section>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email format is invalid";
    }
    if (!formData.mobile.trim()) {
      newErrors.mobile = "Mobile number is required";
    } else if (!/^\d{10}$/.test(formData.mobile.replace(/\s+/g, ""))) {
      newErrors.mobile = "Mobile number must be 10 digits";
    }
    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }
    if (!formData.pincode.trim()) {
      newErrors.pincode = "Pincode is required";
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = "Pincode must be 6 digits";
    }
    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }
    if (!formData.state.trim()) {
      newErrors.state = "State is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateOrderId = () => {
    return "HKM" + Date.now().toString().slice(-8);
  };

  const generateQRCode = async (orderId) => {
    try {
      // Generate QR for order verification using the order ID
      const verifyUrl = `${window.location.origin}/verify?id=${orderId}&type=order`;
      const qrCodeDataURL = await QRCode.toDataURL(verifyUrl, {
        width: 200,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      });
      return qrCodeDataURL;
    } catch (error) {
      console.error("Error generating QR code:", error);
      return null;
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // Prepare order data for backend API
      const orderPayload = {
        items: items.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
        shippingAddress: {
          fullName: formData.fullName,
          mobile: formData.mobile,
          street: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          landmark: formData.landmark,
        },
        billingAddress: {
          fullName: formData.fullName,
          mobile: formData.mobile,
          street: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          landmark: formData.landmark,
        },
        paymentMethod: paymentMethod,
        customerNote: `Email: ${formData.email}${formData.alternatePhone ? `, Alt Phone: ${formData.alternatePhone}` : ""}`,
      };

      // Submit order to backend API
      const token = localStorage.getItem("token");
      const backendUrl =
        import.meta.env.VITE_BACKEND_URL || "http://localhost:5001";

      const response = await fetch(`${backendUrl}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(orderPayload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to place order");
      }

      const savedOrder = result.data.order;

      // Generate QR code for the actual order ID
      const qrCodeData = await generateQRCode(savedOrder.orderId);

      const orderData = {
        orderId: savedOrder.orderId,
        invoiceId:
          savedOrder.invoice?.invoiceId || `INV${savedOrder.orderId.slice(-6)}`,
        items: [...items],
        customerDetails: { ...formData },
        orderSummary: {
          subtotal: savedOrder.subtotal,
          shipping: savedOrder.shippingCharges,
          tax: savedOrder.tax,
          total: savedOrder.totalAmount,
        },
        orderDate: new Date(savedOrder.createdAt).toLocaleDateString(),
        orderTime: new Date(savedOrder.createdAt).toLocaleTimeString(),
        status: savedOrder.orderStatus,
        paymentMethod: savedOrder.paymentMethod,
        paymentStatus: savedOrder.paymentStatus,
        qrCode: qrCodeData,
        backendOrder: savedOrder,
      };

      setOrderDetails(orderData);
      setQrCode(qrCodeData);
      setShowOrderModal(true);
    } catch (error) {
      console.error("Order placement error:", error);
      alert(
        `Failed to place order: ${error.message}. Please try again or contact support.`,
      );
    }
  };

  const handleOrderConfirm = () => {
    setShowOrderModal(false);
    setShowInvoiceModal(true);
  };

  const generatePDFInvoice = async () => {
    if (!orderDetails) return;

    setPdfGenerating(true);
    try {
      // Create invoice data for the professional component
      const invoiceData = {
        invoiceId: orderDetails.invoiceId,
        orderId: orderDetails.orderId,
        orderDate: orderDetails.orderDate,
        orderTime: orderDetails.orderTime,
        customerDetails: {
          fullName: formData.fullName,
          email: formData.email,
          mobile: formData.mobile,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
        },
        items: items,
        subtotal: totalAmount,
        shipping: shippingCost,
        tax: taxAmount,
        total: finalTotal,
        paymentMethod:
          paymentMethod === "cod"
            ? "Cash on Delivery"
            : paymentMethod === "online"
              ? "Online Payment"
              : "UPI Payment",
        paymentStatus: "Pending",
        status: "Pending",
      };

      // Create a temporary div and render the professional invoice
      const invoiceElement = document.createElement("div");
      invoiceElement.style.position = "absolute";
      invoiceElement.style.left = "-9999px";
      invoiceElement.style.top = "0";
      invoiceElement.style.width = "210mm";
      invoiceElement.style.backgroundColor = "white";
      document.body.appendChild(invoiceElement);

      // Create React element and render it
      const React = await import("react");
      const { createRoot } = await import("react-dom/client");

      const root = createRoot(invoiceElement);
      root.render(
        React.createElement(OfficialInvoiceDesign, {
          invoiceData: { ...invoiceData, qrCode: qrCode },
          qrCode: qrCode,
          forPrint: true,
        }),
      );

      // Wait for rendering
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Use centralized PDF service
      const result = await pdfService.generateInvoicePDF(
        invoiceElement,
        invoiceData,
        {
          filename: `Invoice-${orderDetails.invoiceId}.pdf`,
          onProgress: (message, progress) => {
            console.log(`PDF Generation: ${message} (${progress}%)`);
          },
        },
      );

      if (!result.success) {
        throw new Error(result.error);
      }

      // Clean up
      root.unmount();
      document.body.removeChild(invoiceElement);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF. Please try again.");
    } finally {
      setPdfGenerating(false);
    }
  };

  const createColorfulInvoiceHTML = () => {
    if (!orderDetails) return "";

    return `
      <div style="font-family: Arial, sans-serif; padding: 20px; background: white; max-width: 210mm; margin: 0 auto;">
        <!-- Header Section - Colorful Design -->
        <div style="background: linear-gradient(135deg, #ff6b6b 0%, #e74c3c 100%); color: white; padding: 25px; border-radius: 15px 15px 0 0; margin-bottom: 0;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <!-- Left Side - Company Info -->
            <div style="flex: 1;">
              <div style="display: flex; align-items: center; margin-bottom: 15px;">
                <img src="https://cdn.builder.io/api/v1/assets/ec4b3f82f1ac4275b8bfc1756fcac420/invoice_hkm12345678-1-e0e726" alt="Logo" style="height: 70px; width: auto; margin-right: 20px; background: white; padding: 10px; border-radius: 10px;" onerror="this.src='https://via.placeholder.com/70x70?text=HKM';" />
                <div>
                  <h1 style="font-size: 28px; font-weight: bold; margin: 0; line-height: 1.2; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">HARE KRISHNA MEDICAL</h1>
                  <p style="font-size: 14px; margin: 5px 0; opacity: 0.9;">Your Trusted Health Partner</p>
                </div>
              </div>
              <div style="font-size: 12px; line-height: 1.6; opacity: 0.95;">
                <div>📍 3 Sahyog Complex, Man Sarovar circle</div>
                <div>🏙️ Amroli, 394107, Gujarat, India</div>
                <div>📞 +91 76989 13354 | +91 91060 18508</div>
                <div>📧 hkmedicalamroli@gmail.com</div>
              </div>
            </div>
            <!-- Right Side - Invoice Info -->
            <div style="text-align: right; min-width: 250px;">
              <h1 style="font-size: 42px; font-weight: bold; margin: 0 0 20px 0; text-shadow: 3px 3px 6px rgba(0,0,0,0.3);">INVOICE</h1>
              <div style="background: rgba(255,255,255,0.95); color: #333; padding: 20px; border-radius: 10px; font-size: 13px; text-align: left; box-shadow: 0 4px 8px rgba(0,0,0,0.2);">
                <div style="margin-bottom: 8px;"><strong style="color: #e74c3c;">Invoice No:</strong> ${orderDetails.invoiceId}</div>
                <div style="margin-bottom: 8px;"><strong style="color: #e74c3c;">Order No:</strong> ${orderDetails.orderId}</div>
                <div style="margin-bottom: 8px;"><strong style="color: #e74c3c;">Date:</strong> ${orderDetails.orderDate}</div>
                <div style="margin-bottom: 8px;"><strong style="color: #e74c3c;">Time:</strong> ${orderDetails.orderTime}</div>
                <div><strong style="color: #e74c3c;">Status:</strong> <span style="background: #ffc107; color: black; padding: 3px 8px; border-radius: 12px; font-size: 11px;">Pending</span></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Customer Information Section - Colorful -->
        <div style="display: flex; gap: 20px; margin-bottom: 25px; margin-top: 0;">
          <!-- Bill To - Blue Theme -->
          <div style="flex: 1; background: linear-gradient(135deg, #3498db 0%, #2980b9 100%); color: white; padding: 20px; border-radius: 0 0 0 15px;">
            <h3 style="font-size: 16px; font-weight: bold; margin: 0 0 15px 0; text-transform: uppercase; text-shadow: 1px 1px 2px rgba(0,0,0,0.3);">📍 BILL TO:</h3>
            <div style="font-size: 13px; line-height: 1.8;">
              <div style="font-weight: bold; margin-bottom: 8px; font-size: 15px;">${formData.fullName}</div>
              <div>📧 ${formData.email}</div>
              <div>📱 ${formData.mobile}</div>
              <div>🏠 ${formData.address}</div>
              <div>🏙️ ${formData.city}, ${formData.state} ${formData.pincode}</div>
            </div>
          </div>
          <!-- Ship To - Green Theme -->
          <div style="flex: 1; background: linear-gradient(135deg, #27ae60 0%, #229954 100%); color: white; padding: 20px; border-radius: 0 0 15px 0;">
            <h3 style="font-size: 16px; font-weight: bold; margin: 0 0 15px 0; text-transform: uppercase; text-shadow: 1px 1px 2px rgba(0,0,0,0.3);">�� SHIP TO:</h3>
            <div style="font-size: 13px; line-height: 1.8;">
              <div style="font-weight: bold; margin-bottom: 8px; font-size: 15px;">${formData.fullName}</div>
              <div>🏠 ${formData.address}</div>
              <div>🏙️ ${formData.city}, ${formData.state} ${formData.pincode}</div>
              <div style="margin-top: 12px;"><strong>💳 Payment:</strong> ${paymentMethod === "cod" ? "Cash on Delivery" : paymentMethod === "online" ? "Online Payment" : "UPI Payment"}</div>
              <div><strong>✅ Status:</strong> <span style="background: rgba(255,255,255,0.2); padding: 2px 6px; border-radius: 8px;">Paid</span></div>
            </div>
          </div>
        </div>

        <!-- Items Table - Colorful Design -->
        <div style="margin-bottom: 25px;">
          <div style="background: linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%); color: white; padding: 15px 25px; font-size: 18px; font-weight: bold; text-align: center; text-shadow: 1px 1px 2px rgba(0,0,0,0.3);">🛒 ORDERED ITEMS</div>
          <table style="width: 100%; border-collapse: collapse; border: 3px solid #9b59b6;">
            <thead>
              <tr style="background: linear-gradient(135deg, #f39c12 0%, #e67e22 100%); color: white;">
                <th style="border: 2px solid #e67e22; padding: 15px 10px; font-size: 13px; font-weight: bold; text-align: center; text-shadow: 1px 1px 2px rgba(0,0,0,0.3);">S.No</th>
                <th style="border: 2px solid #e67e22; padding: 15px 10px; font-size: 13px; font-weight: bold; text-align: left; text-shadow: 1px 1px 2px rgba(0,0,0,0.3);">🏥 Description</th>
                <th style="border: 2px solid #e67e22; padding: 15px 10px; font-size: 13px; font-weight: bold; text-align: center; text-shadow: 1px 1px 2px rgba(0,0,0,0.3);">Qty</th>
                <th style="border: 2px solid #e67e22; padding: 15px 10px; font-size: 13px; font-weight: bold; text-align: right; text-shadow: 1px 1px 2px rgba(0,0,0,0.3);">💰 Price (₹)</th>
                <th style="border: 2px solid #e67e22; padding: 15px 10px; font-size: 13px; font-weight: bold; text-align: right; text-shadow: 1px 1px 2px rgba(0,0,0,0.3);">💵 Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              ${items
                .map(
                  (item, index) => `
                <tr style="background-color: ${index % 2 === 0 ? "#f8f9fa" : "white"};">
                  <td style="border: 1px solid #ddd; padding: 12px 8px; font-size: 12px; text-align: center; font-weight: bold; color: #9b59b6;">${index + 1}</td>
                  <td style="border: 1px solid #ddd; padding: 12px 8px; font-size: 12px;">
                    <div style="font-weight: bold; color: #2c3e50; margin-bottom: 4px;">${item.name}</div>
                    <div style="color: #7f8c8d; font-size: 11px; font-style: italic;">🏢 ${item.company || "Medical Product"}</div>
                  </td>
                  <td style="border: 1px solid #ddd; padding: 12px 8px; font-size: 12px; text-align: center;">
                    <span style="background: #3498db; color: white; padding: 4px 8px; border-radius: 12px; font-size: 11px; font-weight: bold;">${item.quantity}</span>
                  </td>
                  <td style="border: 1px solid #ddd; padding: 12px 8px; font-size: 12px; text-align: right; color: #27ae60; font-weight: bold;">₹${item.price.toFixed(2)}</td>
                  <td style="border: 1px solid #ddd; padding: 12px 8px; font-size: 13px; text-align: right; font-weight: bold; color: #e74c3c;">₹${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              `,
                )
                .join("")}
            </tbody>
          </table>
        </div>

        <!-- Totals Section - Colorful -->
        <div style="display: flex; justify-content: flex-end; margin-bottom: 25px;">
          <div style="min-width: 350px;">
            <table style="width: 100%; border-collapse: collapse; border: 3px solid #e74c3c; border-radius: 10px; overflow: hidden;">
              <tbody>
                <tr>
                  <td style="background: linear-gradient(135deg, #ecf0f1 0%, #bdc3c7 100%); border: 1px solid #bdc3c7; padding: 12px 15px; font-size: 13px; font-weight: bold; color: #2c3e50;">📊 Subtotal:</td>
                  <td style="background: #ecf0f1; border: 1px solid #bdc3c7; padding: 12px 15px; font-size: 13px; text-align: right; color: #2c3e50; font-weight: bold;">₹${totalAmount.toFixed(2)}</td>
                </tr>
                <tr>
                  <td style="background: linear-gradient(135deg, #d5f4e6 0%, #a2d9ce 100%); border: 1px solid #a2d9ce; padding: 12px 15px; font-size: 13px; font-weight: bold; color: #27ae60;">🚚 Shipping:</td>
                  <td style="background: #d5f4e6; border: 1px solid #a2d9ce; padding: 12px 15px; font-size: 13px; text-align: right; color: #27ae60; font-weight: bold;">${shippingCost === 0 ? "FREE 🎉" : `₹${shippingCost.toFixed(2)}`}</td>
                </tr>
                <tr>
                  <td style="background: linear-gradient(135deg, #fdeaa7 0%, #f39c12 100%); border: 1px solid #f39c12; padding: 12px 15px; font-size: 13px; font-weight: bold; color: #f39c12;">📋 Tax:</td>
                  <td style="background: #fdeaa7; border: 1px solid #f39c12; padding: 12px 15px; font-size: 13px; text-align: right; color: #f39c12; font-weight: bold;">Included in product price</td>
                </tr>
                <tr>
                  <td style="background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%); border: 3px solid #c0392b; padding: 18px 15px; font-size: 16px; font-weight: bold; color: #fff; text-shadow: 1px 1px 2px rgba(0,0,0,0.3);">💎 TOTAL:</td>
                  <td style="background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%); border: 3px solid #c0392b; padding: 18px 15px; font-size: 18px; text-align: right; font-weight: bold; color: #fff; text-shadow: 1px 1px 2px rgba(0,0,0,0.3);">₹${finalTotal.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Footer Section - Colorful -->
        <div style="background: linear-gradient(135deg, #34495e 0%, #2c3e50 100%); color: white; padding: 25px; border-radius: 15px; margin-bottom: 20px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div style="flex: 1;">
              <h4 style="font-size: 18px; font-weight: bold; margin: 0 0 15px 0; text-shadow: 1px 1px 2px rgba(0,0,0,0.3);">🙏 Thank You for Your Business! 🙏</h4>
              <div style="font-size: 12px; line-height: 1.8;">
                <div style="margin-bottom: 10px;"><strong style="color: #f39c12;">📋 Terms & Conditions:</strong></div>
                <div>✅ Payment due within 30 days</div>
                <div>❌ Goods once sold will not be taken back</div>
                <div>⚖️ Subject to Gujarat jurisdiction only</div>
                <div style="margin-top: 12px;"><strong style="color: #3498db;">📞 Contact:</strong> hkmedicalamroli@gmail.com | +91 76989 13354</div>
              </div>
            </div>
            <div style="text-align: center; margin-left: 25px;">
              <div style="width: 90px; height: 90px; border: 3px solid #3498db; border-radius: 10px; padding: 5px; background: white; display: flex; align-items: center; justify-content: center; color: #333; font-weight: bold;">QR CODE</div>
              <div style="font-size: 11px; margin-top: 8px; color: #ecf0f1;">📱 Scan for Online Verification</div>
            </div>
          </div>
        </div>

        <!-- Computer Generated Note -->
        <div style="text-align: center; margin-top: 25px; font-size: 11px; color: #7f8c8d; background: #ecf0f1; padding: 12px; border-radius: 8px; border: 1px solid #bdc3c7;">
          🖥️ This is a computer generated invoice. No physical signature required.<br />
          📅 Generated on: ${new Date().toLocaleString()}
        </div>
      </div>
    `;
  };

  const handleViewOnlineInvoice = () => {
    if (orderDetails) {
      const invoiceUrl = `/invoice/${orderDetails.orderId}`;
      navigate(invoiceUrl);
    }
  };

  const handleInvoiceClose = () => {
    setShowInvoiceModal(false);
    dispatch(clearCart());
    navigate("/");
  };

  return (
    <div className="fade-in">
      {/* Order Form */}
      <section className="section-padding">
        <Container>
          <Row>
            <Col lg={12} className="mb-4">
              <h2>Place Your Order</h2>
              <p className="text-muted">
                Please provide your details to complete the order
              </p>
            </Col>
          </Row>

          <Form onSubmit={handlePlaceOrder}>
            <Row>
              {/* Customer Details */}
              <Col lg={8} className="mb-4">
                <Card className="medical-card">
                  <Card.Header className="bg-medical-light">
                    <h5 className="mb-0">
                      <i className="bi bi-person me-2"></i>
                      Customer Details
                    </h5>
                  </Card.Header>
                  <Card.Body>
                    {!isAuthenticated && (
                      <Alert variant="info" className="mb-4">
                        <i className="bi bi-info-circle me-2"></i>
                        Please provide your details for order processing. You
                        can{" "}
                        <Link to="/register" className="alert-link">
                          create an account
                        </Link>{" "}
                        for faster checkout in future.
                      </Alert>
                    )}

                    <Row>
                      <Col md={6} className="mb-3">
                        <Form.Label>
                          Full Name <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          isInvalid={!!errors.fullName}
                          placeholder="Enter your full name"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.fullName}
                        </Form.Control.Feedback>
                      </Col>
                      <Col md={6} className="mb-3">
                        <Form.Label>
                          Email Address <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          isInvalid={!!errors.email}
                          placeholder="Enter your email"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.email}
                        </Form.Control.Feedback>
                      </Col>
                      <Col md={6} className="mb-3">
                        <Form.Label>
                          Mobile Number <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="tel"
                          name="mobile"
                          value={formData.mobile}
                          onChange={handleInputChange}
                          isInvalid={!!errors.mobile}
                          placeholder="Enter mobile number"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.mobile}
                        </Form.Control.Feedback>
                      </Col>
                      <Col md={6} className="mb-3">
                        <Form.Label>Alternate Phone</Form.Label>
                        <Form.Control
                          type="tel"
                          name="alternatePhone"
                          value={formData.alternatePhone}
                          onChange={handleInputChange}
                          placeholder="Alternate phone (optional)"
                        />
                      </Col>
                      <Col md={12} className="mb-3">
                        <Form.Label>
                          Address <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          isInvalid={!!errors.address}
                          placeholder="Enter complete address"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.address}
                        </Form.Control.Feedback>
                      </Col>
                      <Col md={6} className="mb-3">
                        <Form.Label>
                          Pincode <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="pincode"
                          value={formData.pincode}
                          onChange={handleInputChange}
                          isInvalid={!!errors.pincode}
                          placeholder="Enter pincode"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.pincode}
                        </Form.Control.Feedback>
                      </Col>
                      <Col md={6} className="mb-3">
                        <Form.Label>Landmark</Form.Label>
                        <Form.Control
                          type="text"
                          name="landmark"
                          value={formData.landmark}
                          onChange={handleInputChange}
                          placeholder="Nearby landmark (optional)"
                        />
                      </Col>
                      <Col md={6} className="mb-3">
                        <Form.Label>
                          City <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          isInvalid={!!errors.city}
                          placeholder="Enter city"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.city}
                        </Form.Control.Feedback>
                      </Col>
                      <Col md={6} className="mb-3">
                        <Form.Label>
                          State <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          isInvalid={!!errors.state}
                          placeholder="Enter state"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.state}
                        </Form.Control.Feedback>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>

              {/* Order Summary */}
              <Col lg={4}>
                <div style={{ position: "sticky", top: "120px", zIndex: 10 }}>
                  <Card className="medical-card">
                    <Card.Header className="bg-medical-light">
                      <h5 className="mb-0">
                        <i className="bi bi-receipt me-2"></i>
                        Order Summary
                      </h5>
                    </Card.Header>
                    <Card.Body>
                      {/* Items List */}
                      <div className="order-items mb-3">
                        {items.map((item) => (
                          <div
                            key={item.id}
                            className="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom"
                          >
                            <div className="flex-grow-1">
                              <h6 className="mb-0 small">{item.name}</h6>
                              <small className="text-muted">
                                Qty: {item.quantity} × ₹{item.price}
                              </small>
                            </div>
                            <span className="fw-bold">
                              ₹{(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Price Breakdown */}
                      <div className="order-totals">
                        <div className="d-flex justify-content-between mb-2">
                          <span>Subtotal</span>
                          <span>₹{totalAmount.toFixed(2)}</span>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                          <span>Shipping</span>
                          <span className="text-success fw-bold">FREE</span>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                          <span>Tax</span>
                          <span className="text-success fw-bold">
                            Included in product price
                          </span>
                        </div>
                        <hr />
                        <div className="d-flex justify-content-between mb-3">
                          <strong>Total</strong>
                          <strong className="text-medical-red">
                            ₹{finalTotal.toFixed(2)}
                          </strong>
                        </div>
                      </div>

                      {/* Payment Method Selection */}
                      <div className="mb-4">
                        <PaymentOptions
                          selectedMethod={paymentMethod}
                          onMethodChange={setPaymentMethod}
                          compact={false}
                        />

                        {(paymentMethod === "online" ||
                          paymentMethod === "upi") && (
                          <Alert variant="info" className="mt-3">
                            <div className="d-flex align-items-start">
                              <i className="bi bi-info-circle me-2 mt-1"></i>
                              <div>
                                <h6 className="mb-2">
                                  Online Payment Instructions
                                </h6>
                                <p className="mb-2">
                                  For credit card or online payment assistance,
                                  please contact our medical store directly:
                                </p>
                                <div className="contact-info">
                                  <div>
                                    <strong>📞 Phone:</strong> +91 76989 13354 |
                                    +91 91060 18508
                                  </div>
                                  <div>
                                    <strong>📧 Email:</strong>{" "}
                                    hkmedicalamroli@gmail.com
                                  </div>
                                  <div>
                                    <strong>🏠 Address:</strong> 3 Sahyog
                                    Complex, Man Sarovar circle, Amroli, 394107
                                  </div>
                                </div>
                                <p className="mb-0 mt-2 small">
                                  <strong>Note:</strong> Our team will guide you
                                  through the secure payment process and ensure
                                  your transaction is completed safely.
                                </p>
                              </div>
                            </div>
                          </Alert>
                        )}
                      </div>

                      {/* Place Order Button */}
                      <div className="d-grid gap-2">
                        <Button
                          type="submit"
                          className="btn-medical-primary"
                          size="lg"
                        >
                          <i className="bi bi-check-circle me-2"></i>
                          Place Order
                        </Button>
                        <Button
                          as={Link}
                          to="/cart"
                          variant="outline-secondary"
                          className="btn-medical-outline"
                        >
                          <i className="bi bi-arrow-left me-2"></i>
                          Back to Cart
                        </Button>
                      </div>

                      <div className="mt-3 text-center">
                        <small className="text-muted">
                          <i className="bi bi-shield-check me-1"></i>
                          Your order is secure and protected
                        </small>
                      </div>
                    </Card.Body>
                  </Card>
                </div>
              </Col>
            </Row>
          </Form>
        </Container>
      </section>

      {/* Order Confirmation Modal */}
      <Modal
        show={showOrderModal}
        onHide={() => {}}
        centered
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header>
          <Modal.Title>Order Inquiry Sent!</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <i className="bi bi-check-circle-fill text-success display-1 mb-3"></i>
          <h5>Thank You for Your Order!</h5>
          <p className="text-muted">
            Your order inquiry has been sent to our medical store. We will
            contact you very soon to confirm your order and arrange delivery.
          </p>
          <div className="alert alert-info">
            <strong>Order ID:</strong> {orderDetails?.orderId}
          </div>
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button className="btn-medical-primary" onClick={handleOrderConfirm}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Invoice Modal */}
      <Modal
        show={showInvoiceModal}
        onHide={() => {}}
        size="lg"
        centered
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header>
          <Modal.Title>
            <i className="bi bi-receipt me-2"></i>
            Order Invoice Generated
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <div className="mb-4">
            <i className="bi bi-file-pdf display-1 text-medical-red mb-3"></i>
            <h5>Invoice Ready for Download</h5>
            <p className="text-muted">
              Your invoice has been generated successfully. You can download it
              as a PDF or view it online.
            </p>

            {qrCode && (
              <div className="my-4">
                <img
                  src={qrCode}
                  alt="QR Code"
                  style={{ width: "150px", height: "150px" }}
                  className="border rounded"
                />
                <p className="text-muted mt-2">
                  <small>
                    <i className="bi bi-qr-code me-1"></i>
                    Scan this QR code to view invoice online
                  </small>
                </p>
              </div>
            )}

            <div className="alert alert-info">
              <strong>Invoice ID:</strong> {orderDetails?.invoiceId}
              <br />
              <strong>Order ID:</strong> {orderDetails?.orderId}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <div className="d-flex gap-2 flex-wrap justify-content-center">
            <Button
              variant="outline-primary"
              onClick={generatePDFInvoice}
              disabled={pdfGenerating}
              className="btn-medical-outline"
            >
              {pdfGenerating ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Generating...
                </>
              ) : (
                <>
                  <i className="bi bi-download me-2"></i>
                  Download PDF
                </>
              )}
            </Button>

            <Button
              className="btn-medical-primary"
              onClick={handleInvoiceClose}
            >
              <i className="bi bi-house me-2"></i>
              Continue Shopping
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Order;
