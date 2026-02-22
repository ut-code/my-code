---
id: typescript-generics-2-generics
title: Genericsインターフェース
level: 2
---

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
