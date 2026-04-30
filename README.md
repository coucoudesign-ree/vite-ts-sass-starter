このリポジトリは、WordPressテーマ開発における
モダンなビルド環境 × 堅牢なSass設計 をパッケージ化したベーステンプレートです。

LP用・コーポレート用など、プロジェクトごとに派生させて使用します。

🧱 Features

・Vite 7 + HMR
    WordPress上の表示をリロードなしで即座に反映
・TypeScript対応
    UI制御を安全かつクリーンに記述可能
・Dart Sass（@use構文）
    最新Sass設計思想に基づくディレクトリ構造
・Fluid Design Ready
    画面幅に応じた可変フォント・余白（Fluid Typography）を関数1つで実装可能
・Automatic Environment Switcher
    functions.php が Viteサーバーの起動状況を検知し、
    開発用 / 本番用アセットを自動切り替え

⚙️ セットアップ手順
① Local WP の準備
    Local WPなどでサイトを作成
    例：http://wp-vite-lab.local

② テーマの配置
    このリポジトリを以下に配置：
    wp-content/themes/(テーマ名)
③ インストール
    npm install
④ 開発開始
    npm run dev
    WordPressサイトを開き、
    CSS / JS がホットリロードされることを確認。

🧠 Design Check（Fluid設計のリアルタイム検証）
固定ページテンプレートとして実装されています。
以下URLでSassトークンやFluid Clampの挙動を数値確認可能：
http://(あなたのサイトURL)/design-check/

【使用方法】
1.　固定ページ新規作成
2.　テンプレート「Design Check」を選択
3.　公開

📦 Build Commands
コマンド　/　内容
npm run dev	    開発サーバー起動（Vite + WP連携）
npm run build	本番用ビルド（dist/へ圧縮出力）

🎨 Sass ディレクトリ構成
src/scss/
│
├─ settings/        # トークン・関数・mixin
├─ foundation/      # リセット・ベース
├─ layout/          # セクション単位
├─ components/      # 再利用UI
├─ utilities/       # 補助クラス
├─ design-check/    # デザイン検証用
└─ style.scss       # エントリーポイント

📘 開発ルール
■ アセット管理
    画像・フォントは：
    src/assets/

ビルド時に：
    dist/assets/
    へ最適化出力。

■ WordPress関数との共存
    PHP側では：
    get_header();
    get_footer();
    などを適切に使用。

■ CSS変数の活用
    settings/_variables.scss で定義した値は
    :root に展開され、JSからも参照可能。

🧾 納品・公開フロー
① 最終ビルド
    npm run build
② 配布・移行
    dist/ が含まれていることを確認
    テーマフォルダごと納品
    または、All-in-One WP Migration 等でエクスポート

③ 本番環境動作
    functions.php が Viteサーバー不在を検知し、
    自動的に dist/ 内ファイルを参照。

🛠 推奨ツール
・Local (by WP Engine)
・VSCode Extensions
    Prettier
    Dart Sass
    TypeScript Vue Plugin

📋 フォームテンプレート（api/sendmail.php）
プロジェクト派生時に変更が必要な箇所：

① 環境変数（.env.example をコピーして設定）
    MAIL_TO      … 管理者の受信メールアドレス
    MAIL_FROM    … 送信元アドレス（サーバー許可ドメインに合わせる）
    SITE_NAME    … メール件名に使うサイト名
    THANKS_URL   … 送信完了後のリダイレクト先

② ハニーポットフィールド名（api/sendmail.php L80）
    'nickname' → プロジェクトごとに別の名前に変更する
    （公開テンプレートのため、同名フィールドをボットに学習される可能性がある）

③ HTML フォームの id 属性
    form-handler.ts のデフォルト: #js-contact-form
    zip.ts のデフォルト: #postcode → #address

④ ログファイルの保護
    Apache: api/logs/.htaccess 作成済み（Require all denied）
    Nginx:  location /api/logs/ { deny all; } をサーバー設定に追加

🧑‍💻 Author
@matsuokarie