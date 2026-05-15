import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollToPlugin);

export function initPagetop(): void {
  const pagetop = document.querySelector<HTMLAnchorElement>('.js-pagetop');
  const footer = document.querySelector<HTMLElement>('footer');
  const hero = document.querySelector<HTMLElement>('#hero');

  if (!pagetop || !footer || !hero) return;

  gsap.set(pagetop, { opacity: 0, y: 40, pointerEvents: 'none' });

  const heroObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          gsap.to(pagetop, {
            opacity: 0,
            y: 40,
            duration: 0.6,
            ease: 'power2.in',
            pointerEvents: 'none',
          });
        } else {
          gsap.to(pagetop, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power2.out',
            pointerEvents: 'auto',
          });
        }
      });
    },
    {
      root: null,
      threshold: 0,
      rootMargin: '-50% 0px 0px 0px',
    }
  );

  heroObserver.observe(hero);

  const footerObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        pagetop.classList.add('is-fixed');
      } else {
        pagetop.classList.remove('is-fixed');
      }
    });
  });
  footerObserver.observe(footer);

  pagetop.addEventListener('click', (e) => {
    e.preventDefault();
    gsap.to(window, {
      scrollTo: { y: 0 },
      duration: 1.2,
      ease: 'power2.inOut',
    });
  });
}
