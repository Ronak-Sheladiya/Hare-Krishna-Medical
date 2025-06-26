// src/utils/socketClient.js
import { io } from "socket.io-client";

let socket = null;

const socketClient = {
  connect: (token, role) => {
    if (socket && socket.connected) return;

    socket = io(import.meta.env.VITE_BACKEND_URL || "http://localhost:5000", {
      transports: ["websocket"],
      auth: { token, role },
    });

    socket.on("connect", () => {
      console.log("🔌 Socket connected:", socket.id);
      if (role === 1) {
        socket.emit("join-admin");
      } else {
        socket.emit("join-user", token);
      }
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Socket connect error:", err.message);
    });
  },

  disconnect: () => {
    if (socket) {
      socket.disconnect();
      socket = null;
    }
  },

  getSocket: () => socket,

  getConnectionStatus: () => {
    return socket ? socket.connected : false;
  },
};

export default socketClient;
