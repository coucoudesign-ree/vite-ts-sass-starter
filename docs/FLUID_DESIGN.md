ass設計レイヤー ＆ 可変デザインガイド
このドキュメントは、本テーマにおける
・スタイル設計構造
・レイヤー責務
・Fluid Design（可変デザイン）の実装思想
を明確化するための設計ガイドです。

目的は 再現性のあるUI設計基盤を保つこと。

🧱 設計思想（最重要）
本テーマのスタイル設計は、次の原則に基づいています。

1.責務分離（Layered Architecture）
2.数値の一元管理（Token Driven Design）
3.メディアクエリ依存の最小化
1.将来のスケールを前提にした構造

📁 ディレクトリ構成と設計レイヤー
src/scss/ 配下は Dart Sass の @use ルールに基づき
5レイヤー構造で設計されています。

レイヤー	役割	命名	備考
settings	変数・関数・mixin	_variables, _functions	CSSは出力しない
foundation	リセット・ベース	_reset, _base	全体の基盤
layout	構造パーツ	_l-header, _l-hero	l- 接頭辞
components	再利用UI	_c-button, _c-card	c- 接頭辞
utilities	単一責務	_u-display, _u-spacing	u- 接頭辞

🎯 レイヤー分離の理由
・layout は「構造」
・component は「部品」
・utility は「単機能」
これを混在させないことで、
・CSSの肥大化を防ぐ
・責任範囲を明確にする
・リファクタリング耐性を上げる

🧠 Fluid Design の思想
従来のレスポンシブ設計：
・ブレークポイントごとに数値を書く
・メディアクエリが増える
・管理が煩雑になる

本テーマでは、
min 〜 max の間を clamp() で自動補間
する方式を採用。

（目的）
・メディアクエリ削減
・画面幅全域で自然な拡張
・デザイン崩れの抑制

⚙️ 主要関数一覧
関数	用途
f.fluid-value($min, $max)	汎用可変値
f.fluid-clamp($min, $max)	文字サイズ専用
f.fluid-space($min, $max)	スペーシング専用
f.fluid-line-height($min, $max)	行間専用

🧱 実装例
Typography：
h1 {
  font-size: f.fluid-clamp(24px, 72px);
  line-height: f.fluid-line-height(1.2, 1.4);
}

h2 {
  font-size: f.fluid-clamp(lg, xxl);
}

Layout：
.l-section {
  padding-block: f.fluid-space(md, xl);
}

.l-container {
  max-width: f.fluid-value(320px, 1280px);
}


🧾 命名規則
Sass
・変数：kebab-case
  $color-primary

・ファイル：接頭辞方式
  _c-button.scss

TypeScript
・ファイル名：camelCase
  formHandler.ts

🧩 TypeScript構造
  /ts/components/
→ UI単位の処理分割

  /ts/settings/
→ 定数・ユーティリティ

⚠️ 運用上の重要ルール
・数値の直書きを避ける
・可能な限りトークン経由で指定する
・メディアクエリ追加は最終手段
・layoutに装飾ロジックを書かない