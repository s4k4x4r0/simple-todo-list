# Research: シンプルなブラウザベースのTODOリスト

## Decisions
- Frontend: Vite + React + Zustand
- Transpile: SWC (@vitejs/plugin-react-swc)、Babel不使用
- Paths: tsconfig `@/*` → `./src/*`、vite-tsconfig-pathsで解決
- TypeScript: ESM、module/target/lib=esnext、moduleResolution=bundler
- Node: v22、NPM(単一package.json、workspaces不使用)
- Infra: AWS CDK v2(TypeScript, ESM, tsx実行)、S3 + CloudFront
- Pipeline: CDK Pipelines でCI/CD、1環境
- Persistence: なし(メモリのみ)、バックエンド不要

## Rationale
- Vite + SWC: 高速起動/ビルド、React向け最適化
- Zustand: 軽量で学習コスト低く、今回のシンプルな状態に十分
- ESM + esnext: 近代的なツールチェーンと相性がよい
- CloudFront + S3: 低コスト・高配信性能の静的サイトに最適
- CDK Pipelines: IaC + パイプラインの統一管理、再現性

## Alternatives Considered
- Babel → SWCに比べ遅い。不要なため不採用
- ts-node → tsxでESM/速度/DXが良好
- Amplify Hosting/GitHub Actions → 今回はCDK Pipelinesで統一
- SPAをS3 Static Website直配信 → CloudFrontのキャッシュ/HTTPS/独自ドメイン運用性を優先

## Notes
- SPAルーティングのため、CloudFrontエラーページ/カスタムエラーレスポンスで `index.html` へのフォールバック設定が必要
- Chrome現行安定版のみを公式サポート
