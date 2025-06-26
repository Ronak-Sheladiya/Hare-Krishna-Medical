import { io } from "socket.io-client";

let socket;

const connect = (token, role) => {
  if (!socket) {
    socket = io("http://localhost:5000", {
      transports: ["websocket"],
      auth: {
        token,
        role,
      },
    });

    socket.on("connect", () => {
      console.log("🔌 Connected to WebSocket:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("❌ Disconnected from WebSocket");
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
    });
  }
};

const disconnect = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

const getSocket = () => socket;

export default {
  connect,
  disconnect,
  getSocket,
};
