import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(() => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Reduce noisy sourcemap warnings from prebundled deps in some browsers
  optimizeDeps: {
    esbuildOptions: {
      sourcemap: false,
    },
  },
  build: {
    sourcemap: false,
  },
}));
