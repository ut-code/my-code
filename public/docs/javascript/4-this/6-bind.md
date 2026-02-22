---
id: javascript-this-6-bind
title: bind
level: 3
---

### bind

`bind` は関数を実行せず、**`this` を固定した新しい関数**を返します。これは、イベントリスナーやコールバック関数としてメソッドを渡す際に非常に重要です。

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
