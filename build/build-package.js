/**
 * ===========================================
 * 🧱 build-package.js（納品パッケージ整形：dist-package-final生成）
 * -------------------------------------------
 * dist-deliver → dist-package-final
 * - HTML, CSS, JS, 画像, フォント, robots.txt, ルート静的ファイル
 * ===========================================
 */

import fs from "fs-extra";
import path from "path";
import chalk from "chalk";

const SRC_DIR = path.resolve("dist-deliver");
const DEST_DIR = path.resolve("dist-package-final");

const isImage = (p) => /\.(png|jpe?g|webp|gif|svg)$/i.test(p);
const isFont = (p) => /\.(woff2?|ttf|otf|eot)$/i.test(p);

async function cleanDest() {
  await fs.remove(DEST_DIR);
  await fs.ensureDir(DEST_DIR);
  await fs.ensureDir(path.join(DEST_DIR, "assets/images"));
  await fs.ensureDir(path.join(DEST_DIR, "assets/js"));
  await fs.ensureDir(path.join(DEST_DIR, "assets/fonts"));
  console.log(chalk.gray("🧹 dist-package-final 初期化完了"));
}

async function copyAndFixHTML() {
  const htmlFiles = ["index.html"];
  for (const file of htmlFiles) {
    const src = path.join(SRC_DIR, file);
    const dest = path.join(DEST_DIR, file);
    if (!(await fs.pathExists(src))) continue;
    let html = await fs.readFile(src, "utf8");
    html = html
      .replace(/\/assets\/[A-Za-z0-9._-]+\.css/g, "./style.css")
      .replace(/\/assets\/([A-Za-z0-9._-]+\.js)/g, "./assets/js/$1")
      .replace(/\/assets\/([A-Za-z0-9._-]+\.(png|jpe?g|webp|gif|svg))/g, "./assets/images/$1");
    await fs.outputFile(dest, html);
  }
  console.log(chalk.green("✅ HTML整形完了"));
}

async function copyCSS() {
  const assetDir = path.join(SRC_DIR, "assets");
  const files = (await fs.readdir(assetDir)).filter((f) => f.endsWith(".css"));
  if (files.length === 0) return;
  const css = await fs.readFile(path.join(assetDir, files[0]), "utf8");
  await fs.outputFile(path.join(DEST_DIR, "style.css"), css);
  console.log(chalk.green("✅ CSSコピー完了"));
}

async function copyAssets() {
  const assetDir = path.join(SRC_DIR, "assets");
  const files = await fs.readdir(assetDir);
  for (const file of files) {
    if (isImage(file)) await fs.copy(path.join(assetDir, file), path.join(DEST_DIR, "assets/images", file));
    if (isFont(file)) await fs.copy(path.join(assetDir, file), path.join(DEST_DIR, "assets/fonts", file));
    if (file.endsWith(".js")) await fs.copy(path.join(assetDir, file), path.join(DEST_DIR, "assets/js", file));
  }
  console.log(chalk.green("✅ JS / 画像 / フォントコピー完了"));
}

// ✅ robots.txt コピー処理
async function copyRobots() {
  const src = path.join(SRC_DIR, "robots.txt");
  const dest = path.join(DEST_DIR, "robots.txt");
  if (await fs.pathExists(src)) {
    await fs.copy(src, dest);
    console.log(chalk.green("✅ robots.txt コピー完了"));
  } else {
    console.log(chalk.yellow("⚠️ robots.txt が dist-deliver に見つかりません"));
  }
}

// ✅ 新規追加：favicon / manifest / ogp などルート静的ファイル
async function copyRootStatic() {
  const rootFiles = [
    "favicon.ico",
    "favicon-16x16.png",
    "favicon-32x32.png",
    "apple-touch-icon.png",
    "ogp.jpg",
    "site.webmanifest"
  ];

  for (const file of rootFiles) {
    const src = path.join(SRC_DIR, file);
    const dest = path.join(DEST_DIR, file);
    if (await fs.pathExists(src)) {
      await fs.copy(src, dest);
      console.log(chalk.green(`✅ ${file} コピー完了`));
    }
  }
}

async function buildPackage() {
  console.log(chalk.cyan("🚀 納品パッケージ整形開始"));
  await cleanDest();
  await copyAndFixHTML();
  await copyCSS();
  await copyAssets();
  await copyRobots();
  await copyRootStatic(); // ← ✅ ここを追加
  console.log(chalk.cyan("🎉 dist-package-final 完成"));
}

buildPackage();
