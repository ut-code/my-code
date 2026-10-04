---
id: javascript-this-bind
title: bind
level: 3
question:
  - '`bind`が「新しい関数を返す」とは、元の関数は変更されないということですか？'
  - イベントリスナーやコールバック関数としてメソッドを渡す際に、なぜ`bind`が重要になるのですか？
  - >-
    `brokenStart()`が`Cannot read property 'type' of
    undefined`というエラーになるのは、`this.type`がなぜ読めないのですか？
  - '`engine.start.bind(engine)`と書くとき、なぜ`engine`を2回書くのですか？'
term:
  - bind
---

### bind

[[`bind`]] は[[関数]]を実行せず、**[[`this`]] を固定した新しい[[関数]]**を返します。これは、イベントリスナーや[[コールバック関数]]として[[メソッド]]を渡す際に非常に重要です。

```js:bind-example.js
const engine = {
    type: "V8",
    start: function() {
        console.log(`Starting ${this.type} engine...`);
    }
};

// そのまま渡すと this が失われる（関数呼び出しになるため）
const brokenStart = engine.start;
// brokenStart(); // エラー: Cannot read property 'type' of undefined

// bind で this を engine に固定する
const fixedStart = engine.start.bind(engine);
fixedStart();
```

```js-exec:bind-example.js
Starting V8 engine...
```
