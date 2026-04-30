// CDN経由ライブラリのグローバル型定義

declare const Swiper: new (
  container: string | HTMLElement,
  options?: Record<string, unknown>
) => { destroy(): void; update(): void };
