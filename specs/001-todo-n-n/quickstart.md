# Quickstart

## 前提
- Node.js v22, npm
- Chrome 現行安定版

## Dev Container
- ベースイメージ: `mcr.microsoft.com/devcontainers/typescript-node:22`
- features: `ghcr.io/ChristopherMacGown/devcontainer-features/direnv:1`
- VS Code 拡張: `esbenp.prettier-vscode`, `dbaeumer.vscode-eslint`
- 推奨設定:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit",
    "source.organizeImports": "explicit"
  }
}
```

### 例: `.devcontainer/devcontainer.json`
```json
{
  "name": "simple-todo-list",
  "image": "mcr.microsoft.com/devcontainers/typescript-node:22",
  "features": {
    "ghcr.io/ChristopherMacGown/devcontainer-features/direnv:1": {},
    "ghcr.io/devcontainers/features/aws-cli:1": {}
  },
  "customizations": {
    "vscode": {
      "extensions": [
        "esbenp.prettier-vscode",
        "dbaeumer.vscode-eslint"
      ],
      "settings": {
        "editor.formatOnSave": true,
        "editor.defaultFormatter": "esbenp.prettier-vscode",
        "editor.codeActionsOnSave": {
          "source.fixAll.eslint": "explicit",
          "source.organizeImports": "explicit"
        }
      }
    }
  }
}
```

### .gitignore
```
.envrc
```

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

## AWS CLI と認証
- Dev Container features によるAWS CLI提供:
  - `ghcr.io/devcontainers/features/aws-cli:1`
- 認証は `.envrc` に環境変数で設定（例）:
```
export AWS_ACCESS_KEY_ID=... 
export AWS_SECRET_ACCESS_KEY=...
export AWS_DEFAULT_REGION=ap-northeast-1
export BUCKET=your-bucket-name
export DIST_ID=EABCDEFGHIJ
```
- `.envrc` は `.gitignore` 済み。`direnv allow` で反映。
- 必要権限(例):
  - S3: `s3:PutObject`, `s3:DeleteObject`, `s3:ListBucket`
  - CloudFront: `cloudfront:CreateInvalidation`

## 受け入れ確認
- ブラウザでアプリを開き、次を確認:
 1) 追加: 入力→追加→一覧末尾に未完了で表示
 2) 完了: 完了操作で状態が完了に変わる。順序は不変
 3) 無効入力: 入力が空/空白のみの間は「追加」ボタンが無効
 4) 完了戻し不可: 完了を未完了に戻す操作は提供されない
