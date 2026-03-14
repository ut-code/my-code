---
id: typescript-function-types-practice2
title: '練習問題 2: データ変換のオーバーロード'
level: 3
question:
  - 練習問題2で、オーバーロードシグネチャを定義する際に特に注意すべきことは何ですか
  - stringからnumber、numberからstringへの変換には、どのような関数を使用するのが適切ですか
---

### 練習問題 2: データ変換のオーバーロード

以下の要件を満たす `convert` 関数を `function` キーワードで作成してください。

1.  引数が `number` の場合、それを `string` に変換して返す（例: `100` -\> `"100"`）。
2.  引数が `string` の場合、それを `number` に変換して返す（例: `"100"` -\> `100`）。
3.  適切なオーバーロードシグネチャを2つ定義すること。

```ts:practice4_2.ts
```
```ts-exec:practice4_2.ts
```
```js-readonly:practice4_2.js
```
