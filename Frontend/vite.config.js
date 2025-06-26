import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/socket.io": {
        target: "http://localhost:5000", // Backend URL
        ws: true,                         // Enable WebSocket proxying
        changeOrigin: true,
      },
    },
  },
});
