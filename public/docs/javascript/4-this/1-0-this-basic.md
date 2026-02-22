---
id: javascript-this-basic
title: "this は呼び出し方で決まる"
level: 2
---

## `this` は呼び出し方で決まる

JavaScriptにおける関数（アロー関数を除く）の `this` は、**「定義された場所」ではなく「呼び出された場所（Call Site）」**によって決定されます。

大きく分けて、以下の3つのパターンを理解すれば基本は押さえられます。

* **メソッド呼び出し:** オブジェクトのプロパティとして関数を呼び出した場合（`obj.method()`）、`this` は**ドットの左側のオブジェクト**（レシーバ）になります。これは他の言語のメンバ関数に近い挙動です。
* **関数呼び出し:** 関数を単体で呼び出した場合（`func()`）、`this` は**グローバルオブジェクト**（ブラウザでは `window`、Node.jsでは `global`）になります。
ただし、**Strict Mode（`"use strict"`）**では、安全のため `undefined` になります。
* **コンストラクタ呼び出し:** `new` キーワードをつけて呼び出した場合、`this` は**新しく生成されたインスタンス**になります（これは第6章、第7章で詳しく扱います）。

以下のコードで、同じ関数でも呼び出し方によって `this` が変わる様子を確認しましょう。

```js:dynamic-this.js
"use strict"; // Strict Modeを有効化

function showThis() {
    console.log(`this is: ${this}`);
}

const person = {
    name: "Alice",
    show: showThis,
    toString: function() { return this.name; } // コンソール出力用に設定
};

// 1. メソッド呼び出し
console.log("--- Method Call ---");
person.show(); 

// 2. 関数呼び出し（変数に代入してから実行）
console.log("--- Function Call ---");
const standaloneShow = person.show;
standaloneShow(); 
```

```js-exec:dynamic-this.js
--- Method Call ---
this is: Alice
--- Function Call ---
this is: undefined
```

> **ポイント:** `person.show` を `standaloneShow` に代入した時点で、オブジェクトとの結びつきは失われます。そのため、`standaloneShow()` と実行すると「関数呼び出し」扱いとなり、`this` は `undefined`（非Strict Modeならグローバルオブジェクト）になります。これが「`this` が消える」現象の正体です。
