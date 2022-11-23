import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import setupPlugins from "./vite/plugins";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [setupPlugins()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "#": fileURLToPath(new URL("./types", import.meta.url)),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8080/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
