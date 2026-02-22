---
id: javascript-intro-4-repl-read-eval-print
title: REPL (Read-Eval-Print Loop) での実行
level: 3
---

### REPL (Read-Eval-Print Loop) での実行

ちょっとした動作確認にはREPLが便利です。Node.jsのREPLを起動するには、ターミナルで `node` と入力して起動します。

このウェブサイトではドキュメント内にJavaScriptの実行環境を埋め込んでおり、以下のように緑枠で囲われたコード例には自由にJavaScriptコードを書いて試すことができます。ただしNode.jsとは環境が異なり、Node.js特有の機能は使用できません。

```js-repl:1
> console.log("Hello, World from REPL!");
Hello, World from REPL!
undefined
> 1 + 2
3
```

※ `undefined` は `console.log` 関数の戻り値が表示されています。
