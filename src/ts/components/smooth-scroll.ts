// =====================================
// Smooth Scroll with Header Offset
// ＋ SPドロワーナビ閉鎖連動版（GSAP ScrollToPlugin）
// =====================================
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { HEADER_OFFSET_PC, HEADER_OFFSET_SP, MQ_PC, SELECTOR } from "@/ts/settings/constants";

gsap.registerPlugin(ScrollToPlugin);

document.addEventListener("DOMContentLoaded", () => {
  // ------------------------------
  // メディアクエリ設定
  // ------------------------------
  const mq = window.matchMedia(MQ_PC);

  // ------------------------------
  // ドロワー要素取得
  // ------------------------------
  const drawerBtn = document.querySelector<HTMLButtonElement>(SELECTOR.drawerButton);
  const drawerNav = document.querySelector<HTMLElement>(SELECTOR.drawerNav);
  const drawerOverlay = document.querySelector<HTMLElement>(SELECTOR.drawerOverlay);

  // ------------------------------
  // ドロワーを閉じる関数（header.ts と同仕様）
  // ------------------------------
  const closeDrawer = () => {
    if (!drawerBtn || !drawerNav) return;
    drawerBtn.classList.remove("is-active");
    drawerNav.classList.remove("is-active");
    drawerOverlay?.classList.remove("is-active");

    drawerBtn.setAttribute("aria-expanded", "false");
    drawerNav.setAttribute("aria-hidden", "true");

    // bodyスクロール解除 + 位置復元
    const top = document.body.style.top;
    document.body.classList.remove("is-fixed");
    document.body.style.top = "";
    const y = top ? Math.abs(parseInt(top, 10)) : 0;
    window.scrollTo({ top: y });
  };

  // ------------------------------
  // アンカーリンククリック監視
  // ------------------------------
  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (!href || href === "#") return;

      const target = document.querySelector<HTMLElement>(href);
      if (!target) return;

      e.preventDefault();

      // PC/SPでヘッダーオフセットを決定
      const offsetY = mq.matches ? HEADER_OFFSET_PC : HEADER_OFFSET_SP;

      // ------------------------------
      // SP時：ドロワーが開いていたら閉じてからスクロール
      // ------------------------------
      if (!mq.matches && drawerBtn?.classList.contains("is-active")) {
        closeDrawer();

        // ドロワー閉じアニメーション完了を待ってスクロール開始
        setTimeout(() => {
          gsap.to(window, {
            duration: 1.1,
            ease: "power2.inOut",
            scrollTo: { y: target, offsetY },
          });
        }, 350); // ← header.ts のアニメーション時間に合わせる
      } else {
        // PC時またはドロワー閉状態なら即スクロール
        gsap.to(window, {
          duration: 1.1,
          ease: "power2.inOut",
          scrollTo: { y: target, offsetY },
        });
      }
    });
  });

  // ------------------------------
  // 初期アクセス（#付きURL）の補正
  // ------------------------------
  if (window.location.hash) {
    const target = document.querySelector<HTMLElement>(window.location.hash);
    if (target) {
      setTimeout(() => {
        const offsetY = mq.matches ? HEADER_OFFSET_PC : HEADER_OFFSET_SP;
        gsap.to(window, { duration: 0, scrollTo: { y: target, offsetY } });
      }, 100);
    }
  }
});
