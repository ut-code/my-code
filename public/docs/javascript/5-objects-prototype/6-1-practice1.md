---
id: javascript-objects-prototype-practice1
title: '練習問題1: 基本的なプロトタイプ継承'
level: 3
question:
  - '`robot` オブジェクトの `battery` プロパティを `cleaningRobot` が利用できるのはなぜですか？'
  - '`cleaningRobot.work()` を呼び出すと、`cleaningRobot` 自身の `battery` が減るのですか？'
---

### 練習問題1: 基本的なプロトタイプ継承

`[[Object.create]]()` を使用して、以下の要件を満たすコードを書いてください。

1.  `robot` [[オブジェクト]]を作成し、`battery: 100` という[[プロパティ]]と、バッテリーを10減らして残量を表示する `work` [[メソッド]]を持たせる。
2.  `robot` を[[プロトタイプ]]とする `cleaningRobot` [[オブジェクト]]を作成する。
3.  `cleaningRobot` 自身に `type: "cleaner"` という[[プロパティ]]を追加する。
4.  `cleaningRobot.work()` を呼び出し、正しく動作（[[プロトタイプチェーン]]の利用）を確認する。

```js:practice6_1.js
```

```js-exec:practice6_1.js
```
