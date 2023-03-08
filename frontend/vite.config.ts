import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths(), svgr()],
  server: {
    watch: {
      usePolling: true,
    },
    host: true,
    port: 8000,
    strictPort: true,
    hmr: {
      port: 8000,
      clientPort: 8000,
      host: "localhost",
      path: "/hmr/",
    },
  },
  preview: {
    port: 8000,
    strictPort: true,
  },
});
