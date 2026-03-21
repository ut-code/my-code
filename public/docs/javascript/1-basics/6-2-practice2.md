---
id: javascript-basics-practice2
title: '練習問題2: constとオブジェクトの変更'
level: 3
question:
  - constで宣言したのにプロパティを変更できるのはなぜですか？
  - プロパティの変更と、変数への再代入の違いは何ですか？
---

### 練習問題2: constとオブジェクトの変更

`const` を使って、`name`（商品名・文字列）と `price`（価格・数値）を持つ商品オブジェクト `product` を作成してください。
次に、`price` を別の値に変更し、さらに `stock`（在庫数・数値）プロパティを新たに追加してから、`console.log()` でオブジェクトの内容を出力してみましょう。

```js:practice2_2.js
```

```js-exec:practice2_2.js
(出力例) { name: 'コーヒー', price: 550, stock: 30 }
```
