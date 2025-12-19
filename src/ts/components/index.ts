// ========================================
// 🏠 Linnoa LP - index.ts（トップページ専用処理）
// ========================================

// 🖼️ Swiper（スライダー）
import "./swiper";

// 🌀 アニメーション（GSAPなど必要な場合ここに）
import gsap from "gsap";

// 📩 Web3Forms（フォーム送信）
import "./form";

window.addEventListener("DOMContentLoaded", () => {
  console.log("🏠 Index page loaded!");

  // GSAPアニメーション例（OP演出）
  gsap.from(".hero-title", { opacity: 0, y: 30, duration: 1.2, ease: "power3.out" });
});
