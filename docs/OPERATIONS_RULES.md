```markdown
# ⚙️ OPERATIONS_RULES.md
**vite-ts-sass-starter｜運用・更新ルール**
（2025-12-19 JST）

---

## 🎯 基本原則

1. **`src/` 以下だけ編集対象**  
   `build/`, `vite.config.ts`, `docs/` はスターター仕様なので原則変更禁止。

2. **納品は必ず verify を通す**  
   `npm run package && npm run verify` の流れで整合性を担保。

3. **assets はすべて src/assets/ に集約**  
   外部CDNや直リンクは避け、納品物として完結する構造に。

---

## 📦 フォルダ運用ルール

| フォルダ | 編集可否 | 備考 |
|-----------|-----------|------|
| `/src` | ✅ 可 | 案件ごとに更新 |
| `/build` | ⚠️ 原則不可 | スターター共通スクリプト |
| `/docs` | ⚠️ 案件ごとにコピーまたは削除可 |
| `/dist-*` | ❌ 自動生成 | `.gitignore` に含める |

---

## 🔄 アップデート運用

### スターター更新フロー
1. 新しい改善を `starters/vite-ts-sass-starter` に反映  
2. 既存案件に反映したい場合は diff を確認して手動で反映

### 新バージョン作成例
starters/
└─ vite-ts-sass-starter-v2/

yaml
コードをコピーする

---

## 🧩 よくあるQ&A

**Q. build-package.js の出力先を変えたい**  
→ `const DEST_DIR` の値を変更（デフォルト: `dist-package-final`）

**Q. マルチページ化したい**  
→ `vite.config.ts` の `rollupOptions.input` にHTMLを追加。

**Q. Sassファイルの順番が反映されない**  
→ `style.scss` に明示的に `@use` 順序を指定。

---

## 🧭 推奨メンテナンス手順

| 頻度 | 作業 | コマンド例 |
|------|------|------------|
| 毎開発前 | クリーンビルド | `npm run clean` |
| 納品前 | 整形＋検証 | `npm run package && npm run verify` |
| 定期 | パッケージ更新 | `npm update` |

---

© 2025 — vite-ts-sass-starter