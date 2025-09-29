
# Implementation Plan: シンプルなブラウザベースのTODOリスト

**Branch**: `001-todo-n-n` | **Date**: 2025-09-25 | **Spec**: `/Users/sakai/simple-todo-list/specs/001-todo-n-n/spec.md`
**Input**: Feature specification from `/specs/001-todo-n-n/spec.md`

## Summary
- ユーザがChromeで利用する最小機能のTODOリスト(SPA)を提供。
- フロントエンドは Vite + React + Zustand。ローカル開発は `npm run dev` で可能。
- バックエンドは不要。タスクはメモリ管理(セッション越えの保持なし)。
- インフラは AWS S3(静的ホスティング) + CloudFront。CDK(v2)でIaC、CDK PipelinesでCI/CD。
- 環境は1環境のみ。ディレクトリは feature based 構成を採用。
- Dev Containerでの開発をサポート。

## Technical Context
**Language/Version**: TypeScript (Node.js v22, ESM)
**Primary Dependencies**: Vite, React, Zustand, @vitejs/plugin-react-swc, vite-tsconfig-paths, ESLint, Prettier, AWS CDK v2, CDK Pipelines, tsx
**Storage**: N/A (永続化なし、メモリのみ)
**Testing**: 仕様受け入れの手動確認(MVP)。静的検査: ESLint/Prettier
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
- Dev Container: `mcr.microsoft.com/devcontainers/typescript-node:22` ベース、features: `ghcr.io/ChristopherMacGown/devcontainer-features/direnv:1`、VS Code拡張 `esbenp.prettier-vscode`, `dbaeumer.vscode-eslint` を推奨。設定: `editor.formatOnSave=true`, `editor.defaultFormatter=esbenp.prettier-vscode`, `editor.codeActionsOnSave={"source.fixAll.eslint":"explicit","source.organizeImports":"explicit"}`。`.gitignore` に `.envrc` を追加。
**Scale/Scope**: 単一環境・小規模MVP

## Constitution Check
- 憲法ファイルは一般テンプレート。違反なし。
- 単一リポジトリ/単一package.json、テスト最小(MVP)は許容とする。

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
└── tasks.md             # Phase 2 出力(/tasks 実行で生成、今回は作成しない)
```

### Source Code (repository root)
```
.devcontainer/
  ├── devcontainer.json
  └── Dockerfile (不要: ベースイメージ指定で構成)
frontend/
  ├── index.html
  └── src/
      ├── app/
      ├── features/
      │   └── todos/               # feature based
      ├── components/
      └── styles/
infra/
  └── cdk/                         # CDK(App, Stacks, Pipeline)

.eslintrc.cjs / .prettierrc
.gitignore (.envrc を追加)
package.json (単一)
cdk.json (appにtsx実行を設定)
tsconfig.frontend.json (ESM, esnext)
tsconfig.cdk.json (ESM, esnext)
```

**Structure Decision**: Webアプリ+インフラのため、`frontend/` と `infra/` の2ディレクトリ構成。フロントはfeature based。

## Phase 0: Outline & Research
1) 未解決事項: なし(Clarifications 済)。  
2) 技術選定ベストプラクティス調査タスク:
- Vite + React + SWC の推奨設定
- Zustand のシンプルなストア設計
- CDK v2 + CDK Pipelines でのS3/CloudFront配信とSPAルーティング
- ESM + tsx でのCDK実行設定
- Dev Container 構成ベストプラクティス(拡張、features、設定)
3) `research.md` に決定・根拠・代替案を記載

Output: research.md (本計画で生成)

## Phase 1: Design & Contracts
1) Data Model: `Task { title: string, status: "未完了|完了", createdAt: datetime }`
2) API Contracts: 外部APIなし(フロントのみ)。`contracts/README.md` に明記。
3) Contract Tests: N/A
4) Quickstart: ローカル/Dev Container/パイプラインの手順を `quickstart.md` に記載。
5) Agent Context 更新:
- 実行: `.specify/scripts/bash/update-agent-context.sh cursor`

Output: data-model.md, contracts/README.md, quickstart.md, agentファイル

## Phase 2: Task Planning Approach (説明のみ、生成はしない)
- tasks.mdは /tasks コマンドで作成。
- TDD順序と依存順序(モデル→UI)を採用。

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
*Based on Constitution v2.1.1 - See `/memory/constitution.md`*
