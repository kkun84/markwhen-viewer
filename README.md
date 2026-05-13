# markwhen-viewer

GitHub Pagesで公開する、完全静的なMarkwhen Viewerです。

## 目的

- タイムラインデータを外部送信しない
- ブラウザ内だけで解析と描画を完結させる
- 世界中で安心して利用できる品質基準を維持する

## 特徴

- TypeScript + React + Vite
- Honoでローカル開発時のミドルウェアを最小構成で提供
- shadcn/ui構成のUIコンポーネント（Button/Card）
- 関数型スタイルでドメインロジックを分離
- BDDスタイルの仕様テスト
- pnpm + Nixで再現可能な開発環境
- GitHub ActionsでCI/CD

## セキュリティ方針

- データ入力はローカルのみ
- `fetch`や外部API連携を実装しない
- CSPで外部接続を制限
- 依存更新とセキュリティチェックをCIで実行

## セットアップ

```bash
nix develop
pnpm install
pnpm dev
```

## テスト

```bash
pnpm test
pnpm test:coverage
pnpm lint
pnpm typecheck
```

## デプロイ

GitHub Pagesの公開ブランチは`gh-pages`を利用します。

- PR作成・更新時（`opened`/`synchronize`/`reopened`）に、`previews/pr-<PR番号>/<コミットSHA>/`へプレビューを自動公開
- `main`マージ後は、`snapshots/<コミットSHA>/`へ本番スナップショットを永続保存
- `main/latest/`は最新の`main`を常に指す参照先として更新

これにより、PR段階の動作確認と、マージ後のデバッグ用スナップショット追跡を両立します。

## 品質維持の原則

- 仕様を先に定義し、期待する振る舞いを失敗するテストで明確化してから実装する
- 小さな単位で設計し、リファクタリングはテストの保護下で進める
- 不具合修正は再発防止の仕様テストとセットで実施する
- 変更は意図を明確化する命名で表現し、コメント依存を避ける
