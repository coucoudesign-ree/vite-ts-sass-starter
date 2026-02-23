import { defineConfig, loadEnv } from "vite";
import path from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  // WPテーマでは、ビルド後のファイルをテーマ内の 'dist' フォルダに集約するのが一般的です
  const outDir = "dist";

  return {
    // 1. WPテーマ内のパスを通すため、ベースパスを空にするか相対パスにします
    base: "./",
    root: ".",

    server: {
      port: 5174,
      strictPort: true, // ポート番号を固定
      cors: true, // ブラウザのセキュリティガードを許可します
      origin: 'http://localhost:5174',
      hmr: {
        host: 'localhost', // WordPressから見に行く先のホスト
      },
      proxy: {
        '^/(?!@vite|src|node_modules|@scss|@assets).*': {
          target: 'http://wp-vite-lab.local', // 最後に / は不要です
          changeOrigin: true,
        },
      },
      fs: {
        allow: [
          path.resolve(__dirname, '.'),
          path.resolve(__dirname, 'src')
        ]
      }
    },

    build: {
      outDir,
      emptyOutDir: true,
      // 3. index.html ではなく、JSとCSSを直接ビルドの入り口にします
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, "src/ts/components/index.ts"), // メインのJS
          style: path.resolve(__dirname, "src/scss/style.scss"), // メインのSass
        },
        output: {
          // WPで読み込みやすいよう、ハッシュ（[hash]）を外した固定名にするのがコツです
          assetFileNames: "assets/[name].[ext]",
          chunkFileNames: "assets/[name].js",
          entryFileNames: "assets/[name].js"
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
    // 一旦、静的コピー（robots.txtなど）はWP側で管理するためプラグインは外してスッキリさせます
    plugins: []
  };
});