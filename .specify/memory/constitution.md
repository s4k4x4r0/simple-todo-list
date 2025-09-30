<!--
Sync Impact Report
- Version change: n/a → 1.0.0
- Modified principles: n/a (initial ratification)
- Added sections: Core Principles (5), Technology Standards, Development Workflow, Governance
- Removed sections: none
- Templates requiring updates (status):
  ✅ .specify/templates/plan-template.md (Constitution Checkと整合)
  ✅ .specify/templates/spec-template.md (必須セクション変更なし)
  ✅ .specify/templates/tasks-template.md (新たな必須タスク種別なし、品質ゲートはCIで担保)
- Follow-up TODOs: なし
-->

# Simple Todo List Constitution

## Core Principles

### P1. TypeScript & ESM Uniformity
すべてのアプリケーションコードとインフラコードはTypeScriptで記述し、ES Modulesを採用する。`tsconfig`の`module`/`target`/`lib`は`esnext`、`moduleResolution`は`bundler`とする。Node.jsの実行環境はv22を標準とする。

### P2. Simplicity & Scope Discipline (YAGNI)
本プロジェクトは最小限のTODO管理体験を提供する。機能は仕様で明記された範囲に限定し、不要な複雑性や将来要件の先取りを禁止する。バックエンドや永続化は要求が入るまで導入しない。

### P3. Quality Gates: Format, Lint, Type-Check (Non‑Negotiable)
コード修正時には、Prettierでのフォーマット、ESLintでのリンティング、`tsc`での型チェックを実行し、エラーを0にすることを必須とする。ローカル実行およびCIで同じコマンドを用い、失敗した変更はマージ不可とする。警告は可能な限り解消し、新規の警告を増やさない。

### P4. Infrastructure as Code & Pipelines
インフラはAWS CDK v2でコード化し、CI/CDはCDK Pipelinesで構築・運用する。静的サイトはS3に配置し、配信はCloudFrontを用いる。CDKの実行は`tsx`で行い、単一の`package.json`管理(NPM、workspaces非使用)とする。

### P5. Reproducible Dev Environment
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
- CI品質ゲート(必須): 上記3コマンドをCIで同一に実行し、すべて成功しない限りマージ不可。
- ツールチェーン: Node.js v22、NPM、ESM、単一`package.json`。
- Dev Container設定: 保存時フォーマット、ESLint修正、インポート整理を`explicit`で有効化。

## Governance
本憲法は本プロジェクトの開発規約を定める最上位文書とする。改定にはPull Requestでの明示的なレビューと合意が必要であり、改定時はセマンティックバージョニングに従ってバージョンを更新する。
- バージョニング:
  - MAJOR: 互換性のない原則の削除/再定義
  - MINOR: 新規原則やセクションの追加、または実質的な拡張
  - PATCH: 表現の明確化や誤記修正等の非本質的変更
- コンプライアンス: すべてのPRは「Development Workflow & Quality Gates」を満たすことをレビューで確認する。

**Version**: 1.0.0 | **Ratified**: 2025-09-29 | **Last Amended**: 2025-09-29