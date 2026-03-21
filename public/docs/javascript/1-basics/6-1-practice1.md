---
id: javascript-basics-practice1
title: '練習問題1: テンプレートリテラルと Null 合体演算子'
level: 3
question:
  - テンプレートリテラルを使って自己紹介文を作る具体的なコード例を見せてもらえますか？
  - 論理和演算子 `||` と Null 合体演算子 `??` は、どちらを使っても良いのですか？違いはありますか？
  - 年齢が null または undefined の場合に「不明」と表示させる部分について、コードのヒントが欲しいです。
---

### 練習問題1: テンプレートリテラルと Null 合体演算子

ユーザーの年齢（数値）と名前（文字列）を受け取り、自己紹介文を作成する関数を作成してください。
ただし、年齢が `null` または `undefined` の場合は「不明」と表示するようにしてください。Null 合体演算子 `??` を活用してみましょう。

```js:practice2_1.js
// 以下の関数を完成させてください
function introduce(name, age) {
    // ここにコードを記述
}

console.log(introduce("Tanaka", 25));
console.log(introduce("Sato", null));
```

```js-exec:practice2_1.js
My name is Tanaka and I am 25 years old.
My name is Sato and I am 不明 years old.
```
