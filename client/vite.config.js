import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      external: [
        "@lichess-org/chessground/assets/chessground.base.css",
        "@lichess-org/chessground/assets/chessground.brown.css",
        "@lichess-org/chessground/assets/chessground.cburnett.css",
      ],
    },
  },
});
