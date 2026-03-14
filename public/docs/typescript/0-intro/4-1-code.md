---
id: typescript-intro-code
title: コードの記述
level: 3
question:
  - '`hello.ts`の`.ts`は何を意味するのですか？'
  - '変数名の後ろに付く`: string`は何のために書くのですか？'
  - 数値を渡そうとするとエディタ上でエラーになるとありますが、具体的にどのような表示になるのですか？
---

### コードの記述

エディタで `hello.ts` というファイルを作成し、以下のコードを記述します。
JavaScriptと似ていますが、変数宣言の後ろに `: string` という「型注釈（Type Annotation）」が付いている点に注目してください。

```ts:hello.ts
// 変数messageにstring型（文字列）を指定
const message: string = "Hello, TypeScript World!";

// 数値を渡そうとするとエディタ上でエラーになります（後ほど解説）
console.log(message);
```
