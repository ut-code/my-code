---
id: typescript-async-utilities-6-readonlyt
title: '2. Readonly<T>: 全てを読み取り専用にする'
level: 3
---

### 2\. Readonly\<T\>: 全てを読み取り専用にする

`Readonly<T>` は、型 `T` のすべてのプロパティを書き換え不可（readonly）にします。関数内でオブジェクトを変更されたくない場合や、ReactのState管理などで役立ちます。

```ts:utility-readonly.ts
interface Product {
  id: number;
  name: string;
  price: number;
}

const originalProduct: Product = { id: 1, name: "Pen", price: 100 };

// 変更不可のオブジェクトとして扱う
const frozenProduct: Readonly<Product> = originalProduct;

// 読み取りはOK
console.log(frozenProduct.name); 

// コンパイルエラー: 値の代入はできません
// frozenProduct.price = 200; 
```

```ts-exec:utility-readonly.ts
Pen
```
```js-readonly:utility-readonly.js
```
