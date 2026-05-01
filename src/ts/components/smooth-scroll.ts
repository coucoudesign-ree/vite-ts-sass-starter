// =====================================
// Smooth Scroll with Header Offset
// ＋ SPドロワーナビ閉鎖連動版（GSAP ScrollToPlugin）
// =====================================
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { HEADER_OFFSET_PC, HEADER_OFFSET_SP, MQ_PC, SELECTOR } from "@/ts/settings/constants";

gsap.registerPlugin(ScrollToPlugin);

export function initSmoothScroll(): void {
  const mq = window.matchMedia(MQ_PC);

  const drawerBtn = document.querySelector<HTMLButtonElement>(SELECTOR.drawerButton);
  const drawerNav = document.querySelector<HTMLElement>(SELECTOR.drawerNav);
  const drawerOverlay = document.querySelector<HTMLElement>(SELECTOR.drawerOverlay);

  const closeDrawer = () => {
    if (!drawerBtn || !drawerNav) return;
    drawerBtn.classList.remove("is-active");
    drawerNav.classList.remove("is-active");
    drawerOverlay?.classList.remove("is-active");

    drawerBtn.setAttribute("aria-expanded", "false");
    drawerNav.setAttribute("aria-hidden", "true");

    const top = document.body.style.top;
    document.body.classList.remove("is-fixed");
    document.body.style.top = "";
    const y = top ? Math.abs(parseInt(top, 10)) : 0;
    window.scrollTo({ top: y });
  };

  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (!href || href === "#") return;

      const target = document.querySelector<HTMLElement>(href);
      if (!target) return;

      e.preventDefault();

      const offsetY = mq.matches ? HEADER_OFFSET_PC : HEADER_OFFSET_SP;

      // モーダル閉鎖アニメーション（~400ms）完了を待ってからスクロール
      const modalDelay = document.body.classList.contains("is-fixed") ? 450 : 0;

      const doScroll = () => {
        if (!mq.matches && drawerBtn?.classList.contains("is-active")) {
          closeDrawer();
          setTimeout(() => {
            gsap.to(window, {
              duration: 1.1,
              ease: "power2.inOut",
              scrollTo: { y: target, offsetY },
            });
          }, 350);
        } else {
          gsap.to(window, {
            duration: 1.1,
            ease: "power2.inOut",
            scrollTo: { y: target, offsetY },
          });
        }
      };

      if (modalDelay > 0) {
        setTimeout(doScroll, modalDelay);
      } else {
        doScroll();
      }
    });
  });

  if (window.location.hash) {
    const target = document.querySelector<HTMLElement>(window.location.hash);
    if (target) {
      setTimeout(() => {
        const offsetY = mq.matches ? HEADER_OFFSET_PC : HEADER_OFFSET_SP;
        gsap.to(window, { duration: 0, scrollTo: { y: target, offsetY } });
      }, 100);
    }
  }
}
