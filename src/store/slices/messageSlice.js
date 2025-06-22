import { createSlice } from "@reduxjs/toolkit";
import { createDateOffset } from "../../utils/dateUtils";

const initialState = {
  messages: [
    {
      id: 1,
      name: "John Smith",
      email: "john.smith@email.com",
      mobile: "+91 9876543210",
      subject: "Product Inquiry",
      message:
        "Hi, I need information about Paracetamol tablets. What are the side effects and dosage recommendations?",
      priority: "Medium",
      status: "Open",
      isRead: false,
      createdAt: createDateOffset(2), // 2 hours ago
      reply: "",
      repliedAt: null,
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah.j@gmail.com",
      mobile: "+91 9123456789",
      subject: "Order Status Inquiry",
      message:
        "Hello, I placed an order yesterday for Vitamin D3 capsules. Can you please provide the tracking information?",
      priority: "High",
      status: "In Progress",
      isRead: true,
      createdAt: createDateOffset(4), // 4 hours ago
      reply:
        "Thank you for contacting us. Your order has been processed and will be shipped within 24 hours.",
      repliedAt: createDateOffset(1), // 1 hour ago
    },
    {
      id: 3,
      name: "Michael Brown",
      email: "mike.brown@company.com",
      mobile: "+91 9988776655",
      subject: "Bulk Order Request",
      message:
        "We are a healthcare facility looking to place bulk orders for medical supplies. Please share your wholesale pricing and minimum order quantities.",
      priority: "High",
      status: "Open",
      isRead: false,
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
      reply: "",
      repliedAt: null,
    },
    {
      id: 4,
      name: "Priya Patel",
      email: "priya.patel@email.com",
      mobile: "+91 9876512345",
      subject: "Product Availability",
      message:
        "Is the Blood Pressure Monitor currently in stock? I need it urgently for my father. Also, do you provide home delivery in our area?",
      priority: "Medium",
      status: "Replied",
      isRead: true,
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
      reply:
        "Yes, the BP monitor is in stock. We provide home delivery across the city. Your order will be delivered within 2-3 hours.",
      repliedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
    },
    {
      id: 5,
      name: "Rahul Kumar",
      email: "rahul.k@techcorp.in",
      mobile: "+91 9123498765",
      subject: "Website Feedback",
      message:
        "Great website! The ordering process is very smooth. However, I think you should add more payment options like UPI and digital wallets.",
      priority: "Low",
      status: "Closed",
      isRead: true,
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      reply:
        "Thank you for your feedback! We're working on adding more payment options including UPI and digital wallets.",
      repliedAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(), // 20 hours ago
    },
    {
      id: 6,
      name: "Dr. Anjali Sharma",
      email: "dr.anjali@clinic.com",
      mobile: "+91 9988123456",
      subject: "Professional Discount Inquiry",
      message:
        "Hello, I am a practicing doctor and would like to know if you offer professional discounts for healthcare practitioners. Please share the details.",
      priority: "Medium",
      status: "Open",
      isRead: false,
      createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
      reply: "",
      repliedAt: null,
    },
  ],
  unreadCount: 3,
  loading: false,
  error: null,
};

const messageSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
      state.unreadCount = action.payload.filter((msg) => !msg.isRead).length;
    },
    addMessage: (state, action) => {
      state.messages.unshift(action.payload);
      if (!action.payload.isRead) {
        state.unreadCount += 1;
      }
    },
    markAsRead: (state, action) => {
      const messageId = action.payload;
      const message = state.messages.find((msg) => msg.id === messageId);
      if (message && !message.isRead) {
        message.isRead = true;
        state.unreadCount -= 1;
      }
    },
    markMessageAsRead: (state, action) => {
      const messageId = action.payload;
      const message = state.messages.find((msg) => msg.id === messageId);
      if (message && !message.isRead) {
        message.isRead = true;
        state.unreadCount -= 1;
      }
    },
    markMessageAsUnread: (state, action) => {
      const messageId = action.payload;
      const message = state.messages.find((msg) => msg.id === messageId);
      if (message && message.isRead) {
        message.isRead = false;
        state.unreadCount += 1;
      }
    },
    markAllAsRead: (state) => {
      state.messages.forEach((msg) => {
        msg.isRead = true;
      });
      state.unreadCount = 0;
    },
    deleteMessage: (state, action) => {
      const messageId = action.payload;
      const messageIndex = state.messages.findIndex(
        (msg) => msg.id === messageId,
      );
      if (messageIndex !== -1) {
        const message = state.messages[messageIndex];
        if (!message.isRead) {
          state.unreadCount -= 1;
        }
        state.messages.splice(messageIndex, 1);
      }
    },
    replyToMessage: (state, action) => {
      const { messageId, reply, repliedAt } = action.payload;
      const message = state.messages.find((msg) => msg.id === messageId);
      if (message) {
        message.reply = reply;
        message.repliedAt = repliedAt;
        message.isRead = true;
        if (!message.isRead) {
          state.unreadCount -= 1;
        }
      }
    },
    updateMessageStatus: (state, action) => {
      const { messageId, status } = action.payload;
      const message = state.messages.find((msg) => msg.id === messageId);
      if (message) {
        message.status = status;
      }
    },
  },
});

export const {
  setLoading,
  setError,
  setMessages,
  addMessage,
  markAsRead,
  markMessageAsRead,
  markMessageAsUnread,
  markAllAsRead,
  deleteMessage,
  replyToMessage,
  updateMessageStatus,
} = messageSlice.actions;

export default messageSlice.reducer;
