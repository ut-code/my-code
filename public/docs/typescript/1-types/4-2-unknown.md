---
id: typescript-types-unknown
title: 'unknown: 安全な「正体不明」'
level: 3
question:
  - '`any`の代わりに`unknown`を使うべきだとありますが、両者の具体的な違いは何ですか？'
  - 「型の絞り込み」とは具体的にどういうことですか？
  - '`unknown`型の変数からプロパティにアクセスできないのはなぜですか？'
---

### `unknown`: 安全な「正体不明」

「何が入ってくるかわからない」場合（例：外部APIのレスポンスなど）は、`any`の代わりに`unknown`を使います。`unknown`型の変数は、**「型の絞り込み（Type Narrowing）」を行わない限り、プロパティへのアクセスやメソッドの呼び出しができません**。

```ts:unknown_type.ts
let uncertainValue: unknown = "I am actually a string";

// uncertainValue.toUpperCase(); // エラー: Object is of type 'unknown'.

// 型チェック（絞り込み）を行うと使用可能になる
if (typeof uncertainValue === "string") {
    console.log(uncertainValue.toUpperCase());
}

```

```ts-exec:unknown_type.ts
I AM ACTUALLY A STRING
```
```js-readonly:unknown_type.js
```
