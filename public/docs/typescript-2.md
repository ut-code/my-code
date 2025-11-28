# 第2章: 基本的な型と型推論

JavaScriptでの開発経験がある皆様、TypeScriptの世界へようこそ。
第1章では環境構築を行いましたが、本章からいよいよ具体的なコードを書いていきます。

TypeScriptの最大の武器は**「型（Type）」**です。しかし、すべてのコードに手動で型を書く必要はありません。TypeScriptは非常に賢い「型推論」という機能を持っており、JavaScriptを書く感覚のまま、安全性を享受できる場面も多々あります。

この章では、基礎となるプリミティブ型、TypeScriptならではの配列やタプルの扱い、そして「何でもあり」な状態をどう制御するかについて学びます。

## 2.1 型注釈の構文 (Type Annotations)

変数を宣言する際、その変数がどのような種類のデータを扱うかを明示することを「型注釈（Type Annotation）」と呼びます。
構文は非常にシンプルで、変数名の後ろに `: 型名` を記述します。

```ts:annotation.ts
// 文字列型の変数を宣言
let message: string = "Hello, TypeScript!";

// 数値型の定数を宣言
const userId: number = 1001;

// コンソールに出力
console.log(message);
console.log(`User ID: ${userId}`);

// エラーになる例（コメントアウトを外すとエディタ上で赤線が出ます）
// message = 123; // Error: Type 'number' is not assignable to type 'string'.
```

```ts-exec:annotation.ts
Hello, TypeScript!
User ID: 1001
```
```js-readonly:annotation.js
```

> **ポイント:** JavaScriptでは変数にどんな値でも再代入できましたが、TypeScriptでは宣言された型と異なる値を代入しようとすると、コンパイルエラー（またはエディタ上の警告）が発生します。これがバグを未然に防ぐ第一の砦です。

## 2.2 主要なプリミティブ型

JavaScriptでおなじみのプリミティブ型は、TypeScriptでもそのまま使用できます。

  * **string**: 文字列 (`"hello"`, `'world'`, \`template\`)
  * **number**: 数値 (整数、浮動小数点数、`NaN`, `Infinity` すべて含む)
  * **boolean**: 真偽値 (`true`, `false`)

注意点として、`Number`や`String`（大文字始まり）はラッパーオブジェクト型を指すため、通常は**小文字**の`number`, `string`を使用してください。

```ts:primitives.ts
let isDone: boolean = false;
let decimal: number = 6;
let hex: number = 0xf00d;
let color: string = "blue";

// テンプレートリテラルもstring型として扱われます
let summary: string = `Color is ${color} and Hex is ${hex}`;

console.log("Is Done:", isDone);
console.log(summary);
```

```ts-exec:primitives.ts
Is Done: false
Color is blue and Hex is 61453
```
```js-readonly:primitives.js
```

## 2.3 型推論 (Type Inference)

ここがJavaScript経験者にとって嬉しいポイントです。
変数の初期化と同時に値を代入する場合、**型注釈を省略してもTypeScriptが自動的に型を判別**してくれます。これを「型推論」と呼びます。

```ts:inference.ts
// 型注釈がないが、"TypeScript"という文字列から string型 と推論される
let techName = "TypeScript"; 

// 数値が入っているため、count は number型 と推論される
let count = 42;

console.log(`Technology: ${techName}, Count: ${count}`);

// 推論された型と違う値を入れようとするとエラーになる
// count = "Forty-Two"; // Error!
```

```ts-exec:inference.ts
Technology: TypeScript, Count: 42
```
```js-readonly:inference.js
```

> **ベストプラクティス:** 初期値がある場合、わざわざ `: string` などを書く必要はありません。コードが冗長になるのを防ぐため、明示的な型注釈は「初期値がない場合」や「推論される型とは別の型として扱いたい場合」に使用するのが一般的です。

## 2.4 特殊な型: any, unknown, never

TypeScriptには「特定のデータ型」ではない特殊な型が存在します。これらは安全性に大きく関わるため、違いを理解することが重要です。

### any: 危険な「何でもあり」

`any` 型は、型チェックを無効にする型です。JavaScriptと同じ挙動になりますが、TypeScriptを使うメリットが失われるため、**可能な限り使用を避けてください**。

### unknown: 安全な「正体不明」

「何が入ってくるかわからない」場合（例：外部APIのレスポンスなど）は、`any`の代わりに`unknown`を使います。`unknown`型の変数は、**「型の絞り込み（Type Narrowing）」を行わない限り、プロパティへのアクセスやメソッドの呼び出しができません**。

### never: 決して発生しない

`never` は「値を持たない」ことを意味します。常に例外を投げる関数や、無限ループなど「終了しない関数」の戻り値として使われます。

```ts:special_types.ts
// --- any の例 ---
let looseVariable: any = 4;
looseVariable = "Maybe a string instead";
looseVariable = false; // エラーにならない（危険！）
console.log("Any:", looseVariable);

// --- unknown の例 ---
let uncertainValue: unknown = "I am actually a string";

// uncertainValue.toUpperCase(); // エラー: Object is of type 'unknown'.

// 型チェック（絞り込み）を行うと使用可能になる
if (typeof uncertainValue === "string") {
    console.log("Unknown (checked):", uncertainValue.toUpperCase());
}

// --- never の例 ---
function throwError(message: string): never {
    throw new Error(message);
}

try {
    // この関数は決して正常に戻らない
    throwError("Something went wrong");
} catch (e) {
    console.log("Error caught");
}
```

```ts-exec:special_types.ts
Any: false
Unknown (checked): I AM ACTUALLY A STRING
Error caught
```
```js-readonly:special_types.js
```

## 2.5 配列とタプル

データの集合を扱う方法を見ていきましょう。

### 配列 (Array)

配列の型定義には2通りの書き方があります。

1.  `型[]` （推奨：シンプル）
2.  `Array<型>` （ジェネリクス記法）

### タプル (Tuple)

配列に似ていますが、**「要素の数が固定」**で、**「各要素の型が決まっている」**ものをタプルと呼びます。CSVの1行や、座標`(x, y)`などを表現するのに便利です。

```ts:arrays_tuples.ts
// --- 配列 ---
// 数値の配列
let fibonacci: number[] = [1, 1, 2, 3, 5];

// 文字列の配列（Array<T>記法）
let frameworkList: Array<string> = ["React", "Vue", "Angular"];

// --- タプル ---
// [名前, 年齢, 有効フラグ] の順序と型を守る必要がある
let userTuple: [string, number, boolean];

userTuple = ["Alice", 30, true];
// userTuple = [30, "Alice", true]; // エラー: 型の順序が違う

console.log("First Framework:", frameworkList[0]);
console.log(`User: ${userTuple[0]}, Age: ${userTuple[1]}`);

// fibonacci.push("8"); // エラー: number[] に string は追加できない
fibonacci.push(8); // OK
console.log("Next Fib:", fibonacci[fibonacci.length - 1]);
```

```ts-exec:arrays_tuples.ts
First Framework: React
User: Alice, Age: 30
Next Fib: 8
```
```js-readonly:arrays_tuples.js
```

## この章のまとめ

  * 変数宣言時に `: 型名` で型注釈をつけることができる。
  * 初期値がある場合、TypeScriptは自動的に型を推測する（**型推論**）。
  * プリミティブ型は `string`, `number`, `boolean` を小文字で使う。
  * `any` は型チェックを無効にするため避け、不明な値には `unknown` を使う。
  * **配列**は同じ型の集まり、**タプル**は位置と型が固定された配列である。

次回は、より複雑なデータ構造を扱うための「オブジェクト、インターフェース、型エイリアス」について学びます。

### 練習問題 1: タプルと配列の操作

1.  「商品名(string)」と「価格(number)」を持つ**タプル**型の変数 `product` を定義し、`["Keyboard", 5000]` を代入してください。
2.  文字列の**配列** `tags` を定義し、型推論を使って `["IT", "Gadget"]` で初期化してください。
3.  `tags` に新しいタグ `"Sale"` を追加してください。
4.  それぞれの値をコンソールに出力してください。

```ts:practice2_1.ts
```
```ts-exec:practice2_1.ts
```
```js-readonly:practice2_1.js
```

### 練習問題 2: unknown型の安全な利用

1.  `unknown` 型の引数 `input` を受け取る関数 `printLength` を作成してください。
2.  関数内で、`input` が `string` 型である場合のみ、その文字列の長さをコンソールに出力してください（`input.length`）。
3.  `input` が `string` 以外の場合は、「Not a string」と出力してください。
4.  この関数に 文字列 `"TypeScript"` と 数値 `100` を渡して実行してください。

```ts:practice2_2.ts
```
```ts-exec:practice2_2.ts
```
```js-readonly:practice2_2.js
```
