// Enhanced API Client with Frontend-Only Mode Support
import { apiCall } from "./apiClient.js";
import { frontendOnlyApi, isFrontendOnlyMode } from "./frontendOnlyData.js";
import { getAppConfig } from "./config.js";

// Check if running in frontend-only mode
const isAppFrontendOnly = () => {
  try {
    const config = getAppConfig();
    return config.frontendOnly || !config.hasBackend;
  } catch (error) {
    return true; // Default to frontend-only if config fails
  }
};

// Enhanced API client that automatically uses mock data in frontend-only mode
class EnhancedApiClient {
  constructor() {
    this.frontendOnly = isAppFrontendOnly();
    if (this.frontendOnly) {
      console.log("📱 Enhanced API Client: Running in frontend-only mode");
    }
  }

  // Authentication endpoints
  async login(email, password) {
    if (this.frontendOnly) {
      return frontendOnlyApi.login(email, password);
    }
    return apiCall("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData) {
    if (this.frontendOnly) {
      return frontendOnlyApi.register(userData);
    }
    return apiCall("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  async logout() {
    if (this.frontendOnly) {
      // Clear local storage in frontend-only mode
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
      return { success: true, message: "Logged out successfully" };
    }
    return apiCall("/api/auth/logout", { method: "POST" });
  }

  async getProfile() {
    if (this.frontendOnly) {
      return frontendOnlyApi.getProfile();
    }
    return apiCall("/api/auth/me");
  }

  async forgotPassword(email) {
    if (this.frontendOnly) {
      return {
        success: true,
        message: "Password reset email sent (demo mode)",
      };
    }
    return apiCall("/api/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(token, password) {
    if (this.frontendOnly) {
      return {
        success: true,
        message: "Password reset successful (demo mode)",
      };
    }
    return apiCall("/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, password }),
    });
  }

  async verifyEmail(token) {
    if (this.frontendOnly) {
      return {
        success: true,
        message: "Email verified successfully (demo mode)",
      };
    }
    return apiCall("/api/auth/verify-email", {
      method: "POST",
      body: JSON.stringify({ token }),
    });
  }

  // Product endpoints
  async getProducts(params = {}) {
    if (this.frontendOnly) {
      return frontendOnlyApi.getProducts();
    }
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/api/products${queryString ? `?${queryString}` : ""}`);
  }

  async getProduct(id) {
    if (this.frontendOnly) {
      return frontendOnlyApi.getProduct(id);
    }
    return apiCall(`/api/products/${id}`);
  }

  async getFeaturedProducts() {
    if (this.frontendOnly) {
      return frontendOnlyApi.getFeaturedProducts();
    }
    return apiCall("/api/products/featured");
  }

  async createProduct(productData) {
    if (this.frontendOnly) {
      return {
        success: true,
        message: "Product created successfully (demo mode)",
      };
    }
    return apiCall("/api/products", {
      method: "POST",
      body: JSON.stringify(productData),
    });
  }

  async updateProduct(id, productData) {
    if (this.frontendOnly) {
      return {
        success: true,
        message: "Product updated successfully (demo mode)",
      };
    }
    return apiCall(`/api/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(productData),
    });
  }

  async deleteProduct(id) {
    if (this.frontendOnly) {
      return {
        success: true,
        message: "Product deleted successfully (demo mode)",
      };
    }
    return apiCall(`/api/products/${id}`, { method: "DELETE" });
  }

  // Order endpoints
  async getOrders() {
    if (this.frontendOnly) {
      return frontendOnlyApi.getOrders();
    }
    return apiCall("/api/orders");
  }

  async getOrder(id) {
    if (this.frontendOnly) {
      const orders = await frontendOnlyApi.getOrders();
      const order = orders.data.find((o) => o._id === id);
      return order
        ? { success: true, data: order }
        : { success: false, error: "Order not found" };
    }
    return apiCall(`/api/orders/${id}`);
  }

  async createOrder(orderData) {
    if (this.frontendOnly) {
      return frontendOnlyApi.createOrder(orderData);
    }
    return apiCall("/api/orders", {
      method: "POST",
      body: JSON.stringify(orderData),
    });
  }

  async updateOrderStatus(id, status) {
    if (this.frontendOnly) {
      return {
        success: true,
        message: "Order status updated successfully (demo mode)",
      };
    }
    return apiCall(`/api/orders/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    });
  }

  // Cart endpoints (frontend-only since cart is managed locally)
  async addToCart(productId, quantity = 1) {
    // Cart is always managed locally in frontend
    return { success: true, message: "Added to cart", frontendOnly: true };
  }

  async removeFromCart(productId) {
    // Cart is always managed locally in frontend
    return { success: true, message: "Removed from cart", frontendOnly: true };
  }

  async updateCartItem(productId, quantity) {
    // Cart is always managed locally in frontend
    return { success: true, message: "Cart updated", frontendOnly: true };
  }

  async clearCart() {
    // Cart is always managed locally in frontend
    return { success: true, message: "Cart cleared", frontendOnly: true };
  }

  // Message endpoints
  async getMessages() {
    if (this.frontendOnly) {
      return frontendOnlyApi.getMessages();
    }
    return apiCall("/api/messages");
  }

  async sendMessage(messageData) {
    if (this.frontendOnly) {
      return frontendOnlyApi.sendMessage(messageData);
    }
    return apiCall("/api/messages", {
      method: "POST",
      body: JSON.stringify(messageData),
    });
  }

  async markMessageAsRead(id) {
    if (this.frontendOnly) {
      return { success: true, message: "Message marked as read (demo mode)" };
    }
    return apiCall(`/api/messages/${id}/read`, { method: "PUT" });
  }

  // Analytics endpoints
  async getAnalytics() {
    if (this.frontendOnly) {
      return frontendOnlyApi.getAnalytics();
    }
    return apiCall("/api/analytics");
  }

  async getDashboardStats() {
    if (this.frontendOnly) {
      return frontendOnlyApi.getAnalytics();
    }
    return apiCall("/api/analytics/dashboard");
  }

  // Invoice endpoints
  async getInvoices() {
    if (this.frontendOnly) {
      return { success: true, data: [], message: "No invoices in demo mode" };
    }
    return apiCall("/api/invoices");
  }

  async getInvoice(id) {
    if (this.frontendOnly) {
      return { success: false, error: "Invoice not found in demo mode" };
    }
    return apiCall(`/api/invoices/${id}`);
  }

  async createInvoice(invoiceData) {
    if (this.frontendOnly) {
      return {
        success: true,
        message: "Invoice created successfully (demo mode)",
      };
    }
    return apiCall("/api/invoices", {
      method: "POST",
      body: JSON.stringify(invoiceData),
    });
  }

  // User management endpoints
  async getUsers() {
    if (this.frontendOnly) {
      return { success: true, data: [], message: "No users in demo mode" };
    }
    return apiCall("/api/users");
  }

  async updateUser(id, userData) {
    if (this.frontendOnly) {
      return {
        success: true,
        message: "User updated successfully (demo mode)",
      };
    }
    return apiCall(`/api/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(userData),
    });
  }

  // File upload endpoints
  async uploadFile(file, type = "image") {
    if (this.frontendOnly) {
      // Return a mock uploaded file URL
      return {
        success: true,
        data: {
          url: `https://via.placeholder.com/300x300?text=${encodeURIComponent(file.name)}`,
          filename: file.name,
          size: file.size,
          type: file.type,
        },
        message: "File uploaded successfully (demo mode)",
      };
    }
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);

    return apiCall("/api/upload", {
      method: "POST",
      body: formData,
      headers: {}, // Remove Content-Type to let browser set it with boundary
    });
  }

  // Health check
  async health() {
    if (this.frontendOnly) {
      return frontendOnlyApi.health();
    }
    return apiCall("/api/health");
  }

  // Generic API call method
  async call(endpoint, options = {}) {
    if (this.frontendOnly) {
      console.log(`📱 Frontend-only mode: Skipping API call to ${endpoint}`);
      return {
        success: false,
        error: "Frontend-only mode: No backend connection",
        frontendOnly: true,
      };
    }
    return apiCall(endpoint, options);
  }
}

// Create and export a singleton instance
const enhancedApiClient = new EnhancedApiClient();

// Export both the class and the singleton instance
export { EnhancedApiClient };
export default enhancedApiClient;

// Convenient named exports for common operations
export const api = enhancedApiClient;
export const auth = {
  login: (email, password) => enhancedApiClient.login(email, password),
  register: (userData) => enhancedApiClient.register(userData),
  logout: () => enhancedApiClient.logout(),
  getProfile: () => enhancedApiClient.getProfile(),
  forgotPassword: (email) => enhancedApiClient.forgotPassword(email),
  resetPassword: (token, password) =>
    enhancedApiClient.resetPassword(token, password),
  verifyEmail: (token) => enhancedApiClient.verifyEmail(token),
};

export const products = {
  getAll: (params) => enhancedApiClient.getProducts(params),
  getOne: (id) => enhancedApiClient.getProduct(id),
  getFeatured: () => enhancedApiClient.getFeaturedProducts(),
  create: (data) => enhancedApiClient.createProduct(data),
  update: (id, data) => enhancedApiClient.updateProduct(id, data),
  delete: (id) => enhancedApiClient.deleteProduct(id),
};

export const orders = {
  getAll: () => enhancedApiClient.getOrders(),
  getOne: (id) => enhancedApiClient.getOrder(id),
  create: (data) => enhancedApiClient.createOrder(data),
  updateStatus: (id, status) => enhancedApiClient.updateOrderStatus(id, status),
};

export const cart = {
  add: (productId, quantity) =>
    enhancedApiClient.addToCart(productId, quantity),
  remove: (productId) => enhancedApiClient.removeFromCart(productId),
  update: (productId, quantity) =>
    enhancedApiClient.updateCartItem(productId, quantity),
  clear: () => enhancedApiClient.clearCart(),
};
