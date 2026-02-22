---
id: typescript-async-utilities-8-omitt-k
title: '4. Omit<T, K>: 特定のキーだけ除外する'
level: 3
---

### 4\. Omit\<T, K\>: 特定のキーだけ除外する

`Omit<T, K>` は `Pick` の逆で、指定したプロパティを除外します。
「データベースのモデルから、機密情報や内部管理用のIDを除外してクライアントに返したい」といった場合に有用です。

```ts:utility-omit.ts
interface Product {
  id: number;
  name: string;
  price: number;
  secretCode: string; // 外部に出したくない情報
  internalId: string; // 外部に出したくない情報
}

// 外部公開用の型（secretCodeとinternalIdを除外）
type PublicProduct = Omit<Product, "secretCode" | "internalId">;

const publicItem: PublicProduct = {
  id: 1,
  name: "Mouse",
  price: 3000
};

console.log(publicItem);
```

```ts-exec:utility-omit.ts
{ id: 1, name: 'Mouse', price: 3000 }
```
```js-readonly:utility-omit.js
```
