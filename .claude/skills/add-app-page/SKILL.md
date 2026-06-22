---
name: add-app-page
description: NARUKAMI AKUTホームページに新しいアプリの紹介ページを追加する。新規アプリのリリース時や、既存アプリのアイコン/スクリーンショット差替え時に使う。
---

新しいアプリの紹介ページを `_apps/` コレクションに追加する手順。

## 手順

1. **画像の配置**
   - `assets/images/<app-slug>/` フォルダを作成
   - `icon.png`、`feature.png`、`ss1.png`〜`ssN.png`（スクリーンショット）を配置
   - `<app-slug>` はURLに使う英数字小文字+ハイフンの名前（既存例: `chrono-ride`, `apx-controller`, `remindo`）

2. **`_apps/<app-slug>.md` を作成**

   ```yaml
   ---
   name: アプリ名
   order: <既存アプリの最大order + 1>
   status: developing   # リリース済みなら released
   release_date: "YYYY-MM-DD"   # released の場合のみ
   release_version: "vX.X.X"    # released の場合のみ。リリース行に小さめフォントで表示
   tagline: 一言説明
   icon: /assets/images/<app-slug>/icon.png
   feature_graphic: /assets/images/<app-slug>/feature.png
   screenshots:
     - /assets/images/<app-slug>/ss1.png
     - /assets/images/<app-slug>/ss2.png
   cta_label: ボタン文言（例: "Google Playで見る"）
   cta_url: https://...
   privacy_url: https://narukami-akut.github.io/<app-slug>-site/privacy_policy.html
   ---

   本文（アプリの紹介文。<br>で改行可）
   ```

3. **ナビゲーションは自動反映**
   `_includes/nav.html` が `site.apps | sort: "order"` で一覧を生成するため、`_apps/` にファイルを追加するだけでナビ・アプリ一覧に表示される。追加の編集は不要。

4. **既存アプリの更新（changelog）を追加する場合**
   front matter に `updates` を追加・追記する:

   ```yaml
   updates:
     - date: "YYYY-MM-DD"
       version: "vX.X.X"   # アップデート行に小さめフォントで表示
       items:
         - 変更内容1
         - 変更内容2
   ```

   既存の `updates` エントリがあれば、新しい日付のエントリを配列の先頭（または既存の並び順に合わせて）に追加する。

5. **画像差替えのみの場合**
   `assets/images/<app-slug>/` 内の対象ファイル（`icon.png` / `feature.png` / `ssN.png`）を同名で上書きすれば、front matter の変更は不要。

6. **動作確認**
   `./vendor/bundle/ruby/3.2.0/bin/jekyll serve --host 0.0.0.0` でローカル確認後、コミット（Conventional Commits形式: `feat: ...`）。
