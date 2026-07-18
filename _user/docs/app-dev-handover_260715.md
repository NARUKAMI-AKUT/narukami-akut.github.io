# アプリ開発 引継ぎ事項

Takumi Nakamura（NARUKAMI AKUT）がアプリを作る際の規約・ワークフロー・判断基準をまとめたドキュメント。
新しいアプリを始めるときにブランドセッション・開発セッション両方に渡す。

**対象プラットフォーム**: Android（Flutter）/ Windows（Python 等、アプリ次第）

> 前回: `app-dev-handover_260702.md`（`old/`に退避）
> 更新: 2026-07-15（**Desktop Zoning（初のWeb静的アプリ実績）: 技術スタック・配布パターンを4.11節に新設**。ReminDo v1.0.0: 通知/TTS/グループ仕様一本化・実機adb logcat調査ノウハウ（`dumpsys alarm`）・Firebase Analytics/Crashlyticsモニタリング基盤・**フィーチャーグラフィックのアイコンサイズ仕様の誤読を訂正（2-7節・重要）**・GA4プロパティ名変更手順・Firebase Authenticationメールテンプレートの制約を追加）

### 運用の原則

- **ブランドセッションへのフィードバックはリリースまでの情報を対象とする。** リリース後の大規模アップデートは別途引継ぎを行う。
- **プラットフォームやアプリの性質は毎回異なるため、柔軟に対応する。** ただし共通事項は本ドキュメントに蓄積して次回に活かす。
- **ブランドセッション（`00_Narukami_Akut`）が司令塔。** デザイン・方針・アプリ名はすべてここで決定し、開発セッションに渡す。
- **アプリのリリース・更新時はホームページ（`00a_Homepage`、https://narukami-akut.github.io ）への反映を確認する。** フィードバック反映時に `_apps/<app>.md` の `updates`・`release_date`・`status`・画像更新が必要かどうかを毎回チェックする。詳細は CONTEXT.md「ホームページ」セクション参照。
- **配布物・README の置き場所はプラットフォームで分ける。**
  - **Windows アプリ等（GitHub で一般公開する配布物）**: リリース（ビルド済み ZIP）と README は配布用 `-site` 公開リポジトリにのみ置く。ソース PRIVATE ＋ 配布 PUBLIC `-site` の2構成では、公開 README の「最新版ダウンロード」リンクが `-site` の `releases/latest` を指すため、リリースは必ず `-site` 側に作る。ソース側に作っても公開ダウンロードに反映されず、誰の目にも触れないため気づきにくい。各アプリの CLAUDE.md に1行で明記して再発を防ぐ（配布詳細は 4-7 参照）。
  - **Android アプリ**: 配布先は Google Play であり GitHub でビルド物を公開しない。`-site` 公開リポジトリには**プライバシーポリシー（`privacy_policy.html`）のみ**を設置する（GitHub Pages で公開）。
- **全アプリにアナリティクス（起動回数・エラー種別の匿名計測）を標準装備する。** Firebase SDK が使えるモバイルは `firebase_analytics`／`firebase_crashlytics`、使えない Web/デスクトップは GA4 Measurement Protocol で代替（4-10 参照）。fire-and-forget・オプトアウト可・プライバシーポリシー明記が全プラットフォーム共通の必須要件。
- **リリース告知は共通テンプレートを使う。** 正本は**ブランドセッションの `00_Narukami_Akut/_user/templates/release_template.md`**（Discord／X／Playストア「最新情報」の雛形。🐛バグ修正 ／ ⚙️改善・変更 ／ ✨新機能 の3セクション）。各開発セッションはこれを元にアプリ固有版を作成する。**テンプレート自体の変更は各セッションから適宜行ってよいが、編集前に既存ファイルを同ディレクトリの `old/` に退避してから**上書きすること。文字数目安: Playストア＝各言語500字以内 / X（青バッジ）長文可 / Discord 制限ほぼなし。空セクションは削除。X はスクショ1枚添付でインプレッションが伸びやすい。

---

## 1. 次のアプリ概要（毎回ここを埋める）

| 項目 | 内容 |
|------|------|
| アプリ名（仮） | （例: Chrono Ride） |
| コンセプト | （例: サイクリング中に知りたい情報をタイル型で表示） |
| ターゲットユーザー | （例: サイクリスト・通勤ライダー） |
| **プラットフォーム** | Android / Windows / 両方 |
| **技術スタック** | Flutter / Python+tkinter / その他（アプリ次第） |
| 収益モデル | 無料 + 広告 / 有料版 / 無料（ツール系） |
| 対応言語 | 日本語・英語 / 日本語のみ |
| 競合アプリ | （後述の競合調査後に記載） |
| ブランドイメージ | （ブランドセッションで決定） |

### 技術スタック選定の考え方

| アプリの性質 | 推奨スタック | 理由 |
|-------------|------------|------|
| スマホアプリ（Android/iOS） | Flutter | 実績あり。Chrono Ride・ReminDo で構築済み |
| Windows GUI ツール・計測系 | Python + tkinter/PyQt | 単一ファイル構成・軽量・配布が楽 |
| マルチプラットフォーム GUI | Flutter Windows | Android と同じコードベース |
| Web 技術が得意な UI | Electron | 未実績のため慎重に |

### 競合・市場調査（名称確定前に必ず実施）

- [ ] Google Play / Microsoft Store / Web で同名・類似名を検索
- [ ] 競合アプリの評価・レビューで「不満点」を把握（差別化ポイントのヒント）
- [ ] 競合が多い場合はコンセプトか名称を再検討
- [ ] **主要機能（目玉機能）のプラットフォーム実現可否を事前確認する**（2026-07-02 追加：PhoneRec構想が「通話録音・留守電」を目玉に据えたが、Android のプラットフォーム制約でほぼ実現不可能と実装着手前に判明し開発中止。詳細は `00_Narukami_Akut/_user/feedback/old/06_PhoneRec_feedback_260702.md`。特に**通話録音・留守電・外部アプリの通話音声録音は Android/iOS とも一般アプリに閉じられている**ため、モバイルで録音系機能を目玉にする企画は避ける。録音系は Windows（PC）側のシステム音声＋マイクキャプチャなら現実的）
- [ ] アプリ名・コンセプトは開発セッション側で決定する（2-2 参照）

---

## 2. 共通ルール

### 2-1. `_user` フォルダ規約

リポジトリ直下に `_user/` を作る。**ここは「ユーザーが直接開いて確認するファイル」だけを置く場所**。スクリプトや自動生成ファイルは入れない。

```
_user/
├── prompt/          # Claude Code に渡したプロンプトの履歴
│   ├── アプリ開発_初期プロンプト.txt
│   └── YYMMDD_修正N.txt
├── assets/          # アイコン・バナー等の原稿ファイル（PNG のみ）
│   ├── ic_launcher_512.png
│   └── feature_graphic_1024x500.png
├── docs/            # 設計書・仕様書・ブランドガイドライン等の指針文書。GitHub に push した privacy_policy.html のコピーもここに置く
├── crashlytics/     # クラッシュレポート等の収納
├── releases/        # リリース履歴（APK / EXE / インストーラー）
└── screenshots/     # ストア用スクリーンショット
```

`scripts/` フォルダ（リポジトリ直下）：画像生成・ユーティリティスクリプト

> **ブランドセッション（`00_Narukami_Akut`）の例外**：ブランドセッションの `_user/assets/` には PNG と生成スクリプト（Python）を一緒に置く。`scripts/` フォルダは作らない。告知テンプレートの正本は `_user/templates/release_template.md`。

**プロンプト履歴の使い方**：大きな修正のたびに `YYMMDD_修正N.txt` に指示内容を保存。次のセッションで「何を変えたか」を振り返れる。

**プライバシーポリシーのコピー配置**：GitHub（`-site`）に push した `privacy_policy.html` のコピーを `_user/docs/` にも置き、手元で内容を確認・差分管理できるようにする。

**フィードバック報告書の作成**：**ユーザーが適宜指示したとき**に作成する（主に新しい知見があった場合・開発に進展があった場合。**新しい keystore を作成したときも対象**——実ファイルパスを書き添える。3-5・2-1「Dropbox バックアップ」参照）。開発セッション側の `_user/` 配下には置かず、直接 `00_Narukami_Akut/_user/feedback/{セッションフォルダ名}_feedback_{yymmdd}.md`（例: `04_APx_Controller_feedback_260629.md`）に保存する。ブランドセッションが次回開始時にこれを読み込み、CONTEXT.md・引継ぎドキュメントに反映後 `old/` へ移動する。

**不要ファイルの管理**：使用しないファイルは削除せず、各フォルダ内に `old/` フォルダを作って移動する。履歴として残す。

**Dropbox バックアップ（実装済み・2026-07-02）**：`00_Narukami_Akut/scripts/backup_to_dropbox.ps1` で `C:\00_Claude_Code` 全体を Dropbox（`...\03_NASへ\`）へバックアップする。

- **手順**: ①`robocopy /MIR` で `C:\00_Claude_Code` をローカルの一時ステージングフォルダ（`%TEMP%\Claude_Backup_Staging`、Dropbox 同期対象外）に最新化 → ②署名鍵などプロジェクト外の重要ファイルを追加コピー → ③ステージングの中身をローカルで `00_Claude_Buckup_{yymmdd}.zip` に zip 化 → ④完成した zip だけを Dropbox（`03_NASへ` 直下）へ移動。**最終成果物は zip**（実行のたびに日付付きで積み上がる）。**復元は zip を持ってきて解凍するだけでよい**（手順は `C:\00_Claude_Code\PCクラッシュ復元手順.md` 参照）。zip は溜まったらユーザーが適宜自宅 NAS へ移す運用（`03_NASへ` フォルダはその中継地点）。
  - **ステージングを Dropbox の外に置く理由**: 当初 Dropbox 配下で直接ミラー→zip化していたところ、robocopy 直後に Dropbox クライアントが大量のファイルを同期しようとしてロックし、zip 化が「別のプロセスで使用されているためアクセスできません」で失敗する事象が実測された（2026-07-02）。ローカルで zip を完成させてから1ファイルだけ移動する方式に変更して解消。
- **除外**: `.git`（GitHub に push 済みのため二重保管しない）／`build`・`.dart_tool`・`__pycache__`・`node_modules`・`dist`・`venv`・`.venv`・`.pytest_cache`・`.superpowers`（再生成可能・一時的なもの）。**`_user/` フォルダの中身は全て対象**（releases の apk/aab/exe を含む。除外ディレクトリ名に一致しないため自動的に含まれる）。
- **実行**（Windows PowerShell から。各セッションから絶対パスで呼べる）:
  ```powershell
  & "C:\00_Claude_Code\00_Narukami_Akut\scripts\backup_to_dropbox.ps1"          # 通常実行
  & "C:\00_Claude_Code\00_Narukami_Akut\scripts\backup_to_dropbox.ps1" -WhatIf  # ドライラン（変更なし）
  ```
- 除外後の総容量は約1.78GB（除外なしだと Chrono Ride 単体だけで .git+build 込み4.4GB）。robocopy の `/XD` はディレクトリ名一致で階層問わず除外するため、巨大な build 系ディレクトリを走査自体しない＝速度・パス長対策にもなる。
- **Android の署名鍵（keystore）は `C:\00_Claude_Code` の外に置かれているため通常のミラーコピーでは対象外**（`android/key.properties` の `storeFile` が指す場所。例: ReminDo は `C:\Users\Takumi Nakamura\.android\remindo.jks`）。これを見落とすと PC クラッシュ時に **Play Store へ同じアプリの更新を二度と提出できなくなる**（署名鍵の紛失は基本的に復旧不可）。そのためスクリプト内に `$ExternalSecrets` リストを設け、実行のたびに個別コピーして `00_Claude_Buckup\{App}\_user\keys\` に含めている。
  - **新しいアプリで keystore を新規作成したときの運用**: `backup_to_dropbox.ps1`（および CONTEXT.md）は **ブランドセッション側が管理するファイル**のため、開発セッションが直接編集することはしない。開発セッションは keystore の実ファイルパスを**フィードバック報告書に書き添えるだけでよい**（3-5 のチェックリスト参照）。ブランドセッションがフィードバックを読んだ際に `$ExternalSecrets` リストと CONTEXT.md の該当アプリ詳細セクションへ追記する。

### 2-2. Claude Code ワークフロー

```
このハンドオーバー（ブランド理解を含む）を開発セッションに渡す
  ↓
開発セッション → アプリのコンセプト・アプリ名・技術スタック等を決定しつつ開発
              （大きな変更のたびに YYMMDD_修正N.txt に記録）
  ↓
開発セッション → 新しい知見・進展があればフィードバックをブランドセッションへ戻す
  ↓
ブランドセッション → フィードバックを解析し、ブランドイメージからの逸脱があれば修正を促す。
                  CONTEXT.md・このハンドオーバーへ反映
```

> **アプリの立ち上げはブランドセッションで決めない。** 以前は「コンセプト・アプリ名をブランドセッションで確定してから開発へ渡す」運用だったが、**ハンドオーバーを渡してブランドを理解したうえで、開発セッション側でコンセプト・アプリ名・技術スタック等を決定し、それをフィードバックする**流れに変更した（2026-07-02）。ブランドセッションは決定の主体ではなく、フィードバックを受けてブランド整合をチェックする役割（5章参照）。

**セッションに渡すべきもの**：
- **このハンドオーバードキュメント（本ファイル）だけでよい。**
  - （旧「ブランドセッションの出力」は上記の運用変更により不要）
  - プロジェクトの `CLAUDE.md` は開発セッションで作成される
  - `YYMMDD_修正N.txt` は履歴として残しているだけで、実際はユーザーがその都度ターミナルに貼り付ける
- **アカウント名・URL・pub-id などブランドの「生の値」が必要なときは `00_Narukami_Akut/CONTEXT.md` を直接参照する。** 同一マシン内の固定パスなので絶対パスでそのまま読める。コピーはしない（常に最新版を参照するため）。**このファイルは読み取り専用**——ブランドセッションのみが更新するので、開発セッション側から直接編集しないこと。

**Bash コマンドの許可について（重要・ハンドオーバーを読んだ時点で必ず守ること）**：
- ビルド・テスト・解析・git 等の**通常のコマンドは承認してよい**（逐一の確認は不要）。
- ただし**削除など不都合・不可逆な影響が大きい操作（`rm` によるファイル/ディレクトリ削除、`git reset --hard`・`git clean`・force push、ファイルの上書き破棄など）は、実行前に必ずユーザーに確認する**。承認済みの文脈でも破壊的操作は別途確認する。
- この方針はセッション冒頭で見落とされやすいため、**ハンドオーバー読了時点で「破壊的操作は要確認」を前提として作業を始める**こと。

### 2-2-1. 共通ビルド・実行コマンド（PowerShell）

ビルドや実行が必要な操作は **Windows PowerShell** から行う（WSL2 からは不可）。

| 操作 | コマンド | 対象 |
|------|---------|------|
| AAB ビルド（Play Store 提出用） | `.\build_aab.ps1` | Android アプリ |
| APK ビルド（実機インストール用） | `.\build_apk.ps1` | Android アプリ |
| 実機で実行 | `.\run_device.ps1`（無ければ `flutter run`） | Android アプリ（ReminDo は `.\run_device.ps1`／既定 device: ZY22KN2246） |
| EXE ビルド（Windows アプリ） | `.\build_release.bat` | Windows アプリ |
| Windows アプリを起動 | `python {アプリ名}_{バージョン}.py` | Windows アプリ |

> `build_aab.ps1` がない場合は `flutter build appbundle --release` を直接実行する。
> ビルドスクリプトがない場合は Claude Code に作成させる（コマンド名だけ上記に合わせる）。

### 2-3. コード品質・テスト方針（Claude Code に委任）

| 項目 | 方針 |
|------|------|
| テストカバレッジ | 80% 以上を目標 |
| TDD | 原則としてテスト先行（RED → GREEN → REFACTOR） |
| イミュータビリティ | 状態は必ず新しいオブジェクトを返す |
| ファイルサイズ | 1ファイル 200〜400 行を目安、800 行超は分割を検討 |
| エラーハンドリング | 外部 API・ユーザー入力の境界で必ず検証する |

Claude Code のグローバルルール（`~/.claude/rules/`）に詳細が定義されている。セッション開始時に自動で読み込まれる。

### 2-4. CLAUDE.md の管理

プロジェクト直下の `CLAUDE.md` に Claude Code への指示を書く。以下を必ず含める：

- プラットフォーム・技術スタックの概要
- バージョン規約
- テスト実行コマンド
- プラットフォーム固有の制約（WSL2 の制限など）
- 命名衝突の注意事項があれば記載

`CLAUDE.local.md`（gitignore 済み）には個人環境の情報（実機 ID 等）を書く。

### 2-5. 設定画面の標準構成

**Android アプリは設定画面に以下の3点を必ず含める（デフォルト）。** 他プラットフォームも可能な範囲で踏襲する。

| 項目 | 実装方法 | 備考 |
|------|---------|------|
| 現在のアプリバージョン | `package_info_plus` で `PackageInfo.fromPlatform()` を呼び出して表示 | 例: `バージョン 1.0.0` |
| アプリ説明（チュートリアル） | 使い方・ヘルプ画面／初回オンボーディングを設定画面から再度開けるようにする | ReminDo は「使い方・ヘルプ画面」を実装済み。初回チュートリアルを後から見返せる導線にする |
| プライバシーポリシー（リンク） | `url_launcher` で外部ブラウザに飛ばす | Play Store 申請時に必須 |

**Android（Flutter）の実装例**

```dart
// バージョン表示
final info = await PackageInfo.fromPlatform();
Text('バージョン ${info.version}')

// PP リンク
await launchUrl(Uri.parse('https://narukami-akut.github.io/{app}/privacy'));
```

**プライバシーポリシーの URL 規則**

`https://narukami-akut.github.io/{アプリ名}-site/privacy_policy.html`（公開リポジトリ `{アプリ名}-site` で GitHub Pages を使う想定。命名規則は2-7参照）

> プライバシーポリシーのページは Play Console 申請前に必ず公開しておくこと。

**プライバシーポリシー HTML の共通テンプレート**

ChronoRideの `privacy_policy.html` がベース。単一HTML、`<style>`内CSSでダークテーマ（CSS変数 `--bg #050e17` / `--surface` / `--accent` / `--text` / `--muted` / `--border`）。**アクセントカラーのみアプリごとに変更**（ChronoRide=緑系、APx Controller=アンバー `#F5A623`）。

構成セクション（1〜8、JA→EN二言語、`<hr class="lang-divider">`で区切り）:
1. はじめに / 2. 収集する情報（テーブル形式） / 3. 第三者サービス / 4. アプリ固有の章（位置情報・通信方式など） / 5. 免責事項 / 6. 子どものプライバシー / 7. ポリシーの変更 / 8. お問い合わせ（`narukami.dev@gmail.com`）

### 2-6. 共通スキル（Claude Code）

スキルは各プロジェクトの `.claude/skills/` に置く。新しいアプリを始めるときは既存プロジェクトから流用して `アプリ名` 等を書き換える。

**各プロジェクト共通スキル（Chrono Ride / ReminDo から流用）**

| スキル | 呼び出し | 用途 | コピー元 |
|--------|---------|------|---------|
| `flutter-day1` | `/flutter-day1` | Day 1 セットアップ手順のガイド | `03_Chrono_Ride/.claude/skills/` |
| `release-build` | `/release-build` | APK/AAB ビルド手順・バージョン更新案内 | `03_Chrono_Ride/.claude/skills/` |
| `store-setup` | `/store-setup` | Play Console・Firebase・AdMob の残タスクチェックリスト | `03_Chrono_Ride/.claude/skills/` |

**Windows アプリ固有スキル（APx Controller から流用）**

| スキル | 呼び出し | 用途 | コピー元 |
|--------|---------|------|---------|
| `bump-version` | `/bump-version` | バージョン番号のインクリメント | `04_APx_Controller/.claude/skills/` |

**ブランドセッション専用スキル（このリポジトリ）**

| スキル | 呼び出し | 用途 |
|--------|---------|------|
| `x-post` | `/x-post "目的"` | X 投稿文を複数案生成（リリース告知・開発日記等） |
| `store-ss` | `/store-ss` | Playストア用SS作成（キャッチコピー複数案→生成→確認。ja/en）。**開発セッションはSS更新が必要になったらフィードバックに「SS更新希望」と記載してブランドセッションに依頼する**（リリースチェックリスト参照） |

### 2-7. 命名規則・アイコン/グラフィック生成の共通仕様（v0.13.1 APx Controller で確立）

**命名規則**

- **公開リポジトリ名 = プライベートリポジトリ名 + `-site`**（例: `chrono-ride` → `chrono-ride-site`、`APx-Controller` → `APx-Controller-site`）
- **配布物ファイル名**: ハイフンではなくアンダースコア区切り（例: `APx_Controller_v0.13.1.zip` / `APx_Controller.exe`）
- **アプリ表示名**: ウィンドウタイトル・ヘッダー等の内部表示名と対外名称を統一する（混在に注意）

**アイコン生成**

- 角丸: キャンバスサイズの 20%（ChronoRide基準。例: 512px → 102px）
- デザイン: 2行ワードマーク（白文字 / 背景 `#050E17`）
- 生成サイズ: 16, 20, 24, 32, 48, 64, 128, 256 px（同一デザインから縮小生成）
- 小サイズ（16〜32px）はアンシャープマスク（`ImageFilter.UnsharpMask(radius=1, percent=180, threshold=2)`）でぼやけ対策
- `.ico` もアンシャープマスク適用後の各サイズ画像から再構成（`sizes=[(16,16)...(256,256)]`）

**フィーチャーグラフィック（1024×500px、ReminDoで共通レイアウト仕様確立・2026-06-15）**

キャンバスサイズ・アイコン位置・縦線・タイトル下線・タイトル/サブタイトルの開始位置とサイズは**アプリ間で共通化**。アイコンデザイン・配色（背景色・アクセントカラー）・フォント・テキスト内容は**アプリごとに変える**。

| 要素 | 値 | 備考 |
|------|-----|------|
| キャンバスサイズ | `1024 x 500` px | 共通 |
| アイコンサイズ | `210` px、角丸20% | アイコン本体のデザイン・配色はアプリ毎 |
| アイコン中心位置 | `icon_cx=250`, `icon_cy=H/2=250` | 共通 |
| 縦区切り線 | `x=415`, `y: 70〜430`, 太さ `3px` | 色はアクセントカラー（アプリ毎） |
| タイトル開始位置 | `text_x = sep_x + 18 = 433` | 左端をここに揃える |
| タイトルフォントサイズ | `80px`（Bold系）が基準。**ただしクロップ安全域チェック必須**（下記） | フォント自体はアプリ毎（DejaVuSans-Bold等） |
| タイトル縦位置 | `title_y = H/2 - title_h - 10`（`title_h` はフォントbboxの高さ） | 共通の計算式 |
| タイトル下線 | `underline_y = title_y + title_bbox[3] + 8`、長さ＝タイトル幅、太さ `3px` | 色はアクセントカラー |
| サブタイトル開始位置 | `x = text_x`（タイトルと同じ）、`y = underline_y + 22` | 共通 |
| サブタイトルフォントサイズ | `30px`（Regular系） | フォント・色はアプリ毎 |

- **【重要・2026-07-15 ReminDoでの誤読から訂正】「アイコンサイズ210px・角丸20%」の意味**: これは**アプリアイコンのマスター画像（角丸正方形カード＋背景＋マークの完成品）を210×210にリサイズしてicon_cx=250,icon_cy=250へそのまま等倍配置する**という意味であり、「グリフ（マーク部分）だけを背景なしで配置する」ではない。「角丸」は正方形カードにしか意味を持たない属性なので、仕様に「角丸20%」と書かれている時点で「アイコン＝カードごと配置」のサイン。ReminDoは当初ChronoRideの実装（グリフのみ配置）を参考にして誤読し、ユーザーから「アイコンサイズが大きい気がする」と2回指摘を受けて調査し直した。`04_APx_Controller/scripts/generate_icon_assets.py`の`reposition_feature_graphic_icon()`が正しい仕様で実装されており、そちらを基準に再生成し直した。**実例（既存コード）と仕様書の文言が食い違う場合は仕様書の文言そのものを優先**し、他に仕様準拠の実装例がないか探すこと
- **サブタイトル縦位置もChrono Rideで未統一**: 仕様は`underline_y + 22`だが、Chrono Rideの実装は`underline_y + 32`で10pxずれている。次回Chrono Rideのフィーチャーグラフィックを触る際にアイコンサイズ・サブタイトル位置とも統一すること
- Play Store 検索結果カード（縦横比約1.6:1）では左右が約115pxずつクロップされる（表示領域 `x:115〜909`）。`SEP_X=415` / `icon_cx=250` はクロップ後も収まる検証済みの値（Chrono Ride / APx Controller / ReminDo で確認）
- **タイトルフォントサイズのクロップ安全域チェック（APx Controllerで判明・2026-06-15）**: 基準の `80px` はReminDo（"ReminDo" 7文字）基準の値で、アプリ名が長いとクロップ域 `x≤909` を超える。タイトル描画後に `text_x + title_width <= 909` をチェックし、超える場合はフォントサイズを自動的に縮小する処理をテンプレートスクリプトに入れること。
  - 例: APx Controller（"APx Controller" 14文字、`text_x=433`）→ 80px: 右端x=1085（キャンバス1024pxすら超える）／ 66px: 右端x=971（クロップ域909を62pxオーバー）／ **58px: 右端x=906（クロップ域内、採用）**
- **PIL `rounded_rectangle` の角丸半径と見た目のズレ（APx Controllerで判明・2026-06-15）**: `radius=R` で描画した図形は、左端(x=0)列で最初に不透明になる行が**R-10付近**になる（アンチエイリアスの内部オフセット。R=92→83, R=100→91, R=102→92, R=110→100, R=120→110で検証済み）。見た目のピクセル計測値とスクリプトの `radius=int(size*0.20)` パラメータ値を直接比較しないこと（パラメータ値そのものが仕様上の基準）。
- フィーチャーグラフィックの画像内テキストは**英語表記**にする（ホームページ経由で英語圏から見られた場合に画像内テキストは翻訳されないため。ReminDoはサブタイトルを「家族のタスク管理 & リマインド」→「Family Task & Reminder」に変更）
- 実装参考: `/mnt/c/00_Claude_Code/05_ReminDo/scripts/generate_store_assets.py` の `generate_feature_graphic()`（Pillow実装）／ `/mnt/c/00_Claude_Code/04_APx_Controller/scripts/generate_icon_assets.py`（クロップ安全域チェック・角丸オフセットの知見を反映した新規スクリプト）
- **配色の扱い**: ReminDo / Chrono Rideは下線・サブタイトルにアクセントカラーを使用。**APx Controller も 2026-06-24（v1.2.0）でアクセントカラー（アンバー`#F5A623`）へ統一完了**（下線・サブタイトル・区切り線をアンバー化、アプリ名タイトルのみ意図的に白を維持）。新規アプリも「下線・サブタイトル・区切り線＝アクセントカラー／タイトル＝白」を基本とする
- **既存スクリプトの追従が必要**: Chrono Ride（`/mnt/c/00_Claude_Code/03_Chrono_Ride/scripts/feature_graphic.py`）のフィーチャーグラフィック生成スクリプトは、上表のタイトル開始位置・下線・サブタイトル位置の計算式およびクロップ安全域チェックに未統一（縦線/アイコン位置は概ね一致）。次回そのアプリを触る際に統一する（APx Controllerは2026-06-15に対応済み）
- **【重要・2026-07-03 Chrono Rideでの事故から】「角丸統一」等の指示範囲は構造面のみ、絵柄はアプリ固有**: 本節が指示するのはアイコンサイズ・角丸比率・フィーチャーグラフィックのレイアウト（サイズ・位置計算式）等の**構造面のみ**であり、絵柄（デザイン内容そのもの）はアプリ固有でブランド側は関与しない。Chrono Rideで「角丸20%統一」の指示を絵柄ごと統一する話だと誤解し、45日間安定運用されていた正デザインを別の没案スクリプトの出力で上書きしてしまう事故があった（`e62cc6a`で復元）。判断に迷ったら、ファイルの更新日時ではなく実機スクリーンショットや長期間変更されていないgit履歴（＝安定運用の証拠）で「どちらが正デザインか」を確認すること。また、同じ絵柄を生成できるスクリプトが複数残っていると事故の元なので、没になったスクリプトは`scripts/old/`へ確実に退避する

---

## 3. Android アプリ（Flutter）

### 3-1. 開発環境

| 項目 | 内容 |
|------|------|
| OS | Windows 10/11 + WSL2 (Ubuntu) |
| エディタ | VS Code（WSL2 ターミナルで作業） |
| Flutter パス | `/home/takumi_nakamura/flutter/bin` |
| 実機 | moto g64 5G（デバイス ID: ZY22KN2246） |

**Flutter コマンドの書き方（WSL2 必須プレフィックス）**

すべての `flutter` / `dart` コマンドは先頭に PATH を付ける:

```bash
export PATH="/home/takumi_nakamura/flutter/bin:$PATH" && flutter <command>
```

| やること | コマンド |
|---------|---------|
| テスト実行 | `... && flutter test` |
| 静的解析 | `... && flutter analyze` |
| コード整形 | `... && dart format lib/` |
| l10n 再生成 | `... && flutter gen-l10n` |
| モック再生成 | `... && dart run build_runner build` |

**WSL2 pub cache 問題（ReminDoで対応・2026-06-10）**

セッション開始時に `flutter test` が `/C:/PubCache/...` パスを参照できず失敗する場合がある。原因は PowerShell から `flutter build` / `flutter run` を実行すると `.dart_tool/package_config.json` が Windows パス（`C:/PubCache/...`）で上書きされ、WSL2 がこれを `/C:/...` として解釈できないこと。

`~/.bashrc` に以下を追記して WSL2 専用の pub cache を分離する:
```bash
export PUB_CACHE="/home/takumi_nakamura/.pub-cache"
export PATH="/home/takumi_nakamura/flutter/bin:$PATH"
```
→ WSL2 Flutter が生成する `package_config.json` は `/home/...` パスになる。PowerShell でビルドし直すと再び上書きされる場合があり、その都度 WSL2 で `flutter pub get` が必要（未解決）。

**リリースビルド（Windows PowerShell のみ）**

WSL2 から Gradle は実行不可。**Windows PowerShell** で実行する。

```powershell
.\build_apk.ps1                         # APK ビルド（リネーム＆ _user/releases/ にコピー）
flutter build appbundle --release       # AAB ビルド（Play Store 提出用）
```

**WSL2 Android デバイス認識（実機確認のみ、ビルドには使えない）**

WSL2 の `flutter devices` がデバイスを認識しない場合は `platform-tools/` にシェルラッパーを作成:

```bash
# /mnt/c/Users/<User>/AppData/Local/Android/Sdk/platform-tools/adb
#!/bin/bash
exec "$(dirname "$0")/adb.exe" "$@"
```

`chmod +x` 後にデバイスを認識する。ただしビルドは不可（PowerShell のみ）。

### 3-2. バージョン規約

`pubspec.yaml` の `version:` フィールド。

**開発中（プレリリース）**: 形式 `0.X.Y+N`

| 要素 | 意味 |
|------|------|
| `0` | プレリリース固定（正式リリース後は `1` にする） |
| `X` | 何日目の作業か |
| `Y` | その日の何回目のビルドか |
| `+N` | Play Store への通算リリース回数（versionCode）。前回より必ず大きくする |

例: 6日目2回目・Play Store 初回提出 → `0.6.2+1`

APK ファイル名: `{app_name}_v0.6.2+1_20260514.apk`

**正式リリース後**: `MAJOR.MINOR.PATCH+N`（Semantic Versioning）

| 要素 | 意味 |
|------|------|
| `MAJOR` | 正式リリース後は `1` 固定（アーキテクチャ刷新時に上げる） |
| `MINOR` | 大きな機能追加 |
| `PATCH` | バグ修正・小改善 |
| `+N` | Play Store への通算リリース回数（versionCode）。前回より必ず大きくする |

例: ログ機能を公開する次のリリース → `1.1.0+6`（Chrono Ride が v1.0.0 で初適用）

### 3-3. 標準技術スタック

**Day 1 から入れるもの（後から入れると大変）**

| パッケージ | 役割 | なぜ最初から入れるか |
|-----------|------|-------------------|
| `firebase_core` | Firebase 基盤 | 後から追加すると `google-services.json` の再設定が面倒 |
| `firebase_crashlytics` | クラッシュ収集 | ユーザーが増えてから入れると初期の問題を見逃す |
| `firebase_analytics` | 行動ログ | 蓄積に時間がかかるため早く始めるほど情報が増える |
| `flutter_localizations` + `intl` | 多言語対応 | 後から入れると全 String を ARB に移す作業が発生する |

**状態管理・ナビゲーション**

| パッケージ | 役割 |
|-----------|------|
| `flutter_riverpod` | 状態管理。`NotifierProvider` / `StreamProvider` を使う（`StateNotifierProvider` は非推奨） |
| `go_router` | 画面遷移。ルート定数は `lib/core/router/app_router.dart` に集約する |

**データ保存・収益化・テスト**

| パッケージ | 役割 |
|-----------|------|
| `shared_preferences` | 設定の永続化 |
| `drift` + `drift_flutter` | 構造化データ（リスト・ログ等）の永続化。SQLite ORM。命名衝突に注意（後述） |
| `cloud_firestore` | アカウント同期が要る場合のクラウド保存（ReminDo で採用。3-10 参照）。**Auth とは別に Console で DB 作成が必須** |
| `firebase_auth` | メール/パスワード＋匿名（ゲスト）ログイン |
| `google_mobile_ads` | AdMob 広告（バナー・インタースティシャル・App Open） |
| `in_app_purchase` | 有料版への課金 |
| `flutter_tts` | 音声リマインド（端末読み上げ。ReminDo で採用） |
| `mockito` + `build_runner` | モック生成（`@GenerateMocks()` アノテーション） |

**アップデート通知（Remote Config・ChronoRide と ReminDo で共通化済み。新規アプリもこの仕様に合わせる）**

| パッケージ | 役割 |
|-----------|------|
| `firebase_remote_config` | リモートから最新バージョンを取得。`latest_version` キーで管理 |
| `package_info_plus` | 現在インストール済みのバージョンを取得 |

**共通仕様**（実装: ChronoRide `lib/services/update_checker_service.dart`／ReminDo `lib/services/update_service.dart`＋`lib/providers/update_provider.dart`）:
- Remote Config 設定は `fetchTimeout: 10s` / `minimumFetchInterval: 1h`。`fetchAndActivate()` → `getString('latest_version')`。空なら何もしない。
- 判定はセムバー3桁（`"1.2.3"`）を現在バージョンと比較。**現行以下の値は無効**（例: 現行 1.2.1 に 1.1.0 を設定しても出ない）。更新を促すには**その版を公開後に**新版を設定する。
- ダイアログは**3択**に統一: **アップデート**（ストアの product 詳細 URL `.../store/apps/details?id=...` を開く）／**キャンセル**（閉じるだけ＝次回また出す）／**以降通知しない**（そのバージョンを prefs `skipped_update_version` に保存し以降スキップ）。
- 発火はメインシェル（ホーム）表示時に1回（セッション内フラグで多重表示を防ぐ）。
- **新バージョンリリース後は Firebase Console で `latest_version` を更新すること。** クローズドテスト中は product URL が opt-in 済みテスターにしか開けず、未公開のうちは URL 自体が機能しない点に注意。

**ファイル操作**

| パッケージ | 役割 |
|-----------|------|
| `file_picker` | Android SAF でエクスポート先フォルダを選択 |
| `path_provider` | Downloads フォルダ等のシステムパスを取得 |

注意: `file_picker` の `getDirectoryPath()` は Android の SAF を使う。本体・SD カードは選択できるが **Dropbox 等のクラウドドライブは選択不可**。エクスポート先はローカルフォルダ前提で設計する。

### 3-4. アーキテクチャパターン

```
lib/
├── main.dart              # アプリ起動・Firebase 初期化
├── app.dart               # MaterialApp・ルーティング・ロケール設定
├── firebase_options.dart  # Firebase 設定（自動生成、手動編集しない）
├── core/
│   ├── constants/app_config.dart    # 定数・フラグ（kHideAds 等）
│   ├── router/app_router.dart       # go_router の全ルート定義
│   └── theme/theme_provider.dart    # テーマ切り替えロジック
├── l10n/
│   ├── app_en.arb         # 英語テキスト
│   ├── app_ja.arb         # 日本語テキスト
│   └── app_localizations.dart # 自動生成（編集しない）
├── models/                # 型定義（copyWith・JSON変換付き）
├── providers/             # Riverpod の NotifierProvider
├── screens/               # 各画面の Widget
├── services/              # 外部機能の窓口（GPS・広告・センサー等）
└── widgets/               # 共通 Widget 部品
```

**重要なパターン 3 つ**

① 設定の永続化: `AppSettings（モデル）↔ SettingsNotifier（Provider）↔ SharedPreferences`

② サービスはシングルトン: `lib/services/` にクラスを作り `xxxInstance` でグローバルアクセス。テスト時は `overrideWithValue(mockInstance)` で差し替え。

③ リリース前フラグ: `lib/core/constants/app_config.dart` に `kHideAds`・`kPromoCodes` 等を集約。**リリース前に必ず確認。**

**Riverpod StreamProvider のアンチパターン（ReminDoで発見）**

`build()` メソッド内で `StreamProvider.autoDispose(...)` を直接 `ref.watch` すると、ウィジェットが再ビルドされるたびに新しい Provider が作成され、`AsyncLoading` のループに陥る（症状: スピナーが止まらない）。

```dart
// NG: build() の中で StreamProvider を作成
final profilesAsync = ref.watch(
  StreamProvider.autoDispose((r) => r.watch(databaseProvider).profilesDao.watchAllProfiles())
);

// OK: トップレベルで定義して参照
final profilesStreamProvider = StreamProvider<List<ProfileRow>>((ref) {
  return ref.watch(databaseProvider).profilesDao.watchAllProfiles();
});
// build() 内:
final profilesAsync = ref.watch(profilesStreamProvider);
```

**命名規約（重要）**

- アプリ独自 enum と Flutter 標準型が衝突する場合は `import 'package:flutter/material.dart' as material;` でエイリアスを付ける
- 表示名のスペース有無を統一する（`'Chrono Ride'` と `'ChronoRide'` の混在はバグになる）
- **drift の命名衝突**: `@DataClassName` を省略するとテーブル名からクラス名が自動生成されてドメインモデルと衝突する。必ず `@DataClassName('ProfileRow')` のように Row サフィックスを付けて区別する

### 3-5. Android Day 1 チェックリスト

**プロジェクト作成直後**

- [ ] Google Play / App Store で競合調査
- [ ] `flutter create --org com.narukami_akut {app_name}`
- [ ] `git init`。`key.properties`・`google-services.json` が `.gitignore` に含まれていることを確認
- [ ] `CLAUDE.md` を作成（Flutter PATH プレフィックス・lint ルール・命名衝突注意・バージョン規約・Firebase/AdMob メモ・`integration_test` による E2E 注記を必ず含める）
- [ ] `CLAUDE.local.md` を作成し `.gitignore` に追加
- [ ] `_user/` 各フォルダ・`scripts/` フォルダは**ユーザーが事前に作成する**（作成不要）。**もし存在しない場合はユーザーに作成を促す**
- [ ] `build_apk.ps1` を Claude Code に作成させる（`.\build_apk.ps1` でビルド・リネーム・`_user/releases/` へのコピーまで行うスクリプト）
- [ ] `pubspec.yaml` のバージョンを `0.1.1+1` にセット

**Firebase（最初の日に完了させる）**

- [ ] Firebase コンソールで新プロジェクト作成
- [ ] `google-services.json` を `android/app/` に配置
- [ ] `firebase_core`, `firebase_crashlytics`, `firebase_analytics` を追加
- [ ] `main.dart` に Firebase 初期化コードを追加
- [ ] `lib/firebase_options.dart` を手動生成（`flutterfire configure` は使わない — WSL2 では認証フローでブラウザが開けない。`/mnt/c/00_Claude_Code/03_Chrono_Ride/lib/firebase_options.dart` を参考に手動作成）
- [ ] Remote Config に `latest_version` パラメータを作成（初期値は現在のバージョン番号）
- [ ] **アカウント／クラウド同期を使うなら Cloud Firestore を Console で作成＋ルール公開**（Authentication だけでは書き込み/削除が届かない。3-10 参照）

**多言語対応（最初の日に完了させる）**

- [ ] `l10n.yaml` を作成
- [ ] `lib/l10n/app_en.arb` と `app_ja.arb` を作成
- [ ] `flutter gen-l10n` を実行
- [ ] `MaterialApp` に `localizationsDelegates` と `supportedLocales` を追加

**lint・Android ビルド設定**

- [ ] `analysis_options.yaml` に lint ルールを追加（`avoid_print`, `prefer_single_quotes`, `prefer_const_constructors` 等）
- [ ] `android/app/build.gradle.kts` を Kotlin DSL に確認
- [ ] Java 17 ターゲットを設定
- [ ] `android:allowBackup="false"` を `AndroidManifest.xml` に設定
- [ ] `key.properties`（署名設定）を作成・gitignore に追加
- [ ] **keystore（`.jks`）の実ファイルパスを、次回ブランドセッションへのフィードバックに書き添える**（Dropbox バックアップへの追加登録が必要。詳細は 2-1「Dropbox バックアップ」参照。**開発セッション側でスクリプトを直接編集しない**）

**AdMob（広告を使う場合）**

- [ ] AdMob コンソールでアプリを登録し App ID を取得
- [ ] `AndroidManifest.xml` に App ID を追加
- [ ] `lib/services/ad_service.dart` を作成（テスト広告 ID から始める）

**設定画面（必須）**

- [ ] `package_info_plus` + `url_launcher` を追加
- [ ] 設定画面にアプリバージョンを表示
- [ ] 設定画面にプライバシーポリシーへのリンクを設置（Play Store 申請前に URL を公開しておく）

### 3-6. Android ビルドの注意事項

| 問題 | 対策 |
|------|------|
| NDK がスペース含みパスで失敗 | ジャンクション作成: `C:\Android\sdk` → SDK の実パスにリンク |
| `buildscript {}` で "no repositories defined" | `google()`, `mavenCentral()` を `buildscript` 内にも書く |
| `flutter gen-l10n` 後に `dart format` が失敗 | l10n ファイルは正しく生成されているので無視でよい（WSL2 既知バグ） |
| `key.properties` の `storeFile` がエラー | バックスラッシュでなくフォワードスラッシュ（`C:/Users/...`）で書く |
| AGP/Gradle/desugar_jdk_libs の非互換でビルド失敗 | AGP・Gradle・Kotlin を個別にいじらず、Flutter SDK の `gradle_utils.dart` に記載されたセットに揃える（後述） |
| ビルド直後の成果物を `Move-Item`/`Copy-Item` すると一時ロックで失敗 | 最大5回・2秒間隔のリトライ処理を挟む（Chrono Ride/ReminDoで確認済み） |

**AGP/Gradle/Kotlin バージョン固定（ReminDoで解決・2026-06-07/08）**

AGP 8.7.3 + Gradle 8.14 のような個別バージョン組み合わせは desugar_jdk_libs の variant メタデータ不整合でビルド失敗する。**根本原因**は Flutter SDK のテンプレート値より古い AGP を使っていたこと。確認方法:

```bash
grep "templateAndroid\|templateDefault\|templateKotlin" \
  ~/flutter/packages/flutter_tools/lib/src/android/gradle_utils.dart
```

ReminDo（Flutter 3.11.5）は AGP 8.11.1 + Gradle 8.14 + Kotlin 2.2.20 で解決。他アプリも同じ Flutter バージョンならこのセットに揃えると移植性が上がる。

> **テスト種別の注意**: グローバルの `~/.claude/rules/testing.md` には「E2E は Playwright」と記載されているが、Flutter ネイティブアプリには Playwright は使えない。プロジェクトの `CLAUDE.md` に「Flutter の E2E は `integration_test` パッケージを使う」と明記して上書きすること。

> **PowerShellビルドスクリプト（`build_aab.ps1`等）を編集する際の注意（2026-07-08 ReminDoでの事故から）**: WSL2上のAIエージェントはPowerShell実行環境を持たず、実機（Windows側）でしか構文を検証できないという非対称性がある。`function` ＋ `[Parameter(Mandatory)]` ＋ `[scriptblock]$Action` 型パラメータ等、そのファイルで初めて使う凝った構文を新規導入すると、原因不明のパースエラー（報告される行番号が実際の行と一致しないカスケード的なエラー等）でスクリプト全体が動かなくなるリスクがある。**そのファイル内で既に動作実績のある単純な構文（forループ直書き・try/catch・if文）を使い回す**方が安全。

**Flutter バージョン別の lint 変更**

| Flutter バージョン | 変更内容 | 対応 |
|-------------------|---------|------|
| 3.41.7〜 | `__`（アンダースコア2個）の匿名引数が `unnecessary_underscores` で警告 | `_` に統一する |
| 3.41.7〜 | `RadioListTile.groupValue` / `onChanged` が `deprecated_member_use` | `SegmentedButton` に置き換える |

### 3-7. 振り返り（Chrono Ride・ReminDo より）

- **Firebase は Day 1 に入れる** — 後から入れると設定のやり直しが多い
- **多言語も Day 1 から** — 後から ARB に移す作業は大変。最初から `AppLocalizations.of(context)!.xxx` で書く習慣を
- **プロモコードはリリース前に本番コードに差し替え** — `kPromoCodes` を必ず更新する
- **`kHideAds` のチェック** — スクリーンショット撮影用フラグをリリースビルドに含めないこと
- **versionCode は前回より必ず大きくする** — `pubspec.yaml` の `+N` を忘れると Play Store で拒否される。**一度アップロードした `+N` は、そのリリースを後から削除しても二度と再利用できない**（Play Consoleの恒久仕様、ダウングレード攻撃防止のため）。テストアップロードは慎重に行い、誤って提出したら「削除すればやり直せる」と思わず `+N` を上げて再ビルドする前提で動く（Chrono Ride 2026-07-03で実際に発生）
- **「広告が全部消えた」報告はまずビルド種別（debug/release）を疑う** — Chrono Ride・ReminDo双方で同日に発生。`kHideAds`やAdServiceのロジックを疑う前に、ユーザーがデバッグビルドを実機インストールしていないか確認する（AdMobはデバッグ/非本番ビルドで実広告が安定配信されないため）。ストア版インストールで解消することが多い。**「動作がもっさりする」等の体感パフォーマンス報告も同型パターン**（2026-07-15 ReminDoで再発）: コード（`NavigatorObserver`等）を疑う前に、まずリリースAPKビルドで確認するのが最短
- **手がぶれるユースケースの長押し感度改善** — Flutter標準の`GestureDetector.onLongPress`は認識確定までに指が18論理px（`kTouchSlop`既定値）以上動くとキャンセルされる。画面全体を`MediaQuery`でラップし`gestureSettings: DeviceGestureSettings(touchSlop: 48)`のように上書きすると許容量を広げられる（`package:flutter/gestures.dart`のimportが必要）。自転車・バイク等を支えながらの操作や手袋操作等に応用可能（Chrono Rideのライド終了長押しで採用）
- **drift の `@DataClassName` は必ず付ける** — 省略するとドメインモデルと名前衝突してビルドが通らない
- **WSL2 で `flutter run` は不可** — ビルド・実機確認は PowerShell のみ。WSL2 でできるのはコード編集・`flutter test`・`flutter analyze` のみ
- **クラウドストレージは SAF の外** — `file_picker` の `getDirectoryPath()` は Dropbox・OneDrive 等のクラウドドライブを選択できない。エクスポート先はローカルフォルダ前提で設計する
- **DB サービスの初期化ガード** — `insert()` 等のメソッドは `if (_db == null) return;` を冒頭に入れる。テスト環境では `open()` が呼ばれないためガードがないとテストがクラッシュする

### 3-8. データセーフティフォームの注意事項（Chrono Ride より）

Play Console の初期値が「データを収集・共有しません」になっており、Firebase + AdMob を使うアプリは**必ず修正が必要**。放置するとポリシー違反で削除リスクがある。

**外部 API・Firebase・AdMob を使う場合の標準設定パターン**

| データ種別 | 収集 | 共有 | 共有先 | 目的 |
|-----------|------|------|-------|------|
| クラッシュログ | ✅ | ✅ | Firebase Crashlytics | アナリティクス |
| アプリのアクティビティ | ✅ | ✅ | Firebase Analytics | アナリティクス |
| デバイスID | ✅ | ✅ | AdMob | 広告・マーケティング |
| 位置情報（外部 API を使う場合） | ✅ | ✅ | 利用先 API 名を明記 | アプリの機能 |

- 転送中の暗号化: あり（HTTPS）
- データ削除リクエスト: なし（アカウント機能がない場合）
- **Play Console の場所**: 「ポリシー」→「アプリのコンテンツ」（2026年6月時点）

### 3-9. Play Store & Google App Campaign ノウハウ（Chrono Ride より）

**Play Console の UI 変更（2026年6月時点）**

- ストア説明文・SS 編集: 「ユーザーを増やす」→「ストアの掲載情報」
- データセーフティ: 「ポリシー」→「アプリのコンテンツ」

**ストア説明文の構成パターン**

```
【1行目】アプリのコンセプト
【2行目】できることの概要

■ 主な機能
・箇条書き

■ 使用する権限について
・各権限とその用途・送信先を明記（外部 API がある場合）

■ ご注意
・免責事項
```

「外部サーバーへの送信は一切行いません」は**送信がある場合は絶対に書かない**。

**Google App Campaign の設定**

| 項目 | 設定内容 |
|------|---------|
| 目標インストール単価 | 未設定推奨（初期）。データが 50 件以上溜まってから設定 |
| 1日の予算 | 500円〜 |
| 終了日 | 未設定（予算切れで自動停止） |
| 広告アセット見出し | 日本語 15文字以内（半角 30byte） |
| 広告アセット説明文 | 日本語 30文字以内（半角 90byte） |

**注意**: 広告ブロッカーが有効だと Google Ads の UI が壊れる。アセット入力欄が表示されない場合は広告ブロッカーを無効にする。

**運用の知見**

- 言語別に広告グループを分けるとパフォーマンスを個別に確認できる（例: 日本語グループ / English group）
- インド・東南アジア向けアプリは App Campaign と相性が良い（CPI が低いため同じ予算で多く配信）
- 日本語メインのアプリは SNS 告知との組み合わせが重要

**AdMob アプリ申請・app-ads.txt 設定（Chrono Rideより・2026-06-03）**

リリース後の AdMob アプリ申請で「app-ads.txt の問題」「デベロッパーウェブサイトが見つかりません」という警告が出る場合の対処:

- `app-ads.txt` を開発者ドメインのルートに配置する。ブランド共通で `NARUKAMI-AKUT/narukami-akut.github.io` リポジトリに以下を配置済み（複数アプリでも同じファイル1つで対応可能、パブリッシャーIDが同じため）:
  ```
  google.com, pub-7697822326877937, DIRECT, f08c47fec0942fa0
  ```
  公開URL: `https://narukami-akut.github.io/app-ads.txt`
- Play Console → ストア掲載情報 → 連絡先情報 → ウェブサイト に `https://narukami-akut.github.io/{app}-site/` を設定する
- 「サポート外ドメイン」エラーが出る場合は、デベロッパーウェブサイトを `https://github.com/NARUKAMI-AKUT/narukami-akut.github.io`（リポジトリURL）に設定すると解消する場合がある
- app-ads.txt は必須ではないが、設定すると高単価広告主の入札が増え eCPM 改善が期待できる

### 3-10. Firebase アカウント同期・関連実装ノウハウ（ReminDo v0.9.1/v0.10.1 で確立）

アカウント／クラウド同期を入れるアプリはこの節を最初に読むこと。**数セッション溶かした不具合の大半がここに集約されている。**

**最重要: Authentication と Cloud Firestore は別作業。DB 未作成が全アカウント不具合の根本原因になる**

- Authentication が正常（ログインOK・ユーザーが増える）でも、**Firestore Database が作成されていない**と書き込み／削除だけがサーバー未到達でハングする。読み取りはローカルキャッシュから返るため「一見動いている」ように見えて気づきにくい。
- 症状（再ログインで /setup になる・復元されない・削除で固まる・データがマージ／復活する）が出たら、**まず Console で「Firestore Database が作成済みか」「ルール」を疑う**のが最短。決定的な切り分けは「削除処理のログ（例 `[sync] deleteUserData`）が一切出ない＝リクエストが Firestore に届いていない」。WiFi・モバイル両方で同症状なら端末回線ではなくサーバー側。
- 対処: Console → 構築 → Firestore Database → 作成（リージョン例 `asia-northeast1`／後変更不可）→ 本番モード → ルール公開。
- 料金は **Spark（無料）で十分**。Blaze は Cloud Functions デプロイ時のみ。App Check は任意（本番で不正利用が気になったら有効化）。

**データ構造とセキュリティルール（親 doc も必ずカバー）**

```
accounts/{uid}                        # 親ドキュメント（削除時に delete する）
accounts/{uid}/{collection}/{docId}   # profiles/list_items/categories/reminders など
accounts/{uid}/meta/trial             # トライアル情報等
```

`match /accounts/{uid}/{document=**}` **だけ**だと親 `accounts/{uid}` の delete が拒否される。両方許可する:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /accounts/{uid} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
      match /{document=**} {
        allow read, write: if request.auth != null && request.auth.uid == uid;
      }
    }
  }
}
```
- ルールは repo 管理化する（`firestore.rules`＋`firestore.indexes.json`＋`firebase.json`、`firebase deploy --only firestore:rules` で反映）。
- 全件 get/set/snapshots/delete のみで where+orderBy を避ける設計にすれば**複合インデックス不要**。

**同期・復元・削除のパターン（事故りやすい順）**

- **ローカルファースト**: drift に書いて即UI反映→Firestore へ背景 push。同期はドキュメント単位の Last-Write-Wins（時刻比較）＋和集合、削除は `deletedAt` ソフト削除で伝播。
- **復元待ち**: ローカルが空なら**初期同期の完了（idle 確定）を待ってから** /setup 判定。待たないと再インストール／別端末で毎回「名前登録」から始まる。timeout/error は `/sync-error`（再試行）へ流し、**未確定のまま新規作成させてマージ事故を起こさない**。
- **別アカウントログイン**: prefs `local_data_uid` と比較し**別uidのときだけ** `clearAllData()`＋sync invalidate。同一uid再ログインは保持。**ログアウトではローカルを消さない**（削除は明示的アカウント削除時のみ）。
- **アカウント削除は順序が命**: **認証がある状態で Firestore を先に削除** → ローカル/prefs → **最後に Auth 削除**。`user.delete()` を先にやると未認証で Firestore 削除が拒否されデータが残る。Firestore 削除は batch＋タイムアウトにし、オフラインで完了しないなら中断して何も消さない（中途半端＝復活/マージ事故防止）。UI は削除中プログレス必須。
- **ゲスト（匿名）ログイン**: `signInAnonymously()`。seed データは**ゲストかつプロフィール0件のときだけ**投入（`user.isAnonymous` 分岐）。ログアウトすると復元不能・次回は別uid（孤児データが溜まる）。昇格は `currentUser.linkWithCredential(EmailAuthProvider.credential(...))` で **uid を保持**（ローカルDB・Firestore をそのまま引き継げる）。エラーコードが新規作成と違う（`credential-already-in-use`/`provider-already-linked`/`requires-recent-login`）ので分岐する。孤児掃除は Admin SDK スクリプトを**手元PCから手動実行**すれば Blaze 不要（`metadata.lastRefreshTime` が実質「最終利用」）。
- **家族/グループ招待は招待コード方式**にする（**Firebase Dynamic Links は2025年終了**のため使わない）。

**検証チェックリスト（アカウント機能を入れたら必ず）**
- [ ] Console で Firestore DB 作成済み／ルール公開済み
- [ ] アイテム作成 → Console `accounts/{uid}/...` に増える（書き込み到達）
- [ ] 再インストール→同アカウントで復元／別アカウント・ゲスト切替でデータが混ざらない
- [ ] 削除 → Firestore ごと消え、同アドレス再作成で復活しない／オフライン削除で何も壊れない

**広告（App Open Ad）の課金者判定**

- `showAdsProvider = !isSubscribed` は**サブスク状態がロード中だと `true`（広告表示）**になり、課金者にも一瞬広告が出る。判定前に `await ref.read(subscriptionProvider.future)` で確定させる。
- **App Open 広告はログイン後（認証済み）に出す**（ログイン前は課金者か不明）。プリロード待ちで初回は出ず次回起動で出ることがある（正常）。

**UI / 通知 / DB の小ネタ**

- **ダークテーマでアバターが消える**: 絵文字アバター（`👤` 等）を暗色背景に置くと視認不能。アバターは常に明るい背景（例 `#E3F6FD`）＋境界線にする。`ColorScheme.dark` はコードで実際に使うスロット（`surfaceContainerLow/Highest`・`outlineVariant`・`errorContainer` 等）を明示指定しないとグレー基調が残る（先に `grep 'cs\.[a-zA-Z]+'` で洗い出す）。
- **繰り返し（毎日）リマインドに絶対日時を保存しない**: `notificationAt` に具体日付を入れると日付をまたいで「期限切れ」誤表示になる。**毎日アイテムは日付を無視し時刻のみで判定**（今日/明日に丸める）。編集画面とリマインドタブで表示時刻がズレるのは採用基準（ORDER BY）の不一致が原因＝統一する。
- **`flutter_local_notifications` のアクションボタン無反応**: `AndroidManifest.xml` に `com.dexterous.flutterlocalnotifications.ActionBroadcastReceiver` の `<receiver>` 宣言が無いと `actionId=null` で何も起きない。`adb logcat` で `actionId=null` が出たら最優先で疑う。
- **バックグラウンド headless isolate での多重初期化**: 短時間に複数通知が来ると `AppDatabase()` 多重生成で `database is locked`、`Firebase.initializeApp()` 多重で `already exists`。**isolate スコープのトップレベル変数でシングルトン化**する（単一通知では再現しないため複数同時通知で検証）。**この対策は新しいheadless entrypointを追加するたびに横展開が必要**（2026-07-15 ReminDoで、過去の対策が漏れていた新規entrypointが2件見つかった実績あり。コードコメントだけでなくDay1チェックリスト等でチェックリスト化しておくこと）
- **driftアプリは最初から`PRAGMA journal_mode=WAL`+`PRAGMA busy_timeout=5000`を設定しておく**（瞬間的なDB競合をリトライで吸収する多層防御、2026-07-15 ReminDoで追加）
- **バックグラウンドアラームスケジューリング系の不具合調査は `adb shell dumpsys alarm` を最初に使う**（2026-07-15 ReminDoで確立）: システムに実際に登録されているアラームの`origWhen`（発火予定日時）を直接確認できる。「今日か翌日か」のようなアプリ内ログだけでは分からない設計不備（再登録時の日付繰り上げロジック等）の発見に有効
- **「設定を変えても効かない」系の不具合は、まずその設定を読んでいる箇所が`.valueOrNull`（同期・未解決時null）か`.future`（非同期・確実に解決を待つ）かを確認する**（Riverpod `AsyncNotifierProvider`、2026-07-15 ReminDoで確立）。「アプリ起動直後だけ」「たまに」という再現条件はこのパターンの典型サイン
- **drift の ORDER BY タイブレーク**: `createdAt` のみだと同一タイムスタンプ行の並びが UPDATE 後に変わる。第2キーに `id`（主キー）を足して安定させる。
- **Firebase 確認メールが迷惑メール行き**: 無料共有ドメイン `noreply@<project-id>.firebaseapp.com` はスパム判定されやすい。登録完了メッセージに「迷惑メールフォルダもご確認ください」を添える（恒久対策はカスタムドメイン＝要 DNS/SPF/DKIM）。
- **Firebase Authenticationのメールテンプレートは本文編集がパスワードリセットのみ可能**（2026-07-15 ReminDoで確認。メールアドレス確認・変更通知はGoogle固定文言、スパム/フィッシング悪用防止のための仕様）。送信者名の「project-<番号> チーム」表示はConsoleの「Public-facing name」未設定が原因で、GA4のプロパティ名設定とは無関係（混同しやすいので注意）
- 端末の戻るでアプリ終了を防ぐ: シェルを `PopScope(canPop: index==0, onPopInvokedWithResult: ...→ go('/home'))` で包む。`DropdownButtonFormField` は `key: ValueKey(selectedValue)` を付けないと外部からの選択値変更が反映されないことがある。

---

## 4. Windows アプリ

### 4-1. 技術スタック選定

アプリの性質によって選ぶ。現時点での実績と方針：

| スタック | 向いているもの | 実績 |
|---------|--------------|------|
| Python + tkinter | 計測・制御ツール、軽量 GUI ツール | APx Controller（社内ツール） |
| Python + PyQt/PySide | リッチな UI が必要なツール | 未実績 |
| Flutter Windows | Android 版と UI を共有したいアプリ | 未実績 |
| 素のJS + Canvas 2D（静的Webアプリ） | 画像加工・ツール系でサーバー代をかけたくないもの。ビルド不要・GitHub Pagesのみで完結 | Desktop Zoning（4.11節参照） |

**社内ツール・計測系**: Python + tkinter（単一ファイル構成）  
**ブランドアプリ（エンドユーザー向け）**: アプリ次第。ブランドセッションで決定。

### 4-2. 開発環境

| 項目 | 内容 |
|------|------|
| OS | Windows 10/11 + WSL2 (Ubuntu) |
| エディタ | VS Code（WSL2 ターミナルで作業） |
| Python | WSL2 の Python 3.x（テスト用）/ Windows Python（GUI 起動・実機制御用） |

**プラットフォームごとの制約**

| 環境 | テスト | GUI 起動 | 実機制御 |
|------|--------|----------|----------|
| Windows（接続あり） | ✅ | ✅ | ✅ |
| Windows（接続なし） | ✅ | ✅ | ❌ |
| WSL2 / Linux | ✅ | ❌ | ❌ |

→ **テストは WSL2 で `pytest`、GUI 確認・実機制御は Windows で実行。**

### 4-3. プロジェクト構成（Python + tkinter の場合）

**単一ファイル構成**（小〜中規模ツールの推奨）:
```
{AppName}_v{version}.py   # メインファイル（バージョン番号をファイル名に含める）
tests/
└── test_{app_name}.py
_user/
├── releases/              # EXE / インストーラーのリリース履歴
└── docs/
requirements.txt           # 依存ライブラリ（配布時に使用）
build_release.bat          # PyInstaller --onedir でビルド → ZIP 生成（APx Controller 参照）
```

**ファイル名にバージョンを含む場合の import**

ファイル名にドットが含まれるため、標準の `import` は使えない:

```python
import importlib.util
spec = importlib.util.spec_from_file_location("app_module", "AppName_v0.9.0.py")
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)
```

### 4-4. バージョン規約（Windows アプリ）

**Android（3-2）と同じ規約に統一する。** 開発中（プレリリース）は `0.X.Y`、**正式リリース後は Semantic Versioning `MAJOR.MINOR.PATCH`**（`MAJOR`=リリース後 1 固定・アーキテクチャ刷新で上げる／`MINOR`=機能追加／`PATCH`=バグ修正・小改善）。Windows は Play Store の versionCode（`+N`）が無いため `+N` は不要。

> **経緯（APx Controller）**: APx はリリース後も開発中の旧命名（`v0.コンサル日数.当日更新回数`）を使い続けていたが、**ホームページ（`00a_Homepage`）が公開されてリリース告知が定常化しリリースのタイミングが明確になった**ことを機に、途中で整合を取って SemVer（v1.0.0〜）へ直した。README のバージョン履歴が旧→新の対応の記録（旧 v0.11.1=v1.0.0 / 旧 v0.13.1=v1.1.0 / 旧 v0.14.0=v1.2.0、以降 v1.2.1…）。

**メインファイル名 = 対外アプリ名にプレフィックスを統一する**（APx Controller で `APx500_Controller_*.py` → `APx_Controller_*.py`）。配布物（ZIP/exe/spec）とソースファイル名・PostToolUse フックの正規表現・テストのロード参照・CLAUDE.md をまとめて追従させる。旧バージョンのファイルは履歴のため旧名のまま残す。

**新バージョン作成手順**:
```bash
cp AppName_v1.2.0.py AppName_v1.2.1.py
# 新ファイル内の VERSION = "v1.2.1" を更新
# tests/ 内のファイルパス参照も更新
```

旧バージョンのファイルはリポジトリに残す（削除しない）。

### 4-5. テスト方針（Python）

```bash
pytest              # tests/ ディレクトリを実行（WSL2 で動作）
pytest tests/ -v    # 詳細表示
```

- tkinter・外部 API・ハードウェア制御ライブラリは**すべてモック**でテストする
- WSL2 には tkinter がないため、テストファイル冒頭で `sys.modules["tkinter"] = MagicMock()` でスタブ化
- モックパターン:

```python
# __init__ を呼ばずにインスタンス化
ctrl = MyController.__new__(MyController)
ctrl._log = lambda msg: None

# モジュールレベル変数のパッチ
with patch.object(mod, "API_AVAILABLE", True), \
     patch.object(mod, "API") as mock_api:
    ...

# プロセス検出関数のモック（APx Controller パターン）
with patch.object(mod_instance, "_is_apx_running", return_value=True):
    ...
```

### 4-6. コードスタイル（Python）

- 日本語コメント・ログメッセージが標準
- ログプレフィックス例: `INFO  ` / `WARN  ` / `ERR   ` / `RUN   `（2 スペース区切り）
- `except Exception:` で広く捕捉（COM 例外等が多様なため。narrowing は避ける）
- linter / formatter の設定はプロジェクトごとに判断

### 4-7. 配布方法（Windows アプリ）

**基本方針: GitHub で公開し、ホームページ（`00a_Homepage`）で告知するスタイル**（APx Controller で確立）。

- **公開するファイルはビルド済みの `.zip` のみ**（PyInstaller --onedir を ZIP 化したもの。中に `APx_Controller.exe` 等が入る。Python インストール不要で起動できる形）。
- **配布用 `-site` 公開リポジトリ**（例 `APx-Controller-site`。ソース PRIVATE とは別。命名は 2-7）に **GitHub Release** としてアップロードする。
  - README を同リポジトリに配置し、「最新版をダウンロード」リンクを **`releases/latest`**（`https://github.com/NARUKAMI-AKUT/{App}-site/releases/latest`）に向ける → 常に最新版のみをダウンロードさせられる。
  - リリースを GitHub Release にすることで**ダウンロード数を計測できる**（`gh api repos/NARUKAMI-AKUT/{App}-site/releases --jq '.[].assets[].download_count'`）。リポジトリ直下に ZIP を直接コミットする方式だと計測できないので使わない。
  - README には「ダウンロード / 起動方法（`.exe` ダブルクリック・デモモード/実機制御モードの説明）／動作環境／主な機能／プライバシーポリシー URL／**バージョン履歴（新しい順・日付付き）**」を載せる（APx-Controller-site の README が実例）。
  - README は clone せず `gh api contents/README.md`（取得→編集→`gh api -X PUT`）で直接編集できる（4-9 参照）。
- **プライバシーポリシー**は同 `-site` リポジトリの `privacy_policy.html` を GitHub Pages で公開（`https://narukami-akut.github.io/{App}-site/privacy_policy.html`）。
- **Microsoft Store 等のストア公開は、作るものによって選択肢として残す**（必須ではない）。`.py` の直接配布は社内ツール・Python 環境がある人向けの補助手段として引き続き可。

### 4-8. Windows Day 1 チェックリスト

- [ ] ブランドセッションでアプリ名・コンセプト・技術スタックを確定
- [ ] リポジトリ作成（`git init`）
- [ ] `_user/prompt/`, `_user/docs/`, `_user/releases/` フォルダを作成
- [ ] `CLAUDE.md` を作成（バージョン規約・テスト実行コマンド・WSL2 制約・ファイル名の注意・デモモードの仕組みを必ず含める）
- [ ] `CLAUDE.local.md` を作成し `.gitignore` に追加
- [ ] `requirements.txt` を作成（最低限の依存ライブラリ）
- [ ] `tests/test_{app_name}.py` を作成し、tkinter のスタブ化コードを冒頭に入れる
- [ ] `pytest` でテストが通ることを確認（WSL2）
- [ ] `AppName_v0.1.0.py` にアプリ骨格を作成（デモモード対応）

### 4-9. 振り返り（APx Controller より）

- **デモモード（API 未接続）を最初から設計する** — `API_AVAILABLE = False` の分岐を設けることで、実機なしでも GUI 開発・テストができる
- **ファイル名にバージョンを含める運用** — 旧版を残しつつ新版を作れるため diff が追いやすい。`importlib.util` での読み込みを忘れない
- **tkinter のスタブ化はテストファイル冒頭で** — `sys.modules["tkinter"] = MagicMock()` を忘れると WSL2 でテストが通らない
- **COM 例外は広く捕捉** — `except Exception:` で良い。narrowing するとはまる
- **プロセス検出は tasklist コマンドで行う** — `win32gui` のウィンドウタイトル検索では自アプリや他ウィンドウを誤検出する。`subprocess.run(["tasklist", ...])` で EXE 名を直接確認する
- **自動接続フラグのリセット条件を明確に** — 「プロセスが消えた場合のみフラグをリセット」など、プロジェクト切替等の一時的な切断と永続的な終了を区別する
- **tkinter でのアイコン・画像表示は Pillow 依存** — `Pillow` を `requirements.txt` に含め、画像表示を使う場合は実行時依存として明記する
- **シーケンス実行中は UI 全無効化する** — 二重実行フラグ + `_set_ui_enabled(False/True)` パターンで安全に制御
- **ウィンドウアイコンは `iconphoto(True, *photos)` + 複数解像度PNG を使う**（2026-06-15訂正: 旧版は `iconbitmap()` を推奨していたが、`iconphoto` 方式の方がタスクバー含め鮮明に表示され実機で改善確認済み）。PhotoImage の参照を保持しておく（GC対策）。小サイズ(16-32px)はアンシャープマスク適用。詳細は2-7「命名規則・アイコン/グラフィック生成の共通仕様」参照
- **`_setup_icon()` は `__init__` から明示的に呼ぶ** — 定義だけでは動かない
- **アイコン変更後はビルド前に `build/` と `dist/` を削除** — Windows のキャッシュが残ると古いアイコンが表示されることがある
- **WSL2 から PyInstaller を実行しない** — バックスラッシュを含む名前のファイルがルートに大量生成される。`build_release.bat` は必ず Windows PowerShell から実行する
- **tkinter + PowerShell ダイアログはバックグラウンドスレッドで実行** — `FolderBrowserDialog` 等を tkinter のメインスレッドで呼ぶと GUI がフリーズする。`threading.Thread` でバックグラウンド実行し完了を待つ
- **外部 GUI の前面制御に `pywin32` を使う** — `win32gui.IsWindowEnabled` でモーダルダイアログを識別し前面に出す。`pywin32` 未インストール時はフォールバックしてログに警告を出す実装にする
- **外部ウィンドウの前面化に `SW_RESTORE` を安易に使わない（v1.2.1で判明）** — `ShowWindow(hwnd, SW_RESTORE)` は**最大化ウィンドウを通常サイズに戻してしまう**。`IsIconic`（最小化判定）が真のときだけ `SW_RESTORE`、それ以外（最大化・通常）は `SW_SHOW` にすると、現在の状態を保ったまま前面化できる。外部アプリ連携系で汎用的に使える。
- **`-site` の README は clone せず `gh api` で直接編集できる** — `gh api contents/README.md` で取得（base64デコード）→ 編集 → `gh api -X PUT`（sha とブランチ指定）でコミット。/tmp への clone・git identity 設定が不要。
- **単一ファイル構成でもアナリティクスは同居できる** — 新規モジュールを作らず `_load_settings()`／`_save_settings()`／`send_analytics_event()` をメインファイルに追記で問題なし（4-10 参照）。設定保存機構がなければ `%APPDATA%\{App}\settings.json` を新設し、以後の設定要望にも流用する。

### 4-10. アナリティクス実装（GA4 Measurement Protocol、Firebase SDK 非対応プラットフォーム向け）

Web/デスクトップ/CLI など Firebase SDK が使えないアプリのアナリティクス実装テンプレート（APx Controller v1.2.0 で確立）。**運用の原則「全アプリにアナリティクス標準装備」の具体手段。**

- **GA4 Measurement Protocol の正式クライアントは Web（gtag）か Firebase（モバイル）の二択のみ**。デスクトップはどちらにも該当しないため、**「Web ストリーム」を流用し `client_id` を自前生成の UUID で代用**する（CLI/拡張機能のテレメトリで一般的だが Google 公式には「単独使用では部分的レポートの可能性」と明記された非公式手法である点は承知しておく）。
- **落とし穴: ストリーム URL は実在ページにすること**。ダミー URL（`https://example.local` 等）だと GA4 が「Google タグが検出できない／データ収集が有効になっていません」と判定し、Measurement Protocol のイベントがレポート（DebugView・標準レポート）に反映されない。**リクエスト自体は `204 No Content` を返すため、送れているように見えて数日デバッグする羽目になる**。対処: 自分たちが管理する公開ページ（例: プライバシーポリシー）に標準の gtag.js スニペットを設置し、ストリーム URL をそのページに向ける。タグ検出完了で「データ収集は有効」表示になれば MP 側も反映される。
- **送信するイベント**: 起動時 `app_open`、未捕捉例外時 `app_exception`（`exception_type` はクラス名のみ、スタックトレース本文は送らない）。Crashlytics 非対応環境のクラッシュ可視化を GA4/Firebase に一本化できる。詳細が必要になれば Sentry 等を再検討。
- **国・地域は自動収集**: MP のリクエスト送信元 IP から GA4 が国/地域を推定（IP 自体は保存されず破棄）。追加実装不要だが**プライバシーポリシーに明記が必須**（収集項目・オプトアウト方法・IP ベースの地域収集）。
- **fire-and-forget 必須**: 別スレッド・タイムアウト短め（例 3 秒）・例外を握る。測定器を扱う業務用 PC 等はネットワーク制限があり得るため、送信失敗でアプリの起動・操作に一切影響しないことを最優先にする。ステータスバー等にオプトアウト用チェックボックスを置き、設定を `settings.json` に永続化していつでも無効化できるようにする。
- **GA4のプロパティ名・アカウント名の変更**（2026-07-15 ReminDoで確認）: analytics.google.com（Firebase Consoleではない）の管理画面（歯車→アカウント設定/プロパティ設定）上の表示ラベルにすぎず、Firebase App ID/Measurement IDに基づく紐付けとは独立している。**変更してもコード修正・`google-services.json`再生成は一切不要**。Firebase/GCPのプロジェクトID自体（`remindo-916ef`等）は作成後変更不可（immutable）だが、これはGA4プロパティ名とは別物

### 4-11. 静的Webアプリ（素のJS + Canvas 2D、ビルド不要）— Desktop Zoing で確立（2026-07-13〜15）

サーバー代をかけず GitHub Pages のみで完結させたいツール系アプリ向けの実績パターン。「完全クライアントサイド・外部送信ゼロ」を核心の訴求点にする場合に特に有効。

**構成**
- 素のJS ES modules + Canvas 2D、ビルドステップなし（`webapp/`配下、`python3 -m http.server`等で即確認可能）
- 設定は `localStorage` 自動保存＋JSON エクスポート/インポートで永続化・バックアップを両立
- 出力・保存等のアクションは全て単一関数（例 `runExport()`）を経由させておくと、将来の広告挿入・有料版分岐の差し込み口として使い回せる

**配布・命名規則（Android/Windowsと同じパターンをそのまま踏襲）**
- リポジトリ2つ: ソース PRIVATE（`<App>`、開発履歴バックアップ）／配布 PUBLIC（`<App>-site`、`webapp/`一式をGitHub Pagesで公開）
- 公開URL: `https://narukami-akut.github.io/<App>-site/`
- GA4・プライバシーポリシー共通テンプレートもそのまま流用可（4-10節・2-5節参照）
- **site repoの同期は現状手動**（`webapp/`編集→scratchpadにclone→push）。GitHub Actions等の自動化は各アプリ未整備のまま

**「外部通信一切禁止」という設計制約とアナリティクス導入の両立**
- 画像処理ツール等で「画像は一切送信しません」を核心の訴求点にしている場合、後発でアナリティクス要望が出ると設計制約と衝突する。**画像データ・生成物の中身は一切送信せず、匿名の利用イベント（機能の使用有無）のみ送信**に限定することで両立できる。設計変更は計画書のGlobal Constraintsに明記し、後から見て矛盾に見えないようにすること

**開発環境の制約（WSL2）**
- WSL2 環境では Playwright/Chrome が使えずブラウザでの実機確認が不可能。実装・レビューは静的コード解析（構文チェック・ロジック照合・自動テスト）で品質を最大限担保し、**ブラウザでの目視確認はユーザーに委ねる設計**に切り替える（`node --test`のディレクトリ指定もこの環境では動作しないため個別ファイル指定にする）
- CSSの詳細度に注意: 広いセレクタ（例 `.step button`）が個別クラスの上書きを負かすケースが複数回発生。子要素の上書きは親クラスを含めて詳細度を上げる必要がある

---

## 5. ブランドセッション（`00_Narukami_Akut`）の役割

**一貫してブランドイメージを管理する役割。** アプリのコンセプトやアプリ名は開発セッションに委ね、ブランドセッションはブランド整合の番人・マーケティングの司令塔として機能する。

| 役割 | 内容 |
|------|------|
| ブランドイメージ管理 | カラー・ロゴ・トーン＆マナー・命名/アイコン/グラフィックの共通仕様を一貫して管理 |
| アプリ名・コンセプトの決定 | **ブランドセッションでは決めない**。ハンドオーバーでブランドを理解した**開発セッション側で決定**する |
| フィードバックの受領・解析 | 開発セッションが保存した `00_Narukami_Akut/_user/feedback/{セッションフォルダ名}_feedback_{yymmdd}.md` を読んで解析し、**ブランドイメージから逸脱していれば修正を促す**。内容を CONTEXT.md・本ハンドオーバーに反映後 `old/` へ移動 |
| マーケティング方針の策定 | 告知・集客・ストア最適化などのマーケティング方針をこちらで策定（策定予定） |
| ストア/広告のクリエイティブ方針 | ストア・広告で使う**スクリーンショット・動画の製作方針を検討中** |
| ハンドオーバーの維持 | 本ドキュメントを最新に保ち、共通事項が変わったら各アプリへの反映要否を確認する（下記「共通事項の反映」参照） |

**開発セッション開始時に渡すもの**: **本ファイル（`app-dev-handover_*.md`）のみ**（2-2 参照。プロジェクトの `CLAUDE.md` は開発側で作成、`YYMMDD_修正N.txt` はユーザーがその都度貼り付け）。

### 共通事項の反映（ハンドオーバー → 各アプリ）

**本ハンドオーバーの共通事項（規約・ワークフロー・命名/アイコン仕様など）を修正したら、既存アプリ（Chrono Ride / APx Controller / ReminDo 等）の CLAUDE.md・スクリプト・アセットにも同じ更新をかけたい。** ただし**アプリによっては旧仕様のままで許容できる場合もある**ため、一律に反映せず**その都度ユーザーに反映要否を確認**してから各アプリに展開する。
