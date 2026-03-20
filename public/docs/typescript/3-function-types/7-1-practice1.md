---
id: typescript-function-types-practice1
title: '練習問題 1: ユーザー検索関数'
level: 3
question:
  - 練習問題1を解く上で、アロー関数と型エイリアスの組み合わせで注意すべき点はありますか
  - オプショナル引数の値がundefinedの場合の処理はどのように書けば良いですか
---

### 練習問題 1: ユーザー検索関数

以下の要件を満たす `findUser` 関数をアロー関数として作成してください。

1.  引数 `id` (number) と `name` (string) を受け取る。
2.  `name` はオプショナル引数とする。
3.  戻り値は「検索中: [id] [name]」という文字列（nameがない場合は「検索中: [id] ゲスト」）とする。
4.  関数の型定義（Type Alias）を `SearchFunc` として先に定義し、それを適用すること。

```ts:practice4_1.ts
```
```ts-exec:practice4_1.ts
```
```js-readonly:practice4_1.js
```
