# Implementation Plan: シンプルなブラウザベースのTODOリスト

**Branch**: `001-todo-n-n` | **Date**: 2025-09-30 | **Spec**: `/Users/sakai/simple-todo-list/specs/001-todo-n-n/spec.md`
**Input**: Feature specification from `/specs/001-todo-n-n/spec.md`

## Summary

- ユーザがChromeで利用する最小機能のTODOリスト(SPA)を提供。
- フロントエンドは Vite + React + Zustand。ローカル開発は `npm run dev` で可能。
- バックエンドは不要。タスクはメモリ管理(セッション越えの保持なし)。
- インフラは AWS S3(プライベートバケット) + CloudFront(OAC)。CDK(v2)でIaC、CDK PipelinesでCI/CD。
- 環境は1環境のみ。ディレクトリは feature based 構成を採用。
- テストはスコープ内。E2Eは Playwright を採用し、TDD(テスト先行)で進める。

## Technical Context

**Language/Version**: TypeScript (Node.js v22, ESM)
**Primary Dependencies**: Vite, React, Zustand, @vitejs/plugin-react-swc, vite-tsconfig-paths, ESLint, Prettier, AWS CDK v2, CDK Pipelines, tsx, @playwright/test
**Storage**: N/A (永続化なし、メモリのみ)
**Testing**: Playwright(E2E)。TDDでテスト(RED)→実装(GREEN)→リファクタの順。品質ゲートは format/lint/typecheck/e2e を実施
**Target Platform**: AWS (S3 + CloudFront), ブラウザ=Chrome現行安定版
**Project Type**: web (frontend + infra)
**Performance Goals**: MVPのため特に設定なし(CloudFront配信のデフォルト性能を利用)
**Constraints**:

- すべてTypeScript、モジュールはESM
- Node.js v22、NPM(ワークスペース未使用、単一package.json)
- tsconfigをフロントエンドとCDKで分離
- tsconfig: module/target/lib=esnext, moduleResolution=bundler
- ViteはSWCプラグイン使用(Babel不使用)
- CDK実行はts-nodeではなくtsx
- パスエイリアス: `@/*` → `./src/*`、Viteでvite-tsconfig-pathsを使用
- Dev Container: `mcr.microsoft.com/devcontainers/typescript-node:22` ベース、features: direnv + aws-cli、拡張: Prettier/ESLint、保存時フォーマット&明示的ESLint修正有効
- CIはデプロイのみゲート(憲法v1.2.0)。mainへのマージは通常のGitマージ(PR/ブランチ保護なし)
  **Scale/Scope**: 単一環境・小規模MVP

## Constitution Check

- 憲法 v1.2.0 に準拠。Quality Gates(Format/Lint/Typecheck/E2E)はローカル/CIで同一コマンドを実行。
- CIは失敗時デプロイ不実施(マージは制御しない)方針に一致。

Gate: PASS (Initial)

## Project Structure

### Documentation (this feature)

```
specs/001-todo-n-n/
├── plan.md              # 本ファイル
├── research.md          # Phase 0 出力
├── data-model.md        # Phase 1 出力
├── quickstart.md        # Phase 1 出力
├── contracts/           # Phase 1 出力(本件は外部APIなしの旨を記載)
└── tasks.md             # Phase 2 出力(/tasks コマンドで生成)
```

### Source Code (repository root)

```
.devcontainer/
  └── devcontainer.json
frontend/
  ├── index.html
  └── src/
      ├── app/
      ├── features/
      │   └── todos/
      ├── components/
      └── styles/
infra/
  └── cdk/

playwright.config.ts
tests/
  └── e2e/
      ├── add-todo.spec.ts
      └── complete-todo.spec.ts

.eslintrc.cjs / .prettierrc
.gitignore (.envrc を追加)
package.json (単一)
cdk.json (appにtsx実行を設定)
tsconfig.frontend.json (ESM, esnext)
tsconfig.cdk.json (ESM, esnext)
```

**Structure Decision**: Webアプリ+インフラのため、`frontend/` と `infra/` の2ディレクトリ構成。E2Eは `tests/e2e` に配置。

## Phase 0: Outline & Research

1. 未解決事項: なし(Clarifications 済)。
2. 技術選定ベストプラクティス調査タスク:

- Vite + React + SWC の推奨設定
- Zustand のシンプルなストア設計
- CDK v2 + CDK Pipelines でのS3/CloudFront(OAC)配信
- ESM + tsx でのCDK実行設定
- Playwright のテスト構成・安定化パターン(起動待機/データ駆動)
- Dev Container 構成(拡張/feature/設定)

3. `research.md` に決定・根拠・代替案を記載

Output: research.md (作成済み)

## Phase 1: Design & Contracts

1. Data Model: `Task { title: string, status: "未完了|完了", createdAt: datetime }`
2. API Contracts: 外部APIなし(フロントのみ)。`contracts/README.md` に明記。
3. Tests (E2E skeleton): ユーザストーリーからE2E試験項目を抽出し、Playwrightでシナリオ雛形を作成(初回はRED)
   - 追加: 入力→追加→末尾に未完了で表示、無効入力でボタン無効
   - 完了: 完了操作で状態が完了、並び順不変、戻し不可
4. Quickstart: ローカル/Dev Container/パイプライン/E2E実行手順を `quickstart.md` に記載。
5. Agent Context 更新:

- 実行: `.specify/scripts/bash/update-agent-context.sh cursor`

Output: data-model.md, contracts/README.md, quickstart.md, (E2E skeleton), agentファイル

## Phase 2: Task Planning Approach

- /tasks コマンドで `tasks.md` を生成済み。TDD順(テスト→実装→GREEN→リファクタ)を明記し、CIにE2Eを組み込む。
- 依存順: モデル→UI→インフラ→パイプライン。独立ファイルは[P]で並列化。

## Progress Tracking

**Phase Status**:

- [x] Phase 0: Research complete (/plan command)
- [x] Phase 1: Design complete (/plan command)
- [ ] Phase 2: Task planning complete (/plan command - describe approach only)
- [ ] Phase 3: Tasks generated (/tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:

- [x] Initial Constitution Check: PASS
- [x] Post-Design Constitution Check: PASS
- [x] All NEEDS CLARIFICATION resolved
- [ ] Complexity deviations documented

---

_Based on Constitution v1.2.0 - See `/memory/constitution.md`_
