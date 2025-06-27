import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [],
  featuredProducts: [],
  selectedProduct: null,
  loading: false,
  error: null,
  filters: {
    search: "",
    category: "",
    priceSort: "", // 'low-to-high' | 'high-to-low'
    viewMode: "card", // 'card' | 'list'
  },
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    setFeaturedProducts: (state, action) => {
      state.featuredProducts = action.payload;
    },
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    updateFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        search: "",
        category: "",
        priceSort: "",
        viewMode: "card",
      };
    },
  },
});

export const {
  setProducts,
  setFeaturedProducts,
  setSelectedProduct,
  setLoading,
  setError,
  updateFilters,
  clearFilters,
} = productsSlice.actions;

export default productsSlice.reducer;
