import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";

const src = path.resolve(__dirname, "src");
// https://vitejs.dev/config/
export default defineConfig({
  server: { open: true },
  resolve: {
    alias: {
      "@": src,
      "@pages": path.resolve(src, "pages"),
      "@components": path.resolve(src, "components"),
    },
  },
  plugins: [
    react(),
    VitePWA({
      devOptions: {
        enabled: true,
      },
      // add this to cache all the imports
      workbox: {
        globPatterns: ["**/*"],
      },
      // add this to cache all the
      // static assets in the public folder
      includeAssets: ["**/*"],
      manifest: {
        name: "HiLog",
        short_name: "Hi Log",
        description: "Log your expenses",
        start_url: "/",
        display: "standalone",
        background_color: "#fff",
        theme_color: "#fff",
        orientation: "portrait",
        icons: [
          {
            src: "/favicon.ico",
            sizes: "any",
            type: "image/x-icon",
          },
          {
            src: "/icons-2/icon-144x144.png",
            sizes: "144x144",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/icons-2/icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: "/icons-2/icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
    }),
  ],
});
