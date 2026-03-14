---
id: typescript-classes-practice2
title: '練習問題 2: 図形クラスの継承'
level: 3
question:
  - インターフェースの書き方を忘れてしまいました。思い出させてください。
  - AreaCalculator インターフェースを実装するとは具体的にどういうことですか？
  - Rectangle クラスのプロパティをコンストラクタの省略記法で書けますか？
  - calculateArea メソッドで、引数として幅や高さを渡す必要はありませんか？
  - この問題を解く上で、implements 以外に重要なTypeScriptの機能はありますか？
---

### 練習問題 2: 図形クラスの継承

以下の要件でコードを書いてください。

1.  **インターフェース `AreaCalculator`**: `calculateArea(): number` メソッドを持つ。
2.  **クラス `Rectangle`**: `AreaCalculator` を実装(`implements`)する。
      * プロパティ: `width` (number), `height` (number)
      * メソッド: `calculateArea` を実装して面積を返す。
3.  `Rectangle` のインスタンスを作成し、面積をコンソールに出力してください。

```ts:practice7_2.ts
```
```ts-exec:practice7_2.ts
```
```js-readonly:practice7_2.js
```
