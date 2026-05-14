// CDN経由ライブラリのグローバル型定義

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare const Swiper: new (
  container: string | HTMLElement,
  options?: Record<string, unknown>
) => { destroy(): void; update(): void };
