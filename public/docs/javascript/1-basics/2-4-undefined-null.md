---
id: javascript-basics-undefined-null
title: undefined と null
level: 3
question:
  - undefinedとnullは、どう使い分けるのが良いですか？
  - 変数を宣言しただけの状態がundefinedになるのはなぜですか？
  - '`typeof null` が `''object''` になるのは本当に正しいのですか？'
---

### undefined と null

他言語経験者が最初に混乱しやすいのが、この `undefined` と `null` の違いです。

- **undefined**: JavaScriptエンジンが「値がまだない」ことを示すときに現れます（例: 宣言だけして代入していない変数）。
- **null**: プログラマが「ここには値がない」と明示したいときに代入します。

```js-repl
> let unassigned;
undefined
> unassigned
undefined
> let empty = null;
undefined
> typeof unassigned
'undefined'
> typeof empty
'object'
```

`typeof null` が `'object'` になるのは、JavaScript初期から残っている歴史的な仕様です。`null` 自体はオブジェクトではなく、プリミティブ型の値です。
