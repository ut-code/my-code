---
id: typescript-function-types-6-this
title: this の型指定
level: 3
---

### `this` の型指定

JavaScriptにおいて `this` の挙動は複雑ですが、TypeScriptでは `this` が何を指すかを明示的に型定義できます。
これを行うには、関数の**最初の引数**として `this` という名前の「偽の引数」を定義します。これはコンパイル後のJavaScriptには出力されません。

```ts:this_context.ts
interface User {
  name: string;
  count: number;
}

function counter(this: User) {
  this.count += 1;
  console.log(`${this.name}: ${this.count}`);
}

const userA: User = { name: "Alice", count: 0 };

// callメソッドを使ってthisコンテキストを指定して実行
counter.call(userA);
counter.call(userA);

// アロー関数はthisを持たないため、この構文は使いません
```

```ts-exec:this_context.ts
Alice: 1
Alice: 2
```
```js-readonly:this_context.js
```
