import { defineConfig } from "vite";
import path from "path";

// Static HTML build config for Vercel / standalone deployment.
// WordPress build uses vite.config.ts instead.
export default defineConfig({
  root: "src",
  base: "/",

  build: {
    outDir: path.resolve(__dirname, "dist"),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: path.resolve(__dirname, "src/index.html"),
        corporate: path.resolve(__dirname, "src/corporate.html"),
      },
    },
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@scss": path.resolve(__dirname, "./src/scss"),
      "@assets": path.resolve(__dirname, "./src/assets"),
    },
  },

  css: {
    devSourcemap: true,
    preprocessorOptions: {
      scss: {
        additionalData: `
          @use "@scss/settings/_variables.scss" as *;
          @use "@scss/settings/_mixins.scss" as *;
        `,
      },
    },
  },

  plugins: [],
});
