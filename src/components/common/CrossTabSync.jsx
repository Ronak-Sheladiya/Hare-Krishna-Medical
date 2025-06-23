import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  loginSuccess,
  logout,
  syncFromStorage,
} from "../../store/slices/authSlice";

/**
 * CrossTabSync Component
 * Handles synchronization of authentication state across browser tabs
 */
const CrossTabSync = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    // Handle storage events (cross-tab communication)
    const handleStorageChange = (e) => {
      // Handle auth events
      if (e.key === "auth-event" && e.newValue) {
        try {
          const authEvent = JSON.parse(e.newValue);

          // Ignore old events (older than 2 seconds)
          if (Date.now() - authEvent.timestamp > 2000) {
            return;
          }

          switch (authEvent.type) {
            case "LOGIN":
              // Only sync if current tab is not authenticated or has different user
              if (!isAuthenticated || !user || user.id !== authEvent.user.id) {
                dispatch(
                  loginSuccess({
                    user: authEvent.user,
                    rememberMe: authEvent.rememberMe || false,
                    skipRedirect: true, // Skip redirect for cross-tab sync
                  }),
                );
              }
              break;

            case "LOGOUT":
              if (isAuthenticated) {
                dispatch(logout());
              }
              break;

            default:
              break;
          }
        } catch (error) {
          console.warn("Error parsing auth event:", error);
        }
      }

      // Handle direct storage changes
      if (e.key === "isAuthenticated") {
        if (e.newValue === "false" || e.newValue === null) {
          // User logged out in another tab
          if (isAuthenticated) {
            dispatch(logout());
          }
        } else if (e.newValue === "true" && !isAuthenticated) {
          // User logged in in another tab - trigger auto-login
          const storedUser =
            localStorage.getItem("user") || sessionStorage.getItem("user");
          if (storedUser) {
            try {
              const userData = JSON.parse(storedUser);
              dispatch(
                loginSuccess({
                  user: userData,
                  rememberMe: localStorage.getItem("user") !== null,
                  skipRedirect: true,
                }),
              );
            } catch (error) {
              console.warn("Error parsing stored user for auto-login:", error);
            }
          }
        }
      }

      // Handle user data changes
      if (e.key === "user") {
        if (e.newValue === null && isAuthenticated) {
          // User data cleared - logout
          dispatch(logout());
        } else if (e.newValue && !isAuthenticated) {
          // User data added - auto-login
          try {
            const userData = JSON.parse(e.newValue);
            dispatch(
              loginSuccess({
                user: userData,
                rememberMe: localStorage.getItem("user") !== null,
                skipRedirect: true,
              }),
            );
          } catch (error) {
            console.warn("Error parsing user data:", error);
          }
        }
      }
    };

    // Listen for storage events
    window.addEventListener("storage", handleStorageChange);

    // Cleanup
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [dispatch, isAuthenticated, user]);

  // Check for session validity on focus and detect changes in storage
  useEffect(() => {
    const handleFocus = () => {
      // Check if user is still authenticated when tab gains focus
      const storedUser =
        localStorage.getItem("user") || sessionStorage.getItem("user");
      const isStoredAuth =
        localStorage.getItem("isAuthenticated") === "true" ||
        sessionStorage.getItem("isAuthenticated") === "true";
      const loginTime =
        localStorage.getItem("loginTime") ||
        sessionStorage.getItem("loginTime");

      // Check if session has expired
      const isExpired = () => {
        if (!loginTime) return true;
        const elapsed = Date.now() - parseInt(loginTime);
        const isLocalStorage = localStorage.getItem("user") !== null;
        const maxAge = isLocalStorage
          ? 7 * 24 * 60 * 60 * 1000
          : 4 * 60 * 60 * 1000;
        return elapsed > maxAge;
      };

      if (!isAuthenticated && storedUser && isStoredAuth && !isExpired()) {
        // Auto-login if valid session exists
        try {
          const userData = JSON.parse(storedUser);
          dispatch(
            loginSuccess({
              user: userData,
              rememberMe: localStorage.getItem("user") !== null,
              skipRedirect: true, // Skip redirect for auto-login
            }),
          );
        } catch (error) {
          console.warn("Error auto-logging in:", error);
          // Clear corrupted data
          localStorage.removeItem("user");
          sessionStorage.removeItem("user");
        }
      } else if (
        isAuthenticated &&
        (!storedUser || !isStoredAuth || isExpired())
      ) {
        // Logout if no valid session
        dispatch(logout());
      }
    };

    // Check for visibility changes (tab switching)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        handleFocus();
      }
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Check immediately on mount
    handleFocus();

    return () => {
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [dispatch, isAuthenticated]);

  // This component doesn't render anything
  return null;
};

export default CrossTabSync;
