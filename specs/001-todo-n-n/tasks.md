# Tasks: シンプルなブラウザベースのTODOリスト

Feature: 001-todo-n-n
Docs: `/Users/sakai/simple-todo-list/specs/001-todo-n-n`

原則: セットアップ → 受け入れ確認手順(ドキュメント) → 実装 → インフラ → パイプライン の順。並列 [P] は独立ファイル間のみ。

---

T001. ルート初期化とスクリプト定義
- Files: `/Users/sakai/simple-todo-list/package.json`
- Actions:
  - package.json を作成し、`type: module`、`engines.node: ">=22"` を設定
  - Scripts 追加: `format`, `format:check`, `lint`, `typecheck`, `dev`, `build`
- Depends on: —

T002. ESLint/Prettier 導入
- Files: `/.eslintrc.cjs`, `/.prettierrc`, `/.eslintignore`, `/.prettierignore`
- Actions:
  - ESLint/Prettier 最小設定を追加（React/TS/SWC想定）
  - `node_modules/`, `dist/` を ignore に設定
- Depends on: T001

T003. tsconfig 分離とパスエイリアス
- Files: `/tsconfig.frontend.json`, `/tsconfig.cdk.json`
- Actions:
  - 共通方針: ESM、`module/target/lib=esnext`, `moduleResolution=bundler`
  - `paths: { "@/*": ["./frontend/src/*"] }` を frontend 側に設定
- Depends on: T001

T004. Dev Container 追加
- Files: `/.devcontainer/devcontainer.json`, `/.gitignore`
- Actions:
  - ベース `mcr.microsoft.com/devcontainers/typescript-node:22`
  - features: `ghcr.io/ChristopherMacGown/devcontainer-features/direnv:1`
  - 拡張: `esbenp.prettier-vscode`, `dbaeumer.vscode-eslint`
  - 設定: 保存時フォーマット/ESLint修正/インポート整理（explicit）
  - `.gitignore` に `.envrc` を追記
- Depends on: T001

T005. Vite + React + SWC + パス解決のセットアップ
- Files: `/frontend/index.html`, `/frontend/vite.config.ts`, `/frontend/src/main.tsx`
- Actions:
  - 依存を追加: `react react-dom zustand`、dev: `vite @vitejs/plugin-react-swc vite-tsconfig-paths typescript`
  - Vite設定に `@vitejs/plugin-react-swc` と `vite-tsconfig-paths` を組み込み
  - `npm run dev` 起動可能にする
- Depends on: T001, T003

T006. Zustand ストアの実装
- Files: `/frontend/src/features/todos/store.ts`
- Actions:
  - 型 `Task { title: string; status: '未完了'|'完了'; createdAt: string }`
  - API: `addTask(title)`, `completeTask(id|createdAt)`, `tasks: Task[]`（作成日時昇順を維持）
  - 空/空白のみタイトルは拒否（ユースケースで制御しても良いが、ガードを用意）
- Depends on: T005

T007. UI 実装（一覧・追加・完了）
- Files: `/frontend/src/app/App.tsx`, `/frontend/src/features/todos/components/TodoList.tsx`, `/frontend/src/features/todos/components/AddTodo.tsx`, `/frontend/src/styles/app.css`
- Actions:
  - 単一ページで、タイトル入力 + 追加ボタン（trim 非空まで無効化）
  - 一覧: タイトルと状態(未完了/完了)のみ表示、完了操作ボタンを提供（戻し不可）
  - 並び順: 作成日時昇順（完了操作では順序不変）
- Depends on: T006

T008. 手動受け入れチェックリスト作成
- Files: `/specs/001-todo-n-n/quickstart.md`（既存へ章追記 or 確認）
- Actions:
  - シナリオ: 追加/完了/無効入力/戻し不可 を確認手順として整理
  - 実行方法（`npm run dev`）を明記
- Depends on: T007
- Notes: テスト自動化はスコープ外（MVP）

T009. CDK 初期化（tsx 実行）
- Files: `/infra/cdk/app.ts`, `/cdk.json`, `/tsconfig.cdk.json`
- Actions:
  - `cdk.json` に `"app": "npx tsx infra/cdk/app.ts"` を設定
  - 最小の App/Stack 雛形を作成
- Depends on: T001, T003

T010. S3 + CloudFront スタック実装
- Files: `/infra/cdk/stacks/StaticSiteStack.ts`
- Actions:
  - S3 バケット（サイトホスティング、OAC経由アクセス）
  - CloudFront ディストリビューション（SPA: 403/404→/index.html 200 フォールバック）
  - 出力: `BucketName`, `DistributionId`
- Depends on: T009

T011. フロントエンドビルドとデプロイ手順（ローカル）
- Files: `package.json`（scripts 追記）
- Actions:
  - `build`: `vite build`
  - `deploy:s3`: `aws s3 sync frontend/dist s3://$BUCKET --delete`
  - `deploy:cf-invalidate`: `aws cloudfront create-invalidation --distribution-id $DIST_ID --paths "/*"`
- Depends on: T005, T010

T012. CDK Pipelines でCI/CDパイプライン作成
- Files: `/infra/cdk/stacks/PipelineStack.ts`
- Actions:
  - ソース: CodeStar Connections(GitHub) などを想定（`CONNECTION_ARN` を環境/コンテキストで指定、main ブランチ）
  - ShellStep で品質ゲート: `npm run format:check && npm run lint && npm run typecheck`
  - ShellStep でフロントビルド&デプロイ: `vite build` → `s3 sync` → `cloudfront invalidation`
  - Wave で `StaticSiteStack` をデプロイ
  - 失敗時はデプロイしない（パイプラインがFail）
- Depends on: T010, T011
- Notes: アカウント/リージョン/接続ARNは `.envrc` や `cdk.json` context で与える

T013. ブートストラップと初回デプロイ準備
- Files: —
- Actions:
  - `npx cdk bootstrap`（必要なら）
  - `npx cdk synth | cat` で合成
  - `npx cdk deploy --all --require-approval never`
- Depends on: T012

T014. CI品質ゲート準備（デプロイのみゲート）
- Files: `/specs/001-todo-n-n/quickstart.md`（パイプライン手順追記）, `/Users/sakai/simple-todo-list/.specify/memory/constitution.md`（反映済み確認）
- Actions:
  - パイプラインが `main` push を契機に実行され、品質ゲート失敗時はデプロイ不実施であることを明記
- Depends on: T012

---

Parallel Execution Guidance
- [P] グループA（設定系、相互独立）: T002, T003, T004（ただしT001完了後）
- [P] グループB（ドキュメントのみ）: T008, T014（前提タスク完了後なら並列可）

Dependency Notes
- フロント: T005 → T006 → T007 → T008
- インフラ: T009 → T010 → T011 → T012 → T013 → T014
- 品質ゲートはローカルでも `npm run format:check && npm run lint && npm run typecheck` で随時確認
