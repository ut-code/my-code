---
id: javascript-intro-run-source
title: ソースファイルからの実行
level: 3
question:
  - ソースファイルとは何ですか？
  - constとは何ですか？
  - テンプレートリテラル（バッククォート）は何のために使うのですか？
  - ターミナルでファイルのあるディレクトリに移動するにはどうすればよいですか？
---

### ソースファイルからの実行

本格的なプログラムはファイルに記述します。

まず、以下の内容で `hello.js` というファイルを作成してください。

```js:hello.js
// 変数定義 (後述しますが、現代ではconstを使います)
const greeting = "Hello, World!";
const target = "Node.js";

// テンプレートリテラル (バッククォート ` を使用)
console.log(`${greeting} I am running on ${target}.`);
```

ターミナルでファイルのあるディレクトリに移動し、`node` コマンドで実行します。
このウェブサイト上の実行環境で動かす場合は、以下の実行ボタンをクリックしてください。

```js-exec:hello.js
Hello, World! I am running on Node.js.
```
