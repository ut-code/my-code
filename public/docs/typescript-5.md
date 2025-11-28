# 第5章: 型を組み合わせる

これまでの章では、`string` や `number`、あるいは特定のオブジェクトの形といった「単一の型」を扱ってきました。しかし、現実のアプリケーション開発（特にJavaScriptの世界）では、「IDは数値かもしれないし、文字列かもしれない」「成功時はデータを返すが、失敗時はエラーメッセージを返す」といった柔軟なデータ構造が頻繁に登場します。

この章では、既存の型をパズルのように組み合わせて、より複雑で柔軟な状況を表現する方法を学びます。

## Union型 (共用体型)

Union型（共用体型）は、**「A または B」**という状態を表現します。パイプ記号 `|` を使用して記述します。

JavaScriptでは変数の型が動的であるため、1つの変数に異なる型の値が入ることがよくありますが、TypeScriptではUnion型を使ってこれを安全に定義できます。

```ts:union-basic.ts
// idは数値、または文字列を許容する
let id: number | string;

id = 101;      // OK
id = "user-a"; // OK
// id = true;  // Error: Type 'boolean' is not assignable to type 'string | number'.

function printId(id: number | string) {
  console.log(`Your ID is: ${id}`);
}

printId(123);
printId("ABC");
```

```ts-exec:union-basic.ts
Your ID is: 123
Your ID is: ABC
```
```js-readonly:union-basic.js
```

> **注意点:** Union型を使用している変数は、その時点では「どの型か確定していない」ため、**すべての候補に共通するプロパティやメソッド**しか操作できません。特定の型として扱いたい場合は、後述する「型ガード」を使用します。

## Literal型 (リテラル型)

`string` や `number` は「あらゆる文字列」や「あらゆる数値」を受け入れますが、**「特定の値だけ」**を許可したい場合があります。これをLiteral型（リテラル型）と呼びます。

通常、Literal型は単独で使うよりも、Union型と組み合わせて**「決まった選択肢のいずれか」**を表現するのによく使われます（Enumの代わりとしてもよく利用されます）。

```ts:literal-types.ts
// 文字列リテラル型とUnion型の組み合わせ
type TrafficLight = 'red' | 'yellow' | 'green';

let currentLight: TrafficLight = 'red';

// currentLight = 'blue'; // Error: Type '"blue"' is not assignable to type 'TrafficLight'.

// 数値リテラルも可能
type DiceRoll = 1 | 2 | 3 | 4 | 5 | 6;
let dice: DiceRoll = 3;

console.log(`Light: ${currentLight}, Dice: ${dice}`);
```

```ts-exec:literal-types.ts
Light: red, Dice: 3
```
```js-readonly:literal-types.js
```

## Intersection型 (交差型)

Intersection型（交差型）は、**「A かつ B」**を表します。アンパサンド `&` を使用します。
これは主にオブジェクトの型定義を合成（マージ）して、**「複数の型のすべてのプロパティを持つ新しい型」**を作る際によく使用されます。

```ts:intersection-types.ts
type Person = {
  name: string;
};

type Employee = {
  employeeId: number;
  department: string;
};

// Person かつ Employee の特徴を持つ型
type CompanyMember = Person & Employee;

const member: CompanyMember = {
  name: "Suzuki",
  employeeId: 5001,
  department: "Engineering"
  // どれか一つでも欠けるとエラーになります
};

console.log(member);
```

```ts-exec:intersection-types.ts
{ name: 'Suzuki', employeeId: 5001, department: 'Engineering' }
```
```js-readonly:intersection-types.js
```

> **補足:** プリミティブ型同士で `string & number` のように交差させると、両方を満たす値は存在しないため、型は `never`（ありえない値）になります。Intersection型は主にオブジェクト型の合成に使われます。

## null と undefined

TypeScriptには `null` 型と `undefined` 型が存在します。
`tsconfig.json` の設定で `strictNullChecks: true`（推奨設定）になっている場合、これらは他の型（stringなど）には代入できません。

値が存在しない可能性がある場合は、Union型を使って明示的に `null` や `undefined` を許可します。

```ts:nullable.ts
// string または null を許容する
let userName: string | null = "Tanaka";

userName = null; // OK

// オプショナルなプロパティ（?）は 「型 | undefined」 の糖衣構文に近い動きをします
type UserConfig = {
  theme: string;
  notification?: boolean; // boolean | undefined
};

const config: UserConfig = {
  theme: "dark"
  // notification は省略可能 (undefined)
};

console.log(`User: ${userName}, Theme: ${config.theme}`);
```

```ts-exec:nullable.ts
User: null, Theme: dark
```
```js-readonly:nullable.js
```

## 型ガード (Type Guards)

Union型 (`string | number`) の変数があるとき、プログラムの中で「今は `string` なのか `number` なのか」を区別して処理を分けたい場合があります。これを**型の絞り込み（Narrowing）**と言います。

TypeScriptのコンパイラが「このブロック内ではこの変数はこの型だ」と認識できるようにするチェック処理を**型ガード**と呼びます。

### typeof 演算子

プリミティブ型（string, number, boolean, symbol, undefined）の判定に使います。

```ts:type-guard-typeof.ts
function formatPrice(price: number | string) {
  // ここでは price は number | string

  if (typeof price === 'string') {
    // このブロック内では price は 'string' 型として扱われる
    return parseInt(price).toLocaleString();
  } else {
    // このブロック内では price は 'number' 型として扱われる
    return price.toLocaleString();
  }
}

console.log(formatPrice(10000));
console.log(formatPrice("20000"));
```

```ts-exec:type-guard-typeof.ts
10,000
20,000
```
```js-readonly:type-guard-typeof.js
```

### in 演算子

オブジェクトが特定のプロパティを持っているかどうかで型を絞り込みます。

```ts:type-guard-in.ts
type Fish = { swim: () => void };
type Bird = { fly: () => void };

function move(animal: Fish | Bird) {
  if ('swim' in animal) {
    // ここでは Fish 型
    animal.swim();
  } else {
    // ここでは Bird 型
    animal.fly();
  }
}

const fish: Fish = { swim: () => console.log("Swimming...") };
move(fish);
```

```ts-exec:type-guard-in.ts
Swimming...
```
```js-readonly:type-guard-in.js
```

### instanceof 演算子

クラスのインスタンスかどうかを判定します（第7章のクラスで詳しく扱いますが、Dateなどの組み込みオブジェクトでも有効です）。

```ts:type-guard-instanceof.ts
function logDate(value: string | Date) {
  if (value instanceof Date) {
    console.log(value.toISOString());
  } else {
    console.log(value);
  }
}
```
```js-readonly:type-guard-instanceof.js
```

## 型アサーション (Type Assertions)

時に、プログラマがTypeScriptコンパイラよりも型の詳細を知っている場合があります。例えば、外部APIからのレスポンスや、DOM要素の取得などです。

`as` キーワードを使うと、コンパイラに対して「この変数はこの型であるとして扱ってくれ」と強制できます。

```ts:assertion.ts
// unknown型は何でも入るが、そのままでは操作できない型
let someValue: unknown = "This is a string";

// コンパイラに「これはstringだからlengthを使わせて」と伝える
let strLength: number = (someValue as string).length;

console.log(strLength);

// 注意: 全く互換性のない型への変換はエラーになりますが、
// unknownを経由すると無理やり変換できてしまうため、乱用は避けてください。
// let wrong = (123 as string); // Error
// let dangerous = (123 as unknown as string); // OKだが実行時にバグの元
```

```ts-exec:assertion.ts
16
```
```js-readonly:assertion.js
```

> **注意:** 型アサーションはあくまで「コンパイル時の型チェックを黙らせる」機能であり、実行時の型変換を行うわけではありません。実行時に値が想定と違う場合、クラッシュの原因になります。可能な限り、型ガードを使って安全に絞り込むことを推奨します。

## この章のまとめ

  * **Union型 (`|`)**: 複数の型のうち「いずれか」を表す。
  * **Literal型**: 特定の値のみを許容する型。Union型と組み合わせて列挙型のように使える。
  * **Intersection型 (`&`)**: 複数の型を「合成」して、すべてのプロパティを持つ型を作る。
  * **null / undefined**: `strictNullChecks` 環境下では、Union型を使って明示的に許容する必要がある。
  * **型ガード**: `typeof`, `in`, `instanceof` などを使って、Union型から特定の型へ絞り込む。
  * **型アサーション (`as`)**: 型を強制的に指定するが、安全性のために使用は慎重に行う。

### 練習問題1: 結果の型定義

APIリクエストの結果を表す `Result` 型を定義してください。

  * 成功時は `success: true` と `data: string` を持ちます。
  * 失敗時は `success: false` と `error: string` を持ちます。
  * `handleResult` 関数内で型ガードを使い、成功ならデータを、失敗ならエラーメッセージをログ出力してください。

```ts:practice5_1.ts
// ここに SuccessResult, FailureResult, Result 型を定義してください
// type Result = ...

function handleResult(result: Result) {
  // ここに処理を実装してください
}

// テスト用
handleResult({ success: true, data: "Data loaded" });
handleResult({ success: false, error: "Network error" });
```
```ts-exec:practice5_1.ts
```
```js-readonly:practice5_1.js
```


### 練習問題2: 図形の面積計算

`Circle` 型と `Square` 型を定義し、それらのUnion型である `Shape` を定義してください。

  * `Circle` は `kind: 'circle'` と `radius: number` を持ちます。
  * `Square` は `kind: 'square'` と `sideLength: number` を持ちます。
  * `getArea` 関数で、渡された図形に応じて面積を計算して返してください（円周率は `Math.PI` を使用）。

```ts:practice5_2.ts
// ここに型を定義

function getArea(shape: Shape): number {
  // ここに実装 (switch文やif文で kind プロパティによる絞り込みを行う)
  return 0;
}

// テスト用
console.log(getArea({ kind: 'circle', radius: 10 }));
console.log(getArea({ kind: 'square', sideLength: 5 }));
```
```ts-exec:practice5_2.ts
```
```js-readonly:practice5_2.js
```
