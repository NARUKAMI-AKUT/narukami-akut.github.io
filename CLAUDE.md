# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 概要

個人開発者ブランド「NARUKAMI AKUT」のホームページ（Jekyll + GitHub Pages、`https://narukami-akut.github.io`）。

## ビルド・プレビュー（WSL2）

Rubyはシステムインストール済みで、bundleは `vendor/bundle/ruby/3.2.0` にベンダリングされている（グローバルな`bundle`コマンドは使えない）。Jekyllは必ずベンダリングされたバイナリを直接叩くか `bundle exec` を使う。

```bash
# ビルド（GEM_HOME/GEM_PATH 指定が必要。直接バイナリだけでは gem が見つからない）
GEM_HOME=vendor/bundle/ruby/3.2.0 GEM_PATH=vendor/bundle/ruby/3.2.0 \
  vendor/bundle/ruby/3.2.0/gems/jekyll-3.9.5/exe/jekyll build

# ライブプレビュー
GEM_HOME=vendor/bundle/ruby/3.2.0 GEM_PATH=vendor/bundle/ruby/3.2.0 \
  vendor/bundle/ruby/3.2.0/gems/jekyll-3.9.5/exe/jekyll serve --host 0.0.0.0
```

`_site/` は `.gitignore` 対象。コミット不要。

**注意（WSL2の/mnt/c上での速度問題）**:
- `jekyll serve` は `vendor/bundle` 配下のgem数が多く `/mnt/c` のI/Oが遅いため、起動（gem読み込み）に1〜2分かかる。ファイル監視(`--watch`、デフォルト有効)が絡むとさらに遅化・スタックする場合がある。
- 簡易確認のみなら `jekyll build` → `python3 -m http.server 4000 --bind 0.0.0.0`（`_site/`内で実行）の方が速く安定する。
- ポート4000を使う前に `ss -ltn | grep 4000` で既存プロセスの有無を確認する（別プロジェクトのサーバーが残っている場合がある）。
- `jekyll serve`を直接実行する場合、Ruby 3.2では`webrick`が標準ライブラリから外れているため`Gemfile`に`gem "webrick"`が必要（追加済み）。
- `_apps/*.md` や `_layouts/*.html` を編集すると、`.claude/settings.json` の `PostToolUse` フックが自動でJekyllビルド検証（`BUNDLE_GEMFILE`/`RUBYOPT`方式）を実行する。Liquidテンプレートの構文エラーはこの時点で検出されるため、保存ごとに手動でビルドし直す必要はない。

## アプリ紹介ページの追加・編集

`_apps/` コレクション（`_config.yml` で `output: true`, `layout: app` が自動適用）。新しいアプリのリリース時や既存アプリの画像差替え時に追加・編集する。手順・front matterスキーマの詳細は `.claude/skills/add-app-page/SKILL.md`（`/add-app-page` skill）を参照（画像配置、changelog追記、画像のみ差替えのケースをカバー）。

ナビゲーション（`_includes/nav.html`）は `site.apps | sort: "order"` で自動生成されるため、ページ追加以外の編集は不要。

セクション見出し（"screenshots" 等）はテキストではなく `assets/images/brand/headings/` 配下のPNG画像を使用している（デザイン統一のため）。`_user_scripts/generate_section_headings.py` と `generate_app_section_headings.py` で生成できる。

## コミット規約

Conventional Commits（`feat:` / `fix:` / `style:` / `chore:` 等）。
