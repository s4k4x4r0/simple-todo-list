# Tasks: シンプルなブラウザベースのTODOリスト

Feature: 001-todo-n-n
Docs: `/Users/sakai/simple-todo-list/specs/001-todo-n-n`

原則: セットアップ → (テスト) → 実装 → インフラ → パイプライン。TDD準拠で、各機能のE2Eテスト(Playwright)を先に作成してREDにする。その後実装でGREEN、必要に応じてリファクタ。

---

T001. ルート初期化とスクリプト定義
- Files: `/Users/sakai/simple-todo-list/package.json`
- Actions:
  - package.json を作成し、`type: module`、`engines.node: ">=22"`
  - Scripts 追加: `format`, `format:check`, `lint`, `typecheck`, `dev`, `build`, `test:e2e`
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

T006. Playwright 導入と基本設定
- Files: `/playwright.config.ts`, `/tests/e2e/README.md`
- Actions:
  - 依存追加: `@playwright/test`
  - 設定: `npm run dev` を前提に `http://localhost:5173` をベースURLに設定
  - Scripts: `test:e2e`: `playwright test`
- Depends on: T001, T005

T007. E2Eテスト(RED) 追加: タスク追加
- Files: `/tests/e2e/add-todo.spec.ts`
- Actions:
  - シナリオ1: 入力→追加→一覧末尾に未完了で表示
  - 無効入力: 空/空白のみの間は追加ボタンが無効
- Depends on: T006

T008. E2Eテスト(RED) 追加: タスク完了
- Files: `/tests/e2e/complete-todo.spec.ts`
- Actions:
  - シナリオ2: 完了操作で状態が完了に変わる。順序は不変
  - 完了戻し不可: UI上に戻す操作がないこと
- Depends on: T006

T009. Zustand ストアの実装(GREEN化)
- Files: `/frontend/src/features/todos/store.ts`
- Actions:
  - 型 `Task { id: string; title: string; status: '未完了'|'完了'; createdAt: string }`
  - API: `addTask(title)`, `completeTask(id: string)`, `tasks: Task[]`
  - 作成時 `createdAt` を付与し、常に昇順を維持
  - 空/空白タイトルを拒否
- Depends on: T007, T008

T010. UI 実装（一覧・追加・完了）
- Files: `/frontend/src/app/App.tsx`, `/frontend/src/features/todos/components/TodoList.tsx`, `/frontend/src/features/todos/components/AddTodo.tsx`, `/frontend/src/styles/app.css`
- Actions:
  - 単一ページで、タイトル入力 + 追加ボタン（trim 非空まで無効化）
  - 一覧: タイトルと状態(未完了/完了)のみ表示、完了操作ボタン（戻し不可）
  - 作成日時昇順のまま表示
- Depends on: T009

T011. テスト実行でGREEN確認
- Files: —
- Actions:
  - `npm run dev` をバックグラウンドで起動し、`npm run test:e2e` 実行
  - すべてのE2EテストがGREENになるまで修正
- Depends on: T010

T012. 受け入れチェックリスト更新
- Files: `/specs/001-todo-n-n/quickstart.md`
- Actions:
  - E2Eテストの場所と起動手順を追記
  - 手動確認は補助的手段として記載
- Depends on: T011

T013. CDK 初期化（tsx 実行）
- Files: `/infra/cdk/app.ts`, `/cdk.json`, `/tsconfig.cdk.json`
- Actions:
  - `cdk.json` に `"app": "npx tsx infra/cdk/app.ts"` を設定
  - 最小の App/Stack 雛形を作成
- Depends on: T001, T003

T014. S3 + CloudFront(OAC) スタック実装
- Files: `/infra/cdk/stacks/StaticSiteStack.ts`
- Actions:
  - S3 バケット（プライベート、Static website hostingは使用しない。OAC経由でのみアクセス）
  - CloudFront ディストリビューション（OACでS3にアクセス）。制約: /index.html省略不可、リダイレクト不可
  - 出力: `BucketName`, `DistributionId`
  - 例（主要プロパティ）:
    - S3 Bucket: `blockPublicAccess=BLOCK_ALL`, `encryption=S3_MANAGED`
    - Distribution: `defaultBehavior.origin = new origins.S3Origin(bucket)`, `viewerProtocolPolicy=REDIRECT_TO_HTTPS`
    - OAC: CloudFrontのOrigin Access Controlを有効化し、バケットポリシーで `Principal: cloudfront.amazonaws.com` に対し
      `Condition: { StringEquals: { "AWS:SourceArn": "arn:aws:cloudfront::${ACCOUNT_ID}:distribution/${distributionId}" } }` を付与
- Depends on: T013

T015. フロントエンドビルド（ローカル）
- Files: `package.json`（scripts 追記）
- Actions:
  - `build`: `vite build`
- Depends on: T014

T016. CDK Pipelines でCI/CDパイプライン作成（BucketDeployment採用）
- Files: `/infra/cdk/stacks/PipelineStack.ts`
- Actions:
  - ソース: CodeStar Connections(GitHub) など（`CONNECTION_ARN`、main）
  - ShellStep (品質ゲート): `npm run format:check && npm run lint && npm run typecheck && npm run build && npm run test:e2e`
  - Wave: `StaticSiteStack` をデプロイ（`aws-cdk-lib/aws-s3-deployment` の `BucketDeployment` を使用）
    - 例: `new s3deploy.BucketDeployment(this, 'Deploy', { sources: [s3deploy.Source.asset('frontend/dist')], destinationBucket: bucket, distribution, distributionPaths: ['/*'], prune: true })`
  - 失敗時はデプロイしない
- Depends on: T015, T011

T017. ブートストラップと初回デプロイ準備
- Files: —
- Actions:
  - `npx cdk bootstrap`（必要なら）
  - `npx cdk synth | cat`
  - `npx cdk deploy --all --require-approval never`
- Depends on: T016

---

Parallel Execution Guidance
- [P] グループA: T002, T003, T004（T001完了後で独立）
- [P] グループB: T007, T008（双方テスト作成のみで独立、T006後）

Dependency Notes
- フロント(TDD): T005 → T006 → (T007,T008)[P] → T009 → T010 → T011 → T012
- インフラ: T013 → T014 → T015 → T016 → T017
- CIはデプロイのみゲート（憲法v1.2.0）。パイプラインでE2Eを含む品質ゲートを実施

T018. E2Eテスト(RED) 追加: 重複タイトル許可
- Files: `/tests/e2e/add-duplicate-todo.spec.ts`
- Actions:
  - 同一タイトルを連続で2回追加し、一覧に2件存在することを検証
- Depends on: T006

T019. E2Eテスト(RED) 追加: 非永続(リロードで消失)
- Files: `/tests/e2e/non-persistence.spec.ts`
- Actions:
  - タスクを1件追加 → `page.reload()` → 一覧が空であることを検証
- Depends on: T006

T020. E2Eテスト(RED) 任意: 一覧の表示項目が限定的
- Files: `/tests/e2e/list-fields.spec.ts`
- Actions:
  - 一覧にタイトルと状態のみが表示され、作成日時など余分な情報が表示されないことを検証
- Depends on: T006
