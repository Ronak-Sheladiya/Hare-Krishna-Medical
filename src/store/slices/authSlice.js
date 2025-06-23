import { createSlice } from "@reduxjs/toolkit";

// Helper functions for session/cookie management
const getStoredUser = () => {
  try {
    // Check localStorage first
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      return JSON.parse(storedUser);
    }

    // Check sessionStorage as fallback
    const sessionUser = sessionStorage.getItem("user");
    if (sessionUser) {
      return JSON.parse(sessionUser);
    }

    return null;
  } catch (error) {
    console.error("Error parsing stored user:", error);
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
    return null;
  }
};

const getStoredAuth = () => {
  try {
    const isAuth =
      localStorage.getItem("isAuthenticated") === "true" ||
      sessionStorage.getItem("isAuthenticated") === "true";
    return isAuth;
  } catch (error) {
    return false;
  }
};

const setStoredUser = (user, rememberMe = false) => {
  try {
    const userString = JSON.stringify(user);
    if (rememberMe) {
      localStorage.setItem("user", userString);
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("loginTime", Date.now().toString());
    } else {
      sessionStorage.setItem("user", userString);
      sessionStorage.setItem("isAuthenticated", "true");
      sessionStorage.setItem("loginTime", Date.now().toString());
    }
  } catch (error) {
    console.error("Error storing user:", error);
  }
};

const clearStoredUser = () => {
  try {
    localStorage.removeItem("user");
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("loginTime");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("isAuthenticated");
    sessionStorage.removeItem("loginTime");
  } catch (error) {
    console.error("Error clearing stored user:", error);
  }
};

// Check if session is expired (24 hours for localStorage, 2 hours for sessionStorage)
const isSessionExpired = () => {
  try {
    const localLoginTime = localStorage.getItem("loginTime");
    const sessionLoginTime = sessionStorage.getItem("loginTime");

    if (localLoginTime) {
      const elapsed = Date.now() - parseInt(localLoginTime);
      return elapsed > 24 * 60 * 60 * 1000; // 24 hours
    }

    if (sessionLoginTime) {
      const elapsed = Date.now() - parseInt(sessionLoginTime);
      return elapsed > 2 * 60 * 60 * 1000; // 2 hours
    }

    return true;
  } catch (error) {
    return true;
  }
};

// Initialize state with stored values
const initializeState = () => {
  if (isSessionExpired()) {
    clearStoredUser();
    return {
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null,
      rememberMe: false,
    };
  }

  const storedUser = getStoredUser();
  const isAuthenticated = getStoredAuth() && storedUser !== null;

  return {
    user: storedUser,
    isAuthenticated,
    loading: false,
    error: null,
    rememberMe: localStorage.getItem("user") !== null,
  };
};

const initialState = initializeState();

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      const { user, rememberMe = false } = action.payload;
      state.loading = false;
      state.isAuthenticated = true;
      state.user = user;
      state.error = null;
      state.rememberMe = rememberMe;

      // Store user data
      setStoredUser(user, rememberMe);

      // Broadcast login to other tabs
      window.localStorage.setItem(
        "auth-event",
        JSON.stringify({
          type: "LOGIN",
          user,
          timestamp: Date.now(),
        }),
      );

      // Handle redirect after login
      const redirectUrl = sessionStorage.getItem("redirectAfterLogin");
      if (
        redirectUrl &&
        redirectUrl !== "/login" &&
        redirectUrl !== "/register"
      ) {
        sessionStorage.removeItem("redirectAfterLogin");
        // Use setTimeout to allow Redux state to update
        setTimeout(() => {
          window.location.href = redirectUrl;
        }, 100);
      }
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.error = action.payload;
      state.rememberMe = false;

      // Clear any stored data
      clearStoredUser();
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
      state.rememberMe = false;

      // Clear stored data
      clearStoredUser();

      // Broadcast logout to other tabs
      window.localStorage.setItem(
        "auth-event",
        JSON.stringify({
          type: "LOGOUT",
          timestamp: Date.now(),
        }),
      );
    },
    clearError: (state) => {
      state.error = null;
    },
    updateUser: (state, action) => {
      if (state.isAuthenticated && state.user) {
        state.user = { ...state.user, ...action.payload };
        // Update stored user data
        setStoredUser(state.user, state.rememberMe);
      }
    },
    refreshSession: (state) => {
      // Check if session is still valid
      if (isSessionExpired()) {
        state.isAuthenticated = false;
        state.user = null;
        state.error = "Session expired. Please login again.";
        state.rememberMe = false;
        clearStoredUser();
      } else if (state.isAuthenticated && state.user) {
        // Refresh login time
        setStoredUser(state.user, state.rememberMe);
      }
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  clearError,
  updateUser,
  refreshSession,
} = authSlice.actions;

export default authSlice.reducer;
