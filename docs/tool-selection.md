# Tool Selection

| ツール | 用途 | メリット | デメリット | 採用理由 |
| --- | --- | --- | --- | --- |
| JUnit 5 | Javaテスト実行基盤 | Java標準に近く、IDE/CI連携が強い | UI/API専用DSLはない | Spring BootプロジェクトのUnit/Integrationの土台として最適 |
| Mockito | Mock化によるService単体テスト | 依存を切り離して高速に検証できる | Mock過多だと実装詳細に依存する | Service層の例外、分岐、連携呼び出しを軽量に確認するため |
| Spring Boot Test | Spring Contextを使う結合テスト | DI、Validation、JPA、Controllerを実環境に近く検証できる | Unitより遅い | API境界やRepositoryの実挙動を担保するため |
| Karate | APIシナリオテスト | Feature形式で読みやすく、JSON検証が簡潔 | 複雑なプログラミングには向かない | API契約と業務フローを非UIで安定検証するため |
| Postman | API手動確認、共有、簡易自動化 | 開発者以外にも使いやすい | コードレビューや大規模保守はKarateに劣る | オンボーディングとAPI仕様共有に有効なため |
| Playwright | モダンE2E | 自動待機、トレース、複数ブラウザ対応が強い | ブラウザ依存のためUnit/APIより遅い | CIで安定した画面テストを実行する主軸として採用 |
| Selenium | WebDriver標準のE2E | 既存資産が多く、ブラウザ自動化の実績が長い | 待機や環境差分の設計が必要 | 既存Selenium資産の移行・比較サンプルとして採用 |

## 標準方針

- 新規E2EはPlaywrightを第一候補にする。
- 既存Selenium資産はすぐ廃止せず、重要シナリオからPlaywrightへ段階移行する。
- API回帰はKarateをCIの主軸にする。
- Postmanは手動確認、外部共有、仕様理解に使う。
- ServiceのロジックはJUnit/Mockitoで高速に守る。
