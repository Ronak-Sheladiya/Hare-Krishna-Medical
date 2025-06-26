import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useSelector } from "react-redux";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

// Utils
import sessionManager from "./utils/sessionManager";
import socketClient from "./utils/socketClient";
import invoiceService from "./services/InvoiceService";

// Components
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import LoadingSpinner from "./components/common/LoadingSpinner";
import ErrorBoundary from "./components/common/ErrorBoundary";
import RealTimeSync from "./components/common/RealTimeSync";
import RealTimeStatus from "./components/common/RealTimeStatus";
import CrossTabCartSync from "./components/common/CrossTabCartSync";
import SecurityLayer from "./components/common/SecurityLayer";
import SocketDiagnostic from "./components/common/SocketDiagnostic";

// Pages
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Order from "./pages/Order";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyEmail from "./pages/VerifyEmail";
import VerificationStatus from "./pages/VerificationStatus";
import AccessDenied from "./pages/AccessDenied";
import NotFound from "./pages/NotFound";
import InvoiceView from "./pages/InvoiceView";
import InvoiceVerify from "./pages/InvoiceVerify";
import UserGuide from "./pages/UserGuide";
import BackendDocs from "./pages/BackendDocs";
import LocalSetupGuide from "./pages/LocalSetupGuide";
import VercelDeploymentGuide from "./pages/VercelDeploymentGuide";
import OrderDetails from "./pages/OrderDetails";

// Admin
import AdminDashboard from "./pages/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminMessages from "./pages/admin/AdminMessages";
import AdminInvoices from "./pages/admin/AdminInvoices";
import AdminPaymentMethods from "./pages/admin/AdminPaymentMethods";
import AdminLetterheads from "./pages/admin/AdminLetterheads";
import AddLetterhead from "./pages/admin/AddLetterhead";
import VerifyDocs from "./pages/VerifyDocs";

// User
import UserDashboard from "./pages/UserDashboard";
import UserOrders from "./pages/user/UserOrders";
import UserInvoices from "./pages/user/UserInvoices";
import UserProfile from "./pages/user/UserProfile";

// Diagnostic Tools
import NavigationTest from "./components/common/NavigationTest";
import ButtonFixer from "./components/common/ButtonFixer";
import FunctionalityTest from "./components/common/FunctionalityTest";
import SocketDiagnostics from "./pages/SocketDiagnostics";

// Styles
import "./App.css";
import "./styles/SecurityStyles.css";

// ScrollToTop
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Auth wrappers
const ProtectedRoute = ({ children, adminOnly = false, userOnly = false }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    const returnUrl = location.pathname + location.search + location.hash;
    sessionStorage.setItem("redirectAfterLogin", returnUrl);
    localStorage.setItem("lastAttemptedUrl", returnUrl);
    return <Navigate to="/login" state={{ from: returnUrl }} replace />;
  }

  if (adminOnly && user?.role !== 1) {
    return <Navigate to="/access-denied" replace />;
  }

  if (userOnly && user?.role === 1) {
    return <Navigate to="/access-denied" replace />;
  }

  return children;
};

const AuthRoute = ({ children }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  if (isAuthenticated) {
    return (
      <Navigate
        to={user?.role === 1 ? "/admin/dashboard" : "/user/dashboard"}
        replace
      />
    );
  }
  return children;
};

// Main App
function App() {
  const [loading, setLoading] = useState(true);
  const { user, token } = useSelector((state) => state.auth);

  useEffect(() => {
    sessionManager;
    invoiceService.init();
    setLoading(false);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (token && user) {
      try {
        socketClient.connect(token, user.role);
      } catch (e) {
        console.warn("Socket connection error", e);
      }

      if ("Notification" in window && Notification.permission === "default") {
        Notification.requestPermission().catch(console.warn);
      }
    } else {
      try {
        socketClient.disconnect();
      } catch (e) {
        console.warn("Socket disconnect error", e);
      }
    }

    return () => {
      try {
        socketClient.disconnect();
      } catch (e) {
        console.warn("Cleanup disconnect error", e);
      }
    };
  }, [token, user]);

  if (loading) return <LoadingSpinner />;

  return (
    <Router>
      <ErrorBoundary>
        <SecurityLayer />
        <RealTimeSync />
        <CrossTabCartSync />
        <ScrollToTop />
        <Header />

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/order" element={<Order />} />
            <Route path="/order/:orderId" element={<OrderDetails />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/verify-email/:token" element={<VerifyEmail />} />
            <Route
              path="/verification-status"
              element={<VerificationStatus />}
            />
            <Route path="/invoice/:invoiceId" element={<InvoiceView />} />
            <Route path="/verify/:invoiceId" element={<InvoiceVerify />} />
            <Route path="/verify" element={<InvoiceVerify />} />
            <Route path="/user-guide" element={<UserGuide />} />
            <Route path="/backend-docs" element={<BackendDocs />} />
            <Route path="/localsetup-guide" element={<LocalSetupGuide />} />
            <Route
              path="/vercel-deployment"
              element={<VercelDeploymentGuide />}
            />

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

            <Route path="/access-denied" element={<AccessDenied />} />

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
              path="/admin/letterheads"
              element={
                <ProtectedRoute adminOnly>
                  <AdminLetterheads />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/letterheads/add"
              element={
                <ProtectedRoute adminOnly>
                  <AddLetterhead />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/letterheads/edit/:id"
              element={
                <ProtectedRoute adminOnly>
                  <AddLetterhead />
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

            {/* Debug Routes */}
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
            <Route
              path="/socket-diagnostics"
              element={
                <ProtectedRoute adminOnly>
                  <SocketDiagnostics />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <Footer />
        <RealTimeStatus />
      </ErrorBoundary>
    </Router>
  );
}

export default App;
