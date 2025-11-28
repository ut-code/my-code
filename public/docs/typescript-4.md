# 第4章: 関数の型定義

JavaScript開発者にとって、関数はロジックの中心的な構成要素です。JavaScriptでは引数の数や型が柔軟（あるいはルーズ）ですが、TypeScriptではここを厳密に管理することで、実行時エラーの大半を防ぐことができます。

この章では、TypeScriptにおける関数の型定義の基本から、モダンなJavaScript開発で必須となるアロー関数、そして高度なオーバーロードまでを学習します。

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

## オプショナル引数とデフォルト引数

JavaScriptでは引数を省略すると `undefined` になりますが、TypeScriptでは定義された引数は**必須**とみなされます。引数を省略可能にするには、特別な構文が必要です。

### オプショナル引数 (`?`)

引数名の後ろに `?` を付けることで、その引数を省略可能（オプショナル）にできます。省略された場合の値は `undefined` です。

> **注意:** オプショナル引数は、必ず必須引数の**後ろ**に配置する必要があります。

### デフォルト引数 (`=`)

ES6（JavaScript）と同様に、引数にデフォルト値を指定できます。デフォルト値がある場合、TypeScriptはその引数を「型推論」し、かつ「省略可能」として扱います。

```ts:optional_default.ts
// titleは省略可能
function greet(name: string, title?: string): string {
  if (title) {
    return `Hello, ${title} ${name}!`;
  }
  return `Hello, ${name}!`;
}

// powerのデフォルト値は2
// 戻り値の型はnumberと推論されるため省略可能
function exponent(base: number, power: number = 2) {
  return base ** power;
}

console.log(greet("Tanaka"));
console.log(greet("Sato", "Dr."));
console.log(`2^2 = ${exponent(2)}`);
console.log(`2^3 = ${exponent(2, 3)}`);
```

```ts-exec:optional_default.ts
Hello, Tanaka!
Hello, Dr. Sato!
2^2 = 4
2^3 = 8
```
```js-readonly:optional_default.js
```

## アロー関数と `this`

### アロー関数の型定義

アロー関数を変数に代入する場合、引数と戻り値の記述場所は通常の関数と同様です。

```ts:arrow_func.ts
const multiply = (x: number, y: number): number => {
  return x * y;
};

// 1行で書く場合（暗黙のreturn）
const subtract = (x: number, y: number): number => x - y;

console.log(multiply(4, 5));
console.log(subtract(10, 3));
```

```ts-exec:arrow_func.ts
20
7
```
```js-readonly:arrow_func.js
```

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

## 関数のオーバーロード

JavaScriptでは「引数の型や数によって挙動が変わる関数」をよく書きます。TypeScriptでこれを表現するには**オーバーロード**を使用します。

オーバーロードは以下の2つの部分で構成されます：

1.  **オーバーロードシグネチャ**: 関数の呼び出しパターンを定義（複数可）。実装は書きません。
2.  **実装シグネチャ**: 実際の関数の処理。外部からは直接見えません。

```ts:overload.ts
// 1. オーバーロードシグネチャ（呼び出し可能なパターン）
function double(value: number): number;
function double(value: string): string;

// 2. 実装シグネチャ（すべてのパターンを網羅できる型定義にする）
function double(value: number | string): number | string {
  if (typeof value === 'number') {
    return value * 2;
  } else {
    return value.repeat(2);
  }
}

const numResult = double(10);      // 型は number として推論される
const strResult = double("Hi");    // 型は string として推論される

console.log(numResult);
console.log(strResult);

// double(true); // エラー: booleanを受け入れるオーバーロードはありません
```

```ts-exec:overload.ts
20
HiHi
```
```js-readonly:overload.js
```


> **ポイント:** 実装シグネチャ（`number | string` の部分）は直接呼び出せません。必ず上で定義したシグネチャ（`number` または `string`）に一致する必要があります。

## 残余引数 (Rest Parameters)

引数の数が可変である場合（可変長引数）、JavaScriptと同様に `...args` 構文を使用します。
TypeScriptでは、この `args` は必ず**配列の型**である必要があります。

```ts:rest_params.ts
// 数値を好きなだけ受け取り、合計を返す
function sumAll(...numbers: number[]): number {
  return numbers.reduce((total, num) => total + num, 0);
}

// 文字列を結合する
function joinStrings(separator: string, ...words: string[]): string {
  return words.join(separator);
}

console.log(sumAll(1, 2, 3, 4, 5));
console.log(joinStrings("-", "TypeScript", "is", "fun"));
```

```ts-exec:rest_params.ts
15
TypeScript-is-fun
```
```js-readonly:rest_params.js
```

## 関数の型エイリアス

コールバック関数を引数に取る場合など、関数の型定義が長くなりがちです。
第3章で学んだ `type`（型エイリアス）を使って、関数のシグネチャそのものに名前を付けることができます。

構文: `type 型名 = (引数: 型) => 戻り値の型;`

```ts:func_alias.ts
// 関数の型定義を作成
type MathOperation = (x: number, y: number) => number;

// 作成した型を適用
const addition: MathOperation = (a, b) => a + b;
const multiplication: MathOperation = (a, b) => a * b;

// 高階関数での利用例（関数を受け取る関数）
function compute(x: number, y: number, op: MathOperation): number {
  return op(x, y);
}

console.log(compute(10, 2, addition));
console.log(compute(10, 2, multiplication));
```

```ts-exec:func_alias.ts
12
20
```
```js-readonly:func_alias.js
```


## この章のまとめ

  * 関数定義では、引数と戻り値に型を明記するのが基本です。
  * `?` でオプショナル引数、`=` でデフォルト引数を定義できます。
  * アロー関数や `this` の型付けもサポートされており、コンテキストミスを防げます。
  * **オーバーロード**を使うことで、引数によって戻り値の型が変わる柔軟な関数を定義できます。
  * **型エイリアス**を使うことで、複雑な関数シグネチャを再利用可能なパーツとして定義できます。

### 練習問題 1: ユーザー検索関数

以下の要件を満たす `findUser` 関数をアロー関数として作成してください。

1.  引数 `id` (number) と `name` (string) を受け取る。
2.  `name` はオプショナル引数とする。
3.  戻り値は「検索中: [id] [name]」という文字列（nameがない場合は「検索中: [id] ゲスト」）とする。
4.  関数の型定義（Type Alias）を `SearchFunc` として先に定義し、それを適用すること。

```ts:practice4_1.ts
```
```ts-exec:practice4_1.ts
```
```js-readonly:practice4_1.js
```

### 練習問題 2: データ変換のオーバーロード

以下の要件を満たす `convert` 関数を `function` キーワードで作成してください。

1.  引数が `number` の場合、それを `string` に変換して返す（例: `100` -\> `"100"`）。
2.  引数が `string` の場合、それを `number` に変換して返す（例: `"100"` -\> `100`）。
3.  適切なオーバーロードシグネチャを2つ定義すること。

```ts:practice4_2.ts
```
```ts-exec:practice4_2.ts
```
```js-readonly:practice4_2.js
```