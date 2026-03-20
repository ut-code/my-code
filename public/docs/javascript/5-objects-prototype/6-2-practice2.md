---
id: javascript-objects-prototype-practice2
title: '練習問題2: コンストラクタ関数'
level: 3
question:
  - コンストラクタ関数 `Item` の中で `this.name = name;` は何をしているのですか？
  - '`getTaxIncludedPrice` メソッドを `Item` 関数の中ではなく `Item.prototype` に追加する理由は何ですか？'
  - 税率を後から変更できるようにするにはどうすれば良いですか？
---

### 練習問題2: コンストラクタ関数

コンストラクタ関数 `Item` を作成してください。

1.  `Item` は引数 `name` と `price` を受け取り、プロパティとして保持する。
2.  `Item.prototype` に `getTaxIncludedPrice` メソッドを追加する。これは税率10%を加えた価格を返す。
3.  `new Item("Apple", 100)` でインスタンスを作成し、税込価格が110になることを確認する。

```js:practice6_2.js
```

```js-exec:practice6_2.js
```
