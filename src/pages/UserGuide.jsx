import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Nav,
  Tab,
  Badge,
  Button,
  Accordion,
  Table,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const UserGuide = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const isAdmin = user?.role === 1;
  const isUser = isAuthenticated && user?.role === 0;

  return (
    <div className="section-padding">
      <Container>
        <Row>
          <Col lg={12}>
            <div className="text-center mb-5">
              <h1 className="section-title">User Guide & Instructions</h1>
              <p className="section-subtitle">
                Comprehensive guide for navigating and using Hare Krishna
                Medical website
              </p>
              {isAuthenticated ? (
                <Badge bg={isAdmin ? "danger" : "primary"} className="fs-6">
                  {isAdmin ? "Admin User" : "Regular User"}
                </Badge>
              ) : (
                <Badge bg="secondary" className="fs-6">
                  Visitor
                </Badge>
              )}
            </div>
          </Col>
        </Row>

        <Row>
          <Col lg={12}>
            <Card className="medical-card">
              <Card.Body className="p-0">
                <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
                  <Nav variant="tabs" className="border-bottom">
                    <Nav.Item>
                      <Nav.Link eventKey="overview">Overview</Nav.Link>
                    </Nav.Item>
                    {!isAuthenticated && (
                      <Nav.Item>
                        <Nav.Link eventKey="visitor">Visitor Guide</Nav.Link>
                      </Nav.Item>
                    )}
                    {isUser && (
                      <Nav.Item>
                        <Nav.Link eventKey="user">User Guide</Nav.Link>
                      </Nav.Item>
                    )}
                    {isAdmin && (
                      <Nav.Item>
                        <Nav.Link eventKey="admin">Admin Guide</Nav.Link>
                      </Nav.Item>
                    )}
                    <Nav.Item>
                      <Nav.Link eventKey="features">All Features</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="troubleshooting">Help & FAQ</Nav.Link>
                    </Nav.Item>
                  </Nav>

                  <Tab.Content className="p-4">
                    <Tab.Pane eventKey="overview">
                      <h3 className="text-medical-red mb-4">
                        Welcome to Hare Krishna Medical
                      </h3>

                      <div className="overview-section mb-4">
                        <h5>🏥 About Our Platform</h5>
                        <p>
                          Hare Krishna Medical is a comprehensive online medical
                          store designed to provide easy access to healthcare
                          products and medicines. Our platform offers a
                          user-friendly experience for both customers and
                          administrators.
                        </p>
                      </div>

                      <div className="overview-section mb-4">
                        <h5>🎯 Key Features</h5>
                        <Row>
                          <Col md={4}>
                            <div className="feature-item">
                              <i className="bi bi-cart3 text-medical-red fs-3 mb-2"></i>
                              <h6>Easy Shopping</h6>
                              <p className="small text-muted">
                                Browse products, add to cart, and checkout
                                seamlessly
                              </p>
                            </div>
                          </Col>
                          <Col md={4}>
                            <div className="feature-item">
                              <i className="bi bi-shield-check text-medical-blue fs-3 mb-2"></i>
                              <h6>Secure Payments</h6>
                              <p className="small text-muted">
                                Multiple payment options including COD and
                                online payments
                              </p>
                            </div>
                          </Col>
                          <Col md={4}>
                            <div className="feature-item">
                              <i className="bi bi-truck text-success fs-3 mb-2"></i>
                              <h6>Order Tracking</h6>
                              <p className="small text-muted">
                                Real-time order status updates and delivery
                                tracking
                              </p>
                            </div>
                          </Col>
                        </Row>
                      </div>

                      <div className="overview-section">
                        <h5>🚀 Getting Started</h5>
                        <div className="getting-started-steps">
                          {!isAuthenticated ? (
                            <>
                              <div className="step-item">
                                <Badge bg="primary" className="me-2">
                                  1
                                </Badge>
                                <span>
                                  <Link
                                    to="/register"
                                    className="text-decoration-none"
                                  >
                                    Create an account
                                  </Link>{" "}
                                  or{" "}
                                  <Link
                                    to="/login"
                                    className="text-decoration-none"
                                  >
                                    login
                                  </Link>{" "}
                                  to get started
                                </span>
                              </div>
                              <div className="step-item">
                                <Badge bg="primary" className="me-2">
                                  2
                                </Badge>
                                <span>
                                  Browse our{" "}
                                  <Link
                                    to="/products"
                                    className="text-decoration-none"
                                  >
                                    product catalog
                                  </Link>{" "}
                                  and add items to cart
                                </span>
                              </div>
                              <div className="step-item">
                                <Badge bg="primary" className="me-2">
                                  3
                                </Badge>
                                <span>
                                  Proceed to checkout and choose your payment
                                  method
                                </span>
                              </div>
                              <div className="step-item">
                                <Badge bg="primary" className="me-2">
                                  4
                                </Badge>
                                <span>
                                  Track your order and download invoices from
                                  your dashboard
                                </span>
                              </div>
                            </>
                          ) : isUser ? (
                            <>
                              <div className="step-item">
                                <Badge bg="success" className="me-2">
                                  ✓
                                </Badge>
                                <span>
                                  You're logged in! Start browsing products
                                </span>
                              </div>
                              <div className="step-item">
                                <Badge bg="primary" className="me-2">
                                  →
                                </Badge>
                                <span>
                                  Visit your{" "}
                                  <Link
                                    to="/user/dashboard"
                                    className="text-decoration-none"
                                  >
                                    dashboard
                                  </Link>{" "}
                                  to manage orders and profile
                                </span>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="step-item">
                                <Badge bg="danger" className="me-2">
                                  ⚡
                                </Badge>
                                <span>
                                  Admin Dashboard: Manage all aspects of the
                                  store
                                </span>
                              </div>
                              <div className="step-item">
                                <Badge bg="primary" className="me-2">
                                  →
                                </Badge>
                                <span>
                                  Access your{" "}
                                  <Link
                                    to="/admin/dashboard"
                                    className="text-decoration-none"
                                  >
                                    admin panel
                                  </Link>{" "}
                                  to manage products, orders, and users
                                </span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </Tab.Pane>

                    {!isAuthenticated && (
                      <Tab.Pane eventKey="visitor">
                        <h3 className="text-medical-red mb-4">Visitor Guide</h3>

                        <Accordion defaultActiveKey="0">
                          <Accordion.Item eventKey="0">
                            <Accordion.Header>
                              🏠 Homepage Navigation
                            </Accordion.Header>
                            <Accordion.Body>
                              <ul>
                                <li>
                                  <strong>Featured Products:</strong> View
                                  highlighted medical products on the homepage
                                </li>
                                <li>
                                  <strong>Categories:</strong> Browse products
                                  by medical categories
                                </li>
                                <li>
                                  <strong>Search:</strong> Use the search bar to
                                  find specific products
                                </li>
                                <li>
                                  <strong>Navigation Menu:</strong> Access
                                  Products, About Us, and Contact pages
                                </li>
                              </ul>
                            </Accordion.Body>
                          </Accordion.Item>

                          <Accordion.Item eventKey="1">
                            <Accordion.Header>
                              🛒 Shopping as Guest
                            </Accordion.Header>
                            <Accordion.Body>
                              <ul>
                                <li>
                                  <strong>Browse Products:</strong> View all
                                  available medicines and medical products
                                </li>
                                <li>
                                  <strong>Product Details:</strong> Click on any
                                  product to see detailed information
                                </li>
                                <li>
                                  <strong>Add to Cart:</strong> Add products to
                                  cart (requires login to checkout)
                                </li>
                                <li>
                                  <strong>Price Information:</strong> View
                                  current prices and discounts
                                </li>
                              </ul>
                              <div className="alert alert-info mt-3">
                                <strong>Note:</strong> You need to{" "}
                                <Link to="/register">create an account</Link> to
                                complete purchases and track orders.
                              </div>
                            </Accordion.Body>
                          </Accordion.Item>

                          <Accordion.Item eventKey="2">
                            <Accordion.Header>
                              📝 Account Creation
                            </Accordion.Header>
                            <Accordion.Body>
                              <ol>
                                <li>
                                  Click <Link to="/register">"Register"</Link>{" "}
                                  in the header
                                </li>
                                <li>
                                  Fill in your personal information:
                                  <ul>
                                    <li>Full Name</li>
                                    <li>Email Address</li>
                                    <li>Mobile Number</li>
                                    <li>Password (minimum 6 characters)</li>
                                  </ul>
                                </li>
                                <li>Accept terms and conditions</li>
                                <li>Click "Create Account"</li>
                                <li>You'll be automatically logged in</li>
                              </ol>
                            </Accordion.Body>
                          </Accordion.Item>

                          <Accordion.Item eventKey="3">
                            <Accordion.Header>
                              💬 Contact & Support
                            </Accordion.Header>
                            <Accordion.Body>
                              <ul>
                                <li>
                                  <strong>Contact Form:</strong> Use the{" "}
                                  <Link to="/contact">contact page</Link> to
                                  send messages
                                </li>
                                <li>
                                  <strong>Email:</strong>{" "}
                                  harekrishnamedical@gmail.com
                                </li>
                                <li>
                                  <strong>Phone:</strong> +91 76989 13354
                                </li>
                                <li>
                                  <strong>Address:</strong> 3 Sahyog Complex,
                                  Man Sarovar circle, Amroli, 394107
                                </li>
                              </ul>
                              <div className="alert alert-success mt-3">
                                <strong>Response Time:</strong> We typically
                                respond to messages within 24 hours.
                              </div>
                            </Accordion.Body>
                          </Accordion.Item>
                        </Accordion>
                      </Tab.Pane>
                    )}

                    {isUser && (
                      <Tab.Pane eventKey="user">
                        <h3 className="text-medical-red mb-4">
                          User Dashboard Guide
                        </h3>

                        <Accordion defaultActiveKey="0">
                          <Accordion.Item eventKey="0">
                            <Accordion.Header>
                              🏠 Dashboard Overview
                            </Accordion.Header>
                            <Accordion.Body>
                              <p>
                                Your{" "}
                                <Link to="/user/dashboard">user dashboard</Link>{" "}
                                provides:
                              </p>
                              <ul>
                                <li>
                                  <strong>Order Summary:</strong> View your
                                  recent orders and their status
                                </li>
                                <li>
                                  <strong>Quick Actions:</strong> Fast access to
                                  orders, invoices, and profile
                                </li>
                                <li>
                                  <strong>Account Statistics:</strong> Total
                                  orders, amount spent, and saved items
                                </li>
                                <li>
                                  <strong>Recent Activity:</strong> Latest
                                  interactions with the store
                                </li>
                              </ul>
                            </Accordion.Body>
                          </Accordion.Item>

                          <Accordion.Item eventKey="1">
                            <Accordion.Header>
                              🛒 Shopping & Orders
                            </Accordion.Header>
                            <Accordion.Body>
                              <h6>Making a Purchase:</h6>
                              <ol>
                                <li>Browse products and add to cart</li>
                                <li>
                                  Go to <Link to="/cart">cart</Link> and review
                                  items
                                </li>
                                <li>Proceed to checkout</li>
                                <li>Choose payment method (COD or Online)</li>
                                <li>Confirm order placement</li>
                              </ol>

                              <h6 className="mt-3">Order Management:</h6>
                              <ul>
                                <li>
                                  <strong>View Orders:</strong> Access{" "}
                                  <Link to="/user/orders">all your orders</Link>
                                </li>
                                <li>
                                  <strong>Track Status:</strong> Monitor order
                                  progress (Pending → Confirmed → Shipped →
                                  Delivered)
                                </li>
                                <li>
                                  <strong>Order Details:</strong> Click order ID
                                  to see detailed information
                                </li>
                                <li>
                                  <strong>Reorder:</strong> Quickly reorder
                                  previous purchases
                                </li>
                              </ul>
                            </Accordion.Body>
                          </Accordion.Item>

                          <Accordion.Item eventKey="2">
                            <Accordion.Header>
                              📄 Invoices & Documents
                            </Accordion.Header>
                            <Accordion.Body>
                              <p>
                                Manage your invoices from{" "}
                                <Link to="/user/invoices">
                                  invoices section
                                </Link>
                                :
                              </p>
                              <ul>
                                <li>
                                  <strong>View All Invoices:</strong> See
                                  complete invoice history
                                </li>
                                <li>
                                  <strong>Download PDF:</strong> Get individual
                                  invoice PDFs
                                </li>
                                <li>
                                  <strong>Bulk Download:</strong> Download all
                                  invoices in one PDF file
                                </li>
                                <li>
                                  <strong>Online View:</strong> View invoices in
                                  browser
                                </li>
                                <li>
                                  <strong>Search & Filter:</strong> Find
                                  specific invoices by date or ID
                                </li>
                              </ul>

                              <div className="alert alert-info">
                                <strong>Tip:</strong> Click on any Order ID to
                                view detailed order information with download
                                options.
                              </div>
                            </Accordion.Body>
                          </Accordion.Item>

                          <Accordion.Item eventKey="3">
                            <Accordion.Header>
                              👤 Profile Management
                            </Accordion.Header>
                            <Accordion.Body>
                              <p>
                                Update your profile information in{" "}
                                <Link to="/user/profile">profile settings</Link>
                                :
                              </p>

                              <h6>Personal Information:</h6>
                              <ul>
                                <li>Update name and contact details</li>
                                <li>Upload profile picture</li>
                                <li>Change address information</li>
                              </ul>

                              <h6>Security Settings:</h6>
                              <ul>
                                <li>Change password</li>
                                <li>Enable two-factor authentication</li>
                                <li>Review login history</li>
                              </ul>

                              <div className="alert alert-warning">
                                <strong>Security Note:</strong> For security
                                reasons, email and mobile number changes require
                                admin approval.
                              </div>
                            </Accordion.Body>
                          </Accordion.Item>
                        </Accordion>
                      </Tab.Pane>
                    )}

                    {isAdmin && (
                      <Tab.Pane eventKey="admin">
                        <h3 className="text-medical-red mb-4">
                          Admin Panel Guide
                        </h3>

                        <Accordion defaultActiveKey="0">
                          <Accordion.Item eventKey="0">
                            <Accordion.Header>
                              📊 Dashboard Management
                            </Accordion.Header>
                            <Accordion.Body>
                              <p>
                                Your{" "}
                                <Link to="/admin/dashboard">
                                  admin dashboard
                                </Link>{" "}
                                provides comprehensive overview:
                              </p>

                              <h6>Key Metrics:</h6>
                              <ul>
                                <li>
                                  <strong>Total Orders:</strong> Current order
                                  count and monthly growth
                                </li>
                                <li>
                                  <strong>Revenue:</strong> Total revenue and
                                  growth trends
                                </li>
                                <li>
                                  <strong>Products:</strong> Total products and
                                  low stock alerts
                                </li>
                                <li>
                                  <strong>Messages:</strong> Unread customer
                                  messages with notifications
                                </li>
                              </ul>

                              <h6>Quick Actions:</h6>
                              <ul>
                                <li>
                                  <strong>Pending Orders:</strong> Direct access
                                  to orders needing attention
                                </li>
                                <li>
                                  <strong>Low Stock:</strong> Products requiring
                                  inventory updates
                                </li>
                                <li>
                                  <strong>Messages:</strong> Customer inquiries
                                  awaiting response
                                </li>
                                <li>
                                  <strong>Add Product:</strong> Quick product
                                  addition
                                </li>
                              </ul>
                            </Accordion.Body>
                          </Accordion.Item>

                          <Accordion.Item eventKey="1">
                            <Accordion.Header>
                              📦 Product Management
                            </Accordion.Header>
                            <Accordion.Body>
                              <p>
                                Manage your product catalog in{" "}
                                <Link to="/admin/products">
                                  products section
                                </Link>
                                :
                              </p>

                              <h6>Product Operations:</h6>
                              <ul>
                                <li>
                                  <strong>Add Products:</strong> Create new
                                  product listings
                                </li>
                                <li>
                                  <strong>Edit Products:</strong> Update
                                  existing product information
                                </li>
                                <li>
                                  <strong>Manage Stock:</strong> Update
                                  inventory levels
                                </li>
                                <li>
                                  <strong>Set Pricing:</strong> Adjust prices
                                  and discounts
                                </li>
                                <li>
                                  <strong>Categories:</strong> Organize products
                                  by medical categories
                                </li>
                              </ul>

                              <h6>Inventory Tracking:</h6>
                              <ul>
                                <li>
                                  <strong>Stock Alerts:</strong> Automatic low
                                  stock notifications
                                </li>
                                <li>
                                  <strong>Bulk Updates:</strong> Update multiple
                                  products at once
                                </li>
                                <li>
                                  <strong>Product Analytics:</strong> View sales
                                  performance by product
                                </li>
                              </ul>
                            </Accordion.Body>
                          </Accordion.Item>

                          <Accordion.Item eventKey="2">
                            <Accordion.Header>
                              🛒 Order Management
                            </Accordion.Header>
                            <Accordion.Body>
                              <p>
                                Process and track orders in{" "}
                                <Link to="/admin/orders">orders section</Link>:
                              </p>

                              <h6>Order Processing:</h6>
                              <ul>
                                <li>
                                  <strong>View All Orders:</strong> Complete
                                  order history with filters
                                </li>
                                <li>
                                  <strong>Update Status:</strong> Change order
                                  status (Pending → Confirmed → Shipped →
                                  Delivered)
                                </li>
                                <li>
                                  <strong>Payment Tracking:</strong> Monitor
                                  payment status (Paid, Unpaid, Partial)
                                </li>
                                <li>
                                  <strong>COD Management:</strong> Handle cash
                                  on delivery orders
                                </li>
                              </ul>

                              <h6>Order Details:</h6>
                              <ul>
                                <li>
                                  <strong>Customer Information:</strong> View
                                  customer details and delivery address
                                </li>
                                <li>
                                  <strong>Order Items:</strong> See all products
                                  in each order
                                </li>
                                <li>
                                  <strong>Payment Details:</strong> Track
                                  payment method and status
                                </li>
                                <li>
                                  <strong>Order Timeline:</strong> View complete
                                  order progress
                                </li>
                              </ul>
                            </Accordion.Body>
                          </Accordion.Item>

                          <Accordion.Item eventKey="3">
                            <Accordion.Header>
                              📄 Invoice Management
                            </Accordion.Header>
                            <Accordion.Body>
                              <p>
                                Manage all invoices in{" "}
                                <Link to="/admin/invoices">
                                  invoices section
                                </Link>
                                :
                              </p>

                              <h6>Invoice Operations:</h6>
                              <ul>
                                <li>
                                  <strong>View All Invoices:</strong> Complete
                                  invoice database with search
                                </li>
                                <li>
                                  <strong>Payment Status:</strong> Track paid,
                                  unpaid, and partial payments
                                </li>
                                <li>
                                  <strong>COD Tracking:</strong> Monitor cash on
                                  delivery payments
                                </li>
                                <li>
                                  <strong>Download Reports:</strong> Generate
                                  invoice reports
                                </li>
                              </ul>

                              <h6>Payment Management:</h6>
                              <ul>
                                <li>
                                  <strong>Payment Summary:</strong> Total paid,
                                  unpaid, and pending amounts
                                </li>
                                <li>
                                  <strong>Method Tracking:</strong> Statistics
                                  by payment method
                                </li>
                                <li>
                                  <strong>Revenue Analytics:</strong> Payment
                                  trends and insights
                                </li>
                              </ul>
                            </Accordion.Body>
                          </Accordion.Item>

                          <Accordion.Item eventKey="4">
                            <Accordion.Header>
                              💬 Message Management
                            </Accordion.Header>
                            <Accordion.Body>
                              <p>
                                Handle customer communications in{" "}
                                <Link to="/admin/messages">
                                  messages section
                                </Link>
                                :
                              </p>

                              <h6>Message Features:</h6>
                              <ul>
                                <li>
                                  <strong>View Messages:</strong> All customer
                                  contact form submissions
                                </li>
                                <li>
                                  <strong>Priority System:</strong> Set message
                                  priority (High, Medium, Low)
                                </li>
                                <li>
                                  <strong>Status Tracking:</strong> Mark as
                                  Open, In Progress, or Resolved
                                </li>
                                <li>
                                  <strong>Reply System:</strong> Respond
                                  directly to customer inquiries
                                </li>
                                <li>
                                  <strong>Search & Filter:</strong> Find
                                  messages by customer, priority, or status
                                </li>
                              </ul>

                              <h6>Real-time Notifications:</h6>
                              <ul>
                                <li>
                                  <strong>Instant Alerts:</strong> Get notified
                                  of new messages immediately
                                </li>
                                <li>
                                  <strong>Unread Count:</strong> See unread
                                  message count in header
                                </li>
                                <li>
                                  <strong>Toast Notifications:</strong> Pop-up
                                  alerts for urgent messages
                                </li>
                              </ul>
                            </Accordion.Body>
                          </Accordion.Item>

                          <Accordion.Item eventKey="5">
                            <Accordion.Header>
                              📊 Analytics & Reports
                            </Accordion.Header>
                            <Accordion.Body>
                              <p>
                                View business insights in{" "}
                                <Link to="/admin/analytics">
                                  analytics section
                                </Link>
                                :
                              </p>

                              <h6>Available Reports:</h6>
                              <ul>
                                <li>
                                  <strong>Sales Analytics:</strong> Revenue
                                  trends and growth charts
                                </li>
                                <li>
                                  <strong>Order Analytics:</strong> Order volume
                                  and status distribution
                                </li>
                                <li>
                                  <strong>Product Performance:</strong> Best
                                  selling products and categories
                                </li>
                                <li>
                                  <strong>Customer Analytics:</strong> User
                                  registration and activity trends
                                </li>
                                <li>
                                  <strong>Payment Analytics:</strong> Payment
                                  method preferences and success rates
                                </li>
                              </ul>

                              <h6>Chart Options:</h6>
                              <ul>
                                <li>
                                  <strong>Multiple Views:</strong> Line, Area,
                                  Bar, and Pie charts
                                </li>
                                <li>
                                  <strong>Table View:</strong> Detailed data in
                                  table format
                                </li>
                                <li>
                                  <strong>Date Filters:</strong> Custom date
                                  range selection
                                </li>
                                <li>
                                  <strong>Export Options:</strong> Download
                                  reports as PDF or Excel
                                </li>
                              </ul>
                            </Accordion.Body>
                          </Accordion.Item>
                        </Accordion>
                      </Tab.Pane>
                    )}

                    <Tab.Pane eventKey="features">
                      <h3 className="text-medical-red mb-4">
                        Complete Feature List
                      </h3>

                      <div className="features-table">
                        <Table responsive striped>
                          <thead className="table-dark">
                            <tr>
                              <th>Feature</th>
                              <th>URL</th>
                              <th>Access Level</th>
                              <th>Description</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>
                                <strong>Homepage</strong>
                              </td>
                              <td>
                                <code>/</code>
                              </td>
                              <td>
                                <Badge bg="success">Public</Badge>
                              </td>
                              <td>
                                Featured products, company info, navigation
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <strong>Product Catalog</strong>
                              </td>
                              <td>
                                <code>/products</code>
                              </td>
                              <td>
                                <Badge bg="success">Public</Badge>
                              </td>
                              <td>
                                Browse all products with filters and search
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <strong>Product Details</strong>
                              </td>
                              <td>
                                <code>/products/:id</code>
                              </td>
                              <td>
                                <Badge bg="success">Public</Badge>
                              </td>
                              <td>
                                Detailed product information and purchase
                                options
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <strong>Shopping Cart</strong>
                              </td>
                              <td>
                                <code>/cart</code>
                              </td>
                              <td>
                                <Badge bg="warning">User</Badge>
                              </td>
                              <td>
                                Review items, update quantities, proceed to
                                checkout
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <strong>Checkout/Order</strong>
                              </td>
                              <td>
                                <code>/order</code>
                              </td>
                              <td>
                                <Badge bg="warning">User</Badge>
                              </td>
                              <td>Complete purchase with payment options</td>
                            </tr>
                            <tr>
                              <td>
                                <strong>Order Details</strong>
                              </td>
                              <td>
                                <code>/order/:orderId</code>
                              </td>
                              <td>
                                <Badge bg="warning">User</Badge>
                              </td>
                              <td>Detailed order view with invoice download</td>
                            </tr>
                            <tr>
                              <td>
                                <strong>Invoice View</strong>
                              </td>
                              <td>
                                <code>/invoice/:orderId</code>
                              </td>
                              <td>
                                <Badge bg="warning">User</Badge>
                              </td>
                              <td>
                                Professional invoice display and PDF download
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <strong>User Dashboard</strong>
                              </td>
                              <td>
                                <code>/user/dashboard</code>
                              </td>
                              <td>
                                <Badge bg="warning">User</Badge>
                              </td>
                              <td>Personal dashboard with order overview</td>
                            </tr>
                            <tr>
                              <td>
                                <strong>User Orders</strong>
                              </td>
                              <td>
                                <code>/user/orders</code>
                              </td>
                              <td>
                                <Badge bg="warning">User</Badge>
                              </td>
                              <td>Complete order history with tracking</td>
                            </tr>
                            <tr>
                              <td>
                                <strong>User Invoices</strong>
                              </td>
                              <td>
                                <code>/user/invoices</code>
                              </td>
                              <td>
                                <Badge bg="warning">User</Badge>
                              </td>
                              <td>Invoice history with bulk download option</td>
                            </tr>
                            <tr>
                              <td>
                                <strong>User Profile</strong>
                              </td>
                              <td>
                                <code>/user/profile</code>
                              </td>
                              <td>
                                <Badge bg="warning">User</Badge>
                              </td>
                              <td>
                                Edit profile, change password, manage address
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <strong>Admin Dashboard</strong>
                              </td>
                              <td>
                                <code>/admin/dashboard</code>
                              </td>
                              <td>
                                <Badge bg="danger">Admin</Badge>
                              </td>
                              <td>
                                Comprehensive admin overview with statistics
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <strong>Admin Products</strong>
                              </td>
                              <td>
                                <code>/admin/products</code>
                              </td>
                              <td>
                                <Badge bg="danger">Admin</Badge>
                              </td>
                              <td>Manage product catalog and inventory</td>
                            </tr>
                            <tr>
                              <td>
                                <strong>Admin Orders</strong>
                              </td>
                              <td>
                                <code>/admin/orders</code>
                              </td>
                              <td>
                                <Badge bg="danger">Admin</Badge>
                              </td>
                              <td>Process and track all orders</td>
                            </tr>
                            <tr>
                              <td>
                                <strong>Admin Invoices</strong>
                              </td>
                              <td>
                                <code>/admin/invoices</code>
                              </td>
                              <td>
                                <Badge bg="danger">Admin</Badge>
                              </td>
                              <td>Manage all invoices and payment tracking</td>
                            </tr>
                            <tr>
                              <td>
                                <strong>Admin Messages</strong>
                              </td>
                              <td>
                                <code>/admin/messages</code>
                              </td>
                              <td>
                                <Badge bg="danger">Admin</Badge>
                              </td>
                              <td>
                                Handle customer inquiries and communications
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <strong>Admin Users</strong>
                              </td>
                              <td>
                                <code>/admin/users</code>
                              </td>
                              <td>
                                <Badge bg="danger">Admin</Badge>
                              </td>
                              <td>Manage user accounts and permissions</td>
                            </tr>
                            <tr>
                              <td>
                                <strong>Admin Analytics</strong>
                              </td>
                              <td>
                                <code>/admin/analytics</code>
                              </td>
                              <td>
                                <Badge bg="danger">Admin</Badge>
                              </td>
                              <td>Business insights and performance reports</td>
                            </tr>
                            <tr>
                              <td>
                                <strong>Contact Form</strong>
                              </td>
                              <td>
                                <code>/contact</code>
                              </td>
                              <td>
                                <Badge bg="success">Public</Badge>
                              </td>
                              <td>Send messages to customer support</td>
                            </tr>
                            <tr>
                              <td>
                                <strong>About Us</strong>
                              </td>
                              <td>
                                <code>/about</code>
                              </td>
                              <td>
                                <Badge bg="success">Public</Badge>
                              </td>
                              <td>Company information and mission</td>
                            </tr>
                            <tr>
                              <td>
                                <strong>Privacy Policy</strong>
                              </td>
                              <td>
                                <code>/privacy-policy</code>
                              </td>
                              <td>
                                <Badge bg="success">Public</Badge>
                              </td>
                              <td>
                                Privacy policy and data protection details
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <strong>Terms & Conditions</strong>
                              </td>
                              <td>
                                <code>/terms-conditions</code>
                              </td>
                              <td>
                                <Badge bg="success">Public</Badge>
                              </td>
                              <td>Terms of service and user agreements</td>
                            </tr>
                            <tr>
                              <td>
                                <strong>Backend Documentation</strong>
                              </td>
                              <td>
                                <code>/backend-docs</code>
                              </td>
                              <td>
                                <Badge bg="success">Public</Badge>
                              </td>
                              <td>Technical documentation for developers</td>
                            </tr>
                            <tr>
                              <td>
                                <strong>Password Reset</strong>
                              </td>
                              <td>
                                <code>/forgot-password</code>
                              </td>
                              <td>
                                <Badge bg="secondary">Guest</Badge>
                              </td>
                              <td>Reset password with email verification</td>
                            </tr>
                          </tbody>
                        </Table>
                      </div>
                    </Tab.Pane>

                    <Tab.Pane eventKey="troubleshooting">
                      <h3 className="text-medical-red mb-4">
                        Help & Troubleshooting
                      </h3>

                      <Accordion defaultActiveKey="0">
                        <Accordion.Item eventKey="0">
                          <Accordion.Header>
                            🔐 Login & Account Issues
                          </Accordion.Header>
                          <Accordion.Body>
                            <h6>Can't Login?</h6>
                            <ul>
                              <li>
                                Check if your email and password are correct
                              </li>
                              <li>
                                Use{" "}
                                <Link to="/forgot-password">
                                  forgot password
                                </Link>{" "}
                                to reset
                              </li>
                              <li>Clear browser cache and cookies</li>
                              <li>Try using a different browser</li>
                            </ul>

                            <h6>Account Locked?</h6>
                            <ul>
                              <li>Wait 15 minutes and try again</li>
                              <li>Contact support if issue persists</li>
                              <li>Check email for security notifications</li>
                            </ul>
                          </Accordion.Body>
                        </Accordion.Item>

                        <Accordion.Item eventKey="1">
                          <Accordion.Header>
                            🛒 Shopping & Order Issues
                          </Accordion.Header>
                          <Accordion.Body>
                            <h6>Can't Add to Cart?</h6>
                            <ul>
                              <li>Make sure you're logged in</li>
                              <li>Check if product is in stock</li>
                              <li>Refresh the page and try again</li>
                              <li>Clear browser cache</li>
                            </ul>

                            <h6>Payment Failed?</h6>
                            <ul>
                              <li>Check your internet connection</li>
                              <li>Verify payment method details</li>
                              <li>Try a different payment method</li>
                              <li>
                                Contact your bank for online payment issues
                              </li>
                            </ul>

                            <h6>Order Status Not Updating?</h6>
                            <ul>
                              <li>Allow 24-48 hours for status updates</li>
                              <li>Check order details page for latest info</li>
                              <li>Contact support for urgent concerns</li>
                            </ul>
                          </Accordion.Body>
                        </Accordion.Item>

                        <Accordion.Item eventKey="2">
                          <Accordion.Header>
                            📄 Invoice & Download Issues
                          </Accordion.Header>
                          <Accordion.Body>
                            <h6>Can't Download Invoice?</h6>
                            <ul>
                              <li>Check if pop-ups are blocked in browser</li>
                              <li>Allow downloads from our website</li>
                              <li>Try right-click and "Save as" option</li>
                              <li>Use a different browser if issue persists</li>
                            </ul>

                            <h6>Bulk Download Not Working?</h6>
                            <ul>
                              <li>Ensure you have multiple invoices</li>
                              <li>Check browser's download settings</li>
                              <li>Wait for processing to complete</li>
                              <li>
                                Try downloading individual invoices instead
                              </li>
                            </ul>
                          </Accordion.Body>
                        </Accordion.Item>

                        <Accordion.Item eventKey="3">
                          <Accordion.Header>
                            🔧 Technical Issues
                          </Accordion.Header>
                          <Accordion.Body>
                            <h6>Page Not Loading?</h6>
                            <ul>
                              <li>Check your internet connection</li>
                              <li>Refresh the page (Ctrl+F5)</li>
                              <li>Clear browser cache and cookies</li>
                              <li>Try accessing from incognito/private mode</li>
                            </ul>

                            <h6>Features Not Working?</h6>
                            <ul>
                              <li>Make sure JavaScript is enabled</li>
                              <li>Update your browser to latest version</li>
                              <li>Disable browser extensions temporarily</li>
                              <li>Try using a different device</li>
                            </ul>
                          </Accordion.Body>
                        </Accordion.Item>

                        <Accordion.Item eventKey="4">
                          <Accordion.Header>
                            📞 Contact Support
                          </Accordion.Header>
                          <Accordion.Body>
                            <div className="contact-info">
                              <h6>Get Help From Our Team</h6>
                              <div className="row">
                                <div className="col-md-6">
                                  <ul className="list-unstyled">
                                    <li>
                                      <strong>📧 Email:</strong>{" "}
                                      harekrishnamedical@gmail.com
                                    </li>
                                    <li>
                                      <strong>📱 Phone:</strong> +91 76989 13354
                                    </li>
                                    <li>
                                      <strong>🕐 Hours:</strong> 9 AM - 9 PM
                                      (Mon-Sat)
                                    </li>
                                    <li>
                                      <strong>📍 Address:</strong> 3 Sahyog
                                      Complex, Man Sarovar circle, Amroli,
                                      394107
                                    </li>
                                  </ul>
                                </div>
                                <div className="col-md-6">
                                  <div className="alert alert-info">
                                    <h6>📝 When Contacting Support:</h6>
                                    <ul className="mb-0 small">
                                      <li>Provide your account email</li>
                                      <li>Include order ID if applicable</li>
                                      <li>Describe the issue in detail</li>
                                      <li>Mention your browser and device</li>
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="mt-3">
                              <Link
                                to="/contact"
                                className="btn btn-medical-primary"
                              >
                                <i className="bi bi-envelope me-2"></i>
                                Send Message
                              </Link>
                            </div>
                          </Accordion.Body>
                        </Accordion.Item>
                      </Accordion>
                    </Tab.Pane>
                  </Tab.Content>
                </Tab.Container>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <style>{`
        .feature-item {
          text-align: center;
          padding: 20px;
          border: 1px solid #e9ecef;
          border-radius: 8px;
          margin-bottom: 20px;
          height: 100%;
        }

        .step-item {
          display: flex;
          align-items: center;
          margin-bottom: 15px;
          padding: 10px;
          background: #f8f9fa;
          border-radius: 5px;
        }

        .getting-started-steps .step-item {
          border-left: 4px solid var(--medical-red);
          background: #fff;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .features-table .table th {
          background-color: var(--medical-red) !important;
          color: white;
          border: none;
        }

        .features-table .table td {
          vertical-align: middle;
        }

        .features-table code {
          background: #f8f9fa;
          padding: 2px 6px;
          border-radius: 3px;
          font-size: 0.9rem;
        }

        .overview-section {
          padding: 20px;
          border: 1px solid #e9ecef;
          border-radius: 8px;
          background: #f8f9fa;
        }

        .contact-info {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          border: 1px solid #e9ecef;
        }

        .resources-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }

        .resource-card {
          padding: 20px;
          border: 1px solid #e9ecef;
          border-radius: 8px;
          background: #f8f9fa;
        }

        .resource-card h6 {
          color: var(--medical-red);
          margin-bottom: 15px;
        }

        .checklist .form-check {
          margin-bottom: 10px;
          padding: 8px;
          background: #f8f9fa;
          border-radius: 5px;
        }
      `}</style>
    </div>
  );
};

export default UserGuide;
