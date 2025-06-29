// Socket Connection Tester for debugging
import { io } from "socket.io-client";
import { getSocketURL } from "./config.js";

export const testSocketConnection = async () => {
  const SOCKET_URL = getSocketURL();
  console.log("🧪 Testing Socket Connection to:", SOCKET_URL);

  // First test if backend is reachable
  const backendURL = SOCKET_URL.replace("/socket.io", "");

  try {
    console.log("1️⃣ Testing backend connectivity...");
    const healthCheck = await fetch(`${backendURL}/api/health`, {
      timeout: 5000,
    });

    if (healthCheck.ok) {
      const healthData = await healthCheck.json();
      console.log("✅ Backend is reachable:", healthData);
    } else {
      console.error("❌ Backend health check failed:", healthCheck.status);
      return false;
    }
  } catch (error) {
    console.error("❌ Backend not reachable:", error.message);
    return false;
  }

  // Test socket connection
  return new Promise((resolve) => {
    console.log("2️⃣ Testing Socket.IO connection...");

    const testSocket = io(SOCKET_URL, {
      transports: ["polling", "websocket"],
      timeout: 5000,
      forceNew: true,
      autoConnect: true,
    });

    const timeoutId = setTimeout(() => {
      console.error("❌ Socket connection timeout (5s)");
      testSocket.disconnect();
      resolve(false);
    }, 5000);

    testSocket.on("connect", () => {
      console.log("✅ Socket connected successfully:", testSocket.id);
      clearTimeout(timeoutId);
      testSocket.disconnect();
      resolve(true);
    });

    testSocket.on("connect_error", (error) => {
      console.error("❌ Socket connection error:", error.message);
      clearTimeout(timeoutId);
      testSocket.disconnect();
      resolve(false);
    });

    testSocket.on("disconnect", (reason) => {
      console.log("🔌 Socket disconnected:", reason);
    });
  });
};

// Test and diagnose socket issues
export const diagnoseSocketIssues = async () => {
  console.group("🔍 Socket Connection Diagnosis");

  const SOCKET_URL = getSocketURL();
  const backendURL = SOCKET_URL.replace("/socket.io", "");

  console.log("🔧 Configuration:");
  console.log("- Socket URL:", SOCKET_URL);
  console.log("- Backend URL:", backendURL);
  console.log("- Environment:", import.meta.env.MODE);

  // Test backend health
  try {
    const response = await fetch(`${backendURL}/api/health`);
    const data = await response.json();
    console.log("✅ Backend Health:", data);
  } catch (error) {
    console.error("❌ Backend Health Error:", error.message);
  }

  // Test socket connection
  const socketWorking = await testSocketConnection();

  if (socketWorking) {
    console.log("✅ Socket connection is working properly");
  } else {
    console.error("❌ Socket connection is failing");
    console.log("🔧 Troubleshooting suggestions:");
    console.log("- Check if backend server is running on port 5000");
    console.log("- Verify CORS settings allow frontend domain");
    console.log("- Check firewall/network restrictions");
    console.log("- Try switching to production backend URL");
  }

  console.groupEnd();
  return socketWorking;
};
