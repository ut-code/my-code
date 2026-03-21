---
id: javascript-basics-practice2
title: '練習問題2: const とオブジェクトの操作'
level: 3
question:
  - constで宣言したオブジェクトのプロパティを変更・追加できるのはなぜですか？
  - 存在しないプロパティに値を代入するとどうなりますか？
---

### 練習問題2: const とオブジェクトの操作

以下のコードを完成させてください。`const` で宣言したオブジェクト `product` に対して、次の操作を行ってください。

  1. `price` プロパティを `1200` に更新する。
  2. `stock` プロパティを `5` として新たに追加する。

その後、テンプレートリテラルを使って結果を出力してください。

```js:practice2_2.js
const product = {
    name: "ボールペン",
    price: 100
};

// ここにコードを記述

console.log(`商品名: ${product.name}`);
console.log(`価格: ${product.price}円`);
console.log(`在庫: ${product.stock}個`);
```

```js-exec:practice2_2.js
商品名: ボールペン
価格: 1200円
在庫: 5個
```
