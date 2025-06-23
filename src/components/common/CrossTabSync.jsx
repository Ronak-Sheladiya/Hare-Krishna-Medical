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
      if (e.key === "auth-event") {
        try {
          const authEvent = JSON.parse(e.newValue);

          // Ignore old events (older than 10 seconds)
          if (Date.now() - authEvent.timestamp > 10000) {
            return;
          }

          switch (authEvent.type) {
            case "LOGIN":
              if (!isAuthenticated || !user) {
                dispatch(
                  loginSuccess({
                    user: authEvent.user,
                    rememberMe:
                      authEvent.rememberMe ||
                      localStorage.getItem("user") !== null,
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
    };

    // Listen for storage events
    window.addEventListener("storage", handleStorageChange);

    // Cleanup
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [dispatch, isAuthenticated, user]);

  // Check for session validity on focus
  useEffect(() => {
    const handleFocus = () => {
      // Check if user is still authenticated when tab gains focus
      const storedUser =
        localStorage.getItem("user") || sessionStorage.getItem("user");
      const isStoredAuth =
        localStorage.getItem("isAuthenticated") === "true" ||
        sessionStorage.getItem("isAuthenticated") === "true";

      if (!isAuthenticated && storedUser && isStoredAuth) {
        // Auto-login if valid session exists
        try {
          const user = JSON.parse(storedUser);
          dispatch(
            loginSuccess({
              user,
              rememberMe: localStorage.getItem("user") !== null,
            }),
          );
        } catch (error) {
          console.warn("Error auto-logging in:", error);
        }
      }
    };

    window.addEventListener("focus", handleFocus);

    // Check immediately on mount
    handleFocus();

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [dispatch, isAuthenticated]);

  // This component doesn't render anything
  return null;
};

export default CrossTabSync;
