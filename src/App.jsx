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
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    // Store the current location for redirect after login
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (adminOnly && user?.role !== 1) {
    return <Navigate to="/user/dashboard" replace />;
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
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/products" element={<AdminProducts />} />
              <Route path="/admin/orders" element={<AdminOrders />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/analytics" element={<AdminAnalytics />} />
              <Route path="/admin/messages" element={<AdminMessages />} />
              <Route path="/admin/invoices" element={<AdminInvoices />} />
              <Route
                path="/admin/payment-methods"
                element={<AdminPaymentMethods />}
              />
              <Route path="/admin/backend-docs" element={<BackendDocs />} />

              {/* User Routes */}
              <Route path="/user/dashboard" element={<UserDashboard />} />
              <Route path="/user/orders" element={<UserOrders />} />
              <Route path="/user/invoices" element={<UserInvoices />} />
              <Route path="/user/profile" element={<UserProfile />} />
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
