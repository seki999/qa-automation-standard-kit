# Onboarding Guide

## 新規プロジェクトへ導入する手順

1. アプリの主要業務フローを3から5件に絞る。
2. Unit / Integration / API / E2E のどのレイヤで守るかを決める。
3. CIにBackend test、Frontend build、API smokeを追加する。
4. 画面がある場合はPlaywright smokeを1件追加する。
5. テストレポートをCI artifactとして保存する。
6. PRテンプレートにテスト追加・更新チェックを入れる。

## 既存プロジェクトへ段階的に導入する手順

1. 現在の手動回帰テスト一覧を集める。
2. 障害頻度と実行頻度が高いケースを優先する。
3. APIテストから導入し、データ準備と環境差分を安定化する。
4. 重要画面のみE2E smokeとして追加する。
5. flaky testを可視化し、原因が取れるまでは必須ゲートにしない。
6. 安定したテストからPR必須チェックへ昇格する。

## メンバー教育の進め方

- まずテストピラミッドと責務分担を共有する。
- JUnit/MockitoでServiceテストを1件ペア実装する。
- KarateでAPI業務フローを1件追加する。
- Playwright traceを見ながらE2E失敗調査を体験する。
- レビューではテストコードの読みやすさと保守性を重視する。

## Pull Request時の確認ポイント

- 仕様変更に対応する自動テストが追加または更新されているか。
- テスト名が業務仕様として読めるか。
- テストデータが固定IDや実行順に依存していないか。
- APIレスポンスの契約変更がPostman/Karate/Frontendに反映されているか。
- E2Eが詳細なCSS構造へ過度に依存していないか。

## CI失敗時の調査手順

1. 失敗したレイヤを確認する。
2. Unit/Integrationの場合はSurefire reportと該当テストログを見る。
3. Karateの場合はレスポンス本文、Featureの失敗ステップ、環境URLを確認する。
4. Playwrightの場合はHTML report、trace、screenshotを確認する。
5. 再実行で成功する場合もflakyとしてIssue化し、原因分類する。
6. 原因が環境の場合はhealth check、待機条件、テストデータ初期化を見直す。
