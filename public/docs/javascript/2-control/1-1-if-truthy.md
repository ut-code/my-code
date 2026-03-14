---
id: javascript-control-if-truthy
title: if文とTruthy / Falsy
level: 2
question:
  - Falsyな値は理解できましたが、Truthyな値の具体的な例をもっと教えてください。
  - 空の配列や空のオブジェクトがなぜTruthyなのですか？他のプログラミング言語と違って不思議に感じます。
  - 文字列の"0"や"false"がTruthyになるのはなぜですか？これも直感と違います。
  - BigIntとは何ですか？まだ知らない概念ですが、ここで登場しました。
  - if文の条件式で変数そのものを評価するやり方はどのような時に便利ですか？
---

## `if`文とTruthy / Falsy

基本的な `if` 文の構造はC言語やJavaと同様です。しかし、条件式における評価はJavaScript特有の**Truthy（真と見なされる値）**と**Falsy（偽と見なされる値）**の概念を理解する必要があります。

厳密な `true` / `false` だけでなく、あらゆる値が条件式の中で真偽判定されます。

**Falsyな値（falseとして扱われるもの）:**

  * `false`
  * `0`, `-0`, `0n` (BigInt)
  * `""` (空文字)
  * `null`
  * `undefined`
  * `NaN`

**Truthyな値（trueとして扱われるもの）:**

  * 上記Falsy以外すべて
  * **注意:** 空の配列 `[]` や 空のオブジェクト `{}` は **Truthy** です（Pythonなどの経験者は注意が必要です）。
  * 文字列の `"0"` や `"false"` もTruthyです。

```js-repl
> if (0) { 'True'; } else { 'False'; }
'False'

> if ("") { 'True'; } else { 'False'; }
'False'

> if ([]) { 'True'; } else { 'False'; }  // 空配列は真！
'True'

> const user = { name: "Alice" };
> if (user) { `Hello ${user.name}`; }
'Hello Alice'
```
