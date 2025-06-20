import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice.js";
import cartSlice from "./slices/cartSlice.js";
import productsSlice from "./slices/productsSlice.js";
import messageSlice from "./slices/messageSlice.js";
import notificationSlice from "./slices/notificationSlice.js";

const store = configureStore({
  reducer: {
    auth: authSlice,
    cart: cartSlice,
    products: productsSlice,
    messages: messageSlice,
    notifications: notificationSlice,
  },
});

export default store;
