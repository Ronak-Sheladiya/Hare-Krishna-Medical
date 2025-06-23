import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { useSelector } from "react-redux";

// Session management
import sessionManager from "./utils/sessionManager.js";

// Components
import Header from "./components/layout/Header.jsx";
import Footer from "./components/layout/Footer.jsx";
import LoadingSpinner from "./components/common/LoadingSpinner.jsx";
import ErrorBoundary from "./components/common/ErrorBoundary.jsx";

// Pages
import Home from "./pages/Home.jsx";
import Products from "./pages/Products.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import Cart from "./pages/Cart.jsx";
import Order from "./pages/Order.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import AdminProducts from "./pages/admin/AdminProducts.jsx";
import AdminOrders from "./pages/admin/AdminOrders.jsx";
import AdminUsers from "./pages/admin/AdminUsers.jsx";
import AdminAnalytics from "./pages/admin/AdminAnalytics.jsx";
import AdminMessages from "./pages/admin/AdminMessages.jsx";
import AdminInvoices from "./pages/admin/AdminInvoices.jsx";
import UserDashboard from "./pages/UserDashboard.jsx";
import UserOrders from "./pages/user/UserOrders.jsx";
import UserInvoices from "./pages/user/UserInvoices.jsx";
import UserProfile from "./pages/user/UserProfile.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.jsx";
import TermsConditions from "./pages/TermsConditions.jsx";
import BackendDocs from "./pages/BackendDocs.jsx";
import InvoiceView from "./pages/InvoiceView.jsx";
import OrderDetails from "./pages/OrderDetails.jsx";
import UserGuide from "./pages/UserGuide.jsx";
import LocalSetupGuide from "./pages/LocalSetupGuide.jsx";
import InvoiceVerify from "./pages/InvoiceVerify.jsx";
import NavigationTest from "./components/common/NavigationTest.jsx";
import ButtonFixer from "./components/common/ButtonFixer.jsx";
import FunctionalityTest from "./components/common/FunctionalityTest.jsx";
import InvoiceQRVerify from "./pages/InvoiceQRVerify.jsx";
import AdminPaymentMethods from "./pages/admin/AdminPaymentMethods.jsx";
import VerifyEmail from "./pages/VerifyEmail.jsx";
import VerificationStatus from "./pages/VerificationStatus.jsx";
import NotFound from "./pages/NotFound.jsx";
// Use simple socket client until socket.io-client is installed
import socketClient from "./utils/socketClient.simple";

// Styles
import "./App.css";

// ScrollToTop Component
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Force scroll to top immediately and smoothly
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });

    // Also ensure document element is scrolled to top
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    // Additional timeout to ensure scroll happens after DOM update
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 10);
  }, [pathname]);

  return null;
};

// Protected Route Component
const ProtectedRoute = ({ children, adminOnly = false, userOnly = false }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    // Store the current location for redirect after login
    sessionStorage.setItem(
      "redirectAfterLogin",
      location.pathname + location.search,
    );
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (adminOnly && user?.role !== 1) {
    return <Navigate to="/user/dashboard" replace />;
  }

  if (userOnly && user?.role === 1) {
    // Admin trying to access user-only route - show access denied
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
        }}
      >
        <div className="container py-5">
          <div
            className="row justify-content-center align-items-center"
            style={{ minHeight: "80vh" }}
          >
            <div className="col-lg-6 col-md-8 text-center">
              <div
                className="card shadow-lg border-0"
                style={{
                  borderRadius: "20px",
                  background:
                    "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
                  boxShadow: "0 15px 35px rgba(0,0,0,0.1)",
                }}
              >
                <div className="card-body p-5">
                  {/* Icon with animation */}
                  <div
                    className="mb-4"
                    style={{
                      animation: "pulse 2s infinite",
                      fontSize: "5rem",
                      color: "#dc3545",
                    }}
                  >
                    <i className="bi bi-shield-exclamation"></i>
                  </div>

                  {/* Title */}
                  <h2
                    className="text-danger mb-3"
                    style={{ fontWeight: "700" }}
                  >
                    Access Restricted
                  </h2>

                  {/* Subtitle */}
                  <h5 className="text-muted mb-4" style={{ fontWeight: "500" }}>
                    Admin Only Area
                  </h5>

                  {/* Description */}
                  <p className="text-secondary mb-4 lead">
                    This section is exclusively for regular users. As an
                    administrator, you have access to the admin dashboard with
                    enhanced management capabilities.
                  </p>

                  {/* User info */}
                  <div
                    className="alert alert-info mb-4"
                    style={{
                      background:
                        "linear-gradient(135deg, #d1ecf1 0%, #bee5eb 100%)",
                      border: "none",
                      borderRadius: "12px",
                    }}
                  >
                    <i className="bi bi-info-circle me-2"></i>
                    <strong>Logged in as:</strong>{" "}
                    {user?.fullName || user?.name || "Administrator"}
                  </div>

                  {/* Action buttons */}
                  <div className="d-flex gap-3 justify-content-center flex-wrap">
                    <button
                      className="btn btn-danger btn-lg px-4"
                      onClick={() =>
                        (window.location.href = "/admin/dashboard")
                      }
                      style={{
                        background:
                          "linear-gradient(135deg, #dc3545 0%, #c82333 100%)",
                        border: "none",
                        borderRadius: "12px",
                        fontWeight: "600",
                        transition: "all 0.3s ease",
                      }}
                    >
                      <i className="bi bi-speedometer2 me-2"></i>
                      Admin Dashboard
                    </button>
                    <button
                      className="btn btn-outline-secondary btn-lg px-4"
                      onClick={() => window.history.back()}
                      style={{
                        borderRadius: "12px",
                        fontWeight: "600",
                        transition: "all 0.3s ease",
                      }}
                    >
                      <i className="bi bi-arrow-left me-2"></i>
                      Go Back
                    </button>
                  </div>

                  {/* Additional help */}
                  <div className="mt-4 pt-3 border-top">
                    <small className="text-muted">
                      <i className="bi bi-question-circle me-1"></i>
                      Need help?{" "}
                      <a href="/contact" className="text-decoration-none">
                        Contact Support
                      </a>
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CSS Animation */}
        <style>{`
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
          }

          .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0,0,0,0.15);
          }
        `}</style>
      </div>
    );
  }

  return children;
};

// Auth Route Component (redirects authenticated users)
const AuthRoute = ({ children }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (isAuthenticated) {
    const redirectPath =
      user?.role === 1 ? "/admin/dashboard" : "/user/dashboard";
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

function App() {
  const [loading, setLoading] = useState(true);
  const { user, token } = useSelector((state) => state.auth);

  useEffect(() => {
    // Initialize session manager and set loading to false immediately
    sessionManager; // This initializes the session manager
    setLoading(false);
  }, []);

  // Socket connection management
  useEffect(() => {
    // Only run in browser environment
    if (typeof window === "undefined") return;

    try {
      if (token && user) {
        // Connect socket when user is authenticated
        // Note: Socket.io-client needs to be installed first: npm install socket.io-client
        if (socketClient && typeof socketClient.connect === "function") {
          socketClient.connect(token, user.role);
        } else {
          console.log(
            "Socket.io-client not available. Install with: npm install socket.io-client",
          );
        }

        // Request notification permission safely
        if (
          typeof window !== "undefined" &&
          "Notification" in window &&
          Notification.permission === "default"
        ) {
          Notification.requestPermission().catch((error) => {
            console.warn("Notification permission request failed:", error);
          });
        }
      } else {
        // Disconnect socket when user logs out
        if (socketClient && typeof socketClient.disconnect === "function") {
          socketClient.disconnect();
        }
      }
    } catch (error) {
      console.warn("Socket connection initialization failed:", error);
    }

    // Cleanup on unmount
    return () => {
      try {
        if (socketClient && typeof socketClient.disconnect === "function") {
          socketClient.disconnect();
        }
      } catch (error) {
        console.warn("Socket disconnect error:", error);
      }
    };
  }, [token, user]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Router>
      <ErrorBoundary>
        <div className="App">
          <ScrollToTop />
          <Header />
          <main>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/invoice/:orderId" element={<InvoiceView />} />
              <Route
                path="/invoice-verify/:invoiceId"
                element={<InvoiceVerify />}
              />
              <Route
                path="/qr/invoice/:invoiceId"
                element={<InvoiceQRVerify />}
              />
              <Route path="/verify-email/:token" element={<VerifyEmail />} />
              <Route
                path="/verification-status"
                element={<VerificationStatus />}
              />
              <Route path="/user-guide" element={<UserGuide />} />
              <Route path="/backend-docs" element={<BackendDocs />} />
              <Route path="/localsetup-guide" element={<LocalSetupGuide />} />
              <Route
                path="/navigation-test"
                element={
                  <ProtectedRoute adminOnly>
                    <NavigationTest />
                  </ProtectedRoute>
                }
              />
              <Route path="/button-fixer" element={<ButtonFixer />} />
              <Route
                path="/functionality-test"
                element={
                  <ProtectedRoute adminOnly>
                    <FunctionalityTest />
                  </ProtectedRoute>
                }
              />
              <Route path="/cart" element={<Cart />} />
              <Route path="/order" element={<Order />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-conditions" element={<TermsConditions />} />
              <Route path="/order/:orderId" element={<OrderDetails />} />

              {/* Auth Routes (redirect if already authenticated) */}
              <Route
                path="/login"
                element={
                  <AuthRoute>
                    <Login />
                  </AuthRoute>
                }
              />
              <Route
                path="/register"
                element={
                  <AuthRoute>
                    <Register />
                  </AuthRoute>
                }
              />
              <Route
                path="/forgot-password"
                element={
                  <AuthRoute>
                    <ForgotPassword />
                  </AuthRoute>
                }
              />

              {/* Admin Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute adminOnly>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/products"
                element={
                  <ProtectedRoute adminOnly>
                    <AdminProducts />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/orders"
                element={
                  <ProtectedRoute adminOnly>
                    <AdminOrders />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute adminOnly>
                    <AdminUsers />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/analytics"
                element={
                  <ProtectedRoute adminOnly>
                    <AdminAnalytics />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/messages"
                element={
                  <ProtectedRoute adminOnly>
                    <AdminMessages />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/invoices"
                element={
                  <ProtectedRoute adminOnly>
                    <AdminInvoices />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/payment-methods"
                element={
                  <ProtectedRoute adminOnly>
                    <AdminPaymentMethods />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/profile"
                element={
                  <ProtectedRoute adminOnly>
                    <UserProfile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/backend-docs"
                element={
                  <ProtectedRoute adminOnly>
                    <BackendDocs />
                  </ProtectedRoute>
                }
              />

              {/* User Routes */}
              <Route
                path="/user/dashboard"
                element={
                  <ProtectedRoute userOnly>
                    <UserDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/user/orders"
                element={
                  <ProtectedRoute userOnly>
                    <UserOrders />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/user/invoices"
                element={
                  <ProtectedRoute userOnly>
                    <UserInvoices />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/user/profile"
                element={
                  <ProtectedRoute userOnly>
                    <UserProfile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/user/*"
                element={
                  <ProtectedRoute>
                    <div className="section-padding">
                      <div className="container">
                        <div className="text-center">
                          <div className="medical-card p-5">
                            <i className="bi bi-person-gear display-1 text-medical-blue mb-3"></i>
                            <h3>User Feature</h3>
                            <p className="text-muted">
                              Additional user features like profile editing and
                              other account management tools will be implemented
                              here.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </ProtectedRoute>
                }
              />

              {/* Fallback Routes */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          {/* Footer displayed on all pages */}
          <Footer />
        </div>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
