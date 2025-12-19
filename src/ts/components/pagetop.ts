import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollToPlugin);

document.addEventListener("DOMContentLoaded", () => {
  const pagetop = document.querySelector<HTMLAnchorElement>(".js-pagetop");
  const footer = document.querySelector<HTMLElement>("footer");
  const hero = document.querySelector<HTMLElement>("#hero");

  if (!pagetop || !footer || !hero) return;

  // 初期非表示
  gsap.set(pagetop, { opacity: 0, y: 40, pointerEvents: "none" });

  // ✅ Heroが見えている間は非表示、消えたら表示
  const heroObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Heroが画面にある → 非表示
          gsap.to(pagetop, {
            opacity: 0,
            y: 40,
            duration: 0.6,
            ease: "power2.in",
            pointerEvents: "none",
          });
        } else {
          // Heroが画面外に出た → 表示
          gsap.to(pagetop, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
            pointerEvents: "auto",
          });
        }
      });
    },
    {
      root: null, // viewport
      threshold: 0, // 一部でも見えてたら "見えている" 扱い
      // rootMargin: "0px", // オフセットなし
      rootMargin: "-50% 0px 0px 0px"
    }
  );

  heroObserver.observe(hero);

  // ✅ Footer監視（下で固定解除）
  const footerObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        pagetop.classList.add("is-fixed");
      } else {
        pagetop.classList.remove("is-fixed");
      }
    });
  });
  footerObserver.observe(footer);

  // ✅ クリックでスムーススクロール
  pagetop.addEventListener("click", (e) => {
    e.preventDefault();
    gsap.to(window, {
      scrollTo: { y: 0 },
      duration: 1.2,
      ease: "power2.inOut",
    });
  });
});
