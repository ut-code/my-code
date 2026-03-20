---
id: typescript-async-utilities-practice1
title: '練習問題1: 非同期データの取得'
level: 3
question:
  - Postインターフェースの定義方法を忘れてしまいました。
  - fetchPost関数の戻り値の型Promise<Post>をどのように書けばよいですか？
  - async関数内でPromiseを使わずに、直接オブジェクトを返す場合はどうなりますか？
---

### 練習問題1: 非同期データの取得

1.  `Post` というインターフェースを定義してください（`id: number`, `title: string`, `body: string`）。
2.  `fetchPost` という `async` 関数を作成してください。この関数は引数に `id` (number) を受け取り、戻り値として `Promise<Post>` を返します。
3.  関数内部では、引数で受け取ったデータをそのまま含むオブジェクトを返してください（`setTimeout`などは不要です）。
4.  作成した関数を実行し、結果をコンソールに表示してください。

```ts:practice8_1.ts
```
```ts-exec:practice8_1.ts
```
```js-readonly:practice8_1.js
```
