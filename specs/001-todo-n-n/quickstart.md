# Quickstart

## 前提
- Node.js v22, npm
- Chrome 現行安定版

## セットアップ(ルート)
```bash
npm init -y
# 後続でVite/React/ESLint/Prettier/CDK/tsx等を追加予定
```

## ローカル開発(フロントエンド)
```bash
# 依存関係を追加(例)
npm install react react-dom zustand
npm install -D vite @vitejs/plugin-react-swc vite-tsconfig-paths typescript
npm install -D eslint prettier eslint-config-prettier eslint-plugin-react eslint-plugin-react-hooks

# フロントエンド起動(設定後)
npm run dev
```

## インフラ(CDK)
```bash
npm install -D aws-cdk-lib constructs tsx
# cdk.json の app に tsx 経由で ESM エントリを設定
# 例: "app": "npx tsx infra/cdk/app.ts"

# 初回のみ(必要に応じて)
# npx cdk bootstrap

# 合成/デプロイ
npx cdk synth | cat
npx cdk deploy --all --require-approval never
```

## パイプライン(CDK Pipelines)
- main ブランチ更新で以下を自動実行:
  - フロントエンドをビルドしてS3へ配置
  - CloudFront キャッシュ無効化
  - CDK スタックの差分デプロイ

## 受け入れ確認
- ブラウザでアプリを開き、次を確認:
 1) 追加: 入力→追加→一覧末尾に未完了で表示
 2) 完了: 完了操作で状態が完了に変わる。順序は不変
 3) 無効入力: 入力が空/空白のみの間は「追加」ボタンが無効
 4) 完了戻し不可: 完了を未完了に戻す操作は提供されない
