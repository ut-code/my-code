---
id: typescript-async-utilities-5-partialt
title: '1. Partial<T>: 全てをオプショナルにする'
level: 3
---

### 1\. Partial\<T\>: 全てをオプショナルにする

`Partial<T>` は、型 `T` のすべてのプロパティを「必須」から「任意（Optional / `?`付き）」に変更します。データの更新処理（パッチ）などで、一部のフィールドだけ送信したい場合に便利です。

```ts:utility-partial.ts
interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
}

// プロパティの一部だけを更新する関数
// updateDataは { name?: string; price?: number; ... } のようになります
function updateProduct(id: number, updateData: Partial<Product>) {
  console.log(`Updating product ${id} with:`, updateData);
}

// nameとpriceだけ更新（descriptionやidがなくてもエラーにならない）
updateProduct(100, {
  name: "New Product Name",
  price: 5000
});
```

```ts-exec:utility-partial.ts
Updating product 100 with: { name: 'New Product Name', price: 5000 }
```
```js-readonly:utility-partial.js
```
