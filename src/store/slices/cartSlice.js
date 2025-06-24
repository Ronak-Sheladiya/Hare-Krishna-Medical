import { createSlice } from "@reduxjs/toolkit";

// Helper function to load cart from localStorage
const loadCartFromStorage = () => {
  try {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      // Validate cart structure
      if (parsedCart.items && Array.isArray(parsedCart.items)) {
        return parsedCart;
      }
    }
  } catch (error) {
    console.warn("Failed to load cart from localStorage:", error);
  }
  return {
    items: [],
    totalItems: 0,
    totalAmount: 0,
    lastUpdated: Date.now(),
  };
};

// Helper function to save cart to localStorage and broadcast changes
const saveCartToStorage = (state) => {
  try {
    localStorage.setItem("cart", JSON.stringify(state));
  } catch (error) {
    console.warn("Failed to save cart to localStorage:", error);
  }
};

// Helper function to broadcast cart events across tabs with debouncing
let broadcastTimeout;
const broadcastCartEvent = (type, payload = null) => {
  if (typeof window !== "undefined" && window.broadcastCartEvent) {
    // Clear previous timeout to debounce rapid changes
    clearTimeout(broadcastTimeout);
    broadcastTimeout = setTimeout(() => {
      window.broadcastCartEvent(type, payload);
    }, 50); // 50ms debounce
  }
};

const initialState = loadCartFromStorage();

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id,
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }

      state.totalItems = state.items.reduce(
        (total, item) => total + item.quantity,
        0,
      );
      state.totalAmount = state.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0,
      );
      state.lastUpdated = Date.now();

      saveCartToStorage(state);
      broadcastCartEvent("CART_ADD_ITEM", action.payload);
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      state.totalItems = state.items.reduce(
        (total, item) => total + item.quantity,
        0,
      );
      state.totalAmount = state.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0,
      );

      saveCartToStorage(state);
      broadcastCartEvent("CART_REMOVE_ITEM", action.payload);
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((item) => item.id === id);

      if (item) {
        item.quantity = quantity;
        if (item.quantity <= 0) {
          state.items = state.items.filter((item) => item.id !== id);
        }
      }

      state.totalItems = state.items.reduce(
        (total, item) => total + item.quantity,
        0,
      );
      state.totalAmount = state.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0,
      );

      saveCartToStorage(state);
      broadcastCartEvent("CART_UPDATE_QUANTITY", action.payload);
    },
    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.totalAmount = 0;

      saveCartToStorage(state);
      broadcastCartEvent("CART_CLEAR");
    },
    // Add action to sync cart from server or other tabs
    syncCartFromServer: (state, action) => {
      if (action.payload) {
        state.items = action.payload.items || [];
        state.totalItems = action.payload.totalItems || 0;
        state.totalAmount = action.payload.totalAmount || 0;

        saveCartToStorage(state);
        // Only broadcast if this is a server sync, not a cross-tab sync
        if (action.payload.fromServer) {
          broadcastCartEvent("CART_SYNC", action.payload);
        }
      }
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  syncCartFromServer,
} = cartSlice.actions;

export default cartSlice.reducer;
