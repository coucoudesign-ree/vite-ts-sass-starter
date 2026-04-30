WordPress × Vite テーマ開発基盤
セットアップ ＆ 運用ガイド

このドキュメントは、本スターターをベースに
新しい WordPress テーマ開発を開始する際の手順と
開発中の運用ルールを定義したものです。

1️⃣ 初期セットアップ手順
新規案件開始時は、以下の流れで構築します。

① テーマフォルダの配置
Local WP 等の環境内：
    wp-content/themes/
配下に本リポジトリを展開。

② プロジェクト名の設定
package.json の以下を案件名に変更：
    "name"
    "description"
※ GitHub公開予定がある場合はここを適当にしない。

③ 依存パッケージのインストール
npm install

④ WordPressでテーマを有効化
管理画面
    → 外観
    → テーマ
    → 「有効化」

⑤ 開発サーバー起動
    npm run dev
    http://localhost:5174

が立ち上がり、WordPress側でHMRが有効になります。

🎯 開発・運用ルール
■ 基本原則
編集対象の限定
対象　/　編集可否
src/	✅ 編集可（Sass / TS / Assets）
*.php	✅ 編集可（テンプレート）
dist/	❌ 手動編集禁止
vite.config.ts	⚠ 原則変更しない

設定ファイルを触る場合は、必ず動作確認を徹底。

■ HMR（ホットリロード）の徹底活用
開発時は常に：
    npm run dev
を起動した状態で作業。
本番ビルド状態で開発しないこと。

■ アセット管理
・画像
・フォント
・SVG
はすべて：
    src/assets/
に集約。

外部CDN依存は原則避ける。
テーマ単体で完結させる。

📁 フォルダ運用ルール
フォルダ	編集	備考
src/	✅	Sass / TS / Assets
*.php	✅	テーマテンプレート
dist/	❌	build自動生成
vite.config.ts	⚠	変更時は要確認

🔄 開発と本番の切り替え
functions.php の自動判定ロジックにより、読み込みパスは自動切替されます。

🚀 Dev Mode（開発中）
・Viteサーバーから直接読み込み
・HMR有効
・コンソール表示：
    🚀 Vite + WordPress 連携中！

📦 Production Mode（本番・納品）
    npm run build

実行後：
dist/ に最適化済みファイル生成
圧縮済みCSS/JSを参照

🧭 推奨メンテナンス・確認手順
タイミング	作業	コマンド / URL
開発開始時	開発環境起動	npm run dev
挙動確認時	デザイン数値確認	/design-check/
納品前	本番ビルド	npm run build
不具合時	dist削除	npm run clean

🧩 よくあるQ&A
Q. マルチページ（カスタムテンプレート）を作りたい
A. ルートに新しいPHPファイルを作成：

page-about.php
CSS / JS は src/ 内で作成し、
    index.ts
    style.scss
で統合。

Q. 特定ページだけで読み込むJSが欲しい
A. 基本は index.ts に統合し一本化推奨。
どうしても分離したい場合：
    vite.config.ts　の　rollupOptions.input
に追記。

⚠ 重要ポリシー
dist/ を直接触らない
ビルド前の動作確認を怠らない
設定ファイル変更は最後の手段
開発は必ず Dev Mode で
