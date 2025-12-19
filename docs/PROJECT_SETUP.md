# 🚀 PROJECT_SETUP.md
**vite-ts-sass-starter｜初期セットアップガイド**  
（2025-12-19 JST）

---

## 🧩 目的
このドキュメントは、新しい案件をこのスターターから始める際の「最初の5分」を案内します。

---

## 1️⃣ 新規案件の始め方

1. `clients/` 以下にフォルダを作成  
   ```bash
   mkdir clients/new-project
   cp -r starters/vite-ts-sass-starter/* clients/new-project
package.json の name と description を案件名に書き換え

不要な docs/ を削除してもOK（または参照として残す）

src/ 内に案件固有のHTML・画像・スタイルを追加

開発開始！

2️⃣ 依存インストール & 開発起動
bash
コードをコピーする
npm install
npm run dev
開発サーバーが自動で立ち上がり、http://localhost:5174 で確認可能です。

3️⃣ ビルド＆納品までの流れ
フェーズ	コマンド	出力先	用途
開発確認	npm run build:dev	dist-dev	開発中の軽量ビルド
本番想定	npm run build:deliver	dist-deliver	実運用向け（sourcemapなし）
納品生成	npm run package	dist-package-final	納品用パッケージ
納品確認	npm run verify	-	納品構成チェック
ZIP化	npm run zip:package	-	納品zipを自動生成

4️⃣ 推奨ツール
用途	ツール	備考
コードエディタ	VSCode	拡張: Prettier, Sass, Vite
サーバー確認	npx serve	簡易HTTPサーバー
ディレクトリ確認	tree -L 3	階層把握に便利

5️⃣ よくある操作
操作	コマンド例	補足
キャッシュ削除	npm run clean	生成ディレクトリ全削除
型チェック	npm run typecheck	TypeScript の静的解析
本番プレビュー	npm run preview	dist-deliverを確認

✅ 開発スタートチェックリスト
 npm install 済み

 開発サーバー起動確認

 Sass・TS・HTML連携確認

 build-package.js 動作確認済み

© 2025 — vite-ts-sass-starter