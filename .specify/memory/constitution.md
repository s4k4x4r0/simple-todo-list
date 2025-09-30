<!--
Sync Impact Report
- Version change: 1.1.0 → 1.2.0
- Modified principles/sections:
  - Added new principle: P3. Test-Driven Development (Non‑Negotiable)
  - Renumbered former P3..P5 to P4..P6
  - Development Workflow: TDD順序(RED→GREEN→REFACTOR)とE2E必須を明文化
- Added notes: PlaywrightによるE2Eテストを正式スコープ化
- Templates requiring updates:
  ✅ specs/001-todo-n-n/plan.md (version reference updated)
  ✅ specs/001-todo-n-n/tasks.md (version reference updated)
  ✅ .specify/templatesは整合性要変更なし（汎用文言のため）
- Follow-up TODOs: なし
-->

# Simple Todo List Constitution

## Core Principles

### P1. TypeScript & ESM Uniformity
すべてのアプリケーションコードとインフラコードはTypeScriptで記述し、ES Modulesを採用する。`tsconfig`の`module`/`target`/`lib`は`esnext`、`moduleResolution`は`bundler`とする。Node.jsの実行環境はv22を標準とする。

### P2. Simplicity & Scope Discipline (YAGNI)
本プロジェクトは最小限のTODO管理体験を提供する。機能は仕様で明記された範囲に限定し、不要な複雑性や将来要件の先取りを禁止する。バックエンドや永続化は要求が入るまで導入しない。

### P3. Test-Driven Development (Non‑Negotiable)
本プロジェクトはTDDを必須とする。ユーザストーリーに基づくE2Eテスト(Playwright)を先に作成して失敗(RED)を確認し、その後に最小実装で通過(GREEN)させ、重複排除や設計改善(リファクタ)を行う。テストは受け入れ条件を自動化し、主要フロー(追加/完了/無効入力/戻し不可)を網羅する。

### P4. Quality Gates: Format, Lint, Type-Check
コード修正時には、Prettierでのフォーマット、ESLintでのリンティング、`tsc`での型チェックを実行し、エラーを0にすることを必須とする。ローカル実行およびCIで同じコマンドを用いる。CIはデプロイのみをゲートし、マージ可否は制御しない。

### P5. Infrastructure as Code & Pipelines
インフラはAWS CDK v2でコード化し、CI/CDはCDK Pipelinesで構築・運用する。静的サイトはS3に配置し、配信はCloudFrontを用いる。CDKの実行は`tsx`で行い、単一の`package.json`管理(NPM、workspaces非使用)とする。

### P6. Reproducible Dev Environment
Dev Containerを提供し、`mcr.microsoft.com/devcontainers/typescript-node:22`をベースとする。VS Code拡張は`esbenp.prettier-vscode`と`dbaeumer.vscode-eslint`を必須とし、保存時フォーマットと明示的なESLint修正を有効化する。`direnv` featureを導入し、`.envrc`は`.gitignore`対象とする。

## Technology Standards
- フロントエンド: Vite + React + Zustand、SWC(`@vitejs/plugin-react-swc`)を使用しBabelは使用しない。
- モジュール解決: `@/*` → `./src/*` のpaths設定を採用し、`vite-tsconfig-paths`で解決する。
- 対応ブラウザ: Chrome現行安定版のみを公式サポート。
- 環境: 単一環境。ディレクトリはfeature based構成。
- 監視/可観測性: 本MVPでは追加要件なし(将来拡張時に別途定義)。

## Development Workflow & Quality Gates
- ローカル品質ゲート(必須):
  - `npm run format` (Prettier) を実行し、差分ゼロであること。
  - `npm run lint` (ESLint) を実行し、エラー0であること。
  - `npm run typecheck` (`tsc --noEmit`) を実行し、エラー0であること。
  - `npm run test:e2e` (Playwright) を実行し、主要シナリオがGREENであること。
- TDD順序(必須): `test(RED)` → `implement(GREEN)` → `refactor` を徹底し、E2Eを先行させる。
- CI品質ゲート(必須):
  - 上記コマンド群をCIで同一に実行し、いずれかが失敗した場合は「デプロイを実施しない」。
  - ブランチ保護やPRベースのマージ制御は行わない。
  - トリガ: `main`への`push`(通常のGitマージでPRは使用しない)。
- ツールチェーン: Node.js v22、NPM、ESM、単一`package.json`。
- Dev Container設定: 保存時フォーマット、ESLint修正、インポート整理を`explicit`で有効化。

## Governance
本憲法は本プロジェクトの開発規約を定める最上位文書とする。改定は通常のGitフロー(直接コミットまたは通常の`git merge`で`main`へ反映)で行う。Pull Requestは使用しない。レビューは任意だが、重大変更時は推奨とする。
- バージョニング:
  - MAJOR: 互換性のない原則の削除/再定義
  - MINOR: 新規原則やセクションの追加、または実質的な拡張
  - PATCH: 表現の明確化や誤記修正等の非本質的変更
- コンプライアンス: 「Development Workflow & Quality Gates」のCI品質ゲートを満たさない限り、環境へのデプロイは実施しない。

**Version**: 1.2.0 | **Ratified**: 2025-09-29 | **Last Amended**: 2025-09-30