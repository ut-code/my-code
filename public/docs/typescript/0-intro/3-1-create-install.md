---
id: typescript-intro-create-install
title: プロジェクトの作成とTypeScriptのインストール
level: 3
question:
  - '`mkdir`や`cd`コマンドを使ったことがありません。これは何をしているのですか？'
  - '`npm init -y`は何のために必要なのですか？'
  - '`npm install --save-dev typescript`の`--save-dev`は何を意味するのですか？'
  - Node.jsがインストールされていない場合はどうすれば良いですか？
  - '`npx`とは何ですか？`npm`とは違うのですか？'
---

### プロジェクトの作成とTypeScriptのインストール

今回はローカル環境にTypeScriptをインストールする方法を採用します。適当なディレクトリを作成し、ターミナルで以下のコマンドを実行してください。

※あらかじめ [Node.js](https://nodejs.org/) がインストールされていることを前提とします。

```bash
# プロジェクトフォルダの作成と移動
mkdir ts-tutorial
cd ts-tutorial

# package.jsonの初期化
npm init -y

# TypeScriptのインストール（開発用依存関係として）
npm install --save-dev typescript
```

インストールが完了したら、バージョンを確認してみましょう。

```bash
npx tsc --version
# Output: Version 5.x.x (バージョンは時期によります)
```
