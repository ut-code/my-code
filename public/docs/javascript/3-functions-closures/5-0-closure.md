---
id: javascript-closures
title: クロージャ：関数が状態を持つ仕組み
level: 2
question:
  - クロージャはなぜ「最重要トピック」とされているのですか？
  - 外側の関数の実行が終了しても、そのスコープにある変数を参照し続けられるのはなぜですか？
  - 「カプセル化」とはどういう意味で、なぜクロージャがそれに役立つのでしょうか？
  - '`counterA` と `counterB` がそれぞれ独立した状態を持っているのはなぜですか？'
---

## クロージャ：関数が状態を持つ仕組み

クロージャ (Closure) は、この章の最重要トピックです。
一言で言えば、**「外側の関数のスコープにある変数を、外側の関数の実行終了後も参照し続ける関数」**のことです。

**なぜクロージャを使うのか？**

1.  **カプセル化 (Encapsulation):** 変数を隠蔽し、特定の関数経由でしか変更できないようにすることで、予期せぬバグを防ぎます。
2.  **状態の保持:** グローバル変数を使わずに、関数単位で永続的な状態を持てます。
3.  **関数ファクトリ:** 設定の異なる関数を動的に生成する場合に役立ちます。

プライベートな変数を持つカウンタを作ってみましょう。

通常、関数(`createCounter`)の実行が終わると、そのローカル変数(`count`)はメモリから破棄されます。しかし、その変数を参照している内部関数(`increment`)が存在し、その内部関数が外部に返された場合、変数は破棄されずに保持され続けます。

```js:closure_counter.js
const createCounter = () => {
  let count = 0; // この変数は外部から直接アクセスできない（プライベート変数的な役割）

  return () => {
    count++;
    console.log(`Current count: ${count}`);
  };
};

const counterA = createCounter(); // counterA専用のスコープ（環境）が作られる
const counterB = createCounter(); // counterB専用のスコープが別に作られる

counterA(); // 1
counterA(); // 2
counterA(); // 3

console.log("--- switching to B ---");

counterB(); // 1 (Aの状態とは独立している)
```

```js-exec:closure_counter.js
Current count: 1
Current count: 2
Current count: 3
--- switching to B ---
Current count: 1
```
