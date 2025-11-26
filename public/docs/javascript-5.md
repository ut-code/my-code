# 第5章: 'this'の正体

JavaScriptの学習、お疲れ様です。他の言語（Java, C\#, Pythonなど）の経験がある方にとって、JavaScriptの `this` は最も直感に反し、バグの温床となりやすい機能の一つです。

多くの言語において `this`（または `self`）は「そのクラスのインスタンス」を指す静的なものですが、**JavaScriptの `this` は「関数がどのように呼ばれたか」によって動的に変化します。**

この章では、その複雑な挙動を解き明かし、自在にコントロールする方法を学びます。

## 1\. 'this' は呼び出し方で決まる

JavaScriptにおける関数（アロー関数を除く）の `this` は、**「定義された場所」ではなく「呼び出された場所（Call Site）」**によって決定されます。

大きく分けて、以下の3つのパターンを理解すれば基本は押さえられます。

### パターンA: メソッド呼び出し

オブジェクトのプロパティとして関数を呼び出した場合（`obj.method()`）、`this` は**ドットの左側のオブジェクト**（レシーバ）になります。これは他の言語のメンバ関数に近い挙動です。

### パターンB: 関数呼び出し

関数を単体で呼び出した場合（`func()`）、`this` は**グローバルオブジェクト**（ブラウザでは `window`、Node.jsでは `global`）になります。
ただし、**Strict Mode（`"use strict"`）**では、安全のため `undefined` になります。

### パターンC: コンストラクタ呼び出し

`new` キーワードをつけて呼び出した場合、`this` は**新しく生成されたインスタンス**になります（これは第6章、第7章で詳しく扱います）。

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

## 2\. 'this' を固定する: bind, call, apply

「関数呼び出し」でも特定のオブジェクトを `this` として扱いたい場合があります。JavaScriptには、`this` を明示的に指定（束縛）するためのメソッドが3つ用意されています。

### call と apply

これらは関数を**即座に実行**します。第一引数に `this` としたいオブジェクトを渡します。

  * `call(thisArg, arg1, arg2, ...)`: 引数をカンマ区切りで渡す。
  * `apply(thisArg, [argsArray])`: 引数を配列として渡す。

```js-repl:1
> function greet(greeting, punctuation) { return `${greeting}, ${this.name}${punctuation}`; }
undefined
> const user = { name: "Bob" };
undefined
> // callの使用例
> greet.call(user, "Hello", "!");
'Hello, Bob!'
> // applyの使用例
> greet.apply(user, ["Hi", "?"]);
'Hi, Bob?'
```

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

## 3\. アロー関数と 'this'

ES2015 (ES6) で導入されたアロー関数は、これまで説明したルールとは全く異なる挙動をします。

アロー関数には**独自の `this` が存在しません**。アロー関数内部の `this` は、**その関数が定義されたスコープ（レキシカルスコープ）の `this`** をそのまま参照します。

これは、「コールバック関数内で `this` が変わってしまう問題」を解決するのに最適です。

### 従来の関数 vs アロー関数

`setTimeout` などのコールバック内でメソッドを使いたい場面を比較してみましょう。

```js:arrow-vs-function.js
class Timer {
    constructor() {
        this.seconds = 0;
    }

    // 従来の方法: 失敗例
    startLegacy() {
        setTimeout(function() {
            // ここでの this はグローバルまたはundefined（setTimeoutの仕様）
            // そのため this.seconds にアクセスできずNaNなどになる
            try {
                this.seconds++; 
                console.log("Legacy:", this.seconds);
            } catch (e) {
                console.log("Legacy: Error -", e.message);
            }
        }, 100);
    }

    // アロー関数: 成功例
    startModern() {
        setTimeout(() => {
            // アロー関数は定義時のスコープ（startModern内のthis = インスタンス）を捕獲する
            this.seconds++;
            console.log("Modern:", this.seconds);
        }, 100);
    }
}

const timer = new Timer();
timer.startLegacy();
timer.startModern();
```

```js-exec:arrow-vs-function.js
Legacy: Error - Cannot read properties of undefined (reading 'seconds')
Modern: 1
```

> **注意:** アロー関数は便利な反面、`this` を動的に変更することができません（`call` や `bind` を使っても無視されます）。そのため、動的なコンテキストが必要な場合（例：オブジェクトのメソッド定義そのものや、ライブラリ等で `this` を注入される場合）には通常の関数式を使います。

# この章のまとめ

JavaScriptの `this` は、他の静的な言語とは異なり「呼び出し時」に解決されます。

1.  **メソッド呼び出し (`obj.method()`)**: `this` は `obj`。
2.  **関数呼び出し (`func()`)**: `this` は `undefined` (Strict Mode) またはグローバルオブジェクト。
3.  **明示的な指定**: `call`, `apply` で一時的に、`bind` で永続的に `this` を指定可能。
4.  **アロー関数**: 独自の `this` を持たず、外側のスコープの `this` をそのまま使う（レキシカルスコープ）。

次の章では、この `this` を活用してオブジェクト指向プログラミングの核心である「オブジェクトとプロトタイプ」について学びます。

# 練習問題1: 失われたコンテキストの修復

以下のコードは、ボタンクリック時（ここではシミュレーション）にユーザー名を表示しようとしていますが、エラーになります。

1.  `bind` を使って修正してください。
2.  `greet` メソッド自体をアロー関数に変更するアプローチではなく、呼び出し側を修正する形で解答してください。

```js:practice5_1.js
const user = {
    name: "Tanaka",
    greet: function() {
        console.log(`Hello, ${this.name}`);
    }
};

// クリックイベントのシミュレーター（変更不可）
function simulateClick(callback) {
    // 内部で単なる関数呼び出しとして実行される
    callback(); 
}

// --- 以下を修正してください ---
simulateClick(user.greet); 
```

```js-exec:practice5_1.js
```

### 問題2: アロー関数の特性

以下の `calculator` オブジェクトにはバグがあります。`multiply` メソッドが正しい結果（配列の各要素を `factor` 倍する）を返すように修正してください。
ヒント：`map` の中のコールバック関数に注目してください。

```js:practice5_2.js
const calculator = {
    factor: 2,
    numbers: [1, 2, 3],
    multiply: function() {
        return this.numbers.map(function(n) {
            // ここで this.factor が読めない！
            return n * this.factor;
        });
    }
};

try {
    console.log(calculator.multiply());
} catch(e) {
    console.log("Error:", e.message);
}
```

```js-exec:practice5_2.js
```
