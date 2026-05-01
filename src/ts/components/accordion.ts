import gsap from 'gsap';

export function initAccordion(): void {
  const items = document.querySelectorAll<HTMLDetailsElement>('details.c-accordion');
  if (items.length === 0) return;

  items.forEach((details) => {
    const summary = details.querySelector<HTMLElement>('.c-accordion__summary');
    const body = details.querySelector<HTMLElement>('.c-accordion__body');
    if (!summary || !body) return;

    // ネイティブの toggle を無効化して GSAP で制御
    summary.addEventListener('click', (e) => {
      e.preventDefault();

      if (details.open) {
        // 閉じる: height → 0 → open 属性を外す
        gsap.to(body, {
          height: 0,
          duration: 0.3,
          ease: 'power2.inOut',
          onComplete: () => {
            details.open = false;
            gsap.set(body, { clearProps: 'height' });
          },
        });
      } else {
        // 開く: open 属性を付けてから height: 0 → auto
        details.open = true;
        gsap.fromTo(
          body,
          { height: 0, overflow: 'hidden' },
          {
            height: 'auto',
            duration: 0.35,
            ease: 'power2.out',
            onComplete: () => {
              gsap.set(body, { clearProps: 'height,overflow' });
            },
          }
        );
      }
    });
  });
}
