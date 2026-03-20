---
id: typescript-function-types-params-return
title: 引数と戻り値の型
level: 2
question:
  - TypeScriptで引数や戻り値に型を付けるのはなぜですか
  - 戻り値の型を省略できる型推論とは具体的にどのような機能ですか
  - 戻り値がない場合のvoid型は、どのような状況で使いますか
  - add関数のエラー例で、なぜ文字列の"5"を渡すとエラーになるのですか
---

## 引数と戻り値の型

TypeScriptの関数定義において最も基本的なルールは、「引数」と「戻り値」に型を付けることです。

  * **引数**: 変数名の後ろに `: 型` を記述します。
  * **戻り値**: 引数リストの閉じ括弧 `)` の後ろに `: 型` を記述します。

戻り値の型は型推論（Chapter 2参照）によって省略可能ですが、関数の意図を明確にするために明示的に書くことが推奨されます。戻り値がない場合は `void` を使用します。

```ts:basic_math.ts
// 基本的な関数宣言
function add(a: number, b: number): number {
  return a + b;
}

// 戻り値がない関数
function logMessage(message: string): void {
  console.log(`LOG: ${message}`);
}

const result = add(10, 5);
logMessage(`Result is ${result}`);

// エラー例（コメントアウトを外すとエラーになります）
// add(10, "5"); // Error: Argument of type 'string' is not assignable to parameter of type 'number'.
```

```ts-exec:basic_math.ts
LOG: Result is 15
```
```js-readonly:basic_math.js
```
