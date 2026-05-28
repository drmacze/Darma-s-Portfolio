import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import glsl from "vite-plugin-glsl";

export default defineConfig({
  plugins: [react(), glsl()],
  resolve: {
    alias: {
      "lucide-react": "/src/lib/lucide-react.tsx",
    },
  },
  server: {
    host: true,
  },
});
