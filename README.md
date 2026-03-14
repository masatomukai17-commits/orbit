# ORBIT — 産婦人科臨床実習トラッカー

OBstetrics & gynecology Rotation-Based Integrated Tracker

## セットアップ（初回のみ）

```bash
# 1. Node.js をインストール（まだの場合）
# https://nodejs.org/ から LTS 版をダウンロード

# 2. プロジェクトフォルダに移動
cd orbit

# 3. 依存パッケージをインストール
npm install

# 4. 開発サーバーを起動
npm run dev
```

ブラウザで `http://localhost:5173` を開く。

## デモ用ログイン

| ロール | 名前 | PIN |
|--------|------|-----|
| 管理者 | 向井先生 | 0000 |
| 管理者 | 教授 | 1111 |
| 指導医 | 佐藤医師 | 2222 |
| 指導医 | 鈴木医師 | 3333 |
| 5年生 | 田中太郎 | 5001 |
| 5年生 | 山田花子 | 5002 |
| 6年生 | 小林亮 | 6001 |
| 研修医 | 松本翔太 | 7001 |

## デプロイ

```bash
# GitHub にプッシュ → Vercel が自動デプロイ
git add -A
git commit -m "update"
git push
```

## 技術スタック

- React 18 + Vite 6
- Tailwind CSS 3
- localStorage（デモ版）
- 今後: Supabase（PostgreSQL + Auth）
