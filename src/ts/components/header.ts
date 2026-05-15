// header.ts
// =====================================
// グローバルナビ（ハンバーガー＋ドロワー）制御
// ＋ スクロール時のヘッダーシャドウ制御
// =====================================
export function initHeader(): void {
  const btn = document.querySelector('#js-hamburger') as HTMLButtonElement | null;
  const nav = document.querySelector('#js-nav') as HTMLElement | null;
  const overlay = document.querySelector('#js-drawerOverlay') as HTMLElement | null;
  const header = document.querySelector('.l-header') as HTMLElement | null;

  if (!btn || !nav) return;

  const FIRST_FOCUS_SELECTOR = '#js-nav a, #js-nav button, #js-nav [tabindex]:not([tabindex="-1"])';

  let scrollY = 0;
  let resizeTimer: number | null = null;
  const mq = window.matchMedia('(min-width: 960px)');
  const SCROLL_SHADOW_THRESHOLD = 10;

  const isOverlayMode = () => nav.dataset.anim === 'overlay';
  const isOpen = () => btn.classList.contains('is-active');

  const syncAria = (open: boolean) => {
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    nav.setAttribute('aria-hidden', open ? 'false' : 'true');
  };

  const lockScroll = () => {
    scrollY = window.scrollY || window.pageYOffset;
    document.body.style.top = `-${scrollY}px`;
    document.body.classList.add('is-fixed');
  };

  const unlockScroll = () => {
    document.body.classList.remove('is-fixed');
    const top = document.body.style.top;
    document.body.style.top = '';
    const y = top ? Math.abs(parseInt(top, 10)) : 0;
    window.scrollTo({ top: y });
  };

  const disableTransitionsDuring = (ms = 250) => {
    document.documentElement.classList.add('no-anim');
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      document.documentElement.classList.remove('no-anim');
    }, ms);
  };

  const openDrawer = () => {
    btn.classList.add('is-active');
    nav.classList.add('is-active');

    if (!isOverlayMode() && overlay) overlay.classList.add('is-active');

    syncAria(true);
    lockScroll();

    const firstFocusable = nav.querySelector(FIRST_FOCUS_SELECTOR) as HTMLElement | null;
    if (firstFocusable) firstFocusable.focus();
  };

  const closeDrawer = () => {
    btn.classList.remove('is-active');
    nav.classList.remove('is-active');
    if (overlay) overlay.classList.remove('is-active');

    syncAria(false);
    unlockScroll();

    btn.focus();
  };

  const toggleDrawer = () => {
    if (isOpen()) {
      closeDrawer();
    } else {
      openDrawer();
    }
  };

  if (mq.matches) {
    nav.setAttribute('aria-hidden', 'false');
  } else {
    nav.setAttribute('aria-hidden', 'true');
    btn.setAttribute('aria-expanded', 'false');
  }

  const onScrollForHeaderShadow = () => {
    if (!header) return;
    const shouldAddShadow = window.scrollY > SCROLL_SHADOW_THRESHOLD;
    header.classList.toggle('is-scrolled', shouldAddShadow);
  };

  onScrollForHeaderShadow();

  btn.addEventListener('click', toggleDrawer);

  if (overlay) {
    overlay.addEventListener('click', () => {
      if (isOpen()) closeDrawer();
    });
  }

  document.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Escape' && isOpen()) {
      e.preventDefault();
      closeDrawer();
    }
  });

  nav.addEventListener('click', (e) => {
    const a = (e.target as HTMLElement).closest('a');
    if (!a) return;
    if (!mq.matches && isOpen()) closeDrawer();
  });

  window.addEventListener('resize', () => {
    disableTransitionsDuring(250);
  });

  mq.addEventListener('change', (e) => {
    disableTransitionsDuring(250);

    if (e.matches) {
      if (isOpen()) closeDrawer();
      nav.setAttribute('aria-hidden', 'false');
    } else {
      if (!isOpen()) {
        nav.setAttribute('aria-hidden', 'true');
        btn.setAttribute('aria-expanded', 'false');
      }
    }
  });

  window.addEventListener('scroll', onScrollForHeaderShadow);
}
