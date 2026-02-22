---
id: ruby-stdlib-9-1-json
title: '練習問題1: JSON設定ファイルの読み書き'
level: 3
---

### 練習問題1: JSON設定ファイルの読み書き

1.  `config.json` ファイルを読み込み、内容をJSONパースしてRubyのHashに変換してください。
2.  そのHashの `logging` の値を `true` に変更し、さらに `:updated_at` というキーで現在時刻（文字列）を追加してください。
3.  変更後のHashをJSON文字列に変換し、`config_updated.json` という名前でファイルに保存してください。（読みやすさのために `JSON.pretty_generate` を使っても構いません）

```json-readonly:config.json
{"app_name": "RubyApp", "version": "1.0", "logging": false}
```

```ruby:practice10_1.rb
```

```ruby-exec:practice10_1.rb
```

```json-readonly:config_updated.json
```
