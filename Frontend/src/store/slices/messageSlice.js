import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  messages: [],
  unreadCount: 0,
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
      const message = state.messages.find(
        (msg) => msg.id === messageId || msg._id === messageId,
      );
      if (message && !message.isRead) {
        message.isRead = true;
        state.unreadCount -= 1;
      }
    },
    markMessageAsRead: (state, action) => {
      const messageId = action.payload;
      const message = state.messages.find(
        (msg) => msg.id === messageId || msg._id === messageId,
      );
      if (message && !message.isRead) {
        message.isRead = true;
        state.unreadCount -= 1;
      }
    },
    markMessageAsUnread: (state, action) => {
      const messageId = action.payload;
      const message = state.messages.find(
        (msg) => msg.id === messageId || msg._id === messageId,
      );
      if (message && message.isRead) {
        message.isRead = false;
        state.unreadCount += 1;
      }
    },
    markAllAsRead: (state) => {
      state.messages.forEach((message) => {
        if (!message.isRead) {
          message.isRead = true;
        }
      });
      state.unreadCount = 0;
    },
    deleteMessage: (state, action) => {
      const messageId = action.payload;
      const messageIndex = state.messages.findIndex(
        (msg) => msg.id === messageId || msg._id === messageId,
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
      const message = state.messages.find(
        (msg) => msg.id === messageId || msg._id === messageId,
      );
      if (message) {
        message.reply = reply;
        message.repliedAt = repliedAt;
        message.status = "Replied";
        if (!message.isRead) {
          message.isRead = true;
          state.unreadCount -= 1;
        }
      }
    },
    updateMessageStatus: (state, action) => {
      const { messageId, status } = action.payload;
      const message = state.messages.find(
        (msg) => msg.id === messageId || msg._id === messageId,
      );
      if (message) {
        message.status = status;
      }
    },
    // Real-time message handling
    receiveNewMessage: (state, action) => {
      const newMessage = action.payload;
      // Avoid duplicates
      const exists = state.messages.some(
        (msg) =>
          (msg.id && msg.id === newMessage.id) ||
          (msg._id && msg._id === newMessage._id),
      );

      if (!exists) {
        state.messages.unshift(newMessage);
        if (!newMessage.isRead) {
          state.unreadCount += 1;
        }
      }
    },
    updateMessageRealTime: (state, action) => {
      const updatedMessage = action.payload;
      const messageIndex = state.messages.findIndex(
        (msg) =>
          (msg.id && msg.id === updatedMessage.id) ||
          (msg._id && msg._id === updatedMessage._id),
      );

      if (messageIndex !== -1) {
        const oldMessage = state.messages[messageIndex];
        const wasUnread = !oldMessage.isRead;
        const isUnread = !updatedMessage.isRead;

        state.messages[messageIndex] = updatedMessage;

        // Update unread count
        if (wasUnread && !isUnread) {
          state.unreadCount -= 1;
        } else if (!wasUnread && isUnread) {
          state.unreadCount += 1;
        }
      }
    },
    clearMessages: (state) => {
      state.messages = [];
      state.unreadCount = 0;
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
  receiveNewMessage,
  updateMessageRealTime,
  clearMessages,
} = messageSlice.actions;

export default messageSlice.reducer;
