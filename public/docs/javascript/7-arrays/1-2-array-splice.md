---
id: javascript-arrays-array-splice
title: '破壊的な操作: splice'
level: 3
question:
  - 「破壊的な操作」とは具体的にどのような意味ですか？
  - splice(1, 2, 99, 100) のそれぞれの引数は何を表しているのですか？
  - splice メソッドが [2, 3] という配列を返していますが、これは何を意味しますか？
---

### 破壊的な操作: `splice`

`splice`は要素の削除、置換、挿入をすべて行える強力なメソッドですが、**元の配列を変更（破壊）する**点に注意が必要です。

```js-repl
> const numbers = [1, 2, 3, 4, 5];
undefined
> // インデックス1から、2つの要素を削除し、そこに99, 100を挿入
> numbers.splice(1, 2, 99, 100);
[ 2, 3 ]
> numbers
[ 1, 99, 100, 4, 5 ]
```
