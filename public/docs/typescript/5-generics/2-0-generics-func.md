---
id: typescript-generics-generics-func
title: Generics関数
level: 2
question:
  - <T>という書き方はどういう文法規則ですか？T以外の文字でも良いのですか？
  - Tがどんな型でも良いなら、結局anyを使うのと何が違うのですか？
  - 「型推論に任せる (推奨)」とありますが、なぜ明示的に型を指定しない方が良いのですか？
  - output1.toFixed(2); がエラーになる理由を詳しく教えてください。
  - >-
    console.logの「引数の型:
    string」というのは、TypeScriptの型とJavaScriptの実行時のtypeofがどのように対応しているのですか？
---

## Generics関数

ジェネリクスを使った関数の定義を見てみましょう。
型変数は慣習として `T` (Typeの頭文字) がよく使われます。

```ts:identity_func.ts
// <T> は「この関数内で T という名前の型変数を使います」という宣言
function identity<T>(arg: T): T {
  console.log(`引数の型: ${typeof arg}, 値: ${arg}`);
  return arg;
}

// 使用例1: 明示的に型を指定する
const output1 = identity<string>("Hello Generics");

// 使用例2: 型推論に任せる (推奨)
// 引数が数値なので、T は number に自動的に推論される
const output2 = identity(100);

// output1は string型、output2は number型 として扱われるため安全
// output1.toFixed(2); // エラー: string型にtoFixedは存在しない
```

```ts-exec:identity_func.ts
引数の型: string, 値: Hello Generics
引数の型: number, 値: 100
```
```js-readonly:identity_func.js
```

このように、`identity` 関数は定義時点では型を固定せず、**呼び出す瞬間に型が決まる**という柔軟な性質を持ちます。
