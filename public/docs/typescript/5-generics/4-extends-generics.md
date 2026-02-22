---
id: typescript-generics-4-extends-generics
title: '型制約 (extends): Generics型に制約を設ける'
level: 2
---

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
