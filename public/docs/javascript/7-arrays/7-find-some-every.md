---
id: javascript-arrays-7-find-some-every
title: その他の便利なメソッド：find, some, every
level: 2
---

## その他の便利なメソッド：find, some, every

特定の要素を探したり、条件チェックを行ったりする場合に特化したメソッドです。これらもコールバック関数を受け取ります。

  * **`find`**: 最初に見つかった要素自体を返す（見つからなければ `undefined`）。
  * **`findIndex`**: 最初に見つかった要素のインデックスを返す（見つからなければ `-1`）。
  * **`some`**: 条件を満たす要素が**一つでもあれば** `true` を返す。
  * **`every`**: **すべての要素**が条件を満たせば `true` を返す。

```js-repl:5
> const scores = [85, 92, 45, 78, 90];
undefined

> // 最初の合格者（80点以上）を探す
> const starStudent = scores.find(score => score >= 90);
undefined
> starStudent
92

> // 赤点（50点未満）があるか？ (some)
> const hasFailure = scores.some(score => score < 50);
undefined
> hasFailure
true

> // 全員が合格（40点以上）か？ (every)
> const allPassed = scores.every(score => score >= 40);
undefined
> allPassed
true
```
