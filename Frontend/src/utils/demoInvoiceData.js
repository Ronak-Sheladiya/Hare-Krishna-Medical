// Demo invoice data for testing invoice verification functionality
export const demoInvoices = {
  DEMO001: {
    invoiceNumber: "DEMO001",
    orderId: "DEMO001",
    customerName: "John Doe",
    customerEmail: "john.doe@example.com",
    customerPhone: "+91 98765 43210",
    customerMobile: "+91 98765 43210",
    customerAddress: "123 Demo Street, Test City, 123456",
    paymentMethod: "Cash on Delivery",
    paymentStatus: "Pending",
    status: "pending",
    total: 2399.0,
    totalAmount: 2399.0,
    subtotal: 2399.0,
    tax: 0,
    shipping: 0,
    createdAt: new Date().toISOString(),
    items: [
      {
        name: "Paracetamol Tablets",
        productName: "Paracetamol Tablets",
        description: "500mg - Pack of 10 tablets",
        quantity: 2,
        price: 45.0,
        total: 90.0,
      },
      {
        name: "Vitamin D3 Capsules",
        productName: "Vitamin D3 Capsules",
        description: "60,000 IU - Pack of 4 capsules",
        quantity: 1,
        price: 299.0,
        total: 299.0,
      },
      {
        name: "Digital Thermometer",
        productName: "Digital Thermometer",
        description: "Accurate fever thermometer with LCD display",
        quantity: 1,
        price: 450.0,
        total: 450.0,
      },
      {
        name: "Blood Pressure Monitor",
        productName: "Blood Pressure Monitor",
        description: "Automatic digital BP monitor with memory",
        quantity: 1,
        price: 1560.0,
        total: 1560.0,
      },
    ],
  },
  DEMO002: {
    invoiceNumber: "DEMO002",
    orderId: "DEMO002",
    customerName: "Jane Smith",
    customerEmail: "jane.smith@example.com",
    customerPhone: "+91 87654 32109",
    customerMobile: "+91 87654 32109",
    customerAddress: "456 Sample Road, Demo Town, 654321",
    paymentMethod: "UPI Payment",
    paymentStatus: "Completed",
    status: "paid",
    total: 1649.0,
    totalAmount: 1649.0,
    subtotal: 1649.0,
    tax: 0,
    shipping: 0,
    createdAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    items: [
      {
        name: "Cough Syrup",
        productName: "Cough Syrup",
        description: "100ml bottle for dry cough relief",
        quantity: 1,
        price: 125.0,
        total: 125.0,
      },
      {
        name: "Antiseptic Cream",
        productName: "Antiseptic Cream",
        description: "50g tube for wound care",
        quantity: 2,
        price: 89.0,
        total: 178.0,
      },
      {
        name: "Glucose Monitor Kit",
        productName: "Glucose Monitor Kit",
        description: "Blood sugar testing kit with 25 strips",
        quantity: 1,
        price: 1346.0,
        total: 1346.0,
      },
    ],
  },
  DEMO003: {
    invoiceNumber: "DEMO003",
    orderId: "DEMO003",
    customerName: "Raj Patel",
    customerEmail: "raj.patel@example.com",
    customerPhone: "+91 76543 21098",
    customerMobile: "+91 76543 21098",
    customerAddress: "789 Medical Avenue, Health City, 987654",
    paymentMethod: "Credit Card",
    paymentStatus: "Completed",
    status: "paid",
    total: 799.5,
    totalAmount: 799.5,
    subtotal: 799.5,
    tax: 0,
    shipping: 0,
    createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    items: [
      {
        name: "Multivitamin Tablets",
        productName: "Multivitamin Tablets",
        description: "30 tablets - Daily nutrition supplement",
        quantity: 1,
        price: 299.5,
        total: 299.5,
      },
      {
        name: "Hand Sanitizer",
        productName: "Hand Sanitizer",
        description: "500ml bottle - 70% alcohol content",
        quantity: 2,
        price: 150.0,
        total: 300.0,
      },
      {
        name: "Face Masks",
        productName: "Face Masks",
        description: "Pack of 50 surgical face masks",
        quantity: 1,
        price: 200.0,
        total: 200.0,
      },
    ],
  },
  TEST123: {
    invoiceNumber: "TEST123",
    orderId: "TEST123",
    customerName: "Test Customer",
    customerEmail: "test@harekrishnamedical.com",
    customerPhone: "+91 99999 88888",
    customerMobile: "+91 99999 88888",
    customerAddress: "Test Address, Test City, 000000",
    paymentMethod: "Net Banking",
    paymentStatus: "Completed",
    status: "paid",
    total: 499.0,
    totalAmount: 499.0,
    subtotal: 499.0,
    tax: 0,
    shipping: 0,
    createdAt: new Date().toISOString(),
    items: [
      {
        name: "Test Medicine",
        productName: "Test Medicine",
        description: "Sample medicine for testing purposes",
        quantity: 1,
        price: 199.0,
        total: 199.0,
      },
      {
        name: "Test Equipment",
        productName: "Test Equipment",
        description: "Sample medical equipment for demo",
        quantity: 1,
        price: 300.0,
        total: 300.0,
      },
    ],
  },
};

// Function to get demo invoice by ID
export const getDemoInvoice = (invoiceId) => {
  return demoInvoices[invoiceId] || null;
};

// Function to check if invoice ID is a demo invoice
export const isDemoInvoice = (invoiceId) => {
  return demoInvoices.hasOwnProperty(invoiceId);
};

// Function to get all demo invoice IDs
export const getDemoInvoiceIds = () => {
  return Object.keys(demoInvoices);
};
