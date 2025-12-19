/**
 * ===========================================
 * ✅ verify-package.js（納品パッケージ検証 完全版）
 * -------------------------------------------
 * - dist-package-final の構成・リンク整合性チェック
 * - favicon / manifest / ogp / robots.txt まで含める
 * ===========================================
 */

import fs from "fs-extra";
import path from "path";
import chalk from "chalk";

const PACKAGE_DIR = path.resolve("dist-package-final");

async function mustExist(relPath) {
  const p = path.join(PACKAGE_DIR, relPath);
  if (!(await fs.pathExists(p))) throw new Error(`❌ ${relPath} が見つかりません`);
  return p;
}

async function verify() {
  console.log(chalk.cyan("🧩 納品物検証開始..."));

  // ✅ 必須ファイル・ディレクトリチェック
  const requiredFiles = [
    "index.html",
    "style.css",
    "robots.txt",
    "favicon.ico",
    "favicon-16x16.png",
    "favicon-32x32.png",
    "apple-touch-icon.png",
    "ogp.jpg",
    "site.webmanifest"
  ];
  const requiredDirs = ["assets/js", "assets/images", "assets/fonts"];

  for (const f of requiredFiles) await mustExist(f);
  for (const d of requiredDirs) await mustExist(d);

  // ✅ HTML構造検証
  const htmlPath = path.join(PACKAGE_DIR, "index.html");
  const html = await fs.readFile(htmlPath, "utf8");

  const checks = [
    { keyword: "./style.css", message: "❌ index.html に ./style.css の参照がありません" },
    { keyword: "./assets/js/", message: "❌ index.html に ./assets/js/ の参照がありません" },
    { keyword: "./assets/images/", message: "❌ index.html に ./assets/images/ の参照がありません" },
    { keyword: "./robots.txt", message: "⚠️ index.html で robots.txt の参照がありません（OKな場合もあります）" }
  ];

  for (const c of checks) {
    if (!html.includes(c.keyword)) {
      console.warn(chalk.yellow(c.message));
    }
  }

  // ✅ robots.txt 内容検証
  const robots = await fs.readFile(path.join(PACKAGE_DIR, "robots.txt"), "utf8");
  if (!robots.includes("Allow: /")) {
    console.warn(chalk.yellow("⚠️ robots.txt に Allow: / が含まれていません（公開禁止設定かも）"));
  }

  console.log(chalk.green("🎉 検証完了：構造・必須ファイルOK"));
}

verify().catch((err) => {
  console.error(chalk.red("❌ verify失敗:"), err.message ?? err);
  process.exitCode = 1;
});
