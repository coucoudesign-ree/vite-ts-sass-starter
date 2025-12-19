# 🧱 STRUCTURE_GUIDE.md
**vite-ts-sass-starter｜構成と設計ルール**  
🗓️ 2025-12-19 JST

---

## 📁 ディレクトリ構成（基本）

src/
├─ scss/ # Sass設計レイヤー（Dart Sass @use）
│ ├─ settings/ # 設定：変数・mixin・関数
│ ├─ foundation/ # ベース：reset, typographyなど
│ ├─ layout/ # 構造：header, section, footerなど
│ ├─ components/ # UIパーツ：ボタン、フォームなど
│ ├─ utilities/ # ユーティリティ：補助クラス
│ └─ style.scss # エントリーポイント
│
├─ ts/ # TypeScript構成
│ ├─ components/ # ページ単位・UI処理
│ └─ settings/ # 定数・環境設定
│
└─ assets/
├─ images/
└─ fonts/

perl
コードをコピーする

---

## 🧩 Sass設計ポリシー

| レイヤー | 役割 | 命名ルール |
|-----------|------|-------------|
| `settings` | 全体設定 | `_variables.scss`, `_mixins.scss`, `_functions.scss` |
| `foundation` | ベースリセット | `_reset.scss`, `_base.scss` |
| `layout` | ページ構造 | `_l-header.scss`, `_l-section.scss` |
| `components` | 再利用UI | `_c-button.scss`, `_c-form.scss` |
| `utilities` | 状態変更補助 | `_u-display.scss`, `_u-accessibility.scss` |

Dart Sassの@useルールでモジュール管理を行います：

```scss
@use "settings/variables" as v;
@use "settings/mixins" as m;
@use "settings/functions" as f;
💧 Fluid系関数の使い方（可変デザイン対応）
vite-ts-sass-starter では、画面幅に応じてフォント・余白・幅などを
滑らかに可変させるための fluid関数群 を実装しています。

🧠 概念
fluid 系とは「min値（小画面）」と「max値（大画面）」の間を
clamp() 式で自動補間してくれる仕組みです。

例：

scss
コードをコピーする
font-size: f.fluid-clamp(16px, 32px);
出力CSS：

css
コードをコピーする
font-size: clamp(1rem, calc(1rem + (2rem - 1rem) * ((100vw - 375px) / (1920 - 375))), 2rem);
→ 画面幅375〜1920pxでフォントが16→32pxに滑らかに変化。

⚙️ 関数一覧と使い分け
関数名	用途	引数	備考
f.fluid-value($min, $max)	あらゆる値（幅・高さ・paddingなど）	px / rem / mapキー	基本の汎用関数
f.fluid-clamp($min, $max)	フォント・line-heightなど	px / rem / mapキー	fluid-valueのalias（可読性重視）
f.fluid-space($min, $max)	スペーシング（余白専用）	トークンキー	$spaces mapを参照
f.fluid-line-height($min, $max)	行間専用	number or key	$line-heights mapを参照

🧱 使用例（Typography）
scss
コードをコピーする
h1 {
  font-size: f.fluid-clamp(24px, 72px);
  line-height: f.fluid-line-height(1.2, 1.4);
}

h2 {
  font-size: f.fluid-clamp(lg, xxl); // トークンキー対応
}

p {
  font-size: f.fluid-clamp(sm, md);
}
🧩 使用例（Layout）
scss
コードをコピーする
.l-section {
  padding-block: f.fluid-space(md, xl);
}

.l-container {
  max-width: f.fluid-value(320px, 1280px);
}
✅ 使い分けルール（スターター共通）
分類	使用関数	理由
フォント・行間	f.fluid-clamp()	名前で「clamp式」とわかる
コンテナ・余白・幅	f.fluid-value()	汎用的に数値制御しやすい
spacingトークン使用	f.fluid-space()	$spacesから自動取得
行間（Typography）	f.fluid-line-height()	一貫性のある行間制御

💬 初学者向けヒント
fluid-value() は「本体（エンジン）」

fluid-clamp() は「わかりやすい呼び名」
→ 両方同じ結果を出すので、Typographyはclamp、Layoutはvalue が目安。

🧱 TypeScript設計ルール
階層	内容
/ts/components/	ページ・UIごとの処理を分割（index.ts など）
/ts/settings/	定数・設定値・ユーティリティなど

命名例：

bash
コードをコピーする
/ts/components/pagetop.ts
/ts/components/form.ts
⚙️ ビルド構造
モード	出力先	説明
dev	dist-dev	開発確認用（sourcemapあり）
deliver	dist-deliver	本番相当（最適化ビルド）
package	dist-package-final	納品用（検証・圧縮済）

🧾 命名ガイド
対象	形式	例
Sass変数	kebab-case	$color-primary
Sassファイル	prefix記法	_c-button.scss, _l-header.scss
TypeScript	camelCase	pageTop.ts, formHandler.ts

💬 コメントルール
SCSS:

scss
コードをコピーする
// ========================================
// Section Title
// ----------------------------------------
TS:

ts
コードをコピーする
// ========================================
// コンポーネント単位コメント
// ----------------------------------------
© 2025 — vite-ts-sass-starter