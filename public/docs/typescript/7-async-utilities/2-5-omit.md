---
id: typescript-async-utilities-omit
title: '4. Omit<T, K>: 特定のキーだけ除外する'
level: 3
question:
  - Omit<T, K>がPickの逆というのは、具体的にどういう意味ですか？
  - Product型のsecretCodeやinternalIdが「外部に出したくない情報」というのはどういうことですか？
  - データベースのモデルから特定の情報を除外してクライアントに返す、という具体的な使用例をもっと詳しく知りたいです。
  - Omitを使わない場合、どのように型定義をすれば良いのですか？
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
