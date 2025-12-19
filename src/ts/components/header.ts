// header.ts
// =====================================
// グローバルナビ（ハンバーガー＋ドロワー）制御
// ＋ スクロール時のヘッダーシャドウ制御
// =====================================
document.addEventListener('DOMContentLoaded', () => {
  // ------------------------------
  // 要素取得
  // ------------------------------
  const btn = document.querySelector('#js-hamburger') as HTMLButtonElement | null;
  const nav = document.querySelector('#js-nav') as HTMLElement | null;
  const overlay = document.querySelector('#js-drawerOverlay') as HTMLElement | null;
  const header = document.querySelector('.l-header') as HTMLElement | null; // ← ヘッダー本体

  if (!btn || !nav) return;

  // ------------------------------
  // 定数・状態
  // ------------------------------
  const FIRST_FOCUS_SELECTOR =
    '#js-nav a, #js-nav button, #js-nav [tabindex]:not([tabindex="-1"])';

  let scrollY = 0;                      // スクロールロック用に保持するY位置
  let resizeTimer: number | null = null; // リサイズ時の一時的なアニメーション無効化用
  const mq = window.matchMedia('(min-width: 960px)'); // PC判定用メディアクエリ
  const SCROLL_SHADOW_THRESHOLD = 10;   // ヘッダーにシャドウをつけ始めるスクロール量（px）

  // ------------------------------
  // 状態判定系ヘルパー
  // ------------------------------
  const isOverlayMode = () => nav.dataset.anim === 'overlay';      // ナビが overlay モードか
  const isOpen = () => btn.classList.contains('is-active');        // ドロワーが開いているか

  // ------------------------------
  // ARIA属性の同期
  // ------------------------------
  const syncAria = (open: boolean) => {
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    nav.setAttribute('aria-hidden', open ? 'false' : 'true');
  };

  // ------------------------------
  // スクロールロック（SPドロワー開閉時）
  // ------------------------------
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

  // ------------------------------
  // リサイズ時、一時的にトランジション無効化
  // （ブレイクポイント跨ぎで変なアニメーションを防ぐ）
  // ------------------------------
  const disableTransitionsDuring = (ms = 250) => {
    document.documentElement.classList.add('no-anim');
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      document.documentElement.classList.remove('no-anim');
    }, ms);
  };

  // ------------------------------
  // ドロワー開閉
  // ------------------------------
  const openDrawer = () => {
    btn.classList.add('is-active');
    nav.classList.add('is-active');

    // overlay モードでなければ、背景オーバーレイも表示
    if (!isOverlayMode() && overlay) overlay.classList.add('is-active');

    syncAria(true);
    lockScroll();

    // 最初のフォーカス可能要素にフォーカスを移動（アクセシビリティ対応）
    const firstFocusable = nav.querySelector(FIRST_FOCUS_SELECTOR) as HTMLElement | null;
    if (firstFocusable) firstFocusable.focus();
  };

  const closeDrawer = () => {
    btn.classList.remove('is-active');
    nav.classList.remove('is-active');
    if (overlay) overlay.classList.remove('is-active');

    syncAria(false);
    unlockScroll();

    // トリガーだったボタンにフォーカスを戻す
    btn.focus();
  };

  const toggleDrawer = () => {
    isOpen() ? closeDrawer() : openDrawer();
  };

  // ------------------------------
  // 初期状態のARIA同期（PC / SP）
  // ------------------------------
  if (mq.matches) {
    // PC幅：ナビは常に表示
    nav.setAttribute('aria-hidden', 'false');
  } else {
    // SP幅：閉じた状態を初期値に
    nav.setAttribute('aria-hidden', 'true');
    btn.setAttribute('aria-expanded', 'false');
  }

  // ------------------------------
  // ヘッダーシャドウ制御（スクロール量に応じて .is-scrolled を付け外し）
  // ------------------------------
  const onScrollForHeaderShadow = () => {
    if (!header) return;
    const shouldAddShadow = window.scrollY > SCROLL_SHADOW_THRESHOLD;
    header.classList.toggle('is-scrolled', shouldAddShadow);
  };

  // 初期表示時（リロード直後）にも一度判定しておく
  onScrollForHeaderShadow();

  // ------------------------------
  // イベント登録
  // ------------------------------
  // ハンバーガーボタン：開閉
  btn.addEventListener('click', toggleDrawer);

  // オーバーレイクリックで閉じる
  if (overlay) {
    overlay.addEventListener('click', () => {
      if (isOpen()) closeDrawer();
    });
  }

  // Escキーで閉じる
  document.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Escape' && isOpen()) {
      e.preventDefault();
      closeDrawer();
    }
  });

  // ナビ内リンククリック時：SPの場合は自動で閉じる
  nav.addEventListener('click', (e) => {
    const a = (e.target as HTMLElement).closest('a');
    if (!a) return;
    if (!mq.matches && isOpen()) closeDrawer();
  });

  // ウィンドウリサイズ時：一時的にアニメーション無効化
  window.addEventListener('resize', () => {
    disableTransitionsDuring(250);
  });

  // ブレイクポイント跨ぎ（SP ↔ PC）のときの挙動
  mq.addEventListener('change', (e) => {
    disableTransitionsDuring(250);

    if (e.matches) {
      // PC幅になったとき
      if (isOpen()) closeDrawer(); // 開いていたら一旦閉じる
      nav.setAttribute('aria-hidden', 'false');
    } else {
      // SP幅になったとき
      if (!isOpen()) {
        nav.setAttribute('aria-hidden', 'true');
        btn.setAttribute('aria-expanded', 'false');
      }
    }
  });

  // スクロール時：ヘッダーのシャドウ制御
  window.addEventListener('scroll', onScrollForHeaderShadow);
});
