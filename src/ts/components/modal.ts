import gsap from 'gsap';

const FOCUSABLE_SELECTORS =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function getFocusable(el: HTMLElement): HTMLElement[] {
  return Array.from(el.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS));
}

function trapFocus(modal: HTMLElement, e: KeyboardEvent): void {
  if (e.key !== 'Tab') return;
  const focusable = getFocusable(modal);
  if (focusable.length === 0) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (e.shiftKey) {
    if (document.activeElement === first) {
      e.preventDefault();
      last.focus();
    }
  } else {
    if (document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
}

export function initModal(): void {
  const triggers = document.querySelectorAll<HTMLElement>('[data-modal-trigger]');
  if (triggers.length === 0) return;

  // 現在開いているモーダルとフォーカス復帰先を管理
  let currentModal: HTMLElement | null = null;
  let lastFocused: HTMLElement | null = null;
  let keydownHandler: ((e: KeyboardEvent) => void) | null = null;

  const lockScroll = () => {
    const scrollY = window.scrollY;
    document.body.style.top = `-${scrollY}px`;
    document.body.classList.add('is-fixed');
  };

  const unlockScroll = () => {
    const top = document.body.style.top;
    document.body.classList.remove('is-fixed');
    document.body.style.top = '';
    window.scrollTo({ top: Math.abs(parseInt(top || '0', 10)) });
  };

  const openModal = (modal: HTMLElement, trigger: HTMLElement) => {
    if (currentModal) return; // 多重オープン防止
    currentModal = modal;
    lastFocused = trigger;

    modal.hidden = false;
    modal.setAttribute('aria-hidden', 'false');

    const inner = modal.querySelector<HTMLElement>('.c-modal__inner');
    const overlay = modal.querySelector<HTMLElement>('.c-modal__overlay');

    // 初期状態
    gsap.set(overlay, { autoAlpha: 0 });
    gsap.set(inner, { autoAlpha: 0, scale: 0.95, y: 12 });

    lockScroll();

    gsap
      .timeline()
      .to(overlay, { autoAlpha: 1, duration: 0.25, ease: 'power2.out' })
      .to(inner, { autoAlpha: 1, scale: 1, y: 0, duration: 0.3, ease: 'power2.out' }, '-=0.1');

    // フォーカスを最初の操作可能要素へ
    requestAnimationFrame(() => {
      const focusable = getFocusable(modal);
      (focusable[0] ?? modal).focus();
    });

    // フォーカストラップ
    keydownHandler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal();
        return;
      }
      trapFocus(modal, e);
    };
    document.addEventListener('keydown', keydownHandler);
  };

  const closeModal = () => {
    if (!currentModal) return;
    const modal = currentModal;
    const inner = modal.querySelector<HTMLElement>('.c-modal__inner');
    const overlay = modal.querySelector<HTMLElement>('.c-modal__overlay');

    gsap
      .timeline()
      .to(inner, { autoAlpha: 0, scale: 0.95, y: 8, duration: 0.2, ease: 'power2.in' })
      .to(
        overlay,
        {
          autoAlpha: 0,
          duration: 0.2,
          ease: 'power2.in',
          onComplete: () => {
            modal.hidden = true;
            modal.setAttribute('aria-hidden', 'true');
            unlockScroll();
            lastFocused?.focus();
            currentModal = null;
            lastFocused = null;
          },
        },
        '-=0.05'
      );

    if (keydownHandler) {
      document.removeEventListener('keydown', keydownHandler);
      keydownHandler = null;
    }
  };

  // トリガーボタン
  triggers.forEach((trigger) => {
    const targetId = trigger.dataset.modalTrigger;
    if (!targetId) return;
    const modal = document.getElementById(targetId);
    if (!modal) return;

    trigger.addEventListener('click', () => openModal(modal, trigger));

    // div[role="button"] などボタン以外のトリガーにキーボード対応
    if (trigger.tagName !== 'BUTTON') {
      trigger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openModal(modal, trigger);
        }
      });
    }

    // 閉じるボタン
    modal.querySelectorAll<HTMLElement>('[data-modal-close]').forEach((closeBtn) => {
      closeBtn.addEventListener('click', closeModal);
    });

    // オーバーレイクリックで閉じる
    modal.querySelector<HTMLElement>('.c-modal__overlay')?.addEventListener('click', closeModal);
  });
}
