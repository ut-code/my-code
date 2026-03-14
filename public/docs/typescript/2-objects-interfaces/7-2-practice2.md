---
id: typescript-objects-interfaces-practice2
title: '練習問題 2: ユーザー情報の統合'
level: 3
question:
  - ネストされた型エイリアスを使用するメリットは何ですか。
  - '`Contact`型を`Employee`型の中に直接定義することはできますか。'
  - 練習問題の解答例を見たいです。
---

### 練習問題 2: ユーザー情報の統合

以下の2つの型エイリアスを定義してください。

1.  `Contact`: `email` (string) と `phone` (string) を持つ。
2.  `Employee`: `id` (number), `name` (string), `contact` (`Contact`型) を持つ。
      * つまり、`Employee` の中に `Contact` 型がネスト（入れ子）されている状態です。
3.  この `Employee` 型を使って、あなたの情報を表現する変数を作成してください。

```ts:practice3_2.ts
```
```ts-exec:practice3_2.ts
```
```js-readonly:practice3_2.js
```
