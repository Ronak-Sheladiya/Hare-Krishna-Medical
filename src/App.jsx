import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { useSelector } from "react-redux";

// Components
import Header from "./components/layout/Header.jsx";
import Footer from "./components/layout/Footer.jsx";
import LoadingSpinner from "./components/common/LoadingSpinner.jsx";

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
import UserDashboard from "./pages/UserDashboard.jsx";
import UserOrders from "./pages/user/UserOrders.jsx";
import UserInvoices from "./pages/user/UserInvoices.jsx";
import InvoiceView from "./pages/InvoiceView.jsx";
import NotFound from "./pages/NotFound.jsx";

// Styles
import "./App.css";

// Protected Route Component
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
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

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Router>
      <div className="App">
        <Header />
        <main>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/order" element={<Order />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/invoice/:orderId" element={<InvoiceView />} />

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

            {/* Protected Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/products"
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminProducts />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/orders"
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminOrders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminUsers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/analytics"
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminAnalytics />
                </ProtectedRoute>
              }
            />

            {/* Protected User Routes */}
            <Route
              path="/user/dashboard"
              element={
                <ProtectedRoute>
                  <UserDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/orders"
              element={
                <ProtectedRoute>
                  <UserOrders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/invoices"
              element={
                <ProtectedRoute>
                  <UserInvoices />
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
        <Footer />
      </div>
    </Router>
  );
}

export default App;
