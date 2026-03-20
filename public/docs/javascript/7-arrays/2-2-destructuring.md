---
id: javascript-arrays-destructuring
title: デストラクチャリング（分割代入）
level: 3
question:
  - デストラクチャリングの const [first, second] = users; の [] は配列リテラルと同じ意味ですか？
  - const [, , third] = users; のようにカンマで要素をスキップする書き方は、どのような時に役立ちますか？
  - '[a, b] = [b, a]; のように書くだけで変数の値を入れ替えられるのはなぜですか？'
---

### デストラクチャリング（分割代入）

配列から要素を取り出して変数に代入する操作を簡潔に書くことができます。

```js-repl
> const users = ['Alice', 'Bob', 'Charlie'];
undefined
> // 1つ目と2つ目の要素を変数に代入
> const [first, second] = users;
undefined
> first
'Alice'
> second
'Bob'

> // 3つ目だけを取り出す（最初の2つはスキップ）
> const [, , third] = users;
undefined
> third
'Charlie'

> // 変数の値を入れ替える（スワップ）テクニック
> let a = 1;
> let b = 2;
> [a, b] = [b, a];
[ 2, 1 ]
> a
2
```
