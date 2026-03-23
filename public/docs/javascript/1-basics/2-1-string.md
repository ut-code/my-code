---
id: javascript-basics-string
title: 文字列（String）
level: 3
question:
  - シングルクォートとダブルクォートで文字列を囲むことの違いは何ですか？
  - テンプレートリテラルは、どんな場面で使うと便利ですか？
  - テンプレートリテラルの `${}` の中に計算式を書けますか？
---

### 文字列（String）

JavaScriptの文字列は、シングルクォート (`'`) またはダブルクォート (`"`) で作成します。

また、バッククォート (`` ` ``) で囲む**テンプレートリテラル**を使うと、変数や式を文字列に埋め込めます。文字列の連結（`+`）より読みやすくなることが多いため、こちらを使うのが一般的です。

```js-repl
> const name = "Ada";
undefined
> const language = 'JavaScript';
undefined
> // + で連結
> "Hello, " + name + "!"
'Hello, Ada!'
> // テンプレートリテラルで埋め込み
> `Hello, ${name}!`
'Hello, Ada!'
> // 式も埋め込める
> `${language}は${10 + 5}日で入門できます`
'JavaScriptは15日で入門できます'
```
