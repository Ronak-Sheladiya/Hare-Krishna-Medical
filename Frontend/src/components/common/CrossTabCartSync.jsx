import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  syncCartFromServer,
} from "../../store/slices/cartSlice";

/**
 * Cross-Tab Cart Synchronization Component
 * Ensures cart state is synchronized across all browser tabs in real-time
 */
const CrossTabCartSync = () => {
  const dispatch = useDispatch();
  const cartState = useSelector((state) => state.cart);

  useEffect(() => {
    let broadcastChannel = null;
    const channelName = "hk_medical_cart_sync";

    // Initialize BroadcastChannel if supported
    try {
      if (typeof BroadcastChannel !== "undefined") {
        broadcastChannel = new BroadcastChannel(channelName);

        // Handle messages from other tabs
        broadcastChannel.onmessage = (event) => {
          const { type, payload, timestamp, tabId } = event.data;

          // Ignore messages from the same tab or old messages
          if (tabId === window.tabId || Date.now() - timestamp > 5000) {
            return;
          }

          console.log(`[Cart Sync] Received ${type} from tab ${tabId}`);

          switch (type) {
            case "CART_ADD_ITEM":
              dispatch(addToCart(payload));
              break;
            case "CART_REMOVE_ITEM":
              dispatch(removeFromCart(payload));
              break;
            case "CART_UPDATE_QUANTITY":
              dispatch(updateQuantity(payload));
              break;
            case "CART_CLEAR":
              dispatch(clearCart());
              break;
            case "CART_SYNC":
              dispatch(syncCartFromServer(payload));
              break;
            default:
              console.warn(`[Cart Sync] Unknown message type: ${type}`);
          }
        };

        console.log("[Cart Sync] BroadcastChannel initialized");
      }
    } catch (error) {
      console.warn("[Cart Sync] BroadcastChannel not available:", error);
    }

    // Handle storage events (fallback for browsers without BroadcastChannel)
    const handleStorageChange = (event) => {
      if (event.key === "hk_cart_event" && event.newValue) {
        try {
          const cartEvent = JSON.parse(event.newValue);

          // Ignore old events
          if (Date.now() - cartEvent.timestamp > 5000) {
            return;
          }

          // Ignore events from the same tab
          if (cartEvent.tabId === window.tabId) {
            return;
          }

          console.log(`[Cart Sync] Storage event: ${cartEvent.type}`);

          // Prevent action loops by checking if state would actually change
          const currentState = cartState;
          let shouldDispatch = true;

          switch (cartEvent.type) {
            case "CART_ADD_ITEM":
              // Check if item already exists with same quantity
              const existingItem = currentState.items.find(
                (item) => item.id === cartEvent.payload.id,
              );
              if (existingItem) {
                shouldDispatch = false; // Item already exists, prevent duplicate
              }
              if (shouldDispatch) dispatch(addToCart(cartEvent.payload));
              break;
            case "CART_REMOVE_ITEM":
              // Check if item exists to remove
              const itemExists = currentState.items.find(
                (item) => item.id === cartEvent.payload,
              );
              if (!itemExists) {
                shouldDispatch = false;
              }
              if (shouldDispatch) dispatch(removeFromCart(cartEvent.payload));
              break;
            case "CART_UPDATE_QUANTITY":
              // Check if quantity is actually different
              const itemToUpdate = currentState.items.find(
                (item) => item.id === cartEvent.payload.id,
              );
              if (
                itemToUpdate &&
                itemToUpdate.quantity === cartEvent.payload.quantity
              ) {
                shouldDispatch = false;
              }
              if (shouldDispatch) dispatch(updateQuantity(cartEvent.payload));
              break;
            case "CART_CLEAR":
              // Only clear if cart has items
              if (currentState.items.length === 0) {
                shouldDispatch = false;
              }
              if (shouldDispatch) dispatch(clearCart());
              break;
            case "CART_SYNC":
              // Compare full state before syncing
              const newState = cartEvent.payload;
              if (JSON.stringify(currentState) === JSON.stringify(newState)) {
                shouldDispatch = false;
              }
              if (shouldDispatch)
                dispatch(syncCartFromServer(cartEvent.payload));
              break;
            default:
              console.warn(
                `[Cart Sync] Unknown storage event: ${cartEvent.type}`,
              );
          }
        } catch (error) {
          console.warn("[Cart Sync] Error parsing cart event:", error);
        }
      }

      // Direct cart state changes (for immediate sync)
      if (event.key === "cart" && event.newValue) {
        try {
          const newCartState = JSON.parse(event.newValue);
          const currentCartState = cartState;

          // Only sync if there's a meaningful difference
          if (
            JSON.stringify(newCartState) !== JSON.stringify(currentCartState)
          ) {
            console.log("[Cart Sync] Direct cart state sync");
            dispatch(syncCartFromServer(newCartState));
          }
        } catch (error) {
          console.warn("[Cart Sync] Error parsing direct cart state:", error);
        }
      }
    };

    // Add storage event listener
    window.addEventListener("storage", handleStorageChange);

    // Generate unique tab ID if not exists
    if (!window.tabId) {
      window.tabId = `tab_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    // Function to broadcast cart events
    const broadcastCartEvent = (type, payload = null) => {
      const event = {
        type,
        payload,
        timestamp: Date.now(),
        tabId: window.tabId,
      };

      try {
        // Use BroadcastChannel if available
        if (broadcastChannel) {
          broadcastChannel.postMessage(event);
        }

        // Fallback to localStorage
        localStorage.setItem("hk_cart_event", JSON.stringify(event));

        // Clean up the event after a short delay
        setTimeout(() => {
          try {
            localStorage.removeItem("hk_cart_event");
          } catch (e) {
            // Ignore cleanup errors
          }
        }, 1000);
      } catch (error) {
        console.warn("[Cart Sync] Error broadcasting event:", error);
      }
    };

    // Store broadcast function globally for cart slice to use
    window.broadcastCartEvent = broadcastCartEvent;

    // Cleanup function
    return () => {
      if (broadcastChannel) {
        broadcastChannel.close();
      }
      window.removeEventListener("storage", handleStorageChange);
      delete window.broadcastCartEvent;
    };
  }, [dispatch, cartState]);

  // This component doesn't render anything
  return null;
};

export default CrossTabCartSync;
