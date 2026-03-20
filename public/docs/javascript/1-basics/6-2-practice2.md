---
id: javascript-basics-practice2
title: '練習問題2: オブジェクトの操作と参照'
level: 3
question:
  - なぜ `newList = originalList` だと `originalList` も変更されてしまうのですか？
  - 「参照コピー」とはどういう状態ですか？
  - スプレッド構文 `...` を使って、この問題をどう解決すれば良いですか？
  - 配列をコピーする他の方法はありますか？
---

### 練習問題2: オブジェクトの操作と参照

以下のコードにはバグ（意図しない挙動）があります。
`originalList` の内容を保持したまま、新しい要素を追加した `newList` を作成したいのですが、現状では `originalList` も変更されてしまいます。
スプレッド構文 `...` などを使い、`originalList` を変更せずに `newList` を作成するように修正してください。

```js:practice2_2.js
const originalList = ["Apple", "Banana"];

// 参照コピーになっているため originalList も変わってしまう
const newList = originalList;
newList.push("Orange");

console.log("Original:", originalList); // ["Apple", "Banana"] と出力させたい
console.log("New:", newList);           // ["Apple", "Banana", "Orange"] と出力させたい
```

```js-exec:practice2_2.js
```
