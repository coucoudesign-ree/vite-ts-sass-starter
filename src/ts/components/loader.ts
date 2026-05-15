import gsap from 'gsap';

const STORAGE_KEY = 'linnoa:openingAnimationPlayed';

export function initOpeningAnimation(): void {
  const loading = document.querySelector('[data-opening-animation]');
  const text = document.querySelector('[data-opening-animation="text"]');
  const logo = document.querySelector('[data-opening-animation="logo"]');

  if (!loading || !text || !logo) return;

  // アニメーションをスキップする際の即時非表示処理
  const hideLoaderInstantly = () => {
    gsap.set([text, logo], { autoAlpha: 1, y: 0 });
    gsap.set(loading, { autoAlpha: 0, display: 'none', clipPath: 'inset(0 100% 0 0)' });
    loading.setAttribute('aria-hidden', 'true');
  };

  try {
    if (sessionStorage.getItem(STORAGE_KEY) === 'true') {
      hideLoaderInstantly();
      return;
    }
  } catch (error) {
    // sessionStorage が使えない環境では常に再生する
    console.warn('sessionStorage unavailable, playing opening animation each load.', error);
  }

  // 初期状態の設定
  gsap.set(text, { autoAlpha: 0, y: 60 }); // テキストを非表示に/下に配置
  gsap.set(logo, { autoAlpha: 0 }); // ロゴを非表示に

  // ページ読み込み完了時にアニメーションを開始
  const startAnimation = () => {
    try {
      sessionStorage.setItem(STORAGE_KEY, 'true'); // 同一セッション内は1度だけ再生
    } catch (error) {
      console.warn('sessionStorage unavailable, cannot remember opening animation state.', error);
    }

    const tl = gsap.timeline();

    tl.to(text, {
      autoAlpha: 1,
      duration: 1.33,
      ease: 'power2.inOut',
    })
      .to(
        text,
        {
          y: -10,
          duration: 1.33,
          ease: 'power2.inOut',
        },
        '+=0.66'
      )
      .to(
        logo,
        {
          autoAlpha: 1,
          duration: 1.33,
          ease: 'power2.inOut',
        },
        '-=1.33'
      )
      .to(
        loading,
        {
          clipPath: 'inset(0 100% 0 0)', // 👈 ← 修正ポイント（右スライドアウト）
          duration: 1,
          ease: 'power2.inOut',
          onComplete: hideLoaderInstantly,
        },
        '+=0.33'
      );
  };

  if (document.readyState === 'complete') {
    startAnimation();
  } else {
    window.addEventListener('load', startAnimation);
  }
}
