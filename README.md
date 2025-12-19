🚀 Features

🧱 Vite + TypeScript + Dart Sass (@use構文)

🧩 3ビルド構成対応
dist-dev（開発ビルド）
dist-deliver（公開用ビルド）
dist-package-final（納品パッケージ）

🧰 Utility Scripts
build-package.js（納品パッケージ生成）
verify-package.js（納品ファイル検証）

🌐 モード別 robots.txt / favicon / .env 対応

🎨 Sass設計済み構造
settings / foundation / layout / components / utilities / design-check

📘 ドキュメント付属
docs/PROJECT_SETUP.md … 初期セットアップ
docs/STRUCTURE_GUIDE.md … ディレクトリ説明
docs/OPERATIONS_RULES.md … 運用ルール

⚙️ セットアップ手順
1️⃣ リポジトリ取得
git clone <your-repo-url>
cd vite-ts-sass-starter

2️⃣ パッケージインストール
npm install

3️⃣ 開発サーバー起動
npm run dev


ブラウザが自動的に起動します：
👉 http://localhost:5173

🧠 Design Check（Fluid設計確認）

開発中に design-check.html を開くことで、
Sassトークン（color, spacing, fluid-clampなど）の挙動をリアルタイムで確認できます。

http://localhost:5173/src/design-check.html


対応SCSS: src/scss/design-check/_design-check.scss

📦 Build Commands
コマンド	内容
npm run dev	開発サーバー起動（Vite）
npm run build:dev	dist-dev 出力（開発用）
npm run build:deliver	dist-deliver 出力（公開用）
npm run package	dist-package-final 生成（納品形式）
npm run verify	納品ファイル構成検証（verify-package.js）
🎨 Sassディレクトリ構成
src/scss/
├── settings/         # トークン・関数・mixin定義
│   ├── _variables.scss
│   ├── _functions.scss
│   └── _mixins.scss
├── foundation/       # リセット・ベーススタイル
│   ├── _reset.scss
│   └── _base.scss
├── layout/           # セクションレイアウト
├── components/       # UIパーツ
├── utilities/        # 補助クラス群
│   ├── _u-display.scss
│   └── _u-accessibility.scss
├── design-check/     # デザイン確認用
│   ├── _design-check.scss
│   └── style.design-check.scss
└── style.scss        # メインスタイルエントリ

📘 運用ルール（スターター共通）
✅ 触ってOKな領域
カテゴリ	パス
デザイン実装	src/scss/layout/, src/scss/components/
スクリプト拡張	src/ts/components/
画像・フォント	src/assets/
🚫 編集禁止（共通基盤）
カテゴリ	パス
設定 / 関数系	src/scss/settings/
ベーススタイル	src/scss/foundation/
ビルドスクリプト	build/
検証系	src/scss/design-check/, src/design-check.html
🧱 ファイル構成（概要）
vite-ts-sass-starter/
├── build/
│   ├── build-package.js        # 納品整形スクリプト
│   └── verify-package.js       # 検証スクリプト
├── docs/
│   ├── PROJECT_SETUP.md
│   ├── STRUCTURE_GUIDE.md
│   └── OPERATIONS_RULES.md
├── src/
│   ├── scss/                   # Sass設計
│   ├── ts/                     # TypeScript（UI制御）
│   ├── assets/                 # 画像・フォント
│   └── design-check.html       # Design確認ページ
├── vite.config.ts
├── tsconfig.json
├── package.json
└── README.md

💡 Tips
🧭 デザイントークンを追加したいとき

src/scss/settings/_variables.scss にトークンを追加。
SCSS内では f.color(), f.space(), f.fluid-value() で参照可能。

🧱 レイアウト追加

src/scss/layout/_l-*.scss を作成し、
src/scss/style.scss に @use で読み込み。

🧩 .env 管理ルール
環境	ファイル	用途
開発	.env.dev	開発環境で使用される設定
公開 / 納品	.env.deliver	本番サーバー・納品パッケージ用設定

環境切り替えは Vite の --mode オプションで制御。

例：

vite build --mode deliver

🧾 納品ワークフロー
手順	コマンド	説明
1️⃣ 公開ビルド生成	npm run build:deliver	本番環境で確認
2️⃣ 納品パッケージ生成	npm run package	dist-package-final 出力
3️⃣ 納品検証	npm run verify	構造・必須ファイル自動チェック
🧩 検証内容（verify-package.js）

index.html, style.css の存在確認

assets/js, assets/images, assets/fonts の存在確認

robots.txt / favicon の検証

index.html 内のリンク整合性チェック（相対パス確認）

🧱 推奨ツール / バージョン
ツール	バージョン	備考
Node.js	v20+	安定動作確認済み
Vite	v7+	最適化済み
Dart Sass	v3+	新構文完全対応
TypeScript	v5+	型サポート強化
🧑‍💻 Author

@matsuokarie
Frontend Developer / Design System Engineer
Building beautiful & consistent web foundations 🩶

🪄 License

MIT License — Free for personal and commercial use.

🏁 Quick Recap
手順	コマンド	結果
1️⃣ 依存関係インストール	npm install	node_modules生成
2️⃣ 開発起動	npm run dev	http://localhost:5173

3️⃣ デザイン確認	http://localhost:5173/src/design-check.html	fluid設計チェック
4️⃣ 納品確認	npm run package → npm run verify	dist-package-final出力OK
