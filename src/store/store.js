import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice.js";
import cartSlice from "./slices/cartSlice.js";
import productsSlice from "./slices/productsSlice.js";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    cart: cartSlice,
    products: productsSlice,
  },
});
