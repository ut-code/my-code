# 第6章: ジェネリクス (Generics)

第6章では、TypeScriptを使いこなす上で非常に強力な機能である**ジェネリクス (Generics)** について学びます。JavaやC\#などの言語経験がある方には馴染み深い概念かもしれませんが、JavaScriptの世界から来た方にとっては少し抽象的に感じるかもしれません。しかし、これを理解することで、**「柔軟性」と「安全性」を両立したコード**が書けるようになります。

## Genericsの必要性: 型を引数のように扱う

プログラミングをしていると、「処理内容は同じだが、扱うデータの型だけが違う」という場面によく遭遇します。

例えば、「引数をそのまま返す関数」を考えてみましょう。

```ts
// 数値を受け取って数値を返す
function returnNumber(arg: number): number {
  return arg;
}

// 文字列を受け取って文字列を返す
function returnString(arg: string): string {
  return arg;
}

// どんな型でも受け取れるが、戻り値の型情報が失われる（any）
function returnAny(arg: any): any {
  return arg;
}
```

`returnNumber` と `returnString` はロジックが完全に重複しています。一方、`returnAny` は重複を防げますが、TypeScriptの利点である型チェックが無効になってしまいます。

ここで登場するのが **ジェネリクス** です。ジェネリクスを使うと、**「型そのもの」を引数のように受け取る**ことができます。

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

## Genericsインターフェース

関数だけでなく、インターフェースもジェネリクスにできます。これにより、再利用性の高いデータ構造を定義できます。
例えば、「何かを入れる箱 (Box)」のような汎用的な型を作る場合に便利です。

```ts:generic_box.ts
// T型の値を持つ value プロパティがあるインターフェース
interface Box<T> {
  value: T;
}

// 文字列を入れる箱
const stringBox: Box<string> = {
  value: "TypeScript"
};

// 数値を入れる箱
const numberBox: Box<number> = {
  value: 42
};

console.log(stringBox.value.toUpperCase()); // 文字列のメソッドが使える
console.log(numberBox.value.toFixed(1));    // 数値のメソッドが使える
```

```ts-exec:generic_box.ts
TYPESCRIPT
42.0
```
```js-readonly:generic_box.js
```

JavaScriptでは特に意識せずオブジェクトに様々な型の値を入れていましたが、TypeScriptではこのようにジェネリクスを使うことで、「中身が何かわからない」状態を防ぎつつ、どんな型でも許容する構造を作れます。

## Genericsクラス

クラスでも同様にジェネリクスを使用できます。リストやキュー、スタックなどのデータ構造を実装する際によく使われます。

ここではシンプルな「スタック（後入れ先出し）」クラスを作ってみましょう。

```ts:simple_stack.ts
class SimpleStack<T> {
  private items: T[] = [];

  // データを追加する
  push(item: T): void {
    this.items.push(item);
  }

  // データを取り出す
  pop(): T | undefined {
    return this.items.pop();
  }

  // 現在の中身を表示（デバッグ用）
  print(): void {
    console.log(this.items);
  }
}

// 数値専用のスタック
const numberStack = new SimpleStack<number>();
numberStack.push(10);
numberStack.push(20);
// numberStack.push("30"); // エラー: number以外は入れられない
console.log("Pop:", numberStack.pop());

// 文字列専用のスタック
const stringStack = new SimpleStack<string>();
stringStack.push("A");
stringStack.push("B");
stringStack.print();
```

```ts-exec:simple_stack.ts
Pop: 20
[ 'A', 'B' ]
```
```js-readonly:simple_stack.js
```

もしジェネリクスを使わずにこれを実装しようとすると、`NumberStack`クラスと`StringStack`クラスを個別に作るか、`any`を使って安全性を犠牲にするしかありません。ジェネリクスを使えば、1つのクラス定義で安全に様々な型に対応できます。

## 型制約 (extends): Generics型に制約を設ける

ジェネリクスは「どんな型でも受け入れられる」のが基本ですが、時には「ある特定の条件を満たす型だけを受け入れたい」という場合があります。

例えば、引数の `.length` プロパティにアクセスしたい場合を考えてみましょう。

```ts:without_constraints.ts
function logLength<T>(arg: T): void {
  console.log(arg.length); // エラー！ Tがlengthを持っているとは限らない
}
```
```ts-exec:without_constraints.ts
without_constraints.ts:2:19 - error TS2339: Property 'length' does not exist on type 'T'.

2   console.log(arg.length); // エラー！ Tがlengthを持っているとは限らない
                    ~~~~~~
```
```js-readonly:without_constraints.js
```

すべての型が `length` を持っているわけではない（例: `number`型にはない）ため、TypeScriptはエラーを出します。
これを解決するために、`extends` キーワードを使って **「T は少なくともこの型を継承（適合）していなければならない」** という制約（Constraint）を設けます。

```ts:constraints.ts
// lengthプロパティを持つ型を定義
interface Lengthy {
  length: number;
}

// T は Lengthy インターフェースを満たす型でなければならない
function logLength<T extends Lengthy>(arg: T): void {
  console.log(`値: ${JSON.stringify(arg)}, 長さ: ${arg.length}`);
}

// 配列は length を持つのでOK
logLength([1, 2, 3]);

// 文字列も length を持つのでOK
logLength("Hello");

// オブジェクトも length プロパティがあればOK
logLength({ length: 10, value: "something" });

// 数値は length を持たないのでエラーになる
// logLength(100); 
```

```ts-exec:constraints.ts
値: [1,2,3], 長さ: 3
値: "Hello", 長さ: 5
値: {"length":10,"value":"something"}, 長さ: 10
```
```js-readonly:constraints.js
```

このように `extends` を使うことで、ジェネリクスの柔軟性を保ちつつ、関数内で安全に特定のプロパティやメソッドを利用することができます。

## この章のまとめ

  * **ジェネリクス (Generics)** は、型を引数のように扱い、コードの再利用性と型安全性を両立させる機能です。
  * **`<T>`** のように型変数を宣言して使用します。
  * **関数、インターフェース、クラス** などで利用可能です。
  * **`extends`** キーワードを使用することで、受け入れる型に制約（「最低限このプロパティを持っていること」など）を与えることができます。

ジェネリクスを理解すると、ライブラリの型定義ファイル（`.d.ts`）も読みやすくなり、TypeScriptでの開発力が一気に向上します。

### 練習問題 1: ペアを作成する関数

2つの引数を受け取り、それらを配列（タプル）にして返すジェネリクス関数 `createPair` を作成してください。
第1引数と第2引数は異なる型でも構いません。

**要件:**

  * 型引数を2つ（例: `T`, `U`）使用すること。
  * 戻り値の型は `[T, U]` となること。

```ts:practice6_1.ts
// ここに関数を定義してください
function createPair<T, U>(first: T, second: U): [T, U] {
    // 実装
    return [first, second];
}

// 実行例
const pair1 = createPair("score", 100);
console.log(pair1); // ["score", 100]

const pair2 = createPair(true, "valid");
console.log(pair2); // [true, "valid"]
```
```ts-exec:practice6_1.ts
```
```js-readonly:practice6_1.js
```

### 練習問題 2: 制約付きジェネリクス

`id` プロパティ（型は `number` または `string`）を持つオブジェクトのみを受け取り、その `id` を表示する関数 `showId` を作成してください。

**要件:**

  * `extends` を使用して型パラメータに制約をかけること。
  * `id` プロパティを持たないオブジェクトを渡すとコンパイルエラーになること。

```ts:practice6_2.ts
// 制約用のインターフェース
interface HasId {
    id: number | string;
}

// ここに関数を定義してください
function showId<T extends HasId>(item: T): void {
    console.log(`ID is: ${item.id}`);
}

// 実行例
showId({ id: 1, name: "UserA" });        // OK
showId({ id: "abc-123", active: true }); // OK

// 以下のコードはエラーになるはずです
// showId({ name: "NoIdUser" });
```
```ts-exec:practice6_2.ts
```
```js-readonly:practice6_2.js
```
