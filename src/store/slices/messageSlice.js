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
