// ========================================
// ⚙️ Vite設定（3ビルド：dist-dev / dist-deliver / dist-package）
// ----------------------------------------
// ✅ build:dev     → dist-dev（非公開・検索除外）
// ✅ build:deliver → dist-deliver（公開）
// ✅ build:package → dist-package（納品・公開）
// ========================================

import { defineConfig, loadEnv } from "vite";
import path from "path";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  const outputDirMap: Record<string, string> = {
    production: "dist-dev",
    deliver: "dist-deliver",
    package: "dist-package"
  };
  const outDir = outputDirMap[mode] ?? "dist";

  const isPackage = mode === "package";

  // ✅ robots.txt をモードごとに切替
  const robotsSrcMap: Record<string, string> = {
    production: path.resolve(__dirname, "public/robots_src/robots.dev.txt"), // 開発
    deliver: path.resolve(__dirname, "public/robots_src/robots.deliver.txt"), // 本番
    package: path.resolve(__dirname, "public/robots_src/robots.deliver.txt")  // 納品も公開想定
  };

  console.log(`🚀 Build mode: ${mode}`);
  console.log(`📦 outDir: ${outDir}`);
  console.log(`🌐 SITE_URL: ${env.VITE_SITE_URL || "(not set)"}`);

  return {
    base: isPackage ? "./" : "/",
    root: ".",
    publicDir: false,

    server: {
      port: 5174,
      open: true,
      host: true
    },

    build: {
      outDir,
      emptyOutDir: true,
      sourcemap: mode === "production",
      minify: "terser",
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, "index.html")
        },
        output: {
          assetFileNames: "assets/[name]-[hash][extname]",
          chunkFileNames: "assets/[name]-[hash].js",
          entryFileNames: "assets/[name]-[hash].js"
        }
      }
    },

    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@scss": path.resolve(__dirname, "./src/scss"),
        "@assets": path.resolve(__dirname, "./src/assets")
      }
    },

    css: {
      devSourcemap: true,
      preprocessorOptions: {
        scss: {
          additionalData: `
@use "@scss/settings/_variables.scss" as *;
@use "@scss/settings/_mixins.scss" as *;
          `
        }
      }
    },

    plugins: [
      viteStaticCopy({
        targets: [
          {
            src: robotsSrcMap[mode] ?? robotsSrcMap.production,
            dest: "",
            rename: "robots.txt"
          },
          { src: "public/favicon.ico", dest: "" },
          { src: "public/apple-touch-icon.png", dest: "" },
          { src: "public/favicon-16x16.png", dest: "" },
          { src: "public/favicon-32x32.png", dest: "" },
          { src: "public/ogp.jpg", dest: "" },
          { src: "public/site.webmanifest", dest: "" }
        ]
      })
    ]
  };
});
