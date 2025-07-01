// Frontend-Only Data Provider
// Provides mock data when running without backend

// Mock Products Data
export const mockProducts = [
  {
    _id: "1",
    name: "Paracetamol 500mg",
    slug: "paracetamol-500mg",
    description: "Pain relief and fever reducer tablets",
    price: 25.99,
    stock: 100,
    category: "Pain Relief",
    brand: "HealthCare Plus",
    images: ["https://via.placeholder.com/300x300?text=Paracetamol"],
    isActive: true,
    isFeatured: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: "2",
    name: "Vitamin D3 Tablets",
    slug: "vitamin-d3-tablets",
    description: "Essential vitamin D3 supplement for bone health",
    price: 15.5,
    stock: 75,
    category: "Vitamins",
    brand: "NutriHealth",
    images: ["https://via.placeholder.com/300x300?text=Vitamin+D3"],
    isActive: true,
    isFeatured: false,
    createdAt: new Date().toISOString(),
  },
  {
    _id: "3",
    name: "Cough Syrup",
    slug: "cough-syrup",
    description: "Effective cough relief syrup for all ages",
    price: 12.75,
    stock: 50,
    category: "Cold & Flu",
    brand: "ReliefCare",
    images: ["https://via.placeholder.com/300x300?text=Cough+Syrup"],
    isActive: true,
    isFeatured: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: "4",
    name: "First Aid Kit",
    slug: "first-aid-kit",
    description: "Complete first aid kit with essential medical supplies",
    price: 45.99,
    stock: 25,
    category: "First Aid",
    brand: "SafeCare",
    images: ["https://via.placeholder.com/300x300?text=First+Aid+Kit"],
    isActive: true,
    isFeatured: false,
    createdAt: new Date().toISOString(),
  },
];

// Mock User Data
export const mockUser = {
  _id: "user1",
  name: "Demo User",
  email: "demo@example.com",
  role: "user",
  isVerified: true,
  profile: {
    phone: "+1234567890",
    address: {
      street: "123 Main St",
      city: "Demo City",
      state: "Demo State",
      zipCode: "12345",
      country: "Demo Country",
    },
  },
  createdAt: new Date().toISOString(),
};

// Mock Admin User
export const mockAdmin = {
  _id: "admin1",
  name: "Admin User",
  email: "admin@example.com",
  role: "admin",
  isVerified: true,
  profile: {
    phone: "+1234567890",
    address: {
      street: "456 Admin St",
      city: "Admin City",
      state: "Admin State",
      zipCode: "67890",
      country: "Admin Country",
    },
  },
  createdAt: new Date().toISOString(),
};

// Mock Orders Data
export const mockOrders = [
  {
    _id: "order1",
    orderNumber: "ORD-2024-001",
    userId: "user1",
    items: [
      {
        productId: "1",
        name: "Paracetamol 500mg",
        price: 25.99,
        quantity: 2,
        total: 51.98,
      },
    ],
    totalAmount: 51.98,
    status: "delivered",
    paymentStatus: "paid",
    paymentMethod: "Credit Card",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
  },
  {
    _id: "order2",
    orderNumber: "ORD-2024-002",
    userId: "user1",
    items: [
      {
        productId: "3",
        name: "Cough Syrup",
        price: 12.75,
        quantity: 1,
        total: 12.75,
      },
    ],
    totalAmount: 12.75,
    status: "processing",
    paymentStatus: "paid",
    paymentMethod: "PayPal",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
  },
];

// Mock Analytics Data
export const mockAnalytics = {
  totalUsers: 156,
  totalOrders: 89,
  totalProducts: 45,
  totalRevenue: 12567.89,
  unreadMessages: 3,
  lowStockProducts: 2,
  recentOrders: mockOrders.slice(0, 5),
  salesData: [
    { date: "2024-01-01", sales: 1200 },
    { date: "2024-01-02", sales: 1500 },
    { date: "2024-01-03", sales: 1100 },
    { date: "2024-01-04", sales: 1800 },
    { date: "2024-01-05", sales: 1400 },
  ],
};

// Mock Messages Data
export const mockMessages = [
  {
    _id: "msg1",
    senderId: "user1",
    receiverId: "admin1",
    subject: "Product Inquiry",
    content: "I have a question about the Paracetamol 500mg tablets.",
    type: "inquiry",
    status: "unread",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
  },
  {
    _id: "msg2",
    senderId: "user1",
    receiverId: "admin1",
    subject: "Order Status",
    content: "When will my order ORD-2024-002 be shipped?",
    type: "support",
    status: "read",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
  },
];

// API Response Simulator
export const simulateApiResponse = (data, delay = 500) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: data,
        message: "Frontend-only mode: Using mock data",
        frontendOnly: true,
      });
    }, delay);
  });
};

// API Error Simulator
export const simulateApiError = (
  message = "Frontend-only mode",
  delay = 500,
) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: false,
        error: message,
        frontendOnly: true,
      });
    }, delay);
  });
};

// Frontend-Only API Methods
export const frontendOnlyApi = {
  // Auth methods
  login: async (email, password) => {
    if (email === "admin@example.com" && password === "admin123") {
      return simulateApiResponse({
        user: mockAdmin,
        token: "mock-admin-token",
      });
    }
    if (email === "demo@example.com" && password === "demo123") {
      return simulateApiResponse({ user: mockUser, token: "mock-user-token" });
    }
    return simulateApiError("Invalid credentials");
  },

  register: async (userData) => {
    return simulateApiResponse({
      user: { ...mockUser, ...userData },
      token: "mock-user-token",
    });
  },

  getProfile: async () => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token === "mock-admin-token") {
      return simulateApiResponse(mockAdmin);
    }
    return simulateApiResponse(mockUser);
  },

  // Product methods
  getProducts: async () => {
    return simulateApiResponse(mockProducts);
  },

  getProduct: async (id) => {
    const product = mockProducts.find((p) => p._id === id || p.slug === id);
    return product
      ? simulateApiResponse(product)
      : simulateApiError("Product not found");
  },

  getFeaturedProducts: async () => {
    const featured = mockProducts.filter((p) => p.isFeatured);
    return simulateApiResponse(featured);
  },

  // Order methods
  getOrders: async () => {
    return simulateApiResponse(mockOrders);
  },

  createOrder: async (orderData) => {
    const newOrder = {
      _id: `order${Date.now()}`,
      orderNumber: `ORD-2024-${String(mockOrders.length + 1).padStart(3, "0")}`,
      ...orderData,
      status: "pending",
      paymentStatus: "pending",
      createdAt: new Date().toISOString(),
    };
    return simulateApiResponse(newOrder);
  },

  // Analytics methods
  getAnalytics: async () => {
    return simulateApiResponse(mockAnalytics);
  },

  // Message methods
  getMessages: async () => {
    return simulateApiResponse(mockMessages);
  },

  sendMessage: async (messageData) => {
    const newMessage = {
      _id: `msg${Date.now()}`,
      ...messageData,
      status: "unread",
      createdAt: new Date().toISOString(),
    };
    return simulateApiResponse(newMessage);
  },

  // Health check
  health: async () => {
    return simulateApiResponse({
      status: "Frontend-only mode",
      timestamp: new Date().toISOString(),
    });
  },
};

// Check if frontend-only mode is enabled
export const isFrontendOnlyMode = () => {
  try {
    // Import config to check hasBackend flag
    import("./config.js").then((config) => {
      return !config.getAppConfig().hasBackend;
    });
  } catch (error) {
    console.log("📱 Running in frontend-only mode");
    return true;
  }
  return true; // Default to frontend-only
};

export default {
  mockProducts,
  mockUser,
  mockAdmin,
  mockOrders,
  mockAnalytics,
  mockMessages,
  simulateApiResponse,
  simulateApiError,
  frontendOnlyApi,
  isFrontendOnlyMode,
};
