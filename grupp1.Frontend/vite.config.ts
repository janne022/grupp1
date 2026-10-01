import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { tanstackRouter } from "@tanstack/router-plugin/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }), react()],
  server: {
    proxy: {
      // Proxy API calls to the app service
      "/api": {
        target: process.env.SERVER_HTTPS || process.env.SERVER_HTTP,
        changeOrigin: true,
      },
    },
  },
});
