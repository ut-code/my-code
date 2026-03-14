---
id: typescript-async-utilities-pick
title: '3. Pick<T, K>: 特定のキーだけ抜き出す'
level: 3
question:
  - Pick<T, K>のKに指定するid | name | priceの|は何ですか？
  - ProductPreview型のitem変数にdescriptionを含めるとエラーになるのはなぜですか？
  - 特定のキーだけを抜き出すメリットは何ですか？
  - Pickを使わない場合、同じような型を作るにはどうすればいいですか？
---

### 3\. Pick\<T, K\>: 特定のキーだけ抜き出す

`Pick<T, K>` は、型 `T` から `K` で指定したプロパティのみを抽出して新しい型を作ります。
「ユーザー情報全体から、表示用の名前と画像URLだけ欲しい」といった場合に使います。

```ts:utility-pick.ts
interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  stock: number;
}

// 商品一覧表示用に、IDと名前と価格だけが必要な型を作る
type ProductPreview = Pick<Product, "id" | "name" | "price">;

const item: ProductPreview = {
  id: 1,
  name: "Laptop",
  price: 120000,
  // description: "..." // エラー: ProductPreviewにはdescriptionは存在しません
};

console.log(item);
```

```ts-exec:utility-pick.ts
{ id: 1, name: 'Laptop', price: 120000 }
```
```js-readonly:utility-pick.js
```
