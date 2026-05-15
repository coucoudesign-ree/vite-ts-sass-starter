// =====================================
// SETTINGS / constants.ts
// -------------------------------------
// JS全体で共通利用する定数管理
// =====================================

// 固定ヘッダーの高さ（デザイン確定値+余白10px）
export const HEADER_OFFSET_PC = 120; // px
export const HEADER_OFFSET_SP = 80; // px

// ブレークポイント
export const MQ_PC = '(min-width: 960px)';

// ドロワー関連要素（SP連動用）
export const SELECTOR = {
  drawerButton: '#js-hamburger',
  drawerNav: '#js-nav',
  drawerOverlay: '#js-drawerOverlay',
};
