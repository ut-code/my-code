---
id: javascript-classes-practice2
title: '練習問題 2: 図形の継承'
level: 3
question:
  - '`info()` メソッドをオーバーライドする具体的な手順がわかりません。'
  - 親クラスの `info()` を呼び出すために `super.info()` をどのように使うのですか？
---

### 練習問題 2: 図形の継承

以下の仕様を満たす[[クラス]]を作成してください。

  * 親クラス `Shape`: [[コンストラクタ]]で `color` を受け取る。`info()` [[メソッド]]を持ち、「色: [color]」を返す。
  * 子クラス `Circle`: `Shape` を[[継承]]。[[コンストラクタ]]で `color` と `radius` (半径) を受け取る。`info()` [[メソッド]]を[[オーバーライド]]し、「[親のinfo], 半径: [radius]」を返す。
  * それぞれの[[インスタンス]]を作成し、`info()` の結果を表示する。

```js:practice7_2.js
```

```js-exec:practice7_2.js
```
