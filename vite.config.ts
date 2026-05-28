import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "lucide-react": "/src/lib/lucide-react.tsx",
    },
  },
  server: {
    host: true,
  },
});
