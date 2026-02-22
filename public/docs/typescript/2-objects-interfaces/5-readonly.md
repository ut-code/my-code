---
id: typescript-objects-interfaces-5-readonly
title: 読み取り専用プロパティ (readonly)
level: 2
---

## 読み取り専用プロパティ (readonly)

オブジェクトのプロパティを初期化した後に変更されたくない場合、`readonly` 修飾子を使用します。これは特に、IDや設定値など、不変であるべきデータを扱う際に有用です。

```ts:readonly-properties.ts
type Product = {
  readonly id: number; // 書き換え不可
  name: string;        // 書き換え可能
  price: number;
};

const item: Product = {
  id: 101,
  name: "Laptop",
  price: 98000
};

item.price = 95000; // OK: 通常のプロパティは変更可能

// 以下の行はコンパイルエラーになります
// item.id = 102; // Error: Cannot assign to 'id' because it is a read-only property.

console.log(item);
```

```ts-exec:readonly-properties.ts
{ id: 101, name: 'Laptop', price: 95000 }
```
```js-readonly:readonly-properties.js
```

注意点として、`readonly` はあくまで TypeScript のコンパイル時のチェックです。実行時の JavaScript コードでは通常のオブジェクトとして振る舞うため、無理やり書き換えるコードが混入すると防げない場合があります（ただし、TSを使っている限りはその前にエラーで気づけます）。
