import { io } from "socket.io-client";

// Set your backend URL here (development or production)
const SOCKET_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

// Create socket instance
const socket = io(SOCKET_URL, {
  transports: ["websocket"],      // force WebSocket transport
  withCredentials: true,          // for cookies/auth headers
  autoConnect: true,              // auto-connect on load
});

export default socket;
